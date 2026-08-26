"use client";

import * as React from "react";
import { toast } from "sonner";
import { BadgeCheck, LogIn, LogOut, MessageCircle, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CHANNEL_LABEL } from "@/components/admin/labels";
import { formatMoney } from "@/lib/format";
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
  const [checkedIn, setCheckedIn] = React.useState<Set<string>>(new Set());
  const [checkedOut, setCheckedOut] = React.useState<Set<string>>(new Set());

  function doCheckIn(reservation: Reservation) {
    setCheckedIn((prev) => new Set(prev).add(reservation.id));
    toast.success(`${reservation.guest.name} registrado`, {
      description: `Habitación ${reservation.room} entregada. Camarería fue notificada.`,
    });
  }

  function doCheckOut(reservation: Reservation) {
    setCheckedOut((prev) => new Set(prev).add(reservation.id));
    toast.success(`${reservation.guest.name} hizo salida`, {
      description: `Habitación ${reservation.room} pasó a "por limpiar".`,
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel
        title="Llegan hoy"
        icon={<LogIn className="size-4" aria-hidden />}
        count={arrivals.length}
        empty="Nadie llega hoy."
      >
        {arrivals.map((reservation) => {
          const done = checkedIn.has(reservation.id);
          return (
            <Row key={reservation.id} reservation={reservation} done={done}>
              {done ? (
                <Badge variant="secondary" className="gap-1.5 bg-status-vacant-clean/15 text-status-vacant-clean">
                  <BadgeCheck className="size-3.5" aria-hidden />
                  Registrado
                </Badge>
              ) : (
                <Button size="sm" onClick={() => doCheckIn(reservation)}>
                  Check-in
                </Button>
              )}
            </Row>
          );
        })}
      </Panel>

      <Panel
        title="Salen hoy"
        icon={<LogOut className="size-4" aria-hidden />}
        count={departures.length}
        empty="Nadie sale hoy."
      >
        {departures.map((reservation) => {
          const done = checkedOut.has(reservation.id) || reservation.status === "checked-out";
          return (
            <Row key={reservation.id} reservation={reservation} done={done}>
              {done ? (
                <Badge variant="secondary" className="gap-1.5">
                  <BadgeCheck className="size-3.5" aria-hidden />
                  Salió
                </Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={() => doCheckOut(reservation)}>
                  Check-out
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
  children,
}: {
  reservation: Reservation;
  done: boolean;
  children: React.ReactNode;
}) {
  const owes = reservation.balance.amountMinor > 0;

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
              {reservation.guest.previousStays + 1}ª estancia
            </span>
          )}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-muted-foreground">
          <span className="tnum font-medium text-foreground">Hab. {reservation.room}</span>
          <span>{reservation.nights}n</span>
          <span>{CHANNEL_LABEL[reservation.channel]}</span>
          {owes && (
            <span className="tnum flex items-center gap-1 text-status-departing">
              <TriangleAlert className="size-3" aria-hidden />
              debe {formatMoney(reservation.balance)}
            </span>
          )}
        </p>
      </div>

      <Button variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground" asChild>
        <a href={`https://wa.me/${reservation.guest.phone.replace(/\D/g, "")}`} aria-label="Escribir por WhatsApp">
          <MessageCircle className="size-4" aria-hidden />
        </a>
      </Button>

      <div className="shrink-0">{children}</div>
    </li>
  );
}
