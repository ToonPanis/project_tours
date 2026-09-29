"use client";

/**
 * PLAYTEST TOOLING: a fake GPS for testing navigation without walking.
 *
 * The playtest tools "emit" positions; navigation receives them through the
 * same path as real GPS readings. While a simulated position is active, the
 * real GPS is not used.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { GeoCoordinates } from "@/types/common";
import type { GpsFix } from "@/types/navigation";

type FixListener = (fix: GpsFix) => void;

interface PositionSimulation {
  isActive: boolean;
  /** Send a simulated GPS reading to navigation (and switch simulation on). */
  emit: (coordinates: GeoCoordinates, accuracyMeters?: number) => void;
  /** Stop simulating; navigation goes back to the real GPS. */
  stop: () => void;
  /** Used by the GPS hook. A new listener immediately gets the last simulated reading. */
  subscribe: (listener: FixListener) => () => void;
}

const PositionSimulationContext = createContext<PositionSimulation>({
  isActive: false,
  emit: () => {},
  stop: () => {},
  subscribe: () => () => {},
});

export function PositionSimulationProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const listeners = useRef(new Set<FixListener>());
  const lastFix = useRef<GpsFix | null>(null);

  // Stable functions, so subscribers don't re-subscribe on every change.
  const emit = useCallback((coordinates: GeoCoordinates, accuracyMeters = 5) => {
    const fix: GpsFix = {
      coordinates,
      accuracyMeters,
      headingDegrees: null,
      speedMetersPerSecond: null,
      timestamp: Date.now(),
    };
    lastFix.current = fix;
    setIsActive(true);
    listeners.current.forEach((listener) => listener(fix));
  }, []);

  const stop = useCallback(() => {
    lastFix.current = null;
    setIsActive(false);
  }, []);

  const subscribe = useCallback((listener: FixListener) => {
    listeners.current.add(listener);
    if (lastFix.current) listener(lastFix.current);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  const simulation = useMemo(() => ({ isActive, emit, stop, subscribe }), [isActive, emit, stop, subscribe]);

  return (
    <PositionSimulationContext.Provider value={simulation}>{children}</PositionSimulationContext.Provider>
  );
}

export function usePositionSimulation(): PositionSimulation {
  return useContext(PositionSimulationContext);
}
