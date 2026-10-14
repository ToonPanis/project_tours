import type { AnswerKey } from "@/types/pub-game";

/**
 * SERVER ONLY: the correct option of every Hidden Pubs 2.0 question.
 *
 * Only files in src/features/pub-game/server/ may import this file (checked by
 * pub-game-server.test.ts), so the answers are never bundled for the browser.
 *
 * Missing until the owner supplies them (HIDDEN_PUBS_DATA_AUDIT.md, D23):
 * pubs-barok-baroque, pubs-quinten-matsijs-profession, pubs-quinten-matsijs-game,
 * pubs-boer-van-tienen-special.
 */
export const pubGameAnswerKey: AnswerKey = {
  "pubs-rococo-gates": "33",
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
