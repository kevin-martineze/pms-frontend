import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHANNEL_COMMISSION, CHANNEL_SHORT } from "@/components/admin/labels";
import { StatCard } from "@/components/admin/stat-card";
import { addDays, formatDate } from "@/lib/format";
import { allRooms, units } from "@/lib/mock/property";
import {
  TODAY,
  channelMix,
  inHouseOn,
  reservations,
  revenueBetween,
} from "@/lib/mock/reservations";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Reportes" };

export default function ReportsPage() {
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
    mix
      .filter((r) => CHANNEL_COMMISSION[r.channel] === 0)
      .reduce((acc, r) => acc + r.revenue, 0) / (revenue || 1);

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
    countries.set(r.guest.country, (countries.get(r.guest.country) ?? 0) + 1);
  }
  const topCountries = [...countries.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">
          {formatDate(from)} → {formatDate(TODAY)}
        </p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">Últimos 30 días</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Los cuatro números que resumen un mes de hotel, y las dos tablas que explican de dónde
          salieron.
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ingresos"
          value={`$${Math.round(revenue).toLocaleString("es-PA")}`}
          hint="vs. los 30 días previos"
          delta={{
            value: `${Math.abs(Math.round(((revenue - previous) / (previous || 1)) * 100))}%`,
            direction: revenue > previous ? "up" : revenue < previous ? "down" : "flat",
          }}
        />
        <StatCard
          label="Ocupación"
          value={`${Math.round(occupancy * 100)}%`}
          hint={`${nightsSold} de ${nightsAvailable} noches`}
        />
        <StatCard label="ADR" value={`$${Math.round(adr)}`} hint="tarifa media por noche vendida" />
        <StatCard
          label="Comisión pagada"
          value={`$${Math.round(commissionPaid).toLocaleString("es-PA")}`}
          hint={`${Math.round(directShare * 100)}% del ingreso vino sin comisión`}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* --- Rendimiento por unidad --------------------------------------- */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">Rendimiento por tipo de unidad</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ordenado por ingreso. Una unidad al 90% de ocupación está barata.
            </p>
          </header>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[12rem]">Unidad</TableHead>
                  <TableHead className="text-right">Noches</TableHead>
                  <TableHead className="text-right">Ocupación</TableHead>
                  <TableHead className="text-right">ADR</TableHead>
                  <TableHead className="text-right">Ingreso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byUnit.map((row) => (
                  <TableRow key={row.unit.id}>
                    <TableCell>
                      <span className="block font-medium">{row.unit.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {row.unit.inventoryCount}{" "}
                        {row.unit.inventoryCount === 1 ? "llave" : "llaves"}
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
                      ${Math.round(row.income).toLocaleString("es-PA")}
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
              <h2 className="text-sm font-medium">Lo que costó cada canal</h2>
            </header>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead className="text-right">Ingreso</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mix.map((row) => {
                  const fee = row.revenue * CHANNEL_COMMISSION[row.channel];
                  return (
                    <TableRow key={row.channel}>
                      <TableCell>
                        {CHANNEL_SHORT[row.channel]}
                        {fee === 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-butter/25 text-[0.62rem] text-accent-foreground"
                          >
                            propio
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="tnum text-right">
                        ${Math.round(row.revenue).toLocaleString("es-PA")}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "tnum text-right",
                          fee > 0 ? "text-status-departing" : "text-status-vacant-clean",
                        )}
                      >
                        {fee > 0 ? `−$${Math.round(fee).toLocaleString("es-PA")}` : "$0"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </section>

          {/* --- Procedencia ------------------------------------------------ */}
          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-medium">De dónde vienen los huéspedes</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Decide en qué idiomas vale la pena invertir primero.
            </p>
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
