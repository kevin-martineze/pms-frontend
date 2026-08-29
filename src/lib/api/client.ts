/**
 * Cliente HTTP de bookings-api.
 *
 * Es la única puerta de salida hacia la API. Lo usan el Route Handler de
 * sesión (`/api/session`) y los helpers de servidor (`@/lib/api/server`); las
 * pantallas no lo llaman directo.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type MembershipSummary = {
  orgId: string;
  orgName: string;
  role: string;
};

export type MeResult = {
  id: string;
  email: string;
  fullName: string | null;
  memberships: MembershipSummary[];
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL en .env.local");

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    /* Datos de operación en vivo: una reserva creada hace diez segundos tiene
       que verse. Nada de esto se cachea. */
    cache: "no-store",
  });

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : res.statusText;
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Cabecera de autenticación. Un solo lugar para no escribir "Bearer" a mano. */
export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function login(email: string, password: string): Promise<LoginResult> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout(refreshToken: string): Promise<void> {
  return apiRequest("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function me(token: string): Promise<MeResult> {
  return apiRequest("/auth/me", { headers: authHeader(token) });
}
