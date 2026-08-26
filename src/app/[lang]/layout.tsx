import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { lang } from "next/root-params";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { LOCALES } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/provider";

import "../globals.css";

/* Fraunces trae un eje óptico, que es lo que deja que una sola familia sirva
   para un titular editorial grande y para una etiqueta pequeña sin que el
   titular parezca texto de cuerpo inflado. Inter cubre toda la interfaz. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Don Julius — Hotel · Pool Club · Sports Bar",
    template: "%s · Don Julius",
  },
  description:
    "Hotel, pool club and sports bar in David, Chiriquí, Panama. Book direct and skip the platform commission.",
};

/**
 * Las dos rutas de idioma se generan estáticamente. Los otros tres idiomas del
 * alcance (alemán, francés, neerlandés) entran aquí en cuanto tengan
 * diccionario, sin tocar nada más.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  /* `next/root-params` en vez del prop `params`: el idioma hace falta en
     utilidades compartidas y en componentes hondos, y pasarlo a mano por cada
     capa es donde se pierde. */
  const locale = resolveLocale(await lang());

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale}>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster position="top-center" />
        </I18nProvider>
      </body>
    </html>
  );
}
