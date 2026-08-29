import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ApiError, login, logout, me } from "@/lib/api/client";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";

/**
 * La sesión del panel vive en cookies httpOnly, no en memoria del cliente.
 *
 * Dos razones concretas. La primera es de operación: recepción trabaja ocho
 * horas con esta pantalla abierta, y una sesión que muere al recargar es
 * inaceptable. La segunda es técnica: las pantallas del panel son Server
 * Components, así que el token tiene que estar donde el servidor pueda leerlo.
 *
 * httpOnly, además, deja el token fuera del alcance de cualquier JavaScript de
 * la página — que es la diferencia entre un XSS molesto y un XSS que se lleva
 * la sesión.
 */

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const email = typeof body === "object" && body && "email" in body ? String(body.email) : "";
  const password =
    typeof body === "object" && body && "password" in body ? String(body.password) : "";

  if (!email || !password) {
    return NextResponse.json({ message: "Faltan credenciales." }, { status: 400 });
  }

  try {
    const tokens = await login(email, password);
    const user = await me(tokens.accessToken);

    const jar = await cookies();
    const secure = process.env.NODE_ENV === "production";
    jar.set(ACCESS_COOKIE, tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
    });
    jar.set(REFRESH_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "No se pudo conectar con la API." }, { status: 502 });
  }
}

export async function DELETE() {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;

  /* Revocar del lado del servidor además de borrar la cookie: un refresh token
     que sigue vivo en la base es una sesión que sigue abierta aunque el
     navegador ya no la tenga. Si la API no responde, igual se borra la cookie
     — el usuario pidió salir. */
  if (refreshToken) {
    await logout(refreshToken).catch(() => undefined);
  }

  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  return new NextResponse(null, { status: 204 });
}
