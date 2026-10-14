import { createId } from "@/lib/create-id";
import type { MessageKey } from "@/i18n/translate";
import type { ClientAction } from "../logic/client-action";
import type { ActionResult, GameUpdate } from "../logic/api-types";

/**
 * The browser side of /api/games. Plain fetch, no library.
 * Nothing here may import from server/ (pub-game-data.test.ts checks it).
 */

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: init?.body ? { "content-type": "application/json" } : undefined,
    });
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      return { ok: false, status: response.status, error: typeof body.error === "string" ? body.error : "unknown" };
    }
    return { ok: true, data: body as T };
  } catch {
    // No network (a cellar bar, a tunnel…): status 0.
    return { ok: false, status: 0, error: "offline" };
  }
}

const post = <T>(url: string, body: unknown) => request<T>(url, { method: "POST", body: JSON.stringify(body) });

export interface CreateGameInput {
  walkSlug: string;
  teamNames: string[];
  playersPerTeam: number;
  hostName: string;
  hostTeamIndex: number;
  adultsConfirmed: boolean;
}

export const createGameRequest = (input: CreateGameInput) =>
  post<{ code: string; playerId: string }>("/api/games", input);

export const joinGameRequest = (code: string, input: { name: string; teamId: string; adultsConfirmed: boolean }) =>
  post<{ playerId: string }>(`/api/games/${code}/join`, input);

export const fetchGameUpdate = (code: string, since: number) =>
  request<GameUpdate>(`/api/games/${code}/state?since=${since}`);

/** Host only: a personal link for a player (late joiner, new phone). */
export const createPlayerLinkRequest = (code: string, playerId: string) =>
  post<{ path: string }>(`/api/games/${code}/players/${encodeURIComponent(playerId)}/link`, {});

/** This phone opened a player link: it becomes that player. */
export const claimPlayerLinkRequest = (code: string, token: string) =>
  post<{ playerId: string }>(`/api/games/${code}/claim`, { token });

/**
 * Sends one action. `actionId` identifies this tap: when the connection drops
 * and the phone sends it again, the server applies it only once.
 */
export const sendAction = (code: string, action: ClientAction, actionId: string, knownVersion: number) =>
  post<ActionResult>(`/api/games/${code}/actions`, { actionId, action, knownVersion });

/** A new id per tap ([a-z0-9-], 8+ characters, as the server expects). */
export function newActionId(): string {
  return `${createId()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** The translation of a server error code. Unknown codes get the general message. */
const ERROR_KEYS: Record<string, MessageKey> = {
  "adults-only": "pubgame.errors.adultsOnly",
  "invalid-settings": "pubgame.errors.invalidSettings",
  "invalid-text": "pubgame.errors.invalidText",
  "invalid-request": "pubgame.errors.invalidText",
  "name-taken": "pubgame.errors.nameTaken",
  "team-full": "pubgame.errors.teamFull",
  "joining-closed": "pubgame.errors.joiningClosed",
  "not-host": "pubgame.errors.notHost",
  "empty-team": "pubgame.errors.emptyTeam",
  "unknown-game": "pubgame.errors.unknownGame",
  "game-finished": "pubgame.errors.gameFinished",
  "game-already-started": "pubgame.errors.outdated",
  "wrong-step": "pubgame.errors.outdated",
  "card-pending": "pubgame.errors.outdated",
  "already-answered": "pubgame.errors.outdated",
  "task-done": "pubgame.errors.outdated",
  "unknown-link": "pubgame.errors.unknownLink",
  "no-team": "pubgame.errors.chooseTeam",
  offline: "pubgame.connection.offline",
};

export function errorMessageKey(error: string): MessageKey {
  return ERROR_KEYS[error] ?? "pubgame.errors.generic";
}
