import type { PlayerView } from "./player-view";
import { completedCafes } from "./player-view";

export interface TeamSummary {
  id: string;
  name: string;
  cafesCompleted: number;
  finishedAt: string | null;
}

/** Every team in the order the organiser created them (own team included). */
export function allTeams(view: PlayerView): TeamSummary[] {
  const own: TeamSummary = {
    id: view.team.id,
    name: view.team.name,
    cafesCompleted: completedCafes(view.team.cafeIndex, view.team.finishedAt),
    finishedAt: view.team.finishedAt,
  };
  // Team ids are "t1", "t2", …: sort by their number, not as text ("t10" after "t9").
  const order = (id: string) => Number(id.replace(/\D/g, "")) || 0;
  return [own, ...view.otherTeams].sort((a, b) => order(a.id) - order(b.id));
}

/** A player's name from the view (the id when unknown: never crashes a screen). */
export function playerName(view: PlayerView, playerId: string | null | undefined): string {
  return view.players.find((player) => player.id === playerId)?.name ?? playerId ?? "";
}

/** The players of the viewer's own team, in joining order. */
export function teammates(view: PlayerView) {
  return view.players.filter((player) => player.teamId === view.team.id);
}

export interface LeaderboardRow {
  scorerId: string;
  /** The team's name, or the player's name in a single-team game. */
  name: string;
  position: number;
  total: number;
  bonusPoints: number;
  firstAttemptCorrect: number;
  correctAnswers: number;
  approvedTasks: number;
  /** Cafés finished by the team (in a single-team game: the whole team's progress). */
  cafesCompleted: number;
  /** The viewer's own team, or the viewer themselves in a single-team game. */
  isOwn: boolean;
}

/**
 * The leaderboard as one player sees it: ranked by points, ties broken by
 * first-time-right answers, still tied = the same place (D27).
 */
export function leaderboardRows(view: PlayerView): LeaderboardRow[] {
  const teams = allTeams(view);
  return view.scores.map((score) => {
    const isPlayerScore = view.scoringMode === "player";
    const teamId = isPlayerScore ? view.players.find((player) => player.id === score.scorerId)?.teamId : score.scorerId;
    const team = teams.find((candidate) => candidate.id === teamId);
    return {
      scorerId: score.scorerId,
      name: isPlayerScore ? playerName(view, score.scorerId) : (team?.name ?? score.scorerId),
      position: score.position,
      total: score.total,
      bonusPoints: score.bonusPoints,
      firstAttemptCorrect: score.firstAttemptCorrect,
      correctAnswers: score.correctAnswers,
      approvedTasks: score.approvedTasks,
      cafesCompleted: team?.cafesCompleted ?? 0,
      isOwn: isPlayerScore ? score.scorerId === view.me.id : score.scorerId === view.team.id,
    };
  });
}

/** Everyone in first place (more than one = a shared win, D27). */
export function winners(rows: LeaderboardRow[]): LeaderboardRow[] {
  return rows.filter((row) => row.position === 1);
}

/** The row with the highest value for a statistic, or null when nobody scored any (no "winner" with 0). */
export function bestAt(rows: LeaderboardRow[], key: "firstAttemptCorrect" | "correctAnswers" | "approvedTasks"): LeaderboardRow | null {
  const best = rows.reduce<LeaderboardRow | null>((top, row) => (row[key] > (top?.[key] ?? 0) ? row : top), null);
  return best && best[key] > 0 ? best : null;
}
