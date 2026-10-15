import { describe, expect, test } from "vitest";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getJumpToStopActions, getNextStageActions } from "@/features/walk-session/playtest/fast-forward";
import { getOrderedLocations } from "@/lib/walk-locations";
import type { SessionAction, WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";

const AT = "2026-09-23T16:00:00.000Z";

function startSession(walk: Walk): WalkSession {
  return createWalkSession({ walk, sessionId: "s1", startedAt: "2026-09-23T14:00:00.000Z" });
}

/** Applies several actions in a row, like a walker tapping through the walk. */
function play(walk: Walk, session: WalkSession, actions: SessionAction[]): WalkSession {
  return actions.reduce((state, action) => applySessionAction(walk, state, action), session);
}

function currentProgress(session: WalkSession) {
  return session.locations[session.currentLocationId];
}

const visitAndContinue = (skipBonus = false): SessionAction[] => [
  { type: "ARRIVE" },
  { type: "COMPLETE_VISIT" },
  { type: "CONTINUE_TO_NEXT_LOCATION", at: AT, skipBonus },
];

const walk = classicsOfAntwerpWalk;
const stops = getOrderedLocations(walk);

describe("createWalkSession", () => {
  test("starts at the first stop with every other stop locked", () => {
    const session = startSession(walk);
    expect(session.currentLocationId).toBe(stops[0].id);
    expect(currentProgress(session).status).toBe("travelling");
    for (const stop of stops.slice(1)) expect(session.locations[stop.id].status).toBe("locked");
  });
});

describe("one stop", () => {
  test("travelling → arrived → solved → the next stop", () => {
    let session = play(walk, startSession(walk), [{ type: "ARRIVE" }]);
    expect(currentProgress(session).status).toBe("arrived");

    session = play(walk, session, [{ type: "COMPLETE_VISIT" }]);
    expect(currentProgress(session).status).toBe("solved");

    session = play(walk, session, [{ type: "CONTINUE_TO_NEXT_LOCATION", at: AT }]);
    expect(session.currentLocationId).toBe(stops[1].id);
    expect(currentProgress(session).status).toBe("travelling");
    expect(session.locations[stops[0].id].status).toBe("solved");
  });

  test("SHOW_STORY (a find-it-yourself task done on site) opens the page; the visit still completes", () => {
    let session = play(walk, startSession(walk), [{ type: "ARRIVE" }, { type: "SHOW_STORY" }]);
    expect(currentProgress(session).status).toBe("story");
    session = play(walk, session, [{ type: "COMPLETE_VISIT" }]);
    expect(currentProgress(session).status).toBe("solved");
  });

  test("actions that don't fit the status are ignored (the very same object comes back)", () => {
    const travelling = startSession(walk);
    expect(applySessionAction(walk, travelling, { type: "SHOW_STORY" })).toBe(travelling);
    expect(applySessionAction(walk, travelling, { type: "COMPLETE_VISIT" })).toBe(travelling);
    expect(applySessionAction(walk, travelling, { type: "CONTINUE_TO_NEXT_LOCATION", at: AT })).toBe(travelling);

    const arrived = play(walk, travelling, [{ type: "ARRIVE" }]);
    // A double tap on "I'm here", or moving on before the visit is complete.
    expect(applySessionAction(walk, arrived, { type: "ARRIVE" })).toBe(arrived);
    expect(applySessionAction(walk, arrived, { type: "CONTINUE_TO_NEXT_LOCATION", at: AT })).toBe(arrived);
  });
});

describe("optional stops", () => {
  const poortjes = getOrderedLocations(poortjesWalk);
  const detourIndex = poortjes.findIndex((stop) => stop.isBonus);
  const beforeDetour = poortjes[detourIndex - 1];
  const afterDetour = poortjes.slice(detourIndex + 1).find((stop) => !stop.isBonus)!;

  function atStopBeforeDetour(): WalkSession {
    let session = startSession(poortjesWalk);
    while (session.currentLocationId !== beforeDetour.id) session = play(poortjesWalk, session, visitAndContinue());
    return session;
  }

  test("the walk has an optional stop to test with", () => {
    expect(detourIndex).toBeGreaterThan(0);
  });

  test("continuing normally goes to the optional stop", () => {
    const session = play(poortjesWalk, atStopBeforeDetour(), visitAndContinue());
    expect(session.currentLocationId).toBe(poortjes[detourIndex].id);
  });

  test("skipping goes past it; the skipped stop stays locked", () => {
    const session = play(poortjesWalk, atStopBeforeDetour(), visitAndContinue(true));
    expect(session.currentLocationId).toBe(afterDetour.id);
    expect(session.locations[poortjes[detourIndex].id].status).toBe("locked");
  });
});

describe("full play-through", () => {
  test("every stop visited completes the walk at the time of the last action", () => {
    let session = startSession(walk);
    for (let index = 0; index < stops.length; index++) session = play(walk, session, visitAndContinue());

    expect(session.completedAt).toBe(AT);
    for (const stop of stops) expect(session.locations[stop.id].status).toBe("solved");
  });

  test("a completed session ignores further actions", () => {
    const completed: WalkSession = { ...startSession(walk), completedAt: AT };
    expect(applySessionAction(walk, completed, { type: "ARRIVE" })).toBe(completed);
  });
});

describe("playtest fast-forward (normal actions only)", () => {
  test("jumping to stop 4 leaves the walker travelling to stop 4", () => {
    const session = play(walk, startSession(walk), getJumpToStopActions(walk, 4, AT));
    expect(session.currentLocationId).toBe(stops[3].id);
    expect(currentProgress(session).status).toBe("travelling");
  });

  test("'next stage' moves one screen forward from every status", () => {
    let session = startSession(walk);
    session = play(walk, session, getNextStageActions(session, AT));
    expect(currentProgress(session).status).toBe("arrived");
    session = play(walk, session, getNextStageActions(session, AT));
    expect(currentProgress(session).status).toBe("solved");
    session = play(walk, session, getNextStageActions(session, AT));
    expect(session.currentLocationId).toBe(stops[1].id);
  });
});
