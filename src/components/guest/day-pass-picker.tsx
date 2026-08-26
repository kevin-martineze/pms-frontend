"use client";

import * as React from "react";
import { toast } from "sonner";
import { CalendarDays, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatDate, toIsoDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
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
const PRICES: Record<string, number> = { adult: 15, child: 8 };

/** Ocupación simulada del día, estable por fecha. */
function bookedOn(date: string): number {
  let h = 0;
  for (let i = 0; i < date.length; i++) h = (h * 31 + date.charCodeAt(i)) >>> 0;
  const weekday = new Date(date).getDay();
  const base = weekday === 0 || weekday === 6 ? 34 : 12;
  return base + (h % 18);
}

export function DayPassPicker() {
  const { t, intlTag, dateLocale } = useI18n();

  const [date, setDate] = React.useState<Date | undefined>();
  const [counts, setCounts] = React.useState<Record<string, number>>({ adult: 2, child: 0 });
  const [open, setOpen] = React.useState(false);

  const tiers = [
    { id: "adult", label: t.poolClub.pass.adult, hint: t.poolClub.pass.adultHint },
    { id: "child", label: t.poolClub.pass.child, hint: t.poolClub.pass.childHint },
  ];

  const iso = date ? toIsoDate(date) : null;
  const left = iso ? CAPACITY - bookedOn(iso) : null;
  const guests = counts.adult + counts.child;
  const total = tiers.reduce((acc, tier) => acc + PRICES[tier.id] * counts[tier.id], 0);
  const overCapacity = left !== null && guests > left;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="display-sm text-lg">{t.poolClub.pass.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t.poolClub.pass.lead}</p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-secondary"
          >
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span>
              <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t.poolClub.pass.day}
              </span>
              <span className="block text-sm">
                {iso ? (
                  formatDate(iso, intlTag)
                ) : (
                  <span className="text-muted-foreground">{t.poolClub.pass.pickDay}</span>
                )}
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={dateLocale}
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
        {tiers.map((tier, index) => (
          <React.Fragment key={tier.id}>
            {index > 0 && <Separator />}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  {tier.label} · ${PRICES[tier.id]}
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
                  <span className="sr-only">{`${t.common.remove} — ${tier.label}`}</span>
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
                  <span className="sr-only">{`${t.common.add} — ${tier.label}`}</span>
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
            overCapacity ? "text-destructive" : left <= 12 ? "text-terracotta" : "text-muted-foreground",
          )}
        >
          {overCapacity
            ? t.poolClub.pass.overCapacity(left)
            : left <= 12
              ? t.poolClub.pass.spotsLow(left)
              : t.poolClub.pass.spotsLeft(left, CAPACITY)}
        </p>
      )}

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-sm text-muted-foreground">{t.common.people(guests)}</span>
        <span className="tnum text-xl font-medium">${total}</span>
      </div>

      <Button
        size="lg"
        className="mt-4 w-full"
        disabled={!iso || guests === 0 || overCapacity}
        onClick={() =>
          toast.success(t.poolClub.pass.confirmed, {
            description: t.poolClub.pass.confirmedBody(guests, formatDate(iso!, intlTag)),
          })
        }
      >
        {!iso
          ? t.poolClub.pass.pickDay
          : overCapacity
            ? t.poolClub.pass.noRoom
            : t.poolClub.pass.reserve(`$${total}`)}
      </Button>
    </div>
  );
}
