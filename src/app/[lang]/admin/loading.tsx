import { Skeleton } from "@/components/ui/skeleton";

/**
 * Esqueleto mientras el Server Component busca datos.
 *
 * Cubre todas las pantallas del panel: Next usa el `loading.tsx` más cercano, y
 * ninguna ruta hija define el suyo.
 *
 * La forma imita la de las pantallas reales —encabezado, cuatro tarjetas, un
 * bloque ancho— para que el contenido no salte cuando llega. Un spinner
 * centrado ocuparía menos código y haría que cada carga reacomode la página.
 *
 * Importa de verdad acá: la API está en Neon, del otro lado de internet, así
 * que la primera pintura de una pantalla no es instantánea ni en local.
 */
export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8" aria-busy="true">
      <span className="sr-only">Cargando…</span>

      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-3 h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <Skeleton className="mt-6 h-72 rounded-xl" />
    </div>
  );
}
