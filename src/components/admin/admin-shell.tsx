"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BrushCleaning,
  Building2,
  CalendarDays,
  ChartNoAxesColumn,
  Check,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Lock,
  Menu,
  Settings,
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
import { selectProperty } from "@/lib/auth/property-actions";
import { mapMemberRole } from "@/lib/auth/roles";
import type { SessionSummary } from "@/lib/auth/types";
import { ROLE_ACCESS } from "@/lib/auth/access";
import { withLocale } from "@/lib/i18n/paths";
import { useI18n } from "@/lib/i18n/provider";
import type { StaffRole } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Shell del sistema de gestión.
 *
 * Antes tenía un selector "ver el sistema como…" sobre datos de staff
 * inventados. Ahora corre sobre la sesión real de bookings-api: el rol viene
 * de la Membership del usuario logueado, no de una lista mock. `ROLE_ACCESS`
 * sigue siendo el mapa de permisos por rol — eso no era mock, era la regla de
 * negocio, y sigue valiendo con roles reales.
 */

const NAV = [
  { key: "today", access: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "calendar", access: "calendar", href: "/admin/calendar", icon: CalendarDays },
  { key: "reservations", access: "reservations", href: "/admin/reservations", icon: Users },
  { key: "housekeeping", access: "housekeeping", href: "/admin/housekeeping", icon: BrushCleaning },
  { key: "rates", access: "rates", href: "/admin/rates", icon: Tags },
  { key: "reports", access: "reports", href: "/admin/reports", icon: ChartNoAxesColumn },
  { key: "settings", access: "settings", href: "/admin/settings", icon: Settings },
] as const;

type NavKey = (typeof NAV)[number]["key"];

const RoleContext = React.createContext<StaffRole>("owner");
export const useRole = () => React.useContext(RoleContext);

/**
 * Qué alojamiento se está mirando, y con cuántos alojamientos se cuenta.
 *
 * Con uno solo no es un menú sino una etiqueta: un desplegable de un elemento
 * promete una elección que no existe. Con dos o más se vuelve selector, que es
 * lo que hará falta cuando entren las casas.
 */
function PropertyPicker({
  properties,
  currentId,
  currentName,
}: {
  properties: { id: string; name: string }[];
  currentId: string;
  currentName: string;
}) {
  const { t } = useI18n();
  const [pending, startTransition] = React.useTransition();

  if (properties.length <= 1) {
    return <span className="truncate text-sm text-muted-foreground">{currentName}</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 min-w-0 gap-1.5 px-2 text-sm font-normal text-muted-foreground"
          disabled={pending}
        >
          <Building2 className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{currentName}</span>
          <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>{t.admin.nav.property}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {properties.map((property) => (
          <DropdownMenuItem
            key={property.id}
            onSelect={() => startTransition(() => selectProperty(property.id))}
            className="gap-2"
          >
            <Check
              className={cn("size-4 shrink-0", property.id === currentId ? "" : "opacity-0")}
              aria-hidden
            />
            <span className="truncate">{property.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function initialsFor(name: string): string {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0] ?? "?").slice(0, 2).toUpperCase();
}

export function AdminShell({
  children,
  session,
  properties,
  currentPropertyId,
  pendingRequests,
}: {
  children: React.ReactNode;
  session: SessionSummary;
  properties: { id: string; name: string }[];
  currentPropertyId: string;
  /** Solicitudes del sitio sin responder. Cero = no se muestra nada. */
  pendingRequests: number;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const role = mapMemberRole(session.role);
  const allowed = new Set(ROLE_ACCESS[role]);
  const displayName = session.user.fullName ?? session.user.email;

  async function handleLogout() {
    await fetch("/api/session", { method: "DELETE" });
    router.refresh();
  }

  return (
    <RoleContext.Provider value={role}>
      {/* `h-dvh` + `overflow-hidden` fija el shell a la altura del viewport: sin
          esto el documento entero scrollea (el sidebar se va con el contenido)
          en vez de que el scroll quede contenido en `<main>`. */}
      <div className="flex h-dvh overflow-hidden bg-background">
        <SidebarNav
          allowed={allowed}
          className="hidden w-60 shrink-0 overflow-y-auto lg:flex"
          pendingRequests={pendingRequests}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
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
                <SidebarNav allowed={allowed} className="flex w-full" pendingRequests={pendingRequests} />
              </SheetContent>
            </Sheet>

            <PropertyPicker
              properties={properties}
              currentId={currentPropertyId}
              currentName={session.propertyName}
            />

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
                        {initialsFor(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-left leading-tight sm:block">
                      <span className="block text-xs font-medium">{displayName}</span>
                      <span className="block text-[0.68rem] text-muted-foreground">
                        {t.admin.roles[role]}
                      </span>
                    </span>
                    <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {session.user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => void handleLogout()}
                    className="gap-2.5 text-destructive"
                  >
                    <LogOut className="size-4" aria-hidden />
                    {t.admin.login.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-y-auto pb-24">{children}</main>
        </div>
      </div>
    </RoleContext.Provider>
  );
}

function SidebarNav({
  allowed,
  className,
  pendingRequests,
}: {
  allowed: Set<string>;
  className?: string;
  pendingRequests: number;
}) {
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
            {/* El contador de solicitudes sin responder va en "Hoy": es la
                pantalla donde se atienden, y una solicitud tiene reloj —48 horas
                de retención— así que enterarse depende de entrar a mirar. */}
            {item.key === "today" && pendingRequests > 0 && (
              <span
                className="tnum ml-auto rounded-full bg-butter px-1.5 py-0.5 text-[0.68rem] font-medium text-[oklch(0.24_0.04_80)]"
                aria-label={t.admin.nav.pendingRequests(pendingRequests)}
              >
                {pendingRequests}
              </span>
            )}
          </LocaleLink>
        );
      })}

      {/* Acá vivía un aviso de "conectado en parte" que enumeraba qué pantallas
          seguían con datos de demostración. Ya no queda ninguna, y un cartel que
          dice que los datos son falsos cuando son reales es peor que no tener
          cartel: enseña a desconfiar de lo que la pantalla muestra. */}
    </nav>
  );
}
