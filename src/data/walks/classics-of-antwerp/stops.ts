import type { Source } from "@/types/content";
import type { LocationType } from "@/types/location";
import type { SearchZone } from "@/types/quest";
import type { VerificationStatus } from "@/types/reveal";

/** The images of one slide ("card") within a stop; its texts are in content/<language>.ts under the same id. */
export interface CardDefinition {
  id: string;
  /** Image ids from images.json: the first is shown at the top of the card, the others between its sections. */
  imageIds: string[];
}

/**
 * The technical side of a Spooky task (see LocationQuest); its texts (title, task, and
 * for "find the place" the hint and the stop's real name) are in content/<language>.ts.
 */
export type QuestDefinition =
  | {
      /** Find the place: a search zone on the way to the stop, found by GPS. */
      type: "location";
      /** Image id (images.json or local-images.json) of the clue, e.g. an old drawing of the façade. */
      clueImageId: string;
      /** Shown on the map instead of a pin; its centre is deliberately not the place itself. */
      searchZone: SearchZone;
      /** Within this distance of the stop's coordinates it counts as found. */
      arrivalRadiusMeters: number;
      /** The exact address, shown only once the stop is found (`address` above stays vague). */
      revealedAddress: string;
    }
  | {
      /** Find a detail at the stop, after arriving; the walker says when they found it. */
      type: "discovery";
      clueImageId: string;
    };

/**
 * Language-independent data per stop, in route order.
 * Positions come from coordinates.json; texts from content/<language>.ts.
 */
export interface StopDefinition {
  id: string;
  address: string;
  type: LocationType;
  /** Image ids from images.json; the first one is the hero image. */
  imageIds: string[];
  thenNow?: { then: string; now: string };
  /** Slides shown one at a time within the stop. */
  cards?: CardDefinition[];
  /** Optional deeper stories behind a "Discover more stories" button. */
  moreStories?: CardDefinition[];
  /** Historical image galleries after the story (same shape as a card: an id and its images); texts in content. */
  galleries?: CardDefinition[];
  /** A "find it yourself" task set by Spooky before the stop's story opens. */
  quest?: QuestDefinition;
  verification: VerificationStatus;
  /** The sources the stop's history was checked against. */
  sources: Source[];
}

const inventaris = (id: number, title: string): Source => ({
  title: `Inventaris Onroerend Erfgoed: ${title}`,
  language: "nl",
  url: `https://inventaris.onroerenderfgoed.be/erfgoedobjecten/${id}`,
});

export const stopDefinitions: StopDefinition[] = [
  {
    id: "classics-central-station",
    address: "Koningin Astridplein 27, 2018 Antwerpen",
    type: "landmark",
    imageIds: ["central-station-1906", "central-station-hall-1909", "central-station-today"],
    // Spooky's first task, on arrival: find the city's coat of arms in the station.
    quest: { type: "discovery", clueImageId: "central-station-hall-clue-today" },
    verification: "partially-verified",
    sources: [
      { title: "Historiek: Station Antwerpen-Centraal, de spoorwegkathedraal", language: "nl", url: "https://historiek.net/station-antwerpen-centraal-de-spoorwegkathedraal/151008/" },
      { title: "Wikipedia (NL): Station Antwerpen-Centraal", language: "nl", url: "https://nl.wikipedia.org/wiki/Centraal-Station_(Antwerpen)" },
    ],
  },
  {
    id: "classics-diamond-district",
    address: "Hoveniersstraat, 2018 Antwerpen",
    type: "street",
    imageIds: ["diamond-pelikaanstraat", "diamond-bourse-today"],
    // The images of the Jewish community story come from the walk author's research file, not from Commons (see local-images.json).
    moreStories: [{ id: "jewish-community", imageIds: ["flatow-expulsion-card-1941", "dossin-courtyard-1942"] }],
    verification: "partially-verified",
    sources: [
      { title: "Antwerp World Diamond Centre: history", url: "https://www.awdc.be/en/19th-century" },
      { title: "Wikipedia: Antwerp diamond heist", url: "https://en.wikipedia.org/wiki/Antwerp_diamond_heist" },
      inventaris(7445, "Beurs voor Diamanthandel"),
      { title: "Belgium WWII: Jodenvervolging in Antwerpen, een specifieke casus", language: "nl", url: "https://www.belgiumwwii.be/nl/belgie-in-oorlog/artikels/jodenvervolging-in-antwerpen-een-specifieke-casus.html" },
      { title: "Antwerpen Herdenkt: Jodenvervolging en Holocaust", language: "nl", url: "https://www.antwerpenherdenkt.be/oorlogsthemas/jodenvervolging-en-holocaust" },
    ],
  },
  {
    id: "classics-keyserlei-meir",
    address: "De Keyserlei, 2018 Antwerpen",
    type: "street",
    // The Rex photo follows the section about the V-2 strike (images after the hero go between the sections).
    imageIds: ["keyserlei-1903", "rex-ruins", "meir-1910"],
    verification: "partially-verified",
    sources: [
      { title: "Wikipedia: Cinema Rex bombing", url: "https://en.wikipedia.org/wiki/Cinema_Rex_bombing" },
      { title: "Antwerp Commemorates: Cinema Rex", url: "https://www.antwerpcommemorates.be/wandeling-v-bommen/cinema-rex-jim-mills" },
    ],
  },
  {
    id: "classics-stadsfeestzaal",
    address: "Meir 78, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["stadsfeestzaal-today"],
    verification: "partially-verified",
    sources: [
      inventaris(5544, "Stadsfeestzaal"),
      { title: "Stadsfeestzaal: history", url: "http://stadsfeestzaal.com/en/geschiedenis/" },
    ],
  },
  {
    // Spooky's quest: the walker finds this façade from an old drawing, with only a search zone on the map.
    id: "classics-paleis-op-de-meir",
    // Vague on purpose until it is found (no house number); the exact address is in quest.revealedAddress.
    address: "Meir, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["paleis-op-de-meir-today", "paleis-op-de-meir-drawing"],
    quest: {
      type: "location",
      clueImageId: "paleis-op-de-meir-drawing",
      // About 45 m east of the palace, along the Meir: the palace and its whole arrival
      // radius lie inside the circle, but the middle of the circle isn't the answer.
      searchZone: { center: { latitude: 51.217889, longitude: 4.409305 }, radiusMeters: 100 },
      arrivalRadiusMeters: 40,
      revealedAddress: "Meir 50, 2000 Antwerpen",
    },
    verification: "partially-verified",
    sources: [inventaris(5539, "Koninklijk Paleis (Paleis op de Meir)")],
  },
  {
    id: "classics-rubenshuis",
    address: "Wapper 9-11, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["rubens-self-portrait-1623", "rubenshuis-garden-today", "rubens-honeysuckle-bower"],
    verification: "partially-verified",
    sources: [
      { title: "Rubenshuis: de verbouwingen", language: "nl", url: "https://rubenshuis.be/nl/verbouwingen" },
      { title: "Rubenshuis: vraag en antwoord", language: "nl", url: "https://rubenshuis.be/nl/vraag-antwoord" },
      { title: "Rubenshuis: persbericht opening 30 augustus 2024", language: "nl", url: "https://pers.rubenshuis.be/rubenshuis-open-op-30-augustus" },
      { title: "Pinakothek: Rubens and Isabella Brant in the Honeysuckle Bower", url: "https://www.sammlung.pinakothek.de/en/artwork/o5xrMEr47X" },
    ],
  },
  {
    id: "classics-handelsbeurs",
    address: "Twaalfmaandenstraat, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["handelsbeurs-open-courtyard-1613", "handelsbeurs-1890", "handelsbeurs-lalanne"],
    // Two 19th-century prints, oldest first: before the first roof (1852–1854) and after the rebuilding of 1872.
    galleries: [{ id: "exchange-in-prints", imageIds: ["handelsbeurs-vandennest", "handelsbeurs-lebrun-liedel"] }],
    verification: "partially-verified",
    sources: [inventaris(6243, "Handelsbeurs")],
  },
  {
    id: "classics-boerentoren",
    address: "Schoenmarkt 35, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["boerentoren-1930s"],
    verification: "partially-verified",
    sources: [
      inventaris(3959, "Boerentoren"),
      { title: "VRT NWS: De geschiedenis van de Boerentoren", language: "nl", url: "https://www.vrt.be/vrtnws/nl/2020/11/19/de-boerentoren-de-eerste-belgische-wolkenkrabber/" },
    ],
  },
  {
    id: "classics-groenplaats",
    address: "Groenplaats, 2000 Antwerpen",
    type: "square",
    imageIds: ["groenplaats-1899", "groenkerkhof-1597", "groenplaats-rubens-statue-1840s"],
    verification: "partially-verified",
    sources: [inventaris(100833, "Groenplaats"), inventaris(83721, "Standbeeld Pieter Paul Rubens")],
  },
  {
    id: "classics-cathedral",
    address: "Groenplaats 21, 2000 Antwerpen",
    type: "church",
    imageIds: ["cathedral-hollar-1649"],
    cards: [
      { id: "cathedral", imageIds: ["cathedral-1908"] },
      { id: "quinten-matsijs", imageIds: ["matsijs-portrait-1572", "matsijs-altarpiece-1511", "matsijs-well"] },
      { id: "nello-patrasche", imageIds: ["nello-patrasche-today"] },
    ],
    verification: "partially-verified",
    sources: [
      inventaris(4092, "Onze-Lieve-Vrouwekathedraal"),
      inventaris(300378, "Nieuwerck"),
      { title: "Vlaamse Kunstcollectie: Quinten Massys", language: "nl", url: "https://vlaamseprimitieven.vlaamsekunstcollectie.be/nl/biografieen/quinten-massys/" },
      { title: "Karel van Mander, Het Schilder-boeck (1604): Quinten Matsys", language: "nl", url: "https://www.dbnl.org/tekst/mand001schi01_01/mand001schi01_01_0196.php" },
      { title: "KMSKA: Altaarstuk van het Schrijnwerkersambacht", language: "nl", url: "https://kmska.be/nl/meesterwerk/altaarstuk-van-het-schrijnwerkersambacht" },
      { title: "Ouida, A Dog of Flanders (Project Gutenberg)", url: "https://www.gutenberg.org/files/7766/7766-h/7766-h.htm" },
      { title: "Antwerps Persbureau: Standbeeld van Nello & Patrasche in de schijnwerpers (2022)", language: "nl", url: "https://antwerpspersbureau.be/standbeeld-van-nello-patrasche-staat-letterlijk-in-de-schijnwerpers/" },
    ],
  },
  {
    id: "classics-vlaeykensgang",
    address: "Oude Koornmarkt 16, 2000 Antwerpen",
    type: "alley",
    imageIds: ["vlaeykensgang-today"],
    verification: "partially-verified",
    sources: [inventaris(4446, "Vlaaikensgang")],
  },
  {
    id: "classics-grote-markt",
    address: "Grote Markt, 2000 Antwerpen",
    type: "square",
    imageIds: ["grote-markt-1905"],
    thenNow: { then: "grote-markt-1905", now: "grote-markt-today" },
    verification: "partially-verified",
    sources: [
      { title: "Inventaris Onroerend Erfgoed: Grote Markt (thema)", language: "nl", url: "https://inventaris.onroerenderfgoed.be/themas/925" },
      inventaris(4035, "Spaengien (De Oude Voetboog)"),
    ],
  },
  {
    id: "classics-brabo",
    address: "Grote Markt, 2000 Antwerpen",
    type: "landmark",
    imageIds: ["brabo-photochrom"],
    verification: "partially-verified",
    sources: [
      inventaris(200821, "Brabofontein"),
      { title: "Wikipedia: Druon Antigoon", url: "https://en.wikipedia.org/wiki/Druon_Antigoon" },
    ],
  },
  {
    id: "classics-stadhuis",
    address: "Grote Markt 1, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["stadhuis-1866"],
    // The Spanish Fury as three slides; each image sits next to the paragraph it illustrates.
    cards: [
      // The attack from the citadel: an overview print with the city map and the citadel.
      { id: "fury-attack", imageIds: ["spanish-fury-overview-1577"] },
      // The fight at the City Hall: Hogenberg's burning City Hall, then de Braekeleer's defenders.
      { id: "fury-city-hall", imageIds: ["stadhuis-spanish-fury-hogenberg", "spanish-fury-de-braekeleer"] },
      // The burning city (MAS painting), the plunder (Hogenberg), and how it was remembered (later print).
      { id: "fury-city", imageIds: ["spanish-fury-mas", "spanish-fury-hogenberg-plunder", "spanish-fury-print-1618"] },
    ],
    verification: "partially-verified",
    sources: [
      inventaris(4032, "Stadhuis van Antwerpen"),
      { title: "Historiek: Spaanse Furie in Antwerpen (1576)", language: "nl", url: "https://historiek.net/spaanse-furie-antwerpen-tachtigjarige-oorlog/66376/" },
      { title: "Wikipedia (NL): Spaanse Furie (Antwerpen)", language: "nl", url: "https://nl.wikipedia.org/wiki/Spaanse_Furie_(Antwerpen)" },
    ],
  },
  {
    id: "classics-conscienceplein",
    address: "Hendrik Conscienceplein, 2000 Antwerpen",
    type: "square",
    imageIds: ["conscienceplein-historical"],
    verification: "partially-verified",
    sources: [
      { title: "Erfgoedbibliotheek Hendrik Conscience: “Hij leerde zijn volk lezen”", language: "nl", url: "https://consciencebibliotheek.be/nl/pagina/%E2%80%9Chij-leerde-zijn-volk-lezen%E2%80%9D" },
    ],
  },
  {
    id: "classics-carolus-borromeus",
    address: "Hendrik Conscienceplein 12, 2000 Antwerpen",
    type: "church",
    imageIds: ["carolus-ceiling-punt-1748"],
    verification: "partially-verified",
    sources: [
      { title: "Wikipedia (NL): Sint-Carolus Borromeuskerk (Antwerpen)", language: "nl", url: "https://nl.wikipedia.org/wiki/Sint-Carolus_Borromeuskerk_(Antwerpen)" },
      { title: "OKV: Aguilon, Huyssens en Rubens", language: "nl", url: "https://www.okv.be/archief/aguillon-huyssens-en-rubens-sint-carolus-borromeuskerk" },
    ],
  },
  {
    id: "classics-vleeshuis",
    address: "Vleeshouwersstraat 38, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["vleeshuis-1901"],
    // Spooky's task on arrival: find the remains of the old burcht wall nearby.
    quest: { type: "discovery", clueImageId: "vleeshuis-wall-clue" },
    // Three old postcards of the museum rooms, in the same gallery as the Handelsbeurs prints.
    galleries: [
      {
        id: "vleeshuis-postcards",
        imageIds: ["vleeshuis-postcard-kitchen", "vleeshuis-postcard-panelled-room", "vleeshuis-postcard-hall"],
      },
    ],
    verification: "partially-verified",
    sources: [
      inventaris(4678, "Vleeshuis"),
      { title: "Museum Vleeshuis: monument and museum", url: "https://museumvleeshuis.be/en/page/vleeshuis-monument-and-museum" },
    ],
  },
  {
    id: "classics-sint-paulus",
    address: "Sint-Paulusstraat 22, 2000 Antwerpen",
    type: "church",
    imageIds: ["sint-paulus-1901"],
    verification: "partially-verified",
    sources: [inventaris(4648, "Sint-Pauluskerk en dominicanenklooster")],
  },
  {
    id: "classics-het-steen",
    address: "Steenplein 1, 2000 Antwerpen",
    type: "landmark",
    imageIds: ["steen-photochrom", "steen-1920", "execution-hogenberg-1568"],
    thenNow: { then: "steen-photochrom", now: "steen-today" },
    verification: "partially-verified",
    sources: [
      inventaris(4602, "Het Steen"),
      { title: "Bert Verwerft, De beul in het Markizaat van Antwerpen (UGent, 2007)", language: "nl", url: "https://dams1.antwerpen.be/asset/oORWqkDCRmktplXPHNduJ6uH/download-original" },
      { title: "EOS Wetenschap: De executie van meester Geleyn, de beul van Antwerpen", language: "nl", url: "https://www.eoswetenschap.eu/geschiedenis/de-executie-van-meester-geleyn-de-beul-van-antwerpen-kronieken-van-de-dood-23" },
    ],
  },
  {
    id: "classics-scheldt",
    address: "Steenplein, 2000 Antwerpen",
    type: "landmark",
    imageIds: ["scheldt-photochrom", "scheldt-quays-1900"],
    // The siege of 1584–1585 that ended with the fall of 1585 (told in the last section), in date order:
    // the bridge of boats (February 1585), the fire-ship attack on it (April), the Kouwenstein dike (May).
    galleries: [{ id: "siege-of-antwerp", imageIds: ["siege-parma-bridge", "siege-bridge-attack", "siege-map-luyken"] }],
    verification: "partially-verified",
    sources: [
      { title: "Wikipedia (NL): Sluiting van de Schelde", language: "nl", url: "https://nl.wikipedia.org/wiki/Sluiting_van_de_Schelde" },
      { title: "Sigmaplan: about the Sigma Plan", url: "https://www.sigmaplan.be/en/about-sigma-plan" },
      inventaris(4602, "Het Steen (quay works in the 1880s)"),
      { title: "Wikipedia (NL): Beleg van Antwerpen (1584-1585)", language: "nl", url: "https://nl.wikipedia.org/wiki/Beleg_van_Antwerpen_(1584-1585)" },
    ],
  },
];
