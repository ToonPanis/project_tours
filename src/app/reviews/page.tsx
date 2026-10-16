import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCommerceContext } from "@/features/commerce/server/context";
import { DEMO_REVIEWS, showDemoReviews, type DemoReview } from "@/features/reviews/demo-reviews";
import { loadPublicReviews, parseSort, summarize, type PublicReview } from "@/features/reviews/public-reviews";
import { getTranslator } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import { canonicalUrl } from "@/lib/canonical";
import { walkRepository } from "@/lib/repositories";
import { baseOpenGraph } from "@/lib/shared-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const canonical = canonicalUrl("/reviews");
  return {
    title: t("pages.reviews.meta.title"),
    description: t("pages.reviews.meta.description"),
    alternates: canonical ? { canonical } : undefined,
    openGraph: { ...baseOpenGraph(t.locale), title: t("pages.reviews.meta.title"), description: t("pages.reviews.meta.description"), url: canonical },
  };
}

function Stars({ rating, t }: { rating: number; t: Translator }) {
  return (
    <span className="text-lg tracking-wider">
      <span aria-hidden="true" className="text-gold">
        {"★".repeat(rating)}
      </span>
      <span aria-hidden="true" className="text-parchment/45">
        {"★".repeat(5 - rating)}
      </span>
      <span className="sr-only">{t.plural("pages.reviews.stars", rating)}</span>
    </span>
  );
}

/**
 * /reviews (frontend redesign, brief phase 5). Real reviews come from the
 * existing review system (verified: one per ticket, approved by an admin,
 * published only with the writer's permission). The example reviews are a
 * marked fixture, never counted, and not shown in production (demo-reviews.ts).
 * No review structured data: there is no aggregate to claim yet.
 */
export default async function ReviewsPage({ searchParams }: PageProps<"/reviews">) {
  const t = await getTranslator();
  const sort = parseSort((await searchParams).sort);
  const [reviews, walks] = await Promise.all([loadPublicReviews(getCommerceContext(), sort), walkRepository.getAllWalks(t.locale)]);
  const walkTitle = (slug: string) => walks.find((walk) => walk.slug === slug)?.title ?? null;
  const { average, count } = summarize(reviews ?? []);
  const day = (iso: string) => new Intl.DateTimeFormat(t.locale, { dateStyle: "long", timeZone: "Europe/Brussels" }).format(new Date(iso));
  const demo = showDemoReviews() ? DEMO_REVIEWS : [];

  return (
    <div className="bg-night-map min-h-full text-parchment">
      <section className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6">
        <header className="flex max-w-2xl flex-col gap-4">
          <h1 className="font-display text-5xl font-semibold leading-tight [overflow-wrap:anywhere]">{t("pages.reviews.title")}</h1>
          <p className="text-lg leading-relaxed text-parchment/85">{t("pages.reviews.intro")}</p>
        </header>

        {average !== null && (
          <div className="flex flex-wrap items-center gap-4 rounded-sm border border-gold/30 bg-ink/40 p-5">
            <p className="font-display text-4xl font-semibold text-gold">{t("pages.reviews.average", { rating: average.toLocaleString(t.locale, { maximumFractionDigits: 1 }) })}</p>
            <p className="text-parchment/85">{t.plural("pages.reviews.count", count)}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {reviews && reviews.length > 0 && (
            <form method="get" className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("pages.reviews.sort.label")}</span>
                <select name="sort" defaultValue={sort} className="min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment">
                  <option value="newest">{t("pages.reviews.sort.newest")}</option>
                  <option value="highest">{t("pages.reviews.sort.highest")}</option>
                  <option value="lowest">{t("pages.reviews.sort.lowest")}</option>
                </select>
              </label>
              <button type="submit" className="min-h-11 rounded-sm border border-gold px-4 font-semibold text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
                {t("pages.reviews.sort.apply")}
              </button>
            </form>
          )}
          {reviews === null && <p className="rounded-sm border border-parchment/25 p-4 text-parchment/85">{t("pages.reviews.unavailable")}</p>}
          {reviews !== null && reviews.length === 0 && <p className="rounded-sm border border-parchment/25 p-4 text-parchment/85">{t("pages.reviews.empty")}</p>}
          {reviews && reviews.length > 0 && (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reviews.map((review: PublicReview) => (
                <li key={review.id}>
                  <article className="flex h-full flex-col gap-3 rounded-sm border border-parchment/20 bg-ink/40 p-5">
                    <Stars rating={review.rating} t={t} />
                    {review.text && (
                      <p lang={review.locale} className="whitespace-pre-line leading-relaxed text-parchment/90">
                        {review.text}
                      </p>
                    )}
                    <p className="mt-auto text-sm text-parchment/80">
                      {[review.displayName ?? t("pages.reviews.anonymous"), walkTitle(review.walkSlug), day(review.createdAt)].filter(Boolean).join(" · ")}
                    </p>
                    {review.incentivised && <p className="text-xs text-parchment/75">{t("pages.reviews.rewarded")}</p>}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>

        <section aria-labelledby="leave-heading" className="flex flex-col items-start gap-3 rounded-sm border border-parchment/20 p-5">
          <h2 id="leave-heading" className="font-display text-2xl font-semibold">
            {t("pages.reviews.leave.title")}
          </h2>
          <p className="max-w-2xl text-parchment/85">{t("pages.reviews.leave.text")}</p>
          <ButtonLink href="/walks" variant="outline">
            {t("pages.reviews.leave.walks")}
          </ButtonLink>
        </section>

        {demo.length > 0 && (
          <section aria-labelledby="demo-heading" className="flex flex-col gap-4 border-t border-dashed border-parchment/30 pt-8">
            <h2 id="demo-heading" className="font-display text-2xl font-semibold">
              {t("pages.reviews.demo.title")}
            </h2>
            <p className="text-parchment/85">{t("pages.reviews.demo.note")}</p>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {demo.map((review: DemoReview) => (
                <li key={review.id}>
                  <article className="flex h-full flex-col gap-3 rounded-sm border border-dashed border-parchment/35 p-5">
                    <p className="self-start rounded-sm border border-yellow-300/60 px-2 py-0.5 text-xs font-semibold uppercase text-yellow-200">{t("pages.reviews.demo.badge")}</p>
                    <Stars rating={review.rating} t={t} />
                    <p lang="en" className="leading-relaxed text-parchment/90">
                      {review.text}
                    </p>
                    <p className="mt-auto text-sm text-parchment/80">
                      {[review.name, "slug" in review.walk ? walkTitle(review.walk.slug) : review.walk.label].filter(Boolean).join(" · ")}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </div>
  );
}
