"use client";

import { useEffect, useRef, useState } from "react";
import { GeoJSONSource, getVersion, getWorkerUrl, LngLatBounds, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { circleAround, distanceInMeters } from "@/lib/geo";
import type { GeoCoordinates } from "@/types/common";
import { ANTWERP_CENTER, MAP_STYLE_URL, mapWorkerUrl, OVERVIEW_DISTANCE_METERS } from "../config";
import { shouldMoveCamera, type CameraTarget } from "../logic/camera";
import { getMapHealth, INITIAL_MAP_HEALTH, updateMapHealth, type MapHealth, type MapHealthEvent } from "../logic/map-health";

export type MapOrientation = "follow-direction" | "north-up";

interface WalkingMapProps {
  /** `coordinates` is null for a stop that isn't on the map yet: the map then shows Antwerp. */
  destination: { name: string; coordinates: GeoCoordinates | null };
  /** The walking route line, if there is one. */
  routeGeometry: GeoCoordinates[] | null;
  userPosition: GeoCoordinates | null;
  /** GPS accuracy radius of `userPosition`: drawn as a circle, so the walker sees how sure the dot is. */
  userAccuracyMeters: number | null;
  /** Keep the map centred on the player. Turned off when they pan, zoom or turn the map. */
  isFollowing: boolean;
  orientation: MapOrientation;
  /** Direction of travel along the route (used in follow-direction mode). */
  travelBearing: number | null;
  onUserMovedMap: () => void;
  /** Screen-reader name of the map, e.g. "Map: route to Grote Markt". */
  regionLabel: string;
  /** Shown over the map when it can't be loaded (no WebGL, no connection…). */
  loadErrorText: string;
  /** Shown over the map when several tiles in a row failed (grey squares), e.g. a weak signal. */
  tilesFailingText: string;
}

/**
 * Room around framed points, so the destination label (centred on its point,
 * about 200 px wide) and the map buttons never hide the markers.
 */
const MARKER_PADDING = { top: 72, bottom: 56, left: 110, right: 110 };

const toLngLat = (coordinates: GeoCoordinates): [number, number] => [coordinates.longitude, coordinates.latitude];

/**
 * Our own GeoJSON sources (GPS accuracy circle, route line). Their "tiles" are made in
 * the browser on every GPS reading, so they must not count as map tiles loading again.
 */
const OWN_SOURCE_IDS = ["accuracy", "route"];

/** True for an event about a tile of the street map itself (MapLibre sets `tile` and `sourceId`). */
function isStreetMapTileEvent(event: object): boolean {
  const sourceId = "sourceId" in event ? event.sourceId : undefined;
  return "tile" in event && Boolean(event.tile) && !OWN_SOURCE_IDS.includes(String(sourceId));
}

/** Camera glide per GPS update: short, so it has finished before the next reading (~1 s). */
const CAMERA_ANIMATION_MS = 500;

/**
 * Points MapLibre at the worker we serve from /public (see
 * scripts/copy-maplibre-worker.mjs). Must run before the first map is created.
 */
function pointMapLibreAtServedWorker() {
  const url = new URL(mapWorkerUrl(getVersion()), window.location.origin).href;
  if (getWorkerUrl() !== url) setWorkerUrl(url);
}

function createMarkerElement(className: string, label?: string): HTMLElement {
  const element = document.createElement("div");
  element.className = className;
  if (label) {
    // Build with textContent (never innerHTML), so names can't inject HTML.
    const star = document.createElement("span");
    star.setAttribute("aria-hidden", "true");
    star.textContent = "★";
    const name = document.createElement("strong");
    name.textContent = label;
    element.append(star, name);
  }
  return element;
}

function drawAccuracyCircle(map: MapLibreMap, position: GeoCoordinates | null, accuracyMeters: number | null) {
  const source = map.getSource("accuracy") as GeoJSONSource | undefined;
  if (!source) return; // style not loaded yet
  void source.setData({
    type: "FeatureCollection",
    features:
      position && accuracyMeters
        ? [
            {
              type: "Feature",
              properties: {},
              geometry: { type: "Polygon", coordinates: [circleAround(position, accuracyMeters).map(toLngLat)] },
            },
          ]
        : [],
  });
}

/** True when the visitor asked for less motion: the camera then jumps instead of gliding. */
function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

function drawRoute(map: MapLibreMap, geometry: GeoCoordinates[] | null) {
  const source = map.getSource("route") as GeoJSONSource | undefined;
  if (!source) return; // style not loaded yet
  void source.setData({
    type: "FeatureCollection",
    features: geometry
      ? [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: geometry.map(toLngLat) } }]
      : [],
  });
}

/** A box around a set of points (at least one). */
function boundsAround(points: GeoCoordinates[]): LngLatBounds {
  return points.reduce(
    (box, point) => box.extend(toLngLat(point)),
    new LngLatBounds(toLngLat(points[0]), toLngLat(points[0])),
  );
}

/**
 * The interactive map (MapLibre GL, OpenFreeMap tiles). Loaded only on the
 * navigation screen, because the library is large and needs the browser.
 */
export default function WalkingMap({
  destination,
  routeGeometry,
  userPosition,
  userAccuracyMeters,
  isFollowing,
  orientation,
  travelBearing,
  onUserMovedMap,
  regionLabel,
  loadErrorText,
  tilesFailingText,
}: WalkingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const onUserMovedMapRef = useRef(onUserMovedMap);
  // The latest route and position, so the map can draw them as soon as its style has loaded.
  const routeGeometryRef = useRef(routeGeometry);
  const accuracyRef = useRef({ position: userPosition, meters: userAccuracyMeters });
  // Where the camera was last pointed while following (null = move on the next update).
  const lastCameraRef = useRef<CameraTarget | null>(null);
  const [mapHealth, setMapHealth] = useState<MapHealth>("ok");

  useEffect(() => {
    onUserMovedMapRef.current = onUserMovedMap;
  }, [onUserMovedMap]);

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;
    pointMapLibreAtServedWorker();

    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: toLngLat(destination.coordinates ?? ANTWERP_CENTER),
        zoom: destination.coordinates ? 17 : 14,
        // The OpenFreeMap style brings its own attribution (OpenFreeMap, OpenMapTiles, OpenStreetMap).
        attributionControl: { compact: true },
      });
    } catch {
      // E.g. no WebGL on this device. Reported after this effect, so React can render the message.
      queueMicrotask(() => setMapHealth("load-failed"));
      return;
    }
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");

    // The OpenFreeMap style refers to a few icons its sprite doesn't contain
    // (e.g. "atm", "gate"). Give those an empty image instead of console warnings.
    map.setMissingStyleImageResolver((id) => {
      if (!map.hasImage(id)) map.addImage(id, { width: 1, height: 1, data: new Uint8Array(4) });
    });

    // Only moves made by the player (drag, pinch, zoom buttons, double tap, two-finger
    // turn) stop "follow" mode; our own camera moves have no originalEvent.
    const stopFollowingOnUserMove = (event: { originalEvent?: unknown }) => {
      if (event.originalEvent) onUserMovedMapRef.current();
    };
    map.on("dragstart", stopFollowingOnUserMove);
    map.on("zoomstart", stopFollowingOnUserMove);
    map.on("rotatestart", stopFollowingOnUserMove);
    map.on("pitchstart", stopFollowingOnUserMove);

    // Load errors and failing tiles (see logic/map-health.ts). Kept outside React state:
    // tiles load many times a second, and only a change of health needs a render.
    let health = INITIAL_MAP_HEALTH;
    const report = (event: MapHealthEvent) => {
      health = updateMapHealth(health, event);
      setMapHealth(getMapHealth(health)); // same value: React skips the render
    };
    // MapLibre puts the failed tile on the error event (not in its TypeScript type).
    map.on("error", (event) => report({ type: "error", isTileError: isStreetMapTileEvent(event) }));
    map.on("sourcedata", (event) => {
      if (isStreetMapTileEvent(event)) report({ type: "tile-loaded" });
    });

    map.on("load", () => {
      report({ type: "loaded" });
      // GPS accuracy circle, under the route line.
      map.addSource("accuracy", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({
        id: "accuracy-fill",
        type: "fill",
        source: "accuracy",
        paint: { "fill-color": "#2f7cf6", "fill-opacity": 0.15 },
      });
      map.addLayer({
        id: "accuracy-outline",
        type: "line",
        source: "accuracy",
        paint: { "line-color": "#2f7cf6", "line-width": 1, "line-opacity": 0.5 },
      });
      drawAccuracyCircle(map, accuracyRef.current.position, accuracyRef.current.meters);
      map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#17120e", "line-width": 10 },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#d9a54e", "line-width": 6 },
      });
      drawRoute(map, routeGeometryRef.current);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
    };
    // The destination only sets the first view; later changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Destination marker (only the current destination: never future stops).
  const destinationCoordinates = destination.coordinates;
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !destinationCoordinates) return;
    const marker = new Marker({ element: createMarkerElement("walking-map-destination", destination.name) })
      .setLngLat(toLngLat(destinationCoordinates))
      .addTo(map);
    return () => {
      marker.remove();
    };
  }, [destination.name, destinationCoordinates]);

  // Route line (drawn now if the map is ready, otherwise by the "load" handler).
  useEffect(() => {
    routeGeometryRef.current = routeGeometry;
    if (mapRef.current) drawRoute(mapRef.current, routeGeometry);
  }, [routeGeometry]);

  // Accuracy circle around the player.
  useEffect(() => {
    accuracyRef.current = { position: userPosition, meters: userAccuracyMeters };
    if (mapRef.current) drawAccuracyCircle(mapRef.current, userPosition, userAccuracyMeters);
  }, [userPosition, userAccuracyMeters]);

  // Player marker.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userPosition) return;
    if (!userMarkerRef.current) {
      userMarkerRef.current = new Marker({ element: createMarkerElement("walking-map-user") })
        .setLngLat(toLngLat(userPosition))
        .addTo(map);
    } else {
      userMarkerRef.current.setLngLat(toLngLat(userPosition));
    }
  }, [userPosition]);

  // Camera: follow the player, rotated to the direction of travel when reliable.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!isFollowing) {
      // Following again later (recenter button) must move the camera straight away.
      lastCameraRef.current = null;
      return;
    }

    const bearing = orientation === "follow-direction" && travelBearing !== null ? travelBearing : 0;
    const duration = prefersReducedMotion() ? 0 : CAMERA_ANIMATION_MS;

    if (userPosition) {
      // Far away (e.g. still at the hotel) the map stays north-up, which reads more easily.
      const isOverview =
        destinationCoordinates !== null &&
        distanceInMeters(userPosition, destinationCoordinates) > OVERVIEW_DISTANCE_METERS;
      const target: CameraTarget = {
        position: userPosition,
        bearing: isOverview ? 0 : bearing,
        mode: isOverview ? "overview" : orientation,
      };
      // Tiny moves (GPS noise, standing still) don't re-animate the map: calmer, and saves battery.
      if (!shouldMoveCamera(lastCameraRef.current, target)) return;
      lastCameraRef.current = target;

      if (destinationCoordinates) {
        // Walker and next stop always in view; the map zooms in as the walker gets closer.
        map.fitBounds(boundsAround([userPosition, destinationCoordinates]), {
          padding: MARKER_PADDING,
          bearing: target.bearing,
          maxZoom: 18,
          duration,
        });
      } else {
        map.easeTo({ center: toLngLat(userPosition), bearing, zoom: Math.max(map.getZoom(), 17), duration });
      }
    } else {
      // No position (yet, or GPS switched off): once one arrives, the camera must move to it.
      lastCameraRef.current = null;
      if (routeGeometry && routeGeometry.length > 1) {
        // Show the whole route.
        map.fitBounds(boundsAround(routeGeometry), { padding: MARKER_PADDING, bearing: 0, duration: 0 });
      } else {
        map.easeTo({ center: toLngLat(destinationCoordinates ?? ANTWERP_CENTER), bearing: 0, duration: 0 });
      }
    }
  }, [userPosition, isFollowing, orientation, travelBearing, routeGeometry, destinationCoordinates]);

  return (
    <div className="relative h-full w-full">
      {/* h-full, not absolute: MapLibre's CSS makes its container position: relative. */}
      <div ref={containerRef} className="h-full w-full" aria-label={regionLabel} role="region" />
      {/* right-16 keeps the round map buttons (top right) visible and tappable. */}
      {mapHealth !== "ok" && (
        <p role="alert" className="absolute left-3 right-16 top-3 z-10 rounded-sm bg-ink/90 p-3 text-sm text-parchment shadow-lg">
          {mapHealth === "load-failed" ? loadErrorText : tilesFailingText}
        </p>
      )}
    </div>
  );
}
