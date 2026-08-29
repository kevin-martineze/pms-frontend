"use client";

import * as React from "react";
import { toast } from "sonner";
import { BedDouble, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createUnit,
  createUnitType,
  removeUnit,
  removeUnitType,
  updateUnit,
  updateUnitType,
} from "@/lib/settings/actions";
import { formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Inventario del alojamiento: tipos de habitación y habitaciones físicas.
 *
 * Sin esta pantalla, cargar el hotel de Julius requería que yo escribiera cada
 * habitación contra la API. Es la diferencia entre un sistema que le entregué y
 * un sistema que puede operar.
 *
 * Se mantiene la distinción del schema en la interfaz en vez de esconderla: el
 * **tipo** es lo que se vende y lo que fija el precio; la **habitación** es la
 * llave física que se le entrega al huésped. Fundirlas en una sola lista haría
 * imposible explicar por qué la tarifa se pone en un lado y el número de puerta
 * en el otro.
 */

type UnitType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  basePriceMinor: number;
  minNights: number;
};

type Unit = { id: string; label: string; unitTypeId: string; active: boolean };

/** "Suite con terraza" → "suite-con-terraza". El slug va en la URL pública. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function InventoryManager({
  unitTypes,
  units,
  currency,
  locale,
}: {
  unitTypes: UnitType[];
  units: Unit[];
  currency: string;
  locale: string;
}) {
  const { t } = useI18n();
  const s = t.admin.settings;
  const [pending, startTransition] = React.useTransition();
  const money = (minor: number) => formatMoney({ amountMinor: minor, currency }, locale);

  const [typeDialog, setTypeDialog] = React.useState<UnitType | "new" | null>(null);
  const [unitDialog, setUnitDialog] = React.useState<Unit | "new" | null>(null);

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) toast.success(success);
      else toast.error(result.error ?? s.failed);
    });
  }

  const unitsByType = new Map<string, Unit[]>();
  for (const unit of units) {
    unitsByType.set(unit.unitTypeId, [...(unitsByType.get(unit.unitTypeId) ?? []), unit]);
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">{s.inventoryTitle}</h2>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">{s.inventoryLead}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setTypeDialog("new")}>
          <Plus className="size-4" aria-hidden />
          {s.newType}
        </Button>
      </div>

      {unitTypes.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {s.noTypes}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {unitTypes.map((type) => {
            const rooms = unitsByType.get(type.id) ?? [];
            return (
              <div
                key={type.id}
                className={cn("rounded-xl border border-border bg-card", pending && "opacity-70")}
              >
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">{type.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.typeSummary(money(type.basePriceMinor), type.maxGuests, rooms.length)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={pending}
                      onClick={() => setTypeDialog(type)}
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      <span className="sr-only">{s.edit}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-status-departing"
                      disabled={pending}
                      onClick={() =>
                        run(() => removeUnitType(type.id), s.typeDeleted(type.name))
                      }
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      <span className="sr-only">{s.delete}</span>
                    </Button>
                  </div>
                </header>

                <div className="flex flex-wrap items-center gap-2 px-4 py-3">
                  {rooms.length === 0 && (
                    <span className="text-xs text-muted-foreground">{s.noRooms}</span>
                  )}
                  {rooms.map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      disabled={pending}
                      onClick={() => setUnitDialog(unit)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors",
                        unit.active
                          ? "border-border hover:bg-secondary"
                          : "border-dashed border-border text-muted-foreground",
                      )}
                    >
                      <BedDouble className="size-3.5" aria-hidden />
                      <span className="tnum">{unit.label}</span>
                      {!unit.active && (
                        <Badge variant="secondary" className="ml-1 text-[0.6rem]">
                          {s.outOfService}
                        </Badge>
                      )}
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 px-2 text-xs"
                    disabled={pending}
                    onClick={() => setUnitDialog("new")}
                  >
                    <Plus className="size-3.5" aria-hidden />
                    {s.addRoom}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <UnitTypeDialog
        value={typeDialog}
        onClose={() => setTypeDialog(null)}
        onSave={(input, editing) =>
          run(
            () => (editing ? updateUnitType(editing.id, input) : createUnitType(input)),
            editing ? s.typeSaved : s.typeCreated,
          )
        }
      />

      <UnitDialog
        value={unitDialog}
        unitTypes={unitTypes}
        onClose={() => setUnitDialog(null)}
        onSave={(input, editing) =>
          run(
            () => (editing ? updateUnit(editing.id, input) : createUnit(input)),
            editing ? s.roomSaved : s.roomCreated,
          )
        }
        onDelete={(unit) => run(() => removeUnit(unit.id), s.roomDeleted(unit.label))}
      />
    </section>
  );
}

function UnitTypeDialog({
  value,
  onClose,
  onSave,
}: {
  value: UnitType | "new" | null;
  onClose: () => void;
  onSave: (
    input: {
      name: string;
      slug: string;
      description: string | null;
      maxGuests: number;
      bedrooms: number;
      beds: number;
      basePriceMinor: number;
      minNights: number;
    },
    editing: UnitType | null,
  ) => void;
}) {
  const editing = value && value !== "new" ? value : null;

  return (
    <Dialog open={value !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {/* `key` remonta el formulario al cambiar de tipo, así el estado inicial
            ya nace correcto. Sincronizarlo con un efecto obliga a un render
            extra con los datos del anterior — el usuario ve por un instante los
            valores de la habitación que estaba editando antes. */}
        {value !== null && (
          <UnitTypeForm
            key={editing?.id ?? "new"}
            editing={editing}
            onClose={onClose}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function UnitTypeForm({
  editing,
  onClose,
  onSave,
}: {
  editing: UnitType | null;
  onClose: () => void;
  onSave: (
    input: {
      name: string;
      slug: string;
      description: string | null;
      maxGuests: number;
      bedrooms: number;
      beds: number;
      basePriceMinor: number;
      minNights: number;
    },
    editing: UnitType | null,
  ) => void;
}) {
  const { t } = useI18n();
  const s = t.admin.settings;

  const [form, setForm] = React.useState({
    name: editing?.name ?? "",
    description: editing?.description ?? "",
    maxGuests: String(editing?.maxGuests ?? 2),
    bedrooms: String(editing?.bedrooms ?? 1),
    beds: String(editing?.beds ?? 1),
    price: editing ? (editing.basePriceMinor / 100).toString() : "",
    minNights: String(editing?.minNights ?? 1),
  });

  const price = Number(form.price);
  const valid =
    form.name.trim() !== "" && Number.isFinite(price) && price >= 0 && form.price !== "";

  return (
    <>
        <DialogHeader>
          <DialogTitle>{editing ? s.editTypeTitle : s.newTypeTitle}</DialogTitle>
          <DialogDescription>{s.typeLead}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="type-name">{s.typeName}</Label>
            <Input
              id="type-name"
              value={form.name}
              placeholder={s.typeNamePlaceholder}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="type-desc">{s.typeDescription}</Label>
            <Textarea
              id="type-desc"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field id="type-price" label={s.basePrice} value={form.price} step="0.01"
              onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
            <Field id="type-guests" label={s.maxGuests} value={form.maxGuests} min={1}
              onChange={(v) => setForm((f) => ({ ...f, maxGuests: v }))} />
            <Field id="type-beds" label={s.beds} value={form.beds} min={0}
              onChange={(v) => setForm((f) => ({ ...f, beds: v }))} />
            <Field id="type-min" label={s.minNights} value={form.minNights} min={1}
              onChange={(v) => setForm((f) => ({ ...f, minNights: v }))} />
          </div>

          <p className="text-xs text-muted-foreground">{s.priceNote}</p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {s.cancel}
          </Button>
          <Button
            disabled={!valid}
            onClick={() => {
              onSave(
                {
                  name: form.name.trim(),
                  slug: slugify(form.name),
                  description: form.description.trim() || null,
                  maxGuests: Number(form.maxGuests) || 1,
                  bedrooms: Number(form.bedrooms) || 0,
                  beds: Number(form.beds) || 1,
                  basePriceMinor: Math.round(price * 100),
                  minNights: Number(form.minNights) || 1,
                },
                editing,
              );
              onClose();
            }}
          >
            {s.save}
          </Button>
        </DialogFooter>
    </>
  );
}

function UnitDialog({
  value,
  unitTypes,
  onClose,
  onSave,
  onDelete,
}: {
  value: Unit | "new" | null;
  unitTypes: UnitType[];
  onClose: () => void;
  onSave: (
    input: { label: string; unitTypeId: string; active: boolean },
    editing: Unit | null,
  ) => void;
  onDelete: (unit: Unit) => void;
}) {
  const editing = value && value !== "new" ? value : null;

  return (
    <Dialog open={value !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {value !== null && (
          <UnitForm
            key={editing?.id ?? "new"}
            editing={editing}
            unitTypes={unitTypes}
            onClose={onClose}
            onSave={onSave}
            onDelete={onDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function UnitForm({
  editing,
  unitTypes,
  onClose,
  onSave,
  onDelete,
}: {
  editing: Unit | null;
  unitTypes: UnitType[];
  onClose: () => void;
  onSave: (
    input: { label: string; unitTypeId: string; active: boolean },
    editing: Unit | null,
  ) => void;
  onDelete: (unit: Unit) => void;
}) {
  const { t } = useI18n();
  const s = t.admin.settings;

  const [form, setForm] = React.useState({
    label: editing?.label ?? "",
    unitTypeId: editing?.unitTypeId ?? unitTypes[0]?.id ?? "",
    active: editing?.active ?? true,
  });

  return (
    <>
        <DialogHeader>
          <DialogTitle>{editing ? s.editRoomTitle : s.newRoomTitle}</DialogTitle>
          <DialogDescription>{s.roomLead}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="unit-label">{s.roomLabel}</Label>
            <Input
              id="unit-label"
              value={form.label}
              placeholder="101"
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="unit-type">{s.roomType}</Label>
            <Select
              value={form.unitTypeId}
              onValueChange={(v) => setForm((f) => ({ ...f, unitTypeId: v }))}
            >
              <SelectTrigger id="unit-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-start gap-2.5 rounded-lg border border-border p-3">
            <Checkbox
              checked={!form.active}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, active: checked !== true }))
              }
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium">{s.markOutOfService}</span>
              <span className="block text-xs text-muted-foreground">{s.outOfServiceHelp}</span>
            </span>
          </label>
        </div>

        <DialogFooter className="sm:justify-between">
          {editing ? (
            <Button
              variant="ghost"
              className="text-status-departing hover:text-status-departing"
              onClick={() => {
                onDelete(editing);
                onClose();
              }}
            >
              {s.delete}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              {s.cancel}
            </Button>
            <Button
              disabled={form.label.trim() === "" || form.unitTypeId === ""}
              onClick={() => {
                onSave(
                  {
                    label: form.label.trim(),
                    unitTypeId: form.unitTypeId,
                    active: form.active,
                  },
                  editing,
                );
                onClose();
              }}
            >
              {s.save}
            </Button>
          </div>
        </DialogFooter>
    </>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  min = 0,
  step = "1",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
