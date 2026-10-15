import { describe, expect, test, vi } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { MAX_PHOTO_BYTES } from "@/features/pub-game/media";
import {
  authorizeBlobUpload,
  createGame,
  deleteExpiredMedia,
  deleteExpiredMediaIfDue,
  resetMediaCleanupClock,
  getGameUpdate,
  joinGame,
  openMedia,
  performAction,
  saveDirectUpload,
  type GameContext,
} from "@/features/pub-game/server/game-service";
import { MemoryMediaStore } from "@/features/pub-game/server/media-store";
import { MemoryGameStore } from "@/features/pub-game/server/memory-store";
import type { CafeStep } from "@/types/pub-game";

/**
 * Evidence photos and videos through the service, with the development
 * (memory) media store: upload checks, linking a file to a task, who may see
 * it, the host's review, and the Blob upload token's conditions.
 */

const NOW = new Date("2026-10-14T18:00:00.000Z");
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);

function testContext(now = () => NOW): GameContext {
  let counter = 0;
  return {
    store: new MemoryGameStore(now),
    media: new MemoryMediaStore(now),
    getGameData: () => ({ definition: pubGameDefinition, answerKey: pubGameAnswerKey }),
    random: () => 0,
    newId: () => `id${++counter}`,
    now,
  };
}

function unwrap<T>(result: { ok: true; data: T } | { ok: false; status: number; error: string }): T {
  if (!result.ok) throw new Error(`${result.status} ${result.error}`);
  return result.data;
}

let tapCount = 0;
const tap = (ctx: GameContext, code: string, token: string, action: unknown) =>
  performAction(ctx, code, token, { actionId: `tap-${String(++tapCount).padStart(6, "0")}`, action });

/** Red: Host + Bea; Blue: Dirk. Started. */
async function game(ctx = testContext()) {
  const host = unwrap(
    await createGame(ctx, "hidden-pubs", {
      teamNames: ["Red", "Blue"],
      playersPerTeam: 4,
      hostName: "Host",
      hostTeamIndex: 0,
      adultsConfirmed: true,
    }),
  );
  const bea = unwrap(await joinGame(ctx, host.code, null, { name: "Bea", teamId: "t1", adultsConfirmed: true }));
  const dirk = unwrap(await joinGame(ctx, host.code, null, { name: "Dirk", teamId: "t2", adultsConfirmed: true }));
  unwrap(await tap(ctx, host.code, host.token, { type: "START_GAME" }));
  return { ctx, code: host.code, host: host.token, bea: bea.token!, dirk: dirk.token!, beaId: bea.playerId, hostId: host.playerId };
}

/** Test shortcut: puts a team straight at a café step (the game rules themselves are tested elsewhere). */
async function jump(ctx: GameContext, code: string, teamIndex: number, cafeId: string, step: CafeStep) {
  const stored = (await ctx.store.getGame(code))!;
  const team = stored.state.teams[teamIndex];
  const index = team.route.indexOf(cafeId);
  team.route.splice(index, 1);
  team.route.splice(team.cafeIndex, 0, cafeId);
  team.step = step;
  await ctx.store.commitAction({
    code,
    expectedVersion: stored.version,
    actionId: `jump-${cafeId}-${step}-${teamIndex}`,
    playerId: "test",
    action: { type: "ARRIVE" },
    state: stored.state,
    events: [],
  });
}

describe("uploading", () => {
  test("only players of the game, for a real task, with the right file type and size", async () => {
    const { ctx, code, bea } = await game();
    await jump(ctx, code, 0, "pubs-de-kat", "bonus");
    expect(unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", JPEG)).mediaId).toMatch(
      new RegExp(`^games/${code}/id\\d+\\.jpg$`),
    );
    expect(await saveDirectUpload(ctx, code, null, "pubs-de-kat-tap", "image/jpeg", JPEG)).toMatchObject({ status: 401 });
    expect(await saveDirectUpload(ctx, code, bea, "made-up", "image/jpeg", JPEG)).toMatchObject({ error: "unknown-task" });
    // A photo task takes no video; no other file types.
    expect(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "video/mp4", JPEG)).toMatchObject({ error: "invalid-media" });
    expect(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "text/html", JPEG)).toMatchObject({ error: "invalid-media" });
    expect(
      await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", new Uint8Array(MAX_PHOTO_BYTES + 1)),
    ).toMatchObject({ error: "too-large" });
    expect(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", new Uint8Array())).toMatchObject({
      error: "too-large",
    });
    // The clog (video) takes no photo.
    await jump(ctx, code, 0, "pubs-den-engel", "bonus");
    expect(await saveDirectUpload(ctx, code, bea, "pubs-den-engel-clog", "image/jpeg", JPEG)).toMatchObject({ error: "invalid-media" });
  });

  test("only for a task the team can send right now (no upload tokens for other cafés or done tasks)", async () => {
    const { ctx, code, bea, dirk, beaId } = await game();
    const clog = JSON.stringify({ taskId: "pubs-den-engel-clog" });
    // Still walking to the first café: nothing to send yet.
    expect(await authorizeBlobUpload(ctx, code, bea, `games/${code}/clip.mp4`, clog)).toMatchObject({ status: 409, error: "wrong-step" });

    await jump(ctx, code, 0, "pubs-de-kat", "bonus");
    // Another café's task, and another team (Dirk's team isn't at De Kat): refused.
    expect(await authorizeBlobUpload(ctx, code, bea, `games/${code}/clip.mp4`, clog)).toMatchObject({ error: "wrong-step" });
    expect(await saveDirectUpload(ctx, code, dirk, "pubs-de-kat-tap", "image/jpeg", JPEG)).toMatchObject({ error: "wrong-step" });

    // Sent once: no new tokens for it, unless the host rejects it (then it may be sent again, D26).
    const tapTask = JSON.stringify({ taskId: "pubs-de-kat-tap" });
    expect((await authorizeBlobUpload(ctx, code, bea, `games/${code}/tap.jpg`, tapTask)).ok).toBe(true);
    const { mediaId } = unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", JPEG));
    unwrap(await tap(ctx, code, bea, { type: "SUBMIT_EVIDENCE", taskId: "pubs-de-kat-tap", mediaId, participantIds: [beaId] }));
    expect(await authorizeBlobUpload(ctx, code, bea, `games/${code}/tap.jpg`, tapTask)).toMatchObject({ error: "task-done" });
  });

  test("the Blob upload token: only for this game's folder and a real task; limits by kind", async () => {
    const { ctx, code, bea } = await game();
    await jump(ctx, code, 0, "pubs-den-engel", "bonus");
    const payload = JSON.stringify({ taskId: "pubs-den-engel-clog" });
    expect(unwrap(await authorizeBlobUpload(ctx, code, bea, `games/${code}/clip.mp4`, payload))).toEqual({
      allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm"],
      maximumSizeInBytes: 75 * 1024 * 1024,
      addRandomSuffix: true,
      validUntil: NOW.getTime() + 10 * 60 * 1000,
    });
    expect(await authorizeBlobUpload(ctx, code, bea, "games/ZZZZZZ/clip.mp4", payload)).toMatchObject({ error: "invalid-media" });
    expect(await authorizeBlobUpload(ctx, code, bea, `games/${code}/../x.mp4`, payload)).toMatchObject({ error: "invalid-media" });
    expect(await authorizeBlobUpload(ctx, code, bea, `games/${code}/sub/clip.mp4`, payload)).toMatchObject({ error: "invalid-media" });
    expect(await authorizeBlobUpload(ctx, code, null, `games/${code}/clip.mp4`, payload)).toMatchObject({ status: 401 });
    expect(await authorizeBlobUpload(ctx, code, bea, `games/${code}/clip.mp4`, "not json")).toMatchObject({ status: 400 });
  });
});

describe("submitting and reviewing", () => {
  test("a file is only accepted when it exists, is this game's and is the right kind", async () => {
    const { ctx, code, bea } = await game();
    await jump(ctx, code, 0, "pubs-de-kat", "bonus");
    const submit = (mediaId: string, taskId = "pubs-de-kat-tap") =>
      tap(ctx, code, bea, { type: "SUBMIT_EVIDENCE", taskId, mediaId, participantIds: [] });

    expect(await submit(`games/${code}/never-uploaded.jpg`)).toMatchObject({ error: "invalid-media" });
    expect(await submit("games/ZZZZZZ/someone-else.jpg")).toMatchObject({ error: "invalid-media" });
    expect(await submit("../../etc/passwd")).toMatchObject({ error: "invalid-media" });
    const { mediaId } = unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", JPEG));
    // Nobody ticked: refused by the game rules.
    expect(await submit(mediaId)).toMatchObject({ status: 409, error: "invalid-target" });
  });

  test("sent → pending (no points) → the host approves → points; only the right people see the file", async () => {
    const { ctx, code, host, bea, dirk, beaId, hostId } = await game();
    await jump(ctx, code, 0, "pubs-de-kat", "bonus");
    const { mediaId } = unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", JPEG));
    const sent = unwrap(
      await tap(ctx, code, bea, { type: "SUBMIT_EVIDENCE", taskId: "pubs-de-kat-tap", mediaId, participantIds: [beaId, hostId] }),
    );
    expect(sent.view.evidence).toEqual([expect.objectContaining({ mediaId, status: "pending", submittedAt: NOW.toISOString() })]);
    expect(sent.view.team.step).toBe("fun-fact");
    expect(sent.view.scores.find((score) => score.scorerId === "t1")?.bonusPoints).toBe(0);

    // Own team and host may see it; the other team not (until the end).
    expect((await openMedia(ctx, code, bea, mediaId)).ok).toBe(true);
    expect((await openMedia(ctx, code, host, mediaId)).ok).toBe(true);
    expect(await openMedia(ctx, code, dirk, mediaId)).toMatchObject({ status: 403 });
    expect(await openMedia(ctx, code, null, mediaId)).toMatchObject({ status: 401 });
    expect(await openMedia(ctx, code, bea, `games/${code}/not-submitted.jpg`)).toMatchObject({ status: 404 });

    const submissionId = sent.view.evidence[0].id;
    expect(await tap(ctx, code, bea, { type: "REVIEW_EVIDENCE", submissionId, approve: true })).toMatchObject({ error: "not-host" });
    const approved = unwrap(await tap(ctx, code, host, { type: "REVIEW_EVIDENCE", submissionId, approve: true }));
    expect(approved.view.scores.find((score) => score.scorerId === "t1")?.bonusPoints).toBe(200);

    unwrap(await tap(ctx, code, host, { type: "END_GAME" }));
    expect((await openMedia(ctx, code, dirk, mediaId)).ok).toBe(true);
    const file = unwrap(await openMedia(ctx, code, dirk, mediaId));
    expect(file.contentType).toBe("image/jpeg");
    expect(new Uint8Array(await new Response(file.stream).arrayBuffer())).toEqual(JPEG);
  });

  test("rejected with a reason; the team sends a new one", async () => {
    const { ctx, code, host, bea, beaId } = await game();
    await jump(ctx, code, 0, "pubs-de-kat", "bonus");
    const first = unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", JPEG));
    const sent = unwrap(
      await tap(ctx, code, bea, { type: "SUBMIT_EVIDENCE", taskId: "pubs-de-kat-tap", mediaId: first.mediaId, participantIds: [beaId] }),
    );
    const submissionId = sent.view.evidence[0].id;
    unwrap(await tap(ctx, code, host, { type: "REVIEW_EVIDENCE", submissionId, approve: false, reason: "Nobody is tapping" }));

    const update = unwrap(await getGameUpdate(ctx, code, bea, null));
    if (!update.changed) throw new Error("expected a view");
    expect(update.view.evidence[0]).toMatchObject({ status: "rejected", rejectionReason: "Nobody is tapping" });

    const second = unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/png", JPEG));
    const resent = unwrap(
      await tap(ctx, code, bea, { type: "SUBMIT_EVIDENCE", taskId: "pubs-de-kat-tap", mediaId: second.mediaId, participantIds: [beaId] }),
    );
    expect(resent.view.evidence.map((item) => item.status)).toEqual(["rejected", "pending"]);
  });

  test("files older than 7 days are deleted by the daily cleanup (D29); newer ones stay", async () => {
    let now = NOW;
    const ctx = testContext(() => now);
    const { code, bea } = await game(ctx);
    await jump(ctx, code, 0, "pubs-de-kat", "bonus");
    const { mediaId: old } = unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", JPEG));
    now = new Date(NOW.getTime() + 3 * 24 * 60 * 60 * 1000);
    const { mediaId: recent } = unwrap(await saveDirectUpload(ctx, code, bea, "pubs-de-kat-tap", "image/jpeg", JPEG));

    now = new Date(NOW.getTime() + 8 * 24 * 60 * 60 * 1000);
    expect(await deleteExpiredMedia(ctx)).toBe(1);
    expect(await ctx.media.info(old)).toBeNull();
    expect(await ctx.media.info(recent)).not.toBeNull();
  });

  test("the safety net after creating a game runs at most once an hour, and never blocks or throws", async () => {
    let now = NOW;
    const ctx = testContext(() => now);
    let runs = 0;
    const media = Object.assign(Object.create(ctx.media) as typeof ctx.media, {
      deleteOlderThan: async () => {
        runs++;
        throw new Error("Blob store down");
      },
    });
    const counted = { ...ctx, media };
    resetMediaCleanupClock();
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    await deleteExpiredMediaIfDue(counted);
    await deleteExpiredMediaIfDue(counted);
    expect(runs).toBe(1);
    now = new Date(NOW.getTime() + 61 * 60 * 1000);
    await deleteExpiredMediaIfDue(counted);
    expect(runs).toBe(2);
    // Logged by error name only (never the message).
    expect(logged).toHaveBeenCalledWith("[Hidden Pubs] media cleanup failed: Error");
  });
});
