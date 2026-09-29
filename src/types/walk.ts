import type { Challenge } from "./challenge";
import type { Clue } from "./clue";
import type { StoryBlock } from "./content";
import type { GuideIntro, WalkChapter, WalkCollection } from "./guide";
import type { ContentStatus, ImageAsset, LanguageCode } from "./common";
import type { WalkLocation } from "./location";
import type { RouteLeg } from "./navigation";

export type Difficulty = "easy" | "moderate" | "challenging";

/**
 * Visual theme of a walk. Each theme overrides the color tokens in globals.css
 * via `data-walk-theme`, so components never need walk-specific conditions.
 */
export type WalkTheme = "classic" | "tavern" | "archive";

/**
 * "game": an interactive walk (challenges, clues, votes…).
 * "guide": a narrated city guide with no game elements.
 */
export type WalkExperience = "game" | "guide";

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
export interface WalkCopy {
  voteResultTitle: string;
  tieTitle: string;
  tieSubtitle: string;
  afterVoteMessage: string;
  wrongAnswer: string;
  correctAnswer: string;
  nextLocationTitle: string;
  completionTitle: string;
  completionMessage: string;
  /** Label of the button that starts the walk, e.g. "Start adventure". */
  startLabel: string;
  /** Shown when a clue is added, e.g. "The ledger has changed". */
  clueCollectedTitle: string;
  /** Heading of the route list, e.g. "Taverns". */
  locationsTitle: string;
  /** Completion stat label, e.g. "taverns discovered". */
  locationsDiscoveredLabel: string;
  /** The button that opens the route panel, e.g. "Route", or "Ledger" in Hidden Pubs. */
  routeButtonLabel: string;
}

/**
 * An optional final puzzle after the last location: several questions that
 * test what the team remembers, followed by a closing story.
 */
export interface WalkFinale {
  title: string;
  intro: string;
  questions: Challenge[];
  /** Fiction shown once the finale is solved. */
  closingStory: StoryBlock[];
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
  /** URL-friendly identifier, e.g. "poortjes-van-antwerpen". */
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
  experience: WalkExperience;
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
  copy?: Partial<WalkCopy>;
  narrative?: WalkNarrative;
  /** "What to expect" bullet points. */
  highlights?: string[];
  /** Custom "How it works" steps. Falls back to default steps when omitted. */
  howItWorksSteps?: string[];
  practicalInfo?: PracticalInfoItem[];
  locations: WalkLocation[];
  finale?: WalkFinale;
  /** Start-screen texts for guide walks. */
  guideIntro?: GuideIntro;
  /** Pre-calculated walking routes between consecutive locations. */
  routeLegs?: RouteLeg[];
  /** Collectible clues. Walks without clues simply omit this. */
  clues?: Clue[];
  /** Parts of the route with their own character, each introduced by a chapter card. */
  chapters?: WalkChapter[];
  /** Historical collection shown alongside the route (e.g. all drawn gates, also vanished ones). */
  collection?: WalkCollection;
}

/** A walk that is announced but not yet playable. Only basic info is known. */
export interface UpcomingWalk {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  city: string;
}
