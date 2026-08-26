import type { Amenity, Unit } from "@/lib/domain/types";
import type { Locale } from "@/lib/i18n/config";

/**
 * Contenido traducido que vive en los datos, no en el diccionario.
 *
 * El nombre y la descripción de una habitación son contenido del cliente: los
 * escribe él, cambian con la propiedad y no tienen nada que hacer en un archivo
 * de interfaz. Por eso el modelo de `Unit` lleva los dos idiomas adentro, y esto
 * sólo elige cuál mostrar.
 *
 * Cuando entre el CMS, esta función es lo único que cambia — pasa a leer el
 * campo del idioma pedido en vez de un par fijo.
 */

export function unitName(unit: Unit, locale: Locale): string {
  return locale === "en" ? unit.nameEn : unit.name;
}

export function unitTagline(unit: Unit, locale: Locale): string {
  return locale === "en" ? unit.taglineEn : unit.tagline;
}

export function unitDescription(unit: Unit, locale: Locale): string {
  return locale === "en" ? unit.descriptionEn : unit.description;
}

export function amenityLabel(amenity: Amenity, locale: Locale): string {
  return locale === "en" ? amenity.labelEn : amenity.label;
}
