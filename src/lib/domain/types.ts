/**
 * El vocabulario compartido entre el sitio del huésped y el PMS.
 *
 * Las dos mitades del producto hablan de lo mismo — una habitación, una noche,
 * una reserva — y si cada una lo modela por su cuenta terminan discrepando en
 * el peor momento posible: cuando el huésped ya está en recepción. Un solo
 * archivo de tipos es lo que evita eso.
 *
 * El contrato de `BookingProvider` está portado desde el repo `hotel-bookings`
 * a propósito: el sitio público de Astro ya lo consume, y mantener la forma
 * idéntica es lo que permite que ambos frontends hablen con la misma API de
 * NestJS sin capas de traducción.
 */

/** Fecha sin hora ni zona. Las noches son días de calendario, no instantes. */
export type IsoDate = string;

export type DateRange = {
  checkIn: IsoDate;
  checkOut: IsoDate;
};

/** Dinero en unidades menores enteras. Los flotantes no van en precios. */
export type Money = {
  /** Centavos, no dólares: 12550 es $125.50. */
  amountMinor: number;
  currency: string;
};

// ---------------------------------------------------------------------------
// Inventario
// ---------------------------------------------------------------------------

export type AmenityGroup =
  | "essentials"
  | "kitchen"
  | "bathroom"
  | "outdoor"
  | "entertainment"
  | "accessibility";

export type Amenity = {
  id: string;
  label: string;
  labelEn: string;
  group: AmenityGroup;
  /** Clave de icono que resuelve la UI. Sin match cae a texto. */
  icon: string;
};

/**
 * Una propiedad física. Julius opera cuatro cosas distintas en dos direcciones,
 * y el sistema tiene que poder mostrarlas juntas o por separado.
 */
export type PropertyKind = "hotel" | "villa" | "venue";

export type Property = {
  id: string;
  slug: string;
  kind: PropertyKind;
  name: string;
  locality: string;
  /** Minutos en carro desde el hotel. 0 para el hotel mismo. */
  minutesFromHotel: number;
};

/**
 * Una unidad vendible.
 *
 * `inventoryCount` es lo que deja que un solo esquema cubra los dos negocios
 * que Julius tiene al mismo tiempo: las casas se venden como unidad única
 * (count 1) y el hotel vende *tipo* de habitación con varias unidades detrás.
 * Un hotel no vende "la 302", vende "habitación vista al mar" — y el motor
 * necesita saber cuántas quedan del tipo, no si una puerta específica está
 * libre.
 */
export type Unit = {
  id: string;
  slug: string;
  propertyId: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  inventoryCount: number;
  /** Números físicos de las habitaciones de este tipo. El PMS opera sobre estos. */
  rooms: string[];
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    baths: number;
  };
  bedType: string;
  sizeSqm: number;
  basePrice: Money;
  amenityIds: string[];
  photos: { src: string; alt: string }[];
  featured: boolean;
  /**
   * Accesibilidad como dato, no como nota al pie. Las normas de sistemas de
   * reserva de EE. UU. esperan que el huésped pueda identificar y reservar una
   * habitación accesible específicamente; callar obliga a llamar por teléfono.
   */
  accessibility: {
    stepFreeAccess: boolean;
    rollInShower: boolean;
    /* Los dos idiomas van en el dato porque esto es contenido del cliente, no
       interfaz: describe una propiedad concreta y lo escribe quien la conoce. */
    notes?: string;
    notesEn?: string;
  };
};

// ---------------------------------------------------------------------------
// Disponibilidad y cotización
// ---------------------------------------------------------------------------

export type UnitAvailability = {
  unitId: string;
  /** Noches sin inventario dentro del rango consultado. */
  blockedDates: IsoDate[];
  minNights: number;
  /** Cuántas unidades del tipo quedan vendibles. 0 es agotado. */
  unitsLeft: number;
};

export type QuoteLine = {
  label: string;
  amount: Money;
  /** Impuestos y cargos desglosados: el total nunca es un número misterioso. */
  kind: "nightly" | "fee" | "tax" | "discount";
};

export type Quote = {
  unitId: string;
  range: DateRange;
  guests: number;
  nights: number;
  lines: QuoteLine[];
  total: Money;
  /** Lo que se cobra hoy. El resto se cobra en el check-in. */
  dueNow: Money;
};

// ---------------------------------------------------------------------------
// Reservas
// ---------------------------------------------------------------------------

/**
 * De dónde vino la reserva. Es el dato que sostiene toda la conversación
 * comercial con Julius: la meta a doce meses es que `direct` crezca y las OTAs
 * bajen, y no se puede mostrar ese progreso si no se guarda el canal.
 */
export type Channel = "direct" | "booking" | "airbnb" | "expedia" | "walk-in" | "phone";

export type ReservationStatus =
  | "confirmed"
  | "in-house"
  | "checked-out"
  | "cancelled"
  | "no-show"
  | "pending";

export type PaymentStatus = "paid" | "deposit" | "unpaid" | "refunded";

export type Guest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** El backend no guarda nacionalidad todavía: exigirla obligaría a inventarla. */
  country?: string;
  /** Estancias previas. Alimenta el badge de huésped recurrente. */
  previousStays?: number;
  notes?: string;
};

/**
 * Una reserva, tal como la consumen las pantallas.
 *
 * Los campos opcionales lo son porque HOY no tienen respaldo en la API, no
 * porque sean prescindibles:
 *
 * - `payment` y `balance` salen del modelo `Payment`, que existe en el schema
 *   pero todavía no tiene endpoints ni registros. Hasta entonces no hay forma
 *   honesta de decir quién debe.
 * - `channel` necesita distinguir Booking de Airbnb de directo; el backend sólo
 *   guarda `source` (DIRECT/STAFF/CHANNEL), y la sincronización con OTAs está
 *   explícitamente fuera del alcance cotizado.
 * - `adults`/`children`: la API guarda un solo total de huéspedes (`guests`).
 *
 * Son opcionales, y no `| null` con valores de relleno, para que TypeScript
 * obligue a cada pantalla a decidir qué hacer cuando faltan en vez de dejar
 * pasar un `$0.00` inventado a la cara de recepción.
 */
export type Reservation = {
  id: string;
  reference: string;
  unitId: string;
  /** Habitación física asignada. `null` mientras no se asigne. */
  room: string | null;
  guest: Guest;
  range: DateRange;
  nights: number;
  /** Total de huéspedes de la estadía. */
  guests: number;
  adults?: number;
  children?: number;
  status: ReservationStatus;
  payment?: PaymentStatus;
  channel?: Channel;
  /** Lo que paga el huésped: alojamiento más ITBMS. */
  total: Money;
  /**
   * Ingreso del hotel: el total **sin** impuesto.
   *
   * Existe separado porque los indicadores se calculan sobre esto y no sobre el
   * total. El ITBMS se cobra para la DGI y se entrega, así que meterlo en el
   * ADR lo infla un 10% y lo vuelve incomparable con cualquier tarifa
   * publicada. Es además lo que usa la pantalla de Reportes: sin este campo, el
   * mismo hotel mostraba ADR de $88 en el panel de hoy y de $80 en reportes.
   */
  net: Money;
  balance?: Money;
  createdAt: IsoDate;
  notes?: string;
};

// ---------------------------------------------------------------------------
// Housekeeping
// ---------------------------------------------------------------------------

export type RoomState =
  | "vacant-clean"
  | "vacant-dirty"
  | "occupied"
  | "arriving"
  | "departing"
  | "blocked";

export type HousekeepingTask = {
  room: string;
  unitId: string;
  state: RoomState;
  /** `stayover` es limpieza de huésped que se queda; `departure` es a fondo. */
  type: "departure" | "stayover" | "deep" | "inspection";
  assignedTo: string | null;
  priority: "high" | "normal";
  note?: string;
};

// ---------------------------------------------------------------------------
// Tarifas
// ---------------------------------------------------------------------------

/* El nombre del plan y su texto de cancelación se traducen: viven en los
   diccionarios, indexados por este `id`. Aquí queda sólo la aritmética. */
export type RatePlan = {
  id: string;
  /** Multiplicador sobre la tarifa base de la unidad. */
  multiplier: number;
  minNights: number;
};

export type Season = {
  id: string;
  from: IsoDate;
  to: IsoDate;
  /** % sobre la tarifa base. 0 es temporada estándar. */
  adjustmentPct: number;
  color: string;
};

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

/**
 * Cada rol ve sólo lo suyo. Es literalmente lo que Julius pidió: quiere ser
 * gerente, no estar en medio de todo. Recepción no necesita ver la facturación
 * del mes y camarería no necesita ver los datos del huésped.
 */
export type StaffRole = "owner" | "manager" | "front-desk" | "housekeeping" | "restaurant";

export type StaffMember = {
  id: string;
  name: string;
  role: StaffRole;
  initials: string;
  shift?: string;
};
