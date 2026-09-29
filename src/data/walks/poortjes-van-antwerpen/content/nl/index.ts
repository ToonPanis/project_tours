import type { PoortjesContent } from "../types";
import { collectionNl } from "./collection";
import { deel1 } from "./deel-1";
import { deel2 } from "./deel-2";
import { deel3 } from "./deel-3";
import { deel4 } from "./deel-4";

/**
 * Poortjes van Antwerpen: Nederlandse tekst.
 *
 * Regels (zie CLAUDE.md):
 * - Alleen feiten uit de bronnen per stop in stops.ts; het boek van Smekens
 *   wordt letterlijk geciteerd.
 * - Elke sectie zegt wat ze is: gedocumenteerd ("history"), interpretatie,
 *   achtergrond ("context") of legende.
 * - Wat nog onderzocht moet worden, staat zichtbaar tussen [ ].
 */
export const poortjesContentNl: PoortjesContent = {
  walk: {
    title: "Poortjes van Antwerpen",
    tagline: "In het spoor van Paul Smekens (1951)",
    shortDescription:
      "Een lange wandeling langs vijftig oude poorten, getekend in 1951: van een kloosterdeur aan de Rosier tot het MAS, met de Grote Markt, de kathedraal, de Handelsbeurs en de Academie onderweg.",
    description:
      "In 1951 publiceerde Paul Smekens een boek met 52 opmetingstekeningen van oude Antwerpse poortjes: vooraanzicht, grondplan en maatlat, tot op de centimeter. Deze wandeling volgt zijn spoor, zeventig jaar later.\n\nBij elke poort vergelijk je de tekening met wat er vandaag staat. Sommige poorten zijn nauwelijks veranderd, andere zijn verhuisd of verdwenen. Onderweg staan de grote plekken van de stad op het programma: de Grote Markt, de kathedraal, de Handelsbeurs, de Sint-Jacobskerk en de Academie, waar Vincent van Gogh studeerde. Twee zoekopdrachten laten je zelf speuren naar de juiste deur.\n\nVerdwenen poorten zitten in de collectie, maar de route loopt er niet naartoe. Zo zie je alle tekeningen zonder onnodig om te lopen.",
    highlights: [
      "50 historische poorten, elk met de originele opmetingstekening uit 1951",
      "Duidelijke status per poort: bestaat nog, verdwenen, in renovatie of optioneel",
      "Grote tussenstops: Grote Markt, kathedraal, Handelsbeurs, Sint-Jacobskerk, Academie en MAS",
      "Twee zoekopdrachten met hints: in de Gildekamersstraat en de Adriaan Brouwerstraat",
      "Vincent van Gogh in Antwerpen: wat we zeker weten",
      "Feit, interpretatie en legende altijd duidelijk gescheiden",
    ],
    howItWorksSteps: [
      "Wandel met de kaart naar de volgende stop",
      "Vergelijk de tekening uit 1951 met wat je ziet",
      "Lees het verhaal en zoek de details ter plaatse",
      "Kies zelf of je een omweg of museum meeneemt",
    ],
    practicalInfo: [
      { label: "Afstand", value: "Ongeveer 10 km, verdeeld over vijf delen; stoppen en later verdergaan kan altijd" },
      { label: "Duur", value: "Een volle dag: reken op 5 tot 6,5 uur met lezen en een pauze" },
      { label: "Musea", value: "Optioneel; openingsuren en prijzen staan bij de stop, met datum van controle" },
      { label: "Toegankelijkheid", value: "Vlakke straten, deels kasseien; enkele binnenplaatsen en tuinen zijn niet altijd open" },
    ],
    guideIntro: {
      quote:
        "In 1951 tekende Paul Smekens 52 oude Antwerpse poorten, tot op de centimeter. Zeventig jaar later gaan we kijken wat er nog van over is.",
      categoryLabel: "Architectuur & geschiedenis",
      footnote: "Van een kloosterdeur aan de Rosier tot het dak van het MAS.",
    },
    copy: {
      startLabel: "Start de wandeling",
      nextLocationTitle: "Volgende stop",
      completionTitle: "Einde van de wandeling",
      completionMessage: "Je hebt vandaag vijftig poorten gezien. Kijk voortaan eens naar de deuren.",
      locationsTitle: "De route",
      locationsDiscoveredLabel: "stops bezocht",
    },
    collection: {
      title: "De collectie: alle tekeningen",
      intro: "Alle 52 tekeningen uit het boek, met hun status vandaag. Verdwenen poorten staan hier wel, maar de route loopt er niet naartoe.",
      sourceNote:
        "Tekeningen: Paul Smekens, 'Oude poortjes in Antwerpen. 52 tekeningen' (Antwerpen: De Sikkel, 1951). Onderschriften letterlijk overgenomen uit het boek.",
    },
  },

  chapters: [
    {
      id: "zuidkant",
      title: "Zuidkant & Hoogstraat",
      intro: "We beginnen in de rustige straten ten zuiden van het centrum: kloosters, refugiehuizen en huizen met namen in plaats van nummers.",
      firstLocationId: "poortjes-rosier",
    },
    {
      id: "oude-stad",
      title: "Kathedraal & Oude Stad",
      intro: "Nu het hart van de stad: de Grote Markt, de kathedraal en de smalle straten erachter, met gildehuizen, een zoekopdracht en de eerste beurs van Antwerpen.",
      firstLocationId: "poortjes-grote-markt",
    },
    {
      id: "universiteit-academie",
      title: "Handelsbeurs, Universiteit & Academie",
      intro: "Van handel naar kunst: de Handelsbeurs, de kerk van Rubens, de huizen van burgemeesters en schilders, en een tuin vol poorten zonder huis.",
      firstLocationId: "poortjes-handelsbeurs",
    },
    {
      id: "oude-haven",
      title: "Falconplein & oude havenbuurt",
      intro: "De stad wordt havenstad. Hier waren kloosters, brouwerijen en water: de Nieuwstad van Gilbert van Schoonbeke.",
      firstLocationId: "poortjes-falconplein",
    },
    {
      id: "mas",
      title: "MAS",
      intro: "Het laatste stuk: van de kleinste sporen in de stad naar het grote verhaal van de haven en de wereld.",
      firstLocationId: "poortjes-mas",
    },
  ],

  stops: { ...deel1, ...deel2, ...deel3, ...deel4 },

  glossary: {
    archivolt: { term: "Archivolt", definition: "De (vaak versierde) rand die een boog volgt." },
    barleef: { term: "Barleef (bas-reliëf)", definition: "Beeldhouwwerk dat maar een beetje uit de achtergrond naar voren komt, zoals op een gevelsteen." },
    beloop: { term: "Beloop", definition: "De rand die de deuropening zelf volgt, vaak geprofileerd met lijstwerk." },
    bovenlicht: { term: "Bovenlicht", definition: "Het raam of de open ruimte boven een deur, om licht binnen te laten." },
    cartouche: { term: "Cartouche", definition: "Een versierd schild of kader met een opschrift, jaartal of wapen." },
    chronogram: { term: "Chronogram", definition: "Een opschrift waarin sommige letters ook Romeinse cijfers zijn (I, V, X, L, C, D, M). Tel je ze op, dan krijg je een jaartal." },
    diamantkop: { term: "Diamantkop", definition: "Een versiering in de vorm van een geslepen, piramidevormig blokje." },
    diephuis: { term: "Diephuis en breedhuis", definition: "Een diephuis staat met zijn smalle kant naar de straat, op een diep perceel; een breedhuis met zijn lange kant." },
    fronton: { term: "Fronton", definition: "Een driehoekige of gebogen bekroning boven een deur of venster. Bij een gebroken fronton is de top opengelaten." },
    geblokt: { term: "Geblokt", definition: "Een omlijsting uit blokken die afwisselend naar voren springen en terugliggen, zodat boog of pijler er 'gestapeld' uitziet." },
    godshuis: { term: "Godshuis", definition: "Een liefdadigheidsinstelling met kleine woningen voor ouderen of armen, vaak rond een binnenplaats en met een eigen kapel." },
    hardsteen: { term: "Blauwe hardsteen", definition: "Een harde, grijsblauwe kalksteen die zich goed laat beeldhouwen: het typische materiaal van Antwerpse poortomlijstingen." },
    ijkdienst: { term: "IJkdienst", definition: "De dienst die controleerde of de maten en gewichten van handelaars juist waren." },
    imposten: { term: "Imposten", definition: "De uitstekende stenen waarop een boog rust, net boven de rechte stijlen van de poort." },
    kapiteel: { term: "Kapiteel", definition: "De bekroning van een zuil of pilaster. Een Ionisch kapiteel herken je aan twee krullen; een composiet kapiteel combineert krullen met bladeren." },
    korfboog: { term: "Korfboog", definition: "Een afgeplatte boog, breder dan hoog, zoals het hengsel van een mand." },
    "lodewijk-stijlen": { term: "Lodewijk XIV, Régence, Lodewijk XV, Lodewijk XVI", definition: "Stijlnamen naar Franse koningen. Grofweg: plechtig en symmetrisch (Lodewijk XIV), een lichtere overgangsstijl (Régence), speels en asymmetrisch met schelpvormen (Lodewijk XV of rococo), en weer strak en klassiek (Lodewijk XVI)." },
    makelaar: { term: "Makelaar", definition: "Hier: de middenstijl tussen de twee vleugels van een deur, soms rijk gebeeldhouwd." },
    mascaron: { term: "Mascaron", definition: "Een gebeeldhouwd gezicht of masker, vaak als sluitsteen." },
    neuten: { term: "Neuten", definition: "Blokvormige sokkels onderaan pilasters of deurstijlen." },
    pilaster: { term: "Pilaster", definition: "Een platte pijler die deels uit de muur steekt, met een voet en een kapiteel zoals een zuil." },
    refugiehuis: { term: "Refugiehuis", definition: "Het stadshuis van een abdij van buiten de stad: voor zaken in de stad, en als toevlucht in onveilige tijden." },
    rocaille: { term: "Rocaille", definition: "Grillige, asymmetrische versiering met schelp- en rotsvormen: typisch voor de Lodewijk XV-stijl." },
    rondboog: { term: "Rondboog", definition: "Een boog in de vorm van een halve cirkel." },
    schouderboog: { term: "Schouderboog", definition: "Een opening waarvan de bovenhoeken als 'schouders' naar binnen springen." },
    sluitsteen: { term: "Sluitsteen", definition: "De middelste, bovenste steen van een boog. Hij houdt de boog op zijn plaats en is vaak versierd." },
    spiegelboog: { term: "Spiegelboog", definition: "Een vlakke boog met afgeronde hoeken." },
    trapgevel: { term: "Trapgevel", definition: "Een puntgevel die in trappen omhoog loopt." },
    triglief: { term: "Triglief", definition: "Een blok met verticale groeven, ontleend aan de fries van klassieke Griekse tempels." },
    voluut: { term: "Voluut", definition: "Een spiraalvormige krul." },
    waaier: { term: "Waaier", definition: "Het halfronde bovenlicht boven een deur, met spijlen die als een waaier uitlopen, vaak in smeedijzer." },
    waterlijst: { term: "Waterlijst", definition: "Een vooruitspringende lijst boven een poort of venster die regenwater van de gevel wegleidt." },
  },

  images: {
    "grote-markt-1905": {
      caption: "De Grote Markt in 1905, met links de Brabofontein en daarachter de gildehuizen.",
      alt: "Ingekleurde oude postkaart van het plein met de fontein en hoge gildehuizen met trapgevels",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Gildehuizen op de Grote Markt vandaag, met vergulde figuren op de gevels.",
      alt: "Recente foto van hoge stenen gildehuizen met gouden beelden bovenop, tegen een blauwe lucht",
      approximateYear: "2021",
    },
    "stadhuis-1866": {
      caption: "Het stadhuis op een vroege foto uit het midden van de jaren 1860, in een album gedateerd 1867.",
      alt: "Vroege foto van de lange renaissancegevel van het stadhuis",
      approximateYear: "1865–1867",
    },
    "brabo-photochrom": {
      caption: "Brabo gooit de hand van de reus weg: een kleurendruk uit de jaren 1890.",
      alt: "Ingekleurde historische prent van het bronzen Brabobeeld op een rotsachtige fontein voor gildehuizen",
      approximateYear: "jaren 1890",
    },
    "cathedral-hollar-1649": {
      caption: "De kathedraal op een ets van Wenceslaus Hollar, 1649. De zuidertoren was toen al onafgewerkt.",
      alt: "Gedetailleerde ets van de voorgevel van de kathedraal met één hoge spits en een veel lagere toren",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "De torenspits van de kathedraal boven de daken, rond 1908.",
      alt: "Oude postkaart van de hoge gotische toren van de kathedraal boven een plein",
      approximateYear: "ca. 1908",
    },
    "handelsbeurs-1890": {
      caption: "De beurszaal van Joseph Schadde rond 1890: een gotische binnenplaats onder een dak van ijzer en glas.",
      alt: "Oude foto van een gotische binnenplaats met galerijen onder een groot dak van ijzer en glas",
      approximateYear: "ca. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "Dezelfde zaal op een pentekening van Maxime Lalanne, gemaakt vóór 1886.",
      alt: "Pentekening van de beurszaal met kooplieden op de binnenplaats",
      approximateYear: "vóór 1886",
    },
  },

  collectionItems: collectionNl,

  drawings: {
    alt: "Opmetingstekening van de poort {address}: vooraanzicht met maatlijnen, maatlat en grondplan",
    caption: "Plaat {plate}: {title}, {address}",
    rightsNote: "Rechten nog te verifiëren",
    unknownArtist: "Onbekend",
    coverAlt: "Opmetingstekening van Paul Smekens (1951): de poort van brouwerij De Gulde Sterre, Adriaan Brouwerstraat 5",
  },
};
