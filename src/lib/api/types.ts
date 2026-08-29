/**
 * Las formas que devuelve bookings-api, tal cual salen del JSON.
 *
 * Se declaran aparte del dominio (`@/lib/domain/types`) a propósito: acá viven
 * los nombres y enums del backend (`CHECKED_IN`, `basePriceMinor`), y en el
 * dominio los que usan las pantallas. El puente es `@/lib/bookings/mapper`.
 */

export type ApiBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export type ApiBookingSource = "DIRECT" | "STAFF" | "CHANNEL";

export type ApiGuest = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  notes: string | null;
};

export type ApiUnit = {
  id: string;
  propertyId: string;
  unitTypeId: string;
  /** Identificador visible para el personal: "101", "Apto B". */
  label: string;
  active: boolean;
};

export type ApiUnitType = {
  id: string;
  propertyId: string;
  name: string;
  slug: string;
  description: string | null;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  /** Prisma serializa Decimal como string ("1.5"), no como número. */
  baths: string;
  sizeSqm: number | null;
  basePriceMinor: number;
  minNights: number;
};

export type ApiProperty = {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  timezone: string;
  locality: string | null;
  region: string | null;
  country: string | null;
  currency: string;
  checkIn: string;
  checkOut: string;
};

/** Reserva con las relaciones que el panel necesita (ver `DETAIL_INCLUDE` en la API). */
export type ApiBooking = {
  id: string;
  orgId: string;
  propertyId: string;
  unitTypeId: string;
  unitId: string;
  guestId: string;
  reference: string;
  /** Fecha de calendario, pero el JSON la trae como datetime ISO en UTC. */
  checkIn: string;
  checkOut: string;
  guests: number;
  status: ApiBookingStatus;
  source: ApiBookingSource;
  subtotalMinor: number;
  taxMinor: number;
  feesMinor: number;
  totalMinor: number;
  currency: string;
  guestNotes: string | null;
  cancelledAt: string | null;
  createdAt: string;
  guest: ApiGuest;
  unit: ApiUnit;
  unitType: ApiUnitType;
};
