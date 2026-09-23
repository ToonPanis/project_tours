import type { ContentStatus, ImageAsset } from "./common";
import type { WalkLocation } from "./location";

export type Difficulty = "easy" | "moderate" | "challenging";

/** Money is stored in cents to avoid floating-point rounding (and matches Stripe). */
export interface Price {
  amountInCents: number;
  currency: "EUR";
}

/** The lightweight version of a walk, used in lists and cards. */
export interface WalkSummary {
  id: string;
  /** URL-friendly identifier, e.g. "the-17-gates". */
  slug: string;
  title: string;
  /** Short line shown under the title, e.g. "A route along historic doorways". */
  tagline: string;
  shortDescription: string;
  city: string;
  durationInMinutes: number;
  distanceInMeters: number;
  difficulty: Difficulty;
  /** Price per team/group. */
  price: Price;
  coverImage?: ImageAsset;
  locationCount: number;
  contentStatus: ContentStatus;
}

/** The full walk, including its route. Used on the detail page and during play. */
export interface Walk extends Omit<WalkSummary, "locationCount"> {
  description: string;
  locations: WalkLocation[];
}

/** A walk that is announced but not yet playable. Only basic info is known. */
export interface UpcomingWalk {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  city: string;
}
