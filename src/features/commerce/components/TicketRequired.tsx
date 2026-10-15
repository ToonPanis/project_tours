import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Translator } from "@/i18n/translate";

/**
 * Shown on /walks/[slug]/play instead of the walk when sales are open, the
 * walk is on sale and this phone has no ticket for it (a Server Component:
 * the check happened on the server, nothing of the walk reaches the browser).
 */
export function TicketRequired({ walkSlug, t }: { walkSlug: string; t: Translator }) {
  return (
    <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10 text-parchment">
      <h1 className="font-display text-4xl font-semibold">{t("commerce.paywall.title")}</h1>
      <p className="text-lg text-parchment/90">{t("commerce.paywall.body")}</p>
      <ButtonLink href={`/walks/${walkSlug}#buy`}>{t("commerce.paywall.buy")}</ButtonLink>
    </section>
  );
}
