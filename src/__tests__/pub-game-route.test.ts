import { describe, expect, test } from "vitest";
import { drawRoute, isValidRoute } from "@/features/pub-game/logic/route";
import { straightRoute, testDefinition } from "./fixtures/pub-game-definition";

const groups = testDefinition.route;
const [start, middle, pair, lateShuffle, finish] = groups.map((group) => group.cafeIds);

describe("random routes", () => {
  test("10,000 routes all follow the rules of the concept", () => {
    const sameCafes = (a: string[], b: string[]) => [...a].sort().join() === [...b].sort().join();
    const broken: string[][] = [];

    for (let run = 0; run < 10_000; run++) {
      const route = drawRoute(groups, Math.random);
      const followsRules =
        route.length === 12 &&
        new Set(route).size === 12 &&
        // Everyone starts at café 1 and ends at café 12.
        route[0] === start[0] &&
        route[11] === finish[0] &&
        // Cafés 2–7 fill places 2–7, in any order.
        sameCafes(route.slice(1, 7), middle) &&
        // Cafés 8 and 9 back to back, in places 8 and 9.
        route.slice(7, 9).join() === pair.join() &&
        // Cafés 10 and 11 fill places 10 and 11.
        sameCafes(route.slice(9, 11), lateShuffle) &&
        isValidRoute(groups, route);
      if (!followsRules) broken.push(route);
    }
    expect(broken).toEqual([]);
  });

  test("the shuffled groups really get different orders", () => {
    const orders = new Set<string>();
    for (let run = 0; run < 5_000; run++) orders.add(drawRoute(groups, Math.random).join(","));
    // 6! × 2 = 1,440 possible routes; 5,000 random draws find about 1,395 of them.
    expect(orders.size).toBeGreaterThan(1_300);
  });

  test("the same random numbers give the same route", () => {
    const fixed = () => 0.42;
    expect(drawRoute(groups, fixed)).toEqual(drawRoute(groups, fixed));
  });
});

describe("refusing a broken route", () => {
  const swap = (route: string[], i: number, j: number) => {
    const copy = [...route];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  };

  test.each([
    ["start moved", swap(straightRoute, 0, 1)],
    ["finish moved", swap(straightRoute, 10, 11)],
    ["cafés 8 and 9 swapped", swap(straightRoute, 7, 8)],
    ["café 7 swapped with café 8", swap(straightRoute, 6, 7)],
    ["a café missing", straightRoute.slice(1)],
    ["a café twice", [...straightRoute.slice(0, 11), straightRoute[1]]],
    ["an unknown café", [...straightRoute.slice(0, 11), "elsewhere"]],
    ["empty", []],
  ])("%s", (_name, route) => {
    expect(isValidRoute(groups, route)).toBe(false);
  });

  test("shuffled groups in another order are fine", () => {
    expect(isValidRoute(groups, swap(swap(straightRoute, 1, 6), 9, 10))).toBe(true);
  });
});
