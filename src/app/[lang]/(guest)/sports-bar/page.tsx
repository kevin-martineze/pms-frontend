import type { Metadata } from "next";
import Image from "next/image";
import { lang } from "next/root-params";
import { Beer, Car, Tv, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/guest/site-header";
import { TableBooking } from "@/components/guest/table-booking";
import { getDictionary, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.sportsBar.metaTitle, description: t.sportsBar.metaDescription };
}

const ICONS = [Tv, Utensils, Beer, Car];

const GALLERY = [
  { src: "/photos/bar-2.jpg", alt: "The dining room with tables and the bar at the back" },
  { src: "/photos/bar-1.jpg", alt: "Covered dining area of the restaurant" },
  { src: "/photos/bar-3.jpg", alt: "Detail of the sports bar interior" },
  { src: "/photos/brand-art.jpg", alt: "Don Julius V1 and Don Julius 2 brand artwork" },
];

export default async function SportsBarPage() {
  const t = getDictionary(resolveLocale(await lang()));

  return (
    <>
      <SiteHeader transparent />

      <section className="relative isolate min-h-[26rem] overflow-hidden md:min-h-[30rem]">
        <Image
          src="/photos/bar-front.jpg"
          alt="Front of the Don Julius V1 restaurant and sports bar"
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75"
          aria-hidden
        />

        <div className="shell relative flex min-h-[26rem] flex-col justify-end pb-12 pt-32 md:min-h-[30rem]">
          <Badge className="mb-4 w-fit border-white/25 bg-white/15 text-white backdrop-blur hover:bg-white/20">
            {t.sportsBar.badge}
          </Badge>
          <h1 className="display max-w-2xl text-[clamp(2.25rem,6vw,3.75rem)] text-white">
            {t.sportsBar.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{t.sportsBar.lead}</p>
        </div>
      </section>

      <div className="shell grid items-start gap-12 py-16 lg:grid-cols-[1fr_23rem] lg:gap-16 md:py-20">
        <div>
          <div className="grid gap-8 sm:grid-cols-2">
            {t.sportsBar.features.map((feature, index) => {
              const Icon = ICONS[index] ?? Tv;
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
              <div
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
              >
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
            <h2 className="display-sm text-lg">{t.sportsBar.hoursTitle}</h2>
            <dl className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2">
              {t.sportsBar.hours.map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">{day}</dt>
                  <dd className="tnum">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div id="book" className="lg:sticky lg:top-24">
          <TableBooking />
        </div>
      </div>
    </>
  );
}
