import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "@/features/walk-session/playtest/get-correct-answer";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
import type { SessionAction } from "@/types/session";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: () => <div data-testid="walking-map" />,
}));

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = () => {};
});
afterEach(cleanup);

const walk = classicsOfAntwerpWalk;

function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

/** Saves a visitor session advanced by `actions`, then opens the player and continues. */
async function continueAfter(actions: SessionAction[]) {
  const start = createWalkSession({
    walk,
    team: { id: "visitor", name: "", players: [{ id: "visitor", name: "You" }] },
    sessionId: "s",
    startedAt: "2026-09-23T10:00:00.000Z",
  });
  localWalkSessionStore.save(actions.reduce((state, action) => applySessionAction(walk, state, action), start));
  render(<WalkPlayer walk={walk} />);
  click((await screen.findByRole("button", { name: /Continue: stop/ })).textContent ?? "");
}

describe("Guide walk player: Classics of Antwerp", () => {
  test("starts with the hero screen and walks to the first stop without a team setup", async () => {
    render(<WalkPlayer walk={walk} />);

    expect(await screen.findByRole("heading", { level: 1, name: "Classics of Antwerp" })).toBeDefined();
    expect(screen.getByText("A Walk Through the History of Antwerp")).toBeDefined();
    expect(screen.getByText("18 stops")).toBeDefined();
    expect(screen.getByText("± 3 hours")).toBeDefined();
    click("Start the walk");

    // No "How many players?": straight to navigation.
    expect(screen.queryByText("How many players?")).toBeNull();
    expect(screen.getByRole("heading", { name: "Antwerpen-Centraal" })).toBeDefined();
    click("Continue without live GPS");
    click("I've arrived");

    // The stop page
    expect(screen.getByText("Stop 1 of 18")).toBeDefined();
    expect(screen.getByRole("heading", { level: 1, name: "Antwerpen-Centraal" })).toBeDefined();
    expect(screen.getByText("The railway cathedral")).toBeDefined();
    expect(screen.getByText(/Did you know\?/)).toBeDefined();
    expect(screen.getByText(/Look at this/)).toBeDefined();
    expect(screen.getByText(/min read/)).toBeDefined();
    expect(screen.getByText("The Diamond District")).toBeDefined(); // next stop

    click("Start walking");
    expect(screen.getByText("Stop 2 / 18")).toBeDefined();
    expect(screen.getByRole("heading", { name: "The Diamond District" })).toBeDefined();
  });

  test("shows the legend of Brabo clearly labelled as legend", async () => {
    await continueAfter([...getJumpToStopActions(walk, 11, "2026-09-23T11:00:00.000Z"), { type: "ARRIVE" }]);

    expect(screen.getByRole("heading", { level: 1, name: "The Brabo Fountain" })).toBeDefined();
    expect(screen.getByText("Legend")).toBeDefined();
    expect(screen.getByText("What historians think")).toBeDefined();
  });

  test("the THEN / NOW comparison switches between the photos", async () => {
    await continueAfter([...getJumpToStopActions(walk, 10, "2026-09-23T11:00:00.000Z"), { type: "ARRIVE" }]);

    const thenButton = screen.getByRole("button", { name: /Then/ });
    const nowButton = screen.getByRole("button", { name: "Now" });
    expect(thenButton.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(nowButton);
    expect(nowButton.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/today, with their gilded figures/)).toBeDefined();
  });

  test("the last stop closes the story and finishes the walk", async () => {
    await continueAfter([...getJumpToStopActions(walk, 18, "2026-09-23T12:00:00.000Z"), { type: "ARRIVE" }]);

    expect(screen.getByRole("heading", { level: 1, name: "The Scheldt" })).toBeDefined();
    expect(screen.getByText("Your journey back in time")).toBeDefined();
    expect(screen.getByText(/You've walked back through its history/)).toBeDefined();
    click("Finish the walk");

    expect(screen.getByRole("heading", { name: "The end of the walk" })).toBeDefined();
    expect(screen.getByText("18 / 18")).toBeDefined();
  });
});

describe("existing walks are unaffected", () => {
  test("Hidden Pubs still starts with its team setup", async () => {
    const { hiddenPubsWalk } = await import("@/data/walks/hidden-pubs");
    render(<WalkPlayer walk={hiddenPubsWalk} />);
    click((await screen.findByRole("button", { name: "Start new adventure" })).textContent ?? "");
    expect(screen.getByRole("heading", { name: "How many players?" })).toBeDefined();
  });
});
