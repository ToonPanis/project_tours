"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getOrderedLocations, isLocationRevealed } from "../logic/route";

interface LedgerPanelProps {
  walk: Walk;
  session: WalkSession;
  open: boolean;
  onClose: () => void;
}

/** The team's notebook: discovered clues and the route so far. */
export function LedgerPanel({ walk, session, open, onClose }: LedgerPanelProps) {
  const title = walk.narrative?.title ?? `${walk.title}: your route`;
  const orderedLocations = getOrderedLocations(walk);
  const clues = walk.clues ?? [];

  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
        <h2 className="font-display text-3xl font-semibold text-gold">{title}</h2>

        {clues.length > 0 && (
          <section aria-labelledby="ledger-clues">
            <h3 id="ledger-clues" className="text-xs font-semibold uppercase tracking-[0.25em] text-parchment/70">
              Discovered clues · {session.collectedClueIds.length} / {clues.length}
            </h3>
            <ol className="mt-3 space-y-2">
              {clues.map((clue, index) => {
                const isFound = session.collectedClueIds.includes(clue.id);
                return (
                  <li key={clue.id} className="flex items-center gap-3 border-b border-parchment/10 pb-2">
                    <span aria-hidden="true" className={`w-5 text-center ${isFound ? "text-gold" : "text-parchment/40"}`}>
                      {isFound ? "✓" : "?"}
                    </span>
                    {isFound ? (
                      <span className="flex flex-1 items-baseline justify-between gap-3">
                        <span className="text-parchment/80">{clue.title}</span>
                        <span className="font-display text-2xl font-semibold tracking-widest text-parchment">
                          {clue.value}
                        </span>
                      </span>
                    ) : (
                      <span className="text-parchment/40">Clue {index + 1} · locked</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <section aria-labelledby="ledger-route">
          <h3 id="ledger-route" className="text-xs font-semibold uppercase tracking-[0.25em] text-parchment/70">
            The route
          </h3>
          <ol className="mt-3 space-y-2">
            {orderedLocations.map((location) => {
              const status = session.locations[location.id]?.status ?? "locked";
              const isCurrent = location.id === session.currentLocationId && !session.completedAt;
              const isRevealed = isLocationRevealed(walk.routeReveal, status);
              const marker = status === "solved" ? "✓" : isCurrent ? "→" : "?";

              return (
                <li
                  key={location.id}
                  aria-current={isCurrent ? "step" : undefined}
                  className="flex items-center gap-3 border-b border-parchment/10 pb-2"
                >
                  <span aria-hidden="true" className="w-5 text-center text-gold">
                    {marker}
                  </span>
                  <span className="font-display text-sm text-parchment/50">
                    {String(location.order).padStart(2, "0")}
                  </span>
                  <span className={isRevealed ? "text-parchment" : "text-parchment/40"}>
                    {isRevealed ? location.name : "???"}
                    {isCurrent && <span className="ml-2 text-xs uppercase tracking-wider text-gold">Current</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-auto">
          <Button onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
