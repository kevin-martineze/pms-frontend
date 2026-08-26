import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

/**
 * Redirección de idioma.
 *
 * Toda ruta vive bajo `/[lang]`, así que una petición a `/stays` no existe. En
 * vez de dar 404 se la manda al idioma que el navegador pidió, y si no pidió
 * ninguno de los que hablamos, al inglés.
 *
 * Negociar con `Accept-Language` en vez de mandar siempre al default importa
 * para el público real de la propiedad: en David hay tanto huésped
 * norteamericano como panameño, y hacer que uno de los dos empiece siempre en
 * el idioma equivocado es una fricción evitable.
 *
 * En Next 16 este archivo se llama `proxy` y no `middleware`.
 */

function negotiate(header: string | null): string {
  if (!header) return DEFAULT_LOCALE;

  /* Accept-Language llega como "es-PA,es;q=0.9,en;q=0.8". Se ordena por q y se
     compara sólo la parte del idioma: alguien con es-419 o es-ES quiere
     español, no inglés. */
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    const match = LOCALES.find((locale) => locale === base);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = negotiate(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /* Fuera: los internos de Next, los estáticos y las fotos. Redirigir
     /photos/x.jpg a /en/photos/x.jpg rompería todas las imágenes. */
  matcher: ["/((?!_next|photos|favicon.ico|.*\\.[\\w]+$).*)"],
};
