import { englishTranslator as t } from "@/i18n/translate";
import { describe, expect, test } from "vitest";
import { poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { formatElapsedTime, getElapsedTime, getSessionStats } from "@/features/walk-session/logic/session-stats";
import { getOrderedLocations } from "@/lib/walk-locations";

describe("session stats", () => {
  const session = createWalkSession({
    walk: poortjesWalk,
    sessionId: "s1",
    startedAt: "2026-09-23T14:00:00.000Z",
  });

  const stops = getOrderedLocations(poortjesWalk);
  const mainStops = stops.filter((location) => !location.isBonus).length;

  test("a new session is at stop 1; optional stops don't count", () => {
    expect(getSessionStats(poortjesWalk, session)).toEqual({
      currentStopNumber: 1,
      totalStops: mainStops,
      solvedStops: 0,
      isAtBonusStop: false,
    });
    expect(mainStops).toBeLessThan(stops.length);
  });

  test("at an optional stop: it keeps the previous number and says so", () => {
    const detour = stops.find((location) => location.isBonus)!;
    const atDetour = { ...session, currentLocationId: detour.id };
    const stats = getSessionStats(poortjesWalk, atDetour);
    expect(stats.isAtBonusStop).toBe(true);
    expect(stats.currentStopNumber).toBe(stops.slice(0, stops.indexOf(detour)).filter((location) => !location.isBonus).length);
  });

  test.each([
    [0, "0m"],
    [5 * 60_000, "5m"],
    [(2 * 60 + 47) * 60_000, "2h 47m"],
  ])("formats %i ms as %s", (milliseconds, expected) => {
    expect(formatElapsedTime(milliseconds, t)).toBe(expected);
  });

  test("uses the completion time once the walk is finished", () => {
    const finished = { ...session, completedAt: "2026-09-23T16:47:00.000Z" };
    expect(getElapsedTime(finished, new Date("2030-01-01"), t)).toBe("2h 47m");
  });
});
