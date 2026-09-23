import type { UpcomingWalk, Walk, WalkSummary } from "@/types/walk";

/**
 * The contract every walk data source must fulfil.
 *
 * Pages only talk to this interface, never to the data directly. To switch
 * from mock data to a database (e.g. Supabase), write a new class that
 * implements this interface and export it from `./index.ts`.
 *
 * Methods are async even for mock data, so pages don't change when real
 * network/database calls are introduced.
 */
export interface WalkRepository {
  getAllWalks(): Promise<WalkSummary[]>;
  getWalkBySlug(slug: string): Promise<Walk | null>;
  getUpcomingWalks(): Promise<UpcomingWalk[]>;
}
