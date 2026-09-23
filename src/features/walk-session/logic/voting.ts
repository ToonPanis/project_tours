import type { DrinkRound } from "@/types/drink";
import type { Team, Vote } from "@/types/team";

export interface VoteTally {
  drinkOptionId: string;
  count: number;
}

/** Counts votes per option, in the round's option order (A, B, C). */
export function tallyVotes(round: DrinkRound, votes: Vote[]): VoteTally[] {
  return round.options.map((option) => ({
    drinkOptionId: option.id,
    count: votes.filter((vote) => vote.drinkOptionId === option.id).length,
  }));
}

/** The option id(s) with the most votes. More than one means a tie. */
export function findLeadingOptionIds(tally: VoteTally[]): string[] {
  const highestCount = Math.max(...tally.map((entry) => entry.count));
  return tally.filter((entry) => entry.count === highestCount).map((entry) => entry.drinkOptionId);
}

export function haveAllPlayersVoted(team: Team, votes: Vote[]): boolean {
  return team.players.every((player) => votes.some((vote) => vote.playerId === player.id));
}

/**
 * Picks the winner between tied options.
 * `random` is a parameter so tests can make the choice predictable.
 * This runs BEFORE dispatching CLOSE_VOTING, never inside the reducer.
 */
export function pickRandomWinner(
  tiedOptionIds: string[],
  random: () => number = Math.random,
): string {
  const index = Math.floor(random() * tiedOptionIds.length);
  return tiedOptionIds[index];
}
