import type { ClassicsContent } from "./types";

/**
 * Classics of Antwerp: Italian content (translated from the English master, en.ts).
 * Same structure as en.ts; only the texts differ.
 */
export const classicsContentIt: ClassicsContent = {
  walk: {
    title: "I classici di Anversa",
    tagline: "Una passeggiata nella storia di Anversa",
    shortDescription:
      "Una passeggiata guidata dalla grandiosa stazione ferroviaria fino alle rive della Schelda: diciannove tappe, otto secoli e le storie dietro i luoghi più famosi di Anversa.",
    description:
      "Dalla grandiosa stazione ferroviaria di Anversa attraverserete secoli di commerci, arte, fede e potere, fino al luogo in cui la storia della città ebbe inizio: le rive della Schelda.\n\nA ogni tappa il vostro telefono diventa la vostra guida: che cosa state guardando, perché fu costruito, che cosa accadde qui e quei dettagli davanti ai quali la maggior parte dei visitatori passa senza accorgersene. Fotografie d'epoca vi mostrano com'era la città un secolo fa e anche prima. Niente giochi né domande: solo Anversa, e il tempo per osservarla davvero.",
    highlights: [
      "19 dei luoghi storici più importanti di Anversa",
      "Scritto come se una guida camminasse al vostro fianco",
      "Fotografie d'epoca, incisioni e cartoline a ogni tappa principale",
      "Curiosità «Lo sapevate?» che non troverete sui pannelli informativi",
      "Dettagli da scoprire sul posto",
      "Navigazione a piedi da una tappa all'altra",
    ],
    howItWorksSteps: [
      "Raggiungete la tappa successiva con la mappa",
      "Leggete la storia di ciò che vedete",
      "Cercate i dettagli sul posto",
      "Proseguite con calma, al vostro ritmo",
    ],
    practicalInfo: [
      { label: "Ritmo", value: "Al vostro ritmo: fermatevi e ripartite quando volete" },
      { label: "Ideale per", value: "Chi visita Anversa per la prima volta e chiunque sia curioso della sua storia" },
      { label: "Accessibilità", value: "Strade per lo più pianeggianti; un po' di acciottolato nel centro storico" },
    ],
    guideIntro: {
      quote:
        "Dalla grandiosa stazione ferroviaria di Anversa attraverserete secoli di commerci, arte, fede e potere, fino al luogo in cui la storia della città ebbe inizio: le rive della Schelda.",
      categoryLabel: "Storia e architettura",
      footnote: "Dalla Belle Époque all'Anversa medievale.",
    },
    copy: {
      startLabel: "Inizia la passeggiata",
      nextLocationTitle: "Prossima tappa",
      completionTitle: "La fine della passeggiata",
      completionMessage: "Non avete solo attraversato Anversa. Avete ripercorso a ritroso la sua storia.",
      locationsTitle: "Il percorso",
      locationsDiscoveredLabel: "tappe visitate",
    },
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "classics-central-station": {
      name: "Antwerpen-Centraal",
      subtitle: "La cattedrale ferroviaria",
      introduction: [
        "Davanti a voi si trova una delle stazioni ferroviarie più spettacolari del mondo. Osservatela per un momento come doveva essere vista: un palazzo di pietra con cupola, torri e dettagli dorati, costruito non solo per prendere un treno ma per impressionare chiunque arrivasse ad Anversa.",
        "Gli abitanti di Anversa la chiamano spoorwegkathedraal, la cattedrale ferroviaria. È il punto di partenza ideale, perché questo è il capitolo più recente della nostra storia. Da qui cammineremo a ritroso nel tempo, fino al fiume dove la città è nata.",
      ],
      sections: [
        {
          heading: "Il fiore all'occhiello di un re",
          kind: "history",
          paragraphs: [
            "Intorno al 1900 Anversa era in pieno boom. Il suo porto era tra i più trafficati d'Europa, e re Leopoldo II voleva una stazione all'altezza di quell'ambizione. I lavori si svolsero in due fasi. Prima, tra il 1895 e il 1899, l'ingegnere Clément Van Bogaert costruì l'enorme galleria dei binari in ferro e vetro: lunga 186 metri, larga 66 e alta 43. Quell'altezza non era solo scenografica: lasciava al fumo delle locomotive a vapore lo spazio per salire.",
            "Poi, tra il 1899 e il 1905, l'architetto Louis Delacenserie costruì davanti a essa l'edificio in pietra della stazione. Lui stesso definì il suo stile un «eclettismo barocco-medievale» e si ispirò, tra l'altro, alla vecchia stazione di Lucerna e al Pantheon di Roma. Il risultato mescola un po' di tutto: cupole, pinnacoli, marmo, oro e una buona dose di teatralità.",
          ],
        },
        {
          heading: "Da stazione di testa a stazione passante",
          kind: "history",
          paragraphs: [
            "Per circa un secolo questa fu una stazione di testa: i treni entravano, si fermavano e dovevano ripartire in retromarcia. All'inizio del XXI secolo le cose cambiarono. Sotto la vecchia galleria dei binari furono scavati nuovi binari su più livelli e fu costruito un tunnel sotto la città, così che oggi i treni possono attraversare Anversa senza fermarsi al capolinea. La galleria storica è rimasta al suo posto, restaurata, come se nulla fosse successo.",
          ],
        },
      ],
      didYouKnow: [
        "Quando re Leopoldo II vide per la prima volta la stazione finita, pare che sia rimasto meno colpito di quanto tutti si aspettassero. Secondo un noto aneddoto avrebbe commentato: «C'est une petite belle gare», «è una graziosa stazioncina».",
        "La galleria dei binari in ferro è più antica dell'edificio in pietra che state guardando. Gli ingegneri terminarono il loro lavoro anni prima che l'architetto finisse il suo.",
      ],
      lookAt: [
        {
          title: "L'orologio e lo stemma",
          body: "Entrate nella galleria dei binari e voltatevi. Sopra l'ingresso dell'edificio della stazione troverete un grande orologio, la scritta ANTWERPEN e lo stemma della città: un castello sormontato da due mani. Ricordatevi di quelle mani: le ritroverete più avanti lungo il percorso, sulla Grote Markt.",
        },
      ],
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Trovate lo stemma di Anversa",
        task: [
          "Trovate lo stemma della città di Anversa.",
          "La foto è il vostro indizio: guardatevi bene intorno, dentro e fuori la stazione. Trovato? Toccate il pulsante qui sotto.",
        ],
      },
      transitionToNext:
        "Uscite dalla stazione dal lato ovest. In pochi minuti entrerete in un piccolo quartiere dove da secoli si commercia un tesoro di tutt'altro genere.",
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "classics-diamond-district": {
      name: "Il quartiere dei diamanti",
      subtitle: "Uno dei grandi mercati mondiali dei diamanti, in poche strade tranquille",
      introduction: [
        "Guardatevi intorno. Queste poche strade anonime accanto alla stazione, con le loro telecamere, i dissuasori e gli uffici senza insegne, costituiscono uno dei mercati dei diamanti più importanti del mondo. Buona parte del commercio mondiale di diamanti grezzi è passata da questi pochi isolati.",
      ],
      sections: [
        {
          heading: "Cinque secoli di diamanti",
          kind: "history",
          paragraphs: [
            "Il legame tra Anversa e i diamanti è antico. La prima testimonianza nota risale al 1447, quando la città emanò norme contro il commercio di pietre preziose false, diamanti compresi. A quell'epoca il commercio era evidentemente già abbastanza importante da meritare protezione.",
            "Il quartiere in cui vi trovate nacque più tardi, attorno alla stazione e alla ferrovia, alla fine del XIX secolo. Nel 1893 fu fondata la prima borsa dei diamanti della città, il Diamantclub van Antwerpen; nel 1904 seguì la Beurs voor Diamanthandel. Qui i commercianti si incontravano, esaminavano le pietre e concludevano affari, spesso suggellati da poco più di una stretta di mano e di una parola data.",
            "Per gran parte del XX secolo il commercio fu plasmato dalla comunità ebraica di Anversa, molte delle cui famiglie provenivano dall'Europa centrale e orientale. In seguito acquisirono un peso crescente i commercianti indiani. Passeggiando, in queste strade sentirete ancora parlare molte lingue.",
          ],
        },
        {
          heading: "La ruota per lucidare",
          kind: "legend",
          paragraphs: [
            "La tradizione attribuisce a un artigiano legato ad Anversa, Lodewijk van Bercken, l'invenzione nel XV secolo della scaif: una ruota per lucidare ricoperta di polvere di diamante e olio, che permetteva di tagliare tutte le faccette di un diamante in modo simmetrico. La storia viene ripetuta spesso, ma le prove storiche sulla sua vita e sulla sua invenzione sono scarse: consideratela quindi un'orgogliosa tradizione locale più che un fatto accertato.",
          ],
        },
      ],
      didYouKnow: [
        "Nel fine settimana del 15 e 16 febbraio 2003 alcuni ladri penetrarono nel caveau dell'Antwerp Diamond Centre, in questo quartiere. Il bottino, stimato in oltre 100 milioni di dollari tra diamanti, oro e gioielli, ne fece uno dei più grandi furti di diamanti della storia. Seguirono degli arresti, ma la maggior parte dei diamanti non fu mai ritrovata.",
      ],
      moreStories: {
        "jewish-community": {
          title: "La comunità ebraica",
          subtitle: "La seconda guerra mondiale e il dopoguerra",
          sections: [
            {
              heading: "La seconda guerra mondiale",
              kind: "history",
              paragraphs: [
                "18 agosto 1941: la Wehrmacht fa irruzione nel Diamantkring e sequestra diamanti. 164 membri del Diamantkring vengono assassinati.",
                "Estate 1942: retate, tra l'altro il 15–16 e il 28–29 agosto, in strade come la Van Immerseelstraat, la Lange Kievitstraat e la Provinciestraat. Le date variano leggermente a seconda della fonte.",
                "Durante la retata del 28–29 agosto fu la stessa polizia di Anversa a eseguire gli arresti. Fu un caso unico nella storia dell'occupazione del Belgio.",
                "Le vittime furono deportate ad Auschwitz-Birkenau passando per la caserma Dossin di Malines.",
              ],
            },
            {
              heading: "Quanti?",
              kind: "history",
              paragraphs: [
                "Tra il 56% e il 66% degli ebrei di Anversa fu deportato, a seconda del calcolo: più della metà e, secondo alcuni calcoli, due terzi. Secondo Antwerpen Herdenkt, circa 10.000 ebrei della regione non sopravvissero alla guerra.",
              ],
            },
            {
              heading: "Dopo la guerra",
              kind: "history",
              paragraphs: [
                "Nel 1945 in città vivevano ancora circa 2.000 ebrei. Alla fine degli anni Quaranta erano di nuovo circa 10.000, una comunità fortemente ortodossa.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Tornate verso la piazza della stazione e imboccate De Keyserlei, il grande viale che conduce alla città vecchia. Intorno al 1900 era questa la strada da cui ogni visitatore arrivato in treno entrava ad Anversa.",
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "classics-keyserlei-meir": {
      name: "De Keyserlei e la Meir",
      subtitle: "Il grande viale, e il giorno in cui la guerra arrivò al cinema",
      introduction: [
        "Vi trovate su De Keyserlei, l'ampio viale che collega la stazione al cuore della città. Davanti a voi prosegue come Meir, la via dello shopping più famosa di Anversa. Sulle vecchie cartoline di inizio Novecento si vede esattamente lo stesso panorama: edifici eleganti, traffico intenso e, in fondo, la guglia della cattedrale che indica la direzione.",
      ],
      sections: [
        {
          heading: "16 dicembre 1944",
          kind: "history",
          paragraphs: [
            "Questa strada custodisce uno dei ricordi più cupi di Anversa. Dopo la liberazione della città nel settembre 1944, il suo porto divenne vitale per il rifornimento degli eserciti alleati, e la Germania rispose con le sue nuove armi V: bombe volanti e razzi V-2 che cadevano senza preavviso.",
            "Nel pomeriggio del 16 dicembre 1944 circa 1.100 persone stavano guardando un film al Cinema Rex, al numero 15 di questo viale. Alle 15.20 un razzo V-2 colpì il tetto. Morirono 567 persone: 271 civili e 296 soldati alleati. Fu il bilancio più alto causato da un singolo attacco missilistico in tutta la guerra, e ci volle quasi una settimana per estrarre tutti dalle macerie.",
          ],
        },
      ],
      didYouKnow: [
        "Il Cinema Rex fu ricostruito dopo la guerra e riaprì nel 1947. Chiuse definitivamente nel 1993 e fu demolito due anni dopo. Oggi nella strada ben poco ricorda ai passanti ciò che accadde qui.",
      ],
      transitionToNext:
        "Seguite la Meir verso la città vecchia. Poco più avanti, sulla sinistra, una cupola dorata brilla sopra un ingresso imponente: una sala delle feste che bruciò e poi rinacque.",
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "classics-stadsfeestzaal": {
      name: "Stadsfeestzaal",
      subtitle: "La sala delle feste della città, risorta dalle ceneri",
      introduction: [
        "Davanti a voi c'è l'ingresso della Stadsfeestzaal, la sala delle feste cittadina. Entrate e alzate lo sguardo: un salone immenso coronato da una cupola di vetro rivestita di foglia d'oro. Oggi è un centro commerciale, ma fu costruito per tutt'altro scopo.",
      ],
      sections: [
        {
          heading: "Una sala per la città",
          kind: "history",
          paragraphs: [
            "La Stadsfeestzaal fu inaugurata l'8 febbraio 1908. Fu progettata dall'architetto comunale Alexis Van Mechelen, su incarico della città stessa, in un grandioso stile neoclassico. Anversa era ricca e sicura di sé, e voleva un luogo per balli, esposizioni, fiere e ricevimenti: un salotto per tutta la città nel mezzo della sua via principale.",
          ],
        },
        {
          heading: "L'incendio del 2000",
          kind: "history",
          paragraphs: [
            "Il 27 dicembre 2000 un cortocircuito provocò un incendio che devastò l'edificio. Quando le fiamme si spensero, restavano in piedi soltanto lo scalone monumentale, la facciata storica e la struttura in acciaio del tetto.",
            "Molti temettero che la sala fosse perduta per sempre. Nel 2004 la città firmò un contratto di locazione a lungo termine con un promotore immobiliare, e lo stesso anno iniziarono i lavori di restauro. Sotto la supervisione delle autorità per il patrimonio furono fedelmente ricostruiti la cupola di vetro con la sua foglia d'oro, lo scalone, le decorazioni, le sculture, i mosaici, i rilievi parietali e perfino il parquet di rovere. Nel 2007 la Stadsfeestzaal riaprì le sue porte.",
          ],
        },
      ],
      didYouKnow: [
        "Gran parte degli interni «storici» che vedete sono in realtà un'accurata ricostruzione del XXI secolo, realizzata dopo l'incendio del 2000 sulla base di fotografie, progetti e frammenti superstiti.",
      ],
      transitionToNext:
        "Proseguite lungo la Meir verso la città vecchia. Pochi minuti più avanti, Spooky vi aspetta con una missione…",
    },

    // ── 4b: Spooky's quest ───────────────────────────────────────────────
    // `name` and `subtitle` show BEFORE the façade is found: they must not give it away.
    "classics-paleis-op-de-meir": {
      name: "Un mistero sulla Meir",
      subtitle: "La facciata del disegno di Spooky",
      introduction: [
        "Trovato! La lunga ed elegante facciata settecentesca davanti a voi è il Paleis op de Meir.",
      ],
      sections: [
        {
          heading: "Un palazzo sulla Meir",
          kind: "history",
          paragraphs: [
            "Fu costruito a partire dal 1745 per un ricco mercante, Johan Alexander van Susteren, dall'architetto anversano Jan Pieter van Baurscheit il Giovane. In seguito passò per mani notevoli: Napoleone lo acquistò nel 1811–1812 ma non vi abitò mai, lo zar di Russia Alessandro I vi soggiornò nel 1814 e per lungo tempo fu utilizzato come palazzo reale.",
          ],
        },
      ],
      didYouKnow: [
        "Napoleone possedeva il palazzo sulla Meir, ma quando fu pronto per lui si trovava già in esilio sull'isola d'Elba.",
      ],
      quest: {
        title: "La missione di Spooky",
        task: [
          "Osservate bene questo vecchio disegno architettonico. Da qualche parte sulla Meir si trova l'edificio a cui appartiene.",
          "Raggiungete la zona di ricerca sulla mappa, alzate lo sguardo verso le facciate e confrontatele con il disegno. Riuscite a scoprire di quale edificio si tratta? Quando ci sarete davanti, Hidden Antwerp se ne accorgerà.",
        ],
        zoneHint: "L'edificio si trova da qualche parte in questa zona.",
        revealedName: "Paleis op de Meir",
      },
      transitionToNext:
        "A pochi passi si apre accanto alla Meir una piccola piazza: il Wapper, dove il pittore più famoso di Anversa costruì la sua casa.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-rubenshuis": {
      name: "La Casa di Rubens",
      subtitle: "Dove il più grande pittore di Anversa visse e lavorò",
      introduction: [
        "Vi trovate sul Wapper, una piccola piazza appena fuori dalla Meir. Dietro la facciata davanti a voi Peter Paul Rubens, il pittore più famoso che Anversa abbia mai dato al mondo, visse e lavorò fino alla sua morte nel 1640.",
        "Il ritratto in cima a questa pagina è Rubens come si dipinse nel 1623, all'apice della fama: un ampio cappello nero, un mantello scuro, uno sguardo calmo e sicuro di sé. Oggi quell'autoritratto appartiene alla Royal Collection britannica.",
      ],
      sections: [
        {
          heading: "Un palazzo italiano sul Wapper",
          kind: "history",
          paragraphs: [
            "Nel 1608 Rubens tornò ad Anversa dopo otto anni in Italia. Nel 1610 acquistò qui una casa fiamminga già esistente e dedicò il decennio successivo a trasformarla in abitazione e bottega all'italiana: un atelier in stile barocco, una sala d'arte con una galleria semicircolare per le sculture, un portico monumentale e un padiglione da giardino. Lui e sua moglie Isabella Brant vi si trasferirono nel 1617.",
            "Dopo la sua morte la casa fu affittata, ricostruita e suddivisa. La città la acquistò nel 1937 e tra il 1937 e il 1946 l'architetto comunale Emiel Van Averbeke la ricostruì, in gran parte sulla base di incisioni di Harrewijn del 1684 e del 1692. Il portico, il padiglione da giardino e la struttura dell'atelier sono in gran parte originali; gli ambienti abitativi e i loro interni sono una ricostruzione.",
          ],
        },
        {
          heading: "Rubens e Isabella",
          kind: "history",
          paragraphs: [
            "Il 3 ottobre 1609, un anno dopo il suo ritorno dall'Italia, il trentaduenne Rubens sposò la diciottenne Isabella Brant. In quel periodo dipinse i due insieme: il doppio ritratto in questa pagina, oggi all'Alte Pinakothek di Monaco di Baviera. Isabella visse con lui in questa casa fino alla sua morte nel 1626.",
          ],
        },
        {
          heading: "Leggere il dipinto",
          kind: "interpretation",
          paragraphs: [
            "La coppia siede vicina sotto un pergolato di caprifoglio. Le loro mani destre poggiano l'una sull'altra: fin dall'epoca romana le mani destre unite erano un segno di matrimonio. Il caprifoglio simboleggiava l'amore duraturo; uno dei suoi nomi tedeschi, Jelängerjelieber, significa «più dura, più è caro».",
            "Osservate anche gli abiti e la posa. Rubens indossa il raffinato costume di un gentiluomo, con la mano vicina all'elsa di una spada; Isabella porta un alto cappello, un ampio colletto di pizzo e un corpetto riccamente ricamato. Il grande formato e gli abiti costosi presentano la giovane coppia come persone di rango. Un pittore che si ritrae con la sposa all'aperto, rilassato, come una coppia innamorata: per l'epoca il doppio ritratto apriva una strada nuova.",
          ],
        },
        {
          heading: "Perché fa parte di questa passeggiata",
          kind: "interpretation",
          paragraphs: [
            "Il dipinto segna l'inizio della vita che Rubens costruì in questo luogo: un matrimonio, una bottega in crescita e una casa che mostrava al mondo chi era. Un anno dopo le nozze acquistò questa casa. Nel resto della passeggiata lo incontrerete di nuovo: sulla Groenplaats, dove la città gli eresse una statua, alla cattedrale, che custodisce pale d'altare da lui dipinte, e alla chiesa di San Carlo Borromeo, i cui soffitti furono un tempo decorati dalla sua bottega.",
          ],
        },
      ],
      didYouKnow: [
        "Dal 1648 al 1660, dopo la morte di Rubens, la casa fu affittata da William e Margaret Cavendish, realisti inglesi in esilio.",
      ],
      infoBoxes: [
        {
          kind: "visit",
          title: "Visitare la Casa di Rubens",
          paragraphs: [
            "La casa vera e propria è chiusa per restauro almeno fino al 2030. Il giardino, la biblioteca e la Rubens Experience nel nuovo edificio per i visitatori sono aperti; l'ingresso per i visitatori si trova sul retro, in Hopland 13.",
            "Prima di andare, controllate gli orari di apertura e i prezzi dei biglietti sul sito della Casa di Rubens.",
          ],
          checkedOn: "2026-09-30",
          sourceUrl: "https://rubenshuis.be/nl/vraag-antwoord",
        },
      ],
      transitionToNext:
        "Lasciate per un attimo la Meir e addentratevi nelle stradine alle sue spalle. Nascosto dietro facciate comuni si trova l'edificio in cui Anversa insegnò un tempo al mondo come si fa commercio.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "La Handelsbeurs",
      subtitle: "Dove il mondo veniva a fare affari",
      introduction: [
        "Davanti a voi c'è la Handelsbeurs, l'antica borsa del commercio di Anversa. Dalla strada quasi non si nota. All'interno si trova uno degli ambienti più straordinari della città: un cortile gotico circondato da gallerie, coperto da un altissimo tetto di ferro e vetro.",
        "Ora immaginate quel tetto scomparso. Per più di tre secoli il cuore di questo edificio fu un cortile aperto sotto il cielo, dove ogni giorno si incontravano i mercanti di mezza Europa.",
      ],
      sections: [
        {
          heading: "Una piazza a cielo aperto",
          kind: "history",
          paragraphs: [
            "Nel 1531 Anversa aprì una nuova borsa, progettata da Domien de Waghemakere in stile gotico brabantino tardo. Il suo cuore era un cortile rettangolare, aperto verso il cielo e circondato su tutti e quattro i lati da gallerie coperte con volte stellari su colonne.",
            "Ogni giorno mercanti dal Portogallo, dall'Italia, dalla Germania, dall'Inghilterra e dalla Spagna si radunavano in quella piazza aperta, in una babele di lingue, per fissare i prezzi, concedere credito e negoziare lettere di cambio. Quando pioveva si riparavano sotto le gallerie; sopra le gallerie si trovavano botteghe e stanze. L'incisione in cima a questa pagina mostra il cortile pieno di piccoli gruppi di commercianti.",
            "Fu uno dei primi edifici al mondo costruiti appositamente per il commercio, e l'idea fece strada. Quando Thomas Gresham, agente della corona inglese ad Anversa, fondò il Royal Exchange di Londra negli anni Sessanta del Cinquecento, prese a modello questo cortile con le sue gallerie; Amsterdam seguì nel 1611.",
          ],
        },
        {
          heading: "Un tetto sopra il cortile",
          kind: "history",
          paragraphs: [
            "Solo nel 1852–1854 il cortile fu coperto per la prima volta, dall'ingegnere Charles Marcellis, con ferro e una cupola di vetro. Quattro anni dopo, il 2 agosto 1858, un incendio distrusse sia la vecchia borsa sia il suo nuovo tetto.",
            "L'architetto Joseph Schadde la ricostruì; la nuova borsa fu inaugurata il 19 ottobre 1872. Schadde mantenne il cortile con le sue gallerie, che seguono ancora la pianta del 1531, ma lo coprì con lo spettacolare tetto di ferro e vetro che vedete oggi.",
          ],
        },
      ],
      didYouKnow: [
        "Per più di tre secoli, dal 1531 fino al primo tetto del 1852–1854, i mercanti di Anversa conclusero i loro affari sotto il sole, il vento e la pioggia, in un cortile aperto verso il cielo.",
      ],
      galleries: {
        "exchange-in-prints": {
          title: "La Borsa in antiche stampe",
          intro: "Due stampe ottocentesche delle gallerie, di prima e dopo l'incendio del 1858.",
        },
      },
      transitionToNext:
        "Tornati sulla Meir, alzate lo sguardo. Una torre svetta sopra i tetti come un pezzo di New York caduto in una città medievale. Facciamo un breve salto in avanti nel tempo, prima che il nostro viaggio nel passato cominci davvero.",
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "classics-boerentoren": {
      name: "La Boerentoren",
      subtitle: "Il primo grattacielo d'Europa",
      introduction: [
        "Davanti a voi si innalza la Boerentoren, la «Torre dei contadini». Con la sua sagoma sobria e a gradoni sembra appartenere alla New York degli anni Trenta più che a una città di chiese gotiche, ed era proprio questo l'intento dei suoi costruttori.",
      ],
      sections: [
        {
          heading: "Un sogno americano sulla Schoenmarkt",
          kind: "history",
          paragraphs: [
            "L'isolato su cui sorge era stato devastato durante la Prima guerra mondiale. Quando la città indisse un concorso per la sua ricostruzione, il bando era esplicito: costruire un grattacielo americano. Gli architetti Jan Vanhoenacker, Emiel Van Averbeke e Jos Smolderen progettarono una torre in stile Art Déco, e i lavori durarono dal 1929 al 1932, con un occhio all'Esposizione universale che Anversa ospitò nel 1930.",
            "Il suo scheletro è un telaio d'acciaio di circa 3.500 tonnellate, realizzato dall'azienda tedesca Demag. Con 25 piani e un'altezza di 87,5 metri fu il primo grattacielo d'Europa e, all'epoca, il più alto. Una ristrutturazione della sommità nel 1975 lo portò a 95,75 metri e 26 piani.",
          ],
        },
      ],
      didYouKnow: [
        "Il soprannome deriva dai suoi proprietari: l'edificio divenne la sede della cassa di risparmio del Boerenbond, la Lega dei contadini belgi. Una torre piena dei risparmi dei contadini, in mezzo alla città.",
      ],
      transitionToNext:
        "Da qui la torre vi indica la strada verso il cuore antico di Anversa. Raggiungete la grande piazza davanti a voi, dove la cattedrale appare per la prima volta in tutta la sua altezza e dove il suolo sotto i vostri piedi nasconde un segreto.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-groenplaats": {
      name: "Groenplaats",
      subtitle: "Una piazza che un tempo era un cimitero",
      introduction: [
        "Vi trovate sulla Groenplaats, una delle piazze più vivaci di Anversa, con la cattedrale che si alza sopra i tetti e Peter Paul Rubens su un piedistallo al centro. Sembra un luogo nato per dehors e mercati. Per secoli, però, è stato qualcosa di molto diverso.",
      ],
      sections: [
        {
          heading: "Il cimitero della cattedrale",
          kind: "history",
          paragraphs: [
            "Questa piazza, insieme alla Lijnwaadmarkt, alla Melkmarkt, alla Schoenmarkt e alla Handschoenmarkt intorno alla cattedrale, formava un tempo il cimitero della cattedrale. Gli anversani lo chiamavano Groot Kerkhof, il Grande Cimitero, e più tardi Groen Kerkhof, il Cimitero Verde. Qualcuno usa quel nome ancora oggi.",
            "Nel 1754 il cimitero fu cinto da un muro, ma non per molto. Nel 1784 l'imperatore Giuseppe II vietò le sepolture all'interno delle città per ragioni di salute pubblica, e nel 1799 il muro fu abbattuto. Il camposanto divenne a poco a poco la piazza che vedete oggi.",
            "Un dipinto del 1597, riprodotto qui sotto, dà un'idea del cimitero ai suoi tempi: un corteo funebre di persone in lutto vestite di nero vi passa accanto, con la cattedrale che si innalza sullo sfondo.",
          ],
        },
        {
          heading: "Rubens prende posto",
          kind: "history",
          paragraphs: [
            "Nel 1840 Anversa celebrò i 200 anni dalla morte di Rubens. Willem Geefs progettò una statua, ma i fondi scarseggiavano e il bronzo non fu pronto in tempo: così il 25 agosto 1840 fu inaugurata su un'altra piazza una versione provvisoria in gesso. Solo il 9 e 10 agosto 1843 il Rubens di bronzo prese il suo posto qui, al centro della Groenplaats.",
            "Geefs lo rappresentò come pittore e diplomatico: ai suoi piedi giacciono una tavolozza e una spada, perché Rubens servì anche il re di Spagna come inviato. Come si addice a un antico cimitero, la statua sorge nel punto in cui si trovava una vecchia croce cimiteriale, sopra la tomba di un vescovo, Antonius d'Espinosa.",
          ],
        },
      ],
      didYouKnow: [
        "Quando vi sedete in un dehors qui, siete seduti su quello che per secoli è stato il luogo di sepoltura della cattedrale.",
      ],
      transitionToNext:
        "Dirigetevi verso la cattedrale. Strada facendo, osservate la fila di case addossate al coro della chiesa: nascondono le fondamenta di una cattedrale che non fu mai terminata.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Cattedrale di Nostra Signora",
      subtitle: "La cattedrale che Anversa voleva ancora più grande",
      introduction: [
        "Davanti a voi si erge la Onze-Lieve-Vrouwekathedraal, la Cattedrale di Nostra Signora, una delle più grandi chiese gotiche dei Paesi Bassi storici e per secoli il punto di riferimento che i marinai sulla Schelda vedevano per primo. La sua torre nord, alta circa 123 metri, domina ancora lo skyline.",
        "Siamo ora nel tardo Medioevo. La cattedrale fu costruita in circa 170 anni, dalla metà del XIV secolo fino al 1521, da generazioni di costruttori che sapevano che non l'avrebbero mai vista finita.",
      ],
      sections: [],
      didYouKnow: [],
      cards: {
        cathedral: {
          title: "La cattedrale",
          subtitle: "Due secoli di cantiere, e un progetto troppo grande",
          sections: [
            {
              heading: "Costruita in 170 anni",
              kind: "history",
              paragraphs: [
                "La costruzione iniziò nel 1352 e durò fino al 1521, con una lunga pausa tra il 1356 e il 1378. Generazioni di capomastri si succedettero sullo stesso progetto, tra cui Peter Appelmans e Herman e Domien de Waghemakere. Il denaro proveniva da donazioni, dalle corporazioni e dalla città; quando finiva, i lavori semplicemente si fermavano ad aspettare.",
                "La torre nord, alta circa 123 metri, fu terminata intorno al 1518–1521 ed è ancora oggi il campanile più alto del Benelux. La torre sud fu interrotta nel 1475 per mancanza di fondi, a circa 65 metri, e non fu mai completata.",
              ],
            },
            {
              heading: "Ancora più grande: il Nieuwerck",
              kind: "history",
              paragraphs: [
                "Nel 1521, proprio quando la chiesa fu completata, Anversa decise che non era abbastanza grande. La città più ricca del Nord Europa voleva una chiesa alla sua altezza, e Domien de Waghemakere e Rombout Keldermans progettarono un gigantesco ampliamento del coro, il Nieuwerck.",
                "Il 15 luglio 1521 il giovane imperatore Carlo V posò personalmente la prima pietra. Ma già intorno al 1528 l'entusiasmo andava scemando, e nella notte tra il 5 e il 6 ottobre 1533 un grande incendio danneggiò gravemente il tetto e i pilastri della chiesa; la sua causa è sconosciuta. Tutto il denaro fu destinato alla riparazione dell'edificio esistente, e nel 1537 il Nieuwerck fu abbandonato definitivamente.",
              ],
            },
            {
              heading: "Le tempeste della storia",
              kind: "history",
              paragraphs: [
                "La cattedrale è sopravvissuta a molto. Durante la furia iconoclasta del 1566, un'ondata di collera protestante contro le immagini, gran parte dei suoi interni fu distrutta. Due secoli dopo, le truppe rivoluzionarie francesi occuparono la città, chiusero la chiesa e ne portarono via i tesori.",
                "Molto di ciò che si può vedere oggi all'interno fu riportato indietro o restaurato in seguito, comprese pale d'altare di Rubens che sono tra le sue opere più celebri.",
              ],
            },
          ],
          didYouKnow: [
            "Il Nieuwerck non fu mai costruito, ma non è scomparso del tutto. Le sue fondamenta e i suoi pilastri sopravvivono nella fila di case intorno al coro, tra la Lijnwaadmarkt e la Groenplaats. Alcune di quelle case poggiano letteralmente sull'inizio di una cattedrale mai terminata.",
            "La prima pietra di Carlo V recava un'iscrizione latina secondo cui l'imperatore la posò alle Idi di luglio del 1521.",
          ],
        },
        "quinten-matsijs": {
          title: "Quinten Matsijs",
          subtitle: "Da fabbro a pittore?",
          sections: [
            {
              heading: "Un pittore per la cattedrale",
              kind: "history",
              paragraphs: [
                "Quinten Matsijs (1466 circa–1530) nacque a Lovanio, figlio di un fabbro, e divenne uno dei principali pittori di Anversa nel suo secolo d'oro. Nel 1491 divenne maestro nella Gilda di San Luca, la corporazione dei pittori.",
                "Il suo legame con questa chiesa è reale. Tra il 1508 e il 1511 dipinse una grande pala per l'altare della corporazione dei falegnami nella cattedrale: un Compianto sul Cristo morto tra scene di san Giovanni Battista e san Giovanni Evangelista. Oggi è esposta al KMSKA, il Museo reale di belle arti di Anversa.",
              ],
            },
            {
              heading: "Il fabbro che dipinse per amore",
              kind: "legend",
              paragraphs: [
                "Anversa racconta di lui una storia romantica. Quinten, si dice, era un fabbro che si innamorò di una ragazza che preferiva un pittore a un fabbro. Così posò il martello e prese in mano il pennello. Karel van Mander, che la mise per iscritto nel 1604, riporta anche un'altra versione: una lunga malattia gli rese impossibile il pesante lavoro di fabbro, e cominciò a colorare stampe per mantenere la madre.",
                "Un altro racconto dice che dipinse una mosca così realistica su un quadro del padre della sua amata che l'uomo cercò di scacciarla con la mano, e poi acconsentì al matrimonio.",
              ],
            },
            {
              heading: "Che cosa dicono gli storici",
              kind: "interpretation",
              paragraphs: [
                "Non c'è alcuna prova che Quinten stesso abbia mai lavorato come fabbro; suo padre sì. Gli storici considerano la storia una leggenda cresciuta nel tempo. È però antica: il verso latino sotto il suo ritratto, stampato ad Anversa nel 1572 e riprodotto in cima a questa scheda, gli fa già dire che l'amore trasformò il fabbro in pittore.",
              ],
            },
          ],
          didYouKnow: [
            "Proprio accanto alla cattedrale, sulla Handschoenmarkt, si trova un pozzo con una gabbia gotica in ferro battuto coronata da un piccolo Brabo. La tradizione attribuisce la lavorazione del ferro a Matsijs, ma non è provato. A pochi metri di distanza, sulla facciata ovest della cattedrale, una lapide commemorativa con il suo ritratto reca il verso latino «Connubialis amor de Mulcibre fecit Apellem»: l'amore coniugale trasformò il fabbro in pittore.",
          ],
        },
        "nello-patrasche": {
          title: "Nello e Patrasche",
          subtitle: "Un romanzo inglese, un classico giapponese e una statua di marmo",
          sections: [
            {
              heading: "La storia",
              kind: "fiction",
              paragraphs: [
                "Nello è un povero ragazzo orfano che vive in un villaggio «a una lega da Anversa». Con il suo cane Patrasche, che tira il carretto, porta ogni giorno il latte in città. Nello sogna di diventare pittore e desidera ardentemente vedere i due dipinti di Rubens nella cattedrale, ma sono coperti, e solo chi paga può vederli.",
                "Partecipa a un concorso di disegno, non vince e perde tutto. La vigilia di Natale trova la chiesa aperta e finalmente vede «L'innalzamento della Croce» e «La deposizione dalla Croce». La mattina dopo Nello e Patrasche vengono trovati insieme davanti ai dipinti, morti di freddo.",
              ],
            },
            {
              heading: "Un libro dall'Inghilterra, un classico in Giappone",
              kind: "history",
              paragraphs: [
                "«Il cane delle Fiandre» (A Dog of Flanders) fu scritto dall'autrice inglese Ouida (Marie Louise de la Ramée). Apparve su una rivista alla fine del 1871 e in volume nel 1872. I due dipinti sono reali: sono ancora appesi in questa cattedrale. Nel romanzo rappresentano l'arte a cui Nello anela, che resta nascosta a chi non può pagare.",
                "Per molto tempo la storia fu poco conosciuta nelle Fiandre stesse. All'estero divenne un classico: fu portata sullo schermo più volte negli Stati Uniti, a partire dal 1935, e in Giappone la serie anime del 1975 ne fece un classico per bambini. Un documentario del 2007 si intitolava, non a caso, Patrasche, a Dog of Flanders – Made in Japan.",
              ],
            },
            {
              heading: "La statua",
              kind: "history",
              paragraphs: [
                "Nel 2016 una statua di Batist Vermeulen fu collocata sulla Handschoenmarkt, davanti alla cattedrale. Sostituì una lapide commemorativa del 2003. Nello e Patrasche dormono abbracciati, sotto una coperta fatta degli stessi ciottoli della piazza. Da novembre 2022 di notte è illuminata.",
              ],
            },
          ],
          didYouKnow: [
            "Ouida non nomina mai il villaggio di Nello. Il collegamento con Hoboken, oggi un distretto di Anversa, fu fatto in seguito.",
          ],
        },
      },
      lookAt: [
        {
          title: "Una torre e mezza",
          body: "Osservate la facciata della cattedrale. La torre di sinistra (nord) sale fino alla sua elegante guglia; quella di destra (sud) si ferma a circa metà di quell'altezza. Il progetto prevedeva due grandi torri, ma ne fu completata solo una. Guardate l'acquaforte del 1649 in questa pagina: la sagoma asimmetrica era già la stessa allora.",
        },
      ],
      transitionToNext:
        "Girate intorno alla cattedrale fino alla Oude Koornmarkt. Cercate con attenzione uno stretto ingresso tra le case: conduce a un vicolo nascosto che il tempo sembra aver dimenticato.",
    },

    // ── 10 ───────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Un passaggio segreto nell'Anversa di un tempo",
      introduction: [
        "Varcate lo stretto ingresso e il rumore della città svanisce. Siete nel Vlaeykensgang, un vicolo tortuoso tra vecchi muri di mattoni, cortiletti e piccole case. Per un momento è facile immaginare l'Anversa di secoli fa.",
        "Il Vlaeykensgang viene spesso definito uno dei vicoli più antichi e più stretti di Anversa. L'inventario del patrimonio non stila una simile classifica, ma conferma ciò che rende speciale questo luogo: un passaggio acciottolato a forma di L, fiancheggiato da undici piccole retrocase, che ha conservato quasi del tutto il suo aspetto antico.",
      ],
      sections: [
        {
          heading: "Retrocase diventate una strada",
          kind: "history",
          paragraphs: [
            "Il passaggio fu tracciato nel 1591, anche se non portava ancora questo nome: il nome è più recente del vicolo stesso. I piccoli edifici nacquero nel XVI secolo come retrocase e magazzini dietro le abitazioni delle strade circostanti. Col tempo il complesso si trasformò in un passaggio interno e, dal XVII secolo, gli edifici furono utilizzati come abitazioni piccole e modeste.",
          ],
        },
        {
          heading: "Salvato all'ultimo momento",
          kind: "history",
          paragraphs: [
            "Negli anni Sessanta il vicolo era in pessime condizioni, e si progettava di demolirlo per far posto a un parcheggio. Nel 1969 l'antiquario e interior designer Axel Vervoordt acquistò il complesso. Facciate e tetti furono tutelati come monumento nel 1973, e il restauro cominciò nel 1977.",
          ],
        },
      ],
      didYouKnow: [
        "Uno degli angoli più suggestivi della vecchia Anversa esiste ancora oggi perché un tempo era considerato così privo di valore da poter diventare un parcheggio.",
      ],
      transitionToNext:
        "Seguite il vicolo e le strade laterali fino alla grande piazza del mercato. Preparatevi ad alzare gli occhi: le facciate tutt'intorno sono piene d'oro.",
    },

    // ── 11 ───────────────────────────────────────────────────────────────
    "classics-grote-markt": {
      name: "Grote Markt e le case delle corporazioni",
      subtitle: "La piazza dorata più giovane di quanto sembri",
      introduction: [
        "Siete sulla Grote Markt, la piazza principale di Anversa. Su un lato si trova il municipio; tutt'intorno al resto della piazza, alte case delle corporazioni con frontoni a gradoni e a volute, coronati da figure dorate che catturano il sole.",
        "Le corporazioni erano le associazioni di artigiani e commercianti che organizzavano buona parte della vita cittadina: chi poteva lavorare, che cosa si poteva vendere e con quale qualità. Le loro case qui erano la loro vetrina.",
      ],
      sections: [
        {
          heading: "La Furia spagnola",
          kind: "history",
          paragraphs: [
            "Nel novembre 1576 soldati spagnoli ammutinati saccheggiarono Anversa; ne saprete di più davanti al municipio. L'incendio che appiccarono si propagò su questa piazza e distrusse le case che vi sorgevano. Ciò che fu costruito dopo era una nuova generazione di edifici.",
            "L'esempio più bello è la casa dell'Oude Voetboog, la corporazione di San Giorgio. Fu costruita nel 1515–1516, distrutta nel 1576 e ricostruita in stile rinascimentale nel 1580–1582. La sua facciata è considerata uno dei vertici dell'architettura rinascimentale anversana.",
          ],
        },
        {
          heading: "Un sogno ottocentesco del secolo d'oro",
          kind: "history",
          paragraphs: [
            "Molto di ciò che vedete è più recente di quanto sembri. Nel 1895 un cittadino di nome R. Joostens lasciò nel suo testamento del denaro per restituire alla Grote Markt il suo antico splendore. Dalla fine del XIX secolo fino ai primi del XX, le facciate sul lato nord della piazza e il numero 44 sul lato sud furono liberamente ricostruite e abbellite nello spirito del Cinquecento.",
          ],
        },
      ],
      didYouKnow: [
        "Diverse delle «antiche» case delle corporazioni su questa piazza sono in realtà ricostruzioni di inizio Novecento. Anversa non si limitava a conservare il suo secolo d'oro: lo reinventava anche, con affetto.",
      ],
      lookAt: [
        {
          title: "Le figure dorate",
          body: "Alzate lo sguardo verso la sommità dei frontoni. Trovate il San Giorgio dorato a cavallo che combatte il drago sulla casa dell'Oude Voetboog, la corporazione di San Giorgio. Poi cercate le altre figure ed emblemi: molti rimandano alla corporazione proprietaria della casa. Confrontate la piazza con la fotografia del 1905 in questa pagina.",
        },
      ],
      transitionToNext:
        "Al centro della piazza una figura di bronzo sta per lanciare qualcosa in aria. Avvicinatevi alla fontana: racconta la storia più famosa di Anversa.",
    },

    // ── 12 ───────────────────────────────────────────────────────────────
    "classics-brabo": {
      name: "La fontana di Brabo",
      subtitle: "Un gigante, una mano e il nome di una città",
      introduction: [
        "Davanti a voi c'è la fontana di Brabo. In cima a un cumulo di rocce, circondato da creature marine e figure, un giovane si piega all'indietro e lancia qualcosa lontano. Guardate bene che cosa tiene in mano: è una mano.",
      ],
      sections: [
        {
          heading: "La leggenda di Druon Antigoon",
          kind: "legend",
          paragraphs: [
            "Tanto tempo fa, così si racconta, sulle rive della Schelda viveva un gigante chiamato Druon Antigoon. Sorvegliava il fiume ed esigeva un pedaggio da ogni nave che voleva passare. A chi si rifiutava o non poteva pagare veniva tagliata una mano, che il gigante gettava nel fiume.",
            "Poi arrivò un giovane soldato romano di nome Silvius Brabo. Sfidò il gigante, lo sconfisse, gli tagliò a sua volta la mano e la gettò nella Schelda. E così, dice la leggenda, la città ebbe il suo nome: hand werpen, «gettare una mano», Antwerpen.",
          ],
        },
        {
          heading: "Che cosa ne pensano gli storici",
          kind: "interpretation",
          paragraphs: [
            "È una storia meravigliosa, ma non una spiegazione che gli storici prendano sul serio. L'origine del nome Antwerpen è incerta. La maggior parte delle ipotesi lo collega non alle mani ma alla terra: a un terreno rialzato lungo il fiume, un lembo di terra «antistante», formato o sollevato dall'acqua. La leggenda del gigante è un tentativo molto più tardo di spiegare un nome la cui vera origine era stata dimenticata.",
          ],
        },
        {
          heading: "La fontana",
          kind: "history",
          paragraphs: [
            "La fontana è opera dello scultore anversano Jef Lambeaux, che nel 1883 aveva già in gran parte sviluppato il suo progetto. Fu collocata sulla Grote Markt nel 1887, davanti al municipio, in un periodo in cui Anversa desiderava celebrare la propria storia e la propria identità.",
          ],
        },
      ],
      didYouKnow: [
        "Le mani della leggenda sono ovunque ad Anversa: nello stemma cittadino, che mostra un castello sormontato da due mani, e nelle «mani di Anversa» di cioccolato e di biscotto vendute nei negozi intorno a voi.",
      ],
      transitionToNext:
        "Voltatevi verso il lungo edificio chiaro alle spalle di Brabo. È sopravvissuto a una delle notti più terribili della storia della città.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
    "classics-stadhuis": {
      name: "Il municipio (Stadhuis)",
      subtitle: "Costruito con orgoglio, bruciato nella furia",
      introduction: [
        "Davanti a voi si trova lo Stadhuis, il municipio di Anversa. La sua lunga facciata è calma e orizzontale, con un'alta parte centrale riccamente decorata che si eleva al di sopra. All'epoca della sua costruzione era uno degli edifici più moderni d'Europa: un palazzo rinascimentale per una città all'apice della sua potenza.",
      ],
      sections: [
        {
          heading: "Un palazzo per la città",
          kind: "history",
          paragraphs: [
            "Il municipio fu costruito tra il 1561 e il 1565 su progetto di Cornelis Floris de Vriendt, insieme ad altri architetti e artisti. Anversa era allora una delle città più ricche d'Europa e voleva che il suo governo avesse sede in un edificio che lo dimostrasse.",
          ],
        },
      ],
      didYouKnow: [
        "L'edificio che vedete fu restaurato dopo l'incendio del 1576. Guardate la fotografia in questa pagina, scattata a metà degli anni Sessanta dell'Ottocento: vista dalla piazza, il municipio appariva allora molto simile a oggi.",
      ],
      lookAt: [
        {
          title: "La parte centrale",
          body: "Confrontate le sobrie ali della facciata con la parte centrale, fitta di colonne, nicchie e statue, che si innalza oltre la linea del tetto. Quel contrasto, calma e ordine con un'esplosione di decorazioni al centro, è tipico del Rinascimento che Floris portò ad Anversa.",
        },
      ],
      // The Spanish Fury, as slides: the approved section, paragraph by paragraph, each with its images.
      cards: {
        "fury-attack": {
          title: "La Furia spagnola, 4 novembre 1576",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Appena dieci anni dopo, questo edificio fu testimone di una catastrofe. I Paesi Bassi erano in rivolta contro il re di Spagna, e i suoi soldati nella regione non ricevevano la paga da molto tempo. Il 4 novembre 1576 truppe spagnole ammutinate uscirono dalla cittadella a sud della città, si unirono agli ammutinati provenienti da Aalst, presero d'assalto Anversa e cominciarono a saccheggiarla.",
              ],
            },
          ],
        },
        "fury-city-hall": {
          title: "Il municipio in fiamme",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Il governo cittadino organizzò un contrattacco proprio da questo municipio, qui sulla Grote Markt. I cittadini di Anversa si difesero sulla piazza e all'interno dell'edificio, e dalle finestre del municipio facevano fuoco sui cavalieri spagnoli che caricavano attraverso la piazza. I cavalieri subirono pesanti perdite, finché alcuni di loro riuscirono a farsi strada all'interno e appiccarono il fuoco all'edificio con fasci di paglia che avevano portato con sé.",
              ],
            },
          ],
        },
        "fury-city": {
          title: "La città nel caos",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Le fiamme si estesero alle case circostanti: ne bruciarono circa seicento, per lo più dietro e accanto al municipio. Del municipio stesso rimasero in piedi soltanto i muri perimetrali.",
              ],
            },
            {
              kind: "history",
              paragraphs: [
                "Quante persone morirono non si sa con precisione. Le stime vanno da alcune centinaia a circa 8.000; molti storici ritengono che persero la vita più di 7.000 persone. L'evento passò alla storia come la Furia spagnola e scosse la fiducia di quella che era stata la grande città commerciale d'Europa.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Lasciate la Grote Markt e dirigetevi verso est, per strade tranquille, fino a una piccola piazza che molti visitatori considerano la più bella di Anversa.",
    },

    // ── 14 ───────────────────────────────────────────────────────────────
    "classics-conscienceplein": {
      name: "Hendrik Conscienceplein",
      subtitle: "L'uomo che insegnò al suo popolo a leggere",
      introduction: [
        "Vi trovate sulla Hendrik Conscienceplein, una piazza tranquilla e raccolta davanti a una chiesa barocca. Di fronte alla vecchia biblioteca si erge la statua dello scrittore Hendrik Conscience.",
      ],
      sections: [
        {
          heading: "Uno scrittore per i fiamminghi",
          kind: "history",
          paragraphs: [
            "Nell'Ottocento in Belgio il francese dominava la vita pubblica, l'amministrazione e la letteratura, anche nelle Fiandre. Hendrik Conscience scriveva in neerlandese, per i comuni lettori fiamminghi. Il suo romanzo storico De Leeuw van Vlaenderen (Il leone delle Fiandre), pubblicato nel 1838, divenne un simbolo di orgoglio ed emancipazione fiamminga.",
            "Nel 1883 gli fu dedicata una statua su questa piazza, che fino ad allora si chiamava Jezuïetenplein, la piazza dei Gesuiti, e che fu ribattezzata in suo onore. Era una cosa inaudita per un autore ancora in vita. Conscience stesso posò per lo scultore, Frans Joris, ma a causa della salute cagionevole non poté assistere all'inaugurazione nell'agosto 1883. Morì un mese dopo.",
          ],
        },
      ],
      didYouKnow: [
        "Le celebri parole sulla statua, «Hij leerde zijn volk lezen» («Insegnò al suo popolo a leggere»), furono pronunciate per la prima volta all'inaugurazione dal poeta Jan Van Beers. Ma non fu lo scultore a ideare la frase: l'idea venne da Henriëtte Mertens, la moglie del poeta.",
      ],
      transitionToNext:
        "Ora voltatevi. La chiesa riccamente decorata alle vostre spalle è la prossima tappa, e il luogo in cui entriamo nell'epoca di Rubens.",
    },

    // ── 15 ───────────────────────────────────────────────────────────────
    "classics-carolus-borromeus": {
      name: "Chiesa di San Carlo Borromeo",
      subtitle: "Il capolavoro perduto di Rubens",
      introduction: [
        "Davanti a voi si innalza la facciata della Sint-Carolus Borromeuskerk: stratificata, scolpita, teatrale, un mondo completamente diverso dalla cattedrale gotica. Questo è il Barocco, lo stile di Rubens e della Controriforma, pensato per travolgere i sensi e commuovere i fedeli.",
      ],
      sections: [
        {
          heading: "Il fiore all'occhiello dei Gesuiti",
          kind: "history",
          paragraphs: [
            "La chiesa fu costruita tra il 1615 e il 1621 dai Gesuiti, l'ordine cattolico in prima linea nella Controriforma. Fu progettata dagli architetti gesuiti Pieter Huyssens e François d'Aguilon e dedicata al fondatore dell'ordine, sant'Ignazio di Loyola.",
            "Peter Paul Rubens, allora all'apice della fama, vi fu strettamente coinvolto. Per le navate laterali e le gallerie la sua bottega realizzò 39 dipinti per il soffitto sulla base dei suoi bozzetti; il giovane Anthony van Dyck collaborò all'opera. Per un secolo questo fu uno degli interni di chiesa più splendidi d'Europa.",
          ],
        },
        {
          heading: "Il fulmine del 1718",
          kind: "history",
          paragraphs: [
            "Il 18 luglio 1718 un fulmine colpì la chiesa e la incendiò. Tutti i 39 dipinti del soffitto di Rubens andarono perduti. L'interno fu poi ricostruito in uno stile più austero, su progetto di Jan Pieter van Baurscheit il Vecchio.",
            "Più avanti nel XVIII secolo l'ordine dei Gesuiti fu soppresso e la chiesa fu dedicata di nuovo, a san Carlo Borromeo, nome che porta ancora oggi.",
          ],
        },
      ],
      didYouKnow: [
        "Sappiamo com'erano i soffitti di Rubens solo grazie a una serie di stampe: incisioni di Jan Punt tratte da acquerelli di Jacob de Wit. L'immagine in questa pagina è una di queste: un Rubens perduto, conservato su carta.",
      ],
      transitionToNext:
        "Dal Barocco torniamo ancora più indietro, nel tardo Medioevo. Camminate verso nord in direzione del fiume, fino a un edificio sorprendente a strisce rosse e bianche.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
    "classics-vleeshuis": {
      name: "Il Vleeshuis",
      subtitle: "Un palazzo per i macellai",
      introduction: [
        "Davanti a voi si trova il Vleeshuis, la Casa della carne. Con i suoi alti frontoni, le torri e le vistose fasce di mattoni rossi e pietra bianca, sembra un castello o un municipio. Fu costruito per i macellai della città.",
      ],
      sections: [
        {
          heading: "La corporazione dei macellai",
          kind: "history",
          paragraphs: [
            "Il Vleeshuis fu costruito tra il 1501 e il 1504 per la corporazione dei macellai, in stile tardogotico. Il progetto era di Herman de Waghemakere il Vecchio; dopo la sua morte nel 1502 i lavori furono probabilmente proseguiti dal figlio Domien, lo stesso Domien che in seguito costruì la borsa e lavorò alla cattedrale e allo Steen.",
            "L'edificio racconta molto su come era organizzata l'alimentazione in una città medievale. Il pianterreno era un mercato coperto con 62 banchi della carne, dove i macellai della corporazione vendevano la loro merce, e ospitava anche la cappella della corporazione. Al piano superiore si trovavano la sala delle riunioni, la sala delle feste e l'archivio della corporazione. Era la corporazione a decidere chi poteva vendere, e dove.",
          ],
        },
      ],
      didYouKnow: [
        "Non tutto poteva essere venduto all'interno. Frattaglie e interiora non erano ammesse nella sala; venivano vendute in piccole botteghe, i penshuisjes, costruite all'esterno contro l'edificio, tra i suoi contrafforti.",
        "Le fasce rosse e bianche dei muri si chiamano speklagen, «strati di lardo». Si è tentati di pensare a una battuta sui macellai, ma non hanno nulla a che vedere con il commercio della carne: erano semplicemente una moda edilizia rimasta in voga fino a Seicento inoltrato.",
      ],
      lookAt: [
        {
          title: "Gli strati di lardo",
          body: "Osservate i muri: file di mattoni rossi si alternano a fasce di arenaria chiara. Ora che ne conoscete il nome, riconoscerete questi speklagen su molti edifici antichi di Anversa e di altre città delle Fiandre.",
        },
      ],
      galleries: {
        "vleeshuis-postcards": {
          title: "Il Vleeshuis in vecchie cartoline",
          intro: "Tre vecchie cartoline del Museum Vleeshuis mostrano le sue sale, arredate con camini, mobili e oggetti della collezione.",
        },
      },
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Trovate l'antica cinta del burcht",
        task: [
          "Trovate l'antico muro che dall'inizio del XIII secolo proteggeva il burcht.",
          "La foto è il vostro indizio: cercate intorno al Vleeshuis un tratto di muro come questo. Trovato? Toccate il pulsante qui sotto.",
        ],
      },
      transitionToNext:
        "Proseguite per qualche strada verso nord, nel vecchio quartiere portuale. Qui si trova una chiesa la cui storia è legata al fiume, e al fuoco.",
    },

    // ── 17 ───────────────────────────────────────────────────────────────
    "classics-sint-paulus": {
      name: "Chiesa di San Paolo (Sint-Pauluskerk)",
      subtitle: "Gotica, barocca e salvata dalle fiamme",
      introduction: [
        "Davanti a voi si trova la Sint-Pauluskerk, una chiesa gotica sormontata da una sorprendente torre barocca. Sorge vicino alla Schelda, in quello che per secoli fu il quartiere di marinai, scaricatori di porto e mercanti.",
      ],
      sections: [
        {
          heading: "Un convento sul fiume",
          kind: "history",
          paragraphs: [
            "Questa era la chiesa dei Domenicani, un ordine di frati predicatori. Una chiesa precedente fu consacrata qui nel 1276 dal celebre studioso Alberto Magno. A partire dal 1517 fu costruita la chiesa attuale per sostituirla, nel XVI secolo in cui il commercio di Anversa era in piena fioritura.",
            "La Schelda non era mai lontana. Il fiume portava le navi, le merci e le persone che animavano questo quartiere, e la chiesa serviva una zona il cui ritmo era scandito dalle maree e dal porto.",
          ],
        },
        {
          heading: "Due incendi",
          kind: "history",
          paragraphs: [
            "Nel 1679 un violento incendio distrusse parte delle volte della navata e la sommità della facciata ovest. Durante i lavori di riparazione del 1680–1681 la chiesa ricevette il suo coronamento barocco della torre, quello che vedete oggi.",
            "Quasi tre secoli dopo, nell'aprile 1968, il fuoco colpì di nuovo. L'intero tetto andò perduto, le volte e gli interni furono danneggiati, il coronamento barocco della torre bruciò completamente e tre quarti del convento adiacente furono ridotti in rovina. La chiesa fu restaurata; i suoi tesori, tra cui dipinti di Rubens, Van Dyck e Jordaens, si possono ancora ammirare all'interno.",
          ],
        },
      ],
      didYouKnow: [
        "Accanto alla chiesa, tra il 1699 e il 1747, i Domenicani realizzarono un giardino del Calvario: un sentiero fiancheggiato da decine di statue che sale verso la croce, concepito come una sorta di teatro di pietra. È uno degli spettacoli più sorprendenti della città.",
      ],
      transitionToNext:
        "Andate verso il fiume. In riva all'acqua si trova l'edificio più antico di Anversa, l'ultimo resto del castello da cui la città ebbe inizio.",
    },

    // ── 18 ───────────────────────────────────────────────────────────────
    "classics-het-steen": {
      name: "Het Steen",
      subtitle: "L'ultimo frammento del castello dove nacque Anversa",
      introduction: [
        "Davanti a voi c'è Het Steen, «la Pietra»: un piccolo castello con torri e merli sulla riva della Schelda. Sembra una fortezza da fiaba, ma ciò che vedete è solo un frammento di qualcosa di molto più grande: il burcht, il nucleo fortificato da cui Anversa si è sviluppata.",
      ],
      sections: [
        {
          heading: "Dove nacque la città",
          kind: "history",
          paragraphs: [
            "Intorno all'850 qui sorgeva una fortezza di rifugio, protetta da un terrapieno contro le incursioni vichinghe. Alla fine del X secolo il terreno fu rialzato e probabilmente fu scavato un fossato. Intorno al 1200–1225 fu costruito il castello di pietra, Het Steen, insieme a una cinta muraria intorno al burcht.",
            "Dall'inizio del XIV secolo l'edificio fu usato come prigione, funzione che mantenne per più di cinque secoli, fino al 1823.",
          ],
        },
        {
          heading: "Il boia di Anversa",
          kind: "history",
          paragraphs: [
            "In quanto prigione cittadina, Het Steen faceva parte della giustizia di Anversa. Lo schout, lo sceriffo della città, sosteneva l'accusa; gli scabini giudicavano; e il boia eseguiva la sentenza. Qui, in una camera sotterranea, i sospetti venivano interrogati, talvolta sotto tortura.",
            "Tra il 1405 e il 1550 il boia di Anversa eseguì almeno 336 decapitazioni con la spada, la maggior parte sulla Grote Markt davanti al municipio. Altre sentenze venivano eseguite sulla Meir, sulla riva della Schelda e al campo delle forche. Tra il 1558 e il 1562 più di cinquanta condannati furono annegati, di preferenza in segreto all'interno di Het Steen: i roghi pubblici degli eretici avevano provocato troppi disordini.",
            "Ai boia stessi non andava sempre bene. Nel 1508 un nuovo boia, un ex garzone calzolaio, sbagliò la sua prima decapitazione, e alcuni bambini lo presero a sassate. E il 17 gennaio 1565 mastro Geleyn, boia della città dal 1542, fu a sua volta decapitato sulla Meir, condannato per omicidio, furto e violenze.",
          ],
        },
        {
          heading: "Carlo V ricostruisce",
          kind: "history",
          paragraphs: [
            "Intorno al 1520 l'imperatore Carlo V fece ricostruire Het Steen su progetto di Domien de Waghemakere e Rombout II Keldermans, gli stessi nomi che avete incontrato alla cattedrale. Del castello più antico sopravvisse solo la base. Nel 1549 Carlo V donò l'edificio alla città.",
          ],
        },
        {
          heading: "Il giorno in cui il castello scomparve",
          kind: "history",
          paragraphs: [
            "Per secoli Het Steen rimase nascosto tra le case e le strade del vecchio burcht. Poi, negli anni Ottanta dell'Ottocento, le banchine della Schelda furono rettificate e ricostruite per il porto moderno. Il vecchio quartiere del burcht fu demolito; le mura del burcht lungo il fiume scomparvero nel 1883. Solo Het Steen fu conservato e, nel 1887–1890, fu restaurato e dotato di una nuova ala nord in stile neogotico.",
            "Nel 1952 divenne il Museo Nazionale della Navigazione. Dopo una ristrutturazione iniziata nel 2018, ha riaperto nell'ottobre 2021.",
          ],
        },
      ],
      didYouKnow: [
        "Quello che vedete come «il castello» è solo una piccola parte del burcht medievale. La maggior parte fu demolita negli anni Ottanta dell'Ottocento per far posto alle banchine.",
        "Het Steen fu usato come prigione dall'inizio del XIV secolo fino al 1823: più di 500 anni.",
        "Sono pochi i veri strumenti di tortura o di esecuzione giunti fino a noi: nel 1794 i francesi ne bruciarono la maggior parte.",
      ],
      lookAt: [
        {
          title: "Due tipi di pietra",
          body: "Osservate la parte inferiore dei muri. La base è in pietra grigio scuro di Doornik (Tournai): l'unica parte sopravvissuta del castello più antico. Sopra si innalza l'arenaria più chiara della ricostruzione di Carlo V, dell'inizio del XVI secolo. State letteralmente guardando due epoche sovrapposte.",
        },
        {
          title: "La figurina sopra la porta",
          body: "Sopra la porta d'ingresso cercate una piccola figura di pietra consumata dal tempo. Secondo la tradizione rappresenterebbe Semini, un'antica divinità della fertilità. Secondo l'inventario del patrimonio fu mutilata intorno al 1587, pare dai Gesuiti, che la trovavano indecente. Eppure è sopravvissuta, ed è ancora lì.",
        },
      ],
      transitionToNext:
        "Percorrete gli ultimi passi fino all'acqua. Il nostro viaggio a ritroso nel tempo termina dove la storia di Anversa ebbe inizio.",
    },

    // ── 19 ───────────────────────────────────────────────────────────────
    "classics-scheldt": {
      name: "La Schelda",
      subtitle: "Dove tutto ebbe inizio",
      introduction: [
        "Fermatevi in riva all'acqua e guardate il fiume. Qui la Schelda è larga, grigia e inquieta, spinta dalle maree del Mare del Nord. Potrebbe sembrare la fine della città. In realtà è la ragione per cui la città esiste.",
      ],
      sections: [
        {
          heading: "Tutto ciò che avete visto",
          kind: "interpretation",
          paragraphs: [
            "Ripensate alla passeggiata. Il castello alle vostre spalle fu costruito per sorvegliare questo fiume. Il Vleeshuis, le case delle corporazioni e la borsa furono pagati con i commerci che vi transitavano. La torre della cattedrale era la prima cosa che i marinai vedevano. Mercanti da tutta Europa venivano alla Handelsbeurs grazie alle navi che attraccavano qui. Rubens dipingeva per una città resa ricca dal fiume. Perfino i diamanti e la grandiosa stazione ferroviaria appartengono a una città che il porto aveva reso potente.",
            "Il fiume portò ricchezza, ma anche guerre, migranti, idee e arte. Rese Anversa internazionale molto prima che quella parola esistesse.",
          ],
        },
        {
          heading: "Un fiume chiuso e riaperto",
          kind: "history",
          paragraphs: [
            "La Schelda poteva anche essere tolta alla città. Dopo la caduta di Anversa nel 1585, la flotta della Repubblica delle Province Unite bloccò il fiume, e l'accesso di Anversa al mare rimase interrotto per due secoli. Solo nel 1795 la navigazione fu di nuovo ufficialmente libera. Intorno al 1811 Napoleone fece scavare qui nuovi bacini portuali, e nel 1863 il Belgio riscattò finalmente l'antico pedaggio olandese sulla Schelda.",
            "Negli anni Ottanta dell'Ottocento le banchine furono rettificate per il porto moderno: fu il momento in cui Het Steen perse il suo castello. E il fiume esige ancora rispetto: dopo la mareggiata del 3 gennaio 1976, quando ad Anversa l'acqua salì a oltre sette metri, fu varato il Piano Sigma per proteggere l'intero bacino della Schelda dalle inondazioni.",
          ],
        },
      ],
      didYouKnow: [
        "Per circa duecento anni, dal blocco successivo al 1585 fino al 1795, Anversa fu un grande porto senza libero accesso al mare. È uno dei motivi per cui il secolo d'oro della città giunse al termine.",
      ],
      galleries: {
        "siege-of-antwerp": {
          title: "L'assedio di Anversa, 1584–1585",
          intro: "La caduta di Anversa nel 1585 arrivò dopo un assedio di oltre un anno condotto da Alessandro Farnese, duca di Parma. Queste stampe mostrano come chiuse il fiume e come la città cercò di sfondare.",
        },
      },
      closing: {
        timeline: [
          "Antwerpen-Centraal: inizia il XX secolo",
          "La Stadsfeestzaal e la Boerentoren: una città moderna e sicura di sé",
          "La Handelsbeurs: una sala ottocentesca su un'idea del Cinquecento",
          "San Carlo Borromeo: Rubens e il Barocco",
          "Il municipio e il Vleeshuis: la metropoli commerciale del Cinquecento",
          "La cattedrale: l'Anversa medievale",
          "Het Steen: il castello dove nacque la città",
          "La Schelda",
        ],
        finalLines: [
          "Avete iniziato questa passeggiata in una stazione ferroviaria costruita per l'era moderna. A ogni tappa siete tornati più indietro: dal Novecento all'Ottocento, a Rubens e al Barocco, ai mercanti del Cinquecento, alla cattedrale medievale e all'antico castello.",
          "E ora siete nel luogo dove tutto ebbe inizio: sul fiume.",
          "Non avete solo attraversato Anversa. Avete ripercorso a ritroso la sua storia.",
        ],
      },
    },
  },

  images: {
    "central-station-1906": {
      caption: "Antwerpen-Centraal poco dopo il suo completamento, su una cartolina del 1906 circa.",
      alt: "Vecchia cartolina della facciata in pietra con cupola della stazione centrale di Anversa, con persone sulla piazza antistante",
      approximateYear: "ca. 1906",
    },
    "central-station-hall-1909": {
      caption: "L'interno dell'edificio della stazione, su una cartolina spedita nel 1909.",
      alt: "Vecchia cartolina di un'alta sala riccamente decorata, con balconate e finestre ad arco, all'interno della stazione",
      approximateYear: "1909",
    },
    "central-station-today": {
      caption: "La galleria dei binari oggi, con l'orologio, la scritta ANTWERPEN e lo stemma della città sopra l'ingresso.",
      alt: "Foto moderna della galleria dei binari in ferro e vetro con la facciata decorata in pietra dell'edificio della stazione",
      approximateYear: "2023",
    },
    // Clue of Spooky's task at the station: says where it was taken, not what to find.
    "central-station-hall-clue-today": {
      caption: "L'indizio di Spooky: una foto scattata nella stazione.",
      alt: "Foto di una parete riccamente decorata sotto un tetto di vetro e ferro, con un orologio, decorazioni dorate e un nome in lettere d'oro",
      approximateYear: "2006",
    },
    "diamond-pelikaanstraat": {
      caption: "La Pelikaanstraat, ai margini dell'attuale quartiere dei diamanti, intorno al 1900.",
      alt: "Vecchia cartolina di una strada acciottolata con negozi, un carro trainato da cavalli e una torre in lontananza",
      approximateYear: "ca. 1900",
    },
    "keyserlei-1903": {
      caption: "De Keyserlei nel 1903. In fondo al viale, la guglia della cattedrale indica già la direzione.",
      alt: "Vecchia cartolina di un ampio viale alberato con carrozze ed edifici imponenti, e un campanile in lontananza",
      approximateYear: "1903",
    },
    "meir-1910": {
      caption: "La Meir su una cartolina spedita nel 1910, con un tram a cavalli.",
      alt: "Vecchia cartolina di una piazza con un tram trainato da cavalli e vetrine di negozi",
      approximateYear: "ca. 1910",
    },
    "stadsfeestzaal-today": {
      caption: "L'ingresso della Stadsfeestzaal sulla Meir, ricostruita dopo l'incendio del 2000.",
      alt: "Foto moderna di un ingresso decorato in pietra con una nicchia dorata e la scritta STADSFEESTZAAL",
      approximateYear: "2014",
    },
    "handelsbeurs-1890": {
      caption: "La sala della borsa di Joseph Schadde intorno al 1890: un cortile gotico sotto un tetto di ferro e vetro.",
      alt: "Vecchia fotografia di un cortile gotico con gallerie sotto un grande tetto di ferro e vetro",
      approximateYear: "ca. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "La stessa sala in un disegno a penna di Maxime Lalanne, realizzato prima del 1886.",
      alt: "Disegno a penna della sala della borsa con mercanti in piedi nel cortile",
      approximateYear: "prima del 1886",
    },
    "boerentoren-1930s": {
      caption: "La Boerentoren che svetta sugli edifici vicini, su una cartolina degli anni Trenta.",
      alt: "Vecchia cartolina di un'alta torre Art Déco sopra una piazza animata con tram",
      approximateYear: "anni Trenta",
    },
    "groenplaats-1899": {
      caption: "La Groenplaats intorno al 1899, con Rubens sul suo piedistallo e la cattedrale dietro gli alberi.",
      alt: "Vecchia cartolina di una piazza alberata con una statua e la torre della cattedrale sullo sfondo",
      approximateYear: "ca. 1899",
    },
    "cathedral-hollar-1649": {
      caption: "La cattedrale in un'acquaforte di Wenceslaus Hollar, 1649. La torre sud era già incompiuta.",
      alt: "Acquaforte dettagliata della facciata della cattedrale con una guglia alta e una torre molto più bassa",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "La guglia della cattedrale sopra i tetti, intorno al 1908.",
      alt: "Vecchia cartolina dell'alta torre gotica della cattedrale sopra una piazza",
      approximateYear: "ca. 1908",
    },
    "grote-markt-1905": {
      caption: "La Grote Markt nel 1905, con la fontana di Brabo a sinistra e le case delle corporazioni alle sue spalle.",
      alt: "Vecchia cartolina colorata della piazza con la fontana e le alte case delle corporazioni con frontoni",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Case delle corporazioni sulla Grote Markt oggi, con le figure dorate sui frontoni.",
      alt: "Foto moderna di alte case delle corporazioni in pietra con statue dorate in cima, contro un cielo azzurro",
      approximateYear: "2021",
    },
    "brabo-photochrom": {
      caption: "Brabo lancia la mano del gigante: una stampa a colori degli anni Novanta dell'Ottocento.",
      alt: "Stampa storica a colori della statua in bronzo di Brabo su una fontana rocciosa davanti alle case delle corporazioni",
      approximateYear: "anni Novanta dell'Ottocento",
    },
    "stadhuis-1866": {
      caption: "Il municipio in una delle prime fotografie, della metà degli anni Sessanta dell'Ottocento, montata in un album datato 1867.",
      alt: "Antica fotografia della lunga facciata rinascimentale del municipio",
      approximateYear: "1865–1867",
    },
    "conscienceplein-historical": {
      caption: "La Hendrik Conscienceplein intorno al 1900, con la biblioteca dietro la statua di Conscience.",
      alt: "Vecchia cartolina di un edificio signorile su una piazza, con una statua davanti all'ingresso",
      approximateYear: "ca. 1900",
    },
    "carolus-ceiling-punt-1748": {
      caption: "L'Adorazione dei Magi, uno dei dipinti per il soffitto di questa chiesa realizzati da Rubens e andati perduti, noto solo attraverso stampe come questa incisione settecentesca di Jan Punt da Jacob de Wit.",
      alt: "Incisione in bianco e nero dei tre re magi che offrono doni alla Vergine con il Bambino",
      approximateYear: "XVIII secolo",
    },
    "vleeshuis-1901": {
      caption: "«Vieille Boucherie»: il Vleeshuis e i suoi dintorni su una cartolina spedita intorno al 1901.",
      alt: "Vecchia cartolina di un alto edificio in mattoni con un arco e bambini per strada",
      approximateYear: "ca. 1901",
    },
    "vleeshuis-wall-clue": {
      caption: "L'indizio di Spooky: una vecchia foto di un angolo vicino al Vleeshuis.",
      alt: "Foto in bianco e nero di un muro grezzo di pietre irregolari accanto a un alto edificio in mattoni",
      approximateYear: "data sconosciuta",
    },
    "vleeshuis-postcard-kitchen": {
      caption: "Una sala arredata come un'antica cucina, con un grande focolare, paioli di rame e una pompa dell'acqua decorata con la sua vasca (cartolina del Museum Vleeshuis, data sconosciuta; collezione del MAS).",
      alt: "Cartolina seppia di una sala con un grande camino, paioli di rame davanti al focolare, pareti piastrellate, due sedie e una pompa decorata con una vasca di pietra",
      approximateYear: "data sconosciuta",
    },
    "vleeshuis-postcard-panelled-room": {
      caption: "Una stanza con un camino, armadi intagliati, pannelli decorati alle pareti e una statua su un mobile (cartolina del Museum Vleeshuis, data sconosciuta; collezione del MAS).",
      alt: "Cartolina seppia di una stanza con le pareti rivestite di pannelli decorati, un camino, armadi intagliati, un tavolo e una statua",
      approximateYear: "data sconosciuta",
    },
    "vleeshuis-postcard-hall": {
      caption: "Una sala con un lungo tavolo e sedie, un lampadario di vetro, un orologio a pendolo e un camino riccamente intagliato sormontato da una figura seduta (cartolina del Museum Vleeshuis, data sconosciuta; collezione del MAS).",
      alt: "Cartolina seppia di una sala con un lungo tavolo circondato da sedie, un lampadario di vetro, vetrate colorate, un orologio a pendolo e un grande camino intagliato",
      approximateYear: "data sconosciuta",
    },
    "siege-parma-bridge": {
      caption: "Il ponte di barche di Parma sulla Schelda, terminato nel febbraio 1585 per tagliare alla città ogni aiuto via acqua; Anversa è all'orizzonte. Stampa di Lamberecht Causé da Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Incisione di un lungo ponte costruito su barche attraverso un ampio fiume, con soldati e carrozze sopra, navi da guerra intorno e il profilo di una città in lontananza",
      approximateYear: "1670–1699",
    },
    "siege-bridge-attack": {
      caption: "Aprile 1585: Anversa lancia navi incendiarie contro il ponte. Secondo il titolo lo stesso Alessandro di Parma rischiò di morire, ma il ponte resse e l'attacco fallì. Stampa di Lamberecht Causé da Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Incisione di un'enorme esplosione su un ponte di barche, con assi, barche e soldati scagliati in aria e fumo sopra il fiume",
      approximateYear: "1670–1699",
    },
    "siege-map-luyken": {
      caption: "Tutto l'assedio in una mappa di Jan Luyken (1680–1684): Anversa in alto a sinistra, il ponte di barche al centro, le terre allagate e, a destra, i combattimenti sulla diga di Kouwenstein nel maggio 1585, un altro tentativo fallito di sfondare (Rijksmuseum).",
      alt: "Mappa incisa della Schelda a valle di Anversa con forti, un ponte sul fiume, campi allagati, navi e truppe che combattono lungo una diga",
      approximateYear: "1680–1684",
    },
    "sint-paulus-1901": {
      caption: "La Sint-Pauluskerk e i caffè intorno, su una cartolina datata 1901.",
      alt: "Vecchia cartolina di una chiesa gotica con torre barocca sopra piccole case e caffè",
      approximateYear: "1901",
    },
    "steen-photochrom": {
      caption: "Het Steen e il porto negli anni Novanta dell'Ottocento, pochi anni dopo la rettifica delle banchine.",
      alt: "Stampa storica a colori del piccolo castello accanto alla banchina, con navi e persone",
      approximateYear: "anni Novanta dell'Ottocento",
    },
    "steen-1920": {
      caption: "Una giornata di grande animazione allo Steen e al porto, intorno al 1920.",
      alt: "Vecchia cartolina con folla, carri e navi accanto al castello sulla banchina",
      approximateYear: "ca. 1920",
    },
    "steen-today": {
      caption: "Het Steen oggi.",
      alt: "Foto moderna delle torri del castello contro un cielo azzurro",
      approximateYear: "2015",
    },
    "scheldt-quays-1900": {
      caption: "Le banchine della Schelda intorno al 1900, fiancheggiate da navi e capannoni.",
      alt: "Vecchia cartolina illustrata di piroscafi e velieri lungo la banchina",
      approximateYear: "ca. 1900",
    },
    "diamond-bourse-today": {
      caption: "La Beurs voor Diamanthandel nella Pelikaanstraat, una delle borse dei diamanti del quartiere e monumento tutelato.",
      alt: "Foto moderna di un alto edificio per uffici in pietra con una fascia scolpita con il nome e bandiere sopra l'ingresso",
      approximateYear: "2010",
    },
    "flatow-expulsion-card-1941": {
      caption: "Scheda del 1941 di Siegfried Flatow, un tedesco nato a Berlino nel 1921 che abitava in Zurenborgstraat 17 ad Anversa. Riporta che il 1° febbraio 1941 fu trasferito con la forza a Beverloo, Leysestraat 25.",
      alt: "Modulo ingiallito bilingue tedesco-olandese compilato a macchina, con un'impronta digitale nel riquadro in basso e uno spazio vuoto per una foto",
      approximateYear: "1941",
    },
    "dossin-courtyard-1942": {
      caption: "Il cortile della caserma Dossin a Malines, 1942: bagagli sparsi a terra, camion e gruppi di persone.",
      alt: "Foto in bianco e nero di un cortile chiuso di una caserma, con file di valigie e fagotti a terra, due camion e gruppi di persone ai lati",
      approximateYear: "1942",
    },
    "paleis-op-de-meir-today": {
      caption: "Il Paleis op de Meir oggi: il palazzo mercantile settecentesco che Napoleone acquistò.",
      alt: "Foto moderna di una chiara facciata di palazzo rococò con un balcone e un ornato stemma sul tetto",
      approximateYear: "2023",
    },
    "rex-ruins": {
      caption: "Il Cinema Rex in rovina dopo l'impatto della V2 del 16 dicembre 1944.",
      alt: "Foto seppia di un cinema bombardato con muri crollati e il tetto a cupola scoperto, con un'auto degli anni Quaranta davanti",
      approximateYear: "1944–1947",
    },
    // The clue of Spooky's quest: shown before the place is found, so it must not name it.
    "paleis-op-de-meir-drawing": {
      caption: "L'indizio di Spooky: un vecchio prospetto di una lunga facciata.",
      alt: "Vecchio disegno di una facciata lunga e simmetrica con alte finestre, piccoli balconi, vasi sul tetto e un grande stemma ornato al centro",
      approximateYear: "data sconosciuta",
    },
    "rubens-self-portrait-1623": {
      caption: "Peter Paul Rubens, autoritratto, 1623 (Royal Collection, Londra).",
      alt: "Ritratto dipinto di un uomo barbuto con un ampio cappello nero e un mantello scuro",
      approximateYear: "1623",
    },
    "rubenshuis-garden-today": {
      caption: "Il giardino della Casa di Rubens oggi, con la casa e, a destra, il portico dell'epoca di Rubens.",
      alt: "Foto moderna di un giardino con una fontana davanti a una casa rinascimentale e un portale in pietra sormontato da statue",
      approximateYear: "2025",
    },
    "rubens-honeysuckle-bower": {
      caption: "Rubens e Isabella Brant sotto il pergolato di caprifoglio, 1609–1610 circa (Alte Pinakothek, Monaco di Baviera).",
      alt: "Dipinto di una giovane coppia riccamente vestita seduta mano nella mano sotto un pergolato di caprifoglio",
      approximateYear: "ca. 1609–1610",
    },
    "handelsbeurs-open-courtyard-1613": {
      caption: "La borsa del 1531 con il suo cortile aperto, pieno di mercanti: un'incisione pubblicata nel 1613.",
      alt: "Incisione in bianco e nero di un cortile rettangolare circondato da gallerie, con piccoli gruppi di persone e due torri",
      approximateYear: "1613",
    },
    "groenkerkhof-1597": {
      caption: "Un corteo funebre presso il cimitero della cattedrale, l'attuale Groenplaats: un dipinto anonimo del 1597 (Museum Vleeshuis).",
      alt: "Antico dipinto di persone in lutto vestite di nero che passano accanto a un cimitero, con l'alta torre della cattedrale sullo sfondo",
      approximateYear: "1597",
    },
    "groenplaats-rubens-statue-1840s": {
      caption: "La cattedrale vista dalla Groenplaats, con la nuova statua di Rubens: una litografia di Jules Alexandre Monthelier, anni Quaranta dell'Ottocento.",
      alt: "Litografia di una statua di bronzo su un alto piedistallo tra gli alberi, con la cattedrale e la sua guglia sullo sfondo",
      approximateYear: "anni Quaranta dell'Ottocento",
    },
    "matsijs-portrait-1572": {
      caption: "Quinten Matsijs in un ritratto a stampa pubblicato ad Anversa nel 1572. Il verso latino sottostante racconta come l'amore lo rese pittore.",
      alt: "Ritratto inciso di profilo di un uomo con berretto e mantello che tiene dei fogli arrotolati, con versi latini sotto",
      approximateYear: "1572",
    },
    "matsijs-altarpiece-1511": {
      caption: "La pala d'altare di Quinten Matsijs per la corporazione dei falegnami, dipinta nel 1508–1511 per questa cattedrale (KMSKA, Anversa).",
      alt: "Trittico dipinto con un Compianto sul Cristo morto nel pannello centrale e due pannelli laterali",
      approximateYear: "1511",
    },
    "matsijs-well": {
      caption: "Il pozzo accanto alla cattedrale, fotografato intorno al 1875–1900. La sua gabbia in ferro battuto è tradizionalmente attribuita a Matsijs.",
      alt: "Antica fotografia di un'ornata gabbia di pozzo in ferro battuto su una base di pietra davanti a un muro gotico",
      approximateYear: "ca. 1875–1900",
    },
    "nello-patrasche-today": {
      caption: "Nello e Patrasche di Batist Vermeulen (2016), addormentati sotto una coperta di ciottoli davanti alla cattedrale.",
      alt: "Foto moderna di una statua in marmo bianco di un ragazzo e un cane distesi sotto una coperta di ciottoli, con la torre della cattedrale sullo sfondo",
      approximateYear: "2023",
    },
    "vlaeykensgang-today": {
      caption: "Il Vlaeykensgang oggi: ciottoli, muri di mattoni e un passaggio coperto.",
      alt: "Foto moderna di uno stretto vicolo acciottolato tra muri di mattoni, visto attraverso un basso passaggio coperto",
      approximateYear: "2022",
    },
    "stadhuis-spanish-fury-hogenberg": {
      caption: "Il municipio in fiamme durante la Furia spagnola, con combattimenti sulla Grote Markt: un'acquaforte di Frans Hogenberg, realizzata prima del 1585.",
      alt: "Acquaforte di un grande municipio rinascimentale da cui si levano fiamme e fumo, con soldati che combattono sulla piazza antistante",
      approximateYear: "prima del 1585",
    },
    "handelsbeurs-vandennest": {
      caption: "Le gallerie decorate con lampadari, drappeggi e alberelli, in una stampa di J.B.J. Vandennest realizzata tra il 1842 e il 1851: ancora prima che il cortile avesse il suo primo tetto (Università di Anversa, Collezioni speciali).",
      alt: "Stampa di lunghe gallerie a volta con colonne scolpite, lampadari appesi, drappeggi e file di alberelli, con due uomini in uniforme in primo piano",
      approximateYear: "1842–1851",
    },
    "handelsbeurs-lebrun-liedel": {
      caption: "La Borsa dopo la ricostruzione: colonne scolpite, gallerie a volta e alcuni mercanti, in una stampa di Lebrun-Liedel successiva al 1872 (Università di Anversa, Collezioni speciali).",
      alt: "Stampa in bianco e nero di una sala con colonne riccamente scolpite e volte a sesto acuto, con in primo piano un uomo con il cilindro che legge",
      approximateYear: "dopo il 1872",
    },
    "spanish-fury-overview-1577": {
      caption: "La Furia spagnola in un solo foglio: una stampa anonima del 1577 con al centro una pianta di Anversa e della sua cittadella, circondata da scene dell'attacco, dei combattimenti e del municipio in fiamme (Rijksmuseum).",
      alt: "Stampa con al centro una veduta a volo d'uccello di Anversa e della sua cittadella a stella, circondata da piccole scene di soldati che attaccano, combattono e saccheggiano",
      approximateYear: "1577",
    },
    "spanish-fury-de-braekeleer": {
      caption: "La Furia spagnola ad Anversa come la dipinse Ferdinand de Braekeleer il Vecchio nel 1836: un'immagine romantica ottocentesca di cittadini armati e feriti tra fumo e fuoco, con la torre della cattedrale sullo sfondo (KMSKA, Anversa).",
      alt: "Dipinto di una folla di cittadini armati, uomini feriti e una donna inginocchiata accanto a un moribondo, con fumo, fuoco e la torre di una cattedrale sullo sfondo",
      approximateYear: "1836",
    },
    "spanish-fury-mas": {
      caption: "Una strada piena di vittime, con case in fiamme in lontananza: un dipinto anonimo della Furia spagnola, realizzato tra il 1576 e il 1585 circa (MAS, Anversa).",
      alt: "Dipinto di una strada affollata di soldati, cavalieri e molti morti, con case in fiamme e fumo nero in lontananza e un campanile a sinistra",
      approximateYear: "1576–1585",
    },
    "spanish-fury-hogenberg-plunder": {
      caption: "Saccheggio e tortura nelle case di Anversa durante la Furia spagnola, in una stampa di Frans Hogenberg (XVI secolo; Rijksmuseum).",
      alt: "Incisione di soldati che torturano persone appese a corde dentro le case, con corpi a terra e una strada con case a timpano sullo sfondo",
      approximateYear: "XVI secolo",
    },
    "spanish-fury-print-1618": {
      caption: "«Spaensche Furie tot Antwerpen»: una stampa del 1618–1624 circa che riprende la scena, con una poesia che piange la sorte della città (anonimo; Rijksmuseum).",
      alt: "Incisione della stessa scena di tortura e saccheggio, con il titolo «Spaensche Furie tot Antwerpen» e sotto due colonne di versi in olandese",
      approximateYear: "1618–1624 circa",
    },
    "execution-hogenberg-1568": {
      caption: "Un'esecuzione nei Paesi Bassi dell'epoca: la decapitazione dei conti di Egmont e di Horne sulla Grote Markt di Bruxelles nel 1568, in un'acquaforte di Frans Hogenberg. Non è Anversa, ma è la stessa epoca e lo stesso tipo di giustizia.",
      alt: "Acquaforte di un patibolo circondato da soldati armati di picche, con un boia armato di spada accanto a un uomo inginocchiato",
      approximateYear: "1568–1570",
    },
    "scheldt-photochrom": {
      caption: "Anversa vista dal fiume negli anni Novanta dell'Ottocento: Het Steen a sinistra, la cattedrale che si innalza sopra la città.",
      alt: "Stampa storica a colori del profilo di Anversa visto dal fiume, con barche in primo piano",
      approximateYear: "anni Novanta dell'Ottocento",
    },
  },
};
