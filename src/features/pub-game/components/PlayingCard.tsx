"use client";

import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import type { Rank, Suit } from "@/types/pub-game";
import { parseCard } from "../logic/cards";

const SUIT_SYMBOLS: Record<Suit, string> = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" };
const RANK_NAMES: Partial<Record<Rank, MessageKey>> = {
  J: "pubgame.cards.ranks.J",
  Q: "pubgame.cards.ranks.Q",
  K: "pubgame.cards.ranks.K",
  A: "pubgame.cards.ranks.A",
};

/** The spoken name of a card, e.g. "Queen of hearts" (for screen readers). */
export function useCardLabel() {
  const t = useT();
  return (cardId: string) => {
    const { rank, suit } = parseCard(cardId);
    const rankName = RANK_NAMES[rank];
    return t("pubgame.cards.cardLabel", { rank: rankName ? t(rankName) : rank, suit: t(`pubgame.cards.suits.${suit}`) });
  };
}

/**
 * A playing card drawn with CSS: rank and suit in two corners and a big suit
 * in the middle. Red for hearts and diamonds. It flips in (unless the player
 * prefers reduced motion).
 */
export function PlayingCard({ cardId }: { cardId: string }) {
  const label = useCardLabel()(cardId);
  const { rank, suit } = parseCard(cardId);
  const color = suit === "hearts" || suit === "diamonds" ? "text-red-700" : "text-ink";
  const symbol = SUIT_SYMBOLS[suit];
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative mx-auto aspect-[5/7] w-40 rounded-lg border-4 border-parchment bg-white shadow-xl motion-safe:animate-[card-flip_500ms_ease-out] ${color}`}
    >
      <span aria-hidden="true" className="absolute left-2 top-1 flex flex-col items-center font-display text-2xl font-bold leading-none">
        {rank}
        <span className="text-xl">{symbol}</span>
      </span>
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-7xl">
        {symbol}
      </span>
      <span aria-hidden="true" className="absolute bottom-1 right-2 flex rotate-180 flex-col items-center font-display text-2xl font-bold leading-none">
        {rank}
        <span className="text-xl">{symbol}</span>
      </span>
    </div>
  );
}

/** The back of a card: the tavern pattern, the same for every card (so nobody can peek). */
export function CardBack() {
  return (
    <span
      aria-hidden="true"
      className="block aspect-[5/7] w-full rounded-md border-2 border-gold bg-umber bg-[repeating-linear-gradient(45deg,var(--color-gold-deep)_0_4px,transparent_4px_12px)] shadow-md"
    />
  );
}
