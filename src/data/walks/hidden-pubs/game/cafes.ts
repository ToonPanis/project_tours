/**
 * The cafés' own names and addresses: the same in every language (names and
 * street names are never translated). Addresses from the old walk and
 * OpenStreetMap, all to be checked on site (HIDDEN_PUBS_DATA_AUDIT.md).
 * Positions: coordinates.json.
 */
export interface PubGameCafeInfo {
  name: string;
  /** Null until known (Café Barries: not in OpenStreetMap, owner to supply). */
  address: string | null;
}

export const pubGameCafes: Record<string, PubGameCafeInfo> = {
  "pubs-rococo": { name: "Rococo", address: "Grote Markt 32, 2000 Antwerpen" },
  "pubs-barok": { name: "Barok", address: "Melkmarkt 11, 2000 Antwerpen" },
  "pubs-quinten-matsijs": { name: "Quinten Matsijs", address: "Moriaanstraat 17, 2000 Antwerpen" },
  "pubs-de-kat": { name: "De Kat", address: "Wolstraat 22, 2000 Antwerpen" },
  "pubs-billies": { name: "Billie's Bier Kafétaria", address: "Kammenstraat 12, 2000 Antwerpen" },
  "pubs-barries": { name: "Café Barries", address: null },
  "pubs-paters-vaetje": { name: "Paters Vaetje", address: "Blauwmoezelstraat 1, 2000 Antwerpen" },
  "pubs-de-varkenspoot": { name: "De Varkenspoot", address: "Graanmarkt 3, 2000 Antwerpen" },
  "pubs-boer-van-tienen": { name: "In den Boer van Tienen", address: "Mechelseplein 6, 2000 Antwerpen" },
  "pubs-de-muze": { name: "De Muze", address: "Melkmarkt 15, 2000 Antwerpen" },
  "pubs-cabron": { name: "Cabron", address: "Kaasrui 1, 2000 Antwerpen" },
  "pubs-den-engel": { name: "Den Engel", address: "Grote Markt 3, 2000 Antwerpen" },
};

/** The café's name, or its id when unknown (never crashes a screen). */
export function cafeName(cafeId: string): string {
  return pubGameCafes[cafeId]?.name ?? cafeId;
}
