import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameTexts } from "@/data/walks/hidden-pubs/game/content";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { pubGameReveals } from "@/data/walks/hidden-pubs/game/reveals/index.server";
import { PubGame } from "@/features/pub-game/components/PubGame";
import type { CafeReveal } from "@/features/pub-game/logic/api-types";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { parseCard } from "@/features/pub-game/logic/cards";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView } from "@/features/pub-game/logic/player-view";
import { englishTranslator as t } from "@/i18n/translate";
import type { PubGameAction, PubGameState } from "@/types/pub-game";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));

const CODE = "K7M2QX";
const AT = "2026-10-14T18:00:00.000Z";
const texts = pubGameTexts.en;
const route = pubGameDefinition.route.flatMap((group) => group.cafeIds);

beforeEach(() => window.localStorage.setItem(`hidden-antwerp:pub-intro:${CODE}`, "seen"));

function apply(state: PubGameState, actorId: string, action: PubGameAction): PubGameState {
  const result = applyPubGameAction(pubGameDefinition, pubGameAnswerKey, state, actorId, action);
  if (!result.ok) throw new Error(`${action.type}: ${result.error}`);
  return result.state;
}

/** Red: Host + Bea; Blue: Dirk. Red is at `cafeId` and everyone drew a 5: what comes after the cards is next. */
function afterCards(cafeId: string): PubGameState {
  let state = createPubGame({
    teams: [
      { id: "t1", name: "Red" },
      { id: "t2", name: "Blue" },
    ],
    playersPerTeam: 4,
    host: { id: "h", name: "Host", teamId: "t1" },
  });
  state = apply(state, "b", { type: "JOIN", playerId: "b", name: "Bea", teamId: "t1" });
  state = apply(state, "d", { type: "JOIN", playerId: "d", name: "Dirk", teamId: "t2" });
  state = apply(state, "h", { type: "START_GAME", routes: { t1: route, t2: route }, at: AT });
  state.teams[0].cafeIndex = route.indexOf(cafeId);
  state = apply(state, "h", { type: "ARRIVE" });
  state = apply(state, "h", { type: "DRINKS_DONE" });
  while (state.teams[0].step === "cards") {
    const pile = state.teams[0].deck.drawPile;
    const five = pile.find((id) => parseCard(id).rank === "5")!;
    state = apply(state, "h", { type: "OFFER_CARDS", cardIds: [five, ...pile.filter((id) => id !== five).slice(0, 9)] });
    state = apply(state, "h", { type: "PICK_CARD", index: 0 });
  }
  return state;
}

/** Shows the game as one phone, already past the round's last card. */
function show(state: PubGameState, playerId = "b") {
  const view = toPlayerView(pubGameDefinition, state, playerId);
  render(<PubGame texts={texts} code={CODE} invite={null} initialView={view} initialVersion={10} />);
  const seeLastCard = screen.queryByRole("button", { name: t("pubgame.cards.toPubtask") });
  if (seeLastCard) fireEvent.click(seeLastCard);
}

/** A fake server: /reveal answers `reveal()`, /actions answers the queued states (as `playerId` sees them). */
function fakeServer(reveal: () => CafeReveal, playerId: string, ...afterActions: PubGameState[]) {
  const queue = [...afterActions];
  let version = 10;
  const mock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async (url) => {
    let body: unknown = { changed: false, version };
    if (url.includes("/reveal")) body = reveal();
    else if (url.includes("/actions")) {
      const next = queue.shift();
      if (next) body = { version: ++version, view: toPlayerView(pubGameDefinition, next, playerId), events: [] };
    }
    return new Response(JSON.stringify(body), { status: 200 });
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}
const actionsSent = (mock: ReturnType<typeof fakeServer>) =>
  mock.mock.calls.filter(([url]) => url.includes("/actions")).map(([, init]) => JSON.parse(String(init?.body)).action);

const rococo = pubGameDefinition.cafes.find((cafe) => cafe.id === "pubs-rococo")!;
const question = rococo.questions[0];
const questionText = texts.cafes["pubs-rococo"].questions[question.id];
const right = pubGameAnswerKey[question.id];
const wrong = question.optionIds.find((id) => id !== right)!;

describe("pubtask", () => {
  test("a wrong answer: struck through, Beery's hint, the next try is worth 80", async () => {
    const before = afterCards("pubs-rococo");
    const afterWrong = apply(before, "b", { type: "ANSWER", questionId: question.id, optionId: wrong });
    const fetchMock = fakeServer(() => ({ explanations: {}, funFact: null }), "b", afterWrong);
    show(before);

    expect(screen.getByRole("heading", { name: questionText.question })).toBeTruthy();
    expect(screen.getByText(t("pubgame.pubtask.worth", { attempt: 1, points: 100 }))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: questionText.options[wrong] }));

    expect(await screen.findByText(t("pubgame.pubtask.hint", { hint: questionText.hints[0] }))).toBeTruthy();
    expect(screen.getByText(t.plural("pubgame.pubtask.wrong", 1))).toBeTruthy();
    expect(screen.getByText(t("pubgame.pubtask.worth", { attempt: 2, points: 80 }))).toBeTruthy();
    expect(screen.getByRole<HTMLButtonElement>("button", { name: new RegExp(questionText.options[wrong]) }).disabled).toBe(true);
    expect(actionsSent(fetchMock)).toEqual([{ type: "ANSWER", questionId: question.id, optionId: wrong }]);
  });

  test("M-11: the feedback status exists before the first wrong answer; the same element is updated (so it's announced)", async () => {
    const before = afterCards("pubs-rococo");
    const afterWrong = apply(before, "b", { type: "ANSWER", questionId: question.id, optionId: wrong });
    fakeServer(() => ({ explanations: {}, funFact: null }), "b", afterWrong);
    show(before);

    // The question's own status (the options group points at it with aria-describedby).
    const group = screen.getByRole("button", { name: questionText.options[wrong] }).closest('[role="group"]')!;
    const statusOf = () => document.getElementById(group.getAttribute("aria-describedby")!)!;
    const status = statusOf();
    expect(status.getAttribute("role")).toBe("status");
    expect(status.textContent).toBe("");
    fireEvent.click(screen.getByRole("button", { name: questionText.options[wrong] }));

    await waitFor(() => expect(status.textContent).toContain(t.plural("pubgame.pubtask.wrong", 1)));
    expect(statusOf()).toBe(status);
  });

  test("right answer: the points, the explanation, then the fun fact and on to the next café", async () => {
    const before = afterCards("pubs-rococo");
    const afterRight = apply(before, "b", { type: "ANSWER", questionId: question.id, optionId: right });
    const afterContinue = apply(afterRight, "b", { type: "CONTINUE", at: AT });
    const english = pubGameReveals.en.cafes["pubs-rococo"];
    let finished = false;
    const fetchMock = fakeServer(
      () => (finished ? { explanations: english.explanations, funFact: english.funFact } : { explanations: {}, funFact: null }),
      "b",
      afterRight,
      afterContinue,
    );
    show(before);

    finished = true;
    fireEvent.click(screen.getByRole("button", { name: questionText.options[right] }));
    expect(await screen.findByText(t("pubgame.pubtask.correct", { points: 100 }))).toBeTruthy();
    expect(await screen.findByText(english.explanations[question.id])).toBeTruthy();
    // The team is already at the fun fact; this phone keeps the answer until "Continue".
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.pubtask.continue") }));

    expect(await screen.findByRole("heading", { name: english.funFact.title })).toBeTruthy();
    expect(screen.getByText(t("game.content.historyPartial"))).toBeTruthy();
    for (const paragraph of english.funFact.paragraphs) expect(screen.getByText(paragraph)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.funFact.next") }));
    await waitFor(() => expect(actionsSent(fetchMock).at(-1)).toEqual({ type: "CONTINUE" }));
  });

  test("after three wrong answers the answer is shown, without points", () => {
    const state = afterCards("pubs-rococo");
    state.answers.t1 = { [question.id]: { wrongOptionIds: ["a", "b", "c"], status: "revealed", correctOptionId: right, points: 0 } };
    fakeServer(() => ({ explanations: {}, funFact: null }), "b");
    show(state);
    expect(screen.getByText(t("pubgame.pubtask.revealed", { answer: questionText.options[right] }))).toBeTruthy();
  });
});

describe("bonus task", () => {
  test("Beery announces it, and it can be skipped", async () => {
    const deKat = pubGameDefinition.cafes.find((cafe) => cafe.id === "pubs-de-kat")!;
    let state = afterCards("pubs-de-kat");
    state = apply(state, "b", { type: "ANSWER", questionId: deKat.questions[0].id, optionId: pubGameAnswerKey[deKat.questions[0].id] });
    expect(state.teams[0].step).toBe("bonus");
    const fetchMock = fakeServer(() => ({ explanations: {}, funFact: null }), "b", apply(state, "b", { type: "CONTINUE", at: AT }));
    // Opened at the bonus: straight to Beery's popup (no finished pubtask to put away).
    show(state);

    const task = texts.cafes["pubs-de-kat"].tasks["pubs-de-kat-tap"];
    const popup = screen.getByRole("dialog", { name: t("pubgame.beery.bonusTask") });
    expect(within(popup).getByText(task.title)).toBeTruthy();
    fireEvent.click(within(popup).getByRole("button", { name: t("pubgame.beery.letsGo") }));

    expect(screen.getByRole("heading", { name: task.title })).toBeTruthy();
    expect(screen.getByText(t.plural("pubgame.tasks.points", 200))).toBeTruthy();
    expect(screen.getByText(task.instruction)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.bonus.skip") }));
    await waitFor(() => expect(actionsSent(fetchMock)).toEqual([{ type: "CONTINUE" }]));
  });
});

describe("the end of the route", () => {
  test("Den Engel's fun fact finishes the game; the team then waits for the results", async () => {
    let state = afterCards("pubs-den-engel");
    for (const item of pubGameDefinition.cafes.find((cafe) => cafe.id === "pubs-den-engel")!.questions) {
      state = apply(state, "b", { type: "ANSWER", questionId: item.id, optionId: pubGameAnswerKey[item.id] });
    }
    state = apply(state, "b", { type: "SKIP_TASK", taskId: "pubs-den-engel-clog" });
    expect(state.teams[0].step).toBe("fun-fact");
    const funFact = pubGameReveals.en.cafes["pubs-den-engel"].funFact;
    fakeServer(() => ({ explanations: {}, funFact }), "b", apply(state, "b", { type: "CONTINUE", at: AT }));
    show(state);

    expect(await screen.findByText(t("pubgame.funFact.cafeStory"))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.funFact.finish") }));
    expect(await screen.findByRole("heading", { name: t("pubgame.teamFinished.title") })).toBeTruthy();
  });
});
