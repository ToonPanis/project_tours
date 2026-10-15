"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Discount, Product } from "@/types/commerce";
import { adminErrorMessage, formatEuros, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus:outline-none";
const labelText = "text-xs font-semibold uppercase tracking-wider text-gold";

/** /admin/discounts: create codes, see how often they were used, switch them off. */
export function DiscountManager({ discounts, products }: { discounts: Discount[]; products: Product[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    const result = await postJson<Discount>("/api/admin/discounts", { code, kind, value, productIds, validFrom, validUntil, maxRedemptions });
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    setSuccess(`Code ${result.data.code} created.`);
    setCode("");
    setValue("");
    router.refresh();
  }

  async function toggle(discount: Discount) {
    const result = await postJson(`/api/admin/discounts/${discount.id}`, { active: !discount.active });
    if (!result.ok) setError(adminErrorMessage(result.error));
    router.refresh();
  }

  const productName = (id: string) => products.find((product) => product.id === id)?.name ?? id;

  return (
    <div className="flex flex-col gap-8 text-parchment">
      <form onSubmit={create} className="flex flex-col gap-4 rounded-sm border border-parchment/20 p-4">
        <h2 className="font-display text-2xl font-semibold">New code</h2>
        <label className="flex flex-col gap-1">
          <span className={labelText}>Code</span>
          <input value={code} onChange={(event) => setCode(event.target.value)} maxLength={30} required className={`${field} uppercase`} />
        </label>
        <fieldset className="flex flex-wrap gap-4">
          <legend className={labelText}>Kind</legend>
          <label className="flex min-h-11 items-center gap-2">
            <input type="radio" name="kind" checked={kind === "percent"} onChange={() => setKind("percent")} /> Percent off
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input type="radio" name="kind" checked={kind === "fixed"} onChange={() => setKind("fixed")} /> Fixed amount off (€)
          </label>
        </fieldset>
        <label className="flex max-w-48 flex-col gap-1">
          <span className={labelText}>{kind === "percent" ? "Percent (1–100)" : "Amount in €"}</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" required className={field} />
        </label>
        <fieldset className="flex flex-col gap-1">
          <legend className={labelText}>Only for (nothing ticked = every product)</legend>
          {products.map((product) => (
            <label key={product.id} className="flex min-h-11 items-center gap-2">
              <input
                type="checkbox"
                checked={productIds.includes(product.id)}
                onChange={(event) =>
                  setProductIds((ids) => (event.target.checked ? [...ids, product.id] : ids.filter((id) => id !== product.id)))
                }
              />
              {product.name}
            </label>
          ))}
        </fieldset>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className={labelText}>Valid from</span>
            <input type="date" value={validFrom} onChange={(event) => setValidFrom(event.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelText}>Valid until</span>
            <input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelText}>Max. uses</span>
            <input value={maxRedemptions} onChange={(event) => setMaxRedemptions(event.target.value)} inputMode="numeric" className={field} />
          </label>
        </div>
        <Button type="submit" disabled={isBusy}>
          Create code
        </Button>
        <AdminStatus tone="error" message={error} />
        <AdminStatus tone="success" message={success} />
      </form>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">Codes</h2>
        {discounts.length === 0 && <p className="text-parchment/70">No codes yet.</p>}
        {discounts.map((discount) => (
          <article key={discount.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-parchment/15 p-3">
            <div>
              <p className="font-semibold">
                <code>{discount.code}</code>
                {` · ${discount.kind === "percent" ? `${discount.value} %` : formatEuros(discount.value)} off`}
                {discount.active ? "" : " · off"}
              </p>
              <p className="text-sm text-parchment/70">
                {`Used ${discount.redemptions}${discount.maxRedemptions ? ` of ${discount.maxRedemptions}` : ""} · `}
                {discount.productIds.length > 0 ? discount.productIds.map(productName).join(", ") : "all products"}
                {discount.validUntil ? ` · until ${discount.validUntil.slice(0, 10)}` : ""}
              </p>
            </div>
            <Button variant="outline" onClick={() => toggle(discount)}>
              {discount.active ? "Switch off" : "Switch on"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
