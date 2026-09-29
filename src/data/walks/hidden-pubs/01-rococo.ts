import type { HiddenPubsStop } from "./helpers";

/** Stop 1. Texts per language: content/<lang>.ts → stops["pubs-rococo"]. */
export const rococo: HiddenPubsStop = {
  id: "pubs-rococo",
  order: 1,
  name: "Rococo Antwerp",
  type: "pub",
  address: "Grote Markt 32, 2000 Antwerpen",

  drinks: [
    { category: "cocktail", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "soft-drink", alcoholic: false },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {}, // narration: "You have been handed a damaged old tavern ledger…"
    { ledger: "\"Wie Antwerpen wil begrijpen, moet omhoog kijken.\nNiet alles wat oud lijkt, is wat het lijkt.\"" },
    { ledger: "\"Zoek de Engel aan de andere zijde van de markt.\"", revealAt: "solved" },
  ],

  challenge: {
    id: "pubs-challenge-rococo",
    type: "multiple-choice",
    // PLAYTEST ANSWER: to be confirmed on site.
    correctOptionIndex: 0,
    researchStatus: "on-site-verification-required",
  },

  historicalReveal: { status: "research-required", sources: [] },

  unlockCondition: { type: "none" },
  clue: { id: "pubs-clue-stair", icon: "key" },
};
