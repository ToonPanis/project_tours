import type { Challenge } from "./challenge";
import type { ContentStatus, GeoCoordinates, ImageAsset } from "./common";

export type NearbyPlaceCategory =
  | "cafe"
  | "church"
  | "architecture"
  | "hidden-spot";

export interface NearbyPlace {
  id: string;
  name: string;
  category: NearbyPlaceCategory;
  description: string;
  address?: string;
}

/**
 * What the player must do before a location's content becomes available.
 * Only "none" is used for now; "proximity" is ready for GPS verification.
 */
export type UnlockCondition =
  | { type: "none" }
  | { type: "proximity"; radiusInMeters: number };

export interface WalkLocation {
  id: string;
  /** 1-based position in the route. */
  order: number;
  name: string;
  address: string;
  coordinates: GeoCoordinates;
  /** Short teaser, safe to show before the walk starts. */
  description: string;
  /** The full story, revealed during the walk. */
  story: string;
  image?: ImageAsset;
  challenge?: Challenge;
  unlockCondition: UnlockCondition;
  nearbyPlaces: NearbyPlace[];
  contentStatus: ContentStatus;
}
