import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "@/features/walk-session/playtest/fast-forward";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { localWalkSessionStore, storageKey } from "@/features/walk-session/storage/session-storage";
import { englishTranslator } from "@/i18n/translate";
import { getOrderedLocations } from "@/lib/walk-locations";
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

// Every expected text comes from the walk data or the English UI texts, so
// researchers can correct the content without breaking these tests.
const walk = classicsOfAntwerpWalk;
const t = englishTranslator;
const stops = getOrderedLocations(walk);
const mainStopCount = stops.filter((location) => !location.isBonus).length;

/** Matches text containing `text` literally (like a regex, but safe for any character). */
function containing(text: string): RegExp {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

/** A translated template as a pattern: every "#" placeholder value may be any number. */
function numberPattern(template: string): RegExp {
  return new RegExp(containing(template).source.replaceAll("#", "\\d+"));
}

function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

/** Saves a visitor session advanced by `actions`, then opens the player and continues. */
async function continueAfter(actions: SessionAction[]) {
  const start = createWalkSession({ walk, sessionId: "s", startedAt: "2026-09-23T10:00:00.000Z" });
  localWalkSessionStore.save(actions.reduce((state, action) => applySessionAction(walk, state, action), start));
  render(<WalkPlayer walk={walk} />);
  const continueButton = await screen.findByRole("button", {
    name: numberPattern(t("guide.continueAt", { stop: "#", total: "#" })),
  });
  click(continueButton.textContent ?? "");
}

describe("Guide walk player: Classics of Antwerp", () => {
  test("starts with the hero screen and walks straight to the first stop", async () => {
    const [first, second] = stops;
    const { minMinutes, maxMinutes } = walk.estimatedDuration;
    render(<WalkPlayer walk={walk} />);

    expect(await screen.findByRole("heading", { level: 1, name: walk.title })).toBeDefined();
    expect(screen.getByText(walk.tagline)).toBeDefined();
    expect(screen.getByText(t.plural("guide.stops", mainStopCount))).toBeDefined();
    // Whole hours: the middle of the duration range, rounded.
    expect(screen.getByText(t.plural("guide.hours", Math.round((minMinutes + maxMinutes) / 2 / 60)))).toBeDefined();
    click(t("guide.startWalk"));

    expect(screen.getByRole("heading", { name: first.name })).toBeDefined();
    click(t("gps.continueWithoutGps"));
    click(t("gps.arrived"));

    // Spooky's first task (find a detail): popup → task with its clue photo → found → "well found".
    const quest = first.quest!;
    expect(screen.getByRole("dialog", { name: t("quest.taskForYou") })).toBeDefined();
    click(t("quest.viewTask"));
    expect(screen.getByRole("heading", { level: 1, name: quest.title })).toBeDefined();
    expect(screen.getByAltText(quest.clueImage.alt)).toBeDefined();
    click(t("quest.foundIt"));
    expect(screen.getByRole("dialog", { name: t("quest.discoveryFoundTitle") })).toBeDefined();
    click(t("quest.discoverStory"));

    // The stop page
    expect(screen.getByText(t("guide.stopOf", { stop: 1, total: mainStopCount }))).toBeDefined();
    expect(screen.getByRole("heading", { level: 1, name: first.name })).toBeDefined();
    expect(screen.getByText(first.guide!.subtitle)).toBeDefined();
    expect(screen.getByText(containing(t("guide.didYouKnow")))).toBeDefined();
    expect(screen.getByText(containing(t("guide.lookAtThis")))).toBeDefined();
    expect(screen.getByText(numberPattern(t("guide.minRead", { minutes: "#" })))).toBeDefined();
    expect(screen.getByText(second.name)).toBeDefined(); // next stop

    click(t("guide.startWalking"));
    expect(screen.getByText(t("game.header.stopCounter", { current: 2, total: mainStopCount }))).toBeDefined();
    expect(screen.getByRole("heading", { name: second.name })).toBeDefined();
  });

  test("shows the legend of Brabo clearly labelled as legend", async () => {
    const brabo = stops.findIndex((location) => location.id === "classics-brabo");
    await continueAfter([...getJumpToStopActions(walk, brabo + 1, "2026-09-23T11:00:00.000Z"), { type: "ARRIVE" }]);

    expect(screen.getByRole("heading", { level: 1, name: stops[brabo].name })).toBeDefined();
    expect(screen.getByText(t("guide.sectionLabels.legend"))).toBeDefined();
    expect(screen.getByText(t("guide.sectionLabels.interpretation"))).toBeDefined();
  });

  test("the THEN / NOW comparison switches between the photos", async () => {
    const grand = stops.findIndex((location) => location.id === "classics-grote-markt");
    await continueAfter([...getJumpToStopActions(walk, grand + 1, "2026-09-23T11:00:00.000Z"), { type: "ARRIVE" }]);
    const pair = stops[grand].guide!.thenNow!;

    const thenButton = screen.getByRole("button", { name: t("guide.thenLabel", { year: pair.then.approximateYear }) });
    const nowButton = screen.getByRole("button", { name: t("guide.nowLabel") });
    expect(thenButton.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(nowButton);
    expect(nowButton.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(containing(pair.now.caption))).toBeDefined();
  });

  test("the last stop closes the story and finishes the walk", async () => {
    const last = stops[stops.length - 1];
    const finalLines = last.guide!.closing!.finalLines;
    await continueAfter([...getJumpToStopActions(walk, stops.length, "2026-09-23T12:00:00.000Z"), { type: "ARRIVE" }]);

    expect(screen.getByRole("heading", { level: 1, name: last.name })).toBeDefined();
    expect(screen.getByText(t("guide.journeyTitle"))).toBeDefined();
    expect(screen.getByText(containing(finalLines[finalLines.length - 1]))).toBeDefined();
    click(t("guide.finishWalk"));

    expect(screen.getByRole("heading", { name: getWalkCopy(walk, t).completionTitle })).toBeDefined();
    expect(screen.getByText(`${mainStopCount} / ${mainStopCount}`)).toBeDefined();
  });
});

describe("saved progress", () => {
  test("progress survives a page reload", async () => {
    await continueAfter(getJumpToStopActions(walk, 3, "2026-09-23T11:00:00.000Z"));
    expect(window.localStorage.getItem(storageKey(walk.slug))).not.toBeNull();

    // Simulate a reload: unmount and mount a fresh player.
    cleanup();
    render(<WalkPlayer walk={walk} />);
    expect(await screen.findByRole("button", { name: t("guide.continueAt", { stop: 3, total: mainStopCount }) })).toBeDefined();
  });

  test("starting again asks for confirmation, then deletes the saved walk", async () => {
    localWalkSessionStore.save(createWalkSession({ walk, sessionId: "s", startedAt: "2026-09-23T10:00:00.000Z" }));
    render(<WalkPlayer walk={walk} />);
    click((await screen.findByRole("button", { name: t("guide.startAgain") })).textContent ?? "");
    expect(window.localStorage.getItem(storageKey(walk.slug))).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: t("guide.startAgainConfirm"), hidden: true }));
    expect(window.localStorage.getItem(storageKey(walk.slug))).toBeNull();
  });
});
