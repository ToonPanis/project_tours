import type { Translator } from "@/i18n/translate";
import type { WalkCopy, Walk } from "@/types/walk";

/** Neutral texts for walks that don't define their own flavour, in the translator's language. */
export function getDefaultWalkCopy(t: Translator): WalkCopy {
  return {
    voteResultTitle: t("game.copy.voteResultTitle"),
    tieTitle: t("game.copy.tieTitle"),
    tieSubtitle: t("game.copy.tieSubtitle"),
    afterVoteMessage: t("game.copy.afterVoteMessage"),
    wrongAnswer: t("game.copy.wrongAnswer"),
    correctAnswer: t("game.copy.correctAnswer"),
    nextLocationTitle: t("game.copy.nextLocationTitle"),
    completionTitle: t("game.copy.completionTitle"),
    completionMessage: t("game.copy.completionMessage"),
    startLabel: t("game.copy.startLabel"),
    clueCollectedTitle: t("game.copy.clueCollectedTitle"),
    locationsTitle: t("game.copy.locationsTitle"),
    locationsDiscoveredLabel: t("game.copy.locationsDiscoveredLabel"),
    routeButtonLabel: t("game.header.route"),
  };
}

/**
 * The walk's own texts (already in the walk's language, see the walk's
 * content files), with defaults for anything it doesn't override.
 */
export function getWalkCopy(walk: Walk, t: Translator): WalkCopy {
  return { ...getDefaultWalkCopy(t), ...walk.copy };
}
