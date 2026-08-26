"use client";

import * as React from "react";
import { toast } from "sonner";
import { es } from "date-fns/locale";
import { CalendarDays, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatDate, toIsoDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Pases de día del pool club.
 *
 * El aforo es lo que hace que esto valga la pena venderlo online: sin cupo
 * declarado, un sábado de temporada la piscina se llena de gente que pagó y no
 * cabe. El contador de disponibilidad no es adorno — es el motivo por el que un
 * pase se vende por adelantado en vez de en la puerta.
 */

const CAPACITY = 60;

const TIERS = [
  {
    id: "adult",
    label: "Adulto",
    hint: "13 años en adelante",
    price: 15,
  },
  {
    id: "child",
    label: "Niño",
    hint: "4 a 12 años · menores de 4 entran gratis",
    price: 8,
  },
];

/** Ocupación simulada del día, estable por fecha. */
function bookedOn(date: string): number {
  let h = 0;
  for (let i = 0; i < date.length; i++) h = (h * 31 + date.charCodeAt(i)) >>> 0;
  const weekday = new Date(date).getDay();
  const base = weekday === 0 || weekday === 6 ? 34 : 12;
  return base + (h % 18);
}

export function DayPassPicker() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [counts, setCounts] = React.useState<Record<string, number>>({ adult: 2, child: 0 });
  const [open, setOpen] = React.useState(false);

  const iso = date ? toIsoDate(date) : null;
  const booked = iso ? bookedOn(iso) : 0;
  const left = iso ? CAPACITY - booked : null;
  const guests = counts.adult + counts.child;
  const total = TIERS.reduce((acc, tier) => acc + tier.price * counts[tier.id], 0);
  const overCapacity = left !== null && guests > left;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="display-sm text-lg">Pase de día</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Piscina, canchas y tumbonas de 9:00 a 18:00. Los huéspedes del hotel entran sin costo.
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-secondary"
          >
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span>
              <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Día
              </span>
              <span className="block text-sm">
                {iso ? formatDate(iso) : <span className="text-muted-foreground">Elige el día</span>}
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={es}
            selected={date}
            onSelect={(next) => {
              setDate(next);
              setOpen(false);
            }}
            disabled={{ before: new Date() }}
            className="p-3 [--cell-size:--spacing(9)]"
          />
        </PopoverContent>
      </Popover>

      <div className="mt-3 rounded-xl border border-border">
        {TIERS.map((tier, index) => (
          <React.Fragment key={tier.id}>
            {index > 0 && <Separator />}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  {tier.label} · ${tier.price}
                </p>
                <p className="text-xs text-muted-foreground">{tier.hint}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full"
                  disabled={counts[tier.id] <= 0}
                  onClick={() => setCounts((c) => ({ ...c, [tier.id]: c[tier.id] - 1 }))}
                >
                  <Minus className="size-3.5" aria-hidden />
                  <span className="sr-only">Quitar {tier.label}</span>
                </Button>
                <span className="tnum w-7 text-center text-sm">{counts[tier.id]}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={() => setCounts((c) => ({ ...c, [tier.id]: c[tier.id] + 1 }))}
                >
                  <Plus className="size-3.5" aria-hidden />
                  <span className="sr-only">Agregar {tier.label}</span>
                </Button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {left !== null && (
        <p
          className={cn(
            "mt-3 text-xs",
            overCapacity
              ? "text-destructive"
              : left <= 12
                ? "text-terracotta"
                : "text-muted-foreground",
          )}
        >
          {overCapacity
            ? `Sólo quedan ${left} cupos para ese día.`
            : left <= 12
              ? `Quedan ${left} cupos de ${CAPACITY}.`
              : `${left} cupos disponibles de ${CAPACITY}.`}
        </p>
      )}

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          {guests} {guests === 1 ? "persona" : "personas"}
        </span>
        <span className="tnum text-xl font-medium">${total}</span>
      </div>

      <Button
        size="lg"
        className="mt-4 w-full"
        disabled={!iso || guests === 0 || overCapacity}
        onClick={() =>
          toast.success("Pases reservados", {
            description: `${guests} ${guests === 1 ? "pase" : "pases"} para el ${formatDate(iso!)}. Te llega el código por WhatsApp.`,
          })
        }
      >
        {!iso ? "Elige el día" : overCapacity ? "Sin cupo suficiente" : `Reservar por $${total}`}
      </Button>
    </div>
  );
}
