"use client";

import * as React from "react";
import { es as esDateFns, enUS } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

import { en } from "@/lib/i18n/dictionaries/en";
import { es } from "@/lib/i18n/dictionaries/es";
import { INTL_TAG, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * El diccionario del lado del cliente.
 *
 * Cruza la frontera del servidor sólo el código de idioma, no el diccionario:
 * las traducciones llevan funciones dentro — para plurales y para el texto con
 * un número adentro — y una función no se puede serializar en el payload de un
 * React Server Component. El proveedor importa los dos diccionarios y elige por
 * código, que sí es un string.
 *
 * El costo es que ambos idiomas viajan en el bundle. Con dos es despreciable;
 * al llegar al quinto conviene cargarlos con `import()` por idioma.
 */

const DICTIONARIES: Record<Locale, Dictionary> = { en, es };
const DATE_LOCALES: Record<Locale, DateFnsLocale> = { en: enUS, es: esDateFns };

type I18nValue = {
  t: Dictionary;
  locale: Locale;
  /** Etiqueta para `Intl`. `es-PA`, no `es`: el formato panameño no es el de España. */
  intlTag: string;
  /** El objeto de locale que espera react-day-picker. */
  dateLocale: DateFnsLocale;
};

const I18nContext = React.createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = React.useMemo<I18nValue>(
    () => ({
      t: DICTIONARIES[locale],
      locale,
      intlTag: INTL_TAG[locale],
      dateLocale: DATE_LOCALES[locale],
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = React.useContext(I18nContext);
  /* Fallar ruidoso y no caer al inglés en silencio: un componente fuera del
     proveedor es un error de montaje, y descubrirlo en desarrollo cuesta menos
     que descubrirlo cuando media página quedó sin traducir en producción. */
  if (!value) throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  return value;
}
