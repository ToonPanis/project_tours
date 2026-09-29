import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import type { LocalizedContent } from "@/i18n/content";
import { findStructureProblems } from "@/i18n/content-shape";
import { classicsContent } from "@/data/walks/classics-of-antwerp/content";
import { hiddenPubsContent } from "@/data/walks/hidden-pubs/content";
import { poortjesContent } from "@/data/walks/poortjes-van-antwerpen/content";

/** Every walk with texts per language. A translation must match English in structure. */
const walkContents: Record<string, LocalizedContent<unknown>> = {
  "poortjes-van-antwerpen": poortjesContent,
  "classics-of-antwerp": classicsContent,
  "hidden-pubs": hiddenPubsContent,
};

/** Hidden Pubs' ledger is written in Dutch, so Dutch needs no translation of it. */
const optionalKeysPerLocale: Partial<Record<string, string[]>> = { nl: ["translation"] };

describe.each(Object.entries(walkContents))("translations of %s", (_walk, content) => {
  const translated = locales.filter((locale) => locale !== "en" && content[locale] !== undefined);

  if (translated.length === 0) it.todo("no translations yet");

  it.each(translated)("%s has the same structure as English", (locale) => {
    expect(findStructureProblems(content.en, content[locale], optionalKeysPerLocale[locale])).toEqual([]);
  });
});
