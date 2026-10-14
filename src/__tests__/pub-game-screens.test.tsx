import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { cafeName, pubGameCafes } from "@/data/walks/hidden-pubs/game/cafes";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { POLL_INTERVAL_MS } from "@/features/pub-game/client/usePubGame";
import { ClaimPlayerLink } from "@/features/pub-game/components/ClaimPlayerLink";
import { CreateGameForm } from "@/features/pub-game/components/CreateGameForm";
import { HostDashboard } from "@/features/pub-game/components/HostDashboard";
import { JoinGameForm } from "@/features/pub-game/components/JoinGameForm";
import { PubGame } from "@/features/pub-game/components/PubGame";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView, type PlayerView } from "@/features/pub-game/logic/player-view";
import { qrCodeFor } from "@/features/pub-game/logic/qr";
import { drawRoute } from "@/features/pub-game/logic/route";
import { englishTranslator as t } from "@/i18n/translate";
import type { PubGameAction, PubGameState } from "@/types/pub-game";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({ default: () => <div data-testid="walking-map" /> }));

const router = { push: vi.fn(), refresh: vi.fn(), replace: vi.fn() };
vi.mock("next/navigation", () => ({ useRouter: () => router }));

beforeEach(() => {
  router.push.mockReset();
  router.refresh.mockReset();
  router.replace.mockReset();
});

// ─── Real game states, built with the game logic ────────────────────────────

const CODE = "K7M2QX";
const JOIN_URL = `http://localhost:3000/games/${CODE}`;
const INVITE = { joinUrl: JOIN_URL, qrCode: qrCodeFor(JOIN_URL) };

function apply(state: PubGameState, actorId: string, action: PubGameAction): PubGameState {
  const result = applyPubGameAction(pubGameDefinition, {}, state, actorId, action);
  if (!result.ok) throw new Error(result.error);
  return result.state;
}

/** Host "h" in Red; Bea in Blue only when `withBea`. */
function lobbyState(withBea: boolean): PubGameState {
  let state = createPubGame({
    teams: [
      { id: "t1", name: "Red" },
      { id: "t2", name: "Blue" },
    ],
    playersPerTeam: 4,
    host: { id: "h", name: "Host", teamId: "t1" },
  });
  if (withBea) state = apply(state, "b", { type: "JOIN", playerId: "b", name: "Bea", teamId: "t2" });
  return state;
}

function started(state: PubGameState): PubGameState {
  const routes = { t1: drawRoute(pubGameDefinition.route, Math.random), t2: drawRoute(pubGameDefinition.route, Math.random) };
  return apply(state, "h", { type: "START_GAME", routes, at: "2026-10-14T18:00:00.000Z" });
}

const viewOf = (state: PubGameState, playerId: string): PlayerView => toPlayerView(pubGameDefinition, state, playerId);

/** A fake fetch: answers each call with the next queued JSON response, and records the requests. */
function fakeFetch(...responses: { status?: number; body: unknown }[]) {
  const queue = [...responses];
  const mock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async () => {
    const next = queue.shift() ?? { status: 200, body: { changed: false, version: 0 } };
    return new Response(JSON.stringify(next.body), { status: next.status ?? 200 });
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

const bodyOf = (mock: ReturnType<typeof fakeFetch>, call: number) =>
  JSON.parse(String(mock.mock.calls[call][1]?.body)) as Record<string, unknown>;

// ─── Creating a game ────────────────────────────────────────────────────────

describe("create game form", () => {
  test("refuses without the 18+ confirmation, then creates the game and opens it", async () => {
    const fetchMock = fakeFetch({ status: 201, body: { code: CODE, playerId: "h" } });
    render(<CreateGameForm walkSlug="hidden-pubs" />);

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.create.submit") }));
    expect(await screen.findByText(t("pubgame.errors.adultsOnly"))).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();

    // 3 teams: three name fields, empty ones get the default name.
    const teamCount = screen.getByRole("group", { name: t("pubgame.create.teamCount") });
    fireEvent.click(within(teamCount).getByRole("button", { name: "3" }));
    expect(within(teamCount).getByRole("button", { name: "3" }).getAttribute("aria-pressed")).toBe("true");
    fireEvent.change(screen.getByLabelText(t("pubgame.create.teamName", { number: 1 })), { target: { value: "De Vossen" } });
    fireEvent.change(screen.getByLabelText(t("pubgame.create.yourName")), { target: { value: "Toon" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.create.submit") }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith(`/games/${CODE}`));
    expect(bodyOf(fetchMock, 0)).toEqual({
      walkSlug: "hidden-pubs",
      teamNames: ["De Vossen", t("pubgame.create.defaultTeamName", { number: 2 }), t("pubgame.create.defaultTeamName", { number: 3 })],
      playersPerTeam: 4,
      hostName: "Toon",
      hostTeamIndex: 0,
      adultsConfirmed: true,
    });
  });
});

// ─── Joining ────────────────────────────────────────────────────────────────

describe("join form", () => {
  const lobby = {
    phase: "lobby" as const,
    joiningOpen: true,
    playersPerTeam: 2,
    teams: [
      { id: "t1", name: "Red", playerCount: 2 },
      { id: "t2", name: "Blue", playerCount: 1 },
    ],
  };

  test("a full team can't be chosen; joining refreshes the page into the game", async () => {
    const fetchMock = fakeFetch({ body: { playerId: "b" } });
    render(<JoinGameForm code={CODE} lobby={lobby} />);

    expect(screen.getByRole<HTMLButtonElement>("button", { name: /Red/ }).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText(t("pubgame.join.yourName")), { target: { value: "Bea" } });
    fireEvent.click(screen.getByRole("button", { name: /Blue/ }));
    expect(screen.getByRole("button", { name: /Blue/ }).textContent).toContain(t.plural("pubgame.join.placesLeft", 1));
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.join.submit") }));

    await waitFor(() => expect(router.refresh).toHaveBeenCalled());
    expect(bodyOf(fetchMock, 0)).toEqual({ name: "Bea", teamId: "t2", adultsConfirmed: true });
  });

  test("asks for a team, and shows the server's refusal", async () => {
    fakeFetch({ status: 409, body: { error: "name-taken" } });
    render(<JoinGameForm code={CODE} lobby={lobby} />);
    fireEvent.change(screen.getByLabelText(t("pubgame.join.yourName")), { target: { value: "Bea" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.join.submit") }));
    expect(await screen.findByText(t("pubgame.errors.chooseTeam"))).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Blue/ }));
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.join.submit") }));
    expect(await screen.findByText(t("pubgame.errors.nameTaken"))).toBeTruthy();
  });

  test("a game that already started says so", () => {
    render(<JoinGameForm code={CODE} lobby={{ ...lobby, phase: "playing", joiningOpen: false }} />);
    expect(screen.getByText(t("pubgame.join.closed"))).toBeTruthy();
    expect(screen.queryByRole("button", { name: t("pubgame.join.submit") })).toBeNull();
  });
});

// ─── Lobby, start, Beery ────────────────────────────────────────────────────

describe("the game screen", () => {
  test("lobby: the host can only start when every team has a player", () => {
    const { rerender } = render(<PubGame code={CODE} invite={INVITE} initialView={viewOf(lobbyState(false), "h")} initialVersion={0} />);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: t("pubgame.lobby.start") }).disabled).toBe(true);
    expect(screen.getByText(t("pubgame.lobby.startHint"))).toBeTruthy();
    expect(screen.getByText(CODE, { selector: "span.font-mono.text-3xl" })).toBeTruthy();
    // The QR code for the join link (computed on the server, drawn as SVG).
    expect(screen.getByRole("img", { name: t("pubgame.lobby.qrLabel", { code: CODE }) })).toBeTruthy();

    rerender(<PubGame key="2" code={CODE} invite={INVITE} initialView={viewOf(lobbyState(true), "h")} initialVersion={1} />);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: t("pubgame.lobby.start") }).disabled).toBe(false);
    expect(screen.getByText("Bea")).toBeTruthy();
  });

  test("lobby: other players wait for the host", () => {
    render(<PubGame code={CODE} invite={INVITE} initialView={viewOf(lobbyState(true), "b")} initialVersion={1} />);
    expect(screen.queryByRole("button", { name: t("pubgame.lobby.start") })).toBeNull();
    expect(screen.getByText(t("pubgame.lobby.waitingForHost"))).toBeTruthy();
    expect(screen.queryByRole("link", { name: t("pubgame.menu.host") })).toBeNull();
  });

  test("start → Beery's rules → Beery announces the first café", async () => {
    const lobby = lobbyState(true);
    const playing = started(lobby);
    const fetchMock = fakeFetch({ body: { version: 2, view: viewOf(playing, "h"), events: [] } });
    render(<PubGame code={CODE} invite={INVITE} initialView={viewOf(lobby, "h")} initialVersion={1} />);

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.lobby.start") }));
    expect(await screen.findByRole("heading", { name: t("pubgame.beery.intro.welcomeTitle") })).toBeTruthy();
    expect(bodyOf(fetchMock, 0)).toMatchObject({ action: { type: "START_GAME" } });
    expect(String(bodyOf(fetchMock, 0).actionId)).toMatch(/^[a-z0-9-]{8,64}$/);

    // Through all five rule screens.
    for (const title of ["cardsTitle", "pubtasksTitle", "bonusTitle", "respectTitle"] as const) {
      fireEvent.click(screen.getByRole("button", { name: t("pubgame.beery.intro.next") }));
      expect(screen.getByRole("heading", { name: t(`pubgame.beery.intro.${title}`) })).toBeTruthy();
    }
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.beery.intro.done") }));

    const popup = screen.getByRole("dialog", { name: t("pubgame.beery.nextLocation") });
    expect(within(popup).getByText(cafeName(pubGameDefinition.route[0].cafeIds[0]))).toBeTruthy();
    fireEvent.click(within(popup).getByRole("button", { name: t("pubgame.beery.letsGo") }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(window.localStorage.getItem(`hidden-antwerp:pub-intro:${CODE}`)).toBe("seen");

    // Then the walking navigation (loaded lazily): the café and its address.
    expect(await screen.findByRole("heading", { name: "Rococo" })).toBeTruthy();
    expect(screen.getByText(pubGameCafes["pubs-rococo"].address!)).toBeTruthy();
  });

  test("navigation → \"I'm here\" → the whole team is at the café (drink choice)", async () => {
    const playing = started(lobbyState(true));
    const arrived = apply(playing, "b", { type: "ARRIVE" });
    window.localStorage.setItem(`hidden-antwerp:pub-intro:${CODE}`, "seen");
    const fetchMock = fakeFetch({ body: { version: 3, view: viewOf(arrived, "b"), events: [] } });
    render(<PubGame code={CODE} invite={null} initialView={viewOf(playing, "b")} initialVersion={2} />);

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.beery.letsGo") }));
    fireEvent.click(await screen.findByRole("button", { name: t("gps.continueWithoutGps") }));
    // The route list stays private: no "show route" button in Hidden Pubs.
    expect(screen.queryByRole("button", { name: t("gps.showRoute") })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: t("gps.arrived") }));

    const firstCafe = cafeName(pubGameDefinition.route[0].cafeIds[0]);
    expect(await screen.findByRole("heading", { name: t("pubgame.drinks.welcome", { cafe: firstCafe }) })).toBeTruthy();
    expect(bodyOf(fetchMock, 0)).toMatchObject({ action: { type: "ARRIVE" } });
  });

  test("the rules can be skipped and opened again from the menu", () => {
    render(<PubGame code={CODE} invite={INVITE} initialView={viewOf(started(lobbyState(true)), "b")} initialVersion={2} />);
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.beery.intro.skip") }));
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.beery.letsGo") }));
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.menu.rules") }));
    expect(screen.getByRole("heading", { name: t("pubgame.beery.intro.welcomeTitle") })).toBeTruthy();
  });

  test("a refused action shows why", async () => {
    fakeFetch({ status: 409, body: { error: "empty-team" } }, { body: { changed: false, version: 1 } });
    render(<PubGame code={CODE} invite={INVITE} initialView={viewOf(lobbyState(true), "h")} initialVersion={1} />);
    fireEvent.click(screen.getByRole("button", { name: t("pubgame.lobby.start") }));
    expect(await screen.findByText(t("pubgame.errors.emptyTeam"))).toBeTruthy();
  });
});

// ─── Live updates ───────────────────────────────────────────────────────────

describe("polling", () => {
  test("every 2 seconds: a new player appears; a lost connection is announced", async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = fakeFetch(
        { body: { changed: false, version: 0 } },
        { body: { changed: true, version: 1, view: viewOf(lobbyState(true), "h"), events: [{ version: 1, event: { type: "player-joined", playerId: "b" } }] } },
      );
      render(<PubGame code={CODE} invite={INVITE} initialView={viewOf(lobbyState(false), "h")} initialVersion={0} />);
      expect(screen.queryByText("Bea")).toBeNull();

      await act(async () => vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS));
      expect(fetchMock.mock.calls[0][0]).toBe(`/api/games/${CODE}/state?since=0`);
      await act(async () => vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS));
      expect(screen.getByText("Bea")).toBeTruthy();
      expect(fetchMock.mock.calls[1][0]).toBe(`/api/games/${CODE}/state?since=0`);

      // The next poll asks from the new version; then the network drops.
      fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
      await act(async () => vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS));
      expect(fetchMock.mock.calls[2][0]).toBe(`/api/games/${CODE}/state?since=1`);
      expect(screen.getByText(t("pubgame.connection.offline"))).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  test("no polling while the phone is in a pocket (tab hidden)", async () => {
    vi.useFakeTimers();
    const visibility = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    try {
      const fetchMock = fakeFetch();
      render(<PubGame code={CODE} invite={INVITE} initialView={viewOf(lobbyState(false), "h")} initialVersion={0} />);
      await act(async () => vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 3));
      expect(fetchMock).not.toHaveBeenCalled();

      visibility.mockReturnValue("visible");
      await act(async () => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

// ─── Host ───────────────────────────────────────────────────────────────────

describe("host dashboard", () => {
  test("shows team progress, makes a personal link, and ends the game after confirmation", async () => {
    const state = started(lobbyState(true));
    const ended = apply(state, "h", { type: "END_GAME", at: "2026-10-14T20:00:00.000Z" });
    const fetchMock = fakeFetch(
      { body: { path: `/games/${CODE}/claim#secret-token` } },
      { body: { version: 3, view: viewOf(ended, "h"), events: [] } },
    );
    render(<HostDashboard code={CODE} initialView={viewOf(state, "h")} initialVersion={2} />);

    expect(screen.getByText(t("pubgame.host.noPendingEvidence"))).toBeTruthy();
    expect(screen.getAllByText(t("pubgame.host.progress", { done: 0, total: 12 }))).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.host.playerLinkFor", { name: "Bea" }) }));
    expect(await screen.findByText(`${window.location.origin}/games/${CODE}/claim#secret-token`)).toBeTruthy();
    expect(fetchMock.mock.calls[0][0]).toBe(`/api/games/${CODE}/players/b/link`);

    fireEvent.click(screen.getByRole("button", { name: t("pubgame.host.endGame") }));
    const dialog = screen.getByRole("dialog", { name: t("pubgame.host.endConfirmTitle") });
    fireEvent.click(within(dialog).getByRole("button", { name: t("pubgame.host.endConfirm") }));
    await waitFor(() => expect(screen.queryByRole("button", { name: t("pubgame.host.endGame") })).toBeNull());
    expect(bodyOf(fetchMock, 1)).toMatchObject({ action: { type: "END_GAME" } });
  });
});

// ─── Personal links ─────────────────────────────────────────────────────────

describe("claiming a personal link", () => {
  test("sends the secret from after the #, removes it from the address bar, opens the game", async () => {
    window.history.replaceState(null, "", `/games/${CODE}/claim#secret-token`);
    const fetchMock = fakeFetch({ body: { playerId: "b" } });
    render(<ClaimPlayerLink code={CODE} />);

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith(`/games/${CODE}`));
    expect(bodyOf(fetchMock, 0)).toEqual({ token: "secret-token" });
    expect(window.location.hash).toBe("");
  });

  test("a link without a secret, or a refused one, says it doesn't work", async () => {
    window.history.replaceState(null, "", `/games/${CODE}/claim`);
    const fetchMock = fakeFetch();
    render(<ClaimPlayerLink code={CODE} />);
    expect(await screen.findByText(t("pubgame.claim.invalid"))).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
