import { upcomingWalks, walks } from "@/data/walks";
import type { UpcomingWalk, Walk, WalkSummary } from "@/types/walk";
import type { WalkRepository } from "./walk-repository";

/** Converts a full walk into the lighter summary used in lists. */
export function toWalkSummary(walk: Walk): WalkSummary {
  return {
    id: walk.id,
    slug: walk.slug,
    title: walk.title,
    tagline: walk.tagline,
    shortDescription: walk.shortDescription,
    city: walk.city,
    estimatedDuration: walk.estimatedDuration,
    distanceInMeters: walk.distanceInMeters,
    difficulty: walk.difficulty,
    price: walk.price,
    coverImage: walk.coverImage,
    theme: walk.theme,
    contentStatus: walk.contentStatus,
    // Bonus stops are optional, so they don't count as route stops.
    locationCount: walk.locations.filter((location) => !location.isBonus).length,
  };
}

export class MockWalkRepository implements WalkRepository {
  constructor(
    private readonly walkData: Walk[] = walks,
    private readonly upcomingWalkData: UpcomingWalk[] = upcomingWalks,
  ) {}

  async getAllWalks(): Promise<WalkSummary[]> {
    return this.walkData.map(toWalkSummary);
  }

  async getWalkBySlug(slug: string): Promise<Walk | null> {
    return this.walkData.find((walk) => walk.slug === slug) ?? null;
  }

  async getUpcomingWalks(): Promise<UpcomingWalk[]> {
    return this.upcomingWalkData;
  }
}
