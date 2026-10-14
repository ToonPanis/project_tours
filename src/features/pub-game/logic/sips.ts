import type { PubGameState, Sip } from "@/types/pub-game";

/** The drinking buddy of a player (card 8), or null. Buddies are game-wide. */
export function buddyOf(buddies: PubGameState["buddies"], playerId: string): string | null {
  for (const [a, b] of buddies) {
    if (a === playerId) return b;
    if (b === playerId) return a;
  }
  return null;
}

/** True when the player is the Beunaas (ace) of their team. */
function isBeunaas(state: PubGameState, playerId: string): boolean {
  return state.teams.some((team) => team.roles.beunaas === playerId);
}

/**
 * Who drinks, and how much, when `playerId` has to take a sip:
 *
 * - The player: 1 sip, 2 if they're the Beunaas.
 * - Their buddy drinks along: 1 sip, 2 if the buddy is a Beunaas, and also 2
 *   when the player is the Beunaas ("the buddy drinks double too").
 *
 * Buddies of buddies don't drink (one pair per player, no chains), so this can
 * never loop. Nobody gets more than 2 sips from one instruction.
 */
export function resolveSips(state: PubGameState, playerId: string): Sip[] {
  const playerIsBeunaas = isBeunaas(state, playerId);
  const sips: Sip[] = [{ playerId, sips: playerIsBeunaas ? 2 : 1, because: "card" }];

  const buddy = buddyOf(state.buddies, playerId);
  if (buddy) {
    const double = playerIsBeunaas || isBeunaas(state, buddy);
    sips.push({ playerId: buddy, sips: double ? 2 : 1, because: "buddy" });
  }
  return sips;
}
