import type { Metadata } from "next";
import { lang } from "next/root-params";

import { HousekeepingBoard } from "@/components/admin/housekeeping-board";
import { getHousekeepingBoard } from "@/lib/api/server";
import { getSession } from "@/lib/auth/server-session";
import { formatDate, formatWeekday, toIsoDate } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.housekeeping };
}

export default async function HousekeepingPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const session = await getSession();
  if (!session) return null;

  /* El día se calcula acá, en el servidor de Next, y viaja como parámetro. La
     API corre en UTC: si la dejáramos decidir, en Panamá el tablero cambiaría
     de turno a las 7 de la tarde. */
  const today = toIsoDate(new Date());
  const board = await getHousekeepingBoard(session, today);

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">
          {formatWeekday(today, tag)} · {formatDate(today, tag)}
        </p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.housekeeping.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.housekeeping.lead}</p>
      </header>

      <div className="mt-6">
        {board.rooms.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t.admin.housekeeping.empty}
          </p>
        ) : (
          <HousekeepingBoard board={board} />
        )}
      </div>
    </div>
  );
}
