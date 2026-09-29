import type { Source } from "@/types/content";
import type { LocationType } from "@/types/location";
import type { VerificationStatus } from "@/types/reveal";

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
  verification: VerificationStatus;
  /** The sources the stop's history was checked against. */
  sources: Source[];
}

const inventaris = (id: number, title: string): Source => ({
  title: `Inventaris Onroerend Erfgoed: ${title}`,
  url: `https://inventaris.onroerenderfgoed.be/erfgoedobjecten/${id}`,
});

export const stopDefinitions: StopDefinition[] = [
  {
    id: "classics-central-station",
    address: "Koningin Astridplein 27, 2018 Antwerpen",
    type: "landmark",
    imageIds: ["central-station-1906", "central-station-hall-1909", "central-station-today"],
    verification: "partially-verified",
    sources: [
      { title: "Historiek: Station Antwerpen-Centraal, de spoorwegkathedraal", url: "https://historiek.net/station-antwerpen-centraal-de-spoorwegkathedraal/151008/" },
      { title: "Wikipedia (NL): Station Antwerpen-Centraal", url: "https://nl.wikipedia.org/wiki/Centraal-Station_(Antwerpen)" },
    ],
  },
  {
    id: "classics-diamond-district",
    address: "Hoveniersstraat, 2018 Antwerpen",
    type: "street",
    imageIds: ["diamond-pelikaanstraat"],
    verification: "partially-verified",
    sources: [
      { title: "Antwerp World Diamond Centre: history", url: "https://www.awdc.be/en/19th-century" },
      { title: "Wikipedia: Antwerp diamond heist", url: "https://en.wikipedia.org/wiki/Antwerp_diamond_heist" },
    ],
  },
  {
    id: "classics-keyserlei-meir",
    address: "De Keyserlei, 2018 Antwerpen",
    type: "street",
    imageIds: ["keyserlei-1903", "meir-1910"],
    verification: "partially-verified",
    sources: [
      { title: "Wikipedia: Cinema Rex bombing", url: "https://en.wikipedia.org/wiki/Cinema_Rex_bombing" },
      { title: "Antwerp Commemorates: Cinema Rex", url: "https://www.antwerpcommemorates.be/wandeling-v-bommen/cinema-rex-jim-mills" },
      inventaris(5539, "Koninklijk Paleis (Paleis op de Meir)"),
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
    id: "classics-handelsbeurs",
    address: "Twaalfmaandenstraat, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["handelsbeurs-1890", "handelsbeurs-lalanne"],
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
      { title: "VRT NWS: De geschiedenis van de Boerentoren", url: "https://www.vrt.be/vrtnws/nl/2020/11/19/de-boerentoren-de-eerste-belgische-wolkenkrabber/" },
    ],
  },
  {
    id: "classics-groenplaats",
    address: "Groenplaats, 2000 Antwerpen",
    type: "square",
    imageIds: ["groenplaats-1899"],
    verification: "partially-verified",
    sources: [inventaris(100833, "Groenplaats"), inventaris(83721, "Standbeeld Pieter Paul Rubens")],
  },
  {
    id: "classics-cathedral",
    address: "Groenplaats 21, 2000 Antwerpen",
    type: "church",
    imageIds: ["cathedral-hollar-1649", "cathedral-1908"],
    verification: "partially-verified",
    sources: [inventaris(4092, "Onze-Lieve-Vrouwekathedraal"), inventaris(300378, "Nieuwerck")],
  },
  {
    id: "classics-vlaeykensgang",
    address: "Oude Koornmarkt 16, 2000 Antwerpen",
    type: "alley",
    imageIds: [],
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
      { title: "Inventaris Onroerend Erfgoed: Grote Markt (thema)", url: "https://inventaris.onroerenderfgoed.be/themas/925" },
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
    verification: "partially-verified",
    sources: [
      inventaris(4032, "Stadhuis van Antwerpen"),
      { title: "Historiek: Spaanse Furie in Antwerpen (1576)", url: "https://historiek.net/spaanse-furie-antwerpen-tachtigjarige-oorlog/66376/" },
    ],
  },
  {
    id: "classics-conscienceplein",
    address: "Hendrik Conscienceplein, 2000 Antwerpen",
    type: "square",
    imageIds: ["conscienceplein-historical"],
    verification: "partially-verified",
    sources: [
      { title: "Erfgoedbibliotheek Hendrik Conscience: “Hij leerde zijn volk lezen”", url: "https://consciencebibliotheek.be/nl/pagina/%E2%80%9Chij-leerde-zijn-volk-lezen%E2%80%9D" },
    ],
  },
  {
    id: "classics-carolus-borromeus",
    address: "Hendrik Conscienceplein 12, 2000 Antwerpen",
    type: "church",
    imageIds: ["carolus-ceiling-punt-1748"],
    verification: "partially-verified",
    sources: [
      { title: "Wikipedia (NL): Sint-Carolus Borromeuskerk (Antwerpen)", url: "https://nl.wikipedia.org/wiki/Sint-Carolus_Borromeuskerk_(Antwerpen)" },
      { title: "OKV: Aguilon, Huyssens en Rubens", url: "https://www.okv.be/archief/aguillon-huyssens-en-rubens-sint-carolus-borromeuskerk" },
    ],
  },
  {
    id: "classics-vleeshuis",
    address: "Vleeshouwersstraat 38, 2000 Antwerpen",
    type: "historic-building",
    imageIds: ["vleeshuis-1901"],
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
    imageIds: ["steen-photochrom", "steen-1920"],
    thenNow: { then: "steen-photochrom", now: "steen-today" },
    verification: "partially-verified",
    sources: [inventaris(4602, "Het Steen")],
  },
  {
    id: "classics-scheldt",
    address: "Steenplein, 2000 Antwerpen",
    type: "landmark",
    imageIds: ["scheldt-photochrom", "scheldt-quays-1900"],
    verification: "partially-verified",
    sources: [
      { title: "Wikipedia (NL): Sluiting van de Schelde", url: "https://nl.wikipedia.org/wiki/Sluiting_van_de_Schelde" },
      { title: "Sigmaplan: about the Sigma Plan", url: "https://www.sigmaplan.be/en/about-sigma-plan" },
      inventaris(4602, "Het Steen (quay works in the 1880s)"),
    ],
  },
];
