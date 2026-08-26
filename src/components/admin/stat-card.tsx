import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Ficha de indicador.
 *
 * El número va grande y la etiqueta chica, no al revés: quien mira esto a las
 * siete de la mañana está buscando el número, y la etiqueta sólo confirma qué
 * número es. El delta lleva signo y palabra ("vs. semana pasada") porque un
 * "+12%" sin referencia no dice nada.
 */
export function StatCard({
  label,
  value,
  hint,
  delta,
  tone = "neutral",
  icon,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  tone?: "neutral" | "positive" | "warning";
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>

      <p
        className={cn(
          "tnum mt-2.5 text-2xl font-medium",
          tone === "positive" && "text-status-vacant-clean",
          tone === "warning" && "text-status-departing",
        )}
      >
        {value}
      </p>

      {(hint || delta) && (
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "tnum font-medium",
                delta.direction === "up" && "text-status-vacant-clean",
                delta.direction === "down" && "text-status-departing",
              )}
            >
              {delta.direction === "up" ? "▲" : delta.direction === "down" ? "▼" : "—"} {delta.value}
            </span>
          )}
          {hint}
        </p>
      )}
    </div>
  );
}
