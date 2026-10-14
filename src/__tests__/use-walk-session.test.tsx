import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { getPoortjesWalk, poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { useWalkSession } from "@/features/walk-session/state/useWalkSession";
import { localWalkSessionStore, type WalkSessionStore } from "@/features/walk-session/storage/session-storage";
import type { Walk } from "@/types/walk";

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

/** Storage that is unavailable (private mode, blocked site data): nothing is ever saved or found. */
const unavailableStore: WalkSessionStore = { load: () => null, save: () => {}, clear: () => {} };

function renderSession(walk: Walk, store: WalkSessionStore) {
  return renderHook(({ walk: currentWalk }) => useWalkSession(currentWalk, store), {
    initialProps: { walk },
  });
}

/** Starts a game and arrives at the first stop, so there is progress to lose. */
function startAndArrive(result: { current: ReturnType<typeof useWalkSession> }) {
  act(() => result.current.startNewSession());
  act(() => result.current.dispatch({ type: "ARRIVE" }));
  const firstStopId = result.current.session!.currentLocationId;
  expect(result.current.session!.locations[firstStopId].status).toBe("arrived");
  return firstStopId;
}

describe("useWalkSession: switching language keeps the game (M-03)", () => {
  test("keeps the game in memory when storage is unavailable", () => {
    const { result, rerender } = renderSession(poortjesWalk, unavailableStore);
    const firstStopId = startAndArrive(result);
    const sessionId = result.current.session!.id;

    // A language switch re-renders the page with the same walk in another language.
    rerender({ walk: getPoortjesWalk("nl") });

    expect(result.current.session).not.toBeNull();
    expect(result.current.session!.id).toBe(sessionId);
    expect(result.current.session!.locations[firstStopId].status).toBe("arrived");
  });

  test("keeps the game with working storage too", () => {
    const { result, rerender } = renderSession(poortjesWalk, localWalkSessionStore);
    const firstStopId = startAndArrive(result);

    rerender({ walk: getPoortjesWalk("uk") });

    expect(result.current.session!.locations[firstStopId].status).toBe("arrived");
  });

  test("does not read storage again for the same walk in another language", () => {
    const load = vi.fn(() => null);
    const spyStore: WalkSessionStore = { load, save: () => {}, clear: () => {} };
    const { rerender } = renderSession(poortjesWalk, spyStore);
    rerender({ walk: getPoortjesWalk("fr") });
    rerender({ walk: getPoortjesWalk("de") });
    expect(load).toHaveBeenCalledTimes(1);
  });

  test("a kept game that no longer fits the walk's stops (content changed) is not kept", () => {
    const { result, rerender } = renderSession(poortjesWalk, unavailableStore);
    startAndArrive(result);

    // The same walk after a deploy that renamed its first stop.
    const changedWalk: Walk = {
      ...poortjesWalk,
      locations: poortjesWalk.locations.map((location, index) =>
        index === 0 ? { ...location, id: "renamed-stop" } : location,
      ),
    };
    rerender({ walk: changedWalk });

    // Falls back to the saved copy (none here): a fresh start instead of a crash.
    expect(result.current.session).toBeNull();
  });

  test("a content update that adds a stop keeps the game in memory (M-04: merge)", () => {
    const { result, rerender } = renderSession(poortjesWalk, unavailableStore);
    const firstStopId = startAndArrive(result);

    const newStop = { ...poortjesWalk.locations[1], id: "poortjes-new-stop", order: 99 };
    rerender({ walk: { ...poortjesWalk, locations: [...poortjesWalk.locations, newStop] } });

    expect(result.current.session!.locations[firstStopId].status).toBe("arrived");
    expect(result.current.session!.locations["poortjes-new-stop"].status).toBe("locked");
  });

  test("never hands out another walk's game, not even for one render", () => {
    const seen: (string | null)[] = [];
    const { result, rerender } = renderHook(
      ({ walk }) => {
        const controls = useWalkSession(walk, localWalkSessionStore);
        seen.push(controls.session ? controls.session.walkSlug : null);
        return controls;
      },
      { initialProps: { walk: poortjesWalk } },
    );
    startAndArrive(result);
    seen.length = 0;

    rerender({ walk: classicsOfAntwerpWalk });
    expect(seen).not.toContain(poortjesWalk.slug);
  });

  test("a different walk still loads that walk's own saved game", () => {
    const { result, rerender } = renderSession(poortjesWalk, localWalkSessionStore);
    startAndArrive(result);

    rerender({ walk: classicsOfAntwerpWalk });

    // Nothing saved for Classics yet: no Poortjes progress may leak into it.
    expect(result.current.session).toBeNull();
    expect(result.current.isLoaded).toBe(true);
  });
});
