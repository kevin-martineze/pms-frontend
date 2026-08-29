"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Clock, Sparkles, TriangleAlert, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/provider";
import type { HousekeepingBoard as Board, HousekeepingRoom } from "@/lib/api/server";
import { assignRoom, setRoomStatus } from "@/lib/housekeeping/actions";
import { cn } from "@/lib/utils";

/**
 * Tablero de camarería.
 *
 * Está pensado para un celular sostenido con una mano en el pasillo, no para el
 * escritorio de recepción: filas altas, un botón grande por tarjeta y ningún
 * menú anidado. Las salidas con llegada el mismo día van primero y marcadas,
 * porque son las únicas con una ventana real — cuatro horas entre el check-out
 * de las 11:00 y el check-in de las 15:00.
 *
 * Todo lo que se ve viene del servidor y todo lo que se toca vuelve al servidor.
 * No hay estado local de "ya la limpié": si la pantalla dijera que está limpia y
 * la base no, recepción entregaría una habitación sucia.
 */

const ORDER: HousekeepingRoom["state"][] = [
  "departing",
  "vacant-dirty",
  "arriving",
  "occupied",
  "vacant-clean",
  "blocked",
];

export function HousekeepingBoard({ board }: { board: Board }) {
  const { t } = useI18n();
  const [pending, startTransition] = React.useTransition();
  /* Qué habitación se está guardando: deshabilita sólo esa tarjeta en vez de
     congelar el tablero entero. */
  const [busyUnitId, setBusyUnitId] = React.useState<string | null>(null);

  const { summary, rooms, cleaners } = board;
  const progress = summary.total === 0 ? 100 : (summary.cleanedToday / summary.total) * 100;

  function run(unitId: string, action: () => Promise<{ ok: boolean; error?: string }>) {
    setBusyUnitId(unitId);
    startTransition(async () => {
      const result = await action();
      setBusyUnitId(null);
      if (!result.ok) toast.error(result.error ?? t.admin.housekeeping.failed);
    });
  }

  function markClean(room: HousekeepingRoom) {
    run(room.unitId, async () => {
      const result = await setRoomStatus(room.unitId, "CLEAN");
      if (result.ok) {
        toast.success(t.admin.housekeeping.cleanToast(room.label), {
          description: t.admin.housekeeping.cleanToastBody,
        });
      }
      return result;
    });
  }

  function markInspected(room: HousekeepingRoom) {
    run(room.unitId, async () => {
      const result = await setRoomStatus(room.unitId, "INSPECTED");
      if (result.ok) toast.success(t.admin.housekeeping.inspectedToast(room.label));
      return result;
    });
  }

  function markDirty(room: HousekeepingRoom) {
    run(room.unitId, async () => {
      const result = await setRoomStatus(room.unitId, "DIRTY");
      if (result.ok) toast(t.admin.housekeeping.dirtyToast(room.label));
      return result;
    });
  }

  function assign(room: HousekeepingRoom, cleanerId: string | null, name: string) {
    run(room.unitId, async () => {
      const result = await assignRoom(room.unitId, cleanerId);
      if (result.ok) toast(t.admin.housekeeping.assignToast(room.label, name));
      return result;
    });
  }

  const sorted = [...rooms].sort((a, b) => {
    const byState = ORDER.indexOf(a.state) - ORDER.indexOf(b.state);
    if (byState !== 0) return byState;
    if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
    return a.label.localeCompare(b.label, undefined, { numeric: true });
  });

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm font-medium">{t.admin.housekeeping.shift}</p>
          <p className="tnum text-sm text-muted-foreground">
            {t.admin.housekeeping.progress(summary.cleanedToday, summary.total)}
          </p>
        </div>
        <Progress value={progress} className="mt-3 h-2" />
        {summary.highPriority > 0 && (
          <p className="mt-3 flex items-center gap-2 text-sm text-status-departing">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {t.admin.housekeeping.highPriority(summary.highPriority)}
          </p>
        )}
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((room) => {
          const busy = pending && busyUnitId === room.unitId;
          const urgent = room.priority === "high" && room.needsCleaning;

          return (
            <li
              key={room.unitId}
              className={cn(
                "rounded-xl border bg-card p-4 transition-opacity",
                urgent ? "border-status-departing/40" : "border-border",
                busy && "opacity-55",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="tnum text-lg font-medium">
                    {t.common.room} {room.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {room.taskType
                      ? t.admin.hkType[room.taskType]
                      : room.unitTypeName}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    room.housekeepingStatus !== "DIRTY" && room.active
                      ? "border-status-vacant-clean/30 bg-status-vacant-clean/12 text-status-vacant-clean"
                      : "",
                  )}
                >
                  {t.admin.roomState[room.state]}
                </Badge>
              </div>

              {room.guestName && (
                <p className="mt-2 truncate text-xs text-muted-foreground">
                  {room.guestName}
                </p>
              )}

              {urgent && (
                <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-status-departing/10 px-2.5 py-1.5 text-xs text-status-departing">
                  <Clock className="size-3.5 shrink-0" aria-hidden />
                  {t.admin.housekeeping.window}
                </p>
              )}

              {room.note && (
                <p className="mt-3 rounded-lg bg-secondary/60 px-2.5 py-1.5 text-xs text-muted-foreground">
                  {room.note}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 px-2" disabled={busy}>
                      {room.housekeeper ? (
                        <>
                          <Avatar className="size-5">
                            <AvatarFallback className="bg-secondary text-[0.55rem]">
                              {room.housekeeper.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{room.housekeeper.name.split(" ")[0]}</span>
                        </>
                      ) : (
                        <>
                          <UserRound className="size-4 text-muted-foreground" aria-hidden />
                          <span className="text-xs text-muted-foreground">
                            {t.admin.housekeeping.unassigned}
                          </span>
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {cleaners.map((cleaner) => (
                      <DropdownMenuItem
                        key={cleaner.id}
                        onSelect={() => assign(room, cleaner.id, cleaner.name)}
                      >
                        {cleaner.name}
                      </DropdownMenuItem>
                    ))}
                    {room.housekeeper && (
                      <DropdownMenuItem
                        onSelect={() =>
                          assign(room, null, t.admin.housekeeping.unassigned)
                        }
                      >
                        {t.admin.housekeeping.unassign}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <RoomAction
                  room={room}
                  busy={busy}
                  onClean={() => markClean(room)}
                  onInspect={() => markInspected(room)}
                  onDirty={() => markDirty(room)}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/**
 * Una sola acción principal por tarjeta, la que corresponde al estado actual.
 * Ofrecer las tres a la vez obliga a leer y elegir con una mano ocupada.
 */
function RoomAction({
  room,
  busy,
  onClean,
  onInspect,
  onDirty,
}: {
  room: HousekeepingRoom;
  busy: boolean;
  onClean: () => void;
  onInspect: () => void;
  onDirty: () => void;
}) {
  const { t } = useI18n();

  if (!room.active) return null;

  if (room.housekeepingStatus === "DIRTY") {
    return (
      <Button size="sm" className="gap-1.5" onClick={onClean} disabled={busy}>
        <Sparkles className="size-3.5" aria-hidden />
        {t.admin.housekeeping.markClean}
      </Button>
    );
  }

  if (room.housekeepingStatus === "CLEAN") {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onDirty} disabled={busy}>
          {t.admin.housekeeping.markDirty}
        </Button>
        <Button variant="secondary" size="sm" onClick={onInspect} disabled={busy}>
          {t.admin.housekeeping.markInspected}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onDirty} disabled={busy}>
        {t.admin.housekeeping.markDirty}
      </Button>
      <span className="flex items-center gap-1.5 text-xs text-status-vacant-clean">
        <Check className="size-3.5" aria-hidden />
        {t.admin.housekeeping.ready}
      </span>
    </div>
  );
}
