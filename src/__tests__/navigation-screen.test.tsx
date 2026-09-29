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

function renderNavigation(onArrive = vi.fn()) {
  render(
    <PositionSimulationProvider>
      <SimulationHandle />
      <NavigationScreen
        destination={deMuze}
        route={routeToDeMuze}
        gpsAlreadyEnabled={false}
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

  test("no GPS position is ever written to localStorage", async () => {
    renderNavigation();
    const position = pointAlongRoute(routeToDeMuze.geometry, 30);
    await act(async () => emitPosition(position));
    const everything = JSON.stringify({ ...window.localStorage });
    expect(everything).not.toContain(String(position.latitude).slice(0, 7));
  });
});
