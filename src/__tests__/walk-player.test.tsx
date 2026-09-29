import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { getVerificationLabel } from "@/features/walk-session/components/ContentBlockView";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { getCorrectAnswer, getJumpToStopActions } from "@/features/walk-session/playtest/get-correct-answer";
import { englishTranslator } from "@/i18n/translate";
import { getOrderedLocations } from "@/lib/walk-locations";
import { localWalkSessionStore, storageKey } from "@/features/walk-session/storage/session-storage";
import type { Challenge } from "@/types/challenge";
import type { StoryBlock } from "@/types/content";
import type { WalkLocation } from "@/types/location";
import type { SessionAction } from "@/types/session";
import { revealedIn } from "./fixtures/hidden-stop";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: () => <div data-testid="walking-map" />,
}));

beforeEach(() => {
  window.localStorage.clear();
  // jsdom doesn't implement scrolling; the game screens call it on every change.
  window.scrollTo = () => {};
});
afterEach(cleanup);

// Every expected text comes from the walk data or the English UI texts, so
// researchers can correct the content without breaking these tests.
const walk = hiddenPubsWalk;
const t = englishTranslator;
const copy = getWalkCopy(walk, t);
const stops = getOrderedLocations(walk);
const clues = walk.clues ?? [];

function stop(id: string): WalkLocation {
  const location = stops.find((candidate) => candidate.id === id);
  if (!location) throw new Error(`Unknown stop ${id}`);
  return location;
}

/** The value of the clue earned at a stop. */
function clueValueOf(location: WalkLocation): string {
  const clue = clues.find((candidate) => candidate.sourceLocationId === location.id);
  if (!clue) throw new Error(`${location.id} has no clue`);
  return clue.value;
}

/** The ledger (story) blocks of a stop. */
function storyBlocks(location: WalkLocation): StoryBlock[] {
  return location.content.filter((block): block is StoryBlock => block.kind === "story");
}

/** Matches text containing `text` literally (like a regex, but safe for any character). */
function containing(text: string): RegExp {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

/** Testing Library collapses whitespace in the page; do the same for multi-line data texts. */
function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** The research badge a challenge shows, if any. */
function researchBadge(challenge: Challenge): string | null {
  if (!challenge.researchStatus) return null;
  return challenge.researchStatus === "on-site-verification-required"
    ? t("game.challenge.onSiteVerification")
    : t("game.challenge.researchRequired");
}

function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

/** Saves a two-player session advanced by `actions`, as if played earlier. */
function saveSessionAfter(actions: SessionAction[]) {
  const start = createWalkSession({
    walk,
    team: {
      id: "t",
      name: "The Antwerp Explorers",
      players: [
        { id: "player-1", name: "Tony" },
        { id: "player-2", name: "Sarah" },
      ],
    },
    sessionId: "s",
    startedAt: "2026-09-23T14:00:00.000Z",
  });
  const session = actions.reduce((state, action) => applySessionAction(walk, state, action), start);
  localWalkSessionStore.save(session);
  return session;
}

/** Renders the player and continues the saved walk. */
async function continueSavedWalk() {
  render(<WalkPlayer walk={walk} />);
  await screen.findByRole("button", { name: t("game.start.continueWalk") });
  click(t("game.start.continueWalk"));
}

/** Start a new game with two players and walk to the first vote. */
async function startTwoPlayerGameAndStartVote() {
  render(<WalkPlayer walk={walk} />);
  // The saved game is loaded after the first render, so wait for the start screen.
  await screen.findByRole("button", { name: t("game.start.newAdventure") });
  click(t("game.start.newAdventure"));
  click("2");
  const [teamName, player1, player2] = screen.getAllByRole("textbox");
  fireEvent.change(teamName, { target: { value: "The Antwerp Explorers" } });
  fireEvent.change(player1, { target: { value: "Tony" } });
  fireEvent.change(player2, { target: { value: "Sarah" } });
  click(t("game.team.startAdventure"));
  click(t("game.intro.begin"));

  expect(screen.getByRole("heading", { level: 1, name: stops[0].name })).toBeDefined();
  expect(screen.getByText(t("game.header.stopCounter", { current: 1, total: stops.length }))).toBeDefined();
  click(t("gps.continueWithoutGps"));
  click(t("gps.arrived"));
  click(t("game.arrived.startVote"));
}

describe("WalkPlayer: Hidden Pubs", () => {
  test("pass-the-phone voting shows four options and keeps each vote secret", async () => {
    const options = stops[0].drinkRound!.options;
    const tonysDrink = options.find((option) => option.alcoholic)!;
    await startTwoPlayerGameAndStartVote();

    expect(screen.getByText(t("game.voting.playerTurn", { name: "Tony" }))).toBeDefined();
    expect(screen.getAllByRole("radio")).toHaveLength(options.length);
    fireEvent.click(screen.getByLabelText(containing(tonysDrink.name)));
    click(t("game.voting.confirm"));

    // Pass screen: the next player, and no trace of Tony's choice.
    expect(screen.getByRole("heading", { name: t("game.voting.passPhone", { name: "Sarah" }) })).toBeDefined();
    expect(document.body.textContent).not.toContain(tonysDrink.name);

    click(t("game.voting.iAm", { name: "Sarah" }));
    expect(screen.getByText(t("game.voting.playerTurn", { name: "Sarah" }))).toBeDefined();
    // Nothing is preselected for the next player.
    expect(screen.getByRole("button", { name: t("game.voting.confirm") }).hasAttribute("disabled")).toBe(true);
  });

  test("plays the first café: vote, story, challenge with hint, history, clue, next café", async () => {
    const first = stops[0];
    const second = stops[1];
    const challenge = first.challenge!;
    if (challenge.type !== "multiple-choice") throw new Error("The first café needs a multiple-choice challenge");
    const correctOption = challenge.options[challenge.correctOptionIndex];
    const wrongOption = challenge.options.find((_, index) => index !== challenge.correctOptionIndex)!;
    const alcoholFree = first.drinkRound!.options.find((option) => !option.alcoholic)!;
    const [chapter, ...laterBlocks] = storyBlocks(first);
    const revealedAfterSolving = laterBlocks.find((block) => block.revealAt === "solved")!;

    await startTwoPlayerGameAndStartVote();

    fireEvent.click(screen.getByLabelText(containing(alcoholFree.name)));
    click(t("game.voting.confirm"));
    click(t("game.voting.iAm", { name: "Sarah" }));
    fireEvent.click(screen.getByLabelText(containing(alcoholFree.name)));
    click(t("game.voting.confirm"));

    // Result
    expect(screen.getByRole("heading", { name: copy.voteResultTitle })).toBeDefined();
    expect(screen.getByText(t.plural("game.result.votesCounted", 2))).toBeDefined();
    click(t("common.continue"));

    // Story: fiction only, no history before the challenge.
    expect(screen.getByText(chapter.chapterTitle!)).toBeDefined();
    expect(screen.getAllByText(t("game.content.story")).length).toBeGreaterThan(0);
    expect(screen.queryByText(containing(t("game.content.history")))).toBeNull();
    click(t("game.story.toChallenge"));

    // Challenge: a wrong answer, a hint, then the right answer.
    const badge = researchBadge(challenge);
    if (badge) {
      expect(screen.getByText(badge)).toBeDefined();
    } else {
      expect(screen.queryByText(t("game.challenge.onSiteVerification"))).toBeNull();
      expect(screen.queryByText(t("game.challenge.researchRequired"))).toBeNull();
    }
    click(containing(wrongOption));
    expect(screen.getByText(copy.wrongAnswer)).toBeDefined();
    click(t("game.challenge.needHint"));
    expect(screen.getByText(containing(t("game.challenge.hint", { number: 1 }).trim()))).toBeDefined();
    click(containing(correctOption));

    // Correct → history → clue → next café
    expect(screen.getByRole("heading", { name: copy.correctAnswer })).toBeDefined();
    click(t("game.solved.discoverWhy"));
    expect(screen.getByText(getVerificationLabel(first.historicalReveal!.status, t))).toBeDefined();
    click(t("common.continue"));
    expect(screen.getByText(copy.clueCollectedTitle)).toBeDefined();
    expect(screen.getByText(clueValueOf(first))).toBeDefined();
    click(t("common.continue"));
    expect(screen.getByRole("heading", { name: second.name })).toBeDefined();
    expect(screen.getByText(normalized(revealedAfterSolving.body))).toBeDefined();
    // distance + time
    expect(screen.getByText(containing(t("gps.minWalk", { minutes: "" }).trim()))).toBeDefined();
    click(t("game.solved.startWalking"));

    expect(screen.getByText(t("gps.yourNextDestination"))).toBeDefined();
    expect(screen.getByText(t("game.header.stopCounter", { current: 2, total: stops.length }))).toBeDefined();
    expect(screen.getByText(t("game.header.clues", { found: 1, total: clues.length }))).toBeDefined();
  });

  test("after 3 wrong answers the team can see the answer and continue (H-02)", async () => {
    // Stop 5 (De Kat) has a number challenge whose answer is still a placeholder:
    // exactly the case where a team could otherwise get stuck.
    const deKat = stop("pubs-de-kat");
    saveSessionAfter([
      ...getJumpToStopActions(walk, deKat.order, "2026-09-23T15:00:00.000Z"),
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
    ]);
    await continueSavedWalk();

    const input = screen.getByPlaceholderText(t("common.yourAnswer"));
    for (let attempt = 1; attempt <= 3; attempt++) {
      expect(screen.queryByRole("button", { name: t("game.challenge.revealAnswer") })).toBeNull();
      fireEvent.change(input, { target: { value: "-1" } });
      click(t("common.submit"));
    }

    click(t("game.challenge.revealAnswer"));
    // The answer box: the answer and the (translated) explanation. The form is gone.
    // Expected straight from the data (not from the code that renders it).
    const challenge = deKat.challenge!;
    if (challenge.type !== "number-answer") throw new Error("this test expects De Kat's number question");
    expect(screen.getByText(t("game.challenge.answerIs", { answer: String(challenge.correctNumber) }))).toBeDefined();
    expect(screen.getByText(challenge.explanation!)).toBeDefined();
    expect(screen.queryByPlaceholderText(t("common.yourAnswer"))).toBeNull();
    click(t("common.continue"));

    // No "Correct" screen (that wouldn't be true); straight on to the history, the clue is collected.
    expect(screen.queryByRole("heading", { name: copy.correctAnswer })).toBeNull();
    expect(deKat.historicalReveal).toBeDefined();
    expect(screen.getByText(t("game.solved.whyItMatters"))).toBeDefined();
    const saved = localWalkSessionStore.load(walk)!;
    expect(saved.locations[deKat.id].answerRevealed).toBe(true);
    expect(saved.collectedClueIds).toHaveLength(deKat.order);
  });

  test("progress survives a page reload", async () => {
    await startTwoPlayerGameAndStartVote();
    expect(window.localStorage.getItem(storageKey(walk.slug))).not.toBeNull();

    // Simulate a reload: unmount and mount a fresh player.
    cleanup();
    render(<WalkPlayer walk={walk} />);

    expect(await screen.findByRole("heading", { name: t("game.start.welcomeBack") })).toBeDefined();
    expect(screen.getByText(t("game.start.team", { team: "The Antwerp Explorers (Tony and Sarah)" }))).toBeDefined();
    click(t("game.start.continueWalk"));
    expect(screen.getByText(t("game.voting.playerTurn", { name: "Tony" }))).toBeDefined();
  });

  test("restart asks for confirmation, then deletes the saved walk", async () => {
    saveSessionAfter([{ type: "ARRIVE" }]);
    render(<WalkPlayer walk={walk} />);
    await screen.findByRole("heading", { name: t("game.start.welcomeBack") });

    click(t("game.start.startAgain"));
    expect(window.localStorage.getItem(storageKey(walk.slug))).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: t("game.start.restartConfirm"), hidden: true }));

    expect(window.localStorage.getItem(storageKey(walk.slug))).toBeNull();
    expect(screen.getByRole("button", { name: t("game.start.newAdventure") })).toBeDefined();
  });

  test("skipping the drink round goes straight to the story", async () => {
    await startTwoPlayerGameAndStartVote();
    click(t("game.voting.skip"));
    expect(screen.getByRole("heading", { name: t("game.story.title") })).toBeDefined();
  });

  test("the Ledger never reveals future cafés", async () => {
    const current = stops[2];
    saveSessionAfter(getJumpToStopActions(walk, 3, "2026-09-23T15:00:00.000Z"));
    await continueSavedWalk();
    click(copy.routeButtonLabel!);

    const ledger = screen.getByRole("dialog", { hidden: true });
    expect(within(ledger).getByText(stops[0].name)).toBeDefined();
    expect(within(ledger).getByText(current.name)).toBeDefined(); // current
    expect(within(ledger).getAllByText("???")).toHaveLength(stops.length - 3);
    for (const future of stops.slice(3)) {
      expect(revealedIn(ledger.textContent ?? "", future)).toEqual([]);
    }
    // The clues of the two solved cafés, but not yet the current café's clue.
    expect(within(ledger).getByText(clueValueOf(stops[0]))).toBeDefined();
    expect(within(ledger).getByText(clueValueOf(stops[1]))).toBeDefined();
    expect(ledger.textContent).not.toContain(clueValueOf(current));
  });

  test("the bonus question at Quinten Matsijs can be skipped", async () => {
    const quinten = stop("pubs-quinten-matsijs");
    saveSessionAfter([
      ...getJumpToStopActions(walk, quinten.order, "2026-09-23T15:00:00.000Z"),
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
    ]);
    await continueSavedWalk();

    fireEvent.change(screen.getByLabelText(t("common.yourAnswer")), {
      target: { value: getCorrectAnswer(quinten.challenge!) },
    });
    click(t("common.submit"));
    click(t("game.solved.discoverWhy"));

    expect(screen.getByText(t("game.solved.optionalBonus"))).toBeDefined();
    click(t("game.solved.skipBonus"));
    // The reveal comes after the bonus, so it can mention the bonus answer (the old name).
    const bonusAnswer = getCorrectAnswer(quinten.bonusChallenge!) as string;
    expect(screen.getByText(containing(bonusAnswer))).toBeDefined();
  });

  test("the final puzzle completes the walk and shows the closing story", async () => {
    const finale = walk.finale!;
    saveSessionAfter(getJumpToStopActions(walk, stops.length + 1, "2026-09-23T16:00:00.000Z"));
    await continueSavedWalk();

    // Final page with all eight clues.
    expect(screen.getByRole("heading", { name: finale.title })).toBeDefined();
    expect(screen.getByText(clueValueOf(stops[stops.length - 1]))).toBeDefined();
    click(t("game.finale.openFinalPage"));

    fireEvent.change(screen.getByLabelText(t("common.yourAnswer")), { target: { value: "noon" } });
    click(t("common.submit"));
    expect(screen.getByText(copy.wrongAnswer)).toBeDefined();

    for (const question of finale.questions) {
      fireEvent.change(screen.getByLabelText(t("common.yourAnswer")), {
        target: { value: getCorrectAnswer(question) },
      });
      click(t("common.submit"));
    }

    expect(screen.getByText(normalized(finale.closingStory[finale.closingStory.length - 1].body))).toBeDefined();
    click(t("game.completion.closeLedger"));

    expect(screen.getByRole("heading", { name: copy.completionTitle })).toBeDefined();
    // taverns and clues
    expect(screen.getAllByText(`${stops.length} / ${stops.length}`)).toHaveLength(2);
    expect(screen.getByText(copy.locationsDiscoveredLabel)).toBeDefined();
    expect(screen.getByText(t("game.completion.cluesRecovered"))).toBeDefined();
    expect(document.body.textContent).not.toMatch(/drinks? (ordered|consumed)/i);
  });

  test("a final-puzzle question can't become a dead end: after 3 wrong answers the answer can be shown", async () => {
    saveSessionAfter(getJumpToStopActions(walk, stops.length + 1, "2026-09-23T16:00:00.000Z"));
    await continueSavedWalk();
    click(t("game.finale.openFinalPage"));

    for (let attempt = 1; attempt <= 3; attempt++) {
      expect(screen.queryByRole("button", { name: t("game.challenge.revealAnswer") })).toBeNull();
      fireEvent.change(screen.getByLabelText(t("common.yourAnswer")), { target: { value: "noon" } });
      click(t("common.submit"));
    }
    click(t("game.challenge.revealAnswer"));

    // The answer comes from the clue it is written on, in the player's language.
    const [firstQuestion, ...otherQuestions] = walk.finale!.questions;
    const clue = clues.find((candidate) => candidate.id === firstQuestion.answerClueId)!;
    expect(screen.getByText(t("game.challenge.answerIs", { answer: clue.value }))).toBeDefined();
    expect(screen.queryByLabelText(t("common.yourAnswer"))).toBeNull();
    expect(screen.queryByRole("button", { name: t("game.finale.showClues") })).toBeNull();
    click(t("common.continue"));

    // On to the next question; the walk completes as usual.
    expect(
      screen.getByText(t("game.finale.questionOf", { number: 2, total: walk.finale!.questions.length })),
    ).toBeDefined();
    for (const question of otherQuestions) {
      fireEvent.change(screen.getByLabelText(t("common.yourAnswer")), {
        target: { value: getCorrectAnswer(question) },
      });
      click(t("common.submit"));
    }
    const closingStory = walk.finale!.closingStory;
    expect(screen.getByText(normalized(closingStory[closingStory.length - 1].body))).toBeDefined();
  });
});
