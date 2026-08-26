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
import { CHANNEL_SHORT, PAYMENT_LABEL, STATUS_LABEL } from "@/components/admin/labels";

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

  function set(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/reservations?${next.toString()}`, { scroll: false });
  }

  const q = params.get("q") ?? "";
  const active =
    params.get("status") || params.get("payment") || params.get("channel") || q;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          defaultValue={q}
          placeholder="Nombre, referencia o habitación"
          className="pl-9"
          aria-label="Buscar reservas"
          onChange={(event) => set("q", event.target.value || null)}
        />
      </div>

      <Select value={params.get("status") ?? "all"} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="w-[10.5rem]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={params.get("payment") ?? "all"} onValueChange={(v) => set("payment", v)}>
        <SelectTrigger className="w-[10.5rem]">
          <SelectValue placeholder="Pago" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Cualquier pago</SelectItem>
          {Object.entries(PAYMENT_LABEL).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={params.get("channel") ?? "all"} onValueChange={(v) => set("channel", v)}>
        <SelectTrigger className="w-[10.5rem]">
          <SelectValue placeholder="Canal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los canales</SelectItem>
          {Object.entries(CHANNEL_SHORT).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => router.replace("/admin/reservations", { scroll: false })}
        >
          <X className="size-3.5" aria-hidden />
          Limpiar
        </Button>
      )}

      <span aria-live="polite" className="tnum ml-auto text-sm text-muted-foreground">
        {total} {total === 1 ? "reserva" : "reservas"}
      </span>
    </div>
  );
}
