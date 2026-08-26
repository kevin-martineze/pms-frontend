import { lang } from "next/root-params";

import { DemoSwitcher } from "@/components/demo/demo-switcher";
import { SiteFooter } from "@/components/guest/site-footer";
import { getDictionary, resolveLocale } from "@/lib/i18n";

export default async function GuestLayout({ children }: LayoutProps<"/[lang]">) {
  const t = getDictionary(resolveLocale(await lang()));

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t.nav.skipToContent}
      </a>
      <main id="content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <DemoSwitcher />
    </>
  );
}
