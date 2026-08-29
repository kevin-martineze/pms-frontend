import type { Metadata } from "next";
import { lang } from "next/root-params";

import { BookingRequest } from "@/components/guest/booking-request";
import { SiteHeader } from "@/components/guest/site-header";
import { ApiError } from "@/lib/api/client";
import {
  getPublicAvailability,
  getPublicProperty,
  type PublicAvailability,
} from "@/lib/api/public";
import { getDictionary, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.bookRequest.metaTitle, robots: { index: false } };
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Solicitud de reserva, sobre el inventario y los precios reales de la API.
 *
 * Reemplazó a `/book/[slug]`, que leía habitaciones inventadas y simulaba el
 * envío con un `setTimeout`. Aquella pantalla no podía existir junto a esta:
 * dos formularios de reserva, uno real y otro no, es la forma más rápida de que
 * alguien pruebe el que no guarda nada y crea que el sistema funciona.
 *
 * Las fechas llegan por la URL, así que el servidor resuelve la disponibilidad
 * antes de pintar: no hay un salto de "buscando…" a "no hay nada".
 */
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const params = await searchParams;

  const property = await getPublicProperty();

  let availability: PublicAvailability | null = null;
  let rangeError: string | null = null;

  const hasRange = DATE.test(params.checkIn ?? "") && DATE.test(params.checkOut ?? "");
  if (hasRange) {
    try {
      availability = await getPublicAvailability({
        checkIn: params.checkIn!,
        checkOut: params.checkOut!,
        guests: Math.max(1, Number(params.guests ?? 2) || 2),
      });
    } catch (error) {
      /* El backend rechaza rangos inválidos con un mensaje escrito para leerse
         ("La salida debe ser posterior a la entrada"). Se muestra tal cual en
         vez de traducirlo acá: si algún día cambia la regla, cambia el mensaje
         en un solo lado. */
      rangeError =
        error instanceof ApiError ? error.message : t.bookRequest.genericError;
    }
  }

  return (
    <>
      <SiteHeader />
      {/* Un `div`, no otro `<main>`: el layout del sitio ya envuelve el
          contenido en uno, y dos `<main>` anidados son HTML inválido — un lector
          de pantalla anuncia dos contenidos principales en la misma página. */}
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
        <header>
          <p className="eyebrow text-muted-foreground">{property.name}</p>
          <h1 className="display-md mt-2 text-3xl md:text-4xl">{t.bookRequest.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{t.bookRequest.lead}</p>
        </header>

        <div className="mt-8">
          <BookingRequest
            availability={availability}
            currency={property.currency}
            checkInTime={property.checkIn}
            rangeError={rangeError}
          />
        </div>
      </div>
    </>
  );
}
