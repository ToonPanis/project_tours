import Link from "next/link";
import { REVIEWS_PAGE_SIZE, REVIEW_REWARD } from "@/features/commerce/config";
import { ReviewModeration } from "@/features/commerce/admin/ReviewModeration";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { listReviewsPage, reviewSummary } from "@/features/commerce/server/review-service";

const STATUSES = [null, "pending", "approved", "rejected"] as const;

/** /admin/reviews: verified reviews (one per ticket), moderated before anything is shown. */
export default async function AdminReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  await requireAdmin();
  const query = await searchParams;
  const ctx = getCommerceContext();
  const [page, summary, products] = await Promise.all([
    listReviewsPage(ctx, Number(query.page ?? "1"), REVIEWS_PAGE_SIZE, query.status ?? "pending"),
    reviewSummary(ctx),
    ctx.store.listProducts(),
  ]);
  const productName = (id: string) => products.find((product) => product.id === id)?.name ?? id;
  const link = (status: string | null, pageNumber = 1) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    else params.set("status", "all");
    if (pageNumber > 1) params.set("page", String(pageNumber));
    return `/admin/reviews?${params}`;
  };

  return (
    <section className="flex flex-col gap-4 text-parchment">
      <h1 className="font-display text-4xl font-semibold">Reviews</h1>
      <p className="text-parchment/80">
        {`${summary.approved} approved${summary.average === null ? "" : `, average ${summary.average.toFixed(1)} / 5`} · ${summary.pending} waiting. Only customers with a ticket can write one (link in the follow-up email), one per ticket. ${REVIEW_REWARD.enabled ? `Every review earns a ${REVIEW_REWARD.percent} % code, whatever the rating; if reviews are shown later, rewarded ones must be marked as such.` : "No reward is given."} Nothing is shown on the site yet.`}
      </p>
      <nav aria-label="Filter by status" className="flex flex-wrap gap-3 text-sm">
        {STATUSES.map((value) => (
          <Link key={value ?? "all"} href={link(value)} className={page.status === value ? "font-semibold text-gold" : "underline underline-offset-4"}>
            {value ?? "all"}
          </Link>
        ))}
      </nav>
      <p className="text-sm text-parchment/70">{`${page.total} reviews · page ${page.page} of ${page.pageCount}`}</p>
      {page.reviews.length === 0 && <p className="text-parchment/70">No reviews here.</p>}
      {page.reviews.map((review) => (
        <ReviewModeration key={review.id} review={review} productName={productName(review.productId)} />
      ))}
      {page.pageCount > 1 && (
        <nav aria-label="Pages" className="flex gap-4">
          {page.page > 1 && (
            <Link href={link(page.status, page.page - 1)} className="underline underline-offset-4">
              Previous
            </Link>
          )}
          {page.page < page.pageCount && (
            <Link href={link(page.status, page.page + 1)} className="underline underline-offset-4">
              Next
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
