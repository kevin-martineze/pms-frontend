import type { IsoDate, Reservation, ReservationStatus } from "@/lib/domain/types";
import { addDays } from "@/lib/format";

/**
 * Consultas sobre un conjunto de reservas.
 *
 * Son las mismas que vivían en `@/lib/mock/reservations`, extraídas para
 * recibir el array por parámetro en vez de cerrar sobre los datos de
 * demostración. La lógica no cambió: "ocupación es llaves vendidas sobre
 * llaves disponibles, no cantidad de reservas" es una regla del negocio, y
 * vale igual con datos reales.
 */

const LIVE: ReservationStatus[] = ["confirmed", "in-house", "pending"];

export function arrivalsOn(reservations: Reservation[], date: IsoDate): Reservation[] {
  return reservations.filter((r) => r.range.checkIn === date && LIVE.includes(r.status));
}

export function departuresOn(reservations: Reservation[], date: IsoDate): Reservation[] {
  return reservations.filter(
    (r) => r.range.checkOut === date && (r.status === "in-house" || r.status === "checked-out"),
  );
}

export function inHouseOn(reservations: Reservation[], date: IsoDate): Reservation[] {
  return reservations.filter(
    (r) =>
      r.range.checkIn <= date &&
      r.range.checkOut > date &&
      (r.status === "in-house" || r.status === "checked-out" || r.status === "confirmed"),
  );
}

/**
 * Ocupación como habitaciones vendidas sobre habitaciones disponibles. No es el
 * número de reservas: una casa de tres cuartos es una llave, no tres.
 */
export function occupancyOn(
  reservations: Reservation[],
  date: IsoDate,
  totalRooms: number,
): number {
  if (totalRooms === 0) return 0;
  return inHouseOn(reservations, date).length / totalRooms;
}

/** ADR — tarifa media diaria sobre las habitaciones efectivamente vendidas. */
export function adrOn(reservations: Reservation[], date: IsoDate): number {
  const stays = inHouseOn(reservations, date);
  if (stays.length === 0) return 0;
  const sum = stays.reduce((acc, r) => acc + r.total.amountMinor / r.nights, 0);
  return sum / stays.length / 100;
}

/** RevPAR — ingreso por habitación disponible. Ocupación y ADR en un número. */
export function revparOn(
  reservations: Reservation[],
  date: IsoDate,
  totalRooms: number,
): number {
  return adrOn(reservations, date) * occupancyOn(reservations, date, totalRooms);
}

/** Ingreso devengado por noche dentro de la ventana, prorrateando cada estadía. */
export function revenueBetween(
  reservations: Reservation[],
  from: IsoDate,
  to: IsoDate,
): number {
  let total = 0;
  for (const r of reservations) {
    if (r.status === "cancelled" || r.status === "no-show") continue;
    for (let d = r.range.checkIn; d < r.range.checkOut; d = addDays(d, 1)) {
      if (d >= from && d < to) total += r.total.amountMinor / r.nights / 100;
    }
  }
  return total;
}
