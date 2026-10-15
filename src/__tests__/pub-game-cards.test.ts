import { describe, expect, test } from "vitest";
import {
  buildDeck,
  cardId,
  deckCountFor,
  followUpFor,
  parseCard,
  pickOffer,
  RANKS,
  refillIfNeeded,
  SUITS,
} from "@/features/pub-game/logic/cards";
import { CARDS_PER_OFFER } from "@/features/pub-game/config";

describe("decks", () => {
  test("one deck: 52 different cards, no jokers, 4 of each rank", () => {
    const { drawPile, drawn } = buildDeck(1);
    expect(drawPile).toHaveLength(52);
    expect(new Set(drawPile).size).toBe(52);
    expect(drawn).toEqual([]);
    for (const rank of RANKS) {
      expect(drawPile.filter((id) => parseCard(id).rank === rank)).toHaveLength(4);
    }
  });

  test("two decks: 104 different cards, 8 jacks, 8 kings, 8 aces, …", () => {
    const { drawPile } = buildDeck(2);
    expect(drawPile).toHaveLength(104);
    expect(new Set(drawPile).size).toBe(104);
    for (const rank of RANKS) {
      expect(drawPile.filter((id) => parseCard(id).rank === rank)).toHaveLength(8);
    }
  });

  test("more than 4 players in a team: 2 decks", () => {
    expect([1, 2, 3, 4].map(deckCountFor)).toEqual([1, 1, 1, 1]);
    expect([5, 6, 10].map(deckCountFor)).toEqual([2, 2, 2]);
  });

  test("card ids can be read back, and anything else is refused", () => {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        expect(parseCard(cardId(2, suit, rank))).toEqual({ id: cardId(2, suit, rank), deck: 2, suit, rank });
      }
    }
    for (const bad of ["", "1-hearts", "0-hearts-Q", "1-stars-Q", "1-hearts-1", "x-hearts-Q"]) {
      expect(() => parseCard(bad)).toThrow();
    }
  });
});

describe("offering face-down cards", () => {
  test("10 different cards from the draw pile", () => {
    const { drawPile } = buildDeck(1);
    for (let run = 0; run < 200; run++) {
      const offer = pickOffer(drawPile, Math.random);
      expect(offer).toHaveLength(CARDS_PER_OFFER);
      expect(new Set(offer).size).toBe(CARDS_PER_OFFER);
      expect(offer.every((id) => drawPile.includes(id))).toBe(true);
    }
  });

  test("every card can be offered (no card is left out by the random pick)", () => {
    const { drawPile } = buildDeck(1);
    const seen = new Set<string>();
    for (let run = 0; run < 500; run++) pickOffer(drawPile, Math.random).forEach((id) => seen.add(id));
    expect(seen.size).toBe(52);
  });

  test("a smaller pile offers all its cards", () => {
    const pile = buildDeck(1).drawPile.slice(0, 4);
    expect(pickOffer(pile, Math.random).sort()).toEqual([...pile].sort());
  });

  test("the drawn cards go back in when fewer than 10 are left", () => {
    const full = buildDeck(1).drawPile;
    const enough = { drawPile: full.slice(0, 10), drawn: full.slice(10) };
    expect(refillIfNeeded(enough)).toBe(enough);

    const low = { drawPile: full.slice(0, 9), drawn: full.slice(9) };
    const refilled = refillIfNeeded(low);
    expect(refilled.drawPile.sort()).toEqual([...full].sort());
    expect(refilled.drawn).toEqual([]);
  });
});

test("what each of the 13 ranks asks from the player", () => {
  expect(Object.fromEntries(RANKS.map((rank) => [rank, followUpFor(rank)]))).toEqual({
    "2": "choose-target",
    "3": null,
    "4": "report-loser",
    "5": null,
    "6": null,
    "7": "report-loser",
    "8": "choose-buddy",
    "9": "report-loser",
    "10": "report-loser",
    J: "write-rule",
    Q: null,
    K: null,
    A: null,
  });
});
