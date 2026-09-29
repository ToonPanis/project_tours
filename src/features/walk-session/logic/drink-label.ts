import type { Translator } from "@/i18n/translate";
import type { DrinkOption } from "@/types/drink";

/**
 * A drink's name as shown to players. A drink that is not yet confirmed on
 * the café's menu gets a visible "(check the menu)" in the visitor's language,
 * so an unverified drink is never presented as fact.
 */
export function getDrinkLabel(option: DrinkOption, t: Translator): string {
  return option.menuVerification === "to-verify" ? t("game.voting.drinkToVerify", { name: option.name }) : option.name;
}
