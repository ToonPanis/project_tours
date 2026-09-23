import type { ImageAsset } from "./common";

export type DrinkCategory =
  | "beer"
  | "special-beer"
  | "wine"
  | "cocktail"
  | "soft-drink"
  | "coffee"
  | "alcohol-free-beer"
  | "local-specialty";

export interface DrinkOption {
  id: string;
  name: string;
  description?: string;
  category: DrinkCategory;
  alcoholic: boolean;
  alcoholPercentage?: number;
  image?: ImageAsset;
  /** "to-verify" until the café's menu has been checked. Never present unverified drinks as fact. */
  menuVerification: "verified" | "to-verify";
}

/**
 * A team drink vote at a location, usually four options. Rules (checked by
 * the walk data tests, since data will later come from a database):
 * - at least one option is alcohol-free;
 * - no shots.
 *
 * The vote result is only a suggestion. Players can always choose an
 * alcohol-free drink (or skip the round), and progress never depends on it.
 */
export interface DrinkRound {
  options: DrinkOption[];
}
