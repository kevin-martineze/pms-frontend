"use client";

import * as React from "react";
import Image from "next/image";
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
import { LocaleLink } from "@/components/locale-link";
import { cn } from "@/lib/utils";
import { formatDate, formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
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
 *    use el cliente. La interfaz ya contempla las tres formas que va a
 *    necesitar; cuál queda activa es una decisión suya, no un rediseño.
 */

type Props = {
  unitName: string;
  unitPhoto: { src: string; alt: string };
  quote: Quote;
  adults: number;
  kids: number;
  reference: string;
};

export function CheckoutForm({ unitName, unitPhoto, quote, adults, kids, reference }: Props) {
  const { t, intlTag } = useI18n();
  const [method, setMethod] = React.useState("card");
  const [done, setDone] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const methods = [
    { id: "card", icon: CreditCard, ...t.checkout.methods.card },
    { id: "transfer", icon: Landmark, ...t.checkout.methods.transfer },
    { id: "arrival", icon: Banknote, ...t.checkout.methods.arrival },
  ];

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
        <h2 className="display-sm text-xl">{t.checkout.whoTravels}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label={t.checkout.firstName} autoComplete="given-name" required />
          <Field id="lastName" label={t.checkout.lastName} autoComplete="family-name" required />
          <Field id="email" label={t.checkout.email} type="email" autoComplete="email" required />
          <Field id="phone" label={t.checkout.phone} type="tel" autoComplete="tel" required />
        </div>

        <div className="mt-4 grid gap-2">
          <Label htmlFor="notes">{t.checkout.notes}</Label>
          <Textarea id="notes" rows={3} placeholder={t.checkout.notesPlaceholder} />
          <p className="text-xs text-muted-foreground">{t.checkout.notesHint}</p>
        </div>

        <Separator className="my-8" />

        <h2 className="display-sm text-xl">{t.checkout.howYouPay}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.checkout.payHint(formatMoney(quote.dueNow, intlTag))}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {methods.map((option) => {
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
                  <Icon
                    className={cn("size-5", active ? "text-primary" : "text-muted-foreground")}
                    aria-hidden
                  />
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
            <Field
              id="card"
              label={t.checkout.cardNumber}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="expiry" label={t.checkout.expiry} placeholder="MM / YY" inputMode="numeric" />
              <Field id="cvc" label={t.checkout.cvc} placeholder="123" inputMode="numeric" />
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden />
              {t.checkout.mockNotice}
            </p>
          </div>
        )}

        {method === "transfer" && (
          <p className="mt-5 rounded-xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
            {t.checkout.transferNotice}
          </p>
        )}

        {method === "arrival" && (
          <p className="mt-5 rounded-xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
            {t.checkout.arrivalNotice}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-8 w-full" disabled={submitting}>
          {submitting
            ? t.checkout.submitting
            : t.checkout.submit(formatMoney(quote.dueNow, intlTag))}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">{t.checkout.terms}</p>
      </form>

      <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
        <div className="flex gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image src={unitPhoto.src} alt={unitPhoto.alt} fill sizes="5rem" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="display-sm text-base">{unitName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(quote.range.checkIn, intlTag)} → {formatDate(quote.range.checkOut, intlTag)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t.common.nights(quote.nights)} · {t.common.guests(adults + kids)}
            </p>
          </div>
        </div>

        <Separator className="my-5" />

        <dl className="space-y-2.5 text-sm">
          {quote.lines.map((line) => (
            <div key={line.label} className="flex items-start justify-between gap-4">
              <dt
                className={cn(
                  "text-muted-foreground",
                  line.kind === "discount" && "text-status-vacant-clean",
                )}
              >
                {line.label}
              </dt>
              <dd
                className={cn("tnum shrink-0", line.kind === "discount" && "text-status-vacant-clean")}
              >
                {formatMoney(line.amount, intlTag)}
              </dd>
            </div>
          ))}
        </dl>

        <Separator className="my-4" />

        <div className="flex items-baseline justify-between gap-4">
          <span className="font-medium">{t.common.total}</span>
          <span className="tnum text-xl font-medium">{formatMoney(quote.total, intlTag)}</span>
        </div>

        <div className="mt-4 space-y-1.5 rounded-xl bg-secondary/70 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span>{t.checkout.payNow}</span>
            <span className="tnum font-medium">{formatMoney(quote.dueNow, intlTag)}</span>
          </div>
          <div className="flex justify-between gap-4 text-muted-foreground">
            <span>{t.checkout.onArrival}</span>
            <span className="tnum">
              {formatMoney(
                {
                  amountMinor: quote.total.amountMinor - quote.dueNow.amountMinor,
                  currency: quote.total.currency,
                },
                intlTag,
              )}
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
  const { t, intlTag } = useI18n();

  return (
    <div className="mx-auto max-w-xl text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-status-vacant-clean/15">
        <CircleCheck className="size-8 text-status-vacant-clean" aria-hidden />
      </span>

      <h2 className="display-sm mt-6 text-2xl">{t.checkout.doneTitle}</h2>
      <p className="mt-3 text-muted-foreground">{t.checkout.doneBody}</p>

      <Badge variant="secondary" className="mt-6 rounded-full px-4 py-1.5 font-mono text-sm">
        {reference}
      </Badge>

      <dl className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-6 text-left text-sm">
        <Row term={t.checkout.doneUnit} detail={unitName} />
        <Row
          term={t.checkout.doneCheckIn}
          detail={`${formatDate(quote.range.checkIn, intlTag)} · ${t.checkout.doneCheckInTime}`}
        />
        <Row
          term={t.checkout.doneCheckOut}
          detail={`${formatDate(quote.range.checkOut, intlTag)} · ${t.checkout.doneCheckOutTime}`}
        />
        <Row term={t.checkout.donePaid} detail={formatMoney(quote.dueNow, intlTag)} />
        <Row
          term={t.checkout.doneOutstanding}
          detail={formatMoney(
            {
              amountMinor: quote.total.amountMinor - quote.dueNow.amountMinor,
              currency: quote.total.currency,
            },
            intlTag,
          )}
        />
      </dl>

      {/* El puente hacia el PMS. Es el punto de la demo: esta reserva aparece en
          el calendario del sistema en el mismo instante. */}
      <div className="mt-8 rounded-2xl border border-dashed border-butter bg-butter/10 p-6 text-left">
        <p className="text-sm font-medium">{t.checkout.bridgeTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t.checkout.bridgeBody}</p>
        <Button asChild variant="outline" className="mt-4 gap-2">
          <LocaleLink href="/admin/calendar">{t.checkout.bridgeCta}</LocaleLink>
        </Button>
      </div>

      <Button asChild variant="ghost" className="mt-6 gap-2">
        <a href="https://wa.me/50700000000">
          <MessageCircle className="size-4" aria-hidden />
          {t.checkout.writeUs}
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
