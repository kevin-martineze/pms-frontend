"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";
import {
  patchHousekeeping,
  type HousekeepingStatus,
  type HousekeepingUpdate,
} from "@/lib/api/server";
import { getSession } from "@/lib/auth/server-session";

/**
 * Escrituras del tablero de camarería.
 *
 * Mismo criterio que las reservas: server actions, porque el token vive en una
 * cookie httpOnly, y los errores se devuelven en vez de lanzarse — que la
 * habitación ya no exista o que la sesión venza son cosas que la persona en el
 * pasillo tiene que poder leer, no una pantalla de error genérica.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

function toResult(error: unknown): ActionResult {
  if (error instanceof ApiError) return { ok: false, error: error.message };
  return { ok: false, error: "No se pudo conectar con el servidor." };
}

/* El estado de una habitación cambia el tablero y también el dashboard, así que
   se invalida el panel entero y no sólo esta pantalla. */
function revalidatePanel() {
  revalidatePath("/[lang]/admin", "layout");
}

async function update(unitId: string, change: HousekeepingUpdate): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "La sesión venció. Volvé a entrar." };

  try {
    await patchHousekeeping(session, unitId, change);
    revalidatePanel();
    return { ok: true };
  } catch (error) {
    return toResult(error);
  }
}

export async function setRoomStatus(
  unitId: string,
  status: HousekeepingStatus,
): Promise<ActionResult> {
  return update(unitId, { status });
}

/** `null` desasigna. */
export async function assignRoom(
  unitId: string,
  housekeeperId: string | null,
): Promise<ActionResult> {
  return update(unitId, { housekeeperId });
}
