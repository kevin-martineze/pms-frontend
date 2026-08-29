"use client";

import * as React from "react";
import { toast } from "sonner";
import { Globe, Mail, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRole } from "@/components/admin/admin-shell";
import { cancelBooking, confirmBooking } from "@/lib/bookings/actions";
import { formatDate, formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Reservation } from "@/lib/domain/types";

/**
 * Solicitudes que entraron por el sitio y esperan respuesta.
 *
 * Va arriba de todo en el panel de Hoy y **sólo aparece cuando hay alguna**. Sin
 * esto, una solicitud del sitio sólo se veía abriendo su barra en el calendario
 * — es decir, sólo si alguien ya sabía que estaba ahí. Una solicitud que nadie
 * ve es una reserva perdida, y con 48 horas de retención se pierde sola.
 *
 * Cada fila trae el contacto del huésped porque la respuesta no es sólo apretar
 * "aceptar": alguien tiene que escribirle para coordinar el pago, y buscar el
 * correo en otra pantalla es el paso donde se abandona la tarea.
 */

export function PendingRequests({ requests }: { requests: Reservation[] }) {
  const { t, intlTag } = useI18n();
  const role = useRole();

  if (requests.length === 0) return null;

  /* Camarería no responde solicitudes. La API igual devuelve 403; esto evita
     ofrecer un botón que no va a funcionar. */
  const canOperate = role !== "housekeeping";

  const sorted = [...requests].sort((a, b) =>
    a.range.checkIn.localeCompare(b.range.checkIn),
  );

  return (
    <section className="rounded-xl border border-butter bg-butter/10">
      <header className="flex flex-wrap items-center gap-2.5 border-b border-butter/60 px-4 py-3">
        <Globe className="size-4 text-accent-foreground" aria-hidden />
        <h2 className="text-sm font-medium">{t.admin.dashboard.requestsTitle}</h2>
        <Badge variant="secondary" className="tnum bg-butter/40 text-accent-foreground">
          {requests.length}
        </Badge>
        <p className="w-full text-xs text-muted-foreground sm:w-auto sm:flex-1 sm:text-right">
          {t.admin.dashboard.requestsLead}
        </p>
      </header>

      <ul className="divide-y divide-butter/40">
        {sorted.map((request) => (
          <Row key={request.id} request={request} intlTag={intlTag} canOperate={canOperate} />
        ))}
      </ul>
    </section>
  );
}

function Row({
  request,
  intlTag,
  canOperate,
}: {
  request: Reservation;
  intlTag: string;
  canOperate: boolean;
}) {
  const { t } = useI18n();
  const [pending, startTransition] = React.useTransition();

  function run(
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
    success: string,
  ) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) toast.success(success);
      else toast.error(result.error);
    });
  }

  const initials = request.guest.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="flex flex-wrap items-start gap-3 px-4 py-3.5">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-card text-xs">{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="font-medium">{request.guest.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDate(request.range.checkIn, intlTag)} →{" "}
          {formatDate(request.range.checkOut, intlTag)} ·{" "}
          {t.common.nights(request.nights)}
          {request.room ? ` · ${t.common.room} ${request.room}` : ""}
        </p>

        {/* El contacto, a mano: sin pagos, aceptar es sólo la mitad del trabajo. */}
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {request.guest.email && (
            <a
              href={`mailto:${request.guest.email}`}
              className="flex items-center gap-1 underline-offset-2 hover:underline"
            >
              <Mail className="size-3" aria-hidden />
              {request.guest.email}
            </a>
          )}
          {request.guest.phone && (
            <a
              href={`tel:${request.guest.phone}`}
              className="flex items-center gap-1 underline-offset-2 hover:underline"
            >
              <Phone className="size-3" aria-hidden />
              {request.guest.phone}
            </a>
          )}
        </p>

        {request.notes && (
          <p className="mt-1.5 text-xs italic text-muted-foreground">“{request.notes}”</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="tnum text-sm font-medium">
          {formatMoney(request.total, intlTag)}
        </span>
        {canOperate && (
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() =>
                run(
                  () => cancelBooking(request.id),
                  t.admin.dashboard.requestDeclined(request.guest.name),
                )
              }
            >
              {t.admin.dashboard.decline}
            </Button>
            <Button
              size="sm"
              disabled={pending}
              onClick={() =>
                run(
                  () => confirmBooking(request.id),
                  t.admin.dashboard.requestAccepted(request.guest.name),
                )
              }
            >
              {t.admin.dashboard.accept}
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
