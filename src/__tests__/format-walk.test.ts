import { describe, expect, test } from "vitest";
import {
  formatDifficulty,
  formatDistance,
  formatDuration,
  formatPrice,
} from "@/features/walks/utils/format-walk";

describe("formatPrice", () => {
  test("converts cents to a euro amount", () => {
    const formatted = formatPrice({ amountInCents: 1295, currency: "EUR" });
    expect(formatted).toContain("€");
    expect(formatted).toContain("12");
    expect(formatted).toContain("95");
  });
});

describe("formatDuration", () => {
  test.each([
    [45, "45 min"],
    [120, "2 h"],
    [150, "2 h 30 min"],
  ])("%i minutes → %s", (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});

describe("formatDistance", () => {
  test.each([
    [800, "800 m"],
    [4000, "4 km"],
    [4500, "4.5 km"],
    [4567, "4.6 km"],
  ])("%i meters → %s", (meters, expected) => {
    expect(formatDistance(meters)).toBe(expected);
  });
});

describe("formatDifficulty", () => {
  test("returns a readable label", () => {
    expect(formatDifficulty("challenging")).toBe("Challenging");
  });
});
