import "server-only";

import { apiRequest } from "@/lib/api/client";

/**
 * La cara pública de bookings-api: lo que el sitio del huésped puede pedir sin
 * ninguna credencial.
 *
 * Separado de `server.ts` a propósito. Ese módulo exige una `Session` en cada
 * llamada, y ese requisito de tipo es lo que impide que una pantalla pública
 * termine pidiendo datos de operación por descuido.
 *
 * El alojamiento se identifica por slug y sale del entorno: el sitio sirve a un
 * hotel, y ese hotel no cambia entre peticiones.
 */

const ORG_SLUG = process.env.NEXT_PUBLIC_ORG_SLUG ?? "daughters-of-sun";
const PROPERTY_SLUG = process.env.NEXT_PUBLIC_PROPERTY_SLUG ?? "hotel-principal";

const BASE = `/public/orgs/${ORG_SLUG}/properties/${PROPERTY_SLUG}`;

export type PublicUnitType = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: string | number;
  sizeSqm: number | null;
  basePriceMinor: number;
  minNights: number;
};

export type PublicProperty = {
  name: string;
  slug: string;
  locality: string | null;
  region: string | null;
  country: string | null;
  currency: string;
  checkIn: string;
  checkOut: string;
  unitTypes: PublicUnitType[];
};

export type PublicQuote = {
  nights: number;
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
  perNight: { date: string; priceMinor: number }[];
};

export type PublicAvailabilityRow = {
  unitTypeId: string;
  slug: string;
  name: string;
  maxGuests: number;
  available: boolean;
  fitsGuests: boolean;
  quote: PublicQuote | null;
  unavailableReason: string | null;
};

export type PublicAvailability = {
  checkIn: string;
  checkOut: string;
  guests: number;
  currency: string;
  unitTypes: PublicAvailabilityRow[];
};

export function getPublicProperty(): Promise<PublicProperty> {
  return apiRequest<PublicProperty>(BASE);
}

export function getPublicAvailability(range: {
  checkIn: string;
  checkOut: string;
  guests: number;
}): Promise<PublicAvailability> {
  const query = `?checkIn=${range.checkIn}&checkOut=${range.checkOut}&guests=${range.guests}`;
  return apiRequest<PublicAvailability>(`${BASE}/availability${query}`);
}

export type PublicBookingInput = {
  /** Idioma en que el huésped está reservando. Define en qué idioma se le escribe. */
  locale?: "es" | "en";
  unitTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestFullName: string;
  guestEmail: string;
  guestPhone?: string;
  guestNotes?: string;
};

export type PublicBookingResult = {
  reference: string;
  status: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  unitTypeName: string;
  nights: number;
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency: string;
  holdExpiresAt: string;
};

export function postPublicBooking(
  input: PublicBookingInput,
): Promise<PublicBookingResult> {
  return apiRequest<PublicBookingResult>(`${BASE}/bookings`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
