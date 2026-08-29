import type { Metadata } from "next";
import { lang } from "next/root-params";

import { InventoryManager } from "@/components/admin/inventory-manager";
import { NoAccess } from "@/components/admin/no-access";
import { TeamManager } from "@/components/admin/team-manager";
import { getMembers, getUnits, getUnitTypes } from "@/lib/api/server";
import { canAccess } from "@/lib/auth/access";
import { getSession } from "@/lib/auth/server-session";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.settings };
}

/**
 * Configuración: el inventario del alojamiento y el equipo.
 *
 * Es la pantalla que convierte "el sistema funciona" en "el hotel lo puede
 * operar sin mí". Sin ella, cargar las habitaciones de Julius y crear las
 * cuentas de su personal pasaba por que yo escribiera contra la API.
 */
export default async function SettingsPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const session = await getSession();
  if (!session) return null;

  /* Quien edita esto puede darse permisos a sí mismo, así que es la sección más
     restringida del panel. El backend devuelve 403 igual. */
  if (!canAccess(session.role, "settings")) {
    return <NoAccess t={t} section={t.admin.nav.settings} />;
  }

  const [unitTypes, units, members] = await Promise.all([
    getUnitTypes(session),
    getUnits(session),
    getMembers(session),
  ]);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">{session.property.name}</p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.settings.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.settings.lead}</p>
      </header>

      <div className="mt-8">
        <InventoryManager
          unitTypes={unitTypes.map((type) => ({
            id: type.id,
            name: type.name,
            slug: type.slug,
            description: type.description ?? null,
            maxGuests: type.maxGuests,
            bedrooms: type.bedrooms,
            beds: type.beds,
            basePriceMinor: type.basePriceMinor,
            minNights: type.minNights,
          }))}
          units={units.map((unit) => ({
            id: unit.id,
            label: unit.label,
            unitTypeId: unit.unitTypeId,
            active: unit.active,
          }))}
          currency={session.property.currency}
          locale={tag}
        />

        <TeamManager members={members} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
