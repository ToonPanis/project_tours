import type { Source } from "./content";
import type { VerificationStatus } from "./reveal";

/**
 * Content types for GUIDE walks (e.g. Classics of Antwerp): a premium
 * digital city guide instead of a game. No challenges, clues or scores.
 */

/** A (historical) image with the metadata needed to use it legally. */
export interface GuideImage {
  id: string;
  /** Local path under /public, e.g. "/images/classics/het-steen/historical-photochrom.jpg". */
  src: string;
  width: number;
  height: number;
  /** Describes what the image shows (for screen readers). */
  alt: string;
  /** Shown under the image, e.g. "Het Steen and the harbour, 1890s". */
  caption: string;
  approximateYear: string;
  photographerOrArtist: string;
  /** Where we got it, e.g. "Wikimedia Commons". */
  source: string;
  sourceUrl: string;
  /** Original file URL. */
  imageUrl: string;
  license: string;
  licenseUrl?: string;
  isHistorical: boolean;
}

/**
 * One part of a stop's story. The kind keeps apart:
 * - "history": documented facts (with sources)
 * - "interpretation": a likely (architectural) reading, not proven
 * - "context": general background of the period or neighbourhood
 * - "legend": a story that is not history
 */
export interface GuideSection {
  heading?: string;
  kind: "history" | "legend" | "interpretation" | "context";
  paragraphs: string[];
}

/** What is left today of a place or object; shown as a status badge. */
export type HeritageStatus = "exists" | "vanished" | "in-renovation" | "optional" | "unknown";

/**
 * One item of a walk's historical collection, e.g. one drawing of a gate
 * from a book. Vanished items stay in the collection, but the route never
 * leads to them.
 */
export interface CollectionItem {
  id: string;
  /** The walk's own numbering (e.g. gate 17 of 50). Undefined for extra items outside that list. */
  number?: number;
  /** Plate number in the source publication. */
  plateNumber: number;
  /** Title as printed in the source. */
  title: string;
  /** Address as printed in the source (house numbers may have changed since). */
  address: string;
  status: HeritageStatus;
  image: GuideImage;
  /** Chapter of the walk this item belongs to; null for items far from the route. */
  chapterId: string | null;
  /** The physical stop where this item is shown; null when the route doesn't pass it. */
  stopId: string | null;
  /** Literal transcription of the caption in the source. */
  sourceCaption: string;
  /** Language of `sourceCaption` (it is quoted, never translated), e.g. "nl". Rendered as `lang`. */
  sourceCaptionLanguage?: string;
  /** Extra explanation, e.g. "The house number has changed since 1951". */
  note?: string;
  verification: VerificationStatus;
}

export interface WalkCollection {
  title: string;
  intro: string;
  /** Which publication the collection comes from. */
  sourceNote: string;
  items: CollectionItem[];
}

/** A part of the route with its own character, introduced by a chapter card. */
export interface WalkChapter {
  id: string;
  number: number;
  title: string;
  intro: string;
  /** The chapter card is shown when the walker sets off towards this stop. */
  firstLocationId: string;
}

/** A separate "slide" within a stop, e.g. about the City Hall at the Grote Markt stop. */
export interface GuideCard {
  id: string;
  title: string;
  subtitle?: string;
  image?: GuideImage;
  sections: GuideSection[];
  didYouKnow?: string[];
}

/** One drawing to find or identify on site. */
export interface SearchTaskItem {
  id: string;
  drawing: CollectionItem;
  question: string;
  /** Revealed one at a time. */
  hints: string[];
  solution: string;
  /** Shown once the solution is revealed. */
  explanation: string[];
}

/** A small, never-blocking search assignment: look, compare, then reveal. */
export interface SearchTask {
  title: string;
  intro: string;
  items: SearchTaskItem[];
  /** True when the stop's story would give the answer away: it is shown after the task. */
  hideStoryUntilDone: boolean;
  outro?: string;
}

/** Practical information: a pause, a museum visit, access to a garden… */
export interface InfoBox {
  kind: "pause" | "visit" | "access";
  title: string;
  paragraphs: string[];
  /** When the information was last checked, e.g. "26 september 2026". */
  checkedOn?: string;
  sourceUrl?: string;
}

/** A difficult term explained in a sentence. */
export interface GlossaryTerm {
  term: string;
  definition: string;
}

/** Something worth looking at on the spot ("👀 Look at this"). */
export interface LookAtItem {
  title: string;
  body: string;
}

/** A historical/modern image pair for the THEN / NOW comparison. */
export interface ThenNowPair {
  then: GuideImage;
  now: GuideImage;
}

/** The ending of a walk: a look back over the whole journey. */
export interface GuideClosing {
  /** The journey back in time, e.g. ["20th century", "19th century", …]. */
  timeline: string[];
  finalLines: string[];
}

export interface GuideStopContent {
  /** One-line hook under the name, e.g. "The cathedral Antwerp almost made even bigger". */
  subtitle: string;
  /** "Before you stands…": what the visitor sees. */
  introduction: string[];
  sections: GuideSection[];
  /** "💡 Did you know?": 1 to 3 surprising facts. */
  didYouKnow: string[];
  lookAt?: LookAtItem[];
  /** The first image is the hero image of the stop. */
  images: GuideImage[];
  thenNow?: ThenNowPair;
  /** 1–3 sentences leading to the next stop. */
  transitionToNext?: string;
  closing?: GuideClosing;
  /** How well the historical content has been checked, and against which sources. */
  verification: VerificationStatus;
  sources: Source[];

  // ── Optional extras (any guide walk can use them) ──────────────────────
  /** Status badge of the stop itself, e.g. "in-renovation". */
  status?: HeritageStatus;
  /** Collection items (e.g. gate drawings) that can be seen at this stop. */
  featuredItems?: CollectionItem[];
  /** Vanished collection items nearby, mentioned without walking to them. */
  vanishedNearby?: CollectionItem[];
  /** "Then and now": the drawing compared with today. */
  thenAndNow?: string[];
  glossary?: GlossaryTerm[];
  cards?: GuideCard[];
  searchTask?: SearchTask;
  infoBoxes?: InfoBox[];
}

/** Texts for a guide walk's start screen. */
export interface GuideIntro {
  quote: string;
  categoryLabel: string;
  footnote: string;
}
