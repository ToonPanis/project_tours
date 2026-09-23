import type { WalkLocation } from "@/types/location";
import type { Walk } from "@/types/walk";

/** True when a location still contains history that hasn't been verified. */
export function hasUnverifiedContent(location: WalkLocation): boolean {
  return location.content.some(
    (block) => block.kind === "history" && block.verification === "research-needed",
  );
}

/** Used when a walk doesn't define its own "How it works" steps. */
export const defaultHowItWorksSteps = [
  "Follow the route",
  "Discover the location",
  "Solve the challenge",
  "Unlock the next stop",
];

export function getHowItWorksSteps(walk: Walk): string[] {
  return walk.howItWorksSteps ?? defaultHowItWorksSteps;
}
