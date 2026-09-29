import type { PoortjesContent } from "../types";
import { collectionDe } from "./collection";
import { deel1 } from "./deel-1";
import { deel2 } from "./deel-2";
import { deel3 } from "./deel-3";
import { deel4 } from "./deel-4";

/**
 * Poortjes van Antwerpen: German text, translated from the English master
 * in ../en/. Keep the structure identical; street names and house names
 * are never translated.
 */
export const poortjesContentDe: PoortjesContent = {
  walk: {
    title: "Die Tore von Antwerpen",
    tagline: "Auf den Spuren von Paul Smekens (1951)",
    shortDescription:
      "Ein langer Rundgang vorbei an fünfzig alten Toren, gezeichnet 1951: von einer Klosterpforte am Rosier bis zum MAS, mit dem Grote Markt, der Kathedrale, der Handelsbeurs und der Akademie unterwegs.",
    description:
      "1951 veröffentlichte Paul Smekens ein Buch mit 52 Bauaufnahmen alter Antwerpener Tore und Portale: Ansicht, Grundriss und Maßstab, auf den Zentimeter genau. Dieser Rundgang folgt seinen Spuren, siebzig Jahre später.\n\nAn jedem Tor vergleichst du die Zeichnung mit dem, was heute dort steht. Manche Tore haben sich kaum verändert, andere wurden versetzt oder sind verschwunden. Unterwegs kommst du an den großen Sehenswürdigkeiten der Stadt vorbei: am Grote Markt, an der Kathedrale, an der Handelsbeurs, an der Sint-Jacobskerk und an der Akademie, an der Vincent van Gogh studierte. In zwei Suchaufgaben spürst du selbst die richtige Tür auf.\n\nVerschwundene Tore sind in der Sammlung enthalten, doch die Route führt nicht zu ihnen. So siehst du jede Zeichnung, ohne weiter zu laufen als nötig.",
    highlights: [
      "50 historische Tore, jedes mit der originalen Bauaufnahme von 1951",
      "Ein klarer Status für jedes Tor: erhalten, verschwunden, in Renovierung oder optional",
      "Große Stationen: Grote Markt, Kathedrale, Handelsbeurs, Sint-Jacobskerk, Akademie und MAS",
      "Zwei Suchaufgaben mit Tipps: in der Gildekamersstraat und der Adriaan Brouwerstraat",
      "Vincent van Gogh in Antwerpen: was wir sicher wissen",
      "Fakten, Deutung und Legende immer klar getrennt",
    ],
    howItWorksSteps: [
      "Geh mit der Karte zur nächsten Station",
      "Vergleiche die Zeichnung von 1951 mit dem, was du siehst",
      "Lies die Geschichte und such vor Ort nach den Details",
      "Entscheide selbst über Abstecher und Museumsbesuche",
    ],
    practicalInfo: [
      { label: "Strecke", value: "Rund 10 km in fünf Teilen; du kannst jederzeit unterbrechen und später weitermachen" },
      { label: "Dauer", value: "Ein ganzer Tag: Plane 5 bis 6,5 Stunden ein, inklusive Lesen und Pause" },
      { label: "Museen", value: "Optional; Öffnungszeiten und Preise stehen bei jeder Station, mit dem Datum der Prüfung" },
      { label: "Barrierefreiheit", value: "Ebene Straßen, teils Kopfsteinpflaster; manche Innenhöfe und Gärten sind nicht immer offen" },
    ],
    guideIntro: {
      quote:
        "1951 zeichnete Paul Smekens 52 alte Antwerpener Tore, auf den Zentimeter genau. Siebzig Jahre später schauen wir nach, was von ihnen übrig ist.",
      categoryLabel: "Architektur & Geschichte",
      footnote: "Von einer Klosterpforte am Rosier bis aufs Dach des MAS.",
    },
    copy: {
      startLabel: "Rundgang starten",
      nextLocationTitle: "Nächste Station",
      completionTitle: "Ende des Rundgangs",
      completionMessage: "Heute hast du fünfzig Tore gesehen. Ab jetzt achte auf die Türen.",
      locationsTitle: "Die Route",
      locationsDiscoveredLabel: "Stationen besucht",
    },
    collection: {
      title: "Die Sammlung: alle Zeichnungen",
      intro: "Alle 52 Zeichnungen aus dem Buch, mit ihrem heutigen Zustand. Verschwundene Tore stehen hier, doch die Route führt nicht zu ihnen.",
      sourceNote:
        "Zeichnungen: Paul Smekens, „Oude poortjes in Antwerpen. 52 tekeningen“ (Alte Tore in Antwerpen. 52 Zeichnungen; Antwerpen: De Sikkel, 1951). Bildunterschriften im niederländischen Original aus dem Buch zitiert.",
    },
  },

  chapters: [
    {
      id: "zuidkant",
      title: "Südseite & Hoogstraat",
      intro: "Wir beginnen in den ruhigen Straßen südlich des Zentrums: Klöster, Stadthäuser von Abteien und Häuser mit Namen statt Nummern.",
      firstLocationId: "poortjes-rosier",
    },
    {
      id: "oude-stad",
      title: "Kathedrale & Altstadt",
      intro: "Jetzt das Herz der Stadt: der Grote Markt, die Kathedrale und die engen Gassen dahinter, mit Zunfthäusern, einer Suchaufgabe und Antwerpens erster Börse.",
      firstLocationId: "poortjes-grote-markt",
    },
    {
      id: "universiteit-academie",
      title: "Handelsbeurs, Universität & Akademie",
      intro: "Vom Handel zur Kunst: die Handelsbeurs, die Kirche von Rubens, die Häuser von Bürgermeistern und Malern und ein Garten voller Tore ohne Haus.",
      firstLocationId: "poortjes-handelsbeurs",
    },
    {
      id: "oude-haven",
      title: "Falconplein & altes Hafenviertel",
      intro: "Die Stadt wird zur Hafenstadt. Hier gab es Klöster, Brauereien und Wasser: die Neustadt von Gilbert van Schoonbeke.",
      firstLocationId: "poortjes-falconplein",
    },
    {
      id: "mas",
      title: "MAS",
      intro: "Die letzte Etappe: von den kleinsten Spuren in der Stadt zur großen Geschichte des Hafens und der Welt.",
      firstLocationId: "poortjes-mas",
    },
  ],

  stops: { ...deel1, ...deel2, ...deel3, ...deel4 },

  glossary: {
    archivolt: { term: "Archivolte", definition: "Das (oft verzierte) Band, das der Rundung eines Bogens folgt." },
    barleef: { term: "Flachrelief", definition: "Bildhauerarbeit, die nur wenig aus ihrem Hintergrund hervortritt, wie auf einem Fassadenstein." },
    beloop: { term: "Laibung", definition: "Der Rand, der der Türöffnung selbst folgt, oft mit Profilen gestaltet." },
    bovenlicht: { term: "Oberlicht", definition: "Das Fenster oder die Öffnung über einer Tür, durch die Licht hereinfällt." },
    cartouche: { term: "Kartusche", definition: "Ein verzierter Schild oder Rahmen mit einer Inschrift, einer Jahreszahl oder einem Wappen." },
    chronogram: { term: "Chronogramm", definition: "Eine Inschrift, in der manche Buchstaben zugleich römische Zahlzeichen sind (I, V, X, L, C, D, M). Zählst du sie zusammen, erhältst du eine Jahreszahl." },
    diamantkop: { term: "Diamantquader", definition: "Ein Schmuckmotiv in Form eines kleinen, geschliffenen, pyramidenförmigen Blocks." },
    diephuis: { term: "Tiefhaus und Breithaus", definition: "Ein Tiefhaus (diephuis) wendet der Straße seine schmale Seite zu, auf einem tiefen Grundstück; ein Breithaus (breedhuis) seine lange Seite." },
    fronton: { term: "Giebelfeld (Fronton)", definition: "Eine dreieckige oder gebogene Bekrönung über einer Tür oder einem Fenster. Bei einem gesprengten Giebel bleibt die Spitze offen." },
    geblokt: { term: "Bossiert (gequadert)", definition: "Eine Rahmung aus Blöcken, die abwechselnd vor- und zurückspringen, sodass Bogen oder Pfeiler „gestapelt“ wirken." },
    godshuis: { term: "Armenhaus (Godshuis)", definition: "Eine wohltätige Stiftung mit kleinen Wohnungen für Alte oder Arme, oft um einen Innenhof und mit eigener Kapelle." },
    hardsteen: { term: "Blaustein", definition: "Ein harter, graublauer Kalkstein, der sich gut bearbeiten lässt: das typische Material Antwerpener Torrahmungen." },
    ijkdienst: { term: "Eichamt", definition: "Die Behörde, die prüfte, ob die Gewichte und Maße der Händler stimmten." },
    imposten: { term: "Kämpfer", definition: "Die vorspringenden Steine, auf denen ein Bogen ruht, direkt über den geraden Seiten des Tors." },
    kapiteel: { term: "Kapitell", definition: "Der obere Abschluss einer Säule oder eines Pilasters. Ein ionisches Kapitell erkennst du an seinen zwei Schnecken; ein Kompositkapitell verbindet Schnecken mit Blättern." },
    korfboog: { term: "Korbbogen", definition: "Ein abgeflachter Bogen, breiter als hoch, wie der Henkel eines Korbs." },
    "lodewijk-stijlen": { term: "Louis XIV, Régence, Louis XV, Louis XVI", definition: "Stilnamen nach französischen Königen. Grob gesagt: feierlich und symmetrisch (Louis XIV), ein leichterer Übergangsstil (Régence), verspielt und asymmetrisch mit Muschelformen (Louis XV oder Rokoko) und wieder streng und klassisch (Louis XVI)." },
    makelaar: { term: "Mittelpfosten (makelaar)", definition: "Hier: der mittlere senkrechte Pfosten zwischen den beiden Flügeln einer Tür, manchmal reich geschnitzt." },
    mascaron: { term: "Maskaron", definition: "Ein gemeißeltes Gesicht oder eine Maske, oft als Schlussstein." },
    neuten: { term: "Sockelsteine", definition: "Blockförmige Sockel am Fuß von Pilastern oder Türpfosten." },
    pilaster: { term: "Pilaster", definition: "Ein flacher Pfeiler, der teilweise aus der Wand hervortritt, mit Basis und Kapitell wie eine Säule." },
    refugiehuis: { term: "Refugium (Refugiehuis)", definition: "Das Stadthaus einer Abtei außerhalb der Stadt: für Geschäfte in der Stadt und als Zuflucht in unsicheren Zeiten." },
    rocaille: { term: "Rocaille", definition: "Launenhafte, asymmetrische Verzierung mit Muschel- und Felsformen: typisch für den Louis-XV-Stil." },
    rondboog: { term: "Rundbogen", definition: "Ein Bogen in Form eines Halbkreises." },
    schouderboog: { term: "Schulterbogen", definition: "Eine Öffnung, deren obere Ecken wie „Schultern“ nach innen vorspringen." },
    sluitsteen: { term: "Schlussstein", definition: "Der mittlere, oberste Stein eines Bogens. Er hält den Bogen zusammen und ist oft verziert." },
    spiegelboog: { term: "Spiegelbogen", definition: "Ein flacher Bogen mit abgerundeten Ecken." },
    trapgevel: { term: "Treppengiebel", definition: "Ein spitzer Giebel, der in Stufen ansteigt." },
    triglief: { term: "Triglyphe", definition: "Ein Block mit senkrechten Rillen, entlehnt aus dem Fries klassischer griechischer Tempel." },
    voluut: { term: "Volute", definition: "Eine spiralförmige Schnecke." },
    waaier: { term: "Fächer (Oberlicht)", definition: "Das halbrunde Oberlicht über einer Tür, mit Sprossen, die wie ein Fächer auseinanderlaufen, oft aus Schmiedeeisen." },
    waterlijst: { term: "Wasserschlag", definition: "Ein vorspringendes Gesims über einem Tor oder Fenster, das Regenwasser von der Fassade ableitet." },
  },

  images: {
    "grote-markt-1905": {
      caption: "Der Grote Markt im Jahr 1905, links der Brabobrunnen, dahinter die Zunfthäuser.",
      alt: "Kolorierte alte Postkarte des Platzes mit dem Brunnen und hohen Zunfthäusern mit Treppengiebeln",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Zunfthäuser am Grote Markt heute, mit vergoldeten Figuren an den Fassaden.",
      alt: "Aktuelles Foto hoher steinerner Zunfthäuser mit goldenen Statuen obenauf, vor blauem Himmel",
      approximateYear: "2021",
    },
    "stadhuis-1866": {
      caption: "Das Rathaus auf einem frühen Foto aus der Mitte der 1860er-Jahre, in einem auf 1867 datierten Album.",
      alt: "Frühes Foto der langen Renaissancefassade des Rathauses",
      approximateYear: "1865–1867",
    },
    "brabo-photochrom": {
      caption: "Brabo wirft die Hand des Riesen fort: ein Farbdruck aus den 1890er-Jahren.",
      alt: "Kolorierter historischer Druck der Bronzestatue des Brabo auf einem Felsenbrunnen vor Zunfthäusern",
      approximateYear: "1890er-Jahre",
    },
    "cathedral-hollar-1649": {
      caption: "Die Kathedrale auf einer Radierung von Wenceslaus Hollar, 1649. Der Südturm war schon damals unvollendet.",
      alt: "Detaillierte Radierung der Kathedralfassade mit einer hohen Turmspitze und einem viel niedrigeren Turm",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "Die Turmspitze der Kathedrale über den Dächern, um 1908.",
      alt: "Alte Postkarte des hohen gotischen Kathedralturms über einem Platz",
      approximateYear: "um 1908",
    },
    "handelsbeurs-1890": {
      caption: "Joseph Schaddes Börsensaal um 1890: ein gotischer Innenhof unter einem Dach aus Eisen und Glas.",
      alt: "Altes Foto eines gotischen Innenhofs mit Galerien unter einem großen Dach aus Eisen und Glas",
      approximateYear: "um 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "Derselbe Saal in einer Federzeichnung von Maxime Lalanne, entstanden vor 1886.",
      alt: "Federzeichnung des Börsensaals mit Kaufleuten im Innenhof",
      approximateYear: "vor 1886",
    },
  },

  collectionItems: collectionDe,

  drawings: {
    alt: "Bauaufnahme des Tors, {address}: Ansicht mit Maßlinien, Maßstab und Grundriss",
    caption: "Tafel {plate}: {title}, {address}",
    rightsNote: "Rechte noch zu prüfen",
    unknownArtist: "Unbekannt",
    coverAlt: "Bauaufnahme von Paul Smekens (1951): das Tor der Brauerei De Gulde Sterre, Adriaan Brouwerstraat 5",
  },
};
