import { defaultLocale, type Locale } from "./config";
import { messagesByLocale, type Messages } from "./messages";

/**
 * The translator: `t("gps.turnLeft")`, `t("game.start.stopOf", { current: 3, total: 8 })`
 * and `t.plural("walks.card.stops", 12)`. Works the same on the server and in
 * the browser. Keys are checked by TypeScript against the English messages.
 */

type Join<Prefix extends string, Rest extends string> = `${Prefix}.${Rest}`;

/** A plural message: one text per plural category (at least "other"). */
interface PluralMessage {
  other: string;
}

/** Every key whose value is a plain string, e.g. "gps.turnLeft". */
export type MessageKey = LeafKeys<Messages>;
type LeafKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends PluralMessage
      ? never
      : T[K] extends object
        ? Join<K, LeafKeys<T[K]>>
        : never;
}[keyof T & string];

/** Every key whose value is a plural message, e.g. "walks.card.stops". */
export type PluralKey = PluralKeys<Messages>;
type PluralKeys<T> = {
  [K in keyof T & string]: T[K] extends PluralMessage
    ? K
    : T[K] extends string
      ? never
      : T[K] extends object
        ? Join<K, PluralKeys<T[K]>>
        : never;
}[keyof T & string];

/** Values for {placeholders}. Numbers are formatted for the language (1.234 / 1,234). */
export type MessageValues = Record<string, string | number>;

export interface Translator {
  (key: MessageKey, values?: MessageValues): string;
  /** Picks the right plural form for `count` (Russian and Ukrainian have several). */
  plural: (key: PluralKey, count: number, values?: MessageValues) => string;
  locale: Locale;
}

const warnedKeys = new Set<string>();

/** Development only: say once which key is missing, so it can be translated. */
function warnMissing(locale: Locale, key: string) {
  if (process.env.NODE_ENV === "production") return;
  const id = `${locale}:${key}`;
  if (warnedKeys.has(id)) return;
  warnedKeys.add(id);
  console.warn(`[i18n] Missing translation for "${key}" in "${locale}"; showing English instead.`);
}

function lookup(messages: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>(
    (node, part) => (node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined),
    messages,
  );
}

function interpolate(template: string, values: MessageValues | undefined, locale: Locale): string {
  if (!values) return template;
  const numberFormat = new Intl.NumberFormat(locale);
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = values[name];
    if (value === undefined) return match;
    return typeof value === "number" ? numberFormat.format(value) : value;
  });
}

/** The message in the requested language, or English when it is missing there. */
function resolve(locale: Locale, key: string): unknown {
  const value = lookup(messagesByLocale[locale], key);
  if (value !== undefined) return value;
  if (locale !== defaultLocale) warnMissing(locale, key);
  return lookup(messagesByLocale[defaultLocale], key);
}

export function createTranslator(locale: Locale): Translator {
  const pluralRules = new Intl.PluralRules(locale);

  const t = ((key: MessageKey, values?: MessageValues) => {
    const message = resolve(locale, key);
    // Never show "undefined": at worst the key itself (only possible for a typo that bypassed TypeScript).
    return typeof message === "string" ? interpolate(message, values, locale) : key;
  }) as Translator;

  t.plural = (key, count, values) => {
    const message = resolve(locale, key) as Partial<Record<Intl.LDMLPluralRule, string>> | undefined;
    const category = pluralRules.select(count);
    const template = message?.[category] ?? message?.other;
    return template ? interpolate(template, { count, ...values }, locale) : key;
  };
  t.locale = locale;

  return t;
}

/** English, e.g. the default for formatting helpers that are also used outside a page. */
export const englishTranslator: Translator = createTranslator(defaultLocale);
