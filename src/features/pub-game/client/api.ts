import { createId } from "@/lib/create-id";
import type { MessageKey } from "@/i18n/translate";
import type { ClientAction } from "../logic/client-action";
import type { ActionResult, CafeReveal, GameUpdate } from "../logic/api-types";

/**
 * The browser side of /api/games. Plain fetch, no library.
 * Nothing here may import from server/ (pub-game-data.test.ts checks it).
 */

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

/**
 * How long one request may take. On a phone that switches between café wifi
 * and 4G a request can hang for a minute or more without failing; after this
 * it counts as "offline", so polling goes on and buttons work again. (Uploads
 * don't go through here: they may take longer.)
 */
export const REQUEST_TIMEOUT_MS = 8_000;

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...init,
      signal: controller.signal,
      headers: init?.body ? { "content-type": "application/json" } : undefined,
    });
    // Read the whole body before the timer stops: a timeout halfway through is "offline", not an empty answer.
    const body = parseJson(await response.text());
    if (!response.ok) {
      return { ok: false, status: response.status, error: typeof body.error === "string" ? body.error : "unknown" };
    }
    return { ok: true, data: body as T };
  } catch {
    // No network (a cellar bar, a tunnel…) or no answer in time: status 0.
    return { ok: false, status: 0, error: "offline" };
  } finally {
    clearTimeout(timer);
  }
}

/** The answer as an object; anything that isn't JSON (a proxy's error page) becomes {}. */
function parseJson(text: string): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(text);
    return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
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

/** What this player has earned at a café: finished questions' explanations, the fun fact. */
export const fetchReveal = (code: string, cafeId: string) =>
  request<CafeReveal>(`/api/games/${code}/reveal?cafe=${encodeURIComponent(cafeId)}`);

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
  "invalid-media": "pubgame.errors.invalidMedia",
  "too-large": "pubgame.errors.tooLarge",
  "upload-failed": "pubgame.errors.uploadFailed",
  offline: "pubgame.connection.offline",
};

export function errorMessageKey(error: string): MessageKey {
  return ERROR_KEYS[error] ?? "pubgame.errors.generic";
}
