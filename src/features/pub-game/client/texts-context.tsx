"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PubGameTexts } from "@/data/walks/hidden-pubs/game/content/types";
import type { UploadMode } from "./upload";

/**
 * What the server page knows and the game screens need:
 * - the game's public texts (questions, options, hints, tasks) in the player's
 *   language; switching the language re-renders the page with new texts;
 * - how photos and videos are uploaded on this deployment.
 */
interface PubGameSettings {
  texts: PubGameTexts;
  uploadMode: UploadMode;
}

const SettingsContext = createContext<PubGameSettings | null>(null);

export function PubGameTextsProvider({ texts, uploadMode = "direct", children }: { texts: PubGameTexts; uploadMode?: UploadMode; children: ReactNode }) {
  return <SettingsContext.Provider value={{ texts, uploadMode }}>{children}</SettingsContext.Provider>;
}

function useSettings(): PubGameSettings {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error("The game screens need a <PubGameTextsProvider>");
  return settings;
}

export function usePubGameTexts(): PubGameTexts {
  return useSettings().texts;
}

export function useUploadMode(): UploadMode {
  return useSettings().uploadMode;
}
