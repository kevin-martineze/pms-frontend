"use client";

import * as React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateShort, formatWeekday } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Los dos gráficos del panel.
 *
 * Ambos son de una sola serie y de un solo tono a propósito. Un gráfico de
 * ocupación con seis colores obliga a leer una leyenda para entender una cosa
 * que se entiende sola: qué días están llenos. El color aquí codifica una
 * excepción — hoy, o el canal propio — y nada más.
 */

// ---------------------------------------------------------------------------
// Ocupación por día
// ---------------------------------------------------------------------------

export type OccupancyPoint = {
  date: string;
  occupancy: number;
  sold: number;
  total: number;
};

export function OccupancyStrip({ data, today }: { data: OccupancyPoint[]; today: string }) {
  const { t, intlTag } = useI18n();
  const peak = Math.max(...data.map((d) => d.occupancy), 0.01);

  return (
    <figure>
      <div className="flex h-36 items-end gap-[3px]" role="img" aria-label={t.admin.dashboard.occupancyAria}>
        {data.map((point) => {
          const isToday = point.date === today;
          /* La altura se escala al pico, no al 100%: con ocupación real del
             40-70% un eje fijo al 100% deja todas las barras achatadas y la
             tendencia deja de leerse. El porcentaje exacto va en el tooltip. */
          const height = Math.max(4, (point.occupancy / peak) * 100);

          return (
            <Tooltip key={point.date}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="group relative flex h-full flex-1 items-end"
                  aria-label={`${formatDateShort(point.date, intlTag)} — ${Math.round(point.occupancy * 100)}%`}
                >
                  <span
                    style={{ height: `${height}%` }}
                    className={cn(
                      "w-full rounded-t transition-opacity",
                      isToday ? "bg-butter" : "bg-palm/75 group-hover:bg-palm",
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">
                  {formatWeekday(point.date, intlTag)} {formatDateShort(point.date, intlTag)}
                </p>
                <p className="tnum">
                  {t.admin.dashboard.occupancyHint(point.sold, point.total)} ·{" "}
                  {Math.round(point.occupancy * 100)}%
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[0.68rem] text-muted-foreground">
        <span>{formatDateShort(data[0].date, intlTag)}</span>
        <span className="text-foreground">{t.common.today}</span>
        <span>{formatDateShort(data[data.length - 1].date, intlTag)}</span>
      </div>

      {/* Vista de tabla: el color no es el único portador del dato. */}
      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
          {t.admin.dashboard.asTable}
        </summary>
        <table className="mt-2 w-full text-xs">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th scope="col" className="py-1 font-normal">{t.admin.dashboard.tableDay}</th>
              <th scope="col" className="py-1 text-right font-normal">{t.admin.dashboard.tableSold}</th>
              <th scope="col" className="py-1 text-right font-normal">{t.admin.dashboard.tableOccupancy}</th>
            </tr>
          </thead>
          <tbody className="tnum">
            {data.map((point) => (
              <tr key={point.date} className="border-t border-border/60">
                <td className="py-1">{formatDateShort(point.date, intlTag)}</td>
                <td className="py-1 text-right">
                  {point.sold}/{point.total}
                </td>
                <td className="py-1 text-right">{Math.round(point.occupancy * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Mix de canales
// ---------------------------------------------------------------------------

export type ChannelRow = {
  channel: string;
  label: string;
  nights: number;
  revenue: number;
  isDirect: boolean;
};

export function ChannelMix({ rows }: { rows: ChannelRow[] }) {
  const { t } = useI18n();
  const total = rows.reduce((acc, row) => acc + row.revenue, 0) || 1;
  const peak = Math.max(...rows.map((r) => r.revenue), 1);

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const share = row.revenue / total;
        return (
          <li key={row.channel}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className={cn(row.isDirect && "font-medium")}>
                {row.label}
                {row.isDirect && (
                  <span className="ml-2 rounded-full bg-butter/25 px-2 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
                    {t.admin.dashboard.noCommission}
                  </span>
                )}
              </span>
              <span className="tnum shrink-0 text-muted-foreground">
                {Math.round(share * 100)}% · ${Math.round(row.revenue).toLocaleString("es-PA")}
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                style={{ width: `${(row.revenue / peak) * 100}%` }}
                className={cn("h-full rounded-full", row.isDirect ? "bg-butter" : "bg-palm/60")}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
