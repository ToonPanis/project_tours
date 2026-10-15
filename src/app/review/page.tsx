import type { Metadata } from "next";
import { ReviewForm } from "@/features/commerce/components/ReviewForm";
import { getTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("feedback.meta.reviewTitle"), robots: { index: false, follow: false } };
}

/** /review#<token>: the review form behind the link in the follow-up email (P8). */
export default async function ReviewPage() {
  const t = await getTranslator();
  return (
    <div className="bg-night-map min-h-full text-parchment">
      <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10">
        <h1 className="font-display text-4xl font-semibold">{t("feedback.review.title")}</h1>
        <p className="text-parchment/85">{t("feedback.review.intro")}</p>
        <ReviewForm />
      </section>
    </div>
  );
}
