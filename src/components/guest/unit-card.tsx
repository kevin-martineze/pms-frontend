import Image from "next/image";
import Link from "next/link";
import { Accessibility, Bath, BedDouble, Maximize, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AmenityIcon } from "@/components/guest/amenity-icon";
import { amenityById, properties } from "@/lib/mock/property";
import { formatMoney } from "@/lib/format";
import type { Unit } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * La tarjeta del listado.
 *
 * Muestra tarifa, capacidad y tres amenidades — no todas. Una tarjeta con
 * catorce iconos no comunica más que una con tres; comunica menos, porque
 * ninguno destaca. La lista completa vive en la ficha de la unidad.
 */
export function UnitCard({
  unit,
  nights,
  className,
  priority = false,
}: {
  unit: Unit;
  nights?: number;
  className?: string;
  priority?: boolean;
}) {
  const property = properties.find((p) => p.id === unit.propertyId);
  const highlights = unit.amenityIds
    .map((id) => amenityById.get(id))
    .filter((a) => a !== undefined)
    .filter((a) => ["sea-view", "pool", "kitchen", "terrace", "garden", "air-con", "workspace"].includes(a.id))
    .slice(0, 3);

  const total = nights ? { ...unit.basePrice, amountMinor: unit.basePrice.amountMinor * nights } : null;

  return (
    <Link
      href={`/stays/${unit.slug}`}
      className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <article className={cn("flex h-full flex-col", className)}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={unit.photos[0].src}
            alt={unit.photos[0].alt}
            fill
            sizes="(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />

          {unit.inventoryCount > 1 && (
            <Badge
              variant="secondary"
              className="absolute left-3 top-3 bg-background/90 backdrop-blur"
            >
              {unit.inventoryCount} disponibles
            </Badge>
          )}

          {unit.accessibility.stepFreeAccess && (
            <span
              className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-background/90 backdrop-blur"
              title="Acceso sin escalones"
            >
              <Accessibility className="size-4 text-palm" aria-hidden />
              <span className="sr-only">Acceso sin escalones</span>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="display-sm text-lg">{unit.name}</h3>
            {property && property.minutesFromHotel > 0 && (
              <span className="shrink-0 text-xs text-muted-foreground">
                a {property.minutesFromHotel} min
              </span>
            )}
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{unit.tagline}</p>

          <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              <dt className="sr-only">Capacidad</dt>
              <dd>{unit.capacity.guests}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="size-3.5" aria-hidden />
              <dt className="sr-only">Camas</dt>
              <dd>{unit.capacity.beds}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="size-3.5" aria-hidden />
              <dt className="sr-only">Baños</dt>
              <dd>{unit.capacity.baths}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="size-3.5" aria-hidden />
              <dt className="sr-only">Superficie</dt>
              <dd>{unit.sizeSqm} m²</dd>
            </div>
          </dl>

          {highlights.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {highlights.map((amenity) => (
                <li
                  key={amenity.id}
                  className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[0.7rem] text-secondary-foreground"
                >
                  <AmenityIcon name={amenity.icon} className="size-3" />
                  {amenity.label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <p>
              <span className="text-lg font-medium">{formatMoney(unit.basePrice)}</span>
              <span className="text-sm text-muted-foreground"> / noche</span>
            </p>
            {total && (
              <p className="text-right text-xs text-muted-foreground">
                {formatMoney(total)} por {nights} noches
                <br />
                <span className="text-[0.68rem]">antes de impuestos</span>
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
