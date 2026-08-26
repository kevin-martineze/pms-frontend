import Link from "next/link";
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
import { CHANNEL_SHORT } from "@/components/admin/labels";
import { StatCard } from "@/components/admin/stat-card";
import { TodayLists } from "@/components/admin/today-lists";
import {
  ROOM_STATE_CLASS,
  ROOM_STATE_LABEL,
  housekeepingToday,
} from "@/lib/mock/operations";
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

export default function AdminDashboard() {
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
    label: CHANNEL_SHORT[row.channel],
    nights: row.nights,
    revenue: row.revenue,
    isDirect: row.channel === "direct" || row.channel === "phone" || row.channel === "walk-in",
  }));

  const tasks = housekeepingToday();
  const byState = new Map<RoomState, number>();
  for (const task of tasks) byState.set(task.state, (byState.get(task.state) ?? 0) + 1);
  const toClean = tasks.filter((t) => t.state === "departing" || t.state === "vacant-dirty").length;

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">
            {formatWeekday(TODAY)} · {formatDate(TODAY)}
          </p>
          <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">Hoy en el hotel</h1>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/admin/calendar">
            Abrir el calendario
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </header>

      {/* --- Indicadores ---------------------------------------------------- */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ocupación"
          value={`${Math.round(occupancy * 100)}%`}
          hint={`${inHouse.length} de ${allRooms.length} llaves`}
          delta={{
            value: `${Math.abs(Math.round((occupancy - lastWeekOccupancy) * 100))} pts`,
            direction:
              occupancy > lastWeekOccupancy ? "up" : occupancy < lastWeekOccupancy ? "down" : "flat",
          }}
          icon={<Percent className="size-4" aria-hidden />}
        />
        <StatCard
          label="Tarifa media (ADR)"
          value={`$${Math.round(adr)}`}
          hint="por habitación vendida"
          icon={<DollarSign className="size-4" aria-hidden />}
        />
        <StatCard
          label="RevPAR"
          value={`$${Math.round(revpar)}`}
          hint="por habitación disponible"
          icon={<TrendingUp className="size-4" aria-hidden />}
        />
        <StatCard
          label="Ingresos 30 días"
          value={`$${Math.round(monthRevenue).toLocaleString("es-PA")}`}
          hint="alojamiento, sin restaurante"
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium">Ocupación de las próximas dos semanas</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Tres días atrás y once adelante. La barra amarilla es hoy.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <OccupancyStrip data={strip} today={TODAY} />
          </div>
        </section>

        {/* --- Canales ------------------------------------------------------ */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium">De dónde vinieron las reservas</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Últimos 30 días, por ingreso. Lo que entra por canales propios no paga comisión.
          </p>
          <div className="mt-5">
            <ChannelMix rows={mix} />
          </div>

          <p className="mt-5 rounded-lg bg-secondary/70 p-3 text-xs leading-relaxed text-muted-foreground">
            Cada punto que se mueve de Booking al sitio propio son ~17 centavos de cada dólar
            que se quedan en la casa. Es el número que esta pantalla existe para mover.
          </p>
        </section>
      </div>

      {/* --- Estado de habitaciones ----------------------------------------- */}
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Estado de las llaves</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {toClean === 0
                ? "Nada pendiente de limpieza."
                : `${toClean} ${toClean === 1 ? "habitación pendiente" : "habitaciones pendientes"} de limpieza.`}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/admin/housekeeping">
              <BrushCleaning className="size-4" aria-hidden />
              Ir a camarería
            </Link>
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
              title={`${task.room} — ${ROOM_STATE_LABEL[task.state]}`}
            >
              {task.room}
              <span className="sr-only"> — {ROOM_STATE_LABEL[task.state]}</span>
            </span>
          ))}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {([...byState.entries()] as [RoomState, number][]).map(([state, count]) => (
            <li key={state} className="flex items-center gap-1.5">
              <span
                className={cn("size-2.5 rounded-sm border", ROOM_STATE_CLASS[state])}
                aria-hidden
              />
              {ROOM_STATE_LABEL[state]}
              <span className="tnum font-medium text-foreground">{count}</span>
            </li>
          ))}
        </ul>
      </section>

      {pendingBalance > 0 && (
        <p className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-status-departing/25 bg-status-departing/8 px-4 py-3 text-sm">
          <Badge variant="outline" className="border-status-departing/40 text-status-departing">
            Por cobrar
          </Badge>
          <span className="tnum">
            ${Math.round(pendingBalance).toLocaleString("es-PA")} pendientes entre los huéspedes que
            están en casa.
          </span>
          <Link
            href="/admin/reservations?payment=unpaid"
            className="ml-auto text-sm font-medium underline underline-offset-4"
          >
            Ver quiénes
          </Link>
        </p>
      )}
    </div>
  );
}
