import type { HiddenPubsStop } from "./helpers";

/** Stop 5. Texts per language: content/<lang>.ts → stops["pubs-de-kat"]. */
export const deKat: HiddenPubsStop = {
  id: "pubs-de-kat",
  order: 5,
  name: "Café De Kat",
  type: "pub",
  address: "Wolstraat 22, 2000 Antwerpen",

  drinks: [
    { category: "beer", alcoholic: true },
    { category: "beer", alcoholic: true },
    // Replaces "Shot Tequila" (no shots as vote options). Check the menu on site.
    { category: "alcohol-free-beer", alcoholic: false, menuVerification: "to-verify" },
    { category: "soft-drink", alcoholic: false },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {
      ledger:
        "\"Ik dacht dat niemand mij gevolgd was.\n\nToen zag ik twee ogen in het donker.\n\nEen kat vergeet niets.\n\nMaar een kat vertelt haar geheim alleen\naan wie goed kijkt.\"",
    },
    {
      ledger:
        "\"De kat leidde mij naar een huis\ndat ouder was dan mijn verhaal.\n\nDaar speelden mannen een spel\ndat jullie bijna vergeten zijn.\"",
      revealAt: "solved",
    },
  ],

  challenge: {
    id: "pubs-challenge-de-kat",
    type: "number-answer",
    // TEMPORARY PLAYTEST ANSWER: count the real number on site and replace it.
    correctNumber: 9,
    researchStatus: "on-site-verification-required",
  },

  historicalReveal: { status: "research-required", sources: [] },

  unlockCondition: { type: "proximity", radiusInMeters: 50 },
  clue: { id: "pubs-clue-lives", icon: "lion" },
};
