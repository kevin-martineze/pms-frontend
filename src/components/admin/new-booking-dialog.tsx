"use client";

import * as React from "react";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkAvailability, createBooking } from "@/lib/bookings/actions";
import { useI18n } from "@/lib/i18n/provider";
import { addDays, toIsoDate } from "@/lib/format";

/**
 * Carga de una reserva desde recepción.
 *
 * No se elige habitación: se elige TIPO, y el servidor asigna una unidad libre.
 * Es la regla que el schema documenta desde el principio — un hotel no vende
 * "la 302", vende "habitación doble", y dejar que recepción fije la habitación
 * a mano reintroduce a mano el problema que la asignación automática resuelve.
 *
 * La disponibilidad se consulta al cambiar tipo o fechas, para no llenar el
 * formulario entero y chocar con un rechazo al final. Es informativa: entre la
 * consulta y el guardado puede entrar otra reserva, y esa ventana la cierra la
 * base, no esta pantalla.
 */

type UnitTypeOption = {
  id: string;
  name: string;
  maxGuests: number;
  basePriceMinor: number;
};

export function NewBookingDialog({ unitTypes }: { unitTypes: UnitTypeOption[] }) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const s = t.admin.newBooking;

  const today = toIsoDate(new Date());
  const [unitTypeId, setUnitTypeId] = React.useState(unitTypes[0]?.id ?? "");
  const [checkIn, setCheckIn] = React.useState(today);
  const [checkOut, setCheckOut] = React.useState(addDays(today, 1));
  const [guests, setGuests] = React.useState(1);
  const [guestFullName, setGuestFullName] = React.useState("");
  const [guestEmail, setGuestEmail] = React.useState("");
  const [guestPhone, setGuestPhone] = React.useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [saving, startSaving] = React.useTransition();

  const selectedType = unitTypes.find((type) => type.id === unitTypeId);
  const validRange = checkOut > checkIn;

  /**
   * Disponibilidad de la selección actual.
   *
   * El resultado se guarda junto con la clave de la consulta que lo produjo, y
   * el render sólo lo muestra si esa clave sigue siendo la actual. Así una
   * respuesta lenta de una consulta vieja no puede pisar a la nueva, y
   * "consultando…" se deriva de no tener respuesta fresca en vez de ser otro
   * estado que mantener en sincronía.
   */
  const requestKey = `${unitTypeId}|${checkIn}|${checkOut}`;
  const [result, setResult] = React.useState<{ key: string; text: string } | null>(null);

  React.useEffect(() => {
    if (!open || !unitTypeId || !validRange) return;
    let ignore = false;
    checkAvailability(unitTypeId, checkIn, checkOut).then((res) => {
      if (ignore) return;
      setResult({
        key: `${unitTypeId}|${checkIn}|${checkOut}`,
        text: res.ok ? s.unitsLeft(res.unitsAvailable, res.unitsTotal) : res.error,
      });
    });
    return () => {
      ignore = true;
    };
  }, [open, unitTypeId, checkIn, checkOut, validRange, s]);

  const availability = result?.key === requestKey ? result.text : null;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startSaving(async () => {
      const result = await createBooking({
        unitTypeId,
        checkIn,
        checkOut,
        guests,
        guestFullName,
        guestEmail,
        guestPhone: guestPhone || undefined,
      });

      if (result.ok) {
        toast.success(s.created(guestFullName));
        setOpen(false);
        setGuestFullName("");
        setGuestEmail("");
        setGuestPhone("");
        setGuests(1);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <CalendarPlus className="size-4" aria-hidden />
          {s.cta}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{s.title}</DialogTitle>
          <DialogDescription>{s.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nb-type">{s.unitType}</Label>
            <Select value={unitTypeId} onValueChange={setUnitTypeId}>
              <SelectTrigger id="nb-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nb-in">{s.checkIn}</Label>
              <Input
                id="nb-in"
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nb-out">{s.checkOut}</Label>
              <Input
                id="nb-out"
                type="date"
                required
                min={addDays(checkIn, 1)}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nb-guests">{s.guests}</Label>
              <Input
                id="nb-guests"
                type="number"
                min={1}
                max={selectedType?.maxGuests}
                required
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
          </div>

          <p
            aria-live="polite"
            className="min-h-5 text-xs text-muted-foreground"
          >
            {!validRange ? s.invalidRange : (availability ?? s.checking)}
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nb-name">{s.guestName}</Label>
            <Input
              id="nb-name"
              required
              value={guestFullName}
              onChange={(e) => setGuestFullName(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nb-email">{s.guestEmail}</Label>
              <Input
                id="nb-email"
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nb-phone">{s.guestPhone}</Label>
              <Input
                id="nb-phone"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={saving || !validRange}>
              {saving ? s.saving : s.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
