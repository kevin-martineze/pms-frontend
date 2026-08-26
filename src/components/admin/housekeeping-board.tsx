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
import type { HousekeepingTask, StaffMember } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Tablero de camarería.
 *
 * Está pensado para un celular sostenido con una mano en el pasillo, no para el
 * escritorio de recepción: filas altas, un botón grande por tarjeta y ningún
 * menú anidado. Las salidas con llegada el mismo día van primero y marcadas,
 * porque son las únicas con una ventana real — cuatro horas entre el check-out
 * de las 11:00 y el check-in de las 15:00.
 */

const ORDER: HousekeepingTask["state"][] = [
  "departing",
  "vacant-dirty",
  "arriving",
  "occupied",
  "vacant-clean",
  "blocked",
];

export function HousekeepingBoard({
  tasks,
  cleaners,
}: {
  tasks: HousekeepingTask[];
  cleaners: StaffMember[];
}) {
  const { t } = useI18n();
  const [done, setDone] = React.useState<Set<string>>(new Set());
  const [assignments, setAssignments] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(tasks.filter((task) => task.assignedTo).map((task) => [task.room, task.assignedTo!])),
  );

  const pending = tasks.filter(
    (task) => (task.state === "departing" || task.state === "vacant-dirty") && !done.has(task.room),
  );
  const totalToClean = tasks.filter(
    (task) => task.state === "departing" || task.state === "vacant-dirty",
  ).length;
  const progress = totalToClean === 0 ? 100 : ((totalToClean - pending.length) / totalToClean) * 100;
  const highPriority = pending.filter((task) => task.priority === "high").length;

  function markClean(task: HousekeepingTask) {
    setDone((prev) => new Set(prev).add(task.room));
    toast.success(t.admin.housekeeping.cleanToast(task.room), {
      description: t.admin.housekeeping.cleanToastBody,
    });
  }

  function assign(room: string, name: string) {
    setAssignments((prev) => ({ ...prev, [room]: name }));
    toast(t.admin.housekeeping.assignToast(room, name));
  }

  const sorted = [...tasks].sort((a, b) => {
    const byState = ORDER.indexOf(a.state) - ORDER.indexOf(b.state);
    if (byState !== 0) return byState;
    if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
    return a.room.localeCompare(b.room);
  });

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm font-medium">{t.admin.housekeeping.shift}</p>
          <p className="tnum text-sm text-muted-foreground">
            {t.admin.housekeeping.progress(totalToClean - pending.length, totalToClean)}
          </p>
        </div>
        <Progress value={progress} className="mt-3 h-2" />
        {highPriority > 0 && (
          <p className="mt-3 flex items-center gap-2 text-sm text-status-departing">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {t.admin.housekeeping.highPriority(highPriority)}
          </p>
        )}
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((task) => {
          const isDone = done.has(task.room);
          const needsCleaning = task.state === "departing" || task.state === "vacant-dirty";
          const assignee = assignments[task.room];

          return (
            <li
              key={task.room}
              className={cn(
                "rounded-xl border bg-card p-4 transition-opacity",
                task.priority === "high" && needsCleaning && !isDone
                  ? "border-status-departing/40"
                  : "border-border",
                isDone && "opacity-55",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="tnum text-lg font-medium">
                    {t.common.room} {task.room}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.admin.hkType[task.type]}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    isDone
                      ? "border-status-vacant-clean/30 bg-status-vacant-clean/12 text-status-vacant-clean"
                      : "",
                  )}
                >
                  {isDone ? t.admin.housekeeping.clean : t.admin.roomState[task.state]}
                </Badge>
              </div>

              {task.priority === "high" && needsCleaning && !isDone && (
                <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-status-departing/10 px-2.5 py-1.5 text-xs text-status-departing">
                  <Clock className="size-3.5 shrink-0" aria-hidden />
                  {t.admin.housekeeping.window}
                </p>
              )}

              {task.note === "maintenance-ac" && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {t.admin.housekeeping.maintenanceNote}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
                      {assignee ? (
                        <>
                          <Avatar className="size-5">
                            <AvatarFallback className="bg-secondary text-[0.55rem]">
                              {assignee
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{assignee.split(" ")[0]}</span>
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
                        onSelect={() => assign(task.room, cleaner.name)}
                      >
                        {cleaner.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {needsCleaning && !isDone ? (
                  <Button size="sm" className="gap-1.5" onClick={() => markClean(task)}>
                    <Sparkles className="size-3.5" aria-hidden />
                    {t.admin.housekeeping.markClean}
                  </Button>
                ) : isDone ? (
                  <span className="flex items-center gap-1.5 text-xs text-status-vacant-clean">
                    <Check className="size-3.5" aria-hidden />
                    {t.admin.housekeeping.ready}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
