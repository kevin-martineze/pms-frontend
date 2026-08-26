import type { IsoDate, Quote, Unit, UnitAvailability } from "@/lib/domain/types";
import { addDays, diffNights, isWeekend, money } from "@/lib/format";
import { unitById } from "@/lib/mock/property";
import { reservations } from "@/lib/mock/reservations";
import { seasonFor } from "@/lib/mock/operations";

/**
 * Disponibilidad y cotización, calculadas desde las mismas reservas que dibuja
 * el PMS.
 *
 * Esto es la mitad del argumento de la propuesta. Un sitio y un sistema de
 * gestión separados terminan discrepando, y el huésped se entera en recepción.
 * Aquí la habitación que el calendario del admin muestra ocupada es la misma
 * que el sitio se niega a vender, porque leen la misma fuente.
 */

const BLOCKING = new Set(["confirmed", "in-house", "pending"]);

/** Cuántas unidades de un tipo están tomadas esa noche. */
function soldOn(unitId: string, date: IsoDate): number {
  let count = 0;
  for (const r of reservations) {
    if (r.unitId !== unitId) continue;
    if (!BLOCKING.has(r.status)) continue;
    if (r.range.checkIn <= date && r.range.checkOut > date) count += 1;
  }
  return count;
}

export function availabilityFor(unit: Unit, checkIn: IsoDate, checkOut: IsoDate): UnitAvailability {
  const blockedDates: IsoDate[] = [];
  let worstLeft = unit.inventoryCount;

  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) {
    const left = unit.inventoryCount - soldOn(unit.id, d);
    if (left <= 0) blockedDates.push(d);
    worstLeft = Math.min(worstLeft, left);
  }

  return {
    unitId: unit.id,
    blockedDates,
    /* Dos noches mínimo en fin de semana es lo normal en un hotel de playa;
       aquí queda en 1 hasta que el cliente lo defina. Está expuesto para que
       cambiarlo sea un dato, no un despliegue. */
    minNights: 1,
    unitsLeft: Math.max(0, worstLeft),
  };
}

/** Noches sueltas ocupadas en los próximos 90 días — alimenta el calendario. */
export function blockedDatesAhead(unit: Unit, days = 120): IsoDate[] {
  const today = new Date();
  const start = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
  const out: IsoDate[] = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i);
    if (unit.inventoryCount - soldOn(unit.id, date) <= 0) out.push(date);
  }
  return out;
}

/**
 * Tarifa de una noche concreta: base × temporada × fin de semana.
 *
 * El desglose se calcula noche por noche y no como "base × noches" porque el
 * huésped que llega el viernes y se va el lunes paga tres tarifas distintas, y
 * un total que no las explica es la principal fuente de disputas en recepción.
 */
export function nightlyRate(unit: Unit, date: IsoDate): number {
  const season = seasonFor(date);
  const seasonFactor = 1 + (season?.adjustmentPct ?? 0) / 100;
  const weekendFactor = isWeekend(date) ? 1.22 : 1;
  return (unit.basePrice.amountMinor / 100) * seasonFactor * weekendFactor;
}

export type QuoteOptions = {
  /** Descuento del canal propio. Es la palanca comercial de toda la propuesta. */
  directDiscount?: boolean;
};

export function quoteFor(
  unitId: string,
  checkIn: IsoDate,
  checkOut: IsoDate,
  guests: number,
  options: QuoteOptions = {},
): Quote | null {
  const unit = unitById.get(unitId);
  if (!unit) return null;

  const nights = diffNights(checkIn, checkOut);
  if (nights <= 0) return null;

  let accommodation = 0;
  for (let i = 0; i < nights; i++) {
    accommodation += nightlyRate(unit, addDays(checkIn, i));
  }

  const lines: Quote["lines"] = [
    {
      label: `${nights} ${nights === 1 ? "noche" : "noches"} × ${unit.name}`,
      amount: money(round2(accommodation)),
      kind: "nightly",
    },
  ];

  if (options.directDiscount) {
    lines.push({
      label: "Descuento por reservar directo (7%)",
      amount: money(-round2(accommodation * 0.07)),
      kind: "discount",
    });
    accommodation *= 0.93;
  }

  /* Las casas llevan limpieza única; las habitaciones del hotel la traen dentro
     de la tarifa porque camarería entra todos los días. */
  const cleaning = unit.propertyId === "p-casas" ? 45 : 0;
  if (cleaning > 0) {
    lines.push({ label: "Limpieza final", amount: money(cleaning), kind: "fee" });
  }

  /* ITBMS de hospedaje en Panamá: 10%. Va desglosado siempre. */
  const taxable = accommodation + cleaning;
  const tax = taxable * 0.1;
  lines.push({ label: "ITBMS (10%)", amount: money(round2(tax)), kind: "tax" });

  const total = taxable + tax;

  return {
    unitId,
    range: { checkIn, checkOut },
    guests,
    nights,
    lines,
    total: money(round2(total)),
    /* Depósito del 30% al reservar, resto en el check-in. Es lo que permite
       operar sin bloquear el capital del huésped y sin quedar expuesto a un
       no-show total. */
    dueNow: money(round2(total * 0.3)),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
