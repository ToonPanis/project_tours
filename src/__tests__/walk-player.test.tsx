import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "@/features/walk-session/playtest/get-correct-answer";
import { localWalkSessionStore, storageKey } from "@/features/walk-session/storage/session-storage";
import type { SessionAction } from "@/types/session";

beforeEach(() => {
  window.localStorage.clear();
  // jsdom doesn't implement scrolling; the game screens call it on every change.
  window.scrollTo = () => {};
});
afterEach(cleanup);

function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

/** Saves a two-player session advanced by `actions`, as if played earlier. */
function saveSessionAfter(actions: SessionAction[]) {
  const start = createWalkSession({
    walk: hiddenPubsWalk,
    team: {
      id: "t",
      name: "The Antwerp Explorers",
      players: [
        { id: "player-1", name: "Tony" },
        { id: "player-2", name: "Sarah" },
      ],
    },
    sessionId: "s",
    startedAt: "2026-09-23T14:00:00.000Z",
  });
  const session = actions.reduce((state, action) => applySessionAction(hiddenPubsWalk, state, action), start);
  localWalkSessionStore.save(session);
  return session;
}

/** Renders the player and continues the saved walk. */
async function continueSavedWalk() {
  render(<WalkPlayer walk={hiddenPubsWalk} />);
  await screen.findByRole("button", { name: "Continue walk" });
  click("Continue walk");
}

/** Start a new game with two players and walk to the first vote. */
async function startTwoPlayerGameAndStartVote() {
  render(<WalkPlayer walk={hiddenPubsWalk} />);
  // The saved game is loaded after the first render, so wait for the start screen.
  await screen.findByRole("button", { name: "Start new adventure" });
  click("Start new adventure");
  click("2");
  const [teamName, player1, player2] = screen.getAllByRole("textbox");
  fireEvent.change(teamName, { target: { value: "The Antwerp Explorers" } });
  fireEvent.change(player1, { target: { value: "Tony" } });
  fireEvent.change(player2, { target: { value: "Sarah" } });
  click("Start adventure");
  click("Begin the adventure");

  expect(screen.getByRole("heading", { level: 1, name: "Rococo Antwerp" })).toBeDefined();
  expect(screen.getByText("Stop 1 / 8")).toBeDefined();
  click("I've arrived");
  click("Start the drink vote");
}

describe("WalkPlayer: Hidden Pubs", () => {
  test("pass-the-phone voting shows four options and keeps each vote secret", async () => {
    await startTwoPlayerGameAndStartVote();

    expect(screen.getByText("Tony's turn")).toBeDefined();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    fireEvent.click(screen.getByLabelText(/Tongerlo Blond/));
    click("Confirm vote");

    // Pass screen: the next player, and no trace of Tony's choice.
    expect(screen.getByRole("heading", { name: "Pass the phone to Sarah" })).toBeDefined();
    expect(document.body.textContent).not.toContain("Tongerlo");

    click("I'm Sarah");
    expect(screen.getByText("Sarah's turn")).toBeDefined();
    // Nothing is preselected for the next player.
    expect(screen.getByRole("button", { name: "Confirm vote" }).hasAttribute("disabled")).toBe(true);
  });

  test("plays Rococo: vote, story, challenge with hint, history, clue, next café", async () => {
    await startTwoPlayerGameAndStartVote();

    fireEvent.click(screen.getByLabelText(/Tonic Water/));
    click("Confirm vote");
    click("I'm Sarah");
    fireEvent.click(screen.getByLabelText(/Tonic Water/));
    click("Confirm vote");

    // Result
    expect(screen.getByRole("heading", { name: "The tavern has spoken" })).toBeDefined();
    expect(screen.getByText("2 votes counted")).toBeDefined();
    click("Continue");

    // Story: fiction only, no history before the challenge.
    expect(screen.getByText("The First Page")).toBeDefined();
    expect(screen.getByText("The Ledger · fiction")).toBeDefined();
    expect(screen.queryByText(/History/)).toBeNull();
    click("To the challenge");

    // Challenge: a wrong answer, a hint, then the right answer.
    expect(screen.getByText("On-site verification required")).toBeDefined();
    click(/Rounded/);
    expect(screen.getByText("The Ledger remains silent.")).toBeDefined();
    click("Need a hint?");
    expect(screen.getByText(/Hint 1:/)).toBeDefined();
    click(/Stepped/);

    // Correct → history → clue → next café
    expect(screen.getByRole("heading", { name: "The ink begins to move…" })).toBeDefined();
    click("Discover why it matters");
    expect(screen.getByText("History · research required")).toBeDefined();
    click("Continue");
    expect(screen.getByText("The ledger has changed")).toBeDefined();
    expect(screen.getByText("THE STAIR")).toBeDefined();
    click("Continue");
    expect(screen.getByRole("heading", { name: "Café Den Engel" })).toBeDefined();
    expect(screen.getByText(/Zoek de Engel aan de andere zijde van de markt/)).toBeDefined();
    click("Continue journey");

    expect(screen.getByText("Your next destination")).toBeDefined();
    expect(screen.getByText("Stop 2 / 8")).toBeDefined();
    expect(screen.getByText("Clues 1 / 8")).toBeDefined();
  });

  test("progress survives a page reload", async () => {
    await startTwoPlayerGameAndStartVote();
    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).not.toBeNull();

    // Simulate a reload: unmount and mount a fresh player.
    cleanup();
    render(<WalkPlayer walk={hiddenPubsWalk} />);

    expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeDefined();
    expect(screen.getByText("Team: The Antwerp Explorers (Tony, Sarah)")).toBeDefined();
    click("Continue walk");
    expect(screen.getByText("Tony's turn")).toBeDefined();
  });

  test("restart asks for confirmation, then deletes the saved walk", async () => {
    saveSessionAfter([{ type: "ARRIVE" }]);
    render(<WalkPlayer walk={hiddenPubsWalk} />);
    await screen.findByRole("heading", { name: "Welcome back" });

    click("Restart playtest");
    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).not.toBeNull();
    // jsdom has no showModal(), so the dialog counts as "hidden" in tests.
    fireEvent.click(screen.getByRole("button", { name: "Yes, restart", hidden: true }));

    expect(window.localStorage.getItem(storageKey("hidden-pubs"))).toBeNull();
    expect(screen.getByRole("button", { name: "Start new adventure" })).toBeDefined();
  });

  test("skipping the drink round goes straight to the story", async () => {
    await startTwoPlayerGameAndStartVote();
    click("Skip this round");
    expect(screen.getByRole("heading", { name: "The ledger opens" })).toBeDefined();
  });

  test("the Ledger never reveals future cafés", async () => {
    saveSessionAfter(getJumpToStopActions(hiddenPubsWalk, 3, "2026-09-23T15:00:00.000Z"));
    await continueSavedWalk();
    click("Ledger");

    const ledger = screen.getByRole("dialog", { hidden: true });
    expect(within(ledger).getByText("Rococo Antwerp")).toBeDefined();
    expect(within(ledger).getByText("Paters Vaetje")).toBeDefined(); // current
    expect(within(ledger).getAllByText("???")).toHaveLength(5);
    expect(ledger.textContent).not.toContain("De Muze");
    expect(ledger.textContent).not.toContain("Boer van Tienen");
    expect(within(ledger).getByText("THE STAIR")).toBeDefined();
    expect(within(ledger).getByText("11:55")).toBeDefined();
    expect(ledger.textContent).not.toContain("ONE TOWER");
  });

  test("the bonus question at Quinten Matsijs can be skipped", async () => {
    saveSessionAfter([
      ...getJumpToStopActions(hiddenPubsWalk, 6, "2026-09-23T15:00:00.000Z"),
      { type: "ARRIVE" },
      { type: "SKIP_DRINK_ROUND" },
      { type: "SHOW_STORY" },
      { type: "START_CHALLENGE" },
    ]);
    await continueSavedWalk();

    fireEvent.change(screen.getByLabelText("Your answer"), { target: { value: "Tonspel" } });
    click("Submit");
    click("Discover why it matters");

    expect(screen.getByText("Optional bonus")).toBeDefined();
    click("Skip the bonus");
    // The reveal comes after the bonus, so it can mention the old name.
    expect(screen.getByText(/'t Gulick/)).toBeDefined();
  });

  test("the final puzzle completes the walk and shows the closing story", async () => {
    saveSessionAfter(getJumpToStopActions(hiddenPubsWalk, 9, "2026-09-23T16:00:00.000Z"));
    await continueSavedWalk();

    // Final page with all eight clues.
    expect(screen.getByRole("heading", { name: "The Final Page" })).toBeDefined();
    expect(screen.getByText("SEVEN STEPS")).toBeDefined();
    click("Open the final page");

    fireEvent.change(screen.getByLabelText("Your answer"), { target: { value: "noon" } });
    click("Submit");
    expect(screen.getByText("The Ledger remains silent.")).toBeDefined();

    for (const answer of ["vijf voor twaalf", "Horse", "tonspel"]) {
      fireEvent.change(screen.getByLabelText("Your answer"), { target: { value: answer } });
      click("Submit");
    }

    expect(screen.getByText(/Maar de stad/)).toBeDefined();
    click("Close the ledger");

    expect(screen.getByRole("heading", { name: "Case closed" })).toBeDefined();
    expect(screen.getAllByText("8 / 8")).toHaveLength(2); // taverns and clues
    expect(screen.getByText("taverns discovered")).toBeDefined();
    expect(screen.getByText("Clues recovered")).toBeDefined();
    expect(document.body.textContent).not.toMatch(/drinks? (ordered|consumed)/i);
  });
});
