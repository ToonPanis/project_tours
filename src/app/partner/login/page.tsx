import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PartnerLoginForm } from "@/features/commerce/partner/PartnerLoginForm";
import { getCurrentPartner } from "@/features/commerce/server/partner-access";
import { getTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("partner.meta.loginTitle") };
}

/** /partner/login: ask for a sign-in link. Already signed in → the portal. */
export default async function PartnerLoginPage() {
  if (await getCurrentPartner()) redirect("/partner");
  const t = await getTranslator();
  return (
    <section className="flex flex-col gap-4 text-parchment">
      <h1 className="font-display text-4xl font-semibold">{t("partner.login.title")}</h1>
      <p className="text-parchment/80">{t("partner.login.intro")}</p>
      <PartnerLoginForm />
      <p className="text-sm text-parchment/70">{t("partner.login.noAccess")}</p>
    </section>
  );
}
