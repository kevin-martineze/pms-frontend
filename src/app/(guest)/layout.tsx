import { DemoSwitcher } from "@/components/demo/demo-switcher";
import { SiteFooter } from "@/components/guest/site-footer";

export default function GuestLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <DemoSwitcher />
    </>
  );
}
