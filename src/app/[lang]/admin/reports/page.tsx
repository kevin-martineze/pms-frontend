import type { Metadata } from "next";
import { lang } from "next/root-params";

import { NoAccess } from "@/components/admin/no-access";
import { StatCard } from "@/components/admin/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPerformanceReport } from "@/lib/api/server";
import { canAccess } from "@/lib/auth/access";
import { getSession } from "@/lib/auth/server-session";
import { addDays, formatDate, formatMoney, toIsoDate } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.reports };
}

const PERIOD_NIGHTS = 30;

export default async function ReportsPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const session = await getSession();
  if (!session) return null;

  /* El backend ya devuelve 403 a quien no sea OWNER o MANAGER. Esto evita que
     alguien llegue a una pantalla vacía y confusa escribiendo la URL: sin este
     control, recepción vería el reporte sin datos y creería que el hotel no
     vendió nada. */
  if (!canAccess(session.role, "reports")) {
    return <NoAccess t={t} section={t.admin.nav.reports} />;
  }

  /* La misma función que el resto del sistema. Tenía su propio `Intl` acá, y en
     `es-PA` rendía "USD 325" mientras el panel de Hoy decía "$320". */
  const money = (minor: number) =>
    formatMoney({ amountMinor: minor, currency: session.property.currency }, tag);

  const today = toIsoDate(new Date());
  /* `to` exclusivo y un día adelante: el período termina esta noche, así que
     incluye la noche de hoy. */
  const to = addDays(today, 1);
  const from = addDays(to, -PERIOD_NIGHTS);

  const report = await getPerformanceReport(session, { from, to });

  const { revenue, occupancy } = report;
  const previous = revenue.previousNetMinor;
  const deltaPct =
    previous === 0 ? null : Math.round(((revenue.netMinor - previous) / previous) * 100);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">
          {formatDate(from, tag)} → {formatDate(today, tag)}
        </p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.reports.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.reports.lead}</p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.admin.reports.revenue}
          value={money(revenue.netMinor)}
          hint={
            deltaPct === null
              ? t.admin.reports.revenueNet
              : t.admin.reports.revenueHint
          }
          delta={
            deltaPct === null
              ? undefined
              : {
                  value: `${Math.abs(deltaPct)}%`,
                  direction: deltaPct > 0 ? "up" : deltaPct < 0 ? "down" : "flat",
                }
          }
        />
        <StatCard
          label={t.admin.reports.occupancy}
          value={`${Math.round(occupancy.rate * 100)}%`}
          hint={t.admin.reports.occupancyHint(
            occupancy.nightsSold,
            occupancy.nightsAvailable,
          )}
        />
        <StatCard
          label={t.admin.reports.adr}
          value={money(report.adrMinor)}
          hint={t.admin.reports.adrHint}
        />
        <StatCard
          label={t.admin.reports.revpar}
          value={money(report.revparMinor)}
          hint={t.admin.reports.revparHint}
        />
      </div>

      {/* El impuesto, aparte y explícito: no es ingreso del hotel. */}
      <p className="mt-3 text-xs text-muted-foreground">
        {t.admin.reports.taxCollected(money(revenue.taxMinor))}
      </p>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">{t.admin.reports.byUnitTitle}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.admin.reports.byUnitSub}</p>
          </header>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[12rem]">{t.admin.reports.colUnit}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colNights}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colOccupancy}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colAdr}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colRevenue}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...report.byUnitType]
                  .sort((a, b) => b.netMinor - a.netMinor)
                  .map((row) => (
                    <TableRow key={row.unitTypeId}>
                      <TableCell>
                        <span className="block font-medium">{row.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {t.admin.reports.keys(row.units)}
                        </span>
                      </TableCell>
                      <TableCell className="tnum text-right">{row.nightsSold}</TableCell>
                      <TableCell className="tnum text-right">
                        <span
                          className={cn(
                            row.occupancy >= 0.85 && "font-medium text-status-vacant-clean",
                            row.occupancy < 0.4 && "text-status-departing",
                          )}
                        >
                          {Math.round(row.occupancy * 100)}%
                        </span>
                      </TableCell>
                      <TableCell className="tnum text-right">{money(row.adrMinor)}</TableCell>
                      <TableCell className="tnum text-right font-medium">
                        {money(row.netMinor)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">{t.admin.reports.sourceTitle}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.admin.reports.sourceSub}</p>
          </header>
          {report.bySource.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">{t.admin.reports.empty}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.admin.reports.colSource}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colBookings}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colRevenue}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.bySource.map((row) => (
                  <TableRow key={row.source}>
                    <TableCell>{t.admin.reports.sources[row.source]}</TableCell>
                    <TableCell className="tnum text-right">{row.bookings}</TableCell>
                    <TableCell className="tnum text-right font-medium">
                      {money(row.netMinor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  );
}
