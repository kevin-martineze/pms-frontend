import type { StaffRole } from "@/lib/domain/types";
import { mapMemberRole } from "@/lib/auth/roles";

/**
 * Qué secciones del panel ve cada rol.
 *
 * Vivía en `lib/mock/operations.ts` desde la maqueta. Ya no es dato de
 * demostración: es la política de acceso real, y dejarla entre los mocks
 * invitaba a borrarla junto con ellos.
 *
 * El backend restringe por endpoint, que es lo que de verdad protege los datos.
 * Esto es la otra mitad: que nadie llegue a una pantalla que no le corresponde
 * escribiendo la URL. Ocultar el enlace no alcanzaba.
 */
export const ROLE_ACCESS: Record<StaffRole, readonly Section[]> = {
  owner: ["dashboard", "calendar", "reservations", "guests", "housekeeping", "rates", "reports"],
  manager: ["dashboard", "calendar", "reservations", "guests", "housekeeping", "rates", "reports"],
  "front-desk": ["dashboard", "calendar", "reservations", "guests", "housekeeping"],
  housekeeping: ["housekeeping"],
  restaurant: ["dashboard"],
};

export type Section =
  | "dashboard"
  | "calendar"
  | "reservations"
  | "guests"
  | "housekeeping"
  | "rates"
  | "reports";

/** `role` es el `MemberRole` crudo de la API (OWNER, FRONT_DESK, …). */
export function canAccess(role: string, section: Section): boolean {
  return ROLE_ACCESS[mapMemberRole(role)].includes(section);
}
