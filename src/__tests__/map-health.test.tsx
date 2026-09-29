import { afterEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import {
  getMapHealth,
  INITIAL_MAP_HEALTH,
  TILE_ERRORS_BEFORE_NOTICE,
  updateMapHealth,
  type MapHealthEvent,
} from "@/features/navigation/logic/map-health";

/**
 * A stand-in for MapLibre's Map (jsdom has no WebGL). It records the event
 * handlers, so a test can play "load", "error" and "sourcedata" events.
 */
const fakeMap = vi.hoisted(() => {
  const handlers = new Map<string, ((event: object) => void)[]>();
  return {
    handlers,
    fire(type: string, event: object = {}) {
      for (const handler of handlers.get(type) ?? []) handler(event);
    },
  };
});

vi.mock("maplibre-gl", () => {
  class FakeMap {
    constructor() {
      fakeMap.handlers.clear();
    }
    on(type: string, handler: (event: object) => void) {
      fakeMap.handlers.set(type, [...(fakeMap.handlers.get(type) ?? []), handler]);
      return this;
    }
    addControl() {}
    setMissingStyleImageResolver() {}
    addSource() {}
    addLayer() {}
    getSource() {
      return undefined;
    }
    fitBounds() {}
    easeTo() {}
    getZoom() {
      return 17;
    }
    remove() {}
  }
  return {
    Map: FakeMap,
    Marker: class {
      setLngLat() {
        return this;
      }
      addTo() {
        return this;
      }
      remove() {}
    },
    NavigationControl: class {},
    LngLatBounds: class {
      extend() {
        return this;
      }
    },
    GeoJSONSource: class {},
    getVersion: () => "6.11.1",
    getWorkerUrl: () => "",
    setWorkerUrl: () => {},
  };
});

const { default: WalkingMap } = await import("@/features/navigation/components/WalkingMap");

afterEach(cleanup);

// Like MapLibre's events: the tile and the id of its source ("openmaptiles" = the street map).
const tileError = () =>
  fakeMap.fire("error", { tile: {}, sourceId: "openmaptiles", error: new Error("Failed to fetch") });
const tileLoaded = (sourceId = "openmaptiles") => fakeMap.fire("sourcedata", { tile: {}, sourceId });

function renderMap() {
  render(
    <WalkingMap
      destination={{ name: "Grote Markt", coordinates: { latitude: 51.2211, longitude: 4.3997 } }}
      routeGeometry={null}
      userPosition={null}
      userAccuracyMeters={null}
      isFollowing
      orientation="north-up"
      travelBearing={null}
      onUserMovedMap={() => {}}
      regionLabel="Map: route to Grote Markt"
      loadErrorText="map unavailable"
      tilesFailingText="part of the map is missing"
    />,
  );
}

describe("map health (pure logic)", () => {
  const play = (...events: MapHealthEvent[]) => getMapHealth(events.reduce(updateMapHealth, INITIAL_MAP_HEALTH));
  const tileErrors = (count: number): MapHealthEvent[] =>
    Array.from({ length: count }, () => ({ type: "error", isTileError: true }));

  test("an error before the map ever loaded means the map is unavailable", () => {
    expect(play({ type: "error", isTileError: false })).toBe("load-failed");
    expect(play({ type: "error", isTileError: false }, { type: "loaded" })).toBe("ok");
  });

  test("one or two failed tiles are ignored (a short signal drop)", () => {
    expect(play({ type: "loaded" }, ...tileErrors(TILE_ERRORS_BEFORE_NOTICE - 1))).toBe("ok");
  });

  test("several failed tiles in a row show a notice, until a tile loads again", () => {
    expect(play({ type: "loaded" }, ...tileErrors(TILE_ERRORS_BEFORE_NOTICE))).toBe("tiles-failing");
    expect(play({ type: "loaded" }, ...tileErrors(TILE_ERRORS_BEFORE_NOTICE), { type: "tile-loaded" })).toBe("ok");
  });

  test("a loaded tile in between resets the count", () => {
    const events: MapHealthEvent[] = [{ type: "loaded" }, ...tileErrors(2), { type: "tile-loaded" }, ...tileErrors(2)];
    expect(play(...events)).toBe("ok");
  });

  test("other errors after loading (e.g. a missing icon) don't count as failed tiles", () => {
    const otherErrors: MapHealthEvent[] = Array.from({ length: 5 }, () => ({ type: "error", isTileError: false }));
    expect(play({ type: "loaded" }, ...otherErrors)).toBe("ok");
  });
});

describe("WalkingMap notices", () => {
  test("repeated tile failures after loading tell the walker part of the map is missing", () => {
    renderMap();
    act(() => fakeMap.fire("load"));
    act(() => {
      for (let i = 0; i < TILE_ERRORS_BEFORE_NOTICE; i++) tileError();
    });
    expect(screen.getByRole("alert").textContent).toBe("part of the map is missing");

    // The connection comes back: a tile loads and the notice disappears.
    act(() => tileLoaded());
    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("our own route and GPS-circle layers loading don't hide the notice", () => {
    renderMap();
    act(() => fakeMap.fire("load"));
    act(() => {
      for (let i = 0; i < TILE_ERRORS_BEFORE_NOTICE; i++) tileError();
    });
    // Every GPS reading redraws the accuracy circle; that is not the street map coming back.
    act(() => tileLoaded("accuracy"));
    act(() => tileLoaded("route"));
    expect(screen.getByRole("alert").textContent).toBe("part of the map is missing");
  });

  test("a single failed tile shows nothing", () => {
    renderMap();
    act(() => fakeMap.fire("load"));
    act(() => tileError());
    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("an error before loading shows the 'map unavailable' message", () => {
    renderMap();
    act(() => fakeMap.fire("error", { error: new Error("style unreachable") }));
    expect(screen.getByRole("alert").textContent).toBe("map unavailable");
  });
});
