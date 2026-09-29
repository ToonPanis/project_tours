import { englishTranslator as t } from "@/i18n/translate";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { hiddenPubsWalk } from "@/data/walks/hidden-pubs";
import { DirectionPanel } from "@/features/navigation/components/DirectionPanel";
import { NavigationScreen } from "@/features/navigation/components/NavigationScreen";
import { NAVIGATION_CONFIG } from "@/features/navigation/config";
import { useWakeLock } from "@/features/navigation/hooks/useWakeLock";
import { getArrowRotation, getTravelHeading, toCompassPoint, toStableCompassPoint } from "@/features/navigation/logic/compass";
import { getNavigationView } from "@/features/navigation/logic/navigation-view";
import { initialTracking } from "@/features/navigation/logic/tracking";
import { PositionSimulationProvider } from "@/features/navigation/simulation/PositionSimulation";
import type { GpsFix } from "@/types/navigation";

vi.mock("@/features/navigation/components/WalkingMap", () => ({
  default: () => <div data-testid="walking-map" />,
}));

afterEach(cleanup);

const rococo = hiddenPubsWalk.locations[0];
const fix = (changes: Partial<GpsFix> = {}): GpsFix => ({
  coordinates: { latitude: 51.2211, longitude: 4.3997 },
  accuracyMeters: 5,
  headingDegrees: null,
  speedMetersPerSecond: null,
  timestamp: 1_000,
  ...changes,
});

// M-20: without a route (first stop, or far off the route) the walker still gets a direction.
describe("head to destination: a direction, not just a name", () => {
  test.each([
    [0, "n"],
    [44, "ne"],
    [91, "e"],
    [180, "s"],
    [224, "sw"],
    [359, "n"],
  ])("bearing %i° is compass point %s", (bearing, point) => {
    expect(toCompassPoint(bearing)).toBe(point);
  });

  test("the shown direction doesn't flip back and forth on GPS noise near a boundary", () => {
    let shown = toStableCompassPoint(20, null); // north
    expect(shown).toBe("n");
    for (const noisy of [24, 21, 26, 23, 25]) shown = toStableCompassPoint(noisy, shown); // around the n/ne edge (22.5°)
    expect(shown).toBe("n");
    expect(toStableCompassPoint(40, shown)).toBe("ne"); // clearly north-east now
  });

  test("the phone's heading is only trusted while walking", () => {
    expect(getTravelHeading(fix({ headingDegrees: 90, speedMetersPerSecond: 0.2 }))).toBeNull();
    expect(getTravelHeading(fix({ headingDegrees: 90, speedMetersPerSecond: null }))).toBeNull();
    expect(
      getTravelHeading(fix({ headingDegrees: 90, speedMetersPerSecond: NAVIGATION_CONFIG.MIN_SPEED_FOR_HEADING_METERS_PER_SECOND })),
    ).toBe(90);
  });

  test("the arrow points relative to the walking direction when known, else on the north-up map", () => {
    expect(getArrowRotation(90, null)).toBe(90); // east, on a north-up map
    expect(getArrowRotation(90, 90)).toBe(0); // walking east: straight ahead
    expect(getArrowRotation(0, 90)).toBe(270); // destination north while walking east: to the left
  });

  test("the first stop (no route) gets a bearing and a compass direction in the panel", () => {
    const start = fix({ coordinates: { latitude: rococo.coordinates!.latitude - 0.003, longitude: rococo.coordinates!.longitude } });
    const view = getNavigationView(start, null, rococo.name, rococo.coordinates, initialTracking);
    expect(view.instruction).toMatchObject({ kind: "head-to-destination" });
    if (view.instruction.kind !== "head-to-destination") return;
    expect(toCompassPoint(view.instruction.bearingDegrees)).toBe("n");

    render(<DirectionPanel instruction={view.instruction} t={t} />);
    expect(screen.getByText("Direction: north")).toBeDefined();
  });
});

// L-11 / L-12: a fake browser GPS, to test the real watchPosition path.
describe("GPS status and retry (real geolocation path)", () => {
  type Callbacks = { success: PositionCallback; error: PositionErrorCallback };
  let watches: Callbacks[];
  let clearWatch: ReturnType<typeof vi.fn>;
  const realGeolocation = Object.getOwnPropertyDescriptor(navigator, "geolocation");
  const realSecureContext = Object.getOwnPropertyDescriptor(window, "isSecureContext");

  beforeEach(() => {
    watches = [];
    clearWatch = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        watchPosition: (success: PositionCallback, error: PositionErrorCallback) => watches.push({ success, error }),
        clearWatch,
      },
    });
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
  });
  afterEach(() => {
    cleanup();
    if (realGeolocation) Object.defineProperty(navigator, "geolocation", realGeolocation);
    else delete (navigator as { geolocation?: unknown }).geolocation;
    if (realSecureContext) Object.defineProperty(window, "isSecureContext", realSecureContext);
    else delete (window as { isSecureContext?: unknown }).isSecureContext;
  });

  const geolocationError = (code: number) =>
    ({ code, message: "", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }) as GeolocationPositionError;

  function renderGps() {
    render(
      <PositionSimulationProvider>
        <NavigationScreen
          destination={rococo}
          route={null}
          gpsAlreadyEnabled
          onGpsEnabled={() => {}}
          onArrive={() => {}}
          onShowRoute={() => {}}
        />
      </PositionSimulationProvider>,
    );
  }

  test("a timeout says 'still looking', not 'GPS unavailable', and 'I'm here' is the main button", async () => {
    renderGps();
    await act(async () => {});
    await act(async () => watches[0].error(geolocationError(3)));
    expect(screen.getByText(/Still looking for your position/)).toBeDefined();
    expect(screen.queryByText(/GPS isn't available here/)).toBeNull();
  });

  test("a timeout AFTER a good position keeps the 'are you here?' safety question for far-away taps", async () => {
    const onArrive = vi.fn();
    render(
      <PositionSimulationProvider>
        <NavigationScreen
          destination={rococo}
          route={null}
          gpsAlreadyEnabled
          onGpsEnabled={() => {}}
          onArrive={onArrive}
          onShowRoute={() => {}}
        />
      </PositionSimulationProvider>,
    );
    await act(async () => {});
    const oneKmSouth = { latitude: rococo.coordinates!.latitude - 0.009, longitude: rococo.coordinates!.longitude };
    await act(async () =>
      watches[0].success({
        coords: { ...oneKmSouth, accuracy: 5, heading: null, speed: null, altitude: null, altitudeAccuracy: null },
        timestamp: 1_000,
      } as unknown as GeolocationPosition),
    );
    await act(async () => watches[0].error(geolocationError(3))); // e.g. standing still for a while

    fireEvent.click(screen.getByRole("button", { name: "I'm here" }));
    expect(onArrive).not.toHaveBeenCalled(); // asks first instead of skipping the stop
    expect(screen.getByRole("heading", { name: `Are you at ${rococo.name}?`, hidden: true })).toBeDefined();
  });

  test("'Try again' after a refusal restarts the watch cleanly (no stale message)", async () => {
    renderGps();
    await act(async () => {});
    await act(async () => watches[0].error(geolocationError(1)));
    expect(screen.getByText(/Location access needed/)).toBeDefined();

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Try again" })));
    expect(clearWatch).toHaveBeenCalledTimes(1); // the old watch stopped
    expect(watches).toHaveLength(2); // a new one started
    expect(screen.queryByText(/Location access needed/)).toBeNull(); // the old refusal is gone
  });
});

// L-13: never more than one screen wake lock.
describe("useWakeLock", () => {
  const realWakeLock = Object.getOwnPropertyDescriptor(navigator, "wakeLock");
  afterEach(() => {
    if (realWakeLock) Object.defineProperty(navigator, "wakeLock", realWakeLock);
    else delete (navigator as { wakeLock?: unknown }).wakeLock;
  });

  test("returning to the page doesn't take a second lock while one is held; cleanup releases it", async () => {
    const sentinel = { released: false, release: vi.fn(async () => { sentinel.released = true; }) };
    const request = vi.fn(async () => sentinel);
    Object.defineProperty(navigator, "wakeLock", { configurable: true, value: { request } });

    const { unmount } = renderHook(() => useWakeLock(true));
    await act(async () => {});
    expect(request).toHaveBeenCalledTimes(1);

    await act(async () => document.dispatchEvent(new Event("visibilitychange")));
    expect(request).toHaveBeenCalledTimes(1); // still held: no second lock

    sentinel.released = true; // the browser released it (page was hidden)
    await act(async () => document.dispatchEvent(new Event("visibilitychange")));
    expect(request).toHaveBeenCalledTimes(2);

    unmount();
    expect(sentinel.release).toHaveBeenCalled();
  });
});
