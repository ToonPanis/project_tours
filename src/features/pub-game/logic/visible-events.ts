import type { PubGameEvent, PubGameState } from "@/types/pub-game";

/**
 * True when `playerId` may see this event (as a popup or in the game log).
 *
 * - Everyone: joins, start and end of the game, new drinking buddies, and every
 *   sip that involves a buddy ("a popup for all players, so they can check
 *   each other", from the concept).
 * - Only the own team: cards, powers, rules, answers, evidence, and the next
 *   café (which would give away the team's private route).
 * - The host also sees evidence submissions of every team (to review them).
 */
export function canSeeEvent(state: PubGameState, playerId: string, event: PubGameEvent): boolean {
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player) return false;
  const ownTeam = (teamId: string) => player.teamId === teamId;

  switch (event.type) {
    case "player-joined":
    case "game-started":
    case "game-finished":
    case "team-finished":
    case "buddies-linked":
      return true;
    case "drink":
      return ownTeam(event.teamId) || event.sips.some((sip) => sip.because === "buddy");
    case "evidence-submitted":
    case "evidence-reviewed":
      return ownTeam(event.teamId) || player.isHost;
    case "answered":
      // The scorer is the team, or (single-team game) a player of the only team.
      return event.scorerId === player.teamId || event.scorerId === player.id;
    case "card-drawn":
    case "role-changed":
    case "rule-added":
    case "next-cafe":
      return ownTeam(event.teamId);
  }
}
