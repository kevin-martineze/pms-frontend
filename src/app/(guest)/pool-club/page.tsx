import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, Utensils, Volleyball, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DayPassPicker } from "@/components/guest/day-pass-picker";
import { SiteHeader } from "@/components/guest/site-header";

export const metadata: Metadata = {
  title: "Pool Club",
  description:
    "Don Julius 2 — piscina, canchas de fútbol y restaurante en David, Chiriquí. Pases de día y entrada libre para huéspedes.",
};

const FEATURES = [
  {
    icon: Waves,
    title: "Piscina y tumbonas",
    body: "Piscina grande con zona baja para niños, sombra de palma y toallas incluidas en el pase.",
  },
  {
    icon: Volleyball,
    title: "Canchas de fútbol",
    body: "Dos canchas con malla. Se reservan por hora desde el mismo sistema; los pases de día incluyen una hora.",
  },
  {
    icon: Utensils,
    title: "Restaurante abierto",
    body: "Cocina de 11:00 a 21:00. Pedidos a la tumbona sin salir de la piscina.",
  },
  {
    icon: Clock,
    title: "9:00 a 18:00",
    body: "Todos los días. Las noches de partido el bar V1 abre hasta tarde, a seis minutos.",
  },
];

const GALLERY = [
  { src: "/photos/pool-sunset.jpg", alt: "Piscina del club al atardecer entre palmeras" },
  { src: "/photos/casa-2.jpg", alt: "Zona de descanso junto a la piscina" },
  { src: "/photos/casa-5.jpg", alt: "Terraza con vista al jardín" },
];

export default function PoolClubPage() {
  return (
    <>
      <SiteHeader transparent />

      <section className="relative isolate min-h-[26rem] overflow-hidden md:min-h-[32rem]">
        <Image
          src="/photos/pool-sunset.jpg"
          alt="Piscina del pool club al atardecer, con palmeras en silueta"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" aria-hidden />

        <div className="shell relative flex min-h-[26rem] flex-col justify-end pb-12 pt-32 md:min-h-[32rem]">
          <Badge className="mb-4 w-fit border-white/25 bg-white/15 text-white backdrop-blur hover:bg-white/20">
            Don Julius 2
          </Badge>
          <h1 className="display max-w-2xl text-[clamp(2.25rem,6vw,3.75rem)] text-white">
            Pool Club & Restaurante
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Piscina, canchas y cocina abierta todo el día. Si te quedas en el hotel, entras sin
            pagar.
          </p>
        </div>
      </section>

      <div className="shell grid items-start gap-12 py-16 lg:grid-cols-[1fr_23rem] lg:gap-16 md:py-20">
        <div>
          <h2 className="display-sm text-[clamp(1.5rem,3vw,2rem)]">Qué hay adentro</h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}>
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary">
                    <Icon className="size-5 text-palm" aria-hidden />
                  </span>
                  <h3 className="display-sm mt-3.5 text-base">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {GALLERY.map((photo) => (
              <div key={photo.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 20vw, 90vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-sand p-6">
            <h3 className="display-sm text-lg">¿Te quedas en el hotel?</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              El pase de día está incluido durante toda tu estadía, para todos los que vengan en la
              reserva. No hay que comprar nada aparte ni presentar nada en la puerta: el número de
              habitación es la entrada.
            </p>
            <Button asChild variant="outline" className="mt-5">
              <Link href="/stays">Ver habitaciones</Link>
            </Button>
          </div>
        </div>

        <div id="pases" className="lg:sticky lg:top-24">
          <DayPassPicker />
        </div>
      </div>
    </>
  );
}
