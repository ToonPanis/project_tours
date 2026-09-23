import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-de-varkenspoot";

export const deVarkenspoot: HiddenPubsStop = {
  location: {
    id,
    order: 7,
    name: "De Varkenspoot",
    type: "pub",
    address: "Graanmarkt 3, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter VII: The Missing Mark.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Omer", category: "special-beer", alcoholic: true },
        { name: "Hoegaarden Wit", category: "beer", alcoholic: true },
        { name: "Kasteel Rouge", category: "special-beer", alcoholic: true },
        { name: "Sparkling Water", category: "soft-drink", alcoholic: false },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "The Missing Mark",
        body: "\"Ik wist dat ze dichtbij waren.\n\nIk scheurde de laatste bladzijde uit het kasboek.\n\nMijn naam mochten ze niet vinden.\n\nIk liet slechts mijn teken achter.\"",
      },
      // After solving, the ledger turns urgent.
      {
        kind: "story",
        revealAt: "solved",
        tone: "urgent",
        body: "The final lines were written in haste.",
      },
      {
        kind: "story",
        revealAt: "solved",
        tone: "urgent",
        body: "\"Als je dit leest,\nheb je zeven tekens gevonden.\n\nBreng ze naar de Boer.\n\nDaar wacht de laatste bladzijde.\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-de-varkenspoot",
      title: "The Pig's Mark",
      type: "multiple-choice",
      instruction: "Search in or around De Varkenspoot for the clearest visual reference to a pig.",
      question: "What form does the pig reference take?",
      options: ["Painting", "Statue", "Sign", "Glass"],
      // TEMPORARY PLAYTEST ANSWER: replace after inspecting the café.
      correctOptionIndex: 1,
      researchStatus: "on-site-verification-required",
      hints: ["Look inside and around the entrance.", "It isn't flat."],
      explanation: "The pig has left its mark.",
    },

    historicalReveal: {
      status: "research-required",
      paragraphs: [
        "This is one of the locations where historical and on-site research is still in progress. Its history will be added after the playtest.",
      ],
      sources: [],
    },

    unlockCondition: { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-pig",
    title: "VII · The Missing Mark",
    value: "THE PIG",
    icon: "quill",
    sourceLocationId: id,
  },
};
