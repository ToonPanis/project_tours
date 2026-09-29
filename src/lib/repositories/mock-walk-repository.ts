import { getUpcomingWalks, getWalks } from "@/data/walks";
import type { Locale } from "@/i18n/config";
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
    experience: walk.experience,
    contentStatus: walk.contentStatus,
    // Bonus stops are optional, so they don't count as route stops.
    locationCount: walk.locations.filter((location) => !location.isBonus).length,
  };
}

/** Walk data per language, or one fixed list (e.g. in tests). */
type WalkSource<T> = T[] | ((locale?: Locale) => T[]);

const resolve = <T,>(source: WalkSource<T>, locale?: Locale): T[] =>
  typeof source === "function" ? source(locale) : source;

export class MockWalkRepository implements WalkRepository {
  constructor(
    private readonly walkData: WalkSource<Walk> = getWalks,
    private readonly upcomingWalkData: WalkSource<UpcomingWalk> = getUpcomingWalks,
  ) {}

  async getAllWalks(locale?: Locale): Promise<WalkSummary[]> {
    return resolve(this.walkData, locale).map(toWalkSummary);
  }

  async getWalkBySlug(slug: string, locale?: Locale): Promise<Walk | null> {
    return resolve(this.walkData, locale).find((walk) => walk.slug === slug) ?? null;
  }

  async getUpcomingWalks(locale?: Locale): Promise<UpcomingWalk[]> {
    return resolve(this.upcomingWalkData, locale);
  }
}
