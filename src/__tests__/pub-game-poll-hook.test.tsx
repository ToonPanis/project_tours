import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { POLL_INTERVAL_MS, usePubGame } from "@/features/pub-game/client/usePubGame";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView, type PlayerView } from "@/features/pub-game/logic/player-view";
import type { PubGameState } from "@/types/pub-game";

/**
 * usePubGame on its own: polling, versions, events and retries. The screen
 * tests (pub-game-screens.test.tsx) check what players see; these check the
 * rules that keep a phone in sync on a bad connection.
 */

const CODE = "K7M2QX";

function lobby(withBea: boolean): PubGameState {
  const state = createPubGame({
    teams: [
      { id: "t1", name: "Red" },
      { id: "t2", name: "Blue" },
    ],
    playersPerTeam: 4,
    host: { id: "h", name: "Host", teamId: "t1" },
  });
  if (!withBea) return state;
  const joined = applyPubGameAction(pubGameDefinition, {}, state, "b", { type: "JOIN", playerId: "b", name: "Bea", teamId: "t2" });
  if (!joined.ok) throw new Error(joined.error);
  return joined.state;
}

const viewOf = (state: PubGameState): PlayerView => toPlayerView(pubGameDefinition, state, "h");
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

interface OpenRequest {
  url: string;
  init?: RequestInit;
  answer: (response: Response) => Promise<void>;
  fail: () => Promise<void>;
}

/** A fetch whose requests stay open until the test answers (or fails) each one. */
function controlledFetch() {
  const requests: OpenRequest[] = [];
  const mock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
    (url, init) =>
      new Promise<Response>((resolve, reject) => {
        requests.push({
          url,
          init,
          answer: (response) => act(async () => resolve(response)),
          fail: () => act(async () => reject(new TypeError("Failed to fetch"))),
        });
      }),
  );
  vi.stubGlobal("fetch", mock);
  return { mock, requests };
}

const bodyOf = (request: OpenRequest) => JSON.parse(String(request.init?.body)) as Record<string, unknown>;
const tick = () => act(async () => vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS));

/** Starts a tap (act) and returns its promise, without waiting for it. */
function tap(handle: { current: ReturnType<typeof usePubGame> }) {
  let pending: Promise<string | null> = Promise.resolve(null);
  act(() => {
    pending = handle.current.act({ type: "START_GAME" });
  });
  return pending;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePubGame polling", () => {
  test("an unchanged poll doesn't re-render", async () => {
    const fetch = controlledFetch();
    let renders = 0;
    const initialView = viewOf(lobby(false));
    const { result } = renderHook(() => {
      renders++;
      return usePubGame(CODE, initialView, 3);
    });
    const rendersBefore = renders;

    await tick();
    expect(fetch.requests[0].url).toBe(`/api/games/${CODE}/state?since=3`);
    await fetch.requests[0].answer(json({ changed: false, version: 3 }));

    expect(renders).toBe(rendersBefore);
    expect(result.current.view).toBe(initialView);
    expect(result.current.connection).toBe("online");
  });

  test("one request at a time: no new poll while the previous one is still on its way", async () => {
    const fetch = controlledFetch();
    renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    await tick();
    await tick();
    await tick();
    expect(fetch.mock).toHaveBeenCalledTimes(1);

    await fetch.requests[0].answer(json({ changed: false, version: 0 }));
    await tick();
    expect(fetch.mock).toHaveBeenCalledTimes(2);
  });

  test("a late, older answer never replaces a newer view", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));
    const older = viewOf(lobby(false));
    const newer = viewOf(lobby(true));

    // The poll leaves first, then a tap; the tap's answer (version 2) arrives first.
    await tick();
    const pending = tap(result);
    const [poll, action] = fetch.requests;
    expect(poll.url).toContain("/state");
    expect(action.url).toContain("/actions");

    await action.answer(json({ version: 2, view: newer, events: [] }));
    await act(async () => {
      await pending;
    });
    await poll.answer(json({ changed: true, version: 1, view: older, events: [] }));

    // (Views arrive as JSON, so compare content: the newer one has Bea.)
    expect(result.current.view).toEqual(newer);
    expect(result.current.view.players).toHaveLength(2);
  });

  test("each event becomes a popup once, even when a tap and a poll both bring it", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));
    const joined = { version: 1, event: { type: "player-joined" as const, playerId: "b" } };

    const pending = tap(result);
    await fetch.requests[0].answer(json({ version: 1, view: viewOf(lobby(true)), events: [joined] }));
    await act(async () => {
      await pending;
    });
    await tick();
    await fetch.requests[1].answer(json({ changed: true, version: 2, view: viewOf(lobby(true)), events: [joined] }));

    expect(result.current.events).toEqual([joined.event]);
  });

  test("a game that no longer exists is reported as gone", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    await tick();
    await fetch.requests[0].answer(json({ error: "unknown-game" }, 404));

    expect(result.current.connection).toBe("gone");
  });
});

describe("usePubGame actions", () => {
  test("a lost connection is retried once, with the same action id and known version", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 4));

    const pending = tap(result);
    expect(result.current.busy).toBe(true);
    await fetch.requests[0].fail();
    expect(fetch.requests).toHaveLength(2);
    expect(bodyOf(fetch.requests[1])).toEqual(bodyOf(fetch.requests[0]));
    expect(bodyOf(fetch.requests[0])).toMatchObject({ knownVersion: 4, action: { type: "START_GAME" } });

    await fetch.requests[1].answer(json({ version: 5, view: viewOf(lobby(false)), events: [] }));
    expect(await pending).toBeNull();
    expect(result.current.busy).toBe(false);
  });

  test("two lost connections: the tap reports offline", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    const pending = tap(result);
    await fetch.requests[0].fail();
    await fetch.requests[1].fail();

    expect(await pending).toBe("offline");
    expect(result.current.connection).toBe("offline");
    expect(result.current.busy).toBe(false);
  });

  test("each tap gets its own action id", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    const first = tap(result);
    await fetch.requests[0].answer(json({ version: 1, view: viewOf(lobby(false)), events: [] }));
    await act(async () => {
      await first;
    });
    const second = tap(result);
    await fetch.requests[1].answer(json({ version: 2, view: viewOf(lobby(false)), events: [] }));
    await act(async () => {
      await second;
    });

    expect(bodyOf(fetch.requests[0]).actionId).not.toBe(bodyOf(fetch.requests[1]).actionId);
  });
});
