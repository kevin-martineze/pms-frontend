"use client";

import * as React from "react";
import { toast } from "sonner";
import { CalendarRange, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { ApiRatePlan } from "@/lib/api/server";
import { formatDate, formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { createRatePlan, removeRatePlan, updateRatePlan } from "@/lib/rates/actions";
import { cn } from "@/lib/utils";

/**
 * Alta y edición de temporadas.
 *
 * Hasta ahora los planes se cargaban por API o por seed, lo que dejaba a Julius
 * dependiendo de mí para cambiar un precio. Un hotel cambia tarifas varias
 * veces al año, y algunas veces el mismo día en que decide una promoción.
 *
 * Los precios se escriben en la moneda que ve el huésped y se guardan en
 * centavos. La conversión pasa acá y en un solo lugar: es el borde entre lo que
 * una persona escribe y lo que la base almacena.
 */

type PlanWithType = ApiRatePlan & { unitTypeName: string };

type FormState = {
  unitTypeId: string;
  name: string;
  startDate: string;
  endDate: string;
  price: string;
  weekendPrice: string;
  minNights: string;
  closed: boolean;
};

const EMPTY: FormState = {
  unitTypeId: "",
  name: "",
  startDate: "",
  endDate: "",
  price: "",
  weekendPrice: "",
  minNights: "",
  closed: false,
};

/** De lo que se escribe a centavos. Cadena vacía = "no lo definas". */
function toMinor(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100);
}

function toForm(plan: PlanWithType): FormState {
  return {
    unitTypeId: plan.unitTypeId,
    name: plan.name,
    startDate: plan.startDate.slice(0, 10),
    endDate: plan.endDate.slice(0, 10),
    price: (plan.priceMinor / 100).toString(),
    weekendPrice:
      plan.weekendPriceMinor === null ? "" : (plan.weekendPriceMinor / 100).toString(),
    minNights: plan.minNights === null ? "" : plan.minNights.toString(),
    closed: plan.closed,
  };
}

/**
 * Recibe `currency` y `locale`, no funciones de formato.
 *
 * Un Server Component no puede pasarle una función a un Client Component: no
 * hay forma de serializarla, y el intento tira en render. Cruzan datos, y el
 * formato se arma de este lado.
 */
export function RatePlansEditor({
  unitTypes,
  plans,
  currency,
  locale,
}: {
  unitTypes: { id: string; name: string }[];
  plans: PlanWithType[];
  currency: string;
  locale: string;
}) {
  const { t } = useI18n();
  const money = React.useCallback(
    (amountMinor: number) => formatMoney({ amountMinor, currency }, locale),
    [currency, locale],
  );
  const formatDay = React.useCallback(
    (iso: string) => formatDate(iso, locale),
    [locale],
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PlanWithType | null>(null);
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, unitTypeId: unitTypes[0]?.id ?? "" });
    setError(null);
    setOpen(true);
  }

  function openEdit(plan: PlanWithType) {
    setEditing(plan);
    setForm(toForm(plan));
    setError(null);
    setOpen(true);
  }

  const priceMinor = toMinor(form.price);
  /* Un plan cerrado no vende ninguna noche, así que su precio da igual: exigirlo
     obligaría a inventar un número para bloquear unas fechas. */
  const priceOk = form.closed || priceMinor !== null;
  const datesOk = form.startDate !== "" && form.endDate !== "" && form.endDate >= form.startDate;
  const canSave = form.unitTypeId !== "" && form.name.trim() !== "" && datesOk && priceOk;

  function save() {
    if (!canSave) return;
    setError(null);

    const input = {
      name: form.name.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      priceMinor: priceMinor ?? 0,
      weekendPriceMinor: toMinor(form.weekendPrice),
      minNights: form.minNights.trim() === "" ? null : Number(form.minNights),
      closed: form.closed,
    };

    startTransition(async () => {
      const result = editing
        ? await updateRatePlan(editing.unitTypeId, editing.id, input)
        : await createRatePlan(form.unitTypeId, input);

      if (result.ok) {
        setOpen(false);
        toast.success(editing ? t.admin.rates.savedEdit : t.admin.rates.savedNew);
      } else {
        setError(result.error);
      }
    });
  }

  function remove(plan: PlanWithType) {
    startTransition(async () => {
      const result = await removeRatePlan(plan.unitTypeId, plan.id);
      if (result.ok) toast.success(t.admin.rates.deleted(plan.name));
      else toast.error(result.error);
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">{t.admin.rates.plansTitle}</h2>
          <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
            {t.admin.rates.plansLead}
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openNew} disabled={unitTypes.length === 0}>
          <Plus className="size-4" aria-hidden />
          {t.admin.rates.newPlan}
        </Button>
      </div>

      {plans.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t.admin.rates.noPlans}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(pending && "opacity-70")}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-sm font-medium">{plan.name}</CardTitle>
                    <p className="truncate text-xs text-muted-foreground">{plan.unitTypeName}</p>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openEdit(plan)}
                      disabled={pending}
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      <span className="sr-only">{t.admin.rates.edit}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-status-departing"
                      onClick={() => remove(plan)}
                      disabled={pending}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      <span className="sr-only">{t.admin.rates.delete}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {plan.closed ? (
                  <p className="text-lg font-medium text-status-departing">
                    {t.admin.rates.closedPlan}
                  </p>
                ) : (
                  <>
                    <p className="tnum text-2xl font-medium">{money(plan.priceMinor)}</p>
                    {plan.weekendPriceMinor !== null && (
                      <p className="tnum mt-0.5 text-xs text-muted-foreground">
                        {t.admin.rates.weekendRate(money(plan.weekendPriceMinor))}
                      </p>
                    )}
                  </>
                )}

                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarRange className="size-3.5 shrink-0" aria-hidden />
                  {t.admin.rates.planRange(
                    formatDay(plan.startDate.slice(0, 10)),
                    formatDay(plan.endDate.slice(0, 10)),
                  )}
                </p>

                {plan.minNights !== null && (
                  <Badge variant="secondary" className="mt-3 text-[0.68rem]">
                    {t.admin.rates.minNights(plan.minNights)}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? t.admin.rates.editTitle : t.admin.rates.newTitle}
            </DialogTitle>
            <DialogDescription>{t.admin.rates.dialogLead}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="plan-type">{t.admin.rates.fieldUnitType}</Label>
              <Select
                value={form.unitTypeId}
                onValueChange={(value) => setForm((f) => ({ ...f, unitTypeId: value }))}
                /* El tipo no se cambia al editar: mover un plan de tipo es
                   borrarlo y crear otro, y hacerlo con un desplegable esconde
                   que las reservas ya tomadas no se recalculan. */
                disabled={editing !== null}
              >
                <SelectTrigger id="plan-type">
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

            <div className="grid gap-1.5">
              <Label htmlFor="plan-name">{t.admin.rates.fieldName}</Label>
              <Input
                id="plan-name"
                value={form.name}
                placeholder={t.admin.rates.namePlaceholder}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="plan-start">{t.admin.rates.fieldStart}</Label>
                <Input
                  id="plan-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="plan-end">{t.admin.rates.fieldEnd}</Label>
                <Input
                  id="plan-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
                <p className="text-[0.7rem] text-muted-foreground">
                  {t.admin.rates.endInclusive}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="plan-price">{t.admin.rates.fieldPrice}</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  disabled={form.closed}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="plan-weekend">{t.admin.rates.fieldWeekend}</Label>
                <Input
                  id="plan-weekend"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.weekendPrice}
                  disabled={form.closed}
                  placeholder={t.admin.rates.sameAsWeekday}
                  onChange={(e) => setForm((f) => ({ ...f, weekendPrice: e.target.value }))}
                />
                <p className="text-[0.7rem] text-muted-foreground">
                  {t.admin.rates.weekendMeans}
                </p>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="plan-min">{t.admin.rates.fieldMinNights}</Label>
              <Input
                id="plan-min"
                type="number"
                min={1}
                step="1"
                value={form.minNights}
                placeholder={t.admin.rates.noMinimum}
                onChange={(e) => setForm((f) => ({ ...f, minNights: e.target.value }))}
              />
            </div>

            <label className="flex items-start gap-2.5 rounded-lg border border-border p-3">
              <Checkbox
                checked={form.closed}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, closed: checked === true }))
                }
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-medium">{t.admin.rates.fieldClosed}</span>
                <span className="block text-xs text-muted-foreground">
                  {t.admin.rates.closedHelp}
                </span>
              </span>
            </label>

            {!datesOk && form.startDate !== "" && form.endDate !== "" && (
              <p className="text-sm text-status-departing">{t.admin.rates.badRange}</p>
            )}
            {error && <p className="text-sm text-status-departing">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              {t.admin.rates.cancel}
            </Button>
            <Button onClick={save} disabled={!canSave || pending}>
              {pending ? t.admin.rates.saving : t.admin.rates.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
