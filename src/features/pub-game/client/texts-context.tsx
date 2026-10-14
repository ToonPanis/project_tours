"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PubGameTexts } from "@/data/walks/hidden-pubs/game/content/types";

/**
 * The game's public texts (questions, options, hints, tasks) in the player's
 * language. The server page picks the language and passes them in, like every
 * other walk; switching the language re-renders the page with new texts.
 */
const TextsContext = createContext<PubGameTexts | null>(null);

export function PubGameTextsProvider({ texts, children }: { texts: PubGameTexts; children: ReactNode }) {
  return <TextsContext.Provider value={texts}>{children}</TextsContext.Provider>;
}

export function usePubGameTexts(): PubGameTexts {
  const texts = useContext(TextsContext);
  if (!texts) throw new Error("usePubGameTexts needs a <PubGameTextsProvider>");
  return texts;
}
