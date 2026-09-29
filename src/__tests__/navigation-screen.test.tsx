import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useEffect } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import { getRouteLegTo } from "@/features/navigation/logic/route-legs";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
import { getImmediateLabel } from "@/features/navigation/logic/maneuver-display";
import { getRouteProgress, pointAlongRoute } from "@/features/navigation/logic/route-progress";
import { getManeuverLabel } from "@/lib/routing/maneuver-labels";
import { distanceInMeters } from "@/lib/geo";
import {
  PositionSimulationProvider,
  usePositionSimulation,
} from "@/features/navigation/simulation/PositionSimulation";
import type { GeoCoordinates } from "@/types/common";

// The real map needs WebGL, which jsdom doesn't have.
vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: () => <div data-testid="walking-map" />,
}));

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

const deMuze = hiddenPubsWalk.locations.find((location) => location.id === "pubs-de-muze")!;
const routeToDeMuze = getRouteLegTo(hiddenPubsWalk, "pubs-de-muze")!.route;

/** Gives the test a handle on the simulated GPS. */
const simulationHandle: { emit: (coordinates: GeoCoordinates, accuracyMeters?: number) => void } = {
  emit: () => {},
};
function SimulationHandle() {
  const { emit } = usePositionSimulation();
  useEffect(() => {
    simulationHandle.emit = emit;
  }, [emit]);
  return null;
}
const emitPosition = (coordinates: GeoCoordinates, accuracyMeters?: number) =>
  simulationHandle.emit(coordinates, accuracyMeters);

function renderNavigation(onArrive = vi.fn(), { gpsAlreadyEnabled = false } = {}) {
  render(
    <PositionSimulationProvider>
      <SimulationHandle />
      <NavigationScreen
        destination={deMuze}
        route={routeToDeMuze}
        gpsAlreadyEnabled={gpsAlreadyEnabled}
        onGpsEnabled={() => {}}
        onArrive={onArrive}
        onShowRoute={() => {}}
      />
    </PositionSimulationProvider>,
  );
  return onArrive;
}

describe("NavigationScreen", () => {
  test("explains location use before asking for it, with a no-GPS fallback", async () => {
    renderNavigation();
    expect(screen.getByRole("heading", { name: "Enable walking navigation" })).toBeDefined();
    expect(screen.getByText("show where you are")).toBeDefined();
    expect(screen.getByRole("button", { name: "Enable location" })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Continue without live GPS" }));
    // The map is loaded lazily, so wait for it.
    expect(await screen.findByTestId("walking-map")).toBeDefined();
    expect(screen.getByRole("button", { name: "I've arrived" })).toBeDefined();
  });

  test("shows the next maneuver while walking the route", async () => {
    renderNavigation();
    const position = pointAlongRoute(routeToDeMuze.geometry, 5);
    await act(async () => emitPosition(position));

    // The instruction the route data says should be shown here.
    const progress = getRouteProgress(routeToDeMuze, position);
    const maneuver = progress.nextStep!.maneuver;
    const expectedLabel =
      progress.distanceToNextStepMeters <= NAVIGATION_CONFIG.MANEUVER_NOW_METERS
        ? getImmediateLabel(maneuver)
        : getManeuverLabel(maneuver);
    expect(screen.getByText(expectedLabel)).toBeDefined();
    expect(await screen.findByTestId("walking-map")).toBeDefined();
  });

  test("detects arrival from GPS and moves the game on", async () => {
    const onArrive = renderNavigation();
    const destination = deMuze.coordinates!;
    await act(async () => emitPosition(destination)); // switches navigation to live mode
    await act(async () => emitPosition(destination));
    await act(async () => emitPosition(destination));
    expect(onArrive).toHaveBeenCalledTimes(1);
  });

  test("an inaccurate position never triggers arrival, and shows a weak-signal warning", async () => {
    const onArrive = renderNavigation();
    const destination = deMuze.coordinates!;
    for (let reading = 0; reading < 4; reading++) {
      await act(async () => emitPosition(destination, 80));
    }
    expect(onArrive).not.toHaveBeenCalled();
    expect(screen.getByText("GPS signal is weak.")).toBeDefined();
    // A manual fallback is offered when GPS is weak.
    expect(screen.getByRole("button", { name: "I'm here" })).toBeDefined();
  });

  // H-01: with good GPS the walker must still be able to continue (unreachable pin,
  // GPS reflections in narrow streets). Automatic arrival stays the main path.
  test("with good GPS just outside the arrival radius, 'I'm here' moves the game on", async () => {
    const onArrive = renderNavigation();
    // 60 m before the end of the route: outside the 40 m radius, e.g. an unreachable pin.
    const nearby = pointAlongRoute(routeToDeMuze.geometry, routeToDeMuze.distanceMeters - 60);
    expect(distanceInMeters(nearby, deMuze.coordinates!)).toBeGreaterThan(NAVIGATION_CONFIG.ARRIVAL_RADIUS_METERS);
    for (let reading = 0; reading < 3; reading++) {
      await act(async () => emitPosition(nearby, 5)); // 5 m accuracy: a "good" fix
    }
    expect(onArrive).not.toHaveBeenCalled();
    expect(screen.queryByText("GPS signal is weak.")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "I'm here" }));
    expect(onArrive).toHaveBeenCalledTimes(1);
  });

  test("far from the stop with good GPS, 'I'm here' asks first (an accidental tap can't skip ahead)", async () => {
    const onArrive = renderNavigation();
    const farAway = pointAlongRoute(routeToDeMuze.geometry, 5); // at the start of the route
    expect(distanceInMeters(farAway, deMuze.coordinates!)).toBeGreaterThan(
      NAVIGATION_CONFIG.MANUAL_ARRIVAL_CONFIRM_METERS,
    );
    await act(async () => emitPosition(farAway, 5));

    // Cancel: nothing happens. (jsdom has no showModal, so the dialog counts as hidden.)
    fireEvent.click(screen.getByRole("button", { name: "I'm here" }));
    expect(screen.getByRole("heading", { name: `Are you at ${deMuze.name}?`, hidden: true })).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Cancel", hidden: true }));
    expect(onArrive).not.toHaveBeenCalled();

    // Confirm: the game moves on.
    fireEvent.click(screen.getByRole("button", { name: "I'm here" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, I'm here", hidden: true }));
    expect(onArrive).toHaveBeenCalledTimes(1);
  });

  test("with weak GPS far away, 'I'm here' doesn't ask (the position can't be trusted)", async () => {
    const onArrive = renderNavigation();
    await act(async () => emitPosition(pointAlongRoute(routeToDeMuze.geometry, 5), 80));
    fireEvent.click(screen.getByRole("button", { name: "I'm here" }));
    expect(onArrive).toHaveBeenCalledTimes(1);
  });

  test("'I'm here' is offered while waiting for the first GPS reading", async () => {
    // A browser GPS that is on but hasn't answered yet (e.g. indoors, or the permission prompt is open).
    const realGeolocation = Object.getOwnPropertyDescriptor(navigator, "geolocation");
    const realSecureContext = Object.getOwnPropertyDescriptor(window, "isSecureContext");
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { watchPosition: vi.fn(() => 1), clearWatch: vi.fn() },
    });
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    try {
      const onArrive = renderNavigation(vi.fn(), { gpsAlreadyEnabled: true });
      await act(async () => {}); // let the GPS effect start
      expect(navigator.geolocation.watchPosition).toHaveBeenCalled();
      expect(screen.queryByText("GPS signal is weak.")).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "I'm here" }));
      expect(onArrive).toHaveBeenCalledTimes(1);
    } finally {
      cleanup();
      if (realGeolocation) Object.defineProperty(navigator, "geolocation", realGeolocation);
      else delete (navigator as { geolocation?: unknown }).geolocation;
      if (realSecureContext) Object.defineProperty(window, "isSecureContext", realSecureContext);
      else delete (window as { isSecureContext?: unknown }).isSecureContext;
    }
  });

  test("no GPS position is ever written to localStorage", async () => {
    renderNavigation();
    const position = pointAlongRoute(routeToDeMuze.geometry, 30);
    await act(async () => emitPosition(position));
    const everything = JSON.stringify({ ...window.localStorage });
    expect(everything).not.toContain(String(position.latitude).slice(0, 7));
  });
});
