import type { PoortjesStopText } from "../types";

/**
 * Part 2: Cathedral & Old Town (gates 10–23, historical stops). Italian text, translated from ../en/.
 */
export const deel2: Record<string, PoortjesStopText> = {
  // ── Pause + cards ───────────────────────────────────────────────────
  "poortjes-grote-markt": {
    name: "Grote Markt: una pausa al Rococo",
    subtitle: "Sedetevi un momento nel cuore della città",
    introduction: [
      "È ora di una pausa. Siete sulla Grote Markt, la piazza principale di Anversa, e il caffè Rococo si affaccia sulla piazza. Accomodatevi se volete, oppure sedetevi su una panchina o su un gradino: non è necessario ordinare nulla per proseguire.",
      "Mentre vi riposate, qui sotto potete leggere tre brevi racconti: sulla piazza, sul municipio e sulla fontana. Alzate lo sguardo ogni tanto: tutto ciò che descrivono è proprio davanti a voi.",
    ],
    sections: [],
    infoBoxes: [
      {
        kind: "pause",
        title: "È ora di una pausa",
        paragraphs: [
          "Questa pausa è un suggerimento, non un obbligo. La passeggiata continua semplicemente, che ordiniate qualcosa oppure no.",
          "Chi prende qualcosa da bere lo sceglie da sé: con o senza alcol. Non abbiamo verificato gli orari di apertura del Rococo; se il caffè è chiuso o pieno, qualsiasi dehors o panchina sulla piazza andrà benissimo.",
        ],
      },
    ],
    cards: [
      {
        id: "card-grote-markt",
        title: "La Grote Markt",
        subtitle: "La piazza delle corporazioni",
        imageId: "grote-markt-1905",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Intorno alla piazza si ergono alte case delle corporazioni con frontoni a gradoni e a volute, coronati da figure dorate. Le corporazioni erano le associazioni di artigiani e commercianti. Regolavano buona parte della vita cittadina: chi poteva lavorare, che cosa si poteva vendere e con quale qualità. Le loro case qui erano il loro biglietto da visita.",
              "Nel novembre 1576 soldati spagnoli ammutinati saccheggiarono la città. L'incendio che appiccarono distrusse le case sulla piazza. L'esempio più bello di ciò che risorse in seguito è la casa dell'Oude Voetboog (la Vecchia Balestra), la corporazione di San Giorgio: costruita nel 1515–1516, distrutta nel 1576 e ricostruita in stile rinascimentale nel 1580–1582.",
            ],
          },
          {
            heading: "Più giovane di quanto sembri",
            kind: "history",
            paragraphs: [
              "Molto di ciò che vedete è più recente di quanto sembri. Nel 1895 un cittadino, R. Joostens, lasciò del denaro per restituire alla Grote Markt il suo antico splendore. Dalla fine del XIX secolo ai primi del XX, le facciate sul lato nord e il numero 44 sul lato sud furono liberamente ricostruite e abbellite nello spirito del Cinquecento.",
            ],
          },
        ],
        didYouKnow: [
          "In cima alla facciata dell'Oude Voetboog, cercate il San Giorgio dorato a cavallo che combatte il drago.",
        ],
      },
      {
        id: "card-stadhuis",
        title: "Il municipio",
        subtitle: "Costruito con orgoglio, bruciato nella furia",
        imageId: "stadhuis-1866",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Il municipio (Stadhuis) fu costruito tra il 1561 e il 1565 su progetto di Cornelis Floris de Vriendt, insieme ad altri architetti e artisti. Anversa era allora una delle città più ricche d'Europa e voleva mostrarlo.",
              "Osservate le lunghe ali tranquille e la parte centrale riccamente decorata che si innalza oltre la linea del tetto, piena di colonne, nicchie e statue. Quel contrasto tra ordine pacato ed esplosione di decorazioni al centro è tipico del Rinascimento che Floris portò ad Anversa.",
            ],
          },
          {
            heading: "La Furia spagnola",
            kind: "history",
            paragraphs: [
              "Il 4 novembre 1576 truppe spagnole ammutinate, che non ricevevano la paga da molto tempo, presero d'assalto la città. Il governo cittadino organizzò un contrattacco proprio da questo municipio. I soldati diedero fuoco all'edificio; rimasero in piedi soltanto i muri perimetrali. Quante persone morirono non si sa con precisione. Le stime vanno da alcune centinaia a circa 8.000.",
            ],
          },
        ],
      },
      {
        id: "card-brabo",
        title: "La fontana di Brabo",
        subtitle: "Un gigante, una mano e il nome di una città",
        imageId: "brabo-photochrom",
        sections: [
          {
            heading: "La leggenda",
            kind: "legend",
            paragraphs: [
              "Tanto tempo fa, così si racconta, sulle rive della Schelda viveva un gigante chiamato Druon Antigoon. Esigeva un pedaggio da ogni nave che voleva passare. Chi non pagava perdeva una mano, che il gigante gettava nel fiume.",
              "Finché il giovane soldato romano Silvius Brabo lo sfidò, lo sconfisse, tagliò la mano al gigante e la gettò nella Schelda. È così, dice la leggenda, che la città ebbe il suo nome: «hand werpen», gettare una mano: Antwerpen.",
            ],
          },
          {
            heading: "Che cosa ne pensano gli storici",
            kind: "interpretation",
            paragraphs: [
              "Una storia meravigliosa, ma non una spiegazione che gli storici prendano sul serio. L'origine del nome Antwerpen è incerta. La maggior parte delle ipotesi lo collega non alle mani ma alla terra: a un terreno lungo il fiume, un lembo di terra «antistante», sollevato dall'acqua. La leggenda è un tentativo molto più tardo di spiegare un nome la cui vera origine era stata dimenticata.",
            ],
          },
          {
            heading: "La statua",
            kind: "history",
            paragraphs: [
              "La fontana è opera dello scultore anversano Jef Lambeaux, che nel 1883 aveva già in gran parte completato il suo progetto. Fu collocata sulla Grote Markt, davanti al municipio, nel 1887, in un periodo in cui Anversa amava celebrare la propria storia e la propria identità. Brabo sta su una base rocciosa e getta lontano la mano.",
            ],
          },
        ],
        didYouKnow: [
          "Le mani della leggenda si vedono ovunque ad Anversa: nello stemma cittadino (un castello sormontato da due mani) e nelle «mani di Anversa» di cioccolato e di biscotto nei negozi intorno alla piazza.",
        ],
      },
    ],
    didYouKnow: [],
    thenAndNow: [
      "Confrontate la foto del 1905 circa con la piazza di oggi. All'epoca la ricostruzione delle facciate era in pieno svolgimento.",
    ],
    transitionToNext: "Riposati? Raggiungete la cattedrale, a poche strade da qui. La sua torre si vede già sopra i tetti.",
  },

  // ── Cathedral ────────────────────────────────────────────────────────
  "poortjes-kathedraal": {
    name: "Onze-Lieve-Vrouwekathedraal (Cattedrale di Nostra Signora)",
    subtitle: "Una torre e mezza e 170 anni di cantiere",
    introduction: [
      "Davanti a voi si erge una delle più grandi chiese gotiche dei Paesi Bassi storici. Per secoli la sua torre nord, alta circa 123 metri, fu la prima cosa di Anversa che i marinai sulla Schelda vedevano.",
      "Osservate prima la facciata. La torre di sinistra sale fino a un'elegante guglia; quella di destra si ferma a circa un terzo di quell'altezza. Erano previste due grandi torri; ne fu completata solo una.",
    ],
    sections: [
      {
        heading: "Generazioni di costruttori",
        kind: "history",
        paragraphs: [
          "La cattedrale fu costruita in circa 170 anni, dalla metà del XIV secolo fino al 1521, da generazioni di costruttori che sapevano che non l'avrebbero mai vista finita.",
          "Nel 1521, proprio quando la chiesa fu completata, Anversa decise che non era abbastanza grande. Domien de Waghemakere e Rombout Keldermans progettarono un gigantesco ampliamento del coro: il Nieuwerck. Il 15 luglio 1521 il giovane imperatore Carlo V posò personalmente la prima pietra. Ma nel 1533 un grande incendio danneggiò la chiesa, tutto il denaro fu destinato alle riparazioni e nel 1537 il Nieuwerck fu abbandonato definitivamente.",
        ],
      },
      {
        heading: "Le tempeste della storia",
        kind: "history",
        paragraphs: [
          "Durante la furia iconoclasta del 1566, un'ondata di collera protestante contro le immagini, gran parte degli interni fu distrutta. Due secoli dopo, le truppe rivoluzionarie francesi occuparono la città, chiusero la chiesa e ne portarono via i tesori.",
          "Molto di ciò che vedete oggi all'interno fu riportato indietro o restaurato in seguito, comprese pale d'altare di Rubens. Le più celebri sono l'Innalzamento della Croce e la Deposizione dalla Croce.",
        ],
      },
      {
        heading: "Come leggere una chiesa gotica",
        kind: "context",
        paragraphs: [
          "L'architettura gotica si riconosce dagli archi a sesto acuto, dalle alte finestre e dalla tensione verso l'altezza e la luce. I muri sono sostenuti da contrafforti, che lasciano più spazio al vetro. Lungo i muri laterali, cercate quei massicci pilastri addossati alla parete e gli archi a sesto acuto delle finestre.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visitare l'interno",
        paragraphs: [
          "L'interno, con i dipinti di Rubens, si può visitare con un biglietto d'ingresso a pagamento. Gli orari di apertura variano a causa delle funzioni religiose e delle festività: verificateli prima di andare.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://visit.antwerpen.be/en/info/cathedral-of-our-lady",
      },
    ],
    didYouKnow: [
      "Il Nieuwerck non fu mai costruito, ma non è nemmeno scomparso del tutto. Le sue fondamenta e i suoi pilastri sopravvivono nella fila di case intorno al coro, tra la Lijnwaadmarkt e la Groenplaats.",
    ],
    lookAt: [
      {
        title: "Una torre e mezza",
        body: "Confrontate la facciata con l'acquaforte di Wenceslaus Hollar del 1649 in questa pagina: la sagoma asimmetrica con una sola torre finita era già la stessa allora.",
      },
    ],
    transitionToNext: "Riattraversate la Grote Markt e, dietro il municipio, imboccate la Gildekamersstraat. Lì vi aspetta la vostra prima prova di ricerca.",
  },

  // ── Gates 11 and 12: search task ─────────────────────────────────────
  "poortjes-gildekamersstraat": {
    name: "Gildekamersstraat",
    subtitle: "Prova di ricerca: qual è la porta?",
    introduction: [
      "La Gildekamersstraat (via delle Sale delle corporazioni) è una stretta via dietro il municipio, piena di porte, portali e pietre murate nelle facciate. Smekens vi disegnò due portali. La domanda è: riuscite a trovarli?",
    ],
    searchTask: {
      title: "Riuscite a trovare il portale del disegno?",
      intro: "Qui sotto ci sono due disegni del 1951. Percorrete lentamente la via e confrontate: la forma dell'arco, la chiave di volta, le date, la decorazione in alto. Prendetevi il vostro tempo, e usate gli indizi solo se siete in difficoltà.",
      hideStoryUntilDone: true,
      items: [
        {
          plate: 10,
          question: "Qual è questa porta?",
          hints: [
            "Osservate bene la chiave di volta in cima all'arco: c'è un numero.",
            "Il numero è un anno del XVII secolo. Guardate i numeri civici più bassi.",
          ],
          solution: "Gildekamersstraat 7, la casa De Swane (Il cigno).",
          explanation: [
            "Secondo l'inventario, sul portale compare l'anno 1631 nella forma «A. 1631». La casa De Swane bruciò durante la Furia spagnola del 1576 e fu ricostruita nel 1580–1581. Nel 1633 fu acquistata per la corporazione dei passamanai, che la utilizzò come sede fino alla Rivoluzione francese. I passamanai producevano nastri, galloni e cordoni decorativi.",
            "Smekens afferma che la corporazione dei passamanai si trovava qui «alla fine del XVI secolo»; l'inventario indica il 1633 per l'acquisto. Entrambe le fonti collegano dunque la casa allo stesso mestiere, ma non allo stesso anno.",
          ],
        },
        {
          plate: 8,
          question: "E questa, con la finestrella e le volute sopra?",
          hints: [
            "Accanto a questo disegno Smekens scrisse «Gildekamerstraat 9» e l'anno 1612.",
            "La casa si chiamava «Den rooden osch» o «Den osch» (il bue rosso, il bue). Guardate i numeri civici intorno all'8 e al 9, e le ancore murali che formano una data.",
          ],
          solution: "Secondo Smekens: la casa Den (rooden) Osch, numero 9 nel 1951.",
          explanation: [
            "Oggi l'inventario descrive «Den Os» al numero 8: un frontone a gradoni datato 1612 dalle sue ancore murali, con una porta a tutto sesto, una «porta a punta di diamante» con chiave di volta e imposte a punta di diamante.",
            "Per onestà: il disegno di Smekens mostra un portale più ricco, con sopra una finestrella con volute e lesene decorate. Non siamo riusciti a stabilire con certezza se si tratti della stessa porta, o se il portale sia stato modificato nel frattempo o sia scomparso. Voi che cosa avete trovato? [Da verificare sul posto]",
          ],
        },
      ],
      outro: "Questa via mostra perché il libro di Smekens è così prezioso: i numeri civici cambiano, le porte vengono sostituite, ma una misura al centimetro resta.",
    },
    sections: [
      {
        heading: "La storia della via",
        kind: "history",
        paragraphs: [
          "Den Os era già menzionata nel primo quarto del XIV secolo. Dal 1550 fu una casa delle accise, dove si riscuotevano le imposte sulle merci. Bruciò durante la Furia spagnola del 1576 e fu ricostruita nel 1612 dalla famiglia De Groote. Nel 1877 la città la acquistò per i servizi di polizia; intorno al 1900 la città ospitò servizi di polizia anche in De Swane.",
          "Su Den Os Smekens scrive che «era già stata acquistata dalla Città a quell'epoca». Il municipio è letteralmente dietro l'angolo: la città si è espansa nelle case alle sue spalle.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "Secondo l'inventario, il portale di De Swane è un portale barocco a tutto sesto in una cornice bugnata di pietra blu con la data «A. 1631», con imbotte ad arco ribassato, dadi di base, imposte e una chiave di volta scanalata sotto un gocciolatoio a cornicione su volute. Le facciate anteriore e posteriore furono ricostruite intorno al 1953–1954 su progetto dell'architetto Gaston Laporte.",
        ],
      },
    ],
    glossary: ["diamantkop", "sluitsteen", "spiegelboog"],
    didYouKnow: [
      "Una casa delle accise come Den Os era un ufficio delle imposte. Tasse sulle merci e sul commercio ritorneranno più avanti in questa passeggiata, alla Stadswaag.",
    ],
    transitionToNext: "Attraversate il portale fino alla piazza verde dietro il municipio: la Leonie Glassplein.",
  },

  // ── Leonie Glassplein (+ vanished 13 and 14) ─────────────────────────
  "poortjes-leonie-glassplein": {
    name: "Leonie Glassplein",
    subtitle: "Un giardino nuovo, due portali scomparsi",
    introduction: [
      "Vi trovate in una piazza sorprendentemente verde dietro il municipio. Osservate le linee di ottone nel terreno e gli strati della vegetazione: il progetto richiama una miniera di diamanti a cielo aperto.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Per lungo tempo l'area dietro il municipio era per lo più lastricata e chiusa. Fu ridisegnata come giardino pubblico, inaugurato il 26 novembre 2020. Il progetto dello studio Stramien richiama le miniere di diamanti: «La stratificazione che caratterizza le miniere è resa con linee di ottone che accentuano il rilievo esistente della piazza.»",
          "La piazza porta il nome di Leonie Glass (1876–1961), una figura di rilievo della comunità anversana dei diamanti. Era la moglie del commerciante di diamanti Isidore Tolkowsky e la madre di Marcel Tolkowsky, «l'uomo che ideò la forma del moderno diamante rotondo a taglio brillante». Dopo la morte del marito nel 1931 emigrò a New York. La piazza è anche il giardino interno di DIVA, il museo dei diamanti, dei gioielli e dell'argento.",
        ],
      },
      {
        heading: "Argentieri e portali scomparsi",
        kind: "history",
        paragraphs: [
          "La parte della piazza sulla Zilversmidstraat (via degli Argentieri) è sempre aperta. In quella via Smekens disegnò due portali poi scomparsi: il numero 5, un piccolo portale in stile Luigi XV, e il numero 17, un piccolo portale rinascimentale. Li troverete più sotto, tra i portali scomparsi.",
          "Il numero 17 aveva già viaggiato in precedenza. Secondo Smekens si trovava in origine contro la facciata del birrificio De Trouw, uno dei birrifici che Gilbert van Schoonbeke costruì nella Brouwersstraat nel XVI secolo, e fu trasferito nella Zilversmidstraat quando quell'edificio fu demolito intorno al 1880.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Accesso",
        paragraphs: [
          "La parte sulla Zilversmidstraat è sempre aperta. La parte accanto al museo DIVA è aperta solo durante l'orario del museo. Se il passaggio è chiuso, fate il giro passando per la Grote Markt e la Zilversmidstraat.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.agvespa.be/nieuws/iedereen-welkom-op-het-leonie-glassplein",
      },
    ],
    didYouKnow: [
      "La Brouwersstraat (via dei Birrai) di Smekens esiste ancora con un altro nome: dal 1936 si chiama Adriaan Brouwerstraat. Alla fine di questa passeggiata vi troverete lì, davanti a quattro portali ancora al loro posto.",
    ],
    transitionToNext: "Passando per la Zilversmidstraat raggiungete la Oude Beurs, la via che prende il nome dalla primissima borsa di Anversa.",
  },

  // ── Gate 20 (+ vanished 21) ──────────────────────────────────────────
  "poortjes-oude-beurs": {
    name: "Oude Beurs 16: Den Spieghel",
    subtitle: "Una madre, un bambino e uno specchio",
    introduction: [
      "Sulla Oude Beurs, cercate il portale barocco riccamente decorato con una porta di legno. Guardate la parte semicircolare sopra la porta: vi è intagliata nel legno una piccola scena.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Den Spieghel (Lo specchio) è menzionato già all'inizio del XIV secolo. Un tempo il complesso si estendeva dalla Grote Markt fino a qui, alla Oude Beurs. Nel 1506 fu acquistato dal mercante Peter Gielis. Tra i proprietari successivi figurano il tesoriere cittadino Alexander van den Broeck-Vekemans e suo figlio Jan-Alexander; dopo il 1650 il notaio Bartholomeus Van den Berghe. Dal 1888 ospitò una scuola elementare femminile.",
          "Smekens indica come proprietario originario Steven Butken di Colonia e afferma che «Alex van den Broeck (XVII secolo)» voleva trasformare la proprietà in «una sorta di palazzo». Non abbiamo trovato Butken nell'inventario. [Da verificare]",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive un portale a tutto sesto del terzo quarto del XVII secolo «in sontuoso stile barocco», in pietra blu. La porta di legno contiene «un rilievo intagliato nella sopraluce»: «una donna seduta che allatta, con uno specchio nella mano destra, circondata da putti». Smekens: «una donna seduta che si guarda allo specchio mentre il suo bambino si specchia nella madre».",
          "Il complesso comprende anche una torre domestica ottagonale in mattoni, probabilmente del 1506 circa, una delle più antiche torri domestiche conservate ad Anversa.",
        ],
      },
      {
        heading: "La prima borsa di Anversa",
        kind: "history",
        paragraphs: [
          "La via deve il suo nome alla prima borsa (beurs) della città. Una «old borze» in legno del 1485 fu ricostruita nel 1515, sotto la direzione di Dominicus de Waghemakere, con un porticato tardogotico in pietra, presso la casa «den grooten Rhijn» sulla Hofstraat, dietro l'angolo.",
          "Il commercio crebbe così in fretta che intorno al 1526–1527 i mercanti chiesero più spazio. Nel 1531–1532 fu costruita una nuova borsa tra la Meir e la Lange Nieuwstraat, e nel 1533 quella vecchia chiuse. Visiteremo quella nuova borsa, la Handelsbeurs, più avanti in questa passeggiata.",
        ],
      },
    ],
    glossary: ["barleef", "waaier"],
    thenAndNow: [
      "Allora: Smekens descrisse la scena della madre e del bambino con lo specchio in una sola frase.",
      "Oggi: l'intaglio si trova nella sopraluce sopra la porta. Quanto si è conservato? Riuscite a vedere i putti (angioletti) intorno alla donna?",
    ],
    didYouKnow: [
      "«Den Spieghel» è un nome di casa eloquente: l'intaglio sopra la porta mostra letteralmente uno specchio.",
    ],
    transitionToNext: "Raggiungete la Melkmarkt. Cercate una casa con una scarpa d'oro.",
  },

  // ── Gate 15 ───────────────────────────────────────────────────────────
  "poortjes-melkmarkt": {
    name: "Melkmarkt 37",
    subtitle: "De Gulde Schoen (La scarpa d'oro)",
    introduction: [
      "Cercate il portale con due teste di leone e un cartiglio con il nome della casa: «Gulde Schoen». Oggi la casa è un hotel; il portale è più antico di tutto ciò che lo circonda.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Smekens scrive brevemente: «Apparteneva alla casa De gulden schoen.» La casa stessa fu profondamente modificata nel XIX secolo: nel 1847 il commerciante di legname Willem Westlake fece ridurre la facciata a uno schema regolare di quattro campate, e nel 1849 il tetto a capanna fu sostituito da un piano in più. Dal 2018 è un hotel.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "Secondo l'inventario, il portale è un portale barocco del terzo quarto del XVII secolo, con «una cornice in pietra blu riccamente scolpita», capitelli ionici, lesene bugnate, teste di leone scolpite e un cartiglio con l'iscrizione «Gulde Schoen», coronato da un frontone spezzato a volute. La cornice d'ingresso è tutelata dal 1976.",
        ],
      },
    ],
    glossary: ["fronton", "cartouche"],
    thenAndNow: [
      "Allora: nel 1951 il portale si trovava in una facciata già «regolarizzata» un secolo prima.",
      "Oggi: il portale seicentesco è la parte più antica della facciata. Cercate le teste di leone nel disegno e dal vivo.",
    ],
    didYouKnow: [
      "Un nome di casa come «Gulde Schoen» può riferirsi a un mestiere o a un'insegna di bottega. Se qui abbiano mai abitato dei calzolai, non lo sappiamo.",
    ],
    transitionToNext: "Raggiungete la Wolstraat, dove due portali del libro si trovano ad appena un centinaio di metri l'uno dall'altro.",
  },

  // ── Gate 16 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-7": {
    name: "Wolstraat 7",
    subtitle: "De Tennen Pot (Il vaso di stagno)",
    introduction: [
      "Cercate il portale monumentale in una facciata intonacata per il resto semplice. Sopra la porta c'è una sopraluce in ferro con sbarre che si aprono come raggi di sole.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "De Tennen Pot è una tradizionale casa profonda che risale alla seconda metà del XVI secolo. Il nome si riferisce a un vaso di stagno. Nel 1850 le finestre a croce furono abbassate; nel 1895 il proprietario, Vochten, demolì il frontone a gradoni e fece costruire un mezzanino su progetto dell'architetto Eugène Dieltiëns. Nel 1921 Eugène e suo figlio Jules Dieltiëns progettarono la vetrina che c'è ancora oggi.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive «un portale monumentale a tutto sesto inserito in una cornice di barocco scultoreo» del terzo quarto del XVII secolo, in pietra blu, con un arco a tutto sesto modanato e bugnato, lesene con capitelli compositi e una sopraluce in ferro a motivo raggiato. Quella sopraluce risale soltanto al 1850.",
        ],
      },
    ],
    glossary: ["waaier", "kapiteel"],
    thenAndNow: [
      "Allora: nel 1951 il frontone a gradoni era scomparso già da più di mezzo secolo; solo il portale ricordava la casa seicentesca.",
      "Oggi: cercate la differenza tra la pietra del XVII secolo e la sopraluce del XIX.",
    ],
    didYouKnow: [
      "Questa sola facciata racchiude tre epoche: un portale del XVII secolo, una sopraluce del 1850 e una vetrina del 1921.",
    ],
    transitionToNext: "Poco più avanti nella stessa via, al numero 30, vi aspetta una porta piena di grappoli d'uva e delfini.",
  },

  // ── Gate 17 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-30": {
    name: "Wolstraat 30",
    subtitle: "Het Scilt van Londen (Lo scudo di Londra)",
    introduction: [
      "Questa volta non è interessante solo la pietra, ma soprattutto la porta di legno. Osservate il medaglione al centro e le piccole figure sopra di esso.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Het Scilt van Londen è una tradizionale casa profonda che sia Smekens sia l'inventario datano al 1625. Nel 1853 il bottaio Pierre Van Hove la fece trasformare in stile neoclassico. Non sappiamo con certezza come fosse in origine la facciata.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive una «notevole porta a tutto sesto inserita in una cornice barocca di pietra blu (dipinta), da datare al terzo quarto del XVII secolo». La porta di legno e la tettoia recano rilievi che alludono al commercio del vino: «Il medaglione centrale mostra due busti giovanili, probabilmente il dio del vino Bacco e sua moglie Arianna», e sopra di essi «due putti speculari con grappoli d'uva seduti su delfini».",
        ],
      },
      {
        heading: "Duquesnoy?",
        kind: "interpretation",
        paragraphs: [
          "Smekens scrive che la porta «è attribuita a François Duquesnoy (1594–1642)»; anche l'inventario cita questa attribuzione, con le date 1597–1643. Un'attribuzione non è una prova. Inoltre l'inventario data la cornice al terzo quarto del XVII secolo, dopo la morte di Duquesnoy. Chi l'abbia realizzata resta quindi una questione aperta.",
        ],
      },
    ],
    glossary: ["barleef"],
    thenAndNow: [
      "Allora: Smekens disegnò la porta con i suoi rilievi; secondo l'inventario la cornice è dipinta.",
      "Oggi: contate i delfini e cercate i grappoli d'uva.",
    ],
    didYouKnow: [
      "Secondo l'inventario, l'uva, Bacco e Arianna alludono al commercio del vino. Non siamo riusciti a scoprire perché la casa si chiami «Het Scilt van Londen».",
    ],
    transitionToNext: "Raggiungete la Jeruzalemstraat, una stradina che collega la Wolstraat e la Oude Waag. Cercate una porta stretta accanto al numero 14.",
  },

  // ── Gate 10 (+ vanished 18 and 22) ───────────────────────────────────
  "poortjes-jeruzalemstraat": {
    name: "Jeruzalemstraat",
    subtitle: "Una porta verso la Terra Santa",
    introduction: [
      "Sul fianco della casa d'angolo con la Oude Waag, cercate una stretta porta in pietra blu con sopraluce. Smekens scrive: «accanto al n. 14».",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "La porta appartiene alla casa d'angolo «Jeruzalem» (Oude Waag 1–3), menzionata nel 1564 come «una casa d'angolo con frontone a gradoni chiamata Jeruzalem». La casa fu trasformata in stile neoclassico nel 1837–1838, ampliata nel 1903 e ricostruita radicalmente nel 1946 dall'architetto Joseph De Paepe. La porta fu risparmiata.",
          "Smekens spiega il nome «come ricordo dei primi viaggi da Anversa verso la Terra Santa». L'inventario non fornisce alcuna spiegazione del nome. La sua spiegazione è quindi una possibilità, non un fatto accertato.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive «la piccola porta barocca in pietra blu» della seconda metà del XVII secolo: una «porta a tutto sesto con archivolto modanato e bugnato su lesene scolpite e bugnate» e una sopraluce ad arco ribassato con volute e girali. La cornice d'ingresso è tutelata dal 1976.",
        ],
      },
      {
        heading: "Perché siamo qui adesso",
        kind: "context",
        paragraphs: [
          "Nell'elenco di questa passeggiata questo è il portale 10, subito dopo la Suikerrui. Ma la Jeruzalemstraat si trova qui, tra la Wolstraat e la Oude Waag, non vicino alla Suikerrui. Per questo la visitiamo ora, senza fare avanti e indietro.",
        ],
      },
    ],
    glossary: ["archivolt"],
    didYouKnow: [
      "Due altri portali del libro si trovavano qui vicino e sono scomparsi: sulla Grote Goddaard (la casa De witte engel, L'angelo bianco) e sulla Engelse Beurs, presso una piccola borsa che, secondo Smekens, la città aveva fatto costruire per i mercanti inglesi nel 1550.",
    ],
    transitionToNext: "Raggiungete la Zwartzustersstraat. Il convento che vi si trova è in ristrutturazione, ma la sua storia non ne risente affatto.",
  },

  // ── Gate 19: in renovation ───────────────────────────────────────────
  "poortjes-zwartzusters": {
    name: "Zwartzustersstraat 25",
    subtitle: "Sei secoli di cure dietro un solo portale",
    introduction: [
      "Davanti a voi c'è il portale barocco dello Zwartzusterklooster, il convento delle Suore Nere. Il convento è in ristrutturazione dalla fine del 2025. Oggi quindi potreste vedere il portale dietro le recinzioni del cantiere, o temporaneamente imballato.",
    ],
    sections: [
      {
        heading: "Chi erano le Suore Nere?",
        kind: "history",
        paragraphs: [
          "Le Suore Nere (Zwartzusters) seguivano la Regola di sant'Agostino. Si stabilirono ad Anversa nel 1345, dapprima in un edificio presso la Koepoort, donato da «Hendrik Suderman, un ricco mercante tedesco». Smekens lo chiama «H. Südermann».",
          "Il loro nome deriva dall'abito. Intorno al 1462 pronunciarono i voti monastici e cambiarono il loro abito grigio con uno nero.",
        ],
      },
      {
        heading: "La cura dei malati",
        kind: "history",
        paragraphs: [
          "Le suore si dedicavano alla cura dei malati. Sotto il governo cittadino calvinista (1571–1585) proseguirono quel lavoro nonostante le persecuzioni. Dopo il 1585 godettero di protezione. Nel 1798 furono espulse dalle autorità francesi; nel 1823 tornarono. Le ultime suore partirono nel 2014.",
        ],
      },
      {
        heading: "Il complesso",
        kind: "history",
        paragraphs: [
          "Il convento crebbe per fasi: una nuova cappella nel 1507, l'alloggio del direttore spirituale nel 1520, un refettorio e un dormitorio nel 1536. Nel 1608 l'ala nord fu adibita a ospedale. Nel 1670–1678 il refettorio fu ampliato e la lavanderia e la cucina furono rinnovate; la cucina era «interamente rivestita di piastrelle di Delft».",
          "La cappella è una piccola chiesa a sala gotica del primo quarto del XVI secolo con una volta a botte acuta in legno. Le ali est e ovest furono costruite nel 1904 su progetto di Paul Van Glabbeek.",
        ],
      },
      {
        heading: "L'architettura del portale",
        kind: "history",
        paragraphs: [
          "Smekens lo definisce un «portale in Luigi XIV». L'inventario descrive un portale barocco a tutto sesto in pietra blu dell'«ultimo quarto del XVII o primo quarto del XVIII secolo». Il montante centrale scolpito con la Vergine Maria, Orsola e Agostino è opera di Leopold Van Esbroeck (1967), ed è quindi più recente del disegno.",
        ],
      },
      {
        heading: "Oggi",
        kind: "history",
        paragraphs: [
          "Il convento rimase vuoto per una decina d'anni. Alla fine del 2025 è iniziata la sua trasformazione in un progetto di cohousing con 41 abitazioni e spazi comuni, con un giardino del paesaggista olandese Piet Oudolf (VRT NWS, 29 ottobre 2025). I lavori dovevano durare circa due anni.",
        ],
      },
    ],
    glossary: ["makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Allora: il disegno risale al 1950 circa. Secondo l'inventario, il montante centrale scolpito con tre santi è del 1967, quindi non può comparire nel disegno.",
      "Oggi: se il portale è visibile, confrontate il suo montante centrale con il disegno. Che cosa c'era in quel punto nel 1951?",
    ],
    didYouKnow: [
      "Negli anni Settanta del Seicento la cucina del convento fu interamente rivestita di piastrelle di Delft.",
    ],
    transitionToNext: "Raggiungete la Korte Nieuwstraat. Cercate una cappella con un angelo come chiave di volta.",
  },

  // ── Gate 23 ───────────────────────────────────────────────────────────
  "poortjes-korte-nieuwstraat": {
    name: "Korte Nieuwstraat 22",
    subtitle: "Una cappella per sei donne anziane",
    introduction: [
      "Cercate lo stretto frontone in arenaria con un portale barocco in pietra blu scura. Guardate la chiave di volta: una piccola testa d'angelo alata. Poi guardate la nicchia vuota al di sopra.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Questa è la cappella del Sint-Annagodshuis (l'ospizio di Sant'Anna), fondato nel 1400 da Elisabeth, vedova di Jan Hays, e da Boudewijn de Riddere come «casa per sei donne anziane». La cappella fu costruita lo stesso anno e dedicata a sant'Anna. Nel 1540 gli elemosinieri della Armenkamer (l'ufficio cittadino di assistenza ai poveri) ne assunsero la gestione.",
          "Qui vissero ospiti fino al 1963. In seguito la cappella servì da laboratorio dello scultore Frans Joris, da deposito di libri e da magazzino.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "La cappella è una chiesa a sala gotica con un portale barocco seicentesco in pietra blu, con «imposte a giunti e una testa d'angelo alata come chiave di volta», «affiancato da due colonne ad anelli». La nicchia soprastante ospitava in origine le statue di sant'Anna e di Maria, scomparse all'inizio del XX secolo. Smekens dice lo stesso: le figure c'erano ancora «all'inizio del XX secolo». La cappella è tutelata dal 1938.",
        ],
      },
    ],
    glossary: ["godshuis", "imposten"],
    thenAndNow: [
      "Allora: nel 1951 la nicchia era già vuota. Smekens disegnò il portale con le sue figure d'angelo.",
      "Oggi: la nicchia è ancora vuota. Cercate la testa d'angelo alata sulla chiave di volta.",
    ],
    didYouKnow: [
      "Gli ospizi erano una forma antica di edilizia sociale: cittadini facoltosi o corporazioni li fondavano per gli anziani o i poveri, spesso con una propria cappella.",
    ],
    transitionToNext: "Fine della seconda parte. Raggiungete la Handelsbeurs: dai conventi e dalle case delle corporazioni al denaro e al commercio mondiale.",
  },
};
