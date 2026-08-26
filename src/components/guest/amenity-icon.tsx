import {
  Accessibility,
  Baby,
  Beef,
  Beer,
  BellRing,
  Car,
  Coffee,
  CookingPot,
  Droplets,
  Eye,
  Flame,
  Laptop,
  Microwave,
  PanelsTopLeft,
  Refrigerator,
  ShowerHead,
  Sun,
  TentTree,
  Trees,
  Tv,
  Utensils,
  Volleyball,
  WashingMachine,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa explícito de clave de amenidad a icono.
 *
 * Es un objeto y no un import dinámico por peso: importar `lucide-react` entero
 * y resolver por string mete las 2.000 y pico de iconos en el bundle. Aquí sólo
 * entran los veintitantos que la propiedad realmente usa.
 */
const ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  wind: Wind,
  tv: Tv,
  waves: Waves,
  car: Car,
  "cooking-pot": CookingPot,
  microwave: Microwave,
  coffee: Coffee,
  refrigerator: Refrigerator,
  "shower-head": ShowerHead,
  droplets: Droplets,
  flame: Flame,
  sun: Sun,
  "panels-top-left": PanelsTopLeft,
  trees: Trees,
  "tent-tree": TentTree,
  beef: Beef,
  eye: Eye,
  utensils: Utensils,
  beer: Beer,
  volleyball: Volleyball,
  baby: Baby,
  "washing-machine": WashingMachine,
  laptop: Laptop,
  accessibility: Accessibility,
  "bell-ring": BellRing,
};

export function AmenityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name];
  /* Una clave sin icono cae a nada visible en vez de a un cuadro roto: el texto
     de la amenidad ya dice lo que hace falta. */
  if (!Icon) return null;
  return <Icon className={className} aria-hidden />;
}
