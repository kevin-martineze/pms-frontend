import type { Metadata } from "next";
import { lang } from "next/root-params";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHANNEL_COMMISSION } from "@/components/admin/labels";
import { StatCard } from "@/components/admin/stat-card";
import { addDays, formatDate } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { unitName } from "@/lib/i18n/content";
import { allRooms, units } from "@/lib/mock/property";
import { TODAY, channelMix, inHouseOn, reservations, revenueBetween } from "@/lib/mock/reservations";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.reports };
}

export default async function ReportsPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);
  const nf = new Intl.NumberFormat(tag);

  const from = addDays(TODAY, -29);
  const to = addDays(TODAY, 1);

  const revenue = revenueBetween(from, to);
  const previous = revenueBetween(addDays(TODAY, -59), addDays(TODAY, -29));

  const nightsSold = Array.from({ length: 30 }, (_, i) => inHouseOn(addDays(from, i)).length).reduce(
    (a, b) => a + b,
    0,
  );
  const nightsAvailable = allRooms.length * 30;
  const occupancy = nightsSold / nightsAvailable;
  const adr = nightsSold === 0 ? 0 : revenue / nightsSold;

  const mix = channelMix(from, to);
  const commissionPaid = mix.reduce(
    (acc, row) => acc + row.revenue * CHANNEL_COMMISSION[row.channel],
    0,
  );
  const directShare =
    mix.filter((r) => CHANNEL_COMMISSION[r.channel] === 0).reduce((acc, r) => acc + r.revenue, 0) /
    (revenue || 1);

  /* Rendimiento por tipo de unidad. Es el reporte que decide qué se remodela
     primero y qué tarifa se sube: una unidad al 90% está barata. */
  const byUnit = units
    .map((unit) => {
      const stays = reservations.filter(
        (r) =>
          r.unitId === unit.id &&
          r.status !== "cancelled" &&
          r.range.checkOut > from &&
          r.range.checkIn < to,
      );
      let nights = 0;
      let income = 0;
      for (const stay of stays) {
        for (let d = stay.range.checkIn; d < stay.range.checkOut; d = addDays(d, 1)) {
          if (d >= from && d < to) {
            nights += 1;
            income += stay.total.amountMinor / stay.nights / 100;
          }
        }
      }
      const capacity = unit.inventoryCount * 30;
      return {
        unit,
        nights,
        income,
        occupancy: capacity === 0 ? 0 : nights / capacity,
        adr: nights === 0 ? 0 : income / nights,
      };
    })
    .sort((a, b) => b.income - a.income);

  const countries = new Map<string, number>();
  for (const r of reservations) {
    if (r.range.checkIn < from || r.range.checkIn >= to) continue;
    /* La nacionalidad es opcional desde que el tipo refleja lo que la API
       guarda de verdad. Esta pantalla todavía corre sobre datos de
       demostración, donde siempre viene. */
    if (!r.guest.country) continue;
    countries.set(r.guest.country, (countries.get(r.guest.country) ?? 0) + 1);
  }
  const topCountries = [...countries.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">
          {formatDate(from, tag)} → {formatDate(TODAY, tag)}
        </p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.reports.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.reports.lead}</p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.admin.reports.revenue}
          value={`$${nf.format(Math.round(revenue))}`}
          hint={t.admin.reports.revenueHint}
          delta={{
            value: `${Math.abs(Math.round(((revenue - previous) / (previous || 1)) * 100))}%`,
            direction: revenue > previous ? "up" : revenue < previous ? "down" : "flat",
          }}
        />
        <StatCard
          label={t.admin.reports.occupancy}
          value={`${Math.round(occupancy * 100)}%`}
          hint={t.admin.reports.occupancyHint(nightsSold, nightsAvailable)}
        />
        <StatCard
          label={t.admin.reports.adr}
          value={`$${Math.round(adr)}`}
          hint={t.admin.reports.adrHint}
        />
        <StatCard
          label={t.admin.reports.commission}
          value={`$${nf.format(Math.round(commissionPaid))}`}
          hint={t.admin.reports.commissionHint(Math.round(directShare * 100))}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* --- Rendimiento por unidad --------------------------------------- */}
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
                {byUnit.map((row) => (
                  <TableRow key={row.unit.id}>
                    <TableCell>
                      <span className="block font-medium">{unitName(row.unit, locale)}</span>
                      <span className="block text-xs text-muted-foreground">
                        {t.admin.reports.keys(row.unit.inventoryCount)}
                      </span>
                    </TableCell>
                    <TableCell className="tnum text-right">{row.nights}</TableCell>
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
                    <TableCell className="tnum text-right">${Math.round(row.adr)}</TableCell>
                    <TableCell className="tnum text-right font-medium">
                      ${nf.format(Math.round(row.income))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="space-y-5">
          {/* --- Costo por canal ------------------------------------------- */}
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-medium">{t.admin.reports.channelCostTitle}</h2>
            </header>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.admin.reports.colChannel}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colRevenue}</TableHead>
                  <TableHead className="text-right">{t.admin.reports.colCommission}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mix.map((row) => {
                  const fee = row.revenue * CHANNEL_COMMISSION[row.channel];
                  return (
                    <TableRow key={row.channel}>
                      <TableCell>
                        {t.admin.channelsShort[row.channel]}
                        {fee === 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-butter/25 text-[0.62rem] text-accent-foreground"
                          >
                            {t.admin.reports.ownTag}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="tnum text-right">
                        ${nf.format(Math.round(row.revenue))}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "tnum text-right",
                          fee > 0 ? "text-status-departing" : "text-status-vacant-clean",
                        )}
                      >
                        {fee > 0 ? `−$${nf.format(Math.round(fee))}` : "$0"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </section>

          {/* --- Procedencia ------------------------------------------------ */}
          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-medium">{t.admin.reports.originTitle}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.admin.reports.originSub}</p>
            <ul className="mt-4 space-y-2.5">
              {topCountries.map(([country, count]) => {
                const share = count / (topCountries[0]?.[1] || 1);
                return (
                  <li key={country} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 font-medium">{country}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full bg-palm/70"
                        style={{ width: `${share * 100}%` }}
                      />
                    </span>
                    <span className="tnum w-6 shrink-0 text-right text-muted-foreground">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
