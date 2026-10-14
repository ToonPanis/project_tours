import type { AnswerKey } from "@/types/pub-game";

/**
 * SERVER ONLY: the correct option of every Hidden Pubs 2.0 question.
 *
 * Only files in src/features/pub-game/server/ may import this file (checked by
 * pub-game-server.test.ts), so the answers are never bundled for the browser.
 *
 * From HIDDEN_PUBS_CONCEPT.txt; the four answers the concept left open (D23)
 * were given by the owner on 2026-10-14.
 */
export const pubGameAnswerKey: AnswerKey = {
  "pubs-rococo-gates": "33",
  "pubs-barok-baroque": "ceiling",
  "pubs-quinten-matsijs-profession": "painter",
  "pubs-quinten-matsijs-game": "barrel-game",
  "pubs-boer-van-tienen-special": "second-oldest",
  "pubs-de-kat-cats": "3",
  "pubs-billies-dogs": "179",
  "pubs-barries-savings-box": "customer-savings",
  "pubs-paters-vaetje-matsijs": "well",
  "pubs-de-varkenspoot-name": "pigs-trotters",
  "pubs-de-muze-animal": "horse",
  "pubs-de-muze-floors": "3",
  "pubs-cabron-cafes": "420",
  "pubs-den-engel-clock": "11-55",
  "pubs-den-engel-why": "cinderella",
};
