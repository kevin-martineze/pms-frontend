"use client";

import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PAYMENT_CLASS, STATUS_CLASS } from "@/components/admin/labels";
import { useRole } from "@/components/admin/admin-shell";
import {
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  confirmBooking,
} from "@/lib/bookings/actions";
import { formatDate, formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Reservation } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Detalle de una reserva, con sus acciones.
 *
 * Vivía dentro del tape chart, y por eso el Libro de reservas mostraba
 * reservas "Por confirmar" que no se podían confirmar: la única puerta a las
 * acciones era hacer clic en la barra correcta del calendario. Extraerlo hace
 * que las dos pantallas ofrezcan exactamente lo mismo — y que sigan
 * ofreciéndolo cuando aparezca una tercera.
 */
export function ReservationSheet({
  reservation,
  onClose,
}: {
  reservation: Reservation | null;
  onClose: () => void;
}) {
  const { t, intlTag } = useI18n();
  const s = t.admin.calendar.sheet;

  return (
    <Sheet open={reservation !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        {reservation && (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle className="text-left">
                <span className="display-sm block text-xl">{reservation.guest.name}</span>
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {reservation.reference}
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {/* Pago, canal y comisión no se muestran: el backend todavía no
                  registra pagos ni distingue OTAs. Un badge "sin pagar" que en
                  realidad significa "no sabemos" es peor que no mostrarlo —
                  recepción cobraría dos veces. Vuelven con el módulo de pagos. */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={STATUS_CLASS[reservation.status]}>
                  {t.admin.status[reservation.status]}
                </Badge>
                {reservation.payment && (
                  <Badge variant="outline" className={PAYMENT_CLASS[reservation.payment]}>
                    {t.admin.payment[reservation.payment]}
                  </Badge>
                )}
              </div>

              <dl className="space-y-3 text-sm">
                <Item
                  term={s.room}
                  detail={s.nightsInRoom(reservation.room ?? "—", reservation.nights)}
                />
                <Item
                  term={s.checkIn}
                  detail={`${formatDate(reservation.range.checkIn, intlTag)} · 15:00`}
                />
                <Item
                  term={s.checkOut}
                  detail={`${formatDate(reservation.range.checkOut, intlTag)} · 11:00`}
                />
                <Item term={s.guests} detail={t.common.guests(reservation.guests)} />
                <Item term={s.bookedOn} detail={formatDate(reservation.createdAt, intlTag)} />
              </dl>

              <Separator />

              <dl className="space-y-3 text-sm">
                <Item term={s.total} detail={formatMoney(reservation.total, intlTag)} strong />
                {reservation.balance && (
                  <Item
                    term={s.balance}
                    detail={formatMoney(reservation.balance, intlTag)}
                    tone={reservation.balance.amountMinor > 0 ? "warning" : "ok"}
                  />
                )}
              </dl>

              <Separator />

              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">{s.contact}</p>
                <p>{reservation.guest.email}</p>
                {reservation.guest.phone && <p className="tnum">{reservation.guest.phone}</p>}
              </div>
            </div>

            <SheetActions reservation={reservation} onDone={onClose} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/**
 * Acciones sobre la reserva abierta.
 *
 * Se ofrece sólo lo que la máquina de estados permite desde el estado actual:
 * una reserva ya cerrada no muestra botones que la API va a rechazar. Camarería
 * no ve ninguno.
 */
function SheetActions({
  reservation,
  onDone,
}: {
  reservation: Reservation;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const s = t.admin.calendar.sheet;
  const role = useRole();
  const [pending, startTransition] = React.useTransition();

  if (role === "housekeeping") return null;

  /* Sólo se ofrecen las transiciones que la máquina de estados del backend
     acepta. Un botón que siempre falla es peor que un botón ausente. */
  const canConfirm = reservation.status === "pending";
  const canCheckIn = reservation.status === "confirmed";
  const canCheckOut = reservation.status === "in-house";
  const canCancel = reservation.status === "confirmed" || reservation.status === "pending";
  if (!canConfirm && !canCheckIn && !canCheckOut && !canCancel) return null;

  function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(success);
        onDone();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="grid gap-2 border-t border-border p-4 sm:grid-cols-2">
      {canConfirm && (
        <Button
          className="sm:col-span-2"
          disabled={pending}
          onClick={() =>
            run(() => confirmBooking(reservation.id), s.confirmed(reservation.guest.name))
          }
        >
          {s.confirmCta}
        </Button>
      )}
      {canCancel && (
        <Button
          variant="outline"
          disabled={pending}
          onClick={() =>
            run(() => cancelBooking(reservation.id), s.cancelled(reservation.guest.name))
          }
        >
          {s.cancelCta}
        </Button>
      )}
      {canCheckIn && (
        <Button
          disabled={pending}
          onClick={() =>
            run(() => checkInBooking(reservation.id), s.checkedIn(reservation.guest.name))
          }
        >
          {s.checkInCta}
        </Button>
      )}
      {canCheckOut && (
        <Button
          disabled={pending}
          onClick={() =>
            run(() => checkOutBooking(reservation.id), s.checkedOut(reservation.guest.name))
          }
        >
          {s.checkOutCta}
        </Button>
      )}
    </div>
  );
}

function Item({
  term,
  detail,
  strong,
  tone,
}: {
  term: string;
  detail: string;
  strong?: boolean;
  tone?: "ok" | "warning";
}) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-muted-foreground">{term}</dt>
      <dd
        className={cn(
          "tnum text-right",
          strong && "font-medium",
          tone === "warning" && "text-status-departing",
          tone === "ok" && "text-status-vacant-clean",
        )}
      >
        {detail}
      </dd>
    </div>
  );
}
