import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FakeCheckout } from "@/features/commerce/playtest/FakeCheckout";
import { fakePaymentsAllowed } from "@/features/commerce/server/fake-payment-gateway";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * BROWSER TESTS ONLY: stands in for Stripe's payment page on the test server
 * (COMMERCE_FAKE_PAYMENTS). Doesn't exist anywhere else (404).
 */
export default async function TestCheckoutPage({ searchParams }: PageProps<"/playtest/checkout">) {
  if (!fakePaymentsAllowed()) notFound();
  const { order } = await searchParams;
  if (typeof order !== "string") notFound();
  return (
    <div lang="en" className="bg-night-map min-h-full text-parchment">
      <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10">
        <h1 className="font-display text-4xl font-semibold">Test payment page</h1>
        <FakeCheckout orderId={order} />
      </section>
    </div>
  );
}
