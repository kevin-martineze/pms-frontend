import type { Metadata } from "next";
import Image from "next/image";
import { lang } from "next/root-params";
import { Clock, Utensils, Volleyball, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DayPassPicker } from "@/components/guest/day-pass-picker";
import { SiteHeader } from "@/components/guest/site-header";
import { LocaleLink } from "@/components/locale-link";
import { getDictionary, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.poolClub.metaTitle, description: t.poolClub.metaDescription };
}

const ICONS = [Waves, Volleyball, Utensils, Clock];

const GALLERY = [
  { src: "/photos/pool-sunset.jpg", alt: "The pool at dusk, palms in silhouette" },
  { src: "/photos/poolclub-deck.jpg", alt: "The deck and covered pavilion beside the pool" },
  { src: "/photos/beach-rancho.jpg", alt: "Thatched rancho with long tables, facing the beach" },
];

export default async function PoolClubPage() {
  const t = getDictionary(resolveLocale(await lang()));

  return (
    <>
      <SiteHeader transparent />

      <section className="relative isolate min-h-[26rem] overflow-hidden md:min-h-[32rem]">
        <Image
          src="/photos/poolclub-pool.jpg"
          alt="The club's main pool with the covered pavilion behind it"
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"
          aria-hidden
        />

        <div className="shell relative flex min-h-[26rem] flex-col justify-end pb-12 pt-32 md:min-h-[32rem]">
          <Badge className="mb-4 w-fit border-white/25 bg-white/15 text-white backdrop-blur hover:bg-white/20">
            {t.poolClub.badge}
          </Badge>
          <h1 className="display max-w-2xl text-[clamp(2.25rem,6vw,3.75rem)] text-white">
            {t.poolClub.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{t.poolClub.lead}</p>
        </div>
      </section>

      <div className="shell grid items-start gap-12 py-16 lg:grid-cols-[1fr_23rem] lg:gap-16 md:py-20">
        <div>
          <h2 className="display-sm text-[clamp(1.5rem,3vw,2rem)]">{t.poolClub.whatsInside}</h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {t.poolClub.features.map((feature, index) => {
              const Icon = ICONS[index] ?? Waves;
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
              <div
                key={photo.src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted"
              >
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
            <h3 className="display-sm text-lg">{t.poolClub.guestTitle}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t.poolClub.guestBody}
            </p>
            <Button asChild variant="outline" className="mt-5">
              <LocaleLink href="/stays">{t.poolClub.guestCta}</LocaleLink>
            </Button>
          </div>
        </div>

        <div id="passes" className="lg:sticky lg:top-24">
          <DayPassPicker />
        </div>
      </div>
    </>
  );
}
