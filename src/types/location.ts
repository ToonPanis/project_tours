import type { Challenge } from "./challenge";
import type { GeoCoordinates, ImageAsset } from "./common";
import type { ContentBlock } from "./content";
import type { DrinkRound } from "./drink";
import type { HistoricalReveal } from "./reveal";

/** What kind of place a location is. (Whether it's a bonus stop is a separate flag.) */
export type LocationType =
  | "pub"
  | "historic-pub"
  | "historic-building"
  | "street"
  | "alley"
  | "square"
  | "church"
  | "landmark"
  | "brewery-history"
  | "hidden-location"
  | "gateway";

export type NearbyPlaceCategory =
  | "cafe"
  | "pub"
  | "church"
  | "architecture"
  | "hidden-spot";

export interface NearbyPlace {
  id: string;
  name: string;
  category: NearbyPlaceCategory;
  description: string;
  address?: string;
  // Later: `partnership?: {...}` for partner offers. Not implemented yet.
}

/**
 * A suggested café/pub break. Always optional: the walk never requires
 * visiting, buying or drinking anything.
 */
export interface OptionalBreak {
  place: NearbyPlace;
  walkingMinutes: number;
  /** E.g. "You don't need to visit this café to continue the walk." */
  note: string;
}

/**
 * What the player must do before a location's content becomes available.
 * Only "none" is used for now; "proximity" is ready for GPS verification.
 */
export type UnlockCondition =
  | { type: "none" }
  | { type: "proximity"; radiusInMeters: number };

export interface LocationImages {
  historical?: ImageAsset;
  current?: ImageAsset;
}

export interface WalkLocation {
  id: string;
  /** 1-based position in the route. */
  order: number;
  name: string;
  type: LocationType;
  /** Bonus stops are optional and don't count towards route progress. */
  isBonus?: boolean;
  address: string;
  /** `null` until the exact position has been researched. Never guess coordinates. */
  coordinates: GeoCoordinates | null;
  /** Short introduction, safe to show before the walk starts. */
  description: string;
  /** History, legends and story fragments, revealed during the walk. */
  content: ContentBlock[];
  images?: LocationImages;
  /** What to look at on site, e.g. "Look up at the facade". */
  observationPrompt?: string;
  /** Team drink vote at this location (e.g. Hidden Pubs cafés). */
  drinkRound?: DrinkRound;
  challenge?: Challenge;
  /** Optional extra question after the main challenge. Never blocks progress. */
  bonusChallenge?: Challenge;
  /** Real history, revealed after the challenge is solved. */
  historicalReveal?: HistoricalReveal;
  unlockCondition: UnlockCondition;
  nearbyPlaces: NearbyPlace[];
  optionalBreak?: OptionalBreak;
  /** E.g. "Cobblestones and three steps at the entrance". */
  accessibilityNotes?: string;
}
