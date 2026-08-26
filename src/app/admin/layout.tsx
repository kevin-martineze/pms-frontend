import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { DemoSwitcher } from "@/components/demo/demo-switcher";

export const metadata: Metadata = {
  title: {
    default: "Sistema de gestión",
    template: "%s · PMS Don Julius",
  },
  robots: { index: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <DemoSwitcher />
    </>
  );
}
