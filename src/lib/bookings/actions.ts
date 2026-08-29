"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";
import {
  getAvailability,
  patchBooking,
  postBooking,
  postTransition,
  type BookingTransition,
  type NewBookingInput,
  type UpdateBookingInput,
} from "@/lib/api/server";
import { getSession } from "@/lib/auth/server-session";

/**
 * Escrituras del panel.
 *
 * Server actions y no llamadas desde el navegador porque el token vive en una
 * cookie httpOnly que sólo el servidor puede leer. De paso, después de escribir
 * se invalida la caché de las pantallas: el calendario y la lista vuelven a
 * pedir datos y muestran el estado nuevo sin que nadie recargue a mano.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Los errores se devuelven, no se lanzan.
 *
 * Un 409 de "no hay unidades disponibles" o un 400 de "esta unidad admite hasta
 * 3 huéspedes" no son fallos del sistema: son respuestas de negocio que
 * recepción tiene que leer para saber qué hacer. Dejarlas explotar como
 * excepción las convertiría en una pantalla de error genérica, que es
 * exactamente la información que no sirve con un huésped esperando.
 */
function toResult(error: unknown): ActionResult {
  if (error instanceof ApiError) return { ok: false, error: error.message };
  return { ok: false, error: "No se pudo conectar con el servidor." };
}

/* Se invalida todo el panel, no sólo la pantalla actual: una entrada registrada
   cambia el dashboard, el calendario y la lista de reservas a la vez. */
function revalidatePanel() {
  revalidatePath("/[lang]/admin", "layout");
}

async function transition(bookingId: string, verb: BookingTransition): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "La sesión venció. Volvé a entrar." };

  try {
    await postTransition(session, bookingId, verb);
    revalidatePanel();
    return { ok: true };
  } catch (error) {
    return toResult(error);
  }
}

/**
 * Acepta una solicitud que entró por el sitio del huésped.
 *
 * Es el paso que cierra el circuito: sin pagos, una reserva directa llega en
 * `PENDING` con una retención de 48 horas, y alguien del hotel tiene que
 * decidir si la toma. Sin esto la solicitud vencía sola y el huésped se
 * quedaba esperando una respuesta que nadie podía dar.
 */
export async function confirmBooking(bookingId: string): Promise<ActionResult> {
  return transition(bookingId, "confirm");
}

export async function checkInBooking(bookingId: string): Promise<ActionResult> {
  return transition(bookingId, "check-in");
}

export async function checkOutBooking(bookingId: string): Promise<ActionResult> {
  return transition(bookingId, "check-out");
}

export async function cancelBooking(bookingId: string): Promise<ActionResult> {
  return transition(bookingId, "cancel");
}

export async function markNoShow(bookingId: string): Promise<ActionResult> {
  return transition(bookingId, "no-show");
}

export async function createBooking(input: NewBookingInput): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "La sesión venció. Volvé a entrar." };

  try {
    await postBooking(session, input);
    revalidatePanel();
    return { ok: true };
  } catch (error) {
    return toResult(error);
  }
}

/**
 * Cambia fechas, huéspedes, habitación o notas de una reserva ya tomada.
 *
 * El precio no viaja: si cambian las fechas, el servidor recotiza. Mandarlo
 * desde el formulario dejaría que recepción tecleara cualquier número, y el
 * total dejaría de tener relación con las tarifas publicadas.
 */
export async function editBooking(
  bookingId: string,
  input: UpdateBookingInput,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "La sesión venció. Volvé a entrar." };

  try {
    await patchBooking(session, bookingId, input);
    revalidatePanel();
    return { ok: true };
  } catch (error) {
    return toResult(error);
  }
}

export type AvailabilityCheck =
  | { ok: true; unitsAvailable: number; unitsTotal: number }
  | { ok: false; error: string };

/**
 * Consulta de disponibilidad para el formulario de carga.
 *
 * Es informativa: entre esta consulta y el guardado puede entrar otra reserva.
 * Esa ventana no se cierra desde acá — la cierra la restricción de exclusión en
 * la base, y por eso `createBooking` igual maneja el 409.
 */
export async function checkAvailability(
  unitTypeId: string,
  checkIn: string,
  checkOut: string,
): Promise<AvailabilityCheck> {
  const session = await getSession();
  if (!session) return { ok: false, error: "La sesión venció. Volvé a entrar." };

  try {
    const result = await getAvailability(session, unitTypeId, { checkIn, checkOut });
    return {
      ok: true,
      unitsAvailable: result.unitsAvailable,
      unitsTotal: result.unitsTotal,
    };
  } catch (error) {
    const failed = toResult(error);
    return { ok: false, error: failed.ok ? "" : failed.error };
  }
}
