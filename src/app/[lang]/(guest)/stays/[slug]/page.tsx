import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import {
  Accessibility,
  Bath,
  BedDouble,
  ChevronLeft,
  Clock,
  Maximize,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AmenityIcon } from "@/components/guest/amenity-icon";
import { BookingPanel } from "@/components/guest/booking-panel";
import { Gallery } from "@/components/guest/gallery";
import { SiteHeader } from "@/components/guest/site-header";
import { UnitCard } from "@/components/guest/unit-card";
import { LocaleLink } from "@/components/locale-link";
import { availabilityFor, blockedDatesAhead, cleaningFeeFor, ratesFor } from "@/lib/availability";
import { formatMoney, toIsoDate } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { amenityLabel, unitDescription, unitName, unitTagline } from "@/lib/i18n/content";
import { LOCALES } from "@/lib/i18n/config";
import { amenityById, properties, unitBySlug, units } from "@/lib/mock/property";
import type { AmenityGroup } from "@/lib/domain/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => units.map((unit) => ({ lang: locale, slug: unit.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = resolveLocale(await lang());
  const unit = unitBySlug.get(slug);
  if (!unit) return {};
  return { title: unitName(unit, locale), description: unitTagline(unit, locale) };
}

export default async function UnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ in?: string; out?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const unit = unitBySlug.get(slug);
  if (!unit) notFound();

  const property = properties.find((p) => p.id === unit.propertyId);

  /* Tarifas de los próximos meses, noche por noche, con temporada y fin de
     semana ya aplicados. Se calculan en el servidor y viajan como tabla para
     que el panel recalcule el total sin volver a pedir nada. */
  const rates = ratesFor(unit, toIsoDate(new Date()));
  const blocked = blockedDatesAhead(unit);
  const hasDates = Boolean(query.in && query.out && query.in < query.out);
  const availability = hasDates ? availabilityFor(unit, query.in!, query.out!) : null;

  const grouped = new Map<AmenityGroup, { id: string; icon: string; label: string }[]>();
  for (const id of unit.amenityIds) {
    const amenity = amenityById.get(id);
    if (!amenity) continue;
    const list = grouped.get(amenity.group) ?? [];
    list.push({ id: amenity.id, icon: amenity.icon, label: amenityLabel(amenity, locale) });
    grouped.set(amenity.group, list);
  }

  const accessNote =
    locale === "en" ? unit.accessibility.notesEn : unit.accessibility.notes;

  const similar = units
    .filter((u) => u.id !== unit.id && u.propertyId === unit.propertyId)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />

      <div className="shell pt-6">
        <LocaleLink
          href="/stays"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {t.unit.backToList}
        </LocaleLink>
      </div>

      <div className="shell mt-5">
        <Gallery photos={unit.photos} />
      </div>

      <div className="shell mt-10 grid items-start gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {property && (
              <Badge variant="secondary" className="rounded-full">
                {property.kind === "villa" ? t.unit.wholeHouse : t.unit.hotelRoom}
              </Badge>
            )}
            {unit.inventoryCount > 1 && (
              <Badge variant="outline" className="rounded-full">
                {t.unit.unitsOfType(unit.inventoryCount)}
              </Badge>
            )}
            {unit.accessibility.stepFreeAccess && (
              <Badge variant="outline" className="gap-1.5 rounded-full">
                <Accessibility className="size-3.5" aria-hidden />
                {t.unit.stepFreeBadge}
              </Badge>
            )}
          </div>

          <h1 className="display-sm mt-4 text-[clamp(1.85rem,4vw,2.75rem)]">
            {unitName(unit, locale)}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{unitTagline(unit, locale)}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Stat
              icon={<Users className="size-4" aria-hidden />}
              label={t.unit.capacity}
              value={t.common.guests(unit.capacity.guests)}
            />
            <Stat
              icon={<BedDouble className="size-4" aria-hidden />}
              label={t.unit.beds}
              value={unit.bedType}
            />
            <Stat
              icon={<Bath className="size-4" aria-hidden />}
              label={t.unit.baths}
              value={String(unit.capacity.baths)}
            />
            <Stat
              icon={<Maximize className="size-4" aria-hidden />}
              label={t.unit.size}
              value={`${unit.sizeSqm} m²`}
            />
          </dl>

          <Separator className="my-8" />

          <p className="max-w-2xl leading-relaxed">{unitDescription(unit, locale)}</p>

          <Separator className="my-8" />

          <h2 className="display-sm text-xl">{t.unit.whatsIncluded}</h2>
          <div className="mt-5 grid gap-7 sm:grid-cols-2">
            {[...grouped.entries()].map(([group, list]) => (
              <div key={group}>
                <p className="eyebrow text-muted-foreground">{t.unit.amenityGroups[group]}</p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {list.map((amenity) => (
                    <li key={amenity.id} className="flex items-center gap-2.5">
                      <AmenityIcon name={amenity.icon} className="size-4 shrink-0 text-palm" />
                      {amenity.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <h2 className="display-sm text-xl">{t.unit.accessibilityTitle}</h2>
          {/* Se declara aunque la respuesta sea "no". Una unidad que calla
              obliga al huésped a llamar para averiguar, y las normas de sistemas
              de reserva de EE. UU. esperan que pueda decidirlo desde la ficha. */}
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <Accessibility className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
              <span>
                {unit.accessibility.stepFreeAccess
                  ? t.unit.accessStepFreeYes
                  : t.unit.accessStepFreeNo}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Bath className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
              <span>
                {unit.accessibility.rollInShower ? t.unit.accessShowerYes : t.unit.accessShowerNo}
              </span>
            </li>
            {accessNote && (
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                {accessNote}
              </li>
            )}
          </ul>

          <Separator className="my-8" />

          <h2 className="display-sm text-xl">{t.unit.beforeBooking}</h2>
          <dl className="mt-4 grid gap-5 text-sm sm:grid-cols-2">
            {t.unit.policies.map(([term, detail]) => (
              <div key={term}>
                <dt className="font-medium">{term}</dt>
                <dd className="mt-1 text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <BookingPanel
          unitId={unit.id}
          unitSlug={unit.slug}
          unitName={unitName(unit, locale)}
          maxGuests={unit.capacity.guests}
          basePriceLabel={formatMoney(unit.basePrice, tag)}
          cleaningFee={cleaningFeeFor(unit)}
          rates={rates}
          blockedDates={blocked}
          unitsLeft={availability?.unitsLeft ?? null}
          defaultRange={hasDates ? { from: query.in!, to: query.out! } : undefined}
        />
      </div>

      {similar.length > 0 && (
        <section className="shell mt-20">
          <h2 className="display-sm text-xl">{t.unit.otherOptions}</h2>
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((other) => (
              <UnitCard key={other.id} unit={other} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-muted-foreground">{icon}</span>
      <span>
        <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
        <dd className="mt-0.5">{value}</dd>
      </span>
    </div>
  );
}
