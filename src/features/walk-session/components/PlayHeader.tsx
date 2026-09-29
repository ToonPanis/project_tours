import { ProgressBar } from "@/components/ui/ProgressBar";
import { useT } from "@/i18n/client";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getSessionStats } from "../logic/session-stats";

interface PlayHeaderProps {
  walk: Walk;
  session: WalkSession;
  onOpenRoute: () => void;
}

/** Always-visible progress: stop number, progress bar, clues and the Ledger button. */
export function PlayHeader({ walk, session, onOpenRoute }: PlayHeaderProps) {
  const t = useT();
  const stats = getSessionStats(walk, session);

  return (
    <div className="sticky top-14 z-10 border-b border-gold/20 bg-ink/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.2em] text-gold">{walk.title}</p>
          <p className="font-display text-lg font-semibold text-parchment">
            {stats.isAtBonusStop ? t("guide.extraStop") : t("game.header.stopCounter", { current: stats.currentStopNumber, total: stats.totalStops })}
            {stats.totalClues > 0 && (
              <span className="ml-3 text-sm font-normal text-parchment/70">
                Clues {stats.collectedClues} / {stats.totalClues}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenRoute}
          className="min-h-11 shrink-0 rounded-sm border border-gold/60 px-4 text-sm font-semibold uppercase tracking-wider text-gold transition-colors hover:bg-gold hover:text-ink"
        >
          {walk.clues ? "Ledger" : t("game.header.route")}
        </button>
      </div>
      <div className="mt-2">
        <ProgressBar value={stats.solvedStops} max={stats.totalStops} label={t("game.header.progressLabel")} />
      </div>
    </div>
  );
}
