import { getOrderedLocations, isRevealedBeforeStart } from "@/features/walk-session/logic/route";
import type { Walk } from "@/types/walk";

interface LocationPreviewListProps {
  walk: Walk;
}

/**
 * Route preview for the detail page. Deliberately shows only names and
 * short teasers, not stories or challenges, to avoid spoilers.
 *
 * For walks with a progressive route, locked stops show "???". This is a
 * Server Component, so hidden names are never sent to the browser.
 */
export function LocationPreviewList({ walk }: LocationPreviewListProps) {
  const orderedLocations = getOrderedLocations(walk);
  const lastLocationId = orderedLocations.at(-1)?.id;

  return (
    <ol className="relative space-y-6 border-l border-gold-deep/30 pl-8">
      {orderedLocations.map((location) => {
        const isRevealed = isRevealedBeforeStart(walk, location);
        const isFinal = location.id === lastLocationId && orderedLocations.length > 1;

        return (
          <li key={location.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[2.9rem] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-gold-deep/50 bg-ink font-display text-sm font-semibold text-gold"
            >
              {location.order}
            </span>

            {isRevealed ? (
              <>
                <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                  <span className="sr-only">Stop {location.order}: </span>
                  {location.name}
                </h3>
                {location.isBonus && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
                    Bonus stop · optional
                  </p>
                )}
                <p className="text-sm text-sepia">{location.description}</p>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg font-semibold leading-snug text-sepia/70">
                  <span className="sr-only">Stop {location.order}: hidden location</span>
                  <span aria-hidden="true">???</span>
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-sepia/70">
                  {isFinal ? "Final destination" : "Locked"}
                </p>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
