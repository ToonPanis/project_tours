import type { HiddenPubsStop } from "./helpers";

/** The horse above the bar, in every language (also used by the finale). */
export const horseAnswers = [
  "horse",
  "the horse",
  "a horse",
  "paard",
  "het paard",
  "een paard",
  "muzepaard",
  "cheval",
  "le cheval",
  "un cheval",
  "caballo",
  "el caballo",
  "un caballo",
  "caballito",
  "el caballito",
  "cavallo",
  "il cavallo",
  "un cavallo",
  "Pferd",
  "das Pferd",
  "ein Pferd",
  "Musenpferd",
  "das Ross",
  "лошадь",
  "конь",
  "лошадка",
  "кобыла",
  "кінь",
  "коник",
  "конячка",
];

/** Stop 4. Texts per language: content/<lang>.ts → stops["pubs-de-muze"]. */
export const deMuze: HiddenPubsStop = {
  id: "pubs-de-muze",
  order: 4,
  name: "De Muze",
  type: "pub",
  address: "Melkmarkt 15, 2000 Antwerpen",

  drinks: [
    { category: "beer", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "soft-drink", alcoholic: false },
    { category: "special-beer", alcoholic: true },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {
      ledger:
        "\"Ik hoorde muziek.\n\nNiet van een kerkorgel.\n\nNiet van de straat.\n\nEen Muze riep me binnen.\n\nBoven de drinkers zag ik een dier\ndat nooit bewoog.\"",
    },
    { ledger: "\"Het paard zag mij vertrekken.\n\nMaar een ander dier volgde iedere stap.\"", revealAt: "solved" },
  ],

  challenge: {
    id: "pubs-challenge-de-muze",
    type: "text-answer",
    acceptedAnswers: horseAnswers,
  },

  // Source links still to be added.
  historicalReveal: { status: "partially-verified", sources: [] },

  unlockCondition: { type: "proximity", radiusInMeters: 50 },
  clue: { id: "pubs-clue-horse", icon: "lion" },
};
