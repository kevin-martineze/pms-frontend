import type { Amenity, Property, Unit } from "@/lib/domain/types";
import { money } from "@/lib/format";

/**
 * Datos de demostración.
 *
 * Todo lo de aquí sale del material que Julius envió por WhatsApp: las fotos
 * son las suyas, los nombres de los negocios son los de sus diseños de marca,
 * y la ubicación es David, Chiriquí. Lo que NO sale de ahí — tarifas, nombres
 * de habitaciones, capacidades — está marcado como supuesto en la página de
 * propuesta, porque inventar un dato y presentarlo como real es peor que dejar
 * el hueco visible.
 */

export const site = {
  name: "Don Julius",
  legalName: "Don Julius Hotel & Pool Club",
  tagline: "Un hotel, una piscina y un sports bar en el Pacífico chiricano.",
  taglineEn: "One hotel, one pool club and a sports bar on Panama's Pacific coast.",
  locality: "David",
  region: "Chiriquí",
  country: "PA",
  currency: "USD",
  checkIn: "15:00",
  checkOut: "11:00",
  /* Contacto pendiente de confirmar con el cliente. Son placeholders evidentes
     a propósito: un teléfono o un correo inventado que parezca real termina
     copiado en la ficha de Google Business y ahí ya no se puede desmentir. */
  phone: "+507 000-0000",
  email: "reservas@example.com",
  languages: ["es", "en", "de", "fr", "nl"] as const,
  openingDate: "2026-11-15",
};

export const properties: Property[] = [
  {
    id: "p-hotel",
    slug: "hotel",
    kind: "hotel",
    name: "Don Julius Hotel",
    locality: "David, Chiriquí",
    minutesFromHotel: 0,
  },
  {
    id: "p-v1",
    slug: "v1-sports-bar",
    kind: "venue",
    name: "Don Julius V1 — Restaurante & Sports Bar",
    locality: "David, Chiriquí",
    minutesFromHotel: 6,
  },
  {
    id: "p-v2",
    slug: "pool-club",
    kind: "venue",
    name: "Don Julius 2 — Pool Club & Restaurante",
    locality: "David, Chiriquí",
    minutesFromHotel: 0,
  },
  {
    id: "p-casas",
    slug: "casas",
    kind: "villa",
    name: "Casas Don Julius",
    locality: "David y alrededores",
    minutesFromHotel: 12,
  },
];

export const amenities: Amenity[] = [
  { id: "wifi", label: "Wi-Fi", labelEn: "Wi-Fi", group: "essentials", icon: "wifi" },
  { id: "air-con", label: "Aire acondicionado", labelEn: "Air conditioning", group: "essentials", icon: "wind" },
  { id: "tv", label: "TV por cable", labelEn: "Cable TV", group: "entertainment", icon: "tv" },
  { id: "pool", label: "Piscina", labelEn: "Pool", group: "outdoor", icon: "waves" },
  { id: "parking", label: "Estacionamiento gratis", labelEn: "Free parking", group: "essentials", icon: "car" },
  { id: "kitchen", label: "Cocina completa", labelEn: "Full kitchen", group: "kitchen", icon: "cooking-pot" },
  { id: "kitchenette", label: "Kitchenette", labelEn: "Kitchenette", group: "kitchen", icon: "microwave" },
  { id: "coffee", label: "Cafetera", labelEn: "Coffee maker", group: "kitchen", icon: "coffee" },
  { id: "fridge", label: "Refrigeradora", labelEn: "Fridge", group: "kitchen", icon: "refrigerator" },
  { id: "private-bath", label: "Baño privado", labelEn: "Private bathroom", group: "bathroom", icon: "shower-head" },
  { id: "toiletries", label: "Amenidades de baño", labelEn: "Toiletries", group: "bathroom", icon: "droplets" },
  { id: "hot-water", label: "Agua caliente", labelEn: "Hot water", group: "bathroom", icon: "flame" },
  { id: "terrace", label: "Terraza", labelEn: "Terrace", group: "outdoor", icon: "sun" },
  { id: "balcony", label: "Balcón", labelEn: "Balcony", group: "outdoor", icon: "panels-top-left" },
  { id: "garden", label: "Jardín", labelEn: "Garden", group: "outdoor", icon: "trees" },
  { id: "hammock", label: "Hamaca", labelEn: "Hammock", group: "outdoor", icon: "tent-tree" },
  { id: "bbq", label: "Parrilla", labelEn: "BBQ", group: "outdoor", icon: "beef" },
  { id: "sea-view", label: "Vista al mar", labelEn: "Sea view", group: "outdoor", icon: "eye" },
  { id: "restaurant", label: "Restaurante en sitio", labelEn: "On-site restaurant", group: "essentials", icon: "utensils" },
  { id: "sports-bar", label: "Sports bar", labelEn: "Sports bar", group: "entertainment", icon: "beer" },
  { id: "soccer", label: "Canchas de fútbol", labelEn: "Soccer fields", group: "entertainment", icon: "volleyball" },
  { id: "crib", label: "Cuna disponible", labelEn: "Crib available", group: "essentials", icon: "baby" },
  { id: "washer", label: "Lavadora", labelEn: "Washer", group: "essentials", icon: "washing-machine" },
  { id: "workspace", label: "Escritorio", labelEn: "Workspace", group: "essentials", icon: "laptop" },
  { id: "step-free", label: "Acceso sin escalones", labelEn: "Step-free access", group: "accessibility", icon: "accessibility" },
  { id: "smoke-alarm", label: "Detector de humo", labelEn: "Smoke alarm", group: "essentials", icon: "bell-ring" },
];

export const amenityById = new Map(amenities.map((a) => [a.id, a]));

/**
 * Trece llaves en el hotel, agrupadas en cinco tipos vendibles. Los números de
 * habitación son los que opera el PMS; el sitio público vende el tipo.
 */
export const units: Unit[] = [
  {
    id: "u-vista-mar",
    slug: "suite-vista-al-mar",
    propertyId: "p-hotel",
    name: "Suite Vista al Mar",
    nameEn: "Ocean View Suite",
    tagline: "Sala aparte, terraza al Pacífico y la puesta de sol desde la cama.",
    taglineEn: "Separate living room, Pacific-facing terrace, sunset from the bed.",
    description:
      "La suite del segundo piso, con sala independiente, kitchenette y salida directa a la terraza que da al mar. Es la habitación que se reserva sola cuando alguien viene por un aniversario o se queda más de tres noches.",
    descriptionEn:
      "Second-floor suite with a separate living area, kitchenette and direct access to the ocean-facing terrace. The one that sells itself for anniversaries and longer stays.",
    inventoryCount: 2,
    rooms: ["201", "202"],
    capacity: { guests: 4, bedrooms: 1, beds: 2, baths: 1 },
    bedType: "1 king + 1 sofá cama",
    sizeSqm: 52,
    basePrice: money(145),
    amenityIds: [
      "wifi", "air-con", "sea-view", "terrace", "kitchenette", "coffee", "fridge",
      "private-bath", "hot-water", "tv", "pool", "parking", "restaurant", "smoke-alarm",
    ],
    photos: [
      { src: "/photos/suite-living.jpg", alt: "Sala de la suite con salida a la terraza y vista al jardín" },
      { src: "/photos/pool-sunset.jpg", alt: "Piscina del hotel al atardecer entre palmeras" },
      { src: "/photos/suite-bath.jpg", alt: "Baño privado de la suite con acabados en bambú" },
      { src: "/photos/property-exterior.jpg", alt: "Fachada del hotel con la piscina al frente" },
    ],
    featured: true,
    accessibility: { stepFreeAccess: false, rollInShower: false, notes: "Segundo piso, sin ascensor.", notesEn: "Second floor, no lift." },
  },
  {
    id: "u-familiar",
    slug: "habitacion-familiar",
    propertyId: "p-hotel",
    name: "Habitación Familiar",
    nameEn: "Family Room",
    tagline: "Tres camas, salida al jardín y hamaca a diez pasos.",
    taglineEn: "Three beds, garden access, hammock ten steps away.",
    description:
      "Planta baja, con puerta al jardín y mesa afuera. Pensada para familias que llegan con niños: la piscina queda a la vista desde la puerta y hay espacio para una cuna sin mover nada.",
    descriptionEn:
      "Ground floor with a garden door and an outdoor table. Built for families: the pool is visible from the doorway and there is room for a crib without moving furniture.",
    inventoryCount: 3,
    rooms: ["101", "102", "103"],
    capacity: { guests: 5, bedrooms: 1, beds: 3, baths: 1 },
    bedType: "1 queen + 2 individuales",
    sizeSqm: 38,
    basePrice: money(115),
    amenityIds: [
      "wifi", "air-con", "garden", "hammock", "private-bath", "hot-water", "tv",
      "pool", "parking", "crib", "restaurant", "step-free", "smoke-alarm",
    ],
    photos: [
      { src: "/photos/family-room.jpg", alt: "Habitación familiar con tres camas y puerta al jardín" },
      { src: "/photos/twin-room.jpg", alt: "Habitación con dos camas, escritorio y televisor" },
      { src: "/photos/property-exterior.jpg", alt: "Fachada del hotel con la piscina al frente" },
    ],
    featured: true,
    accessibility: { stepFreeAccess: true, rollInShower: false, notes: "Acceso a nivel desde el estacionamiento.", notesEn: "Level access from the parking." },
  },
  {
    id: "u-jardin",
    slug: "habitacion-jardin",
    propertyId: "p-hotel",
    name: "Habitación Jardín",
    nameEn: "Garden Room",
    tagline: "Sala con murales, ventanales al verde y sillón reclinable.",
    taglineEn: "Muraled living space, windows onto the greenery, reclining chair.",
    description:
      "La más luminosa del hotel. Ventanales en dos paredes, barra de bambú y salida a la galería donde cuelga la hamaca. Sin vista al mar, y ese es exactamente el motivo de que cueste treinta dólares menos.",
    descriptionEn:
      "The brightest room in the hotel. Windows on two walls, bamboo bar, and a door to the gallery where the hammock hangs. No sea view — which is exactly why it costs thirty dollars less.",
    inventoryCount: 3,
    rooms: ["104", "105", "106"],
    capacity: { guests: 3, bedrooms: 1, beds: 2, baths: 1 },
    bedType: "1 queen + 1 individual",
    sizeSqm: 34,
    basePrice: money(95),
    amenityIds: [
      "wifi", "air-con", "garden", "hammock", "private-bath", "hot-water", "tv",
      "pool", "parking", "restaurant", "step-free", "smoke-alarm",
    ],
    photos: [
      { src: "/photos/garden-living.jpg", alt: "Sala con mural de palmera y ventanales al jardín" },
      { src: "/photos/mola-room.jpg", alt: "Cama con cubrecama de mola panameña" },
    ],
    featured: false,
    accessibility: { stepFreeAccess: true, rollInShower: false },
  },
  {
    id: "u-clasica",
    slug: "habitacion-clasica",
    propertyId: "p-hotel",
    name: "Habitación Clásica",
    nameEn: "Classic Room",
    tagline: "Cama king, aire acondicionado y lo que hace falta para dormir bien.",
    taglineEn: "King bed, air conditioning, and what it takes to sleep well.",
    description:
      "La habitación de trabajo del hotel: la que se vende de martes a jueves a quien viene a David por negocios. Cama king, escritorio, baño privado y nada de más.",
    descriptionEn:
      "The hotel's workhorse: Tuesday-to-Thursday business travel. King bed, desk, private bathroom, nothing extra.",
    inventoryCount: 4,
    rooms: ["203", "204", "205", "206"],
    capacity: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
    bedType: "1 king",
    sizeSqm: 26,
    basePrice: money(78),
    amenityIds: [
      "wifi", "air-con", "private-bath", "hot-water", "tv", "workspace",
      "pool", "parking", "restaurant", "smoke-alarm",
    ],
    photos: [
      { src: "/photos/classic-room.jpg", alt: "Habitación clásica con cama king y aire acondicionado" },
      { src: "/photos/twin-room.jpg", alt: "Habitación con escritorio y televisor" },
    ],
    featured: false,
    accessibility: { stepFreeAccess: false, rollInShower: false, notes: "Segundo piso, sin ascensor.", notesEn: "Second floor, no lift." },
  },
  {
    id: "u-bungalow",
    slug: "bungalow-palmar",
    propertyId: "p-hotel",
    name: "Bungalow Palmar",
    nameEn: "Palmar Bungalow",
    tagline: "Unidad independiente al fondo del jardín, junto a las palmas.",
    taglineEn: "Standalone unit at the back of the garden, next to the palms.",
    description:
      "La única unidad separada del edificio principal. Entrada propia, terraza con parrilla y el silencio que no tiene una habitación sobre el restaurante.",
    descriptionEn:
      "The only unit detached from the main building. Own entrance, terrace with a grill, and the quiet a room above the restaurant does not get.",
    inventoryCount: 1,
    rooms: ["B1"],
    capacity: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
    bedType: "1 queen",
    sizeSqm: 30,
    basePrice: money(105),
    amenityIds: [
      "wifi", "air-con", "garden", "terrace", "bbq", "kitchenette", "coffee",
      "private-bath", "hot-water", "pool", "parking", "step-free", "smoke-alarm",
    ],
    photos: [
      { src: "/photos/mola-room.jpg", alt: "Interior del bungalow con cubrecama de mola" },
      { src: "/photos/property-exterior.jpg", alt: "Fachada del hotel y jardín" },
    ],
    featured: false,
    accessibility: { stepFreeAccess: true, rollInShower: false },
  },
  {
    id: "u-casa-palma",
    slug: "casa-palma",
    propertyId: "p-casas",
    name: "Casa Palma",
    nameEn: "Casa Palma",
    tagline: "Casa completa con piscina privada y el atardecer sobre el Pacífico.",
    taglineEn: "Whole house with a private pool and the sunset over the Pacific.",
    description:
      "Tres habitaciones, cocina completa y piscina propia frente al mar. Se alquila entera, así que el grupo la tiene para sí. Doce minutos del hotel: los huéspedes que se quedan aquí igual usan el pool club y el restaurante.",
    descriptionEn:
      "Three bedrooms, full kitchen and a private oceanfront pool. Rented whole, so the group has it to itself. Twelve minutes from the hotel — guests here still use the pool club and restaurant.",
    inventoryCount: 1,
    rooms: ["CP"],
    capacity: { guests: 8, bedrooms: 3, beds: 4, baths: 2 },
    bedType: "2 queen + 2 individuales",
    sizeSqm: 180,
    basePrice: money(290),
    amenityIds: [
      "wifi", "air-con", "pool", "sea-view", "kitchen", "coffee", "fridge", "washer",
      "terrace", "garden", "bbq", "parking", "private-bath", "hot-water", "tv", "step-free",
    ],
    photos: [
      { src: "/photos/casa-1.jpg", alt: "Exterior de Casa Palma" },
      { src: "/photos/pool-sunset.jpg", alt: "Piscina privada al atardecer entre palmeras" },
      { src: "/photos/casa-2.jpg", alt: "Interior de Casa Palma" },
      { src: "/photos/property-hero.jpg", alt: "Área social de Casa Palma" },
      { src: "/photos/casa-4.jpg", alt: "Habitación de Casa Palma" },
      { src: "/photos/casa-5.jpg", alt: "Terraza de Casa Palma" },
    ],
    featured: true,
    accessibility: { stepFreeAccess: true, rollInShower: false },
  },
  {
    id: "u-casa-tony",
    slug: "casa-tony",
    propertyId: "p-casas",
    name: "Casa Tony",
    nameEn: "Casa Tony",
    tagline: "Casa urbana en David, a dos cuadras de la corte.",
    taglineEn: "Town house in David, two blocks from the courthouse.",
    description:
      "Cocina isla, dos habitaciones y estacionamiento techado, en el centro de David. La que se llena entre semana con estancias de trabajo largas.",
    descriptionEn:
      "Island kitchen, two bedrooms, covered parking, in central David. Fills up midweek with long work stays.",
    inventoryCount: 1,
    rooms: ["CT"],
    capacity: { guests: 5, bedrooms: 2, beds: 3, baths: 2 },
    bedType: "1 king + 2 individuales",
    sizeSqm: 120,
    basePrice: money(165),
    amenityIds: [
      "wifi", "air-con", "kitchen", "coffee", "fridge", "washer", "parking",
      "private-bath", "hot-water", "tv", "workspace", "step-free",
    ],
    photos: [
      { src: "/photos/villa-kitchen.jpg", alt: "Cocina isla de Casa Tony con barra y taburetes" },
      { src: "/photos/villa-1.jpg", alt: "Exterior de Casa Tony" },
      { src: "/photos/villa-2.jpg", alt: "Sala de Casa Tony" },
      { src: "/photos/villa-3.jpg", alt: "Habitación de Casa Tony" },
    ],
    featured: false,
    accessibility: { stepFreeAccess: true, rollInShower: false },
  },
];

export const unitById = new Map(units.map((u) => [u.id, u]));
export const unitBySlug = new Map(units.map((u) => [u.slug, u]));

/** Todas las habitaciones físicas, en el orden en que las recorre camarería. */
export const allRooms = units.flatMap((unit) =>
  unit.rooms.map((room) => ({ room, unitId: unit.id, unitName: unit.name })),
);

export function unitFor(room: string) {
  return units.find((u) => u.rooms.includes(room));
}
