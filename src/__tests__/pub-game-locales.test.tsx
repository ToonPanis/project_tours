import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameTexts } from "@/data/walks/hidden-pubs/game/content";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { pubGameReveals } from "@/data/walks/hidden-pubs/game/reveals/index.server";
import { PubGame } from "@/features/pub-game/components/PubGame";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { parseCard } from "@/features/pub-game/logic/cards";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView } from "@/features/pub-game/logic/player-view";
import { qrCodeFor } from "@/features/pub-game/logic/qr";
import { LocaleProvider } from "@/i18n/client";
import { messagesByLocale } from "@/i18n/messages";
import { locales, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import type { PubGameAction, PubGameState } from "@/types/pub-game";
import { englishLeaksIn, RAW_KEY } from "./fixtures/english-leaks";

/**
 * Test point 19 (HIDDEN_PUBS_TEST_PLAN.md): every screen of a game, in every
 * language, without raw keys or English interface texts. The states are real
 * game states, built with the game logic.
 */

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => <div data-testid="walking-map" /> }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));

const CODE = "K7M2QX";
const AT = "2026-10-15T18:00:00.000Z";
const JOIN_URL = `http://localhost:3000/games/${CODE}`;
const route = pubGameDefinition.route.flatMap((group) => group.cafeIds);
const firstCafe = pubGameDefinition.cafes.find((cafe) => cafe.id === route[0])!;
const introSeenKey = `hidden-antwerp:pub-intro:${CODE}`;

function apply(state: PubGameState, actorId: string, action: PubGameAction): PubGameState {
  const result = applyPubGameAction(pubGameDefinition, pubGameAnswerKey, state, actorId, action);
  if (!result.ok) throw new Error(`${action.type}: ${result.error}`);
  return result.state;
}

/** Red: Host + Bea; Blue: Dirk. */
function lobby(): PubGameState {
  let state = createPubGame({
    teams: [
      { id: "t1", name: "Red" },
      { id: "t2", name: "Blue" },
    ],
    playersPerTeam: 4,
    host: { id: "h", name: "Host", teamId: "t1" },
  });
  state = apply(state, "b", { type: "JOIN", playerId: "b", name: "Bea", teamId: "t1" });
  return apply(state, "d", { type: "JOIN", playerId: "d", name: "Dirk", teamId: "t2" });
}

const started = () => apply(lobby(), "h", { type: "START_GAME", routes: { t1: route, t2: route }, at: AT });
const atDrinks = () => apply(started(), "h", { type: "ARRIVE" });
const atCards = () => apply(atDrinks(), "h", { type: "DRINKS_DONE" });

/** Everyone in Red drew a 5 (a card without a choice): the pubtask is next. */
function atPubtask(): PubGameState {
  let state = atCards();
  while (state.teams[0].step === "cards") {
    const pile = state.teams[0].deck.drawPile;
    const five = pile.find((id) => parseCard(id).rank === "5")!;
    state = apply(state, "h", { type: "OFFER_CARDS", cardIds: [five, ...pile.filter((id) => id !== five).slice(0, 9)] });
    state = apply(state, "h", { type: "PICK_CARD", index: 0 });
  }
  return state;
}

/** One wrong answer on the first question: the hint and "worth 80" show. */
function afterWrongAnswer(): PubGameState {
  const question = firstCafe.questions[0];
  const wrong = question.optionIds.find((id) => id !== pubGameAnswerKey[question.id])!;
  return apply(atPubtask(), "b", { type: "ANSWER", questionId: question.id, optionId: wrong });
}

/** Every question right, every pubtask photo skipped, then on until the fun fact. */
function atFunFact(): PubGameState {
  let state = atPubtask();
  for (const question of firstCafe.questions) {
    state = apply(state, "b", { type: "ANSWER", questionId: question.id, optionId: pubGameAnswerKey[question.id] });
  }
  for (const task of firstCafe.tasks) {
    if (state.teams[0].step !== "fun-fact") state = apply(state, "b", { type: "SKIP_TASK", taskId: task.id });
  }
  for (let step = 0; step < 3 && state.teams[0].step !== "fun-fact"; step++) state = apply(state, "b", { type: "CONTINUE", at: AT });
  expect(state.teams[0].step).toBe("fun-fact");
  return state;
}

/** Red answered right (Blue has no points yet), then the host ends the game: Red wins. */
const finished = () => apply(atFunFact(), "h", { type: "END_GAME", at: AT });

/** A fake server: the reveal of the first café in `locale`, otherwise "nothing changed". */
function fakeServer(locale: Locale) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const reveal = pubGameReveals[locale].cafes[firstCafe.id];
      const body = url.includes("/reveal") ? { explanations: reveal.explanations, funFact: reveal.funFact } : { changed: false, version: 10 };
      return new Response(JSON.stringify(body), { status: 200 });
    }),
  );
}

interface Screen {
  name: string;
  state: () => PubGameState;
  playerId: string;
  /** Beery's intro (rules) is shown once per phone; most screens come after it. */
  introSeen?: boolean;
  /** The phone still shows the join link (only in the lobby). */
  invite?: boolean;
  /** The screen as a test expects to find it: a text of this locale. */
  expectText: (t: ReturnType<typeof createTranslator>) => string;
  /** The round's last card and the finished pubtask stay on this phone until put away (as in the real game). */
  putAway?: boolean;
  /** Taps before checking (e.g. Beery's popup → the navigation screen). */
  tap?: (t: ReturnType<typeof createTranslator>) => string;
}

const SCREENS: Screen[] = [
  { name: "lobby (host)", state: lobby, playerId: "h", invite: true, expectText: (t) => t("pubgame.lobby.start") },
  { name: "lobby (player)", state: lobby, playerId: "b", invite: true, expectText: (t) => t("pubgame.lobby.waitingForHost") },
  { name: "Beery's rules", state: started, playerId: "b", introSeen: false, expectText: (t) => t("pubgame.beery.intro.welcomeTitle") },
  {
    name: "navigation to the first café",
    state: started,
    playerId: "b",
    tap: (t) => t("pubgame.beery.letsGo"),
    expectText: (t) => t("gps.continueWithoutGps"),
  },
  { name: "drink choice", state: atDrinks, playerId: "b", expectText: (t) => t("pubgame.drinks.alcoholFree") },
  { name: "Drunken Bastard (my turn)", state: atCards, playerId: "h", expectText: (t) => t("pubgame.cards.draw") },
  { name: "pubtask after a wrong answer", state: afterWrongAnswer, playerId: "b", putAway: true, expectText: (t) => t.plural("pubgame.pubtask.wrong", 1) },
  { name: "fun fact", state: atFunFact, playerId: "b", putAway: true, expectText: (t) => t("pubgame.funFact.next") },
  { name: "results", state: finished, playerId: "b", putAway: true, expectText: (t) => t("pubgame.results.winner", { name: "Red" }) },
];

beforeEach(() => window.localStorage.clear());

describe.each(locales)("Hidden Pubs in %s", (locale) => {
  const t = createTranslator(locale);

  test.each(SCREENS.map((item) => [item.name, item] as const))("%s: fully in the language", async (_name, item) => {
    if (item.introSeen !== false) window.localStorage.setItem(introSeenKey, "seen");
    fakeServer(locale);
    render(
      <LocaleProvider locale={locale} messages={messagesByLocale[locale]}>
        <PubGame
          texts={pubGameTexts[locale]}
          code={CODE}
          invite={item.invite ? { joinUrl: JOIN_URL, qrCode: qrCodeFor(JOIN_URL) } : null}
          initialView={toPlayerView(pubGameDefinition, item.state(), item.playerId)}
          initialVersion={10}
        />
      </LocaleProvider>,
    );
    if (item.putAway) {
      for (const label of [t("pubgame.cards.toPubtask"), t("pubgame.pubtask.continue")]) {
        const kept = screen.queryByRole("button", { name: label });
        if (kept) fireEvent.click(kept);
      }
    }
    if (item.tap) fireEvent.click(await screen.findByRole("button", { name: item.tap(t) }));

    // Generous timeout: the navigation screen is loaded lazily (slow when every test runs at once).
    expect((await screen.findAllByText(item.expectText(t), { exact: false }, { timeout: 5000 })).length).toBeGreaterThan(0);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(RAW_KEY);
    if (locale !== "en") expect(englishLeaksIn(locale, text)).toEqual([]);
  });
});
