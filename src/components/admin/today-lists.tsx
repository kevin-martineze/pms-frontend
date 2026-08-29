"use client";

import * as React from "react";
import { toast } from "sonner";
import { BadgeCheck, LogIn, LogOut, MessageCircle, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/components/admin/admin-shell";
import { checkInBooking, checkOutBooking } from "@/lib/bookings/actions";
import { formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Reservation } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Llegadas y salidas del día.
 *
 * Es la pantalla que recepción tiene abierta todo el turno, así que cada fila
 * lleva lo que hace falta para atender sin abrir la reserva: quién viene, en qué
 * habitación y qué debe. El botón hace la acción del turno — no abre un
 * formulario de siete campos.
 *
 * Los botones llaman a la API de verdad. El estado que se ve sale del servidor,
 * no de un `useState` local: si el registro falla, la fila NO puede quedar
 * marcada como hecha. Una entrada que la pantalla da por registrada y la base
 * no tiene es un huésped que figura como no llegado con la llave en la mano.
 */

type Props = {
  arrivals: Reservation[];
  departures: Reservation[];
};

export function TodayLists({ arrivals, departures }: Props) {
  const { t, intlTag } = useI18n();
  const role = useRole();

  /* Camarería no registra entradas ni salidas. La API igual lo rechaza con 403;
     esto es para no ofrecer un botón que no va a funcionar. */
  const canOperate = role !== "housekeeping";

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel
        title={t.admin.dashboard.arrivals}
        icon={<LogIn className="size-4" aria-hidden />}
        count={arrivals.length}
        empty={t.admin.dashboard.noArrivals}
      >
        {arrivals.map((reservation) => {
          const done = reservation.status === "in-house";
          return (
            <Row key={reservation.id} reservation={reservation} done={done} intlTag={intlTag}>
              {done ? (
                <Badge
                  variant="secondary"
                  className="gap-1.5 bg-status-vacant-clean/15 text-status-vacant-clean"
                >
                  <BadgeCheck className="size-3.5" aria-hidden />
                  {t.admin.dashboard.checkedIn}
                </Badge>
              ) : (
                canOperate && (
                  <TransitionButton
                    action={() => checkInBooking(reservation.id)}
                    label={t.admin.dashboard.checkIn}
                    successTitle={t.admin.dashboard.checkInToast(reservation.guest.name)}
                    successBody={t.admin.dashboard.checkInToastBody(reservation.room ?? "")}
                  />
                )
              )}
            </Row>
          );
        })}
      </Panel>

      <Panel
        title={t.admin.dashboard.departures}
        icon={<LogOut className="size-4" aria-hidden />}
        count={departures.length}
        empty={t.admin.dashboard.noDepartures}
      >
        {departures.map((reservation) => {
          const done = reservation.status === "checked-out";
          return (
            <Row key={reservation.id} reservation={reservation} done={done} intlTag={intlTag}>
              {done ? (
                <Badge variant="secondary" className="gap-1.5">
                  <BadgeCheck className="size-3.5" aria-hidden />
                  {t.admin.dashboard.checkedOut}
                </Badge>
              ) : (
                canOperate && (
                  <TransitionButton
                    variant="outline"
                    action={() => checkOutBooking(reservation.id)}
                    label={t.admin.dashboard.checkOut}
                    successTitle={t.admin.dashboard.checkOutToast(reservation.guest.name)}
                    successBody={t.admin.dashboard.checkOutToastBody(reservation.room ?? "")}
                  />
                )
              )}
            </Row>
          );
        })}
      </Panel>
    </div>
  );
}

/**
 * Botón de transición de estado.
 *
 * El toast de éxito sale DESPUÉS de que la API confirmó, y si falla muestra el
 * mensaje real que devolvió el servidor ("no se puede pasar de CHECKED_IN a
 * CHECKED_IN") en vez de un error genérico.
 */
function TransitionButton({
  action,
  label,
  successTitle,
  successBody,
  variant,
}: {
  action: () => Promise<{ ok: true } | { ok: false; error: string }>;
  label: string;
  successTitle: string;
  successBody: string;
  variant?: "outline";
}) {
  const [pending, startTransition] = React.useTransition();

  function run() {
    startTransition(async () => {
      const result = await action();
      if (result.ok) toast.success(successTitle, { description: successBody });
      else toast.error(result.error);
    });
  }

  return (
    <Button size="sm" variant={variant} disabled={pending} onClick={run}>
      {label}
    </Button>
  );
}

function Panel({
  title,
  icon,
  count,
  empty,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-medium">{title}</h2>
        <Badge variant="secondary" className="tnum ml-auto">
          {count}
        </Badge>
      </header>
      {count === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y divide-border">{children}</ul>
      )}
    </section>
  );
}

function Row({
  reservation,
  done,
  intlTag,
  children,
}: {
  reservation: Reservation;
  done: boolean;
  intlTag: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const balance = reservation.balance;
  const owes = (balance?.amountMinor ?? 0) > 0;
  const digits = reservation.guest.phone.replace(/[^0-9]/g, "");

  return (
    <li className={cn("flex items-center gap-3 px-4 py-3", done && "opacity-55")}>
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-secondary text-xs">
          {reservation.guest.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-medium">
          {reservation.guest.name}
          {(reservation.guest.previousStays ?? 0) > 0 && (
            <span className="shrink-0 rounded-full bg-butter/25 px-1.5 py-0.5 text-[0.62rem] font-medium text-accent-foreground">
              {t.admin.dashboard.nthStay((reservation.guest.previousStays ?? 0) + 1)}
            </span>
          )}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-muted-foreground">
          <span className="tnum font-medium text-foreground">
            {t.common.room} {reservation.room}
          </span>
          <span>{t.common.nights(reservation.nights)}</span>
          {reservation.channel && <span>{t.admin.channels[reservation.channel]}</span>}
          {owes && balance && (
            <span className="tnum flex items-center gap-1 text-status-departing">
              <TriangleAlert className="size-3" aria-hidden />
              {t.admin.dashboard.owes(formatMoney(balance, intlTag))}
            </span>
          )}
        </p>
      </div>

      {digits && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground"
          asChild
        >
          <a href={`https://wa.me/${digits}`} aria-label={t.admin.dashboard.writeWhatsapp}>
            <MessageCircle className="size-4" aria-hidden />
          </a>
        </Button>
      )}

      <div className="shrink-0">{children}</div>
    </li>
  );
}
