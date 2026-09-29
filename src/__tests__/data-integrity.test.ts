import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import classicsImagesFile from "@/data/walks/classics-of-antwerp/images.json";
import { getWalks, walks } from "@/data/walks";
import { locales } from "@/i18n/config";
import { distanceInMeters } from "@/lib/geo";
import { getOrderedLocations } from "@/lib/walk-locations";
import type { Challenge } from "@/types/challenge";
import type { Walk } from "@/types/walk";
import { readImageSize } from "../../scripts/lib/image-size.mjs";

/**
 * Checks that the generated data files (routes.json, images.json) still match the
 * data they were made from, and that content can't silently lose parts the players
 * rely on (hints, search tasks).
 */

function publicFile(src: string): string {
  return join(process.cwd(), "public", src);
}

// ---------------------------------------------------------------------------
// L-40: routes.json must match coordinates.json
// ---------------------------------------------------------------------------

/**
 * OSRM snaps the start and end of each route to the nearest walkable street, so a
 * leg never starts exactly on its stop's pin. Measured on the current data (Sept 2026):
 * the largest offset is 48.9 m (Poortjes), 42.1 m (Classics), 15.8 m (Hidden Pubs).
 * 60 m leaves a small margin. A pin moved further than this in coordinates.json
 * without regenerating routes.json fails the test.
 */
const MAX_ROUTE_END_TO_STOP_METERS = 60;

/** Every leg whose route starts or ends too far from its stop (stops without coordinates are skipped). */
function findStaleLegs(walk: Walk): string[] {
  const problems: string[] = [];
  for (const leg of walk.routeLegs ?? []) {
    const label = `${leg.fromLocationId} → ${leg.toLocationId}`;
    const from = walk.locations.find((location) => location.id === leg.fromLocationId);
    const to = walk.locations.find((location) => location.id === leg.toLocationId);
    if (!from || !to) {
      problems.push(`${label}: unknown stop`);
      continue;
    }
    const geometry = leg.route.geometry;
    if (geometry.length < 2) {
      problems.push(`${label}: no route line`);
      continue;
    }
    if (from.coordinates) {
      const meters = distanceInMeters(geometry[0], from.coordinates);
      if (meters > MAX_ROUTE_END_TO_STOP_METERS) problems.push(`${label}: starts ${Math.round(meters)} m from its stop`);
    }
    if (to.coordinates) {
      const meters = distanceInMeters(geometry.at(-1)!, to.coordinates);
      if (meters > MAX_ROUTE_END_TO_STOP_METERS) problems.push(`${label}: ends ${Math.round(meters)} m from its stop`);
    }
  }
  return problems;
}

/**
 * The number of stops per walk, as documented in CLAUDE.md. Tests elsewhere derive their
 * expectations from the data, so a stop that silently disappeared from the data would
 * go unnoticed there: this pins the counts. Change them here on purpose when a walk changes.
 */
describe("stop counts", () => {
  const expected: Record<string, { main: number; optional: number }> = {
    "poortjes-van-antwerpen": { main: 33, optional: 2 },
    "hidden-pubs": { main: 8, optional: 0 },
    "classics-of-antwerp": { main: 18, optional: 0 },
  };

  test.each(locales)("in %s every walk has its documented stops", (locale) => {
    const counts = Object.fromEntries(
      getWalks(locale).map((walk) => [
        walk.slug,
        { main: walk.locations.filter((stop) => !stop.isBonus).length, optional: walk.locations.filter((stop) => stop.isBonus).length },
      ]),
    );
    expect(counts).toEqual(expected);
  });
});

describe("routes.json matches coordinates.json (L-40)", () => {
  test.each(walks.map((walk) => [walk.slug, walk] as const))(
    "%s: every leg (incl. bypass legs) starts and ends at its stops",
    (_, walk) => {
      expect(walk.routeLegs?.length ?? 0).toBeGreaterThan(0);
      expect(findStaleLegs(walk), "regenerate: node scripts/generate-walking-routes.mjs <walk-folder>").toEqual([]);
    },
  );

  test("detects a stop that moved without regenerating the routes", () => {
    const walk = walks[0];
    const moved = walk.routeLegs![0].toLocationId;
    const stale: Walk = {
      ...walk,
      locations: walk.locations.map((location) =>
        location.id === moved && location.coordinates
          ? // ~110 m further north
            { ...location, coordinates: { ...location.coordinates, latitude: location.coordinates.latitude + 0.001 } }
          : location,
      ),
    };
    expect(findStaleLegs(stale).some((problem) => problem.includes(moved))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// L-41: every walk with routes shows its distance
// ---------------------------------------------------------------------------

describe("walk distance comes from the route legs (L-41)", () => {
  test.each(walks.map((walk) => [walk.slug, walk] as const))(
    "%s: distance = the main-route legs (no bypass or detour legs), rounded to 100 m",
    (_, walk) => {
      // Recomputed here on purpose (not with the data helper): consecutive main stops.
      const mainStops = getOrderedLocations(walk).filter((location) => !location.isBonus);
      const meters = mainStops.slice(1).reduce((sum, location, index) => {
        const leg = walk.routeLegs!.find(
          (candidate) => candidate.fromLocationId === mainStops[index].id && candidate.toLocationId === location.id,
        );
        expect(leg, `${mainStops[index].id} → ${location.id}`).toBeDefined();
        return sum + leg!.route.distanceMeters;
      }, 0);
      expect(meters).toBeGreaterThan(0);
      expect(walk.distanceInMeters).toBe(Math.round(meters / 100) * 100);
    },
  );

  test("the distance is the same in every language", () => {
    for (const locale of locales) {
      expect(getWalks(locale).map((walk) => walk.distanceInMeters)).toEqual(walks.map((walk) => walk.distanceInMeters));
    }
  });
});

// ---------------------------------------------------------------------------
// L-42: declared image sizes match the files in /public
// ---------------------------------------------------------------------------

function realSize(src: string) {
  return readImageSize(readFileSync(publicFile(src)));
}

describe("image sizes match the real files (L-42)", () => {
  test("the size reader understands JPEG and PNG headers", () => {
    // PNG: signature + IHDR chunk (width 3, height 2).
    const png = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 3, 0, 0, 0, 2,
    ]);
    expect(readImageSize(png)).toEqual({ width: 3, height: 2 });
    // JPEG: SOI, an APP0 segment to skip, then SOF2 (progressive) with height 300, width 500.
    const jpeg = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc2, 0, 11, 8, 0x01, 0x2c, 0x01, 0xf4, 3, 0, 0, 0,
    ]);
    expect(readImageSize(jpeg)).toEqual({ width: 500, height: 300 });
    expect(readImageSize(new Uint8Array([1, 2, 3, 4]))).toBeNull();
  });

  // Classics' images.json is the only images.json today; Poortjes reuses it by id.
  test.each(classicsImagesFile.images.map((image) => [image.id, image] as const))(
    "classics images.json: %s",
    (_, image) => {
      expect(existsSync(publicFile(image.localPath)), image.localPath).toBe(true);
      expect(realSize(image.localPath)).toEqual({ width: image.width, height: image.height });
    },
  );

  test("every image a walk shows declares its real size (all walks, incl. the Smekens drawings)", () => {
    const wrong: string[] = [];
    const checked = new Set<string>();
    for (const walk of walks) {
      const images = [
        ...(walk.coverImage ? [walk.coverImage] : []),
        ...(walk.collection?.items ?? []).map((item) => item.image),
        ...walk.locations.flatMap((location) => [
          ...(location.guide?.images ?? []),
          ...(location.guide?.cards ?? []).flatMap((card) => (card.image ? [card.image] : [])),
        ]),
      ];
      for (const image of images) {
        if (!("width" in image) || image.width === undefined || checked.has(image.src)) continue;
        checked.add(image.src);
        const size = realSize(image.src);
        if (size?.width !== image.width || size?.height !== image.height) {
          wrong.push(`${image.src}: declared ${image.width}×${image.height}, file ${size?.width}×${size?.height}`);
        }
      }
    }
    expect(checked.size).toBeGreaterThan(52);
    expect(wrong).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// L-43: every challenge has hints
// ---------------------------------------------------------------------------

/**
 * CONTENT DECISION PENDING (L-43): add hints or confirm none.
 * These challenges ship without hints today. Remove an id once it has hints;
 * a NEW challenge without hints fails the test.
 */
const CHALLENGES_WITHOUT_HINTS_ALLOWED = [
  "pubs-bonus-quinten-matsijs",
  "pubs-finale-animal",
  "pubs-finale-game",
  "pubs-finale-time",
];

function allChallenges(walk: Walk): Challenge[] {
  return [
    ...walk.locations.flatMap((location) => [location.challenge, location.bonusChallenge]),
    ...(walk.finale?.questions ?? []),
  ].filter((challenge): challenge is Challenge => challenge !== undefined);
}

describe("every challenge has at least one hint (L-43)", () => {
  test.each(locales)("%s", (locale) => {
    const withoutHints = getWalks(locale)
      .flatMap(allChallenges)
      .filter((challenge) => challenge.hints.filter((hint) => hint.trim().length > 0).length === 0)
      .map((challenge) => challenge.id);
    expect(withoutHints.sort()).toEqual([...CHALLENGES_WITHOUT_HINTS_ALLOWED].sort());
  });
});

// ---------------------------------------------------------------------------
// L-44: every search task is complete, in every language
// ---------------------------------------------------------------------------

/**
 * The stops with a search task, and the gate numbers each task asks about (in this
 * order). The same in every language: a translation can't drop or swap a drawing.
 */
const EXPECTED_SEARCH_TASKS: Record<string, (number | undefined)[]> = {
  "poortjes-gildekamersstraat": [11, 12],
  "poortjes-academie": [37, 38, 39, 40, 41],
  "poortjes-adriaan-brouwerstraat": [47, 48, 49, 50],
};

describe("search tasks (L-44)", () => {
  test.each(locales)("%s: every search task uses drawings of that stop and can always be solved", (locale) => {
    const found: Record<string, (number | undefined)[]> = {};
    for (const walk of getWalks(locale)) {
      for (const location of walk.locations) {
        const task = location.guide?.searchTask;
        if (!task) continue;
        found[location.id] = task.items.map((item) => item.drawing.number);
        expect(task.title.trim(), location.id).not.toBe("");
        expect(task.intro.trim(), location.id).not.toBe("");
        expect(task.items.length, location.id).toBeGreaterThan(0);
        for (const item of task.items) {
          // A drawing of a gate at this stop, whose image exists.
          expect(item.drawing.stopId, item.id).toBe(location.id);
          expect(existsSync(publicFile(item.drawing.image.src)), item.drawing.image.src).toBe(true);
          expect(item.question.trim(), item.id).not.toBe("");
          expect(item.hints.length, item.id).toBeGreaterThan(0);
          for (const hint of item.hints) expect(hint.trim(), item.id).not.toBe("");
          expect(item.solution.trim(), item.id).not.toBe("");
          expect(item.explanation.length, item.id).toBeGreaterThan(0);
        }
      }
    }
    expect(found).toEqual(EXPECTED_SEARCH_TASKS);
  });
});
