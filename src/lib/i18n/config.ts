/**
 * Configuración de idiomas.
 *
 * El cliente pidió cinco idiomas en la primera fase: inglés, español, alemán,
 * francés y neerlandés. David recibe jubilados norteamericanos y europeos, así
 * que no es una lista aspiracional — es el público real de la propiedad.
 *
 * Sólo `en` y `es` tienen diccionario hoy. Los otros tres están declarados como
 * `PLANNED` para que el selector los muestre atenuados en vez de esconderlos:
 * ocultar un idioma que sí va a existir hace que nadie pregunte por él, y
 * mostrarlo activo cuando no hay traducción entrega media página en inglés.
 */

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Inglés primero: es el idioma en el que el cliente lee y decide. */
export const DEFAULT_LOCALE: Locale = "en";

/** Declarados en el alcance, sin traducción todavía. */
export const PLANNED_LOCALES = ["de", "fr", "nl"] as const;

export const LOCALE_LABEL: Record<Locale | (typeof PLANNED_LOCALES)[number], string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  nl: "Nederlands",
};

/**
 * Etiqueta BCP-47 para `Intl`. No es lo mismo que el código de idioma: los
 * precios van en dólares y las fechas en formato local, y `es` a secas
 * formatearía como España — coma decimal y día/mes distinto al panameño.
 */
export const INTL_TAG: Record<Locale, string> = {
  en: "en-US",
  es: "es-PA",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
