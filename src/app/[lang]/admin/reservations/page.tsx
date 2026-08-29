import { Suspense } from "react";
import type { Metadata } from "next";
import { lang } from "next/root-params";

import { Skeleton } from "@/components/ui/skeleton";
import { NewBookingDialog } from "@/components/admin/new-booking-dialog";
import { ReservationFilters } from "@/components/admin/reservation-filters";
import { ReservationsTable } from "@/components/admin/reservations-table";
import { StatCard } from "@/components/admin/stat-card";
import { getBookings, getUnitTypes } from "@/lib/api/server";
import { NoAccess } from "@/components/admin/no-access";
import { canAccess } from "@/lib/auth/access";
import { getSession } from "@/lib/auth/server-session";
import { toReservation } from "@/lib/bookings/mapper";
import { toIsoDate } from "@/lib/format";
import { getDictionary, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.reservations };
}

type Search = { q?: string; status?: string };

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);

  const session = await getSession();
  if (!session) return null;

  if (!canAccess(session.role, "reservations")) {
    return <NoAccess t={t} section={t.admin.nav.reservations} />;
  }

  const [bookings, unitTypes] = await Promise.all([
    getBookings(session),
    getUnitTypes(session),
  ]);

  const typeName = new Map(unitTypes.map((type) => [type.id, type.name]));
  const today = toIsoDate(new Date());
  const query = (params.q ?? "").trim().toLowerCase();

  const filtered = bookings
    .map(toReservation)
    .filter((r) => {
      if (params.status && r.status !== params.status) return false;
      if (query) {
        const haystack =
          `${r.guest.name} ${r.reference} ${r.room ?? ""} ${r.guest.email}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    })
    /* Las que llegan primero, primero. Una lista de reservas ordenada por fecha
       de creación es un log; ordenada por llegada es una agenda. */
    .sort((a, b) => a.range.checkIn.localeCompare(b.range.checkIn));

  /* "Por llegar" cuenta estadías que de verdad van a llegar: una cancelada o un
     no-show tienen fecha futura pero nadie aparece por la puerta, y contarlas
     infla la previsión de ocupación de la semana. */
  const upcoming = filtered.filter(
    (r) => r.range.checkIn >= today && r.status !== "cancelled" && r.status !== "no-show",
  ).length;
  const inHouse = filtered.filter((r) => r.status === "in-house").length;

  /* Las tarjetas de "adeudado" y "comisión" y las columnas de pago y canal no
     están: dependen del módulo de pagos y del desglose por OTA, que todavía no
     existen en el backend. Volverán con datos de verdad detrás. */
  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">{t.admin.reservations.eyebrow}</p>
          <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.reservations.title}</h1>
        </div>
        <NewBookingDialog
          unitTypes={unitTypes.map((type) => ({
            id: type.id,
            name: type.name,
            maxGuests: type.maxGuests,
            basePriceMinor: type.basePriceMinor,
          }))}
        />
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label={t.admin.reservations.upcoming}
          value={String(upcoming)}
          hint={t.admin.reservations.upcomingHint}
        />
        <StatCard
          label={t.admin.reservations.inHouse}
          value={String(inHouse)}
          hint={t.admin.reservations.inHouseHint}
        />
        <StatCard
          label={t.admin.reservations.total}
          value={String(filtered.length)}
          hint={t.admin.reservations.totalHint}
        />
      </div>

      <div className="mt-6">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <ReservationFilters total={filtered.length} />
        </Suspense>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <ReservationsTable
            reservations={filtered}
            typeNames={Object.fromEntries(
              filtered.map((r) => [r.unitId, typeName.get(r.unitId) ?? ""]),
            )}
            limit={80}
          />
        </div>
      </div>

      {filtered.length > 80 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {t.admin.reservations.truncated(80, filtered.length)}
        </p>
      )}
    </div>
  );
}
