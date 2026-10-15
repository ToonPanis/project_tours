"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { CatalogEntry } from "@/types/commerce";
import { ALLOWED_VAT_RATES_BASIS_POINTS } from "../config";
import { splitGrossAmount } from "../logic/money";
import { adminErrorMessage, formatEuros, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const fieldClasses =
  "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus:outline-none";

/**
 * One product in /admin/products: name, VAT rate, price per person and whether
 * it's on sale. Each change is a separate request (and a separate line in the
 * audit log); the page reloads its data from the server afterwards.
 */
export function ProductEditor({ entry }: { entry: CatalogEntry }) {
  const { product, currentPrice } = entry;
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [amount, setAmount] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function send(url: string, body: unknown, done: string) {
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const result = await postJson(url, body);
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return false;
    }
    setSuccess(done);
    router.refresh();
    return true;
  }

  const productUrl = `/api/admin/products/${encodeURIComponent(product.id)}`;

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await send(productUrl, { name }, "Name saved.");
  }

  async function savePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await send(`${productUrl}/price`, { amount }, "New price saved. It applies from now on.")) setAmount("");
  }

  const split =
    currentPrice && product.vatRateBasisPoints !== null ? splitGrossAmount(currentPrice.amountCents, product.vatRateBasisPoints) : null;

  return (
    <article className="flex flex-col gap-4 rounded-sm border border-parchment/20 bg-ink/30 p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-semibold text-parchment">{product.name}</h2>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${product.active ? "bg-emerald-800 text-white" : "bg-parchment/15 text-parchment/80"}`}>
          {product.active ? "On sale" : "Not on sale"}
        </span>
      </header>
      <p className="text-sm text-parchment/70">
        Walk: <code>{product.walkSlug}</code> · per person
      </p>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-parchment">
        <dt className="text-parchment/70">Price per person</dt>
        <dd className="font-semibold tabular-nums">{currentPrice ? formatEuros(currentPrice.amountCents) : "none"}</dd>
        <dt className="text-parchment/70">Of which VAT</dt>
        <dd className="tabular-nums">
          {split ? `${formatEuros(split.vatCents)} (net ${formatEuros(split.netCents)})` : "VAT rate not set"}
        </dd>
      </dl>

      <form onSubmit={saveName} className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Name in the catalogue</span>
          <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required className={fieldClasses} />
        </label>
        <Button type="submit" variant="outline" disabled={isBusy || name.trim() === product.name}>
          Save name
        </Button>
      </form>

      <form onSubmit={savePrice} className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">New price per person (€, VAT included)</span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="14,95"
            required
            className={fieldClasses}
          />
        </label>
        <Button type="submit" variant="outline" disabled={isBusy}>
          Set price
        </Button>
      </form>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">VAT rate (ask the accountant)</span>
        <select
          value={product.vatRateBasisPoints ?? ""}
          disabled={isBusy}
          onChange={(event) =>
            send(productUrl, { vatRateBasisPoints: event.target.value === "" ? null : Number(event.target.value) }, "VAT rate saved.")
          }
          className={fieldClasses}
        >
          <option value="">Not set</option>
          {ALLOWED_VAT_RATES_BASIS_POINTS.map((rate) => (
            <option key={rate} value={rate}>
              {`${rate / 100} %`}
            </option>
          ))}
        </select>
      </label>

      <Button
        variant={product.active ? "outline" : "primary"}
        disabled={isBusy}
        onClick={() => send(productUrl, { active: !product.active }, product.active ? "Taken off sale." : "Now on sale.")}
      >
        {product.active ? "Take off sale" : "Put on sale"}
      </Button>

      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />
    </article>
  );
}
