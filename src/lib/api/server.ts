import "server-only";

import { apiRequest, authHeader } from "@/lib/api/client";
import type { ApiBooking, ApiUnit, ApiUnitType } from "@/lib/api/types";
import type { Session } from "@/lib/auth/server-session";

/** Lecturas autenticadas para Server Components. El token nunca sale al cliente. */

export function getBookings(
  session: Session,
  range?: { from: string; to: string },
): Promise<ApiBooking[]> {
  const query = range ? `?from=${range.from}&to=${range.to}` : "";
  return apiRequest<ApiBooking[]>(
    `/orgs/${session.orgId}/properties/${session.property.id}/bookings${query}`,
    { headers: authHeader(session.token) },
  );
}

export function getUnits(session: Session): Promise<ApiUnit[]> {
  return apiRequest<ApiUnit[]>(
    `/orgs/${session.orgId}/properties/${session.property.id}/units`,
    { headers: authHeader(session.token) },
  );
}

export function getUnitTypes(session: Session): Promise<ApiUnitType[]> {
  return apiRequest<ApiUnitType[]>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types`,
    { headers: authHeader(session.token) },
  );
}

export type AvailabilityResult = {
  unitsTotal: number;
  unitsAvailable: number;
  available: boolean;
};

export function getAvailability(
  session: Session,
  unitTypeId: string,
  range: { checkIn: string; checkOut: string },
): Promise<AvailabilityResult> {
  const query = `?checkIn=${range.checkIn}&checkOut=${range.checkOut}`;
  return apiRequest<AvailabilityResult>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types/${unitTypeId}/availability${query}`,
    { headers: authHeader(session.token) },
  );
}

export type RateCalendarNight = {
  date: string;
  priceMinor: number;
  weekend: boolean;
  closed: boolean;
  /** Nombre del plan que fijó ese precio, o null si es la tarifa base. */
  planName: string | null;
};

export type RateCalendarRow = {
  unitTypeId: string;
  unitTypeName: string;
  basePriceMinor: number;
  nights: RateCalendarNight[];
};

/** Precio por tipo y por fecha en una sola llamada — lo que dibuja la pantalla de Tarifas. */
export function getRateCalendar(
  session: Session,
  range: { from: string; to: string },
): Promise<RateCalendarRow[]> {
  return apiRequest<RateCalendarRow[]>(
    `/orgs/${session.orgId}/properties/${session.property.id}/rate-calendar?from=${range.from}&to=${range.to}`,
    { headers: authHeader(session.token) },
  );
}

export type ApiRatePlan = {
  id: string;
  unitTypeId: string;
  name: string;
  startDate: string;
  endDate: string;
  priceMinor: number;
  weekendPriceMinor: number | null;
  minNights: number | null;
  closed: boolean;
};

export function getRatePlans(session: Session, unitTypeId: string): Promise<ApiRatePlan[]> {
  return apiRequest<ApiRatePlan[]>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types/${unitTypeId}/rate-plans`,
    { headers: authHeader(session.token) },
  );
}

// --- Escrituras -------------------------------------------------------------

export type NewBookingInput = {
  unitTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestFullName: string;
  guestEmail: string;
  guestPhone?: string;
  guestNotes?: string;
};

export function postBooking(session: Session, input: NewBookingInput): Promise<ApiBooking> {
  return apiRequest<ApiBooking>(
    `/orgs/${session.orgId}/properties/${session.property.id}/bookings`,
    {
      method: "POST",
      headers: authHeader(session.token),
      body: JSON.stringify(input),
    },
  );
}

/** Las cuatro transiciones de estado comparten forma: sólo cambia el verbo de la URL. */
export type BookingTransition = "check-in" | "check-out" | "cancel" | "no-show";

export function postTransition(
  session: Session,
  bookingId: string,
  transition: BookingTransition,
): Promise<ApiBooking> {
  return apiRequest<ApiBooking>(
    `/orgs/${session.orgId}/properties/${session.property.id}/bookings/${bookingId}/${transition}`,
    { method: "POST", headers: authHeader(session.token) },
  );
}

// ---------------------------------------------------------------------------
// Camarería
// ---------------------------------------------------------------------------

export type HousekeepingStatus = "DIRTY" | "CLEAN" | "INSPECTED";

/** Lo que ve el tablero. La ocupación la deriva el servidor de las reservas. */
export type HousekeepingRoom = {
  unitId: string;
  label: string;
  unitTypeName: string;
  active: boolean;
  housekeepingStatus: HousekeepingStatus;
  note: string | null;
  state:
    | "blocked"
    | "departing"
    | "occupied"
    | "arriving"
    | "vacant-dirty"
    | "vacant-clean";
  taskType: "departure" | "stayover" | "inspection" | null;
  priority: "high" | "normal";
  needsCleaning: boolean;
  housekeeper: { id: string; name: string } | null;
  guestName: string | null;
};

export type HousekeepingBoard = {
  date: string;
  summary: {
    pending: number;
    cleanedToday: number;
    total: number;
    highPriority: number;
  };
  rooms: HousekeepingRoom[];
  cleaners: { id: string; name: string }[];
};

/**
 * El día lo manda el cliente. El servidor de la API corre en UTC y no sabe en
 * qué día está quien mira la pantalla; en Panamá (UTC-5) eso son cinco horas en
 * las que el tablero mostraría el turno equivocado.
 */
export function getHousekeepingBoard(
  session: Session,
  date: string,
): Promise<HousekeepingBoard> {
  return apiRequest<HousekeepingBoard>(
    `/orgs/${session.orgId}/properties/${session.property.id}/housekeeping?date=${date}`,
    { headers: authHeader(session.token) },
  );
}

export type HousekeepingUpdate = {
  status?: HousekeepingStatus;
  note?: string;
  housekeeperId?: string | null;
};

export function patchHousekeeping(
  session: Session,
  unitId: string,
  update: HousekeepingUpdate,
): Promise<unknown> {
  return apiRequest<unknown>(
    `/orgs/${session.orgId}/properties/${session.property.id}/housekeeping/units/${unitId}`,
    {
      method: "PATCH",
      headers: authHeader(session.token),
      body: JSON.stringify(update),
    },
  );
}
