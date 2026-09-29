import type { HeritageStatus } from "@/types/guide";
import type { VerificationStatus } from "@/types/reveal";

/**
 * All 52 drawings from Paul Smekens, "Oude poortjes in Antwerpen" (Antwerpen:
 * De Sikkel, 1951), linked to the walk.
 *
 * - `number`: our route numbering 1–50 (gate "17 / 50"). Plates 3 and 51 are
 *   not part of that list and have no number.
 * - `plate`:  the plate number in the book = the image file gate-NN.jpg.
 * - `caption`: literal transcription of the printed caption, checked against
 *   the photos of every page (2026-09-26). "[…]" marks text that is not
 *   legible in our photo.
 * - `status`: what is left today, as far as we know. "vanished" gates are
 *   never a waypoint: they are mentioned at the nearest stop (`stopId`).
 */
export interface CollectionEntry {
  number?: number;
  plate: number;
  address: string;
  status: HeritageStatus;
  chapterId: string | null;
  /** Stop where the gate is shown (or, when vanished, mentioned). */
  stopId: string | null;
  caption: string;
  verification: VerificationStatus;
}

export const collectionEntries: CollectionEntry[] = [
  // ── Deel 1: Zuidkant & Hoogstraat ─────────────────────────────────────
  {
    number: 1, plate: 48, address: "Rosier 24", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-rosier",
    caption: "48. Poortje. Rosier 24. Aan het klooster der Spaanse Theresianen. In de nis een beeld van de H. Jozef.",
    verification: "partially-verified",
  },
  {
    number: 2, plate: 17, address: "Lange Gasthuisstraat 37", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-lange-gasthuisstraat",
    caption: "17. Renaissancepoort met balkon. Lange Gasthuisstraat 37. Hoorde toe aan een Refugehuis van de abdij van Tongerlo. De cartouche met het gebeeldhouwd vrouwenhoofd in Louis XV-stijl komt ons apocrief voor in deze Renaissancepoort.",
    verification: "partially-verified",
  },
  {
    number: 3, plate: 23, address: "Everdijstraat 45", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-everdijstraat",
    caption: "23. Renaissancepoort. Everdijstraat 45.",
    verification: "partially-verified",
  },
  {
    number: 4, plate: 2, address: "Everdijstraat 31", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-everdijstraat",
    caption: "2. Renaissancepoort met omlijsting. Everdijstraat 31. Het huis schijnt te dagtekenen van het einde der 16de eeuw. Heeft toebehoord aan Cornelius van Lantschot (De weldoener der armen) die het in 1621 kocht van de familie Van Eeden.",
    verification: "partially-verified",
  },
  {
    number: 5, plate: 28, address: "Groendalstraat 18-20", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-groendalstraat",
    caption: "28. Renaissancepoortje. Groendalstraat 18 en 20. Dagtekent van 1672. Hoorde toe aan het huis St Christoffel, eigendom van de deken der bakkers.",
    verification: "partially-verified",
  },
  {
    number: 6, plate: 35, address: "Kloosterstraat 13", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-kloosterstraat",
    caption: "35. Renaissancepoort. Kloosterstraat 13. Geeft toegang tot de binnenkoer van het herenhuis De Deckere, dagtekenend van 1698. Verkeerdelijk genaamd: het huis van Abraham Ortelius.",
    verification: "partially-verified",
  },
  {
    number: 7, plate: 16, address: "Hoogstraat 15B", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-hoogstraat",
    caption: "16. Renaissancepoort van het huis De Wolsack. Hoogstraat 15 B. Van dit huis werd reeds in 1461 melding gemaakt.",
    verification: "partially-verified",
  },
  {
    number: 8, plate: 4, address: "Hoogstraat 21", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-hoogstraat",
    caption: "4. Streng klassieke renaissancepoort met gefantazeerde trigliefen. Hoogstraat 21. Geeft toegang tot een van de zeer oude erven der Hoogstraat, De lintworm genaamd. Heeft eveneens een uitgang langs de Vlaaikensgang der Koornmarkt.",
    verification: "research-required",
  },
  {
    plate: 3, address: "Hoogstraat 15", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-hoogstraat",
    caption: "3. Grote poort in renaissance. Hoogstraat 15. Hoorde toe aan het huis genaamd De grooten gulden scilt (later De scilt van Mechelen). Het huis werd in 1561 aangekocht door Jan Anthonis. Staat in verbinding met de Vlaaikensgang van de Koornmarkt.",
    verification: "partially-verified",
  },
  {
    number: 9, plate: 40, address: "Suikerrui 22", status: "exists",
    chapterId: "zuidkant", stopId: "poortjes-suikerrui",
    caption: "40. Renaissancepoort. Suikerrui 22. Met ram op cartouche en rozen op de pilasters en de bogen.",
    verification: "partially-verified",
  },
  // ── Deel 2: Kathedraal & Oude Stad ────────────────────────────────────
  {
    number: 10, plate: 18, address: "Jeruzalemstraat, naast nr. 14", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-jeruzalemstraat",
    caption: "18. Poortje uit de 17de eeuw. Jeruzalemstraat, naast nr 14. Hoorde toe aan het huis Jeruzalem als herinnering aan de eerste reizen van Antwerpen naar het Heilig Land.",
    verification: "partially-verified",
  },
  {
    number: 11, plate: 10, address: "Gildekamersstraat 7", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-gildekamersstraat",
    caption: "10. Poortje. Gildekamerstraat 7. Dagtekenend van 1631 en toebehorend aan het huis De swane waarin op 't einde der 16de eeuw het Passementiersgilde gehuisvest was.",
    verification: "partially-verified",
  },
  {
    number: 12, plate: 8, address: "Gildekamersstraat 9", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-gildekamersstraat",
    caption: "8. Poortje uit de 17de eeuw (1612). Gildekamerstraat 9. Hoorde bij het huis genaamd Den rooden osch of Den osch. Het werd in die tijd reeds aangekocht door de Stad.",
    verification: "partially-verified",
  },
  {
    number: 13, plate: 50, address: "Zilversmidstraat 5", status: "vanished",
    chapterId: "oude-stad", stopId: "poortjes-leonie-glassplein",
    caption: "50. Poortje in Louis XV-stijl. Zilversmidstraat 5. […] van het huis achtereenvolgens genaamd Het vosken, De cleynen anker en De fonteyn.",
    verification: "research-required",
  },
  {
    number: 14, plate: 1, address: "Zilversmidstraat 17", status: "vanished",
    chapterId: "oude-stad", stopId: "poortjes-leonie-glassplein",
    caption: "1. Renaissancepoortje. Zilversmidstraat 17. Stond oorspronkelijk tegen de gevel der brouwerij De trouw, een van de brouwerijen in de 16de eeuw door Gilbert van Schoonbeke in de Brouwersstraat opgericht. Het werd bij de afbraak van het gebouw omstreeks 1880 naar de Zilversmidstraat overgebracht.",
    verification: "research-required",
  },
  {
    number: 15, plate: 36, address: "Melkmarkt 37", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-melkmarkt",
    caption: "36. Renaissancepoort. Melkmarkt 37. Hoorde toe aan het huis De gulden schoen.",
    verification: "partially-verified",
  },
  {
    number: 16, plate: 14, address: "Wolstraat 7", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-wolstraat-7",
    caption: "14. Renaissancepoort van het huis De Tennen Pot. Wolstraat 7.",
    verification: "partially-verified",
  },
  {
    number: 17, plate: 9, address: "Wolstraat 30", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-wolstraat-30",
    caption: "9. Poort van het huis Het Scilt van Londen. Wolstraat 30. Dagtekent van 1625. De deur met half verheven beeldhouwwerk wordt aan François Duquesnoy (1594-1642) toegeschreven.",
    verification: "partially-verified",
  },
  {
    number: 18, plate: 12, address: "Grote Goddaard 22", status: "vanished",
    chapterId: "oude-stad", stopId: "poortjes-jeruzalemstraat",
    caption: "12. Renaissancepoortje. Grote Goddaert 22. Toebehorend aan het huis De witte engel.",
    verification: "research-required",
  },
  {
    number: 19, plate: 22, address: "Zwartzustersstraat 25", status: "in-renovation",
    chapterId: "oude-stad", stopId: "poortjes-zwartzusters",
    caption: "22. Poort in Louis XIV. Zwartzustersstraat 25. Ingang van het klooster der Zwartzusters, gesticht in 1345 door de Duitse koopman H. Südermann.",
    verification: "partially-verified",
  },
  {
    number: 20, plate: 32, address: "Oude Beurs 16", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-oude-beurs",
    caption: "32. Pand De Spiegel genaamd. Oude Beurs 16. Hoorde oorspronkelijk toe aan Steven Butken uit Keulen. Een der opvolgende eigenaars van De spiegel, Alex van den Broeck (17de eeuw), heeft het eigendom tot een soort van paleis willen verbouwen. Beeldhouwwerk: een neergezeten vrouw die in een spiegel kijkt terwijl haar kind zich in moeder spiegelt.",
    verification: "partially-verified",
  },
  {
    number: 21, plate: 49, address: "Oude Beurs 27", status: "vanished",
    chapterId: "oude-stad", stopId: "poortjes-oude-beurs",
    caption: "49. Monumentale inrijpoort in laat-renaissance. Oude Beurs 27. […] waar in de 17de eeuw de Antwerpse burgemeester Jan Goubeau woonde. Is thans eigendom van de Paters van Scheut. Eertijds heette dit pand De oude Beurs en bestond uit drie eigendommen: De wolsack, Den scilt van Frankrijck en De granaatappel.",
    verification: "research-required",
  },
  {
    number: 22, plate: 26, address: "Engelse Beurs 7", status: "vanished",
    chapterId: "oude-stad", stopId: "poortjes-jeruzalemstraat",
    caption: "26. Poortje dagtekenend van 1669. Engelse Beurs 7. Hoorde toe aan een kleine, eenvoudige Beurs die de Stad in 1550 liet oprichten ten behoeve van de Engelse kooplieden.",
    verification: "research-required",
  },
  {
    number: 23, plate: 15, address: "Korte Nieuwstraat 22", status: "exists",
    chapterId: "oude-stad", stopId: "poortjes-korte-nieuwstraat",
    caption: "15. Rijk gebeeldhouwde poort met engelenfiguren. Korte Nieuwstraat 22. […] van de Ste-Annakapel. In de nis bevonden zich (nog in 't begin der 20ste eeuw), de figuren van [de H. Maagd en] van Ste Anna.",
    verification: "partially-verified",
  },
  // ── Deel 3: Handelsbeurs, Universiteit & Academie ─────────────────────
  {
    number: 24, plate: 45, address: "Lange Nieuwstraat 36", status: "vanished",
    chapterId: "universiteit-academie", stopId: "poortjes-lange-nieuwstraat",
    caption: "45. Poort in Régence. Lange Nieuwstraat 36. Van het groot herenhuis De Keyser, destijds (in 1530) eigendom van de heer Lanceloot de Robiano.",
    verification: "research-required",
  },
  {
    number: 25, plate: 25, address: "Lange Nieuwstraat 45", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-lange-nieuwstraat",
    caption: "25. Renaissancepoortje van het huis Bolonia la Grassa. Lange Nieuwstraat 45. Herkomstig van een gesloopt gebouw uit de Twaalfmaandenstraat.",
    verification: "partially-verified",
  },
  {
    number: 26, plate: 46, address: "Keizerstraat 16", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-keizerstraat",
    caption: "46. Poort in Louis XV-stijl. Keizerstraat 16. Hoorde toe aan het huis genaamd De zwarte arend.",
    verification: "partially-verified",
  },
  {
    number: 27, plate: 13, address: "Markgravestraat 14", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-markgravestraat",
    caption: "13. Renaissancepoort. Markgravestraat 14.",
    verification: "research-required",
  },
  {
    number: 28, plate: 47, address: "Koningstraat 14", status: "vanished",
    chapterId: "universiteit-academie", stopId: "poortjes-koningstraat",
    caption: "47. Achttiendeeuws poortje met waaier. Koningstraat 14. Hoorde toe aan het huis genaamd De witte koning.",
    verification: "research-required",
  },
  {
    number: 29, plate: 42, address: "Koningstraat 17", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-koningstraat",
    caption: "42. Louis XIV-poortje. Koningstraat 17. Dagtekenend van 1716. Hoorde toe aan het huis De Drie Koningen (reeds vermeld in 1549).",
    verification: "partially-verified",
  },
  {
    number: 30, plate: 43, address: "Raapstraat 27", status: "vanished",
    chapterId: "universiteit-academie", stopId: "poortjes-stadswaag",
    caption: "43. Poortje met waaierlijst. Raapstraat 27. Overgangstijl van Louis XIV naar Régence. In de schelp boven de deur ziet men een raap als motief.",
    verification: "research-required",
  },
  {
    number: 31, plate: 52, address: "Gratiekapelstraat 24", status: "vanished",
    chapterId: "universiteit-academie", stopId: "poortjes-koningstraat",
    caption: "52. Poortje einde Louis XVI-stijl. Gratiekapelstraat 24. Dit mooie poortje werd enkele jaren geleden zonder meer door vandalenhanden gesloopt.",
    verification: "partially-verified",
  },
  {
    number: 32, plate: 31, address: "Paternosterstraat 13", status: "vanished",
    chapterId: "universiteit-academie", stopId: "poortjes-keizerstraat",
    caption: "31. Poortje in Vlaamse renaissance. Paternosterstraat 13. Hoorde bij het huis genaamd De gulden dolfeyn, later De Salvator. Wordt reeds vermeld in 1497.",
    verification: "research-required",
  },
  {
    number: 33, plate: 30, address: "Rodestraat 43", status: "optional",
    chapterId: "universiteit-academie", stopId: "poortjes-rodestraat",
    caption: "30. Renaissancepoortje aan de pastorie van het Begijnhof. Rodestraat 43.",
    verification: "research-required",
  },
  {
    number: 34, plate: 44, address: "Rodestraat 44", status: "optional",
    chapterId: "universiteit-academie", stopId: "poortjes-rodestraat",
    caption: "44. Inrijpoort. Rodestraat 44. Opgericht omstreeks 1725 in zuivere Louis XV-stijl.",
    verification: "research-required",
  },
  {
    number: 35, plate: 41, address: "Stadswaag 13", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-stadswaag",
    caption: "41. Laat-renaissancepoortje met waaier. Stadswaag 13.",
    verification: "research-required",
  },
  {
    number: 36, plate: 27, address: "Mutsaardstraat 30", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-mutsaardstraat",
    caption: "27. Monumentale poort uit de XVIIde eeuw. Mutsaertstraat 30. Behoorde aan het huis Schockaert, stadsraadsheer en kanselier van Brabant.",
    verification: "partially-verified",
  },
  {
    number: 37, plate: 19, address: "Academietuin (uit de Haverstraat)", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-academie",
    caption: "19. Poortje van het huis Het Klaverblad. Academie (tuin). Uit de vroegere Klaverstraat (nu Haverstraat).",
    verification: "partially-verified",
  },
  {
    number: 38, plate: 21, address: "Academietuin (uit de Zakstraat, huis De Gans)", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-academie",
    caption: "21. Renaissancepoortje. Academie (tuin). […] van het huis De gans in de Zakstraat. In de nis een borstbeeld van David Teniers de Jonge, de schilder die in 1663 de Academie stichtte. Oorspronkelijk hoorde dit beeld niet in deze nis.",
    verification: "partially-verified",
  },
  {
    number: 39, plate: 33, address: "Academietuin (uit de Brouwersstraat)", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-academie",
    caption: "33. Grote poortomlijsting. Academie (tuin). Met de letters C.V.P. en het wapen der Brouwersgilde. Afkomstig van de brouwerij Van Pruyssen (Brouwersstraat).",
    verification: "partially-verified",
  },
  {
    number: 40, plate: 34, address: "Academietuin (uit de Kipdorp)", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-academie",
    caption: "34. Grote poort met makelaar. Academie (tuin). Afkomstig van het huis De Heilige Drievuldigheid, dat plaats heeft gemaakt voor de magazijnen A la Vierge noire (Kipdorp).",
    verification: "partially-verified",
  },
  {
    number: 41, plate: 37, address: "Academietuin (uit het Cellebroedersklooster)", status: "exists",
    chapterId: "universiteit-academie", stopId: "poortjes-academie",
    caption: "37. Grote poort. Academie (tuin). Afkomstig van het afgebroken klooster der Cellebroeders, met de letters C. B. (Cellebroeders) dooreengewerkt in het ijzerwerk van de waaier.",
    verification: "partially-verified",
  },
  // ── Deel 4: Falconplein & oude havenbuurt ─────────────────────────────
  {
    number: 42, plate: 24, address: "Falconplein 39", status: "exists",
    chapterId: "oude-haven", stopId: "poortjes-falconplein",
    caption: "24. Renaissancepoort. Falconplein 39. Deze monumentale poort werd gebouwd in 1671 en is een der laatste overblijfselen van het in 1350 opgerichte en in 1810 gesloopte kloostercomplex der Falcontinen. Dit klooster werd door de rijke Italiaan Falco de Lampagne op zijn eigendom het Falconshof of Falconsbroeck gesticht. De nonnen werden er in 1784 op bevel van Jozef II uit verdreven en er werd een gasthuis in ondergebracht dat in 1793 door brand werd vernield. In 1810 werden kerk en wat er van het klooster-gasthuis nog overbleef gesloopt en werd in de plaats ervan de Falconkazerne gebouwd (thans eveneens gesloopt). Boven de poort prijkte een beeld van de H. Augustinus, beschermheilige van het klooster. In de cartouche: Verus Regularium Doctor (De ware leraar der Regulieren).",
    verification: "partially-verified",
  },
  {
    number: 43, plate: 11, address: "Falconrui 47", status: "vanished",
    chapterId: "oude-haven", stopId: "poortjes-falconplein",
    caption: "11. Poortje. Falconrui 47. Staat in de binnengang van het Godshuis Lantschot. Cornelius van Lantschot, vermogend koopman, werd genoemd De weldoener der armen. Deze sobere, eenvoudige poort gaf toegang tot de kapel gewijd aan de H. Rosita.",
    verification: "research-required",
  },
  {
    number: 44, plate: 5, address: "Hessenplein (huisnummer niet vermeld)", status: "vanished",
    chapterId: "oude-haven", stopId: "poortjes-oudeleeuwenrui",
    caption: "5. Poort in renaissance. Hessenplein. Behoorde bij de brouwerij De bel, getuige de bolronde rinkelbel in de cartouche-sluitsteen.",
    verification: "research-required",
  },
  {
    number: 45, plate: 38, address: "Oudeleeuwenrui 58", status: "exists",
    chapterId: "oude-haven", stopId: "poortjes-oudeleeuwenrui",
    caption: "38. Poort. Oude Leeuwenrui 58. Dagtekenend van 1669, met afbeelding van een hand. Overblijfsel van de brouwerij De gulden handt.",
    verification: "partially-verified",
  },
  {
    number: 46, plate: 6, address: "Lange Noordstraat 19", status: "exists",
    chapterId: "oude-haven", stopId: "poortjes-lange-noordstraat",
    caption: "6. Renaissancepoort met barleef: een klok voorstellend. Lange Noordstraat 19. Reeds in akten van 1560 wordt De clocke genoemd. De officiële dienst voor het ijken van maten en gewichten was daar gevestigd. In de 2de helft der 19de eeuw was De klok een druk bezochte herberg en danszaal.",
    verification: "partially-verified",
  },
  {
    number: 47, plate: 7, address: "Adriaan Brouwerstraat 5", status: "exists",
    chapterId: "oude-haven", stopId: "poortjes-adriaan-brouwerstraat",
    caption: "7. Renaissancepoort. Adriaan Brouwerstraat 5. Op de zijstukken komt het stermotief voor. Hoorde bij de brouwerij De gulden sterre. Dit motief evokeert de gulden ster, zinnebeeld der brouwers, die in dit pand voorheen de scepter zwaaiden.",
    verification: "partially-verified",
  },
  {
    number: 48, plate: 29, address: "Adriaan Brouwerstraat 17", status: "exists",
    chapterId: "oude-haven", stopId: "poortjes-adriaan-brouwerstraat",
    caption: "29. Zeventiendeeuws poortje met waaieromlijsting. Adriaan Brouwerstraat 17. Zeer streng klassiek opzet, ditmaal zonder krullen of voluten.",
    verification: "partially-verified",
  },
  {
    number: 49, plate: 20, address: "Adriaan Brouwerstraat 20", status: "exists",
    chapterId: "oude-haven", stopId: "poortjes-adriaan-brouwerstraat",
    caption: "20. Poortje van het Waterhuis. Adriaan Brouwerstraat 20. Hoewel dit poortje versierd is met het zinnebeeldig kenteken der brouwers en al dagtekent het van 1655, toch behoorde het niet tot het eigenlijke Waterhuis. Het is afkomstig van een oude brouwerij, vermoedelijk uit de Brouwersstraat, maar bevond zich in het eigendom van de heer W. Pouillon te Kalmthout, tot het Stadsbestuur (in Collegezitting van 30 Maart 1922) besloot die poortomlijsting aan te kopen (voor 1000 fr.) en haar tegen de ingang van het Waterhuis te plaatsen.",
    verification: "partially-verified",
  },
  {
    number: 50, plate: 39, address: "Adriaan Brouwerstraat 29", status: "exists",
    chapterId: "oude-haven", stopId: "poortjes-adriaan-brouwerstraat",
    caption: "39. Poortje in Louis XIV-stijl. Adriaan Brouwerstraat 29. Met waaier en roosmotief en het opschrift In de roose. Behoorde bij de brouwerij De roode roos.",
    verification: "partially-verified",
  },
  // ── Buiten de route ───────────────────────────────────────────────────
  {
    plate: 51, address: "Deurne, pastorie", status: "unknown",
    chapterId: null, stopId: null,
    caption: "51. Poortje uit de 18de eeuw. Deurne, pastorie. Sober, eenvoudig en streng klassiek opgevat.",
    verification: "research-required",
  },
];
