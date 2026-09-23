import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-quinten-matsijs";

export const quintenMatsijs: HiddenPubsStop = {
  location: {
    id,
    order: 6,
    name: "Quinten Matsijs",
    type: "pub",
    address: "Moriaanstraat 17, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter VI: The Forgotten Game.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Maredsous Tripel 10", category: "special-beer", alcoholic: true },
        { name: "Trappist Orval", category: "special-beer", alcoholic: true },
        { name: "Chimay Blue", category: "special-beer", alcoholic: true },
        { name: "Chocolate Milk", category: "soft-drink", alcoholic: false },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "The Forgotten Game",
        body: "\"De mannen aan de tafel kenden mijn geheim.\n\nGeen kaarten lagen voor hen.\n\nGeen dobbelstenen.\n\nAlleen een spel dat al gespeeld werd\nvoordat hun grootvaders geboren waren.\"",
      },
      {
        kind: "story",
        revealAt: "solved",
        body: "\"Onder het teken van het vat vond ik een naam.\n\nMaar geen menselijke naam…\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-quinten-matsijs",
      title: "The Forgotten Game",
      type: "text-answer",
      instruction: "Search the café for an old traditional game.",
      question: "What type of historical game can you find here?",
      acceptedAnswers: [
        "tonspel",
        "tonnenspel",
        "het tonspel",
        "ton spel",
        "barrel game",
        "the barrel game",
        "a barrel game",
      ],
      hints: ["You're looking for an old game.", "Look for something involving a barrel."],
      explanation: "The tonspel: a game older than anyone at the table.",
    },

    // OPTIONAL: asked after the main answer, before the reveal. Never blocks progress.
    bonusChallenge: {
      id: "pubs-bonus-quinten-matsijs",
      title: "Bonus: The Old Name",
      type: "text-answer",
      question: "What was the historic name associated with this inn?",
      // PLAYTEST ANSWER. Punctuation is ignored, so "'t Gulick" matches "t gulick".
      acceptedAnswers: ["'t Gulick", "Gulick", "het Gulick", "'t Gulik", "Gulik"],
      researchStatus: "research-required",
      hints: [],
    },

    // Keep building date and former name as separate, sourced statements.
    historicalReveal: {
      status: "partially-verified",
      paragraphs: [
        "This historic café is housed in a building with a long history, and its interior is full of old objects.",
        "The tonspel you just found is said to be around 250 years old.",
        "The inn is associated with the historic name 't Gulick.",
      ],
      // Source links still to be added.
      sources: [],
    },

    unlockCondition: { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-barrel",
    title: "VI · The Forgotten Game",
    value: "THE BARREL",
    icon: "cellar",
    sourceLocationId: id,
  },
};
