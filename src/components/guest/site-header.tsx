"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Menu, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/stays", label: "Alojamiento" },
  { href: "/pool-club", label: "Pool Club" },
  { href: "/sports-bar", label: "Sports Bar" },
  { href: "/info/como-llegar", label: "Cómo llegar" },
];

/**
 * Los cinco idiomas son requisito del cliente, no adorno: David recibe
 * jubilados norteamericanos y europeos, y Julius pidió inglés, español, alemán,
 * francés y neerlandés en la primera fase.
 */
const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "nl", label: "Nederlands" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();

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
        <Link href="/" className="flex items-baseline gap-2">
          <span className="display-sm text-xl tracking-tight md:text-[1.6rem]">Don Julius</span>
          <span
            className={cn(
              "hidden text-[0.6rem] font-medium uppercase tracking-[0.2em] sm:inline",
              transparent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            Chiriquí
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm transition-colors",
                transparent
                  ? "text-white/85 hover:bg-white/15 hover:text-white"
                  : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                pathname === item.href && (transparent ? "bg-white/15 text-white" : "bg-secondary text-foreground"),
              )}
            >
              {item.label}
            </Link>
          ))}
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
                <span className="hidden sm:inline">ES</span>
                <span className="sr-only">Cambiar idioma</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem key={lang.code}>
                  <span className="tnum w-6 text-xs uppercase text-muted-foreground">{lang.code}</span>
                  {lang.label}
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
            <Link href="/stays">Reservar</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("md:hidden", transparent && "text-white hover:bg-white/15 hover:text-white")}
              >
                <Menu className="size-5" aria-hidden />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[17rem]">
              <SheetHeader>
                <SheetTitle className="display-sm text-left text-xl">Don Julius</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-2 p-4">
                <Button asChild className="w-full">
                  <Link href="/stays">Ver disponibilidad</Link>
                </Button>
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href="https://wa.me/50700000000">
                    <Phone className="size-4" aria-hidden />
                    WhatsApp
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
