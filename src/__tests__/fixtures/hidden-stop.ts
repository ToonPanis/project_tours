import type { WalkLocation } from "@/types/location";

/** Leading words a café name can be known without: "Café Den Engel" is also "Den Engel" and "Engel". */
const DROPPABLE_WORDS = /^(Café|Cafe|In|Den|De|Het|'t)\s+/i;

/**
 * Every text that would give a hidden stop away: its full name, the shorter forms
 * people use ("Den Engel", "Boer van Tienen"), and its street with house number.
 * Short forms under 6 characters are skipped ("Kat" also appears in ordinary text).
 */
export function revealingTexts(location: WalkLocation): (string | RegExp)[] {
  const names = [location.name];
  let shorter = location.name;
  while (DROPPABLE_WORDS.test(shorter)) {
    shorter = shorter.replace(DROPPABLE_WORDS, "");
    if (shorter.length >= 6) names.push(shorter);
  }
  // "Grote Markt 3, 2000 Antwerpen" → "Grote Markt 3" as a whole number (not the 3 of "Grote Markt 32").
  const streetAndNumber = location.address.split(",")[0].trim();
  const escaped = streetAndNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...names, new RegExp(`${escaped}(?!\\d)`)];
}

/** The revealing texts of `location` found in `text` (empty = it stays hidden). */
export function revealedIn(text: string, location: WalkLocation): string[] {
  return revealingTexts(location)
    .filter((token) => (typeof token === "string" ? text.includes(token) : token.test(text)))
    .map(String);
}
