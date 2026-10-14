import type { HiddenPubsStop } from "./helpers";

/** Stop 7. Texts per language: content/<lang>.ts → stops["pubs-de-varkenspoot"]. */
export const deVarkenspoot: HiddenPubsStop = {
  id: "pubs-de-varkenspoot",
  order: 7,
  name: "De Varkenspoot",
  type: "pub",
  address: "Graanmarkt 3, 2000 Antwerpen",

  drinks: [
    { category: "special-beer", alcoholic: true },
    { category: "beer", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "soft-drink", alcoholic: false },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {
      ledger:
        "\"Ik wist dat ze dichtbij waren.\n\nIk scheurde de laatste bladzijde uit het kasboek.\n\nMijn naam mochten ze niet vinden.\n\nIk liet slechts mijn teken achter.\"",
    },
    // After solving, the ledger turns urgent.
    { revealAt: "solved", tone: "urgent" }, // narration: "The final lines were written in haste."
    {
      ledger:
        "\"Als je dit leest,\nheb je zeven tekens gevonden.\n\nBreng ze naar de Boer.\n\nDaar wacht de laatste bladzijde.\"",
      revealAt: "solved",
      tone: "urgent",
    },
  ],

  challenge: {
    id: "pubs-challenge-de-varkenspoot",
    type: "multiple-choice",
    // TEMPORARY PLAYTEST ANSWER: replace after inspecting the café.
    correctOptionIndex: 1,
    researchStatus: "on-site-verification-required",
  },

  historicalReveal: { status: "research-required", sources: [] },

  unlockCondition: { type: "proximity", radiusInMeters: 50 },
  clue: { id: "pubs-clue-pig", icon: "quill" },
};
