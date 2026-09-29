/**
 * Checks that every language has every interface text that English has.
 *
 *   npm run i18n:check
 *
 * English (src/i18n/locales/en) is the master. For every other language it
 * reports:
 *   - missing keys           (the app then shows English: fine for a while, but translate them)
 *   - extra keys             (probably a typo or a key that English no longer has)
 *   - empty texts
 *   - lost {placeholders}    (e.g. English "Stop {stop} of {total}" but the translation has no {total})
 *   - extra {placeholders}   (a name English doesn't pass: the visitor would see "{name}" literally)
 *   - plural forms           every form the language needs (Intl.PluralRules: Russian needs
 *                            one/few/many/other), and no forms it never uses
 * (Plural forms are checked for English too.)
 *
 * Walk content (the tours themselves) is checked by the test
 * src/__tests__/i18n-walk-content.test.ts.
 *
 * Exits with code 1 when something is missing, so it can run in CI.
 */
import { readdirSync, readFileSync } from "node:fs";

const LOCALES_DIR = new URL("../src/i18n/locales/", import.meta.url);
const MASTER = "en";
const PLURAL_FORMS = new Set(["zero", "one", "two", "few", "many", "other"]);

const isPlural = (node) =>
  node && typeof node === "object" && "other" in node && Object.keys(node).every((key) => PLURAL_FORMS.has(key));

/** { "a": { "b": "x" } } → Map { "a.b" → "x" }; plural messages stay one entry. */
function flatten(node, prefix = "", result = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string" || isPlural(value)) result.set(path, value);
    else if (value && typeof value === "object") flatten(value, path, result);
  }
  return result;
}

function loadLocale(locale) {
  const dir = new URL(`${locale}/`, LOCALES_DIR);
  const messages = {};
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".json"))) {
    messages[file.replace(/\.json$/, "")] = JSON.parse(readFileSync(new URL(file, dir), "utf8"));
  }
  return flatten(messages);
}

const placeholders = (text) => new Set([...String(text).matchAll(/\{(\w+)\}/g)].map((match) => match[1]));
const textsOf = (value) => (typeof value === "string" ? [value] : Object.values(value));

const locales = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const master = loadLocale(MASTER);
let problemCount = 0;

console.log(`Master: ${MASTER} (${master.size} texts)\n`);

/**
 * Plural forms the language needs that are missing, and forms it never uses.
 * "Needed" = used for some count from 0 to 1000 (stops, hours, votes). French, Spanish
 * and Italian also have a "many" form, but only for whole millions ("un million de…"):
 * the app falls back to "other" there, so it isn't required.
 */
function pluralProblems(locale, key, value) {
  const rules = new Intl.PluralRules(locale);
  const needed = [...new Set(Array.from({ length: 1001 }, (_, count) => rules.select(count)))];
  const existing = rules.resolvedOptions().pluralCategories;
  const given = Object.keys(value);
  return [
    ...needed.filter((form) => !given.includes(form)).map((form) => `plural form  ${key} (missing "${form}")`),
    ...given.filter((form) => !existing.includes(form)).map((form) => `plural form  ${key} ("${form}" doesn't exist in ${locale})`),
  ];
}

const masterProblems = [...master].flatMap(([key, value]) => (isPlural(value) ? pluralProblems(MASTER, key, value) : []));
problemCount += masterProblems.length;
if (masterProblems.length > 0) console.log(`✗ ${MASTER}: ${masterProblems.length} problem(s)`);
for (const problem of masterProblems) console.log(`    ${problem}`);

for (const locale of locales.filter((name) => name !== MASTER)) {
  const messages = loadLocale(locale);
  const problems = [];

  for (const [key, masterValue] of master) {
    const value = messages.get(key);
    if (value === undefined) {
      problems.push(`missing      ${key}`);
      continue;
    }
    if (textsOf(value).some((text) => !String(text).trim())) problems.push(`empty        ${key}`);
    if (isPlural(masterValue) !== isPlural(value)) problems.push(`plural shape ${key}`);
    else if (isPlural(value)) problems.push(...pluralProblems(locale, key, value));

    const expected = new Set(textsOf(masterValue).flatMap((text) => [...placeholders(text)]));
    const found = new Set(textsOf(value).flatMap((text) => [...placeholders(text)]));
    // {count} may be left out (e.g. "one ticket" instead of "1 ticket").
    for (const name of expected) if (!found.has(name) && name !== "count") problems.push(`lost {${name}} ${key}`);
    for (const name of found) if (!expected.has(name)) problems.push(`extra {${name}} ${key}`);
  }
  for (const key of messages.keys()) if (!master.has(key)) problems.push(`extra        ${key}`);

  problemCount += problems.length;
  console.log(problems.length === 0 ? `✓ ${locale}: complete (${messages.size} texts)` : `✗ ${locale}: ${problems.length} problem(s)`);
  for (const problem of problems) console.log(`    ${problem}`);
}

if (problemCount > 0) {
  console.log(`\n${problemCount} problem(s). Missing texts are shown in English until they are translated.`);
  process.exit(1);
}
console.log("\nAll languages have every text.");
