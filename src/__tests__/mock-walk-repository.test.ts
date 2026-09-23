import { describe, expect, test } from "vitest";
import { the17GatesWalk } from "@/data/walks/the-17-gates";
import { MockWalkRepository } from "@/lib/repositories/mock-walk-repository";

describe("MockWalkRepository", () => {
  const repository = new MockWalkRepository();

  test("getAllWalks returns summaries without locations", async () => {
    const walks = await repository.getAllWalks();
    const gates = walks.find((walk) => walk.slug === "the-17-gates");

    expect(gates).toBeDefined();
    expect(gates?.locationCount).toBe(3);
    expect(gates).not.toHaveProperty("locations");
    expect(gates).not.toHaveProperty("description");
  });

  test("getWalkBySlug returns the full walk", async () => {
    const walk = await repository.getWalkBySlug("the-17-gates");

    expect(walk?.title).toBe("The 17 Gates");
    expect(walk?.locations).toHaveLength(3);
  });

  test("getWalkBySlug returns null for an unknown slug", async () => {
    expect(await repository.getWalkBySlug("does-not-exist")).toBeNull();
  });

  test("Hidden Pubs is a playable walk, not an upcoming one", async () => {
    const walks = await repository.getAllWalks();
    const upcoming = await repository.getUpcomingWalks();

    expect(walks.map((walk) => walk.slug)).toContain("hidden-pubs");
    expect(upcoming.map((walk) => walk.slug)).not.toContain("hidden-pubs");
  });

  test("locationCount does not include bonus stops", async () => {
    const bonusLocation = { ...the17GatesWalk.locations[0], id: "bonus", isBonus: true };
    const walkWithBonus = {
      ...the17GatesWalk,
      locations: [...the17GatesWalk.locations, bonusLocation],
    };

    const [summary] = await new MockWalkRepository([walkWithBonus]).getAllWalks();
    expect(summary.locationCount).toBe(3);
  });

  test("getUpcomingWalks returns the announced walks", async () => {
    const upcoming = await repository.getUpcomingWalks();
    expect(upcoming.map((walk) => walk.title)).toEqual([
      "Dark Antwerp",
      "The Rubens Code",
    ]);
  });
});
