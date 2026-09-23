import { describe, expect, test } from "vitest";
import { walks } from "@/data/walks";
import { hasUnverifiedContent } from "@/features/walks/utils/walk-content";

/**
 * Integrity checks that run against EVERY walk in `src/data/walks`.
 * A new walk is checked automatically as soon as it's added to the list.
 */
describe.each(walks.map((walk) => [walk.title, walk] as const))("walk data: %s", (_title, walk) => {
  const locationIds = walk.locations.map((location) => location.id);
  const clueIds = (walk.clues ?? []).map((clue) => clue.id);

  test("has unique location ids and stop numbers", () => {
    expect(new Set(locationIds).size).toBe(locationIds.length);

    const orders = walk.locations.map((location) => location.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  test("every clue is earned at an existing location", () => {
    for (const clue of walk.clues ?? []) {
      expect(locationIds).toContain(clue.sourceLocationId);
    }
  });

  test("every clue a challenge requires exists and is earned at an earlier stop", () => {
    for (const location of walk.locations) {
      for (const clueId of location.challenge?.requiredClueIds ?? []) {
        expect(clueIds).toContain(clueId);

        const clue = walk.clues?.find((candidate) => candidate.id === clueId);
        const source = walk.locations.find((candidate) => candidate.id === clue?.sourceLocationId);
        expect(source?.order).toBeLessThan(location.order);
      }
    }
  });

  test("challenge answers point to valid options", () => {
    for (const location of walk.locations) {
      const challenge = location.challenge;
      if (challenge?.type === "multiple-choice") {
        expect(challenge.correctOptionIndex).toBeLessThan(challenge.options.length);
      }
      if (challenge?.type === "sequence") {
        expect([...challenge.correctOrder].sort()).toEqual(challenge.items.map((_, index) => index));
      }
    }
  });

  test("unverified history is visibly marked", () => {
    for (const location of walk.locations) {
      for (const block of location.content) {
        if (block.kind === "history" && block.verification === "research-needed") {
          expect(block.body).toContain("[Historical research required]");
        }
      }
    }
  });

  test("every drink round has an alcohol-free option", () => {
    // Also enforced by the DrinkRound type, but data will later come from a database.
    for (const location of walk.locations) {
      if (location.drinkRound) {
        expect(location.drinkRound.options.some((option) => !option.alcoholic)).toBe(true);
      }
    }
  });

  test("unverified drinks are visibly marked", () => {
    for (const location of walk.locations) {
      for (const option of location.drinkRound?.options ?? []) {
        if (option.menuVerification === "to-verify") {
          expect(option.name).toMatch(/VERIFY MENU|\(test\)/);
        }
      }
    }
  });

  test("no challenge involves drinking", () => {
    const drinkingWords = /\b(shots?|chug|down (it|your)|drink (fast|quickly)|finish (your|the) (drink|glass|beer)|drinking game)\b/i;
    for (const location of walk.locations) {
      const challenge = location.challenge;
      if (!challenge) continue;
      const texts = [challenge.title, challenge.question, ...challenge.hints];
      for (const text of texts) {
        expect(text).not.toMatch(drinkingWords);
      }
    }
  });

  test("coordinates are either unknown (null) or plausible", () => {
    for (const location of walk.locations) {
      if (location.coordinates) {
        expect(Math.abs(location.coordinates.latitude)).toBeLessThanOrEqual(90);
        expect(Math.abs(location.coordinates.longitude)).toBeLessThanOrEqual(180);
      }
    }
  });

  test("hints are only revealed after wrong answers, so every challenge has a hint list", () => {
    for (const location of walk.locations) {
      if (location.challenge) expect(Array.isArray(location.challenge.hints)).toBe(true);
    }
  });

  test("a walk with unverified history is marked as placeholder", () => {
    if (walk.locations.some(hasUnverifiedContent)) {
      expect(walk.contentStatus).toBe("placeholder");
    }
  });
});

describe("hasUnverifiedContent", () => {
  const baseLocation = walks[0].locations[0];

  test("is true when a history block still needs research", () => {
    expect(
      hasUnverifiedContent({
        ...baseLocation,
        content: [{ kind: "history", verification: "research-needed", body: "…" }],
      }),
    ).toBe(true);
  });

  test("ignores fiction and verified history", () => {
    expect(
      hasUnverifiedContent({
        ...baseLocation,
        content: [
          { kind: "story", body: "Fiction" },
          { kind: "history", verification: "verified", body: "Fact" },
        ],
      }),
    ).toBe(false);
  });
});
