"use client";

import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { LocaleLink } from "@/components/locale-link";
import { site } from "@/lib/mock/property";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t } = useI18n();

  const columns = [
    {
      title: t.footer.columns.stays,
      links: [
        { href: "/stays", label: t.footer.links.allUnits },
        { href: "/stays?kind=hotel", label: t.footer.links.hotelRooms },
        { href: "/stays?kind=villa", label: t.footer.links.wholeHouses },
        { href: "/stays?accessible=1", label: t.footer.links.accessibleUnits },
      ],
    },
    {
      title: t.footer.columns.onSite,
      links: [
        { href: "/pool-club", label: t.footer.links.poolClub },
        { href: "/sports-bar", label: t.footer.links.sportsBar },
        { href: "/pool-club#passes", label: t.footer.links.dayPasses },
        { href: "/sports-bar#book", label: t.footer.links.bookTable },
      ],
    },
    {
      title: t.footer.columns.info,
      links: [
        { href: "/info/getting-here", label: t.footer.links.gettingHere },
        { href: "/info/policies", label: t.footer.links.policies },
        { href: "/info/faq", label: t.footer.links.faq },
        { href: "/info/accessibility", label: t.footer.links.accessibility },
      ],
    },
  ];

  return (
    <footer className="mt-24 bg-palm-deep text-white/75">
      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="display-sm text-2xl text-white">Don Julius</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">{t.footer.blurb}</p>

            <div className="mt-6 space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-butter" aria-hidden />
                {site.locality}, {site.region}, Panamá
              </p>
              <a className="flex items-center gap-2.5 hover:text-white" href={`mailto:${site.email}`}>
                <Mail className="size-4 shrink-0 text-butter" aria-hidden />
                {site.email}
              </a>
              <a className="flex items-center gap-2.5 hover:text-white" href="https://wa.me/50700000000">
                <MessageCircle className="size-4 shrink-0 text-butter" aria-hidden />
                {t.common.whatsapp}
              </a>
              <a className="flex items-center gap-2.5 hover:text-white" href="https://instagram.com">
                <AtSign className="size-4 shrink-0 text-butter" aria-hidden />
                @donjulius
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="eyebrow text-white/45">{column.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <LocaleLink href={link.href} className="hover:text-white">
                      {link.label}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col gap-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.checkInOut(site.checkIn, site.checkOut)}</p>
          <p>{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
