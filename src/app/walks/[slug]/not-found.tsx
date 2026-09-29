import { ButtonLink } from "@/components/ui/ButtonLink";
import { getTranslator } from "@/i18n/server";

export default async function WalkNotFound() {
  const t = await getTranslator();

  return (
    <div className="bg-parchment-texture">
      <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-20 sm:px-6">
        <h1 className="font-display text-4xl font-semibold text-ink">{t("errors.walkNotFound.title")}</h1>
        <p className="text-sepia">{t("errors.walkNotFound.text")}</p>
        <ButtonLink href="/walks" variant="outline-light">
          {t("errors.walkNotFound.seeAll")}
        </ButtonLink>
      </div>
    </div>
  );
}
