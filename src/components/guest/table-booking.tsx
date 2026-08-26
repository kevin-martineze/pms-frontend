"use client";

import * as React from "react";
import { toast } from "sonner";
import { CalendarDays, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, toIsoDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Reserva de mesa del sports bar.
 *
 * Las franjas se muestran todas, con las llenas deshabilitadas en vez de
 * ocultas. Ver que las 20:00 están tomadas y las 19:00 libres es lo que hace que
 * alguien cambie de hora en vez de irse; una lista que sólo muestra lo
 * disponible parece un local vacío o roto.
 */

const SLOTS = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
const PARTY_SIZES = ["2", "3", "4", "5", "6", "8", "10", "12"];

/** Ocupación simulada, estable por fecha. */
function fullSlots(date: string): Set<string> {
  let h = 0;
  for (let i = 0; i < date.length; i++) h = (h * 31 + date.charCodeAt(i)) >>> 0;
  const out = new Set<string>();
  if (h % 3 === 0) out.add("20:00");
  if (h % 4 === 0) out.add("21:00");
  return out;
}

export function TableBooking() {
  const { t, intlTag, dateLocale } = useI18n();

  const [date, setDate] = React.useState<Date | undefined>();
  const [slot, setSlot] = React.useState<string | null>(null);
  const [people, setPeople] = React.useState("4");
  const [open, setOpen] = React.useState(false);

  const iso = date ? toIsoDate(date) : null;
  const full = iso ? fullSlots(iso) : new Set<string>();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(t.sportsBar.table.confirmed, {
      description: t.sportsBar.table.confirmedBody(people, formatDate(iso!, intlTag), slot!),
    });
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="display-sm text-lg">{t.sportsBar.table.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t.sportsBar.table.lead}</p>

      <div className="mt-4 grid gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-secondary"
            >
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {t.sportsBar.table.day}
                </span>
                <span className="block text-sm">
                  {iso ? (
                    formatDate(iso, intlTag)
                  ) : (
                    <span className="text-muted-foreground">{t.sportsBar.table.pickDay}</span>
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
                setSlot(null);
                setOpen(false);
              }}
              disabled={{ before: new Date() }}
              className="p-3 [--cell-size:--spacing(9)]"
            />
          </PopoverContent>
        </Popover>

        <div className="grid gap-2">
          <Label
            htmlFor="people"
            className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground"
          >
            {t.sportsBar.table.people}
          </Label>
          <Select value={people} onValueChange={setPeople}>
            <SelectTrigger id="people" className="w-full">
              <Users className="size-4 text-muted-foreground" aria-hidden />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PARTY_SIZES.map((n) => (
                <SelectItem key={n} value={n}>
                  {t.sportsBar.table.peopleCount(Number(n))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <fieldset className="mt-4" disabled={!iso}>
        <legend className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
          {t.sportsBar.table.time}
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SLOTS.map((time) => {
            const taken = full.has(time);
            return (
              <button
                key={time}
                type="button"
                disabled={taken || !iso}
                aria-pressed={slot === time}
                onClick={() => setSlot(time)}
                className={cn(
                  "tnum rounded-lg border px-2 py-2 text-sm transition-colors",
                  slot === time
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-secondary",
                  (taken || !iso) &&
                    "cursor-not-allowed border-dashed text-muted-foreground/60 line-through hover:bg-transparent",
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-3">
        <Input
          name="name"
          placeholder={t.sportsBar.table.yourName}
          required
          aria-label={t.sportsBar.table.yourName}
        />
        <Input
          name="phone"
          type="tel"
          placeholder={t.common.whatsapp}
          required
          aria-label={t.common.whatsapp}
        />
      </div>

      <Button type="submit" size="lg" className="mt-4 w-full" disabled={!iso || !slot}>
        {!iso
          ? t.sportsBar.table.pickDay
          : !slot
            ? t.sportsBar.table.pickTime
            : t.sportsBar.table.submit(slot)}
      </Button>
    </form>
  );
}
