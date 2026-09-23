import { describe, expect, test } from "vitest";
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

  test("getUpcomingWalks returns the announced walks", async () => {
    const upcoming = await repository.getUpcomingWalks();
    expect(upcoming.map((walk) => walk.title)).toEqual([
      "Hidden Pubs",
      "Dark Antwerp",
      "The Rubens Code",
    ]);
  });
});
