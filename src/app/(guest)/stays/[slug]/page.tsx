import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accessibility,
  Bath,
  BedDouble,
  ChevronLeft,
  Clock,
  Maximize,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AmenityIcon } from "@/components/guest/amenity-icon";
import { BookingPanel } from "@/components/guest/booking-panel";
import { Gallery } from "@/components/guest/gallery";
import { SiteHeader } from "@/components/guest/site-header";
import { UnitCard } from "@/components/guest/unit-card";
import { availabilityFor, blockedDatesAhead, nightlyRate } from "@/lib/availability";
import { addDays, formatMoney, toIsoDate } from "@/lib/format";
import { amenityById, properties, unitBySlug, units } from "@/lib/mock/property";
import type { AmenityGroup, IsoDate } from "@/lib/domain/types";

const GROUP_LABEL: Record<AmenityGroup, string> = {
  essentials: "Lo esencial",
  kitchen: "Cocina",
  bathroom: "Baño",
  outdoor: "Exteriores",
  entertainment: "Entretenimiento",
  accessibility: "Accesibilidad",
};

export function generateStaticParams() {
  return units.map((unit) => ({ slug: unit.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const unit = unitBySlug.get(slug);
  if (!unit) return {};
  return { title: unit.name, description: unit.tagline };
}

export default async function UnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ in?: string; out?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  const unit = unitBySlug.get(slug);
  if (!unit) notFound();

  const property = properties.find((p) => p.id === unit.propertyId);

  /* Tarifas de los próximos cuatro meses, noche por noche, con temporada y fin
     de semana ya aplicados. Se calculan en el servidor y viajan como tabla para
     que el panel recalcule el total sin volver a pedir nada. */
  const today = toIsoDate(new Date());
  const rates: Record<IsoDate, number> = {};
  for (let i = 0; i < 150; i++) {
    const date = addDays(today, i);
    rates[date] = Math.round(nightlyRate(unit, date) * 100) / 100;
  }

  const blocked = blockedDatesAhead(unit);
  const hasDates = Boolean(query.in && query.out && query.in < query.out);
  const availability = hasDates ? availabilityFor(unit, query.in!, query.out!) : null;

  const grouped = new Map<AmenityGroup, { id: string; label: string; icon: string }[]>();
  for (const id of unit.amenityIds) {
    const amenity = amenityById.get(id);
    if (!amenity) continue;
    const list = grouped.get(amenity.group) ?? [];
    list.push(amenity);
    grouped.set(amenity.group, list);
  }

  const similar = units.filter((u) => u.id !== unit.id && u.propertyId === unit.propertyId).slice(0, 3);

  return (
    <>
      <SiteHeader />

      <div className="shell pt-6">
        <Link
          href="/stays"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Volver al listado
        </Link>
      </div>

      <div className="shell mt-5">
        <Gallery photos={unit.photos} />
      </div>

      <div className="shell mt-10 grid items-start gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {property && (
              <Badge variant="secondary" className="rounded-full">
                {property.kind === "villa" ? "Casa completa" : "Habitación de hotel"}
              </Badge>
            )}
            {unit.inventoryCount > 1 && (
              <Badge variant="outline" className="rounded-full">
                {unit.inventoryCount} unidades de este tipo
              </Badge>
            )}
            {unit.accessibility.stepFreeAccess && (
              <Badge variant="outline" className="gap-1.5 rounded-full">
                <Accessibility className="size-3.5" aria-hidden />
                Sin escalones
              </Badge>
            )}
          </div>

          <h1 className="display-sm mt-4 text-[clamp(1.85rem,4vw,2.75rem)]">{unit.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{unit.tagline}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Stat icon={<Users className="size-4" aria-hidden />} label="Capacidad" value={`${unit.capacity.guests} huéspedes`} />
            <Stat icon={<BedDouble className="size-4" aria-hidden />} label="Camas" value={unit.bedType} />
            <Stat icon={<Bath className="size-4" aria-hidden />} label="Baños" value={String(unit.capacity.baths)} />
            <Stat icon={<Maximize className="size-4" aria-hidden />} label="Superficie" value={`${unit.sizeSqm} m²`} />
          </dl>

          <Separator className="my-8" />

          <p className="max-w-2xl leading-relaxed">{unit.description}</p>

          <Separator className="my-8" />

          <h2 className="display-sm text-xl">Qué incluye</h2>
          <div className="mt-5 grid gap-7 sm:grid-cols-2">
            {[...grouped.entries()].map(([group, list]) => (
              <div key={group}>
                <p className="eyebrow text-muted-foreground">{GROUP_LABEL[group]}</p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {list.map((amenity) => (
                    <li key={amenity.id} className="flex items-center gap-2.5">
                      <AmenityIcon name={amenity.icon} className="size-4 shrink-0 text-palm" />
                      {amenity.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <h2 className="display-sm text-xl">Accesibilidad</h2>
          {/* Se declara aunque la respuesta sea "no". Una unidad que calla
              obliga al huésped a llamar para averiguar, y las normas de sistemas
              de reserva de EE. UU. esperan que pueda decidirlo desde la ficha. */}
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <Accessibility className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
              <span>
                {unit.accessibility.stepFreeAccess
                  ? "Acceso sin escalones desde el estacionamiento."
                  : "No tiene acceso sin escalones."}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Bath className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
              <span>
                {unit.accessibility.rollInShower
                  ? "Ducha con acceso para silla de ruedas."
                  : "La ducha no tiene acceso para silla de ruedas."}
              </span>
            </li>
            {unit.accessibility.notes && (
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                {unit.accessibility.notes}
              </li>
            )}
          </ul>

          <Separator className="my-8" />

          <h2 className="display-sm text-xl">Antes de reservar</h2>
          <dl className="mt-4 grid gap-5 text-sm sm:grid-cols-2">
            {[
              ["Check-in", "Desde las 15:00. Recepción abierta hasta las 22:00."],
              ["Check-out", "Hasta las 11:00. Guardamos equipaje sin costo."],
              ["Cancelación", "Gratis hasta 48 horas antes de la llegada."],
              ["Pago", "30% al reservar, el resto al llegar. Efectivo o tarjeta."],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="font-medium">{term}</dt>
                <dd className="mt-1 text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <BookingPanel
          unitId={unit.id}
          unitSlug={unit.slug}
          unitName={unit.name}
          maxGuests={unit.capacity.guests}
          basePriceLabel={formatMoney(unit.basePrice)}
          cleaningFee={unit.propertyId === "p-casas" ? 45 : 0}
          rates={rates}
          blockedDates={blocked}
          unitsLeft={availability?.unitsLeft ?? null}
          defaultRange={hasDates ? { from: query.in!, to: query.out! } : undefined}
        />
      </div>

      {similar.length > 0 && (
        <section className="shell mt-20">
          <h2 className="display-sm text-xl">Otras opciones</h2>
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((other) => (
              <UnitCard key={other.id} unit={other} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-muted-foreground">{icon}</span>
      <span>
        <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
        <dd className="mt-0.5">{value}</dd>
      </span>
    </div>
  );
}
