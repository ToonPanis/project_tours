import { describe, expect, test } from "vitest";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { the17GatesWalk } from "@/data/walks/the-17-gates";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { getOrderedLocations } from "@/lib/walk-locations";
import { getCorrectAnswer, getJumpToStopActions } from "@/features/walk-session/playtest/get-correct-answer";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS } from "@/features/walk-session/logic/reveal-answer";
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
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
    ]);
    expect(currentProgress(session).drinkRoundSkipped).toBe(true);
    expect(currentProgress(session).selectedDrinkOptionId).toBeUndefined();
    expect(currentProgress(session).status).toBe("challenge");
  });

  test("the challenge can't be skipped past the drink round without a vote or skip", () => {
    const session = play(hiddenPubsWalk, arrived, [
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
    ]);
    expect(currentProgress(session).status).toBe("voting");
  });
});

describe("challenge and hints", () => {
  // Stop 2 (Den Engel) has a text challenge with two hints.
  function atStop2Challenge(): WalkSession {
    const session = play(hiddenPubsWalk, startSession(hiddenPubsWalk), [
      ...getJumpToStopActions(hiddenPubsWalk, 2, "2026-09-23T14:20:00.000Z"),
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
    ]);
    expect(session.currentLocationId).toBe("pubs-den-engel");
    expect(currentProgress(session).status).toBe("challenge");
    return session;
  }

  test("no hint before the first wrong answer", () => {
    const session = play(hiddenPubsWalk, atStop2Challenge(), [{ type: "REVEAL_HINT" }]);
    expect(currentProgress(session).hintsRevealed).toBe(0);
  });

  test("each wrong answer makes one more hint available", () => {
    let session = play(hiddenPubsWalk, atStop2Challenge(), [
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

  test.each(["11:55", "23:55", "11.55", "Vijf voor twaalf", "5 voor 12"])(
    "the Den Engel clock accepts %j",
    (answer) => {
      const session = play(hiddenPubsWalk, atStop2Challenge(), [{ type: "SUBMIT_ANSWER", answer }]);
      expect(currentProgress(session).status).toBe("solved");
      expect(session.collectedClueIds).toContain("pubs-clue-time");
    },
  );

  // H-02: after 3 wrong answers the team may see the answer, so nobody gets stuck.
  test("the answer can't be revealed before 3 wrong attempts", () => {
    const session = play(hiddenPubsWalk, atStop2Challenge(), [
      { type: "SUBMIT_ANSWER", answer: "wrong" },
      { type: "SUBMIT_ANSWER", answer: "wrong" },
      { type: "REVEAL_ANSWER" },
    ]);
    expect(currentProgress(session).status).toBe("challenge");
    expect(currentProgress(session).answerRevealed).toBe(false);
  });

  test(`after ${REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS} wrong attempts, revealing solves the stop and still gives its clue`, () => {
    const wrongAnswers: SessionAction[] = Array.from({ length: REVEAL_ANSWER_AFTER_WRONG_ATTEMPTS }, () => ({
      type: "SUBMIT_ANSWER",
      answer: "wrong",
    }));
    const session = play(hiddenPubsWalk, atStop2Challenge(), [...wrongAnswers, { type: "REVEAL_ANSWER" }]);
    expect(currentProgress(session).status).toBe("solved");
    expect(currentProgress(session).answerRevealed).toBe(true);
    // The clue is what the final puzzle needs: without it the finale would become the dead end.
    expect(session.collectedClueIds).toContain("pubs-clue-time");

    // The walk goes on as usual.
    const next = play(hiddenPubsWalk, session, [{ type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T15:00:00.000Z" }]);
    expect(next.currentLocationId).toBe("pubs-paters-vaetje");
  });

  test("an empty multiple-choice answer never counts as option A", () => {
    // Rococo (stop 1): multiple choice whose correct option is the first one (index 0).
    const rococo = hiddenPubsWalk.locations[0].challenge!;
    expect(rococo.type === "multiple-choice" && rococo.correctOptionIndex).toBe(0);
    const session = play(hiddenPubsWalk, startSession(hiddenPubsWalk), [
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
      { type: "SUBMIT_ANSWER", answer: "" },
    ]);
    expect(currentProgress(session).status).toBe("challenge");
  });

  test("revealing is ignored outside the challenge step (e.g. a stale double tap)", () => {
    const solved = play(hiddenPubsWalk, atStop2Challenge(), [{ type: "SUBMIT_ANSWER", answer: "11:55" }]);
    expect(play(hiddenPubsWalk, solved, [{ type: "REVEAL_ANSWER" }])).toBe(solved);
  });

  test("the next location only unlocks after continuing from a solved stop", () => {
    const session = atStop2Challenge();
    expect(session.locations["pubs-paters-vaetje"].status).toBe("locked");

    const continuedTooEarly = play(hiddenPubsWalk, session, [
      { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T15:00:00.000Z" },
    ]);
    expect(continuedTooEarly.currentLocationId).toBe("pubs-den-engel");
  });
});

describe("bonus question (Quinten Matsijs)", () => {
  function atSolvedStop6(): WalkSession {
    const session = play(hiddenPubsWalk, startSession(hiddenPubsWalk), [
      ...getJumpToStopActions(hiddenPubsWalk, 6, "2026-09-23T15:00:00.000Z"),
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
      { type: "SUBMIT_ANSWER", answer: "tonspel" },
    ]);
    expect(currentProgress(session).status).toBe("solved");
    return session;
  }

  test("a correct bonus answer is recorded", () => {
    const session = play(hiddenPubsWalk, atSolvedStop6(), [
      { type: "SUBMIT_BONUS_ANSWER", answer: "'t Gulick" },
    ]);
    expect(currentProgress(session).bonusStatus).toBe("solved");
  });

  test("a wrong bonus answer is counted, and the bonus can be skipped", () => {
    const session = play(hiddenPubsWalk, atSolvedStop6(), [
      { type: "SUBMIT_BONUS_ANSWER", answer: "wrong" },
      { type: "SKIP_BONUS" },
    ]);
    expect(currentProgress(session).bonusWrongAttempts).toBe(1);
    expect(currentProgress(session).bonusStatus).toBe("skipped");
  });

  test("the bonus never blocks progress", () => {
    const session = play(hiddenPubsWalk, atSolvedStop6(), [
      { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T15:30:00.000Z" },
    ]);
    expect(session.currentLocationId).toBe("pubs-de-varkenspoot");
  });
});

describe("COMPLETE_VISIT (guide walks)", () => {
  test("completes a stop without a drink round or challenge", async () => {
    const { classicsOfAntwerpWalk } = await import("@/data/walks/classics-of-antwerp");
    let session = startSession(classicsOfAntwerpWalk);
    session = play(classicsOfAntwerpWalk, session, [{ type: "ARRIVE" }, { type: "COMPLETE_VISIT" }]);
    expect(currentProgress(session).status).toBe("solved");
  });

  test("is ignored at a stop that has a challenge", () => {
    const session = play(hiddenPubsWalk, startSession(hiddenPubsWalk), [
      { type: "ARRIVE" },
      { type: "COMPLETE_VISIT" },
    ]);
    expect(currentProgress(session).status).toBe("arrived");
  });
});

describe("full play-through", () => {
  test("Hidden Pubs: 8 cafés and 8 clues open the finale; 3 correct answers complete the walk", () => {
    let session = startSession(hiddenPubsWalk);

    for (const location of getOrderedLocations(hiddenPubsWalk)) {
      const challenge = location.challenge;
      if (!challenge) throw new Error(`${location.name} has no challenge`);

      session = play(hiddenPubsWalk, session, [
        { type: "ARRIVE" },
        { type: "START_VOTING" },
        { type: "CAST_VOTE", playerId: "p1", drinkOptionId: `${location.id}-drink-d` },
        { type: "CAST_VOTE", playerId: "p2", drinkOptionId: `${location.id}-drink-d` },
        { type: "CLOSE_VOTING", winnerOptionId: `${location.id}-drink-d`, wasTie: false },
        { type: "SHOW_STORY" },
        { type: "START_CHALLENGE" },
        { type: "SUBMIT_ANSWER", answer: getCorrectAnswer(challenge) },
      ]);
      expect(session.locations[location.id].status).toBe("solved");
      session = play(hiddenPubsWalk, session, [
        { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T16:30:00.000Z" },
      ]);
    }

    expect(session.collectedClueIds).toHaveLength(8);
    expect(session.finale?.status).toBe("active");
    expect(session.completedAt).toBeUndefined();

    // A wrong finale answer is counted and completes nothing.
    session = play(hiddenPubsWalk, session, [
      { type: "SUBMIT_FINALE_ANSWER", questionId: "pubs-finale-time", answer: "noon", at: "x" },
    ]);
    expect(session.finale?.wrongAttemptsByQuestion["pubs-finale-time"]).toBe(1);

    session = play(hiddenPubsWalk, session, [
      { type: "SUBMIT_FINALE_ANSWER", questionId: "pubs-finale-time", answer: "five to twelve", at: "x" },
      { type: "SUBMIT_FINALE_ANSWER", questionId: "pubs-finale-animal", answer: "Paard", at: "x" },
    ]);
    expect(session.finale?.status).toBe("active");

    session = play(hiddenPubsWalk, session, [
      {
        type: "SUBMIT_FINALE_ANSWER",
        questionId: "pubs-finale-game",
        answer: "barrel game",
        at: "2026-09-23T16:47:00.000Z",
      },
    ]);
    expect(session.finale?.status).toBe("solved");
    expect(session.completedAt).toBe("2026-09-23T16:47:00.000Z");
  });

  test("the final puzzle can't become a dead end: after 3 wrong answers each question can be revealed", () => {
    let session = play(hiddenPubsWalk, startSession(hiddenPubsWalk), getJumpToStopActions(hiddenPubsWalk, 9, "x"));
    expect(session.finale?.status).toBe("active");

    for (const question of hiddenPubsWalk.finale!.questions) {
      const wrong: SessionAction = { type: "SUBMIT_FINALE_ANSWER", questionId: question.id, answer: "noon", at: "x" };
      const reveal: SessionAction = { type: "REVEAL_FINALE_ANSWER", questionId: question.id, at: "2026-09-23T17:00:00.000Z" };

      // Too early: ignored.
      const early = play(hiddenPubsWalk, session, [wrong, wrong, reveal]);
      expect(early.finale?.solvedQuestionIds).not.toContain(question.id);

      session = play(hiddenPubsWalk, session, [wrong, wrong, wrong, reveal]);
      expect(session.finale?.solvedQuestionIds).toContain(question.id);
    }

    expect(session.finale?.status).toBe("solved");
    expect(session.completedAt).toBe("2026-09-23T17:00:00.000Z");
  });

  test("The 17 Gates plays through the same reducer without drink rounds or finale", () => {
    let session = startSession(the17GatesWalk);
    const gateAnswers = ["0", "antwerpen", "2"];

    for (const answer of gateAnswers) {
      session = play(the17GatesWalk, session, [
        { type: "ARRIVE" },
        { type: "START_VOTING" }, // ignored: no drink round here
        { type: "SHOW_STORY" },
        { type: "START_CHALLENGE" },
        { type: "SUBMIT_ANSWER", answer },
        { type: "CONTINUE_TO_NEXT_LOCATION", at: "2026-09-23T16:00:00.000Z" },
      ]);
    }

    expect(session.finale).toBeNull();
    expect(session.completedAt).toBe("2026-09-23T16:00:00.000Z");
    expect(session.collectedClueIds).toEqual([]);
  });

  test("a completed session ignores further actions", () => {
    const completed: WalkSession = {
      ...startSession(hiddenPubsWalk),
      completedAt: "2026-09-23T17:00:00.000Z",
    };
    expect(applySessionAction(hiddenPubsWalk, completed, { type: "ARRIVE" })).toBe(completed);
  });
});
