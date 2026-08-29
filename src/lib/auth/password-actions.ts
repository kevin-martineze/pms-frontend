"use server";

import { ApiError, apiRequest } from "@/lib/api/client";

/**
 * Olvido y restablecimiento de contraseña.
 *
 * Server actions y no `fetch` desde el navegador para que la URL de la API no
 * quede expuesta en el cliente, igual que el resto de las escrituras.
 *
 * Ninguna necesita sesión: quien las usa es precisamente quien no puede entrar.
 */

export type PasswordResult = { ok: true } | { ok: false; error: string };

export async function requestPasswordReset(email: string): Promise<PasswordResult> {
  try {
    await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    /* Siempre `ok`, exista o no la cuenta. El backend responde igual a
       propósito, y traducir eso a un "no encontramos ese correo" en la interfaz
       reintroduciría justo la filtración que el backend evita. */
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return {
        ok: false,
        error: "Demasiados intentos. Esperá unos minutos.",
      };
    }
    return { ok: false, error: "No se pudo conectar con el servidor." };
  }
}

export async function resetPasswordWithToken(
  token: string,
  password: string,
): Promise<PasswordResult> {
  try {
    await apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, error: error.message };
    return { ok: false, error: "No se pudo conectar con el servidor." };
  }
}
