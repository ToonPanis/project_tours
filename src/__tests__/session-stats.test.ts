import { describe, expect, test } from "vitest";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { walks } from "@/data/walks";
import { checkAnswer } from "@/features/walk-session/logic/answers";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { formatElapsedTime, getElapsedTime, getSessionStats } from "@/features/walk-session/logic/session-stats";
import { getCorrectAnswer } from "@/features/walk-session/playtest/get-correct-answer";

describe("session stats", () => {
  const session = createWalkSession({
    walk: hiddenPubsWalk,
    team: { id: "t", name: "", players: [{ id: "p1", name: "Tony" }] },
    sessionId: "s1",
    startedAt: "2026-09-23T14:00:00.000Z",
  });

  test("a new Hidden Pubs session is at stop 1 of 8 with 0 of 7 clues", () => {
    expect(getSessionStats(hiddenPubsWalk, session)).toEqual({
      currentStopNumber: 1,
      totalStops: 8,
      solvedStops: 0,
      collectedClues: 0,
      totalClues: 7,
      challengesCompleted: 0,
    });
  });

  test.each([
    [0, "0m"],
    [5 * 60_000, "5m"],
    [(2 * 60 + 47) * 60_000, "2h 47m"],
  ])("formats %i ms as %s", (milliseconds, expected) => {
    expect(formatElapsedTime(milliseconds)).toBe(expected);
  });

  test("uses the completion time once the walk is finished", () => {
    const finished = { ...session, completedAt: "2026-09-23T16:47:00.000Z" };
    expect(getElapsedTime(finished, new Date("2030-01-01"))).toBe("2h 47m");
  });
});

describe("playtest 'solve' helper", () => {
  // Also a data check: every challenge's stored answer really solves it.
  for (const walk of walks) {
    for (const location of walk.locations) {
      const challenge = location.challenge;
      if (!challenge) continue;
      test(`${walk.title} · ${location.name}: the stored answer is accepted`, () => {
        expect(checkAnswer(challenge, getCorrectAnswer(challenge))).toBe(true);
      });
    }
  }
});
