"use client";

import { useEffect, useRef, useState } from "react";
import type { GpsFix, GpsStatus } from "@/types/navigation";
import { NAVIGATION_CONFIG } from "../config";
import { usePositionSimulation } from "../simulation/PositionSimulation";

interface UseGeolocationOptions {
  /** Only watch the position while true (e.g. after the player enabled it). */
  enabled: boolean;
  /** Called for every GPS reading. Readings are not stored anywhere. */
  onFix: (fix: GpsFix) => void;
}

function toGpsFix(position: GeolocationPosition): GpsFix {
  const { coords } = position;
  return {
    coordinates: { latitude: coords.latitude, longitude: coords.longitude },
    accuracyMeters: coords.accuracy,
    headingDegrees: coords.heading !== null && !Number.isNaN(coords.heading) ? coords.heading : null,
    speedMetersPerSecond: coords.speed,
    timestamp: position.timestamp,
  };
}

function isGeolocationSupported(): boolean {
  // Browsers only allow geolocation on secure (HTTPS or localhost) pages.
  return typeof navigator !== "undefined" && "geolocation" in navigator && window.isSecureContext;
}

/**
 * Watches the phone's position with watchPosition (not a one-off lookup),
 * so the position keeps updating while the player walks.
 */
export function useGeolocation({ enabled, onFix }: UseGeolocationOptions): { status: GpsStatus } {
  const { isActive: isSimulating, subscribe } = usePositionSimulation();
  const [status, setStatus] = useState<GpsStatus>("idle");

  // Keep the latest callback without restarting the GPS watch on every render.
  const onFixRef = useRef(onFix);
  useEffect(() => {
    onFixRef.current = onFix;
  }, [onFix]);

  // Simulated readings (playtest tools) take priority over the real GPS.
  useEffect(() => {
    if (!enabled) return;
    return subscribe((fix) => {
      setStatus("active");
      onFixRef.current(fix);
    });
  }, [enabled, subscribe]);

  // The real GPS.
  useEffect(() => {
    if (!enabled || isSimulating) return;

    if (!isGeolocationSupported()) {
      // The browser's answer isn't available yet, so report it on the next tick.
      const timer = window.setTimeout(() => setStatus("unavailable"), 0);
      return () => window.clearTimeout(timer);
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const fix = toGpsFix(position);
        setStatus(fix.accuracyMeters > NAVIGATION_CONFIG.LOW_ACCURACY_METERS ? "low-accuracy" : "active");
        onFixRef.current(fix);
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "permission-denied" : "unavailable");
      },
      { enableHighAccuracy: true, maximumAge: 2_000, timeout: 20_000 },
    );
    // Until the first reading arrives, the browser may be asking for permission.
    const timer = window.setTimeout(
      () => setStatus((current) => (current === "idle" ? "requesting-permission" : current)),
      0,
    );

    return () => {
      window.clearTimeout(timer);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled, isSimulating]);

  return { status: enabled ? status : "idle" };
}
