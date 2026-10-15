import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameTexts } from "@/data/walks/hidden-pubs/game/content";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { PubGame } from "@/features/pub-game/components/PubGame";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView } from "@/features/pub-game/logic/player-view";
import { bestAt, leaderboardRows, winners } from "@/features/pub-game/logic/view-helpers";
import { englishTranslator as t } from "@/i18n/translate";
import type { PubGameAction, PubGameState, QuestionProgress } from "@/types/pub-game";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));

const CODE = "K7M2QX";
const AT = "2026-10-14T22:00:00.000Z";
const route = pubGameDefinition.route.flatMap((group) => group.cafeIds);
const questionIds = pubGameDefinition.cafes.flatMap((cafe) => cafe.questions.map((question) => question.id));

beforeEach(() => window.localStorage.setItem(`hidden-antwerp:pub-intro:${CODE}`, "seen"));

function apply(state: PubGameState, actorId: string, action: PubGameAction): PubGameState {
  const result = applyPubGameAction(pubGameDefinition, pubGameAnswerKey, state, actorId, action);
  if (!result.ok) throw new Error(`${action.type}: ${result.error}`);
  return result.state;
}

/** `count` questions right on the first try (100 each) and `late` right on the third try (60 each). */
function answers(count: number, late = 0): Record<string, QuestionProgress> {
  const entries: [string, QuestionProgress][] = [];
  questionIds.slice(0, count).forEach((id) =>
    entries.push([id, { wrongOptionIds: [], status: "correct", correctOptionId: "x", points: 100 }]),
  );
  questionIds.slice(count, count + late).forEach((id) =>
    entries.push([id, { wrongOptionIds: ["a", "b"], status: "correct", correctOptionId: "x", points: 60 }]),
  );
  return Object.fromEntries(entries);
}

/** Red (Host, Bea), Blue (Dirk), Green (Eva); started. */
function threeTeams(): PubGameState {
  let state = createPubGame({
    teams: [
      { id: "t1", name: "Red" },
      { id: "t2", name: "Blue" },
      { id: "t3", name: "Green" },
    ],
    playersPerTeam: 4,
    host: { id: "h", name: "Host", teamId: "t1" },
  });
  for (const [id, name, teamId] of [
    ["b", "Bea", "t1"],
    ["d", "Dirk", "t2"],
    ["e", "Eva", "t3"],
  ]) {
    state = apply(state, id, { type: "JOIN", playerId: id, name, teamId });
  }
  return apply(state, "h", { type: "START_GAME", routes: { t1: route, t2: route, t3: route }, at: AT });
}

const viewOf = (state: PubGameState, playerId: string) => toPlayerView(pubGameDefinition, state, playerId);

describe("ranking", () => {
  test("by points; a tie is broken by first-time-right answers; still tied = the same place", () => {
    const state = threeTeams();
    state.answers = { t1: answers(3), t2: answers(1, 3), t3: answers(3) };
    // Red 300 (3 first-try), Blue 280 (1 first-try), Green 300 (3 first-try): Red and Green share 1st.
    const rows = leaderboardRows(viewOf(state, "b"));
    expect(rows.map((row) => [row.name, row.position, row.total, row.isOwn])).toEqual([
      ["Red", 1, 300, true],
      ["Green", 1, 300, false],
      ["Blue", 3, 280, false],
    ]);
    expect(winners(rows).map((row) => row.name)).toEqual(["Red", "Green"]);

    // Equal points, but Red was right the first time more often: Red alone is first.
    // Red: 3 × 100 = 300 (3 first-try). Green: 100 + 60 + 60 + 80 = 300 (1 first-try).
    state.answers.t3 = answers(1, 2);
    state.answers.t3[questionIds[9]] = { wrongOptionIds: ["a"], status: "correct", correctOptionId: "x", points: 80 };
    const decided = leaderboardRows(viewOf(state, "b"));
    expect(decided.map((row) => [row.name, row.position, row.total])).toEqual([
      ["Red", 1, 300],
      ["Green", 2, 300],
      ["Blue", 3, 280],
    ]);
  });

  test("a single team: players are ranked by name, with their own points", () => {
    let state = createPubGame({ teams: [{ id: "t1", name: "Solo" }], playersPerTeam: 3, host: { id: "h", name: "Host", teamId: "t1" } });
    state = apply(state, "b", { type: "JOIN", playerId: "b", name: "Bea", teamId: "t1" });
    state = apply(state, "h", { type: "START_GAME", routes: { t1: route }, at: AT });
    state.answers = { h: answers(1), b: answers(2) };
    const rows = leaderboardRows(viewOf(state, "h"));
    expect(rows.map((row) => [row.name, row.position, row.total, row.isOwn])).toEqual([
      ["Bea", 1, 200, false],
      ["Host", 2, 100, true],
    ]);
  });

  test("highlights name nobody for a statistic nobody scored in", () => {
    const rows = leaderboardRows(viewOf(threeTeams(), "b"));
    expect(bestAt(rows, "firstAttemptCorrect")).toBeNull();
    expect(bestAt(rows, "approvedTasks")).toBeNull();
  });
});

describe("results screen", () => {
  function show(state: PubGameState, playerId: string) {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ changed: false, version: 10 }))));
    render(
      <PubGame texts={pubGameTexts.en} code={CODE} invite={null} initialView={viewOf(state, playerId)} initialVersion={10} />,
    );
  }

  test("one winner, the tradition, the ranking and the highlights; never anything about drinks", () => {
    let state = threeTeams();
    state.answers = { t1: answers(2), t2: answers(4), t3: answers(1, 1) };
    state = apply(state, "h", { type: "END_GAME", at: AT });
    show(state, "d");

    expect(screen.getByRole("heading", { name: t("pubgame.results.winner", { name: "Blue" }) })).toBeTruthy();
    expect(screen.getByText(t("pubgame.results.tradition"))).toBeTruthy();
    const ranking = within(screen.getByRole("list", { name: t("pubgame.leaderboard.label") }));
    expect(ranking.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      expect.stringContaining("Blue"),
      expect.stringContaining("Red"),
      expect.stringContaining("Green"),
    ]);
    expect(screen.getByText(t("pubgame.results.firstTry", { name: "Blue", count: 4 }))).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/sip|drink(s)? (drunk|counted)/i);
  });

  test("a shared win, and a note when photos still wait for the host", () => {
    let state = threeTeams();
    state.answers = { t1: answers(2), t2: answers(2), t3: answers(1) };
    state.evidence.push({
      id: "s1",
      taskId: "pubs-de-kat-tap",
      teamId: "t3",
      submittedBy: "e",
      participantIds: ["e"],
      mediaId: `games/${CODE}/x.jpg`,
      submittedAt: AT,
      status: "pending",
      rejectionReason: null,
    });
    state = apply(state, "h", { type: "END_GAME", at: AT });
    show(state, "b");

    expect(screen.getByRole("heading", { name: t("pubgame.results.sharedWin", { names: "Red & Blue" }) })).toBeTruthy();
    expect(screen.getByText(t.plural("pubgame.results.pending", 1))).toBeTruthy();
  });

  test("sharing the results copies a text ranking when the phone has no share sheet", async () => {
    let state = threeTeams();
    state.answers = { t1: answers(1), t2: answers(2), t3: answers(0) };
    state = apply(state, "h", { type: "END_GAME", at: AT });
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    show(state, "b");

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.results.share") }));
    await waitFor(() => expect(screen.getByText(t("pubgame.results.copied"))).toBeTruthy());
    expect(writeText).toHaveBeenCalledWith(
      [
        t("pubgame.results.shareTitle"),
        t("pubgame.results.shareLine", { position: 1, name: "Blue", points: 200 }),
        t("pubgame.results.shareLine", { position: 2, name: "Red", points: 100 }),
        t("pubgame.results.shareLine", { position: 3, name: "Green", points: 0 }),
      ].join("\n"),
    );
  });
});

describe("live scores during the game", () => {
  test("Scores in the menu opens the ranking, with the own team marked", () => {
    const state = threeTeams();
    state.answers = { t1: answers(1), t2: answers(2), t3: answers(0) };
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ changed: false, version: 10 }))));
    render(<PubGame texts={pubGameTexts.en} code={CODE} invite={null} initialView={viewOf(state, "b")} initialVersion={10} />);
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.beery.letsGo") }));

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.menu.scores") }));
    const dialog = screen.getByRole("dialog", { name: t("pubgame.leaderboard.title") });
    const own = within(dialog).getByText(t("pubgame.leaderboard.own"), { exact: false }).closest("li");
    expect(own?.textContent).toContain("Red");
    expect(within(dialog).getAllByText(t("pubgame.leaderboard.details", { done: 0, total: 12, bonus: 0 }))).toHaveLength(3);
  });
});
