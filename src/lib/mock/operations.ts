import type { HousekeepingTask, RatePlan, RoomState, Season, StaffMember } from "@/lib/domain/types";
import { addDays } from "@/lib/format";
import { allRooms } from "@/lib/mock/property";
import { TODAY, arrivalsOn, departuresOn, inHouseOn } from "@/lib/mock/reservations";

/**
 * Roles del staff.
 *
 * Julius fue explícito: quiere trabajar 20 horas y ser gerente, no estar en el
 * medio de todo. Eso se traduce en permisos, no en buenas intenciones —
 * recepción no ve la facturación del mes y camarería no ve datos del huésped.
 */
export const staff: StaffMember[] = [
  { id: "s-julius", name: "Julius", role: "owner", initials: "JU" },
  { id: "s-marilyn", name: "Marilyn", role: "manager", initials: "MA" },
  { id: "s-yaritza", name: "Yaritza Cedeño", role: "front-desk", initials: "YC", shift: "07:00 – 15:00" },
  { id: "s-eduardo", name: "Eduardo Batista", role: "front-desk", initials: "EB", shift: "15:00 – 23:00" },
  { id: "s-nidia", name: "Nidia Araúz", role: "housekeeping", initials: "NA", shift: "07:00 – 15:00" },
  { id: "s-rosa", name: "Rosa Quintero", role: "housekeeping", initials: "RQ", shift: "07:00 – 15:00" },
  { id: "s-tony", name: "Tony", role: "restaurant", initials: "TO", shift: "11:00 – 22:00" },
];

export const ROLE_LABEL: Record<StaffMember["role"], string> = {
  owner: "Propietario",
  manager: "Gerencia",
  "front-desk": "Recepción",
  housekeeping: "Camarería",
  restaurant: "Restaurante",
};

/**
 * Lo que cada rol puede ver. La demo lo usa para el selector "ver el sistema
 * como…", que es la forma más rápida de mostrarle a Julius que su recepcionista
 * no va a ver los números del mes.
 */
export const ROLE_ACCESS: Record<StaffMember["role"], string[]> = {
  owner: ["dashboard", "calendar", "reservations", "guests", "housekeeping", "rates", "reports"],
  manager: ["dashboard", "calendar", "reservations", "guests", "housekeeping", "rates", "reports"],
  "front-desk": ["dashboard", "calendar", "reservations", "guests"],
  housekeeping: ["housekeeping"],
  restaurant: ["dashboard"],
};

/**
 * Estado de cada habitación hoy, derivado de las reservas.
 *
 * Se deriva y no se guarda a propósito: un estado guardado se desincroniza en
 * cuanto alguien mueve una reserva, y entonces camarería limpia una habitación
 * que ya está ocupada. La única excepción son las bloqueadas por mantenimiento,
 * que sí son un hecho independiente del calendario.
 */
const MAINTENANCE_BLOCKS = new Set<string>(["205"]);

export function roomStateOn(room: string, date = TODAY): RoomState {
  if (MAINTENANCE_BLOCKS.has(room)) return "blocked";

  const departing = departuresOn(date).some((r) => r.room === room);
  const arriving = arrivalsOn(date).some((r) => r.room === room);
  const occupied = inHouseOn(date).some((r) => r.room === room);

  if (departing && arriving) return "departing";
  if (departing) return "departing";
  if (arriving) return "arriving";
  if (occupied) return "occupied";

  /* Salió ayer y nadie entra hoy: quedó sucia hasta que camarería la marque. */
  const departedYesterday = departuresOn(addDays(date, -1)).some((r) => r.room === room);
  return departedYesterday ? "vacant-dirty" : "vacant-clean";
}

export const ROOM_STATE_LABEL: Record<RoomState, string> = {
  "vacant-clean": "Libre y limpia",
  "vacant-dirty": "Libre, por limpiar",
  occupied: "Ocupada",
  arriving: "Llega hoy",
  departing: "Sale hoy",
  blocked: "Bloqueada",
};

export const ROOM_STATE_CLASS: Record<RoomState, string> = {
  "vacant-clean": "bg-status-vacant-clean/15 text-status-vacant-clean border-status-vacant-clean/30",
  "vacant-dirty": "bg-status-vacant-dirty/20 text-status-vacant-dirty border-status-vacant-dirty/40",
  occupied: "bg-status-occupied/15 text-status-occupied border-status-occupied/30",
  arriving: "bg-status-arriving/15 text-status-arriving border-status-arriving/30",
  departing: "bg-status-departing/15 text-status-departing border-status-departing/30",
  blocked: "bg-muted text-muted-foreground border-border",
};

export function housekeepingToday(): HousekeepingTask[] {
  const cleaners = staff.filter((s) => s.role === "housekeeping");

  return allRooms.map(({ room, unitId }, index) => {
    const state = roomStateOn(room);
    const type: HousekeepingTask["type"] =
      state === "departing"
        ? "departure"
        : state === "occupied"
          ? "stayover"
          : state === "vacant-dirty"
            ? "departure"
            : state === "arriving"
              ? "inspection"
              : "stayover";

    /* Las salidas con llegada el mismo día son la prioridad real del turno:
       hay una ventana de cuatro horas entre el checkout y el check-in. */
    const priority: HousekeepingTask["priority"] =
      state === "departing" && arrivalsOn(TODAY).some((r) => r.room === room) ? "high" : "normal";

    const assignedTo =
      state === "vacant-clean" || state === "blocked"
        ? null
        : cleaners[index % cleaners.length].name;

    return {
      room,
      unitId,
      state,
      type,
      assignedTo,
      priority,
      note: state === "blocked" ? "Mantenimiento: cambio de aire acondicionado" : undefined,
    };
  });
}

export const HK_TYPE_LABEL: Record<HousekeepingTask["type"], string> = {
  departure: "Salida — limpieza a fondo",
  stayover: "Permanencia",
  deep: "Profunda",
  inspection: "Inspección previa a llegada",
};

// ---------------------------------------------------------------------------
// Tarifas
// ---------------------------------------------------------------------------

export const ratePlans: RatePlan[] = [
  {
    id: "rp-flex",
    name: "Tarifa flexible",
    multiplier: 1,
    minNights: 1,
    cancellation: "Cancelación gratis hasta 48 h antes",
  },
  {
    id: "rp-nonref",
    name: "No reembolsable",
    multiplier: 0.86,
    minNights: 1,
    cancellation: "Sin reembolso. Se cobra el total al reservar.",
  },
  {
    id: "rp-week",
    name: "Estancia larga (7+ noches)",
    multiplier: 0.82,
    minNights: 7,
    cancellation: "Cancelación gratis hasta 7 días antes",
  },
  {
    id: "rp-direct",
    name: "Directo — mejor precio",
    multiplier: 0.93,
    minNights: 2,
    cancellation: "Cancelación gratis hasta 24 h antes. Solo en el sitio propio.",
  },
];

/**
 * Temporadas. Las fechas se calculan desde hoy para que la demo nunca muestre
 * un calendario del año pasado.
 */
export const seasons: Season[] = [
  {
    id: "s-alta",
    name: "Temporada alta — seca",
    from: addDays(TODAY, 14),
    to: addDays(TODAY, 75),
    adjustmentPct: 25,
    color: "var(--terracotta)",
  },
  {
    id: "s-apertura",
    name: "Apertura — tarifa de lanzamiento",
    from: addDays(TODAY, -7),
    to: addDays(TODAY, 14),
    adjustmentPct: -15,
    color: "var(--sea)",
  },
  {
    id: "s-estandar",
    name: "Estándar",
    from: addDays(TODAY, 75),
    to: addDays(TODAY, 180),
    adjustmentPct: 0,
    color: "var(--palm)",
  },
];

export function seasonFor(date: string): Season | undefined {
  return seasons.find((s) => date >= s.from && date < s.to);
}
