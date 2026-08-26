import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/guest/site-header";

/**
 * Páginas de contenido largo.
 *
 * Viven en un archivo de datos y no en cuatro componentes porque son texto que
 * el cliente va a querer cambiar, y cambiar texto no debería requerir tocar
 * JSX. En producción esto sale del CMS o de archivos markdown; la ruta y el
 * layout no cambian.
 */

type Section = { heading: string; body: string[] };

const PAGES: Record<
  string,
  { title: string; intro: string; sections?: Section[]; faq?: { q: string; a: string }[] }
> = {
  "como-llegar": {
    title: "Cómo llegar",
    intro:
      "Estamos en David, provincia de Chiriquí, a unos 45 minutos de la frontera con Costa Rica y a poco más de seis horas por tierra desde la Ciudad de Panamá.",
    sections: [
      {
        heading: "En avión",
        body: [
          "El Aeropuerto Internacional Enrique Malek (DAV) está a unos 15 minutos en carro. Hay vuelos diarios desde Ciudad de Panamá y conexiones estacionales desde San José.",
          "Podemos coordinar el traslado desde el aeropuerto si nos avisas la hora de llegada al reservar. Se paga aparte y se agrega a tu cuenta.",
        ],
      },
      {
        heading: "En carro",
        body: [
          "Por la Carretera Interamericana. Desde Ciudad de Panamá son unas 6 a 7 horas; desde la frontera de Paso Canoas, unos 45 minutos.",
          "Hay estacionamiento propio sin costo, con espacio para vehículos altos.",
        ],
      },
      {
        heading: "En bus",
        body: [
          "La terminal de David recibe buses directos desde Albrook cada hora. Desde la terminal al hotel son unos diez minutos en taxi.",
        ],
      },
    ],
  },
  politicas: {
    title: "Políticas de la propiedad",
    intro:
      "Lo que aplica a toda reserva hecha en este sitio. Si algo no está claro, escríbenos antes de reservar y no después.",
    sections: [
      {
        heading: "Entrada y salida",
        body: [
          "Check-in desde las 15:00. Check-out hasta las 11:00.",
          "Recepción atiende hasta las 22:00. Si llegas más tarde, avísanos y coordinamos la entrega de la llave.",
          "Guardamos equipaje sin costo antes del check-in y después del check-out.",
        ],
      },
      {
        heading: "Pagos",
        body: [
          "Se cobra el 30% al reservar y el resto al llegar. Aceptamos tarjeta, transferencia y efectivo.",
          "Los precios mostrados no incluyen ITBMS; el impuesto aparece desglosado antes de confirmar.",
        ],
      },
      {
        heading: "Cancelaciones",
        body: [
          "Cancelación gratis hasta 48 horas antes de la llegada; se devuelve el depósito completo.",
          "Dentro de las 48 horas se retiene el depósito.",
          "La tarifa no reembolsable no admite cancelación, y por eso cuesta menos.",
        ],
      },
      {
        heading: "Convivencia",
        body: [
          "Los niños son bienvenidos. Menores de 4 años no pagan pase de piscina.",
          "No se permite fumar dentro de las habitaciones. Sí en las terrazas y el jardín.",
          "Mascotas sólo en las casas completas, avisando antes de reservar.",
        ],
      },
    ],
  },
  accesibilidad: {
    title: "Accesibilidad",
    intro:
      "Preferimos decir exactamente qué hay y qué no, en vez de dejarte llamar para averiguarlo. Cada unidad declara su situación en su propia ficha.",
    sections: [
      {
        heading: "En la propiedad",
        body: [
          "Estacionamiento a nivel, sin peldaños hasta la recepción y hasta el restaurante.",
          "El edificio principal no tiene ascensor: las habitaciones del segundo piso se alcanzan sólo por escalera.",
          "El acceso a la piscina tiene un escalón de 12 cm; hay una rampa portátil disponible pidiéndola en recepción.",
        ],
      },
      {
        heading: "En las habitaciones",
        body: [
          "Las habitaciones familiares, las de jardín y el bungalow tienen acceso sin escalones.",
          "Ninguna habitación tiene actualmente ducha con acceso para silla de ruedas. Es lo primero de la lista de remodelación.",
          "Hay cunas sin costo y barandas de cama disponibles pidiéndolas al reservar.",
        ],
      },
      {
        heading: "En este sitio",
        body: [
          "Todo el sitio se recorre con teclado y el foco siempre es visible.",
          "El filtro «acceso sin escalones» del listado muestra sólo las unidades que lo cumplen.",
          "Si algo aquí no funciona con tu lector de pantalla, escríbenos: se arregla.",
        ],
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    intro: "Lo que más nos preguntan por WhatsApp, contestado de una vez.",
    faq: [
      {
        q: "¿El pase de piscina está incluido si me quedo en el hotel?",
        a: "Sí, para todos los que vengan en la reserva y durante toda la estadía. No hay que comprar nada aparte: el número de habitación es la entrada.",
      },
      {
        q: "¿Tienen desayuno incluido?",
        a: "No está incluido en la tarifa. El restaurante abre desde las 7:00 y el desayuno completo cuesta $8 por persona.",
      },
      {
        q: "¿Puedo llegar tarde en la noche?",
        a: "Sí. Recepción atiende hasta las 22:00; si llegas después, avísanos por WhatsApp y coordinamos la entrega de la llave.",
      },
      {
        q: "¿Aceptan mascotas?",
        a: "En las casas completas sí, avisando antes de reservar. En las habitaciones del hotel no, por el resto de los huéspedes.",
      },
      {
        q: "¿Hay transporte desde el aeropuerto?",
        a: "Lo coordinamos si nos das la hora de llegada al reservar. Se cobra aparte y se agrega a tu cuenta.",
      },
      {
        q: "¿Por qué reservar aquí y no en Booking?",
        a: "Porque cuesta un 7% menos, la cancelación es más flexible y si algo pasa hablas directamente con la casa en vez de con un centro de llamadas.",
      },
      {
        q: "¿Puedo pagar en efectivo?",
        a: "Sí, la parte que queda pendiente al llegar. El depósito del 30% se paga en línea o por transferencia.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return { title: page.title, description: page.intro };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <SiteHeader />

      <div className="shell py-14 md:py-20">
        <div className="max-w-2xl">
          <h1 className="display-sm text-[clamp(1.85rem,4vw,2.75rem)]">{page.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{page.intro}</p>

          {page.sections && (
            <div className="mt-12 space-y-10">
              {page.sections.map((section) => (
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

          {page.faq && (
            <Accordion type="single" collapsible className="mt-10">
              {page.faq.map((item) => (
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
