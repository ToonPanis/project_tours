import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-boer-van-tienen";

export const boerVanTienen: HiddenPubsStop = {
  location: {
    id,
    order: 8,
    name: "In Den Boer van Tienen",
    type: "historic-pub",
    address: "Mechelseplein 6, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter VIII: The Last Page.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Stella", category: "beer", alcoholic: true },
        { name: "Tripel d'Anvers", category: "special-beer", alcoholic: true },
        { name: "Bolleke", category: "beer", alcoholic: true },
        { name: "Cola Zero", category: "soft-drink", alcoholic: false },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "The Last Page",
        body: "\"Jullie hebben mijn route gevolgd.\n\nJullie hebben gedronken waar Antwerpenaren dronken.\n\nGekeken waar kunstenaars keken.\n\nEn gezocht waar anderen voorbijliepen.\n\nMaar hebben jullie onthouden wat jullie vonden?\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-boer-van-tienen",
      title: "Seven Steps",
      type: "number-answer",
      instruction: "Go outside and look carefully at the historic stepped façade.",
      question: "How many steps does the historic stepped gable have?",
      correctNumber: 7,
      hints: [
        "Go outside and look at the top of the façade.",
        "Count every step of the gable's outline.",
      ],
      explanation: "Seven steps, just as the heritage inventory describes.",
    },

    historicalReveal: {
      status: "partially-verified",
      paragraphs: [
        "In Den Boer van Tienen is an old Antwerp inn.",
        "The building dates from roughly the second half of the 16th century or the first half of the 17th century, and it is protected as a monument.",
        "The heritage inventory describes its façade as a stepped gable with seven steps.",
      ],
      // Link to the inventory entry still to be added.
      sources: [{ title: "Inventaris Onroerend Erfgoed" }],
    },

    unlockCondition: { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-steps",
    title: "VIII · The Last Page",
    value: "SEVEN STEPS",
    icon: "key",
    sourceLocationId: id,
  },
};
