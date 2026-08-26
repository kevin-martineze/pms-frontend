import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarOff, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/guest/search-bar";
import { SiteHeader } from "@/components/guest/site-header";
import { StaysFilters } from "@/components/guest/stays-filters";
import { UnitCard } from "@/components/guest/unit-card";
import { availabilityFor } from "@/lib/availability";
import { diffNights, formatDate, parseIsoDate, pluralNights } from "@/lib/format";
import { properties, units } from "@/lib/mock/property";
import type { Unit } from "@/lib/domain/types";

export const metadata: Metadata = {
  title: "Alojamiento",
  description:
    "Habitaciones del hotel y casas completas en David, Chiriquí. Disponibilidad en vivo y reserva directa.",
};

type Search = {
  in?: string;
  out?: string;
  adults?: string;
  children?: string;
  kind?: string;
  sort?: string;
  accessible?: string;
  amenities?: string;
};

export default async function StaysPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;

  const checkIn = params.in;
  const checkOut = params.out;
  const hasDates = Boolean(checkIn && checkOut && checkIn < checkOut);
  const nights = hasDates ? diffNights(checkIn!, checkOut!) : undefined;
  const guests = Number(params.adults ?? "2") + Number(params.children ?? "0");

  const wanted = new Set((params.amenities ?? "").split(",").filter(Boolean));

  const results: Unit[] = units.filter((unit) => {
    if (params.kind) {
      const property = properties.find((p) => p.id === unit.propertyId);
      if (property?.kind !== params.kind) return false;
    }
    if (params.accessible === "1" && !unit.accessibility.stepFreeAccess) return false;
    if (wanted.size > 0 && ![...wanted].every((id) => unit.amenityIds.includes(id))) return false;
    if (guests > unit.capacity.guests) return false;
    return true;
  });

  /* La disponibilidad se resuelve contra las mismas reservas que dibuja el
     calendario del PMS. Las unidades sin cupo no se esconden: se muestran
     apagadas y al final. Ocultarlas hace que el huésped crea que no existen y
     escriba por WhatsApp preguntando por ellas. */
  const withAvailability = results.map((unit) => ({
    unit,
    availability: hasDates ? availabilityFor(unit, checkIn!, checkOut!) : null,
  }));

  const sorted = [...withAvailability].sort((a, b) => {
    const aOut = a.availability ? a.availability.unitsLeft === 0 : false;
    const bOut = b.availability ? b.availability.unitsLeft === 0 : false;
    if (aOut !== bOut) return aOut ? 1 : -1;

    switch (params.sort) {
      case "price-asc":
        return a.unit.basePrice.amountMinor - b.unit.basePrice.amountMinor;
      case "price-desc":
        return b.unit.basePrice.amountMinor - a.unit.basePrice.amountMinor;
      case "capacity":
        return b.unit.capacity.guests - a.unit.capacity.guests;
      default:
        return Number(b.unit.featured) - Number(a.unit.featured);
    }
  });

  const availableCount = sorted.filter(
    (row) => !row.availability || row.availability.unitsLeft > 0,
  ).length;

  return (
    <>
      <SiteHeader />

      <div className="shell pt-8 md:pt-12">
        <p className="eyebrow text-muted-foreground">Don Julius · David, Chiriquí</p>
        <h1 className="display-sm mt-2 text-[clamp(1.85rem,4vw,2.75rem)]">
          Elige dónde quedarte
        </h1>

        <div className="mt-6">
          <SearchBar
            variant="inline"
            defaultAdults={Number(params.adults ?? "2")}
            defaultChildren={Number(params.children ?? "0")}
            defaultRange={
              hasDates
                ? { from: parseIsoDate(checkIn!), to: parseIsoDate(checkOut!) }
                : undefined
            }
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          {hasDates ? (
            <>
              <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
                {formatDate(checkIn!)} → {formatDate(checkOut!)}
              </Badge>
              <span className="text-muted-foreground">
                {pluralNights(nights!)} · {guests} {guests === 1 ? "huésped" : "huéspedes"} ·{" "}
                <strong className="font-medium text-foreground">{availableCount}</strong> con
                disponibilidad
              </span>
            </>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Info className="size-4" aria-hidden />
              Elige fechas para ver disponibilidad y precio real de esas noches.
            </span>
          )}
        </div>

        <div className="mt-6 border-y border-border py-4">
          <Suspense fallback={<Skeleton className="h-10 w-full max-w-lg" />}>
            <StaysFilters resultCount={sorted.length} />
          </Suspense>
        </div>
      </div>

      <div className="shell pb-8 pt-10">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map(({ unit, availability }, index) => {
              const soldOut = availability?.unitsLeft === 0;
              return (
                <div key={unit.id} className="relative">
                  <UnitCard
                    unit={unit}
                    nights={nights}
                    priority={index < 3}
                    className={soldOut ? "opacity-45 grayscale" : undefined}
                  />

                  {availability && (
                    <p className="mt-2 text-xs">
                      {soldOut ? (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <CalendarOff className="size-3.5" aria-hidden />
                          Sin disponibilidad en esas fechas
                        </span>
                      ) : availability.unitsLeft <= 1 ? (
                        <span className="font-medium text-terracotta">
                          Queda 1 — última disponible
                        </span>
                      ) : (
                        <span className="text-status-vacant-clean">
                          {availability.unitsLeft} disponibles
                        </span>
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border py-16 text-center">
      <p className="display-sm text-lg">Nada calza con esos filtros</p>
      <p className="mt-2 px-8 text-sm text-muted-foreground">
        Prueba con menos filtros o menos huéspedes. Si buscas para un grupo grande,
        escríbenos: podemos abrir dos unidades contiguas.
      </p>
    </div>
  );
}
