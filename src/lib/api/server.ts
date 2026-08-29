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

/**
 * Solicitudes pendientes de confirmar, **sin ventana de fechas**.
 *
 * A propósito no se filtra por rango: una solicitud del sitio puede ser para
 * dentro de seis meses, y el dashboard mira sólo las próximas dos semanas. Si
 * se filtrara igual que el resto, la que hay que atender hoy sería justo la que
 * no se ve.
 */
export function getPendingBookings(session: Session): Promise<ApiBooking[]> {
  return apiRequest<ApiBooking[]>(
    `/orgs/${session.orgId}/properties/${session.property.id}/bookings?status=PENDING`,
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

export type RatePlanInput = {
  name: string;
  startDate: string;
  endDate: string;
  priceMinor: number;
  weekendPriceMinor?: number | null;
  minNights?: number | null;
  closed?: boolean;
};

export function postRatePlan(
  session: Session,
  unitTypeId: string,
  input: RatePlanInput,
): Promise<ApiRatePlan> {
  return apiRequest<ApiRatePlan>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types/${unitTypeId}/rate-plans`,
    { method: "POST", headers: authHeader(session.token), body: JSON.stringify(input) },
  );
}

export function patchRatePlan(
  session: Session,
  unitTypeId: string,
  ratePlanId: string,
  input: Partial<RatePlanInput>,
): Promise<ApiRatePlan> {
  return apiRequest<ApiRatePlan>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types/${unitTypeId}/rate-plans/${ratePlanId}`,
    { method: "PATCH", headers: authHeader(session.token), body: JSON.stringify(input) },
  );
}

export function deleteRatePlan(
  session: Session,
  unitTypeId: string,
  ratePlanId: string,
): Promise<void> {
  return apiRequest<void>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types/${unitTypeId}/rate-plans/${ratePlanId}`,
    { method: "DELETE", headers: authHeader(session.token) },
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

/** Las transiciones de estado comparten forma: sólo cambia el verbo de la URL. */
export type BookingTransition = "confirm" | "check-in" | "check-out" | "cancel" | "no-show";

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

// ---------------------------------------------------------------------------
// Reportes
// ---------------------------------------------------------------------------

export type PerformanceReport = {
  from: string;
  to: string;
  windowNights: number;
  revenue: {
    /** Sin impuesto. Es el ingreso del hotel; el ITBMS se cobra para la DGI. */
    netMinor: number;
    taxMinor: number;
    grossMinor: number;
    /** Mismo largo de período, pegado al anterior. */
    previousNetMinor: number;
  };
  occupancy: { nightsSold: number; nightsAvailable: number; rate: number };
  adrMinor: number;
  revparMinor: number;
  byUnitType: {
    unitTypeId: string;
    name: string;
    units: number;
    nightsSold: number;
    nightsAvailable: number;
    occupancy: number;
    adrMinor: number;
    netMinor: number;
  }[];
  bySource: {
    source: "DIRECT" | "STAFF" | "CHANNEL";
    bookings: number;
    nightsSold: number;
    netMinor: number;
  }[];
};

/** `to` es exclusivo, igual que un check-out: la noche del `to` no entra. */
export function getPerformanceReport(
  session: Session,
  range: { from: string; to: string },
): Promise<PerformanceReport> {
  return apiRequest<PerformanceReport>(
    `/orgs/${session.orgId}/properties/${session.property.id}/reports/performance?from=${range.from}&to=${range.to}`,
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

// ---------------------------------------------------------------------------
// Inventario y equipo — la configuración que hace al hotel operable sin mí
// ---------------------------------------------------------------------------

export type UnitTypeInput = {
  name: string;
  slug: string;
  description?: string | null;
  maxGuests: number;
  bedrooms?: number;
  beds?: number;
  basePriceMinor: number;
  minNights?: number;
};

export function postUnitType(session: Session, input: UnitTypeInput): Promise<ApiUnitType> {
  return apiRequest<ApiUnitType>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types`,
    { method: "POST", headers: authHeader(session.token), body: JSON.stringify(input) },
  );
}

export function patchUnitType(
  session: Session,
  unitTypeId: string,
  input: Partial<UnitTypeInput>,
): Promise<ApiUnitType> {
  return apiRequest<ApiUnitType>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types/${unitTypeId}`,
    { method: "PATCH", headers: authHeader(session.token), body: JSON.stringify(input) },
  );
}

export function deleteUnitType(session: Session, unitTypeId: string): Promise<void> {
  return apiRequest<void>(
    `/orgs/${session.orgId}/properties/${session.property.id}/unit-types/${unitTypeId}`,
    { method: "DELETE", headers: authHeader(session.token) },
  );
}

export type UnitInput = { label: string; unitTypeId: string; active?: boolean };

export function postUnit(session: Session, input: UnitInput): Promise<ApiUnit> {
  return apiRequest<ApiUnit>(
    `/orgs/${session.orgId}/properties/${session.property.id}/units`,
    { method: "POST", headers: authHeader(session.token), body: JSON.stringify(input) },
  );
}

export function patchUnit(
  session: Session,
  unitId: string,
  input: Partial<UnitInput>,
): Promise<ApiUnit> {
  return apiRequest<ApiUnit>(
    `/orgs/${session.orgId}/properties/${session.property.id}/units/${unitId}`,
    { method: "PATCH", headers: authHeader(session.token), body: JSON.stringify(input) },
  );
}

export function deleteUnit(session: Session, unitId: string): Promise<void> {
  return apiRequest<void>(
    `/orgs/${session.orgId}/properties/${session.property.id}/units/${unitId}`,
    { method: "DELETE", headers: authHeader(session.token) },
  );
}

export type Member = {
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "FRONT_DESK" | "HOUSEKEEPING";
  lockedUntil: string | null;
  createdAt: string;
};

export function getMembers(session: Session): Promise<Member[]> {
  return apiRequest<Member[]>(`/orgs/${session.orgId}/members`, {
    headers: authHeader(session.token),
  });
}

export type NewMemberInput = { fullName: string; email: string; role: Member["role"] };

/** `temporaryPassword` es `null` cuando la persona ya tenía cuenta. */
export type NewMemberResult = {
  userId: string;
  email: string;
  name: string;
  role: Member["role"];
  temporaryPassword: string | null;
};

export function postMember(
  session: Session,
  input: NewMemberInput,
): Promise<NewMemberResult> {
  return apiRequest<NewMemberResult>(`/orgs/${session.orgId}/members`, {
    method: "POST",
    headers: authHeader(session.token),
    body: JSON.stringify(input),
  });
}

export function patchMember(
  session: Session,
  userId: string,
  role: Member["role"],
): Promise<Member> {
  return apiRequest<Member>(`/orgs/${session.orgId}/members/${userId}`, {
    method: "PATCH",
    headers: authHeader(session.token),
    body: JSON.stringify({ role }),
  });
}

export function deleteMember(session: Session, userId: string): Promise<void> {
  return apiRequest<void>(`/orgs/${session.orgId}/members/${userId}`, {
    method: "DELETE",
    headers: authHeader(session.token),
  });
}

export function resetMemberPassword(
  session: Session,
  userId: string,
): Promise<{ temporaryPassword: string }> {
  return apiRequest<{ temporaryPassword: string }>(
    `/orgs/${session.orgId}/members/${userId}/reset-password`,
    { method: "POST", headers: authHeader(session.token) },
  );
}

export type UpdateBookingInput = {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  unitId?: string;
  guestNotes?: string;
};

export function patchBooking(
  session: Session,
  bookingId: string,
  input: UpdateBookingInput,
): Promise<ApiBooking> {
  return apiRequest<ApiBooking>(
    `/orgs/${session.orgId}/properties/${session.property.id}/bookings/${bookingId}`,
    { method: "PATCH", headers: authHeader(session.token), body: JSON.stringify(input) },
  );
}
