import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { classicsOfAntwerpWalk } from "@/data/walks/classics-of-antwerp";
import { getReadingMinutes } from "@/features/guide/logic/reading-time";
import { getOrderedLocations } from "@/lib/walk-locations";

const locations = getOrderedLocations(classicsOfAntwerpWalk);

describe("Classics of Antwerp: route", () => {
  test("has the 18 stops in the agreed order", () => {
    expect(locations.map((location) => location.id)).toEqual([
      "classics-central-station",
      "classics-diamond-district",
      "classics-keyserlei-meir",
      "classics-stadsfeestzaal",
      "classics-handelsbeurs",
      "classics-boerentoren",
      "classics-groenplaats",
      "classics-cathedral",
      "classics-vlaeykensgang",
      "classics-grote-markt",
      "classics-brabo",
      "classics-stadhuis",
      "classics-conscienceplein",
      "classics-carolus-borromeus",
      "classics-vleeshuis",
      "classics-sint-paulus",
      "classics-het-steen",
      "classics-scheldt",
    ]);
  });

  test("is a guide walk: no challenges, clues, drinks or finale", () => {
    expect(classicsOfAntwerpWalk.experience).toBe("guide");
    expect(classicsOfAntwerpWalk.clues).toBeUndefined();
    expect(classicsOfAntwerpWalk.finale).toBeUndefined();
    for (const location of locations) {
      expect(location.challenge).toBeUndefined();
      expect(location.drinkRound).toBeUndefined();
    }
  });

  test("every stop is in central Antwerp and has a walking route from the previous stop", () => {
    for (const location of locations) {
      expect(location.coordinates!.latitude).toBeGreaterThan(51.2);
      expect(location.coordinates!.latitude).toBeLessThan(51.23);
    }
    expect(classicsOfAntwerpWalk.routeLegs).toHaveLength(17);
  });

  test("the total distance is shown rounded, between 4 and 8 km", () => {
    expect(classicsOfAntwerpWalk.distanceInMeters).toBeGreaterThan(4000);
    expect(classicsOfAntwerpWalk.distanceInMeters).toBeLessThan(8000);
  });
});

describe.each(locations.map((location) => [location.name, location] as const))(
  "Classics stop: %s",
  (_name, location) => {
    const guide = location.guide!;

    test("has an introduction, a story and 1 to 3 'Did you know?' facts", () => {
      expect(guide.introduction.length).toBeGreaterThan(0);
      expect(guide.sections.length).toBeGreaterThan(0);
      expect(guide.didYouKnow.length).toBeGreaterThanOrEqual(1);
      expect(guide.didYouKnow.length).toBeLessThanOrEqual(3);
    });

    test("lists the sources its history was checked against", () => {
      expect(guide.sources.length).toBeGreaterThan(0);
      for (const source of guide.sources) expect(source.url).toMatch(/^https?:\/\//);
    });

    test("has a readable length (1 to 6 minutes)", () => {
      const minutes = getReadingMinutes(guide);
      expect(minutes).toBeGreaterThanOrEqual(1);
      expect(minutes).toBeLessThanOrEqual(6);
    });

    test("every image exists and carries a reusable license and attribution", () => {
      const images = [...guide.images, ...(guide.thenNow ? [guide.thenNow.then, guide.thenNow.now] : [])];
      for (const image of images) {
        expect(existsSync(join(process.cwd(), "public", image.src))).toBe(true);
        expect(image.license).toMatch(/^(public domain|cc0|cc by(-sa)? \d)/i);
        expect(image.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
        expect(image.caption.length).toBeGreaterThan(10);
        expect(image.alt.length).toBeGreaterThan(10);
        // Historical images must be public domain or CC0.
        if (image.isHistorical) expect(image.license).toMatch(/^(public domain|cc0)/i);
      }
    });

    test("every stop but the last leads on to the next one", () => {
      if (location.id === "classics-scheldt") {
        expect(guide.closing?.finalLines.length).toBeGreaterThan(0);
      } else {
        expect(guide.transitionToNext).toBeTruthy();
      }
    });
  },
);

describe("history vs legend", () => {
  test("the Brabo stop tells the legend AND the historians' view, separately", () => {
    const brabo = locations.find((location) => location.id === "classics-brabo")!.guide!;
    const legend = brabo.sections.find((section) => section.kind === "legend");
    const interpretation = brabo.sections.find((section) => section.kind === "interpretation");
    expect(legend?.paragraphs.join(" ")).toContain("Druon Antigoon");
    expect(interpretation?.paragraphs.join(" ")).toMatch(/uncertain/i);
  });

  test("“hand werpen” only appears inside a legend section", () => {
    for (const location of locations) {
      const guide = location.guide!;
      const nonLegendText = [
        ...guide.introduction,
        ...guide.sections.filter((section) => section.kind !== "legend").flatMap((section) => section.paragraphs),
        ...guide.didYouKnow,
      ].join(" ");
      expect(nonLegendText).not.toMatch(/hand werpen/i);
    }
  });

  test("the diamond polishing wheel is told as tradition, not as fact", () => {
    const diamonds = locations.find((location) => location.id === "classics-diamond-district")!.guide!;
    const scaif = diamonds.sections.find((section) => section.paragraphs.join(" ").includes("scaif"));
    expect(scaif?.kind).toBe("legend");
  });
});
