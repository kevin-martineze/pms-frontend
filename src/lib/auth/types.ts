/**
 * Lo que el shell necesita saber de la sesión, y nada más.
 *
 * Existe separado de `Session` (en `server-session.ts`) por una razón de
 * seguridad concreta: todo prop que un Server Component le pasa a un Client
 * Component se serializa dentro del HTML que llega al navegador. Pasar la
 * sesión entera metería el access token en el payload de la página y anularía
 * el sentido de guardarlo en una cookie httpOnly.
 */
export type SessionSummary = {
  user: { fullName: string | null; email: string };
  orgName: string;
  /** Alojamiento que el panel está mostrando. Va en el header a propósito: ver
   *  "no hay reservas" sin saber de qué alojamiento se habla es indistinguible
   *  de estar mirando el equivocado. */
  propertyName: string;
  role: string;
};
