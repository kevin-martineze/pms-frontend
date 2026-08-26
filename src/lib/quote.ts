import type { IsoDate, Quote, QuoteLine } from "@/lib/domain/types";
import { addDays, diffNights, money } from "@/lib/format";

/**
 * Composición del desglose, sin dependencias de datos.
 *
 * Está separado de `availability.ts` a propósito: aquel importa el set completo
 * de reservas, y el panel de reserva corre en el cliente. Pasando sólo la tabla
 * de tarifas de las fechas visibles, el navegador recalcula el total al instante
 * sin que se le mande el calendario entero del hotel.
 */

/**
 * Las etiquetas entran como parámetro en vez de escribirse aquí.
 *
 * El desglose se muestra en cinco idiomas, y una función de cálculo que
 * devuelve texto en uno solo es la forma más directa de que un huésped alemán
 * vea su total explicado en español. Aquí se calcula; el diccionario nombra.
 */
export type QuoteLabels = {
  nights: (n: number, unit: string) => string;
  directDiscount: (pct: number) => string;
  cleaning: string;
  tax: (pct: number) => string;
};

export type QuoteInput = {
  unitId: string;
  unitName: string;
  /** Fecha ISO → tarifa de esa noche, en dólares. */
  rates: Record<IsoDate, number>;
  checkIn: IsoDate;
  checkOut: IsoDate;
  guests: number;
  cleaningFee: number;
  directDiscount: boolean;
  labels: QuoteLabels;
};

/** ITBMS de hospedaje en Panamá. */
export const TAX_RATE = 0.1;
/** Descuento del canal propio frente a las OTAs. */
export const DIRECT_DISCOUNT = 0.07;
/** Depósito al reservar; el resto se cobra en el check-in. */
export const DEPOSIT_RATE = 0.3;

export function composeQuote(input: QuoteInput): Quote | null {
  const nights = diffNights(input.checkIn, input.checkOut);
  if (nights <= 0) return null;

  let accommodation = 0;
  for (let i = 0; i < nights; i++) {
    accommodation += input.rates[addDays(input.checkIn, i)] ?? 0;
  }

  const lines: QuoteLine[] = [
    {
      label: input.labels.nights(nights, input.unitName),
      amount: money(round2(accommodation)),
      kind: "nightly",
    },
  ];

  if (input.directDiscount) {
    lines.push({
      label: input.labels.directDiscount(Math.round(DIRECT_DISCOUNT * 100)),
      amount: money(-round2(accommodation * DIRECT_DISCOUNT)),
      kind: "discount",
    });
    accommodation *= 1 - DIRECT_DISCOUNT;
  }

  if (input.cleaningFee > 0) {
    lines.push({ label: input.labels.cleaning, amount: money(input.cleaningFee), kind: "fee" });
  }

  const taxable = accommodation + input.cleaningFee;
  const tax = taxable * TAX_RATE;
  lines.push({
    label: input.labels.tax(Math.round(TAX_RATE * 100)),
    amount: money(round2(tax)),
    kind: "tax",
  });

  const total = taxable + tax;

  return {
    unitId: input.unitId,
    range: { checkIn: input.checkIn, checkOut: input.checkOut },
    guests: input.guests,
    nights,
    lines,
    total: money(round2(total)),
    dueNow: money(round2(total * DEPOSIT_RATE)),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
