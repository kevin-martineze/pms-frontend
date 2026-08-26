"use client";

import * as React from "react";
import { toast } from "sonner";
import { BadgeCheck, LogIn, LogOut, MessageCircle, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Reservation } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Llegadas y salidas del día.
 *
 * Es la pantalla que recepción tiene abierta todo el turno, así que cada fila
 * lleva lo que hace falta para atender sin abrir la reserva: quién viene, en qué
 * habitación, qué debe y por dónde llegó. El botón hace la acción del turno —
 * no abre un formulario de siete campos.
 */

type Props = {
  arrivals: Reservation[];
  departures: Reservation[];
};

export function TodayLists({ arrivals, departures }: Props) {
  const { t, intlTag } = useI18n();
  const [checkedIn, setCheckedIn] = React.useState<Set<string>>(new Set());
  const [checkedOut, setCheckedOut] = React.useState<Set<string>>(new Set());

  function doCheckIn(reservation: Reservation) {
    setCheckedIn((prev) => new Set(prev).add(reservation.id));
    toast.success(t.admin.dashboard.checkInToast(reservation.guest.name), {
      description: t.admin.dashboard.checkInToastBody(reservation.room ?? ""),
    });
  }

  function doCheckOut(reservation: Reservation) {
    setCheckedOut((prev) => new Set(prev).add(reservation.id));
    toast.success(t.admin.dashboard.checkOutToast(reservation.guest.name), {
      description: t.admin.dashboard.checkOutToastBody(reservation.room ?? ""),
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel
        title={t.admin.dashboard.arrivals}
        icon={<LogIn className="size-4" aria-hidden />}
        count={arrivals.length}
        empty={t.admin.dashboard.noArrivals}
      >
        {arrivals.map((reservation) => {
          const done = checkedIn.has(reservation.id);
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
                <Button size="sm" onClick={() => doCheckIn(reservation)}>
                  {t.admin.dashboard.checkIn}
                </Button>
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
          const done = checkedOut.has(reservation.id) || reservation.status === "checked-out";
          return (
            <Row key={reservation.id} reservation={reservation} done={done} intlTag={intlTag}>
              {done ? (
                <Badge variant="secondary" className="gap-1.5">
                  <BadgeCheck className="size-3.5" aria-hidden />
                  {t.admin.dashboard.checkedOut}
                </Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={() => doCheckOut(reservation)}>
                  {t.admin.dashboard.checkOut}
                </Button>
              )}
            </Row>
          );
        })}
      </Panel>
    </div>
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
  const owes = reservation.balance.amountMinor > 0;
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
          {reservation.guest.previousStays > 0 && (
            <span className="shrink-0 rounded-full bg-butter/25 px-1.5 py-0.5 text-[0.62rem] font-medium text-accent-foreground">
              {t.admin.dashboard.nthStay(reservation.guest.previousStays + 1)}
            </span>
          )}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-muted-foreground">
          <span className="tnum font-medium text-foreground">
            {t.common.room} {reservation.room}
          </span>
          <span>{t.common.nights(reservation.nights)}</span>
          <span>{t.admin.channels[reservation.channel]}</span>
          {owes && (
            <span className="tnum flex items-center gap-1 text-status-departing">
              <TriangleAlert className="size-3" aria-hidden />
              {t.admin.dashboard.owes(formatMoney(reservation.balance, intlTag))}
            </span>
          )}
        </p>
      </div>

      <Button variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground" asChild>
        <a href={`https://wa.me/${digits}`} aria-label={t.admin.dashboard.writeWhatsapp}>
          <MessageCircle className="size-4" aria-hidden />
        </a>
      </Button>

      <div className="shrink-0">{children}</div>
    </li>
  );
}
