import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getPoortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { LocaleProvider } from "@/i18n/client";
import { createTranslator } from "@/i18n/translate";
import { getPreviousVisitedLocation, getRouteLegToCurrent } from "@/features/navigation/logic/route-legs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getSessionStats } from "@/features/walk-session/logic/session-stats";
import { getOrderedLocations } from "@/lib/walk-locations";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
import type { GuideStopContent } from "@/types/guide";
import type { WalkLocation } from "@/types/location";
import type { SessionAction, WalkSession } from "@/types/session";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: () => <div data-testid="walking-map" />,
}));

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = () => {};
});
afterEach(cleanup);

// These tests follow a Dutch-speaking walker: Dutch texts and a Dutch interface.
// Every expected text comes from the walk data or the Dutch UI texts, so
// researchers can correct the content without breaking these tests.
const walk = getPoortjesWalk("nl");
const t = createTranslator("nl");

function renderPlayer() {
  return render(
    <LocaleProvider locale="nl">
      <WalkPlayer walk={walk} />
    </LocaleProvider>,
  );
}
const locations = getOrderedLocations(walk);
const mainStops = locations.filter((location) => !location.isBonus);
const AT = "2026-09-26T10:00:00.000Z";

function stop(id: string): WalkLocation {
  const location = locations.find((candidate) => candidate.id === id);
  if (!location) throw new Error(`Unknown stop ${id}`);
  return location;
}

function guideOf(id: string): GuideStopContent {
  const guide = stop(id).guide;
  if (!guide) throw new Error(`${id} has no guide content`);
  return guide;
}

/** 1-based number of a main stop, as shown in "Stop 26 / 33". */
function stopNumber(id: string): number {
  return mainStops.findIndex((location) => location.id === id) + 1;
}

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

function newSession(): WalkSession {
  return createWalkSession({
    walk,
    team: { id: "visitor", name: "", players: [{ id: "visitor", name: "You" }] },
    sessionId: "s",
    startedAt: AT,
  });
}

/** Visits every stop before `stopId` (including the optional ones). */
function actionsUntil(stopId: string): SessionAction[] {
  const index = locations.findIndex((location) => location.id === stopId);
  return locations.slice(0, index).flatMap((): SessionAction[] => [
    { type: "ARRIVE" },
    { type: "COMPLETE_VISIT" },
    { type: "CONTINUE_TO_NEXT_LOCATION", at: AT },
  ]);
}

function play(actions: SessionAction[], from = newSession()): WalkSession {
  return actions.reduce((state, action) => applySessionAction(walk, state, action), from);
}

async function continueAt(stopId: string) {
  localWalkSessionStore.save(play([...actionsUntil(stopId), { type: "ARRIVE" }]));
  renderPlayer();
  const continueButton = await screen.findByRole("button", {
    name: numberPattern(t("guide.continueAt", { stop: "#", total: "#" })),
  });
  click(continueButton.textContent ?? "");
}

describe("Guide walk player: Poortjes van Antwerpen", () => {
  test("starts in Dutch with a chapter card, then shows the first gate with its drawing and status", async () => {
    const [first, second] = locations;
    const firstGate = first.guide!.featuredItems![0];
    renderPlayer();

    expect(await screen.findByRole("heading", { level: 1, name: walk.title })).toBeDefined();
    expect(screen.getByText(t.plural("guide.stops", mainStops.length))).toBeDefined();
    click(t("guide.startWalk"));

    // Chapter card for part 1
    expect(screen.getByRole("heading", { level: 1, name: walk.chapters![0].title })).toBeDefined();
    click(t("common.continue"));

    // Navigation, in Dutch
    expect(screen.getByText(t("gps.yourNextDestination"))).toBeDefined();
    click(t("gps.continueWithoutGps"));
    click(t("gps.arrived"));

    // The stop page
    expect(screen.getByRole("heading", { level: 1, name: first.name })).toBeDefined();
    expect(screen.getByText(t("guide.stopOf", { stop: 1, total: mainStops.length }))).toBeDefined();
    expect(screen.getAllByText(t("guide.gateNumber", { numbers: String(firstGate.number) })).length).toBeGreaterThan(0);
    expect(screen.getAllByText(t(`guide.status.${firstGate.status}`)).length).toBeGreaterThan(0);
    expect(screen.getByText(t("guide.whatYouSee"))).toBeDefined();
    expect(screen.getByText(t("guide.thenAndNow"))).toBeDefined();
    expect(screen.getByText(t("guide.didYouKnow"))).toBeDefined();
    expect(screen.getByRole("img", { name: firstGate.image.alt })).toBeDefined();
    expect(screen.getByText(second.name)).toBeDefined(); // next stop
  });

  test("Gildekamersstraat: the task hides the answer until the walker asks for it", async () => {
    const guide = guideOf("poortjes-gildekamersstraat");
    const task = guide.searchTask!;
    const [firstItem] = task.items;
    const storyHeading = guide.sections.find((section) => section.heading)!.heading!;
    await continueAt("poortjes-gildekamersstraat");

    expect(screen.getByRole("heading", { name: firstItem.question })).toBeDefined();
    // The story (which names the houses) waits for the task.
    expect(screen.queryByRole("heading", { name: storyHeading })).toBeNull();
    expect(screen.queryByText(firstItem.solution)).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: t("guide.showHint") })[0]);
    expect(screen.getByText(firstItem.hints[0])).toBeDefined();

    fireEvent.click(screen.getAllByRole("button", { name: t("guide.showSolution") })[0]);
    expect(screen.getByText(firstItem.solution)).toBeDefined();

    fireEvent.click(screen.getAllByRole("button", { name: t("guide.foundIt") })[0]);
    expect(screen.getByRole("heading", { name: storyHeading })).toBeDefined();
  });

  test("the Grote Markt pause shows its slides one at a time", async () => {
    const guide = guideOf("poortjes-grote-markt");
    const pause = guide.infoBoxes!.find((box) => box.kind === "pause")!;
    const [firstCard, secondCard, thirdCard] = guide.cards!;
    await continueAt("poortjes-grote-markt");

    expect(screen.getByText(pause.title)).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name: firstCard.title })).toBeDefined();
    click(`${t("common.next")} →`);
    expect(screen.getByRole("heading", { level: 2, name: secondCard.title })).toBeDefined();
    click(thirdCard.title);
    expect(screen.getByText(t("guide.sectionLabels.legend"))).toBeDefined();
    expect(screen.getByText(t("guide.sectionLabels.interpretation"))).toBeDefined();
  });

  test("vanished gates are mentioned at the nearest stop, with their status", async () => {
    const vanished = guideOf("poortjes-leonie-glassplein").vanishedNearby!;
    await continueAt("poortjes-leonie-glassplein");

    expect(screen.getByText(t("guide.vanishedNearbyTitle"))).toBeDefined();
    for (const item of vanished) {
      expect(screen.getByRole("heading", { name: item.address })).toBeDefined();
    }
    expect(screen.getAllByText(t("guide.status.vanished"))).toHaveLength(vanished.length);
  });

  test("before the Rodestraat the walker chooses: detour or continue the route", async () => {
    const stadswaag = stop("poortjes-stadswaag");
    await continueAt("poortjes-universiteit");

    expect(screen.getByText(t("guide.optionalDetour"))).toBeDefined();
    expect(screen.getByRole("button", { name: t("guide.takeDetour") })).toBeDefined();
    click(t("guide.continueRouteTo", { name: stadswaag.name }));

    // Straight on to the Stadswaag: no chapter card, its own stop number.
    expect(screen.getByRole("heading", { level: 1, name: stadswaag.name })).toBeDefined();
    expect(
      screen.getByText(t("game.header.stopCounter", { current: stopNumber(stadswaag.id), total: mainStops.length })),
    ).toBeDefined();
  });
});

describe("Optional stops in the session", () => {
  test("skipping a detour leaves it unvisited and navigates from the last visited stop", () => {
    const atUniversity = play([...actionsUntil("poortjes-universiteit"), { type: "ARRIVE" }]);
    const skipped = play(
      [{ type: "COMPLETE_VISIT" }, { type: "CONTINUE_TO_NEXT_LOCATION", at: AT, skipBonus: true }],
      atUniversity,
    );

    expect(skipped.currentLocationId).toBe("poortjes-stadswaag");
    expect(skipped.locations["poortjes-rodestraat"].status).toBe("locked");
    expect(getPreviousVisitedLocation(walk, skipped)?.id).toBe("poortjes-universiteit");
    expect(getRouteLegToCurrent(walk, skipped)?.fromLocationId).toBe("poortjes-universiteit");
  });

  test("taking the detour counts it as an extra stop, not as a numbered one", () => {
    const atUniversity = play([...actionsUntil("poortjes-universiteit"), { type: "ARRIVE" }]);
    const onDetour = play([{ type: "COMPLETE_VISIT" }, { type: "CONTINUE_TO_NEXT_LOCATION", at: AT }], atUniversity);

    expect(onDetour.currentLocationId).toBe("poortjes-rodestraat");
    const stats = getSessionStats(walk, onDetour);
    expect(stats.isAtBonusStop).toBe(true);
    // The detour keeps the number of the stop before it.
    expect(stats.currentStopNumber).toBe(stopNumber("poortjes-universiteit"));
    expect(stats.totalStops).toBe(mainStops.length);
    expect(getRouteLegToCurrent(walk, onDetour)?.fromLocationId).toBe("poortjes-universiteit");
  });

  test("skipping the Red Star Line after the MAS finishes the walk", () => {
    const atMas = play([...actionsUntil("poortjes-mas"), { type: "ARRIVE" }]);
    const finished = play([{ type: "COMPLETE_VISIT" }, { type: "CONTINUE_TO_NEXT_LOCATION", at: AT, skipBonus: true }], atMas);

    expect(finished.completedAt).toBe(AT);
    expect(finished.locations["poortjes-red-star-line"].status).toBe("locked");
  });
});
