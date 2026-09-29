/**
 * The languages Hidden Antwerp supports. To add a language (e.g. Portuguese):
 * add it here, add src/i18n/locales/pt/, and add walk content where you have
 * it. Everything missing falls back to English. See I18N.md.
 */
export const locales = ["en", "nl", "fr", "es", "it", "de", "ru", "uk"] as const;

export type Locale = (typeof locales)[number];

/** English is the master language and the fallback for anything not translated. */
export const defaultLocale: Locale = "en";

/** Cookie that remembers the chosen language (read by the server, so pages render in it). */
export const LOCALE_COOKIE = "ha-locale";

/** localStorage key with the same value, so the choice survives cleared cookies. */
export const LOCALE_STORAGE_KEY = "hidden-antwerp:locale";

/** How the language is shown in the language selector: always in its own language. */
export const localeNames: Record<Locale, { nativeName: string; flag: string }> = {
  en: { nativeName: "English", flag: "🇬🇧" },
  nl: { nativeName: "Nederlands", flag: "🇳🇱" },
  fr: { nativeName: "Français", flag: "🇫🇷" },
  es: { nativeName: "Español", flag: "🇪🇸" },
  it: { nativeName: "Italiano", flag: "🇮🇹" },
  de: { nativeName: "Deutsch", flag: "🇩🇪" },
  ru: { nativeName: "Русский", flag: "🇷🇺" },
  uk: { nativeName: "Українська", flag: "🇺🇦" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** "nl-BE" → "nl", "uk-UA" → "uk", "pt-BR" → null. */
export function toSupportedLocale(tag: string): Locale | null {
  const language = tag.trim().toLowerCase().split(/[-_]/)[0];
  return isLocale(language) ? language : null;
}

/**
 * Picks the best supported language from an Accept-Language header or a list
 * like navigator.languages, honouring the order (and q-values) of preference.
 * "fr-BE,fr;q=0.9,en;q=0.8" → "fr"; "pt-BR" → "en".
 */
export function matchLocale(preferences: string | readonly string[] | null | undefined): Locale {
  if (!preferences) return defaultLocale;

  const tags =
    typeof preferences === "string"
      ? preferences
          .split(",")
          .map((part) => {
            const [tag, ...parameters] = part.trim().split(";");
            const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
            return { tag, quality: quality ? Number(quality.trim().slice(2)) : 1 };
          })
          // "q=0" means "not this language" (HTTP spec), so it is never chosen.
          .filter((entry) => entry.tag && !Number.isNaN(entry.quality) && entry.quality > 0)
          .sort((a, b) => b.quality - a.quality)
          .map((entry) => entry.tag)
      : preferences;

  for (const tag of tags) {
    const locale = toSupportedLocale(tag);
    if (locale) return locale;
  }
  return defaultLocale;
}
