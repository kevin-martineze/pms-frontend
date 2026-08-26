import { lang } from "next/root-params";
import {
  ArrowRight,
  BedDouble,
  BrushCleaning,
  DollarSign,
  Percent,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChannelMix, OccupancyStrip } from "@/components/admin/charts";
import { ROOM_STATE_CLASS } from "@/components/admin/labels";
import { StatCard } from "@/components/admin/stat-card";
import { TodayLists } from "@/components/admin/today-lists";
import { LocaleLink } from "@/components/locale-link";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { housekeepingToday } from "@/lib/mock/operations";
import {
  TODAY,
  adrOn,
  arrivalsOn,
  channelMix,
  departuresOn,
  inHouseOn,
  occupancyOn,
  revenueBetween,
  revparOn,
} from "@/lib/mock/reservations";
import { addDays, formatDate, formatWeekday } from "@/lib/format";
import { allRooms } from "@/lib/mock/property";
import type { RoomState } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const arrivals = arrivalsOn(TODAY);
  const departures = departuresOn(TODAY);
  const inHouse = inHouseOn(TODAY);

  const occupancy = occupancyOn(TODAY);
  const lastWeekOccupancy = occupancyOn(addDays(TODAY, -7));
  const adr = adrOn(TODAY);
  const revpar = revparOn(TODAY);

  const monthRevenue = revenueBetween(addDays(TODAY, -29), addDays(TODAY, 1));
  const pendingBalance = inHouse.reduce((acc, r) => acc + r.balance.amountMinor, 0) / 100;

  const strip = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(TODAY, i - 3);
    return {
      date,
      occupancy: occupancyOn(date),
      sold: inHouseOn(date).length,
      total: allRooms.length,
    };
  });

  const mix = channelMix(addDays(TODAY, -29), addDays(TODAY, 1)).map((row) => ({
    channel: row.channel,
    label: t.admin.channelsShort[row.channel],
    nights: row.nights,
    revenue: row.revenue,
    isDirect: row.channel === "direct" || row.channel === "phone" || row.channel === "walk-in",
  }));

  const tasks = housekeepingToday();
  const byState = new Map<RoomState, number>();
  for (const task of tasks) byState.set(task.state, (byState.get(task.state) ?? 0) + 1);
  const toClean = tasks.filter((t) => t.state === "departing" || t.state === "vacant-dirty").length;

  const nf = new Intl.NumberFormat(tag);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">
            {formatWeekday(TODAY, tag)} · {formatDate(TODAY, tag)}
          </p>
          <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.dashboard.title}</h1>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <LocaleLink href="/admin/calendar">
            {t.admin.dashboard.openCalendar}
            <ArrowRight className="size-4" aria-hidden />
          </LocaleLink>
        </Button>
      </header>

      {/* --- Indicadores ---------------------------------------------------- */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.admin.dashboard.occupancy}
          value={`${Math.round(occupancy * 100)}%`}
          hint={t.admin.dashboard.occupancyHint(inHouse.length, allRooms.length)}
          delta={{
            value: `${Math.abs(Math.round((occupancy - lastWeekOccupancy) * 100))} pts`,
            direction:
              occupancy > lastWeekOccupancy ? "up" : occupancy < lastWeekOccupancy ? "down" : "flat",
          }}
          icon={<Percent className="size-4" aria-hidden />}
        />
        <StatCard
          label={t.admin.dashboard.adr}
          value={`$${Math.round(adr)}`}
          hint={t.admin.dashboard.adrHint}
          icon={<DollarSign className="size-4" aria-hidden />}
        />
        <StatCard
          label={t.admin.dashboard.revpar}
          value={`$${Math.round(revpar)}`}
          hint={t.admin.dashboard.revparHint}
          icon={<TrendingUp className="size-4" aria-hidden />}
        />
        <StatCard
          label={t.admin.dashboard.revenue30}
          value={`$${nf.format(Math.round(monthRevenue))}`}
          hint={t.admin.dashboard.revenue30Hint}
          icon={<BedDouble className="size-4" aria-hidden />}
        />
      </div>

      {/* --- Llegadas y salidas --------------------------------------------- */}
      <div className="mt-6">
        <TodayLists arrivals={arrivals} departures={departures} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* --- Ocupación ---------------------------------------------------- */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium">{t.admin.dashboard.occupancyTitle}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin.dashboard.occupancySub}</p>
          <div className="mt-5">
            <OccupancyStrip data={strip} today={TODAY} />
          </div>
        </section>

        {/* --- Canales ------------------------------------------------------ */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium">{t.admin.dashboard.channelsTitle}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin.dashboard.channelsSub}</p>
          <div className="mt-5">
            <ChannelMix rows={mix} />
          </div>

          <p className="mt-5 rounded-lg bg-secondary/70 p-3 text-xs leading-relaxed text-muted-foreground">
            {t.admin.dashboard.channelsNote}
          </p>
        </section>
      </div>

      {/* --- Estado de habitaciones ----------------------------------------- */}
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">{t.admin.dashboard.keysTitle}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {toClean === 0
                ? t.admin.dashboard.keysNothing
                : t.admin.dashboard.keysPending(toClean)}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <LocaleLink href="/admin/housekeeping">
              <BrushCleaning className="size-4" aria-hidden />
              {t.admin.dashboard.goHousekeeping}
            </LocaleLink>
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {tasks.map((task) => (
            <span
              key={task.room}
              className={cn(
                "tnum relative rounded-lg border px-2.5 py-1.5 text-xs font-medium",
                ROOM_STATE_CLASS[task.state],
                /* Bloqueada se distingue por trama, no sólo por gris: el color
                   por sí solo no puede ser el único portador del estado. */
                task.state === "blocked" &&
                  "bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,var(--muted)_4px,var(--muted)_8px)]",
              )}
              title={`${task.room} — ${t.admin.roomState[task.state]}`}
            >
              {task.room}
              <span className="sr-only"> — {t.admin.roomState[task.state]}</span>
            </span>
          ))}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {([...byState.entries()] as [RoomState, number][]).map(([state, count]) => (
            <li key={state} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-sm border", ROOM_STATE_CLASS[state])} aria-hidden />
              {t.admin.roomState[state]}
              <span className="tnum font-medium text-foreground">{count}</span>
            </li>
          ))}
        </ul>
      </section>

      {pendingBalance > 0 && (
        <p className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-status-departing/25 bg-status-departing/8 px-4 py-3 text-sm">
          <Badge variant="outline" className="border-status-departing/40 text-status-departing">
            {t.admin.dashboard.toCollect}
          </Badge>
          <span className="tnum">
            {t.admin.dashboard.toCollectBody(`$${nf.format(Math.round(pendingBalance))}`)}
          </span>
          <LocaleLink
            href="/admin/reservations?payment=unpaid"
            className="ml-auto text-sm font-medium underline underline-offset-4"
          >
            {t.admin.dashboard.seeWho}
          </LocaleLink>
        </p>
      )}
    </div>
  );
}
