import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-den-engel";

export const denEngel: HiddenPubsStop = {
  location: {
    id,
    order: 2,
    name: "Café Den Engel",
    type: "pub",
    address: "Grote Markt 3, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter II: Five to Midnight.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Bolleke", category: "beer", alcoholic: true },
        { name: "Stella", category: "beer", alcoholic: true },
        { name: "Coca-Cola", category: "soft-drink", alcoholic: false },
        // Replaces "Shot Rum" (no shots as vote options). Check the menu on site.
        {
          name: "Alcohol-free beer (verify menu)",
          category: "alcohol-free-beer",
          alcoholic: false,
          menuVerification: "to-verify",
        },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "Five to Midnight",
        body: "\"De Engel kende mijn naam.\n\nMaar zelfs de Engel kon de tijd niet tegenhouden.\n\nWanneer de klok vijf minuten verder gaat,\nis alles verloren.\"",
      },
      {
        kind: "story",
        revealAt: "solved",
        body: "\"Vijf minuten resten.\n\nZoek de paters onder de toren.\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-den-engel",
      title: "The Frozen Hour",
      type: "text-answer",
      instruction: "Find the unusual large clock inside Café Den Engel.",
      question: "At what time has the clock stopped?",
      // Punctuation is ignored, so "11:55", "11.55" and "11 55" all match "11:55".
      acceptedAnswers: [
        "11:55",
        "23:55",
        "11h55",
        "23u55",
        "vijf voor twaalf",
        "5 voor 12",
        "five to twelve",
        "five to midnight",
      ],
      hints: ["Don't look at your phone for the time.", "Look for the large clock inside the café."],
      explanation: "Five to twelve, and it will stay that way.",
    },

    historicalReveal: {
      status: "partially-verified",
      paragraphs: [
        "The name Den Engel (\"The Angel\") goes back to the 14th century.",
        "Over the centuries the building had various uses. In 1740 it housed a business linked to a druggist or apothecary, and a reference to it remains on the façade.",
        "The current café dates from the early twentieth century.",
        "Its large clock is permanently stopped at five to twelve. According to Café Den Engel, the stopped clock inspired a link with Cinderella: at midnight the magic ends, so at five to twelve the party never reaches midnight.",
      ],
      sources: [{ title: "Café Den Engel (own history)" }],
    },

    unlockCondition: { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-time",
    title: "II · Five to Midnight",
    value: "11:55",
    icon: "number",
    sourceLocationId: id,
  },
};
