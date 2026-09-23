import type { WalkFinale } from "@/types/walk";

/** The final puzzle after the last café. All three questions must be answered. */
export const hiddenPubsFinale: WalkFinale = {
  title: "The Final Page",
  intro: "The final page will open only for those who remember the journey.",

  questions: [
    {
      id: "pubs-finale-time",
      title: "The Frozen Hour",
      type: "text-answer",
      question: "When did time stop?",
      acceptedAnswers: ["11:55", "23:55", "five to twelve", "vijf voor twaalf", "5 voor 12", "five to midnight"],
      hints: [],
    },
    {
      id: "pubs-finale-animal",
      title: "The Guardian",
      type: "text-answer",
      question: "Which animal watched over De Muze?",
      acceptedAnswers: ["horse", "paard", "muzepaard", "the horse", "het paard", "a horse", "een paard"],
      hints: [],
    },
    {
      id: "pubs-finale-game",
      title: "The Forgotten Game",
      type: "text-answer",
      question: "Which centuries-old game did you discover?",
      acceptedAnswers: [
        "tonspel",
        "tonnenspel",
        "het tonspel",
        "ton spel",
        "barrel game",
        "the barrel game",
        "a barrel game",
        // The clue itself reads "THE BARREL".
        "barrel",
        "the barrel",
      ],
      hints: [],
    },
  ],

  // FICTION: the end of the Lost Tavern Ledger.
  closingStory: [
    {
      kind: "story",
      chapterTitle: "The Last Page",
      body: "\"Het kasboek behoorde niet aan een beroemde schilder,\nkoopman of burgemeester.\n\nHet behoorde aan een gewone Antwerpse herbergier.\n\nZijn naam verdween uit de geschiedenis.\n\nZijn cafés niet.\n\nEeuwenlang bleven Antwerpenaren dezelfde straten\nbewandelen, verhalen vertellen en samen aan dezelfde\ntogen zitten.\n\nMisschien was dat wat hij wilde bewaren.\n\nNiet zijn naam.\n\nMaar de stad.\"",
    },
  ],
};
