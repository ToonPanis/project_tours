import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { SITE_NAME } from "./site";

/**
 * Metadata fields that every page shares. Next.js merges metadata SHALLOWLY: a page
 * that sets `openGraph` replaces the layout's whole `openGraph` (see the Next.js docs,
 * generate-metadata "Merging"). So each page spreads these in instead of relying on
 * the layout.
 */

/**
 * Link previews (Open Graph) want a language plus a region ("nl_BE"), not "nl".
 * Dutch and French as spoken in Belgium; the other languages in their main country.
 */
const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: "en_GB",
  nl: "nl_BE",
  fr: "fr_BE",
  es: "es_ES",
  it: "it_IT",
  de: "de_DE",
  ru: "ru_RU",
  uk: "uk_UA",
};

export function toOpenGraphLocale(locale: Locale): string {
  return OPEN_GRAPH_LOCALES[locale];
}

/** The Open Graph fields every page has; a page adds its own title and description. */
export function baseOpenGraph(locale: Locale) {
  return { siteName: SITE_NAME, locale: toOpenGraphLocale(locale), type: "website" } as const;
}

/**
 * PROTOTYPE: keep the whole site out of search engines while it contains placeholder
 * content next to real café names. Every page that sets `robots` uses this, so no
 * page loses the "nofollow" half. At launch: remove it from the layout, and give the
 * play page its own `{ index: false }` (game screens are no search results).
 */
export const PROTOTYPE_ROBOTS: Metadata["robots"] = { index: false, follow: false };
