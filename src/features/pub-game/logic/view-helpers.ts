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
