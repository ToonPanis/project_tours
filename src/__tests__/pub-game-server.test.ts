import { describe, expect, test } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { parseClientAction } from "@/features/pub-game/logic/client-action";
import type { PlayerView } from "@/features/pub-game/logic/player-view";
import {
  claimPlayerLink,
  createGame,
  createPlayerLink,
  getGameUpdate,
  getLobby,
  joinGame,
  performAction,
  type GameContext,
} from "@/features/pub-game/server/game-service";
import { MemoryGameStore } from "@/features/pub-game/server/memory-store";

// ─── A test server: memory store, predictable ids and time ──────────────────

const START = new Date("2026-10-14T18:00:00.000Z");

function testContext(now = () => START): GameContext {
  let counter = 0;
  return {
    store: new MemoryGameStore(now),
    getGameData: (slug) =>
      slug === "hidden-pubs" ? { definition: pubGameDefinition, answerKey: pubGameAnswerKey } : null,
    random: Math.random,
    newId: () => `id-${++counter}`,
    now,
  };
}

function unwrap<T>(result: { ok: true; data: T } | { ok: false; status: number; error: string }): T {
  if (!result.ok) throw new Error(`Expected success, got ${result.status} ${result.error}`);
  return result.data;
}

const settings = {
  teamNames: ["Red", "Blue"],
  playersPerTeam: 4,
  hostName: "Host",
  hostTeamIndex: 0,
  adultsConfirmed: true,
};

/** A game with the host in Red and Bea in Blue. Returns everyone's cookie secret. */
async function gameWithTwoTeams(ctx = testContext()) {
  const host = unwrap(await createGame(ctx, "hidden-pubs", settings));
  const bea = unwrap(await joinGame(ctx, host.code, null, { name: "Bea", teamId: "t2", adultsConfirmed: true }));
  return { ctx, code: host.code, hostToken: host.token, beaToken: bea.token!, hostId: host.playerId, beaId: bea.playerId };
}

let actionCounter = 0;
/** One tap: a fresh action id each time, unless a test passes its own. */
async function tap(ctx: GameContext, code: string, token: string, action: unknown, actionId = `tap-${String(++actionCounter).padStart(6, "0")}`) {
  return performAction(ctx, code, token, { actionId, action });
}

async function view(ctx: GameContext, code: string, token: string): Promise<PlayerView> {
  const update = unwrap(await getGameUpdate(ctx, code, token, null));
  if (!update.changed) throw new Error("expected a view");
  return update.view;
}

// ─── Creating and joining ───────────────────────────────────────────────────

describe("creating a game", () => {
  test("only adults (D4), valid settings and a known walk", async () => {
    const ctx = testContext();
    expect(await createGame(ctx, "hidden-pubs", { ...settings, adultsConfirmed: false })).toMatchObject({
      ok: false,
      error: "adults-only",
    });
    for (const bad of [
      null,
      { ...settings, teamNames: [] },
      { ...settings, teamNames: Array(11).fill("T") },
      { ...settings, playersPerTeam: 11 },
      { ...settings, playersPerTeam: 0 },
      { ...settings, hostTeamIndex: 2 },
      { ...settings, hostName: " " },
      { ...settings, teamNames: ["Red", 3] },
    ]) {
      expect(await createGame(ctx, "hidden-pubs", bad)).toMatchObject({ ok: false, status: 400 });
    }
    expect(await createGame(ctx, "classics-of-antwerp", settings)).toMatchObject({ ok: false, status: 404 });
  });

  test("a new game has a 6-character code and an open lobby", async () => {
    const ctx = testContext();
    const created = unwrap(await createGame(ctx, "hidden-pubs", settings));
    expect(created.code).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    expect(created.token.length).toBeGreaterThanOrEqual(40);

    expect(unwrap(await getLobby(ctx, created.code))).toEqual({
      phase: "lobby",
      joiningOpen: true,
      playersPerTeam: 4,
      teams: [
        { id: "t1", name: "Red", playerCount: 1 },
        { id: "t2", name: "Blue", playerCount: 0 },
      ],
    });
    expect(await getLobby(ctx, "AAAAAA")).toMatchObject({ ok: false, status: 404 });
    expect(await getLobby(ctx, "not a code")).toMatchObject({ ok: false, status: 404 });
  });
});

describe("joining", () => {
  test("a phone that's already in the game gets its own player back (no duplicates)", async () => {
    const { ctx, code, beaToken, beaId } = await gameWithTwoTeams();
    const again = unwrap(await joinGame(ctx, code, beaToken, { name: "Bea 2", teamId: "t1", adultsConfirmed: true }));
    expect(again).toEqual({ playerId: beaId, token: null });
    expect(unwrap(await getLobby(ctx, code)).teams.map((team) => team.playerCount)).toEqual([1, 1]);
  });

  test("refusals: adults only, full team, unknown game, bad body", async () => {
    const { ctx, code } = await gameWithTwoTeams();
    const join = (body: unknown) => joinGame(ctx, code, null, body);
    expect(await join({ name: "Kid", teamId: "t2", adultsConfirmed: false })).toMatchObject({ error: "adults-only" });
    expect(await join({ name: 3, teamId: "t2", adultsConfirmed: true })).toMatchObject({ status: 400 });
    expect(await join({ name: "Bea", teamId: "t2", adultsConfirmed: true })).toMatchObject({
      status: 409,
      error: "name-taken",
    });
    for (const name of ["C", "D", "E"]) unwrap(await join({ name, teamId: "t2", adultsConfirmed: true }));
    expect(await join({ name: "F", teamId: "t2", adultsConfirmed: true })).toMatchObject({ error: "team-full" });
    expect(await joinGame(ctx, "ZZZZZZ", null, { name: "X", teamId: "t1", adultsConfirmed: true })).toMatchObject({
      status: 404,
    });
  });
});

describe("personal links (late arrivals, new phones)", () => {
  test("only the host makes them; opening one on a phone makes it that player", async () => {
    const { ctx, code, hostToken, beaToken, beaId } = await gameWithTwoTeams();
    expect(await createPlayerLink(ctx, code, beaToken, beaId)).toMatchObject({ status: 403, error: "not-host" });
    expect(await createPlayerLink(ctx, code, null, beaId)).toMatchObject({ status: 401 });
    expect(await createPlayerLink(ctx, code, hostToken, "nobody")).toMatchObject({ status: 404 });

    const { token } = unwrap(await createPlayerLink(ctx, code, hostToken, beaId));
    expect(token).not.toBe(beaToken);
    expect(unwrap(await claimPlayerLink(ctx, code, { token }))).toEqual({ playerId: beaId, token });
    // Bea's new phone sees Bea's game; her old phone still works too.
    expect((await view(ctx, code, token)).me.id).toBe(beaId);
    expect((await view(ctx, code, beaToken)).me.id).toBe(beaId);
  });

  test("a player added by the host after the first card gets in through a link", async () => {
    const { ctx, code, hostToken } = await gameWithTwoTeams();
    await reachPubtask(ctx, code, hostToken);
    expect(await joinGame(ctx, code, null, { name: "Late", teamId: "t2", adultsConfirmed: true })).toMatchObject({
      error: "joining-closed",
    });
    const added = unwrap(await tap(ctx, code, hostToken, { type: "ADD_PLAYER", name: "Late", teamId: "t2" }));
    const late = added.view.players.find((player) => player.name === "Late")!;
    const { token } = unwrap(await createPlayerLink(ctx, code, hostToken, late.id));
    expect((await view(ctx, code, unwrap(await claimPlayerLink(ctx, code, { token })).token)).me.name).toBe("Late");
  });

  test("a made-up or foreign link is refused", async () => {
    const first = await gameWithTwoTeams();
    const second = await gameWithTwoTeams(first.ctx);
    expect(await claimPlayerLink(first.ctx, first.code, { token: "made-up" })).toMatchObject({ status: 404 });
    expect(await claimPlayerLink(first.ctx, first.code, { token: second.beaToken })).toMatchObject({ status: 404 });
    expect(await claimPlayerLink(first.ctx, first.code, { token: 42 })).toMatchObject({ status: 400 });
  });
});

// ─── Playing ────────────────────────────────────────────────────────────────

describe("playing through the service", () => {
  test("a phone without a cookie for this game can't see or do anything", async () => {
    const { ctx, code, beaToken } = await gameWithTwoTeams();
    expect(await getGameUpdate(ctx, code, null, null)).toMatchObject({ status: 401 });
    expect(await getGameUpdate(ctx, code, "made-up", null)).toMatchObject({ status: 401 });
    expect(await tap(ctx, code, "made-up", { type: "ARRIVE" })).toMatchObject({ status: 401 });
    expect(await tap(ctx, "ZZZZZZ", beaToken, { type: "ARRIVE" })).toMatchObject({ status: 404 });
  });

  test("the server draws a random route per team; the host starts", async () => {
    const { ctx, code, hostToken, beaToken } = await gameWithTwoTeams();
    expect(await tap(ctx, code, beaToken, { type: "START_GAME" })).toMatchObject({ status: 409, error: "not-host" });
    // A phone can't send its own route: extra fields are ignored.
    const started = unwrap(await tap(ctx, code, hostToken, { type: "START_GAME", routes: { t1: ["x"] } }));
    expect(started.view.phase).toBe("playing");
    expect(started.view.team.route[0]).toBe(pubGameDefinition.route[0].cafeIds[0]);
    expect(started.view.team.route).toHaveLength(12);
    // Bea sees her own route, never the other team's.
    const beaView = await view(ctx, code, beaToken);
    expect(beaView.team.route).toHaveLength(12);
    expect(JSON.stringify(beaView.otherTeams)).not.toContain("pubs-");
  });

  test("a phone can't choose its own cards: the server offers 10 face-down cards", async () => {
    const { ctx, code, hostToken } = await gameWithTwoTeams();
    unwrap(await tap(ctx, code, hostToken, { type: "START_GAME" }));
    unwrap(await tap(ctx, code, hostToken, { type: "ARRIVE" }));
    unwrap(await tap(ctx, code, hostToken, { type: "DRINKS_DONE" }));

    expect(await tap(ctx, code, hostToken, { type: "OFFER_CARDS", cardIds: ["1-hearts-A"] })).toMatchObject({
      status: 400,
      error: "invalid-action",
    });
    const offered = unwrap(await tap(ctx, code, hostToken, { type: "DRAW_CARDS" }, "draw-once-1"));
    expect(offered.view.team.offeredCardCount).toBe(10);
    expect(JSON.stringify(offered.view)).not.toMatch(/\d-(hearts|diamonds|clubs|spades)-/);

    // The same tap again (a retry) changes nothing; a new tap is refused.
    const retried = unwrap(await tap(ctx, code, hostToken, { type: "DRAW_CARDS" }, "draw-once-1"));
    expect(retried.version).toBe(offered.version);
    expect(await tap(ctx, code, hostToken, { type: "DRAW_CARDS" })).toMatchObject({ error: "card-pending" });

    const picked = unwrap(await tap(ctx, code, hostToken, { type: "PICK_CARD", index: 3 }));
    expect(picked.view.team.currentCard?.cardId).toMatch(/^1-(hearts|diamonds|clubs|spades)-/);
    expect(picked.view.team.cardsLeft).toBe(51);
  });

  test("the same answer tap twice counts once", async () => {
    const { ctx, code, hostToken } = await gameWithTwoTeams();
    await reachPubtask(ctx, code, hostToken);
    const question = pubGameDefinition.cafes[0].questions[0];
    const wrong = question.optionIds.find((id) => id !== pubGameAnswerKey[question.id])!;

    const answer = { type: "ANSWER", questionId: question.id, optionId: wrong };
    unwrap(await tap(ctx, code, hostToken, answer, "same-answer-1"));
    const again = unwrap(await tap(ctx, code, hostToken, answer, "same-answer-1"));
    expect(again.view.answers[question.id].wrongOptionIds).toEqual([wrong]);

    // Before the question is finished, the phone doesn't know the correct option.
    expect(again.view.answers[question.id].correctOptionId).toBeNull();
    const right = unwrap(
      await tap(ctx, code, hostToken, { type: "ANSWER", questionId: question.id, optionId: pubGameAnswerKey[question.id] }),
    );
    expect(right.view.answers[question.id]).toMatchObject({ status: "correct", points: 80 });
    expect(right.view.scores.find((score) => score.scorerId === "t1")?.total).toBe(80);
  });

  test("two phones acting at the same moment: both actions are saved, one after the other", async () => {
    const { ctx, code, hostToken, beaToken } = await gameWithTwoTeams();
    unwrap(await tap(ctx, code, hostToken, { type: "START_GAME" }));
    const before = unwrap(await getGameUpdate(ctx, code, hostToken, null)).version;

    const [hostArrives, beaArrives] = await Promise.all([
      tap(ctx, code, hostToken, { type: "ARRIVE" }),
      tap(ctx, code, beaToken, { type: "ARRIVE" }),
    ]);
    expect(hostArrives.ok && beaArrives.ok).toBe(true);
    const after = unwrap(await getGameUpdate(ctx, code, hostToken, null));
    expect(after.version).toBe(before + 2);
    if (!after.changed) throw new Error("expected a view");
    expect(after.view.team.step).toBe("drinks");
  });

  test("polling: unchanged when nothing happened; new events only for those who may see them", async () => {
    const { ctx, code, hostToken, beaToken, beaId } = await gameWithTwoTeams();
    unwrap(await tap(ctx, code, hostToken, { type: "START_GAME" }));
    const version = unwrap(await getGameUpdate(ctx, code, beaToken, null)).version;
    expect(unwrap(await getGameUpdate(ctx, code, beaToken, version))).toEqual({ changed: false, version });

    // The host draws until an 8 comes up (any card's own events are team-only).
    unwrap(await tap(ctx, code, hostToken, { type: "ARRIVE" }));
    unwrap(await tap(ctx, code, hostToken, { type: "DRINKS_DONE" }));
    unwrap(await tap(ctx, code, hostToken, { type: "DRAW_CARDS" }));
    const picked = unwrap(await tap(ctx, code, hostToken, { type: "PICK_CARD", index: 0 }));
    const card = picked.view.team.currentCard!;

    const beaUpdate = unwrap(await getGameUpdate(ctx, code, beaToken, version));
    if (!beaUpdate.changed) throw new Error("expected changes");
    // Bea (other team) never sees the host's card.
    expect(beaUpdate.events.some((item) => item.event.type === "card-drawn")).toBe(false);
    const hostUpdate = unwrap(await getGameUpdate(ctx, code, hostToken, version));
    if (!hostUpdate.changed) throw new Error("expected changes");
    expect(hostUpdate.events.map((item) => item.event)).toContainEqual(expect.objectContaining({ type: "card-drawn", cardId: card.cardId }));

    // A buddy link is news for everyone.
    if (card.followUp === "choose-buddy") {
      unwrap(await tap(ctx, code, hostToken, { type: "CHOOSE_BUDDY", buddyId: beaId }));
      const latest = unwrap(await getGameUpdate(ctx, code, beaToken, beaUpdate.version));
      if (!latest.changed) throw new Error("expected changes");
      expect(latest.events.map((item) => item.event.type)).toContain("buddies-linked");
    }
  });

  test("a tap returns the events it caused; the buddy in the other team gets them by polling", async () => {
    // random() = 0: the server offers the first 10 cards in deck order, so index 6 is the 8 of hearts.
    const ctx = { ...testContext(), random: () => 0 };
    const { code, hostToken, beaToken, beaId } = await gameWithTwoTeams(ctx);
    unwrap(await tap(ctx, code, hostToken, { type: "START_GAME" }));
    unwrap(await tap(ctx, code, hostToken, { type: "ARRIVE" }));
    unwrap(await tap(ctx, code, hostToken, { type: "DRINKS_DONE" }));
    const beaVersion = unwrap(await getGameUpdate(ctx, code, beaToken, null)).version;
    unwrap(await tap(ctx, code, hostToken, { type: "DRAW_CARDS" }));
    const picked = unwrap(await tap(ctx, code, hostToken, { type: "PICK_CARD", index: 6 }));
    expect(picked.view.team.currentCard).toMatchObject({ cardId: "1-hearts-8", followUp: "choose-buddy" });
    expect(picked.events.map((item) => item.event.type)).toContain("card-drawn");

    const linked = unwrap(
      await performAction(ctx, code, hostToken, {
        actionId: "choose-buddy-1",
        action: { type: "CHOOSE_BUDDY", buddyId: beaId },
        knownVersion: picked.version,
      }),
    );
    expect(linked.events).toEqual([
      { version: picked.version + 1, event: { type: "buddies-linked", playerIds: [linked.view.me.id, beaId], endedPairs: [] } },
    ]);

    // Bea, in the other team, sees the new buddies (not the host's card) on her next poll.
    const beaUpdate = unwrap(await getGameUpdate(ctx, code, beaToken, beaVersion));
    if (!beaUpdate.changed) throw new Error("expected changes");
    expect(beaUpdate.events.map((item) => item.event.type)).toEqual(["buddies-linked"]);

    // When the host drinks (a loser report), Bea drinks along: she gets the popup too.
    unwrap(await tap(ctx, code, hostToken, { type: "REPORT_DRINK", playerId: linked.view.me.id }));
    const afterDrink = unwrap(await getGameUpdate(ctx, code, beaToken, beaUpdate.version));
    if (!afterDrink.changed) throw new Error("expected changes");
    expect(afterDrink.events.map((item) => item.event)).toEqual([
      {
        type: "drink",
        teamId: "t1",
        sips: [
          { playerId: linked.view.me.id, sips: 1, because: "card" },
          { playerId: beaId, sips: 1, because: "buddy" },
        ],
      },
    ]);
  });

  test("games disappear after 7 days (D29)", async () => {
    let now = START;
    const ctx = testContext(() => now);
    const { code } = unwrap(await createGame(ctx, "hidden-pubs", settings));
    now = new Date(START.getTime() + 6 * 24 * 60 * 60 * 1000);
    expect((await getLobby(ctx, code)).ok).toBe(true);
    now = new Date(START.getTime() + 7 * 24 * 60 * 60 * 1000);
    expect(await getLobby(ctx, code)).toMatchObject({ status: 404 });
  });
});

/** Start, arrive, drinks, and the host draws (solving any follow-up), up to the pubtask. */
async function reachPubtask(ctx: GameContext, code: string, token: string) {
  unwrap(await tap(ctx, code, token, { type: "START_GAME" }));
  unwrap(await tap(ctx, code, token, { type: "ARRIVE" }));
  unwrap(await tap(ctx, code, token, { type: "DRINKS_DONE" }));
  unwrap(await tap(ctx, code, token, { type: "DRAW_CARDS" }));
  const { view: afterPick } = unwrap(await tap(ctx, code, token, { type: "PICK_CARD", index: 0 }));
  const followUp = afterPick.team.currentCard?.followUp;
  const other = afterPick.players.find((player) => player.id !== afterPick.me.id)!;
  if (followUp === "choose-buddy") unwrap(await tap(ctx, code, token, { type: "CHOOSE_BUDDY", buddyId: other.id }));
  if (followUp === "write-rule") unwrap(await tap(ctx, code, token, { type: "WRITE_RULE", text: "Left hand only" }));
  if (followUp === "report-loser") unwrap(await tap(ctx, code, token, { type: "REPORT_LOSER", playerId: null }));
  // "choose-target" can't happen: the host is alone in the team.
  expect((await view(ctx, code, token)).team.step).toBe("pubtask");
}

// ─── What a phone may send ──────────────────────────────────────────────────

describe("checking what a phone sends", () => {
  test.each([
    [null],
    ["ARRIVE"],
    [{}],
    [{ type: "HACK" }],
    [{ type: "OFFER_CARDS", cardIds: [] }],
    [{ type: "JOIN", playerId: "x", name: "x", teamId: "t1" }],
    [{ type: "PICK_CARD", index: "0" }],
    [{ type: "PICK_CARD", index: 1.5 }],
    [{ type: "GIVE_SIP", targetId: "<script>" }],
    [{ type: "ANSWER", questionId: "q", optionId: { $ne: 1 } }],
    [{ type: "WRITE_RULE", text: "x".repeat(1000) }],
    [{ type: "REVIEW_EVIDENCE", submissionId: "s", approve: "yes" }],
  ])("refuses %j", (body) => {
    expect(parseClientAction(body)).toBeNull();
  });

  test("accepts valid actions and drops unknown fields", () => {
    expect(parseClientAction({ type: "ARRIVE", extra: 1 })).toEqual({ type: "ARRIVE" });
    expect(parseClientAction({ type: "REPORT_LOSER", playerId: null })).toEqual({ type: "REPORT_LOSER", playerId: null });
    expect(parseClientAction({ type: "REVIEW_EVIDENCE", submissionId: "s1", approve: false, reason: "Blurry" })).toEqual({
      type: "REVIEW_EVIDENCE",
      submissionId: "s1",
      approve: false,
      reason: "Blurry",
    });
  });

  test("an action needs a usable action id", async () => {
    const { ctx, code, hostToken } = await gameWithTwoTeams();
    for (const actionId of [undefined, "", "short", "has spaces in it", "x".repeat(65)]) {
      expect(await performAction(ctx, code, hostToken, { actionId, action: { type: "ARRIVE" } })).toMatchObject({
        status: 400,
        error: "invalid-request",
      });
    }
  });
});
