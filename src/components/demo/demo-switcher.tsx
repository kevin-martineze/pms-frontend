"use client";

import { usePathname } from "next/navigation";
import { BedDouble, FileText, LayoutDashboard } from "lucide-react";

import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/lib/i18n/provider";
import { withLocale } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

/**
 * Barra flotante de la demo.
 *
 * Existe porque la propuesta se abre desde un enlace de WhatsApp, en un celular,
 * por alguien que no sabe que hay dos aplicaciones distintas. Sin esto, ver el
 * PMS depende de que alguien escriba una URL a mano.
 *
 * No forma parte del producto: cuando esto pase a producción, se borra el
 * componente y nada más se entera.
 */
export function DemoSwitcher() {
  const pathname = usePathname();
  const { t, locale } = useI18n();

  /* La ruta ya viene con el idioma adentro, así que la comparación se hace
     contra el camino sin ese prefijo. */
  const path = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  const tabs = [
    {
      href: "/",
      label: t.demo.site,
      icon: BedDouble,
      active: !path.startsWith("/admin") && path !== "/proposal",
    },
    {
      href: "/admin",
      label: t.demo.system,
      icon: LayoutDashboard,
      active: path.startsWith("/admin"),
    },
    {
      href: "/proposal",
      label: t.demo.proposal,
      icon: FileText,
      active: path === "/proposal",
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden">
      <nav
        aria-label={t.demo.switchView}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-palm-deep/95 p-1 shadow-lg shadow-black/25 backdrop-blur"
      >
        <span className="px-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white/45">
          {t.demo.label}
        </span>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <LocaleLink
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                tab.active
                  ? "bg-butter text-palm-deep"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
              title={withLocale(locale, tab.href)}
            >
              <Icon className="size-3.5" aria-hidden />
              {tab.label}
            </LocaleLink>
          );
        })}
      </nav>
    </div>
  );
}
