import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, test } from "vitest";
import { pubGameAnswerKey } from "@/data/walks/hidden-pubs/game/answers.server";
import { pubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";

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

  test("only the answers still to come from the owner are missing (D23)", () => {
    // When the owner sends an answer, add it to answers.server.ts and remove it here.
    const missing = questions.map((question) => question.id).filter((id) => !(id in pubGameAnswerKey));
    expect(missing).toEqual([
      "pubs-barok-baroque",
      "pubs-quinten-matsijs-profession",
      "pubs-quinten-matsijs-game",
      "pubs-boer-van-tienen-special",
    ]);
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

describe("the answers stay on the server", () => {
  /** Every .ts/.tsx file under src/, except the tests. */
  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sourceFiles(path);
      return /\.tsx?$/.test(name) ? [path] : [];
    });
  }

  test("only src/features/pub-game/server/ imports answers.server", () => {
    const root = join(process.cwd(), "src");
    const importers = sourceFiles(root)
      .filter((file) => /from\s+["'][^"']*answers\.server["']/.test(readFileSync(file, "utf8")))
      .map((file) => relative(root, file).replaceAll("\\", "/"))
      .filter((file) => file !== "data/walks/hidden-pubs/game/answers.server.ts");
    expect(importers.length).toBeGreaterThan(0);
    expect(importers.filter((file) => !file.startsWith("features/pub-game/server/"))).toEqual([]);
  });

  test("browser code never imports the server folder (not even types)", () => {
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
