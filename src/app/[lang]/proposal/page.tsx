import type { Metadata } from "next";
import Image from "next/image";
import { lang } from "next/root-params";
import {
  ArrowRight,
  BedDouble,
  Check,
  CircleHelp,
  LayoutDashboard,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DemoSwitcher } from "@/components/demo/demo-switcher";
import { LocaleLink } from "@/components/locale-link";
import { getDictionary, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return {
    title: t.proposal.metaTitle,
    description: t.proposal.metaDescription,
    robots: { index: false },
  };
}

export default async function ProposalPage() {
  const t = getDictionary(resolveLocale(await lang()));

  return (
    <>
      <main className="flex-1 pb-28">
        {/* --- Portada ---------------------------------------------------- */}
        <section className="relative isolate overflow-hidden bg-palm-deep text-white">
          <Image
            src="/photos/pool-sunset.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="shell relative py-20 md:py-28">
            <Badge className="mb-6 w-fit border-white/25 bg-white/15 text-white backdrop-blur hover:bg-white/20">
              {t.proposal.badge}
            </Badge>
            <h1 className="display max-w-4xl text-[clamp(2.5rem,6.5vw,4.5rem)]">
              {t.proposal.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{t.proposal.lead}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 bg-white text-palm-deep hover:bg-white/90">
                <LocaleLink href="/">
                  <BedDouble className="size-4" aria-hidden />
                  {t.proposal.ctaSite}
                </LocaleLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <LocaleLink href="/admin">
                  <LayoutDashboard className="size-4" aria-hidden />
                  {t.proposal.ctaAdmin}
                </LocaleLink>
              </Button>
            </div>
          </div>
        </section>

        {/* --- Lo que entendí --------------------------------------------- */}
        <section className="shell py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow text-muted-foreground">{t.proposal.understoodEyebrow}</p>
              <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
                {t.proposal.understoodTitle}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {t.proposal.understoodLead}
              </p>
            </div>

            <ul className="space-y-4">
              {t.proposal.understood.map((item) => (
                <li key={item} className="flex gap-3.5">
                  <Check className="mt-0.5 size-5 shrink-0 text-palm" aria-hidden />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Las dos mitades -------------------------------------------- */}
        <section className="bg-sand py-16 md:py-24">
          <div className="shell">
            <div className="max-w-2xl">
              <p className="eyebrow text-muted-foreground">{t.proposal.halvesEyebrow}</p>
              <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
                {t.proposal.halvesTitle}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{t.proposal.halvesLead}</p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <LocaleLink
                href="/"
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5"
              >
                <div className="relative aspect-[16/9] bg-muted">
                  <Image
                    src="/photos/property-hero.jpg"
                    alt="Palms framing the house and pool"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow text-terracotta">{t.proposal.frontCounter}</p>
                  <h3 className="display-sm mt-2 text-xl">{t.proposal.guestSite}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t.proposal.guestSiteBody}
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-palm">
                    {t.proposal.enter}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </LocaleLink>

              <LocaleLink
                href="/admin"
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5"
              >
                <div className="relative aspect-[16/9] bg-palm-deep">
                  <Image
                    src="/photos/brand-art.jpg"
                    alt="Don Julius V1 and Don Julius 2 brand artwork"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover opacity-90 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow text-terracotta">{t.proposal.backOffice}</p>
                  <h3 className="display-sm mt-2 text-xl">{t.proposal.system}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t.proposal.systemBody}
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-palm">
                    {t.proposal.enter}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </LocaleLink>
            </div>
          </div>
        </section>

        {/* --- Alcance ----------------------------------------------------- */}
        <section className="shell py-16 md:py-24">
          <p className="eyebrow text-muted-foreground">{t.proposal.scopeEyebrow}</p>
          <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
            {t.proposal.scopeTitle}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {t.proposal.scopeLead}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border-2 border-palm/25 bg-card p-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-palm text-white hover:bg-palm">{t.proposal.phase1}</Badge>
                <span className="text-sm text-muted-foreground">{t.proposal.phase1When}</span>
              </div>
              <ul className="mt-5 space-y-3">
                {t.proposal.phase1Items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{t.proposal.phase2}</Badge>
                <span className="text-sm text-muted-foreground">{t.proposal.phase2When}</span>
              </div>
              <ul className="mt-5 space-y-3">
                {t.proposal.phase2Items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/40"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg bg-secondary/70 p-3.5 text-xs leading-relaxed text-muted-foreground">
                {t.proposal.phase2Note}
              </p>
            </div>
          </div>
        </section>

        {/* --- Calendario -------------------------------------------------- */}
        <section className="bg-sand py-16 md:py-24">
          <div className="shell">
            <p className="eyebrow text-muted-foreground">{t.proposal.timelineEyebrow}</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {t.proposal.timelineTitle}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {t.proposal.timelineLead}
            </p>

            <ol className="mt-12 space-y-0">
              {t.proposal.timeline.map((step, index) => (
                <li
                  key={step.when}
                  className="relative grid gap-4 pb-10 pl-8 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:pl-10"
                >
                  <span
                    className="absolute left-0 top-1.5 size-3 rounded-full border-2 border-palm bg-background"
                    aria-hidden
                  />
                  {index < t.proposal.timeline.length - 1 && (
                    <span className="absolute bottom-0 left-[5px] top-5 w-0.5 bg-border" aria-hidden />
                  )}
                  <p className="text-sm font-medium text-palm">{step.when}</p>
                  <div>
                    <p className="display-sm text-lg">{step.what}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --- Booking.com ------------------------------------------------- */}
        <section className="shell py-16 md:py-24">
          <div className="rounded-3xl border border-terracotta/25 bg-terracotta/5 p-8 md:p-12">
            <div className="flex items-start gap-4">
              <TriangleAlert className="mt-1 size-6 shrink-0 text-terracotta" aria-hidden />
              <div className="max-w-3xl">
                <p className="eyebrow text-terracotta">{t.proposal.cautionEyebrow}</p>
                <h2 className="display-sm mt-2 text-[clamp(1.5rem,3vw,2rem)]">
                  {t.proposal.cautionTitle}
                </h2>
                {t.proposal.caution.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                <p className="mt-6 text-sm text-muted-foreground">{t.proposal.cautionNote}</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Preguntas abiertas ------------------------------------------ */}
        <section className="shell pb-16 md:pb-24">
          <p className="eyebrow text-muted-foreground">{t.proposal.questionsEyebrow}</p>
          <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
            {t.proposal.questionsTitle}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {t.proposal.questionsLead}
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {t.proposal.questions.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex gap-3">
                  <CircleHelp className="mt-0.5 size-5 shrink-0 text-terracotta" aria-hidden />
                  <div>
                    <p className="font-medium leading-snug">{item.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.why}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-14" />

          <div className="max-w-3xl">
            <h2 className="display-sm text-xl">{t.proposal.honestyTitle}</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
              {t.proposal.honesty.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <LocaleLink href="/">
                  {t.proposal.startSite}
                  <ArrowRight className="size-4" aria-hidden />
                </LocaleLink>
              </Button>
              <Button asChild size="lg" variant="outline">
                <LocaleLink href="/admin">{t.proposal.startSystem}</LocaleLink>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <DemoSwitcher />
    </>
  );
}
