import type { Metadata } from "next";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { nightlyRate } from "@/lib/availability";
import { addDays, formatDate, formatMoney, isWeekend, parseIsoDate } from "@/lib/format";
import { units } from "@/lib/mock/property";
import { ratePlans, seasonFor, seasons } from "@/lib/mock/operations";
import { TODAY } from "@/lib/mock/reservations";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tarifas" };

const DAYS = 28;

export default function RatesPage() {
  const dates = Array.from({ length: DAYS }, (_, i) => addDays(TODAY, i));

  /* La escala se calcula sobre todas las celdas visibles, no por fila: la
     intensidad tiene que significar lo mismo en la suite y en la clásica, o el
     mapa deja de compararse consigo mismo. */
  const allRates = units.flatMap((unit) => dates.map((date) => nightlyRate(unit, date)));
  const min = Math.min(...allRates);
  const max = Math.max(...allRates);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">Precio por noche</p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">Tarifas y temporadas</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Cada noche tiene su precio: tarifa base de la unidad, ajustada por temporada y por fin de
          semana. El sitio público cotiza exactamente esta tabla — no hay una segunda lista de
          precios en otro lado.
        </p>
      </header>

      {/* --- Temporadas ----------------------------------------------------- */}
      <section className="mt-6 grid gap-3 md:grid-cols-3">
        {seasons.map((season) => (
          <Card key={season.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: season.color }}
                  aria-hidden
                />
                {season.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="tnum text-2xl font-medium">
                {season.adjustmentPct > 0 ? "+" : ""}
                {season.adjustmentPct}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(season.from)} → {formatDate(season.to)}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* --- Mapa de tarifas ------------------------------------------------ */}
      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">Próximas cuatro semanas</h2>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatMoney({ amountMinor: Math.round(min * 100), currency: "USD" })}</span>
            <span
              className="h-2 w-24 rounded-full bg-[linear-gradient(to_right,var(--secondary),var(--palm))]"
              aria-hidden
            />
            <span>{formatMoney({ amountMinor: Math.round(max * 100), currency: "USD" })}</span>
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-max min-w-full border-collapse text-xs">
            <caption className="sr-only">
              Tarifa por noche de cada unidad durante las próximas cuatro semanas
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-2 text-left font-medium"
                  style={{ minWidth: 170 }}
                >
                  Unidad
                </th>
                {dates.map((date) => (
                  <th
                    key={date}
                    scope="col"
                    className={cn(
                      "border-b border-border px-1 py-2 text-center font-normal",
                      isWeekend(date) && "bg-secondary/50",
                      date === TODAY && "bg-butter/25",
                    )}
                    style={{ minWidth: 48 }}
                  >
                    <span className="block text-[0.6rem] uppercase text-muted-foreground">
                      {new Intl.DateTimeFormat("es-PA", { weekday: "narrow" }).format(
                        parseIsoDate(date),
                      )}
                    </span>
                    <span className="tnum">{parseIsoDate(date).getDate()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-2 text-left font-normal"
                  >
                    <span className="block font-medium">{unit.name}</span>
                    <span className="block text-[0.68rem] text-muted-foreground">
                      base {formatMoney(unit.basePrice)} · {unit.inventoryCount}{" "}
                      {unit.inventoryCount === 1 ? "llave" : "llaves"}
                    </span>
                  </th>
                  {dates.map((date) => {
                    const rate = nightlyRate(unit, date);
                    /* Rampa de un solo tono, claro a oscuro. Un arcoíris aquí
                       haría que "caro" y "barato" dejen de tener orden. */
                    const t = max === min ? 0 : (rate - min) / (max - min);
                    const season = seasonFor(date);
                    return (
                      <td
                        key={date}
                        className={cn(
                          "tnum border-b border-border/60 px-1 py-2 text-center",
                          date === TODAY && "ring-1 ring-inset ring-butter",
                        )}
                        style={{
                          background: `color-mix(in oklab, var(--palm) ${Math.round(t * 42)}%, var(--card))`,
                          color: t > 0.7 ? "white" : undefined,
                        }}
                        title={`${unit.name} · ${formatDate(date)} · ${season?.name ?? "Estándar"}`}
                      >
                        {Math.round(rate)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0" aria-hidden />
          Los precios se muestran sin ITBMS. El fin de semana lleva +22% sobre la tarifa de la
          temporada vigente.
        </p>
      </section>

      {/* --- Planes tarifarios ---------------------------------------------- */}
      <section className="mt-6">
        <h2 className="text-sm font-medium">Planes tarifarios</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Cada plan es un multiplicador sobre la tarifa de arriba y sus propias reglas de
          cancelación.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ratePlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="tnum text-2xl font-medium">
                  {plan.multiplier === 1
                    ? "Base"
                    : `${plan.multiplier > 1 ? "+" : "−"}${Math.abs(Math.round((1 - plan.multiplier) * 100))}%`}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[0.68rem]">
                    Mín. {plan.minNights} {plan.minNights === 1 ? "noche" : "noches"}
                  </Badge>
                  {plan.id === "rp-direct" && (
                    <Badge className="bg-butter text-[0.68rem] text-accent-foreground hover:bg-butter">
                      Sólo sitio propio
                    </Badge>
                  )}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {plan.cancellation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
