import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/guest/search-bar";
import { SiteHeader } from "@/components/guest/site-header";
import { UnitCard } from "@/components/guest/unit-card";
import { units } from "@/lib/mock/property";

const VENUES = [
  {
    href: "/pool-club",
    eyebrow: "Don Julius 2",
    title: "Pool Club & Restaurante",
    body: "Piscina, canchas de fútbol y cocina abierta todo el día. Los huéspedes entran sin costo; el resto compra un pase de día.",
    photo: "/photos/pool-sunset.jpg",
    alt: "Piscina del club al atardecer, rodeada de palmeras",
  },
  {
    href: "/sports-bar",
    eyebrow: "Don Julius V1",
    title: "Restaurante & Sports Bar",
    body: "Pantallas para el fútbol, cerveza fría y mesas largas. A seis minutos del hotel, con transporte de cortesía en las noches de partido.",
    photo: "/photos/bar-2.jpg",
    alt: "Salón del sports bar con mesas y barra al fondo",
  },
  {
    href: "/stays?kind=villa",
    eyebrow: "Casas completas",
    title: "Para grupos y estancias largas",
    body: "Casas de dos y tres habitaciones con cocina y piscina propia. Se alquilan enteras, con el mismo servicio del hotel detrás.",
    photo: "/photos/casa-1.jpg",
    alt: "Exterior de una de las casas con jardín",
  },
];

export default function HomePage() {
  const featured = units.filter((u) => u.featured);

  return (
    <>
      <SiteHeader transparent />

      {/* --- Hero --------------------------------------------------------- */}
      <section className="relative isolate min-h-[38rem] overflow-hidden md:min-h-[44rem]">
        <Image
          src="/photos/property-exterior.jpg"
          alt="Fachada del hotel Don Julius con la piscina y las palmeras al frente"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70"
          aria-hidden
        />

        <div className="shell relative flex min-h-[38rem] flex-col justify-end pb-10 pt-32 md:min-h-[44rem] md:pb-16">
          <Badge className="mb-5 w-fit border-white/25 bg-white/15 text-white backdrop-blur hover:bg-white/20">
            Abrimos el 15 de noviembre · Tarifa de lanzamiento
          </Badge>

          <h1 className="display max-w-3xl text-[clamp(2.6rem,7vw,4.75rem)] text-white">
            Un hotel, una piscina y un sports bar en el Pacífico chiricano.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            Trece llaves, dos casas completas y todo lo que hay alrededor —
            reservado en un solo lugar, sin comisiones de intermediario.
          </p>

          <div className="mt-8 flex items-center gap-5 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-butter" aria-hidden />
              David, Chiriquí
            </span>
            <span className="flex items-center gap-1.5">
              <Waves className="size-4 text-butter" aria-hidden />
              Piscina y jardín
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Star className="size-4 text-butter" aria-hidden />
              Restaurante en sitio
            </span>
          </div>
        </div>
      </section>

      {/* La barra sube sobre el hero: la primera acción del sitio es elegir
          fechas, y ponerla a media pantalla de distancia la esconde. */}
      <div className="shell relative z-10 -mt-9 md:-mt-10">
        <SearchBar />
      </div>

      {/* --- Unidades destacadas ------------------------------------------ */}
      <section className="shell py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">Dónde quedarse</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Cinco tipos de habitación, dos casas enteras
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <Link href="/stays">
              Ver las siete opciones
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((unit, index) => (
            <UnitCard key={unit.id} unit={unit} priority={index === 0} />
          ))}
        </div>
      </section>

      {/* --- Los tres negocios -------------------------------------------- */}
      <section className="bg-sand py-20 md:py-28">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow text-muted-foreground">Todo Don Julius</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Tres lugares, una sola reserva
            </h2>
            <p className="mt-4 text-muted-foreground">
              El hotel, el pool club y el sports bar son del mismo dueño y comparten
              calendario. Reservar la habitación ya te deja adentro de los otros dos.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VENUES.map((venue) => (
              <Link
                key={venue.href}
                href={venue.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={venue.photo}
                    alt={venue.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-terracotta">{venue.eyebrow}</p>
                  <h3 className="display-sm mt-2 text-xl">{venue.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{venue.body}</p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-palm">
                    Ver más
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- Reserva directa ---------------------------------------------- */}
      <section className="shell py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
            <Image
              src="/photos/pool-sunset.jpg"
              alt="Atardecer sobre la piscina, con el mar al fondo"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="eyebrow text-muted-foreground">Reserva directa</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Reservar aquí siempre cuesta menos
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              También estamos en Booking y Airbnb, y no lo escondemos. Pero ahí una parte
              de lo que pagas se va en comisión. Reservando en este sitio esa parte se
              queda en la casa — y te la devolvemos en el precio.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                ["7% menos que en las plataformas", "El mismo cuarto, la misma fecha, sin intermediario."],
                ["Entrada al pool club incluida", "Piscina y canchas mientras dure tu estadía."],
                ["Cancelación gratis hasta 48 h antes", "Sin llamadas ni formularios: se cancela desde el correo de confirmación."],
                ["Respuesta por WhatsApp", "Si algo no cuadra, escribes y contesta alguien de la casa."],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-butter" aria-hidden />
                  <span>
                    <span className="block font-medium">{title}</span>
                    <span className="block text-sm text-muted-foreground">{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="mt-9 gap-2 rounded-full">
              <Link href="/stays">
                Ver disponibilidad
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
