import type { HiddenPubsStop } from "./helpers";

/** Stop 8. Texts per language: content/<lang>.ts → stops["pubs-boer-van-tienen"]. */
export const boerVanTienen: HiddenPubsStop = {
  id: "pubs-boer-van-tienen",
  order: 8,
  name: "In Den Boer van Tienen",
  type: "historic-pub",
  address: "Mechelseplein 6, 2000 Antwerpen",

  drinks: [
    { category: "beer", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "beer", alcoholic: true },
    { category: "soft-drink", alcoholic: false },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {
      ledger:
        "\"Jullie hebben mijn route gevolgd.\n\nJullie hebben gedronken waar Antwerpenaren dronken.\n\nGekeken waar kunstenaars keken.\n\nEn gezocht waar anderen voorbijliepen.\n\nMaar hebben jullie onthouden wat jullie vonden?\"",
    },
  ],

  challenge: {
    id: "pubs-challenge-boer-van-tienen",
    type: "number-answer",
    correctNumber: 7,
  },

  historicalReveal: {
    status: "partially-verified",
    // Inventaris Onroerend Erfgoed. Link to the inventory entry still to be added.
    sources: [{}],
  },

  unlockCondition: { type: "proximity", radiusInMeters: 50 },
  clue: { id: "pubs-clue-steps", icon: "key" },
};
