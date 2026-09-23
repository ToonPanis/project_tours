import { ProgressBar } from "@/components/ui/ProgressBar";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getSessionStats } from "../logic/session-stats";

interface PlayHeaderProps {
  walk: Walk;
  session: WalkSession;
  onOpenLedger: () => void;
}

/** Always-visible progress: stop number, progress bar, clues and the Ledger button. */
export function PlayHeader({ walk, session, onOpenLedger }: PlayHeaderProps) {
  const stats = getSessionStats(walk, session);

  return (
    <div className="sticky top-14 z-10 border-b border-gold/20 bg-ink/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.2em] text-gold">{walk.title}</p>
          <p className="font-display text-lg font-semibold text-parchment">
            Stop {stats.currentStopNumber} / {stats.totalStops}
            {stats.totalClues > 0 && (
              <span className="ml-3 text-sm font-normal text-parchment/70">
                Clues {stats.collectedClues} / {stats.totalClues}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenLedger}
          className="min-h-11 shrink-0 rounded-sm border border-gold/60 px-4 text-sm font-semibold uppercase tracking-wider text-gold transition-colors hover:bg-gold hover:text-ink"
        >
          {walk.clues ? "Ledger" : "Route"}
        </button>
      </div>
      <div className="mt-2">
        <ProgressBar value={stats.solvedStops} max={stats.totalStops} label="Walk progress" />
      </div>
    </div>
  );
}
