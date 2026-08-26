/**
 * Inglés — el diccionario de referencia.
 *
 * Este archivo define la forma; `es.ts` la satisface. Se escribe primero en
 * inglés porque es el idioma por defecto y el que el cliente lee: si una clave
 * nueva aparece aquí, TypeScript obliga a traducirla antes de compilar en vez
 * de dejarla caer silenciosamente al inglés en mitad de una página en español.
 *
 * Las funciones son para el texto que lleva un número o un nombre dentro. Un
 * template armado por concatenación (`n + " noches"`) es intraducible al
 * primer idioma con género o con el orden de palabras cambiado.
 */
export const en = {
  common: {
    perNight: "per night",
    nights: (n: number) => (n === 1 ? "1 night" : `${n} nights`),
    guests: (n: number) => (n === 1 ? "1 guest" : `${n} guests`),
    people: (n: number) => (n === 1 ? "1 person" : `${n} people`),
    adults: "Adults",
    children: "Children",
    adultsHint: "13 or older",
    childrenHint: "Under 13",
    add: "Add",
    remove: "Remove",
    clear: "Clear",
    clearAll: "Clear all",
    total: "Total",
    back: "Back",
    next: "Next",
    close: "Close",
    today: "today",
    of: "of",
    from: "from",
    to: "to",
    beforeTax: "before tax",
    room: "Room",
    rooms: "Rooms",
    night: "night",
    booked: "Booked",
    whatsapp: "WhatsApp",
    optional: "optional",
  },

  nav: {
    stays: "Stays",
    poolClub: "Pool Club",
    sportsBar: "Sports Bar",
    gettingHere: "Getting here",
    book: "Book",
    checkAvailability: "Check availability",
    openMenu: "Open menu",
    changeLanguage: "Change language",
    skipToContent: "Skip to content",
    plannedLanguage: "Coming in phase 2",
  },

  search: {
    dates: "Dates",
    whenArrive: "When are you arriving?",
    pickCheckout: "pick a check-out",
    guests: "Guests",
    submit: "Check availability",
    minStay: "1 night minimum · Check-in from 15:00",
    cribNote: "Free crib in the family rooms.",
  },

  home: {
    badge: "Opening November 15th · Launch rates",
    title: "A hotel, a pool and a sports bar on Panama's Pacific coast.",
    lead: "Thirteen keys, two whole houses and everything around them — booked in one place, with no middleman taking a cut.",
    metaLocation: "David, Chiriquí",
    metaPool: "Pool and garden",
    metaRestaurant: "On-site restaurant",

    staysEyebrow: "Where to stay",
    staysTitle: "Five room types, two whole houses",
    staysCta: "See all seven options",

    venuesEyebrow: "All of Don Julius",
    venuesTitle: "Three places, one booking",
    venuesLead:
      "The hotel, the pool club and the sports bar share an owner and a calendar. Booking the room already gets you into the other two.",
    venueMore: "See more",

    venues: {
      pool: {
        eyebrow: "Don Julius 2",
        title: "Pool Club & Restaurant",
        body: "Pool, soccer fields and a kitchen open all day. Hotel guests walk in free; everyone else buys a day pass.",
      },
      bar: {
        eyebrow: "Don Julius V1",
        title: "Restaurant & Sports Bar",
        body: "Screens for the football, cold beer and long tables. Six minutes from the hotel, with a courtesy ride on match nights.",
      },
      houses: {
        eyebrow: "Whole houses",
        title: "For groups and long stays",
        body: "Two- and three-bedroom houses with a kitchen and their own pool. Rented whole, with the hotel's service behind them.",
      },
    },

    directEyebrow: "Book direct",
    directTitle: "Booking here always costs less",
    directLead:
      "We're on Booking and Airbnb too, and we don't hide it. But part of what you pay there goes to commission. Book on this site and that part stays in the house — and we hand it back to you in the price.",
    directCta: "Check availability",
    directPoints: [
      ["7% below the platforms", "Same room, same dates, no middleman."],
      ["Pool club access included", "Pool and fields for the length of your stay."],
      ["Free cancellation up to 48 h before", "No calls, no forms — cancel from the confirmation email."],
      ["An answer on WhatsApp", "If something's off, you write and somebody from the house replies."],
    ] as [string, string][],
  },

  stays: {
    metaTitle: "Stays",
    metaDescription:
      "Hotel rooms and whole houses in David, Chiriquí. Live availability and direct booking.",
    eyebrow: "Don Julius · David, Chiriquí",
    title: "Choose where to stay",
    withAvailability: "with availability",
    pickDatesHint: "Pick dates to see availability and the real price for those nights.",
    filters: "Filters",
    sortBy: "Sort",
    kindAll: "Everything",
    kindHotel: "Hotel",
    kindVilla: "Whole houses",
    sortRecommended: "Recommended",
    sortPriceAsc: "Price: lowest first",
    sortPriceDesc: "Price: highest first",
    sortCapacity: "Capacity",
    accessibility: "Accessibility",
    stepFree: "Step-free access",
    stepFreeHint: "Level entry from the parking, no steps along the way.",
    amenities: "Amenities",
    options: (n: number) => (n === 1 ? "1 option" : `${n} options`),
    soldOut: "No availability on those dates",
    lastOne: "One left — last available",
    unitsLeft: (n: number) => `${n} available`,
    availableCount: (n: number) => `${n} available`,
    emptyTitle: "Nothing matches those filters",
    emptyBody:
      "Try fewer filters or fewer guests. If you're travelling with a large group, write to us — we can open two adjoining units.",
    minutesAway: (n: number) => `${n} min away`,
    availableBadge: (n: number) => `${n} available`,
    totalForNights: (nights: number) => `for ${nights} nights`,
  },

  unit: {
    backToList: "Back to the list",
    wholeHouse: "Whole house",
    hotelRoom: "Hotel room",
    unitsOfType: (n: number) => `${n} units of this type`,
    stepFreeBadge: "Step-free",
    capacity: "Capacity",
    beds: "Beds",
    baths: "Baths",
    size: "Size",
    whatsIncluded: "What's included",
    accessibilityTitle: "Accessibility",
    accessStepFreeYes: "Step-free access from the parking.",
    accessStepFreeNo: "No step-free access.",
    accessShowerYes: "Roll-in shower.",
    accessShowerNo: "The shower is not wheelchair accessible.",
    beforeBooking: "Before you book",
    otherOptions: "Other options",
    seeAllPhotos: (n: number) => `See all ${n} photos`,
    photosOf: "Photographs —",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    policies: [
      ["Check-in", "From 15:00. Reception is open until 22:00."],
      ["Check-out", "Until 11:00. We hold luggage at no charge."],
      ["Cancellation", "Free up to 48 hours before arrival."],
      ["Payment", "30% on booking, the rest on arrival. Cash or card."],
    ] as [string, string][],
    amenityGroups: {
      essentials: "The essentials",
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      outdoor: "Outdoors",
      entertainment: "Entertainment",
      accessibility: "Accessibility",
    },
  },

  booking: {
    checkInOut: "Check in — Check out",
    pickDates: "Pick your dates",
    guestsOf: (guests: number, max: number) => `${guests} of ${max} maximum`,
    bookedDatesNote: "Struck-through dates are already booked.",
    oneLeft: "One left",
    noQuoteYet:
      "Pick your dates to see the exact price for those nights, tax included.",
    payNow: (amount: string) => `You pay ${amount} now; the rest on arrival.`,
    continue: "Continue with booking",
    pickDatesCta: "Pick dates",
    freeCancellation: "Free cancellation up to 48 h before",
    cheaperThanOta: "7% cheaper than Booking and Airbnb",
    line: {
      nights: (n: number, unit: string) => `${n} ${n === 1 ? "night" : "nights"} × ${unit}`,
      directDiscount: (pct: number) => `Direct booking discount (${pct}%)`,
      cleaning: "Final cleaning",
      tax: (pct: number) => `ITBMS tax (${pct}%)`,
    },
  },

  checkout: {
    metaTitle: "Confirm booking",
    backTo: (unit: string) => `Back to ${unit}`,
    title: "Confirm your booking",
    whoTravels: "Who's travelling",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone / WhatsApp",
    notes: "Anything we should know (optional)",
    notesPlaceholder:
      "Arriving late, travelling with a baby, we'd prefer the ground floor…",
    notesHint:
      "This goes straight to reception and stays attached to your booking in the system.",
    howYouPay: "How you pay",
    payHint: (amount: string) => `${amount} is charged now — 30%. The rest on arrival.`,
    methods: {
      card: { label: "Card", hint: "Visa, Mastercard, Clave" },
      transfer: { label: "Transfer / Yappy", hint: "Confirmed in minutes" },
      arrival: { label: "Pay on arrival", hint: "Room held for 24 h" },
    },
    cardNumber: "Card number",
    expiry: "Expiry",
    cvc: "CVC",
    mockNotice: "Mockup: no payment is processed and no data is stored.",
    transferNotice:
      "On confirming we send you the account details and the Yappy number by email and WhatsApp. The room is held for 24 hours while the receipt arrives.",
    arrivalNotice:
      "We hold the room without charging you. If you don't confirm on WhatsApp 24 hours before arrival, it goes back on sale.",
    submit: (amount: string) => `Confirm and pay ${amount}`,
    submitting: "Confirming…",
    terms:
      "By confirming you accept the property's policies. Free cancellation up to 48 h before.",
    payNow: "You pay now",
    onArrival: "On arrival",

    doneTitle: "Done — your booking is confirmed",
    doneBody:
      "We've sent the confirmation by email and WhatsApp. If you need to change anything, just reply to that message.",
    doneUnit: "Unit",
    doneCheckIn: "Check-in",
    doneCheckOut: "Check-out",
    donePaid: "Paid",
    doneOutstanding: "Due on arrival",
    doneCheckInTime: "from 15:00",
    doneCheckOutTime: "until 11:00",
    bridgeTitle: "Meanwhile, in the management system…",
    bridgeBody:
      "This booking has already blocked the room on the calendar, joined today's arrivals list and notified housekeeping. Nobody had to write it down anywhere.",
    bridgeCta: "See the hotel calendar",
    writeUs: "Write to us on WhatsApp",
  },

  poolClub: {
    metaTitle: "Pool Club",
    metaDescription:
      "Don Julius 2 — pool, soccer fields and restaurant in David, Chiriquí. Day passes, and free entry for hotel guests.",
    badge: "Don Julius 2",
    title: "Pool Club & Restaurant",
    lead: "Pool, fields and a kitchen open all day. If you're staying at the hotel, you walk in free.",
    whatsInside: "What's inside",
    features: [
      {
        title: "Pool and loungers",
        body: "Large pool with a shallow end for children, palm shade, and towels included in the pass.",
      },
      {
        title: "Soccer fields",
        body: "Two netted fields, booked by the hour from the same system. Day passes include one hour.",
      },
      {
        title: "Restaurant open",
        body: "Kitchen from 11:00 to 21:00. Order to your lounger without leaving the pool.",
      },
      {
        title: "9:00 to 18:00",
        body: "Every day. On match nights the V1 bar stays open late, six minutes away.",
      },
    ],
    guestTitle: "Staying at the hotel?",
    guestBody:
      "The day pass is included for the whole stay, for everyone on the booking. Nothing to buy separately and nothing to show at the gate: your room number is the ticket.",
    guestCta: "See rooms",

    pass: {
      title: "Day pass",
      lead: "Pool, fields and loungers from 9:00 to 18:00. Hotel guests come in free.",
      day: "Day",
      pickDay: "Pick the day",
      adult: "Adult",
      adultHint: "13 and over",
      child: "Child",
      childHint: "4 to 12 · under 4 free",
      spotsLeft: (left: number, capacity: number) => `${left} spots left of ${capacity}.`,
      spotsLow: (left: number) => `Only ${left} spots left.`,
      overCapacity: (left: number) => `Only ${left} spots left for that day.`,
      noRoom: "Not enough space",
      reserve: (amount: string) => `Book for ${amount}`,
      confirmed: "Passes booked",
      confirmedBody: (guests: number, date: string) =>
        `${guests} ${guests === 1 ? "pass" : "passes"} for ${date}. Your code comes by WhatsApp.`,
    },
  },

  sportsBar: {
    metaTitle: "V1 Sports Bar",
    metaDescription:
      "Don Julius V1 — restaurant and sports bar in David, Chiriquí. Screens, a late kitchen and tables for groups.",
    badge: "Don Julius V1",
    title: "Restaurant & Sports Bar",
    lead: "Where a passion for sport and good food meet. Made in Panama.",
    features: [
      { title: "Screens across the room", body: "Panamanian league, Champions, NFL and fights. No bad angle." },
      { title: "Kitchen until 22:00", body: "Wings, burgers and the catch of the day. Children's menu." },
      { title: "New bar", body: "Being built for the November opening." },
      { title: "6 minutes from the hotel", body: "Courtesy ride for guests on match nights." },
    ],
    hoursTitle: "Hours",
    hours: [
      ["Monday to Thursday", "16:00 – 23:00"],
      ["Friday and Saturday", "12:00 – 01:00"],
      ["Sunday", "12:00 – 22:00"],
      ["Kitchen", "until 22:00"],
    ] as [string, string][],

    table: {
      title: "Hold a table",
      lead: "Match nights fill up. Holding one takes fifteen seconds.",
      day: "Day",
      pickDay: "Pick the day",
      people: "People",
      peopleCount: (n: number) => `${n} people`,
      time: "Time",
      yourName: "Your name",
      pickTime: "Pick the time",
      submit: (time: string) => `Hold a table for ${time}`,
      confirmed: "Table held",
      confirmedBody: (people: string, date: string, time: string) =>
        `${people} people on ${date} at ${time}. We'll confirm on WhatsApp.`,
    },
  },

  footer: {
    blurb: "Hotel, pool club and sports bar in David, Chiriquí. We open on November 15th.",
    columns: {
      stays: "Stays",
      onSite: "On the property",
      info: "Information",
    },
    links: {
      allUnits: "All units",
      hotelRooms: "Hotel rooms",
      wholeHouses: "Whole houses",
      accessibleUnits: "Accessible units",
      poolClub: "Pool Club",
      sportsBar: "V1 Sports Bar",
      dayPasses: "Day passes",
      bookTable: "Book a table",
      gettingHere: "Getting here",
      policies: "Policies",
      faq: "FAQ",
      accessibility: "Accessibility",
    },
    checkInOut: (inTime: string, outTime: string) =>
      `Check-in ${inTime} · Check-out ${outTime} · Prices in US dollars`,
    disclaimer: "Proposal mockup. Demonstration data, not real bookings.",
  },

  demo: {
    label: "Demo",
    site: "Site",
    system: "System",
    proposal: "Proposal",
    switchView: "Switch view in the demonstration",
  },

  admin: {
    nav: {
      today: "Today",
      calendar: "Calendar",
      reservations: "Bookings",
      housekeeping: "Housekeeping",
      rates: "Rates",
      reports: "Reports",
      sections: "System sections",
      outOfScope: "Outside this role's scope",
      viewAs: "View the system as…",
      synced: "Synced",
      mockTitle: "Proposal mockup",
      mockBody: "Generated demonstration data. No booking here is real.",
    },

    roles: {
      owner: "Owner",
      manager: "Management",
      "front-desk": "Front desk",
      housekeeping: "Housekeeping",
      restaurant: "Restaurant",
    },

    status: {
      confirmed: "Confirmed",
      "in-house": "In house",
      "checked-out": "Checked out",
      cancelled: "Cancelled",
      "no-show": "No-show",
      pending: "To confirm",
    },

    payment: {
      paid: "Paid",
      deposit: "Deposit",
      unpaid: "To collect",
      refunded: "Refunded",
    },

    channels: {
      direct: "Own website",
      booking: "Booking.com",
      airbnb: "Airbnb",
      expedia: "Expedia",
      "walk-in": "Walk-in",
      phone: "Phone / WhatsApp",
    },

    channelsShort: {
      direct: "Direct",
      booking: "Booking",
      airbnb: "Airbnb",
      expedia: "Expedia",
      "walk-in": "Walk-in",
      phone: "Phone",
    },

    roomState: {
      "vacant-clean": "Vacant, clean",
      "vacant-dirty": "Vacant, to clean",
      occupied: "Occupied",
      arriving: "Arriving today",
      departing: "Departing today",
      blocked: "Blocked",
    },

    hkType: {
      departure: "Departure — deep clean",
      stayover: "Stayover",
      deep: "Deep clean",
      inspection: "Pre-arrival inspection",
    },

    dashboard: {
      title: "Today at the hotel",
      openCalendar: "Open the calendar",
      occupancy: "Occupancy",
      occupancyHint: (sold: number, total: number) => `${sold} of ${total} keys`,
      adr: "Average rate (ADR)",
      adrHint: "per room sold",
      revpar: "RevPAR",
      revparHint: "per available room",
      revenue30: "Revenue, 30 days",
      revenue30Hint: "rooms only, no restaurant",
      vsLastWeek: "vs. last week",
      arrivals: "Arriving today",
      departures: "Departing today",
      noArrivals: "Nobody arrives today.",
      noDepartures: "Nobody leaves today.",
      checkIn: "Check in",
      checkOut: "Check out",
      checkedIn: "Checked in",
      checkedOut: "Checked out",
      checkInToast: (name: string) => `${name} checked in`,
      checkInToastBody: (room: string) =>
        `Room ${room} handed over. Housekeeping was notified.`,
      checkOutToast: (name: string) => `${name} checked out`,
      checkOutToastBody: (room: string) => `Room ${room} moved to "to clean".`,
      nthStay: (n: number) => `stay #${n}`,
      owes: (amount: string) => `owes ${amount}`,
      occupancyTitle: "Occupancy over the next two weeks",
      occupancySub: "Three days back and eleven forward. The yellow bar is today.",
      occupancyAria: "Daily occupancy for the next fourteen days",
      channelsTitle: "Where the bookings came from",
      channelsSub:
        "Last 30 days, by revenue. What comes through your own channels pays no commission.",
      channelsNote:
        "Every point moved from Booking to your own site is about 17 cents on the dollar that stays in the house. It's the number this screen exists to move.",
      noCommission: "no commission",
      keysTitle: "Key status",
      keysNothing: "Nothing waiting to be cleaned.",
      keysPending: (n: number) =>
        n === 1 ? "1 room waiting to be cleaned." : `${n} rooms waiting to be cleaned.`,
      goHousekeeping: "Go to housekeeping",
      toCollect: "To collect",
      toCollectBody: (amount: string) => `${amount} outstanding among the guests in house.`,
      seeWho: "See who",
      asTable: "View as a table",
      tableDay: "Day",
      tableSold: "Sold",
      tableOccupancy: "Occupancy",
      writeWhatsapp: "Write on WhatsApp",
    },

    calendar: {
      eyebrow: "Operations view",
      title: "Room calendar",
      lead: "One row per key, one column per night. Each bar covers exactly the nights the guest paid for — the room frees up at 11:00 on the departure day, so the bar ends halfway through that cell.",
      occupancyNextWeek: "Occupancy next week",
      occupancyNextWeekHint: "7-night average",
      openNights: "Open nights in 14 days",
      openNightsHint: (total: number) => `of ${total} possible`,
      keys: "Keys in inventory",
      keysHint: "hotel and houses",
      hint: "Tap any bar to open the booking. Drag the tape or use the arrows to move between weeks.",
      previousWeek: "Previous week",
      nextWeek: "Next week",
      goToday: "Today",
      roomColumn: "Room",
      blockedTitle: "Room blocked for maintenance",
      legendInHouse: "In house",
      legendConfirmed: "Confirmed",
      legendPending: "To confirm",
      legendCheckedOut: "Checked out",
      legendBlocked: "Blocked",
      sheet: {
        room: "Room",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Guests",
        channel: "Channel",
        country: "Country",
        bookedOn: "Booked",
        total: "Total",
        balance: "Outstanding balance",
        commission: "Channel commission",
        ownChannel: "$0 — own channel",
        contact: "Contact",
        checkInCta: "Check in",
        editCta: "Edit booking",
        adultsChildren: (a: number, c: number) =>
          c > 0 ? `${a} adults · ${c} children` : `${a} adults`,
        nightsInRoom: (room: string, nights: number) => `${room} · ${nights} nights`,
      },
    },

    reservations: {
      eyebrow: "Booking ledger",
      title: "Bookings",
      upcoming: "Upcoming",
      upcomingHint: "from today onwards",
      owed: "Outstanding balance",
      owedHint: "across the visible bookings",
      commission: "Platform commission",
      commissionHint: "what Booking, Airbnb and Expedia take",
      searchPlaceholder: "Name, reference or room",
      searchLabel: "Search bookings",
      allStatuses: "All statuses",
      anyPayment: "Any payment",
      allChannels: "All channels",
      count: (n: number) => (n === 1 ? "1 booking" : `${n} bookings`),
      colGuest: "Guest",
      colRoom: "Room",
      colUnit: "Unit",
      colDates: "Dates",
      colNights: "Nights",
      colStatus: "Status",
      colPayment: "Payment",
      colChannel: "Channel",
      colTotal: "Total",
      colBalance: "Balance",
      empty: "No booking matches those filters.",
      truncated: (shown: number, total: number) =>
        `Showing the first ${shown} of ${total}. In production this paginates from the server.`,
    },

    housekeeping: {
      title: "Housekeeping",
      lead: "Each room's state comes from the calendar, not from a separate list. When reception checks a guest out, the room shows up here on its own.",
      shift: "Morning shift",
      progress: (done: number, total: number) => `${done} of ${total} rooms ready`,
      highPriority: (n: number) =>
        n === 1
          ? "1 with a guest arriving today — that one goes first."
          : `${n} with guests arriving today — those go first.`,
      window: "Guest arriving today · window 11:00 – 15:00",
      unassigned: "Unassigned",
      markClean: "Mark clean",
      ready: "Ready",
      clean: "Clean",
      cleanToast: (room: string) => `Room ${room} ready`,
      cleanToastBody: "Reception can hand it over.",
      assignToast: (room: string, name: string) => `Room ${room} assigned to ${name}`,
      maintenanceNote: "Maintenance: air conditioning replacement",
    },

    rates: {
      eyebrow: "Price per night",
      title: "Rates and seasons",
      lead: "Every night has its own price: the unit's base rate, adjusted for season and for weekend. The public site quotes from exactly this table — there is no second price list anywhere else.",
      nextFourWeeks: "The next four weeks",
      tableCaption: "Nightly rate for each unit over the next four weeks",
      unit: "Unit",
      baseRate: (rate: string, count: number) =>
        `base ${rate} · ${count} ${count === 1 ? "key" : "keys"}`,
      taxNote:
        "Prices shown without ITBMS. Weekends carry +22% over the rate for the current season.",
      plansTitle: "Rate plans",
      plansLead:
        "Each plan is a multiplier on the table above, with its own cancellation rules.",
      planBase: "Base",
      minNights: (n: number) => `Min. ${n} ${n === 1 ? "night" : "nights"}`,
      directOnly: "Own site only",
      standard: "Standard",
      plans: {
        "rp-flex": { name: "Flexible rate", cancellation: "Free cancellation up to 48 h before" },
        "rp-nonref": {
          name: "Non-refundable",
          cancellation: "No refund. Charged in full at booking.",
        },
        "rp-week": {
          name: "Long stay (7+ nights)",
          cancellation: "Free cancellation up to 7 days before",
        },
        "rp-direct": {
          name: "Direct — best price",
          cancellation: "Free cancellation up to 24 h before. Own site only.",
        },
      },
      seasons: {
        "s-alta": "High season — dry",
        "s-apertura": "Opening — launch rate",
        "s-estandar": "Standard",
      },
    },

    reports: {
      title: "Last 30 days",
      lead: "The four numbers that sum up a month of hotel, and the two tables that explain where they came from.",
      revenue: "Revenue",
      revenueHint: "vs. the previous 30 days",
      occupancy: "Occupancy",
      occupancyHint: (sold: number, total: number) => `${sold} of ${total} nights`,
      adr: "ADR",
      adrHint: "average rate per night sold",
      commission: "Commission paid",
      commissionHint: (pct: number) => `${pct}% of revenue came with no commission`,
      byUnitTitle: "Performance by unit type",
      byUnitSub: "Sorted by revenue. A unit at 90% occupancy is priced too low.",
      colUnit: "Unit",
      colNights: "Nights",
      colOccupancy: "Occupancy",
      colAdr: "ADR",
      colRevenue: "Revenue",
      keys: (n: number) => `${n} ${n === 1 ? "key" : "keys"}`,
      channelCostTitle: "What each channel cost",
      colChannel: "Channel",
      colCommission: "Commission",
      ownTag: "own",
      originTitle: "Where the guests come from",
      originSub: "Decides which languages are worth investing in first.",
    },
  },

  proposal: {
    metaTitle: "Proposal — Don Julius",
    metaDescription:
      "Visual and interaction proposal for the Don Julius booking site and management system in David, Chiriquí.",
    badge: "Proposal · 25 August 2026",
    title: "Don Julius: a site that sells and a system that runs the hotel.",
    lead: "This is not a document with screenshots in it. It's the product working: you can touch it, pick dates, book, and then go into the system and see that same booking sitting in the calendar. What you approve here is what gets built.",
    ctaSite: "See the guest site",
    ctaAdmin: "See the management system",

    understoodEyebrow: "Where we start",
    understoodTitle: "What I heard from you",
    understoodLead:
      "If anything on this list is wrong, it's cheaper to fix today than in October. Everything else is built on top of these six points.",
    understood: [
      "You take the hotel over officially on November 1st and want to open on the 15th.",
      "You repaint at the end of September and hire staff in October.",
      "Nothing is listed on Booking, Airbnb or Expedia today.",
      "You want level 3: the public site, real bookings, and the management system.",
      "You want to work 20 hours and be a manager, not be in the middle of everything.",
      "The site ships in English, Spanish, German, French and Dutch from phase one.",
    ],

    halvesEyebrow: "The architecture, in one sentence",
    halvesTitle: "Two different screens, one single truth",
    halvesLead:
      "The website is the front counter — what the guest sees. The system is the back office — what you and your people see. Both read the same calendar, which is why a room sold on the site cannot be sold again at the front desk.",
    frontCounter: "The front counter",
    backOffice: "The back office",
    guestSite: "Guest site",
    guestSiteBody:
      "Home, a filtered list, a page per room with gallery and calendar, and a one-screen checkout. Five languages, and built for Google to find it.",
    system: "Management system",
    systemBody:
      "Room calendar, today's arrivals and departures, housekeeping, seasonal rates and reports. With roles: try the selector at the top right and log in as front desk to see what disappears.",
    enter: "Enter",

    scopeEyebrow: "Scope",
    scopeTitle: "What lands before you open, and what comes after",
    scopeLead:
      "It's not that all of it can't be built. It's that building all of it before November 15th would come out badly, and I'd rather hand you one thing that works on opening day than four that half work.",
    phase1: "Phase 1",
    phase1When: "by opening",
    phase2: "Phase 2",
    phase2When: "from January",
    phase1Items: [
      "Public hotel website with photos, rates and the five languages.",
      "Online booking: real availability, deposit taken, room blocked instantly.",
      "Room calendar — one row per key, one column per night.",
      "Today's arrivals, departures, check-in and check-out.",
      "Housekeeping: which room to clean, in what order, and who has it.",
      "Seasonal and weekend rates in one place.",
      "Separate accounts by role: front desk, housekeeping, and you.",
      "Reports: occupancy, average rate, revenue and commission paid.",
    ],
    phase2Items: [
      "Pool club day passes with capacity control.",
      "Table reservations for the V1 sports bar.",
      "All five houses inside the same calendar.",
      "Two-way sync with Booking and Airbnb (channel manager).",
      "Electronic invoicing and till close.",
    ],
    phase2Note:
      "The pool passes and the table booking are already mocked up in the site — try them — so you can see where it's going even though they get built later.",

    timelineEyebrow: "Timing",
    timelineTitle: "Your real deadline is not November 1st",
    timelineLead:
      "It's the first week of October. If you hire in October, the system has to be loaded and working by then, because that's what you'll train them on. And the website needs weeks of being live before the 15th for Google to find it.",
    timeline: [
      {
        when: "Weeks 1–2",
        what: "Brand and content",
        detail:
          "Final name, colours, logo and photography. This is where I need new photos of the hotel already repainted: the ones I have work for this mockup, not for selling.",
      },
      {
        when: "Weeks 2–4",
        what: "Public website",
        detail:
          "Every screen on the “Site” tab, with your real content and the five languages. Published and visible to Google from day one — it needs weeks of head start before November 15th.",
      },
      {
        when: "Weeks 3–6",
        what: "Management system",
        detail:
          "Everything on the “System” tab, wired to the real database. We load your rooms, your rates and your seasons.",
      },
      {
        when: "First week of October",
        what: "Staff training",
        detail:
          "The system has to be running before you hire, because this is what you'll train your people on. This is the real deadline, not November 1st.",
      },
      {
        when: "November 15th",
        what: "Opening",
        detail: "With bookings already coming in beforehand, not starting from zero that day.",
      },
    ],

    cautionEyebrow: "One warning",
    cautionTitle:
      "I'm telling you this as a friend, not as the man sending you the invoice",
    caution: [
      "On November 15th you open a hotel nobody has heard of. No reviews, nobody searching for it by name, and a website Google is only just discovering. Even if I build you the best site in the world, your first month will be empty if nobody knows you exist.",
      "List the hotel on Booking.com for the opening. Yes, they take 15–20%. But they already have the people searching for a hotel in Chiriquí, and you don't. Eighty percent of a full hotel beats a hundred percent of an empty one.",
      "Here's the plan: from day one everything is managed from your system. We assign certain rooms to the platforms and keep the rest for your own site, so the same room never gets sold twice. And as your direct bookings grow, we pull rooms back from the platforms one at a time. In a year you could be selling most of them yourself.",
    ],
    cautionNote:
      "That's why the system shows the platform's commission next to every booking total, and why the monthly report has a line for what the platforms took. It's the number this whole thing exists to bring down.",

    questionsEyebrow: "Still open",
    questionsTitle: "Four questions, and nothing else",
    questionsLead:
      "Everything else I can decide myself. These four I can't, because they depend on your business and your bank. None of them blocks the next two weeks of work.",
    questions: [
      {
        q: "Exactly how many rooms, and of which types?",
        why: "The mockup assumes 13 keys across 5 types. Changing it changes the calendar and the prices, not the design.",
      },
      {
        q: "Which bank will you take payments through?",
        why: "Stripe does not operate in Panama. The gateway depends on your bank, and it decides whether cards can be charged online or whether it's transfer and Yappy only.",
      },
      {
        q: "Do the five houses go in phase 1 or phase 2?",
        why: "I put two in as an example. Adding all five up front is content work, not programming work.",
      },
      {
        q: "Who loads and updates the content afterwards?",
        why: "If it's your staff, we need an editor built in. If it's me, we don't, and it costs less.",
      },
    ],

    honestyTitle: "About what you're looking at",
    honesty: [
      "The photographs are yours, the ones you sent me. The business names and the yellow running through this page come from your own designs.",
      "The room names, the prices, the capacities and every booking in the system are made up, so you can see how it behaves when it's full. None of that data is real, and no booking in the demo exists.",
      "The phone number, address and email are deliberately blank. I'd rather leave a visible hole than invent a detail somebody later copies into Google.",
    ],
    startSite: "Start with the site",
    startSystem: "Start with the system",
  },

  info: {
    "getting-here": {
      title: "Getting here",
      intro:
        "We're in David, in the province of Chiriquí, about 45 minutes from the Costa Rican border and a little over six hours by road from Panama City.",
      sections: [
        {
          heading: "By air",
          body: [
            "Enrique Malek International Airport (DAV) is about 15 minutes away by car. There are daily flights from Panama City and seasonal connections from San José.",
            "We can arrange the airport transfer if you tell us your arrival time when booking. It's charged separately and added to your account.",
          ],
        },
        {
          heading: "By car",
          body: [
            "Along the Pan-American Highway. From Panama City it's 6 to 7 hours; from the Paso Canoas border, about 45 minutes.",
            "There's free on-site parking, with room for tall vehicles.",
          ],
        },
        {
          heading: "By bus",
          body: [
            "David's terminal takes direct buses from Albrook every hour. From the terminal to the hotel is about ten minutes by taxi.",
          ],
        },
      ],
    },
    policies: {
      title: "Property policies",
      intro:
        "What applies to every booking made on this site. If something isn't clear, write to us before booking rather than after.",
      sections: [
        {
          heading: "Arrival and departure",
          body: [
            "Check-in from 15:00. Check-out until 11:00.",
            "Reception is open until 22:00. If you're arriving later, tell us and we'll arrange the key handover.",
            "We store luggage at no charge before check-in and after check-out.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "We charge 30% at booking and the rest on arrival. We take card, transfer and cash.",
            "Prices shown exclude ITBMS; the tax appears broken out before you confirm.",
          ],
        },
        {
          heading: "Cancellations",
          body: [
            "Free cancellation up to 48 hours before arrival; the deposit is returned in full.",
            "Within 48 hours the deposit is retained.",
            "The non-refundable rate cannot be cancelled, which is why it costs less.",
          ],
        },
        {
          heading: "House rules",
          body: [
            "Children are welcome. Under-4s pay nothing for the pool pass.",
            "No smoking inside the rooms. Terraces and the garden are fine.",
            "Pets in the whole houses only, letting us know before booking.",
          ],
        },
      ],
    },
    accessibility: {
      title: "Accessibility",
      intro:
        "We'd rather say exactly what's here and what isn't than let you call to find out. Each unit declares its own situation on its page.",
      sections: [
        {
          heading: "On the property",
          body: [
            "Level parking, with no steps up to reception or to the restaurant.",
            "The main building has no lift: second-floor rooms are reached by stairs only.",
            "The pool entrance has a 12 cm step; a portable ramp is available on request at reception.",
          ],
        },
        {
          heading: "In the rooms",
          body: [
            "The family rooms, the garden rooms and the bungalow have step-free access.",
            "No room currently has a roll-in shower. It's first on the renovation list.",
            "Cribs are free and bed rails are available on request when booking.",
          ],
        },
        {
          heading: "On this site",
          body: [
            "The whole site works by keyboard and focus is always visible.",
            "The list's “step-free access” filter shows only the units that qualify.",
            "If something here doesn't work with your screen reader, write to us and it gets fixed.",
          ],
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      intro: "What we're asked most on WhatsApp, answered once.",
      faq: [
        {
          q: "Is the pool pass included if I stay at the hotel?",
          a: "Yes, for everyone on the booking and for the whole stay. Nothing to buy separately: your room number is the ticket.",
        },
        {
          q: "Is breakfast included?",
          a: "It isn't included in the rate. The restaurant opens at 7:00 and a full breakfast is $8 per person.",
        },
        {
          q: "Can I arrive late at night?",
          a: "Yes. Reception is open until 22:00; if you arrive later, message us on WhatsApp and we'll arrange the key handover.",
        },
        {
          q: "Do you take pets?",
          a: "In the whole houses yes, letting us know before booking. Not in the hotel rooms, out of consideration for other guests.",
        },
        {
          q: "Is there transport from the airport?",
          a: "We arrange it if you give us your arrival time when booking. It's charged separately and added to your account.",
        },
        {
          q: "Why book here instead of Booking?",
          a: "Because it costs 7% less, cancellation is more flexible, and if something happens you talk to the house directly rather than to a call centre.",
        },
        {
          q: "Can I pay in cash?",
          a: "Yes, the part outstanding on arrival. The 30% deposit is paid online or by transfer.",
        },
      ],
    },
  },
};

/**
 * Sin `as const` a propósito: con literales, `Dictionary` exigiría que el
 * español dijera exactamente "English", y ningún otro idioma podría satisfacer
 * el tipo. Lo que sí queda fijo es la forma — las claves y las firmas de las
 * funciones — que es lo que hay que proteger.
 */
export type Dictionary = typeof en;
