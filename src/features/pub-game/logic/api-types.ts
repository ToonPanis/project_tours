import type { PubGameEvent, PubGameState } from "@/types/pub-game";
import type { FunFact } from "@/data/walks/hidden-pubs/game/content/types";
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
  /** Places paid for and taken (P3), the organiser included; null = no limit. */
  seats: { taken: number; limit: number } | null;
}

/** An event with the game version its action created: phones use it to show each popup once. */
export interface VersionedEvent {
  version: number;
  event: PubGameEvent;
}

/** GET /state: "nothing new", or the player's new view and events. */
export type GameUpdate =
  | { changed: false; version: number }
  | { changed: true; version: number; view: PlayerView; events: VersionedEvent[] };

/** POST /actions: the new view, and the events since the version the phone already had. */
export interface ActionResult {
  version: number;
  view: PlayerView;
  events: VersionedEvent[];
}

/** GET /reveal?cafe=…: what a finished question or café may now show. */
export interface CafeReveal {
  /** Only for questions this player (or team) has finished. */
  explanations: Record<string, string>;
  /** Only once the team reached the café's fun fact (or has moved on). */
  funFact: FunFact | null;
}
