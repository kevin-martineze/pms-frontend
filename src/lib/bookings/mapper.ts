import type { ApiBooking, ApiBookingStatus } from "@/lib/api/types";
import type { IsoDate, Reservation, ReservationStatus } from "@/lib/domain/types";
import { diffNights } from "@/lib/format";

const STATUS_MAP: Record<ApiBookingStatus, ReservationStatus> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "in-house",
  CHECKED_OUT: "checked-out",
  CANCELLED: "cancelled",
  NO_SHOW: "no-show",
};

/**
 * La API devuelve las fechas como datetime ISO en UTC ("2026-09-10T00:00:00Z")
 * aunque en la base sean `date` puras. Se corta el string en vez de pasar por
 * `new Date()`: en Panamá (UTC-5) construir un Date desde esa cadena y
 * formatearlo en local devuelve el día anterior — una noche entera de
 * diferencia en una reserva. Ver el comentario de `parseIsoDate` en
 * `@/lib/format`.
 */
function toCalendarDate(apiDate: string): IsoDate {
  return apiDate.slice(0, 10);
}

/** Traduce una reserva de la API al tipo que consumen las pantallas. */
export function toReservation(booking: ApiBooking): Reservation {
  const checkIn = toCalendarDate(booking.checkIn);
  const checkOut = toCalendarDate(booking.checkOut);

  return {
    id: booking.id,
    reference: booking.reference,
    unitId: booking.unitTypeId,
    room: booking.unit.label,
    guest: {
      id: booking.guest.id,
      name: booking.guest.fullName,
      email: booking.guest.email,
      phone: booking.guest.phone ?? "",
    },
    range: { checkIn, checkOut },
    nights: diffNights(checkIn, checkOut),
    guests: booking.guests,
    status: STATUS_MAP[booking.status],
    total: { amountMinor: booking.totalMinor, currency: booking.currency },
    createdAt: toCalendarDate(booking.createdAt),
    notes: booking.guestNotes ?? undefined,
    /* `payment`, `balance` y `channel` se omiten a propósito: no hay dato real
       detrás. Ver el comentario del tipo `Reservation`. */
  };
}
