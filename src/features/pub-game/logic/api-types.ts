import type { PubGameEvent, PubGameState } from "@/types/pub-game";
import type { PlayerView } from "./player-view";

/**
 * The shapes the /api/games routes send to the browser. They live here (not in
 * server/) so client code can use them without importing anything from the server.
 */

/** What someone with the join link sees before joining: teams and free places, no names. */
export interface Lobby {
  phase: PubGameState["phase"];
  joiningOpen: boolean;
  playersPerTeam: number;
  teams: { id: string; name: string; playerCount: number }[];
}

/** GET /state: "nothing new", or the player's new view and events. */
export type GameUpdate =
  | { changed: false; version: number }
  | { changed: true; version: number; view: PlayerView; events: PubGameEvent[] };
