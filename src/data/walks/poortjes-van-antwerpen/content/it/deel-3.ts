import type { PoortjesStopText } from "../types";

/** Part 3: Handelsbeurs, University & Academy (gates 24–41). Italian text, translated from ../en/. */
export const deel3: Record<string, PoortjesStopText> = {
  // ── Handelsbeurs ─────────────────────────────────────────────────────
  "poortjes-handelsbeurs": {
    name: "La Handelsbeurs",
    subtitle: "Dove il mondo veniva a fare affari",
    introduction: [
      "Dall'esterno la Handelsbeurs (l'antica borsa del commercio) quasi non si nota. All'interno si trova uno degli spazi più straordinari della città: un cortile gotico circondato da gallerie, coperto da un altissimo tetto di ferro e vetro.",
      "Sulla Oude Beurs avete visto dove sorgeva la prima borsa. Qui si trova la sua erede.",
    ],
    sections: [
      {
        heading: "Perché Anversa aveva bisogno di una borsa",
        kind: "history",
        paragraphs: [
          "Intorno al 1530 Anversa era una delle città più ricche d'Europa. Dal Portogallo arrivavano navi cariche di spezie asiatiche; in città vivevano mercanti italiani, tedeschi, inglesi e spagnoli. Avevano bisogno di conoscere i prezzi, trovare acquirenti, prendere denaro in prestito e assicurare i carichi. Non esistevano telefoni né giornali come li conosciamo noi: le informazioni viaggiavano per lettera e soprattutto di bocca in bocca.",
          "La vecchia borsa divenne troppo piccola: intorno al 1526–1527 i mercanti chiesero più spazio. Nel 1531 la città aprì qui una nuova borsa, progettata da Domien de Waghemakere in stile gotico brabantino tardo: un cortile aperto con una galleria coperta e ricche volte stellari. Fu uno dei primi edifici mai costruiti appositamente per questo scopo.",
        ],
      },
      {
        heading: "Un incendio, e poi un altro",
        kind: "history",
        paragraphs: [
          "Ciò che vedete non è semplicemente l'edificio del 1531. La borsa fu ricostruita nel 1583 e bruciò nel 1858. L'architetto Joseph Schadde progettò l'edificio attuale; l'incarico gli fu affidato definitivamente nel 1868 e la nuova borsa fu inaugurata solennemente il 19 ottobre 1872. Schadde mantenne l'idea del cortile gotico, ma lo coprì con uno spettacolare tetto di ferro e vetro.",
          "Alla fine del XX secolo le contrattazioni si erano spostate altrove e l'edificio rimase vuoto per una ventina d'anni. Dopo un restauro radicale ha riaperto nel 2019, oggi come sede di eventi.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Dare un'occhiata all'interno",
        paragraphs: [
          "Secondo la Handelsbeurs stessa, la sala delle contrattazioni è aperta al pubblico nei fine settimana e durante le vacanze scolastiche, dalle 10 alle 18, salvo in occasione di eventi. Ingressi dalla Twaalfmaandenstraat (dal lato della Meir) e dalla Borzestraat (dal lato della Lange Nieuwstraat).",
          "Il sito web non dice se la visita sia gratuita. Verificate le informazioni aggiornate e l'elenco dei giorni di chiusura prima di andare.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://handelsbeursantwerpen.be/en/bezoek-de-handelsbeurs/",
      },
    ],
    didYouKnow: [
      "La borsa di Anversa divenne un modello anche all'estero. Quando Thomas Gresham, agente della corona inglese ad Anversa, fondò il Royal Exchange di Londra negli anni Sessanta del Cinquecento, prese a esempio la borsa anversana.",
      "L'Accademia di Belle Arti, che visiteremo più avanti, ebbe inizialmente sede nella «Borsa sulla Meir», e frammenti della borsa cinquecentesca si trovano nel giardino dell'Accademia.",
    ],
    transitionToNext: "Raggiungete la Lange Nieuwstraat. La casa che cercate porta il nome di una città italiana, e il suo portale proviene da un altro luogo.",
  },

  // ── Gate 25 (+ vanished 24) ──────────────────────────────────────────
  "poortjes-lange-nieuwstraat": {
    name: "Lange Nieuwstraat 45",
    subtitle: "Bolonia la Grassa, e un portale che ha traslocato",
    introduction: [
      "Cercate la casa mercantile con un alto frontone a gradoni di quattordici gradini. Poi guardate il portale: una porta a tutto sesto in una cornice barocca di pietra blu, con un cartiglio che reca un anno.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Dalla fine del XVI secolo questa tradizionale casa mercantile della seconda metà di quel secolo si chiama «Bolonia la Grassa», dalla città italiana di Bologna. Vi soggiornarono nobili spagnoli e italiani. Nel XVII secolo vi abitò il pittore Abraham van Diepenbeeck; la sua famiglia possedette la casa fino al XVIII secolo. Dal 1828 al 1849 la vedova Helena Van Celst-Kums vi gestì una scuola femminile e un orfanotrofio.",
        ],
      },
      {
        heading: "Un portale che ha traslocato",
        kind: "history",
        paragraphs: [
          "Il portale non apparteneva in origine a questa casa. Smekens: «Proviene da un edificio demolito nella Twaalfmaandenstraat.» L'inventario lo conferma e aggiunge dettagli: il portale è «datato 1665 in un cartiglio» e nel 1926 sostituì una trasformazione ottocentesca della facciata.",
          "La Twaalfmaandenstraat è la via accanto alla Handelsbeurs, da cui siete appena arrivati.",
        ],
      },
    ],
    glossary: ["cartouche", "trapgevel"],
    thenAndNow: [
      "Allora: nel 1951 il portale si trovava qui da appena 25 anni.",
      "Oggi: cercate l'anno 1665 nel cartiglio. Nel 2014–2017 la casa fu unita alla vicina casa Sint-Franciscus e ristrutturata in appartamenti.",
    ],
    didYouKnow: [
      "Nella stessa via, al numero 36, Smekens disegnò un altro portale, in stile Régence, appartenente alla grande dimora «De Keyser». È scomparso.",
    ],
    transitionToNext: "Proseguite fino alla Sint-Jacobskerk, la chiesa in cui è sepolto Rubens.",
  },

  // ── St James ─────────────────────────────────────────────────────────
  "poortjes-sint-jacob": {
    name: "Sint-Jacobskerk (Chiesa di San Giacomo)",
    subtitle: "La chiesa dei pellegrini, e di Rubens",
    introduction: [
      "Davanti a voi si ergono una massiccia torre occidentale mai terminata e una lunga, sobria chiesa in stile gotico brabantino. L'esterno è modesto. L'interno è uno dei più ricchi della città.",
    ],
    sections: [
      {
        heading: "Da ospizio per pellegrini a chiesa parrocchiale",
        kind: "history",
        paragraphs: [
          "In questo luogo sorgeva un ospizio per i pellegrini diretti a Santiago de Compostela (1404–1413). Nel 1478 la sua cappella divenne chiesa parrocchiale. La chiesa attuale fu costruita in tre fasi: dal 1491 con la torre, finché i lavori si fermarono per mancanza di fondi; dal 1552 al 1566 con la navata e il transetto; e dal 1602 al 1656 con il coro e le cappelle intorno.",
          "Alla chiesa lavorarono noti capomastri: Herman de Waghemakere, suo figlio Domien, il fratello di Domien, Herman, e dal 1525 Rombout Keldermans. Domien de Waghemakere lo avete già incontrato alla Oude Beurs, alla Handelsbeurs e alla cattedrale.",
        ],
      },
      {
        heading: "Tardogotico, fuori e dentro",
        kind: "history",
        paragraphs: [
          "L'inventario definisce la chiesa un esempio di gotico brabantino, con una caratteristica e massiccia torre occidentale, un'architettura esterna sobria e, all'interno, un triforio con camminamento. La torre incompiuta ha cinque ordini ed è «sostenuta da quattro massicci contrafforti angolari».",
          "All'interno il quadro è completamente diverso: decine di cappelle di famiglie facoltose, altari barocchi, marmi e monumenti funebri. Nel 1705 papa Clemente XI conferì alla chiesa il titolo di «insigne collegiata».",
        ],
      },
      {
        heading: "Rubens",
        kind: "history",
        paragraphs: [
          "Peter Paul Rubens morì nel 1640 e fu sepolto in questa chiesa. La sua cappella funeraria fu allestita nel 1642. Sopra l'altare è appeso un dipinto dello stesso Rubens, la «Madonna con santi», che l'inventario data al 1634.",
          "Nel maggio 2026 la città ha annunciato la conclusione di un restauro durato sette anni. Secondo il comunicato stampa, anche la pala d'altare, l'altare, l'epitaffio e i monumenti funebri della cappella di Rubens sono stati restaurati e sono di nuovo visitabili.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Dare un'occhiata all'interno",
        paragraphs: [
          "Secondo la Città di Anversa (comunicato stampa del 13 maggio 2026), la chiesa si può «visitare gratuitamente ogni giorno tra le 14 e le 17». Alcune fonti meno recenti riportano ancora che la cappella funeraria resterà chiusa fino al 2028; secondo il comunicato stampa è di nuovo accessibile. La chiesa può essere chiusa durante le funzioni e i funerali. Restauri minori proseguiranno fino al 2028.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://pers.antwerpen.be/sint-jacobskerk-opnieuw-volledig-toegankelijk-na-7-jaar-restauratie",
      },
    ],
    didYouKnow: [
      "Durante il restauro sono state posate sul tetto 426.650 nuove lastre di ardesia e sono stati riparati 1.738 m² di vetrate.",
    ],
    lookAt: [
      {
        title: "La torre incompiuta",
        body: "Alzate lo sguardo verso la torre occidentale. La costruzione iniziò nel 1491 e si fermò per mancanza di fondi; la torre non ricevette mai la guglia che avete visto alla cattedrale.",
      },
    ],
    transitionToNext: "Raggiungete la Keizerstraat, la via dei borgomastri e dei pittori.",
  },

  // ── Gate 26 + Snijders&Rockox House (+ vanished 32) ──────────────────
  "poortjes-keizerstraat": {
    name: "Keizerstraat 10-16",
    subtitle: "Un borgomastro, un pittore e una porta piena di rocaille",
    introduction: [
      "Siete in una via tranquilla di case signorili. Al numero 16, cercate una piccola porta con una decorazione capricciosa, simile a conchiglie. Qualche casa più in là, al numero 10–12, si trova la Snijders&Rockox Huis.",
    ],
    sections: [
      {
        heading: "Il numero 16: la porta",
        kind: "history",
        paragraphs: [
          "L'edificio è formato da due case cinquecentesche collegate. La casa di destra ha un frontone tardogotico a volute della prima metà del XVI secolo, quella di sinistra un frontone a gradoni della seconda metà. Secondo l'inventario, sull'asse centrale si trova una porta del terzo quarto del XVIII secolo: un «arco a tutto sesto con imposte, inserito in un campo ad arco ribassato, decorato con rocaille», con una porta di legno, una sopraluce in ferro battuto e un raschiascarpe in ghisa.",
          "Smekens chiama la casa «De zwarte arend» (l'aquila nera); l'inventario la chiama oggi «De witte Lelie» (il giglio bianco). Nel 1830 il barone Philippe Antoine Joseph de Pret de ter Veken fece modificare le facciate dall'architetto Franciscus De Wolf. Dal 1992–1993 è un hotel.",
        ],
      },
    ],
    cards: [
      {
        id: "card-rockox",
        title: "La Snijders&Rockox Huis",
        subtitle: "Possibile sosta al museo: Keizerstraat 10-12",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Nicolaas Rockox (1560–1640) fu borgomastro di Anversa e grande amante dell'arte. Nel 1603 acquistò due case adiacenti e le fece ricostruire; vi abitò con la moglie Adriana Perez. Come borgomastro rappresentava la città presso le autorità superiori e comandava la milizia e le guardie civiche.",
              "Il suo vicino era il pittore Frans Snijders (1579–1657). Lui e la moglie Margriete de Vos abitarono dal 1622 nella casa «de Fortuyne». Snijders era noto per le sue nature morte, i dipinti di animali e le scene di caccia.",
              "Nel 1970 la Kredietbank acquistò la casa di Rockox, che divenne un museo. Oggi le due case formano insieme la Snijders&Rockox Huis, con opere, tra gli altri, di Bruegel, Rubens e Van Dyck.",
            ],
          },
        ],
        didYouKnow: [
          "Il primo martedì di ogni mese il museo si può visitare gratuitamente.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visita al museo (facoltativa)",
        paragraphs: [
          "Aperto dal martedì alla domenica, dalle 10 alle 17; chiuso il lunedì (tranne il lunedì di Pasqua e il lunedì di Pentecoste), il 1° gennaio, il 1° maggio, il giorno dell'Ascensione, il 1° novembre e il 25 dicembre. Ingresso 10 €; gratuito per i ragazzi sotto i 18 anni e per i titolari di un museumPASSmusées; gratuito per tutti il primo martedì del mese.",
          "La visita al museo è facoltativa; dopo, la passeggiata prosegue semplicemente.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.snijdersrockoxhuis.be/en/visit/plan-your-visit/opening-hours-prices",
      },
    ],
    glossary: ["rocaille", "lodewijk-stijlen"],
    thenAndNow: [
      "Allora: Smekens disegnò un «portale in stile Luigi XV». Quello stile si riconosce dalle forme asimmetriche di conchiglie e rocce.",
      "Oggi: cercate il raschiascarpe, il piccolo bordo di ferro per pulirsi le scarpe. C'è anche nel disegno?",
    ],
    didYouKnow: [
      "Nella Paternosterstraat, vicino a questa via, Smekens disegnò una piccola porta in stile rinascimentale fiammingo appartenente alla casa «De gulden dolfeyn» (il delfino d'oro), che secondo lui era già menzionata nel 1497. È scomparsa.",
    ],
    transitionToNext: "Raggiungete la Markgravestraat, una stretta via tracciata intorno al 1500.",
  },

  // ── Gate 27 ───────────────────────────────────────────────────────────
  "poortjes-markgravestraat": {
    name: "Markgravestraat 14",
    subtitle: "Una via attraverso la tenuta di un margravio",
    introduction: [
      "In questa stretta via, cercate il numero 14 e il portale del libro. Confrontate la cornice con il disegno: le proporzioni dell'arco, le lesene e il coronamento.",
    ],
    sections: [
      {
        heading: "La via",
        kind: "history",
        paragraphs: [
          "La Markgravestraat fu tracciata intorno al 1500 e prende il nome dal margravio Jan van Immerseel (XV–XVI secolo), attraverso la cui proprietà fu aperta la via. È una via stretta con case di stili diversi, con frontoni a punta e a gradoni.",
        ],
      },
      {
        heading: "Il portale",
        kind: "history",
        paragraphs: [
          "Per questo portale Smekens scrive soltanto: «Portale rinascimentale. Markgravestraat 14.» Non abbiamo trovato una scheda d'inventario specifica. Della funzione originaria di questo portale in particolare si sa poco con certezza. [Ricerca storica necessaria]",
        ],
      },
    ],
    thenAndNow: [
      "Allora: un portale senza storia nel libro, solo un disegno.",
      "Oggi: confrontate voi stessi. Il disegno corrisponde ancora a ciò che vedete?",
    ],
    didYouKnow: [
      "Il nome della via non si riferisce a un titolo in generale, ma a una persona precisa: il margravio Jan van Immerseel, attraverso la cui tenuta fu aperta la via.",
    ],
    transitionToNext: "Raggiungete la Koningstraat. Lì cercate tre re.",
  },

  // ── Gate 29 (+ vanished 28 and 31) ───────────────────────────────────
  "poortjes-koningstraat": {
    name: "Koningstraat 17",
    subtitle: "De Drij Koningen (I tre re)",
    introduction: [
      "Cercate il frontone a gradoni con una piccola porta in pietra blu nella campata di destra. Sopra la porta c'è una piccola finestra rotonda, circondata da fogliame.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Smekens scrive che la casa «De Drie Koningen» era «già menzionata nel 1549»; l'inventario dice «già menzionata alla fine del XVI secolo». Nel 1881 la facciata fu restaurata a fondo sotto la direzione degli architetti Léonard e Henri Blomme.",
          "La porta stessa è più recente della casa. Smekens: «Risale al 1716.»",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive una «piccola porta in pietra blu in stile tardobarocco datata 1716»: «una porta ad arco a spalle in una cornice modanata, affiancata da lesene con fusti incassati e capitelli a volute». Sopra la porta c'è un oculo, una finestra rotonda, circondato da fogliame decorativo. Smekens la definisce una «porta Luigi XIV».",
        ],
      },
    ],
    glossary: ["schouderboog", "lodewijk-stijlen"],
    thenAndNow: [
      "Allora: Smekens disegnò la porta con la sua finestra rotonda.",
      "Oggi: cercate l'anno 1716.",
    ],
    didYouKnow: [
      "Nella stessa via, al numero 14, Smekens disegnò un'altra porta del XVIII secolo, appartenente alla casa «De witte koning» (il re bianco). È scomparsa.",
      "La porta nella vicina Gratiekapelstraat era già scomparsa quando uscì il libro: Smekens scrive che era stata «semplicemente abbattuta da vandali qualche anno fa».",
    ],
    transitionToNext: "Raggiungete la Prinsstraat, nel cuore storico dell'università.",
  },

  // ── University ───────────────────────────────────────────────────────
  "poortjes-universiteit": {
    name: "Stadscampus e Hof van Liere",
    subtitle: "Il palazzo di un borgomastro diventato università",
    introduction: [
      "Dietro le facciate della Prinsstraat si trova lo Stadscampus (il campus cittadino) dell'Università di Anversa. Il suo cuore è l'Hof van Liere, un palazzo tardogotico con cortile, gallerie e pozzo.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "«Questa residenza principesca fu costruita nel 1516 per l'allora borgomastro di Anversa Aert van Liere», in stile gotico brabantino, scrive l'università. Dopo la sua morte la proprietà passò alla città, che la mise a disposizione di una famiglia di banchieri milanesi e più tardi della Nazione inglese, l'associazione dei mercanti inglesi.",
          "I Gesuiti, che nel 1575 fondarono una scuola secondaria ad Anversa, ampliarono il complesso e lo adibirono a collegio. Dopo la soppressione del loro ordine, divenne un'accademia militare e un ospedale.",
          "Nel 1929 i Gesuiti tornarono: la loro scuola di commercio Sint-Ignatius trovò qui una nuova sede. Nel 1988 le Universitaire Faculteiten Sint-Ignatius (UFSIA) acquistarono il Prinsenhof, e nel 2003 le università di Anversa si fusero nell'Università di Anversa.",
        ],
      },
      {
        heading: "Tutt'intorno",
        kind: "history",
        paragraphs: [
          "Del campus fa parte anche il convento delle Suore Grigie nella Lange Sint-Annastraat, costruito nel 1887 su progetto di Frans Baeckelmans. Secondo l'università, le suore assistevano le vittime della peste. Dopo il 1999 fu ristrutturato, inserendo un'architettura moderna nel contesto storico.",
          "Secondo l'università, il giardino dell'Hof van Liere ricevette un nuovo aspetto nel 1998 a opera dell'architetto paesaggista Wirtz.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Accesso",
        paragraphs: [
          "Il campus è un'università in piena attività, non un museo. Non abbiamo trovato informazioni ufficiali sul libero accesso al cortile e al giardino. Se il cancello è aperto, date un'occhiata con discrezione e rispettate studenti e personale; se è chiuso, anche la facciata sulla Prinsstraat merita una sosta. [Accesso da verificare]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    didYouKnow: [
      "I mercanti inglesi erano importanti nell'Anversa del Cinquecento: la Nazione inglese ebbe qui sede per un certo periodo e, secondo Smekens, nel 1550 la città fece costruire una piccola borsa «a beneficio dei mercanti inglesi».",
    ],
    transitionToNext: "Ora potete scegliere: una breve deviazione verso due portali nella Rodestraat, oppure proseguire direttamente verso la Stadswaag.",
  },

  // ── Gates 33 and 34: optional ────────────────────────────────────────
  "poortjes-rodestraat": {
    name: "Rodestraat 43 e 44",
    subtitle: "Extra: due portali vicino al Begijnhof",
    introduction: [
      "Benvenuti nella deviazione. Nella Rodestraat Smekens disegnò due portali che si trovano quasi uno di fronte all'altro: un piccolo portale rinascimentale presso la canonica del Begijnhof (il beghinaggio, numero 43) e un portone carraio (numero 44).",
    ],
    sections: [
      {
        heading: "Che cosa dice il libro",
        kind: "history",
        paragraphs: [
          "Sul numero 43 Smekens scrive soltanto: «Piccolo portale rinascimentale presso la canonica del Begijnhof.» Sul numero 44: «Costruito intorno al 1725 in puro stile Luigi XV.»",
          "Non siamo ancora riusciti a studiare noi stessi questi due portali. Se esistano ancora oggi, e in quali condizioni, va verificato sul posto. [Ricerca storica necessaria]",
        ],
      },
      {
        heading: "Un portone carraio",
        kind: "context",
        paragraphs: [
          "Un portone carraio è più largo di una porta normale: doveva lasciar passare una carrozza o un carro fino a un cortile. Lo si riconosce dalla larghezza e spesso da paracarri in pietra o in ferro alla base.",
        ],
      },
    ],
    glossary: ["lodewijk-stijlen"],
    thenAndNow: [
      "Allora: due portali, datati al XVI–XVII secolo (43) e al 1725 circa (44).",
      "Oggi: confrontateli entrambi con i disegni. Le vostre osservazioni ci aiutano a completare questa tappa.",
    ],
    didYouKnow: [
      "L'anno 1725 e lo stile «Luigi XV» sono parole di Smekens stesso. Come avete visto lungo il percorso, nomi di stile e datazioni possono risultare diversi negli studi successivi.",
    ],
    transitionToNext: "Tornate alla Stadswaag: la piazza dell'uomo che fece tracciare mezza città settentrionale.",
  },

  // ── Gate 35 (+ vanished 30) ──────────────────────────────────────────
  "poortjes-stadswaag": {
    name: "La Stadswaag",
    subtitle: "Dove il commercio veniva pesato e tassato",
    introduction: [
      "Vi trovate in una piazza senza l'edificio da cui prende il nome. Qui sorgeva la pesa pubblica cittadina (stadswaag). Sulla piazza, cercate il numero 13 con la porta del libro: una piccola porta tardorinascimentale con sopraluce.",
    ],
    sections: [
      {
        heading: "Che cos'è una pesa pubblica?",
        kind: "history",
        paragraphs: [
          "Una pesa pubblica era una stazione di pesatura ufficiale. Secondo l'inventario, la pesa di Anversa era «una sorta di ufficio delle imposte in cui le merci venivano pesate e tassate in proporzione». Chi commerciava merci le faceva pesare ufficialmente qui: così l'acquirente sapeva che cosa riceveva, e la città sapeva che cosa poteva tassare.",
          "L'edificio aveva anche «diverse sale riccamente decorate in cui si celebravano banchetti nuziali».",
        ],
      },
      {
        heading: "Gilbert van Schoonbeke",
        kind: "history",
        paragraphs: [
          "La piazza e le vie circostanti furono tracciate nel 1548 da Gilbert van Schoonbeke, un promotore immobiliare prima che il termine esistesse. Con un atto del 6 maggio 1547 acquistò il terreno dalla città per 31.000 fiorini carolini. Demolì gli edifici esistenti e costruì «la nuova pesa».",
          "Tracciò anche tre vie: la Noord-, Oost- e Weststraat (via Nord, via Est e via Ovest), in seguito ribattezzate Hoornstraat, Brilstraat e Raapstraat. Il nome «Stadswaag» per la piazza risale al 1800 circa.",
          "Van Schoonbeke lo avete già incontrato: fece costruire anche i birrifici della Brouwersstraat, da cui provengono diversi portali del libro.",
        ],
      },
      {
        heading: "La fine della pesa",
        kind: "history",
        paragraphs: [
          "Il 25 agosto 1873, durante un violento temporale, cadde un fulmine. L'edificio prese fuoco e nel giro di poche ore bruciò completamente. La città trasformò allora l'area in una piazza pubblica. Nel settembre 1914 la Stadswaag finì di nuovo sulle cronache, quando fu colpita da una bomba sganciata da uno Zeppelin.",
          "Negli anni Sessanta gli artisti scoprirono il quartiere, che divenne una zona della vita notturna. La piazza fu ridisegnata nel 1998.",
        ],
      },
    ],
    glossary: ["waaier", "ijkdienst"],
    thenAndNow: [
      "Allora: nel 1951 la pesa era scomparsa da quasi ottant'anni. Smekens disegnò la porta al numero 13 senza ulteriori spiegazioni.",
      "Oggi: trovate il numero 13 e confrontate la sopraluce con il disegno. [Stato attuale di questa porta da verificare sul posto]",
    ],
    didYouKnow: [
      "Nella Raapstraat (via della Rapa), una delle vie di Van Schoonbeke, Smekens disegnò una piccola porta con «una rapa come motivo» nella conchiglia sopra la porta. Una rapa nella via della Rapa: purtroppo la porta è scomparsa.",
      "Dopo l'incendio del 1873, l'ufficio ufficiale dei pesi e delle misure fu ospitato temporaneamente nella casa De Clocke nella Lange Noordstraat. Vedrete quella casa e il suo portale più avanti lungo il percorso.",
    ],
    transitionToNext: "Raggiungete la Mutsaardstraat. Di fronte all'Accademia si trova un portale monumentale.",
  },

  // ── Gate 36 ───────────────────────────────────────────────────────────
  "poortjes-mutsaardstraat": {
    name: "Mutsaardstraat 30-32",
    subtitle: "La casa di un cancelliere",
    introduction: [
      "Sulla Mutsaardstraat, cercate un'ampia facciata in arenaria con una parte centrale barocca e un frontone spezzato. Osservate il portale monumentale. Confrontate anche i numeri civici 30 e 32.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Al «Mutsaertstraat 30» Smekens scrive: «Apparteneva alla casa di Schockaert, consigliere comunale e cancelliere del Brabante.» L'inventario colloca oggi la dimora barocca di Jan Daniël Antoon Schockaert, cancelliere del ducato di Brabante dal 1739, al numero Mutsaardstraat 32. Secondo l'inventario, il numero 30 è la casa «De Draeck» (il drago).",
          "La dimora fu costruita nel terzo quarto del XVII secolo dalla famiglia Van den Kerckhoven. Il 16 dicembre 1944 fu gravemente danneggiata da una bomba V. Nel 1956–1957 fu trasformata in negozi, uffici e appartamenti; la facciata principale è tutelata dal 1958.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "La facciata a otto campate ha un paramento in arenaria e un avancorpo centrale barocco con un «frontone spezzato con ornamento di coronamento». Secondo l'inventario, il portale ha un'«imbotte modanata e bugnata su lesene ioniche» e un cartiglio decorativo.",
        ],
      },
    ],
    glossary: ["fronton", "beloop"],
    thenAndNow: [
      "Allora: Smekens vide il portale qualche anno dopo i danni della bomba V del 1944 e prima della trasformazione del 1956–1957.",
      "Oggi: a quale numero civico appartiene oggi il portale del disegno, il 30 o il 32? [Da verificare sul posto]",
    ],
    didYouKnow: [
      "Nel 1944–1945 Anversa fu duramente colpita dalle bombe V. Questa casa è uno dei tanti edifici danneggiati in quel periodo.",
    ],
    transitionToNext: "Attraversate la strada fino all'Accademia, al numero 31. Dietro la cancellata si trova un giardino con cinque portali che non si trovano più da nessun'altra parte.",
  },

  // ── Gates 37–41: Academy garden ──────────────────────────────────────
  "poortjes-academie": {
    name: "L'Accademia e il suo giardino",
    subtitle: "Cinque portali senza una casa",
    introduction: [
      "Siete all'Accademia Reale di Belle Arti (Koninklijke Academie voor Schone Kunsten), una delle più antiche scuole d'arte del Belgio. Dietro il padiglione d'ingresso si trova il giardino dell'Accademia, e al suo interno ci sono portali e parti di facciate di edifici scomparsi altrove in città.",
      "Smekens ne disegnò cinque. Qui sotto potete cercarli uno per uno.",
    ],
    searchTask: {
      title: "Trovate i cinque portali nel giardino",
      intro: "Ognuno di questi portali proviene da un altro punto di Anversa. Cercateli nel giardino e confrontateli con il disegno. Non è una gara: se non ne trovate uno, guardate semplicemente la soluzione.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 19,
          question: "La porta di «Het Klaverblad» (Il trifoglio). Da dove proviene?",
          hints: ["Guardate la chiave di volta: quale pianta vi riconoscete?", "Sulla chiave di volta c'è anche un anno."],
          solution: "Dall'antica Klaverstraat, oggi Haverstraat.",
          explanation: [
            "Secondo l'inventario si tratta di una «piccola porta a tutto sesto in pietra blu» proveniente da «het Klaverblad» nella Haverstraat, con l'anno 1663 sulla chiave di volta e un motivo a foglia di trifoglio. Coincidenza o no: il 1663 è anche l'anno di fondazione dell'Accademia.",
          ],
        },
        {
          plate: 21,
          question: "La porta con sopra un busto. Chi rappresenta?",
          hints: ["Il busto raffigura il fondatore dell'Accademia.", "Era un pittore, e suo padre portava lo stesso nome."],
          solution: "David Teniers il Giovane, in una porta proveniente dalla casa «De Gans» (L'oca) nella Zakstraat.",
          explanation: [
            "Smekens: «Nella nicchia un busto di David Teniers il Giovane, il pittore che fondò l'Accademia nel 1663. In origine questo busto non apparteneva a questa nicchia.» La porta e il busto furono dunque riuniti: un bell'esempio di come i pezzi antichi siano stati ricombinati nel giardino.",
          ],
        },
        {
          plate: 33,
          question: "La grande incorniciatura di portale con lettere in un medaglione. A quale attività apparteneva?",
          hints: ["Cercate tre lettere nel medaglione in alto.", "Lo stemma accanto appartiene al mestiere che ritroverete nella Adriaan Brouwerstraat."],
          solution: "Il birrificio Van Pruyssen, con le lettere C.V.P. e lo stemma della corporazione dei birrai.",
          explanation: [
            "Smekens ne indica la provenienza dalla Brouwersstraat, l'attuale Adriaan Brouwerstraat. L'inventario menziona nel giardino una porta di legno a tutto sesto proveniente dall'«Oosters Huis» (la Casa degli Anseatici), inserita nella cornice in pietra blu del birrificio Van Pruyssen, con le iniziali CVP ed emblemi dei birrai.",
          ],
        },
        {
          plate: 34,
          question: "Il grande portale con il montante centrale scolpito. Da quale casa proviene?",
          hints: ["Il montante centrale tra i battenti si chiama «makelaar».", "La casa aveva un nome religioso, e sulla porta c'è un'iscrizione."],
          solution: "Dalla casa «De Heilige Drievuldigheid» (La Santissima Trinità) sul Kipdorp.",
          explanation: [
            "Smekens: la casa «fece posto ai magazzini A la Vierge noire (Kipdorp)». L'inventario descrive nel giardino una porta di legno con l'iscrizione «In de Heyliche Dryvuldicheidt» del 1636.",
          ],
        },
        {
          plate: 37,
          question: "Il grande portale con la sopraluce in ferro. A quale convento apparteneva?",
          hints: ["Osservate bene il ferro battuto della sopraluce: vi sono lavorate due lettere."],
          solution: "Il convento demolito dei Cellebroeders (i Fratelli Alessiani): le lettere C.B.",
          explanation: [
            "Smekens: «Dal convento demolito dei Cellebroeders, con le lettere C. B. (Cellebroeders) lavorate nel ferro della sopraluce.»",
            "Non abbiamo ancora annotato sul posto dove si trovi esattamente ciascun portale nel giardino. [Da verificare sul posto]",
          ],
        },
      ],
    },
    sections: [
      {
        heading: "La più antica scuola d'arte del paese",
        kind: "history",
        paragraphs: [
          "L'Accademia fu fondata nel 1663 su iniziativa del pittore David Teniers, con il permesso del re Filippo IV. Ebbe inizialmente sede nella Borsa sulla Meir. Nel 1811 si trasferì nell'ex convento francescano, qui sulla Mutsaardstraat.",
          "I Francescani si erano stabiliti ad Anversa nel 1446. Il loro convento fu distrutto durante la furia iconoclasta del 1566 e ricostruito dopo il loro ritorno nel 1585. Nel 1797, sotto il dominio francese, dovettero andarsene.",
        ],
      },
      {
        heading: "Edifici e giardino",
        kind: "history",
        paragraphs: [
          "L'architetto comunale Pierre Bruno Bourla progettò i più antichi edifici dell'Accademia: tra gli altri una casa del direttore (1823–1824), sale espositive e, nel 1841, il padiglione d'ingresso con cancellata in ferro e un museo con una facciata a tempio classico. Dopo la guerra fu aggiunta un'ala con aule e atelier su progetto di Ferdinand Peeters (1953). Nel 1963 Renaat Braem dipinse un murale nel vano scala.",
          "Il giardino segue «una pianta simmetrica a partire dal padiglione d'ingresso» e fu ridisegnato nel 1905 su progetto dell'architetto Emiel Van Averbeke. Contiene le statue di David Teniers, Mathias Van Bree, Quinten Matsijs e san Luca, e frammenti della Borsa cinquecentesca.",
        ],
      },
      {
        heading: "Perché qui ci sono dei portali?",
        kind: "interpretation",
        paragraphs: [
          "L'inventario descrive i portali come «elementi di portale recuperati da edifici anversani scomparsi». Non siamo riusciti a scoprire chi esattamente decise di collocarli qui, né perché. Sembra ovvio che si volessero salvare pezzi pregiati di edifici demoliti, e che una scuola d'arte con un giardino recintato fosse per loro un luogo logico, anche come materiale didattico. Ma questa è un'interpretazione, non un fatto documentato.",
        ],
      },
      {
        heading: "Artisti dell'Accademia",
        kind: "history",
        paragraphs: [
          "Nel corso dei secoli qui studiarono artisti come Lawrence Alma-Tadema, Ford Madox Brown e Henry van de Velde. Il dipartimento di moda, fondato nel 1963, divenne famoso in tutto il mondo negli anni Ottanta grazie ai cosiddetti «Antwerp Six», tra cui Dries Van Noten, Ann Demeulemeester e Walter Van Beirendonck. Oggi l'Accademia fa parte della AP University of Applied Sciences and Arts.",
        ],
      },
    ],
    cards: [
      {
        id: "card-van-gogh",
        title: "Vincent van Gogh ad Anversa",
        subtitle: "Tre mesi, novembre 1885 – febbraio 1886",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Alla fine di novembre del 1885 Vincent van Gogh arrivò ad Anversa da Nuenen. Prese in affitto una stanzetta nella Lange Beeldekensstraat, nel quartiere operaio di Stuivenberg.",
              "Nel gennaio 1886 si iscrisse all'Accademia, soprattutto per imparare a dipingere dal modello vivo. Prese lezioni di disegno dai calchi in gesso di statue antiche con Frans Vinck e poi con Eugène Siberdt, e provò il corso di pittura di Charles Verlat.",
              "Non andò bene. Il suo stile spontaneo e vigoroso si scontrava con il rigido sistema accademico, e dopo un conflitto con Siberdt fu rimandato a un corso inferiore. La notizia gli arrivò solo dopo la partenza: il 28 febbraio 1886 era partito per Parigi, per raggiungere il fratello Theo.",
            ],
          },
          {
            heading: "Che cosa sappiamo, e che cosa no",
            kind: "context",
            paragraphs: [
              "Il suo soggiorno ad Anversa durò circa tre mesi, il periodo all'Accademia meno di due. Il museo KMSKA indica il 24 novembre 1885 come data d'arrivo; altre fonti parlano di qualche giorno dopo. Per questo diciamo «alla fine di novembre».",
            ],
          },
        ],
        didYouKnow: [
          "L'uomo che ad Anversa fu retrocesso a un corso inferiore è oggi lo studente più famoso che l'Accademia abbia mai avuto.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Accesso al giardino",
        paragraphs: [
          "Il giardino dell'Accademia fa parte del campus dell'Accademia e non è un parco pubblico. Non abbiamo trovato orari di apertura ufficiali. Se il cancello è aperto, entrate con discrezione; se è chiuso, potete vedere parte del giardino attraverso la cancellata. [Accesso da verificare con l'Accademia]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    glossary: ["makelaar", "waaier", "sluitsteen"],
    didYouKnow: [
      "Il giardino dell'Accademia è tutelato come paesaggio storico-culturale dal 1974.",
    ],
    transitionToNext: "Fine della terza parte. Camminate verso nord, in direzione della Falconplein: qui la città diventa una città portuale.",
  },
};
