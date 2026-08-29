import type { Metadata } from "next";
import { lang } from "next/root-params";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRateCalendar, getRatePlans, getUnitTypes } from "@/lib/api/server";
import { NoAccess } from "@/components/admin/no-access";
import { canAccess } from "@/lib/auth/access";
import { getSession } from "@/lib/auth/server-session";
import {
  addDays,
  formatDate,
  formatMoney,
  formatWeekdayNarrow,
  parseIsoDate,
  toIsoDate,
} from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.rates };
}

const DAYS = 28;

export default async function RatesPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const session = await getSession();
  if (!session) return null;

  /* Las tarifas son decisión de negocio: recepción y camarería no las tocan. */
  if (!canAccess(session.role, "rates")) {
    return <NoAccess t={t} section={t.admin.nav.rates} />;
  }

  const today = toIsoDate(new Date());
  const lastDay = addDays(today, DAYS - 1);
  const currency = session.property.currency;

  const [calendar, unitTypes] = await Promise.all([
    getRateCalendar(session, { from: today, to: lastDay }),
    getUnitTypes(session),
  ]);

  /* Los planes se piden por tipo porque así los expone la API — cada plan
     pertenece a un tipo de unidad, no a la propiedad. */
  const plansByType = await Promise.all(
    unitTypes.map(async (type) => ({
      type,
      plans: await getRatePlans(session, type.id),
    })),
  );
  const allPlans = plansByType.flatMap(({ type, plans }) =>
    plans.map((plan) => ({ ...plan, unitTypeName: type.name })),
  );

  const dates = calendar[0]?.nights.map((night) => night.date) ?? [];

  /* La escala se calcula sobre todas las celdas visibles, no por fila: la
     intensidad tiene que significar lo mismo en la suite y en la clásica, o el
     mapa deja de compararse consigo mismo. */
  const allPrices = calendar.flatMap((row) => row.nights.map((n) => n.priceMinor));
  const min = allPrices.length ? Math.min(...allPrices) : 0;
  const max = allPrices.length ? Math.max(...allPrices) : 0;

  const money = (amountMinor: number) => formatMoney({ amountMinor, currency }, tag);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">{t.admin.rates.eyebrow}</p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.rates.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.rates.lead}</p>
      </header>

      {/* --- Mapa de tarifas ------------------------------------------------ */}
      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">{t.admin.rates.nextFourWeeks}</h2>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{money(min)}</span>
            <span
              className="h-2 w-24 rounded-full bg-[linear-gradient(to_right,var(--secondary),var(--palm))]"
              aria-hidden
            />
            <span>{money(max)}</span>
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
                {dates.map((date) => {
                  const weekend = calendar[0]?.nights.find((n) => n.date === date)?.weekend;
                  return (
                    <th
                      key={date}
                      scope="col"
                      className={cn(
                        "border-b border-border px-1 py-2 text-center font-normal",
                        weekend && "bg-secondary/50",
                        date === today && "bg-butter/25",
                      )}
                      style={{ minWidth: 48 }}
                    >
                      <span className="block text-[0.6rem] uppercase text-muted-foreground">
                        {formatWeekdayNarrow(date, tag)}
                      </span>
                      <span className="tnum">{parseIsoDate(date).getDate()}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {calendar.map((row) => (
                <tr key={row.unitTypeId}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-r border-border bg-card px-3 py-2 text-left font-normal"
                  >
                    <span className="block font-medium">{row.unitTypeName}</span>
                    <span className="block text-[0.68rem] text-muted-foreground">
                      {t.admin.rates.base} {money(row.basePriceMinor)}
                    </span>
                  </th>
                  {row.nights.map((night) => {
                    /* Rampa de un solo tono, claro a oscuro. Un arcoíris aquí
                       haría que "caro" y "barato" dejen de tener orden. */
                    const ratio = max === min ? 0 : (night.priceMinor - min) / (max - min);
                    return (
                      <td
                        key={night.date}
                        className={cn(
                          "tnum border-b border-border/60 px-1 py-2 text-center",
                          night.date === today && "ring-1 ring-inset ring-butter",
                          /* Cerrado se distingue por trama además de por color:
                             el color solo no puede ser el único portador. */
                          night.closed &&
                            "bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,var(--muted-foreground)_3px,var(--muted-foreground)_5px)] text-muted-foreground",
                        )}
                        style={
                          night.closed
                            ? undefined
                            : {
                                background: `color-mix(in oklab, var(--palm) ${Math.round(ratio * 42)}%, var(--card))`,
                                color: ratio > 0.7 ? "white" : undefined,
                              }
                        }
                        title={`${row.unitTypeName} · ${formatDate(night.date, tag)} · ${
                          night.closed
                            ? t.admin.rates.closedPlan
                            : (night.planName ?? t.admin.rates.standard)
                        }`}
                      >
                        {night.closed ? "—" : Math.round(night.priceMinor / 100)}
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

      {/* --- Planes ---------------------------------------------------------- */}
      <section className="mt-6">
        <h2 className="text-sm font-medium">{t.admin.rates.plansTitle}</h2>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground">{t.admin.rates.plansLead}</p>

        {allPlans.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            {t.admin.rates.noPlans}
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {allPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{plan.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{plan.unitTypeName}</p>
                </CardHeader>
                <CardContent>
                  {plan.closed ? (
                    <p className="text-lg font-medium text-status-departing">
                      {t.admin.rates.closedPlan}
                    </p>
                  ) : (
                    <>
                      <p className="tnum text-2xl font-medium">{money(plan.priceMinor)}</p>
                      {plan.weekendPriceMinor !== null && (
                        <p className="tnum mt-0.5 text-xs text-muted-foreground">
                          {t.admin.rates.weekendRate(money(plan.weekendPriceMinor))}
                        </p>
                      )}
                    </>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    {t.admin.rates.planRange(
                      formatDate(plan.startDate.slice(0, 10), tag),
                      formatDate(plan.endDate.slice(0, 10), tag),
                    )}
                  </p>

                  {plan.minNights !== null && (
                    <Badge variant="secondary" className="mt-3 text-[0.68rem]">
                      {t.admin.rates.minNights(plan.minNights)}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
