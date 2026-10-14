import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { pubGameDrinks } from "@/data/walks/hidden-pubs/game/drinks";
import { CARD_NAMES } from "@/features/pub-game/card-names";
import { POLL_INTERVAL_MS } from "@/features/pub-game/client/usePubGame";
import { isPopupEvent } from "@/features/pub-game/components/EventPopup";
import { PubGame } from "@/features/pub-game/components/PubGame";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { parseCard, RANKS } from "@/features/pub-game/logic/cards";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView } from "@/features/pub-game/logic/player-view";
import { englishTranslator as t } from "@/i18n/translate";
import type { PubGameAction, PubGameState, Rank } from "@/types/pub-game";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }) }));
vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => <div data-testid="walking-map" /> }));

const CODE = "K7M2QX";
const AT = "2026-10-14T18:00:00.000Z";

beforeEach(() => {
  // The rules were already shown on this phone: the tests start in the café.
  window.localStorage.setItem(`hidden-antwerp:pub-intro:${CODE}`, "seen");
});

// ─── Game states built with the real game logic ─────────────────────────────

function apply(state: PubGameState, actorId: string, action: PubGameAction): PubGameState {
  const result = applyPubGameAction(pubGameDefinition, {}, state, actorId, action);
  if (!result.ok) throw new Error(`${action.type}: ${result.error}`);
  return result.state;
}

/** Red: Host (h), Bea (b), Cas (c). Blue: Dirk (d). Route in definition order; Red at the café. */
function gameAt(step: "drinks" | "cards", cafeId = "pubs-rococo"): PubGameState {
  let state = createPubGame({
    teams: [
      { id: "t1", name: "Red" },
      { id: "t2", name: "Blue" },
    ],
    playersPerTeam: 4,
    host: { id: "h", name: "Host", teamId: "t1" },
  });
  for (const [id, name, teamId] of [
    ["b", "Bea", "t1"],
    ["c", "Cas", "t1"],
    ["d", "Dirk", "t2"],
  ]) {
    state = apply(state, id, { type: "JOIN", playerId: id, name, teamId });
  }
  const route = pubGameDefinition.route.flatMap((group) => group.cafeIds);
  state = apply(state, "h", { type: "START_GAME", routes: { t1: route, t2: route }, at: AT });
  state.teams[0].cafeIndex = route.indexOf(cafeId);
  state = apply(state, "h", { type: "ARRIVE" });
  if (step === "cards") state = apply(state, "h", { type: "DRINKS_DONE" });
  return state;
}

/** The player whose turn it is draws a card of `rank` (the server offers it among 10). */
function drawn(state: PubGameState, rank: Rank): PubGameState {
  const team = state.teams[0];
  const wanted = team.deck.drawPile.find((id) => parseCard(id).rank === rank)!;
  const offer = [wanted, ...team.deck.drawPile.filter((id) => id !== wanted).slice(0, 9)];
  state = apply(state, "h", { type: "OFFER_CARDS", cardIds: offer });
  return apply(state, "h", { type: "PICK_CARD", index: 0 });
}

function show(state: PubGameState, playerId: string, version = 10) {
  return render(<PubGame code={CODE} invite={null} initialView={toPlayerView(pubGameDefinition, state, playerId)} initialVersion={version} />);
}

/** A fake fetch answering the queued JSON responses in order (then "nothing new"). */
function fakeFetch(...bodies: unknown[]) {
  const queue = [...bodies];
  const mock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async () =>
    new Response(JSON.stringify(queue.shift() ?? { changed: false, version: 0 }), { status: 200 }),
  );
  vi.stubGlobal("fetch", mock);
  return mock;
}
const sentAction = (mock: ReturnType<typeof fakeFetch>, call = 0) =>
  (JSON.parse(String(mock.mock.calls[call][1]?.body)) as { action: unknown }).action;

// ─── Drinks ─────────────────────────────────────────────────────────────────

describe("drink choice", () => {
  test("the concept's three drinks + alcohol-free + no drink; the choice stays on the phone", async () => {
    const fetchMock = fakeFetch({ version: 11, view: toPlayerView(pubGameDefinition, gameAt("cards"), "b"), events: [] });
    show(gameAt("drinks"), "b");

    const menu = pubGameDrinks["pubs-rococo"];
    if (menu.kind !== "menu") throw new Error("Rococo has a menu");
    for (const drink of menu.drinks) expect(screen.getByRole("button", { name: drink })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.drinks.alcoholFree") }));
    expect(screen.getByText(t("pubgame.drinks.yourChoice", { drink: t("pubgame.drinks.alcoholFree") }))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.drinks.skip") }));
    expect(screen.getByText(t("pubgame.drinks.noDrink"))).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.drinks.ready") }));
    // On to Drunken Bastard: the host draws first at the first café.
    expect(await screen.findByText(t("pubgame.cards.waitingFor", { name: "Host" }))).toBeTruthy();
    expect(sentAction(fetchMock)).toEqual({ type: "DRINKS_DONE" });
  });

  test("Billie's: the beer wheel gives a number from 1 to 10 (and alcohol-free stays possible)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.65);
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
    show(gameAt("drinks", "pubs-billies"), "b");

    expect(screen.getByRole("img", { name: t("pubgame.wheel.label") })).toBeTruthy();
    expect(screen.getByRole("button", { name: t("pubgame.drinks.alcoholFree") })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.wheel.spin") }));
    // 1 + floor(0.65 × 10) = 7
    expect(screen.getByText(t("pubgame.wheel.result", { number: 7 }))).toBeTruthy();
    expect(screen.getByText(t("pubgame.wheel.order", { number: 7 }))).toBeTruthy();
    expect(screen.queryByRole("button", { name: t("pubgame.wheel.spin") })).toBeNull();
  });
});

// ─── Drunken Bastard ────────────────────────────────────────────────────────

describe("Drunken Bastard", () => {
  test("my turn: ask for 10 face-down cards, then tap one", async () => {
    const cards = gameAt("cards");
    const offered = apply(cards, "h", { type: "OFFER_CARDS", cardIds: cards.teams[0].deck.drawPile.slice(0, 10) });
    const fetchMock = fakeFetch(
      { version: 11, view: toPlayerView(pubGameDefinition, offered, "h"), events: [] },
      { version: 12, view: toPlayerView(pubGameDefinition, apply(offered, "h", { type: "PICK_CARD", index: 3 }), "h"), events: [] },
    );
    show(cards, "h");

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.cards.draw") }));
    const faceDown = await screen.findAllByRole("button", { name: /face down/ });
    expect(faceDown).toHaveLength(10);
    expect(faceDown[0].getAttribute("aria-label")).toBe(t("pubgame.cards.faceDown", { number: 1, total: 10 }));
    // Face down means face down: no rank or suit anywhere on the screen.
    expect(document.body.textContent).not.toMatch(/[♥♦♣♠]/);

    fireEvent.click(faceDown[3]);
    await waitFor(() => expect(screen.getByText(t("pubgame.cards.drew", { name: "Host" }))).toBeTruthy());
    expect(sentAction(fetchMock, 0)).toEqual({ type: "DRAW_CARDS" });
    expect(sentAction(fetchMock, 1)).toEqual({ type: "PICK_CARD", index: 3 });
  });

  test("someone else's turn: wait, or take over when their phone died", () => {
    show(gameAt("cards"), "b");
    expect(screen.getByText(t("pubgame.cards.waitingFor", { name: "Host" }))).toBeTruthy();
    expect(screen.queryByRole("button", { name: t("pubgame.cards.draw") })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.cards.drawFor", { name: "Host" }) }));
    expect(screen.getByRole("button", { name: t("pubgame.cards.draw") })).toBeTruthy();
  });

  test.each(RANKS)("card %s: its name, its explanation, and the right choice", (rank) => {
    show(drawn(gameAt("cards"), rank), "h");
    expect(screen.getByRole("heading", { name: CARD_NAMES[rank] })).toBeTruthy();
    expect(screen.getByText(t(`pubgame.cards.effects.${rank}`))).toBeTruthy();

    const choice = {
      "2": t("pubgame.cards.chooseTarget"),
      "8": t("pubgame.cards.chooseBuddy"),
      "4": t("pubgame.cards.reportLoser"),
      "7": t("pubgame.cards.reportLoser"),
      "9": t("pubgame.cards.reportLoser"),
      "10": t("pubgame.cards.reportLoser"),
    }[rank as string];
    if (choice) expect(screen.getByRole("heading", { name: choice })).toBeTruthy();
    if (rank === "J") expect(screen.getByLabelText(t("pubgame.cards.writeRule"))).toBeTruthy();
    if (!choice && rank !== "J") {
      // Nothing to choose: the next player's turn starts.
      expect(screen.getByText(t("pubgame.cards.waitingFor", { name: "Bea" }))).toBeTruthy();
    }
  });

  test("the round's last card stays visible after the round (even a card without a choice)", () => {
    let state = drawn(gameAt("cards"), "5"); // Host
    state = drawn(state, "6"); // Bea
    state = drawn(state, "3"); // Cas: the last one, nothing to choose
    expect(state.teams[0].step).toBe("pubtask");
    show(state, "b");

    expect(screen.getByText(t("pubgame.cards.drew", { name: "Cas" }))).toBeTruthy();
    expect(screen.getByRole("heading", { name: CARD_NAMES["3"] })).toBeTruthy();
    expect(screen.getByText(t("pubgame.cards.done"))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.cards.toPubtask") }));
    expect(screen.queryByRole("heading", { name: CARD_NAMES["3"] })).toBeNull();
  });

  test("2: only teammates can get the sip; 8: anyone in the game, also another team", () => {
    const { unmount } = show(drawn(gameAt("cards"), "2"), "h");
    expect(screen.getByRole("button", { name: "Bea" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Dirk" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Host" })).toBeNull();
    unmount();

    show(drawn(gameAt("cards"), "8"), "h");
    expect(screen.getByRole("button", { name: "Dirk" })).toBeTruthy();
    expect(screen.getByText("Blue")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Host" })).toBeNull();
  });

  test("J: the new rule is sent; 4: the loser can be skipped", async () => {
    const fetchMock = fakeFetch({ version: 11, view: toPlayerView(pubGameDefinition, gameAt("cards"), "h"), events: [] });
    const { unmount } = show(drawn(gameAt("cards"), "J"), "h");
    fireEvent.change(screen.getByLabelText(t("pubgame.cards.writeRule")), { target: { value: "Left hand only" } });
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.cards.ruleSubmit") }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(sentAction(fetchMock)).toEqual({ type: "WRITE_RULE", text: "Left hand only" });
    unmount();

    fakeFetch({ version: 11, view: toPlayerView(pubGameDefinition, gameAt("cards"), "h"), events: [] });
    show(drawn(gameAt("cards"), "4"), "h");
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.cards.nobody") }));
    await waitFor(() => expect(sentAction(vi.mocked(fetch) as ReturnType<typeof fakeFetch>)).toEqual({ type: "REPORT_LOSER", playerId: null }));
  });
});

// ─── Powers bar and popups ──────────────────────────────────────────────────

describe("powers, buddies and rules", () => {
  test("the bar shows the team's powers and my buddy; the full list opens; a sip can be reported", async () => {
    let state = drawn(gameAt("cards"), "K"); // Host = Thumb King
    state = drawn(state, "8"); // Bea's turn: 8
    state = apply(state, "b", { type: "CHOOSE_BUDDY", buddyId: "d" });
    state = drawn(state, "J"); // Cas
    state = apply(state, "c", { type: "WRITE_RULE", ruleId: "r1", text: "No pointing" });
    const fetchMock = fakeFetch({ version: 11, view: toPlayerView(pubGameDefinition, state, "b"), events: [] });
    show(state, "b");

    const bar = screen.getByRole("region", { name: t("pubgame.effects.label") });
    expect(within(bar).getByText("Host")).toBeTruthy();
    expect(within(bar).getByText(t("pubgame.effects.yourBuddy", { name: "Dirk" }))).toBeTruthy();
    expect(within(bar).getByText(t.plural("pubgame.effects.rulesCount", 1))).toBeTruthy();

    fireEvent.click(within(bar).getByRole("button", { name: t("pubgame.effects.open") }));
    const dialog = screen.getByRole("dialog", { name: t("pubgame.effects.title") });
    expect(within(dialog).getByText(/No pointing/)).toBeTruthy();
    expect(within(dialog).getByText(/Bea & Dirk/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "Cas" }));
    await waitFor(() => expect(within(dialog).getByText(t("pubgame.effects.reported"))).toBeTruthy());
    expect(sentAction(fetchMock)).toEqual({ type: "REPORT_DRINK", playerId: "c" });
  });

  test("popups: new buddies and buddy sips reach every phone, also in another team", async () => {
    vi.useFakeTimers();
    try {
      const state = gameAt("cards");
      const view = toPlayerView(pubGameDefinition, state, "d");
      fakeFetch(
        {
          changed: true,
          version: 11,
          view,
          events: [
            { version: 11, event: { type: "card-drawn", teamId: "t1", playerId: "b", cardId: "1-hearts-8" } },
            { version: 11, event: { type: "buddies-linked", playerIds: ["b", "d"], endedPairs: [] } },
          ],
        },
        {
          changed: true,
          version: 12,
          view,
          events: [
            {
              version: 12,
              event: {
                type: "drink",
                teamId: "t1",
                sips: [
                  { playerId: "b", sips: 1, because: "card" },
                  { playerId: "d", sips: 1, because: "buddy" },
                ],
              },
            },
          ],
        },
      );
      show(state, "d", 10);

      await act(async () => vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS));
      const buddies = screen.getByRole("dialog", { name: t("pubgame.popups.buddiesTitle") });
      expect(within(buddies).getByText(t("pubgame.popups.buddiesText", { first: "Bea", second: "Dirk" }))).toBeTruthy();
      fireEvent.click(within(buddies).getByRole("button", { name: t("pubgame.popups.ok") }));
      expect(screen.queryByRole("dialog", { name: t("pubgame.popups.buddiesTitle") })).toBeNull();

      await act(async () => vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS));
      const drink = screen.getByRole("dialog", { name: t("pubgame.popups.drinkTitle") });
      expect(within(drink).getByText(t.plural("pubgame.popups.sip", 1, { name: "Bea" }))).toBeTruthy();
      expect(within(drink).getByText(t.plural("pubgame.popups.sipAlong", 1, { name: "Dirk", buddy: "Bea" }))).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  test("which events pop up", () => {
    expect(isPopupEvent({ type: "buddies-linked", playerIds: ["a", "b"], endedPairs: [] })).toBe(true);
    expect(isPopupEvent({ type: "drink", teamId: "t1", sips: [{ playerId: "a", sips: 1, because: "card" }] })).toBe(false);
    expect(isPopupEvent({ type: "drink", teamId: "t1", sips: [{ playerId: "a", sips: 2, because: "card" }] })).toBe(true);
    expect(isPopupEvent({ type: "card-drawn", teamId: "t1", playerId: "a", cardId: "1-hearts-2" })).toBe(false);
  });
});
