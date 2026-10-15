import type { AnswerKey, PubGameAction, PubGameDefinition, PubGameState } from "@/types/pub-game";
import { MAX_PLAYERS_PER_TEAM, MAX_TEAMS } from "../config";
import { applyPubGameAction, findTask, teamPlayers } from "../logic/apply-action";
import { isValidActionId, parseClientAction, toGameAction } from "../logic/client-action";
import { createPubGame } from "../logic/create-game";
import type { Locale } from "@/i18n/config";
import type { PubGameReveals } from "@/data/walks/hidden-pubs/game/content/types";
import type { ActionResult, CafeReveal, GameUpdate, Lobby } from "../logic/api-types";
import { toPlayerView } from "../logic/player-view";
import { canSeeEvent } from "../logic/visible-events";
import {
  ALLOWED_TYPES,
  extensionFor,
  isAllowedType,
  isMediaIdOfGame,
  maxBytesFor,
  mediaPrefix,
  type EvidenceKind,
} from "../media";
import type { GameStore, StoredGame } from "./game-store";
import type { MediaFile, MediaStore } from "./media-store";

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
  /** Explanations and fun facts per language (server only; they give answers away). */
  reveals?: Partial<Record<Locale, PubGameReveals>>;
}

/** Everything the service needs from outside. Tests pass fakes (fixed time, fixed random numbers). */
export interface GameContext {
  store: GameStore;
  /** Evidence photos and videos (Vercel Blob in production, memory in development). */
  media: MediaStore;
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
/** Before a retry: a short random pause, so phones that collided don't collide again right away. */
const RETRY_PAUSE_MS = 20;

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
  const expiresAt = new Date(createdAt.getTime() + GAME_LIFETIME_MS);
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
      await ctx.store.savePlayerToken(code, hashToken(token), playerId, expiresAt.toISOString());
      return ok({ code, playerId, token });
    }
  }
  return fail(503, "busy");
}

// ─── Deleting old photos and videos (privacy, D29) ──────────────────────────

const GAME_LIFETIME_MS = GAME_LIFETIME_DAYS * 24 * 60 * 60 * 1000;
/** The quick cleanup after creating a game runs at most this often per server instance. */
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
let lastCleanupAt: number | null = null;

/**
 * Deletes the photos and videos older than a game's lifetime (7 days), like
 * MongoDB deletes the games themselves. MongoDB does that on its own (TTL);
 * the Blob store doesn't, so this runs every day (Vercel Cron:
 * /api/cron/media-cleanup) and, as a safety net, after a game is created.
 * Returns how many files were deleted.
 */
export async function deleteExpiredMedia(ctx: GameContext): Promise<number> {
  lastCleanupAt = ctx.now().getTime();
  return ctx.media.deleteOlderThan(new Date(lastCleanupAt - GAME_LIFETIME_MS));
}

/**
 * The safety net (in case the daily job isn't set up): run by POST /api/games
 * AFTER the answer has gone out, so creating a game never waits for it, and at
 * most once an hour per server instance (listing the Blob store costs operations).
 */
export async function deleteExpiredMediaIfDue(ctx: GameContext): Promise<void> {
  if (lastCleanupAt !== null && ctx.now().getTime() - lastCleanupAt < CLEANUP_INTERVAL_MS) return;
  await deleteExpiredMedia(ctx).catch((error: unknown) => {
    console.error(`[Hidden Pubs] media cleanup failed: ${error instanceof Error ? error.name : "unknown error"}`);
  });
}

/** Test helper: as if no cleanup ran on this instance yet. */
export function resetMediaCleanupClock(): void {
  lastCleanupAt = null;
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
  await ctx.store.savePlayerToken(code, hashToken(token), playerId, game.expiresAt);
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
  await ctx.store.savePlayerToken(code, hashToken(token), playerId, game.expiresAt);
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
  if (!isGameCode(code)) return fail(404, "unknown-game");
  // Every phone asks this every 2 seconds, and mostly nothing changed: first only the
  // version (a few bytes), at the same time as the player. The whole game only when needed.
  const [version, playerId] = await Promise.all([ctx.store.getVersion(code), findPlayer(ctx, code, token)]);
  if (version === null) return fail(404, "unknown-game");
  if (!playerId) return fail(401, "not-joined");
  if (since === version) return ok({ changed: false, version });

  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  const data = gameDataOf(ctx, game);
  const events = since === null ? [] : await visibleEventsSince(ctx, game, playerId, since);

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

  // Evidence: the file must exist, belong to this game and be the right kind (photo/video).
  if (clientAction.type === "SUBMIT_EVIDENCE") {
    const game = await loadGame(ctx, code);
    if (!game) return fail(404, "unknown-game");
    const kind = findTask(gameDataOf(ctx, game).definition, clientAction.taskId)?.task.evidence;
    if (!kind) return fail(409, "unknown-task");
    if (!isMediaIdOfGame(clientAction.mediaId, code)) return fail(400, "invalid-media");
    const info = await ctx.media.info(clientAction.mediaId);
    if (!info || !isAllowedType(kind, info.contentType)) return fail(400, "invalid-media");
  }

  const result = await commitWithRetry(ctx, code, playerId, body.actionId, (state, definition) =>
    toGameAction(clientAction, definition, state, playerId, {
      random: ctx.random,
      newId: ctx.newId,
      now: ctx.now().toISOString(),
    }),
  );
  if (!result.ok) return result;

  // The game as this action left it. Only a repeated tap (already saved earlier) needs to read it again.
  const game = result.data.game ?? (await loadGame(ctx, code));
  if (!game) return fail(404, "unknown-game");
  // Every event since the version the phone had (`knownVersion`): this action's and anything
  // other phones did meanwhile. The phone jumps to the newest version, so its next poll
  // won't ask for those again. Phones show each event once (by its version).
  const known = typeof body.knownVersion === "number" && Number.isInteger(body.knownVersion) ? body.knownVersion : null;
  const since = Math.max(0, Math.min(known ?? result.data.version - 1, result.data.version - 1));
  return ok({
    version: game.version,
    view: toPlayerView(gameDataOf(ctx, game).definition, game.state, playerId),
    events: await visibleEventsSince(ctx, game, playerId, since),
  });
}

/**
 * GET /reveal?cafe=…: the explanations of the questions this player (or team)
 * has finished at that café, and the café's fun fact once the team got there.
 * Nothing for a café the team hasn't reached: no peeking at answers.
 */
export async function getReveal(
  ctx: GameContext,
  code: string,
  token: string | null,
  cafeId: string,
  locale: Locale,
): Promise<ServiceResult<CafeReveal>> {
  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  const playerId = await findPlayer(ctx, code, token);
  if (!playerId) return fail(401, "not-joined");

  const { state } = game;
  const player = state.players.find((candidate) => candidate.id === playerId);
  const team = state.teams.find((candidate) => candidate.id === player?.teamId);
  const data = gameDataOf(ctx, game);
  const cafe = data.definition.cafes.find((candidate) => candidate.id === cafeId);
  const cafeIndex = team ? team.route.indexOf(cafeId) : -1;
  if (!team || !cafe || cafeIndex === -1 || cafeIndex > team.cafeIndex) return fail(403, "not-yet");

  const reveals = (data.reveals?.[locale] ?? data.reveals?.en)?.cafes[cafeId];
  const scorerId = state.scoringMode === "player" ? playerId : team.id;
  const finished = (questionId: string) => {
    const status = state.answers[scorerId]?.[questionId]?.status;
    return status === "correct" || status === "revealed";
  };
  const explanations = Object.fromEntries(
    cafe.questions
      .filter((question) => finished(question.id) && reveals?.explanations[question.id])
      .map((question) => [question.id, reveals!.explanations[question.id]]),
  );
  const reachedFunFact =
    cafeIndex < team.cafeIndex || team.finishedAt !== null || team.step === "fun-fact" || state.phase === "finished";
  return ok({ explanations, funFact: reachedFunFact ? (reveals?.funFact ?? null) : null });
}

// ─── Evidence photos and videos ─────────────────────────────────────────────

/** Whether a task needs a photo or a video, or null for an unknown task. */
/**
 * The player of the cookie, and what their file must be for this task. Only
 * when the team may send it right now: the game's own rules are asked with a
 * trial SUBMIT_EVIDENCE (the right café and step, not done yet, or a rejected
 * one sent again: D26). So nobody gets upload tokens for tasks they can't submit.
 */
async function uploader(
  ctx: GameContext,
  code: string,
  token: string | null,
  taskId: unknown,
): Promise<ServiceResult<{ playerId: string; kind: EvidenceKind }>> {
  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  const playerId = await findPlayer(ctx, code, token);
  if (!playerId) return fail(401, "not-joined");
  if (game.state.phase !== "playing") return fail(409, "game-not-started");
  const { definition, answerKey } = gameDataOf(ctx, game);
  const located = typeof taskId === "string" ? findTask(definition, taskId) : null;
  if (!located) return fail(400, "unknown-task");

  const trial = applyPubGameAction(definition, answerKey, game.state, playerId, {
    type: "SUBMIT_EVIDENCE",
    submissionId: "upload-check",
    taskId: located.task.id,
    mediaId: `${mediaPrefix(code)}upload-check.jpg`,
    participantIds: [playerId],
    at: ctx.now().toISOString(),
  });
  if (!trial.ok) return fail(409, trial.error);
  return ok({ playerId, kind: located.task.evidence });
}

/**
 * Development (no Blob store): the phone sends the file itself to /media.
 * Returns the media id to submit with SUBMIT_EVIDENCE.
 */
export async function saveDirectUpload(
  ctx: GameContext,
  code: string,
  token: string | null,
  taskId: string | null,
  contentType: string,
  bytes: Uint8Array,
): Promise<ServiceResult<{ mediaId: string }>> {
  if (ctx.media.uploadMode !== "direct") return fail(400, "use-blob-upload");
  const who = await uploader(ctx, code, token, taskId);
  if (!who.ok) return who;
  if (!isAllowedType(who.data.kind, contentType)) return fail(415, "invalid-media");
  if (bytes.byteLength === 0 || bytes.byteLength > maxBytesFor(who.data.kind)) return fail(413, "too-large");

  const mediaId = `${mediaPrefix(code)}${ctx.newId()}.${extensionFor(contentType)}`;
  await ctx.media.save(mediaId, contentType.split(";")[0].trim().toLowerCase(), bytes);
  return ok({ mediaId });
}

/**
 * Production: before a phone uploads straight to Vercel Blob, our route
 * (handleUpload) asks this: a player of this game, a real task, a path inside
 * this game's folder? The short-lived upload token then only allows that kind
 * of file, up to its size limit.
 */
export async function authorizeBlobUpload(
  ctx: GameContext,
  code: string,
  token: string | null,
  pathname: string,
  clientPayload: string | null,
): Promise<
  ServiceResult<{ allowedContentTypes: string[]; maximumSizeInBytes: number; addRandomSuffix: boolean; validUntil: number }>
> {
  let taskId: unknown = null;
  try {
    taskId = (JSON.parse(clientPayload ?? "{}") as { taskId?: unknown }).taskId;
  } catch {
    return fail(400, "invalid-request");
  }
  const who = await uploader(ctx, code, token, taskId);
  if (!who.ok) return who;
  // The same strict pattern SUBMIT_EVIDENCE checks later: this game's folder, a plain file name.
  if (!isMediaIdOfGame(pathname, code)) return fail(400, "invalid-media");
  return ok({
    allowedContentTypes: ALLOWED_TYPES[who.data.kind],
    maximumSizeInBytes: maxBytesFor(who.data.kind),
    // Blob adds a random part to the name: nobody can guess another file's path.
    addRandomSuffix: true,
    validUntil: ctx.now().getTime() + 10 * 60 * 1000,
  });
}

/**
 * GET a photo or video: only files that belong to a submission of this game,
 * and only for the people who may see that submission: its own team, the host,
 * or everyone once the game is over (the same rule as the player view).
 */
export async function openMedia(
  ctx: GameContext,
  code: string,
  token: string | null,
  mediaId: string,
): Promise<ServiceResult<MediaFile>> {
  const game = await loadGame(ctx, code);
  if (!game) return fail(404, "unknown-game");
  const playerId = await findPlayer(ctx, code, token);
  if (!playerId) return fail(401, "not-joined");
  const player = game.state.players.find((candidate) => candidate.id === playerId);
  const submission = game.state.evidence.find((item) => item.mediaId === mediaId);
  if (!player || !submission || !isMediaIdOfGame(mediaId, code)) return fail(404, "unknown-media");
  const maySee = player.isHost || player.teamId === submission.teamId || game.state.phase === "finished";
  if (!maySee) return fail(403, "not-allowed");

  const file = await ctx.media.open(mediaId);
  return file ? ok(file) : fail(404, "unknown-media");
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
): Promise<ServiceResult<{ version: number; game: StoredGame | null }>> {
  for (let attempt = 0; attempt < MAX_COMMIT_ATTEMPTS; attempt++) {
    if (attempt > 0) await pause(RETRY_PAUSE_MS * attempt * (0.5 + Math.random()));
    // Both at once: the game, and whether this tap was already saved (a retry).
    const [game, earlier] = await Promise.all([loadGame(ctx, code), ctx.store.findAction(code, actionId)]);
    if (!game) return fail(404, "unknown-game");
    if (earlier !== null) return ok({ version: earlier, game: null });

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
    if (saved.status === "committed") {
      return ok({ version: saved.version, game: { ...game, state: result.state, version: saved.version } });
    }
    // Saved by an earlier request with the same id (a retry that crossed this one).
    if (saved.status === "duplicate") return ok({ version: saved.version, game: null });
  }
  return fail(503, "busy");
}

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * The events a phone hasn't had yet (after `since`, up to the game's version), as far as
 * this player may see them. A phone that was away so long that more than
 * MAX_EVENTS_PER_POLL happened gets none: old popups would only confuse, the state is up to date.
 */
async function visibleEventsSince(ctx: GameContext, game: StoredGame, playerId: string, since: number) {
  const stored = await ctx.store.eventsSince(game.code, since, game.version, MAX_EVENTS_PER_POLL + 1);
  if (stored.length > MAX_EVENTS_PER_POLL) return [];
  return stored.filter((item) => canSeeEvent(game.state, playerId, item.event));
}
