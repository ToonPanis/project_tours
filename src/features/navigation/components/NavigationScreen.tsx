"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useT } from "@/i18n/client";
import { distanceInMeters } from "@/lib/geo";
import type { WalkLocation } from "@/types/location";
import type { GpsFix, WalkingRoute } from "@/types/navigation";
import { useGeolocation } from "../hooks/useGeolocation";
import { usePositionSimulation } from "../simulation/PositionSimulation";
import { useWakeLock } from "../hooks/useWakeLock";
import { NAVIGATION_CONFIG } from "../config";
import { formatWalkingDistance } from "../logic/maneuver-display";
import { getNavigationView } from "../logic/navigation-view";
import { hasWeakSignal, initialTracking, trackFix, type NavigationTracking } from "../logic/tracking";
import { DirectionPanel } from "./DirectionPanel";
import type { MapOrientation } from "./WalkingMap";

// The map library is large and browser-only: load it only when this screen opens.
// (The loading text is a neutral "…" because it can't know the walk's language.)
const WalkingMap = dynamic(() => import("./WalkingMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-parchment/60">…</div>,
});

type Phase = "intro" | "gps" | "manual";

interface NavigationScreenProps {
  destination: WalkLocation;
  /** Pre-calculated walking route to the destination (none for the first stop). */
  route: WalkingRoute | null;
  /** True once the player enabled location earlier in this game: skip the explainer. */
  gpsAlreadyEnabled: boolean;
  onGpsEnabled: () => void;
  onArrive: () => void;
  onShowRoute: () => void;
}

export function NavigationScreen({
  destination,
  route,
  gpsAlreadyEnabled,
  onGpsEnabled,
  onArrive,
  onShowRoute,
}: NavigationScreenProps) {
  const t = useT();
  const destinationCoordinates = destination.coordinates;
  const [chosenPhase, setPhase] = useState<Phase>(
    !destinationCoordinates ? "manual" : gpsAlreadyEnabled ? "gps" : "intro",
  );
  // Location already allowed for this site (e.g. after a page refresh):
  // skip the explainer and go straight to the live map.
  useEffect(() => {
    if (chosenPhase !== "intro" || !navigator.permissions) return;
    let isCancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permission) => {
        if (!isCancelled && permission.state === "granted") {
          setPhase("gps");
          onGpsEnabled();
        }
      })
      .catch(() => {
        // Permissions API not supported for geolocation (older Safari): keep the explainer.
      });
    return () => {
      isCancelled = true;
    };
    // Only on the first render of this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Playtest tools: a simulated position switches navigation to live mode.
  const { isActive: isSimulating } = usePositionSimulation();
  const phase: Phase = isSimulating && destinationCoordinates ? "gps" : chosenPhase;
  const [tracking, setTracking] = useState<NavigationTracking>(initialTracking);
  const trackingRef = useRef(tracking);
  const [isFollowing, setIsFollowing] = useState(true);
  // The distance shown in the "are you here?" question, frozen when it opens (null = closed).
  const [confirmArrivalDistance, setConfirmArrivalDistance] = useState<number | null>(null);
  const [orientation, setOrientation] = useState<MapOrientation>("follow-direction");

  // Every GPS reading updates the tracking state; arrival is detected here.
  const handleFix = useCallback(
    (fix: GpsFix) => {
      if (trackingRef.current.arrived) return;
      const next = trackFix(trackingRef.current, fix, route, destinationCoordinates);
      trackingRef.current = next;
      setTracking(next);
      if (next.arrived) {
        navigator.vibrate?.(200);
        onArrive();
      }
    },
    [route, destinationCoordinates, onArrive],
  );

  // Bumped by "Try again": restarts the GPS watch, so the browser can ask again.
  const [gpsRestartKey, setGpsRestartKey] = useState(0);
  const { status } = useGeolocation({ enabled: phase === "gps", onFix: handleFix, restartKey: gpsRestartKey });
  useWakeLock(phase === "gps");

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${destination.name}, ${destination.address}`,
  )}`;

  // ── Explain before the browser asks for permission ───────────────────
  if (phase === "intro") {
    return (
      <section className="flex flex-col gap-5 px-4 pb-6 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t("gps.yourNextDestination")}</p>
        <h1 className="font-display text-4xl font-semibold text-parchment">{destination.name}</h1>
        <p className="text-parchment/80">{destination.address}</p>
        {route && (
          <p className="text-lg text-parchment">
            {formatWalkingDistance(route.distanceMeters, t)} · {t("gps.minWalk", { minutes: Math.max(1, Math.round(route.durationSeconds / 60)) })}
          </p>
        )}
        <div className="rounded-sm border border-gold/40 bg-ink/40 p-4 text-parchment/90">
          <h2 className="font-display text-2xl font-semibold text-parchment">{t("gps.enableTitle")}</h2>
          <p className="mt-2">{t("gps.enableIntro")}</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>{t("gps.enableReasonPosition")}</li>
            <li>{t("gps.enableReasonGuide")}</li>
            <li>{t("gps.enableReasonArrive")}</li>
          </ul>
          <p className="mt-3 text-sm text-parchment/70">{t("gps.privacy")}</p>
        </div>
        <p className="text-sm text-parchment/70">{t("gps.stayAware")}</p>
        <div className="mt-auto flex flex-col gap-3">
          <Button
            onClick={() => {
              setPhase("gps");
              onGpsEnabled();
            }}
            fullWidth
          >
            {t("gps.enableLocation")}
          </Button>
          <Button variant="outline" onClick={() => setPhase("manual")} fullWidth>
            {t("gps.continueWithoutGps")}
          </Button>
        </div>
      </section>
    );
  }

  // ── Navigation (live GPS, or a map without GPS) ───────────────────────
  const fix = phase === "gps" ? tracking.fix : null;
  const view = getNavigationView(fix, route, destination.name, destinationCoordinates, tracking);
  // Refused permission doesn't end navigation: the map stays, with a clear message.
  const isPermissionDenied = phase === "gps" && status === "permission-denied";
  const gpsProblem = phase === "gps" && (status === "unavailable" || (status === "searching" && !tracking.fix) || isPermissionDenied || hasWeakSignal(tracking));

  function retryGps() {
    // Restart the GPS watch, which asks the browser again (if it still allows asking).
    setGpsRestartKey((key) => key + 1);
  }
  // "I'm here" is always available, so nobody can get stuck: GPS can report good
  // accuracy while being wrong (narrow streets), or a stop's pin can be unreachable.
  // With working GPS it's a secondary button: automatic arrival stays the main path.
  const isManualArrivalPrimary = phase === "manual" || gpsProblem || !destinationCoordinates;
  // A good GPS fix that is still far away: ask before moving on (an accidental tap
  // can't be undone). With weak or no GPS the position can't be trusted, so no question.
  const manualArrivalDistance =
    fix && destinationCoordinates && !gpsProblem ? distanceInMeters(fix.coordinates, destinationCoordinates) : null;
  function handleManualArrival() {
    if (manualArrivalDistance !== null && manualArrivalDistance > NAVIGATION_CONFIG.MANUAL_ARRIVAL_CONFIRM_METERS) {
      setConfirmArrivalDistance(manualArrivalDistance);
    } else {
      onArrive();
    }
  }

  return (
    // min-h (not a fixed height): if the headers above wrap (long German/Russian titles),
    // the screen grows instead of squeezing the map, and the sticky bottom bar stays visible.
    <section className="flex min-h-[calc(100dvh-9.5rem)] flex-col">
      {/* Top: destination + remaining distance */}
      <div className="flex items-baseline justify-between gap-3 bg-ink px-4 py-2">
        <p className="min-w-0 truncate font-display text-xl font-semibold text-parchment">
          <span aria-hidden="true" className="text-gold">★ </span>
          {destination.name}
        </p>
        {view.remainingMeters !== null && (
          <p className="shrink-0 text-lg font-semibold tabular-nums text-parchment">
            {formatWalkingDistance(view.remainingMeters, t)}
          </p>
        )}
      </div>

      {phase === "gps" && !isPermissionDenied && (
        <DirectionPanel
          instruction={view.instruction}
          thenManeuver={view.thenManeuver}
          thenAfterMeters={view.thenAfterMeters}
          t={t}
        />
      )}

      {/* Middle: the map */}
      <div className="relative min-h-48 flex-1">
        {/* absolute inset-0 gives the map a definite size inside the growing flex area. */}
        <div className="absolute inset-0">
          <WalkingMap
            destination={{ name: destination.name, coordinates: destinationCoordinates }}
            routeGeometry={route?.geometry ?? null}
            userPosition={fix?.coordinates ?? null}
            userAccuracyMeters={fix?.accuracyMeters ?? null}
            isFollowing={isFollowing}
            orientation={orientation}
            travelBearing={view.travelBearing}
            onUserMovedMap={() => setIsFollowing(false)}
            loadErrorText={t("gps.mapUnavailable")}
            tilesFailingText={t("gps.mapTilesFailing")}
          />
        </div>
        {destinationCoordinates ? (
          <>
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              <MapButton
                label={orientation === "north-up" ? t("gps.followDirection") : t("gps.northUp")}
                onClick={() => setOrientation((current) => (current === "north-up" ? "follow-direction" : "north-up"))}
              >
                {orientation === "north-up" ? "N" : "➤"}
              </MapButton>
              {!isFollowing && (
                <MapButton label={t("gps.recenter")} onClick={() => setIsFollowing(true)}>
                  ◎
                </MapButton>
              )}
            </div>
          </>
        ) : (
          // No position for this stop yet: the map shows Antwerp, with the address on top.
          <div className="absolute inset-x-3 top-3 rounded-sm bg-ink/90 p-3 text-center text-parchment shadow-lg">
            <p className="font-display text-xl">{destination.address}</p>
            <p className="text-sm text-parchment/80">{t("gps.notOnMap")}</p>
          </div>
        )}
      </div>

      {/* Bottom: GPS status + fallbacks. Sticky, so "I'm here" is always on screen. */}
      <div className="sticky bottom-0 z-10 flex flex-col gap-2 bg-ink px-4 py-3">
        {isPermissionDenied && (
          <div role="alert" className="flex flex-col gap-1 text-sm text-yellow-300">
            <p>
              <strong>{t("gps.permissionTitle")}.</strong> {t("gps.permissionBody")}
            </p>
            <p className="text-parchment/70">{t("gps.permissionHelp")}</p>
            <button type="button" onClick={retryGps} className="min-h-11 self-start font-semibold underline underline-offset-4">
              {t("gps.tryAgain")}
            </button>
          </div>
        )}
        {phase === "gps" && status === "unavailable" && (
          <p role="status" className="text-sm text-yellow-300">
            {t("gps.gpsUnavailable")}
          </p>
        )}
        {phase === "gps" && status === "searching" && !tracking.fix && (
          <p role="status" className="text-sm text-yellow-300">
            {t("gps.stillSearching")}
          </p>
        )}
        {phase === "gps" && hasWeakSignal(tracking) && (
          <p role="status" className="text-sm text-yellow-300">
            <strong>{t("gps.gpsWeak")}</strong> {t("gps.gpsWeakDetail")}
          </p>
        )}
        <Button onClick={handleManualArrival} variant={isManualArrivalPrimary ? "primary" : "outline"} fullWidth>
          {phase === "manual" || !destinationCoordinates ? t("gps.arrived") : t("gps.imHere")}
        </Button>
        <div className="flex justify-between text-sm">
          <button type="button" onClick={onShowRoute} className="min-h-11 text-gold underline underline-offset-4">
            {t("gps.showRoute")}
          </button>
          <a href={externalMapUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center text-parchment/60 underline underline-offset-4">
            {t("gps.externalMap")}
          </a>
        </div>
      </div>
      <ConfirmDialog
        open={confirmArrivalDistance !== null}
        title={t("gps.confirmArrival.title", { name: destination.name })}
        message={t("gps.confirmArrival.message", {
          distance: formatWalkingDistance(confirmArrivalDistance ?? 0, t),
        })}
        confirmLabel={t("gps.confirmArrival.confirm")}
        onConfirm={() => {
          setConfirmArrivalDistance(null);
          onArrive();
        }}
        onCancel={() => setConfirmArrivalDistance(null)}
      />
    </section>
  );
}

function MapButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-black/85 text-xl font-bold text-white shadow-lg"
    >
      {children}
    </button>
  );
}
