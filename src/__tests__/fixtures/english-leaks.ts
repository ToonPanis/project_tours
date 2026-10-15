import type { Locale } from "@/i18n/config";
import { messagesByLocale as messages } from "@/i18n/messages";
import { SITE_NAME } from "@/lib/site";

/** "game.header.route", "pubgame.cards.draw"…: a raw key shown instead of its text. */
export const RAW_KEY = /\b(common|navigation|meta|home|errors|walks|game|guide|gps|pubgame)\.[a-z][A-Za-z]+(\.[A-Za-z0-9]+)*\b/;

/**
 * English interface texts that must not appear on a page in another language. Each
 * text is split at its {placeholders} ("Stop {current} / {total}" → "Stop"), and every
 * piece of at least 6 characters that the language translates differently counts
 * (shorter words and names can legitimately be the same in both languages). A piece the
 * language's own texts also use is no leak: a name kept on purpose ("Question Bitch",
 * a card role) or a word both languages share ("Question" in French).
 */
export function englishLeaksIn(locale: Locale, pageText: string): string[] {
  const english: string[] = [];
  const translated = new Set<string>();
  const collect = (node: unknown, into: (text: string) => void) => {
    if (typeof node === "string") into(node);
    else if (node && typeof node === "object") for (const value of Object.values(node)) collect(value, into);
  };
  collect(messages.en, (text) => english.push(text));
  collect(messages[locale], (text) => translated.add(text));
  const ownTexts = [...translated].join("\n");
  // Whole words only ("Antwerp" is not a leak inside "Antwerpen").
  const asWord = (piece: string) => new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(piece)}(?![\\p{L}\\p{N}])`, "u");
  return english
    .filter((text) => !translated.has(text))
    .flatMap((text) => text.split(/\{\w+\}/).map((piece) => piece.trim()))
    // Never the brand name.
    .filter((piece) => piece.length >= 6 && !SITE_NAME.includes(piece))
    .filter((piece) => asWord(piece).test(pageText) && !asWord(piece).test(ownTexts));
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
