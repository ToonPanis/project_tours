import { ButtonLink } from "@/components/ui/ButtonLink";
import { getTranslator } from "@/i18n/server";

/** /checkout/canceled?walk=<slug>: the buyer left Stripe's page without paying. The order expires by itself. */
export default async function CheckoutCanceledPage({ searchParams }: PageProps<"/checkout/canceled">) {
  const t = await getTranslator();
  const walk = (await searchParams).walk;
  // Only a plain slug goes into the link back (never an outside address).
  const backHref = typeof walk === "string" && /^[a-z0-9-]{1,100}$/.test(walk) ? `/walks/${walk}` : "/walks";
  return (
    <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10">
      <h1 className="font-display text-4xl font-semibold">{t("commerce.canceled.title")}</h1>
      <p className="text-lg">{t("commerce.canceled.body")}</p>
      <ButtonLink href={backHref}>{t("commerce.canceled.back")}</ButtonLink>
    </section>
  );
}
