import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, test } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameCafes } from "@/data/walks/hidden-pubs/game/cafes";
import coordinatesFile from "@/data/walks/hidden-pubs/game/coordinates.json";
import { playableDefinition, pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { pubGameDrinks } from "@/data/walks/hidden-pubs/game/drinks";
import { cafeDestination, walkBetween } from "@/data/walks/hidden-pubs/game/navigation";
import routesFile from "@/data/walks/hidden-pubs/game/routes.json";
import { requiredLegs } from "@/features/pub-game/logic/route";

const cafes = pubGameDefinition.cafes;
const questions = cafes.flatMap((cafe) => cafe.questions);
const tasks = cafes.flatMap((cafe) => cafe.tasks);
const routeCafeIds = pubGameDefinition.route.flatMap((group) => group.cafeIds);

describe("Hidden Pubs 2.0 café data", () => {
  test("12 cafés, each exactly once in the route groups", () => {
    expect(cafes).toHaveLength(12);
    expect([...routeCafeIds].sort()).toEqual(cafes.map((cafe) => cafe.id).sort());
  });

  test("the route groups follow the concept: 1 | 2–7 shuffled | 8, 9 | 10–11 shuffled | 12", () => {
    const concept = cafes.map((cafe) => cafe.id);
    expect(pubGameDefinition.route).toEqual([
      { cafeIds: [concept[0]], shuffle: false },
      { cafeIds: concept.slice(1, 7), shuffle: true },
      { cafeIds: concept.slice(7, 9), shuffle: false },
      { cafeIds: concept.slice(9, 11), shuffle: true },
      { cafeIds: [concept[11]], shuffle: false },
    ]);
  });

  test("ids are unique; every question is multiple choice with 3 different options", () => {
    const ids = [...cafes.map((cafe) => cafe.id), ...questions.map((q) => q.id), ...tasks.map((task) => task.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of questions) {
      expect(question.optionIds).toHaveLength(3);
      expect(new Set(question.optionIds).size).toBe(3);
    }
  });

  test("every answer in the key is one of its question's options", () => {
    for (const [questionId, optionId] of Object.entries(pubGameAnswerKey)) {
      const question = questions.find((candidate) => candidate.id === questionId);
      expect(question, questionId).toBeDefined();
      expect(question!.optionIds).toContain(optionId);
    }
  });

  test("every question has an answer, unless it is marked pending (waiting for the owner)", () => {
    for (const question of questions) {
      expect(question.id in pubGameAnswerKey, question.id).toBe(!question.pending);
    }
    // All answers are in since 2026-10-14 (D23).
    expect(questions.filter((question) => question.pending)).toEqual([]);
  });

  test("a pending question is left out of the playable game", () => {
    const withPending: typeof pubGameDefinition = {
      ...pubGameDefinition,
      cafes: pubGameDefinition.cafes.map((cafe, index) =>
        index === 0 ? { ...cafe, questions: cafe.questions.map((question) => ({ ...question, pending: true })) } : cafe,
      ),
    };
    expect(playableDefinition(withPending).cafes[0].questions).toEqual([]);
    expect(playableDefinition(withPending).cafes[1]).toEqual(pubGameDefinition.cafes[1]);
  });

  test("evidence tasks: points from the concept; only approved evidence scores", () => {
    expect(tasks.map((task) => [task.id, task.points, task.scoring, task.evidence, task.presentedAs])).toEqual([
      ["pubs-barok-shot", 100, "per-player", "photo", "bonus"],
      ["pubs-de-kat-tap", 200, "per-team", "photo", "bonus"],
      ["pubs-barries-lucie", 100, "per-team", "photo", "pubtask"],
      ["pubs-paters-vaetje-staff", 100, "per-team", "photo", "bonus"],
      ["pubs-boer-van-tienen-rps", 100, "per-team", "photo", "bonus"],
      ["pubs-den-engel-clog", 300, "per-team", "video", "bonus"],
    ]);
  });
});

test("drinks: the concept's three drinks per café; Billie's has the 1–10 beer wheel", () => {
  for (const cafe of cafes) {
    const drinks = pubGameDrinks[cafe.id];
    expect(drinks, cafe.id).toBeDefined();
    if (cafe.id === "pubs-billies") expect(drinks).toEqual({ kind: "wheel", numbers: 10 });
    else expect(drinks.kind === "menu" && drinks.drinks.length, cafe.id).toBe(3);
  }
  // No shots on any menu (the alcohol-free option and "no drink" are added by the screen for every café).
  const all = Object.values(pubGameDrinks).flatMap((drinks) => (drinks.kind === "menu" ? drinks.drinks : []));
  expect(all.filter((name) => /shot|jenever|vodka/i.test(name))).toEqual([]);
});

describe("Hidden Pubs 2.0 positions and walking routes", () => {
  const positioned = new Set(coordinatesFile.locations.map((location) => location.id));

  test("every café has a name, an address and a position", () => {
    for (const cafe of cafes) expect(pubGameCafes[cafe.id]?.name, cafe.id).toBeTruthy();
    expect(cafes.filter((cafe) => !pubGameCafes[cafe.id].address).map((cafe) => cafe.id)).toEqual([]);
    expect(cafes.filter((cafe) => !positioned.has(cafe.id)).map((cafe) => cafe.id)).toEqual([]);
    for (const location of coordinatesFile.locations) {
      expect(location.status).toBe("to-verify");
      // Antwerp city centre.
      expect(location.latitude).toBeGreaterThan(51.2);
      expect(location.latitude).toBeLessThan(51.23);
      expect(location.longitude).toBeGreaterThan(4.38);
      expect(location.longitude).toBeLessThan(4.43);
    }
  });

  test("routes.json has exactly the 49 legs a random route can need", () => {
    const expected = requiredLegs(pubGameDefinition.route)
      .filter(([from, to]) => positioned.has(from) && positioned.has(to))
      .map(([from, to]) => `${from}→${to}`)
      .sort();
    const generated = routesFile.legs.map((leg) => `${leg.fromLocationId}→${leg.toLocationId}`).sort();
    expect(generated).toEqual(expected);
    expect(generated).toHaveLength(49);
  });

  test("navigation: every leg is a real walk", () => {
    for (const [from, to] of requiredLegs(pubGameDefinition.route)) {
      const walk = walkBetween(from, to);
      if (positioned.has(from) && positioned.has(to)) {
        // Quinten Matsijs ↔ De Kat is only ~11 m in the draft positions (on-site check, see FIELD_TEST_CHECKLIST.md).
        expect(walk?.distanceMeters, `${from} → ${to}`).toBeGreaterThan(0);
        expect(walk!.distanceMeters).toBeLessThan(2500);
      } else {
        expect(walk).toBeNull();
      }
    }
    expect(walkBetween(undefined, "pubs-rococo")).toBeNull();
    expect(cafeDestination("pubs-barries", 6)).toMatchObject({ address: "Reyndersstraat 21, 2000 Antwerpen" });
    expect(cafeDestination("pubs-barries", 6).coordinates).not.toBeNull();
    expect(cafeDestination("pubs-den-engel", 12)).toMatchObject({ name: "Den Engel", order: 12 });
  });
});

describe("the answers stay on the server", () => {
  /** Every .ts/.tsx file under src/, except the tests. */
  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sourceFiles(path);
      return /\.tsx?$/.test(name) ? [path] : [];
    });
  }

  // Reads every source file: slow under the full parallel run, so a longer time limit.
  test("only src/features/pub-game/server/ imports the answers and the reveal texts", { timeout: 30_000 }, () => {
    const root = join(process.cwd(), "src");
    const secret = /from\s+["'][^"']*(answers\.server|reveals\/index\.server|game\/reveals\/[a-z]{2})["']/;
    const importers = sourceFiles(root)
      .filter((file) => secret.test(readFileSync(file, "utf8")))
      .map((file) => relative(root, file).replaceAll("\\", "/"))
      // The reveal index imports its own language files.
      .filter((file) => file !== "data/walks/hidden-pubs/game/reveals/index.server.ts");
    expect(importers.length).toBeGreaterThan(0);
    expect(importers.filter((file) => !file.startsWith("features/pub-game/server/"))).toEqual([]);
  });

  test("browser code never imports the server folder (not even types)", { timeout: 30_000 }, () => {
    const root = join(process.cwd(), "src");
    const importsServer = /from\s+["'][^"']*(pub-game\/server|\.\.\/server)\//;
    const clientFiles = sourceFiles(root).filter((file) => {
      const text = readFileSync(file, "utf8");
      const isClient = /^["']use client["']/m.test(text) || /[\\/]pub-game[\\/](client|components)[\\/]/.test(file);
      return isClient && importsServer.test(text);
    });
    expect(clientFiles.map((file) => relative(root, file))).toEqual([]);
  });
});
