import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import type { CommitInput, GameStore, StoredGame } from "@/features/pub-game/server/game-store";
import { createGame, getGameUpdate, joinGame, performAction } from "@/features/pub-game/server/game-service";
import { MemoryGameStore } from "@/features/pub-game/server/memory-store";
import { createSql, PostgresGameStore } from "@/features/pub-game/server/postgres-store";

/**
 * The same tests for every GameStore, so the Postgres store is proven to behave
 * exactly like the memory store the other tests use.
 *
 * Postgres only runs when TEST_DATABASE_URL points to a test database:
 *   npm run test:db        (reads TEST_DATABASE_URL from .env.local)
 * It creates the tables if they don't exist and deletes only its own games.
 */

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const runId = Math.random().toString(36).slice(2, 8).toUpperCase();
let codeCounter = 0;
/** Codes no real game can have (real codes have no "_"), so cleanup can't touch real games. */
const newCode = () => `T_${runId}_${++codeCounter}`;

const DAY = 24 * 60 * 60 * 1000;

function storedGame(code: string, expiresInMs = DAY): StoredGame {
  const now = Date.now();
  return {
    code,
    walkSlug: "hidden-pubs",
    state: createPubGame({
      teams: [{ id: "t1", name: "Röd — ёжик" }, { id: "t2", name: "Blue" }],
      playersPerTeam: 4,
      host: { id: "p1", name: "Host", teamId: "t1" },
    }),
    version: 0,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + expiresInMs).toISOString(),
  };
}

function commit(code: string, expectedVersion: number, actionId: string, state: StoredGame["state"]): CommitInput {
  return {
    code,
    expectedVersion,
    actionId,
    playerId: "p1",
    action: { type: "ARRIVE" },
    state,
    events: [{ type: "game-started" }, { type: "player-joined", playerId: "p1" }],
  };
}

type StoreFactory = { name: string; create: () => GameStore; cleanup?: () => Promise<void> };

const factories: StoreFactory[] = [{ name: "memory", create: () => new MemoryGameStore() }];

if (testDatabaseUrl) {
  const sql = createSql(testDatabaseUrl);
  beforeAll(async () => {
    const [{ exists }] = await sql<{ exists: boolean }[]>`SELECT to_regclass('pub_games') IS NOT NULL AS exists`;
    if (!exists) {
      await sql.unsafe(readFileSync(join(process.cwd(), "db", "migrations", "001_pub_games.sql"), "utf8"));
    }
  });
  factories.push({
    name: "postgres",
    create: () => new PostgresGameStore(sql),
    cleanup: async () => {
      await sql`DELETE FROM pub_games WHERE code LIKE ${`T\\_${runId}\\_%`}`;
      await sql.end();
    },
  });
}

describe.each(factories)("$name store", ({ create, cleanup }) => {
  const store = create();
  if (cleanup) afterAll(cleanup);

  test("saves and returns a game; a code can only be used once", async () => {
    const game = storedGame(newCode());
    expect(await store.createGame(game)).toBe(true);
    expect(await store.createGame({ ...game, walkSlug: "other" })).toBe(false);
    // Names with accents and Cyrillic survive the round trip through JSON.
    expect(await store.getGame(game.code)).toEqual(game);
    expect(await store.getGame(newCode())).toBeNull();
  });

  test("an action is saved once, only on the expected version, with its events in order", async () => {
    const game = storedGame(newCode());
    await store.createGame(game);
    const changed = { ...game.state, phase: "playing" as const };

    expect(await store.commitAction(commit(game.code, 0, "action-a", changed))).toEqual({
      status: "committed",
      version: 1,
    });
    // The same action id again (retry): recognised, nothing saved.
    expect(await store.commitAction(commit(game.code, 1, "action-a", game.state))).toEqual({
      status: "duplicate",
      version: 1,
    });
    // Computed from an old version: refused.
    expect(await store.commitAction(commit(game.code, 0, "action-b", game.state))).toEqual({ status: "conflict" });
    expect(await store.commitAction(commit(newCode(), 0, "action-c", game.state))).toEqual({ status: "conflict" });

    const saved = await store.getGame(game.code);
    expect(saved).toMatchObject({ version: 1, state: { phase: "playing" } });
    expect(await store.findAction(game.code, "action-a")).toBe(1);
    expect(await store.findAction(game.code, "action-b")).toBeNull();

    await store.commitAction(commit(game.code, 1, "action-d", changed));
    expect((await store.eventsSince(game.code, 0, 10)).map((item) => [item.version, item.event.type])).toEqual([
      [1, "game-started"],
      [1, "player-joined"],
      [2, "game-started"],
      [2, "player-joined"],
    ]);
    expect(await store.eventsSince(game.code, 1, 10)).toHaveLength(2);
    expect(await store.eventsSince(game.code, 0, 3)).toHaveLength(3);
    expect(await store.eventsSince(game.code, 2, 10)).toEqual([]);
  });

  test("two saves at the same moment: exactly one wins", async () => {
    const game = storedGame(newCode());
    await store.createGame(game);
    const results = await Promise.all([
      store.commitAction(commit(game.code, 0, "same-time-1", game.state)),
      store.commitAction(commit(game.code, 0, "same-time-2", game.state)),
    ]);
    expect(results.map((result) => result.status).sort()).toEqual(["committed", "conflict"]);
    expect((await store.getGame(game.code))?.version).toBe(1);
  });

  test("player tokens: found by hash, only in their own game", async () => {
    const game = storedGame(newCode());
    const other = storedGame(newCode());
    await store.createGame(game);
    await store.createGame(other);
    await store.savePlayerToken(game.code, "hash-1", "p1");
    await store.savePlayerToken(game.code, "hash-1", "p1");
    expect(await store.findPlayerByToken(game.code, "hash-1")).toBe("p1");
    expect(await store.findPlayerByToken(game.code, "hash-2")).toBeNull();
    expect(await store.findPlayerByToken(other.code, "hash-1")).toBeNull();
  });

  test("an expired game is gone, with its players", async () => {
    const game = storedGame(newCode(), -1000);
    await store.createGame(game);
    await store.savePlayerToken(game.code, "hash-1", "p1");
    expect(await store.getGame(game.code)).toBeNull();
    expect(await store.findPlayerByToken(game.code, "hash-1")).toBeNull();
  });

  test("a short game through the service: create, join, start, answer", async () => {
    let counter = 0;
    const ctx = {
      store,
      getGameData: () => ({ definition: pubGameDefinition, answerKey: pubGameAnswerKey }),
      random: Math.random,
      newId: () => `${runId}-id-${++counter}`,
      now: () => new Date(),
    };
    const host = await createGame(ctx, "hidden-pubs", {
      teamNames: ["Red", "Blue"],
      playersPerTeam: 2,
      hostName: "Host",
      hostTeamIndex: 0,
      adultsConfirmed: true,
    });
    if (!host.ok) throw new Error(host.error);
    const { code, token } = host.data;
    const bea = await joinGame(ctx, code, null, { name: "Bea", teamId: "t2", adultsConfirmed: true });
    expect(bea.ok).toBe(true);

    const run = async (actionId: string, action: unknown) => {
      const result = await performAction(ctx, code, token, { actionId: `${runId}-${actionId}`, action });
      if (!result.ok) throw new Error(`${actionId}: ${result.error}`);
      return result.data.view;
    };
    await run("start", { type: "START_GAME" });
    await run("arrive", { type: "ARRIVE" });
    await run("drinks", { type: "DRINKS_DONE" });
    await run("draw", { type: "DRAW_CARDS" });
    const afterPick = await run("pick", { type: "PICK_CARD", index: 0 });
    expect(afterPick.team.cardsLeft).toBe(51);

    const update = await getGameUpdate(ctx, code, token, 0);
    if (!update.ok || !update.data.changed) throw new Error("expected changes");
    expect(update.data.events.map((item) => item.event.type)).toContain("card-drawn");

    // The service's cleanup can't happen here (real-looking code), so remove it ourselves.
    if (store instanceof PostgresGameStore) {
      const sql = createSql(testDatabaseUrl!);
      await sql`DELETE FROM pub_games WHERE code = ${code}`;
      await sql.end();
    }
  });
});

test.skipIf(Boolean(testDatabaseUrl))("Postgres store tests are skipped: set TEST_DATABASE_URL to run them", () => {
  expect(testDatabaseUrl).toBeUndefined();
});
