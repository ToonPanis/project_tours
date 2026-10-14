import type { Card, CardFollowUp, CardId, Rank, Suit, TeamDeck } from "@/types/pub-game";
import { CARDS_PER_OFFER, TWO_DECKS_FROM_PLAYERS } from "../config";

export const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
export const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export function cardId(deck: number, suit: Suit, rank: Rank): CardId {
  return `${deck}-${suit}-${rank}`;
}

/** Reads a card id back ("2-spades-10" → deck 2, spades, 10). Throws on anything else. */
export function parseCard(id: CardId): Card {
  const [deckText, suit, rank] = id.split("-");
  const deck = Number(deckText);
  if (!Number.isInteger(deck) || deck < 1 || !SUITS.includes(suit as Suit) || !RANKS.includes(rank as Rank)) {
    throw new Error(`Not a card id: "${id}"`);
  }
  return { id, deck, suit: suit as Suit, rank: rank as Rank };
}

/** A team with more than 4 players plays with 2 decks (104 cards). */
export function deckCountFor(playerCount: number): number {
  return playerCount >= TWO_DECKS_FROM_PLAYERS ? 2 : 1;
}

/** All cards of `deckCount` standard decks without jokers, in a fixed order. */
export function buildDeck(deckCount: number): TeamDeck {
  const drawPile: CardId[] = [];
  for (let deck = 1; deck <= deckCount; deck++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) drawPile.push(cardId(deck, suit, rank));
    }
  }
  return { drawPile, drawn: [] };
}

/**
 * When fewer cards are left than an offer needs, the drawn cards are shuffled
 * back in. "Shuffled" needs no randomness here: every offer is a random pick
 * from the pile anyway (see `pickOffer`).
 */
export function refillIfNeeded(deck: TeamDeck): TeamDeck {
  if (deck.drawPile.length >= CARDS_PER_OFFER) return deck;
  return { drawPile: [...deck.drawPile, ...deck.drawn], drawn: [] };
}

/**
 * Picks the face-down cards offered to a player: up to 10 different cards from
 * the draw pile. Used by the SERVER (with a secure random function) before it
 * sends OFFER_CARDS; `random` returns a number in [0, 1), like Math.random.
 */
export function pickOffer(drawPile: CardId[], random: () => number): CardId[] {
  const pile = [...drawPile];
  const count = Math.min(CARDS_PER_OFFER, pile.length);
  // The first `count` steps of a Fisher–Yates shuffle.
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(random() * (pile.length - i));
    [pile[i], pile[j]] = [pile[j], pile[i]];
  }
  return pile.slice(0, count);
}

/** What a drawn card asks from the player before the next one can draw. */
export function followUpFor(rank: Rank): CardFollowUp {
  switch (rank) {
    case "2":
      return "choose-target";
    case "8":
      return "choose-buddy";
    case "J":
      return "write-rule";
    case "4":
    case "7":
    case "9":
    case "10":
      return "report-loser";
    default:
      return null;
  }
}
