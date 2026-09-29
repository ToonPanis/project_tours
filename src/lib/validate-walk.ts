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

  // Each experience uses a different player; mixing their fields leads to dead ends.
  for (const stop of stops) {
    if (walk.experience === "guide") {
      if (!stop.guide) problems.push(`${stop.id}: a guide walk stop needs guide content (else a blank page)`);
      if (stop.challenge || stop.drinkRound) {
        problems.push(`${stop.id}: a guide walk stop can't have a challenge or drink round (the guide player can't finish it)`);
      }
    }
    // Typed numbers are read with thousands separators ("1.582" = 1582, see answers.ts),
    // which only works when the right answer is a whole number.
    for (const challenge of [stop.challenge, stop.bonusChallenge]) {
      if (challenge?.type === "number-answer" && !Number.isInteger(challenge.correctNumber)) {
        problems.push(`${stop.id}: a number answer must be a whole number (${challenge.correctNumber})`);
      }
      // The player can't play "sequence" challenges yet: a team would be stuck there.
      if (challenge?.type === "sequence") problems.push(`${stop.id}: "sequence" challenges can't be played yet (dead end)`);
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
  const clueIds = new Set((walk.clues ?? []).map((clue) => clue.id));
  for (const clue of walk.clues ?? []) {
    if (!stopIds.has(clue.sourceLocationId)) problems.push(`clue ${clue.id} comes from unknown stop ${clue.sourceLocationId}`);
  }
  for (const chapter of walk.chapters ?? []) {
    if (!stopIds.has(chapter.firstLocationId)) problems.push(`chapter ${chapter.id} starts at unknown stop ${chapter.firstLocationId}`);
  }
  const challenges = [
    ...stops.flatMap((stop) => [stop.challenge, stop.bonusChallenge]),
    ...(walk.finale?.questions ?? []),
  ].filter((challenge) => challenge !== undefined);
  for (const challenge of challenges) {
    for (const clueId of challenge.requiredClueIds ?? []) {
      if (!clueIds.has(clueId)) problems.push(`challenge ${challenge.id} needs unknown clue ${clueId}`);
    }
    if (challenge.answerClueId && !clueIds.has(challenge.answerClueId)) {
      problems.push(`challenge ${challenge.id} reveals unknown clue ${challenge.answerClueId}`);
    }
  }

  return problems;
}
