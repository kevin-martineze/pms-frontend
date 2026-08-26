import { Suspense } from "react";
import type { Metadata } from "next";
import { lang } from "next/root-params";
import { TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHANNEL_COMMISSION, PAYMENT_CLASS, STATUS_CLASS } from "@/components/admin/labels";
import { ReservationFilters } from "@/components/admin/reservation-filters";
import { StatCard } from "@/components/admin/stat-card";
import { formatDateShort, formatMoney } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { unitName } from "@/lib/i18n/content";
import { unitById } from "@/lib/mock/property";
import { TODAY, reservations } from "@/lib/mock/reservations";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.reservations };
}

type Search = { q?: string; status?: string; payment?: string; channel?: string };

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);
  const nf = new Intl.NumberFormat(tag);

  const query = (params.q ?? "").trim().toLowerCase();

  const filtered = reservations
    .filter((r) => {
      if (params.status && r.status !== params.status) return false;
      if (params.payment && r.payment !== params.payment) return false;
      if (params.channel && r.channel !== params.channel) return false;
      if (query) {
        const haystack =
          `${r.guest.name} ${r.reference} ${r.room ?? ""} ${r.guest.email}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    })
    /* Las que llegan primero, primero. Una lista de reservas ordenada por fecha
       de creación es un log; ordenada por llegada es una agenda. */
    .sort((a, b) => a.range.checkIn.localeCompare(b.range.checkIn));

  const upcoming = filtered.filter((r) => r.range.checkIn >= TODAY).length;
  const owed =
    filtered.reduce((acc, r) => acc + (r.status === "cancelled" ? 0 : r.balance.amountMinor), 0) /
    100;
  const commission =
    filtered.reduce((acc, r) => acc + r.total.amountMinor * CHANNEL_COMMISSION[r.channel], 0) / 100;

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">{t.admin.reservations.eyebrow}</p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.reservations.title}</h1>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label={t.admin.reservations.upcoming}
          value={String(upcoming)}
          hint={t.admin.reservations.upcomingHint}
        />
        <StatCard
          label={t.admin.reservations.owed}
          value={`$${nf.format(Math.round(owed))}`}
          hint={t.admin.reservations.owedHint}
          tone={owed > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label={t.admin.reservations.commission}
          value={`$${nf.format(Math.round(commission))}`}
          hint={t.admin.reservations.commissionHint}
          tone="warning"
        />
      </div>

      <div className="mt-6">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <ReservationFilters total={filtered.length} />
        </Suspense>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[13rem]">{t.admin.reservations.colGuest}</TableHead>
                <TableHead>{t.admin.reservations.colRoom}</TableHead>
                <TableHead className="min-w-[11rem]">{t.admin.reservations.colUnit}</TableHead>
                <TableHead>{t.admin.reservations.colDates}</TableHead>
                <TableHead className="text-right">{t.admin.reservations.colNights}</TableHead>
                <TableHead>{t.admin.reservations.colStatus}</TableHead>
                <TableHead>{t.admin.reservations.colPayment}</TableHead>
                <TableHead>{t.admin.reservations.colChannel}</TableHead>
                <TableHead className="text-right">{t.admin.reservations.colTotal}</TableHead>
                <TableHead className="text-right">{t.admin.reservations.colBalance}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-14 text-center text-muted-foreground">
                    {t.admin.reservations.empty}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.slice(0, 80).map((reservation) => {
                  const unit = unitById.get(reservation.unitId);
                  const owes = reservation.balance.amountMinor > 0;
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <span className="block font-medium">{reservation.guest.name}</span>
                        <span className="block font-mono text-xs text-muted-foreground">
                          {reservation.reference}
                        </span>
                      </TableCell>
                      <TableCell className="tnum font-medium">{reservation.room}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {unit ? unitName(unit, locale) : ""}
                      </TableCell>
                      <TableCell className="tnum whitespace-nowrap text-muted-foreground">
                        {formatDateShort(reservation.range.checkIn, tag)} →{" "}
                        {formatDateShort(reservation.range.checkOut, tag)}
                      </TableCell>
                      <TableCell className="tnum text-right">{reservation.nights}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_CLASS[reservation.status]}>
                          {t.admin.status[reservation.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={PAYMENT_CLASS[reservation.payment]}>
                          {t.admin.payment[reservation.payment]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.admin.channelsShort[reservation.channel]}
                        {CHANNEL_COMMISSION[reservation.channel] > 0 && (
                          <span className="tnum block text-xs text-status-departing">
                            −{Math.round(CHANNEL_COMMISSION[reservation.channel] * 100)}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="tnum text-right">
                        {formatMoney(reservation.total, tag)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "tnum text-right",
                          owes && "font-medium text-status-departing",
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {owes && <TriangleAlert className="size-3.5" aria-hidden />}
                          {formatMoney(reservation.balance, tag)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {filtered.length > 80 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {t.admin.reservations.truncated(80, filtered.length)}
        </p>
      )}
    </div>
  );
}
