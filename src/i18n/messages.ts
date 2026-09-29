import type { Locale } from "./config";
import de from "./locales/de";
import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import it from "./locales/it";
import nl from "./locales/nl";
import ru from "./locales/ru";
import uk from "./locales/uk";

/** The shape of all interface texts, taken from the English (master) files. */
export type Messages = typeof en;

/**
 * Other languages may miss keys (while being translated): anything missing
 * falls back to English at runtime, and `npm run i18n:check` reports it.
 */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type LocaleMessages = DeepPartial<Messages>;

export const messagesByLocale: Record<Locale, LocaleMessages> = { en, nl, fr, es, it, de, ru, uk };
