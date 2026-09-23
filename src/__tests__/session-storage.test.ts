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
