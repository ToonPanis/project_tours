import type { HiddenPubsContent } from "./types";

/**
 * Hidden Pubs: French text, translated from the English master (./en.ts).
 * The `translation` fields translate the Dutch ledger text in the stop files.
 *
 * Rules (see CLAUDE.md):
 * - `story` is FICTION (the Lost Tavern Ledger); `historicalReveal` is real
 *   history only. Never invent facts, drinks or answers.
 * - Café names, street names and brand names are never translated.
 * - Progress never depends on drinking; no shots, no drinking challenges.
 */
export const hiddenPubsContentFr: HiddenPubsContent = {
  walk: {
    tagline: "L'histoire secrète des cafés d'Anvers",
    shortDescription:
      "Une aventure en équipe à travers huit cafés d'Anvers. Votez pour vos boissons, relevez des défis sur place et retrouvez les pages d'un registre de taverne perdu.",
    description:
      "Un vieux registre de taverne a refait surface, mais huit de ses fragments ont disparu. Votre équipe va de café en café au cœur d'Anvers. À chaque étape, vous votez pour la boisson de l'équipe, lisez une page du registre et résolvez un défi qui ne se déchiffre que sur place. Ce n'est qu'ensuite que vous découvrez l'histoire de ce que vous avez trouvé, et le registre vous révèle le café suivant.\n\nL'alcool n'est jamais obligatoire. Chaque vote propose une option sans alcool, chacun peut toujours choisir sa propre boisson, et vous pouvez passer n'importe quel tour.",
    copy: {
      voteResultTitle: "La taverne a parlé",
      tieTitle: "Égalité !",
      tieSubtitle: "Le registre doit trancher…",
      afterVoteMessage: "Commandez votre boisson, prenez votre temps et regardez autour de vous.",
      wrongAnswer: "Le registre reste muet.",
      correctAnswer: "L'encre se met à bouger…",
      nextLocationTitle: "Le registre révèle un autre nom…",
      completionTitle: "Affaire classée",
      completionMessage: "Anvers vous a livré l'un de ses secrets.",
      clueCollectedTitle: "Le registre a changé",
      locationsTitle: "Tavernes",
      locationsDiscoveredLabel: "tavernes découvertes",
    },
    narrative: {
      title: "Le registre perdu de la taverne",
      premise:
        "Un vieux registre de taverne a refait surface. La plupart des noms se sont effacés et huit fragments manquent. Suivez la piste de café en café, retrouvez ce qui a été perdu et découvrez à qui appartenait ce registre.",
    },
    highlights: [
      "Huit cafés anversois",
      "Un mystère à résoudre en équipe",
      "Des défis qui ne se résolvent que sur place",
      "La véritable histoire derrière vos découvertes",
      "Des votes d'équipe pour les boissons, toujours avec une option sans alcool",
      "Une énigme finale qui met votre mémoire à l'épreuve",
    ],
    howItWorksSteps: [
      "Arrivez au café",
      "Votez pour la boisson de l'équipe",
      "Lisez une page du registre",
      "Résolvez le défi sur place",
      "Découvrez l'histoire et récupérez l'indice",
      "Percez le mystère final",
    ],
    practicalInfo: [
      { label: "Équipe", value: "1 à 6 joueurs, avec un seul téléphone" },
      { label: "Âge conseillé", value: "18 ans et plus (en raison du thème des cafés)" },
      {
        label: "Alcool",
        value: "Jamais obligatoire. Chaque vote propose une option sans alcool et chacun peut choisir sa propre boisson.",
      },
      {
        label: "Votes pour les boissons",
        value: "Le vote de l'équipe n'est qu'une suggestion. Vous pouvez passer n'importe quel tour ; la progression ne dépend jamais d'une commande.",
      },
    ],
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "pubs-rococo": {
      description: "Chapitre I : La première page.",
      drinks: ["Cocktail Lazy Red Cheeks", "Super 8 IPA", "Tongerlo Blond", "Eau tonique"],
      story: [
        {
          chapterTitle: "La première page",
          body: "On vous a remis un vieux registre de taverne abîmé. La première page a presque entièrement disparu. Il n'en reste qu'une phrase :",
        },
        { translation: "« Qui veut comprendre Anvers doit lever les yeux.\nTout ce qui paraît ancien n'est pas ce qu'il semble. »" },
        { translation: "« Cherchez l'Ange de l'autre côté de la place du marché. »" },
      ],
      challenge: {
        title: "Levez les yeux",
        instruction: "Sortez et regardez le bâtiment au-dessus de Rococo.",
        question: "Quelle forme a le sommet de la façade ?",
        options: ["À gradins", "Arrondi", "Plat", "Triangulaire"],
        hints: ["Reculez suffisamment pour voir tout le bâtiment.", "Suivez le contour de la façade qui se découpe sur le ciel."],
        explanation: "À gradins, comme un escalier qui monte vers le ciel.",
      },
      historicalReveal: {
        paragraphs: [
          "L'histoire de ce bâtiment reste encore à étudier. Pour l'instant, retenez la forme que vous venez de découvrir.",
        ],
        sources: [],
      },
      clue: { title: "I · La première page", value: "L'ESCALIER" },
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "pubs-den-engel": {
      description: "Chapitre II : Minuit moins cinq.",
      drinks: ["Bolleke", "Stella", "Coca-Cola", "Bière sans alcool"],
      story: [
        {
          chapterTitle: "Minuit moins cinq",
          translation:
            "« L'Ange connaissait mon nom.\n\nMais même l'Ange ne pouvait retenir le temps.\n\nQuand l'horloge avancera de cinq minutes,\ntout sera perdu. »",
        },
        { translation: "« Il reste cinq minutes.\n\nCherchez les pères sous la tour. »" },
      ],
      challenge: {
        title: "L'heure figée",
        instruction: "Trouvez la grande horloge insolite à l'intérieur du Café Den Engel.",
        question: "À quelle heure l'horloge s'est-elle arrêtée ?",
        hints: ["Ne regardez pas l'heure sur votre téléphone.", "Cherchez la grande horloge à l'intérieur du café."],
        explanation: "Douze heures moins cinq, et elle en restera là.",
      },
      historicalReveal: {
        paragraphs: [
          "Le nom Den Engel (« L'Ange ») remonte au XIVe siècle.",
          "Au fil des siècles, le bâtiment a connu divers usages. En 1740, il abritait un commerce lié à un droguiste ou à un apothicaire, et la façade en porte encore une trace.",
          "Le café actuel date du début du XXe siècle.",
          "Sa grande horloge est arrêtée pour de bon à douze heures moins cinq. Selon le Café Den Engel, cette horloge figée a inspiré un lien avec Cendrillon : à minuit, la magie prend fin ; à douze heures moins cinq, la fête n'atteint donc jamais minuit.",
        ],
        sources: ["Café Den Engel (historique du café)"],
      },
      clue: { title: "II · Minuit moins cinq", value: "11:55" },
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "pubs-paters-vaetje": {
      description: "Chapitre III : Sous la cathédrale.",
      drinks: ["Fanta", "Lucy Beer", "Gulden Carolus Whisky Infused", "Seef Beer"],
      story: [
        {
          chapterTitle: "Sous la cathédrale",
          translation:
            "« La page suivante était abîmée.\n\nL'auteur s'est réfugié à l'ombre de la cathédrale.\n\nIl a écrit :\n\nIci, même la pierre tente d'atteindre le ciel. »",
        },
        {
          translation: "« Une tour.\n\nUne direction.\n\nMais aucun son.\n\nCherchez maintenant le lieu où Anvers a retrouvé sa voix. »",
        },
      ],
      challenge: {
        title: "Le géant",
        instruction: "Sortez. Placez-vous près de Paters Vaetje et observez attentivement la cathédrale Notre-Dame (Onze-Lieve-Vrouwekathedraal).",
        question: "Combien de grandes tours entièrement achevées la cathédrale compte-t-elle ?",
        options: ["1", "2", "3", "4"],
        hints: [
          "Comparez le côté gauche et le côté droit de la façade de la cathédrale.",
          "Ne comptez que les tours qui atteignent leur pleine hauteur.",
        ],
        explanation: "Une seule. Le géant se dresse seul.",
      },
      historicalReveal: {
        paragraphs: [
          "La cathédrale Notre-Dame d'Anvers est célèbre pour sa tour nord qui domine tout.",
          "Le projet d'origine prévoyait deux grandes tours sur la façade ouest, mais la tour sud n'a jamais été achevée à la même hauteur.",
        ],
        sources: [],
      },
      clue: { title: "III · Sous la cathédrale", value: "UNE SEULE TOUR" },
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "pubs-de-muze": {
      description: "Chapitre IV : La Muse.",
      drinks: ["Cristal Beer", "Lupulus", "Sprite", "La Chouffe"],
      story: [
        {
          chapterTitle: "La Muse",
          translation:
            "« J'ai entendu de la musique.\n\nPas celle d'un orgue d'église.\n\nPas celle de la rue.\n\nUne Muse m'a appelé à l'intérieur.\n\nAu-dessus des buveurs, j'ai vu un animal\nqui ne bougeait jamais. »",
        },
        { translation: "« Le cheval m'a regardé partir.\n\nMais un autre animal a suivi chacun de mes pas. »" },
      ],
      challenge: {
        title: "Le gardien",
        instruction: "Regardez attentivement au-dessus du bar.",
        question: "Quel animal veille sur De Muze ?",
        hints: ["Votre réponse est un animal.", "Regardez au-dessus du bar."],
        explanation: "Un cheval, qui observe les buveurs depuis bien longtemps.",
      },
      historicalReveal: {
        paragraphs: [
          "De Muze a ouvert ses portes fin octobre 1964, fondé par Walter Masselis et Tone Pauwels. Le café a rapidement fait partie de la scène artistique anversoise.",
          "Ferre Grignard s'y produisait régulièrement, et le 15 novembre 1965, il a présenté son premier disque à De Muze. Des artistes internationaux comme John Lee Hooker et Dexter Gordon y ont joué eux aussi par la suite.",
          "En 1967, un incendie a endommagé le premier et le deuxième étage. Plus tard, l'œuvre connue sous le nom de « het Muzepaard » (le cheval de la Muse), de Luc Maeyens, a été installée au-dessus du bar : c'est le cheval que vous venez de trouver.",
        ],
        sources: [],
      },
      clue: { title: "IV · La Muse", value: "LE CHEVAL" },
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "pubs-de-kat": {
      description: "Chapitre V : Neuf vies.",
      drinks: ["Bolleke", "Stella", "Bière sans alcool", "Eau"],
      story: [
        {
          chapterTitle: "Neuf vies",
          translation:
            "« Je croyais que personne ne m'avait suivi.\n\nPuis j'ai vu deux yeux dans l'obscurité.\n\nUn chat n'oublie rien.\n\nMais un chat ne confie son secret\nqu'à ceux qui regardent bien. »",
        },
        {
          translation:
            "« Le chat m'a conduit vers une maison\nplus ancienne que mon histoire.\n\nLà, des hommes jouaient à un jeu\nque vous avez presque oublié. »",
        },
      ],
      challenge: {
        title: "Neuf vies",
        instruction:
          "Cherchez dans le café des représentations de chats. Tableaux, statuettes, photos et autres images de chats bien reconnaissables : tout compte.",
        question: "Combien de chats trouvez-vous ?",
        hints: ["Regardez les murs, les étagères et le bar.", "Tableaux, statuettes et photos : tout compte."],
        explanation: "Neuf, un pour chaque vie.",
      },
      historicalReveal: {
        paragraphs: [
          "De Kat est un café brun anversois traditionnel, connu comme café d'artistes.",
          "Le bâtiment lui-même a une histoire architecturale plus ancienne et documentée. C'est une autre histoire que celle du café : depuis combien de temps le café actuel existe, cela reste à étudier.",
        ],
        sources: [],
      },
      clue: { title: "V · Neuf vies", value: "NEUF VIES" },
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "pubs-quinten-matsijs": {
      description: "Chapitre VI : Le jeu oublié.",
      drinks: ["Maredsous Tripel 10", "Trappist Orval", "Chimay Bleue", "Lait chocolaté"],
      story: [
        {
          chapterTitle: "Le jeu oublié",
          translation:
            "« Les hommes à la table connaissaient mon secret.\n\nPas de cartes devant eux.\n\nPas de dés.\n\nRien qu'un jeu auquel on jouait déjà\navant la naissance de leurs grands-pères. »",
        },
        { translation: "« Sous le signe du tonneau, j'ai trouvé un nom.\n\nMais pas un nom humain… »" },
      ],
      challenge: {
        title: "Le jeu oublié",
        instruction: "Cherchez dans le café un vieux jeu traditionnel.",
        question: "Quel type de jeu ancien trouvez-vous ici ?",
        hints: ["Vous cherchez un vieux jeu.", "Cherchez quelque chose qui fait intervenir un tonneau."],
        explanation: "Le tonspel (jeu du tonneau) : un jeu plus ancien que tous ceux qui sont assis à la table.",
      },
      bonusChallenge: {
        title: "Bonus : l'ancien nom",
        question: "Quel nom historique est associé à cette auberge ?",
        hints: [],
      },
      historicalReveal: {
        paragraphs: [
          "Ce café historique occupe un bâtiment à la longue histoire, et son intérieur regorge d'objets anciens.",
          "Le tonspel que vous venez de trouver aurait environ 250 ans.",
          "L'auberge est associée au nom historique 't Gulick.",
        ],
        sources: [],
      },
      clue: { title: "VI · Le jeu oublié", value: "LE TONNEAU" },
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "pubs-de-varkenspoot": {
      description: "Chapitre VII : La marque manquante.",
      drinks: ["Omer", "Hoegaarden Wit", "Kasteel Rouge", "Eau pétillante"],
      story: [
        {
          chapterTitle: "La marque manquante",
          translation:
            "« Je savais qu'ils étaient tout près.\n\nJ'ai arraché la dernière page du registre.\n\nIls ne devaient pas trouver mon nom.\n\nJe n'ai laissé que ma marque. »",
        },
        { body: "Les dernières lignes ont été écrites à la hâte." },
        {
          translation:
            "« Si vous lisez ceci,\nvous avez trouvé sept marques.\n\nApportez-les au Fermier.\n\nLa dernière page vous y attend. »",
        },
      ],
      challenge: {
        title: "La marque du cochon",
        instruction: "Cherchez, dans De Varkenspoot ou aux alentours, la référence visuelle la plus nette à un cochon.",
        question: "Quelle forme prend cette référence au cochon ?",
        options: ["Tableau", "Statue", "Enseigne", "Verre"],
        hints: ["Regardez à l'intérieur et autour de l'entrée.", "Ce n'est pas plat."],
        explanation: "Le cochon a laissé sa marque.",
      },
      historicalReveal: {
        paragraphs: [
          "C'est l'un des lieux pour lesquels les recherches historiques et sur place sont encore en cours. Son histoire sera ajoutée après le test de jeu.",
        ],
        sources: [],
      },
      clue: { title: "VII · La marque manquante", value: "LE COCHON" },
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "pubs-boer-van-tienen": {
      description: "Chapitre VIII : La dernière page.",
      drinks: ["Stella", "Tripel d'Anvers", "Bolleke", "Cola Zero"],
      story: [
        {
          chapterTitle: "La dernière page",
          translation:
            "« Vous avez suivi mon chemin.\n\nVous avez bu là où buvaient les Anversois.\n\nRegardé là où regardaient les artistes.\n\nEt cherché là où d'autres passaient sans s'arrêter.\n\nMais vous souvenez-vous de ce que vous avez trouvé ? »",
        },
      ],
      challenge: {
        title: "Sept gradins",
        instruction: "Sortez et observez attentivement la façade historique à gradins.",
        question: "Combien de gradins compte le pignon historique ?",
        hints: ["Sortez et regardez le sommet de la façade.", "Comptez chaque gradin du contour du pignon."],
        explanation: "Sept gradins, exactement comme le décrit l'inventaire du patrimoine.",
      },
      historicalReveal: {
        paragraphs: [
          "In Den Boer van Tienen est une ancienne auberge anversoise.",
          "Le bâtiment date à peu près de la seconde moitié du XVIe siècle ou de la première moitié du XVIIe siècle, et il est protégé comme monument.",
          "L'inventaire du patrimoine décrit sa façade comme un pignon à gradins comptant sept gradins.",
        ],
        sources: ["Inventaris Onroerend Erfgoed (inventaire du patrimoine flamand)"],
      },
      clue: { title: "VIII · La dernière page", value: "SEPT GRADINS" },
    },
  },

  finale: {
    title: "La page finale",
    intro: "La page finale ne s'ouvrira qu'à ceux qui se souviennent du voyage.",
    questions: [
      { title: "L'heure figée", question: "Quand le temps s'est-il arrêté ?", hints: [] },
      { title: "Le gardien", question: "Quel animal veillait sur De Muze ?", hints: [] },
      { title: "Le jeu oublié", question: "Quel jeu séculaire avez-vous découvert ?", hints: [] },
    ],
    closingStory: [
      {
        chapterTitle: "La dernière page",
        translation:
          "« Le registre n'appartenait pas à un peintre célèbre,\nà un marchand ni à un bourgmestre.\n\nIl appartenait à un simple aubergiste anversois.\n\nSon nom a disparu de l'histoire.\n\nSes cafés, non.\n\nPendant des siècles, les Anversois ont continué\nd'arpenter les mêmes rues, de raconter des histoires\net de s'asseoir ensemble aux mêmes comptoirs.\n\nC'est peut-être cela qu'il voulait préserver.\n\nPas son nom.\n\nMais la ville. »",
      },
    ],
  },
};
