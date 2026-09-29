import type { Locale } from "@/i18n/config";
import type { UpcomingWalk, Walk, WalkSummary } from "@/types/walk";

/**
 * The contract every walk data source must fulfil.
 *
 * Pages only talk to this interface, never to the data directly. To switch
 * from mock data to a database (e.g. Supabase), write a new class that
 * implements this interface and export it from `./index.ts`.
 *
 * Every method takes the visitor's language: texts come back in that language
 * (English where a translation is missing); ids, coordinates, addresses,
 * images and answers are the same in every language.
 *
 * Methods are async even for mock data, so pages don't change when real
 * network/database calls are introduced.
 */
export interface WalkRepository {
  getAllWalks(locale?: Locale): Promise<WalkSummary[]>;
  getWalkBySlug(slug: string, locale?: Locale): Promise<Walk | null>;
  getUpcomingWalks(locale?: Locale): Promise<UpcomingWalk[]>;
}
