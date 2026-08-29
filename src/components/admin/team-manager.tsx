"use client";

import * as React from "react";
import { toast } from "sonner";
import { Copy, KeyRound, Lock, Plus, UserMinus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Member } from "@/lib/api/server";
import {
  changeMemberRole,
  createMember,
  removeMember,
  resetPassword,
} from "@/lib/settings/actions";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * El equipo del hotel.
 *
 * Sin esta pantalla, las únicas cuentas del sistema eran las tres del seed:
 * entrenar al personal el 1 de octubre habría significado que yo creara cada
 * usuario a mano.
 *
 * La contraseña temporal se muestra **una sola vez** y con un botón de copiar,
 * porque el modo real de entregarla es leérsela a alguien o mandarla por
 * WhatsApp. No se puede volver a consultar: si se pierde, se genera otra. Eso
 * es a propósito — una contraseña que el sistema puede mostrar cuando quiera es
 * una contraseña que el sistema guarda en claro.
 */

const ROLES: Member["role"][] = ["OWNER", "MANAGER", "FRONT_DESK", "HOUSEKEEPING"];

export function TeamManager({
  members,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  const { t } = useI18n();
  const s = t.admin.settings;
  const [pending, startTransition] = React.useTransition();
  const [inviting, setInviting] = React.useState(false);
  const [credentials, setCredentials] = React.useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) toast.success(success);
      else toast.error(result.error ?? s.failed);
    });
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">{s.teamTitle}</h2>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">{s.teamLead}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setInviting(true)}>
          <Plus className="size-4" aria-hidden />
          {s.addMember}
        </Button>
      </div>

      <ul className={cn("mt-4 divide-y divide-border rounded-xl border border-border bg-card", pending && "opacity-70")}>
        {members.map((member) => {
          const isMe = member.userId === currentUserId;
          const locked = member.lockedUntil && new Date(member.lockedUntil) > new Date();
          return (
            <li key={member.userId} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-secondary text-xs">
                  {member.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  {member.name}
                  {isMe && (
                    <Badge variant="secondary" className="text-[0.6rem]">
                      {s.you}
                    </Badge>
                  )}
                  {locked && (
                    <Badge variant="outline" className="gap-1 text-[0.6rem] text-status-departing">
                      <Lock className="size-2.5" aria-hidden />
                      {s.locked}
                    </Badge>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>

              <Select
                value={member.role}
                disabled={pending || isMe}
                onValueChange={(role) =>
                  run(
                    () => changeMemberRole(member.userId, role as Member["role"]),
                    s.roleChanged(member.name),
                  )
                }
              >
                <SelectTrigger className="w-40 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {s.roles[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={pending}
                  title={s.resetPassword}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await resetPassword(member.userId);
                      if (result.ok) {
                        setCredentials({
                          name: member.name,
                          email: member.email,
                          password: result.data.temporaryPassword,
                        });
                      } else toast.error(result.error);
                    })
                  }
                >
                  <KeyRound className="size-3.5" aria-hidden />
                  <span className="sr-only">{s.resetPassword}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-status-departing"
                  disabled={pending || isMe}
                  title={s.removeMember}
                  onClick={() =>
                    run(() => removeMember(member.userId), s.memberRemoved(member.name))
                  }
                >
                  <UserMinus className="size-3.5" aria-hidden />
                  <span className="sr-only">{s.removeMember}</span>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <InviteDialog
        open={inviting}
        onClose={() => setInviting(false)}
        onCreated={(result) => {
          setInviting(false);
          if (result.temporaryPassword) {
            setCredentials({
              name: result.name,
              email: result.email,
              password: result.temporaryPassword,
            });
          } else {
            toast.success(s.memberAddedExisting(result.name));
          }
        }}
      />

      <CredentialsDialog
        credentials={credentials}
        onClose={() => setCredentials(null)}
      />
    </section>
  );
}

function InviteDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (result: {
    name: string;
    email: string;
    temporaryPassword: string | null;
  }) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        {/* Se remonta al abrir en vez de limpiarse con un efecto: así el
            formulario nace vacío y no hay un render intermedio con lo que se
            escribió la vez anterior. */}
        {open && <InviteForm onClose={onClose} onCreated={onCreated} />}
      </DialogContent>
    </Dialog>
  );
}

function InviteForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (result: {
    name: string;
    email: string;
    temporaryPassword: string | null;
  }) => void;
}) {
  const { t } = useI18n();
  const s = t.admin.settings;
  const [form, setForm] = React.useState({ name: "", email: "", role: "FRONT_DESK" });
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const valid = form.name.trim() !== "" && form.email.includes("@");

  return (
    <>
        <DialogHeader>
          <DialogTitle>{s.addMemberTitle}</DialogTitle>
          <DialogDescription>{s.addMemberLead}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="member-name">{s.memberName}</Label>
            <Input
              id="member-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="member-email">{s.memberEmail}</Label>
            <Input
              id="member-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="member-role">{s.memberRole}</Label>
            <Select
              value={form.role}
              onValueChange={(role) => setForm((f) => ({ ...f, role }))}
            >
              <SelectTrigger id="member-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {s.roles[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-status-departing">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            {s.cancel}
          </Button>
          <Button
            disabled={!valid || pending}
            onClick={() =>
              startTransition(async () => {
                const result = await createMember({
                  fullName: form.name.trim(),
                  email: form.email.trim(),
                  role: form.role as Member["role"],
                });
                if (result.ok) onCreated(result.data);
                else setError(result.error);
              })
            }
          >
            {pending ? s.saving : s.create}
          </Button>
        </DialogFooter>
    </>
  );
}

/**
 * La contraseña temporal, una sola vez.
 *
 * Con botón de copiar porque el paso siguiente es mandarla por WhatsApp, y una
 * contraseña transcrita a mano se transcribe mal.
 */
function CredentialsDialog({
  credentials,
  onClose,
}: {
  credentials: { name: string; email: string; password: string } | null;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const s = t.admin.settings;

  return (
    <Dialog open={credentials !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {credentials && (
          <>
            <DialogHeader>
              <DialogTitle>{s.credentialsTitle(credentials.name)}</DialogTitle>
              <DialogDescription>{s.credentialsLead}</DialogDescription>
            </DialogHeader>

            <dl className="space-y-3 rounded-xl border border-border bg-secondary/50 p-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">{s.memberEmail}</dt>
                <dd className="mt-0.5 font-mono">{credentials.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{s.temporaryPassword}</dt>
                <dd className="mt-0.5 font-mono text-lg tracking-wide">
                  {credentials.password}
                </dd>
              </div>
            </dl>

            <p className="text-xs text-muted-foreground">{s.credentialsWarning}</p>

            <DialogFooter>
              <Button
                variant="secondary"
                className="gap-1.5"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(`${credentials.email} · ${credentials.password}`)
                    .then(() => toast.success(s.copied))
                    .catch(() => toast.error(s.copyFailed));
                }}
              >
                <Copy className="size-3.5" aria-hidden />
                {s.copy}
              </Button>
              <Button onClick={onClose}>{s.done}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
