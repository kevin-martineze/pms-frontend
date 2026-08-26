import type { Metadata } from "next";

import { HousekeepingBoard } from "@/components/admin/housekeeping-board";
import { housekeepingToday, staff } from "@/lib/mock/operations";
import { formatDate, formatWeekday } from "@/lib/format";
import { TODAY } from "@/lib/mock/reservations";

export const metadata: Metadata = { title: "Camarería" };

export default function HousekeepingPage() {
  const tasks = housekeepingToday();
  const cleaners = staff.filter((s) => s.role === "housekeeping");

  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header>
        <p className="eyebrow text-muted-foreground">
          {formatWeekday(TODAY)} · {formatDate(TODAY)}
        </p>
        <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">Camarería</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          El estado de cada habitación sale del calendario, no de una lista aparte. Cuando
          recepción registra una salida, la habitación aparece aquí sola.
        </p>
      </header>

      <div className="mt-6">
        <HousekeepingBoard tasks={tasks} cleaners={cleaners} />
      </div>
    </div>
  );
}
