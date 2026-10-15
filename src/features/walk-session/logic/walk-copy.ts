import type { Translator } from "@/i18n/translate";
import type { WalkCopy, Walk } from "@/types/walk";

/** Neutral texts for walks that don't define their own, in the translator's language. */
export function getDefaultWalkCopy(t: Translator): WalkCopy {
  return {
    completionTitle: t("game.copy.completionTitle"),
    completionMessage: t("game.copy.completionMessage"),
    startLabel: t("game.copy.startLabel"),
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
