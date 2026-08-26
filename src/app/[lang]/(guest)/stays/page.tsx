import { Suspense } from "react";
import type { Metadata } from "next";
import { lang } from "next/root-params";
import { CalendarOff, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/guest/search-bar";
import { SiteHeader } from "@/components/guest/site-header";
import { StaysFilters } from "@/components/guest/stays-filters";
import { UnitCard } from "@/components/guest/unit-card";
import { availabilityFor } from "@/lib/availability";
import { diffNights, formatDate, parseIsoDate } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { properties, units } from "@/lib/mock/property";
import type { Unit } from "@/lib/domain/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.stays.metaTitle, description: t.stays.metaDescription };
}

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
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

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
        <p className="eyebrow text-muted-foreground">{t.stays.eyebrow}</p>
        <h1 className="display-sm mt-2 text-[clamp(1.85rem,4vw,2.75rem)]">{t.stays.title}</h1>

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
                {formatDate(checkIn!, tag)} → {formatDate(checkOut!, tag)}
              </Badge>
              <span className="text-muted-foreground">
                {t.common.nights(nights!)} · {t.common.guests(guests)} ·{" "}
                <strong className="font-medium text-foreground">{availableCount}</strong>{" "}
                {t.stays.withAvailability}
              </span>
            </>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Info className="size-4" aria-hidden />
              {t.stays.pickDatesHint}
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
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="display-sm text-lg">{t.stays.emptyTitle}</p>
            <p className="mt-2 px-8 text-sm text-muted-foreground">{t.stays.emptyBody}</p>
          </div>
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
                          {t.stays.soldOut}
                        </span>
                      ) : availability.unitsLeft <= 1 ? (
                        <span className="font-medium text-terracotta">{t.stays.lastOne}</span>
                      ) : (
                        <span className="text-status-vacant-clean">
                          {t.stays.unitsLeft(availability.unitsLeft)}
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
