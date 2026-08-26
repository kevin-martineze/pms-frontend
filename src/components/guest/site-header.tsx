"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Globe, Menu, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleLink } from "@/components/locale-link";
import { LOCALES, LOCALE_LABEL, PLANNED_LOCALES } from "@/lib/i18n/config";
import { swapLocale, withLocale } from "@/lib/i18n/paths";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/stays", key: "stays" },
  { href: "/pool-club", key: "poolClub" },
  { href: "/sports-bar", key: "sportsBar" },
  { href: "/info/getting-here", key: "gettingHere" },
] as const;

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const { t, locale } = useI18n();

  return (
    <header
      className={cn(
        "top-0 z-40 w-full",
        transparent
          ? "absolute bg-gradient-to-b from-black/55 to-transparent text-white"
          : "sticky border-b border-border bg-background/85 backdrop-blur",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <LocaleLink href="/" className="flex items-baseline gap-2">
          <span className="display-sm text-xl tracking-tight md:text-[1.6rem]">Don Julius</span>
          <span
            className={cn(
              "hidden text-[0.6rem] font-medium uppercase tracking-[0.2em] sm:inline",
              transparent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            Chiriquí
          </span>
        </LocaleLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const target = withLocale(locale, item.href);
            return (
              <LocaleLink
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  transparent
                    ? "text-white/85 hover:bg-white/15 hover:text-white"
                    : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                  pathname === target &&
                    (transparent ? "bg-white/15 text-white" : "bg-secondary text-foreground"),
                )}
              >
                {t.nav[item.key]}
              </LocaleLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-1.5", transparent && "text-white hover:bg-white/15 hover:text-white")}
              >
                <Globe className="size-4" aria-hidden />
                <span className="hidden uppercase sm:inline">{locale}</span>
                <span className="sr-only">{t.nav.changeLanguage}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {LOCALES.map((code) => (
                <DropdownMenuItem key={code} asChild>
                  <Link href={swapLocale(pathname, code)} className="gap-2">
                    <span className="tnum w-6 text-xs uppercase text-muted-foreground">{code}</span>
                    {LOCALE_LABEL[code]}
                    {code === locale && <Check className="ml-auto size-3.5" aria-hidden />}
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              {/* Los tres idiomas restantes del alcance se muestran
                  deshabilitados en vez de esconderse: el cliente pidió cinco, y
                  ocultarlos haría parecer que no están planeados. */}
              {PLANNED_LOCALES.map((code) => (
                <DropdownMenuItem key={code} disabled className="gap-2">
                  <span className="tnum w-6 text-xs uppercase text-muted-foreground">{code}</span>
                  {LOCALE_LABEL[code]}
                  <span className="ml-auto text-[0.65rem] text-muted-foreground">
                    {t.nav.plannedLanguage}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            size="sm"
            className={cn(
              "hidden sm:inline-flex",
              transparent && "bg-white text-palm-deep hover:bg-white/90",
            )}
          >
            <LocaleLink href="/stays">{t.nav.book}</LocaleLink>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("md:hidden", transparent && "text-white hover:bg-white/15 hover:text-white")}
              >
                <Menu className="size-5" aria-hidden />
                <span className="sr-only">{t.nav.openMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[17rem]">
              <SheetHeader>
                <SheetTitle className="display-sm text-left text-xl">Don Julius</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <LocaleLink
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    {t.nav[item.key]}
                  </LocaleLink>
                ))}
              </nav>
              <div className="mt-auto space-y-2 p-4">
                <Button asChild className="w-full">
                  <LocaleLink href="/stays">{t.nav.checkAvailability}</LocaleLink>
                </Button>
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href="https://wa.me/50700000000">
                    <Phone className="size-4" aria-hidden />
                    {t.common.whatsapp}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
