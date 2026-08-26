import type { IsoDate, Quote, Unit, UnitAvailability } from "@/lib/domain/types";
import { addDays, diffNights, isWeekend, toIsoDate } from "@/lib/format";
import { composeQuote, type QuoteLabels } from "@/lib/quote";
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
  const start = toIsoDate(new Date());
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

/** Las casas llevan limpieza única; en el hotel va dentro de la tarifa. */
export function cleaningFeeFor(unit: Unit): number {
  return unit.propertyId === "p-casas" ? 45 : 0;
}

/**
 * Tabla de tarifas de una unidad, noche por noche.
 *
 * Es lo que el servidor le pasa al panel de reserva para que recalcule el total
 * en el navegador sin volver a preguntar. Cuatro meses cubre de sobra el
 * horizonte con el que reserva un huésped.
 */
export function ratesFor(unit: Unit, from: IsoDate, days = 150): Record<IsoDate, number> {
  const rates: Record<IsoDate, number> = {};
  for (let i = 0; i < days; i++) {
    const date = addDays(from, i);
    rates[date] = Math.round(nightlyRate(unit, date) * 100) / 100;
  }
  return rates;
}

/**
 * Cotización del lado del servidor.
 *
 * Delega en `composeQuote` en vez de repetir la aritmética: dos implementaciones
 * del mismo desglose acaban discrepando en un centavo, y el centavo aparece
 * entre lo que el huésped vio al reservar y lo que dice su factura.
 */
export function quoteFor(
  unitId: string,
  checkIn: IsoDate,
  checkOut: IsoDate,
  guests: number,
  labels: QuoteLabels,
  unitDisplayName?: string,
): Quote | null {
  const unit = unitById.get(unitId);
  if (!unit) return null;

  return composeQuote({
    unitId,
    unitName: unitDisplayName ?? unit.name,
    rates: ratesFor(unit, checkIn, diffNights(checkIn, checkOut) + 1),
    checkIn,
    checkOut,
    guests,
    cleaningFee: cleaningFeeFor(unit),
    directDiscount: true,
    labels,
  });
}
