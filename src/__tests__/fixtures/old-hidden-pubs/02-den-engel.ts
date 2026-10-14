import type { HiddenPubsStop } from "./helpers";

/**
 * The stopped clock, in every language (also used by the finale).
 * Punctuation, accents and case are ignored, so "11:55", "11.55" and
 * "11 55" all match "11:55".
 */
export const timeAnswers = [
  "11:55",
  "23:55",
  "11h55",
  "23h55",
  "23u55",
  // en
  "five to twelve",
  "five to midnight",
  // nl
  "vijf voor twaalf",
  "5 voor 12",
  // fr
  "midi moins cinq",
  "minuit moins cinq",
  "douze heures moins cinq",
  "onze heures cinquante-cinq",
  "vingt-trois heures cinquante-cinq",
  // es
  "las doce menos cinco",
  "doce menos cinco",
  "cinco para las doce",
  "las once y cincuenta y cinco",
  "once y cincuenta y cinco",
  "medianoche menos cinco",
  // it
  "mezzanotte meno cinque",
  "mezzogiorno meno cinque",
  "dodici meno cinque",
  "le dodici meno cinque",
  "12 meno 5",
  "undici e cinquantacinque",
  "le undici e cinquantacinque",
  "ventitré e cinquantacinque",
  // de
  "fünf vor zwölf",
  "5 vor 12",
  "fünf vor Mitternacht",
  "fünf vor 12",
  "5 vor zwölf",
  "11:55 Uhr",
  "23:55 Uhr",
  // ru
  "без пяти двенадцать",
  "без пяти полночь",
  "без пяти 12",
  "без пяти минут двенадцать",
  "за пять минут до полуночи",
  // uk
  "за п'ять дванадцята",
  "без п'яти дванадцять",
  "за п'ять північ",
  "за п'ять хвилин дванадцята",
  "без п'яти північ",
  "без п'яти 12",
  "за 5 дванадцята",
  "п'ять до дванадцятої",
];

/** Stop 2. Texts per language: content/<lang>.ts → stops["pubs-den-engel"]. */
export const denEngel: HiddenPubsStop = {
  id: "pubs-den-engel",
  order: 2,
  name: "Café Den Engel",
  type: "pub",
  address: "Grote Markt 3, 2000 Antwerpen",

  drinks: [
    { category: "beer", alcoholic: true },
    { category: "beer", alcoholic: true },
    { category: "soft-drink", alcoholic: false },
    // Replaces "Shot Rum" (no shots as vote options). Check the menu on site.
    { category: "alcohol-free-beer", alcoholic: false, menuVerification: "to-verify" },
  ],

  // FICTION: the Lost Tavern Ledger.
  story: [
    {
      ledger:
        "\"De Engel kende mijn naam.\n\nMaar zelfs de Engel kon de tijd niet tegenhouden.\n\nWanneer de klok vijf minuten verder gaat,\nis alles verloren.\"",
    },
    { ledger: "\"Vijf minuten resten.\n\nZoek de paters onder de toren.\"", revealAt: "solved" },
  ],

  challenge: {
    id: "pubs-challenge-den-engel",
    type: "text-answer",
    acceptedAnswers: timeAnswers,
  },

  historicalReveal: {
    status: "partially-verified",
    sources: [{}], // Café Den Engel (own history)
  },

  unlockCondition: { type: "proximity", radiusInMeters: 50 },
  clue: { id: "pubs-clue-time", icon: "number" },
};
