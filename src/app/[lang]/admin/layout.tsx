import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { DemoSwitcher } from "@/components/demo/demo-switcher";

export const metadata: Metadata = {
  title: {
    default: "Management system",
    template: "%s · Don Julius PMS",
  },
  robots: { index: false },
};

export default function AdminLayout({ children }: LayoutProps<"/[lang]/admin">) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <DemoSwitcher />
    </>
  );
}
