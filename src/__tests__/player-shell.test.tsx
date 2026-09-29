import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { getRouteLeg } from "@/features/navigation/logic/route-legs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { getCurrentStop } from "@/features/walk-session/logic/current-stop";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
import { getOrderedLocations } from "@/lib/walk-locations";
import type { SessionAction, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => <div data-testid="walking-map" /> }));

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = () => {};
});
afterEach(cleanup);

const visitor = { id: "visitor", name: "", players: [{ id: "visitor", name: "You" }] };
const start = (walk: Walk) =>
  createWalkSession({ walk, team: visitor, sessionId: "s", startedAt: "2026-09-29T09:00:00.000Z" });
const play = (walk: Walk, session: WalkSession, actions: SessionAction[]) =>
  actions.reduce((state, action) => applySessionAction(walk, state, action), session);

/** Visits the current stop of a guide walk and moves on (optionally skipping an optional next stop). */
const visitAndContinue = (skipBonus = false): SessionAction[] => [
  { type: "ARRIVE" },
  { type: "COMPLETE_VISIT" },
  { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-29T10:00:00.000Z", skipBonus },
];

describe("getCurrentStop (shared by both players)", () => {
  const ordered = getOrderedLocations(poortjesWalk);
  const detourIndex = ordered.findIndex((stop) => stop.isBonus);
  const beforeDetour = ordered[detourIndex - 1];
  const afterDetour = ordered.slice(detourIndex + 1).find((stop) => !stop.isBonus)!;

  function atStopBeforeDetour() {
    let session = start(poortjesWalk);
    for (let index = 0; index < detourIndex - 1; index++) session = play(poortjesWalk, session, visitAndContinue());
    expect(session.currentLocationId).toBe(beforeDetour.id);
    return session;
  }

  test("the next leg is the exact leg from this stop to the next one", () => {
    const stop = getCurrentStop(poortjesWalk, atStopBeforeDetour());
    expect(stop.nextLocation?.id).toBe(ordered[detourIndex].id);
    expect(stop.routeToNext).toBe(getRouteLeg(poortjesWalk, beforeDetour.id, ordered[detourIndex].id)!.route);
  });

  test("after skipping an optional stop, the route comes from where the walker really is (the bypass)", () => {
    const session = play(poortjesWalk, atStopBeforeDetour(), visitAndContinue(true));
    const stop = getCurrentStop(poortjesWalk, session);
    expect(stop.location.id).toBe(afterDetour.id);
    expect(stop.routeToCurrent).toBe(getRouteLeg(poortjesWalk, beforeDetour.id, afterDetour.id)!.route);
  });
});

describe("guide player: a stop without its page is never a dead end (M-16)", () => {
  test("shows the stop name and a way to continue", async () => {
    // A data mistake: the second stop lost its page (validateWalk would flag it in tests).
    const broken: Walk = {
      ...classicsOfAntwerpWalk,
      locations: classicsOfAntwerpWalk.locations.map((stop, index) => (index === 1 ? { ...stop, guide: undefined } : stop)),
    };
    const secondStop = getOrderedLocations(broken)[1];
    localWalkSessionStore.save(play(broken, start(broken), [...visitAndContinue(), { type: "ARRIVE" }]));

    render(<WalkPlayer walk={broken} />);
    fireEvent.click(await screen.findByRole("button", { name: /continue/i }));

    expect(screen.getByRole("heading", { name: secondStop.name })).toBeDefined();
    expect(screen.getByText(/isn't available right now/)).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(localWalkSessionStore.load(broken)!.currentLocationId).not.toBe(secondStop.id); // moved on
  });
});
