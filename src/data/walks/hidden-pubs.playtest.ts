/**
 * ============================================================================
 *  PLAYTEST ONLY: Hidden Pubs test content
 * ============================================================================
 *
 * Everything in this file exists to test the UX and game mechanics, NOT to be
 * published. Replace this whole file once the real content is researched.
 *
 * - Drinks are generic TEST options. They make no claim about any café's menu.
 * - Challenges are answered from the FICTIONAL ledger story shown at the same
 *   stop. They contain no historical claims and no (invented) real objects.
 * - Clues are single letters. Together they spell the final answer: TAVERNS.
 */
import type { Challenge } from "@/types/challenge";
import type { Clue } from "@/types/clue";
import type { StoryBlock } from "@/types/content";
import type { DrinkRound } from "@/types/drink";

/** PLAYTEST ONLY: generic test drinks, used at every café. */
export function playtestDrinkRound(locationId: string): DrinkRound {
  const note = "Playtest option. This café's menu has not been checked yet.";
  return {
    options: [
      { id: `${locationId}-drink-a`, name: "Beer A (test)", description: note, category: "beer", alcoholic: true, menuVerification: "to-verify" },
      { id: `${locationId}-drink-b`, name: "Beer B (test)", description: note, category: "special-beer", alcoholic: true, menuVerification: "to-verify" },
      { id: `${locationId}-drink-c`, name: "Alcohol-free (test)", description: note, category: "soft-drink", alcoholic: false, menuVerification: "to-verify" },
    ],
  };
}

/** PLAYTEST ONLY: one letter per stop (1–7). The finale combines them. */
export const playtestClues: Clue[] = [
  { id: "pubs-clue-1", title: "First letter", value: "T", icon: "quill", sourceLocationId: "pubs-rococo" },
  { id: "pubs-clue-2", title: "Second letter", value: "A", icon: "key", sourceLocationId: "pubs-den-engel" },
  { id: "pubs-clue-3", title: "Third letter", value: "V", icon: "number", sourceLocationId: "pubs-paters-vaetje" },
  { id: "pubs-clue-4", title: "Fourth letter", value: "E", icon: "quill", sourceLocationId: "pubs-de-muze" },
  { id: "pubs-clue-5", title: "Fifth letter", value: "R", icon: "lion", sourceLocationId: "pubs-de-kat" },
  { id: "pubs-clue-6", title: "Sixth letter", value: "N", icon: "quill", sourceLocationId: "pubs-quinten-matsijs" },
  { id: "pubs-clue-7", title: "Seventh letter", value: "S", icon: "compass", sourceLocationId: "pubs-de-varkenspoot" },
];

interface PlaytestStop {
  /** FICTIONAL ledger story for this stop. */
  story: StoryBlock[];
  challenge: Challenge;
}

/** PLAYTEST ONLY: story fragment + test challenge per café, keyed by location id. */
export const playtestStops: Record<string, PlaytestStop> = {
  "pubs-rococo": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter I: The First Page",
        body: "Welcome, investigators. An old tavern ledger has resurfaced, and you hold its first page. Most names have faded. One sentence remains: \"Solve what each tavern asks of you, and the next one will reveal its name.\"",
      },
    ],
    challenge: {
      id: "playtest-challenge-1",
      title: "How the Ledger Works",
      type: "multiple-choice",
      question: "According to the first page, what reveals the name of the next tavern?",
      options: ["Finishing your drink", "Solving what each tavern asks", "Waiting ten minutes"],
      correctOptionIndex: 1,
      hints: ["Read the sentence on the first page again.", "\"Solve what each tavern asks of you…\""],
      explanation: "Exactly. Solving the challenge unlocks the next tavern. Drinking never does.",
    },
  },

  "pubs-den-engel": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter II: The Angel",
        body: "The second page shows a small angel drawn in the margin. Beside it, the innkeeper wrote a single word, pressed hard into the paper: HALO.",
      },
    ],
    challenge: {
      id: "playtest-challenge-2",
      title: "The Angel's Word",
      type: "text-answer",
      question: "Which word did the innkeeper write beside the angel?",
      acceptedAnswers: ["halo"],
      hints: ["It was written next to the angel drawing.", "It's what an angel wears above its head."],
      explanation: "HALO. The innkeeper wanted the angel to be remembered.",
    },
  },

  "pubs-paters-vaetje": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter III: The Steps",
        body: "\"Look up,\" the third page says. \"I climbed twelve steps to the shelf where I hid the ledger, and I never told anyone.\"",
      },
    ],
    challenge: {
      id: "playtest-challenge-3",
      title: "The Hidden Shelf",
      type: "number-answer",
      question: "How many steps did the innkeeper climb to the hidden shelf?",
      correctNumber: 12,
      hints: ["The number is written on the third page.", "A dozen."],
      explanation: "Twelve steps. Remember this number; the ledger may ask for it again.",
    },
  },

  "pubs-de-muze": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter IV: The Music",
        body: "The fourth page is covered in scribbled music. Only three notes are circled, in this order: C, A, B.",
      },
    ],
    challenge: {
      id: "playtest-challenge-4",
      title: "The Circled Notes",
      type: "text-answer",
      question: "Read the three circled notes in order. Which word do they spell?",
      acceptedAnswers: ["cab"],
      hints: ["Put the three letters together.", "C + A + B"],
      explanation: "CAB. Even the music in the ledger hides words.",
    },
  },

  "pubs-de-kat": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter V: The Cat",
        body: "The fifth page is torn. One line survived: \"The Cat saw what happened that night: a stranger in a green cloak, carrying a lantern towards the cellar.\"",
      },
    ],
    challenge: {
      id: "playtest-challenge-5",
      title: "What the Cat Saw",
      type: "multiple-choice",
      question: "What colour was the stranger's cloak?",
      options: ["Red", "Green", "Black"],
      correctOptionIndex: 1,
      hints: ["The cat saw the stranger clearly.", "The colour of grass."],
      explanation: "Green. Who was the stranger in the green cloak?",
    },
  },

  "pubs-quinten-matsijs": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter VI: The Painter",
        body: "The sixth page isn't written but drawn: a painter's brush, and next to it a small anchor, sketched in a few quick lines.",
      },
    ],
    challenge: {
      id: "playtest-challenge-6",
      title: "The Painter's Sketch",
      type: "text-answer",
      question: "Which object is drawn next to the painter's brush?",
      acceptedAnswers: ["anchor", "an anchor"],
      hints: ["Ships use it.", "It starts with an A."],
      explanation: "An anchor. The stranger's trail seems to lead towards the water.",
    },
  },

  "pubs-de-varkenspoot": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter VII: The Mark",
        body: "The handwriting changes. Whoever wrote these final pages was in a hurry: \"Add the steps to my shelf to the number of circled notes. That is the mark.\"",
      },
    ],
    challenge: {
      id: "playtest-challenge-7",
      title: "The Hurried Hand",
      type: "number-answer",
      question: "What is the mark? (Steps to the shelf + number of circled notes.)",
      correctNumber: 15,
      hints: ["The steps were in Chapter III, the notes in Chapter IV.", "12 steps + 3 notes."],
      explanation: "Fifteen. The ledger connects every page you've found.",
    },
  },

  "pubs-boer-van-tienen": {
    story: [
      {
        kind: "story",
        chapterTitle: "Chapter VIII: The Last Page",
        body: "The last page is empty except for seven boxes. \"Fill them with what you gathered,\" the innkeeper wrote, \"and you'll know what I was protecting.\"",
      },
      {
        kind: "story",
        revealAt: "solved",
        body: "The last line of ink settles. The Lost Tavern Ledger is complete: it was never about one tavern, but all of them.",
      },
    ],
    challenge: {
      id: "playtest-challenge-final",
      title: "The Final Puzzle",
      type: "code",
      question: "Put the seven letters from your ledger in order. What word do they form?",
      acceptedAnswers: ["taverns"],
      requiredClueIds: playtestClues.map((clue) => clue.id),
      hints: ["Open the Ledger and read your clues from first to last.", "T-A-V-E-R-N-S"],
      explanation: "TAVERNS. The innkeeper was protecting the memory of every tavern on your route.",
    },
  },
};
