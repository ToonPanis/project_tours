import { timeAnswers } from "./02-den-engel";
import { horseAnswers } from "./04-de-muze";
import { barrelGameAnswers } from "./06-quinten-matsijs";
import type { ChallengeData, StoryData } from "./helpers";

/**
 * The final puzzle after the last café: the answers and the ledger's last
 * page. All three questions must be answered. Texts per language:
 * content/<lang>.ts → finale.
 */
export const finaleQuestions: ChallengeData[] = [
  {
    id: "pubs-finale-time",
    type: "text-answer",
    acceptedAnswers: timeAnswers,
  },
  {
    id: "pubs-finale-animal",
    type: "text-answer",
    acceptedAnswers: horseAnswers,
  },
  {
    id: "pubs-finale-game",
    type: "text-answer",
    acceptedAnswers: [
      ...barrelGameAnswers,
      // The clue itself reads "THE BARREL" (in the visitor's language).
      "barrel",
      "the barrel",
      "ton",
      "de ton",
      "tonneau",
      "le tonneau",
      "un tonneau",
      "barril",
      "el barril",
      "tonel",
      "el tonel",
      "barrica",
      "la barrica",
      "botte",
      "la botte",
      "barile",
      "il barile",
      "Fass",
      "das Fass",
      "Tonne",
      "die Tonne",
      "ein Fass",
      "бочка",
      "бочонок",
      "діжка",
      "барило",
      "бочечка",
    ],
  },
];

// FICTION: the end of the Lost Tavern Ledger.
export const finaleClosingStory: StoryData[] = [
  {
    ledger:
      "\"Het kasboek behoorde niet aan een beroemde schilder,\nkoopman of burgemeester.\n\nHet behoorde aan een gewone Antwerpse herbergier.\n\nZijn naam verdween uit de geschiedenis.\n\nZijn cafés niet.\n\nEeuwenlang bleven Antwerpenaren dezelfde straten\nbewandelen, verhalen vertellen en samen aan dezelfde\ntogen zitten.\n\nMisschien was dat wat hij wilde bewaren.\n\nNiet zijn naam.\n\nMaar de stad.\"",
  },
];
