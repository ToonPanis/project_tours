/**
 * A stand-in for maplibre-gl in tests (jsdom has no WebGL). It records what the
 * app asks the map to do, and lets a test play MapLibre's events:
 *
 *   vi.mock("maplibre-gl", async () => (await import("./fixtures/fake-maplibre")).fakeMapLibreModule);
 *   fakeMap.fire("load");
 *   fakeMap.fire("dragstart", { originalEvent: {} }); // a move made by the user
 *   expect(fakeMap.cameraMoves).toHaveLength(1);
 */

type Handler = (event: object) => void;

export interface CameraMove {
  kind: "fitBounds" | "easeTo";
  options: { bearing?: number; duration?: number; [key: string]: unknown };
}

/** The state of the most recently created map (tests create one at a time). */
export const fakeMap = {
  handlers: new Map<string, Handler[]>(),
  /** The options the map was created with. */
  options: {} as Record<string, unknown>,
  cameraMoves: [] as CameraMove[],
  isRemoved: false,
  workerUrl: "",
  fire(type: string, event: object = {}) {
    for (const handler of this.handlers.get(type) ?? []) handler(event);
  },
};

class FakeMap {
  constructor(options: Record<string, unknown>) {
    fakeMap.handlers = new Map();
    fakeMap.options = options;
    fakeMap.cameraMoves = [];
    fakeMap.isRemoved = false;
  }
  on(type: string, handler: Handler) {
    fakeMap.handlers.set(type, [...(fakeMap.handlers.get(type) ?? []), handler]);
    return this;
  }
  addControl() {}
  setMissingStyleImageResolver() {}
  hasImage() {
    return false;
  }
  addImage() {}
  addSource() {}
  addLayer() {}
  getSource() {
    return undefined;
  }
  fitBounds(_bounds: unknown, options: CameraMove["options"]) {
    fakeMap.cameraMoves.push({ kind: "fitBounds", options });
  }
  easeTo(options: CameraMove["options"]) {
    fakeMap.cameraMoves.push({ kind: "easeTo", options });
  }
  getZoom() {
    return 17;
  }
  remove() {
    fakeMap.isRemoved = true;
  }
}

class FakeMarker {
  setLngLat() {
    return this;
  }
  addTo() {
    return this;
  }
  remove() {}
}

class FakeLngLatBounds {
  extend() {
    return this;
  }
}

export const fakeMapLibreModule = {
  Map: FakeMap,
  Marker: FakeMarker,
  NavigationControl: class {},
  LngLatBounds: FakeLngLatBounds,
  GeoJSONSource: class {},
  getVersion: () => "6.11.1",
  getWorkerUrl: () => fakeMap.workerUrl,
  setWorkerUrl: (url: string) => {
    fakeMap.workerUrl = url;
  },
};
