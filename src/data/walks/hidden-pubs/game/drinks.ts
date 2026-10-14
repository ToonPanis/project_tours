/**
 * The drink choice per café, exactly as in HIDDEN_PUBS_CONCEPT.txt (brand
 * names: the same in every language). Spelling and availability still to
 * check against each café's menu (HIDDEN_PUBS_DATA_AUDIT.md, section 3).
 *
 * Every café ALSO offers "alcohol-free / soft drink" and "skip" (D8): the
 * screen adds those, so they can never be forgotten here. Nothing a player
 * chooses is sent to the server or counted.
 */
export type CafeDrinks =
  | { kind: "menu"; drinks: string[] }
  /** Billie's: every player spins a wheel (1–10) and orders that number at the bar (D9). */
  | { kind: "wheel"; numbers: number };

export const pubGameDrinks: Record<string, CafeDrinks> = {
  "pubs-rococo": { kind: "menu", drinks: ["IPA", "Flandrien", "Charle Quint"] },
  "pubs-barok": { kind: "menu", drinks: ["Super 8", "Super 8 Rouge", "Tongerloo Blond"] },
  "pubs-quinten-matsijs": { kind: "menu", drinks: ["Maredsous Bruin", "Stella Artois", "Triple Anvers"] },
  "pubs-de-kat": { kind: "menu", drinks: ["Rochefort 8", "Geuze Boon", "Stella Artois"] },
  "pubs-billies": { kind: "wheel", numbers: 10 },
  "pubs-barries": { kind: "menu", drinks: ["Kriek", "Seefbier", "Duvel"] },
  "pubs-paters-vaetje": { kind: "menu", drinks: ["Lucie", "Bootjes Bier", "Gulden Carolus Whisky Infused"] },
  "pubs-de-varkenspoot": { kind: "menu", drinks: ["Stella Artois", "Bolleke", "Triple Anvers"] },
  "pubs-boer-van-tienen": { kind: "menu", drinks: ["Triple Karmeliet", "Stella Artois", "La Chouffe"] },
  "pubs-de-muze": { kind: "menu", drinks: ["Chimay Blauw", "Westmalle Triple", "Lupulus Triple"] },
  "pubs-cabron": { kind: "menu", drinks: ["Bolleke", "Stella", "La Chouffe"] },
  "pubs-den-engel": { kind: "menu", drinks: ["Stella", "Triple Anvers", "Bolleke"] },
};
