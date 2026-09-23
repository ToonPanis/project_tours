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
export const defaultHowItWorksSteps = [
  "Follow the route",
  "Discover the location",
  "Solve the challenge",
  "Unlock the next stop",
];

export function getHowItWorksSteps(walk: Walk): string[] {
  return walk.howItWorksSteps ?? defaultHowItWorksSteps;
}
