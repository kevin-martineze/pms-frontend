import type { Metadata } from "next";
import { lang } from "next/root-params";

import { StatCard } from "@/components/admin/stat-card";
import { TapeChart, type TapeRow } from "@/components/admin/tape-chart";
import { getBookings, getUnits, getUnitTypes } from "@/lib/api/server";
import { getSession } from "@/lib/auth/server-session";
import { toReservation } from "@/lib/bookings/mapper";
import { inHouseOn, occupancyOn } from "@/lib/bookings/queries";
import { addDays, toIsoDate } from "@/lib/format";
import { getDictionary, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.calendar };
}

export default async function CalendarPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);

  const session = await getSession();
  if (!session) return null; // El layout ya mostró el login; esto es sólo para el tipo.

  const today = toIsoDate(new Date());
  const windowStart = addDays(today, -21);
  const windowEnd = addDays(today, 49);

  const [units, unitTypes, bookings] = await Promise.all([
    getUnits(session),
    getUnitTypes(session),
    getBookings(session, { from: windowStart, to: windowEnd }),
  ]);

  const typeName = new Map(unitTypes.map((type) => [type.id, type.name]));
  const reservations = bookings.map(toReservation);

  const rows: TapeRow[] = units.map((unit) => ({
    room: unit.label,
    unitName: typeName.get(unit.unitTypeId) ?? "",
    /* Fuera de servicio es un hecho de la unidad, no algo derivado del
       calendario: una habitación en mantenimiento no se vende aunque esté
       libre. */
    blocked: !unit.active,
    reservations: reservations.filter(
      (r) => r.room === unit.label && r.status !== "cancelled",
    ),
  }));

  const next7 = Array.from({ length: 7 }, (_, i) =>
    occupancyOn(reservations, addDays(today, i), units.length),
  );
  const avgNext7 = next7.reduce((a, b) => a + b, 0) / next7.length;

  const openNights = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i);
    return units.length - inHouseOn(reservations, date).length;
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
          hint={t.admin.calendar.openNightsHint(units.length * 14)}
          tone={openNights > units.length * 6 ? "warning" : "neutral"}
        />
        <StatCard
          label={t.admin.calendar.keys}
          value={String(units.length)}
          hint={t.admin.calendar.keysHint}
        />
      </div>

      <div className="mt-6">
        <TapeChart rows={rows} windowStart={windowStart} windowEnd={windowEnd} today={today} />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t.admin.calendar.hint}</p>
    </div>
  );
}
