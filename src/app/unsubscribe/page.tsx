import type { Metadata } from "next";
import { UnsubscribeButton } from "@/features/commerce/components/UnsubscribeButton";
import { getTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("feedback.meta.unsubscribeTitle"), robots: { index: false, follow: false } };
}

/** /unsubscribe#<token>: the way out of follow-up emails (P8, brief 7.5). Purchase emails keep coming. */
export default async function UnsubscribePage() {
  const t = await getTranslator();
  return (
    <div className="bg-night-map min-h-full text-parchment">
      <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10">
        <h1 className="font-display text-4xl font-semibold">{t("feedback.unsubscribe.title")}</h1>
        <p className="text-parchment/85">{t("feedback.unsubscribe.intro")}</p>
        <UnsubscribeButton />
      </section>
    </div>
  );
}
