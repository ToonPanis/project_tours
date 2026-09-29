import type { GuideClosing, GuideIntro, GuideSection, LookAtItem } from "@/types/guide";
import type { GameCopy, PracticalInfoItem } from "@/types/walk";

/**
 * Everything in Classics of Antwerp that is written in a language.
 * To add a language, copy content/en.ts to e.g. content/nl.ts and translate
 * it; all language-independent data (positions, images, sources) stays in
 * stops.ts and the generated JSON files.
 */
export interface StopText {
  name: string;
  subtitle: string;
  introduction: string[];
  sections: GuideSection[];
  didYouKnow: string[];
  lookAt?: LookAtItem[];
  transitionToNext?: string;
  closing?: GuideClosing;
}

export interface ImageText {
  caption: string;
  alt: string;
  approximateYear: string;
}

export interface ClassicsContent {
  walk: {
    title: string;
    tagline: string;
    shortDescription: string;
    description: string;
    highlights: string[];
    howItWorksSteps: string[];
    practicalInfo: PracticalInfoItem[];
    guideIntro: GuideIntro;
    copy: Partial<GameCopy>;
  };
  stops: Record<string, StopText>;
  images: Record<string, ImageText>;
}
