import type { IsoDate, Money } from "@/lib/domain/types";

/**
 * Panamá usa el dólar (el balboa circula a la par y sólo en monedas), así que
 * USD es la moneda real del negocio, no un placeholder.
 */
export function formatMoney(money: Money, locale = "es-PA"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: money.amountMinor % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(money.amountMinor / 100);
}

/** Sin decimales ni símbolo repetido: para tablas densas del PMS. */
export function formatMoneyCompact(money: Money): string {
  const value = money.amountMinor / 100;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${Math.round(value)}`;
}

export function money(amount: number, currency = "USD"): Money {
  return { amountMinor: Math.round(amount * 100), currency };
}

export function addMoney(a: Money, b: Money): Money {
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

/**
 * Las fechas del dominio son días de calendario. Construirlas con `new Date(iso)`
 * las interpreta como UTC medianoche y en Panamá (UTC-5) eso las corre un día
 * hacia atrás al formatear en local — un bug de una noche entera en una reserva.
 * Por eso se parte el string a mano.
 */
export function parseIsoDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIsoDate(date: Date): IsoDate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function diffNights(from: IsoDate, to: IsoDate): number {
  const ms = parseIsoDate(to).getTime() - parseIsoDate(from).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatDate(iso: IsoDate, locale = "es-PA"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseIsoDate(iso));
}

export function formatDateShort(iso: IsoDate, locale = "es-PA"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(parseIsoDate(iso));
}

export function formatRange(range: { checkIn: IsoDate; checkOut: IsoDate }): string {
  return `${formatDateShort(range.checkIn)} — ${formatDateShort(range.checkOut)}`;
}

export function formatWeekday(iso: IsoDate, locale = "es-PA"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(parseIsoDate(iso));
}

export function isWeekend(iso: IsoDate): boolean {
  const day = parseIsoDate(iso).getDay();
  return day === 0 || day === 5 || day === 6;
}

export function pluralNights(n: number): string {
  return n === 1 ? "1 noche" : `${n} noches`;
}

export function pluralGuests(n: number): string {
  return n === 1 ? "1 huésped" : `${n} huéspedes`;
}
