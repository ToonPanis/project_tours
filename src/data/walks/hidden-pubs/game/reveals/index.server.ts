import type { Locale } from "@/i18n/config";
import type { PubGameReveals } from "../content/types";
import { revealsDe } from "./de";
import { revealsEn } from "./en";
import { revealsEs } from "./es";
import { revealsFr } from "./fr";
import { revealsIt } from "./it";
import { revealsNl } from "./nl";
import { revealsRu } from "./ru";
import { revealsUk } from "./uk";

/**
 * SERVER ONLY: explanations and fun facts give answers away, so only
 * src/features/pub-game/server/ may import this (pub-game-data.test.ts checks
 * it). The server hands them out per question/café once that part is finished.
 */
export const pubGameReveals: Record<Locale, PubGameReveals> = {
  en: revealsEn,
  nl: revealsNl,
  fr: revealsFr,
  es: revealsEs,
  it: revealsIt,
  de: revealsDe,
  ru: revealsRu,
  uk: revealsUk,
};
