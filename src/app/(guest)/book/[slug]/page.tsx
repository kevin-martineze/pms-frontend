import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { CheckoutForm } from "@/components/guest/checkout-form";
import { SiteHeader } from "@/components/guest/site-header";
import { quoteFor } from "@/lib/availability";
import { unitBySlug } from "@/lib/mock/property";

export const metadata: Metadata = {
  title: "Confirmar reserva",
  robots: { index: false },
};

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ in?: string; out?: string; adults?: string; children?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  const unit = unitBySlug.get(slug);
  if (!unit) notFound();

  /* Sin fechas válidas no hay nada que cotizar. Se devuelve a la ficha en vez
     de mostrar un checkout vacío que no puede completarse. */
  if (!query.in || !query.out || query.in >= query.out) {
    redirect(`/stays/${slug}`);
  }

  const adults = Number(query.adults ?? "2");
  const children = Number(query.children ?? "0");

  const quote = quoteFor(unit.id, query.in, query.out, adults + children, {
    directDiscount: true,
  });
  if (!quote) redirect(`/stays/${slug}`);

  /* Referencia determinista a partir de los datos de la reserva: la misma URL
     muestra la misma referencia si el huésped recarga. */
  const reference = `DJ-${String(
    Math.abs(hash(`${unit.id}${query.in}${query.out}`)) % 900000 + 100000,
  )}`;

  return (
    <>
      <SiteHeader />

      <div className="shell py-10 md:py-14">
        <Link
          href={`/stays/${slug}?in=${query.in}&out=${query.out}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Volver a {unit.name}
        </Link>

        <h1 className="display-sm mt-5 text-[clamp(1.85rem,4vw,2.5rem)]">Confirma tu reserva</h1>

        <div className="mt-10">
          <CheckoutForm
            unitName={unit.name}
            unitPhoto={unit.photos[0]}
            quote={quote}
            adults={adults}
            kids={children}
            reference={reference}
          />
        </div>
      </div>
    </>
  );
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h | 0;
}
