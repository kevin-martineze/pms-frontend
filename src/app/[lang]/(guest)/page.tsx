import Image from "next/image";
import { lang } from "next/root-params";
import { ArrowRight, MapPin, Star, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/components/locale-link";
import { SearchBar } from "@/components/guest/search-bar";
import { SiteHeader } from "@/components/guest/site-header";
import { UnitCard } from "@/components/guest/unit-card";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { units } from "@/lib/mock/property";

export default async function HomePage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);

  const featured = units.filter((u) => u.featured);

  const venues = [
    {
      href: "/pool-club",
      copy: t.home.venues.pool,
      photo: "/photos/poolclub-pool.jpg",
      alt: "The club pool with the covered pavilion behind it",
    },
    {
      href: "/sports-bar",
      copy: t.home.venues.bar,
      photo: "/photos/bar-2.jpg",
      alt: "The sports bar dining room with the bar at the back",
    },
    {
      href: "/stays?kind=villa",
      copy: t.home.venues.houses,
      photo: "/photos/casa-1.jpg",
      alt: "Exterior of one of the houses with its garden",
    },
  ];

  return (
    <>
      <SiteHeader transparent />

      {/* --- Hero --------------------------------------------------------- */}
      <section className="relative isolate min-h-[38rem] overflow-hidden md:min-h-[44rem]">
        {/* La foto del hero es la de mayor resolución del material disponible
            (1600 px de ancho). Una vertical de teléfono estirada a pantalla
            completa se ve escalada, y es lo primero que ve un huésped. */}
        <Image
          src="/photos/property-hero.jpg"
          alt="Palms framing the house and pool, with the ocean behind"
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70"
          aria-hidden
        />

        <div className="shell relative flex min-h-[38rem] flex-col justify-end pb-10 pt-32 md:min-h-[44rem] md:pb-16">
          <Badge className="mb-5 w-fit border-white/25 bg-white/15 text-white backdrop-blur hover:bg-white/20">
            {t.home.badge}
          </Badge>

          <h1 className="display max-w-3xl text-[clamp(2.6rem,7vw,4.75rem)] text-white">
            {t.home.title}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{t.home.lead}</p>

          <div className="mt-8 flex items-center gap-5 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-butter" aria-hidden />
              {t.home.metaLocation}
            </span>
            <span className="flex items-center gap-1.5">
              <Waves className="size-4 text-butter" aria-hidden />
              {t.home.metaPool}
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Star className="size-4 text-butter" aria-hidden />
              {t.home.metaRestaurant}
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
            <p className="eyebrow text-muted-foreground">{t.home.staysEyebrow}</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {t.home.staysTitle}
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <LocaleLink href="/stays">
              {t.home.staysCta}
              <ArrowRight className="size-4" aria-hidden />
            </LocaleLink>
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
            <p className="eyebrow text-muted-foreground">{t.home.venuesEyebrow}</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {t.home.venuesTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">{t.home.venuesLead}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {venues.map((venue) => (
              <LocaleLink
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
                  <p className="eyebrow text-terracotta">{venue.copy.eyebrow}</p>
                  <h3 className="display-sm mt-2 text-xl">{venue.copy.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {venue.copy.body}
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-palm">
                    {t.home.venueMore}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </LocaleLink>
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
              alt="Sunset over the pool, with the sea behind"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="eyebrow text-muted-foreground">{t.home.directEyebrow}</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {t.home.directTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{t.home.directLead}</p>

            <ul className="mt-8 space-y-4">
              {t.home.directPoints.map(([title, body]) => (
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
              <LocaleLink href="/stays">
                {t.home.directCta}
                <ArrowRight className="size-4" aria-hidden />
              </LocaleLink>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
