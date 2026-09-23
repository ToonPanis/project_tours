import { describe, expect, test } from "vitest";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { the17GatesWalk } from "@/data/walks/the-17-gates";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import type { SessionAction, WalkSession } from "@/types/session";
import type { Team } from "@/types/team";
import type { Walk } from "@/types/walk";

const team: Team = {
  id: "team-1",
  name: "The Antwerp Explorers",
  players: [
    { id: "p1", name: "Player 1" },
    { id: "p2", name: "Player 2" },
  ],
};

function startSession(walk: Walk): WalkSession {
  return createWalkSession({ walk, team, sessionId: "s1", startedAt: "2026-09-23T14:00:00.000Z" });
}

/** Applies several actions in a row, like a player tapping through the game. */
function play(walk: Walk, session: WalkSession, actions: SessionAction[]): WalkSession {
  return actions.reduce((state, action) => applySessionAction(walk, state, action), session);
}

function currentProgress(session: WalkSession) {
  return session.locations[session.currentLocationId];
}

describe("createWalkSession", () => {
  test("starts at the first stop with every other stop locked", () => {
    const session = startSession(hiddenPubsWalk);

    expect(session.currentLocationId).toBe("pubs-rococo");
    expect(currentProgress(session).status).toBe("travelling");
    expect(session.locations["pubs-den-engel"].status).toBe("locked");
    expect(session.collectedClueIds).toEqual([]);
  });
});

describe("drink round", () => {
  const arrived = play(hiddenPubsWalk, startSession(hiddenPubsWalk), [
    { type: "ARRIVE" },
    { type: "START_VOTING" },
  ]);

  test("records one vote per player; a new vote replaces the old one", () => {
    const session = play(hiddenPubsWalk, arrived, [
      { type: "CAST_VOTE", playerId: "p1", drinkOptionId: "pubs-rococo-drink-a" },
      { type: "CAST_VOTE", playerId: "p1", drinkOptionId: "pubs-rococo-drink-c" },
    ]);
    expect(currentProgress(session).votes).toEqual([
      { playerId: "p1", drinkOptionId: "pubs-rococo-drink-c" },
    ]);
  });

  test("ignores votes from unknown players or for unknown drinks", () => {
    const session = play(hiddenPubsWalk, arrived, [
      { type: "CAST_VOTE", playerId: "stranger", drinkOptionId: "pubs-rococo-drink-a" },
      { type: "CAST_VOTE", playerId: "p1", drinkOptionId: "not-a-drink" },
    ]);
    expect(currentProgress(session).votes).toEqual([]);
  });

  test("closing the vote selects the winner", () => {
    const session = play(hiddenPubsWalk, arrived, [
      { type: "CAST_VOTE", playerId: "p1", drinkOptionId: "pubs-rococo-drink-a" },
      { type: "CAST_VOTE", playerId: "p2", drinkOptionId: "pubs-rococo-drink-a" },
      { type: "CLOSE_VOTING", winnerOptionId: "pubs-rococo-drink-a", wasTie: false },
    ]);
    expect(currentProgress(session).status).toBe("drink-selected");
    expect(currentProgress(session).selectedDrinkOptionId).toBe("pubs-rococo-drink-a");
  });

  test("rejects a 'winner' that didn't get the most votes", () => {
    const session = play(hiddenPubsWalk, arrived, [
      { type: "CAST_VOTE", playerId: "p1", drinkOptionId: "pubs-rococo-drink-a" },
      { type: "CAST_VOTE", playerId: "p2", drinkOptionId: "pubs-rococo-drink-a" },
      { type: "CLOSE_VOTING", winnerOptionId: "pubs-rococo-drink-b", wasTie: false },
    ]);
    expect(currentProgress(session).status).toBe("voting");
  });

  test("a tie accepts either tied option", () => {
    const session = play(hiddenPubsWalk, arrived, [
      { type: "CAST_VOTE", playerId: "p1", drinkOptionId: "pubs-rococo-drink-a" },
      { type: "CAST_VOTE", playerId: "p2", drinkOptionId: "pubs-rococo-drink-c" },
      { type: "CLOSE_VOTING", winnerOptionId: "pubs-rococo-drink-c", wasTie: true },
    ]);
    expect(currentProgress(session).selectedDrinkOptionId).toBe("pubs-rococo-drink-c");
    expect(currentProgress(session).wasTie).toBe(true);
  });

  test("the round can always be skipped, and the challenge still unlocks", () => {
    const session = play(hiddenPubsWalk, arrived, [
      { type: "SKIP_DRINK_ROUND" },
      { type: "START_CHALLENGE" },
    ]);
    expect(currentProgress(session).drinkRoundSkipped).toBe(true);
    expect(currentProgress(session).selectedDrinkOptionId).toBeUndefined();
    expect(currentProgress(session).status).toBe("challenge");
  });

  test("the challenge can't be skipped past the drink round without a vote or skip", () => {
    const session = play(hiddenPubsWalk, arrived, [{ type: "START_CHALLENGE" }]);
    expect(currentProgress(session).status).toBe("voting");
  });
});

describe("challenge and hints", () => {
  // Stop 3 (Paters Vaetje) has a text challenge with two hints.
  function atStop3Challenge(): WalkSession {
    let session = startSession(hiddenPubsWalk);
    session = play(hiddenPubsWalk, session, [
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "START_CHALLENGE" },
      { type: "SUBMIT_ANSWER", answer: "1" },
      { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T14:20:00.000Z" },
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "START_CHALLENGE" },
      { type: "SUBMIT_ANSWER", answer: "" },
      { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T14:40:00.000Z" },
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "START_CHALLENGE" },
    ]);
    expect(session.currentLocationId).toBe("pubs-paters-vaetje");
    return session;
  }

  test("no hint before the first wrong answer", () => {
    const session = play(hiddenPubsWalk, atStop3Challenge(), [{ type: "REVEAL_HINT" }]);
    expect(currentProgress(session).hintsRevealed).toBe(0);
  });

  test("each wrong answer makes one more hint available", () => {
    let session = play(hiddenPubsWalk, atStop3Challenge(), [
      { type: "SUBMIT_ANSWER", answer: "wrong" },
      { type: "REVEAL_HINT" },
      { type: "REVEAL_HINT" }, // not yet: only one wrong answer so far
    ]);
    expect(currentProgress(session).wrongAttempts).toBe(1);
    expect(currentProgress(session).hintsRevealed).toBe(1);

    session = play(hiddenPubsWalk, session, [
      { type: "SUBMIT_ANSWER", answer: "still wrong" },
      { type: "REVEAL_HINT" },
      { type: "SUBMIT_ANSWER", answer: "wrong again" },
      { type: "REVEAL_HINT" }, // only 2 hints exist
    ]);
    expect(currentProgress(session).hintsRevealed).toBe(2);
  });

  test("a correct answer solves the location and collects its clue", () => {
    const session = play(hiddenPubsWalk, atStop3Challenge(), [
      { type: "SUBMIT_ANSWER", answer: " Ledger " },
    ]);
    expect(currentProgress(session).status).toBe("solved");
    expect(session.collectedClueIds).toContain("pubs-clue-3");
  });

  test("the next location only unlocks after continuing from a solved stop", () => {
    const session = atStop3Challenge();
    expect(session.locations["pubs-de-muze"].status).toBe("locked");

    const continuedTooEarly = play(hiddenPubsWalk, session, [
      { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T15:00:00.000Z" },
    ]);
    expect(continuedTooEarly.currentLocationId).toBe("pubs-paters-vaetje");
  });
});

describe("full play-through", () => {
  const answers: Record<string, string> = {
    "pubs-rococo": "1",
    "pubs-den-engel": "",
    "pubs-paters-vaetje": "ledger",
    "pubs-de-muze": "4",
    "pubs-de-kat": "ledger",
    "pubs-quinten-matsijs": "ledger",
    "pubs-de-varkenspoot": "ledger",
    "pubs-boer-van-tienen": "ledger",
  };

  test("Hidden Pubs: 8 cafés, 7 clues, then the walk is complete", () => {
    let session = startSession(hiddenPubsWalk);

    for (let stop = 0; stop < 8; stop++) {
      const locationId = session.currentLocationId;
      session = play(hiddenPubsWalk, session, [
        { type: "ARRIVE" },
        { type: "START_VOTING" },
        { type: "CAST_VOTE", playerId: "p1", drinkOptionId: `${locationId}-drink-c` },
        { type: "CLOSE_VOTING", winnerOptionId: `${locationId}-drink-c`, wasTie: false },
        { type: "START_CHALLENGE" },
        { type: "SUBMIT_ANSWER", answer: answers[locationId] },
      ]);
      expect(session.locations[locationId].status).toBe("solved");
      session = play(hiddenPubsWalk, session, [
        { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T16:47:00.000Z" },
      ]);
    }

    expect(session.collectedClueIds).toHaveLength(7);
    expect(session.completedAt).toBe("2026-09-23T16:47:00.000Z");
  });

  test("The 17 Gates plays through the same reducer without drink rounds", () => {
    let session = startSession(the17GatesWalk);
    const gateAnswers = ["0", "antwerpen", "2"];

    for (const answer of gateAnswers) {
      session = play(the17GatesWalk, session, [
        { type: "ARRIVE" },
        { type: "START_VOTING" }, // ignored: no drink round here
        { type: "START_CHALLENGE" },
        { type: "SUBMIT_ANSWER", answer },
        { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T16:00:00.000Z" },
      ]);
    }

    expect(session.completedAt).toBe("2026-09-23T16:00:00.000Z");
    expect(session.collectedClueIds).toEqual([]);
  });

  test("a completed session ignores further actions", () => {
    const completed: WalkSession = { ...startSession(hiddenPubsWalk), completedAt: "2026-09-23T17:00:00.000Z" };
    expect(applySessionAction(hiddenPubsWalk, completed, { type: "ARRIVE" })).toBe(completed);
  });
});
