import type { HiddenPubsStop } from "./helpers";

/** The tonspel (barrel game), in every language (also used by the finale). */
export const barrelGameAnswers = [
  "tonspel",
  "tonnenspel",
  "het tonspel",
  "ton spel",
  "barrel game",
  "the barrel game",
  "a barrel game",
  "jeu du tonneau",
  "le jeu du tonneau",
  "jeu de tonneau",
  "le jeu de tonneau",
  "juego del barril",
  "el juego del barril",
  "juego de barril",
  "juego de la barrica",
  "juego del tonel",
  "el juego del tonel",
  "gioco della botte",
  "il gioco della botte",
  "gioco del barile",
  "il gioco del barile",
  "gioco delle botti",
  "Tonnenspiel",
  "Fassspiel",
  "das Tonnenspiel",
  "das Fassspiel",
  "ein Tonnenspiel",
  "ein Fassspiel",
  "Tonspiel",
  "игра в бочку",
  "игра с бочкой",
  "игра в бочонок",
  "тонспел",
  "тонспель",
  "гра в бочку",
  "гра з бочкою",
  "гра в бочки",
  "бочкова гра",
];

/** Stop 6. Texts per language: content/<lang>.ts → stops["pubs-quinten-matsijs"]. */
export const quintenMatsijs: HiddenPubsStop = {
  id: "pubs-quinten-matsijs",
  order: 6,
  name: "Quinten Matsijs",
  type: "pub",
  address: "Moriaanstraat 17, 2000 Antwerpen",

  drinks: [
    { category: "special-beer", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "special-beer", alcoholic: true },
    { category: "soft-drink", alcoholic: false },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {
      ledger:
        "\"De mannen aan de tafel kenden mijn geheim.\n\nGeen kaarten lagen voor hen.\n\nGeen dobbelstenen.\n\nAlleen een spel dat al gespeeld werd\nvoordat hun grootvaders geboren waren.\"",
    },
    { ledger: "\"Onder het teken van het vat vond ik een naam.\n\nMaar geen menselijke naam…\"", revealAt: "solved" },
  ],

  challenge: {
    id: "pubs-challenge-quinten-matsijs",
    type: "text-answer",
    acceptedAnswers: barrelGameAnswers,
  },

  // OPTIONAL: asked after the main answer, before the reveal. Never blocks progress.
  bonusChallenge: {
    id: "pubs-bonus-quinten-matsijs",
    type: "text-answer",
    // PLAYTEST ANSWER. A name, so the same in every language.
    // Punctuation is ignored, so "'t Gulick" matches "t gulick".
    acceptedAnswers: ["'t Gulick", "Gulick", "het Gulick", "'t Gulik", "Gulik"],
    researchStatus: "research-required",
  },

  // Keep building date and former name as separate, sourced statements.
  // Source links still to be added.
  historicalReveal: { status: "partially-verified", sources: [] },

  unlockCondition: { type: "proximity", radiusInMeters: 50 },
  clue: { id: "pubs-clue-barrel", icon: "cellar" },
};
