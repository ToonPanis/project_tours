import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getPoortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { LocaleProvider } from "@/i18n/client";
import { getPreviousVisitedLocation, getRouteLegToCurrent } from "@/features/navigation/logic/route-legs";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { createWalkSession } from "@/features/walk-session/logic/create-session";
import { applySessionAction } from "@/features/walk-session/logic/session-reducer";
import { getSessionStats } from "@/features/walk-session/logic/session-stats";
import { getOrderedLocations } from "@/features/walk-session/logic/route";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
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
const walk = getPoortjesWalk("nl");

function renderPlayer() {
  return render(
    <LocaleProvider locale="nl">
      <WalkPlayer walk={walk} />
    </LocaleProvider>,
  );
}
const locations = getOrderedLocations(walk);
const AT = "2026-09-26T10:00:00.000Z";

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
  click((await screen.findByRole("button", { name: /Verdergaan: stop/ })).textContent ?? "");
}

describe("Guide walk player: Poortjes van Antwerpen", () => {
  test("starts in Dutch with a chapter card, then shows the first gate with its drawing and status", async () => {
    renderPlayer();

    expect(await screen.findByRole("heading", { level: 1, name: "Poortjes van Antwerpen" })).toBeDefined();
    expect(screen.getByText("33 stops")).toBeDefined();
    click("Start de wandeling");

    // Chapter card for part 1
    expect(screen.getByRole("heading", { level: 1, name: "Zuidkant & Hoogstraat" })).toBeDefined();
    click("Verder");

    // Navigation, in Dutch
    expect(screen.getByText("Je volgende bestemming")).toBeDefined();
    click("Verder zonder live gps");
    click("Ik ben er");

    // The stop page
    expect(screen.getByRole("heading", { level: 1, name: "Rosier 24" })).toBeDefined();
    expect(screen.getByText("Stop 1 van 33")).toBeDefined();
    expect(screen.getAllByText("Poort 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bestaat nog").length).toBeGreaterThan(0);
    expect(screen.getByText("Wat zie je?")).toBeDefined();
    expect(screen.getByText("Toen en nu")).toBeDefined();
    expect(screen.getByText("Wist je dat?")).toBeDefined();
    expect(screen.getByRole("img", { name: /Opmetingstekening van de poort Rosier 24/ })).toBeDefined();
    expect(screen.getByText("Lange Gasthuisstraat 37")).toBeDefined(); // next stop
  });

  test("Gildekamersstraat: the task hides the answer until the walker asks for it", async () => {
    await continueAt("poortjes-gildekamersstraat");

    expect(screen.getByRole("heading", { name: "Kun jij de poort van de tekening terugvinden?" })).toBeDefined();
    // The story (which names the houses) waits for the task.
    expect(screen.queryByRole("heading", { name: "Het verhaal van de straat" })).toBeNull();
    expect(screen.queryByText("Gildekamersstraat 7, het huis De Swane.")).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: "Toon hint" })[0]);
    expect(screen.getByText(/er staat een getal in/)).toBeDefined();

    fireEvent.click(screen.getAllByRole("button", { name: "Toon oplossing" })[0]);
    expect(screen.getByText("Gildekamersstraat 7, het huis De Swane.")).toBeDefined();

    fireEvent.click(screen.getAllByRole("button", { name: "Gevonden!" })[0]);
    expect(screen.getByRole("heading", { name: "Het verhaal van de straat" })).toBeDefined();
  });

  test("the Grote Markt pause shows its slides one at a time", async () => {
    await continueAt("poortjes-grote-markt");

    expect(screen.getByText("Pauzemoment")).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name: "De Grote Markt" })).toBeDefined();
    click("Volgende →");
    expect(screen.getByRole("heading", { level: 2, name: "Het Stadhuis" })).toBeDefined();
    click("De Brabofontein");
    expect(screen.getByText("Legende")).toBeDefined();
    expect(screen.getByText("Interpretatie")).toBeDefined();
  });

  test("vanished gates are mentioned at the nearest stop, with their status", async () => {
    await continueAt("poortjes-leonie-glassplein");

    expect(screen.getByText("Verdwenen poorten in de buurt")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Zilversmidstraat 5" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Zilversmidstraat 17" })).toBeDefined();
    expect(screen.getAllByText("Verdwenen")).toHaveLength(2);
  });

  test("before the Rodestraat the walker chooses: detour or continue the route", async () => {
    await continueAt("poortjes-universiteit");

    expect(screen.getByText("Optionele omweg")).toBeDefined();
    expect(screen.getByRole("button", { name: "Extra poort bekijken" })).toBeDefined();
    click("Route verderzetten: De Stadswaag");

    // Straight on to the Stadswaag: no chapter card, stop 26 of 33.
    expect(screen.getByRole("heading", { level: 1, name: "De Stadswaag" })).toBeDefined();
    expect(screen.getByText("Stop 26 / 33")).toBeDefined();
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
    expect(stats.currentStopNumber).toBe(25);
    expect(stats.totalStops).toBe(33);
    expect(getRouteLegToCurrent(walk, onDetour)?.fromLocationId).toBe("poortjes-universiteit");
  });

  test("skipping the Red Star Line after the MAS finishes the walk", () => {
    const atMas = play([...actionsUntil("poortjes-mas"), { type: "ARRIVE" }]);
    const finished = play([{ type: "COMPLETE_VISIT" }, { type: "CONTINUE_TO_NEXT_LOCATION", at: AT, skipBonus: true }], atMas);

    expect(finished.completedAt).toBe(AT);
    expect(finished.locations["poortjes-red-star-line"].status).toBe("locked");
  });
});
