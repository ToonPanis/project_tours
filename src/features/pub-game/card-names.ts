import type { Rank } from "@/types/pub-game";

/**
 * The Drunken Bastard card names from the concept. They stay in English in
 * every language, like the original game (D16); the explanation of each card
 * is translated (pubgame.cards.effects.*).
 */
export const CARD_NAMES: Record<Rank, string> = {
  "2": "2 for You",
  "3": "3 for Me",
  "4": "4 to the Floor",
  "5": "5 for the Wives",
  "6": "6 for the Dicks",
  "7": "7 to Heaven",
  "8": "Pick a Mate",
  "9": "Rhyme",
  "10": "Categories",
  J: "Create a Rule",
  Q: "Question Bitch",
  K: "Thumb King",
  A: "Beunaas",
};
