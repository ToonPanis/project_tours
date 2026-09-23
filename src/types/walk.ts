import type { Clue } from "./clue";
import type { ContentStatus, ImageAsset, LanguageCode } from "./common";
import type { WalkLocation } from "./location";

export type Difficulty = "easy" | "moderate" | "challenging";

/**
 * Visual theme of a walk. Each theme overrides the color tokens in globals.css
 * via `data-walk-theme`, so components never need walk-specific conditions.
 */
export type WalkTheme = "classic" | "tavern";

/** Money is stored in cents to avoid floating-point rounding (and matches Stripe). */
export interface Price {
  amountInCents: number;
  currency: "EUR";
}

export interface DurationRange {
  minMinutes: number;
  maxMinutes: number;
}

/** A labelled fact for the detail page, e.g. { label: "Alcohol", value: "Not required" }. */
export interface PracticalInfoItem {
  label: string;
  value: string;
}

/**
 * "all": every stop is visible from the start.
 * "progressive": a stop's name stays hidden ("???") until it is unlocked.
 */
export type RouteReveal = "all" | "progressive";

/**
 * Flavour text used during play. Walks can override any line
 * (e.g. "The tavern has spoken."); defaults live in the walk-session feature.
 */
export interface GameCopy {
  voteResultTitle: string;
  tieTitle: string;
  tieSubtitle: string;
  afterVoteMessage: string;
  wrongAnswer: string;
  correctAnswer: string;
  nextLocationTitle: string;
  completionTitle: string;
  completionMessage: string;
}

export interface TeamSize {
  minPlayers: number;
  maxPlayers: number;
}

/** The fictional story that ties a walk together. Always presented as fiction. */
export interface WalkNarrative {
  title: string;
  premise: string;
}

/** The lightweight version of a walk, used in lists and cards. */
export interface WalkSummary {
  id: string;
  /** URL-friendly identifier, e.g. "the-17-gates". */
  slug: string;
  title: string;
  /** Short line shown under the title. */
  tagline: string;
  shortDescription: string;
  city: string;
  estimatedDuration: DurationRange;
  /** `null` while the route distance is still being researched. */
  distanceInMeters: number | null;
  difficulty: Difficulty;
  /** Price per team/group. */
  price: Price;
  coverImage?: ImageAsset;
  theme: WalkTheme;
  /** Main stops only; bonus stops are not counted. */
  locationCount: number;
  contentStatus: ContentStatus;
}

/** The full walk, including its route. Used on the detail page and during play. */
export interface Walk extends Omit<WalkSummary, "locationCount"> {
  description: string;
  languages: LanguageCode[];
  routeReveal: RouteReveal;
  team: TeamSize;
  copy?: Partial<GameCopy>;
  narrative?: WalkNarrative;
  /** "What to expect" bullet points. */
  highlights?: string[];
  /** Custom "How it works" steps. Falls back to default steps when omitted. */
  howItWorksSteps?: string[];
  practicalInfo?: PracticalInfoItem[];
  locations: WalkLocation[];
  /** Collectible clues. Walks without clues simply omit this. */
  clues?: Clue[];
}

/** A walk that is announced but not yet playable. Only basic info is known. */
export interface UpcomingWalk {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  city: string;
}
