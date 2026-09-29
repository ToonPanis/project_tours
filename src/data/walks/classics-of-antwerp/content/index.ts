import type { LocalizedContent } from "@/i18n/content";
import { classicsContentDe } from "./de";
import { classicsContentEn } from "./en";
import { classicsContentEs } from "./es";
import { classicsContentFr } from "./fr";
import { classicsContentIt } from "./it";
import { classicsContentNl } from "./nl";
import { classicsContentRu } from "./ru";
import { classicsContentUk } from "./uk";
import type { ClassicsContent } from "./types";

/**
 * All languages of Classics of Antwerp. English is the master; a language
 * that is missing (or missing a part) shows the English text instead.
 * To add a language: create content/<lang>.ts and list it here.
 */
export const classicsContent: LocalizedContent<ClassicsContent> = {
  en: classicsContentEn,
  nl: classicsContentNl,
  fr: classicsContentFr,
  es: classicsContentEs,
  it: classicsContentIt,
  de: classicsContentDe,
  ru: classicsContentRu,
  uk: classicsContentUk,
};
