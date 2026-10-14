import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "@/features/walk-session/playtest/get-correct-answer";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
import { englishTranslator } from "@/i18n/translate";
import { getOrderedLocations } from "@/lib/walk-locations";
import type { SessionAction } from "@/types/session";

// The real map needs WebGL, which jsdom doesn't have. The stand-in remembers what it was asked to show.
const mapProps = vi.hoisted(() => [] as Array<Record<string, unknown>>);
vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: (props: Record<string, unknown>) => {
    mapProps.push(props);
    return <div data-testid="walking-map" />;
  },
}));

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = () => {};
  mapProps.length = 0;
});
afterEach(cleanup);

// Every expected text comes from the walk data or the UI texts (English: the player is rendered
// without a language provider here; quest-texts in all languages are checked in classics-data.test.ts).
const walk = classicsOfAntwerpWalk;
const t = englishTranslator;
const stops = getOrderedLocations(walk);
// The "find the place" quest (the Meir); the "find a detail" tasks are tested below.
const questIndex = stops.findIndex((location) => location.quest?.type === "location");
const questStop = stops[questIndex];
if (questStop.quest?.type !== "location") throw new Error("Classics of Antwerp should have a find-the-place quest");
const quest = questStop.quest;

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }));
}

/** Nothing on screen may give the answer away before the place is found. */
function expectNoSpoiler() {
  const shown = document.body.textContent ?? "";
  expect(shown).not.toContain(quest.revealedName);
  expect(shown).not.toContain(quest.revealedAddress);
}

/** Saves a session advanced by `actions`, then opens the player and continues. */
async function continueAfter(actions: SessionAction[]) {
  const start = createWalkSession({
    walk,
    team: { id: "visitor", name: "", players: [{ id: "visitor", name: "You" }] },
    sessionId: "s",
    startedAt: "2026-10-10T10:00:00.000Z",
  });
  localWalkSessionStore.save(actions.reduce((state, action) => applySessionAction(walk, state, action), start));
  render(<WalkPlayer walk={walk} />);
  const continueButton = await screen.findByRole("button", { name: /\d+/ });
  fireEvent.click(continueButton);
}

describe("Spooky's quest on the Meir", () => {
  test("briefing → search zone → found → the story, without giving the answer away first", async () => {
    await continueAfter(getJumpToStopActions(walk, questIndex + 1, "2026-10-10T11:00:00.000Z"));

    // 1. Spooky announces the task in a popup.
    expect(screen.getByRole("dialog", { name: t("quest.taskForYou") })).toBeDefined();
    expect(screen.getAllByAltText(t("quest.spookyAlt")).length).toBeGreaterThan(0);
    expectNoSpoiler();
    click(t("quest.viewTask"));

    // 2. The task: the old drawing first, then what to do.
    expect(screen.getByRole("heading", { level: 1, name: quest.title })).toBeDefined();
    expect(screen.getByText(quest.clueImage.caption)).toBeDefined();
    expect(screen.getByText(quest.task[0])).toBeDefined();
    expectNoSpoiler();
    click(t("quest.startSearching"));

    // 3. Navigation to the search zone (here without GPS): a circle, no pin, the clue at hand.
    click(t("gps.continueWithoutGps"));
    expect(screen.getByText(quest.zoneHint)).toBeDefined();
    // The map is loaded separately (next/dynamic): wait for it.
    await screen.findByTestId("walking-map");
    const map = mapProps.at(-1)!;
    expect(map.searchZone).toEqual(quest.searchZone);
    expect((map.destination as { coordinates: unknown }).coordinates).toEqual(quest.searchZone.center);
    expectNoSpoiler();

    click(t("quest.showClue"));
    expect(screen.getByRole("dialog", { name: quest.title })).toBeDefined();
    click(t("common.close"));

    // Without GPS the walker says they found it (the subtle fallback).
    expect(screen.getByText(t("quest.withoutGpsHint"))).toBeDefined();
    click(t("quest.foundIt"));

    // 4. Spooky congratulates, once.
    expect(screen.getByRole("dialog", { name: t("quest.foundTitle") })).toBeDefined();
    expect(screen.getByText(t("quest.foundBody"))).toBeDefined();
    expectNoSpoiler();
    click(t("quest.discoverStory"));

    // 5. Only now: the real name, the exact address and the story.
    expect(screen.getByRole("heading", { level: 1, name: quest.revealedName })).toBeDefined();
    expect(document.body.textContent).toContain(quest.revealedAddress);
    expect(screen.getByText(questStop.guide!.sections[0].paragraphs[0])).toBeDefined();
    expect(screen.queryByRole("dialog", { name: t("quest.foundTitle") })).toBeNull();
  });

  test("after a reload a found place opens its story directly (no popup again)", async () => {
    await continueAfter([...getJumpToStopActions(walk, questIndex + 1, "2026-10-10T11:00:00.000Z"), { type: "ARRIVE" }]);

    expect(screen.getByRole("heading", { level: 1, name: quest.revealedName })).toBeDefined();
    expect(screen.queryByRole("dialog", { name: t("quest.foundTitle") })).toBeNull();
    expect(screen.queryByRole("dialog", { name: t("quest.taskForYou") })).toBeNull();
  });

  test("the stop before the quest announces Spooky, not the place", async () => {
    await continueAfter([...getJumpToStopActions(walk, questIndex, "2026-10-10T11:00:00.000Z"), { type: "ARRIVE" }]);

    // "Next: …" shows the neutral name of the quest stop.
    expect(screen.getByText(questStop.name)).toBeDefined();
    expectNoSpoiler();
  });
});

describe("Spooky's 'find a detail' tasks (Centraal Station, Vleeshuis)", () => {
  const vleeshuisIndex = stops.findIndex((location) => location.id === "classics-vleeshuis");
  const vleeshuis = stops[vleeshuisIndex];
  const task = vleeshuis.quest!;
  const arriveAtVleeshuis = [...getJumpToStopActions(walk, vleeshuisIndex + 1, "2026-10-10T11:00:00.000Z"), { type: "ARRIVE" as const }];

  test("both stops have one; it is a detail to find, so the stop keeps its own name and pin", () => {
    const withTask = stops.filter((location) => location.quest?.type === "discovery").map((location) => location.id);
    expect(withTask).toEqual(["classics-central-station", "classics-vleeshuis"]);
    expect(vleeshuis.coordinates).not.toBeNull();
  });

  test("arrival → popup → task with its clue (which opens large) → 'I've found it' → 'well found' → the story", async () => {
    await continueAfter(arriveAtVleeshuis);

    expect(screen.getByRole("dialog", { name: t("quest.taskForYou") })).toBeDefined();
    click(t("quest.viewTask"));
    expect(screen.getByRole("heading", { level: 1, name: task.title })).toBeDefined();
    expect(screen.getByText(task.task[0])).toBeDefined();

    click(t("guide.gallery.enlarge"));
    expect(screen.getByRole("dialog", { name: task.clueImage.caption })).toBeDefined();
    click(t("common.close"));

    click(t("quest.foundIt"));
    expect(screen.getByRole("dialog", { name: t("quest.discoveryFoundTitle") })).toBeDefined();
    click(t("quest.discoverStory"));

    // The stop's own page, with everything on it, including the postcards.
    expect(screen.getByRole("heading", { level: 1, name: vleeshuis.name })).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name: vleeshuis.guide!.galleries![0].title })).toBeDefined();
  });

  test("not found yet → after a reload the task is still there; found → after a reload the story opens directly", async () => {
    await continueAfter(arriveAtVleeshuis);
    expect(screen.getByRole("dialog", { name: t("quest.taskForYou") })).toBeDefined();
    cleanup();

    // "I've found it" is saved with the walk (the stop moves on to its story).
    await continueAfter([...arriveAtVleeshuis, { type: "SHOW_STORY" }]);
    expect(screen.getByRole("heading", { level: 1, name: vleeshuis.name })).toBeDefined();
    expect(screen.queryByRole("dialog", { name: t("quest.taskForYou") })).toBeNull();
    expect(screen.queryByRole("dialog", { name: t("quest.discoveryFoundTitle") })).toBeNull();
  });
});
