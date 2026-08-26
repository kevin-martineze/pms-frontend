"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useI18n } from "@/lib/i18n/provider";
import { withLocale } from "@/lib/i18n/paths";

/**
 * `next/link` con el idioma puesto.
 *
 * Existe para que ninguna página tenga que acordarse del prefijo. Un `href`
 * sin idioma no da error visible: carga igual, pero en el idioma que negocie
 * el navegador en vez del que el visitante estaba leyendo.
 *
 * Los enlaces externos y los anclas pasan sin tocar.
 */
export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { locale } = useI18n();
  const target = typeof href === "string" ? withLocale(locale, href) : href;
  return <Link href={target} {...props} />;
}
