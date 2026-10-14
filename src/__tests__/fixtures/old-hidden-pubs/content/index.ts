import type { LocalizedContent } from "@/i18n/content";
import { hiddenPubsContentDe } from "./de";
import { hiddenPubsContentEn } from "./en";
import { hiddenPubsContentEs } from "./es";
import { hiddenPubsContentFr } from "./fr";
import { hiddenPubsContentIt } from "./it";
import { hiddenPubsContentNl } from "./nl";
import { hiddenPubsContentRu } from "./ru";
import { hiddenPubsContentUk } from "./uk";
import type { HiddenPubsContent } from "./types";

/**
 * All languages of Hidden Pubs. English is the master; a language that is
 * missing (or missing a part) shows the English text instead.
 * To add a language: create content/<lang>.ts and list it here.
 */
export const hiddenPubsContent: LocalizedContent<HiddenPubsContent> = {
  en: hiddenPubsContentEn,
  nl: hiddenPubsContentNl,
  fr: hiddenPubsContentFr,
  es: hiddenPubsContentEs,
  it: hiddenPubsContentIt,
  de: hiddenPubsContentDe,
  ru: hiddenPubsContentRu,
  uk: hiddenPubsContentUk,
};
