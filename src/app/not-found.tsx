import { ButtonLink } from "@/components/ui/ButtonLink";
import { getTranslator } from "@/i18n/server";

export default async function NotFound() {
  const t = await getTranslator();

  return (
    <div className="bg-night-map text-parchment">
      <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="font-display text-4xl font-semibold">{t("errors.notFound.title")}</h1>
        <p className="text-parchment/80">{t("errors.notFound.text")}</p>
        <ButtonLink href="/">{t("errors.notFound.back")}</ButtonLink>
      </div>
    </div>
  );
}
