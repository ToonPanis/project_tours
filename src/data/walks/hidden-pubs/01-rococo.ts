import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-rococo";

export const rococo: HiddenPubsStop = {
  location: {
    id,
    order: 1,
    name: "Rococo Antwerp",
    type: "pub",
    address: "Grote Markt 32, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter I: The First Page.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Lazy Red Cheeks cocktail", category: "cocktail", alcoholic: true },
        { name: "Super 8 IPA", category: "special-beer", alcoholic: true },
        { name: "Tongerlo Blond", category: "special-beer", alcoholic: true },
        { name: "Tonic Water", category: "soft-drink", alcoholic: false },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "The First Page",
        body: "You have been handed a damaged old tavern ledger. Most of its first page has disappeared. Only one sentence remains:\n\n\"Wie Antwerpen wil begrijpen, moet omhoog kijken.\nNiet alles wat oud lijkt, is wat het lijkt.\"",
      },
      {
        kind: "story",
        revealAt: "solved",
        body: "\"Zoek de Engel aan de andere zijde van de markt.\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-rococo",
      title: "Look Up",
      type: "multiple-choice",
      instruction: "Go outside and look at the building above Rococo.",
      question: "What shape does the top of the façade have?",
      options: ["Stepped", "Rounded", "Flat", "Triangular"],
      // PLAYTEST ANSWER: to be confirmed on site.
      correctOptionIndex: 0,
      researchStatus: "on-site-verification-required",
      hints: [
        "Step back far enough to see the whole building.",
        "Follow the outline of the façade against the sky.",
      ],
      explanation: "Stepped, like a stair climbing towards the sky.",
    },

    historicalReveal: {
      status: "research-required",
      paragraphs: [
        "The history of this building still has to be researched. For now, remember the shape you just found.",
      ],
      sources: [],
    },

    unlockCondition: { type: "none" },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-stair",
    title: "I · The First Page",
    value: "THE STAIR",
    icon: "key",
    sourceLocationId: id,
  },
};
