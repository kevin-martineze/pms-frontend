"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BedDouble, FileText, LayoutDashboard } from "lucide-react";

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

const TABS = [
  { href: "/", label: "Sitio", icon: BedDouble, match: (p: string) => !p.startsWith("/admin") && p !== "/propuesta" },
  { href: "/admin", label: "Sistema", icon: LayoutDashboard, match: (p: string) => p.startsWith("/admin") },
  { href: "/propuesta", label: "Propuesta", icon: FileText, match: (p: string) => p === "/propuesta" },
];

export function DemoSwitcher() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden">
      <nav
        aria-label="Cambiar de vista en la demostración"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-palm-deep/95 p-1 shadow-lg shadow-black/25 backdrop-blur"
      >
        <span className="px-3 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white/45">
          Demo
        </span>
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active ? "bg-butter text-palm-deep" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
