import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { lang } from "next/root-params";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { LOCALES } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/provider";

import "../globals.css";

/**
 * Newsreader para los titulares del sitio, Inter para todo lo demás.
 *
 * Se eligió una serif editorial cálida y no una display de alto contraste
 * porque el sitio se lee tanto en un titular grande como en una ficha de
 * habitación, y una serif de contraste extremo se cae a tamaños chicos.
 *
 * Trae eje óptico (`opsz`), que es lo que deja que una sola familia sirva para
 * un titular grande y para una etiqueta sin que el titular parezca texto de
 * cuerpo inflado.
 *
 * `latin-ext` además de `latin`: el español necesita ñ y acentos, y el subset
 * básico los cubre justo — pero el contenido de Julius va a tener nombres
 * propios y direcciones donde el subset extendido evita sorpresas.
 *
 * ⚠️ Elección provisional hasta que se decida el nombre de la marca
 * (Daughters of Sun vs Don Julius). El largo y el idioma del nombre mandan
 * sobre la display, y cambiarla después es editar dos líneas.
 */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
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
      className={`${newsreader.variable} ${inter.variable} h-full antialiased`}
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
