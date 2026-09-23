import type { DrinkRound } from "@/types/drink";
import type { Walk } from "@/types/walk";

/**
 * MOCK DATA: "Hidden Pubs": The Lost Tavern Ledger
 *
 * What is REAL: the café names and addresses of the 8-stop route.
 * What is NOT yet researched (and therefore a placeholder):
 * - all history          → `kind: "history"`, `verification: "research-needed"`
 * - all drink menus      → "[… VERIFY MENU]", `menuVerification: "to-verify"`
 * - all real-world puzzles → `researchStatus` + "[RESEARCH REQUIRED]" in the question
 * - clue values          → "[CLUE n]"
 * - coordinates          → `null` (never guessed)
 * What is FICTION: the ledger story (`kind: "story"`). The innkeeper and the
 * ledger are invented for the game.
 *
 * Placeholder challenges are playable on purpose ("type LEDGER"), so the
 * whole route can be tested before the real puzzles exist.
 */

/** Placeholder drink round. Replace per café once its menu has been verified. */
function placeholderDrinkRound(stopId: string): DrinkRound {
  return {
    options: [
      {
        id: `${stopId}-drink-a`,
        name: "[ALCOHOLIC DRINK 1 — VERIFY MENU]",
        category: "beer",
        alcoholic: true,
        menuVerification: "to-verify",
      },
      {
        id: `${stopId}-drink-b`,
        name: "[ALCOHOLIC DRINK 2 — VERIFY MENU]",
        category: "special-beer",
        alcoholic: true,
        menuVerification: "to-verify",
      },
      {
        id: `${stopId}-drink-c`,
        name: "[NON-ALCOHOLIC DRINK — VERIFY MENU]",
        category: "soft-drink",
        alcoholic: false,
        menuVerification: "to-verify",
      },
    ],
  };
}

/** Hints for the "type LEDGER" placeholder challenges. */
const placeholderHints = [
  "Think about what the team is trying to reconstruct.",
  "The answer is the word LEDGER.",
];

const PLACEHOLDER_ANSWER_NOTE =
  "Placeholder: the real puzzle is not written yet. Type LEDGER to continue.";

export const hiddenPubsWalk: Walk = {
  id: "walk-hidden-pubs",
  slug: "hidden-pubs",
  title: "Hidden Pubs",
  tagline: "Antwerp's hidden drinking history",
  shortDescription:
    "A team adventure through eight Antwerp cafés. Vote on drinks, solve on-site challenges and piece together the mystery of a lost tavern ledger.",
  description:
    "An old tavern ledger has resurfaced, and eight of its pieces are missing. Your team travels from café to café through the heart of Antwerp. At every stop you vote on the team's drink, discover part of the story and solve a challenge that can only be cracked on location. Only then does the ledger reveal the name of the next café.\n\nAlcohol is never required. Every drink vote includes an alcohol-free option, everyone can always choose their own drink, and you can skip any round.",
  city: "Antwerp",
  // Placeholder estimates until the route has been walked and timed.
  estimatedDuration: { minMinutes: 150, maxMinutes: 210 },
  distanceInMeters: null,
  difficulty: "moderate",
  price: { amountInCents: 1495, currency: "EUR" },
  theme: "tavern",
  languages: ["en"],
  routeReveal: "progressive",
  team: { minPlayers: 2, maxPlayers: 8 },
  contentStatus: "placeholder",

  copy: {
    voteResultTitle: "The tavern has spoken",
    tieTitle: "Tie!",
    tieSubtitle: "The Ledger will decide…",
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
    "On-site challenges and riddles",
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
    { label: "Team", value: "2 to 8 players" },
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

  clues: [
    { id: "pubs-clue-1", title: "The first page", value: "[CLUE 1]", icon: "quill", sourceLocationId: "pubs-rococo" },
    { id: "pubs-clue-2", title: "The angel's page", value: "[CLUE 2]", icon: "key", sourceLocationId: "pubs-den-engel" },
    { id: "pubs-clue-3", title: "The cathedral's page", value: "[CLUE 3]", icon: "number", sourceLocationId: "pubs-paters-vaetje" },
    { id: "pubs-clue-4", title: "The musician's page", value: "[CLUE 4]", icon: "quill", sourceLocationId: "pubs-de-muze" },
    { id: "pubs-clue-5", title: "The cat's page", value: "[CLUE 5]", icon: "lion", sourceLocationId: "pubs-de-kat" },
    { id: "pubs-clue-6", title: "The painter's page", value: "[CLUE 6]", icon: "quill", sourceLocationId: "pubs-quinten-matsijs" },
    { id: "pubs-clue-7", title: "The mark", value: "[CLUE 7]", icon: "compass", sourceLocationId: "pubs-de-varkenspoot" },
  ],

  locations: [
    // ── STOP 1 ─────────────────────────────────────────────────────────────
    {
      id: "pubs-rococo",
      order: 1,
      name: "Rococo Antwerp",
      type: "pub",
      address: "Grote Markt 32, 2000 Antwerpen",
      coordinates: null,
      description: "The start of the trail: the ledger's first page.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter I: The First Page",
          body: "Welcome, investigators. You have been given the first page of an old tavern ledger. Most of the names on it have faded away. Only one strange sentence remains: \"Follow the drinkers, and the city will tell you what we hid.\"",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] Background on this location and on Antwerp's tavern culture will be added here.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-rococo"),
      challenge: {
        id: "pubs-challenge-1",
        title: "How the Ledger Works",
        type: "multiple-choice",
        question:
          "Before you set off: how does the ledger reveal the name of the next café? (A practice question. The real on-site puzzle for this stop still needs research.)",
        options: [
          "When everyone has finished their drink",
          "When the team solves the challenge",
          "After a fixed amount of time",
        ],
        correctOptionIndex: 1,
        hints: [
          "Progress never depends on drinking.",
          "The ledger rewards the team's detective work.",
        ],
        explanation:
          "Exactly. Solving the challenge unlocks the next café, and drinking never does.",
        researchStatus: "research-required",
      },
      unlockCondition: { type: "none" },
      nearbyPlaces: [],
    },

    // ── STOP 2 ─────────────────────────────────────────────────────────────
    {
      id: "pubs-den-engel",
      order: 2,
      name: "Café Den Engel",
      type: "pub",
      address: "Grote Markt 3, 2000 Antwerpen",
      coordinates: null,
      description: "Chapter II: The Angel.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter II: The Angel",
          body: "The second piece of the ledger shows a small drawing of an angel beside a list of names. Someone has pressed hard with the quill, as if the angel mattered more than the names.",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] History of this location, its sign and the Grote Markt will be added here.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-den-engel"),
      challenge: {
        id: "pubs-challenge-2",
        title: "The Angel's Secret",
        type: "observation",
        question: "[ON-SITE RESEARCH REQUIRED] Somewhere around you, an angel is watching.",
        instruction:
          "Placeholder: the real detail to find must be chosen on site. For now, confirm to continue.",
        confirmLabel: "We found it",
        hints: [],
        researchStatus: "on-site-research-required",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },

    // ── STOP 3 ─────────────────────────────────────────────────────────────
    {
      id: "pubs-paters-vaetje",
      order: 3,
      name: "Paters Vaetje",
      type: "pub",
      address: "Blauwmoezelstraat 1, 2000 Antwerpen",
      coordinates: null,
      description: "Chapter III: The Cathedral.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter III: The Cathedral",
          body: "The third piece points away from the tavern tables and up towards the cathedral. \"Look up,\" the innkeeper wrote. \"The stone remembers.\"",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] History of this location and its surroundings will be added here.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-paters-vaetje"),
      observationPrompt: "Step outside and take a look at the cathedral nearby.",
      challenge: {
        id: "pubs-challenge-3",
        title: "What the Stone Remembers",
        type: "text-answer",
        question: `[RESEARCH REQUIRED] A detail on the cathedral holds the answer. ${PLACEHOLDER_ANSWER_NOTE}`,
        acceptedAnswers: ["ledger"],
        hints: placeholderHints,
        researchStatus: "research-required",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },

    // ── STOP 4 ─────────────────────────────────────────────────────────────
    {
      id: "pubs-de-muze",
      order: 4,
      name: "De Muze",
      type: "pub",
      address: "Melkmarkt 15, 2000 Antwerpen",
      coordinates: null,
      description: "Chapter IV: Music.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter IV: The Music",
          body: "The fourth piece is covered in scribbled notes, like music written in a hurry. Between the notes, a number has been circled.",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] History of this location and its connection with music will be added here.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-de-muze"),
      challenge: {
        id: "pubs-challenge-4",
        title: "The Circled Number",
        type: "number-answer",
        question:
          "[RESEARCH REQUIRED] A musical detail at this location hides a number. Placeholder: enter the number of this stop (4) to continue.",
        correctNumber: 4,
        hints: ["Which stop of the route are you at?", "The answer is 4."],
        researchStatus: "research-required",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },

    // ── STOP 5 ─────────────────────────────────────────────────────────────
    {
      id: "pubs-de-kat",
      order: 5,
      name: "Café De Kat",
      type: "pub",
      address: "Wolstraat 22, 2000 Antwerpen",
      coordinates: null,
      description: "Chapter V: The Cat.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter V: The Cat",
          body: "The fifth piece is torn at the edge. Only one line survived: \"The Cat saw what happened that night.\"",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] History of this location will be added here.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-de-kat"),
      challenge: {
        id: "pubs-challenge-5",
        title: "The Watching Cat",
        type: "text-answer",
        question: `[RESEARCH REQUIRED] Find the cat in or around this location. ${PLACEHOLDER_ANSWER_NOTE}`,
        acceptedAnswers: ["ledger"],
        hints: placeholderHints,
        researchStatus: "research-required",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },

    // ── STOP 6 ─────────────────────────────────────────────────────────────
    {
      id: "pubs-quinten-matsijs",
      order: 6,
      name: "Quinten Matsijs",
      type: "pub",
      address: "Moriaanstraat 17, 2000 Antwerpen",
      coordinates: null,
      description: "Chapter VI: The Painter.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter VI: The Painter",
          body: "The sixth piece is not written but drawn: a small sketch, signed with initials the ink has almost swallowed.",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] History of this location and of the painter it is named after will be added here.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-quinten-matsijs"),
      challenge: {
        id: "pubs-challenge-6",
        title: "The Painter's Sign",
        type: "text-answer",
        question: `[HISTORICAL RESEARCH REQUIRED] A visual clue at this location completes the sketch. ${PLACEHOLDER_ANSWER_NOTE}`,
        acceptedAnswers: ["ledger"],
        hints: placeholderHints,
        researchStatus: "research-required",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },

    // ── STOP 7 ─────────────────────────────────────────────────────────────
    {
      id: "pubs-de-varkenspoot",
      order: 7,
      name: "De Varkenspoot",
      type: "pub",
      address: "Graanmarkt 3, 2000 Antwerpen",
      coordinates: null,
      description: "Chapter VII: The Mark.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter VII: The Mark",
          body: "The handwriting changes. Whoever wrote these final pages was in a hurry. Every earlier page suddenly seems to point at the same mark.",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] History of this location will be added here.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-de-varkenspoot"),
      challenge: {
        id: "pubs-challenge-7",
        title: "The Hurried Hand",
        type: "text-answer",
        question: `[RESEARCH REQUIRED] A harder challenge that connects earlier clues will go here. ${PLACEHOLDER_ANSWER_NOTE}`,
        acceptedAnswers: ["ledger"],
        hints: placeholderHints,
        researchStatus: "research-required",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },

    // ── STOP 8: FINALE ─────────────────────────────────────────────────────
    {
      id: "pubs-boer-van-tienen",
      order: 8,
      name: "Boer van Tienen",
      type: "pub",
      address: "Mechelseplein 6, 2000 Antwerpen",
      coordinates: null,
      description: "The last page.",
      content: [
        {
          kind: "story",
          chapterTitle: "Chapter VIII: The Last Page",
          body: "You have reached the last page of the ledger. Lay out every clue you have found. Together, they tell you what the innkeeper wanted the city to remember.",
        },
        {
          kind: "history",
          verification: "research-needed",
          body: "[Historical research required] History of this location will be added here.",
        },
        {
          kind: "story",
          revealAt: "solved",
          body: "The last line of ink settles. The Lost Tavern Ledger is complete.",
        },
      ],
      drinkRound: placeholderDrinkRound("pubs-boer-van-tienen"),
      challenge: {
        id: "pubs-challenge-final",
        title: "The Final Puzzle",
        type: "code",
        question:
          "[RESEARCH REQUIRED] Combine the seven clues you've collected. Placeholder: the real final puzzle is not written yet. Type LEDGER to close the case.",
        acceptedAnswers: ["ledger"],
        requiredClueIds: [
          "pubs-clue-1",
          "pubs-clue-2",
          "pubs-clue-3",
          "pubs-clue-4",
          "pubs-clue-5",
          "pubs-clue-6",
          "pubs-clue-7",
        ],
        hints: placeholderHints,
        researchStatus: "research-required",
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },
  ],
};
