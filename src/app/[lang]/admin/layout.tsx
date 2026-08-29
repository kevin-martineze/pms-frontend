import type { Metadata } from "next";

import { AdminLoginScreen } from "@/components/admin/admin-login-screen";
import { AdminShell } from "@/components/admin/admin-shell";
import { DemoSwitcher } from "@/components/demo/demo-switcher";
import { getSession } from "@/lib/auth/server-session";

export const metadata: Metadata = {
  title: {
    default: "Management system",
    template: "%s · Don Julius PMS",
  },
  robots: { index: false },
};

/**
 * El panel entero está detrás de la sesión, decidido en el servidor.
 *
 * Que la puerta sea server-side y no un `useEffect` que redirige importa: sin
 * cookie válida, el HTML de las pantallas del PMS nunca se llega a generar, así
 * que no hay un parpadeo de datos del hotel antes del login.
 */
export default async function AdminLayout({ children }: LayoutProps<"/[lang]/admin">) {
  const session = await getSession();

  if (!session) return <AdminLoginScreen />;

  /* Se arma el resumen a mano en vez de pasar `session`: el objeto completo
     lleva el access token, y todo prop que cruza a un Client Component termina
     serializado en el HTML. Ver `SessionSummary`. */
  return (
    <>
      <AdminShell
        session={{
          user: { fullName: session.user.fullName, email: session.user.email },
          orgName: session.orgName,
          propertyName: session.property.name,
          role: session.role,
        }}
      >
        {children}
      </AdminShell>
      <DemoSwitcher />
    </>
  );
}
