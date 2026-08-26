"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Minus, Plus, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { composeQuote } from "@/lib/quote";
import { formatDateShort, formatMoney, parseIsoDate, toIsoDate } from "@/lib/format";
import { withLocale } from "@/lib/i18n/paths";
import { useI18n } from "@/lib/i18n/provider";
import type { IsoDate } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * El panel de reserva de la ficha de unidad.
 *
 * Recalcula el total en el navegador mientras el huésped mueve las fechas, sin
 * ida y vuelta al servidor. Eso importa más de lo que parece: el momento en que
 * alguien decide reservar es el momento en que está probando combinaciones de
 * fechas, y cada espera de medio segundo ahí es una oportunidad de irse a
 * Booking a hacer lo mismo.
 *
 * Las tarifas llegan precalculadas desde el servidor — noche por noche, con
 * temporada y fin de semana ya aplicados — así que el cliente sólo suma.
 */

type Props = {
  unitId: string;
  unitSlug: string;
  unitName: string;
  maxGuests: number;
  basePriceLabel: string;
  cleaningFee: number;
  rates: Record<IsoDate, number>;
  blockedDates: IsoDate[];
  unitsLeft: number | null;
  defaultRange?: { from: IsoDate; to: IsoDate };
};

export function BookingPanel({
  unitId,
  unitSlug,
  unitName,
  maxGuests,
  basePriceLabel,
  cleaningFee,
  rates,
  blockedDates,
  unitsLeft,
  defaultRange,
}: Props) {
  const router = useRouter();
  const { t, locale, intlTag, dateLocale } = useI18n();

  const [range, setRange] = React.useState<DateRange | undefined>(
    defaultRange
      ? { from: parseIsoDate(defaultRange.from), to: parseIsoDate(defaultRange.to) }
      : undefined,
  );
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const blocked = React.useMemo(() => blockedDates.map(parseIsoDate), [blockedDates]);

  const quote = React.useMemo(() => {
    if (!range?.from || !range?.to) return null;
    return composeQuote({
      unitId,
      unitName,
      rates,
      checkIn: toIsoDate(range.from),
      checkOut: toIsoDate(range.to),
      guests: adults + children,
      cleaningFee,
      directDiscount: true,
      labels: t.booking.line,
    });
  }, [range, unitId, unitName, rates, adults, children, cleaningFee, t]);

  function goToCheckout() {
    if (!range?.from || !range?.to) {
      setOpen(true);
      return;
    }
    const params = new URLSearchParams({
      in: toIsoDate(range.from),
      out: toIsoDate(range.to),
      adults: String(adults),
    });
    if (children > 0) params.set("children", String(children));
    router.push(withLocale(locale, `/book/${unitSlug}?${params.toString()}`));
  }

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm md:sticky md:top-24">
      <div className="flex items-baseline justify-between gap-3">
        <p>
          <span className="text-2xl font-medium">{basePriceLabel}</span>
          <span className="text-sm text-muted-foreground"> / {t.common.night}</span>
        </p>
        {unitsLeft !== null && unitsLeft <= 1 && unitsLeft > 0 && (
          <Badge variant="secondary" className="bg-terracotta/12 text-terracotta">
            {t.booking.oneLeft}
          </Badge>
        )}
      </div>

      <div className="mt-4 grid gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-secondary"
            >
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0">
                <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {t.booking.checkInOut}
                </span>
                <span className="block truncate text-sm">
                  {range?.from && range?.to ? (
                    `${formatDateShort(toIsoDate(range.from), intlTag)} — ${formatDateShort(toIsoDate(range.to), intlTag)}`
                  ) : (
                    <span className="text-muted-foreground">{t.booking.pickDates}</span>
                  )}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              locale={dateLocale}
              numberOfMonths={1}
              selected={range}
              onSelect={(next) => {
                setRange(next);
                if (next?.from && next?.to) setOpen(false);
              }}
              /* Las noches ya vendidas se deshabilitan en vez de dejarse
                 elegibles con un error después. Mostrar una fecha que no se
                 puede honrar es peor que no mostrarla. */
              disabled={[{ before: new Date() }, ...blocked]}
              modifiers={{ booked: blocked }}
              modifiersClassNames={{ booked: "line-through opacity-40" }}
              className="p-3 [--cell-size:--spacing(9)]"
            />
            <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
              {t.booking.bookedDatesNote}
            </p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-secondary"
            >
              <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {t.search.guests}
                </span>
                <span className="block text-sm">
                  {t.booking.guestsOf(adults + children, maxGuests)}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-2">
            <Row
              label={t.common.adults}
              value={adults}
              min={1}
              max={maxGuests - children}
              onChange={setAdults}
              addLabel={t.common.add}
              removeLabel={t.common.remove}
            />
            <Separator className="my-1" />
            <Row
              label={t.common.children}
              value={children}
              min={0}
              max={maxGuests - adults}
              onChange={setChildren}
              addLabel={t.common.add}
              removeLabel={t.common.remove}
            />
          </PopoverContent>
        </Popover>
      </div>

      {quote ? (
        <>
          <dl className="mt-5 space-y-2.5 text-sm">
            {quote.lines.map((line) => (
              <div key={line.label} className="flex items-start justify-between gap-4">
                <dt
                  className={cn(
                    "text-muted-foreground",
                    line.kind === "discount" && "text-status-vacant-clean",
                  )}
                >
                  {line.label}
                </dt>
                <dd
                  className={cn(
                    "tnum shrink-0",
                    line.kind === "discount" && "text-status-vacant-clean",
                  )}
                >
                  {formatMoney(line.amount, intlTag)}
                </dd>
              </div>
            ))}
          </dl>

          <Separator className="my-4" />

          <div className="flex items-baseline justify-between gap-4">
            <span className="font-medium">{t.common.total}</span>
            <span className="tnum text-xl font-medium">{formatMoney(quote.total, intlTag)}</span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {t.booking.payNow(formatMoney(quote.dueNow, intlTag))}
          </p>
        </>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">{t.booking.noQuoteYet}</p>
      )}

      <Button size="lg" className="mt-5 w-full" onClick={goToCheckout}>
        {quote ? t.booking.continue : t.booking.pickDatesCta}
      </Button>

      <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 shrink-0 text-palm" aria-hidden />
          {t.booking.freeCancellation}
        </li>
        <li className="flex items-center gap-2">
          <Sparkles className="size-3.5 shrink-0 text-palm" aria-hidden />
          {t.booking.cheaperThanOta}
        </li>
      </ul>
    </aside>
  );
}

function Row({
  label,
  value,
  min,
  max,
  onChange,
  addLabel,
  removeLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  addLabel: string;
  removeLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="size-3.5" aria-hidden />
          <span className="sr-only">{`${removeLabel} — ${label}`}</span>
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
          <span className="sr-only">{`${addLabel} — ${label}`}</span>
        </Button>
      </span>
    </div>
  );
}
