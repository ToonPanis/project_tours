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
