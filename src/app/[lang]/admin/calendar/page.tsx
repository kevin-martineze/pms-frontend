import type { Metadata } from "next";
import { lang } from "next/root-params";

import { StatCard } from "@/components/admin/stat-card";
import { TapeChart, type TapeRow } from "@/components/admin/tape-chart";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { unitName } from "@/lib/i18n/content";
import { allRooms, unitById } from "@/lib/mock/property";
import {
  TODAY,
  WINDOW_END,
  WINDOW_START,
  inHouseOn,
  occupancyOn,
  reservations,
} from "@/lib/mock/reservations";
import { addDays } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.calendar };
}

export default async function CalendarPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);

  const rows: TapeRow[] = allRooms.map(({ room, unitId }) => {
    const unit = unitById.get(unitId);
    return {
      room,
      unitName: unit ? unitName(unit, locale) : "",
      /* La 205 está fuera de servicio por cambio de aire acondicionado. Es un
         hecho independiente del calendario, no algo derivado de las reservas. */
      blocked: room === "205",
      reservations: reservations.filter(
        (r) => r.room === room && r.status !== "cancelled" && r.range.checkOut > WINDOW_START,
      ),
    };
  });

  const next7 = Array.from({ length: 7 }, (_, i) => occupancyOn(addDays(TODAY, i)));
  const avgNext7 = next7.reduce((a, b) => a + b, 0) / next7.length;

  const openNights = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(TODAY, i);
    return allRooms.length - inHouseOn(date).length;
  }).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">{t.admin.calendar.eyebrow}</p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.calendar.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.calendar.lead}</p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label={t.admin.calendar.occupancyNextWeek}
          value={`${Math.round(avgNext7 * 100)}%`}
          hint={t.admin.calendar.occupancyNextWeekHint}
        />
        <StatCard
          label={t.admin.calendar.openNights}
          value={String(openNights)}
          hint={t.admin.calendar.openNightsHint(allRooms.length * 14)}
          tone={openNights > allRooms.length * 6 ? "warning" : "neutral"}
        />
        <StatCard
          label={t.admin.calendar.keys}
          value={String(allRooms.length)}
          hint={t.admin.calendar.keysHint}
        />
      </div>

      <div className="mt-6">
        <TapeChart rows={rows} windowStart={WINDOW_START} windowEnd={WINDOW_END} today={TODAY} />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t.admin.calendar.hint}</p>
    </div>
  );
}
