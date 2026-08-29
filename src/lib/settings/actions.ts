"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";
import {
  deleteMember,
  deleteUnit,
  deleteUnitType,
  patchMember,
  patchUnit,
  patchUnitType,
  postMember,
  postUnit,
  postUnitType,
  resetMemberPassword,
  type Member,
  type NewMemberInput,
  type NewMemberResult,
  type UnitInput,
  type UnitTypeInput,
} from "@/lib/api/server";
import { canAccess } from "@/lib/auth/access";
import { getSession } from "@/lib/auth/server-session";

/**
 * Inventario y equipo.
 *
 * Todo pasa por `authorize`, que comprueba el rol acá además del backend. Una
 * server action es un endpoint más: se puede invocar sin pasar por la pantalla
 * que la ofrece, y "la pantalla está oculta" nunca fue un control de acceso.
 */

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function fail(error: unknown): { ok: false; error: string } {
  if (error instanceof ApiError) return { ok: false, error: error.message };
  return { ok: false, error: "No se pudo conectar con el servidor." };
}

function revalidate() {
  revalidatePath("/[lang]/admin", "layout");
}

async function authorize() {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "La sesión venció. Volvé a entrar." };
  if (!canAccess(session.role, "settings")) {
    return { ok: false as const, error: "Tu rol no puede cambiar la configuración." };
  }
  return { ok: true as const, session };
}

// --- Tipos de unidad --------------------------------------------------------

export async function createUnitType(input: UnitTypeInput): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await postUnitType(auth.session, input);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

export async function updateUnitType(
  unitTypeId: string,
  input: Partial<UnitTypeInput>,
): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await patchUnitType(auth.session, unitTypeId, input);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

export async function removeUnitType(unitTypeId: string): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await deleteUnitType(auth.session, unitTypeId);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

// --- Habitaciones -----------------------------------------------------------

export async function createUnit(input: UnitInput): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await postUnit(auth.session, input);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

export async function updateUnit(
  unitId: string,
  input: Partial<UnitInput>,
): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await patchUnit(auth.session, unitId, input);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

export async function removeUnit(unitId: string): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await deleteUnit(auth.session, unitId);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

// --- Equipo -----------------------------------------------------------------

/**
 * Devuelve la contraseña temporal para que la pantalla la muestre **una vez**.
 * No se guarda en ningún lado ni se puede volver a consultar: si se pierde, se
 * genera otra.
 */
export async function createMember(
  input: NewMemberInput,
): Promise<ActionResult<NewMemberResult>> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    const data = await postMember(auth.session, input);
    revalidate();
    return { ok: true, data };
  } catch (error) {
    return fail(error);
  }
}

export async function changeMemberRole(
  userId: string,
  role: Member["role"],
): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await patchMember(auth.session, userId, role);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

export async function removeMember(userId: string): Promise<ActionResult> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    await deleteMember(auth.session, userId);
    revalidate();
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error);
  }
}

export async function resetPassword(
  userId: string,
): Promise<ActionResult<{ temporaryPassword: string }>> {
  const auth = await authorize();
  if (!auth.ok) return auth;
  try {
    const data = await resetMemberPassword(auth.session, userId);
    revalidate();
    return { ok: true, data };
  } catch (error) {
    return fail(error);
  }
}
