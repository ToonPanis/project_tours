import type { Walk } from "@/types/walk";

/**
 * MOCK DATA: "Hidden Pubs"
 *
 * - `kind: "history"` blocks are PLACEHOLDERS ("research-needed") until real,
 *   sourced research is added. No historical claims are made here.
 * - `kind: "story"` blocks are the FICTIONAL "Lost Tavern Ledger" narrative.
 *   The innkeeper and the ledger are invented for the game.
 * - Locations, addresses and coordinates are placeholders near the city centre.
 * - Pub breaks are always optional. No challenge involves drinking or buying anything.
 */
export const hiddenPubsWalk: Walk = {
  id: "walk-hidden-pubs",
  slug: "hidden-pubs",
  title: "Hidden Pubs",
  tagline: "Antwerp's hidden drinking history",
  shortDescription:
    "Uncover old cafés, hidden alleys and local stories while you piece together the mystery of a lost tavern ledger.",
  description:
    "Behind unassuming doors and down narrow alleys, Antwerp's drinking culture has left its traces all over the city. This walk takes you past historic cafés, hidden streets and forgotten corners, and follows a trail of clues left in an old tavern ledger.\n\nAt each stop you'll discover a piece of history, a fragment of the story and a clue. Combine them to solve the mystery. Pub stops are optional: you never need to drink alcohol or buy anything to complete the walk.",
  city: "Antwerp",
  // Placeholder estimates until the route is finalised.
  estimatedDuration: { minMinutes: 120, maxMinutes: 180 },
  distanceInMeters: null,
  difficulty: "moderate",
  price: { amountInCents: 1495, currency: "EUR" },
  theme: "tavern",
  languages: ["en"],
  contentStatus: "placeholder",

  narrative: {
    title: "The Lost Tavern Ledger",
    premise:
      "An old tavern ledger has resurfaced, but several of its pages are missing. It belonged to an innkeeper whose name has been forgotten. Follow the trail across the city, recover what was lost and find out what really happened.",
  },

  highlights: [
    "Historic cafés",
    "Hidden corners of Antwerp",
    "Local stories and legends",
    "Puzzles and riddles",
    "A mystery to solve",
    "Optional pub stops",
  ],

  howItWorksSteps: [
    "Follow the route",
    "Discover the location",
    "Solve the challenge",
    "Collect the clue",
    "Unlock the next chapter",
    "Solve the final mystery",
  ],

  practicalInfo: [
    { label: "Recommended age", value: "18+ (because of the pub theme)" },
    {
      label: "Alcohol",
      value: "Not required. Every challenge can be completed without drinking.",
    },
    {
      label: "Pub stops",
      value: "Optional. You never need to enter a café or buy anything.",
    },
  ],

  clues: [
    {
      id: "pubs-clue-lion",
      title: "A carved beast",
      value: "THE LION",
      icon: "lion",
      sourceLocationId: "pubs-loc-1",
    },
    {
      id: "pubs-clue-year",
      title: "A year in the ledger",
      value: "1642",
      description: "A year written in the margin of the ledger (fictional).",
      icon: "number",
      sourceLocationId: "pubs-loc-2",
    },
    {
      id: "pubs-clue-cellar",
      title: "A place below",
      value: "CELLAR",
      icon: "cellar",
      sourceLocationId: "pubs-loc-3",
    },
    {
      id: "pubs-clue-north",
      title: "A direction",
      value: "NORTH",
      icon: "compass",
      sourceLocationId: "pubs-loc-4",
    },
  ],

  locations: [
    {
      id: "pubs-loc-1",
      order: 1,
      name: "Old Tavern Placeholder",
      type: "historic-pub",
      address: "Address to be confirmed, Antwerp city centre",
      coordinates: { latitude: 51.2206, longitude: 4.4008 },
      description: "An old tavern where the story begins.",
      content: [
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] The history of this tavern and Antwerp's early drinking culture will be added here.",
        },
        {
          kind: "story",
          chapterTitle: "Chapter I: The Ledger Resurfaces",
          body: "The ledger's first page is stained with candle wax. Beneath the list of customers, someone has drawn a small beast in the margin, as if marking a hiding place.",
        },
      ],
      observationPrompt: "Look closely at the facade and the area around the entrance.",
      challenge: {
        id: "pubs-challenge-1",
        type: "observation",
        question: "[Placeholder challenge] Find the carved animal.",
        instruction:
          "Search the building's facade for a carved animal. Take your time; it's easy to miss.",
        confirmLabel: "I found it",
        explanation: "The beast from the ledger's margin. Note it in your ledger.",
      },
      unlockCondition: { type: "none" },
      nearbyPlaces: [],
      accessibilityNotes: "[Placeholder] Accessibility details to be checked on site.",
    },
    {
      id: "pubs-loc-2",
      order: 2,
      name: "Hidden Alley Placeholder",
      type: "alley",
      address: "Address to be confirmed, Antwerp city centre",
      coordinates: { latitude: 51.2198, longitude: 4.3985 },
      description: "A narrow passage most people walk straight past.",
      content: [
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] The history of this alley will be added here.",
        },
        {
          kind: "story",
          chapterTitle: "Chapter II: A Year in the Margin",
          body: "On the second page, one entry is circled twice. Next to it, the innkeeper wrote a single year, and nothing else.",
        },
      ],
      challenge: {
        id: "pubs-challenge-2",
        type: "number-answer",
        question: "[Placeholder challenge] What year appears above the doorway?",
        correctNumber: 1642,
        hint: "Look up. Numbers are often carved into the stone above a door.",
        explanation: "The same year the innkeeper circled in the ledger.",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
      accessibilityNotes: "[Placeholder] Alley surface and width to be checked on site.",
    },
    {
      id: "pubs-loc-3",
      order: 3,
      name: "Guild House Placeholder",
      type: "historic-building",
      address: "Address to be confirmed, Antwerp city centre",
      coordinates: { latitude: 51.2212, longitude: 4.3975 },
      description: "A grand building with a long history.",
      content: [
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] The history of this guild house will be added here.",
        },
        {
          kind: "story",
          chapterTitle: "Chapter III: The Torn Pages",
          body: "The entries on the third page are out of order, as if someone rearranged them to hide what happened. Put them back in order and a word appears.",
        },
      ],
      challenge: {
        id: "pubs-challenge-3",
        type: "sequence",
        question: "[Placeholder challenge] Put the ledger entries back in the right order.",
        items: [
          "The cellar is sealed",
          "The innkeeper opens a new ledger",
          "A stranger pays in foreign coin",
          "Three pages are torn out",
        ],
        correctOrder: [1, 2, 3, 0],
        explanation: "Once the entries are in order, the last one points below ground.",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
      optionalBreak: {
        place: {
          id: "pubs-break-1",
          name: "Historic café (to be selected)",
          category: "pub",
          description: "[Placeholder] One of Antwerp's traditional cafés.",
        },
        walkingMinutes: 2,
        note: "You don't need to visit this café to continue the walk.",
      },
    },
    {
      id: "pubs-loc-4",
      order: 4,
      name: "Cellar Entrance Placeholder",
      type: "hidden-location",
      address: "Address to be confirmed, Antwerp city centre",
      coordinates: { latitude: 51.2224, longitude: 4.4001 },
      description: "The trail leads below street level.",
      content: [
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] The history of this location will be added here.",
        },
        {
          kind: "story",
          chapterTitle: "Chapter IV: Below the Street",
          body: "The last surviving page contains a riddle: 'Where the beast guards the year, go below.' Your clues are the key.",
        },
      ],
      challenge: {
        id: "pubs-challenge-4",
        type: "code",
        question:
          "[Placeholder puzzle] Enter the three clues you've found, in the order you found them.",
        acceptedAnswers: ["the lion 1642 cellar", "lion 1642 cellar"],
        requiredClueIds: ["pubs-clue-lion", "pubs-clue-year", "pubs-clue-cellar"],
        explanation: "The ledger's riddle is solved, and it points you north.",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },
  ],
};
