import { cache } from "react";
import { cookies } from "next/headers";

import { apiRequest, authHeader, me, type MeResult } from "@/lib/api/client";
import type { ApiProperty } from "@/lib/api/types";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";

export type Session = {
  token: string;
  user: MeResult;
  orgId: string;
  orgName: string;
  role: string;
  /** Alojamiento sobre el que opera el panel. */
  property: ApiProperty;
};

/**
 * La sesión del request actual, o `null` si no hay.
 *
 * `cache()` la memoiza por request: el layout, el shell y cada página la piden
 * por separado, y sin esto serían tres viajes a `/auth/me` para renderizar una
 * sola pantalla.
 *
 * Devuelve `null` en vez de lanzar cuando el token está vencido o revocado —
 * para el panel eso no es un error, es "hay que volver a iniciar sesión".
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  try {
    const user = await me(token);
    const membership = user.memberships[0];
    if (!membership) return null;

    /* Julius opera un solo alojamiento por ahora. Cuando entren las casas hace
       falta un selector en el shell; hasta entonces, tomar el primero es
       honesto y evita inventar una pantalla que nadie pidió. */
    const properties = await apiRequest<ApiProperty[]>(`/orgs/${membership.orgId}/properties`, {
      headers: authHeader(token),
    });
    const property = properties[0];
    if (!property) return null;

    return {
      token,
      user,
      orgId: membership.orgId,
      orgName: membership.orgName,
      role: membership.role,
      property,
    };
  } catch {
    return null;
  }
});
