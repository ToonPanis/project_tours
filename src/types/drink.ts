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

export type AlcoholicDrinkOption = DrinkOption & { alcoholic: true };
export type AlcoholFreeDrinkOption = DrinkOption & { alcoholic: false };

/**
 * A team drink vote at a location: exactly two alcoholic options and one
 * alcohol-free option. The tuple type makes TypeScript enforce this rule:
 * a round without an alcohol-free option won't compile.
 *
 * The vote result is only a suggestion. Players can always choose the
 * alcohol-free option (or skip the round), and progress never depends on it.
 */
export interface DrinkRound {
  options: [AlcoholicDrinkOption, AlcoholicDrinkOption, AlcoholFreeDrinkOption];
}
