import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Propuesta — Don Julius",
  description:
    "Propuesta visual y de interacción para el sitio de reservas y el sistema de gestión de Don Julius, David, Chiriquí.",
  robots: { index: false },
};

const UNDERSTOOD = [
  "Tomas el hotel oficialmente el 1 de noviembre y quieres abrir el 15.",
  "Repintas a finales de septiembre y contratas personal en octubre.",
  "Nada está listado hoy en Booking, Airbnb ni Expedia.",
  "Quieres el nivel 3: sitio público + reservas + sistema de gestión.",
  "Quieres trabajar 20 horas y ser gerente, no estar en medio de todo.",
  "El sitio va en español, inglés, alemán, francés y neerlandés desde la fase 1.",
];

const PHASE_1 = [
  "Sitio público del hotel, con fotos, tarifas y las cinco lenguas.",
  "Reserva en línea: el huésped elige fechas, ve disponibilidad real y paga el depósito.",
  "Calendario de habitaciones (una fila por llave, una columna por noche).",
  "Llegadas, salidas y check-in / check-out del día.",
  "Camarería: qué habitación limpiar, en qué orden y quién la tiene.",
  "Tarifas por temporada y por fin de semana, en un solo lugar.",
  "Cuentas separadas por rol: recepción, camarería y tú.",
  "Reportes: ocupación, tarifa media, ingresos y comisión pagada.",
];

const PHASE_2 = [
  "Pases de día del pool club con control de aforo.",
  "Reserva de mesas del sports bar V1.",
  "Las cinco casas dentro del mismo calendario.",
  "Sincronización con Booking y Airbnb (channel manager).",
  "Facturación electrónica y cierre de caja.",
];

const TIMELINE = [
  {
    when: "Semanas 1 – 2",
    what: "Marca y contenido",
    detail:
      "Nombre definitivo, colores, logo y fotografía. Aquí necesito fotos nuevas del hotel ya repintado: las que tengo sirven para esta maqueta, no para vender.",
  },
  {
    when: "Semanas 2 – 4",
    what: "Sitio público",
    detail:
      "Todas las pantallas que ves en la pestaña «Sitio», con tu contenido real y los cinco idiomas. Publicado y visible para Google desde el primer día — necesita semanas de ventaja antes del 15 de noviembre.",
  },
  {
    when: "Semanas 3 – 6",
    what: "Sistema de gestión",
    detail:
      "Todo lo de la pestaña «Sistema», conectado a la base de datos real. Cargamos tus habitaciones, tus tarifas y tus temporadas.",
  },
  {
    when: "Primera semana de octubre",
    what: "Entrenamiento",
    detail:
      "El sistema tiene que estar funcionando antes de que contrates, porque es sobre esto que vas a entrenar a tu gente. Este es el plazo real, no el 1 de noviembre.",
  },
  {
    when: "15 de noviembre",
    what: "Apertura",
    detail: "Con reservas ya entrando desde antes, no empezando de cero ese día.",
  },
];

const OPEN_QUESTIONS = [
  {
    q: "¿Cuántas habitaciones exactamente, y de qué tipos?",
    why: "La maqueta asume 13 llaves en 5 tipos. Cambia el calendario y los precios, no el diseño.",
  },
  {
    q: "¿Con qué banco vas a cobrar?",
    why: "Stripe no opera en Panamá. La pasarela depende de tu banco, y determina si se puede cobrar con tarjeta en línea o sólo por transferencia y Yappy.",
  },
  {
    q: "¿Las cinco casas entran en fase 1 o en fase 2?",
    why: "En la maqueta puse dos como ejemplo. Meter las cinco desde el principio agrega trabajo de contenido, no de programación.",
  },
  {
    q: "¿Quién va a cargar y actualizar el contenido después?",
    why: "Si es tu gente, hace falta un editor. Si soy yo, no hace falta y sale más barato.",
  },
];

export default function ProposalPage() {
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
              Propuesta · 25 de agosto de 2026
            </Badge>
            <h1 className="display max-w-4xl text-[clamp(2.5rem,6.5vw,4.5rem)]">
              Don Julius: un sitio que vende y un sistema que opera.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              Esto no es un documento con capturas de pantalla. Es el producto funcionando: puedes
              tocarlo, elegir fechas, reservar, y después entrar al sistema y ver esa misma reserva
              aparecida en el calendario. Lo que apruebes aquí es lo que se construye.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 bg-white text-palm-deep hover:bg-white/90">
                <Link href="/">
                  <BedDouble className="size-4" aria-hidden />
                  Ver el sitio del huésped
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/admin">
                  <LayoutDashboard className="size-4" aria-hidden />
                  Ver el sistema de gestión
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- Lo que entendí --------------------------------------------- */}
        <section className="shell py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow text-muted-foreground">Punto de partida</p>
              <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
                Lo que entendí de nuestras conversaciones
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Si algo de esta lista está mal, es mejor corregirlo hoy que en octubre. Todo lo
                demás se construye encima de estos seis puntos.
              </p>
            </div>

            <ul className="space-y-4">
              {UNDERSTOOD.map((item) => (
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
              <p className="eyebrow text-muted-foreground">La arquitectura, en una frase</p>
              <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
                Dos pantallas distintas, una sola verdad
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                El sitio es el mostrador: lo que ve el cliente. El sistema es la trastienda: lo que
                ven tú y tu gente. Los dos leen el mismo calendario, y por eso una habitación
                vendida en el sitio no se puede volver a vender en recepción.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Link
                href="/"
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5"
              >
                <div className="relative aspect-[16/9] bg-muted">
                  <Image
                    src="/photos/property-exterior.jpg"
                    alt="Fachada del hotel con la piscina al frente"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow text-terracotta">El mostrador</p>
                  <h3 className="display-sm mt-2 text-xl">Sitio del huésped</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Portada, listado con filtros, ficha de cada habitación con galería y calendario,
                    y un checkout de una sola pantalla. Cinco idiomas, y hecho para que Google lo
                    encuentre.
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-palm">
                    Entrar
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>

              <Link
                href="/admin"
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5"
              >
                <div className="relative aspect-[16/9] bg-palm-deep">
                  <Image
                    src="/photos/brand-art.jpg"
                    alt="Arte de marca de Don Julius V1 y Don Julius 2"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover opacity-90 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow text-terracotta">La trastienda</p>
                  <h3 className="display-sm mt-2 text-xl">Sistema de gestión</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Calendario de habitaciones, llegadas y salidas del día, camarería, tarifas por
                    temporada y reportes. Con roles: prueba el selector de arriba a la derecha y
                    entra como recepción para ver qué deja de ver.
                  </p>
                  <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-palm">
                    Entrar
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* --- Alcance ----------------------------------------------------- */}
        <section className="shell py-16 md:py-24">
          <p className="eyebrow text-muted-foreground">Alcance</p>
          <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
            Qué entra antes de abrir y qué después
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            No es que no se pueda construir todo. Es que construirlo todo antes del 15 de noviembre
            saldría mal, y prefiero entregarte una cosa que funcione el día de la apertura que
            cuatro que funcionen a medias.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border-2 border-palm/25 bg-card p-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-palm text-white hover:bg-palm">Fase 1</Badge>
                <span className="text-sm text-muted-foreground">listo para la apertura</span>
              </div>
              <ul className="mt-5 space-y-3">
                {PHASE_1.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Fase 2</Badge>
                <span className="text-sm text-muted-foreground">desde enero</span>
              </div>
              <ul className="mt-5 space-y-3">
                {PHASE_2.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg bg-secondary/70 p-3.5 text-xs leading-relaxed text-muted-foreground">
                Los pases de piscina y la reserva de mesas ya están maquetados en el sitio —
                pruébalos — para que veas hacia dónde va, aunque se construyan después.
              </p>
            </div>
          </div>
        </section>

        {/* --- Calendario -------------------------------------------------- */}
        <section className="bg-sand py-16 md:py-24">
          <div className="shell">
            <p className="eyebrow text-muted-foreground">Plazos</p>
            <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Tu fecha límite no es el 1 de noviembre
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Es principios de octubre. Si contratas gente en octubre, para entonces el sistema
              tiene que estar cargado y funcionando, porque es sobre eso que los vas a entrenar. Y
              el sitio tiene que llevar semanas publicado para que Google lo conozca antes del 15.
            </p>

            <ol className="mt-12 space-y-0">
              {TIMELINE.map((step, index) => (
                <li key={step.when} className="relative grid gap-4 pb-10 pl-8 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:pl-10">
                  <span
                    className="absolute left-0 top-1.5 size-3 rounded-full border-2 border-palm bg-background"
                    aria-hidden
                  />
                  {index < TIMELINE.length - 1 && (
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
                <h2 className="display-sm text-[clamp(1.5rem,3vw,2rem)]">
                  Una advertencia que te doy como amigo, no como quien te pasa la factura
                </h2>
                <p className="mt-4 leading-relaxed">
                  El 15 de noviembre abres un hotel del que nadie ha oído hablar. Sin reseñas, sin
                  nadie buscándolo por su nombre, y con un sitio que Google apenas está descubriendo.
                  Aunque te construya el mejor sitio del mundo, el primer mes va a estar vacío si
                  nadie sabe que existes.
                </p>
                <p className="mt-4 leading-relaxed">
                  Lista el hotel en Booking.com para la apertura. Sí, se llevan entre 15% y 20%. Pero
                  ellos ya tienen a la gente que está buscando un hotel en Chiriquí, y tú no. El
                  ochenta por ciento de un hotel lleno le gana al cien por ciento de uno vacío.
                </p>
                <p className="mt-4 leading-relaxed">
                  El plan es este: desde el primer día todo se maneja desde tu sistema. Asignamos
                  ciertas habitaciones a las plataformas y guardamos el resto para tu sitio, así la
                  misma habitación nunca se vende dos veces. Y a medida que crezcan las reservas
                  directas, sacamos habitaciones de las plataformas una por una. En un año podrías
                  estar vendiendo la mayoría por tu cuenta.
                </p>
                <p className="mt-6 text-sm text-muted-foreground">
                  Por eso el sistema muestra la comisión de cada reserva junto al total, y el
                  reporte del mes tiene una línea que dice cuánto se llevaron las plataformas. Es
                  el número que tiene que bajar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Preguntas abiertas ------------------------------------------ */}
        <section className="shell pb-16 md:pb-24">
          <p className="eyebrow text-muted-foreground">Lo que falta decidir</p>
          <h2 className="display-sm mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)]">
            Cuatro preguntas, y nada más
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Todo lo demás lo puedo decidir yo. Estas cuatro no, porque dependen de tu negocio y de
            tu banco. Ninguna bloquea el trabajo de las próximas dos semanas.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {OPEN_QUESTIONS.map((item) => (
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

          {/* --- Nota de honestidad --------------------------------------- */}
          <div className="max-w-3xl">
            <h2 className="display-sm text-xl">Sobre lo que estás viendo</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
              <p>
                Las fotos son las tuyas, las que me mandaste por WhatsApp. Los nombres de los
                negocios y el amarillo de la marca salen de tus propios diseños.
              </p>
              <p>
                Los nombres de las habitaciones, los precios, las capacidades y todas las reservas
                del sistema son inventados para que puedas ver cómo se comporta lleno. Ningún dato
                de aquí es real, y ninguna reserva de la demostración existe.
              </p>
              <p>
                El teléfono, la dirección y el correo están en blanco a propósito. Prefiero un hueco
                visible a un dato inventado que después alguien copie a Google.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  Empezar por el sitio
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/admin">Empezar por el sistema</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <DemoSwitcher />
    </>
  );
}
