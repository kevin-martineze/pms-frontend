import { en, type Dictionary } from "@/lib/i18n/dictionaries/en";
import { es } from "@/lib/i18n/dictionaries/es";
import { DEFAULT_LOCALE, INTL_TAG, isLocale, type Locale } from "@/lib/i18n/config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, es };

/** Diccionario de un idioma. Síncrono: son dos objetos, no una petición. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Normaliza el segmento de la URL. Un idioma desconocido cae al inglés en vez
 * de reventar: `/de/stays` todavía no tiene traducción, y servir la página en
 * inglés es mejor que un 500.
 */
export function resolveLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Etiqueta BCP-47 para `Intl.NumberFormat` e `Intl.DateTimeFormat`. */
export function intlTag(locale: Locale): string {
  return INTL_TAG[locale];
}

export type { Dictionary };
