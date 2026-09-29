import type { WalkCopy, PracticalInfoItem, WalkNarrative } from "@/types/walk";

/**
 * Everything in Hidden Pubs that is written in a language. The game data
 * (answers, coordinates, drink categories, clue icons…) lives in the stop
 * files 01-rococo.ts … 08-boer-van-tienen.ts and finale.ts.
 *
 * The tavern ledger is an in-world Dutch document: its original text stays
 * in the stop files, and each language adds a `translation` here.
 */

/** One story block, in the same order as `story` in the stop file. */
export interface StoryText {
  chapterTitle?: string;
  /** Narration that is not part of the ledger (e.g. "The final lines were written in haste."). */
  body?: string;
  /** Translation of the Dutch ledger text. Not shown to Dutch visitors. */
  translation?: string;
}

export interface ChallengeText {
  title: string;
  instruction?: string;
  question: string;
  /** Multiple choice only: the options, in the same order as in the stop file. */
  options?: string[];
  hints: string[];
  explanation?: string;
}

export interface HiddenPubsStopText {
  /** "Chapter I: The First Page." */
  description: string;
  /** Drink names in the same order as `drinks` in the stop file (brand names stay as they are). */
  drinks: string[];
  story: StoryText[];
  challenge: ChallengeText;
  bonusChallenge?: ChallengeText;
  historicalReveal: {
    paragraphs: string[];
    /** Source titles, in the same order as the sources in the stop file. */
    sources: string[];
  };
  clue: { title: string; value: string };
}

export interface HiddenPubsContent {
  walk: {
    tagline: string;
    shortDescription: string;
    description: string;
    copy: Partial<WalkCopy>;
    narrative: WalkNarrative;
    highlights: string[];
    howItWorksSteps: string[];
    practicalInfo: PracticalInfoItem[];
  };
  stops: Record<string, HiddenPubsStopText>;
  finale: {
    title: string;
    intro: string;
    /** In the same order as the questions in finale.ts. */
    questions: ChallengeText[];
    closingStory: StoryText[];
  };
}
