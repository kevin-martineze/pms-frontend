"use server";

import { ApiError } from "@/lib/api/client";
import {
  postPublicBooking,
  type PublicBookingInput,
  type PublicBookingResult,
} from "@/lib/api/public";

/**
 * Solicitud de reserva desde el sitio del huésped.
 *
 * Server action y no `fetch` desde el navegador por dos razones: la URL de la
 * API queda del lado del servidor, y sobre todo, el navegador nunca ve la
 * respuesta cruda — sólo lo que este archivo decide devolver.
 *
 * Sin pagos, esto **no confirma nada**: crea una solicitud que el hotel acepta
 * desde el panel. El texto que ve el huésped tiene que decir eso mismo, o va a
 * llegar convencido de que tiene una habitación.
 */

export type BookingRequestResult =
  | { ok: true; booking: PublicBookingResult }
  | { ok: false; error: string };

export async function requestBooking(
  input: PublicBookingInput,
): Promise<BookingRequestResult> {
  try {
    const booking = await postPublicBooking(input);
    return { ok: true, booking };
  } catch (error) {
    if (error instanceof ApiError) {
      /* 429 llega con el mensaje genérico del limitador, que no le dice nada a
         una persona. El resto de los mensajes del backend sí están escritos
         para leerse ("Esa habitación ya no está disponible…"). */
      if (error.status === 429) {
        return {
          ok: false,
          error:
            "Recibimos varias solicitudes desde tu conexión. Esperá unos minutos o escribinos directamente.",
        };
      }
      return { ok: false, error: error.message };
    }
    return {
      ok: false,
      error: "No pudimos comunicarnos con el hotel. Probá de nuevo en un momento.",
    };
  }
}
