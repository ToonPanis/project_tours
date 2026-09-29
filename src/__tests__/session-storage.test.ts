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
import type { WalkSession } from "@/types/session";

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
    collectedClueIds: ["clue-1"],
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
    ["no finale progress for a walk that has a final puzzle", { ...midGame, finale: null }],
  ])("rejects %s", (_description, damaged) => {
    expect(parse(damaged)).toBeNull();
  });
});
