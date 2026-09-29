import type { GlossaryTerm, GuideClosing, GuideIntro, GuideSection, InfoBox, LookAtItem } from "@/types/guide";
import type { GameCopy, PracticalInfoItem } from "@/types/walk";

/**
 * Everything in "Poortjes van Antwerpen" that is written in a language.
 * Language-independent data (positions, statuses, sources, which drawing
 * belongs where) lives in stops.ts, collection.ts and the JSON files.
 * Images and drawings are referenced by id / plate number and resolved in
 * ../index.ts.
 */

/** A slide within a stop (e.g. "Het Stadhuis" at the Grote Markt). */
export interface CardText {
  id: string;
  title: string;
  subtitle?: string;
  /** Id of a reused Classics of Antwerp image (see stops.ts). */
  imageId?: string;
  sections: GuideSection[];
  didYouKnow?: string[];
}

export interface SearchTaskItemText {
  /** Plate number of the drawing to look for (see collection.ts). */
  plate: number;
  question: string;
  hints: string[];
  solution: string;
  explanation: string[];
}

export interface SearchTaskText {
  title: string;
  intro: string;
  items: SearchTaskItemText[];
  hideStoryUntilDone: boolean;
  outro?: string;
}

export interface PoortjesStopText {
  name: string;
  subtitle: string;
  /** "Wat zie je?": what to look at first. */
  introduction: string[];
  /** "Het verhaal", "Architectuur", … Each section says whether it is fact, interpretation, context or legend. */
  sections: GuideSection[];
  /** "Wist je dat?" */
  didYouKnow: string[];
  /** "Kijk eens naar…" */
  lookAt?: LookAtItem[];
  /** "Toen en nu": the drawing (1951) compared with today. */
  thenAndNow?: string[];
  /** Keys of `glossary` terms explained at this stop. */
  glossary?: string[];
  cards?: CardText[];
  searchTask?: SearchTaskText;
  infoBoxes?: InfoBox[];
  transitionToNext?: string;
  closing?: GuideClosing;
}

export interface ChapterText {
  id: string;
  title: string;
  intro: string;
  firstLocationId: string;
}

export interface ImageText {
  caption: string;
  alt: string;
  approximateYear: string;
}

/** The translatable part of a drawing in collection.ts (the book's caption stays Dutch). */
export interface CollectionItemText {
  title: string;
  note?: string;
  /** Replaces the address when it is a description, e.g. "Academy garden (from the Haverstraat)". */
  place?: string;
}

/** Texts around the drawings. {address}, {plate} and {title} are filled in. */
export interface DrawingTexts {
  alt: string;
  caption: string;
  rightsNote: string;
  unknownArtist: string;
  coverAlt: string;
}

export interface PoortjesContent {
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
    collection: { title: string; intro: string; sourceNote: string };
  };
  chapters: ChapterText[];
  stops: Record<string, PoortjesStopText>;
  glossary: Record<string, GlossaryTerm>;
  /** Captions for the reused Classics of Antwerp images. */
  images: Record<string, ImageText>;
  /** Titles and notes of the 52 drawings, by plate number. */
  collectionItems: Record<number, CollectionItemText>;
  drawings: DrawingTexts;
}
