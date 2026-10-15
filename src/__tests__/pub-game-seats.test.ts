import { describe, expect, test } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { pubGameReveals } from "@/data/walks/hidden-pubs/game/reveals/index.server";
import { createGame, getGameUpdate, getLobby, joinGame, performAction, type GameContext } from "@/features/pub-game/server/game-service";
import { MemoryMediaStore } from "@/features/pub-game/server/media-store";
import { MemoryGameStore } from "@/features/pub-game/server/memory-store";

/**
 * Places paid for (commercial platform P3): a game made with a ticket has a
 * seat limit (the persons on the ticket, the organiser included). Joining and
 * the host adding a player respect it; the game rules themselves don't change.
 */

const START = new Date("2026-10-16T18:00:00.000Z");

function testContext(store = new MemoryGameStore(() => START), idPrefix = "id"): GameContext {
  let counter = 0;
  return {
    store,
    media: new MemoryMediaStore(() => START),
    getGameData: (slug) => (slug === "hidden-pubs" ? { definition: pubGameDefinition, answerKey: pubGameAnswerKey, reveals: pubGameReveals } : null),
    random: Math.random,
    newId: () => `${idPrefix}-${++counter}`,
    now: () => START,
  };
}

function unwrap<T>(result: { ok: true; data: T } | { ok: false; status: number; error: string }): T {
  if (!result.ok) throw new Error(`Expected success, got ${result.status} ${result.error}`);
  return result.data;
}

/** Up to 10 teams of 10: room for everyone, so only the seat limit can stop someone. */
const roomy = {
  teamNames: ["Red", "Blue", "Green"],
  playersPerTeam: 10,
  hostName: "Host",
  hostTeamIndex: 0,
  adultsConfirmed: true,
};

const join = (ctx: GameContext, code: string, name: string, teamId = "t2") => joinGame(ctx, code, null, { name, teamId, adultsConfirmed: true });

describe.each([2, 4, 6, 10])("a group of %i (tickets bought)", (seats) => {
  test(`exactly ${seats} players fit, the organiser included; the next one is told the game is full`, async () => {
    const ctx = testContext();
    const host = unwrap(await createGame(ctx, "hidden-pubs", roomy, { seatLimit: seats }));
    for (let i = 1; i < seats; i++) unwrap(await join(ctx, host.code, `Player ${i}`, i % 2 ? "t2" : "t3"));
    expect(await join(ctx, host.code, "One too many")).toEqual({ ok: false, status: 409, error: "game-full" });
    const lobby = unwrap(await getLobby(ctx, host.code));
    expect(lobby.seats).toEqual({ taken: seats, limit: seats });
    expect(lobby.joiningOpen).toBe(false);
  });
});

describe("seat limit", () => {
  test("two phones taking the last place at the same moment: one gets it", async () => {
    const ctx = testContext();
    const host = unwrap(await createGame(ctx, "hidden-pubs", roomy, { seatLimit: 2 }));
    const results = await Promise.all([join(ctx, host.code, "Ann"), join(ctx, host.code, "Bob")]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.find((result) => !result.ok)).toEqual({ ok: false, status: 409, error: "game-full" });
  });

  test("a phone already in the game can come back (reload, lost connection) even when it's full", async () => {
    const ctx = testContext();
    const host = unwrap(await createGame(ctx, "hidden-pubs", roomy, { seatLimit: 2 }));
    const ann = unwrap(await join(ctx, host.code, "Ann"));
    expect(await joinGame(ctx, host.code, ann.token, { name: "Ann", teamId: "t2", adultsConfirmed: true })).toEqual({ ok: true, data: { playerId: ann.playerId, token: null } });
    expect(await joinGame(ctx, host.code, host.token, {})).toEqual({ ok: true, data: { playerId: host.playerId, token: null } });
  });

  test("the host can't add a late player beyond the places paid for", async () => {
    const ctx = testContext();
    const host = unwrap(await createGame(ctx, "hidden-pubs", roomy, { seatLimit: 2 }));
    unwrap(await join(ctx, host.code, "Ann"));
    const added = await performAction(ctx, host.code, host.token, { actionId: "add-player-0001", action: { type: "ADD_PLAYER", name: "Late", teamId: "t3" } });
    expect(added).toEqual({ ok: false, status: 409, error: "game-full" });
  });

  test("below the limit the host adds a late player as before", async () => {
    const ctx = testContext();
    const host = unwrap(await createGame(ctx, "hidden-pubs", roomy, { seatLimit: 3 }));
    unwrap(await join(ctx, host.code, "Ann"));
    unwrap(await performAction(ctx, host.code, host.token, { actionId: "add-player-0001", action: { type: "ADD_PLAYER", name: "Late", teamId: "t3" } }));
    const update = unwrap(await getGameUpdate(ctx, host.code, host.token, null));
    expect(update.changed && update.view.players.map((player) => player.name)).toEqual(["Host", "Ann", "Late"]);
  });

  test("a game without a ticket (sales closed) has no limit, exactly as before", async () => {
    const ctx = testContext();
    const host = unwrap(await createGame(ctx, "hidden-pubs", roomy));
    for (let i = 1; i <= 12; i++) unwrap(await join(ctx, host.code, `P${i}`, i % 2 ? "t2" : "t3"));
    expect(unwrap(await getLobby(ctx, host.code)).seats).toBeNull();
  });

  test("the limit is kept with the game: a restarted server (same store, new service) still enforces it", async () => {
    const store = new MemoryGameStore(() => START);
    const host = unwrap(await createGame(testContext(store), "hidden-pubs", roomy, { seatLimit: 2 }));
    // A new server instance gets new ids; the game itself comes from the store.
    const afterRestart = testContext(store, "restarted");
    unwrap(await join(afterRestart, host.code, "Ann"));
    expect(await join(afterRestart, host.code, "Bob")).toMatchObject({ error: "game-full" });
  });

  test("an invalid limit is refused (it only ever comes from the server, never from the form)", async () => {
    const ctx = testContext();
    expect(await createGame(ctx, "hidden-pubs", roomy, { seatLimit: 0 })).toEqual({ ok: false, status: 400, error: "invalid-settings" });
    expect(await createGame(ctx, "hidden-pubs", { ...roomy, seatLimit: 1 })).toMatchObject({ ok: true });
    const lobby = unwrap(await getLobby(ctx, unwrap(await createGame(ctx, "hidden-pubs", { ...roomy, seatLimit: 1 })).code));
    // A seatLimit in the body is ignored.
    expect(lobby.seats).toBeNull();
  });
});
