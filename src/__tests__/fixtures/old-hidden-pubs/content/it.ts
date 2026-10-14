import type { HiddenPubsContent } from "./types";

/**
 * Hidden Pubs: Italian text, translated from the English master in ./en.ts.
 *
 * Rules (see CLAUDE.md):
 * - `story` is FICTION (the Lost Tavern Ledger); `historicalReveal` is real
 *   history only. Never invent facts, drinks or answers.
 * - Café names, street names and brand names are never translated.
 * - Progress never depends on drinking; no shots, no drinking challenges.
 */
export const hiddenPubsContentIt: HiddenPubsContent = {
  walk: {
    tagline: "La storia nascosta dei locali di Anversa",
    shortDescription:
      "Un'avventura di squadra attraverso otto caffè di Anversa. Votate le bevande, risolvete le sfide sul posto e ritrovate le pagine di un antico registro di taverna perduto.",
    description:
      "Un vecchio registro di taverna è riemerso, ma ne mancano otto frammenti. La vostra squadra va di caffè in caffè nel cuore di Anversa. A ogni tappa votate la bevanda della squadra, leggete una pagina del registro e risolvete una sfida che si può superare solo sul posto. Solo allora scoprite la storia dietro ciò che avete trovato, e il registro vi rivela il caffè successivo.\n\nL'alcol non è mai necessario. Ogni votazione comprende un'opzione analcolica, ognuno può sempre scegliere la propria bevanda e ogni turno si può saltare.",
    copy: {
      voteResultTitle: "La taverna ha parlato",
      tieTitle: "Pareggio!",
      tieSubtitle: "Deciderà il registro…",
      afterVoteMessage: "Ordinate da bere, prendetevi il vostro tempo e guardatevi intorno.",
      wrongAnswer: "Il registro tace.",
      correctAnswer: "L'inchiostro comincia a muoversi…",
      nextLocationTitle: "Il registro rivela un altro nome…",
      completionTitle: "Caso chiuso",
      completionMessage: "Anversa ha svelato uno dei suoi segreti.",
      clueCollectedTitle: "Il registro è cambiato",
      locationsTitle: "Taverne",
      locationsDiscoveredLabel: "taverne scoperte",
      routeButtonLabel: "Registro",
    },
    narrative: {
      title: "Il registro perduto della taverna",
      premise:
        "Un vecchio registro di taverna è riemerso. Quasi tutti i nomi sono sbiaditi e mancano otto frammenti. Seguite la pista di caffè in caffè, ritrovate ciò che era andato perduto e scoprite a chi apparteneva il registro.",
    },
    highlights: [
      "Otto caffè di Anversa",
      "Un mistero da risolvere in squadra",
      "Sfide che si risolvono solo sul posto",
      "La vera storia dietro ciò che scoprite",
      "Votazioni di squadra sulle bevande, sempre con un'opzione analcolica",
      "Un enigma finale che mette alla prova la vostra memoria",
    ],
    howItWorksSteps: [
      "Arrivate al caffè",
      "Votate la bevanda della squadra",
      "Leggete una pagina del registro",
      "Risolvete la sfida sul posto",
      "Scoprite la storia e raccogliete l'indizio",
      "Risolvete il mistero finale",
    ],
    practicalInfo: [
      { label: "Squadra", value: "Da 1 a 6 giocatori, con un solo telefono" },
      { label: "Età consigliata", value: "18+ (per via del tema dei locali)" },
      {
        label: "Alcol",
        value: "Mai necessario. Ogni votazione comprende un'opzione analcolica e ognuno può scegliere la propria bevanda.",
      },
      {
        label: "Votazioni sulle bevande",
        value: "Il voto della squadra è solo un suggerimento. Potete saltare ogni turno; i progressi non dipendono mai da ciò che ordinate.",
      },
    ],
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "pubs-rococo": {
      description: "Capitolo I: La prima pagina.",
      drinks: ["Cocktail Lazy Red Cheeks", "Super 8 IPA", "Tongerlo Blond", "Acqua tonica"],
      story: [
        {
          chapterTitle: "La prima pagina",
          body: "Vi è stato consegnato un vecchio registro di taverna, malridotto. La prima pagina è quasi del tutto scomparsa. Ne resta una sola frase:",
        },
        { translation: "“Chi vuole capire Anversa deve alzare lo sguardo.\nNon tutto ciò che sembra antico è ciò che sembra.”" },
        { translation: "“Cercate l'Angelo dall'altra parte della piazza.”" },
      ],
      challenge: {
        title: "Alzate lo sguardo",
        instruction: "Uscite e osservate l'edificio sopra il Rococo.",
        question: "Che forma ha la sommità della facciata?",
        options: ["A gradoni", "Arrotondata", "Piatta", "Triangolare"],
        hints: ["Allontanatevi abbastanza da vedere tutto l'edificio.", "Seguite il profilo della facciata contro il cielo."],
        explanation: "A gradoni, come una scala che sale verso il cielo.",
      },
      historicalReveal: {
        paragraphs: [
          "La storia di questo edificio è ancora da ricercare. Per ora, ricordatevi la forma che avete appena trovato.",
        ],
        sources: [],
      },
      clue: { title: "I · La prima pagina", value: "LA SCALA" },
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "pubs-den-engel": {
      description: "Capitolo II: Mezzanotte meno cinque.",
      drinks: ["Bolleke", "Stella", "Coca-Cola", "Birra analcolica"],
      story: [
        {
          chapterTitle: "Mezzanotte meno cinque",
          translation:
            "“L'Angelo conosceva il mio nome.\n\nMa nemmeno l'Angelo poteva fermare il tempo.\n\nQuando l'orologio andrà avanti di cinque minuti,\ntutto sarà perduto.”",
        },
        { translation: "“Restano cinque minuti.\n\nCercate i padri sotto la torre.”" },
      ],
      challenge: {
        title: "L'ora immobile",
        instruction: "Trovate l'insolito grande orologio all'interno del Café Den Engel.",
        question: "A che ora si è fermato l'orologio?",
        hints: ["Non guardate l'ora sul telefono.", "Cercate il grande orologio all'interno del caffè."],
        explanation: "Le dodici meno cinque, e così resterà.",
      },
      historicalReveal: {
        paragraphs: [
          "Il nome Den Engel («L'Angelo») risale al XIV secolo.",
          "Nel corso dei secoli l'edificio ha avuto vari usi. Nel 1740 ospitava un'attività legata a un droghiere o a uno speziale, e sulla facciata ne rimane un riferimento.",
          "Il caffè attuale risale all'inizio del Novecento.",
          "Il suo grande orologio è fermo per sempre alle dodici meno cinque. Secondo il Café Den Engel, l'orologio fermo ha ispirato un legame con Cenerentola: a mezzanotte la magia finisce, e così, alle dodici meno cinque, la festa non arriva mai a mezzanotte.",
        ],
        sources: ["Café Den Engel (storia del locale)"],
      },
      clue: { title: "II · Mezzanotte meno cinque", value: "11:55" },
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "pubs-paters-vaetje": {
      description: "Capitolo III: Sotto la cattedrale.",
      drinks: ["Fanta", "Lucy Beer", "Gulden Carolus Whisky Infused", "Seef Bier"],
      story: [
        {
          chapterTitle: "Sotto la cattedrale",
          translation:
            "“La pagina successiva era danneggiata.\n\nL'autore fuggì all'ombra della cattedrale.\n\nScrisse:\n\nQui perfino la pietra cerca di raggiungere il cielo.”",
        },
        {
          translation: "“Una torre.\n\nUna direzione.\n\nMa nessun suono.\n\nOra trovate il luogo dove Anversa ritrovò la sua voce.”",
        },
      ],
      challenge: {
        title: "Il gigante",
        instruction: "Uscite. Mettetevi vicino al Paters Vaetje e osservate con attenzione la cattedrale di Nostra Signora (Onze-Lieve-Vrouwekathedraal).",
        question: "Quante grandi torri completamente finite ha la cattedrale?",
        options: ["1", "2", "3", "4"],
        hints: [
          "Confrontate il lato sinistro e il lato destro della facciata della cattedrale.",
          "Contate solo le torri che raggiungono la loro altezza piena.",
        ],
        explanation: "Una. Il gigante è solo.",
      },
      historicalReveal: {
        paragraphs: [
          "La cattedrale di Nostra Signora di Anversa è famosa per la sua imponente torre nord.",
          "Il progetto originale prevedeva due grandi torri sulla facciata occidentale, ma la torre sud non fu mai completata fino alla stessa altezza.",
        ],
        sources: [],
      },
      clue: { title: "III · Sotto la cattedrale", value: "UNA TORRE" },
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "pubs-de-muze": {
      description: "Capitolo IV: La musa.",
      drinks: ["Cristal", "Lupulus", "Sprite", "La Chouffe"],
      story: [
        {
          chapterTitle: "La musa",
          translation:
            "“Sentii della musica.\n\nNon da un organo di chiesa.\n\nNon dalla strada.\n\nUna Musa mi chiamò dentro.\n\nSopra i bevitori vidi un animale\nche non si muoveva mai.”",
        },
        { translation: "“Il cavallo mi vide partire.\n\nMa un altro animale seguiva ogni mio passo.”" },
      ],
      challenge: {
        title: "Il guardiano",
        instruction: "Guardate con attenzione sopra il bancone.",
        question: "Quale animale veglia sul De Muze?",
        hints: ["La risposta è un animale.", "Guardate sopra il bancone."],
        explanation: "Un cavallo, che osserva i clienti da molto tempo.",
      },
      historicalReveal: {
        paragraphs: [
          "Il De Muze aprì alla fine di ottobre del 1964, fondato da Walter Masselis e Tone Pauwels. Divenne presto parte della scena artistica di Anversa.",
          "Ferre Grignard vi si esibiva regolarmente, e il 15 novembre 1965 presentò il suo primo disco proprio al De Muze. In seguito vi suonarono anche artisti internazionali come John Lee Hooker e Dexter Gordon.",
          "Nel 1967 un incendio danneggiò il primo e il secondo piano. Più tardi, sopra il bancone fu installata l'opera di Luc Maeyens conosciuta come «het Muzepaard» (il cavallo della Musa): il cavallo che avete appena trovato.",
        ],
        sources: [],
      },
      clue: { title: "IV · La musa", value: "IL CAVALLO" },
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "pubs-de-kat": {
      description: "Capitolo V: Nove vite.",
      drinks: ["Bolleke", "Stella", "Birra analcolica", "Acqua"],
      story: [
        {
          chapterTitle: "Nove vite",
          translation:
            "“Credevo che nessuno mi avesse seguito.\n\nPoi vidi due occhi nel buio.\n\nUn gatto non dimentica nulla.\n\nMa un gatto rivela il suo segreto\nsolo a chi guarda con attenzione.”",
        },
        {
          translation:
            "“Il gatto mi condusse a una casa\npiù antica della mia storia.\n\nLì alcuni uomini giocavano a un gioco\nche voi avete quasi dimenticato.”",
        },
      ],
      challenge: {
        title: "Nove vite",
        instruction:
          "Cercate nel caffè le raffigurazioni di gatti. Dipinti, statuette, fotografie e altre immagini chiare di gatti contano tutti.",
        question: "Quanti gatti riuscite a trovare?",
        hints: ["Controllate le pareti, gli scaffali e il bancone.", "Dipinti, statuette e foto contano tutti."],
        explanation: "Nove, uno per ogni vita.",
      },
      historicalReveal: {
        paragraphs: [
          "Il De Kat è un tradizionale caffè bruno di Anversa, noto come caffè degli artisti.",
          "L'edificio stesso ha una storia costruttiva più antica e documentata. È una storia distinta da quella del caffè: da quanto tempo esista il caffè attuale è ancora da ricercare.",
        ],
        sources: [],
      },
      clue: { title: "V · Nove vite", value: "NOVE VITE" },
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "pubs-quinten-matsijs": {
      description: "Capitolo VI: Il gioco dimenticato.",
      drinks: ["Maredsous Tripel 10", "Trappist Orval", "Chimay Blu", "Latte al cioccolato"],
      story: [
        {
          chapterTitle: "Il gioco dimenticato",
          translation:
            "“Gli uomini al tavolo conoscevano il mio segreto.\n\nDavanti a loro non c'erano carte.\n\nNé dadi.\n\nSolo un gioco a cui si giocava già\nprima che nascessero i loro nonni.”",
        },
        { translation: "“Sotto il segno della botte trovai un nome.\n\nMa non un nome umano…”" },
      ],
      challenge: {
        title: "Il gioco dimenticato",
        instruction: "Cercate nel caffè un antico gioco tradizionale.",
        question: "Che tipo di gioco storico trovate qui?",
        hints: ["Cercate un gioco antico.", "Cercate qualcosa che abbia a che fare con una botte."],
        explanation: "Il tonspel (il gioco della botte): un gioco più antico di chiunque sieda al tavolo.",
      },
      bonusChallenge: {
        title: "Bonus: l'antico nome",
        question: "Quale nome storico è associato a questa locanda?",
        hints: [],
      },
      historicalReveal: {
        paragraphs: [
          "Questo caffè storico si trova in un edificio dalla lunga storia, e il suo interno è pieno di oggetti antichi.",
          "Il tonspel che avete appena trovato avrebbe circa 250 anni.",
          "La locanda è associata al nome storico 't Gulick.",
        ],
        sources: [],
      },
      clue: { title: "VI · Il gioco dimenticato", value: "LA BOTTE" },
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "pubs-de-varkenspoot": {
      description: "Capitolo VII: Il segno mancante.",
      drinks: ["Omer", "Hoegaarden Wit", "Kasteel Rouge", "Acqua frizzante"],
      story: [
        {
          chapterTitle: "Il segno mancante",
          translation:
            "“Sapevo che erano vicini.\n\nStrappai l'ultima pagina dal registro.\n\nNon dovevano trovare il mio nome.\n\nLasciai soltanto il mio segno.”",
        },
        { body: "Le ultime righe furono scritte in fretta." },
        {
          translation:
            "“Se state leggendo queste righe,\navete trovato sette segni.\n\nPortateli dal Contadino.\n\nLì vi aspetta l'ultima pagina.”",
        },
      ],
      challenge: {
        title: "Il segno del maiale",
        instruction: "Cercate dentro o intorno al De Varkenspoot il riferimento visivo più evidente a un maiale.",
        question: "Che forma ha il riferimento al maiale?",
        options: ["Dipinto", "Statua", "Insegna", "Vetro"],
        hints: ["Guardate all'interno e intorno all'ingresso.", "Non è piatto."],
        explanation: "Il maiale ha lasciato il suo segno.",
      },
      historicalReveal: {
        paragraphs: [
          "Questo è uno dei luoghi in cui le ricerche storiche e sul posto sono ancora in corso. La sua storia verrà aggiunta dopo il playtest.",
        ],
        sources: [],
      },
      clue: { title: "VII · Il segno mancante", value: "IL MAIALE" },
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "pubs-boer-van-tienen": {
      description: "Capitolo VIII: L'ultima pagina.",
      drinks: ["Stella", "Tripel d'Anvers", "Bolleke", "Cola Zero"],
      story: [
        {
          chapterTitle: "L'ultima pagina",
          translation:
            "“Avete seguito il mio percorso.\n\nAvete bevuto dove bevevano gli abitanti di Anversa.\n\nGuardato dove guardavano gli artisti.\n\nE cercato dove altri passavano oltre.\n\nMa vi ricordate ciò che avete trovato?”",
        },
      ],
      challenge: {
        title: "Sette gradini",
        instruction: "Uscite e osservate con attenzione la storica facciata a gradoni.",
        question: "Quanti gradini ha lo storico frontone a gradoni?",
        hints: ["Uscite e guardate la sommità della facciata.", "Contate ogni gradino del profilo del frontone."],
        explanation: "Sette gradini, proprio come descrive l'inventario del patrimonio.",
      },
      historicalReveal: {
        paragraphs: [
          "In Den Boer van Tienen è un'antica locanda di Anversa.",
          "L'edificio risale all'incirca alla seconda metà del XVI secolo o alla prima metà del XVII secolo, ed è tutelato come monumento.",
          "L'inventario del patrimonio descrive la sua facciata come un frontone a gradoni con sette gradini.",
        ],
        sources: ["Inventaris Onroerend Erfgoed (inventario del patrimonio fiammingo)"],
      },
      clue: { title: "VIII · L'ultima pagina", value: "SETTE GRADINI" },
    },
  },

  finale: {
    title: "La pagina finale",
    intro: "La pagina finale si aprirà solo per chi ricorda il viaggio.",
    questions: [
      { title: "L'ora immobile", question: "Quando si è fermato il tempo?", hints: [] },
      { title: "Il guardiano", question: "Quale animale vegliava sul De Muze?", hints: [] },
      { title: "Il gioco dimenticato", question: "Quale gioco secolare avete scoperto?", hints: [] },
    ],
    closingStory: [
      {
        chapterTitle: "L'ultima pagina",
        translation:
          "“Il registro non apparteneva a un pittore famoso,\na un mercante o a un borgomastro.\n\nApparteneva a un comune oste di Anversa.\n\nIl suo nome è scomparso dalla storia.\n\nI suoi caffè no.\n\nPer secoli gli abitanti di Anversa hanno continuato a percorrere\nle stesse strade, a raccontare storie e a sedere insieme\nagli stessi banconi.\n\nForse era questo che voleva conservare.\n\nNon il suo nome.\n\nMa la città.”",
      },
    ],
  },
};
