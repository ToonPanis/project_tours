import type { PoortjesContent } from "../types";
import { collectionIt } from "./collection";
import { deel1 } from "./deel-1";
import { deel2 } from "./deel-2";
import { deel3 } from "./deel-3";
import { deel4 } from "./deel-4";

/**
 * Poortjes van Antwerpen: Italian text, translated from the English master in ../en/.
 * Same structure as the master; street names, addresses and house names are never translated.
 */
export const poortjesContentIt: PoortjesContent = {
  walk: {
    title: "I portali di Anversa",
    tagline: "Sulle orme di Paul Smekens (1951)",
    shortDescription:
      "Una lunga passeggiata davanti a cinquanta antichi portali, disegnati nel 1951: dalla porta di un convento sul Rosier fino al MAS, passando per la Grote Markt, la cattedrale, la Handelsbeurs e l'Accademia.",
    description:
      "Nel 1951 Paul Smekens pubblicò un libro con 52 rilievi misurati di antichi portali e porte di Anversa: prospetto, pianta e scala grafica, precisi al centimetro. Questa passeggiata segue le sue orme, settant'anni dopo.\n\nA ogni portale confrontate il disegno con ciò che c'è oggi. Alcuni portali sono quasi immutati, altri sono stati spostati o sono scomparsi. Lungo il percorso passate davanti ai grandi monumenti della città: la Grote Markt, la cattedrale, la Handelsbeurs, la Sint-Jacobskerk e l'Accademia, dove studiò Vincent van Gogh. Due prove di ricerca vi permettono di andare voi stessi a caccia della porta giusta.\n\nI portali scomparsi fanno parte della collezione, ma il percorso non vi conduce lì. Così vedete ogni disegno senza camminare più del necessario.",
    highlights: [
      "50 portali storici, ciascuno con il rilievo originale del 1951",
      "Uno stato chiaro per ogni portale: ancora in piedi, scomparso, in ristrutturazione o facoltativo",
      "Tappe principali: Grote Markt, cattedrale, Handelsbeurs, Sint-Jacobskerk, Accademia e MAS",
      "Due prove di ricerca con indizi: nella Gildekamersstraat e nella Adriaan Brouwerstraat",
      "Vincent van Gogh ad Anversa: che cosa sappiamo con certezza",
      "Fatti, interpretazioni e leggende sempre ben distinti",
    ],
    howItWorksSteps: [
      "Raggiungete la tappa successiva con la mappa",
      "Confrontate il disegno del 1951 con ciò che vedete",
      "Leggete la storia e cercate i dettagli sul posto",
      "Decidete voi se fare una deviazione o visitare un museo",
    ],
    practicalInfo: [
      { label: "Distanza", value: "Circa 10 km, suddivisi in cinque parti; potete sempre fermarvi e riprendere più tardi" },
      { label: "Durata", value: "Una giornata intera: calcolate dalle 5 alle 6 ore e mezza, lettura e pausa comprese" },
      { label: "Musei", value: "Facoltativi; orari e prezzi sono indicati a ogni tappa, con la data della verifica" },
      { label: "Accessibilità", value: "Strade pianeggianti, in parte acciottolate; alcuni cortili e giardini non sono sempre aperti" },
    ],
    guideIntro: {
      quote:
        "Nel 1951 Paul Smekens disegnò 52 antichi portali di Anversa, precisi al centimetro. Settant'anni dopo andiamo a vedere che cosa ne resta.",
      categoryLabel: "Architettura e storia",
      footnote: "Dalla porta di un convento sul Rosier fino al tetto del MAS.",
    },
    copy: {
      startLabel: "Inizia la passeggiata",
      nextLocationTitle: "Prossima tappa",
      completionTitle: "Fine della passeggiata",
      completionMessage: "Oggi avete visto cinquanta portali. D'ora in poi, fate caso alle porte.",
      locationsTitle: "Il percorso",
      locationsDiscoveredLabel: "tappe visitate",
    },
    collection: {
      title: "La collezione: tutti i disegni",
      intro: "Tutti i 52 disegni del libro, con il loro stato attuale. I portali scomparsi sono elencati qui, ma il percorso non vi conduce lì.",
      sourceNote:
        "Disegni: Paul Smekens, «Oude poortjes in Antwerpen. 52 tekeningen» (Antichi portali ad Anversa. 52 disegni; Anversa: De Sikkel, 1951). Didascalie citate dal libro nell'originale neerlandese.",
    },
  },

  chapters: [
    {
      id: "zuidkant",
      title: "Lato sud e Hoogstraat",
      intro: "Cominciamo nelle vie tranquille a sud del centro: conventi, case di città di abbazie e case con un nome al posto del numero.",
      firstLocationId: "poortjes-rosier",
    },
    {
      id: "oude-stad",
      title: "Cattedrale e città vecchia",
      intro: "Ora il cuore della città: la Grote Markt, la cattedrale e le stradine alle sue spalle, con case delle corporazioni, una prova di ricerca e la prima borsa di Anversa.",
      firstLocationId: "poortjes-grote-markt",
    },
    {
      id: "universiteit-academie",
      title: "Handelsbeurs, università e Accademia",
      intro: "Dal commercio all'arte: la Handelsbeurs, la chiesa di Rubens, le case di borgomastri e pittori, e un giardino pieno di portali senza una casa.",
      firstLocationId: "poortjes-handelsbeurs",
    },
    {
      id: "oude-haven",
      title: "Falconplein e vecchio quartiere portuale",
      intro: "La città diventa una città portuale. Qui c'erano conventi, birrifici e acqua: la Città Nuova di Gilbert van Schoonbeke.",
      firstLocationId: "poortjes-falconplein",
    },
    {
      id: "mas",
      title: "MAS",
      intro: "L'ultimo tratto: dalle tracce più piccole in città alla grande storia del porto e del mondo.",
      firstLocationId: "poortjes-mas",
    },
  ],

  stops: { ...deel1, ...deel2, ...deel3, ...deel4 },

  glossary: {
    archivolt: { term: "Archivolto", definition: "La fascia (spesso decorata) che segue la curva di un arco." },
    barleef: { term: "Bassorilievo", definition: "Scultura che sporge solo leggermente dal fondo, come su una pietra murata in facciata." },
    beloop: { term: "Imbotte", definition: "Il bordo che segue l'apertura stessa della porta, spesso sagomato con modanature." },
    bovenlicht: { term: "Sopraluce", definition: "La finestra o l'apertura sopra una porta che lascia entrare la luce." },
    cartouche: { term: "Cartiglio", definition: "Uno scudo o una cornice decorata che contiene un'iscrizione, un anno o uno stemma." },
    chronogram: { term: "Cronogramma", definition: "Un'iscrizione in cui alcune lettere sono anche numeri romani (I, V, X, L, C, D, M). Sommandole si ottiene un anno." },
    diamantkop: { term: "Punta di diamante", definition: "Decorazione a forma di piccolo blocco sfaccettato a piramide." },
    diephuis: { term: "Casa profonda e casa larga", definition: "Una casa profonda (diephuis) si affaccia sulla strada con il lato corto, su un lotto profondo; una casa larga (breedhuis) con il lato lungo." },
    fronton: { term: "Frontone", definition: "Un coronamento triangolare o curvo sopra una porta o una finestra. In un frontone spezzato la sommità è lasciata aperta." },
    geblokt: { term: "Bugnato (a blocchi)", definition: "Una cornice di blocchi alternativamente sporgenti e rientranti, così che l'arco o il pilastro sembra «impilato»." },
    godshuis: { term: "Ospizio", definition: "Una fondazione caritativa con piccole abitazioni per anziani o poveri, spesso intorno a un cortile e con una propria cappella." },
    hardsteen: { term: "Pietra blu", definition: "Un calcare duro, grigio-azzurro, facile da scolpire: il materiale tipico delle cornici dei portali di Anversa." },
    ijkdienst: { term: "Ufficio pesi e misure", definition: "L'ufficio che controllava che i pesi e le misure dei commercianti fossero corretti." },
    imposten: { term: "Imposte", definition: "Le pietre sporgenti su cui poggia un arco, appena sopra i lati diritti del portale." },
    kapiteel: { term: "Capitello", definition: "La parte superiore di una colonna o di una lesena. Il capitello ionico si riconosce dalle due volute; il capitello composito unisce volute e foglie." },
    korfboog: { term: "Arco a manico di cesto", definition: "Un arco ribassato, più largo che alto, come il manico di un cesto." },
    "lodewijk-stijlen": { term: "Luigi XIV, Régence, Luigi XV, Luigi XVI", definition: "Nomi di stili che prendono il nome da re francesi. In breve: solenne e simmetrico (Luigi XIV), uno stile di transizione più leggero (Régence), giocoso e asimmetrico con forme di conchiglia (Luigi XV o rococò), e di nuovo rigoroso e classico (Luigi XVI)." },
    makelaar: { term: "Montante centrale (makelaar)", definition: "Qui: il montante centrale tra i due battenti di una porta, a volte riccamente scolpito." },
    mascaron: { term: "Mascherone", definition: "Un volto o una maschera scolpiti, spesso usati come chiave di volta." },
    neuten: { term: "Dadi di base", definition: "Basi a forma di blocco in fondo alle lesene o agli stipiti della porta." },
    pilaster: { term: "Lesena", definition: "Un pilastro piatto che sporge in parte dal muro, con base e capitello come una colonna." },
    refugiehuis: { term: "Casa di rifugio", definition: "La casa di città di un'abbazia situata fuori città: per gli affari in città, e come rifugio in tempi insicuri." },
    rocaille: { term: "Rocaille", definition: "Decorazione capricciosa e asimmetrica con forme di conchiglie e rocce: tipica dello stile Luigi XV." },
    rondboog: { term: "Arco a tutto sesto", definition: "Un arco a forma di semicerchio." },
    schouderboog: { term: "Arco a spalle", definition: "Un'apertura i cui angoli superiori rientrano a gradino come delle «spalle»." },
    sluitsteen: { term: "Chiave di volta", definition: "La pietra centrale e più alta di un arco. Tiene l'arco in posizione ed è spesso decorata." },
    spiegelboog: { term: "Arco a specchio", definition: "Un arco piatto con gli angoli arrotondati." },
    trapgevel: { term: "Frontone a gradoni", definition: "Un frontone appuntito che sale a gradini." },
    triglief: { term: "Triglifo", definition: "Un blocco con scanalature verticali, ripreso dal fregio dei templi greci classici." },
    voluut: { term: "Voluta", definition: "Un ricciolo a spirale." },
    waaier: { term: "Ventaglio (sopraluce)", definition: "La sopraluce semicircolare sopra una porta, con sbarre che si irradiano come un ventaglio, spesso in ferro battuto." },
    waterlijst: { term: "Gocciolatoio", definition: "Una modanatura sporgente sopra un portale o una finestra che allontana l'acqua piovana dalla facciata." },
  },

  images: {
    "grote-markt-1905": {
      caption: "La Grote Markt nel 1905, con la fontana di Brabo a sinistra e le case delle corporazioni alle sue spalle.",
      alt: "Vecchia cartolina colorata della piazza con la fontana e alte case delle corporazioni con frontoni a gradoni",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Case delle corporazioni sulla Grote Markt oggi, con figure dorate sulle facciate.",
      alt: "Foto recente di alte case delle corporazioni in pietra sormontate da statue dorate, contro un cielo azzurro",
      approximateYear: "2021",
    },
    "stadhuis-1866": {
      caption: "Il municipio in una delle prime fotografie, della metà degli anni Sessanta dell'Ottocento, in un album datato 1867.",
      alt: "Antica fotografia della lunga facciata rinascimentale del municipio",
      approximateYear: "1865–1867",
    },
    "brabo-photochrom": {
      caption: "Brabo getta lontano la mano del gigante: una stampa a colori degli anni Novanta dell'Ottocento.",
      alt: "Stampa storica a colori della statua in bronzo di Brabo su una fontana rocciosa davanti alle case delle corporazioni",
      approximateYear: "anni Novanta dell'Ottocento",
    },
    "cathedral-hollar-1649": {
      caption: "La cattedrale in un'acquaforte di Wenceslaus Hollar, 1649. La torre sud era già incompiuta all'epoca.",
      alt: "Acquaforte dettagliata della facciata della cattedrale con una guglia alta e una torre molto più bassa",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "La guglia della cattedrale sopra i tetti, intorno al 1908.",
      alt: "Vecchia cartolina dell'alta torre gotica della cattedrale sopra una piazza",
      approximateYear: "ca. 1908",
    },
    "handelsbeurs-1890": {
      caption: "La sala della borsa di Joseph Schadde intorno al 1890: un cortile gotico sotto un tetto di ferro e vetro.",
      alt: "Vecchia fotografia di un cortile gotico con gallerie sotto un grande tetto di ferro e vetro",
      approximateYear: "ca. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "La stessa sala in un disegno a penna di Maxime Lalanne, realizzato prima del 1886.",
      alt: "Disegno a penna della sala della borsa con mercanti nel cortile",
      approximateYear: "prima del 1886",
    },
  },

  collectionItems: collectionIt,

  drawings: {
    alt: "Rilievo misurato del portale in {address}: prospetto con quote, scala grafica e pianta",
    caption: "Tavola {plate}: {title}, {address}",
    rightsNote: "Diritti ancora da verificare",
    unknownArtist: "Sconosciuto",
    coverAlt: "Rilievo misurato di Paul Smekens (1951): il portale del birrificio De Gulde Sterre, Adriaan Brouwerstraat 5",
  },
};
