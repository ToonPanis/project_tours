import type {
  CafeStep,
  CurrentCard,
  EvidenceSubmission,
  PubGameDefinition,
  PubGamePlayer,
  PubGameState,
  QuestionProgress,
  ScoringMode,
  TeamRoles,
  TeamRule,
} from "@/types/pub-game";
import { currentDrawer } from "./apply-action";
import { computeScores, rankScores, type RankedScore } from "./scoring";

/** Everything about the player's own team. */
export interface OwnTeamView {
  id: string;
  name: string;
  route: string[];
  cafeIndex: number;
  step: CafeStep;
  /** Whose turn it is to draw a card at this café, or null. */
  drawerId: string | null;
  /** Face-down cards: only how many there are, never which ones. */
  offeredCardCount: number;
  currentCard: CurrentCard | null;
  cardsLeft: number;
  roles: TeamRoles;
  rules: TeamRule[];
  doneTaskIds: string[];
  finishedAt: string | null;
}

/** Other teams: only what the leaderboard needs. Never their route or answers. */
export interface OtherTeamView {
  id: string;
  name: string;
  cafesCompleted: number;
  finishedAt: string | null;
}

export interface PlayerView {
  phase: PubGameState["phase"];
  scoringMode: ScoringMode;
  me: PubGamePlayer;
  players: PubGamePlayer[];
  team: OwnTeamView;
  otherTeams: OtherTeamView[];
  buddies: PubGameState["buddies"];
  /** The player's own question progress (their team's, or their own in a single-team game). */
  answers: Record<string, QuestionProgress>;
  /** Own team's evidence; the host sees everything, and everyone does once the game is over. */
  evidence: EvidenceSubmission[];
  scores: RankedScore[];
}

/**
 * The game as one player may see it. This is the ONLY shape the server sends
 * to a phone, so anything left out here (other teams' routes, the cards on
 * offer, other scorers' answers) can't be read in the browser.
 */
export function toPlayerView(definition: PubGameDefinition, state: PubGameState, playerId: string): PlayerView {
  const me = state.players.find((player) => player.id === playerId);
  if (!me) throw new Error(`Not a player of this game: "${playerId}"`);
  const team = state.teams.find((candidate) => candidate.id === me.teamId);
  if (!team) throw new Error(`Unknown team "${me.teamId}"`);

  const scorerId = state.scoringMode === "player" ? me.id : team.id;
  const seesAllEvidence = me.isHost || state.phase === "finished";

  return {
    phase: state.phase,
    scoringMode: state.scoringMode,
    me,
    players: state.players,
    team: {
      id: team.id,
      name: team.name,
      route: team.route,
      cafeIndex: team.cafeIndex,
      step: team.step,
      drawerId: team.step === "cards" ? (currentDrawer(state, team)?.id ?? null) : null,
      offeredCardCount: team.offer?.cardIds.length ?? 0,
      currentCard: team.currentCard,
      cardsLeft: team.deck.drawPile.length,
      roles: team.roles,
      rules: team.rules,
      doneTaskIds: team.doneTaskIds,
      finishedAt: team.finishedAt,
    },
    otherTeams: state.teams
      .filter((other) => other.id !== team.id)
      .map((other) => ({
        id: other.id,
        name: other.name,
        cafesCompleted: completedCafes(other.cafeIndex, other.finishedAt),
        finishedAt: other.finishedAt,
      })),
    buddies: state.buddies,
    answers: state.answers[scorerId] ?? {},
    evidence: seesAllEvidence ? state.evidence : state.evidence.filter((item) => item.teamId === team.id),
    scores: rankScores(computeScores(definition, state)),
  };
}

/** Cafés finished: all before the current one, plus the last one when the team is done. */
export function completedCafes(cafeIndex: number, finishedAt: string | null): number {
  return finishedAt ? cafeIndex + 1 : cafeIndex;
}
