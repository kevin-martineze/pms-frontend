import type {
  Channel,
  Guest,
  IsoDate,
  PaymentStatus,
  Reservation,
  ReservationStatus,
} from "@/lib/domain/types";
import { addDays, diffNights, isWeekend, money, toIsoDate } from "@/lib/format";
import { allRooms, unitById } from "@/lib/mock/property";

/**
 * Reservas de demostración, generadas.
 *
 * Se generan en vez de escribirse a mano por dos razones. La primera es que el
 * calendario tiene que verse lleno pase el tiempo que pase: una demo con fechas
 * fijas se ve rota tres semanas después de grabarla. La segunda es que un
 * generador que respeta la regla "una habitación, una reserva por noche" prueba
 * la regla; una lista escrita a mano sólo la simula.
 *
 * El PRNG está sembrado con la fecha de hoy, así que dentro de un mismo día el
 * servidor y el cliente producen exactamente los mismos datos — sin eso, React
 * reportaría desajuste de hidratación en cada tabla.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** El "hoy" del sistema. Un solo lugar, para poder moverlo en una demo grabada. */
export const TODAY: IsoDate = toIsoDate(new Date());

/** La ventana que carga el calendario: tres semanas atrás, siete adelante. */
export const WINDOW_START = addDays(TODAY, -21);
export const WINDOW_END = addDays(TODAY, 49);

const FIRST_NAMES = [
  "María", "Carlos", "Ana", "Luis", "Sofía", "Diego", "Valeria", "José",
  "Emma", "Lukas", "Sophie", "Thomas", "Anneke", "Pieter", "Hannah", "Jens",
  "Claire", "Julien", "Camille", "Nicolas", "Michael", "Jennifer", "David",
  "Sarah", "Roberto", "Marisol", "Iván", "Gabriela", "Fernando", "Lucía",
];

const LAST_NAMES = [
  "Rodríguez", "González", "Pérez", "Martínez", "Sánchez", "Vega", "Castillo",
  "Müller", "Schmidt", "Weber", "De Vries", "Bakker", "Jansen", "Dubois",
  "Moreau", "Laurent", "Johnson", "Miller", "Anderson", "Clark", "Batista",
  "Espinosa", "Quintero", "Saldaña", "Cedeño", "Araúz",
];

const COUNTRIES = ["PA", "US", "CA", "DE", "NL", "FR", "CR", "CO", "ES", "GB"];

const CHANNEL_WEIGHTS: [Channel, number][] = [
  ["booking", 0.34],
  ["direct", 0.28],
  ["airbnb", 0.17],
  ["expedia", 0.07],
  ["phone", 0.08],
  ["walk-in", 0.06],
];

function pickChannel(r: number): Channel {
  let acc = 0;
  for (const [channel, weight] of CHANNEL_WEIGHTS) {
    acc += weight;
    if (r < acc) return channel;
  }
  return "direct";
}

function makeGuest(rnd: () => number, index: number): Guest {
  const first = FIRST_NAMES[Math.floor(rnd() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(rnd() * LAST_NAMES.length)];
  const previousStays = rnd() < 0.18 ? 1 + Math.floor(rnd() * 4) : 0;
  return {
    id: `g-${index}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase().replace(/[^a-z]/g, "")}.${last
      .toLowerCase()
      .replace(/[^a-z]/g, "")}@example.com`,
    phone: `+507 6${Math.floor(rnd() * 900 + 100)}-${Math.floor(rnd() * 9000 + 1000)}`,
    country: COUNTRIES[Math.floor(rnd() * COUNTRIES.length)],
    previousStays,
  };
}

/**
 * Tarifa de la noche. Fin de semana sube 22%: es el patrón real de un hotel de
 * playa con sports bar, donde el viernes y el sábado son el producto.
 */
function nightlyRate(base: number, date: IsoDate, rnd: () => number): number {
  const weekend = isWeekend(date) ? 1.22 : 1;
  const jitter = 0.94 + rnd() * 0.12;
  return base * weekend * jitter;
}

function deriveStatus(range: { checkIn: IsoDate; checkOut: IsoDate }, rnd: () => number): ReservationStatus {
  const startsInPast = range.checkIn <= TODAY;
  const endsInPast = range.checkOut <= TODAY;

  if (endsInPast) return rnd() < 0.05 ? "no-show" : "checked-out";
  if (startsInPast) return "in-house";
  return rnd() < 0.08 ? "pending" : "confirmed";
}

function derivePayment(status: ReservationStatus, channel: Channel, rnd: () => number): PaymentStatus {
  if (status === "checked-out") return "paid";
  if (status === "no-show") return rnd() < 0.5 ? "unpaid" : "deposit";
  /* Booking y Expedia cobran en destino con más frecuencia que el canal propio,
     donde el checkout pide depósito por adelantado. Es la razón operativa por la
     que "por cobrar" no es lo mismo que "impago". */
  if (channel === "booking" || channel === "expedia") return rnd() < 0.35 ? "paid" : "unpaid";
  if (channel === "airbnb") return "paid";
  return rnd() < 0.6 ? "deposit" : "paid";
}

function reference(rnd: () => number): string {
  const digits = Math.floor(rnd() * 900000 + 100000);
  return `DJ-${digits}`;
}

function build(): Reservation[] {
  const out: Reservation[] = [];
  let counter = 0;

  for (const { room, unitId } of allRooms) {
    const unit = unitById.get(unitId);
    if (!unit) continue;

    const rnd = mulberry32(hash(`${room}|${TODAY}`));
    let cursor = addDays(WINDOW_START, -Math.floor(rnd() * 4));

    while (cursor < WINDOW_END) {
      /* Hueco antes de la siguiente reserva. Las casas rotan más lento que las
         habitaciones del hotel, así que arrastran huecos más largos. */
      const maxGap = unit.propertyId === "p-casas" ? 7 : 4;
      const gap = Math.floor(rnd() * maxGap);
      cursor = addDays(cursor, gap);
      if (cursor >= WINDOW_END) break;

      const nights =
        unit.propertyId === "p-casas"
          ? 3 + Math.floor(rnd() * 6)
          : 1 + Math.floor(rnd() * 6);
      const checkIn = cursor;
      const checkOut = addDays(checkIn, nights);
      const range = { checkIn, checkOut };

      const channel = pickChannel(rnd());
      const status = deriveStatus(range, rnd);
      const payment = derivePayment(status, channel, rnd);

      let subtotal = 0;
      for (let i = 0; i < nights; i++) {
        subtotal += nightlyRate(unit.basePrice.amountMinor / 100, addDays(checkIn, i), rnd);
      }
      /* ITBMS panameño sobre hospedaje: 10%. Va desglosado porque un total sin
         desglose es la principal fuente de disputas en recepción. */
      const tax = subtotal * 0.1;
      const cleaning = unit.propertyId === "p-casas" ? 45 : 0;
      const total = subtotal + tax + cleaning;

      const balance =
        payment === "paid" ? 0 : payment === "deposit" ? total * 0.7 : total;

      const adults = Math.min(unit.capacity.guests, 1 + Math.floor(rnd() * 3));
      const children = rnd() < 0.25 ? 1 + Math.floor(rnd() * 2) : 0;

      out.push({
        id: `r-${counter}`,
        reference: reference(rnd),
        unitId,
        room,
        guest: makeGuest(rnd, counter),
        range,
        nights,
        guests: adults + children,
        adults,
        children,
        status,
        payment,
        channel,
        total: money(Math.round(total)),
        /* Sin el ITBMS, igual que lo que devuelve la API: es sobre esto que se
           calculan ADR, RevPAR e ingreso. La limpieza sí es ingreso del hotel. */
        net: money(Math.round(subtotal + cleaning)),
        balance: money(Math.round(balance)),
        createdAt: addDays(checkIn, -(3 + Math.floor(rnd() * 40))),
      });

      counter += 1;
      cursor = checkOut;
    }
  }

  return out.sort((a, b) => a.range.checkIn.localeCompare(b.range.checkIn));
}

export const reservations: Reservation[] = build();

// ---------------------------------------------------------------------------
// Consultas
// ---------------------------------------------------------------------------

const LIVE: ReservationStatus[] = ["confirmed", "in-house", "pending"];

export function reservationsForRoom(room: string): Reservation[] {
  return reservations.filter((r) => r.room === room && r.status !== "cancelled");
}

export function arrivalsOn(date: IsoDate): Reservation[] {
  return reservations.filter((r) => r.range.checkIn === date && LIVE.includes(r.status));
}

export function departuresOn(date: IsoDate): Reservation[] {
  return reservations.filter(
    (r) => r.range.checkOut === date && (r.status === "in-house" || r.status === "checked-out"),
  );
}

export function inHouseOn(date: IsoDate): Reservation[] {
  return reservations.filter(
    (r) =>
      r.range.checkIn <= date &&
      r.range.checkOut > date &&
      (r.status === "in-house" || r.status === "checked-out" || r.status === "confirmed"),
  );
}

/**
 * Ocupación como habitaciones vendidas sobre habitaciones disponibles. No es el
 * número de reservas: una casa de tres cuartos es una llave, no tres.
 */
export function occupancyOn(date: IsoDate): number {
  const sold = inHouseOn(date).length;
  return allRooms.length === 0 ? 0 : sold / allRooms.length;
}

/** ADR — tarifa media diaria sobre las habitaciones efectivamente vendidas. */
export function adrOn(date: IsoDate): number {
  const stays = inHouseOn(date);
  if (stays.length === 0) return 0;
  const sum = stays.reduce((acc, r) => acc + r.total.amountMinor / r.nights, 0);
  return sum / stays.length / 100;
}

/** RevPAR — ingreso por habitación disponible. Ocupación y ADR en un número. */
export function revparOn(date: IsoDate): number {
  return adrOn(date) * occupancyOn(date);
}

export function revenueBetween(from: IsoDate, to: IsoDate): number {
  let total = 0;
  for (const r of reservations) {
    if (r.status === "cancelled" || r.status === "no-show") continue;
    for (let d = r.range.checkIn; d < r.range.checkOut; d = addDays(d, 1)) {
      if (d >= from && d < to) total += r.total.amountMinor / r.nights / 100;
    }
  }
  return total;
}

export function channelMix(from: IsoDate, to: IsoDate): { channel: Channel; nights: number; revenue: number }[] {
  const map = new Map<Channel, { nights: number; revenue: number }>();
  for (const r of reservations) {
    if (r.status === "cancelled" || !r.channel) continue;
    for (let d = r.range.checkIn; d < r.range.checkOut; d = addDays(d, 1)) {
      if (d < from || d >= to) continue;
      const entry = map.get(r.channel) ?? { nights: 0, revenue: 0 };
      entry.nights += 1;
      entry.revenue += r.total.amountMinor / r.nights / 100;
      map.set(r.channel, entry);
    }
  }
  return [...map.entries()]
    .map(([channel, v]) => ({ channel, ...v }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function dateRangeArray(from: IsoDate, to: IsoDate): IsoDate[] {
  const out: IsoDate[] = [];
  for (let d = from; d < to; d = addDays(d, 1)) out.push(d);
  return out;
}

export { diffNights };
