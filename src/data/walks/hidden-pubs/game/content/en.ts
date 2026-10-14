import type { PubGameTexts } from "./types";

/**
 * English (the master). Translated from the Dutch concept (HIDDEN_PUBS_CONCEPT.txt).
 * Bonus tasks that reward drinking count with ANY drink (D3).
 */
export const en: PubGameTexts = {
  cafes: {
    "pubs-rococo": {
      questions: {
        "pubs-rococo-gates": {
          question: "How many gates are hidden in this café?",
          options: { "25": "25", "33": "33", "41": "41" },
          hints: [
            "The gates were drawn by Paul Smekens.",
            "You'll find them on the ground floor.",
            "They hang on a wall.",
          ],
        },
      },
      tasks: {},
    },
    "pubs-barok": {
      questions: {
        "pubs-barok-baroque": {
          question: "The name Barok recalls the Baroque style. Where in this café can you still find the Baroque style today?",
          options: { facade: "The façade", toilets: "The toilets", ceiling: "The ceiling" },
          hints: [],
        },
      },
      tasks: {
        "pubs-barok-shot": {
          title: "Bonus: a shot round",
          instruction:
            "Order a shot: 100 extra points for every player who takes part. Any drink counts, so an alcohol-free shot earns exactly the same. Take a photo of everyone taking part as proof.",
        },
      },
    },
    "pubs-quinten-matsijs": {
      questions: {
        "pubs-quinten-matsijs-profession": {
          question: "Was Quinten Matsijs a painter, a smith, or both?",
          options: { painter: "A painter", smith: "A smith", both: "Both" },
          hints: [],
        },
        "pubs-quinten-matsijs-game": {
          question: "Which café game, more than 250 years old, is still in this café?",
          options: { "frog-game": "The frog game (kikkerspel)", "barrel-game": "The barrel game (tonspel)", "trou-madame": "Trou madame" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-de-kat": {
      questions: {
        "pubs-de-kat-cats": {
          question: "How many cats can you find in this café?",
          options: { "2": "2", "3": "3", "5": "5" },
          hints: [],
        },
      },
      tasks: {
        "pubs-de-kat-tap": {
          title: "Bonus: tap a beer yourself",
          instruction:
            "200 extra points if one of you may tap a beer, somewhere in a café. Always ask the staff first, and never get in their way. Take a photo of the person tapping as proof.",
        },
      },
    },
    "pubs-billies": {
      questions: {
        "pubs-billies-dogs": {
          question: "How many dogs do you count here?",
          options: { "179": "179", "210": "210", "230": "230" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-barries": {
      questions: {
        "pubs-barries-savings-box": {
          question: "Somewhere in this café is an old savings box (spaarkas). What was it used for in the old days?",
          options: {
            "cafe-game": "An old café game",
            "staff-wages": "A wage box for the staff",
            "customer-savings": "A savings box for the customers' beer",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-barries-lucie": {
          title: "Find Lucie",
          instruction: "Find the beautiful blonde woman called Lucie: she's the girl of the Lucie beer from the Seef brewery, on a metal advertising sign in this café. Take a photo with her as proof.",
        },
      },
    },
    "pubs-paters-vaetje": {
      questions: {
        "pubs-paters-vaetje-matsijs": {
          question: "On the terrace, the story of Quinten Matsijs comes back. Do you remember him? What do you see of him here?",
          options: {
            "cathedral-paintings": "Paintings in the cathedral",
            "nello-patrasche": "Nello and Patrasche",
            well: "An old well",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-paters-vaetje-staff": {
          title: "Bonus: a photo with the staff",
          instruction:
            "Take a photo with your favourite barman, barmaid or waiter: 100 extra points. Ask first, and only when they have a moment.",
        },
      },
    },
    "pubs-de-varkenspoot": {
      questions: {
        "pubs-de-varkenspoot-name": {
          question: "Why did this café choose its name?",
          options: {
            "pig-market": "Pigs used to be traded at the market here",
            "pigs-trotters": "Pig's trotters used to be served here as a dish",
            regular: "A legendary regular was nicknamed \"de varkenspoot\"",
          },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-boer-van-tienen": {
      questions: {
        "pubs-boer-van-tienen-special": {
          question: "What is special about this café?",
          options: {
            "second-oldest": "It's the second-oldest café in Antwerp",
            musicians: "Famous musicians used to come here",
            square: "Its spot on the square is special to many Antwerpers",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-boer-van-tienen-rps": {
          title: "Bonus: rock, paper, scissors",
          instruction:
            "Play a round of rock, paper, scissors. The loser takes a sip of their own drink (alcohol-free counts), and the team gets 100 extra points. Take a photo of the round as proof.",
        },
      },
    },
    "pubs-de-muze": {
      questions: {
        "pubs-de-muze-animal": {
          question: "Which animal is hidden here?",
          options: { goose: "A goose", cow: "A cow", horse: "A horse" },
          hints: [],
        },
        "pubs-de-muze-floors": {
          question: "How many floors does this café have?",
          options: { "1": "1", "2": "2", "3": "3" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-cabron": {
      questions: {
        "pubs-cabron-cafes": {
          question: "How many cafés do you think Antwerp had?",
          options: { "200": "200", "260": "260", "420": "420" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-den-engel": {
      questions: {
        "pubs-den-engel-clock": {
          question: "Find the clock that stands still forever. What time does it show?",
          options: { "10-50": "10:50", "11-55": "11:55", "08-20": "08:20" },
          hints: [],
        },
        "pubs-den-engel-why": {
          question: "Why does time stand still here?",
          options: {
            cinderella: "The fairy tale of Cinderella",
            battery: "The battery is dead",
            angels: "The angels come to life",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-den-engel-clog": {
          title: "Bonus: Cinderella's clog",
          instruction:
            "The champions stand out from the crowd: this is your last chance for extra points! For 300 bonus points, drink from Cinderella's clog (any drink counts). Can't find the clog? Then use your own. Make a video as proof.",
        },
      },
    },
  },
};
