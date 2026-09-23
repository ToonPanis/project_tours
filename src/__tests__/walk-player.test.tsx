import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { storageKey } from "@/features/walk-session/storage/session-storage";

beforeEach(() => {
  window.localStorage.clear();
  // jsdom doesn't implement scrolling; the game screens call it on every change.
  window.scrollTo = () => {};
});
afterEach(cleanup);

function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

/** Start a new game with two players and walk to the first vote. */
async function startTwoPlayerGameAndArrive() {
  render(<WalkPlayer walk={hiddenPubsWalk} />);
  // The saved game is loaded after the first render, so wait for the start screen.
  await screen.findByRole("button", { name: "Start new adventure" });
  click("Start new adventure");
  click("2");
  fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Tony" } });
  fireEvent.change(screen.getAllByRole("textbox")[1], { target: { value: "Sarah" } });
  click("Start adventure");
  click("Begin the adventure");

  expect(screen.getByRole("heading", { level: 1, name: "Rococo Antwerp" })).toBeDefined();
  expect(screen.getByText("Stop 1 / 8")).toBeDefined();
  click("I've arrived");
  click("Start the drink vote");
}

describe("WalkPlayer: Hidden Pubs playtest", () => {
  test("pass-the-phone voting keeps each vote secret", async () => {
    await startTwoPlayerGameAndArrive();

    expect(screen.getByText("Tony's turn")).toBeDefined();
    fireEvent.click(screen.getByLabelText(/Beer A \(test\)/));
    click("Confirm vote");

    // Pass screen: the next player, and no trace of Tony's choice.
    expect(screen.getByRole("heading", { name: "Pass the phone to Sarah" })).toBeDefined();
    expect(document.body.textContent).not.toContain("Beer A");

    click("I'm Sarah");
    expect(screen.getByText("Sarah's turn")).toBeDefined();
    // Nothing is preselected for the next player.
    expect(screen.getByRole("button", { name: "Confirm vote" }).hasAttribute("disabled")).toBe(true);
  });

  test("plays the first café from vote to the next destination", async () => {
    await startTwoPlayerGameAndArrive();

    fireEvent.click(screen.getByLabelText(/Beer A \(test\)/));
    click("Confirm vote");
    click("I'm Sarah");
    fireEvent.click(screen.getByLabelText(/Beer A \(test\)/));
    click("Confirm vote");

    // Result
    expect(screen.getByRole("heading", { name: "The tavern has spoken" })).toBeDefined();
    expect(screen.getByText("2 votes counted")).toBeDefined();
    click("Continue");

    // Story
    expect(screen.getByText("Chapter I: The First Page")).toBeDefined();
    expect(screen.getByText("The Ledger · fiction")).toBeDefined();
    click("To the challenge");

    // Challenge: a wrong answer first, then a hint, then the right answer.
    click("Finishing your drink");
    expect(screen.getByText("The Ledger remains silent.")).toBeDefined();
    click("Need a hint?");
    expect(screen.getByText(/Hint 1:/)).toBeDefined();
    click("Solving what each tavern asks");

    // Clue and next location
    expect(screen.getByText("Clue discovered")).toBeDefined();
    expect(screen.getByText("T")).toBeDefined();
    click("Continue");
    expect(screen.getByRole("heading", { name: "Café Den Engel" })).toBeDefined();
    click("Continue journey");

    expect(screen.getByText("Your next destination")).toBeDefined();
    expect(screen.getByText("Stop 2 / 8")).toBeDefined();
    expect(screen.getByText("Clues 1 / 7")).toBeDefined();
  });

  test("progress survives a page reload", async () => {
    await startTwoPlayerGameAndArrive();
    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).not.toBeNull();

    // Simulate a reload: unmount and mount a fresh player.
    cleanup();
    render(<WalkPlayer walk={hiddenPubsWalk} />);

    expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeDefined();
    expect(screen.getByText("Team: Tony, Sarah")).toBeDefined();
    click("Continue walk");
    expect(screen.getByText("Tony's turn")).toBeDefined();
  });

  test("skipping the drink round goes straight to the story", async () => {
    await startTwoPlayerGameAndArrive();
    click("Skip this round");
    expect(screen.getByRole("heading", { name: "The ledger opens" })).toBeDefined();
  });
});
