"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReservationSheet } from "@/components/admin/reservation-sheet";
import {
  diffNights,
  formatDate,
  formatWeekday,
  isWeekend,
  parseIsoDate,
} from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { IsoDate, Reservation } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * El tape chart — el calendario de cinta.
 *
 * Es la pantalla que define un PMS. Una fila por habitación física, una columna
 * por noche, y cada reserva como una barra que ocupa exactamente las noches que
 * pagó. Sirve para dos cosas que una lista no puede hacer: ver un hueco de una
 * noche entre dos reservas, y ver que una habitación lleva cuatro días vacía.
 *
 * Tres decisiones de construcción:
 *
 * - **La barra empieza a media celda y termina a media celda.** El día de salida
 *   no es una noche vendida: la habitación de quien sale a las 11:00 la ocupa a
 *   las 15:00 quien llega. Dibujar la barra de borde a borde haría ver ese día
 *   como doble venta.
 * - **La columna de habitaciones es sticky.** Con setenta columnas de fechas, un
 *   encabezado que se va del viewport deja al usuario adivinando en qué fila
 *   está.
 * - **El color nunca va solo.** Cada barra lleva el nombre del huésped y el
 *   detalle repite el estado en texto.
 */

const COL = 44; // px por noche
const ROW = 40; // px por habitación

export type TapeRow = {
  room: string;
  unitName: string;
  blocked: boolean;
  reservations: Reservation[];
};

const BAR_CLASS: Record<string, string> = {
  "in-house": "bg-status-occupied text-white",
  confirmed: "bg-status-arriving text-white",
  pending: "bg-status-vacant-dirty text-[oklch(0.24_0.04_80)]",
  "checked-out": "bg-muted text-muted-foreground",
  "no-show": "bg-destructive/85 text-white",
  cancelled: "bg-muted text-muted-foreground",
};

export function TapeChart({
  rows,
  windowStart,
  windowEnd,
  today,
}: {
  rows: TapeRow[];
  windowStart: IsoDate;
  windowEnd: IsoDate;
  today: IsoDate;
}) {
  const { t, intlTag } = useI18n();
  const scroller = React.useRef<HTMLDivElement>(null);
  const [selected, setSelected] = React.useState<Reservation | null>(null);

  const days = React.useMemo(() => {
    const out: IsoDate[] = [];
    for (let d = windowStart; d < windowEnd; ) {
      out.push(d);
      const date = parseIsoDate(d);
      date.setDate(date.getDate() + 1);
      d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`;
    }
    return out;
  }, [windowStart, windowEnd]);

  const todayIndex = days.indexOf(today);

  /* Al montar, el scroll se para en hoy menos dos días. Abrir el calendario tres
     semanas en el pasado es abrirlo en la parte que a nadie le sirve. */
  React.useEffect(() => {
    if (!scroller.current || todayIndex < 0) return;
    scroller.current.scrollLeft = Math.max(0, (todayIndex - 2) * COL);
  }, [todayIndex]);

  function scrollBy(count: number) {
    scroller.current?.scrollBy({ left: count * COL, behavior: "smooth" });
  }

  function goToToday() {
    scroller.current?.scrollTo({ left: Math.max(0, (todayIndex - 2) * COL), behavior: "smooth" });
  }

  const legend = [
    ["in-house", t.admin.calendar.legendInHouse],
    ["confirmed", t.admin.calendar.legendConfirmed],
    ["pending", t.admin.calendar.legendPending],
    ["checked-out", t.admin.calendar.legendCheckedOut],
  ] as const;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => scrollBy(-7)} className="size-8">
          <ChevronLeft className="size-4" aria-hidden />
          <span className="sr-only">{t.admin.calendar.previousWeek}</span>
        </Button>
        <Button variant="outline" size="sm" onClick={goToToday}>
          {t.admin.calendar.goToday}
        </Button>
        <Button variant="outline" size="icon" onClick={() => scrollBy(7)} className="size-8">
          <ChevronRight className="size-4" aria-hidden />
          <span className="sr-only">{t.admin.calendar.nextWeek}</span>
        </Button>

        <ul className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {legend.map(([key, label]) => (
            <li key={key} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-sm", BAR_CLASS[key])} aria-hidden />
              {label}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm border border-border bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,var(--muted-foreground)_2px,var(--muted-foreground)_4px)]"
              aria-hidden
            />
            {t.admin.calendar.legendBlocked}
          </li>
        </ul>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex">
          {/* Columna fija de habitaciones */}
          <div className="sticky left-0 z-20 shrink-0 border-r border-border bg-card">
            <div
              className="flex items-end border-b border-border px-3 pb-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground"
              style={{ height: 46, width: 158 }}
            >
              {t.admin.calendar.roomColumn}
            </div>
            {rows.map((row) => (
              <div
                key={row.room}
                className="flex items-center gap-2 border-b border-border px-3 last:border-b-0"
                style={{ height: ROW, width: 158 }}
              >
                <span className="tnum w-9 shrink-0 text-sm font-medium">{row.room}</span>
                <span className="truncate text-xs text-muted-foreground">{row.unitName}</span>
              </div>
            ))}
          </div>

          {/* Cinta desplazable */}
          <div ref={scroller} className="min-w-0 flex-1 overflow-x-auto">
            <div style={{ width: days.length * COL }}>
              {/* Encabezado de fechas */}
              <div className="flex border-b border-border" style={{ height: 46 }}>
                {days.map((day) => {
                  const isToday = day === today;
                  const weekend = isWeekend(day);
                  return (
                    <div
                      key={day}
                      style={{ width: COL }}
                      className={cn(
                        "flex shrink-0 flex-col items-center justify-center border-r border-border/60 text-[0.65rem]",
                        weekend && "bg-secondary/50",
                        isToday && "bg-butter/25",
                      )}
                    >
                      <span className="uppercase text-muted-foreground">
                        {formatWeekday(day, intlTag).slice(0, 2)}
                      </span>
                      <span className={cn("tnum text-xs", isToday && "font-semibold")}>
                        {parseIsoDate(day).getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Filas */}
              {rows.map((row) => (
                <div
                  key={row.room}
                  className="relative flex border-b border-border last:border-b-0"
                  style={{ height: ROW }}
                >
                  {days.map((day) => (
                    <div
                      key={day}
                      style={{ width: COL }}
                      className={cn(
                        "shrink-0 border-r border-border/60",
                        isWeekend(day) && "bg-secondary/40",
                        day === today && "bg-butter/15",
                      )}
                    />
                  ))}

                  {row.blocked && (
                    <div
                      className="pointer-events-none absolute inset-y-1 left-0 right-0 rounded bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,var(--border)_5px,var(--border)_10px)]"
                      title={t.admin.calendar.blockedTitle}
                    />
                  )}

                  {row.reservations.map((reservation) => {
                    const startIndex = Math.max(
                      0,
                      diffNights(windowStart, reservation.range.checkIn),
                    );
                    const endIndex = Math.min(
                      days.length,
                      diffNights(windowStart, reservation.range.checkOut),
                    );
                    if (endIndex <= 0 || startIndex >= days.length) return null;

                    const left = startIndex * COL + COL / 2;
                    const width = (endIndex - startIndex) * COL - COL;
                    if (width <= 0) return null;

                    return (
                      <button
                        key={reservation.id}
                        type="button"
                        onClick={() => setSelected(reservation)}
                        style={{ left, width, top: 5, height: ROW - 11 }}
                        className={cn(
                          "absolute flex items-center gap-1.5 overflow-hidden rounded-md px-2 text-left text-[0.7rem] font-medium transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                          BAR_CLASS[reservation.status] ?? "bg-muted",
                        )}
                        title={`${reservation.guest.name} · ${formatDate(
                          reservation.range.checkIn,
                          intlTag,
                        )} → ${formatDate(reservation.range.checkOut, intlTag)}`}
                      >
                        {(reservation.balance?.amountMinor ?? 0) > 0 && (
                          <TriangleAlert className="size-3 shrink-0 opacity-90" aria-hidden />
                        )}
                        <span className="truncate">{reservation.guest.name}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReservationSheet reservation={selected} onClose={() => setSelected(null)} />
    </>
  );
}

