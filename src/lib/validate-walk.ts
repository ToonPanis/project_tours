import type { Walk } from "@/types/walk";

/**
 * Structural checks every walk must pass, whatever its content: a data mistake
 * found here in a test is much better than a tourist stuck on the street.
 * Returns a list of problems (empty = fine). Run for every walk in every
 * language in walk-data.test.ts; a future database/CMS can reuse it on import.
 */
export function validateWalk(walk: Walk): string[] {
  const problems: string[] = [];
  const stops = [...walk.locations].sort((a, b) => a.order - b.order);
  const stopIds = new Set(stops.map((stop) => stop.id));

  if (stops.length === 0) problems.push("the walk has no stops");
  if (stopIds.size !== stops.length) problems.push("two stops share the same id");

  // The guide player shows each stop's page; without one the walker gets a blank page.
  for (const stop of stops) {
    if (walk.experience === "guide" && !stop.guide) {
      problems.push(`${stop.id}: a guide walk stop needs guide content (else a blank page)`);
    }
  }

  // Walking routes: one per consecutive pair, plus a bypass around each optional stop
  // (the same pairs scripts/generate-walking-routes.mjs creates).
  if (walk.routeLegs) {
    const hasLeg = (fromId: string, toId: string) =>
      walk.routeLegs!.some((leg) => leg.fromLocationId === fromId && leg.toLocationId === toId);
    for (let index = 0; index < stops.length - 1; index++) {
      const [from, to] = [stops[index], stops[index + 1]];
      if (!hasLeg(from.id, to.id)) problems.push(`no walking route ${from.id} → ${to.id}`);
      if (to.isBonus) {
        const lastMainStop = stops.slice(0, index + 1).reverse().find((stop) => !stop.isBonus);
        const afterDetour = stops.slice(index + 2).find((stop) => !stop.isBonus);
        if (lastMainStop && afterDetour && !hasLeg(lastMainStop.id, afterDetour.id)) {
          problems.push(`no bypass route ${lastMainStop.id} → ${afterDetour.id} around optional ${to.id}`);
        }
      }
    }
    for (const leg of walk.routeLegs) {
      if (!stopIds.has(leg.fromLocationId) || !stopIds.has(leg.toLocationId)) {
        problems.push(`route ${leg.fromLocationId} → ${leg.toLocationId} refers to an unknown stop`);
      }
    }
  }

  // References between parts of the walk.
  for (const chapter of walk.chapters ?? []) {
    if (!stopIds.has(chapter.firstLocationId)) problems.push(`chapter ${chapter.id} starts at unknown stop ${chapter.firstLocationId}`);
  }

  return problems;
}
