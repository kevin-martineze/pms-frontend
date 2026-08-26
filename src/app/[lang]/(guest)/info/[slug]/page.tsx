import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/guest/site-header";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * Páginas de contenido largo.
 *
 * El texto vive en el diccionario, no en el componente: es contenido que el
 * cliente va a querer cambiar, y en cinco idiomas. Cuando entre el CMS, esta
 * ruta lee de ahí y el layout no cambia.
 */

type InfoSlug = keyof Dictionary["info"];

const SLUGS: InfoSlug[] = ["getting-here", "policies", "accessibility", "faq"];

function isInfoSlug(value: string): value is InfoSlug {
  return (SLUGS as string[]).includes(value);
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SLUGS.map((slug) => ({ lang: locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isInfoSlug(slug)) return {};
  const t = getDictionary(resolveLocale(await lang()));
  const page = t.info[slug];
  return { title: page.title, description: page.intro };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isInfoSlug(slug)) notFound();

  const t = getDictionary(resolveLocale(await lang()));
  const page = t.info[slug];

  const sections = "sections" in page ? page.sections : undefined;
  const faq = "faq" in page ? page.faq : undefined;

  return (
    <>
      <SiteHeader />

      <div className="shell py-14 md:py-20">
        <div className="max-w-2xl">
          <h1 className="display-sm text-[clamp(1.85rem,4vw,2.75rem)]">{page.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{page.intro}</p>

          {sections && (
            <div className="mt-12 space-y-10">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="display-sm text-xl">{section.heading}</h2>
                  <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {faq && (
            <Accordion type="single" collapsible className="mt-10">
              {faq.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </>
  );
}
