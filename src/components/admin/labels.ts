import type { Channel, PaymentStatus, ReservationStatus, RoomState } from "@/lib/domain/types";

/**
 * Lo que de un estado no es texto.
 *
 * Los nombres traducibles viven en `src/lib/i18n`; aquí quedan sólo el dato
 * duro (la comisión de cada canal) y el color de cada estado. Separarlos evita
 * el error más común de un sistema multilingüe: una clase de Tailwind metida en
 * un archivo de traducción, que se rompe en cuanto alguien traduce el valor.
 */

/** Comisión típica del canal. Es lo que hace visible el costo de cada reserva. */
export const CHANNEL_COMMISSION: Record<Channel, number> = {
  direct: 0,
  booking: 0.17,
  airbnb: 0.15,
  expedia: 0.18,
  "walk-in": 0,
  phone: 0,
};

export const STATUS_CLASS: Record<ReservationStatus, string> = {
  confirmed: "bg-status-arriving/12 text-status-arriving border-status-arriving/25",
  "in-house": "bg-status-occupied/12 text-status-occupied border-status-occupied/25",
  "checked-out": "bg-muted text-muted-foreground border-border",
  cancelled: "bg-muted text-muted-foreground border-border line-through",
  "no-show": "bg-destructive/10 text-destructive border-destructive/25",
  pending: "bg-status-vacant-dirty/15 text-status-vacant-dirty border-status-vacant-dirty/30",
};

export const PAYMENT_CLASS: Record<PaymentStatus, string> = {
  paid: "bg-status-vacant-clean/12 text-status-vacant-clean border-status-vacant-clean/25",
  deposit: "bg-status-vacant-dirty/15 text-status-vacant-dirty border-status-vacant-dirty/30",
  unpaid: "bg-status-departing/12 text-status-departing border-status-departing/25",
  refunded: "bg-muted text-muted-foreground border-border",
};

export const ROOM_STATE_CLASS: Record<RoomState, string> = {
  "vacant-clean": "bg-status-vacant-clean/15 text-status-vacant-clean border-status-vacant-clean/30",
  "vacant-dirty": "bg-status-vacant-dirty/20 text-status-vacant-dirty border-status-vacant-dirty/40",
  occupied: "bg-status-occupied/15 text-status-occupied border-status-occupied/30",
  arriving: "bg-status-arriving/15 text-status-arriving border-status-arriving/30",
  departing: "bg-status-departing/15 text-status-departing border-status-departing/30",
  blocked: "bg-muted text-muted-foreground border-border",
};
