import type { PubGameTexts } from "./types";

/** Dutch: the wording of the concept (HIDDEN_PUBS_CONCEPT.txt), lightly edited (spelling). */
export const nl: PubGameTexts = {
  cafes: {
    "pubs-rococo": {
      questions: {
        "pubs-rococo-gates": {
          question: "Hoeveel poorten zijn er verborgen in dit café?",
          options: { "25": "25", "33": "33", "41": "41" },
          hints: ["De poorten zijn getekend door Paul Smekens.", "Ze zijn te vinden op het gelijkvloers.", "Ze hangen op een muur."],
        },
      },
      tasks: {},
    },
    "pubs-barok": {
      questions: {
        "pubs-barok-baroque": {
          question: "De naam Barok doet denken aan de barokstijl. Waar vind je die barokstijl vandaag nog terug in dit café?",
          options: { facade: "De gevel", toilets: "De toiletten", ceiling: "Het plafond" },
          hints: [],
        },
      },
      tasks: {
        "pubs-barok-shot": {
          title: "Bonusopdracht: een shotje",
          instruction:
            "Bestel een shotje: 100 extra punten voor elke speler die meedoet. Elk drankje telt, dus een alcoholvrij shotje levert evenveel op. Neem een foto van iedereen die meedoet als bewijs.",
        },
      },
    },
    "pubs-quinten-matsijs": {
      questions: {
        "pubs-quinten-matsijs-profession": {
          question: "Was Quinten Matsijs een schilder, een smid of beide?",
          options: { painter: "Een schilder", smith: "Een smid", both: "Beide" },
          hints: [],
        },
        "pubs-quinten-matsijs-game": {
          question: "Welk caféspel dat al meer dan 250 jaar oud is, staat nog steeds in dit café?",
          options: { "frog-game": "Het kikkerspel", "barrel-game": "Het tonspel", "trou-madame": "Trou madame" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-de-kat": {
      questions: {
        "pubs-de-kat-cats": {
          question: "Hoeveel katten vind je terug in dit café?",
          options: { "2": "2", "3": "3", "5": "5" },
          hints: [],
        },
      },
      tasks: {
        "pubs-de-kat-tap": {
          title: "Bonusopdracht: zelf een biertje tappen",
          instruction:
            "200 extra punten als iemand van jullie ergens in een café zelf een biertje mag tappen. Vraag het altijd eerst aan het personeel en loop hen nooit voor de voeten. Neem een foto van wie er tapt als bewijs.",
        },
      },
    },
    "pubs-billies": {
      questions: {
        "pubs-billies-dogs": {
          question: "Hoeveel honden tel je hier?",
          options: { "179": "179", "210": "210", "230": "230" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-barries": {
      questions: {
        "pubs-barries-savings-box": {
          question: "Ergens in dit café staat een oude spaarkas. Waarvoor diende die vroeger?",
          options: {
            "cafe-game": "Een oud caféspel",
            "staff-wages": "De loonbox van het personeel",
            "customer-savings": "Een spaarkas voor het bier van de klanten",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-barries-lucie": {
          title: "Zoek Lucie",
          instruction: "Zoek de mooie blonde vrouw die Lucie heet: ze is het meisje van het bier Lucie van brouwerij Seef, op een metalen bierreclamebord in dit café. Neem er een foto mee als bewijs.",
        },
      },
    },
    "pubs-paters-vaetje": {
      questions: {
        "pubs-paters-vaetje-matsijs": {
          question: "Op het terras komt het verhaal van Quinten Matsijs terug. Ken je hem nog? Wat zie je hier van hem?",
          options: {
            "cathedral-paintings": "Schilderijen in de kathedraal",
            "nello-patrasche": "Nello en Patrasche",
            well: "Een oude waterput",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-paters-vaetje-staff": {
          title: "Bonusopdracht: foto met het personeel",
          instruction:
            "Neem een foto met je favoriete barman, barvrouw of ober: 100 extra punten. Vraag het eerst, en alleen als ze even tijd hebben.",
        },
      },
    },
    "pubs-de-varkenspoot": {
      questions: {
        "pubs-de-varkenspoot-name": {
          question: "Waarom koos dit café deze naam?",
          options: {
            "pig-market": "Hier werden vroeger op de markt varkens verhandeld",
            "pigs-trotters": "Hier werden vroeger varkenspoten als gerecht geserveerd",
            regular: "Een cafélegende die hier jaar en dag kwam, had als bijnaam \"de varkenspoot\"",
          },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-boer-van-tienen": {
      questions: {
        "pubs-boer-van-tienen-special": {
          question: "Wat is er speciaal aan dit café?",
          options: {
            "second-oldest": "Het is het op een na oudste café van Antwerpen",
            musicians: "Bekende muzikanten kwamen hier vroeger",
            square: "De ligging aan het plein is voor veel Antwerpenaren speciaal",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-boer-van-tienen-rps": {
          title: "Bonusopdracht: schaar-steen-papier",
          instruction:
            "Speel een rondje schaar-steen-papier. De verliezer neemt een slok van zijn eigen drankje (alcoholvrij telt ook), en het team krijgt 100 extra punten. Neem een foto van het rondje als bewijs.",
        },
      },
    },
    "pubs-de-muze": {
      questions: {
        "pubs-de-muze-animal": {
          question: "Welk dier staat hier verborgen?",
          options: { goose: "Een gans", cow: "Een koe", horse: "Een paard" },
          hints: [],
        },
        "pubs-de-muze-floors": {
          question: "Hoeveel verdiepingen telt dit café?",
          options: { "1": "1", "2": "2", "3": "3" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-cabron": {
      questions: {
        "pubs-cabron-cafes": {
          question: "Hoeveel cafés denk je dat Antwerpen telde?",
          options: { "200": "200", "260": "260", "420": "420" },
          hints: [],
        },
      },
      tasks: {},
    },
    "pubs-den-engel": {
      questions: {
        "pubs-den-engel-clock": {
          question: "Zoek de klok die eeuwig stilstaat. Op welk uur staat ze stil?",
          options: { "10-50": "10:50", "11-55": "11:55", "08-20": "08:20" },
          hints: [],
        },
        "pubs-den-engel-why": {
          question: "Waarom staat de tijd hier stil?",
          options: {
            cinderella: "Het sprookje van Assepoester",
            battery: "De batterij is plat",
            angels: "De engelen komen tot leven",
          },
          hints: [],
        },
      },
      tasks: {
        "pubs-den-engel-clog": {
          title: "Bonusopdracht: het klompje van Assepoester",
          instruction:
            "De kampioenen onderscheiden zich van het gewone volk: dit is je laatste kans op extra punten! Voor 300 bonuspunten drink je uit het klompje van Assepoester (elk drankje telt). Vind je het klompje niet? Gebruik dan je eigen klompje. Maak een video als bewijs.",
        },
      },
    },
  },
};
