import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-paters-vaetje";

export const patersVaetje: HiddenPubsStop = {
  location: {
    id,
    order: 3,
    name: "Paters Vaetje",
    type: "pub",
    address: "Blauwmoezelstraat 1, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter III: Under the Cathedral.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Fanta", category: "soft-drink", alcoholic: false },
        { name: "Lucy Beer", category: "beer", alcoholic: true },
        { name: "Gulden Carolus Whisky Infused", category: "special-beer", alcoholic: true },
        { name: "Seef Beer", category: "local-specialty", alcoholic: true },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "Under the Cathedral",
        body: "\"De volgende bladzijde was beschadigd.\n\nDe schrijver vluchtte naar de schaduw van de kathedraal.\n\nHij schreef:\n\nZelfs steen probeert hier de hemel te bereiken.\"",
      },
      {
        kind: "story",
        revealAt: "solved",
        body: "\"Eén toren.\n\nEén richting.\n\nMaar geen geluid.\n\nZoek nu de plaats waar Antwerpen zijn stem terugvond.\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-paters-vaetje",
      title: "The Giant",
      type: "multiple-choice",
      instruction:
        "Go outside. Stand near Paters Vaetje and look carefully at the Cathedral of Our Lady.",
      question: "How many fully completed major towers does the cathedral have?",
      options: ["1", "2", "3", "4"],
      correctOptionIndex: 0,
      hints: [
        "Compare the left and the right side of the cathedral's front.",
        "Count only the towers that reach their full height.",
      ],
      explanation: "One. The giant stands alone.",
    },

    historicalReveal: {
      status: "partially-verified",
      paragraphs: [
        "Antwerp's Cathedral of Our Lady is famous for its dominant northern tower.",
        "The original design included two major towers on the western front, but the southern tower was never completed to the same height.",
      ],
      // Source links still to be added.
      sources: [],
    },

    unlockCondition: { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-tower",
    title: "III · Under the Cathedral",
    value: "ONE TOWER",
    icon: "compass",
    sourceLocationId: id,
  },
};
