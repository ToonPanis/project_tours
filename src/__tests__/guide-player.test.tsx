import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getJumpToStopActions } from "@/features/walk-session/playtest/get-correct-answer";
import { getWalkCopy } from "@/features/walk-session/logic/walk-copy";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
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
  const start = createWalkSession({
    walk,
    team: { id: "visitor", name: "", players: [{ id: "visitor", name: "You" }] },
    sessionId: "s",
    startedAt: "2026-09-23T10:00:00.000Z",
  });
  localWalkSessionStore.save(actions.reduce((state, action) => applySessionAction(walk, state, action), start));
  render(<WalkPlayer walk={walk} />);
  const continueButton = await screen.findByRole("button", {
    name: numberPattern(t("guide.continueAt", { stop: "#", total: "#" })),
  });
  click(continueButton.textContent ?? "");
}

describe("Guide walk player: Classics of Antwerp", () => {
  test("starts with the hero screen and walks to the first stop without a team setup", async () => {
    const [first, second] = stops;
    const { minMinutes, maxMinutes } = walk.estimatedDuration;
    render(<WalkPlayer walk={walk} />);

    expect(await screen.findByRole("heading", { level: 1, name: walk.title })).toBeDefined();
    expect(screen.getByText(walk.tagline)).toBeDefined();
    expect(screen.getByText(t.plural("guide.stops", mainStopCount))).toBeDefined();
    // Whole hours: the middle of the duration range, rounded.
    expect(screen.getByText(t.plural("guide.hours", Math.round((minMinutes + maxMinutes) / 2 / 60)))).toBeDefined();
    click(t("guide.startWalk"));

    // No "How many players?": straight to navigation.
    expect(screen.queryByText(t("game.team.howMany"))).toBeNull();
    expect(screen.getByRole("heading", { name: first.name })).toBeDefined();
    click(t("gps.continueWithoutGps"));
    click(t("gps.arrived"));

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
    await continueAfter([...getJumpToStopActions(walk, 11, "2026-09-23T11:00:00.000Z"), { type: "ARRIVE" }]);

    expect(screen.getByRole("heading", { level: 1, name: stops[10].name })).toBeDefined();
    expect(screen.getByText(t("guide.sectionLabels.legend"))).toBeDefined();
    expect(screen.getByText(t("guide.sectionLabels.interpretation"))).toBeDefined();
  });

  test("the THEN / NOW comparison switches between the photos", async () => {
    await continueAfter([...getJumpToStopActions(walk, 10, "2026-09-23T11:00:00.000Z"), { type: "ARRIVE" }]);
    const pair = stops[9].guide!.thenNow!;

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

describe("existing walks are unaffected", () => {
  test("Hidden Pubs still starts with its team setup", async () => {
    const { hiddenPubsWalk } = await import("@/data/walks/hidden-pubs");
    render(<WalkPlayer walk={hiddenPubsWalk} />);
    click((await screen.findByRole("button", { name: t("game.start.newAdventure") })).textContent ?? "");
    expect(screen.getByRole("heading", { name: t("game.team.howMany") })).toBeDefined();
  });
});
