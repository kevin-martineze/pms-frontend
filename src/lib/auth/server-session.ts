import { cache } from "react";
import { cookies } from "next/headers";

import { apiRequest, authHeader, me, type MeResult } from "@/lib/api/client";
import type { ApiProperty } from "@/lib/api/types";
import { ACCESS_COOKIE, PROPERTY_COOKIE } from "@/lib/auth/cookies";

export type Session = {
  token: string;
  user: MeResult;
  orgId: string;
  orgName: string;
  role: string;
  /** Alojamiento sobre el que opera el panel. */
  property: ApiProperty;
  /** Todos los de la organización, para el selector del encabezado. */
  properties: ApiProperty[];
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

    const properties = await apiRequest<ApiProperty[]>(`/orgs/${membership.orgId}/properties`, {
      headers: authHeader(token),
    });
    if (properties.length === 0) return null;

    /* El alojamiento elegido sale de una cookie. Se valida contra la lista que
       devolvió la API en vez de confiar en el valor: una cookie con el id de
       otra organización tiene que caer al primero, no dejar el panel vacío sin
       explicación.

       Sin cookie —o con una que ya no existe, porque el alojamiento se borró—
       manda el primero, que la API ordena por antigüedad. */
    const chosenId = (await cookies()).get(PROPERTY_COOKIE)?.value;
    const property = properties.find((p) => p.id === chosenId) ?? properties[0];

    return {
      token,
      user,
      orgId: membership.orgId,
      orgName: membership.orgName,
      role: membership.role,
      property,
      properties,
    };
  } catch {
    return null;
  }
});
