"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_CLASS } from "@/components/admin/labels";
import { ReservationSheet } from "@/components/admin/reservation-sheet";
import { formatDateShort, formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Reservation } from "@/lib/domain/types";

/**
 * El libro de reservas.
 *
 * Las filas **se abren**. Antes era una tabla de sólo lectura, y eso dejaba una
 * situación absurda: se podía filtrar por "Por confirmar" y ver exactamente las
 * reservas que había que confirmar, sin ninguna forma de confirmarlas. La única
 * puerta a las acciones era acertarle a la barra correcta en el calendario.
 *
 * Abre la misma hoja que el calendario, no una parecida: dos detalles de
 * reserva distintos terminan ofreciendo acciones distintas, y la que falte va a
 * ser justo la que alguien necesita.
 */
export function ReservationsTable({
  reservations,
  typeNames,
  limit,
}: {
  reservations: Reservation[];
  /** Nombre del tipo de unidad por `unitId`. */
  typeNames: Record<string, string>;
  limit: number;
}) {
  const { t, intlTag } = useI18n();
  const [selected, setSelected] = React.useState<Reservation | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.admin.reservations.colGuest}</TableHead>
            <TableHead>{t.admin.reservations.colRoom}</TableHead>
            <TableHead>{t.admin.reservations.colUnit}</TableHead>
            <TableHead>{t.admin.reservations.colDates}</TableHead>
            <TableHead className="text-right">{t.admin.reservations.colNights}</TableHead>
            <TableHead className="text-right">{t.admin.reservations.colGuests}</TableHead>
            <TableHead>{t.admin.reservations.colStatus}</TableHead>
            <TableHead className="text-right">{t.admin.reservations.colTotal}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-14 text-center text-muted-foreground">
                {t.admin.reservations.empty}
              </TableCell>
            </TableRow>
          ) : (
            reservations.slice(0, limit).map((reservation) => (
              <TableRow
                key={reservation.id}
                /* `tabIndex` y `onKeyDown` porque una fila clicable que sólo
                   responde al ratón deja fuera a quien navega con teclado — y
                   recepción trabaja con teclado más de lo que parece. */
                tabIndex={0}
                role="button"
                aria-label={t.admin.reservations.openRow(reservation.guest.name)}
                onClick={() => setSelected(reservation)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(reservation);
                  }
                }}
                className="cursor-pointer transition-colors hover:bg-secondary/60 focus-visible:bg-secondary/60 focus-visible:outline-none"
              >
                <TableCell>
                  <span className="block font-medium">{reservation.guest.name}</span>
                  <span className="block font-mono text-xs text-muted-foreground">
                    {reservation.reference}
                  </span>
                </TableCell>
                <TableCell className="tnum font-medium">{reservation.room}</TableCell>
                <TableCell className="text-muted-foreground">
                  {typeNames[reservation.unitId] ?? ""}
                </TableCell>
                <TableCell className="tnum whitespace-nowrap text-muted-foreground">
                  {formatDateShort(reservation.range.checkIn, intlTag)} →{" "}
                  {formatDateShort(reservation.range.checkOut, intlTag)}
                </TableCell>
                <TableCell className="tnum text-right">{reservation.nights}</TableCell>
                <TableCell className="tnum text-right">{reservation.guests}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_CLASS[reservation.status]}>
                    {t.admin.status[reservation.status]}
                  </Badge>
                </TableCell>
                <TableCell className="tnum text-right">
                  {formatMoney(reservation.total, intlTag)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ReservationSheet reservation={selected} onClose={() => setSelected(null)} />
    </>
  );
}
