import type { GuideClosing, GuideIntro, GuideSection, InfoBox, LookAtItem } from "@/types/guide";
import type { WalkCopy, PracticalInfoItem } from "@/types/walk";

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
  /** Texts of the slides listed in stops.ts, by card id. */
  cards?: Record<string, CardText>;
  /** Texts of the optional stories listed in stops.ts, by card id. */
  moreStories?: Record<string, CardText>;
  /** Titles of the image galleries listed in stops.ts, by gallery id (captions are with the images). */
  galleries?: Record<string, GalleryText>;
  /** Practical information, e.g. what can be visited (always with checkedOn and a source). */
  infoBoxes?: InfoBox[];
  /**
   * The texts of a quest (stops.ts says where and which clue). `name` and `subtitle`
   * above are then shown BEFORE the place is found, so they must not give it away.
   */
  quest?: QuestText;
}

/** Spooky's task. For "find the place", nothing here may name the answer, except `revealedName`. */
export interface QuestText {
  title: string;
  task: string[];
  /** Find the place only: shown with the search circle, e.g. "The building is somewhere inside this zone." */
  zoneHint?: string;
  /** Find the place only: the stop's real name, shown once it is found. */
  revealedName?: string;
}

/** The text of one slide ("card") within a stop. */
export interface CardText {
  title: string;
  subtitle?: string;
  sections: GuideSection[];
  didYouKnow?: string[];
}

export interface GalleryText {
  title: string;
  intro?: string;
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
    copy: Partial<WalkCopy>;
  };
  stops: Record<string, StopText>;
  images: Record<string, ImageText>;
}
