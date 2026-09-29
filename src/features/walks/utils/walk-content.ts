import type { Translator } from "@/i18n/translate";
import type { WalkLocation } from "@/types/location";
import type { Walk } from "@/types/walk";

/** True when a location still contains history that hasn't been fully verified. */
export function hasUnverifiedContent(location: WalkLocation): boolean {
  const hasUnverifiedBlock = location.content.some(
    (block) => block.kind === "history" && block.verification !== "verified",
  );
  const hasUnverifiedReveal =
    location.historicalReveal !== undefined && location.historicalReveal.status !== "verified";
  return hasUnverifiedBlock || hasUnverifiedReveal;
}

/** Used when a walk doesn't define its own "How it works" steps. */
export function getDefaultHowItWorksSteps(t: Translator): string[] {
  return [
    t("walks.defaultHowItWorks.step1"),
    t("walks.defaultHowItWorks.step2"),
    t("walks.defaultHowItWorks.step3"),
    t("walks.defaultHowItWorks.step4"),
  ];
}

export function getHowItWorksSteps(walk: Walk, t: Translator): string[] {
  return walk.howItWorksSteps ?? getDefaultHowItWorksSteps(t);
}
