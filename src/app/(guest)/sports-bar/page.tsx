import type { Metadata } from "next";
import Image from "next/image";
import { Beer, Car, Tv, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/guest/site-header";
import { TableBooking } from "@/components/guest/table-booking";

export const metadata: Metadata = {
  title: "V1 Sports Bar",
  description:
    "Don Julius V1 — restaurante y sports bar en David, Chiriquí. Pantallas, cocina hasta tarde y mesas para grupos.",
};

const FEATURES = [
  { icon: Tv, title: "Pantallas en todo el salón", body: "Liga panameña, Champions, NFL y peleas. Sin ángulo malo." },
  { icon: Utensils, title: "Cocina hasta las 22:00", body: "Alitas, hamburguesas y pescado del día. Menú para niños." },
  { icon: Beer, title: "Barra nueva", body: "En construcción para la apertura de noviembre." },
  { icon: Car, title: "A 6 minutos del hotel", body: "Transporte de cortesía para huéspedes las noches de partido." },
];

const GALLERY = [
  { src: "/photos/bar-2.jpg", alt: "Salón del sports bar con mesas y la barra al fondo" },
  { src: "/photos/bar-1.jpg", alt: "Área de mesas techada del restaurante" },
  { src: "/photos/bar-3.jpg", alt: "Detalle de la decoración del sports bar" },
  { src: "/photos/bar-4.jpg", alt: "Zona de barra del sports bar" },
];

export default function SportsBarPage() {
  return (
    <>
      <SiteHeader transparent />

      <section className="relative isolate min-h-[26rem] overflow-hidden md:min-h-[30rem]">
        <Image
          src="/photos/bar-front.jpg"
          alt="Fachada del restaurante y sports bar Don Julius V1"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" aria-hidden />

        <div className="shell relative flex min-h-[26rem] flex-col justify-end pb-12 pt-32 md:min-h-[30rem]">
          <Badge className="mb-4 w-fit border-white/25 bg-white/15 text-white backdrop-blur hover:bg-white/20">
            Don Julius V1
          </Badge>
          <h1 className="display max-w-2xl text-[clamp(2.25rem,6vw,3.75rem)] text-white">
            Restaurante & Sports Bar
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Donde la pasión por el deporte y el buen sabor se unen. Hecho en Panamá.
          </p>
        </div>
      </section>

      <div className="shell grid items-start gap-12 py-16 lg:grid-cols-[1fr_23rem] lg:gap-16 md:py-20">
        <div>
          <div className="grid gap-8 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}>
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary">
                    <Icon className="size-5 text-terracotta" aria-hidden />
                  </span>
                  <h2 className="display-sm mt-3.5 text-base">{feature.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3">
            {GALLERY.map((photo) => (
              <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-sand p-6">
            <h2 className="display-sm text-lg">Horario</h2>
            <dl className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2">
              {[
                ["Lunes a jueves", "16:00 – 23:00"],
                ["Viernes y sábado", "12:00 – 01:00"],
                ["Domingo", "12:00 – 22:00"],
                ["Cocina", "hasta las 22:00"],
              ].map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">{day}</dt>
                  <dd className="tnum">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div id="reservar" className="lg:sticky lg:top-24">
          <TableBooking />
        </div>
      </div>
    </>
  );
}
