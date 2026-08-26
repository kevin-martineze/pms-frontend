import Link from "next/link";
import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { site } from "@/lib/mock/property";

const COLUMNS = [
  {
    title: "Alojamiento",
    links: [
      { href: "/stays", label: "Todas las unidades" },
      { href: "/stays?kind=hotel", label: "Habitaciones del hotel" },
      { href: "/stays?kind=villa", label: "Casas completas" },
      { href: "/stays?accessible=1", label: "Unidades accesibles" },
    ],
  },
  {
    title: "En la propiedad",
    links: [
      { href: "/pool-club", label: "Pool Club" },
      { href: "/sports-bar", label: "V1 Sports Bar" },
      { href: "/pool-club#pases", label: "Pases de día" },
      { href: "/sports-bar#reservar", label: "Reservar mesa" },
    ],
  },
  {
    title: "Información",
    links: [
      { href: "/info/como-llegar", label: "Cómo llegar" },
      { href: "/info/politicas", label: "Políticas" },
      { href: "/info/faq", label: "Preguntas frecuentes" },
      { href: "/info/accesibilidad", label: "Accesibilidad" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-palm-deep text-white/75">
      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="display-sm text-2xl text-white">Don Julius</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Hotel, pool club y sports bar en David, Chiriquí. Abrimos el 15 de noviembre.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-butter" aria-hidden />
                {site.locality}, {site.region}, Panamá
              </p>
              <a
                className="flex items-center gap-2.5 hover:text-white"
                href={`mailto:${site.email}`}
              >
                <Mail className="size-4 shrink-0 text-butter" aria-hidden />
                {site.email}
              </a>
              <a className="flex items-center gap-2.5 hover:text-white" href="https://wa.me/50700000000">
                <MessageCircle className="size-4 shrink-0 text-butter" aria-hidden />
                WhatsApp
              </a>
              <a className="flex items-center gap-2.5 hover:text-white" href="https://instagram.com">
                <AtSign className="size-4 shrink-0 text-butter" aria-hidden />
                @donjulius
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="eyebrow text-white/45">{column.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col gap-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Check-in {site.checkIn} · Check-out {site.checkOut} · Precios en dólares (USD)
          </p>
          <p>Maqueta de propuesta. Datos de demostración, no reservas reales.</p>
        </div>
      </div>
    </footer>
  );
}
