import type { Metadata } from "next";
import { getTranslator } from "@/i18n/server";

/**
 * Everything under /partner (P7): never in search results. No access check
 * here: a layout isn't re-run when navigating, so every portal page checks
 * for itself (requirePartner).
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("partner.meta.title"), robots: { index: false, follow: false } };
}

export default function PartnerLayout({ children }: LayoutProps<"/partner">) {
  return <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">{children}</div>;
}
