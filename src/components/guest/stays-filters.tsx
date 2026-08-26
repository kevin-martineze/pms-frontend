"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmenityIcon } from "@/components/guest/amenity-icon";
import { amenities } from "@/lib/mock/property";
import { amenityLabel } from "@/lib/i18n/content";
import { withLocale } from "@/lib/i18n/paths";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Filtros del listado.
 *
 * Todo el estado vive en `URLSearchParams`, no en `useState`. Eso da tres cosas
 * gratis que un estado local no da: el botón atrás del navegador funciona, un
 * refresh no pierde la selección, y la vista filtrada se puede pegar en un
 * WhatsApp — que es literalmente como el hotel va a mandar disponibilidad.
 */

/** Las que un huésped realmente filtra. El resto se lee en la ficha. */
const FILTERABLE = [
  "pool",
  "sea-view",
  "kitchen",
  "air-con",
  "terrace",
  "garden",
  "bbq",
  "washer",
  "workspace",
  "parking",
];

export function StaysFilters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const { t, locale } = useI18n();

  const kind = params.get("kind") ?? "";
  const sort = params.get("sort") ?? "recommended";
  const accessible = params.get("accessible") === "1";
  const selectedAmenities = React.useMemo(
    () => new Set((params.get("amenities") ?? "").split(",").filter(Boolean)),
    [params],
  );

  const kinds = [
    { value: "", label: t.stays.kindAll },
    { value: "hotel", label: t.stays.kindHotel },
    { value: "villa", label: t.stays.kindVilla },
  ];

  const sorts = [
    { value: "recommended", label: t.stays.sortRecommended },
    { value: "price-asc", label: t.stays.sortPriceAsc },
    { value: "price-desc", label: t.stays.sortPriceDesc },
    { value: "capacity", label: t.stays.sortCapacity },
  ];

  const activeCount = (kind ? 1 : 0) + (accessible ? 1 : 0) + selectedAmenities.size;

  function apply(mutate: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    router.replace(withLocale(locale, `/stays?${next.toString()}`), { scroll: false });
  }

  function setParam(key: string, value: string | null) {
    apply((next) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
  }

  function toggleAmenity(id: string) {
    const next = new Set(selectedAmenities);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setParam("amenities", next.size > 0 ? [...next].join(",") : null);
  }

  function clearAll() {
    apply((next) => {
      next.delete("kind");
      next.delete("accessible");
      next.delete("amenities");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5" role="group" aria-label={t.stays.filters}>
        {kinds.map((option) => (
          <button
            key={option.value || "all"}
            type="button"
            aria-pressed={kind === option.value}
            onClick={() => setParam("kind", option.value || null)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              kind === option.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-secondary",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2 rounded-full">
            <SlidersHorizontal className="size-4" aria-hidden />
            {t.stays.filters}
            {activeCount > 0 && (
              <Badge className="ml-0.5 size-5 justify-center rounded-full p-0 tabular-nums">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="display-sm text-left text-xl">{t.stays.filters}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <fieldset>
              <legend className="text-sm font-medium">{t.stays.accessibility}</legend>
              <div className="mt-3 flex items-start gap-3">
                <Checkbox
                  id="f-accessible"
                  checked={accessible}
                  onCheckedChange={(checked) => setParam("accessible", checked ? "1" : null)}
                />
                <Label htmlFor="f-accessible" className="grid gap-1 font-normal">
                  {t.stays.stepFree}
                  <span className="text-xs text-muted-foreground">{t.stays.stepFreeHint}</span>
                </Label>
              </div>
            </fieldset>

            <Separator className="my-6" />

            <fieldset>
              <legend className="text-sm font-medium">{t.stays.amenities}</legend>
              <div className="mt-3 grid gap-3">
                {amenities
                  .filter((a) => FILTERABLE.includes(a.id))
                  .map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`f-${amenity.id}`}
                        checked={selectedAmenities.has(amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                      />
                      <Label htmlFor={`f-${amenity.id}`} className="gap-2 font-normal">
                        <AmenityIcon name={amenity.icon} className="size-4 text-muted-foreground" />
                        {amenityLabel(amenity, locale)}
                      </Label>
                    </div>
                  ))}
              </div>
            </fieldset>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border p-4">
            <Button variant="ghost" onClick={clearAll} disabled={activeCount === 0}>
              {t.common.clearAll}
            </Button>
            {/* El contador es aria-live para que un lector de pantalla sepa que
                la lista cambió sin tener que salir del panel. */}
            <span aria-live="polite" className="text-sm text-muted-foreground">
              {t.stays.options(resultCount)}
            </span>
          </div>
        </SheetContent>
      </Sheet>

      {activeCount > 0 && (
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-full" onClick={clearAll}>
          <X className="size-3.5" aria-hidden />
          {t.common.clear}
        </Button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground sm:inline">{t.stays.sortBy}</span>
        <Select
          value={sort}
          onValueChange={(value) => setParam("sort", value === "recommended" ? null : value)}
        >
          <SelectTrigger className="w-[13rem] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sorts.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
