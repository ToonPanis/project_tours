import { drinkOptions, type HiddenPubsStop } from "./helpers";

const id = "pubs-de-muze";

export const deMuze: HiddenPubsStop = {
  location: {
    id,
    order: 4,
    name: "De Muze",
    type: "pub",
    address: "Melkmarkt 15, 2000 Antwerpen",
    coordinates: null,
    description: "Chapter IV: The Muse.",

    drinkRound: {
      options: drinkOptions(id, [
        { name: "Cristal Beer", category: "beer", alcoholic: true },
        { name: "Lupulus", category: "special-beer", alcoholic: true },
        { name: "Sprite", category: "soft-drink", alcoholic: false },
        { name: "La Chouffe", category: "special-beer", alcoholic: true },
      ]),
    },

    // FICTION: the Lost Tavern Ledger.
    content: [
      {
        kind: "story",
        chapterTitle: "The Muse",
        body: "\"Ik hoorde muziek.\n\nNiet van een kerkorgel.\n\nNiet van de straat.\n\nEen Muze riep me binnen.\n\nBoven de drinkers zag ik een dier\ndat nooit bewoog.\"",
      },
      {
        kind: "story",
        revealAt: "solved",
        body: "\"Het paard zag mij vertrekken.\n\nMaar een ander dier volgde iedere stap.\"",
      },
    ],

    challenge: {
      id: "pubs-challenge-de-muze",
      title: "The Guardian",
      type: "text-answer",
      instruction: "Look carefully above the bar.",
      question: "Which animal watches over De Muze?",
      acceptedAnswers: ["horse", "paard", "het paard", "muzepaard", "the horse", "a horse", "een paard"],
      hints: ["Your answer is an animal.", "Look above the bar."],
      explanation: "A horse, and it has been watching the drinkers for a long time.",
    },

    historicalReveal: {
      status: "partially-verified",
      paragraphs: [
        "De Muze opened at the end of October 1964, founded by Walter Masselis and Tone Pauwels. It quickly became part of Antwerp's artistic scene.",
        "Ferre Grignard performed here regularly, and on 15 November 1965 he presented his first record at De Muze. International artists such as John Lee Hooker and Dexter Gordon later played here too.",
        "In 1967 a fire damaged the first and second floors. Later, the artwork known as \"het Muzepaard\" by Luc Maeyens was installed above the bar: the horse you just found.",
      ],
      // Source links still to be added.
      sources: [],
    },

    unlockCondition: { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  },

  clue: {
    id: "pubs-clue-horse",
    title: "IV · The Muse",
    value: "THE HORSE",
    icon: "lion",
    sourceLocationId: id,
  },
};
