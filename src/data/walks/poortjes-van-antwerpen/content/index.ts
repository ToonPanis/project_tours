import type { LocalizedContent } from "@/i18n/content";
import { poortjesContentDe } from "./de";
import { poortjesContentEn } from "./en";
import { poortjesContentEs } from "./es";
import { poortjesContentFr } from "./fr";
import { poortjesContentIt } from "./it";
import { poortjesContentNl } from "./nl";
import { poortjesContentRu } from "./ru";
import { poortjesContentUk } from "./uk";
import type { PoortjesContent } from "./types";

/**
 * All languages of Poortjes van Antwerpen. English is the master (translated
 * from the Dutch original); a language that is missing (or missing a part)
 * shows the English text instead.
 * To add a language: create content/<lang>/ and list it here.
 */
export const poortjesContent: LocalizedContent<PoortjesContent> = {
  en: poortjesContentEn,
  nl: poortjesContentNl,
  fr: poortjesContentFr,
  es: poortjesContentEs,
  it: poortjesContentIt,
  de: poortjesContentDe,
  ru: poortjesContentRu,
  uk: poortjesContentUk,
};
