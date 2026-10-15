import { PartnerVerifyLogin } from "@/features/commerce/partner/PartnerVerifyLogin";
import { getTranslator } from "@/i18n/server";

/** /partner/login/verify#<secret>: the link from the sign-in email. */
export default async function PartnerVerifyPage() {
  const t = await getTranslator();
  return (
    <section className="flex flex-col gap-4 text-parchment">
      <h1 className="font-display text-4xl font-semibold">{t("partner.login.verifyTitle")}</h1>
      <p className="text-parchment/80">{t("partner.login.verifyIntro")}</p>
      <PartnerVerifyLogin />
    </section>
  );
}
