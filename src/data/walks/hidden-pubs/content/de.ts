import type { HiddenPubsContent } from "./types";

/**
 * Hidden Pubs: deutscher Text (übersetzt aus dem englischen Master en.ts).
 *
 * Rules (see CLAUDE.md):
 * - `story` is FICTION (the Lost Tavern Ledger); `historicalReveal` is real
 *   history only. Never invent facts, drinks or answers.
 * - Café names, street names and brand names are never translated.
 * - Progress never depends on drinking; no shots, no drinking challenges.
 */
export const hiddenPubsContentDe: HiddenPubsContent = {
  walk: {
    tagline: "Antwerpens verborgene Kneipengeschichte",
    shortDescription:
      "Ein Team-Abenteuer durch acht Antwerpener Cafés. Stimmt über Getränke ab, löst Rätsel vor Ort und findet die Seiten eines verschollenen Wirtshausbuchs.",
    description:
      "Ein altes Wirtshausbuch ist wieder aufgetaucht, doch acht seiner Teile fehlen. Euer Team zieht von Café zu Café durch das Herz von Antwerpen. An jeder Station stimmt ihr über das Getränk des Teams ab, lest eine Seite aus dem Buch und löst ein Rätsel, das sich nur vor Ort knacken lässt. Erst dann erfahrt ihr die Geschichte hinter eurem Fund, und das Buch verrät das nächste Café.\n\nAlkohol ist nie nötig. Jede Abstimmung enthält eine alkoholfreie Option, alle können jederzeit ihr eigenes Getränk wählen, und jede Runde lässt sich überspringen.",
    copy: {
      voteResultTitle: "Die Schenke hat entschieden",
      tieTitle: "Gleichstand!",
      tieSubtitle: "Das Buch muss entscheiden …",
      afterVoteMessage: "Bestellt euer Getränk, lasst euch Zeit und schaut euch um.",
      wrongAnswer: "Das Buch schweigt.",
      correctAnswer: "Die Tinte beginnt sich zu bewegen …",
      nextLocationTitle: "Das Buch verrät einen weiteren Namen …",
      completionTitle: "Fall gelöst",
      completionMessage: "Antwerpen hat eines seiner Geheimnisse preisgegeben.",
      clueCollectedTitle: "Das Buch hat sich verändert",
      locationsTitle: "Schenken",
      locationsDiscoveredLabel: "Schenken entdeckt",
    },
    narrative: {
      title: "Das verschollene Wirtshausbuch",
      premise:
        "Ein altes Wirtshausbuch ist wieder aufgetaucht. Die meisten Namen sind verblasst, und acht Teile fehlen. Folgt der Spur von Café zu Café, findet, was verloren ging, und lüftet das Geheimnis, wem das Buch gehörte.",
    },
    highlights: [
      "Acht Antwerpener Cafés",
      "Ein Rätsel für das ganze Team",
      "Aufgaben, die sich nur vor Ort lösen lassen",
      "Die echte Geschichte hinter euren Entdeckungen",
      "Getränkeabstimmungen im Team, immer mit alkoholfreier Option",
      "Ein Finalrätsel, das euer Gedächtnis prüft",
    ],
    howItWorksSteps: [
      "Im Café ankommen",
      "Über das Getränk des Teams abstimmen",
      "Eine Seite aus dem Buch lesen",
      "Das Rätsel vor Ort lösen",
      "Die Geschichte entdecken und den Hinweis sammeln",
      "Das letzte Geheimnis lösen",
    ],
    practicalInfo: [
      { label: "Team", value: "1 bis 6 Personen mit einem gemeinsamen Handy" },
      { label: "Empfohlenes Alter", value: "Ab 18 (wegen des Kneipenthemas)" },
      {
        label: "Alkohol",
        value: "Nie nötig. Jede Abstimmung enthält eine alkoholfreie Option, und alle können ihr eigenes Getränk wählen.",
      },
      {
        label: "Getränkeabstimmungen",
        value: "Die Abstimmung im Team ist nur ein Vorschlag. Jede Runde lässt sich überspringen; der Fortschritt hängt nie von einer Bestellung ab.",
      },
    ],
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "pubs-rococo": {
      description: "Kapitel I: Die erste Seite.",
      drinks: ["Cocktail Lazy Red Cheeks", "Super 8 IPA", "Tongerlo Blond", "Tonic Water"],
      story: [
        {
          chapterTitle: "Die erste Seite",
          body: "Man hat euch ein altes, beschädigtes Wirtshausbuch überreicht. Der Großteil der ersten Seite ist verschwunden. Nur ein Satz ist geblieben:",
        },
        { translation: "„Wer Antwerpen verstehen will, muss nach oben schauen.\nNicht alles, was alt aussieht, ist, was es scheint.“" },
        { translation: "„Sucht den Engel auf der anderen Seite des Marktes.“" },
      ],
      challenge: {
        title: "Schau nach oben",
        instruction: "Geht nach draußen und betrachtet das Gebäude über dem Rococo.",
        question: "Welche Form hat der obere Abschluss der Fassade?",
        options: ["Gestuft", "Gerundet", "Flach", "Dreieckig"],
        hints: ["Tretet weit genug zurück, um das ganze Gebäude zu sehen.", "Folgt dem Umriss der Fassade vor dem Himmel."],
        explanation: "Gestuft, wie eine Treppe, die in den Himmel steigt.",
      },
      historicalReveal: {
        paragraphs: [
          "Die Geschichte dieses Gebäudes muss noch erforscht werden. Merkt euch vorerst die Form, die ihr gerade gefunden habt.",
        ],
        sources: [],
      },
      clue: { title: "I · Die erste Seite", value: "DIE TREPPE" },
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "pubs-den-engel": {
      description: "Kapitel II: Fünf vor zwölf.",
      drinks: ["Bolleke", "Stella", "Coca-Cola", "Alkoholfreies Bier"],
      story: [
        {
          chapterTitle: "Fünf vor zwölf",
          translation:
            "„Der Engel kannte meinen Namen.\n\nDoch selbst der Engel konnte die Zeit nicht aufhalten.\n\nRückt die Uhr fünf Minuten weiter,\nist alles verloren.“",
        },
        { translation: "„Fünf Minuten bleiben.\n\nSucht die Patres unter dem Turm.“" },
      ],
      challenge: {
        title: "Die erstarrte Stunde",
        instruction: "Findet die ungewöhnliche große Uhr im Café Den Engel.",
        question: "Um wie viel Uhr ist die Uhr stehen geblieben?",
        hints: ["Schaut für die Uhrzeit nicht aufs Handy.", "Sucht die große Uhr im Café."],
        explanation: "Fünf vor zwölf, und dabei bleibt es.",
      },
      historicalReveal: {
        paragraphs: [
          "Der Name Den Engel („Der Engel“) geht auf das 14. Jahrhundert zurück.",
          "Im Lauf der Jahrhunderte wurde das Gebäude unterschiedlich genutzt. 1740 befand sich hier ein Geschäft, das mit einem Drogisten oder Apotheker verbunden war; ein Hinweis darauf ist an der Fassade erhalten.",
          "Das heutige Café stammt aus dem frühen 20. Jahrhundert.",
          "Seine große Uhr steht dauerhaft auf fünf vor zwölf. Laut Café Den Engel inspirierte die stehende Uhr zu einer Verbindung mit Aschenputtel: Um Mitternacht endet der Zauber, und bei fünf vor zwölf erreicht das Fest nie Mitternacht.",
        ],
        sources: ["Café Den Engel (eigene Geschichte)"],
      },
      clue: { title: "II · Fünf vor zwölf", value: "11:55" },
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "pubs-paters-vaetje": {
      description: "Kapitel III: Unter der Kathedrale.",
      drinks: ["Fanta", "Lucy Beer", "Gulden Carolus Whisky Infused", "Seef Beer"],
      story: [
        {
          chapterTitle: "Unter der Kathedrale",
          translation:
            "„Die nächste Seite war beschädigt.\n\nDer Schreiber floh in den Schatten der Kathedrale.\n\nEr schrieb:\n\nHier versucht selbst der Stein, den Himmel zu erreichen.“",
        },
        {
          translation: "„Ein Turm.\n\nEine Richtung.\n\nDoch kein Klang.\n\nSucht nun den Ort, an dem Antwerpen seine Stimme wiederfand.“",
        },
      ],
      challenge: {
        title: "Der Riese",
        instruction: "Geht nach draußen. Stellt euch in die Nähe des Paters Vaetje und betrachtet genau die Kathedrale (Onze-Lieve-Vrouwekathedraal).",
        question: "Wie viele vollständig fertiggestellte Haupttürme hat die Kathedrale?",
        options: ["1", "2", "3", "4"],
        hints: [
          "Vergleicht die linke und die rechte Seite der Kathedralenfront.",
          "Zählt nur die Türme, die ihre volle Höhe erreichen.",
        ],
        explanation: "Einen. Der Riese steht allein.",
      },
      historicalReveal: {
        paragraphs: [
          "Die Antwerpener Kathedrale ist berühmt für ihren alles überragenden Nordturm.",
          "Der ursprüngliche Entwurf sah zwei große Türme an der Westfassade vor, doch der Südturm wurde nie bis zur gleichen Höhe vollendet.",
        ],
        sources: [],
      },
      clue: { title: "III · Unter der Kathedrale", value: "EIN TURM" },
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "pubs-de-muze": {
      description: "Kapitel IV: Die Muse.",
      drinks: ["Cristal Beer", "Lupulus", "Sprite", "La Chouffe"],
      story: [
        {
          chapterTitle: "Die Muse",
          translation:
            "„Ich hörte Musik.\n\nNicht von einer Kirchenorgel.\n\nNicht von der Straße.\n\nEine Muse rief mich herein.\n\nÜber den Zechern sah ich ein Tier,\ndas sich nie bewegte.“",
        },
        { translation: "„Das Pferd sah mich gehen.\n\nDoch ein anderes Tier folgte jedem Schritt.“" },
      ],
      challenge: {
        title: "Der Wächter",
        instruction: "Schaut genau über die Theke.",
        question: "Welches Tier wacht über De Muze?",
        hints: ["Die Antwort ist ein Tier.", "Schaut über die Theke."],
        explanation: "Ein Pferd, und es wacht schon lange über die Gäste.",
      },
      historicalReveal: {
        paragraphs: [
          "De Muze öffnete Ende Oktober 1964, gegründet von Walter Masselis und Tone Pauwels. Das Café wurde schnell Teil der Antwerpener Kunstszene.",
          "Ferre Grignard trat hier regelmäßig auf, und am 15. November 1965 stellte er in De Muze seine erste Platte vor. Später spielten hier auch internationale Künstler wie John Lee Hooker und Dexter Gordon.",
          "1967 beschädigte ein Brand den ersten und zweiten Stock. Später wurde über der Theke das Kunstwerk „het Muzepaard“ (das Musenpferd) von Luc Maeyens angebracht: das Pferd, das ihr gerade gefunden habt.",
        ],
        sources: [],
      },
      clue: { title: "IV · Die Muse", value: "DAS PFERD" },
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "pubs-de-kat": {
      description: "Kapitel V: Neun Leben.",
      drinks: ["Bolleke", "Stella", "Alkoholfreies Bier", "Wasser"],
      story: [
        {
          chapterTitle: "Neun Leben",
          translation:
            "„Ich dachte, niemand sei mir gefolgt.\n\nDann sah ich zwei Augen im Dunkeln.\n\nEine Katze vergisst nichts.\n\nDoch eine Katze verrät ihr Geheimnis nur\ndem, der genau hinsieht.“",
        },
        {
          translation:
            "„Die Katze führte mich zu einem Haus,\ndas älter war als meine Geschichte.\n\nDort spielten Männer ein Spiel,\ndas ihr fast vergessen habt.“",
        },
      ],
      challenge: {
        title: "Neun Leben",
        instruction:
          "Sucht im Café nach Darstellungen von Katzen. Gemälde, Figuren, Fotos und andere eindeutige Katzenbilder zählen alle.",
        question: "Wie viele Katzen könnt ihr finden?",
        hints: ["Schaut an die Wände, in die Regale und auf die Theke.", "Gemälde, Figuren und Fotos zählen alle."],
        explanation: "Neun, eine für jedes Leben.",
      },
      historicalReveal: {
        paragraphs: [
          "De Kat ist ein traditionelles Antwerpener Braunes Café (eine alte, holzvertäfelte Kneipe), bekannt als Künstlercafé.",
          "Das Gebäude selbst hat eine ältere, dokumentierte Baugeschichte. Das ist eine andere Geschichte als die des Cafés: Wie lange es das heutige Café schon gibt, muss noch erforscht werden.",
        ],
        sources: [],
      },
      clue: { title: "V · Neun Leben", value: "NEUN LEBEN" },
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "pubs-quinten-matsijs": {
      description: "Kapitel VI: Das vergessene Spiel.",
      drinks: ["Maredsous Tripel 10", "Trappist Orval", "Chimay Blue", "Kakao"],
      story: [
        {
          chapterTitle: "Das vergessene Spiel",
          translation:
            "„Die Männer am Tisch kannten mein Geheimnis.\n\nKeine Karten lagen vor ihnen.\n\nKeine Würfel.\n\nNur ein Spiel, das schon gespielt wurde,\nbevor ihre Großväter geboren waren.“",
        },
        { translation: "„Unter dem Zeichen des Fasses fand ich einen Namen.\n\nDoch keinen menschlichen Namen …“" },
      ],
      challenge: {
        title: "Das vergessene Spiel",
        instruction: "Sucht im Café nach einem alten, traditionellen Spiel.",
        question: "Welche Art von historischem Spiel findet ihr hier?",
        hints: ["Ihr sucht ein altes Spiel.", "Achtet auf etwas mit einem Fass."],
        explanation: "Das tonspel (Tonnenspiel): ein Spiel, älter als alle am Tisch.",
      },
      bonusChallenge: {
        title: "Bonus: Der alte Name",
        question: "Welcher historische Name ist mit diesem Wirtshaus verbunden?",
        hints: [],
      },
      historicalReveal: {
        paragraphs: [
          "Dieses historische Café befindet sich in einem Gebäude mit langer Geschichte, und sein Inneres ist voller alter Gegenstände.",
          "Das tonspel, das ihr gerade gefunden habt, soll rund 250 Jahre alt sein.",
          "Das Wirtshaus wird mit dem historischen Namen 't Gulick in Verbindung gebracht.",
        ],
        sources: [],
      },
      clue: { title: "VI · Das vergessene Spiel", value: "DAS FASS" },
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "pubs-de-varkenspoot": {
      description: "Kapitel VII: Das fehlende Zeichen.",
      drinks: ["Omer", "Hoegaarden Wit", "Kasteel Rouge", "Mineralwasser mit Kohlensäure"],
      story: [
        {
          chapterTitle: "Das fehlende Zeichen",
          translation:
            "„Ich wusste, dass sie nahe waren.\n\nIch riss die letzte Seite aus dem Buch.\n\nMeinen Namen durften sie nicht finden.\n\nIch hinterließ nur mein Zeichen.“",
        },
        { body: "Die letzten Zeilen wurden in Eile geschrieben." },
        {
          translation:
            "„Wenn du das liest,\nhast du sieben Zeichen gefunden.\n\nBring sie zum Bauern.\n\nDort wartet die letzte Seite.“",
        },
      ],
      challenge: {
        title: "Das Zeichen des Schweins",
        instruction: "Sucht in oder rund um De Varkenspoot nach dem deutlichsten Bild eines Schweins.",
        question: "In welcher Form taucht das Schwein auf?",
        options: ["Gemälde", "Figur", "Schild", "Glas"],
        hints: ["Schaut drinnen und rund um den Eingang.", "Es ist nicht flach."],
        explanation: "Das Schwein hat sein Zeichen hinterlassen.",
      },
      historicalReveal: {
        paragraphs: [
          "Dies ist einer der Orte, an denen die historische Recherche und die Recherche vor Ort noch laufen. Seine Geschichte wird nach dem Testlauf ergänzt.",
        ],
        sources: [],
      },
      clue: { title: "VII · Das fehlende Zeichen", value: "DAS SCHWEIN" },
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "pubs-boer-van-tienen": {
      description: "Kapitel VIII: Die letzte Seite.",
      drinks: ["Stella", "Tripel d'Anvers", "Bolleke", "Cola Zero"],
      story: [
        {
          chapterTitle: "Die letzte Seite",
          translation:
            "„Ihr seid meiner Route gefolgt.\n\nIhr habt getrunken, wo die Antwerpener tranken.\n\nGeschaut, wo Künstler schauten.\n\nUnd gesucht, wo andere vorbeigingen.\n\nDoch habt ihr euch gemerkt, was ihr gefunden habt?“",
        },
      ],
      challenge: {
        title: "Sieben Stufen",
        instruction: "Geht nach draußen und betrachtet genau die historische Treppengiebelfassade.",
        question: "Wie viele Stufen hat der historische Treppengiebel?",
        hints: ["Geht nach draußen und schaut auf den oberen Teil der Fassade.", "Zählt jede Stufe im Umriss des Giebels."],
        explanation: "Sieben Stufen, genau wie im Denkmalinventar beschrieben.",
      },
      historicalReveal: {
        paragraphs: [
          "In Den Boer van Tienen ist ein altes Antwerpener Wirtshaus.",
          "Das Gebäude stammt etwa aus der zweiten Hälfte des 16. oder der ersten Hälfte des 17. Jahrhunderts und steht unter Denkmalschutz.",
          "Das Denkmalinventar beschreibt die Fassade als Treppengiebel mit sieben Stufen.",
        ],
        sources: ["Inventaris Onroerend Erfgoed (flämisches Denkmalinventar)"],
      },
      clue: { title: "VIII · Die letzte Seite", value: "SIEBEN STUFEN" },
    },
  },

  finale: {
    title: "Die letzte Seite",
    intro: "Die letzte Seite öffnet sich nur denen, die sich an die Reise erinnern.",
    questions: [
      { title: "Die erstarrte Stunde", question: "Wann blieb die Zeit stehen?", hints: [] },
      { title: "Der Wächter", question: "Welches Tier wachte über De Muze?", hints: [] },
      { title: "Das vergessene Spiel", question: "Welches jahrhundertealte Spiel habt ihr entdeckt?", hints: [] },
    ],
    closingStory: [
      {
        chapterTitle: "Die letzte Seite",
        translation:
          "„Das Buch gehörte keinem berühmten Maler,\nKaufmann oder Bürgermeister.\n\nEs gehörte einem gewöhnlichen Antwerpener Wirt.\n\nSein Name verschwand aus der Geschichte.\n\nSeine Cafés nicht.\n\nJahrhundertelang gingen die Antwerpener weiter\ndurch dieselben Straßen, erzählten Geschichten und saßen gemeinsam\nan denselben Theken.\n\nVielleicht war es das, was er bewahren wollte.\n\nNicht seinen Namen.\n\nSondern die Stadt.“",
      },
    ],
  },
};
