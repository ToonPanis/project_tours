import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render } from "@testing-library/react";
import type { ComponentProps } from "react";
import { mapWorkerUrl, OVERVIEW_DISTANCE_METERS } from "@/features/navigation/config";
import type { GeoCoordinates } from "@/types/common";

/**
 * M-18: the real WalkingMap (every other test replaces it) against a recording
 * stand-in for MapLibre: which camera moves it asks for, when it lets the walker
 * take over, and that it cleans up. The camera rules themselves are tested in
 * camera-and-geo.test.ts; this checks the component actually follows them.
 */
vi.mock("maplibre-gl", async () => (await import("./fixtures/fake-maplibre")).fakeMapLibreModule);
const { fakeMap } = await import("./fixtures/fake-maplibre");
const { default: WalkingMap } = await import("@/features/navigation/components/WalkingMap");

const grooteMarkt: GeoCoordinates = { latitude: 51.2211, longitude: 4.3997 };
/** A point `meters` due south of the destination (one degree of latitude ≈ 111,320 m). */
const southOf = (meters: number): GeoCoordinates => ({ latitude: grooteMarkt.latitude - meters / 111_320, longitude: grooteMarkt.longitude });

type Props = ComponentProps<typeof WalkingMap>;
const baseProps: Props = {
  destination: { name: "Grote Markt", coordinates: grooteMarkt },
  routeGeometry: null,
  userPosition: null,
  userAccuracyMeters: null,
  isFollowing: true,
  orientation: "follow-direction",
  travelBearing: 90,
  onUserMovedMap: () => {},
  regionLabel: "Map",
  controlLabels: {},
  loadErrorText: "",
  tilesFailingText: "",
};

function renderMap(props: Partial<Props> = {}) {
  const result = render(<WalkingMap {...baseProps} {...props} />);
  const update = (next: Partial<Props>) => result.rerender(<WalkingMap {...baseProps} {...props} {...next} />);
  return { ...result, update };
}

describe("WalkingMap with the real component", () => {
  beforeEach(() => {
    fakeMap.workerUrl = "";
  });

  test("points MapLibre at the versioned worker before creating the map", () => {
    renderMap();
    expect(fakeMap.workerUrl).toBe(new URL(mapWorkerUrl("6.11.1"), window.location.origin).href);
  });

  test("follows the walker, keeping walker and destination in view, turned to the walking direction", () => {
    const { update } = renderMap();
    fakeMap.cameraMoves = [];
    update({ userPosition: southOf(200) });
    expect(fakeMap.cameraMoves).toHaveLength(1);
    expect(fakeMap.cameraMoves[0]).toMatchObject({ kind: "fitBounds", options: { bearing: 90 } });
  });

  test("GPS jitter of a metre or two doesn't move the camera again (calmer, saves battery)", () => {
    const { update } = renderMap({ userPosition: southOf(200) });
    const moves = fakeMap.cameraMoves.length;
    update({ userPosition: southOf(201) });
    expect(fakeMap.cameraMoves).toHaveLength(moves);
    update({ userPosition: southOf(220) });
    expect(fakeMap.cameraMoves).toHaveLength(moves + 1);
  });

  test("far from the destination the map stays north-up (an overview reads more easily)", () => {
    const { update } = renderMap();
    fakeMap.cameraMoves = [];
    update({ userPosition: southOf(OVERVIEW_DISTANCE_METERS + 200) });
    expect(fakeMap.cameraMoves.at(-1)?.options.bearing).toBe(0);
  });

  test("a pan or pinch by the walker stops following; the app's own camera moves don't", () => {
    const onUserMovedMap = vi.fn();
    renderMap({ onUserMovedMap });
    act(() => fakeMap.fire("dragstart", {})); // our own fitBounds (no originalEvent)
    expect(onUserMovedMap).not.toHaveBeenCalled();
    act(() => fakeMap.fire("zoomstart", { originalEvent: {} })); // a pinch
    expect(onUserMovedMap).toHaveBeenCalledOnce();
  });

  test("while not following, readings don't move the camera", () => {
    const { update } = renderMap({ isFollowing: false });
    fakeMap.cameraMoves = [];
    update({ userPosition: southOf(300) });
    update({ userPosition: southOf(100) });
    expect(fakeMap.cameraMoves).toHaveLength(0);
  });

  test("normally the camera glides; with reduced motion it jumps", () => {
    const glide = renderMap();
    glide.update({ userPosition: southOf(200) });
    expect(fakeMap.cameraMoves.at(-1)?.options.duration).toBeGreaterThan(0);
    glide.unmount();
  });

  test("with reduced motion the camera jumps instead of gliding", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
    const { update } = renderMap();
    update({ userPosition: southOf(200) });
    expect(fakeMap.cameraMoves.at(-1)?.options.duration).toBe(0);
  });

  test("leaving the screen removes the map (no worker or listeners left running)", () => {
    const { unmount } = renderMap();
    unmount();
    expect(fakeMap.isRemoved).toBe(true);
  });
});
