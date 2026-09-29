import { describe, expect, test } from "vitest";
import { getWalks } from "@/data/walks";
import { locales } from "@/i18n/config";

/**
 * The stop pages use a list item's text as its React key (paragraphs, facts,
 * hints, options…: these have no ids). That is only safe while no list contains the
 * same text twice, so every list of texts in every walk and language must be unique.
 */
function findDuplicateTexts(value: unknown, path: string, found: string[]): string[] {
  if (Array.isArray(value)) {
    const texts = value.filter((item): item is string => typeof item === "string");
    const duplicates = texts.filter((text, index) => texts.indexOf(text) !== index);
    if (duplicates.length > 0) found.push(`${path}: "${duplicates[0].slice(0, 60)}"`);
    value.forEach((item, index) => findDuplicateTexts(item, `${path}[${index}]`, found));
  } else if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) findDuplicateTexts(child, `${path}.${key}`, found);
  }
  return found;
}

describe.each(locales)("[%s] lists of texts have no repeated entries", (locale) => {
  test.each(getWalks(locale).map((walk) => [walk.slug, walk] as const))("%s", (_slug, walk) => {
    expect(findDuplicateTexts(walk, walk.slug, [])).toEqual([]);
  });
});
