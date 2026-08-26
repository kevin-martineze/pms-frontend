import type { Channel, PaymentStatus, ReservationStatus } from "@/lib/domain/types";

/**
 * Etiquetas en español para los estados del dominio.
 *
 * Viven en un solo archivo porque el nombre de un estado aparece en la tabla, en
 * el calendario, en el filtro y en el detalle. Cuando "pendiente" pase a
 * llamarse "por confirmar" — y va a pasar, en la primera semana de operación —
 * el cambio es una línea.
 */

export const CHANNEL_LABEL: Record<Channel, string> = {
  direct: "Sitio propio",
  booking: "Booking.com",
  airbnb: "Airbnb",
  expedia: "Expedia",
  "walk-in": "Llegó sin reserva",
  phone: "Teléfono / WhatsApp",
};

export const CHANNEL_SHORT: Record<Channel, string> = {
  direct: "Directo",
  booking: "Booking",
  airbnb: "Airbnb",
  expedia: "Expedia",
  "walk-in": "Walk-in",
  phone: "Teléfono",
};

/** Comisión típica del canal. Es lo que hace visible el costo de cada reserva. */
export const CHANNEL_COMMISSION: Record<Channel, number> = {
  direct: 0,
  booking: 0.17,
  airbnb: 0.15,
  expedia: 0.18,
  "walk-in": 0,
  phone: 0,
};

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  confirmed: "Confirmada",
  "in-house": "En casa",
  "checked-out": "Salió",
  cancelled: "Cancelada",
  "no-show": "No llegó",
  pending: "Por confirmar",
};

export const STATUS_CLASS: Record<ReservationStatus, string> = {
  confirmed: "bg-status-arriving/12 text-status-arriving border-status-arriving/25",
  "in-house": "bg-status-occupied/12 text-status-occupied border-status-occupied/25",
  "checked-out": "bg-muted text-muted-foreground border-border",
  cancelled: "bg-muted text-muted-foreground border-border line-through",
  "no-show": "bg-destructive/10 text-destructive border-destructive/25",
  pending: "bg-status-vacant-dirty/15 text-status-vacant-dirty border-status-vacant-dirty/30",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  paid: "Pagada",
  deposit: "Depósito",
  unpaid: "Por cobrar",
  refunded: "Reembolsada",
};

export const PAYMENT_CLASS: Record<PaymentStatus, string> = {
  paid: "bg-status-vacant-clean/12 text-status-vacant-clean border-status-vacant-clean/25",
  deposit: "bg-status-vacant-dirty/15 text-status-vacant-dirty border-status-vacant-dirty/30",
  unpaid: "bg-status-departing/12 text-status-departing border-status-departing/25",
  refunded: "bg-muted text-muted-foreground border-border",
};
