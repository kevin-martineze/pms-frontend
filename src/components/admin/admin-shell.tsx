"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BrushCleaning,
  CalendarDays,
  ChartNoAxesColumn,
  ChevronsUpDown,
  LayoutDashboard,
  Lock,
  Menu,
  Tags,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LocaleLink } from "@/components/locale-link";
import { ROLE_ACCESS, staff } from "@/lib/mock/operations";
import { withLocale } from "@/lib/i18n/paths";
import { useI18n } from "@/lib/i18n/provider";
import type { StaffRole } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Shell del sistema de gestión.
 *
 * El selector de rol es la pieza que vende el producto. El cliente dijo dos
 * cosas en la misma conversación: que quiere trabajar veinte horas en vez de
 * cuarenta, y que quiere ser gerente. Las dos dependen de que su gente pueda
 * operar el hotel sin él — y eso no se explica con una diapositiva, se
 * demuestra cambiando de rol y viendo cómo el menú se encoge.
 *
 * En producción los permisos los impone el servidor. Este selector es la
 * maqueta de lo que el servidor va a hacer, no un sustituto.
 */

const NAV = [
  { key: "today", access: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "calendar", access: "calendar", href: "/admin/calendar", icon: CalendarDays },
  { key: "reservations", access: "reservations", href: "/admin/reservations", icon: Users },
  { key: "housekeeping", access: "housekeeping", href: "/admin/housekeeping", icon: BrushCleaning },
  { key: "rates", access: "rates", href: "/admin/rates", icon: Tags },
  { key: "reports", access: "reports", href: "/admin/reports", icon: ChartNoAxesColumn },
] as const;

type NavKey = (typeof NAV)[number]["key"];

const RoleContext = React.createContext<StaffRole>("owner");
export const useRole = () => React.useContext(RoleContext);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [staffId, setStaffId] = React.useState("s-julius");
  const current = staff.find((s) => s.id === staffId) ?? staff[0];
  const allowed = new Set(ROLE_ACCESS[current.role]);

  return (
    <RoleContext.Provider value={current.role}>
      <div className="flex min-h-dvh bg-background">
        <SidebarNav allowed={allowed} className="hidden w-60 shrink-0 lg:flex" />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" aria-hidden />
                  <span className="sr-only">{t.nav.openMenu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 bg-sidebar p-0 text-sidebar-foreground">
                <SheetHeader className="sr-only">
                  <SheetTitle>{t.admin.nav.sections}</SheetTitle>
                </SheetHeader>
                <SidebarNav allowed={allowed} className="flex w-full" />
              </SheetContent>
            </Sheet>

            <span className="text-sm text-muted-foreground">Don Julius · David, Chiriquí</span>

            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="hidden gap-1.5 sm:flex">
                <span className="size-1.5 rounded-full bg-status-vacant-clean" aria-hidden />
                {t.admin.nav.synced}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 pl-1.5 pr-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-palm text-[0.7rem] text-white">
                        {current.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-left leading-tight sm:block">
                      <span className="block text-xs font-medium">{current.name}</span>
                      <span className="block text-[0.68rem] text-muted-foreground">
                        {t.admin.roles[current.role]}
                      </span>
                    </span>
                    <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {t.admin.nav.viewAs}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {staff.map((member) => (
                    <DropdownMenuItem
                      key={member.id}
                      onSelect={() => setStaffId(member.id)}
                      className="gap-2.5"
                    >
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-secondary text-[0.6rem]">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">
                        <span className="block text-sm">{member.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {t.admin.roles[member.role]}
                          {member.shift ? ` · ${member.shift}` : ""}
                        </span>
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="min-w-0 flex-1 pb-24">{children}</main>
        </div>
      </div>
    </RoleContext.Provider>
  );
}

function SidebarNav({ allowed, className }: { allowed: Set<string>; className?: string }) {
  const pathname = usePathname();
  const { t, locale } = useI18n();

  return (
    <nav
      className={cn("flex-col gap-1 bg-sidebar p-3 text-sidebar-foreground", className)}
      aria-label={t.admin.nav.sections}
    >
      <LocaleLink href="/admin" className="mb-4 flex items-baseline gap-2 px-2 pt-2">
        <span className="display-sm text-lg text-white">Don Julius</span>
        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-white/40">PMS</span>
      </LocaleLink>

      {NAV.map((item) => {
        const Icon = item.icon;
        const permitted = allowed.has(item.access);
        const target = withLocale(locale, item.href);
        const active = item.href === "/admin" ? pathname === target : pathname.startsWith(target);
        const label = t.admin.nav[item.key as NavKey];

        /* Lo que un rol no puede ver se muestra bloqueado en vez de esconderse.
           Esconderlo haría que recepción crea que el sistema no lo tiene y lo
           pida por WhatsApp; bloquearlo dice "existe, no es tuyo". */
        if (!permitted) {
          return (
            <Tooltip key={item.key}>
              <TooltipTrigger asChild>
                <span
                  aria-disabled
                  className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/25"
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                  <Lock className="ml-auto size-3" aria-hidden />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">{t.admin.nav.outOfScope}</TooltipContent>
            </Tooltip>
          );
        }

        return (
          <LocaleLink
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-white/70 hover:bg-sidebar-accent hover:text-white",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </LocaleLink>
        );
      })}

      <div className="mt-auto rounded-lg bg-white/5 p-3 text-xs text-white/55">
        <p className="font-medium text-white/80">{t.admin.nav.mockTitle}</p>
        <p className="mt-1 leading-relaxed">{t.admin.nav.mockBody}</p>
      </div>
    </nav>
  );
}
