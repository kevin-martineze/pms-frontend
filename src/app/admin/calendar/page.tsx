import type { Metadata } from "next";

import { StatCard } from "@/components/admin/stat-card";
import { TapeChart, type TapeRow } from "@/components/admin/tape-chart";
import { allRooms } from "@/lib/mock/property";
import {
  TODAY,
  WINDOW_END,
  WINDOW_START,
  inHouseOn,
  occupancyOn,
  reservations,
} from "@/lib/mock/reservations";
import { addDays } from "@/lib/format";

export const metadata: Metadata = { title: "Calendario" };

export default function CalendarPage() {
  const rows: TapeRow[] = allRooms.map(({ room, unitName }) => ({
    room,
    unitName,
    /* La 205 está fuera de servicio por cambio de aire acondicionado. Es un
       hecho independiente del calendario, no algo derivado de las reservas. */
    blocked: room === "205",
    reservations: reservations.filter(
      (r) => r.room === room && r.status !== "cancelled" && r.range.checkOut > WINDOW_START,
    ),
  }));

  const next7 = Array.from({ length: 7 }, (_, i) => occupancyOn(addDays(TODAY, i)));
  const avgNext7 = next7.reduce((a, b) => a + b, 0) / next7.length;

  const openNights = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(TODAY, i);
    return allRooms.length - inHouseOn(date).length;
  }).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">Vista de operación</p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">Calendario de habitaciones</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Una fila por llave, una columna por noche. Cada barra ocupa exactamente las noches que
          pagó el huésped — el día de salida queda libre desde las 11:00, así que la barra termina
          a mitad de esa celda.
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Ocupación próxima semana"
          value={`${Math.round(avgNext7 * 100)}%`}
          hint="promedio de 7 noches"
        />
        <StatCard
          label="Noches libres en 14 días"
          value={String(openNights)}
          hint={`de ${allRooms.length * 14} posibles`}
          tone={openNights > allRooms.length * 6 ? "warning" : "neutral"}
        />
        <StatCard label="Llaves en inventario" value={String(allRooms.length)} hint="hotel y casas" />
      </div>

      <div className="mt-6">
        <TapeChart rows={rows} windowStart={WINDOW_START} windowEnd={WINDOW_END} today={TODAY} />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Toca cualquier barra para abrir la reserva. Arrastra la cinta o usa las flechas para
        moverte entre semanas.
      </p>
    </div>
  );
}
