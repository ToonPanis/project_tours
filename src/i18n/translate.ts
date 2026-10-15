import { defaultLocale, type Locale } from "./config";
import { messagesByLocale, type Messages } from "./messages";
import { buildTranslator, type Translator } from "./translator";

/**
 * Translators with every language at hand: for the server (server.ts), the
 * walk data and tests. Imports all 8 languages, so Client Components use
 * `useT()` from client.tsx instead (it only has English and the visitor's language).
 */

export type { MessageKey, MessageValues, PluralKey, Translator } from "./translator";

const english = messagesByLocale[defaultLocale] as Messages;

export function createTranslator(locale: Locale): Translator {
  return buildTranslator(locale, messagesByLocale[locale], english);
}

/** English, e.g. the default for formatting helpers that are also used outside a page. */
export const englishTranslator: Translator = createTranslator(defaultLocale);
