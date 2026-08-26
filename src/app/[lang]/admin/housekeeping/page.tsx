import type { Metadata } from "next";
import { lang } from "next/root-params";

import { HousekeepingBoard } from "@/components/admin/housekeeping-board";
import { housekeepingToday, staff } from "@/lib/mock/operations";
import { formatDate, formatWeekday } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";
import { TODAY } from "@/lib/mock/reservations";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(resolveLocale(await lang()));
  return { title: t.admin.nav.housekeeping };
}

export default async function HousekeepingPage() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const tasks = housekeepingToday();
  const cleaners = staff.filter((s) => s.role === "housekeeping");

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">
          {formatWeekday(TODAY, tag)} · {formatDate(TODAY, tag)}
        </p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.housekeeping.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.admin.housekeeping.lead}</p>
      </header>

      <div className="mt-6">
        <HousekeepingBoard tasks={tasks} cleaners={cleaners} />
      </div>
    </div>
  );
}
