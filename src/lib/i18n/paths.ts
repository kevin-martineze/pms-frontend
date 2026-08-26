import type { Locale } from "@/lib/i18n/config";

/**
 * Prefija una ruta interna con el idioma.
 *
 * Toda ruta vive bajo `/[lang]`, así que un `href="/stays"` escrito a mano
 * manda al huésped fuera de su idioma — y el `proxy` lo rebota al que negocie
 * el navegador, que puede no ser el que estaba leyendo. Es un bug silencioso:
 * la página carga, sólo que en otro idioma.
 */
export function withLocale(locale: Locale, path: string): string {
  if (path.startsWith("http") || path.startsWith("#")) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Cambia el idioma de la ruta actual conservando la página.
 *
 * Mandar a la portada al cambiar de idioma pierde el contexto: alguien leyendo
 * la ficha de una habitación en inglés quiere esa misma ficha en español, no
 * empezar de nuevo.
 */
export function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  /* segments[0] es la cadena vacía anterior a la primera barra. */
  segments[1] = next;
  return segments.join("/") || `/${next}`;
}
