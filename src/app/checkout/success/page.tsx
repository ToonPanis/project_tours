import { cookies } from "next/headers";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { RefreshWhilePending } from "@/features/commerce/components/RefreshWhilePending";
import { buyerOrderView } from "@/features/commerce/server/checkout-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { BUYER_COOKIE } from "@/features/commerce/server/http";
import { ticketUrl } from "@/features/commerce/server/ticket-service";
import { getTranslator } from "@/i18n/server";

/**
 * /checkout/success?order=<id>: where Stripe sends the buyer after paying.
 * Arriving here proves nothing: the page shows the order's status from our
 * database (only the Stripe webhook makes it "paid"), and only to the browser
 * that started the payment (its buyer cookie). While the webhook hasn't
 * arrived yet, it says so and refreshes itself.
 */
export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const t = await getTranslator();
  const orderId = (await searchParams).order;
  const ctx = getCommerceContext();
  const view =
    typeof orderId === "string"
      ? // A relative link (same site): "/tickets/open#<ticket>".
        await buyerOrderView(ctx, orderId, (await cookies()).get(BUYER_COOKIE)?.value, (grantId) => ticketUrl(ctx, grantId, ""))
      : null;

  let message: string;
  if (!view) message = t("commerce.success.unknown");
  else if (view.status === "paid") message = t("commerce.success.paid");
  else if (view.status === "pending") message = t("commerce.success.pending");
  else if (view.status === "failed") message = t("commerce.success.failed");
  else message = t("commerce.success.canceled");

  return (
    <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10">
      <h1 className="font-display text-4xl font-semibold">{t("commerce.success.title")}</h1>
      <p role="status" className="text-lg">
        {message}
      </p>
      {view?.status === "pending" && <RefreshWhilePending />}

      {view?.status === "paid" && (
        <>
          {view.ticketUrl && <ButtonLink href={view.ticketUrl}>{t("commerce.success.openTicket")}</ButtonLink>}
          <p className="text-parchment/85">{t("commerce.success.share", { seats: t.plural("commerce.persons", view.quantity) })}</p>
          {view.email && <p className="text-parchment/85">{t("commerce.success.emailSent", { email: view.email })}</p>}
          {view.receiptNumber && <p className="text-sm text-parchment/70">{t("commerce.success.receipt", { number: view.receiptNumber })}</p>}
          {view.businessName && <p className="text-sm text-parchment/70">{t("commerce.success.invoiceSoon", { business: view.businessName })}</p>}
        </>
      )}

      <Link href="/walks" className="min-h-11 content-center text-gold underline underline-offset-4">
        {t("commerce.success.backToWalks")}
      </Link>
    </section>
  );
}
