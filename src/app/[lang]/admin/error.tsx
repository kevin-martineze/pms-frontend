"use client";

import * as React from "react";
import { RotateCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Frontera de error del panel.
 *
 * Sin esto, que la API no responda tira la pantalla blanca de Next: recepción
 * ve una página en blanco y no puede saber si el sistema se cayó o si el hotel
 * no tiene reservas. Acá al menos sabe que fue una falla y tiene un botón.
 *
 * `reset()` vuelve a renderizar el segmento sin recargar la página, así que si
 * la API estaba reiniciándose, un clic alcanza.
 *
 * El detalle técnico va detrás de un `<details>`: no le sirve a quien está en el
 * mostrador, y sí a quien recibe la captura de pantalla.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  React.useEffect(() => {
    // Sin monitoreo todavía; al menos queda en la consola del navegador.
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-status-departing/12">
        <TriangleAlert className="size-5 text-status-departing" aria-hidden />
      </span>
      <h1 className="display-sm mt-4 text-xl">{t.admin.error.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.admin.error.body}</p>

      <Button className="mt-6 gap-1.5" onClick={reset}>
        <RotateCw className="size-4" aria-hidden />
        {t.admin.error.retry}
      </Button>

      <details className="mt-8 w-full text-left">
        <summary className="cursor-pointer text-xs text-muted-foreground">
          {t.admin.error.details}
        </summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-secondary p-3 text-[0.7rem] text-muted-foreground">
          {error.message}
          {error.digest ? `\n\ndigest: ${error.digest}` : ""}
        </pre>
      </details>
    </div>
  );
}
