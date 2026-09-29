import type { HiddenPubsContent } from "./types";

/**
 * Hidden Pubs: Nederlandse tekst. Het kasboek is zelf in het Nederlands
 * geschreven (zie de stopbestanden), dus hier staan geen vertalingen ervan.
 */
export const hiddenPubsContentNl: HiddenPubsContent = {
  walk: {
    tagline: "De verborgen drankgeschiedenis van Antwerpen",
    shortDescription:
      "Een teamavontuur langs acht Antwerpse cafés. Stem over drankjes, los ter plaatse opdrachten op en vind de bladzijden van een verloren herbergkasboek terug.",
    description:
      "Een oud herbergkasboek is opgedoken, en er ontbreken acht stukken. Je team trekt van café naar café door het hart van Antwerpen. Bij elke stop stemmen jullie over het drankje van het team, lezen jullie een bladzijde uit het kasboek en lossen jullie een opdracht op die je alleen ter plaatse kunt kraken. Pas dan ontdek je de geschiedenis achter wat je vond, en onthult het kasboek het volgende café.\n\nAlcohol is nooit nodig. Bij elke stemming is er een alcoholvrije keuze, iedereen kiest altijd zelf wat hij of zij drinkt, en je kunt elke ronde overslaan.",
    copy: {
      voteResultTitle: "De herberg heeft gesproken",
      tieTitle: "Gelijkspel!",
      tieSubtitle: "Het kasboek moet beslissen…",
      afterVoteMessage: "Bestel je drankje, neem je tijd en kijk rustig rond.",
      wrongAnswer: "Het kasboek blijft stil.",
      correctAnswer: "De inkt begint te bewegen…",
      nextLocationTitle: "Het kasboek onthult een nieuwe naam…",
      completionTitle: "Zaak gesloten",
      completionMessage: "Antwerpen heeft een van zijn geheimen prijsgegeven.",
      clueCollectedTitle: "Het kasboek is veranderd",
      locationsTitle: "Herbergen",
      locationsDiscoveredLabel: "herbergen ontdekt",
    },
    narrative: {
      title: "Het Verloren Herbergkasboek",
      premise:
        "Een oud herbergkasboek is opgedoken. De meeste namen zijn vervaagd, en er ontbreken acht stukken. Volg het spoor van café naar café, vind terug wat verloren was en ontdek van wie het kasboek was.",
    },
    highlights: [
      "Acht Antwerpse cafés",
      "Een mysterie om samen op te lossen",
      "Opdrachten die je alleen ter plaatse kunt oplossen",
      "De echte geschiedenis achter wat je ontdekt",
      "Samen stemmen over drankjes, altijd met een alcoholvrije keuze",
      "Een eindpuzzel die test wat je onthouden hebt",
    ],
    howItWorksSteps: [
      "Kom aan bij het café",
      "Stem over het drankje van het team",
      "Lees een bladzijde uit het kasboek",
      "Los de opdracht ter plaatse op",
      "Ontdek de geschiedenis en verzamel de aanwijzing",
      "Los het laatste mysterie op",
    ],
    practicalInfo: [
      { label: "Team", value: "1 tot 6 spelers, samen op één telefoon" },
      { label: "Aanbevolen leeftijd", value: "18+ (vanwege het café-thema)" },
      {
        label: "Alcohol",
        value: "Nooit nodig. Bij elke stemming is er een alcoholvrije keuze en iedereen kiest zelf wat hij of zij drinkt.",
      },
      {
        label: "Stemmen over drankjes",
        value: "De stemming van het team is een suggestie. Je kunt elke ronde overslaan; je voortgang hangt nooit af van wat je bestelt.",
      },
    ],
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "pubs-rococo": {
      description: "Hoofdstuk I: De eerste bladzijde.",
      drinks: ["Cocktail Lazy Red Cheeks", "Super 8 IPA", "Tongerlo Blond", "Tonic"],
      story: [
        {
          chapterTitle: "De eerste bladzijde",
          body: "Je krijgt een beschadigd oud herbergkasboek in handen. Het grootste deel van de eerste bladzijde is verdwenen. Er blijft maar één zin over:",
        },
        {},
        {},
      ],
      challenge: {
        title: "Kijk omhoog",
        instruction: "Ga naar buiten en bekijk het gebouw boven Rococo.",
        question: "Welke vorm heeft de bovenkant van de gevel?",
        options: ["Trapvormig", "Rond", "Plat", "Driehoekig"],
        hints: ["Stap ver genoeg achteruit om het hele gebouw te zien.", "Volg de omtrek van de gevel tegen de lucht."],
        explanation: "Trapvormig, als een trap die naar de hemel klimt.",
      },
      historicalReveal: {
        paragraphs: [
          "De geschiedenis van dit gebouw moet nog onderzocht worden. Onthoud voorlopig de vorm die je net gevonden hebt.",
        ],
        sources: [],
      },
      clue: { title: "I · De eerste bladzijde", value: "DE TRAP" },
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "pubs-den-engel": {
      description: "Hoofdstuk II: Vijf voor twaalf.",
      drinks: ["Bolleke", "Stella", "Coca-Cola", "Alcoholvrij bier"],
      story: [{ chapterTitle: "Vijf voor twaalf" }, {}],
      challenge: {
        title: "Het bevroren uur",
        instruction: "Zoek de ongewone grote klok binnen in Café Den Engel.",
        question: "Op welk uur is de klok blijven staan?",
        hints: ["Kijk niet op je telefoon hoe laat het is.", "Zoek de grote klok binnen in het café."],
        explanation: "Vijf voor twaalf, en dat blijft zo.",
      },
      historicalReveal: {
        paragraphs: [
          "De naam Den Engel gaat terug tot de 14de eeuw.",
          "Door de eeuwen heen had het gebouw verschillende functies. In 1740 zat er een zaak die verbonden was met een drogist of apotheker, en daar verwijst de gevel nog altijd naar.",
          "Het huidige café dateert uit het begin van de twintigste eeuw.",
          "De grote klok staat altijd stil op vijf voor twaalf. Volgens Café Den Engel bracht die stilstaande klok een link met Assepoester: om middernacht is de betovering voorbij, dus op vijf voor twaalf bereikt het feest nooit middernacht.",
        ],
        sources: ["Café Den Engel (eigen geschiedenis)"],
      },
      clue: { title: "II · Vijf voor twaalf", value: "11:55" },
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "pubs-paters-vaetje": {
      description: "Hoofdstuk III: Onder de kathedraal.",
      drinks: ["Fanta", "Lucy Beer", "Gulden Carolus Whisky Infused", "Seef Bier"],
      story: [{ chapterTitle: "Onder de kathedraal" }, {}],
      challenge: {
        title: "De reus",
        instruction: "Ga naar buiten. Ga bij Paters Vaetje staan en bekijk de Onze-Lieve-Vrouwekathedraal goed.",
        question: "Hoeveel volledig afgewerkte grote torens heeft de kathedraal?",
        options: ["1", "2", "3", "4"],
        hints: [
          "Vergelijk de linker- en de rechterkant van de voorgevel.",
          "Tel alleen de torens die hun volle hoogte bereiken.",
        ],
        explanation: "Eén. De reus staat alleen.",
      },
      historicalReveal: {
        paragraphs: [
          "De Antwerpse Onze-Lieve-Vrouwekathedraal is beroemd om haar dominante noordertoren.",
          "Het oorspronkelijke ontwerp voorzag twee grote torens aan de westgevel, maar de zuidertoren werd nooit tot dezelfde hoogte afgewerkt.",
        ],
        sources: [],
      },
      clue: { title: "III · Onder de kathedraal", value: "ÉÉN TOREN" },
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "pubs-de-muze": {
      description: "Hoofdstuk IV: De Muze.",
      drinks: ["Cristal", "Lupulus", "Sprite", "La Chouffe"],
      story: [{ chapterTitle: "De Muze" }, {}],
      challenge: {
        title: "De bewaker",
        instruction: "Kijk goed boven de toog.",
        question: "Welk dier waakt over De Muze?",
        hints: ["Je antwoord is een dier.", "Kijk boven de toog."],
        explanation: "Een paard, en het houdt de drinkers al heel lang in het oog.",
      },
      historicalReveal: {
        paragraphs: [
          "De Muze opende eind oktober 1964, opgericht door Walter Masselis en Tone Pauwels. Het café werd al snel een vaste waarde in de Antwerpse kunstscene.",
          "Ferre Grignard trad hier geregeld op, en op 15 november 1965 stelde hij in De Muze zijn eerste plaat voor. Later speelden hier ook internationale artiesten als John Lee Hooker en Dexter Gordon.",
          "In 1967 beschadigde een brand de eerste en tweede verdieping. Later kwam boven de toog het kunstwerk dat bekendstaat als 'het Muzepaard', van Luc Maeyens: het paard dat je net gevonden hebt.",
        ],
        sources: [],
      },
      clue: { title: "IV · De Muze", value: "HET PAARD" },
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "pubs-de-kat": {
      description: "Hoofdstuk V: Negen levens.",
      drinks: ["Bolleke", "Stella", "Alcoholvrij bier", "Water"],
      story: [{ chapterTitle: "Negen levens" }, {}],
      challenge: {
        title: "Negen levens",
        instruction:
          "Zoek in het café naar afbeeldingen van katten. Schilderijen, beeldjes, foto's en andere duidelijke kattenafbeeldingen tellen allemaal mee.",
        question: "Hoeveel katten vind je?",
        hints: ["Kijk naar de muren, de rekken en de toog.", "Schilderijen, beeldjes en foto's tellen allemaal mee."],
        explanation: "Negen, één voor elk leven.",
      },
      historicalReveal: {
        paragraphs: [
          "De Kat is een traditioneel Antwerps bruin café, bekend als kunstenaarscafé.",
          "Het gebouw zelf heeft een oudere, gedocumenteerde bouwgeschiedenis. Dat is een ander verhaal dan dat van het café: hoelang het huidige café al bestaat, moet nog onderzocht worden.",
        ],
        sources: [],
      },
      clue: { title: "V · Negen levens", value: "NEGEN LEVENS" },
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "pubs-quinten-matsijs": {
      description: "Hoofdstuk VI: Het vergeten spel.",
      drinks: ["Maredsous Tripel 10", "Trappist Orval", "Chimay Blauw", "Chocolademelk"],
      story: [{ chapterTitle: "Het vergeten spel" }, {}],
      challenge: {
        title: "Het vergeten spel",
        instruction: "Zoek in het café naar een oud, traditioneel spel.",
        question: "Welk soort historisch spel vind je hier?",
        hints: ["Je zoekt een oud spel.", "Zoek iets met een ton."],
        explanation: "Het tonspel: een spel dat ouder is dan iedereen aan tafel.",
      },
      bonusChallenge: {
        title: "Bonus: de oude naam",
        question: "Welke historische naam hoort bij deze herberg?",
        hints: [],
      },
      historicalReveal: {
        paragraphs: [
          "Dit historische café zit in een gebouw met een lange geschiedenis, en het interieur staat vol oude voorwerpen.",
          "Het tonspel dat je net vond, zou ongeveer 250 jaar oud zijn.",
          "De herberg wordt in verband gebracht met de historische naam 't Gulick.",
        ],
        sources: [],
      },
      clue: { title: "VI · Het vergeten spel", value: "DE TON" },
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "pubs-de-varkenspoot": {
      description: "Hoofdstuk VII: Het ontbrekende teken.",
      drinks: ["Omer", "Hoegaarden Wit", "Kasteel Rouge", "Bruiswater"],
      story: [
        { chapterTitle: "Het ontbrekende teken" },
        { body: "De laatste regels zijn in allerijl geschreven." },
        {},
      ],
      challenge: {
        title: "Het teken van het varken",
        instruction: "Zoek in of rond De Varkenspoot naar de duidelijkste verwijzing naar een varken.",
        question: "Welke vorm heeft die verwijzing naar het varken?",
        options: ["Schilderij", "Beeld", "Uithangbord", "Glas"],
        hints: ["Kijk binnen en rond de ingang.", "Het is niet plat."],
        explanation: "Het varken heeft zijn teken achtergelaten.",
      },
      historicalReveal: {
        paragraphs: [
          "Dit is een van de plekken waar het historisch onderzoek en het onderzoek ter plaatse nog lopen. De geschiedenis volgt na de testwandeling.",
        ],
        sources: [],
      },
      clue: { title: "VII · Het ontbrekende teken", value: "HET VARKEN" },
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "pubs-boer-van-tienen": {
      description: "Hoofdstuk VIII: De laatste bladzijde.",
      drinks: ["Stella", "Tripel d'Anvers", "Bolleke", "Cola Zero"],
      story: [{ chapterTitle: "De laatste bladzijde" }],
      challenge: {
        title: "Zeven treden",
        instruction: "Ga naar buiten en bekijk de historische trapgevel goed.",
        question: "Hoeveel treden heeft de historische trapgevel?",
        hints: ["Ga naar buiten en kijk naar de bovenkant van de gevel.", "Tel elke trede van de omtrek van de gevel."],
        explanation: "Zeven treden, precies zoals de erfgoedinventaris beschrijft.",
      },
      historicalReveal: {
        paragraphs: [
          "In Den Boer van Tienen is een oude Antwerpse herberg.",
          "Het gebouw dateert ongeveer uit de tweede helft van de 16de of de eerste helft van de 17de eeuw, en het is beschermd als monument.",
          "De erfgoedinventaris beschrijft de gevel als een trapgevel met zeven treden.",
        ],
        sources: ["Inventaris Onroerend Erfgoed"],
      },
      clue: { title: "VIII · De laatste bladzijde", value: "ZEVEN TREDEN" },
    },
  },

  finale: {
    title: "De laatste bladzijde",
    intro: "De laatste bladzijde gaat alleen open voor wie de tocht onthouden heeft.",
    questions: [
      { title: "Het bevroren uur", question: "Wanneer bleef de tijd stilstaan?", hints: [] },
      { title: "De bewaker", question: "Welk dier waakte over De Muze?", hints: [] },
      { title: "Het vergeten spel", question: "Welk eeuwenoud spel heb je ontdekt?", hints: [] },
    ],
    closingStory: [{ chapterTitle: "De laatste bladzijde" }],
  },
};
