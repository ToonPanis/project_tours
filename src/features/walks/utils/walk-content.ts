import type { Translator } from "@/i18n/translate";
import type { Walk } from "@/types/walk";

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
