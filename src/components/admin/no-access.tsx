import { ShieldOff } from "lucide-react";

import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

/**
 * Pantalla de sección restringida.
 *
 * Se muestra un mensaje explícito en vez de un 404 porque esto es una
 * herramienta interna: durante el entrenamiento del personal, "no encontrado"
 * hace pensar que el sistema está roto, mientras que "no te corresponde" se
 * entiende y no se vuelve a intentar.
 */
export function NoAccess({ t, section }: { t: Dictionary; section: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <ShieldOff className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <h1 className="display-sm mt-4 text-xl">{t.admin.noAccess.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t.admin.noAccess.body(section)}
      </p>
      <Button asChild variant="secondary" className="mt-6">
        <LocaleLink href="/admin">{t.admin.noAccess.back}</LocaleLink>
      </Button>
    </div>
  );
}
