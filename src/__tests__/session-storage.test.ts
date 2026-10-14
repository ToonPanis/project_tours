import { beforeEach, describe, expect, test } from "vitest";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import {
  STORAGE_VERSION,
  localWalkSessionStore,
  parseSavedSession,
  storageKey,
} from "@/features/walk-session/storage/session-storage";
import { reconcileSessionWithWalk } from "@/features/walk-session/logic/reconcile-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getNextStageActions } from "@/features/walk-session/playtest/fast-forward";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

const walk = classicsOfAntwerpWalk;
const session = createWalkSession({ walk, sessionId: "s1", startedAt: "2026-09-23T14:00:00.000Z" });
const firstStopId = session.currentLocationId;
const secondStopId = walk.locations[1].id;

beforeEach(() => window.localStorage.clear());

describe("localWalkSessionStore", () => {
  test("saves and loads a session", () => {
    localWalkSessionStore.save(session);
    expect(localWalkSessionStore.load(walk)).toEqual(session);
  });

  test("returns null when nothing is saved", () => {
    expect(localWalkSessionStore.load(walk)).toBeNull();
  });

  test("clear removes the save", () => {
    localWalkSessionStore.save(session);
    localWalkSessionStore.clear(walk.slug);
    expect(localWalkSessionStore.load(walk)).toBeNull();
  });

  test("ignores broken JSON instead of crashing", () => {
    window.localStorage.setItem(storageKey(walk.slug), "{not json");
    expect(localWalkSessionStore.load(walk)).toBeNull();
  });
});

describe("parseSavedSession", () => {
  test("rejects saves from another storage version", () => {
    expect(parseSavedSession(walk, { version: STORAGE_VERSION + 1, session })).toBeNull();
  });

  test("rejects a save for a different walk", () => {
    expect(parseSavedSession(poortjesWalk, { version: STORAGE_VERSION, session })).toBeNull();
  });

  test("rejects a save that points to a stop that no longer exists", () => {
    const outdated = { ...session, currentLocationId: "removed-stop" };
    expect(parseSavedSession(walk, { version: STORAGE_VERSION, session: outdated })).toBeNull();
  });

  test("accepts a valid save", () => {
    expect(parseSavedSession(walk, { version: STORAGE_VERSION, session })).toEqual(session);
  });
});

// M-04: a damaged save must be rejected (fresh start) instead of crashing the screens.
describe("parseSavedSession: damaged values inside a save", () => {
  /** A save from the middle of a walk, with every optional field filled in. */
  const midWalk: WalkSession = {
    ...session,
    completedAt: "2026-09-23T17:00:00.000Z",
    locations: { ...session.locations, [firstStopId]: { status: "story" } },
  };
  const parse = (value: unknown) => parseSavedSession(walk, { version: STORAGE_VERSION, session: value });

  test("accepts a real mid-walk save (also after a JSON round trip)", () => {
    expect(parse(midWalk)).toEqual(midWalk);
    expect(parse(JSON.parse(JSON.stringify(midWalk)))).toEqual(midWalk);
  });

  test.each([
    ["an unknown stop status", { ...midWalk, locations: { ...midWalk.locations, [firstStopId]: { status: "teleported" } } }],
    ["a stop entry that isn't an object", { ...midWalk, locations: { ...midWalk.locations, [secondStopId]: "solved" } }],
    ["a missing stop entry for the current stop", { ...midWalk, locations: { ...midWalk.locations, [firstStopId]: undefined } }],
    ["a missing session id", { ...midWalk, id: undefined }],
    ["a missing start time", { ...midWalk, startedAt: undefined }],
    ["a non-string completion time", { ...midWalk, completedAt: 12 }],
  ])("rejects %s", (_description, damaged) => {
    expect(parse(damaged)).toBeNull();
  });
});

describe("parseSavedSession: older save versions (migration)", () => {
  /** A guide walk saved by version 3, when sessions still carried the game's fields. */
  function gameShapedSave(statuses: Record<string, string>, extra: Record<string, unknown> = {}) {
    const gameProgress = (status: string) => ({
      status,
      votes: [],
      drinkRoundSkipped: false,
      wasTie: false,
      wrongAttempts: 0,
      hintsRevealed: 0,
      bonusStatus: "unanswered",
      bonusWrongAttempts: 0,
      ...extra,
    });
    return {
      ...session,
      currentLocationId: secondStopId,
      team: { id: "visitor", name: "", players: [{ id: "visitor", name: "You" }] },
      collectedClueIds: [],
      finale: null,
      locations: Object.fromEntries(Object.keys(session.locations).map((id) => [id, gameProgress(statuses[id] ?? "locked")])),
    };
  }

  test("a version 3 save keeps where the walker is and drops the game fields", () => {
    const saved = gameShapedSave({ [firstStopId]: "solved", [secondStopId]: "arrived" }, { answerRevealed: false });
    const loaded = parseSavedSession(walk, { version: 3, session: saved })!;

    expect(loaded.currentLocationId).toBe(secondStopId);
    expect(loaded.locations[firstStopId]).toEqual({ status: "solved" });
    expect(loaded.locations[secondStopId]).toEqual({ status: "arrived" });
    expect(Object.keys(loaded).sort()).toEqual(["currentLocationId", "id", "locations", "startedAt", "walkSlug"]);
  });

  test("a version 2 save (no answerRevealed yet) loads the same way", () => {
    const loaded = parseSavedSession(walk, { version: 2, session: gameShapedSave({ [secondStopId]: "travelling" }) })!;
    expect(loaded.locations[secondStopId]).toEqual({ status: "travelling" });
  });

  test("a game-only status becomes 'arrived' (at the stop, not done yet)", () => {
    const saved = gameShapedSave({ [secondStopId]: "challenge" });
    expect(parseSavedSession(walk, { version: 3, session: saved })!.locations[secondStopId]).toEqual({ status: "arrived" });
  });

  test("a version 1 save (no migration exists) is ignored: fresh start", () => {
    expect(parseSavedSession(walk, { version: 1, session })).toBeNull();
  });
});

// M-04 (decision: merge). A content update during the day must not reset walkers mid-walk.
describe("parseSavedSession: the walk's stops changed since the walk started", () => {
  const parse = (target: Walk, value: WalkSession) => parseSavedSession(target, { version: STORAGE_VERSION, session: value });
  /** A save standing at the first stop, which has arrived and nothing more. */
  const arrived: WalkSession = { ...session, locations: { ...session.locations, [firstStopId]: { status: "arrived" } } };

  test("a new stop is added as not yet visited; the walk continues where it was", () => {
    const newStop = { ...walk.locations[1], id: "classics-new-stop", order: 99 };
    const walkWithNewStop: Walk = { ...walk, locations: [...walk.locations, newStop] };

    const loaded = parse(walkWithNewStop, arrived)!;
    expect(loaded.currentLocationId).toBe(firstStopId);
    expect(loaded.locations[firstStopId].status).toBe("arrived");
    expect(loaded.locations["classics-new-stop"].status).toBe("locked");
  });

  test("a removed stop (not the current one) is dropped", () => {
    const walkWithoutStop: Walk = { ...walk, locations: walk.locations.filter((location) => location.id !== secondStopId) };
    const loaded = parse(walkWithoutStop, arrived)!;
    expect(loaded.locations[secondStopId]).toBeUndefined();
    expect(loaded.locations[firstStopId].status).toBe("arrived");
  });

  test("if the stop the walker is at was removed, the walk starts fresh", () => {
    const walkWithoutCurrent: Walk = { ...walk, locations: walk.locations.filter((location) => location.id !== firstStopId) };
    expect(parse(walkWithoutCurrent, arrived)).toBeNull();
  });

  test("a stop inserted BEFORE the current one is not visited, and the walk still completes", () => {
    // Accepted limitation: the walk only moves forward, the walker already passed that spot.
    const atStopTwo: WalkSession = {
      ...session,
      currentLocationId: secondStopId,
      locations: { ...session.locations, [firstStopId]: { status: "solved" }, [secondStopId]: { status: "travelling" } },
    };
    const inserted = { ...walk.locations[0], id: "classics-inserted", order: walk.locations[0].order + 0.5 };
    const changedWalk: Walk = { ...walk, locations: [...walk.locations, inserted] };

    let state = parse(changedWalk, atStopTwo)!;
    for (let step = 0; step < 200 && !state.completedAt; step++) {
      state = getNextStageActions(state, "2026-09-23T18:00:00.000Z").reduce(
        (current, action) => applySessionAction(changedWalk, current, action),
        state,
      );
    }
    expect(state.completedAt).toBeDefined();
    expect(state.locations["classics-inserted"].status).toBe("locked");
  });

  test("nothing to adapt: the very same object comes back (no extra re-render)", () => {
    expect(reconcileSessionWithWalk(walk, arrived)).toBe(arrived);
  });
});
