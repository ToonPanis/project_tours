import type { RouteGroup } from "@/types/pub-game";

/**
 * A random route for one team: every group in its order, the cafés of a
 * `shuffle` group in a random order. `random` returns a number in [0, 1).
 */
export function drawRoute(groups: RouteGroup[], random: () => number): string[] {
  return groups.flatMap((group) => (group.shuffle ? shuffle(group.cafeIds, random) : group.cafeIds));
}

/**
 * True when `route` could have come from `drawRoute`: each group fills its own
 * slots, fixed groups keep their order, and every café appears exactly once.
 * The server uses it to refuse a broken route (and the tests to check routes).
 */
export function isValidRoute(groups: RouteGroup[], route: string[]): boolean {
  const total = groups.reduce((sum, group) => sum + group.cafeIds.length, 0);
  if (route.length !== total) return false;

  let position = 0;
  for (const group of groups) {
    const slice = route.slice(position, position + group.cafeIds.length);
    position += group.cafeIds.length;

    if (group.shuffle) {
      const sorted = (ids: string[]) => [...ids].sort().join("|");
      if (sorted(slice) !== sorted(group.cafeIds)) return false;
    } else if (slice.join("|") !== group.cafeIds.join("|")) {
      return false;
    }
  }
  return true;
}

/** Fisher–Yates shuffle of a copy. */
function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Every walk from one café to another that some random route can contain:
 * within a shuffled group any order, within a fixed group the next café, and
 * from the end of a group to the start of the next one. These are the legs
 * scripts/generate-walking-routes.mjs must generate (the same rule is written
 * out there; a test checks that routes.json matches this function).
 */
export function requiredLegs(groups: RouteGroup[]): [string, string][] {
  const legs: [string, string][] = [];
  groups.forEach((group, index) => {
    const ids = group.cafeIds;
    if (group.shuffle) {
      for (const from of ids) for (const to of ids) if (from !== to) legs.push([from, to]);
    } else {
      for (let i = 0; i < ids.length - 1; i++) legs.push([ids[i], ids[i + 1]]);
    }
    const next = groups[index + 1];
    if (!next) return;
    // A shuffled group can end with any of its cafés / the next one can start with any of its cafés.
    const lasts = group.shuffle ? ids : ids.slice(-1);
    const firsts = next.shuffle ? next.cafeIds : next.cafeIds.slice(0, 1);
    for (const from of lasts) for (const to of firsts) legs.push([from, to]);
  });
  return legs;
}
