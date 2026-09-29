import { defaultLocale, locales, type Locale } from "./config";
import type { DeepPartial } from "./messages";

/**
 * Walk content per language. Every walk keeps ONE set of technical data
 * (ids, coordinates, addresses, images, answers) and one text file per
 * language. English is complete; other languages may be partial while they
 * are being translated: whatever is missing is taken from English.
 */
export type LocalizedContent<T> = { en: T } & Partial<Record<Exclude<Locale, "en">, DeepPartial<T>>>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Lays a translation over the English base. Objects are merged key by key;
 * text and lists (e.g. the paragraphs of a story) are taken as a whole, so a
 * translated story never mixes sentences of two languages.
 */
export function mergeTranslation<T>(base: T, translation: DeepPartial<T> | undefined): T {
  if (translation === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(translation)) return translation as T;

  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(translation)) {
    if (value === undefined) continue;
    merged[key] = key in base ? mergeTranslation<unknown>((base as Record<string, unknown>)[key], value as DeepPartial<unknown>) : value;
  }
  return merged as T;
}

/** The content in `locale`, completed with English where it is missing. */
export function pickContent<T>(content: LocalizedContent<T>, locale: Locale): T {
  if (locale === defaultLocale) return content.en;
  return mergeTranslation(content.en, content[locale]);
}

/** Which languages actually have (some) content for this walk. */
export function availableLocales<T>(content: LocalizedContent<T>): Locale[] {
  return locales.filter((locale) => locale === defaultLocale || content[locale] !== undefined);
}

/**
 * Builds something once per language and remembers it (walks are built from
 * static data, so there is no need to rebuild them on every request).
 */
export function cachePerLocale<T>(build: (locale: Locale) => T): (locale?: Locale) => T {
  const cache = new Map<Locale, T>();
  return (locale = defaultLocale) => {
    const cached = cache.get(locale);
    if (cached) return cached;
    const built = build(locale);
    cache.set(locale, built);
    return built;
  };
}
