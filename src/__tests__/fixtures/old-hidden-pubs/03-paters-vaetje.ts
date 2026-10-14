import type { HiddenPubsStop } from "./helpers";

/** Stop 3. Texts per language: content/<lang>.ts → stops["pubs-paters-vaetje"]. */
export const patersVaetje: HiddenPubsStop = {
  id: "pubs-paters-vaetje",
  order: 3,
  name: "Paters Vaetje",
  type: "pub",
  address: "Blauwmoezelstraat 1, 2000 Antwerpen",

  drinks: [
    { category: "soft-drink", alcoholic: false },
    { category: "beer", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "local-specialty", alcoholic: true },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {
      ledger:
        "\"De volgende bladzijde was beschadigd.\n\nDe schrijver vluchtte naar de schaduw van de kathedraal.\n\nHij schreef:\n\nZelfs steen probeert hier de hemel te bereiken.\"",
    },
    {
      ledger: "\"Eén toren.\n\nEén richting.\n\nMaar geen geluid.\n\nZoek nu de plaats waar Antwerpen zijn stem terugvond.\"",
      revealAt: "solved",
    },
  ],

  challenge: {
    id: "pubs-challenge-paters-vaetje",
    type: "multiple-choice",
    correctOptionIndex: 0,
  },

  // Source links still to be added.
  historicalReveal: { status: "partially-verified", sources: [] },

  unlockCondition: { type: "proximity", radiusInMeters: 50 },
  clue: { id: "pubs-clue-tower", icon: "compass" },
};
