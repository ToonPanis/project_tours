"use client";

/**
 * PLAYTEST TOOLING: simulated GPS controls, shown inside the playtest panel
 * while a team is travelling. Not part of the game.
 */
import { useEffect, useRef, useState } from "react";
import type { GeoCoordinates } from "@/types/common";
import type { WalkingRoute } from "@/types/navigation";
import { NAVIGATION_CONFIG } from "../config";
import { getRouteLength, pointAlongRoute, projectOntoRoute } from "../logic/route-progress";
import { usePositionSimulation } from "./PositionSimulation";

interface NavigationPlaytestToolsProps {
  route: WalkingRoute | null;
  destination: GeoCoordinates | null;
  onResetNavigation: () => void;
  buttonClassName: string;
}

/** Simulated walking speed: a brisk walk, sped up 3x so tests don't take minutes. */
const AUTO_WALK_METERS_PER_TICK = 4;
const AUTO_WALK_TICK_MS = 1000;
/** Sideways offset used to simulate leaving the route (~60 m north). */
const OFF_ROUTE_LATITUDE_OFFSET = 0.00055;

export function NavigationPlaytestTools({
  route,
  destination,
  onResetNavigation,
  buttonClassName,
}: NavigationPlaytestToolsProps) {
  const simulation = usePositionSimulation();
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  // Where the simulated walker is along the route, in meters.
  const distanceAlongRef = useRef(0);
  const lastPositionRef = useRef<GeoCoordinates | null>(null);

  function emit(coordinates: GeoCoordinates) {
    lastPositionRef.current = coordinates;
    simulation.emit(coordinates);
  }

  function goToRouteDistance(meters: number) {
    if (!route) return;
    distanceAlongRef.current = meters;
    emit(pointAlongRoute(route.geometry, meters));
  }

  // Auto-walk: move along the route on a timer.
  useEffect(() => {
    if (!isAutoWalking || !route) return;
    const routeLength = getRouteLength(route.geometry);
    const timer = window.setInterval(() => {
      const next = Math.min(distanceAlongRef.current + AUTO_WALK_METERS_PER_TICK, routeLength);
      distanceAlongRef.current = next;
      const position = pointAlongRoute(route.geometry, next);
      lastPositionRef.current = position;
      simulation.emit(position);
    }, AUTO_WALK_TICK_MS);
    return () => window.clearInterval(timer);
  }, [isAutoWalking, route, simulation]);

  function simulateNextManeuver() {
    if (!route) return;
    const current = lastPositionRef.current
      ? projectOntoRoute(lastPositionRef.current, route.geometry).distanceAlongRouteMeters
      : 0;
    // Stop 20 m before the next maneuver, so its instruction is visible.
    const next = route.steps.find((step) => step.maneuver !== "depart" && step.distanceFromStartMeters > current + 25);
    if (next) goToRouteDistance(Math.max(0, next.distanceFromStartMeters - 20));
  }

  function simulateOffRoute() {
    const base = lastPositionRef.current ?? route?.geometry[0] ?? destination;
    if (!base) return;
    const offRoute = { latitude: base.latitude + OFF_ROUTE_LATITUDE_OFFSET, longitude: base.longitude };
    // Several readings, because one reading alone doesn't count as off route.
    for (let reading = 0; reading < NAVIGATION_CONFIG.OFF_ROUTE_CONFIRMATIONS; reading++) emit(offRoute);
  }

  function simulateArrival() {
    if (!destination) return;
    setIsAutoWalking(false);
    // Arrival needs several good readings in a row.
    for (let reading = 0; reading < NAVIGATION_CONFIG.ARRIVAL_CONFIRMATIONS; reading++) emit(destination);
  }

  function resetNavigation() {
    setIsAutoWalking(false);
    distanceAlongRef.current = 0;
    lastPositionRef.current = null;
    simulation.stop();
    onResetNavigation();
  }

  return (
    <>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-yellow-300">Simulated GPS</p>
      <button type="button" className={buttonClassName} onClick={() => goToRouteDistance(0)} disabled={!route}>
        GPS: start of route
      </button>
      <button type="button" className={buttonClassName} onClick={simulateNextManeuver} disabled={!route}>
        GPS: next maneuver
      </button>
      <button type="button" className={buttonClassName} onClick={() => setIsAutoWalking((walking) => !walking)} disabled={!route}>
        {isAutoWalking ? "Stop auto-walk" : "Auto-walk the route"}
      </button>
      <button type="button" className={buttonClassName} onClick={simulateOffRoute}>
        GPS: off route
      </button>
      <button type="button" className={buttonClassName} onClick={simulateArrival} disabled={!destination}>
        GPS: arrive
      </button>
      <button type="button" className={buttonClassName} onClick={resetNavigation}>
        Reset navigation
      </button>
    </>
  );
}
