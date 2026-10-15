"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale, useT } from "@/i18n/client";
import { MAX_PERSONS_PER_ORDER } from "../config";
import { commerceErrorKey, postCommerce } from "./commerce-errors";

interface BuyBoxProps {
  walkSlug: string;
  /** Per person, VAT included, from the catalogue (shown only; the server prices the order again). */
  unitPriceCents: number;
}

/**
 * Buying tickets on a walk's detail page: number of persons, an optional
 * discount code, then Stripe's payment page. The price shown here is only
 * information: the server computes the real amount (and the discount) itself.
 */
export function BuyBox({ walkSlug, unitPriceCents }: BuyBoxProps) {
  const t = useT();
  const locale = useLocale();
  const [quantity, setQuantity] = useState(2);
  const [code, setCode] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const euros = (cents: number) => new Intl.NumberFormat(`${locale}-BE`, { style: "currency", currency: "EUR" }).format(cents / 100);

  async function pay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    const result = await postCommerce<{ url: string }>("/api/checkout", { walkSlug, quantity, discountCode: code.trim(), locale });
    if (result.ok) {
      // Stripe's own page: the card details never touch this site.
      window.location.assign(result.data.url);
      return;
    }
    setIsBusy(false);
    setError(t(commerceErrorKey(result.error)));
  }

  return (
    <form onSubmit={pay} className="flex flex-col gap-4">
      <p>
        <span className="font-display text-3xl font-semibold text-gold">{euros(unitPriceCents)}</span>{" "}
        <span className="text-parchment/80">{t("commerce.buy.perPerson")}</span>
      </p>

      <div className="flex flex-col gap-1">
        <span id={`${walkSlug}-persons`} className="text-xs font-semibold uppercase tracking-wider text-gold">
          {t("commerce.buy.persons")}
        </span>
        <div role="group" aria-labelledby={`${walkSlug}-persons`} className="flex items-center gap-3">
          <button
            type="button"
            aria-label={t("commerce.buy.decrease")}
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="h-12 w-12 rounded-full border border-gold/50 text-2xl font-bold text-gold disabled:opacity-40"
          >
            −
          </button>
          <output aria-live="polite" className="min-w-24 text-center font-display text-2xl font-semibold">
            {t.plural("commerce.persons", quantity)}
          </output>
          <button
            type="button"
            aria-label={t("commerce.buy.increase")}
            disabled={quantity >= MAX_PERSONS_PER_ORDER}
            onClick={() => setQuantity((value) => Math.min(MAX_PERSONS_PER_ORDER, value + 1))}
            className="h-12 w-12 rounded-full border border-gold/50 text-2xl font-bold text-gold disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("commerce.buy.discountCode")}</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          maxLength={30}
          autoComplete="off"
          autoCapitalize="characters"
          className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg uppercase text-parchment focus:border-gold focus:outline-none"
        />
      </label>

      <p className="flex items-baseline justify-between text-lg">
        <span>{t("commerce.buy.total")}</span>
        <span className="font-semibold tabular-nums">{euros(unitPriceCents * quantity)}</span>
      </p>

      <Button type="submit" disabled={isBusy} fullWidth>
        {isBusy ? t("commerce.buy.busy") : t("commerce.buy.button")}
      </Button>
      <p role="status" className={error ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3" : "sr-only"}>
        {error ?? ""}
      </p>
      <p className="text-sm text-parchment/70">{t("commerce.buy.note")}</p>
    </form>
  );
}
