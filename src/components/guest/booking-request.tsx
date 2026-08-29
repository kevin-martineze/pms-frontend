"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PublicAvailability, PublicAvailabilityRow } from "@/lib/api/public";
import { requestBooking } from "@/lib/booking-request/actions";
import { formatDate, formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { withLocale } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

/**
 * Solicitud de reserva del huésped.
 *
 * **No confirma nada, y lo dice en todas partes.** Sin pagos conectados, lo que
 * esto produce es una solicitud que el hotel acepta a mano. Un formulario que
 * dijera "reserva confirmada" dejaría a alguien viajando a Chiriquí con una
 * habitación que nadie le apartó de verdad.
 *
 * Las fechas viven en la URL y no en el estado del componente: así la
 * disponibilidad la resuelve el servidor, el enlace se puede compartir, y el
 * botón "atrás" del navegador hace lo que la gente espera.
 */

type Props = {
  availability: PublicAvailability | null;
  currency: string;
  checkInTime: string;
  /** Mensaje del servidor cuando las fechas pedidas no son válidas. */
  rangeError: string | null;
};

export function BookingRequest({
  availability,
  currency,
  checkInTime,
  rangeError,
}: Props) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const params = useSearchParams();

  const tag = locale === "es" ? "es-PA" : "en-US";
  const money = (minor: number) => formatMoney({ amountMinor: minor, currency }, tag);

  const [checkIn, setCheckIn] = React.useState(params.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = React.useState(params.get("checkOut") ?? "");
  const [guests, setGuests] = React.useState(Number(params.get("guests") ?? 2));

  const [chosen, setChosen] = React.useState<PublicAvailabilityRow | null>(null);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", notes: "" });
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<Awaited<
    ReturnType<typeof requestBooking>
  > | null>(null);

  function search() {
    const next = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    router.push(`${withLocale(locale, "/book")}?${next.toString()}`);
    setChosen(null);
  }

  function submit() {
    if (!chosen || !availability) return;
    setError(null);

    startTransition(async () => {
      const result = await requestBooking({
        unitTypeId: chosen.unitTypeId,
        checkIn: availability.checkIn,
        checkOut: availability.checkOut,
        guests: availability.guests,
        guestFullName: form.name.trim(),
        guestEmail: form.email.trim(),
        guestPhone: form.phone.trim() || undefined,
        guestNotes: form.notes.trim() || undefined,
      });
      if (result.ok) setDone(result);
      else setError(result.error);
    });
  }

  // --- Confirmación --------------------------------------------------------
  if (done?.ok) {
    const b = done.booking;
    return (
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <CheckCircle2 className="size-8 text-status-vacant-clean" aria-hidden />
        <h2 className="display-sm mt-4 text-2xl">{t.bookRequest.sentTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.bookRequest.sentBody}</p>

        <dl className="mt-6 grid gap-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">{t.bookRequest.reference}</dt>
            <dd className="tnum mt-0.5 text-lg font-medium">{b.reference}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t.bookRequest.room}</dt>
            <dd className="mt-0.5">{b.unitTypeName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t.bookRequest.dates}</dt>
            <dd className="mt-0.5">
              {formatDate(b.checkIn, tag)} → {formatDate(b.checkOut, tag)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t.bookRequest.total}</dt>
            <dd className="tnum mt-0.5 font-medium">{money(b.totalMinor)}</dd>
          </div>
        </dl>

        <p className="mt-6 flex items-start gap-2 rounded-lg bg-butter/20 px-3 py-2.5 text-xs">
          <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {t.bookRequest.holdNotice(formatDate(b.holdExpiresAt.slice(0, 10), tag))}
        </p>
      </div>
    );
  }

  // --- Formulario ----------------------------------------------------------
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-medium">{t.bookRequest.whenTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
          <div className="grid gap-1.5">
            <Label htmlFor="in">{t.bookRequest.checkIn}</Label>
            <Input id="in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="out">{t.bookRequest.checkOut}</Label>
            <Input id="out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pax">{t.bookRequest.guests}</Label>
            <Input
              id="pax"
              type="number"
              min={1}
              className="sm:w-24"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <Button className="self-end" onClick={search} disabled={!checkIn || !checkOut}>
            {t.bookRequest.search}
          </Button>
        </div>
        {rangeError && <p className="mt-3 text-sm text-status-departing">{rangeError}</p>}
      </section>

      {availability && (
        <section>
          <h2 className="text-sm font-medium">
            {t.bookRequest.optionsTitle(
              formatDate(availability.checkIn, tag),
              formatDate(availability.checkOut, tag),
            )}
          </h2>

          <ul className="mt-4 grid gap-3">
            {availability.unitTypes.map((row) => {
              const selected = chosen?.unitTypeId === row.unitTypeId;
              return (
                <li key={row.unitTypeId}>
                  <button
                    type="button"
                    disabled={!row.available}
                    onClick={() => setChosen(row)}
                    aria-pressed={selected}
                    className={cn(
                      "flex w-full flex-wrap items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors",
                      row.available
                        ? "border-border bg-card hover:border-palm/50"
                        : "cursor-not-allowed border-dashed border-border bg-transparent opacity-60",
                      selected && "border-palm ring-1 ring-palm",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{row.name}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="size-3.5" aria-hidden />
                        {t.bookRequest.upTo(row.maxGuests)}
                      </span>
                      {!row.available && (
                        <span className="mt-1.5 block text-xs text-status-departing">
                          {row.unavailableReason ??
                            (row.fitsGuests
                              ? t.bookRequest.noRooms
                              : t.bookRequest.tooManyGuests)}
                        </span>
                      )}
                    </span>

                    {row.quote && (
                      <span className="shrink-0 text-right">
                        <span className="tnum block text-lg font-medium">
                          {money(row.quote.totalMinor)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {t.bookRequest.nightsTotal(row.quote.nights)}
                        </span>
                        <span className="block text-[0.7rem] text-muted-foreground">
                          {t.bookRequest.taxIncluded(money(row.quote.taxMinor))}
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {chosen && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium">{t.bookRequest.whoTitle}</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">{t.bookRequest.name}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">{t.bookRequest.email}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">{t.bookRequest.phone}</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="notes">{t.bookRequest.notes}</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-lg bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
            <CalendarDays className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {t.bookRequest.noPaymentNotice(checkInTime)}
          </p>

          {error && <p className="mt-3 text-sm text-status-departing">{error}</p>}

          <Button
            className="mt-4 w-full sm:w-auto"
            onClick={submit}
            disabled={pending || form.name.trim() === "" || form.email.trim() === ""}
          >
            {pending ? t.bookRequest.sending : t.bookRequest.submit}
          </Button>
        </section>
      )}
    </div>
  );
}
