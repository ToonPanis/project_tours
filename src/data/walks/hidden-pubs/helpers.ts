import type { Clue } from "@/types/clue";
import type { DrinkCategory, DrinkOption } from "@/types/drink";
import type { WalkLocation } from "@/types/location";

/** Every stop file exports its location and the clue it earns. */
export interface HiddenPubsStop {
  location: WalkLocation;
  clue: Clue;
}

interface DrinkInput {
  name: string;
  category: DrinkCategory;
  alcoholic: boolean;
  /** Defaults to "verified" (supplied by the project owner). */
  menuVerification?: DrinkOption["menuVerification"];
}

/** Builds a location's drink options with stable ids: "<location>-drink-a", "-b", … */
export function drinkOptions(locationId: string, drinks: DrinkInput[]): DrinkOption[] {
  return drinks.map((drink, index) => ({
    id: `${locationId}-drink-${String.fromCharCode(97 + index)}`,
    name: drink.name,
    category: drink.category,
    alcoholic: drink.alcoholic,
    menuVerification: drink.menuVerification ?? "verified",
  }));
}
