import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * Español — el idioma del personal y del mercado local.
 *
 * Satisface `Dictionary`, así que una clave nueva en inglés rompe la compilación
 * aquí hasta que se traduzca. Es la única forma de que un sitio en cinco idiomas
 * no termine con páginas a medio traducir.
 */
export const es: Dictionary = {
  common: {
    perNight: "por noche",
    nights: (n) => (n === 1 ? "1 noche" : `${n} noches`),
    guests: (n) => (n === 1 ? "1 huésped" : `${n} huéspedes`),
    people: (n) => (n === 1 ? "1 persona" : `${n} personas`),
    adults: "Adultos",
    children: "Niños",
    adultsHint: "13 años o más",
    childrenHint: "Menores de 13 años",
    add: "Agregar",
    remove: "Quitar",
    clear: "Limpiar",
    clearAll: "Limpiar todo",
    total: "Total",
    back: "Volver",
    next: "Siguiente",
    close: "Cerrar",
    today: "hoy",
    of: "de",
    from: "desde",
    to: "hasta",
    beforeTax: "antes de impuestos",
    room: "Habitación",
    rooms: "Habitaciones",
    night: "noche",
    booked: "Reservada",
    whatsapp: "WhatsApp",
    optional: "opcional",
  },

  nav: {
    stays: "Alojamiento",
    poolClub: "Pool Club",
    sportsBar: "Sports Bar",
    gettingHere: "Cómo llegar",
    book: "Reservar",
    checkAvailability: "Ver disponibilidad",
    openMenu: "Abrir menú",
    changeLanguage: "Cambiar idioma",
    skipToContent: "Saltar al contenido",
    plannedLanguage: "Llega en la fase 2",
  },

  search: {
    dates: "Fechas",
    whenArrive: "¿Cuándo llegas?",
    pickCheckout: "elige la salida",
    guests: "Huéspedes",
    submit: "Ver disponibilidad",
    minStay: "Mínimo 1 noche · Check-in desde las 15:00",
    cribNote: "Cuna disponible sin costo en las habitaciones familiares.",
  },

  home: {
    badge: "Abrimos el 15 de noviembre · Tarifa de lanzamiento",
    title: "Un hotel, una piscina y un sports bar en el Pacífico chiricano.",
    lead: "Trece llaves, dos casas completas y todo lo que hay alrededor — reservado en un solo lugar, sin comisiones de intermediario.",
    metaLocation: "David, Chiriquí",
    metaPool: "Piscina y jardín",
    metaRestaurant: "Restaurante en sitio",

    staysEyebrow: "Dónde quedarse",
    staysTitle: "Cinco tipos de habitación, dos casas enteras",
    staysCta: "Ver las siete opciones",

    venuesEyebrow: "Todo Don Julius",
    venuesTitle: "Tres lugares, una sola reserva",
    venuesLead:
      "El hotel, el pool club y el sports bar son del mismo dueño y comparten calendario. Reservar la habitación ya te deja adentro de los otros dos.",
    venueMore: "Ver más",

    venues: {
      pool: {
        eyebrow: "Don Julius 2",
        title: "Pool Club & Restaurante",
        body: "Piscina, canchas de fútbol y cocina abierta todo el día. Los huéspedes entran sin costo; el resto compra un pase de día.",
      },
      bar: {
        eyebrow: "Don Julius V1",
        title: "Restaurante & Sports Bar",
        body: "Pantallas para el fútbol, cerveza fría y mesas largas. A seis minutos del hotel, con transporte de cortesía en las noches de partido.",
      },
      houses: {
        eyebrow: "Casas completas",
        title: "Para grupos y estancias largas",
        body: "Casas de dos y tres habitaciones con cocina y piscina propia. Se alquilan enteras, con el mismo servicio del hotel detrás.",
      },
    },

    directEyebrow: "Reserva directa",
    directTitle: "Reservar aquí siempre cuesta menos",
    directLead:
      "También estamos en Booking y Airbnb, y no lo escondemos. Pero ahí una parte de lo que pagas se va en comisión. Reservando en este sitio esa parte se queda en la casa — y te la devolvemos en el precio.",
    directCta: "Ver disponibilidad",
    directPoints: [
      ["7% menos que en las plataformas", "El mismo cuarto, la misma fecha, sin intermediario."],
      ["Entrada al pool club incluida", "Piscina y canchas mientras dure tu estadía."],
      [
        "Cancelación gratis hasta 48 h antes",
        "Sin llamadas ni formularios: se cancela desde el correo de confirmación.",
      ],
      ["Respuesta por WhatsApp", "Si algo no cuadra, escribes y contesta alguien de la casa."],
    ],
  },

  stays: {
    metaTitle: "Alojamiento",
    metaDescription:
      "Habitaciones del hotel y casas completas en David, Chiriquí. Disponibilidad en vivo y reserva directa.",
    eyebrow: "Don Julius · David, Chiriquí",
    title: "Elige dónde quedarte",
    withAvailability: "con disponibilidad",
    pickDatesHint: "Elige fechas para ver disponibilidad y precio real de esas noches.",
    filters: "Filtros",
    sortBy: "Ordenar",
    kindAll: "Todo",
    kindHotel: "Hotel",
    kindVilla: "Casas completas",
    sortRecommended: "Recomendado",
    sortPriceAsc: "Precio: menor primero",
    sortPriceDesc: "Precio: mayor primero",
    sortCapacity: "Capacidad",
    accessibility: "Accesibilidad",
    stepFree: "Acceso sin escalones",
    stepFreeHint: "Entrada a nivel desde el estacionamiento, sin peldaños en el recorrido.",
    amenities: "Amenidades",
    options: (n) => (n === 1 ? "1 opción" : `${n} opciones`),
    soldOut: "Sin disponibilidad en esas fechas",
    lastOne: "Queda 1 — última disponible",
    unitsLeft: (n) => `${n} disponibles`,
    availableCount: (n) => `${n} disponibles`,
    emptyTitle: "Nada calza con esos filtros",
    emptyBody:
      "Prueba con menos filtros o menos huéspedes. Si buscas para un grupo grande, escríbenos: podemos abrir dos unidades contiguas.",
    minutesAway: (n) => `a ${n} min`,
    availableBadge: (n) => `${n} disponibles`,
    totalForNights: (nights) => `por ${nights} noches`,
  },

  unit: {
    backToList: "Volver al listado",
    wholeHouse: "Casa completa",
    hotelRoom: "Habitación de hotel",
    unitsOfType: (n) => `${n} unidades de este tipo`,
    stepFreeBadge: "Sin escalones",
    capacity: "Capacidad",
    beds: "Camas",
    baths: "Baños",
    size: "Superficie",
    whatsIncluded: "Qué incluye",
    accessibilityTitle: "Accesibilidad",
    accessStepFreeYes: "Acceso sin escalones desde el estacionamiento.",
    accessStepFreeNo: "No tiene acceso sin escalones.",
    accessShowerYes: "Ducha con acceso para silla de ruedas.",
    accessShowerNo: "La ducha no tiene acceso para silla de ruedas.",
    beforeBooking: "Antes de reservar",
    otherOptions: "Otras opciones",
    seeAllPhotos: (n) => `Ver las ${n} fotos`,
    photosOf: "Fotografías —",
    previousPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    policies: [
      ["Check-in", "Desde las 15:00. Recepción abierta hasta las 22:00."],
      ["Check-out", "Hasta las 11:00. Guardamos equipaje sin costo."],
      ["Cancelación", "Gratis hasta 48 horas antes de la llegada."],
      ["Pago", "30% al reservar, el resto al llegar. Efectivo o tarjeta."],
    ],
    amenityGroups: {
      essentials: "Lo esencial",
      kitchen: "Cocina",
      bathroom: "Baño",
      outdoor: "Exteriores",
      entertainment: "Entretenimiento",
      accessibility: "Accesibilidad",
    },
  },

  booking: {
    checkInOut: "Entrada — Salida",
    pickDates: "Elige tus fechas",
    guestsOf: (guests, max) => `${guests} de ${max} máximo`,
    bookedDatesNote: "Las fechas tachadas ya están reservadas.",
    oneLeft: "Queda 1",
    noQuoteYet:
      "Elige las fechas para ver el precio exacto de esas noches, con impuestos incluidos.",
    payNow: (amount) => `Pagas ${amount} ahora; el resto al llegar.`,
    continue: "Continuar con la reserva",
    pickDatesCta: "Elegir fechas",
    freeCancellation: "Cancelación gratis hasta 48 h antes",
    cheaperThanOta: "7% más barato que en Booking y Airbnb",
    line: {
      nights: (n, unit) => `${n} ${n === 1 ? "noche" : "noches"} × ${unit}`,
      directDiscount: (pct) => `Descuento por reservar directo (${pct}%)`,
      cleaning: "Limpieza final",
      tax: (pct) => `ITBMS (${pct}%)`,
    },
  },

  checkout: {
    metaTitle: "Confirmar reserva",
    backTo: (unit) => `Volver a ${unit}`,
    title: "Confirma tu reserva",
    whoTravels: "Quién viaja",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo",
    phone: "Teléfono / WhatsApp",
    notes: "Algo que debamos saber (opcional)",
    notesPlaceholder:
      "Llegamos tarde, viajamos con un bebé, preferimos planta baja…",
    notesHint:
      "Esto llega directo a recepción y queda pegado a tu reserva en el sistema.",
    howYouPay: "Cómo pagas",
    payHint: (amount) => `Se cobra ${amount} ahora — el 30%. El resto al llegar.`,
    methods: {
      card: { label: "Tarjeta", hint: "Visa, Mastercard, Clave" },
      transfer: { label: "Transferencia / Yappy", hint: "Confirmación en minutos" },
      arrival: { label: "Pagar al llegar", hint: "Se retiene la habitación 24 h" },
    },
    cardNumber: "Número de tarjeta",
    expiry: "Vencimiento",
    cvc: "CVC",
    mockNotice: "Maqueta: no se procesa ningún pago ni se guarda ningún dato.",
    transferNotice:
      "Al confirmar te mandamos los datos de la cuenta y el número de Yappy por correo y WhatsApp. La habitación queda apartada 24 horas mientras llega el comprobante.",
    arrivalNotice:
      "Apartamos la habitación sin cobro previo. Si no confirmas por WhatsApp 24 horas antes de la llegada, vuelve a quedar disponible.",
    submit: (amount) => `Confirmar y pagar ${amount}`,
    submitting: "Confirmando…",
    terms:
      "Al confirmar aceptas las políticas de la propiedad. Cancelación gratis hasta 48 h antes.",
    payNow: "Pagas ahora",
    onArrival: "Al llegar",

    doneTitle: "Listo, tu reserva está confirmada",
    doneBody:
      "Te mandamos la confirmación por correo y por WhatsApp. Si necesitas cambiar algo, respondes ese mismo mensaje.",
    doneUnit: "Unidad",
    doneCheckIn: "Entrada",
    doneCheckOut: "Salida",
    donePaid: "Pagado",
    doneOutstanding: "Pendiente al llegar",
    doneCheckInTime: "desde las 15:00",
    doneCheckOutTime: "hasta las 11:00",
    bridgeTitle: "En el sistema de gestión, mientras tanto…",
    bridgeBody:
      "Esta reserva ya bloqueó la habitación en el calendario, entró a la lista de llegadas del día y le avisó a camarería. Nadie tuvo que anotarla en ningún lado.",
    bridgeCta: "Ver el calendario del hotel",
    writeUs: "Escribirnos por WhatsApp",
  },

  poolClub: {
    metaTitle: "Pool Club",
    metaDescription:
      "Don Julius 2 — piscina, canchas de fútbol y restaurante en David, Chiriquí. Pases de día y entrada libre para huéspedes.",
    badge: "Don Julius 2",
    title: "Pool Club & Restaurante",
    lead: "Piscina, canchas y cocina abierta todo el día. Si te quedas en el hotel, entras sin pagar.",
    whatsInside: "Qué hay adentro",
    features: [
      {
        title: "Piscina y tumbonas",
        body: "Piscina grande con zona baja para niños, sombra de palma y toallas incluidas en el pase.",
      },
      {
        title: "Canchas de fútbol",
        body: "Dos canchas con malla. Se reservan por hora desde el mismo sistema; los pases de día incluyen una hora.",
      },
      {
        title: "Restaurante abierto",
        body: "Cocina de 11:00 a 21:00. Pedidos a la tumbona sin salir de la piscina.",
      },
      {
        title: "9:00 a 18:00",
        body: "Todos los días. Las noches de partido el bar V1 abre hasta tarde, a seis minutos.",
      },
    ],
    guestTitle: "¿Te quedas en el hotel?",
    guestBody:
      "El pase de día está incluido durante toda tu estadía, para todos los que vengan en la reserva. No hay que comprar nada aparte ni presentar nada en la puerta: el número de habitación es la entrada.",
    guestCta: "Ver habitaciones",

    pass: {
      title: "Pase de día",
      lead: "Piscina, canchas y tumbonas de 9:00 a 18:00. Los huéspedes del hotel entran sin costo.",
      day: "Día",
      pickDay: "Elige el día",
      adult: "Adulto",
      adultHint: "13 años en adelante",
      child: "Niño",
      childHint: "4 a 12 años · menores de 4 entran gratis",
      spotsLeft: (left, capacity) => `${left} cupos disponibles de ${capacity}.`,
      spotsLow: (left) => `Quedan ${left} cupos.`,
      overCapacity: (left) => `Sólo quedan ${left} cupos para ese día.`,
      noRoom: "Sin cupo suficiente",
      reserve: (amount) => `Reservar por ${amount}`,
      confirmed: "Pases reservados",
      confirmedBody: (guests, date) =>
        `${guests} ${guests === 1 ? "pase" : "pases"} para el ${date}. Te llega el código por WhatsApp.`,
    },
  },

  sportsBar: {
    metaTitle: "V1 Sports Bar",
    metaDescription:
      "Don Julius V1 — restaurante y sports bar en David, Chiriquí. Pantallas, cocina hasta tarde y mesas para grupos.",
    badge: "Don Julius V1",
    title: "Restaurante & Sports Bar",
    lead: "Donde la pasión por el deporte y el buen sabor se unen. Hecho en Panamá.",
    features: [
      {
        title: "Pantallas en todo el salón",
        body: "Liga panameña, Champions, NFL y peleas. Sin ángulo malo.",
      },
      {
        title: "Cocina hasta las 22:00",
        body: "Alitas, hamburguesas y pescado del día. Menú para niños.",
      },
      { title: "Barra nueva", body: "En construcción para la apertura de noviembre." },
      {
        title: "A 6 minutos del hotel",
        body: "Transporte de cortesía para huéspedes las noches de partido.",
      },
    ],
    hoursTitle: "Horario",
    hours: [
      ["Lunes a jueves", "16:00 – 23:00"],
      ["Viernes y sábado", "12:00 – 01:00"],
      ["Domingo", "12:00 – 22:00"],
      ["Cocina", "hasta las 22:00"],
    ],

    table: {
      title: "Apartar mesa",
      lead: "Las noches de partido se llena. Apartar toma quince segundos.",
      day: "Día",
      pickDay: "Elige el día",
      people: "Personas",
      peopleCount: (n) => `${n} personas`,
      time: "Hora",
      yourName: "Tu nombre",
      pickTime: "Elige la hora",
      submit: (time) => `Apartar para las ${time}`,
      confirmed: "Mesa apartada",
      confirmedBody: (people, date, time) =>
        `${people} personas el ${date} a las ${time}. Te confirmamos por WhatsApp.`,
    },
  },

  footer: {
    blurb: "Hotel, pool club y sports bar en David, Chiriquí. Abrimos el 15 de noviembre.",
    columns: {
      stays: "Alojamiento",
      onSite: "En la propiedad",
      info: "Información",
    },
    links: {
      allUnits: "Todas las unidades",
      hotelRooms: "Habitaciones del hotel",
      wholeHouses: "Casas completas",
      accessibleUnits: "Unidades accesibles",
      poolClub: "Pool Club",
      sportsBar: "V1 Sports Bar",
      dayPasses: "Pases de día",
      bookTable: "Reservar mesa",
      gettingHere: "Cómo llegar",
      policies: "Políticas",
      faq: "Preguntas frecuentes",
      accessibility: "Accesibilidad",
    },
    checkInOut: (inTime, outTime) =>
      `Check-in ${inTime} · Check-out ${outTime} · Precios en dólares (USD)`,
    disclaimer: "Maqueta de propuesta. Datos de demostración, no reservas reales.",
  },

  demo: {
    label: "Demo",
    site: "Sitio",
    system: "Sistema",
    proposal: "Propuesta",
    switchView: "Cambiar de vista en la demostración",
  },

  admin: {
    nav: {
      today: "Hoy",
      calendar: "Calendario",
      reservations: "Reservas",
      housekeeping: "Camarería",
      rates: "Tarifas",
      reports: "Reportes",
      sections: "Secciones del sistema",
      outOfScope: "Fuera del alcance de este rol",
      viewAs: "Ver el sistema como…",
      synced: "Sincronizado",
      mockTitle: "Conectado en parte",
      mockBody:
        "Hoy, el calendario y las reservas corren sobre datos reales. Camarería, tarifas y reportes siguen con datos de demostración.",
    },

    roles: {
      owner: "Propietario",
      manager: "Gerencia",
      "front-desk": "Recepción",
      housekeeping: "Camarería",
      restaurant: "Restaurante",
    },

    login: {
      title: "Iniciar sesión",
      subtitle: "Acceso solo para el personal.",
      email: "Correo",
      password: "Contraseña",
      submit: "Entrar",
      submitting: "Entrando…",
      logout: "Cerrar sesión",
      noAccess: "Esta cuenta no tiene acceso a Daughters of Sun.",
      failed: "Correo o contraseña incorrectos.",
      offline: "No se pudo conectar con el servidor.",
    },

    newBooking: {
      cta: "Nueva reserva",
      title: "Nueva reserva",
      subtitle: "Elegí el tipo de habitación — el sistema asigna una libre.",
      unitType: "Tipo de habitación",
      checkIn: "Entrada",
      checkOut: "Salida",
      guests: "Huéspedes",
      guestName: "Nombre del huésped",
      guestEmail: "Correo",
      guestPhone: "Teléfono",
      save: "Crear reserva",
      saving: "Creando…",
      checking: "Consultando disponibilidad…",
      invalidRange: "La salida debe ser posterior a la entrada.",
      unitsLeft: (available, total) =>
        available === 0
          ? "No queda ninguna habitación de este tipo en esas fechas."
          : `${available} de ${total} habitaciones libres en esas fechas.`,
      created: (name) => `Reserva creada para ${name}.`,
    },

    status: {
      confirmed: "Confirmada",
      "in-house": "En casa",
      "checked-out": "Salió",
      cancelled: "Cancelada",
      "no-show": "No llegó",
      pending: "Por confirmar",
    },

    payment: {
      paid: "Pagada",
      deposit: "Depósito",
      unpaid: "Por cobrar",
      refunded: "Reembolsada",
    },

    channels: {
      direct: "Sitio propio",
      booking: "Booking.com",
      airbnb: "Airbnb",
      expedia: "Expedia",
      "walk-in": "Llegó sin reserva",
      phone: "Teléfono / WhatsApp",
    },

    channelsShort: {
      direct: "Directo",
      booking: "Booking",
      airbnb: "Airbnb",
      expedia: "Expedia",
      "walk-in": "Walk-in",
      phone: "Teléfono",
    },

    roomState: {
      "vacant-clean": "Libre y limpia",
      "vacant-dirty": "Libre, por limpiar",
      occupied: "Ocupada",
      arriving: "Llega hoy",
      departing: "Sale hoy",
      blocked: "Bloqueada",
    },

    hkType: {
      departure: "Salida — limpieza a fondo",
      stayover: "Permanencia",
      deep: "Profunda",
      inspection: "Inspección previa a llegada",
    },

    dashboard: {
      title: "Hoy en el hotel",
      openCalendar: "Abrir el calendario",
      occupancy: "Ocupación",
      occupancyHint: (sold, total) => `${sold} de ${total} llaves`,
      adr: "Tarifa media (ADR)",
      adrHint: "por habitación vendida",
      revpar: "RevPAR",
      revparHint: "por habitación disponible",
      revenue30: "Ingresos 30 días",
      revenue30Hint: "alojamiento, sin restaurante",
      vsLastWeek: "vs. semana pasada",
      arrivals: "Llegan hoy",
      departures: "Salen hoy",
      noArrivals: "Nadie llega hoy.",
      noDepartures: "Nadie sale hoy.",
      checkIn: "Check-in",
      checkOut: "Check-out",
      checkedIn: "Registrado",
      checkedOut: "Salió",
      checkInToast: (name) => `${name} registrado`,
      checkInToastBody: (room) => `Habitación ${room} entregada. Camarería fue notificada.`,
      checkOutToast: (name) => `${name} hizo salida`,
      checkOutToastBody: (room) => `Habitación ${room} pasó a "por limpiar".`,
      nthStay: (n) => `${n}ª estancia`,
      owes: (amount) => `debe ${amount}`,
      occupancyTitle: "Ocupación de las próximas dos semanas",
      occupancySub: "Tres días atrás y once adelante. La barra amarilla es hoy.",
      occupancyAria: "Ocupación diaria de los próximos catorce días",
      channelsTitle: "De dónde vinieron las reservas",
      channelsSub:
        "Últimos 30 días, por ingreso. Lo que entra por canales propios no paga comisión.",
      channelsNote:
        "Cada punto que se mueve de Booking al sitio propio son ~17 centavos de cada dólar que se quedan en la casa. Es el número que esta pantalla existe para mover.",
      noCommission: "sin comisión",
      keysTitle: "Estado de las llaves",
      keysNothing: "Nada pendiente de limpieza.",
      keysPending: (n) =>
        n === 1
          ? "1 habitación pendiente de limpieza."
          : `${n} habitaciones pendientes de limpieza.`,
      goHousekeeping: "Ir a camarería",
      toCollect: "Por cobrar",
      toCollectBody: (amount) =>
        `${amount} pendientes entre los huéspedes que están en casa.`,
      seeWho: "Ver quiénes",
      asTable: "Ver como tabla",
      tableDay: "Día",
      tableSold: "Vendidas",
      tableOccupancy: "Ocupación",
      writeWhatsapp: "Escribir por WhatsApp",
    },

    calendar: {
      eyebrow: "Vista de operación",
      title: "Calendario de habitaciones",
      lead: "Una fila por llave, una columna por noche. Cada barra ocupa exactamente las noches que pagó el huésped — el día de salida queda libre desde las 11:00, así que la barra termina a mitad de esa celda.",
      occupancyNextWeek: "Ocupación próxima semana",
      occupancyNextWeekHint: "promedio de 7 noches",
      openNights: "Noches libres en 14 días",
      openNightsHint: (total) => `de ${total} posibles`,
      keys: "Llaves en inventario",
      keysHint: "hotel y casas",
      hint: "Toca cualquier barra para abrir la reserva. Arrastra la cinta o usa las flechas para moverte entre semanas.",
      previousWeek: "Semana anterior",
      nextWeek: "Semana siguiente",
      goToday: "Hoy",
      roomColumn: "Habitación",
      blockedTitle: "Habitación bloqueada por mantenimiento",
      legendInHouse: "En casa",
      legendConfirmed: "Confirmada",
      legendPending: "Por confirmar",
      legendCheckedOut: "Salió",
      legendBlocked: "Bloqueada",
      sheet: {
        room: "Habitación",
        checkIn: "Entrada",
        checkOut: "Salida",
        guests: "Huéspedes",
        channel: "Canal",
        country: "País",
        bookedOn: "Reservó",
        total: "Total",
        balance: "Saldo pendiente",
        commission: "Comisión del canal",
        ownChannel: "$0 — canal propio",
        contact: "Contacto",
        cancelCta: "Cancelar reserva",
        checkOutCta: "Registrar salida",
        checkedIn: (name) => `Se registró la entrada de ${name}.`,
        checkedOut: (name) => `Se registró la salida de ${name}.`,
        cancelled: (name) => `Se canceló la reserva de ${name}.`,
        checkInCta: "Registrar entrada",
        editCta: "Editar reserva",
        adultsChildren: (a, c) => (c > 0 ? `${a} adultos · ${c} niños` : `${a} adultos`),
        nightsInRoom: (room, nights) => `${room} · ${nights} noches`,
      },
    },

    reservations: {
      eyebrow: "Libro de reservas",
      title: "Reservas",
      upcoming: "Por llegar",
      upcomingHint: "desde hoy en adelante",
      inHouse: "En casa",
      inHouseHint: "con entrada registrada ahora",
      total: "Reservas",
      totalHint: "que calzan con los filtros",
      searchPlaceholder: "Nombre, referencia o habitación",
      searchLabel: "Buscar reservas",
      allStatuses: "Todos los estados",
      count: (n) => (n === 1 ? "1 reserva" : `${n} reservas`),
      colGuest: "Huésped",
      colRoom: "Hab.",
      colUnit: "Unidad",
      colDates: "Fechas",
      colNights: "Noches",
      colGuests: "Huéspedes",
      colStatus: "Estado",
      colTotal: "Total",
      empty: "Ninguna reserva calza con esos filtros.",
      truncated: (shown, total) =>
        `Mostrando las primeras ${shown} de ${total}. En producción esto pagina desde el servidor.`,
    },

    housekeeping: {
      title: "Camarería",
      lead: "El estado de cada habitación sale del calendario, no de una lista aparte. Cuando recepción registra una salida, la habitación aparece aquí sola.",
      shift: "Trabajo de hoy",
      progress: (done, total) => `${done} de ${total} habitaciones listas`,
      highPriority: (n) =>
        n === 1
          ? "1 con huésped llegando hoy — va primero."
          : `${n} con huésped llegando hoy — van primero.`,
      window: "Entra huésped hoy · ventana 11:00 – 15:00",
      unassigned: "Sin asignar",
      unassign: "Quitar asignación",
      markClean: "Marcar limpia",
      markInspected: "Inspeccionada",
      markDirty: "Marcar sucia",
      ready: "Lista",
      clean: "Limpia",
      cleanToast: (room) => `Habitación ${room} lista`,
      cleanToastBody: "Recepción ya la puede entregar.",
      inspectedToast: (room) => `Habitación ${room} inspeccionada`,
      dirtyToast: (room) => `Habitación ${room} marcada para limpiar`,
      assignToast: (room, name) => `Habitación ${room} asignada a ${name}`,
      failed: "No se pudo guardar el cambio.",
      empty: "Todavía no hay habitaciones cargadas en este alojamiento.",
    },

    rates: {
      eyebrow: "Precio por noche",
      title: "Tarifas y temporadas",
      lead: "Cada noche tiene su precio: tarifa base de la unidad, ajustada por temporada y por fin de semana. El sitio público cotiza exactamente esta tabla — no hay una segunda lista de precios en otro lado.",
      nextFourWeeks: "Próximas cuatro semanas",
      tableCaption:
        "Tarifa por noche de cada unidad durante las próximas cuatro semanas",
      unit: "Unidad",
      baseRate: (rate, count) =>
        `base ${rate} · ${count} ${count === 1 ? "llave" : "llaves"}`,
      taxNote: "Los precios se muestran sin ITBMS, que se suma al cotizar.",
      plansTitle: "Temporadas y planes tarifarios",
      plansLead:
        "Un plan fija el precio por noche de un rango de fechas. Si dos se superponen, gana el más corto — así una semana de feriado puede sobrescribir a la temporada que la rodea.",
      minNights: (n) => `Mín. ${n} ${n === 1 ? "noche" : "noches"}`,
      standard: "Tarifa base",
      noPlans: "Todavía no hay planes tarifarios. Cada noche se vende a la tarifa base de la unidad.",
      weekendRate: (rate) => `${rate} vie y sáb`,
      closedPlan: "Cerrado a la venta",
      planRange: (from, to) => `${from} → ${to}`,
      base: "Tarifa base",
    },

    reports: {
      title: "Últimos 30 días",
      lead: "Los cuatro números que resumen un mes de hotel, y las dos tablas que explican de dónde salieron.",
      revenue: "Ingresos",
      revenueHint: "vs. los 30 días previos",
      occupancy: "Ocupación",
      occupancyHint: (sold, total) => `${sold} de ${total} noches`,
      adr: "ADR",
      adrHint: "tarifa media por noche vendida",
      revpar: "RevPAR",
      revparHint: "ingreso por habitación disponible",
      revenueNet: "sin ITBMS",
      taxCollected: (amount) => `${amount} de ITBMS cobrado aparte`,
      byUnitTitle: "Rendimiento por tipo de unidad",
      byUnitSub: "Ordenado por ingreso. Una unidad al 90% de ocupación está barata.",
      colUnit: "Unidad",
      colNights: "Noches",
      colOccupancy: "Ocupación",
      colAdr: "ADR",
      colRevenue: "Ingreso",
      keys: (n) => `${n} ${n === 1 ? "llave" : "llaves"}`,
      sourceTitle: "De dónde salió cada reserva",
      sourceSub: "Lo que entra por el sitio propio no paga comisión a nadie.",
      colSource: "Origen",
      colBookings: "Reservas",
      sources: {
        DIRECT: "Sitio propio",
        STAFF: "Cargada por el personal",
        CHANNEL: "Portal externo",
      },
      empty: "Todavía no hay reservas en este período.",
    },

    noAccess: {
      title: "Esta sección no es para tu rol",
      body: (section) =>
        `Tu usuario no tiene acceso a ${section}. Si lo necesitás para tu trabajo, pedíselo a la gerencia.`,
      back: "Volver al panel",
    },
  },

  proposal: {
    metaTitle: "Propuesta — Don Julius",
    metaDescription:
      "Propuesta visual y de interacción para el sitio de reservas y el sistema de gestión de Don Julius, David, Chiriquí.",
    badge: "Propuesta · 25 de agosto de 2026",
    title: "Don Julius: un sitio que vende y un sistema que opera.",
    lead: "Esto no es un documento con capturas de pantalla. Es el producto funcionando: puedes tocarlo, elegir fechas, reservar, y después entrar al sistema y ver esa misma reserva aparecida en el calendario. Lo que apruebes aquí es lo que se construye.",
    ctaSite: "Ver el sitio del huésped",
    ctaAdmin: "Ver el sistema de gestión",

    understoodEyebrow: "Punto de partida",
    understoodTitle: "Lo que entendí de nuestras conversaciones",
    understoodLead:
      "Si algo de esta lista está mal, es mejor corregirlo hoy que en octubre. Todo lo demás se construye encima de estos seis puntos.",
    understood: [
      "Tomas el hotel oficialmente el 1 de noviembre y quieres abrir el 15.",
      "Repintas a finales de septiembre y contratas personal en octubre.",
      "Nada está listado hoy en Booking, Airbnb ni Expedia.",
      "Quieres el nivel 3: sitio público + reservas + sistema de gestión.",
      "Quieres trabajar 20 horas y ser gerente, no estar en medio de todo.",
      "El sitio va en español, inglés, alemán, francés y neerlandés desde la fase 1.",
    ],

    halvesEyebrow: "La arquitectura, en una frase",
    halvesTitle: "Dos pantallas distintas, una sola verdad",
    halvesLead:
      "El sitio es el mostrador: lo que ve el cliente. El sistema es la trastienda: lo que ven tú y tu gente. Los dos leen el mismo calendario, y por eso una habitación vendida en el sitio no se puede volver a vender en recepción.",
    frontCounter: "El mostrador",
    backOffice: "La trastienda",
    guestSite: "Sitio del huésped",
    guestSiteBody:
      "Portada, listado con filtros, ficha de cada habitación con galería y calendario, y un checkout de una sola pantalla. Cinco idiomas, y hecho para que Google lo encuentre.",
    system: "Sistema de gestión",
    systemBody:
      "Calendario de habitaciones, llegadas y salidas del día, camarería, tarifas por temporada y reportes. Con roles: prueba el selector de arriba a la derecha y entra como recepción para ver qué deja de ver.",
    enter: "Entrar",

    scopeEyebrow: "Alcance",
    scopeTitle: "Qué entra antes de abrir y qué después",
    scopeLead:
      "No es que no se pueda construir todo. Es que construirlo todo antes del 15 de noviembre saldría mal, y prefiero entregarte una cosa que funcione el día de la apertura que cuatro que funcionen a medias.",
    phase1: "Fase 1",
    phase1When: "listo para la apertura",
    phase2: "Fase 2",
    phase2When: "desde enero",
    phase1Items: [
      "Sitio público del hotel, con fotos, tarifas y las cinco lenguas.",
      "Reserva en línea: el huésped elige fechas, ve disponibilidad real y paga el depósito.",
      "Calendario de habitaciones (una fila por llave, una columna por noche).",
      "Llegadas, salidas y check-in / check-out del día.",
      "Camarería: qué habitación limpiar, en qué orden y quién la tiene.",
      "Tarifas por temporada y por fin de semana, en un solo lugar.",
      "Cuentas separadas por rol: recepción, camarería y tú.",
      "Reportes: ocupación, tarifa media, ingresos y comisión pagada.",
    ],
    phase2Items: [
      "Pases de día del pool club con control de aforo.",
      "Reserva de mesas del sports bar V1.",
      "Las cinco casas dentro del mismo calendario.",
      "Sincronización con Booking y Airbnb (channel manager).",
      "Facturación electrónica y cierre de caja.",
    ],
    phase2Note:
      "Los pases de piscina y la reserva de mesas ya están maquetados en el sitio — pruébalos — para que veas hacia dónde va, aunque se construyan después.",

    timelineEyebrow: "Plazos",
    timelineTitle: "Tu fecha límite no es el 1 de noviembre",
    timelineLead:
      "Es principios de octubre. Si contratas gente en octubre, para entonces el sistema tiene que estar cargado y funcionando, porque es sobre eso que los vas a entrenar. Y el sitio tiene que llevar semanas publicado para que Google lo conozca antes del 15.",
    timeline: [
      {
        when: "Semanas 1 – 2",
        what: "Marca y contenido",
        detail:
          "Nombre definitivo, colores, logo y fotografía. Aquí necesito fotos nuevas del hotel ya repintado: las que tengo sirven para esta maqueta, no para vender.",
      },
      {
        when: "Semanas 2 – 4",
        what: "Sitio público",
        detail:
          "Todas las pantallas que ves en la pestaña «Sitio», con tu contenido real y los cinco idiomas. Publicado y visible para Google desde el primer día — necesita semanas de ventaja antes del 15 de noviembre.",
      },
      {
        when: "Semanas 3 – 6",
        what: "Sistema de gestión",
        detail:
          "Todo lo de la pestaña «Sistema», conectado a la base de datos real. Cargamos tus habitaciones, tus tarifas y tus temporadas.",
      },
      {
        when: "Primera semana de octubre",
        what: "Entrenamiento",
        detail:
          "El sistema tiene que estar funcionando antes de que contrates, porque es sobre esto que vas a entrenar a tu gente. Este es el plazo real, no el 1 de noviembre.",
      },
      {
        when: "15 de noviembre",
        what: "Apertura",
        detail:
          "Con reservas ya entrando desde antes, no empezando de cero ese día.",
      },
    ],

    cautionEyebrow: "Una advertencia",
    cautionTitle:
      "Te lo digo como amigo, no como quien te pasa la factura",
    caution: [
      "El 15 de noviembre abres un hotel del que nadie ha oído hablar. Sin reseñas, sin nadie buscándolo por su nombre, y con un sitio que Google apenas está descubriendo. Aunque te construya el mejor sitio del mundo, el primer mes va a estar vacío si nadie sabe que existes.",
      "Lista el hotel en Booking.com para la apertura. Sí, se llevan entre 15% y 20%. Pero ellos ya tienen a la gente que está buscando un hotel en Chiriquí, y tú no. El ochenta por ciento de un hotel lleno le gana al cien por ciento de uno vacío.",
      "El plan es este: desde el primer día todo se maneja desde tu sistema. Asignamos ciertas habitaciones a las plataformas y guardamos el resto para tu sitio, así la misma habitación nunca se vende dos veces. Y a medida que crezcan las reservas directas, sacamos habitaciones de las plataformas una por una. En un año podrías estar vendiendo la mayoría por tu cuenta.",
    ],
    cautionNote:
      "Por eso el sistema muestra la comisión de cada reserva junto al total, y el reporte del mes tiene una línea que dice cuánto se llevaron las plataformas. Es el número que tiene que bajar.",

    questionsEyebrow: "Lo que falta decidir",
    questionsTitle: "Cuatro preguntas, y nada más",
    questionsLead:
      "Todo lo demás lo puedo decidir yo. Estas cuatro no, porque dependen de tu negocio y de tu banco. Ninguna bloquea el trabajo de las próximas dos semanas.",
    questions: [
      {
        q: "¿Cuántas habitaciones exactamente, y de qué tipos?",
        why: "La maqueta asume 13 llaves en 5 tipos. Cambia el calendario y los precios, no el diseño.",
      },
      {
        q: "¿Con qué banco vas a cobrar?",
        why: "Stripe no opera en Panamá. La pasarela depende de tu banco, y determina si se puede cobrar con tarjeta en línea o sólo por transferencia y Yappy.",
      },
      {
        q: "¿Las cinco casas entran en fase 1 o en fase 2?",
        why: "En la maqueta puse dos como ejemplo. Meter las cinco desde el principio agrega trabajo de contenido, no de programación.",
      },
      {
        q: "¿Quién va a cargar y actualizar el contenido después?",
        why: "Si es tu gente, hace falta un editor. Si soy yo, no hace falta y sale más barato.",
      },
    ],

    honestyTitle: "Sobre lo que estás viendo",
    honesty: [
      "Las fotos son las tuyas, las que me mandaste por WhatsApp. Los nombres de los negocios y el amarillo de la marca salen de tus propios diseños.",
      "Los nombres de las habitaciones, los precios, las capacidades y todas las reservas del sistema son inventados para que puedas ver cómo se comporta lleno. Ningún dato de aquí es real, y ninguna reserva de la demostración existe.",
      "El teléfono, la dirección y el correo están en blanco a propósito. Prefiero un hueco visible a un dato inventado que después alguien copie a Google.",
    ],
    startSite: "Empezar por el sitio",
    startSystem: "Empezar por el sistema",
  },

  info: {
    "getting-here": {
      title: "Cómo llegar",
      intro:
        "Estamos en David, provincia de Chiriquí, a unos 45 minutos de la frontera con Costa Rica y a poco más de seis horas por tierra desde la Ciudad de Panamá.",
      sections: [
        {
          heading: "En avión",
          body: [
            "El Aeropuerto Internacional Enrique Malek (DAV) está a unos 15 minutos en carro. Hay vuelos diarios desde Ciudad de Panamá y conexiones estacionales desde San José.",
            "Podemos coordinar el traslado desde el aeropuerto si nos avisas la hora de llegada al reservar. Se paga aparte y se agrega a tu cuenta.",
          ],
        },
        {
          heading: "En carro",
          body: [
            "Por la Carretera Interamericana. Desde Ciudad de Panamá son unas 6 a 7 horas; desde la frontera de Paso Canoas, unos 45 minutos.",
            "Hay estacionamiento propio sin costo, con espacio para vehículos altos.",
          ],
        },
        {
          heading: "En bus",
          body: [
            "La terminal de David recibe buses directos desde Albrook cada hora. Desde la terminal al hotel son unos diez minutos en taxi.",
          ],
        },
      ],
    },
    policies: {
      title: "Políticas de la propiedad",
      intro:
        "Lo que aplica a toda reserva hecha en este sitio. Si algo no está claro, escríbenos antes de reservar y no después.",
      sections: [
        {
          heading: "Entrada y salida",
          body: [
            "Check-in desde las 15:00. Check-out hasta las 11:00.",
            "Recepción atiende hasta las 22:00. Si llegas más tarde, avísanos y coordinamos la entrega de la llave.",
            "Guardamos equipaje sin costo antes del check-in y después del check-out.",
          ],
        },
        {
          heading: "Pagos",
          body: [
            "Se cobra el 30% al reservar y el resto al llegar. Aceptamos tarjeta, transferencia y efectivo.",
            "Los precios mostrados no incluyen ITBMS; el impuesto aparece desglosado antes de confirmar.",
          ],
        },
        {
          heading: "Cancelaciones",
          body: [
            "Cancelación gratis hasta 48 horas antes de la llegada; se devuelve el depósito completo.",
            "Dentro de las 48 horas se retiene el depósito.",
            "La tarifa no reembolsable no admite cancelación, y por eso cuesta menos.",
          ],
        },
        {
          heading: "Convivencia",
          body: [
            "Los niños son bienvenidos. Menores de 4 años no pagan pase de piscina.",
            "No se permite fumar dentro de las habitaciones. Sí en las terrazas y el jardín.",
            "Mascotas sólo en las casas completas, avisando antes de reservar.",
          ],
        },
      ],
    },
    accessibility: {
      title: "Accesibilidad",
      intro:
        "Preferimos decir exactamente qué hay y qué no, en vez de dejarte llamar para averiguarlo. Cada unidad declara su situación en su propia ficha.",
      sections: [
        {
          heading: "En la propiedad",
          body: [
            "Estacionamiento a nivel, sin peldaños hasta la recepción y hasta el restaurante.",
            "El edificio principal no tiene ascensor: las habitaciones del segundo piso se alcanzan sólo por escalera.",
            "El acceso a la piscina tiene un escalón de 12 cm; hay una rampa portátil disponible pidiéndola en recepción.",
          ],
        },
        {
          heading: "En las habitaciones",
          body: [
            "Las habitaciones familiares, las de jardín y el bungalow tienen acceso sin escalones.",
            "Ninguna habitación tiene actualmente ducha con acceso para silla de ruedas. Es lo primero de la lista de remodelación.",
            "Hay cunas sin costo y barandas de cama disponibles pidiéndolas al reservar.",
          ],
        },
        {
          heading: "En este sitio",
          body: [
            "Todo el sitio se recorre con teclado y el foco siempre es visible.",
            "El filtro «acceso sin escalones» del listado muestra sólo las unidades que lo cumplen.",
            "Si algo aquí no funciona con tu lector de pantalla, escríbenos: se arregla.",
          ],
        },
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      intro: "Lo que más nos preguntan por WhatsApp, contestado de una vez.",
      faq: [
        {
          q: "¿El pase de piscina está incluido si me quedo en el hotel?",
          a: "Sí, para todos los que vengan en la reserva y durante toda la estadía. No hay que comprar nada aparte: el número de habitación es la entrada.",
        },
        {
          q: "¿Tienen desayuno incluido?",
          a: "No está incluido en la tarifa. El restaurante abre desde las 7:00 y el desayuno completo cuesta $8 por persona.",
        },
        {
          q: "¿Puedo llegar tarde en la noche?",
          a: "Sí. Recepción atiende hasta las 22:00; si llegas después, avísanos por WhatsApp y coordinamos la entrega de la llave.",
        },
        {
          q: "¿Aceptan mascotas?",
          a: "En las casas completas sí, avisando antes de reservar. En las habitaciones del hotel no, por el resto de los huéspedes.",
        },
        {
          q: "¿Hay transporte desde el aeropuerto?",
          a: "Lo coordinamos si nos das la hora de llegada al reservar. Se cobra aparte y se agrega a tu cuenta.",
        },
        {
          q: "¿Por qué reservar aquí y no en Booking?",
          a: "Porque cuesta un 7% menos, la cancelación es más flexible y si algo pasa hablas directamente con la casa en vez de con un centro de llamadas.",
        },
        {
          q: "¿Puedo pagar en efectivo?",
          a: "Sí, la parte que queda pendiente al llegar. El depósito del 30% se paga en línea o por transferencia.",
        },
      ],
    },
  },
};
