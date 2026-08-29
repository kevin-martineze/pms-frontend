/** Nombres de las cookies de sesión. Aparte para que el Route Handler y el lector de servidor no se desincronicen. */
export const ACCESS_COOKIE = "dos_access";
export const REFRESH_COOKIE = "dos_refresh";

/**
 * Alojamiento que el panel está mostrando.
 *
 * No es httpOnly ni secreta: es una preferencia de vista, no una credencial.
 * Lo que impide ver un alojamiento ajeno no es esta cookie sino el guard del
 * backend, que verifica la membresía en cada petición — por eso un valor
 * manipulado acá no abre nada, sólo hace que el panel no encuentre nada.
 */
export const PROPERTY_COOKIE = "dos_property";
