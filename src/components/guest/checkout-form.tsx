"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  Check,
  CircleCheck,
  CreditCard,
  Landmark,
  Lock,
  MessageCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatDate, formatMoney, pluralNights } from "@/lib/format";
import type { Quote } from "@/lib/domain/types";

/**
 * Checkout.
 *
 * Dos decisiones que vale la pena defender frente al cliente:
 *
 * 1. **Una sola pantalla, no un asistente de cuatro pasos.** Cada paso de un
 *    asistente es una oportunidad de abandonar, y aquí no hay tantos datos como
 *    para justificarlos. El resumen queda visible todo el tiempo.
 * 2. **El método de pago se elige, no se asume.** Panamá no está entre los
 *    países soportados por Stripe, así que la pasarela real depende de qué banco
 *    use Julius. La interfaz ya contempla las tres formas que va a necesitar;
 *    cuál queda activa es una decisión suya, no un rediseño.
 */

const PAYMENT_METHODS = [
  {
    id: "card",
    icon: CreditCard,
    label: "Tarjeta",
    hint: "Visa, Mastercard, Clave",
  },
  {
    id: "transfer",
    icon: Landmark,
    label: "Transferencia / Yappy",
    hint: "Confirmación en minutos",
  },
  {
    id: "arrival",
    icon: Banknote,
    label: "Pagar al llegar",
    hint: "Se retiene la habitación 24 h",
  },
];

type Props = {
  unitName: string;
  unitPhoto: { src: string; alt: string };
  quote: Quote;
  adults: number;
  kids: number;
  reference: string;
};

export function CheckoutForm({
  unitName,
  unitPhoto,
  quote,
  adults,
  kids,
  reference,
}: Props) {
  const [method, setMethod] = React.useState("card");
  const [done, setDone] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    /* En la maqueta la confirmación es inmediata. En producción esto es una
       server action que reserva el inventario antes de cobrar: cobrar primero y
       descubrir después que la habitación se vendió es el peor orden posible. */
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  }

  if (done) {
    return <Confirmation reference={reference} quote={quote} unitName={unitName} />;
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_23rem] lg:gap-14">
      <form onSubmit={submit} className="min-w-0">
        <h2 className="display-sm text-xl">Quién viaja</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label="Nombre" autoComplete="given-name" required />
          <Field id="lastName" label="Apellido" autoComplete="family-name" required />
          <Field id="email" label="Correo" type="email" autoComplete="email" required />
          <Field id="phone" label="Teléfono / WhatsApp" type="tel" autoComplete="tel" required />
        </div>

        <div className="mt-4 grid gap-2">
          <Label htmlFor="notes">Algo que debamos saber (opcional)</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Llegamos tarde, viajamos con un bebé, preferimos planta baja…"
          />
          <p className="text-xs text-muted-foreground">
            Esto llega directo a recepción y queda pegado a tu reserva en el sistema.
          </p>
        </div>

        <Separator className="my-8" />

        <h2 className="display-sm text-xl">Cómo pagas</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Se cobra {formatMoney(quote.dueNow)} ahora — el 30%. El resto al llegar.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((option) => {
            const Icon = option.icon;
            const active = method === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-secondary",
                )}
              >
                <span className="flex items-center justify-between">
                  <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
                  {active && <Check className="size-4 text-primary" aria-hidden />}
                </span>
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.hint}</span>
              </button>
            );
          })}
        </div>

        {method === "card" && (
          <div className="mt-5 grid gap-4 rounded-xl border border-border p-5">
            <Field id="card" label="Número de tarjeta" placeholder="0000 0000 0000 0000" inputMode="numeric" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="expiry" label="Vencimiento" placeholder="MM / AA" inputMode="numeric" />
              <Field id="cvc" label="CVC" placeholder="123" inputMode="numeric" />
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden />
              Maqueta: no se procesa ningún pago ni se guarda ningún dato.
            </p>
          </div>
        )}

        {method === "transfer" && (
          <p className="mt-5 rounded-xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
            Al confirmar te mandamos los datos de la cuenta y el número de Yappy por correo y
            WhatsApp. La habitación queda apartada 24 horas mientras llega el comprobante.
          </p>
        )}

        {method === "arrival" && (
          <p className="mt-5 rounded-xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
            Apartamos la habitación sin cobro previo. Si no confirmas por WhatsApp 24 horas antes
            de la llegada, vuelve a quedar disponible.
          </p>
        )}

        <Button type="submit" size="lg" className="mt-8 w-full" disabled={submitting}>
          {submitting ? "Confirmando…" : `Confirmar y pagar ${formatMoney(quote.dueNow)}`}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Al confirmar aceptas las políticas de la propiedad. Cancelación gratis hasta 48 h antes.
        </p>
      </form>

      <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
        <div className="flex gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image src={unitPhoto.src} alt={unitPhoto.alt} fill sizes="5rem" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="display-sm text-base">{unitName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(quote.range.checkIn)} → {formatDate(quote.range.checkOut)}
            </p>
            <p className="text-sm text-muted-foreground">
              {pluralNights(quote.nights)} · {adults + kids}{" "}
              {adults + kids === 1 ? "huésped" : "huéspedes"}
            </p>
          </div>
        </div>

        <Separator className="my-5" />

        <dl className="space-y-2.5 text-sm">
          {quote.lines.map((line) => (
            <div key={line.label} className="flex items-start justify-between gap-4">
              <dt className={cn("text-muted-foreground", line.kind === "discount" && "text-status-vacant-clean")}>
                {line.label}
              </dt>
              <dd className={cn("tnum shrink-0", line.kind === "discount" && "text-status-vacant-clean")}>
                {formatMoney(line.amount)}
              </dd>
            </div>
          ))}
        </dl>

        <Separator className="my-4" />

        <div className="flex items-baseline justify-between gap-4">
          <span className="font-medium">Total</span>
          <span className="tnum text-xl font-medium">{formatMoney(quote.total)}</span>
        </div>

        <div className="mt-4 space-y-1.5 rounded-xl bg-secondary/70 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span>Pagas ahora</span>
            <span className="tnum font-medium">{formatMoney(quote.dueNow)}</span>
          </div>
          <div className="flex justify-between gap-4 text-muted-foreground">
            <span>Al llegar</span>
            <span className="tnum">
              {formatMoney({
                amountMinor: quote.total.amountMinor - quote.dueNow.amountMinor,
                currency: quote.total.currency,
              })}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}

function Confirmation({
  reference,
  quote,
  unitName,
}: {
  reference: string;
  quote: Quote;
  unitName: string;
}) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-status-vacant-clean/15">
        <CircleCheck className="size-8 text-status-vacant-clean" aria-hidden />
      </span>

      <h2 className="display-sm mt-6 text-2xl">Listo, tu reserva está confirmada</h2>
      <p className="mt-3 text-muted-foreground">
        Te mandamos la confirmación por correo y por WhatsApp. Si necesitas cambiar algo,
        respondes ese mismo mensaje.
      </p>

      <Badge variant="secondary" className="mt-6 rounded-full px-4 py-1.5 font-mono text-sm">
        {reference}
      </Badge>

      <dl className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-6 text-left text-sm">
        <Row term="Unidad" detail={unitName} />
        <Row term="Entrada" detail={`${formatDate(quote.range.checkIn)} · desde las 15:00`} />
        <Row term="Salida" detail={`${formatDate(quote.range.checkOut)} · hasta las 11:00`} />
        <Row term="Pagado" detail={formatMoney(quote.dueNow)} />
        <Row
          term="Pendiente al llegar"
          detail={formatMoney({
            amountMinor: quote.total.amountMinor - quote.dueNow.amountMinor,
            currency: quote.total.currency,
          })}
        />
      </dl>

      {/* El puente hacia el PMS. Es el punto de la demo: esta reserva aparece en
          el calendario del sistema en el mismo instante. */}
      <div className="mt-8 rounded-2xl border border-dashed border-butter bg-butter/10 p-6 text-left">
        <p className="text-sm font-medium">En el sistema de gestión, mientras tanto…</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta reserva ya bloqueó la habitación en el calendario, entró a la lista de llegadas del
          día y le avisó a camarería. Nadie tuvo que anotarla en ningún lado.
        </p>
        <Button asChild variant="outline" className="mt-4 gap-2">
          <Link href="/admin/calendar">Ver el calendario del hotel</Link>
        </Button>
      </div>

      <Button asChild variant="ghost" className="mt-6 gap-2">
        <a href="https://wa.me/50700000000">
          <MessageCircle className="size-4" aria-hidden />
          Escribirnos por WhatsApp
        </a>
      </Button>
    </div>
  );
}

function Row({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="text-right">{detail}</dd>
    </div>
  );
}
