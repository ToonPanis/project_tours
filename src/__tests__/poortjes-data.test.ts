import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { getPoortjesWalk, poortjesWalk } from "@/data/walks/poortjes-van-antwerpen";
import { locales } from "@/i18n/config";
import { getDetourCost, getRouteLeg } from "@/features/navigation/logic/route-legs";
import { getOrderedLocations } from "@/features/walk-session/logic/route";
import { distanceInMeters } from "@/lib/geo";

const walk = poortjesWalk;
const locations = getOrderedLocations(walk);
const items = walk.collection?.items ?? [];

function publicFileExists(src: string): boolean {
  return existsSync(join(process.cwd(), "public", src));
}

describe("Poortjes van Antwerpen: collection", () => {
  test("links every one of the 52 plates exactly once", () => {
    const plates = items.map((item) => item.plateNumber).sort((a, b) => a - b);
    expect(plates).toEqual(Array.from({ length: 52 }, (_, index) => index + 1));
  });

  test("numbers the gates 1 to 50, each once (plates 3 and 51 are extras)", () => {
    const numbers = items.flatMap((item) => (item.number !== undefined ? [item.number] : []));
    expect([...numbers].sort((a, b) => a - b)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1));
    expect(items.filter((item) => item.number === undefined).map((item) => item.plateNumber).sort()).toEqual([3, 51]);
  });

  test("every drawing exists in /public and quotes its caption", () => {
    for (const item of items) {
      expect(publicFileExists(item.image.src), item.image.src).toBe(true);
      expect(item.sourceCaption.startsWith(`${item.plateNumber}.`)).toBe(true);
      expect(item.image.photographerOrArtist).toBe("Paul Smekens");
    }
  });

  test("the statuses asked for are applied", () => {
    const statusOf = (number: number) => items.find((item) => item.number === number)?.status;
    for (const vanished of [13, 14, 18, 21, 22, 24, 28, 30, 31, 32, 43, 44]) expect(statusOf(vanished)).toBe("vanished");
    expect(statusOf(19)).toBe("in-renovation");
    expect(statusOf(33)).toBe("optional");
    expect(statusOf(34)).toBe("optional");
  });

  test("every item points to a real stop (or none for the one outside the route)", () => {
    for (const item of items) {
      if (item.stopId === null) {
        expect(item.plateNumber).toBe(51);
        continue;
      }
      expect(locations.some((location) => location.id === item.stopId), item.stopId).toBe(true);
    }
  });
});

describe("Poortjes van Antwerpen: physical route", () => {
  test("location ids are unique and orders run 1, 2, 3…", () => {
    expect(new Set(locations.map((location) => location.id)).size).toBe(locations.length);
    expect(locations.map((location) => location.order)).toEqual(locations.map((_, index) => index + 1));
  });

  test("no vanished gate is a waypoint: vanished gates are never featured, and no stop is at their address", () => {
    const vanished = items.filter((item) => item.status === "vanished");
    for (const location of locations) {
      expect(location.guide?.featuredItems?.some((item) => item.status === "vanished")).toBeFalsy();
      for (const item of vanished) expect(location.address).not.toContain(item.address);
    }
    // …but they are all mentioned somewhere on the route.
    const mentioned = locations.flatMap((location) => location.guide?.vanishedNearby ?? []);
    expect(mentioned.map((item) => item.id).sort()).toEqual(vanished.map((item) => item.id).sort());
  });

  test("keeps the agreed gate order (Oude Beurs 16 right after the Zilversmidstraat; Jeruzalemstraat by the Wolstraat)", () => {
    const numbersOnRoute = locations.flatMap((location) =>
      (location.guide?.featuredItems ?? [])
        .concat(location.guide?.searchTask?.items.map((task) => task.drawing) ?? [])
        .flatMap((item) => (item.number !== undefined ? [item.number] : [])),
    );
    const unique = numbersOnRoute.filter((number, index) => numbersOnRoute.indexOf(number) === index);
    const withoutMovedGates = unique.filter((number) => number !== 10 && number !== 20);
    expect(withoutMovedGates).toEqual([...withoutMovedGates].sort((a, b) => a - b));

    const ids = locations.map((location) => location.id);
    expect(ids.indexOf("poortjes-oude-beurs")).toBe(ids.indexOf("poortjes-leonie-glassplein") + 1);
    expect(ids.indexOf("poortjes-jeruzalemstraat")).toBe(ids.indexOf("poortjes-wolstraat-30") + 1);
  });

  test("starts at Rosier 24, passes the big stops in order and ends at the MAS (+ optional Red Star Line)", () => {
    const ids = locations.map((location) => location.id);
    expect(ids[0]).toBe("poortjes-rosier");
    const order = [
      "poortjes-grote-markt",
      "poortjes-kathedraal",
      "poortjes-gildekamersstraat",
      "poortjes-handelsbeurs",
      "poortjes-sint-jacob",
      "poortjes-keizerstraat",
      "poortjes-universiteit",
      "poortjes-stadswaag",
      "poortjes-academie",
      "poortjes-falconplein",
      "poortjes-adriaan-brouwerstraat",
      "poortjes-mas",
      "poortjes-red-star-line",
    ].map((id) => ids.indexOf(id));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(order.every((index) => index >= 0)).toBe(true);
    expect(ids.at(-1)).toBe("poortjes-red-star-line");
  });

  test("only the Rodestraat detour and the Red Star Line are optional", () => {
    expect(locations.filter((location) => location.isBonus).map((location) => location.id)).toEqual([
      "poortjes-rodestraat",
      "poortjes-red-star-line",
    ]);
  });

  test("every stop is in Antwerp's centre, with a route that starts and ends near its stops", () => {
    for (const location of locations) {
      expect(location.coordinates!.latitude).toBeGreaterThan(51.21);
      expect(location.coordinates!.latitude).toBeLessThan(51.235);
      expect(location.coordinates!.longitude).toBeGreaterThan(4.39);
      expect(location.coordinates!.longitude).toBeLessThan(4.42);
    }
    for (const leg of walk.routeLegs ?? []) {
      const from = locations.find((location) => location.id === leg.fromLocationId)!.coordinates!;
      const to = locations.find((location) => location.id === leg.toLocationId)!.coordinates!;
      expect(distanceInMeters(leg.route.geometry[0], from)).toBeLessThan(80);
      expect(distanceInMeters(leg.route.geometry.at(-1)!, to)).toBeLessThan(80);
    }
  });

  test("has a leg for every consecutive pair, plus a bypass around the Rodestraat", () => {
    locations.slice(1).forEach((location, index) => {
      expect(getRouteLeg(walk, locations[index].id, location.id), location.id).toBeDefined();
    });
    expect(getRouteLeg(walk, "poortjes-universiteit", "poortjes-stadswaag")).toBeDefined();
  });

  test("the detours cost extra distance, shown to the walker", () => {
    const rodestraat = getDetourCost(walk, "poortjes-universiteit", "poortjes-rodestraat");
    expect(rodestraat!.extraMeters).toBeGreaterThan(100);
    const redStarLine = getDetourCost(walk, "poortjes-mas", "poortjes-red-star-line");
    expect(redStarLine!.extraMeters).toBeGreaterThan(300);
  });

  test("the main route is a long day walk of about 10 km", () => {
    expect(walk.distanceInMeters).toBeGreaterThan(8000);
    expect(walk.distanceInMeters).toBeLessThan(12500);
  });
});

describe("Poortjes van Antwerpen: content", () => {
  test("is a guide walk in every language, with five chapters", () => {
    expect(walk.experience).toBe("guide");
    expect(walk.languages).toEqual(locales);
    expect(walk.chapters?.map((chapter) => chapter.firstLocationId)).toEqual([
      "poortjes-rosier",
      "poortjes-grote-markt",
      "poortjes-handelsbeurs",
      "poortjes-falconplein",
      "poortjes-mas",
    ]);
  });

  test("every stop has text, sources and only existing images", () => {
    for (const location of locations) {
      const guide = location.guide!;
      expect(guide.introduction.length, location.id).toBeGreaterThan(0);
      expect(guide.sources.length, location.id).toBeGreaterThan(0);
      const images = [...guide.images, ...(guide.cards ?? []).flatMap((card) => (card.image ? [card.image] : []))];
      for (const image of images) expect(publicFileExists(image.src), image.src).toBe(true);
    }
  });

  test("the two search tasks use drawings of gates at that stop and keep the story until after the task", () => {
    const gildekamers = locations.find((location) => location.id === "poortjes-gildekamersstraat")!.guide!;
    const brouwers = locations.find((location) => location.id === "poortjes-adriaan-brouwerstraat")!.guide!;
    expect(gildekamers.searchTask?.items.map((item) => item.drawing.number)).toEqual([11, 12]);
    expect(gildekamers.searchTask?.hideStoryUntilDone).toBe(true);
    expect(brouwers.searchTask?.items.map((item) => item.drawing.number)).toEqual([47, 48, 49, 50]);
    for (const guide of [gildekamers, brouwers]) {
      for (const item of guide.searchTask!.items) {
        expect(item.hints.length).toBeGreaterThan(0);
        expect(item.solution.length).toBeGreaterThan(0);
      }
    }
  });

  test("practical information says when it was checked", () => {
    for (const location of locations) {
      for (const box of location.guide?.infoBoxes ?? []) {
        if (box.kind === "visit") expect(box.checkedOn, location.id).toBeDefined();
      }
    }
  });

  test("the café pause never makes anything required and treats alcohol-free drinks equally", () => {
    const pauseIn = (locale: "en" | "nl") => {
      const stop = getPoortjesWalk(locale).locations.find((location) => location.id === "poortjes-grote-markt")!;
      return stop.guide!.infoBoxes![0];
    };
    expect(pauseIn("en").kind).toBe("pause");
    expect(pauseIn("en").paragraphs.join(" ")).toMatch(/not an obligation/);
    expect(pauseIn("en").paragraphs.join(" ")).toMatch(/with or without alcohol/);
    expect(pauseIn("nl").paragraphs.join(" ")).toMatch(/geen verplichting/);
    expect(pauseIn("nl").paragraphs.join(" ")).toMatch(/zonder alcohol/);
  });
});
