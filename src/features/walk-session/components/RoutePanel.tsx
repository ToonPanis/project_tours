"use client";

import { Button } from "@/components/ui/Button";
import type { ReactNode } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { useT } from "@/i18n/client";
import type { WalkSession } from "@/types/session";
import type { WalkCopy, Walk } from "@/types/walk";
import { getOrderedLocations, isLocationRevealed } from "@/lib/walk-locations";

interface RoutePanelProps {
  walk: Walk;
  session: WalkSession;
  copy: WalkCopy;
  open: boolean;
  onClose: () => void;
  /** Extra content under the route, e.g. a walk's collection. */
  children?: ReactNode;
}

/** The route panel: the stops so far, plus the discovered clues when the walk has them (the Ledger in Hidden Pubs). */
export function RoutePanel({ walk, session, copy, open, onClose, children }: RoutePanelProps) {
  const t = useT();
  const title = walk.narrative?.title ?? t("game.ledger.yourRoute", { title: walk.title });
  const orderedLocations = getOrderedLocations(walk);
  const currentIndex = orderedLocations.findIndex((location) => location.id === session.currentLocationId);
  // Main stops are numbered 1, 2, 3…; optional bonus stops get a "+" instead.
  const mainStopNumbers = new Map(
    orderedLocations.filter((location) => !location.isBonus).map((location, index) => [location.id, index + 1]),
  );
  const clues = walk.clues ?? [];

  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
        {/* Sticky: on a long route (35 stops) the panel can be closed without scrolling down. */}
        <div className="sticky top-0 z-10 -mx-6 -mt-6 flex items-start justify-between gap-3 bg-umber px-6 pb-3 pt-6">
          <h2 className="min-w-0 break-words font-display text-3xl font-semibold text-gold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-parchment/30 text-xl text-parchment hover:bg-parchment/10 focus-visible:outline-2 focus-visible:outline-gold"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {clues.length > 0 && (
          <section aria-labelledby="ledger-clues">
            <h3 id="ledger-clues" className="text-xs font-semibold uppercase tracking-[0.25em] text-parchment/70">
              {t("game.ledger.discoveredClues", { found: session.collectedClueIds.length, total: clues.length })}
            </h3>
            <ol className="mt-3 space-y-2">
              {clues.map((clue, index) => {
                const isFound = session.collectedClueIds.includes(clue.id);
                return (
                  <li key={clue.id} className="flex items-center gap-3 border-b border-parchment/10 pb-2">
                    <span aria-hidden="true" className={`w-5 text-center ${isFound ? "text-gold" : "text-parchment/65"}`}>
                      {isFound ? "✓" : "?"}
                    </span>
                    {isFound ? (
                      <span className="font-display text-xl font-semibold tracking-wider text-parchment">
                        {clue.value}
                      </span>
                    ) : (
                      <span className="uppercase italic tracking-wider text-parchment/65">
                        {t("game.ledger.clueLocked", { number: index + 1 })}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <section aria-labelledby="ledger-route">
          <h3 id="ledger-route" className="text-xs font-semibold uppercase tracking-[0.25em] text-parchment/70">
            {copy.locationsTitle}
          </h3>
          <ol className="mt-3 space-y-2">
            {orderedLocations.map((location, index) => {
              const status = session.locations[location.id]?.status ?? "locked";
              const isCurrent = location.id === session.currentLocationId && !session.completedAt;
              const isRevealed = isLocationRevealed(walk.routeReveal, status);
              const isSkipped = location.isBonus && status === "locked" && (index < currentIndex || !!session.completedAt);
              const marker = status === "solved" ? "✓" : isCurrent ? "→" : isSkipped ? "–" : "?";
              const mainNumber = mainStopNumbers.get(location.id);

              return (
                <li
                  key={location.id}
                  aria-current={isCurrent ? "step" : undefined}
                  className="flex items-center gap-3 border-b border-parchment/10 pb-2"
                >
                  <span aria-hidden="true" className="w-5 text-center text-gold">
                    {marker}
                  </span>
                  <span className="font-display text-sm text-parchment/65">
                    {mainNumber !== undefined ? String(mainNumber).padStart(2, "0") : "+"}
                  </span>
                  <span className={isRevealed ? "text-parchment" : "italic text-parchment/65"}>
                    {isRevealed ? location.name : "???"}
                    {location.isBonus && !isSkipped && (
                      <span className="ml-2 text-xs uppercase tracking-wider text-parchment/60">{t("guide.extraStop")}</span>
                    )}
                    {isSkipped && <span className="ml-2 text-xs uppercase tracking-wider text-parchment/60">{t("game.ledger.skipped")}</span>}
                    {isCurrent && <span className="ml-2 text-xs uppercase tracking-wider text-gold">{t("game.ledger.current")}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {children}

        <div className="mt-auto">
          <Button onClick={onClose} fullWidth>
            {t("common.close")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
