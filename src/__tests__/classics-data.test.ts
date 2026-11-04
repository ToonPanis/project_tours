import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { classicsOfAntwerpWalk, getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import localImagesFile from "@/data/walks/classics-of-antwerp/local-images.json";
import { locales } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import { getReadingMinutes } from "@/features/guide/logic/reading-time";
import { getOrderedLocations } from "@/lib/walk-locations";

const locations = getOrderedLocations(classicsOfAntwerpWalk);
const t = createTranslator("en");
/** The few images that don't come from the Commons script (see local-images.json). */
const localImages = new Map(localImagesFile.images.map((image) => [image.id, image]));

describe("Classics of Antwerp: route", () => {
  test("has the 20 stops in the agreed order", () => {
    expect(locations.map((location) => location.id)).toEqual([
      "classics-central-station",
      "classics-diamond-district",
      "classics-keyserlei-meir",
      "classics-stadsfeestzaal",
      "classics-paleis-op-de-meir",
      "classics-rubenshuis",
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

  test("is a guide walk: every stop has its page", () => {
    expect(classicsOfAntwerpWalk.experience).toBe("guide");
    for (const location of locations) expect(location.guide).toBeDefined();
  });

  test("every stop is in central Antwerp and has a walking route from the previous stop", () => {
    for (const location of locations) {
      expect(location.coordinates!.latitude).toBeGreaterThan(51.2);
      expect(location.coordinates!.latitude).toBeLessThan(51.23);
    }
    expect(classicsOfAntwerpWalk.routeLegs).toHaveLength(19);
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

    test("has an introduction, a story (on the page or in its slides) and 'Did you know?' facts", () => {
      const cards = guide.cards ?? [];
      expect(guide.introduction.length).toBeGreaterThan(0);
      expect(guide.sections.length + cards.flatMap((card) => card.sections).length).toBeGreaterThan(0);
      expect(guide.didYouKnow.length + cards.flatMap((card) => card.didYouKnow ?? []).length).toBeGreaterThanOrEqual(1);
      expect(guide.didYouKnow.length).toBeLessThanOrEqual(3);
      for (const card of cards) expect(card.didYouKnow?.length ?? 0).toBeLessThanOrEqual(3);
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
      const images = [
        ...guide.images,
        ...(guide.thenNow ? [guide.thenNow.then, guide.thenNow.now] : []),
        // Slides and optional stories carry images too.
        ...[...(guide.cards ?? []), ...(guide.moreStories ?? [])].flatMap((card) => [
          ...(card.image ? [card.image] : []),
          ...(card.images ?? []),
        ]),
        // And image galleries.
        ...(guide.galleries ?? []).flatMap((gallery) => gallery.images),
      ];
      for (const image of images) {
        expect(existsSync(join(process.cwd(), "public", image.src))).toBe(true);
        expect(image.caption.length).toBeGreaterThan(10);
        expect(image.alt.length).toBeGreaterThan(10);
        const local = localImages.get(image.id);
        if (local && !local.rightsCleared) {
          // Rights unknown: the credit must say so (and the image be cleared before a public launch).
          expect(image.license).toBe(t("guide.rightsToVerify"));
          continue;
        }
        expect(image.license).toMatch(/^(public domain|cc0|cc by(-sa)? \d)/i);
        expect(image.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
        // Historical images from the Commons script must be public domain or CC0. A hand-added
        // historical image may carry the CC license its archive published it under.
        if (image.isHistorical && !local) expect(image.license).toMatch(/^(public domain|cc0)/i);
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

describe("slides and optional stories", () => {
  const stop = (id: string) => locations.find((location) => location.id === id)!.guide!;

  test("the Rubens House is its own stop, between Spooky's quest on the Meir and the Handelsbeurs", () => {
    const ids = locations.map((location) => location.id);
    expect(ids.indexOf("classics-rubenshuis")).toBe(ids.indexOf("classics-paleis-op-de-meir") + 1);
    expect(ids.indexOf("classics-handelsbeurs")).toBe(ids.indexOf("classics-rubenshuis") + 1);
    expect(stop("classics-rubenshuis").images.length).toBeGreaterThanOrEqual(2);
    // Practical info always says when it was checked, and where.
    for (const box of stop("classics-rubenshuis").infoBoxes ?? []) {
      expect(box.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(box.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  test("the cathedral stop has three separate slides: cathedral, Quinten Matsijs, Nello & Patrasche", () => {
    const cards = stop("classics-cathedral").cards ?? [];
    expect(cards.map((card) => card.id)).toEqual(["cathedral", "quinten-matsijs", "nello-patrasche"]);
    for (const card of cards) expect(card.image).toBeDefined();
  });

  test("Nello & Patrasche is labelled as fiction, the smith story of Matsijs as legend", () => {
    const cards = stop("classics-cathedral").cards ?? [];
    const nello = cards.find((card) => card.id === "nello-patrasche")!;
    const matsijs = cards.find((card) => card.id === "quinten-matsijs")!;
    expect(nello.sections.some((section) => section.kind === "fiction")).toBe(true);
    expect(matsijs.sections.some((section) => section.kind === "legend")).toBe(true);
    expect(matsijs.sections.some((section) => section.kind === "history")).toBe(true);
  });

  test("the Jewish community is an optional story at the diamond district, not part of the main text", () => {
    const diamonds = stop("classics-diamond-district");
    expect(diamonds.moreStories?.map((story) => story.id)).toEqual(["jewish-community"]);
    expect(diamonds.moreStories?.[0].sections.length).toBeGreaterThan(0);
  });

  test("the Jewish community story shows its images next to the text they belong to", () => {
    const story = stop("classics-diamond-district").moreStories![0];
    // The 1941 expulsion card opens the story; the Dossin courtyard follows the section that ends with the deportations.
    expect(story.image?.id).toBe("flatow-expulsion-card-1941");
    expect(story.images?.map((image) => image.id)).toEqual(["dossin-courtyard-1942"]);
    expect(story.sections[0].paragraphs.at(-1)).toMatch(/Dossin/);
    // The document images belong to the optional story, not to the main stop.
    expect(stop("classics-diamond-district").images.map((image) => image.id)).not.toContain("flatow-expulsion-card-1941");
  });
});

describe("Keyserlei and Spooky's quest on the Meir", () => {
  const stop = (id: string) => locations.find((location) => location.id === id)!;

  test("the photo of the ruined Cinema Rex comes straight after the story of the V-2 strike", () => {
    const keyserlei = stop("classics-keyserlei-meir").guide!;
    // The stop page puts images[1] right after the first section (images[0] is the photo at the top).
    expect(keyserlei.images[1].id).toBe("rex-ruins");
    expect(keyserlei.sections[0].paragraphs.join(" ")).toMatch(/Cinema Rex/);
    expect(keyserlei.images[1].alt.length).toBeGreaterThan(10);
  });

  test("the palace is a quest stop between the Stadsfeestzaal and the Rubens House", () => {
    const ids = locations.map((location) => location.id);
    const index = ids.indexOf("classics-paleis-op-de-meir");
    expect(ids[index - 1]).toBe("classics-stadsfeestzaal");
    expect(ids[index + 1]).toBe("classics-rubenshuis");
    const { quest, guide } = stop("classics-paleis-op-de-meir");
    expect(quest?.type).toBe("location");
    expect(quest?.type === "location" && quest.searchZone.radiusMeters).toBe(100);
    expect(quest?.clueImage.src).not.toMatch(/paleis/i);
    // The approved story of the palace is its stop page, shown once it is found.
    expect(guide?.sections.length).toBeGreaterThan(0);
    expect(guide?.didYouKnow.some((fact) => /Napoleon/.test(fact))).toBe(true);
  });

  test.each(locales)("in %s no stop before the quest names the place", (locale) => {
    const stops = getOrderedLocations(getClassicsWalk(locale));
    const index = stops.findIndex((location) => location.quest?.type === "location");
    const quest = stops[index].quest;
    if (quest?.type !== "location") throw new Error("no find-the-place quest");
    const answer = quest.revealedName.toLowerCase();
    for (const earlier of stops.slice(0, index)) {
      expect(JSON.stringify([earlier.name, earlier.description, earlier.guide]).toLowerCase(), earlier.id).not.toContain(answer);
    }
  });
});

describe("Handelsbeurs prints and the Spanish Fury at the City Hall", () => {
  const stop = (id: string) => locations.find((location) => location.id === id)!.guide!;

  test("the Handelsbeurs has a gallery of two old prints, oldest first, next to its unchanged story", () => {
    const beurs = stop("classics-handelsbeurs");
    const [gallery] = beurs.galleries ?? [];
    expect(gallery.images.map((image) => image.id)).toEqual(["handelsbeurs-vandennest", "handelsbeurs-lebrun-liedel"]);
    for (const image of gallery.images) expect(image.license).toMatch(/^(public domain|cc0)/i);
    expect(beurs.sections).toHaveLength(2);
    expect(beurs.images).toHaveLength(3);
  });

  test("the Spanish Fury is told in three slides, the burning City Hall next to the fight at the City Hall", () => {
    const stadhuis = stop("classics-stadhuis");
    const cards = stadhuis.cards ?? [];
    expect(cards.map((card) => card.id)).toEqual(["fury-attack", "fury-city-hall", "fury-city"]);
    expect(cards[1].image?.id).toBe("stadhuis-spanish-fury-hogenberg");
    // Every image of the Spanish Fury is used once, and the main page keeps only its photo of the 1860s.
    const furyImages = cards.flatMap((card) => [card.image!, ...(card.images ?? [])]).map((image) => image.id);
    expect(new Set(furyImages).size).toBe(furyImages.length);
    expect(furyImages).toHaveLength(6); // the six images of the Spanish Fury
    expect(stadhuis.images.map((image) => image.id)).toEqual(["stadhuis-1866"]);
    // The approved story is complete: four paragraphs, and the first section stays on the page.
    expect(cards.flatMap((card) => card.sections.flatMap((section) => section.paragraphs))).toHaveLength(4);
    expect(stadhuis.sections).toHaveLength(1);
  });
});

describe("Vleeshuis postcards and the siege of Antwerp at the Scheldt", () => {
  const stop = (id: string) => locations.find((location) => location.id === id)!.guide!;

  test("the Vleeshuis gets a gallery of three postcards, next to its unchanged story and photo", () => {
    const vleeshuis = stop("classics-vleeshuis");
    expect(vleeshuis.galleries?.map((gallery) => gallery.images.length)).toEqual([3]);
    expect(vleeshuis.images.map((image) => image.id)).toEqual(["vleeshuis-1901"]);
    expect(vleeshuis.sections).toHaveLength(1);
  });

  test("the Scheldt shows the siege in date order: bridge, attack on the bridge, Kouwenstein dike", () => {
    const scheldt = stop("classics-scheldt");
    const [siege] = scheldt.galleries ?? [];
    expect(siege.images.map((image) => image.id)).toEqual(["siege-parma-bridge", "siege-bridge-attack", "siege-map-luyken"]);
    // The gallery follows the section that tells of the fall of 1585 (the last one), and the stop keeps its photos.
    expect(scheldt.sections.at(-1)!.paragraphs.join(" ")).toMatch(/1585/);
    expect(scheldt.images.map((image) => image.id)).toEqual(["scheldt-photochrom", "scheldt-quays-1900"]);
    // The siege facts in the captions come with a source.
    expect(scheldt.sources.some((source) => /Beleg_van_Antwerpen/.test(source.url ?? ""))).toBe(true);
  });
});

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
