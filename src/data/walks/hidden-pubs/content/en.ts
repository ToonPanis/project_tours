import type { HiddenPubsContent } from "./types";

/**
 * Hidden Pubs: English text (the master for all other languages).
 *
 * Rules (see CLAUDE.md):
 * - `story` is FICTION (the Lost Tavern Ledger); `historicalReveal` is real
 *   history only. Never invent facts, drinks or answers.
 * - Café names, street names and brand names are never translated.
 * - Progress never depends on drinking; no shots, no drinking challenges.
 */
export const hiddenPubsContentEn: HiddenPubsContent = {
  walk: {
    tagline: "Antwerp's hidden drinking history",
    shortDescription:
      "A team adventure through eight Antwerp cafés. Vote on drinks, solve challenges on location and recover the pages of a lost tavern ledger.",
    description:
      "An old tavern ledger has resurfaced, and eight of its pieces are missing. Your team travels from café to café through the heart of Antwerp. At every stop you vote on the team's drink, read a page of the ledger and solve a challenge you can only crack on location. Only then do you learn the history behind what you found, and the ledger reveals the next café.\n\nAlcohol is never required. Every drink vote includes an alcohol-free option, everyone can always choose their own drink, and you can skip any round.",
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
      routeButtonLabel: "Ledger",
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
        value: "Never required. Every vote includes an alcohol-free option and everyone can choose their own drink.",
      },
      {
        label: "Drink votes",
        value: "The team vote is a suggestion. You can skip any round; progress never depends on ordering.",
      },
    ],
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "pubs-rococo": {
      description: "Chapter I: The First Page.",
      drinks: ["Lazy Red Cheeks cocktail", "Super 8 IPA", "Tongerlo Blond", "Tonic Water"],
      story: [
        {
          chapterTitle: "The First Page",
          body: "You have been handed a damaged old tavern ledger. Most of its first page has disappeared. Only one sentence remains:",
        },
        { translation: "“Whoever wants to understand Antwerp must look up.\nNot everything that looks old is what it seems.”" },
        { translation: "“Look for the Angel on the other side of the market.”" },
      ],
      challenge: {
        title: "Look Up",
        instruction: "Go outside and look at the building above Rococo.",
        question: "What shape does the top of the façade have?",
        options: ["Stepped", "Rounded", "Flat", "Triangular"],
        hints: ["Step back far enough to see the whole building.", "Follow the outline of the façade against the sky."],
        explanation: "Stepped, like a stair climbing towards the sky.",
      },
      historicalReveal: {
        paragraphs: [
          "The history of this building still has to be researched. For now, remember the shape you just found.",
        ],
        sources: [],
      },
      clue: { title: "I · The First Page", value: "THE STAIR" },
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "pubs-den-engel": {
      description: "Chapter II: Five to Midnight.",
      drinks: ["Bolleke", "Stella", "Coca-Cola", "Alcohol-free beer"],
      story: [
        {
          chapterTitle: "Five to Midnight",
          translation:
            "“The Angel knew my name.\n\nBut even the Angel could not hold back time.\n\nWhen the clock moves five minutes on,\nall is lost.”",
        },
        { translation: "“Five minutes remain.\n\nLook for the fathers beneath the tower.”" },
      ],
      challenge: {
        title: "The Frozen Hour",
        instruction: "Find the unusual large clock inside Café Den Engel.",
        question: "At what time has the clock stopped?",
        hints: ["Don't look at your phone for the time.", "Look for the large clock inside the café."],
        explanation: "Five to twelve, and it will stay that way.",
      },
      historicalReveal: {
        paragraphs: [
          "The name Den Engel (“The Angel”) goes back to the 14th century.",
          "Over the centuries the building had various uses. In 1740 it housed a business linked to a druggist or apothecary, and a reference to it remains on the façade.",
          "The current café dates from the early twentieth century.",
          "Its large clock is permanently stopped at five to twelve. According to Café Den Engel, the stopped clock inspired a link with Cinderella: at midnight the magic ends, so at five to twelve the party never reaches midnight.",
        ],
        sources: ["Café Den Engel (own history)"],
      },
      clue: { title: "II · Five to Midnight", value: "11:55" },
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "pubs-paters-vaetje": {
      description: "Chapter III: Under the Cathedral.",
      drinks: ["Fanta", "Lucy Beer", "Gulden Carolus Whisky Infused", "Seef Beer"],
      story: [
        {
          chapterTitle: "Under the Cathedral",
          translation:
            "“The next page was damaged.\n\nThe writer fled into the shadow of the cathedral.\n\nHe wrote:\n\nHere even stone tries to reach the sky.”",
        },
        {
          translation: "“One tower.\n\nOne direction.\n\nBut no sound.\n\nNow find the place where Antwerp found its voice again.”",
        },
      ],
      challenge: {
        title: "The Giant",
        instruction: "Go outside. Stand near Paters Vaetje and look carefully at the Cathedral of Our Lady (Onze-Lieve-Vrouwekathedraal).",
        question: "How many fully completed major towers does the cathedral have?",
        options: ["1", "2", "3", "4"],
        hints: [
          "Compare the left and the right side of the cathedral's front.",
          "Count only the towers that reach their full height.",
        ],
        explanation: "One. The giant stands alone.",
      },
      historicalReveal: {
        paragraphs: [
          "Antwerp's Cathedral of Our Lady is famous for its dominant northern tower.",
          "The original design included two major towers on the western front, but the southern tower was never completed to the same height.",
        ],
        sources: [],
      },
      clue: { title: "III · Under the Cathedral", value: "ONE TOWER" },
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "pubs-de-muze": {
      description: "Chapter IV: The Muse.",
      drinks: ["Cristal Beer", "Lupulus", "Sprite", "La Chouffe"],
      story: [
        {
          chapterTitle: "The Muse",
          translation:
            "“I heard music.\n\nNot from a church organ.\n\nNot from the street.\n\nA Muse called me inside.\n\nAbove the drinkers I saw an animal\nthat never moved.”",
        },
        { translation: "“The horse watched me leave.\n\nBut another animal followed every step.”" },
      ],
      challenge: {
        title: "The Guardian",
        instruction: "Look carefully above the bar.",
        question: "Which animal watches over De Muze?",
        hints: ["Your answer is an animal.", "Look above the bar."],
        explanation: "A horse, and it has been watching the drinkers for a long time.",
      },
      historicalReveal: {
        paragraphs: [
          "De Muze opened at the end of October 1964, founded by Walter Masselis and Tone Pauwels. It quickly became part of Antwerp's artistic scene.",
          "Ferre Grignard performed here regularly, and on 15 November 1965 he presented his first record at De Muze. International artists such as John Lee Hooker and Dexter Gordon later played here too.",
          "In 1967 a fire damaged the first and second floors. Later, the artwork known as “het Muzepaard” (the Muse horse) by Luc Maeyens was installed above the bar: the horse you just found.",
        ],
        sources: [],
      },
      clue: { title: "IV · The Muse", value: "THE HORSE" },
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "pubs-de-kat": {
      description: "Chapter V: Nine Lives.",
      drinks: ["Bolleke", "Stella", "Alcohol-free beer", "Water"],
      story: [
        {
          chapterTitle: "Nine Lives",
          translation:
            "“I thought no one had followed me.\n\nThen I saw two eyes in the dark.\n\nA cat forgets nothing.\n\nBut a cat only tells its secret\nto those who look closely.”",
        },
        {
          translation:
            "“The cat led me to a house\nolder than my story.\n\nThere, men were playing a game\nyou have almost forgotten.”",
        },
      ],
      challenge: {
        title: "Nine Lives",
        instruction:
          "Search the café for representations of cats. Paintings, statues, photographs and other clear cat images all count.",
        question: "How many cats can you find?",
        hints: ["Check the walls, the shelves and the bar.", "Paintings, statues and photos all count."],
        explanation: "Nine, one for every life.",
      },
      historicalReveal: {
        paragraphs: [
          "De Kat is a traditional Antwerp brown café, known as an artists' café.",
          "The building itself has an older, documented building history. That is a separate story from the café's: how long the current café has existed still needs to be researched.",
        ],
        sources: [],
      },
      clue: { title: "V · Nine Lives", value: "NINE LIVES" },
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "pubs-quinten-matsijs": {
      description: "Chapter VI: The Forgotten Game.",
      drinks: ["Maredsous Tripel 10", "Trappist Orval", "Chimay Blue", "Chocolate milk"],
      story: [
        {
          chapterTitle: "The Forgotten Game",
          translation:
            "“The men at the table knew my secret.\n\nNo cards lay before them.\n\nNo dice.\n\nOnly a game that was already being played\nbefore their grandfathers were born.”",
        },
        { translation: "“Beneath the sign of the barrel I found a name.\n\nBut not a human name…”" },
      ],
      challenge: {
        title: "The Forgotten Game",
        instruction: "Search the café for an old traditional game.",
        question: "What type of historical game can you find here?",
        hints: ["You're looking for an old game.", "Look for something involving a barrel."],
        explanation: "The tonspel (barrel game): a game older than anyone at the table.",
      },
      bonusChallenge: {
        title: "Bonus: The Old Name",
        question: "What was the historic name associated with this inn?",
        hints: [],
      },
      historicalReveal: {
        paragraphs: [
          "This historic café is housed in a building with a long history, and its interior is full of old objects.",
          "The tonspel you just found is said to be around 250 years old.",
          "The inn is associated with the historic name 't Gulick.",
        ],
        sources: [],
      },
      clue: { title: "VI · The Forgotten Game", value: "THE BARREL" },
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "pubs-de-varkenspoot": {
      description: "Chapter VII: The Missing Mark.",
      drinks: ["Omer", "Hoegaarden Wit", "Kasteel Rouge", "Sparkling water"],
      story: [
        {
          chapterTitle: "The Missing Mark",
          translation:
            "“I knew they were close.\n\nI tore the last page out of the ledger.\n\nThey must not find my name.\n\nI left only my mark.”",
        },
        { body: "The final lines were written in haste." },
        {
          translation:
            "“If you are reading this,\nyou have found seven marks.\n\nTake them to the Farmer.\n\nThe last page is waiting there.”",
        },
      ],
      challenge: {
        title: "The Pig's Mark",
        instruction: "Search in or around De Varkenspoot for the clearest visual reference to a pig.",
        question: "What form does the pig reference take?",
        options: ["Painting", "Statue", "Sign", "Glass"],
        hints: ["Look inside and around the entrance.", "It isn't flat."],
        explanation: "The pig has left its mark.",
      },
      historicalReveal: {
        paragraphs: [
          "This is one of the locations where historical and on-site research is still in progress. Its history will be added after the playtest.",
        ],
        sources: [],
      },
      clue: { title: "VII · The Missing Mark", value: "THE PIG" },
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "pubs-boer-van-tienen": {
      description: "Chapter VIII: The Last Page.",
      drinks: ["Stella", "Tripel d'Anvers", "Bolleke", "Cola Zero"],
      story: [
        {
          chapterTitle: "The Last Page",
          translation:
            "“You have followed my route.\n\nYou have drunk where the people of Antwerp drank.\n\nLooked where artists looked.\n\nAnd searched where others walked past.\n\nBut have you remembered what you found?”",
        },
      ],
      challenge: {
        title: "Seven Steps",
        instruction: "Go outside and look carefully at the historic stepped façade.",
        question: "How many steps does the historic stepped gable have?",
        hints: ["Go outside and look at the top of the façade.", "Count every step of the gable's outline."],
        explanation: "Seven steps, just as the heritage inventory describes.",
      },
      historicalReveal: {
        paragraphs: [
          "In Den Boer van Tienen is an old Antwerp inn.",
          "The building dates from roughly the second half of the 16th century or the first half of the 17th century, and it is protected as a monument.",
          "The heritage inventory describes its façade as a stepped gable with seven steps.",
        ],
        sources: ["Inventaris Onroerend Erfgoed (Flemish heritage inventory)"],
      },
      clue: { title: "VIII · The Last Page", value: "SEVEN STEPS" },
    },
  },

  finale: {
    title: "The Final Page",
    intro: "The final page will open only for those who remember the journey.",
    questions: [
      { title: "The Frozen Hour", question: "When did time stop?", hints: [] },
      { title: "The Guardian", question: "Which animal watched over De Muze?", hints: [] },
      { title: "The Forgotten Game", question: "Which centuries-old game did you discover?", hints: [] },
    ],
    closingStory: [
      {
        chapterTitle: "The Last Page",
        translation:
          "“The ledger did not belong to a famous painter,\nmerchant or burgomaster.\n\nIt belonged to an ordinary Antwerp innkeeper.\n\nHis name vanished from history.\n\nHis cafés did not.\n\nFor centuries the people of Antwerp kept walking\nthe same streets, telling stories and sitting together\nat the same bars.\n\nPerhaps that is what he wanted to preserve.\n\nNot his name.\n\nBut the city.”",
      },
    ],
  },
};
