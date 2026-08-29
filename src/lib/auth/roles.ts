import type { StaffRole } from "@/lib/domain/types";

/**
 * Mapea el `MemberRole` real de bookings-api (OWNER, MANAGER, FRONT_DESK,
 * HOUSEKEEPING) a las claves que ya usa el panel para permisos de navegación
 * y traducciones (`ROLE_ACCESS`, `t.admin.roles`). No hay rol "restaurant" en
 * el backend — el modelo de Membership no lo contempla todavía.
 */
const ROLE_MAP: Record<string, StaffRole> = {
  OWNER: "owner",
  MANAGER: "manager",
  FRONT_DESK: "front-desk",
  HOUSEKEEPING: "housekeeping",
};

export function mapMemberRole(role: string): StaffRole {
  return ROLE_MAP[role] ?? "front-desk";
}
