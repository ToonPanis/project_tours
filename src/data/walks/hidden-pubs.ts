import type { WalkLocation } from "@/types/location";
import type { Walk } from "@/types/walk";
import { playtestClues, playtestDrinkRound, playtestStops } from "./hidden-pubs.playtest";

/**
 * MOCK DATA: "Hidden Pubs": The Lost Tavern Ledger
 *
 * REAL:        the café names and addresses of the 8-stop route (below).
 * PLACEHOLDER: all history (`verification: "research-needed"`), coordinates (`null`).
 * PLAYTEST:    story fragments, challenges, clues and drinks come from
 *              `hidden-pubs.playtest.ts` and will be replaced by researched content.
 */

interface Cafe {
  id: string;
  name: string;
  address: string;
  /** Short teaser shown once the café is revealed. */
  description: string;
}

/** The route, in order. */
const cafes: Cafe[] = [
  { id: "pubs-rococo", name: "Rococo Antwerp", address: "Grote Markt 32, 2000 Antwerpen", description: "The start of the trail: the ledger's first page." },
  { id: "pubs-den-engel", name: "Café Den Engel", address: "Grote Markt 3, 2000 Antwerpen", description: "Chapter II: The Angel." },
  { id: "pubs-paters-vaetje", name: "Paters Vaetje", address: "Blauwmoezelstraat 1, 2000 Antwerpen", description: "Chapter III: The Steps." },
  { id: "pubs-de-muze", name: "De Muze", address: "Melkmarkt 15, 2000 Antwerpen", description: "Chapter IV: The Music." },
  { id: "pubs-de-kat", name: "Café De Kat", address: "Wolstraat 22, 2000 Antwerpen", description: "Chapter V: The Cat." },
  { id: "pubs-quinten-matsijs", name: "Quinten Matsijs", address: "Moriaanstraat 17, 2000 Antwerpen", description: "Chapter VI: The Painter." },
  { id: "pubs-de-varkenspoot", name: "De Varkenspoot", address: "Graanmarkt 3, 2000 Antwerpen", description: "Chapter VII: The Mark." },
  { id: "pubs-boer-van-tienen", name: "Boer van Tienen", address: "Mechelseplein 6, 2000 Antwerpen", description: "The last page." },
];

function toLocation(cafe: Cafe, index: number): WalkLocation {
  const playtest = playtestStops[cafe.id];
  return {
    id: cafe.id,
    order: index + 1,
    name: cafe.name,
    type: "pub",
    address: cafe.address,
    coordinates: null,
    description: cafe.description,
    content: [
      ...playtest.story,
      {
        kind: "history",
        verification: "research-needed",
        body: `[Historical research required] The history of ${cafe.name} will be added here.`,
      },
    ],
    drinkRound: playtestDrinkRound(cafe.id),
    challenge: playtest.challenge,
    unlockCondition: index === 0 ? { type: "none" } : { type: "proximity", radiusInMeters: 50 },
    nearbyPlaces: [],
  };
}

export const hiddenPubsWalk: Walk = {
  id: "walk-hidden-pubs",
  slug: "hidden-pubs",
  title: "Hidden Pubs",
  tagline: "Antwerp's hidden drinking history",
  shortDescription:
    "A team adventure through eight Antwerp cafés. Vote on drinks, solve challenges and piece together the mystery of a lost tavern ledger.",
  description:
    "An old tavern ledger has resurfaced, and eight of its pieces are missing. Your team travels from café to café through the heart of Antwerp. At every stop you vote on the team's drink, discover part of the story and solve a challenge. Only then does the ledger reveal the name of the next café.\n\nAlcohol is never required. Every drink vote includes an alcohol-free option, everyone can always choose their own drink, and you can skip any round.",
  city: "Antwerp",
  // Placeholder estimates until the route has been walked and timed.
  estimatedDuration: { minMinutes: 150, maxMinutes: 210 },
  distanceInMeters: null,
  difficulty: "moderate",
  price: { amountInCents: 1495, currency: "EUR" },
  theme: "tavern",
  languages: ["en"],
  routeReveal: "progressive",
  team: { minPlayers: 1, maxPlayers: 6 },
  contentStatus: "placeholder",

  copy: {
    voteResultTitle: "The tavern has spoken",
    tieTitle: "Tie!",
    tieSubtitle: "The ledger must decide…",
    afterVoteMessage: "Order your drink, take your time and look around.",
    wrongAnswer: "The Ledger remains silent.",
    correctAnswer: "The ink begins to move…",
    nextLocationTitle: "The ledger reveals another name…",
    completionTitle: "Case closed",
    completionMessage: "Antwerp has revealed one of its secrets.",
  },

  narrative: {
    title: "The Lost Tavern Ledger",
    premise:
      "An old tavern ledger has resurfaced. Most of the names have faded, and eight pieces are missing. Follow the trail from café to café, recover what was lost and find out what really happened.",
  },

  highlights: [
    "Eight Antwerp cafés",
    "A team mystery to solve",
    "Challenges and riddles at every stop",
    "Team drink votes, always with an alcohol-free option",
    "Local stories and history",
    "A final puzzle that uses every clue",
  ],

  howItWorksSteps: [
    "Arrive at the café",
    "Vote on the team's drink",
    "Discover the next part of the story",
    "Solve the challenge",
    "Collect the clue",
    "Solve the final mystery",
  ],

  practicalInfo: [
    { label: "Team", value: "1 to 6 players, sharing one phone" },
    { label: "Recommended age", value: "18+ (because of the pub theme)" },
    {
      label: "Alcohol",
      value:
        "Never required. Every vote includes an alcohol-free option and everyone can choose their own drink.",
    },
    {
      label: "Drink votes",
      value: "The team vote is a suggestion. You can skip any round; progress never depends on ordering.",
    },
  ],

  clues: playtestClues,
  locations: cafes.map(toLocation),
};
