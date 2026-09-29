import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { screen } from "@testing-library/react";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
import { englishTranslator as t } from "@/i18n/translate";
import type { Walk } from "@/types/walk";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: () => <div data-testid="walking-map" />,
}));

/**
 * M-15: the play page used to send only "Loading…" in its HTML: a blank screen
 * until all JavaScript had run. The start screen now renders on the server; only
 * its buttons wait for the saved game (read from localStorage in the browser).
 */
beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = () => {};
});
afterEach(() => {
  document.body.innerHTML = "";
});

/** Hydrates server HTML like the browser does, and collects hydration errors. */
async function hydrateServerHtml(walk: Walk) {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<WalkPlayer walk={walk} />);
  document.body.append(container);
  const hydrationErrors: unknown[] = [];
  await act(async () => {
    hydrateRoot(container, <WalkPlayer walk={walk} />, {
      onRecoverableError: (error) => hydrationErrors.push(error),
    });
  });
  return hydrationErrors;
}

const DISABLED_LOADING_BUTTON = new RegExp(`<button[^>]*disabled[^>]*>${t("common.loading")}</button>`);

describe("play page first paint (server HTML)", () => {
  test("a guide walk's hero is in the server HTML, with its button waiting for the save", () => {
    const html = renderToString(<WalkPlayer walk={classicsOfAntwerpWalk} />);
    expect(html).toContain(classicsOfAntwerpWalk.title);
    expect(html).toContain(classicsOfAntwerpWalk.tagline);
    expect(html).toMatch(DISABLED_LOADING_BUTTON);
    expect(html).not.toContain(`>${t("guide.startWalk")}</button>`);
    // The hero photo starts downloading with the HTML (it used to wait for JavaScript).
    expect(html).toMatch(/<link rel="preload" as="image"/);
  });

  test("a game walk's start screen is in the server HTML, with its button waiting for the save", () => {
    const html = renderToString(<WalkPlayer walk={hiddenPubsWalk} />);
    expect(html).toContain(hiddenPubsWalk.narrative?.title ?? hiddenPubsWalk.title);
    expect(html).toMatch(DISABLED_LOADING_BUTTON);
    expect(html).not.toContain(`>${t("game.start.newAdventure")}</button>`);
  });
});

describe("play page hydration", () => {
  test("without a save: hydrates cleanly, then offers to start", async () => {
    expect(await hydrateServerHtml(classicsOfAntwerpWalk)).toEqual([]);
    expect((screen.getByRole("button", { name: t("guide.startWalk") }) as HTMLButtonElement).disabled).toBe(false);
    expect(screen.queryByRole("button", { name: t("common.loading") })).toBeNull();
  });

  test("with a save: hydrates cleanly, then offers to continue (never a start that overwrites it)", async () => {
    localWalkSessionStore.save(
      createWalkSession({
        walk: hiddenPubsWalk,
        team: { id: "t", name: "", players: [{ id: "p1", name: "Tony" }] },
        sessionId: "s",
        startedAt: "2026-09-23T14:00:00.000Z",
      }),
    );
    expect(await hydrateServerHtml(hiddenPubsWalk)).toEqual([]);
    expect((screen.getByRole("button", { name: t("game.start.continueWalk") }) as HTMLButtonElement).disabled).toBe(false);
    expect(screen.queryByRole("button", { name: t("game.start.newAdventure") })).toBeNull();
  });
});
