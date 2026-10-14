import type { AnswerKey, PubGameAction, PubGameDefinition, PubGameState } from "@/types/pub-game";
import { MAX_PLAYERS_PER_TEAM, MAX_TEAMS } from "../config";
import { applyPubGameAction, teamPlayers } from "../logic/apply-action";
import { isValidActionId, parseClientAction, toGameAction } from "../logic/client-action";
import { createPubGame } from "../logic/create-game";
import type { ActionResult, GameUpdate, Lobby } from "../logic/api-types";
import { toPlayerView } from "../logic/player-view";
import { canSeeEvent } from "../logic/visible-events";
import type { GameStore, StoredGame } from "./game-store";

export type { GameUpdate, Lobby };
import { GAME_LIFETIME_DAYS, hashToken, isGameCode, newGameCode, newPlayerToken } from "./identity";

/**
 * The game service: the only code that combines the store, the game logic and
 * the answer key. The Route Handlers in src/app/api/games/ only translate HTTP
 * to these functions and back, so everything here can be tested without a
 * server (see pub-game-server.test.ts).
 */

export interface GameData {
  definition: PubGameDefinition;
  answerKey: AnswerKey;
}

/** Everything the service needs from outside. Tests pass fakes (fixed time, fixed random numbers). */
export interface GameContext {
  store: GameStore;
  getGameData: (walkSlug: string) => GameData | null;
  random: () => number;
  newId: () => string;
  now: () => Date;
}

export type ServiceResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const ok = <T>(data: T): ServiceResult<T> => ({ ok: true, data });
const fail = (status: number, error: string): ServiceResult<never> => ({ ok: false, status, error });

/** At most this many events in one poll; a phone that was away longer just gets the new state. */
const MAX_EVENTS_PER_POLL = 100;
/** Retries when another phone changed the game at the same moment. */
const MAX_COMMIT_ATTEMPTS = 5;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

// ─── Create ─────────────────────────────────────────────────────────────────

export interface CreatedGame {
  code: string;
  playerId: string;
  /** The secret for the organiser's cookie. */
  token: string;
}

/**
 * Body: { teamNames: string[], playersPerTeam, hostName, hostTeamIndex, adultsConfirmed: true }
 * The organiser becomes the host and a player of team `hostTeamIndex` (D33).
 */
export async function createGame(ctx: GameContext, walkSlug: string, body: unknown): Promise<ServiceResult<CreatedGame>> {
  if (!ctx.getGameData(walkSlug)) return fail(404, "unknown-walk");
  if (!isRecord(body)) return fail(400, "invalid-settings");
  // 18+ (D4): shots are spirits.
  if (body.adultsConfirmed !== true) return fail(400, "adults-only");

  const { teamNames, playersPerTeam, hostName, hostTeamIndex } = body;
  const validShape =
    Array.isArray(teamNames) &&
    teamNames.length >= 1 &&
    teamNames.length <= MAX_TEAMS &&
    teamNames.every((name) => typeof name === "string") &&
    typeof playersPerTeam === "number" &&
    playersPerTeam <= MAX_PLAYERS_PER_TEAM &&
    typeof hostName === "string" &&
    Number.isInteger(hostTeamIndex) &&
    (hostTeamIndex as number) >= 0 &&
    (hostTeamIndex as number) < teamNames.length;
  if (!validShape) return fail(400, "invalid-settings");

  const teams = (teamNames as string[]).map((name, index) => ({ id: `t${index + 1}`, name }));
  const playerId = ctx.newId();
  let state: PubGameState;
  try {
    state = createPubGame({
      teams,
      playersPerTeam,
      host: { id: playerId, name: hostName, teamId: teams[hostTeamIndex as number].id },
    });
  } catch {
    return fail(400, "invalid-settings");
  }

  const createdAt = ctx.now();
  const expiresAt = new Date(createdAt.getTime() + GAME_LIFETIME_DAYS * 24 * 60 * 60 * 1000);
  // A new code until one is free (with 31^6 ≈ 900 million codes, almost always the first).
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = newGameCode();
    const created = await ctx.store.createGame({
      code,
      walkSlug,
      state,
      version: 0,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
    if (created) {
      const token = newPlayerToken();
      await ctx.store.savePlayerToken(code, hashToken(token), playerId);
      return ok({ code, playerId, token });
    }
  }
  return fail(503, "busy");
}

// ─── Lobby and joining ──────────────────────────────────────────────────────

/** What someone with the join link sees before joining: teams and free places, no names. */
export async function getLobby(ctx: GameContext, code: string): Promise<ServiceResult<Lobby>> {
  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  const { state } = game;
  return ok({
    phase: state.phase,
    joiningOpen: state.phase === "lobby" || (state.phase === "playing" && !state.firstCardDrawn),
    playersPerTeam: state.playersPerTeam,
    teams: state.teams.map((team) => ({
      id: team.id,
      name: team.name,
      playerCount: teamPlayers(state, team.id).length,
    })),
  });
}

export interface JoinedGame {
  playerId: string;
  /** Null when the phone was already in the game (its cookie stays). */
  token: string | null;
}

/**
 * Body: { name, teamId, adultsConfirmed: true }.
 * A phone that's already in the game (valid cookie) gets its own player back,
 * so a double tap or a reload never creates a second player.
 */
export async function joinGame(
  ctx: GameContext,
  code: string,
  existingToken: string | null,
  body: unknown,
): Promise<ServiceResult<JoinedGame>> {
  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");

  const existingPlayer = await findPlayer(ctx, code, existingToken);
  if (existingPlayer) return ok({ playerId: existingPlayer, token: null });

  if (!isRecord(body) || typeof body.name !== "string" || typeof body.teamId !== "string") {
    return fail(400, "invalid-request");
  }
  if (body.adultsConfirmed !== true) return fail(400, "adults-only");

  const playerId = ctx.newId();
  const action: PubGameAction = { type: "JOIN", playerId, name: body.name, teamId: body.teamId };
  // The join gets its own action id: it's only applied once.
  const result = await commitWithRetry(ctx, code, playerId, `join-${playerId}`, () => action);
  if (!result.ok) return result;

  const token = newPlayerToken();
  await ctx.store.savePlayerToken(code, hashToken(token), playerId);
  return ok({ playerId, token });
}

/**
 * The host makes a personal link for a player: for someone added after the
 * start (D34), or whose phone died. Opening the link on a phone makes that
 * phone this player. The secret is a new player token (a player may have
 * several: old phone and new phone).
 */
export async function createPlayerLink(
  ctx: GameContext,
  code: string,
  hostToken: string | null,
  playerId: string,
): Promise<ServiceResult<{ token: string }>> {
  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  const hostId = await findPlayer(ctx, code, hostToken);
  if (!hostId) return fail(401, "not-joined");
  if (!game.state.players.some((player) => player.id === hostId && player.isHost)) return fail(403, "not-host");
  if (!game.state.players.some((player) => player.id === playerId)) return fail(404, "unknown-player");

  const token = newPlayerToken();
  await ctx.store.savePlayerToken(code, hashToken(token), playerId);
  return ok({ token });
}

/** A phone opens a player link: the token becomes this phone's cookie, if it belongs to the game. */
export async function claimPlayerLink(
  ctx: GameContext,
  code: string,
  body: unknown,
): Promise<ServiceResult<{ playerId: string; token: string }>> {
  if (!isRecord(body) || typeof body.token !== "string" || body.token.length > 100) {
    return fail(400, "invalid-request");
  }
  const playerId = await findPlayer(ctx, code, body.token);
  if (!playerId) return fail(404, "unknown-link");
  return ok({ playerId, token: body.token });
}

// ─── Playing ────────────────────────────────────────────────────────────────

/**
 * GET /state: the player's view, polled every ~2 s by each phone.
 * `since` is the version the phone already has. Same version → a tiny
 * "unchanged" answer. Without `since` (first load), no old events are sent,
 * so old popups don't pop up again.
 */
export async function getGameUpdate(
  ctx: GameContext,
  code: string,
  token: string | null,
  since: number | null,
): Promise<ServiceResult<GameUpdate>> {
  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  const playerId = await findPlayer(ctx, code, token);
  if (!playerId) return fail(401, "not-joined");

  if (since === game.version) return ok({ changed: false, version: game.version });

  const data = gameDataOf(ctx, game);
  const stored = since === null ? [] : await ctx.store.eventsSince(code, since, MAX_EVENTS_PER_POLL);
  const events = stored.filter((item) => canSeeEvent(game.state, playerId, item.event));

  return ok({
    changed: true,
    version: game.version,
    view: toPlayerView(data.definition, game.state, playerId),
    events,
  });
}

/**
 * POST /actions. Body: { actionId, action }. Runs the action for the player of
 * the cookie and returns their new view. The same `actionId` twice (double tap,
 * retry after a lost connection) is applied once.
 */
export async function performAction(
  ctx: GameContext,
  code: string,
  token: string | null,
  body: unknown,
): Promise<ServiceResult<ActionResult>> {
  const playerId = await findPlayer(ctx, code, token);
  if (!playerId) return (await loadGame(ctx, code)) ? fail(401, "not-joined") : fail(404, "unknown-game");

  if (!isRecord(body) || !isValidActionId(body.actionId)) return fail(400, "invalid-request");
  const clientAction = parseClientAction(body.action);
  if (!clientAction) return fail(400, "invalid-action");

  const result = await commitWithRetry(ctx, code, playerId, body.actionId, (state, definition) =>
    toGameAction(clientAction, definition, state, playerId, {
      random: ctx.random,
      newId: ctx.newId,
      now: ctx.now().toISOString(),
    }),
  );
  if (!result.ok) return result;

  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  // Every event since the version the phone had (`knownVersion`): this action's and anything
  // other phones did meanwhile. The phone jumps to the newest version, so its next poll
  // won't ask for those again. Phones show each event once (by its version).
  const known = typeof body.knownVersion === "number" && Number.isInteger(body.knownVersion) ? body.knownVersion : null;
  const since = Math.max(0, Math.min(known ?? result.data.version - 1, result.data.version - 1));
  const stored = await ctx.store.eventsSince(code, since, MAX_EVENTS_PER_POLL);
  return ok({
    version: game.version,
    view: toPlayerView(gameDataOf(ctx, game).definition, game.state, playerId),
    events: stored.filter((item) => canSeeEvent(game.state, playerId, item.event)),
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function loadGame(ctx: GameContext, code: string): Promise<StoredGame | null> {
  return isGameCode(code) ? ctx.store.getGame(code) : null;
}

async function findPlayer(ctx: GameContext, code: string, token: string | null): Promise<string | null> {
  if (!token || !isGameCode(code)) return null;
  return ctx.store.findPlayerByToken(code, hashToken(token));
}

function gameDataOf(ctx: GameContext, game: StoredGame): GameData {
  const data = ctx.getGameData(game.walkSlug);
  if (!data) throw new Error(`No game data for "${game.walkSlug}"`);
  return data;
}

/**
 * Load → apply → save, and try again when another phone saved first. The
 * store refuses a save when the version changed (`conflict`) or when this
 * action id was already saved (`duplicate`: success, nothing to do).
 */
async function commitWithRetry(
  ctx: GameContext,
  code: string,
  playerId: string,
  actionId: string,
  makeAction: (state: PubGameState, definition: PubGameDefinition) => PubGameAction | null,
): Promise<ServiceResult<{ version: number }>> {
  for (let attempt = 0; attempt < MAX_COMMIT_ATTEMPTS; attempt++) {
    const game = await loadGame(ctx, code);
    if (!game) return fail(404, "unknown-game");

    const earlier = await ctx.store.findAction(code, actionId);
    if (earlier !== null) return ok({ version: earlier });

    const { definition, answerKey } = gameDataOf(ctx, game);
    const action = makeAction(game.state, definition);
    if (!action) return fail(400, "invalid-action");

    const result = applyPubGameAction(definition, answerKey, game.state, playerId, action);
    if (!result.ok) return fail(409, result.error);

    const saved = await ctx.store.commitAction({
      code,
      expectedVersion: game.version,
      actionId,
      playerId,
      action,
      state: result.state,
      events: result.events,
    });
    if (saved.status !== "conflict") return ok({ version: saved.version });
  }
  return fail(503, "busy");
}
