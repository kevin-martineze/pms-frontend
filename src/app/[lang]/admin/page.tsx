import { lang } from "next/root-params";
import { ArrowRight, BedDouble, DollarSign, Percent, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OccupancyStrip } from "@/components/admin/charts";
import { StatCard } from "@/components/admin/stat-card";
import { TodayLists } from "@/components/admin/today-lists";
import { LocaleLink } from "@/components/locale-link";
import { NoAccess } from "@/components/admin/no-access";
import { getBookings, getUnits } from "@/lib/api/server";
import { canAccess } from "@/lib/auth/access";
import { getSession } from "@/lib/auth/server-session";
import { toReservation } from "@/lib/bookings/mapper";
import {
  adrOn,
  arrivalsOn,
  departuresOn,
  inHouseOn,
  occupancyOn,
  revenueBetween,
  revparOn,
} from "@/lib/bookings/queries";
import { addDays, formatDate, formatWeekday, toIsoDate } from "@/lib/format";
import { getDictionary, intlTag, resolveLocale } from "@/lib/i18n";

export default async function AdminDashboard() {
  const locale = resolveLocale(await lang());
  const t = getDictionary(locale);
  const tag = intlTag(locale);

  const session = await getSession();
  if (!session) return null;

  /* El backend restringe por endpoint; esto impide llegar a la pantalla
     escribiendo la URL. Ocultar el enlace nunca fue un control de acceso. */
  if (!canAccess(session.role, "dashboard")) {
    return <NoAccess t={t} section={t.admin.nav.today} />;
  }

  const today = toIsoDate(new Date());

  const [units, bookings] = await Promise.all([
    getUnits(session),
    /* Ventana amplia: el ingreso de 30 días y la tira de ocupación miran atrás,
       las llegadas miran adelante. */
    getBookings(session, { from: addDays(today, -35), to: addDays(today, 15) }),
  ]);

  const reservations = bookings.map(toReservation);
  const totalRooms = units.length;

  const arrivals = arrivalsOn(reservations, today);
  const departures = departuresOn(reservations, today);
  const inHouse = inHouseOn(reservations, today);

  const occupancy = occupancyOn(reservations, today, totalRooms);
  const lastWeekOccupancy = occupancyOn(reservations, addDays(today, -7), totalRooms);
  const adr = adrOn(reservations, today);
  const revpar = revparOn(reservations, today, totalRooms);
  const monthRevenue = revenueBetween(reservations, addDays(today, -29), addDays(today, 1));

  const strip = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i - 3);
    return {
      date,
      occupancy: occupancyOn(reservations, date, totalRooms),
      sold: inHouseOn(reservations, date).length,
      total: totalRooms,
    };
  });

  const nf = new Intl.NumberFormat(tag);

  /* La sección de canales y el aviso de "por cobrar" salieron de esta pantalla:
     el desglose por OTA y el registro de pagos todavía no existen en el
     backend. Un gráfico de canales con una sola barra que dice "directo" no
     informa nada, y un saldo pendiente calculado sobre cero pagos registrados
     sería directamente falso.
     El estado de habitaciones también salió: depende de los endpoints de
     camarería, que son su propio ítem del roadmap. */
  return (
    <div className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">
            {formatWeekday(today, tag)} · {formatDate(today, tag)}
          </p>
          <h1 className="display-sm mt-1.5 text-2xl md:text-3xl">{t.admin.dashboard.title}</h1>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <LocaleLink href="/admin/calendar">
            {t.admin.dashboard.openCalendar}
            <ArrowRight className="size-4" aria-hidden />
          </LocaleLink>
        </Button>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t.admin.dashboard.occupancy}
          value={`${Math.round(occupancy * 100)}%`}
          hint={t.admin.dashboard.occupancyHint(inHouse.length, totalRooms)}
          delta={{
            value: `${Math.abs(Math.round((occupancy - lastWeekOccupancy) * 100))} pts`,
            direction:
              occupancy > lastWeekOccupancy ? "up" : occupancy < lastWeekOccupancy ? "down" : "flat",
          }}
          icon={<Percent className="size-4" aria-hidden />}
        />
        <StatCard
          label={t.admin.dashboard.adr}
          value={`$${Math.round(adr)}`}
          hint={t.admin.dashboard.adrHint}
          icon={<DollarSign className="size-4" aria-hidden />}
        />
        <StatCard
          label={t.admin.dashboard.revpar}
          value={`$${Math.round(revpar)}`}
          hint={t.admin.dashboard.revparHint}
          icon={<TrendingUp className="size-4" aria-hidden />}
        />
        <StatCard
          label={t.admin.dashboard.revenue30}
          value={`$${nf.format(Math.round(monthRevenue))}`}
          hint={t.admin.dashboard.revenue30Hint}
          icon={<BedDouble className="size-4" aria-hidden />}
        />
      </div>

      <div className="mt-6">
        <TodayLists arrivals={arrivals} departures={departures} />
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-medium">{t.admin.dashboard.occupancyTitle}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t.admin.dashboard.occupancySub}</p>
        <div className="mt-5">
          <OccupancyStrip data={strip} today={today} />
        </div>
      </section>
    </div>
  );
}
