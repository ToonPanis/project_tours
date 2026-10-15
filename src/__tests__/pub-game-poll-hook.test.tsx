import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { REQUEST_TIMEOUT_MS } from "@/features/pub-game/client/api";
import { REVEAL_RETRY_MS, useCafeReveal } from "@/features/pub-game/client/useCafeReveal";
import { POLL_INTERVAL_MS, usePubGame } from "@/features/pub-game/client/usePubGame";
import { applyPubGameAction } from "@/features/pub-game/logic/apply-action";
import { createPubGame } from "@/features/pub-game/logic/create-game";
import { toPlayerView, type PlayerView } from "@/features/pub-game/logic/player-view";
import type { PubGameEvent, PubGameState } from "@/types/pub-game";

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

/** Two events that show a popup (see logic/popups.ts), and one that doesn't. */
const BUDDIES: PubGameEvent = { type: "buddies-linked", playerIds: ["h", "b"], endedPairs: [] };
const TWO_SIPS: PubGameEvent = { type: "drink", teamId: "t1", sips: [{ playerId: "h", sips: 2, because: "card" }] };
const JOINED: PubGameEvent = { type: "player-joined", playerId: "b" };

const viewOf = (state: PubGameState): PlayerView => toPlayerView(pubGameDefinition, state, "h");
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

interface OpenRequest {
  url: string;
  init?: RequestInit;
  answer: (response: Response) => Promise<void>;
  fail: () => Promise<void>;
}

/**
 * A fetch whose requests stay open until the test answers (or fails) each one.
 * Like a browser, it gives up when the request's signal aborts (the timeout).
 */
function controlledFetch() {
  const requests: OpenRequest[] = [];
  const mock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
    (url, init) =>
      new Promise<Response>((resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
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

  test("a poll that hangs gives up after the timeout: offline, and polling goes on", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    await tick();
    expect(fetch.mock).toHaveBeenCalledTimes(1);
    // No answer at all: until the timeout the phone waits (one request at a time)…
    await act(async () => vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS - 1));
    expect(fetch.mock).toHaveBeenCalledTimes(1);
    expect(result.current.connection).toBe("online");
    // …then the request is given up, the banner says offline, and the next poll leaves.
    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(result.current.connection).toBe("offline");
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

  test("each popup shows once, even when a tap and a poll both bring its event", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));
    const buddies = { version: 1, event: BUDDIES };

    const pending = tap(result);
    await fetch.requests[0].answer(json({ version: 1, view: viewOf(lobby(true)), events: [buddies] }));
    await act(async () => {
      await pending;
    });
    await tick();
    await fetch.requests[1].answer(json({ changed: true, version: 2, view: viewOf(lobby(true)), events: [buddies] }));

    expect(result.current.popups.map((popup) => popup.event)).toEqual([BUDDIES]);
  });

  test("only popup events are queued; each popup has its own id, also two from one action", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    await tick();
    await fetch.requests[0].answer(
      json({
        changed: true,
        version: 2,
        view: viewOf(lobby(true)),
        // Version 2 created two events (one action can do that).
        events: [
          { version: 1, event: JOINED },
          { version: 2, event: BUDDIES },
          { version: 2, event: TWO_SIPS },
        ],
      }),
    );

    const { popups } = result.current;
    expect(popups.map((popup) => popup.event)).toEqual([BUDDIES, TWO_SIPS]);
    expect(new Set(popups.map((popup) => popup.id)).size).toBe(2);

    // A later poll with only non-popup events leaves the open popup alone (no flicker).
    await tick();
    await fetch.requests[1].answer(json({ changed: true, version: 3, view: viewOf(lobby(true)), events: [{ version: 3, event: JOINED }] }));
    expect(result.current.popups).toBe(popups);

    act(() => result.current.dismissPopup());
    expect(result.current.popups.map((popup) => popup.event)).toEqual([TWO_SIPS]);
  });

  test("a game that no longer exists is reported as gone, and the phone stops asking", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    await tick();
    await fetch.requests[0].answer(json({ error: "unknown-game" }, 404));
    expect(result.current.connection).toBe("gone");

    await tick();
    await tick();
    expect(fetch.mock).toHaveBeenCalledTimes(1);
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

  test("a server error (perhaps after saving) is retried once with the same action id", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    const pending = tap(result);
    await fetch.requests[0].answer(json({ error: "busy" }, 503));
    expect(fetch.requests).toHaveLength(2);
    expect(bodyOf(fetch.requests[1]).actionId).toBe(bodyOf(fetch.requests[0]).actionId);

    await fetch.requests[1].answer(json({ version: 1, view: viewOf(lobby(false)), events: [] }));
    expect(await pending).toBeNull();
    // A server error is not a lost connection.
    expect(result.current.connection).toBe("online");
  });

  test("a refusal (4xx) is not retried", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    const pending = tap(result);
    await fetch.requests[0].answer(json({ error: "not-host" }, 403));

    expect(await pending).toBe("not-host");
    expect(fetch.requests).toHaveLength(1);
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

  test("busy stays on until every overlapping tap has its answer", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));

    const first = tap(result);
    const second = tap(result);
    await fetch.requests[0].answer(json({ version: 1, view: viewOf(lobby(false)), events: [] }));
    await act(async () => {
      await first;
    });
    expect(result.current.busy).toBe(true);

    await fetch.requests[1].answer(json({ version: 2, view: viewOf(lobby(false)), events: [] }));
    await act(async () => {
      await second;
    });
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

  test("uploading is on while an upload runs, and off again when it fails", async () => {
    controlledFetch();
    const { result } = renderHook(() => usePubGame(CODE, viewOf(lobby(false)), 0));
    let fail: () => void = () => {};

    let upload: Promise<unknown> = Promise.resolve();
    act(() => {
      upload = result.current.whileUploading(
        () => new Promise<void>((_, reject) => (fail = () => reject(new Error("upload lost")))),
      );
    });
    expect(result.current.uploading).toBe(true);

    await act(async () => {
      fail();
      await upload.catch(() => {});
    });
    expect(result.current.uploading).toBe(false);
  });
});

describe("useCafeReveal", () => {
  test("a failed fetch is tried again a little later", async () => {
    const fetch = controlledFetch();
    const { result } = renderHook(() => useCafeReveal(CODE, "cafe-1", "fun-fact"));

    await fetch.requests[0].fail();
    expect(result.current).toBeNull();
    await act(async () => vi.advanceTimersByTimeAsync(REVEAL_RETRY_MS - 1));
    expect(fetch.requests).toHaveLength(1);

    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(fetch.requests).toHaveLength(2);
    const reveal = { explanations: {}, funFact: null };
    await fetch.requests[1].answer(json(reveal));
    expect(result.current).toEqual(reveal);
  });

  test("a refusal is not retried", async () => {
    const fetch = controlledFetch();
    renderHook(() => useCafeReveal(CODE, "cafe-1", "fun-fact"));

    await fetch.requests[0].answer(json({ error: "not-joined" }, 401));
    await act(async () => vi.advanceTimersByTimeAsync(REVEAL_RETRY_MS * 2));
    expect(fetch.requests).toHaveLength(1);
  });
});
