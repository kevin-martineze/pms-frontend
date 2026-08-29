"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { PROPERTY_COOKIE } from "@/lib/auth/cookies";
import { getSession } from "@/lib/auth/server-session";

/**
 * Cambia el alojamiento que el panel está mostrando.
 *
 * Se valida contra los alojamientos que la API devolvió para esta sesión. No es
 * lo que protege el dato —de eso se encarga el guard del backend en cada
 * petición— pero evita dejar la cookie apuntando a algo que este usuario no
 * puede ver, que se manifestaría como un panel vacío sin motivo aparente.
 */
export async function selectProperty(propertyId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;
  if (!session.properties.some((property) => property.id === propertyId)) return;

  (await cookies()).set(PROPERTY_COOKIE, propertyId, {
    path: "/",
    sameSite: "lax",
    // Un año: es una preferencia de vista, no una credencial.
    maxAge: 60 * 60 * 24 * 365,
  });

  /* Cambia todo lo que el panel muestra, así que se invalida el layout entero
     y no la pantalla actual. */
  revalidatePath("/[lang]/admin", "layout");
}
