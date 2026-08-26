"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { es } from "date-fns/locale";
import { CalendarDays, Minus, Plus, Search, Users } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { diffNights, formatDateShort, pluralNights, toIsoDate } from "@/lib/format";

/**
 * La barra de búsqueda.
 *
 * Es la interacción que define el producto: si esto se siente pesado, el resto
 * del sitio no importa. Tres decisiones detrás de cómo está hecha:
 *
 * 1. Un solo calendario de dos meses para entrada y salida. Dos campos separados
 *    obligan a abrir, cerrar y volver a abrir; el rango se elige de un tirón.
 * 2. El contador de huéspedes es +/-, no un `<select>` de 1 a 10. En móvil un
 *    select abre una rueda nativa que tapa media pantalla.
 * 3. El estado vive en la URL al buscar. Un resultado filtrado se puede
 *    compartir por WhatsApp, que es exactamente como Julius va a mandar
 *    disponibilidad a un huésped.
 */

type Props = {
  className?: string;
  variant?: "hero" | "inline";
  defaultRange?: DateRange;
  defaultAdults?: number;
  defaultChildren?: number;
};

export function SearchBar({
  className,
  variant = "hero",
  defaultRange,
  defaultAdults = 2,
  defaultChildren = 0,
}: Props) {
  const router = useRouter();
  const [range, setRange] = React.useState<DateRange | undefined>(defaultRange);
  const [adults, setAdults] = React.useState(defaultAdults);
  const [children, setChildren] = React.useState(defaultChildren);
  const [datesOpen, setDatesOpen] = React.useState(false);

  const nights =
    range?.from && range?.to ? diffNights(toIsoDate(range.from), toIsoDate(range.to)) : 0;

  function submit() {
    const params = new URLSearchParams();
    if (range?.from) params.set("in", toIsoDate(range.from));
    if (range?.to) params.set("out", toIsoDate(range.to));
    params.set("adults", String(adults));
    if (children > 0) params.set("children", String(children));
    router.push(`/stays?${params.toString()}`);
  }

  const hero = variant === "hero";

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-lg shadow-black/5 md:flex-row md:items-center md:rounded-full md:p-1.5",
        hero && "md:shadow-xl md:shadow-black/10",
        className,
      )}
    >
      <Popover open={datesOpen} onOpenChange={setDatesOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-secondary md:rounded-full"
          >
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Fechas
              </span>
              <span className="block truncate text-sm">
                {range?.from && range?.to ? (
                  <>
                    {formatDateShort(toIsoDate(range.from))} — {formatDateShort(toIsoDate(range.to))}
                    <span className="ml-2 text-muted-foreground">{pluralNights(nights)}</span>
                  </>
                ) : range?.from ? (
                  <>
                    {formatDateShort(toIsoDate(range.from))}
                    <span className="ml-2 text-muted-foreground">elige la salida</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">¿Cuándo llegas?</span>
                )}
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            locale={es}
            numberOfMonths={2}
            selected={range}
            onSelect={(next) => {
              setRange(next);
              if (next?.from && next?.to) setDatesOpen(false);
            }}
            disabled={{ before: new Date() }}
            className="p-3 [--cell-size:--spacing(9)]"
          />
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>Mínimo 1 noche · Check-in desde las 15:00</span>
            <Button variant="ghost" size="sm" onClick={() => setRange(undefined)}>
              Limpiar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="hidden h-9 md:block" />

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-secondary md:min-w-[11rem] md:rounded-full"
          >
            <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span>
              <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Huéspedes
              </span>
              <span className="block text-sm">
                {adults + children} {adults + children === 1 ? "persona" : "personas"}
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-2">
          <Stepper
            label="Adultos"
            hint="13 años o más"
            value={adults}
            min={1}
            max={12}
            onChange={setAdults}
          />
          <Separator className="my-1" />
          <Stepper
            label="Niños"
            hint="Menores de 13 años"
            value={children}
            min={0}
            max={8}
            onChange={setChildren}
          />
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Cuna disponible sin costo en las habitaciones familiares.
          </p>
        </PopoverContent>
      </Popover>

      <Button
        size={hero ? "lg" : "default"}
        onClick={submit}
        className={cn("gap-2 md:rounded-full", hero && "md:px-7")}
      >
        <Search className="size-4" aria-hidden />
        Ver disponibilidad
      </Button>
    </div>
  );
}

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2.5">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="size-3.5" aria-hidden />
          <span className="sr-only">Quitar un {label.toLowerCase()}</span>
        </Button>
        <span className="tnum w-7 text-center text-sm">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-3.5" aria-hidden />
          <span className="sr-only">Agregar un {label.toLowerCase()}</span>
        </Button>
      </div>
    </div>
  );
}
