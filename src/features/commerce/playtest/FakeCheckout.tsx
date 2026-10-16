"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * BROWSER TESTS ONLY (English, like the other playtest tools): the "Pay"
 * button of the test payment page. It asks the test server to send the event
 * Stripe would send, then goes to the success page, like Stripe does.
 */
export function FakeCheckout({ orderId }: { orderId: string }) {
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    const response = await fetch("/api/playtest/pay", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ order: orderId }),
    });
    const data = (await response.json().catch(() => ({}))) as { successUrl?: string; error?: string };
    if (response.ok && data.successUrl) window.location.assign(data.successUrl);
    else setError(data.error ?? `http-${response.status}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-parchment/85">This is not Stripe: it only exists on the browser-test server. No money is involved.</p>
      <Button onClick={pay} fullWidth>
        Pay (test)
      </Button>
      <p role="status" className={error ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3" : "sr-only"}>
        {error ?? ""}
      </p>
    </div>
  );
}
