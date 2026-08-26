import type { Metadata } from "next";
import { lang } from "next/root-params";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { nightlyRate } from "@/lib/availability";
import {
  addDays,
  formatDate,
  formatMoney,
  formatWeekdayNarrow,
  isWeekend,
  parseIsoDate,
} from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { unitName } from "@/lib/i18n/content";
import { units } from "@/lib/mock/property";
import { ratePlans, seasonFor, seasons } from "@/lib/mock/operations";
import { TODAY } from "@/lib/mock/reservations";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.rates };
}

const DAYS = 28;

type PlanId = keyof Dictionary["admin"]["rates"]["plans"];
type SeasonId = keyof Dictionary["admin"]["rates"]["seasons"];

export default async function RatesPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

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
        <p className="eyebrow text-muted-foreground">{t.admin.rates.eyebrow}</p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.rates.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.rates.lead}</p>
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
                {t.admin.rates.seasons[season.id as SeasonId]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="tnum text-2xl font-medium">
                {season.adjustmentPct > 0 ? "+" : ""}
                {season.adjustmentPct}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(season.from, tag)} → {formatDate(season.to, tag)}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* --- Mapa de tarifas ------------------------------------------------ */}
      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">{t.admin.rates.nextFourWeeks}</h2>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatMoney({ amountMinor: Math.round(min * 100), currency: "USD" }, tag)}</span>
            <span
              className="h-2 w-24 rounded-full bg-[linear-gradient(to_right,var(--secondary),var(--palm))]"
              aria-hidden
            />
            <span>{formatMoney({ amountMinor: Math.round(max * 100), currency: "USD" }, tag)}</span>
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-max min-w-full border-collapse text-xs">
            <caption className="sr-only">{t.admin.rates.tableCaption}</caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-2 text-left font-medium"
                  style={{ minWidth: 170 }}
                >
                  {t.admin.rates.unit}
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
                      {formatWeekdayNarrow(date, tag)}
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
                    <span className="block font-medium">{unitName(unit, locale)}</span>
                    <span className="block text-[0.68rem] text-muted-foreground">
                      {t.admin.rates.baseRate(
                        formatMoney(unit.basePrice, tag),
                        unit.inventoryCount,
                      )}
                    </span>
                  </th>
                  {dates.map((date) => {
                    const rate = nightlyRate(unit, date);
                    /* Rampa de un solo tono, claro a oscuro. Un arcoíris aquí
                       haría que "caro" y "barato" dejen de tener orden. */
                    const ratio = max === min ? 0 : (rate - min) / (max - min);
                    const season = seasonFor(date);
                    const seasonName = season
                      ? t.admin.rates.seasons[season.id as SeasonId]
                      : t.admin.rates.standard;
                    return (
                      <td
                        key={date}
                        className={cn(
                          "tnum border-b border-border/60 px-1 py-2 text-center",
                          date === TODAY && "ring-1 ring-inset ring-butter",
                        )}
                        style={{
                          background: `color-mix(in oklab, var(--palm) ${Math.round(ratio * 42)}%, var(--card))`,
                          color: ratio > 0.7 ? "white" : undefined,
                        }}
                        title={`${unitName(unit, locale)} · ${formatDate(date, tag)} · ${seasonName}`}
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
          {t.admin.rates.taxNote}
        </p>
      </section>

      {/* --- Planes tarifarios ---------------------------------------------- */}
      <section className="mt-6">
        <h2 className="text-sm font-medium">{t.admin.rates.plansTitle}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t.admin.rates.plansLead}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ratePlans.map((plan) => {
            const copy = t.admin.rates.plans[plan.id as PlanId];
            return (
              <Card key={plan.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{copy.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="tnum text-2xl font-medium">
                    {plan.multiplier === 1
                      ? t.admin.rates.planBase
                      : `${plan.multiplier > 1 ? "+" : "−"}${Math.abs(
                          Math.round((1 - plan.multiplier) * 100),
                        )}%`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[0.68rem]">
                      {t.admin.rates.minNights(plan.minNights)}
                    </Badge>
                    {plan.id === "rp-direct" && (
                      <Badge className="bg-butter text-[0.68rem] text-accent-foreground hover:bg-butter">
                        {t.admin.rates.directOnly}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {copy.cancellation}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
