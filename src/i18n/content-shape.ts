/**
 * Every translation of a walk must have exactly the same structure as the
 * English master: the same stops, the same number of paragraphs, hints and
 * list items, and the same technical values (ids, plate numbers, section
 * kinds, glossary keys, links). Only the texts differ.
 *
 * Used by src/__tests__/i18n-walk-content.test.ts.
 */

/** Keys whose value is data, not text: it must be identical in every language. */
const TECHNICAL_KEYS = new Set([
  "id",
  "plate",
  "kind",
  "firstLocationId",
  "checkedOn",
  "sourceUrl",
  "imageId",
  "hideStoryUntilDone",
  "glossary",
  "verification",
  "originalLanguage",
]);

function compareShape(master: unknown, translation: unknown, path: string, problems: string[], optionalKeys: string[]) {
  const lastKey = path.split(".").pop() ?? "";
  if (translation === undefined) {
    if (!optionalKeys.includes(lastKey)) problems.push(`missing ${path}`);
    return;
  }
  // (A walk's glossary dictionary is text; a stop's `glossary` list of keys is data.)
  if (TECHNICAL_KEYS.has(lastKey) && (lastKey !== "glossary" || Array.isArray(master))) {
    if (JSON.stringify(master) !== JSON.stringify(translation)) problems.push(`changed ${path}`);
    return;
  }
  if (typeof master === "string") {
    if (typeof translation !== "string") problems.push(`not a text ${path}`);
    else if (!translation.trim()) problems.push(`empty ${path}`);
    return;
  }
  if (Array.isArray(master)) {
    if (!Array.isArray(translation) || translation.length !== master.length) {
      problems.push(`different length ${path}`);
      return;
    }
    master.forEach((item, index) => compareShape(item, translation[index], `${path}[${index}]`, problems, optionalKeys));
    return;
  }
  if (typeof master === "object" && master !== null) {
    if (typeof translation !== "object" || translation === null) {
      problems.push(`not an object ${path}`);
      return;
    }
    for (const [key, value] of Object.entries(master)) {
      compareShape(value, (translation as Record<string, unknown>)[key], path ? `${path}.${key}` : key, problems, optionalKeys);
    }
    for (const key of Object.keys(translation)) {
      if (!(key in master)) problems.push(`extra ${path ? `${path}.` : ""}${key}`);
    }
    return;
  }
  if (master !== translation) problems.push(`changed ${path}`);
}

/**
 * Lists every difference in structure between a translation and the English
 * master. `optionalKeys` may be missing in the translation (e.g. the ledger
 * `translation` for Dutch, the ledger's own language).
 */
export function findStructureProblems(master: unknown, translation: unknown, optionalKeys: string[] = []): string[] {
  const problems: string[] = [];
  compareShape(master, translation, "", problems, optionalKeys);
  return problems;
}
