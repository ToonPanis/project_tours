import type { Source } from "@/types/content";
import type { HeritageStatus } from "@/types/guide";
import type { LocationType } from "@/types/location";
import type { VerificationStatus } from "@/types/reveal";

/**
 * Language-independent data per PHYSICAL stop, in route order.
 * Only places the walker really goes to are listed here; vanished gates live
 * in collection.ts and are mentioned at the nearest stop.
 * Positions come from coordinates.json; texts from content/<language>.ts.
 */
export interface StopDefinition {
  id: string;
  address: string;
  type: LocationType;
  chapterId: string;
  /** Optional detour: the walker can choose to skip it. */
  isBonus?: boolean;
  /** Status badge of the stop itself (e.g. a building in renovation). */
  status?: HeritageStatus;
  /** Photos reused from Classics of Antwerp (public domain, see its images.json); the first is the hero. */
  classicsImageIds?: string[];
  thenNow?: { then: string; now: string };
  verification: VerificationStatus;
  sources: Source[];
}

const inventaris = (id: number, title: string): Source => ({
  title: `Inventaris Onroerend Erfgoed: ${title}`,
  language: "nl",
  url: `https://inventaris.onroerenderfgoed.be/erfgoedobjecten/${id}`,
});

/** The book with the drawings; every gate caption is quoted from it. */
export const smekensSource: Source = {
  title: "P. Smekens, Oude poortjes in Antwerpen. 52 tekeningen (Antwerpen: De Sikkel, 1951)",
  language: "nl",
  url: "https://bib.onroerenderfgoed.be/werken/9027",
};

export const stopDefinitions: StopDefinition[] = [
  // ── Deel 1: Zuidkant & Hoogstraat ─────────────────────────────────────
  {
    id: "poortjes-rosier", address: "Rosier 24, 2000 Antwerpen", type: "gateway", chapterId: "zuidkant",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(6066, "Karmelietessenklooster")],
  },
  {
    id: "poortjes-lange-gasthuisstraat", address: "Lange Gasthuisstraat 37, 2000 Antwerpen", type: "gateway", chapterId: "zuidkant",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(5333, "Refugium van de abdij van Tongerlo")],
  },
  {
    id: "poortjes-everdijstraat", address: "Everdijstraat 45 en 31, 2000 Antwerpen", type: "gateway", chapterId: "zuidkant",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4904, "Traditioneel burgerhuis met barokpoort (Everdijstraat 45)"), inventaris(4898, "Hagelsteen (Everdijstraat 31)")],
  },
  {
    id: "poortjes-groendalstraat", address: "Groendalstraat 18-20, 2000 Antwerpen", type: "gateway", chapterId: "zuidkant",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4978, "Sint-Christoffel")],
  },
  {
    id: "poortjes-kloosterstraat", address: "Kloosterstraat 13, 2000 Antwerpen", type: "gateway", chapterId: "zuidkant",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(5227, "Mercator-Orteliushuis")],
  },
  {
    id: "poortjes-hoogstraat", address: "Hoogstraat 15-21, 2000 Antwerpen", type: "gateway", chapterId: "zuidkant",
    verification: "partially-verified",
    sources: [
      smekensSource,
      inventaris(4141, "Wolsack, Gulden Osch en Schilt van Mechelen"),
      inventaris(4140, "Grooten gulden Schilt"),
      inventaris(4446, "Vlaaikensgang"),
      { title: "Inventaris Onroerend Erfgoed: Hoogstraat (thema)", language: "nl", url: "https://inventaris.onroerenderfgoed.be/themas/935" },
    ],
  },
  {
    id: "poortjes-suikerrui", address: "Suikerrui 22, 2000 Antwerpen", type: "gateway", chapterId: "zuidkant",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4631, "De Gouden Ram")],
  },
  // ── Deel 2: Kathedraal & Oude Stad ────────────────────────────────────
  {
    id: "poortjes-grote-markt", address: "Grote Markt, 2000 Antwerpen (café Rococo)", type: "square", chapterId: "oude-stad",
    classicsImageIds: ["grote-markt-1905", "stadhuis-1866", "brabo-photochrom"],
    thenNow: { then: "grote-markt-1905", now: "grote-markt-today" },
    verification: "partially-verified",
    sources: [
      { title: "Inventaris Onroerend Erfgoed: Grote Markt (thema)", language: "nl", url: "https://inventaris.onroerenderfgoed.be/themas/925" },
      inventaris(4035, "Spaengien (De Oude Voetboog)"),
      inventaris(4032, "Stadhuis van Antwerpen"),
      inventaris(200821, "Brabofontein"),
      { title: "Historiek: Spaanse Furie in Antwerpen (1576)", language: "nl", url: "https://historiek.net/spaanse-furie-antwerpen-tachtigjarige-oorlog/66376/" },
    ],
  },
  {
    id: "poortjes-kathedraal", address: "Handschoenmarkt, 2000 Antwerpen", type: "church", chapterId: "oude-stad",
    classicsImageIds: ["cathedral-hollar-1649", "cathedral-1908"],
    verification: "partially-verified",
    sources: [inventaris(4092, "Onze-Lieve-Vrouwekathedraal"), inventaris(300378, "Nieuwerck")],
  },
  {
    id: "poortjes-gildekamersstraat", address: "Gildekamersstraat 7-9, 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(3981, "De Swane (Gildekamersstraat 7)"), inventaris(3982, "Den Os (Gildekamersstraat 8)")],
  },
  {
    id: "poortjes-leonie-glassplein", address: "Leonie Glassplein, 2000 Antwerpen", type: "square", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [
      smekensSource,
      { title: "DIVA: Leonie Glassplein", url: "https://divamuseum.be/nl/leonie-glassplein" },
      { title: "AG Vespa: Iedereen welkom op het Leonie Glassplein (2020)", language: "nl", url: "https://www.agvespa.be/nieuws/iedereen-welkom-op-het-leonie-glassplein" },
    ],
  },
  {
    id: "poortjes-oude-beurs", address: "Oude Beurs 16, 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4413, "Den Spieghel"), inventaris(4127, "Oude Beurs")],
  },
  {
    id: "poortjes-melkmarkt", address: "Melkmarkt 37, 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4358, "Gulde Schoen")],
  },
  {
    id: "poortjes-wolstraat-7", address: "Wolstraat 7, 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4712, "De Tennen Pot")],
  },
  {
    id: "poortjes-wolstraat-30", address: "Wolstraat 30, 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4729, "Het Scilt van Londen")],
  },
  {
    id: "poortjes-jeruzalemstraat", address: "Jeruzalemstraat (hoek Oude Waag), 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4465, "Jeruzalem")],
  },
  {
    id: "poortjes-zwartzusters", address: "Zwartzustersstraat 25, 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    status: "in-renovation",
    verification: "partially-verified",
    sources: [
      smekensSource,
      inventaris(4763, "Zwartzusterklooster"),
      { title: "VRT NWS: Historisch Zwartzusterklooster wordt cohousingproject (29 oktober 2025)", language: "nl", url: "https://www.vrt.be/vrtnws/nl/2025/10/29/zwartzusterklooster-antwerpen-renovatie-woonproject-cohousing-in/" },
    ],
  },
  {
    id: "poortjes-korte-nieuwstraat", address: "Korte Nieuwstraat 22, 2000 Antwerpen", type: "gateway", chapterId: "oude-stad",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4274, "Sint-Annakapel")],
  },
  // ── Deel 3: Handelsbeurs, Universiteit & Academie ─────────────────────
  {
    id: "poortjes-handelsbeurs", address: "Borzestraat 31, 2000 Antwerpen", type: "historic-building", chapterId: "universiteit-academie",
    classicsImageIds: ["handelsbeurs-1890", "handelsbeurs-lalanne"],
    verification: "partially-verified",
    sources: [
      inventaris(6243, "Handelsbeurs"),
      inventaris(4127, "Oude Beurs"),
      { title: "Handelsbeurs Antwerpen: bezoek de Handelsbeurs (geraadpleegd 26-09-2026)", language: "nl", url: "https://handelsbeursantwerpen.be/en/bezoek-de-handelsbeurs/" },
    ],
  },
  {
    id: "poortjes-lange-nieuwstraat", address: "Lange Nieuwstraat 45, 2000 Antwerpen", type: "gateway", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(5365, "Bolonia la Grassa")],
  },
  {
    id: "poortjes-sint-jacob", address: "Sint-Jacobstraat 9, 2000 Antwerpen", type: "church", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [
      inventaris(6155, "Parochiekerk Sint-Jacob"),
      { title: "Stad Antwerpen (persbericht 13-05-2026): Sint-Jacobskerk opnieuw volledig toegankelijk na 7 jaar restauratie", language: "nl", url: "https://pers.antwerpen.be/sint-jacobskerk-opnieuw-volledig-toegankelijk-na-7-jaar-restauratie" },
    ],
  },
  {
    id: "poortjes-keizerstraat", address: "Keizerstraat 10-16, 2000 Antwerpen", type: "gateway", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [
      smekensSource,
      inventaris(5138, "De witte Lelie (Keizerstraat 16)"),
      inventaris(5134, "Rockoxhuis"),
      { title: "Snijders&Rockoxhuis: openingsuren en prijzen (geraadpleegd 26-09-2026)", language: "nl", url: "https://www.snijdersrockoxhuis.be/en/visit/plan-your-visit/opening-hours-prices" },
      { title: "Snijders&Rockoxhuis: website", url: "https://www.snijdersrockoxhuis.be/" },
    ],
  },
  {
    id: "poortjes-markgravestraat", address: "Markgravestraat 14, 2000 Antwerpen", type: "gateway", chapterId: "universiteit-academie",
    verification: "research-required",
    sources: [smekensSource, { title: "Inventaris Onroerend Erfgoed: Markgravestraat (thema)", language: "nl", url: "https://inventaris.onroerenderfgoed.be/themas/11204" }],
  },
  {
    id: "poortjes-koningstraat", address: "Koningstraat 17, 2000 Antwerpen", type: "gateway", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(5274, "De Drij Koningen")],
  },
  {
    id: "poortjes-universiteit", address: "Prinsstraat 13, 2000 Antwerpen", type: "historic-building", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [
      { title: "Universiteit Antwerpen: geschiedenis van de Stadscampus", language: "nl", url: "https://www.uantwerpen.be/nl/overuantwerpen/campussen/stadscampus/geschiedenis/" },
      inventaris(5764, "Hof van Liere"),
    ],
  },
  {
    id: "poortjes-rodestraat", address: "Rodestraat 43-44, 2000 Antwerpen", type: "gateway", chapterId: "universiteit-academie",
    isBonus: true, status: "optional",
    verification: "research-required",
    sources: [smekensSource],
  },
  {
    id: "poortjes-stadswaag", address: "Stadswaag 13, 2000 Antwerpen", type: "square", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(112999, "Stadswaag en omliggende straten")],
  },
  {
    id: "poortjes-mutsaardstraat", address: "Mutsaardstraat 30-32, 2000 Antwerpen", type: "gateway", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(5587, "Herenhuis in barokstijl (Mutsaardstraat 32)"), inventaris(5586, "De Draeck (Mutsaardstraat 30)")],
  },
  {
    id: "poortjes-academie", address: "Mutsaardstraat 31, 2000 Antwerpen", type: "historic-building", chapterId: "universiteit-academie",
    verification: "partially-verified",
    sources: [
      smekensSource,
      inventaris(5577, "Koninklijke Academie voor Schone Kunsten"),
      { title: "KMSKA: Vincent van Gogh in Antwerpen", language: "nl", url: "https://kmska.be/nl/vincent-van-gogh-in-antwerpen" },
      { title: "Wikipedia: Royal Academy of Fine Arts (Antwerp)", url: "https://en.wikipedia.org/wiki/Royal_Academy_of_Fine_Arts_(Antwerp)" },
    ],
  },
  // ── Deel 4: Falconplein & oude havenbuurt ─────────────────────────────
  {
    id: "poortjes-falconplein", address: "Falconplein 39, 2000 Antwerpen", type: "gateway", chapterId: "oude-haven",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(4913, "Falconpoort")],
  },
  {
    id: "poortjes-oudeleeuwenrui", address: "Oudeleeuwenrui 56-58, 2000 Antwerpen", type: "gateway", chapterId: "oude-haven",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(5666, "Stokerij Het Anker, met barokpoort brouwerij De Gulden Handt")],
  },
  {
    id: "poortjes-lange-noordstraat", address: "Lange Noordstraat 19-21, 2000 Antwerpen", type: "gateway", chapterId: "oude-haven",
    verification: "partially-verified",
    sources: [smekensSource, inventaris(5394, "De Clocke")],
  },
  {
    id: "poortjes-adriaan-brouwerstraat", address: "Adriaan Brouwerstraat 5-29, 2000 Antwerpen", type: "street", chapterId: "oude-haven",
    verification: "partially-verified",
    sources: [
      smekensSource,
      inventaris(4780, "Burgerhuis met barokpoort (nr. 5)"),
      inventaris(4782, "Samenstel van traditionele panden met barokpoort (nr. 17)"),
      inventaris(4786, "Brouwershuis (nr. 20)"),
      inventaris(4783, "De Roose (nr. 29)"),
      { title: "Inventaris Onroerend Erfgoed: Adriaan Brouwerstraat (thema)", language: "nl", url: "https://inventaris.onroerenderfgoed.be/themas/11106" },
    ],
  },
  // ── Deel 5: MAS ───────────────────────────────────────────────────────
  {
    id: "poortjes-mas", address: "Hanzestedenplaats 1, 2000 Antwerpen", type: "landmark", chapterId: "mas",
    verification: "partially-verified",
    sources: [
      { title: "MAS: openingsuren en bereikbaarheid (geraadpleegd 26-09-2026)", language: "nl", url: "https://mas.be/en/page/how-when-get-here" },
      { title: "MAS: wandelboulevard en panorama", language: "nl", url: "https://mas.be/en/page/boulevard-and-panorama" },
      { title: "Wikipedia (NL): Museum aan de Stroom", language: "nl", url: "https://nl.wikipedia.org/wiki/Museum_aan_de_Stroom" },
      { title: "Wikipedia (NL): Eilandje (Antwerpen)", language: "nl", url: "https://nl.wikipedia.org/wiki/Eilandje_(Antwerpen)" },
    ],
  },
  {
    id: "poortjes-red-star-line", address: "Montevideostraat 3, 2000 Antwerpen", type: "landmark", chapterId: "mas",
    isBonus: true, status: "optional",
    verification: "partially-verified",
    sources: [
      { title: "Red Star Line Museum: het museum", language: "nl", url: "https://redstarline.be/en/content/museum" },
      { title: "Visit Antwerpen: Red Star Line Museum", url: "https://visit.antwerpen.be/en/info/red-star-line-museum-en" },
    ],
  },
];
