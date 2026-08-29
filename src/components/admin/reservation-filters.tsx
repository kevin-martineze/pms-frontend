"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withLocale } from "@/lib/i18n/paths";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Filtros de la lista de reservas.
 *
 * Igual que en el sitio público, el estado vive en la URL. Aquí la razón es
 * distinta y más práctica: recepción va a querer mandarle a gerencia "mira estas
 * cuatro que deben plata", y eso es pegar un enlace, no explicar qué filtros
 * marcar.
 */
export function ReservationFilters({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const { t, locale } = useI18n();

  function set(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.replace(withLocale(locale, `/admin/reservations?${next.toString()}`), { scroll: false });
  }

  const q = params.get("q") ?? "";
  const active = params.get("status") || q;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          defaultValue={q}
          placeholder={t.admin.reservations.searchPlaceholder}
          className="pl-9"
          aria-label={t.admin.reservations.searchLabel}
          onChange={(event) => set("q", event.target.value || null)}
        />
      </div>

      <Select value={params.get("status") ?? "all"} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="w-[10.5rem]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.admin.reservations.allStatuses}</SelectItem>
          {Object.entries(t.admin.status).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Los filtros de pago y canal se quitaron con las columnas
          correspondientes: filtrar por un dato que el backend no guarda
          devolvería siempre cero resultados. */}

      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            router.replace(withLocale(locale, "/admin/reservations"), { scroll: false })
          }
        >
          <X className="size-3.5" aria-hidden />
          {t.common.clear}
        </Button>
      )}

      <span aria-live="polite" className="tnum ml-auto text-sm text-muted-foreground">
        {t.admin.reservations.count(total)}
      </span>
    </div>
  );
}
