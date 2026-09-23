import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-de-kat";

export const deKat: HiddenPubsStop = {
  location: {
    id,
    order: 5,
    name: "Café De Kat",
    type: "pub",
    address: "Wolstraat 22, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter V: Nine Lives.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Bolleke", category: "beer", alcoholic: true },
        { name: "Stella", category: "beer", alcoholic: true },
        // Replaces "Shot Tequila" (no shots as vote options). Check the menu on site.
        {
          name: "Alcohol-free beer (verify menu)",
          category: "alcohol-free-beer",
          alcoholic: false,
          menuVerification: "to-verify",
        },
        { name: "Water", category: "soft-drink", alcoholic: false },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "Nine Lives",
        body: "\"Ik dacht dat niemand mij gevolgd was.\n\nToen zag ik twee ogen in het donker.\n\nEen kat vergeet niets.\n\nMaar een kat vertelt haar geheim alleen\naan wie goed kijkt.\"",
      },
      {
        kind: "story",
        revealAt: "solved",
        body: "\"De kat leidde mij naar een huis\ndat ouder was dan mijn verhaal.\n\nDaar speelden mannen een spel\ndat jullie bijna vergeten zijn.\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-de-kat",
      title: "Nine Lives",
      type: "number-answer",
      instruction:
        "Search the café for representations of cats. Paintings, statues, photographs and other clear cat images all count.",
      question: "How many cats can you find?",
      // TEMPORARY PLAYTEST ANSWER: count the real number on site and replace it.
      correctNumber: 9,
      researchStatus: "on-site-verification-required",
      hints: ["Check the walls, the shelves and the bar.", "Paintings, statues and photos all count."],
      explanation: "Nine, one for every life.",
    },

    historicalReveal: {
      status: "research-required",
      paragraphs: [
        "De Kat is a traditional Antwerp brown café, known as an artists' café.",
        "The building itself has an older, documented building history. That is a separate story from the café's: how long the current café has existed still needs to be researched.",
      ],
      sources: [],
    },

    unlockCondition: { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-lives",
    title: "V · Nine Lives",
    value: "NINE LIVES",
    icon: "lion",
    sourceLocationId: id,
  },
};
