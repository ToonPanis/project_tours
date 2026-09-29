import { beforeEach, describe, expect, test } from "vitest";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { the17GatesWalk } from "@/data/walks/the-17-gates";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import {
  STORAGE_VERSION,
  localWalkSessionStore,
  parseSavedSession,
  storageKey,
} from "@/features/walk-session/storage/session-storage";
import { reconcileSessionWithWalk } from "@/features/walk-session/logic/reconcile-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getNextStageActions } from "@/features/walk-session/playtest/get-correct-answer";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

const session = createWalkSession({
  walk: hiddenPubsWalk,
  team: { id: "t", name: "", players: [{ id: "p1", name: "Tony" }] },
  sessionId: "s1",
  startedAt: "2026-09-23T14:00:00.000Z",
});

beforeEach(() => window.localStorage.clear());

describe("localWalkSessionStore", () => {
  test("saves and loads a session", () => {
    localWalkSessionStore.save(session);
    expect(localWalkSessionStore.load(hiddenPubsWalk)).toEqual(session);
  });

  test("returns null when nothing is saved", () => {
    expect(localWalkSessionStore.load(hiddenPubsWalk)).toBeNull();
  });

  test("clear removes the save", () => {
    localWalkSessionStore.save(session);
    localWalkSessionStore.clear(hiddenPubsWalk.slug);
    expect(localWalkSessionStore.load(hiddenPubsWalk)).toBeNull();
  });

  test("ignores broken JSON instead of crashing", () => {
    window.localStorage.setItem(storageKey(hiddenPubsWalk.slug), "{not json");
    expect(localWalkSessionStore.load(hiddenPubsWalk)).toBeNull();
  });
});

describe("parseSavedSession", () => {
  test("rejects saves from another storage version", () => {
    expect(parseSavedSession(hiddenPubsWalk, { version: STORAGE_VERSION + 1, session })).toBeNull();
  });

  test("rejects a save for a different walk", () => {
    expect(parseSavedSession(the17GatesWalk, { version: STORAGE_VERSION, session })).toBeNull();
  });

  test("rejects a save that points to a stop that no longer exists", () => {
    const outdated = { ...session, currentLocationId: "removed-stop" };
    expect(parseSavedSession(hiddenPubsWalk, { version: STORAGE_VERSION, session: outdated })).toBeNull();
  });

  test("accepts a valid save", () => {
    expect(parseSavedSession(hiddenPubsWalk, { version: STORAGE_VERSION, session })).toEqual(session);
  });
});

// M-04: a damaged save must be rejected (fresh start) instead of crashing the game screens.
describe("parseSavedSession: damaged values inside a save", () => {
  const firstStopId = session.currentLocationId;
  const firstStop = session.locations[firstStopId];

  /** A save from the middle of a real game: every optional field filled in. */
  const midGame: WalkSession = {
    ...session,
    completedAt: "2026-09-23T17:00:00.000Z",
    collectedClueIds: [hiddenPubsWalk.clues![0].id],
    locations: {
      ...session.locations,
      [firstStopId]: {
        ...firstStop,
        status: "drink-selected",
        votes: [{ playerId: "p1", drinkOptionId: "d1" }],
        selectedDrinkOptionId: "d1",
        wasTie: true,
        wrongAttempts: 3,
        hintsRevealed: 2,
        bonusStatus: "skipped",
        bonusWrongAttempts: 1,
      },
    },
    finale: { status: "active", solvedQuestionIds: ["q1"], wrongAttemptsByQuestion: { q2: 2 } },
  };
  const parse = (value: unknown) => parseSavedSession(hiddenPubsWalk, { version: STORAGE_VERSION, session: value });
  /** The mid-game save with one stop's progress changed. */
  const withFirstStop = (changes: Record<string, unknown>) => ({
    ...midGame,
    locations: { ...midGame.locations, [firstStopId]: { ...midGame.locations[firstStopId], ...changes } },
  });

  test("accepts a real mid-game save (also after a JSON round trip)", () => {
    expect(parse(midGame)).toEqual(midGame);
    expect(parse(JSON.parse(JSON.stringify(midGame)))).toEqual(midGame);
  });

  test.each([
    ["an unknown stop status", withFirstStop({ status: "teleported" })],
    ["votes that aren't a list", withFirstStop({ votes: "none" })],
    ["a malformed vote", withFirstStop({ votes: [{ playerId: 1 }] })],
    ["a negative attempt count", withFirstStop({ wrongAttempts: -1 })],
    ["a non-number hint count", withFirstStop({ hintsRevealed: "2" })],
    ["a missing flag", withFirstStop({ drinkRoundSkipped: undefined })],
    ["an unknown bonus status", withFirstStop({ bonusStatus: "maybe" })],
    ["a missing stop entry", { ...midGame, locations: { ...midGame.locations, [firstStopId]: undefined } }],
    ["an unknown finale status", { ...midGame, finale: { ...midGame.finale, status: "done" } }],
    ["a malformed finale attempt count", { ...midGame, finale: { ...midGame.finale, wrongAttemptsByQuestion: { q2: "x" } } }],
    ["clue ids that aren't strings", { ...midGame, collectedClueIds: [1] }],
    ["a player without a name", { ...midGame, team: { ...midGame.team, players: [{ id: "p1" }] } }],
    ["a team without a name", { ...midGame, team: { id: "t", players: midGame.team.players } }],
    ["a missing session id", { ...midGame, id: undefined }],
    ["a non-string completion time", { ...midGame, completedAt: 12 }],
    ["a missing answerRevealed flag in a current-version save", withFirstStop({ answerRevealed: undefined })],
  ])("rejects %s", (_description, damaged) => {
    expect(parse(damaged)).toBeNull();
  });
});

describe("parseSavedSession: older save versions (migration)", () => {
  test("a version 2 save (before 'show the answer') still loads, with answerRevealed: false", () => {
    // A copy of the save as version 2 wrote it: no answerRevealed on any stop.
    const v2Session = JSON.parse(JSON.stringify(session)) as { locations: Record<string, Record<string, unknown>> };
    for (const progress of Object.values(v2Session.locations)) delete progress.answerRevealed;

    const loaded = parseSavedSession(hiddenPubsWalk, { version: 2, session: v2Session });
    expect(loaded).not.toBeNull();
    expect(Object.values(loaded!.locations).every((progress) => progress.answerRevealed === false)).toBe(true);
    expect(loaded!.currentLocationId).toBe(session.currentLocationId);
  });

  test("a version 1 save (no migration exists) is ignored: fresh start", () => {
    expect(parseSavedSession(hiddenPubsWalk, { version: 1, session })).toBeNull();
  });
});

// M-04 (decision: merge). A content update during the day must not reset groups mid-walk.
describe("parseSavedSession: the walk's stops changed since the game started", () => {
  const firstStopId = session.currentLocationId;
  const parse = (walk: Walk, value: WalkSession) => parseSavedSession(walk, { version: STORAGE_VERSION, session: value });
  /** A save standing at the first stop, which has arrived and solved nothing yet. */
  const arrived: WalkSession = {
    ...session,
    locations: { ...session.locations, [firstStopId]: { ...session.locations[firstStopId], status: "arrived" } },
  };

  test("a new stop is added as not yet visited; the game continues where it was", () => {
    const newStop = { ...hiddenPubsWalk.locations[1], id: "pubs-new-stop", order: 99 };
    const walkWithNewStop: Walk = { ...hiddenPubsWalk, locations: [...hiddenPubsWalk.locations, newStop] };

    const loaded = parse(walkWithNewStop, arrived)!;
    expect(loaded.currentLocationId).toBe(firstStopId);
    expect(loaded.locations[firstStopId].status).toBe("arrived");
    expect(loaded.locations["pubs-new-stop"].status).toBe("locked");
  });

  test("a removed stop (not the current one) is dropped, and so is the clue it gave", () => {
    const removedId = hiddenPubsWalk.locations[1].id;
    const removedClueIds = (hiddenPubsWalk.clues ?? []).filter((clue) => clue.sourceLocationId === removedId).map((clue) => clue.id);
    expect(removedClueIds.length).toBeGreaterThan(0);
    const walkWithoutStop: Walk = {
      ...hiddenPubsWalk,
      locations: hiddenPubsWalk.locations.filter((location) => location.id !== removedId),
      clues: (hiddenPubsWalk.clues ?? []).filter((clue) => clue.sourceLocationId !== removedId),
    };
    const withClue: WalkSession = { ...arrived, collectedClueIds: [...removedClueIds] };

    const loaded = parse(walkWithoutStop, withClue)!;
    expect(loaded.locations[removedId]).toBeUndefined();
    expect(loaded.collectedClueIds).toEqual([]);
    expect(loaded.locations[firstStopId].status).toBe("arrived");
  });

  test("if the stop the team is at was removed, the game starts fresh", () => {
    const walkWithoutCurrent: Walk = {
      ...hiddenPubsWalk,
      locations: hiddenPubsWalk.locations.filter((location) => location.id !== firstStopId),
    };
    expect(parse(walkWithoutCurrent, arrived)).toBeNull();
  });

  test("a walk that gained a final puzzle gets one, locked until the last stop", () => {
    const loaded = parse(hiddenPubsWalk, { ...arrived, finale: null })!;
    expect(loaded.finale).toEqual({ status: "locked", solvedQuestionIds: [], wrongAttemptsByQuestion: {} });
  });

  test("a stop inserted BEFORE the current one is not visited, and the walk still completes", () => {
    // Accepted limitation: the walk only moves forward, the group already passed that spot.
    const stopTwo = session.locations[hiddenPubsWalk.locations[1].id];
    const atStopTwo: WalkSession = {
      ...session,
      currentLocationId: hiddenPubsWalk.locations[1].id,
      locations: {
        ...session.locations,
        [firstStopId]: { ...session.locations[firstStopId], status: "solved" },
        [hiddenPubsWalk.locations[1].id]: { ...stopTwo, status: "travelling" },
      },
    };
    const inserted = { ...hiddenPubsWalk.locations[0], id: "pubs-inserted", order: hiddenPubsWalk.locations[0].order + 0.5 };
    const changedWalk: Walk = { ...hiddenPubsWalk, locations: [...hiddenPubsWalk.locations, inserted] };

    let state = parse(changedWalk, atStopTwo)!;
    for (let step = 0; step < 200 && !state.completedAt; step++) {
      state = getNextStageActions(changedWalk, state, "2026-09-23T18:00:00.000Z").reduce(
        (current, action) => applySessionAction(changedWalk, current, action),
        state,
      );
    }
    expect(state.completedAt).toBeDefined();
    expect(state.locations["pubs-inserted"].status).toBe("locked");
  });

  test("a completed game doesn't get a new final puzzle", () => {
    const completed: WalkSession = { ...arrived, finale: null, completedAt: "2026-09-23T18:00:00.000Z" };
    expect(parse(hiddenPubsWalk, completed)!.finale).toBeNull();
  });

  test("nothing to adapt: the very same object comes back (no extra re-render)", () => {
    expect(reconcileSessionWithWalk(hiddenPubsWalk, arrived)).toBe(arrived);
  });
});
