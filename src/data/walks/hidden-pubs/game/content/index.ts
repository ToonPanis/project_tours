import type { Locale } from "@/i18n/config";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { nl } from "./nl";
import { ru } from "./ru";
import { uk } from "./uk";
import type { PubGameTexts } from "./types";

/** The public texts per language (questions, options, hints, tasks). Every language is complete (tested). */
export const pubGameTexts: Record<Locale, PubGameTexts> = { en, nl, fr, es, it, de, ru, uk };

export function getPubGameTexts(locale: Locale): PubGameTexts {
  return pubGameTexts[locale] ?? en;
}
