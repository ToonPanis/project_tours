import type { Review } from "@/types/commerce";
import type { CommerceContext } from "@/features/commerce/server/context";

/**
 * The reviews the public may see (frontend redesign, brief 5.1), read with the
 * EXISTING store method `listReviews` (no new endpoint, no schema change):
 * only reviews an admin APPROVED and whose writer allowed publication
 * (`mayPublish`). Nothing else leaves the server: no email, ticket or order.
 */

export type ReviewSort = "newest" | "highest" | "lowest";

export interface PublicReview {
  id: string;
  rating: number;
  text: string | null;
  displayName: string | null;
  walkSlug: string;
  /** The review earned a discount code (EU rules: must be disclosed). */
  incentivised: boolean;
  createdAt: string;
  locale: string;
}

export function parseSort(value: unknown): ReviewSort {
  return value === "highest" || value === "lowest" ? value : "newest";
}

const MAX_SHOWN = 200;

export function toPublic(reviews: Review[], sort: ReviewSort): PublicReview[] {
  const shown = reviews
    .filter((review) => review.status === "approved" && review.mayPublish)
    .map(
      (review): PublicReview => ({
        id: review.id,
        rating: review.rating,
        text: review.text,
        displayName: review.displayName,
        walkSlug: review.walkSlug,
        incentivised: review.incentivised,
        createdAt: review.createdAt,
        locale: review.locale,
      }),
    );
  shown.sort((a, b) =>
    sort === "highest" ? b.rating - a.rating || b.createdAt.localeCompare(a.createdAt) : sort === "lowest" ? a.rating - b.rating || b.createdAt.localeCompare(a.createdAt) : b.createdAt.localeCompare(a.createdAt),
  );
  return shown.slice(0, MAX_SHOWN);
}

/** Average and count of the reviews shown (real ones only; example reviews never count). */
export function summarize(reviews: PublicReview[]): { average: number | null; count: number } {
  if (reviews.length === 0) return { average: null, count: 0 };
  return { average: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length, count: reviews.length };
}

/** Null when the database can't be reached (the page then says reviews can't be loaded). */
export async function loadPublicReviews(ctx: CommerceContext, sort: ReviewSort): Promise<PublicReview[] | null> {
  try {
    const { reviews } = await ctx.store.listReviews({ skip: 0, limit: 5000, status: "approved" });
    return toPublic(reviews, sort);
  } catch {
    return null;
  }
}
