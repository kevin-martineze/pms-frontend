"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";
import {
  deleteRatePlan,
  patchRatePlan,
  postRatePlan,
  type RatePlanInput,
} from "@/lib/api/server";
import { canAccess } from "@/lib/auth/access";
import { getSession } from "@/lib/auth/server-session";

/**
 * Alta, edición y baja de temporadas desde el panel.
 *
 * Hasta ahora las tarifas se cargaban por API o por seed, lo que significaba
 * que Julius dependía de mí para cambiar un precio. Un hotel cambia tarifas
 * varias veces al año.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

function toResult(error: unknown): ActionResult {
  if (error instanceof ApiError) return { ok: false, error: error.message };
  return { ok: false, error: "No se pudo conectar con el servidor." };
}

function revalidateRates() {
  revalidatePath("/[lang]/admin", "layout");
}

/**
 * El backend ya devuelve 403 a quien no sea OWNER o MANAGER. Se comprueba
 * igual acá porque una server action es un endpoint más: se puede invocar sin
 * pasar por la pantalla que la ofrece.
 */
type Authorized =
  | { ok: true; session: Awaited<ReturnType<typeof getSession>> & object }
  | { ok: false; error: string };

async function authorize(): Promise<Authorized> {
  const session = await getSession();
  if (!session) return { ok: false, error: "La sesión venció. Volvé a entrar." };
  if (!canAccess(session.role, "rates")) {
    return { ok: false, error: "Tu rol no puede cambiar tarifas." };
  }
  return { ok: true, session };
}

export async function createRatePlan(
  unitTypeId: string,
  input: RatePlanInput,
): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;

  try {
    await postRatePlan(auth.session, unitTypeId, input);
    revalidateRates();
    return { ok: true };
  } catch (error) {
    return toResult(error);
  }
}

export async function updateRatePlan(
  unitTypeId: string,
  ratePlanId: string,
  input: Partial<RatePlanInput>,
): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;

  try {
    await patchRatePlan(auth.session, unitTypeId, ratePlanId, input);
    revalidateRates();
    return { ok: true };
  } catch (error) {
    return toResult(error);
  }
}

export async function removeRatePlan(
  unitTypeId: string,
  ratePlanId: string,
): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;

  try {
    await deleteRatePlan(auth.session, unitTypeId, ratePlanId);
    revalidateRates();
    return { ok: true };
  } catch (error) {
    return toResult(error);
  }
}
