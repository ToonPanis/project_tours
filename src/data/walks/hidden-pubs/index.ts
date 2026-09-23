import type { Walk } from "@/types/walk";
import { rococo } from "./01-rococo";
import { denEngel } from "./02-den-engel";
import { patersVaetje } from "./03-paters-vaetje";
import { deMuze } from "./04-de-muze";
import { deKat } from "./05-de-kat";
import { quintenMatsijs } from "./06-quinten-matsijs";
import { deVarkenspoot } from "./07-de-varkenspoot";
import { boerVanTienen } from "./08-boer-van-tienen";
import { hiddenPubsFinale } from "./finale";

/**
 * "Hidden Pubs": The Lost Tavern Ledger
 *
 * Each stop lives in its own file (01-rococo.ts … 08-boer-van-tienen.ts):
 * location, drinks, ledger story (FICTION), challenge, hints, historical
 * reveal (REAL HISTORY, with a verification status) and the clue it earns.
 * The final puzzle is in finale.ts.
 */
const stops = [
  rococo,
  denEngel,
  patersVaetje,
  deMuze,
  deKat,
  quintenMatsijs,
  deVarkenspoot,
  boerVanTienen,
];

export const hiddenPubsWalk: Walk = {
  id: "walk-hidden-pubs",
  slug: "hidden-pubs",
  title: "Hidden Pubs",
  tagline: "Antwerp's hidden drinking history",
  shortDescription:
    "A team adventure through eight Antwerp cafés. Vote on drinks, solve challenges on location and recover the pages of a lost tavern ledger.",
  description:
    "An old tavern ledger has resurfaced, and eight of its pieces are missing. Your team travels from café to café through the heart of Antwerp. At every stop you vote on the team's drink, read a page of the ledger and solve a challenge you can only crack on location. Only then do you learn the history behind what you found, and the ledger reveals the next café.\n\nAlcohol is never required. Every drink vote includes an alcohol-free option, everyone can always choose their own drink, and you can skip any round.",
  city: "Antwerp",
  // Estimates until the route has been walked and timed.
  estimatedDuration: { minMinutes: 150, maxMinutes: 210 },
  distanceInMeters: null,
  difficulty: "moderate",
  price: { amountInCents: 1495, currency: "EUR" },
  theme: "tavern",
  languages: ["en"],
  routeReveal: "progressive",
  team: { minPlayers: 1, maxPlayers: 6 },
  // Several challenges and reveals still need on-site verification or sources.
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
    clueCollectedTitle: "The ledger has changed",
    locationsTitle: "Taverns",
    locationsDiscoveredLabel: "taverns discovered",
  },

  narrative: {
    title: "The Lost Tavern Ledger",
    premise:
      "An old tavern ledger has resurfaced. Most of the names have faded, and eight pieces are missing. Follow the trail from café to café, recover what was lost and find out whose ledger it was.",
  },

  highlights: [
    "Eight Antwerp cafés",
    "A team mystery to solve",
    "Challenges you can only solve on location",
    "The real history behind what you discover",
    "Team drink votes, always with an alcohol-free option",
    "A final puzzle that tests what you remember",
  ],

  howItWorksSteps: [
    "Arrive at the café",
    "Vote on the team's drink",
    "Read a page of the ledger",
    "Solve the challenge on location",
    "Discover the history and collect the clue",
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

  finale: hiddenPubsFinale,
  clues: stops.map((stop) => stop.clue),
  locations: stops.map((stop) => stop.location),
};
