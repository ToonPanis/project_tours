"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Discount, Product } from "@/types/commerce";
import { adminErrorMessage, formatEuros, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";
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
  // P8: one shared code, or a batch of unique single-use codes.
  const [mode, setMode] = useState<"shared" | "unique">("shared");
  const [count, setCount] = useState("50");
  const [createdCodes, setCreatedCodes] = useState<string[] | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setSuccess(null);
    setCreatedCodes(null);
    if (mode === "unique") {
      const batch = await postJson<{ batchId: string; codes: string[] }>("/api/admin/discounts/batch", { code, kind, value, productIds, validFrom, validUntil, count });
      setIsBusy(false);
      if (!batch.ok) {
        setError(adminErrorMessage(batch.error));
        return;
      }
      setSuccess(`${batch.data.codes.length} unique codes created. Copy them now: they're listed below once.`);
      setCreatedCodes(batch.data.codes);
      setCode("");
      router.refresh();
      return;
    }
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
  // Batch and review codes are many: shown as one summary line each, not one line per code.
  const shared = discounts.filter((discount) => !discount.source || discount.source === "admin");
  const batches = new Map<string, Discount[]>();
  for (const discount of discounts.filter((candidate) => candidate.source === "batch")) {
    const key = discount.batchId ?? "?";
    batches.set(key, [...(batches.get(key) ?? []), discount]);
  }
  const rewards = discounts.filter((discount) => discount.source === "review");

  return (
    <div className="flex flex-col gap-8 text-parchment">
      <form onSubmit={create} className="flex flex-col gap-4 rounded-sm border border-parchment/20 p-4">
        <h2 className="font-display text-2xl font-semibold">New code</h2>
        <fieldset className="flex flex-wrap gap-4">
          <legend className={labelText}>What to make</legend>
          <label className="flex min-h-11 items-center gap-2">
            <input type="radio" name="mode" checked={mode === "shared"} onChange={() => setMode("shared")} /> One code (shared)
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input type="radio" name="mode" checked={mode === "unique"} onChange={() => setMode("unique")} /> Unique codes, one use each
          </label>
        </fieldset>
        {mode === "unique" && (
          <label className="flex max-w-48 flex-col gap-1">
            <span className={labelText}>How many (1–500)</span>
            <input value={count} onChange={(event) => setCount(event.target.value)} inputMode="numeric" required className={field} />
          </label>
        )}
        <label className="flex flex-col gap-1">
          <span className={labelText}>{mode === "unique" ? "Prefix (each code gets its own random part)" : "Code"}</span>
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
          {mode === "shared" && (
            <label className="flex flex-col gap-1">
              <span className={labelText}>Max. uses</span>
              <input value={maxRedemptions} onChange={(event) => setMaxRedemptions(event.target.value)} inputMode="numeric" className={field} />
            </label>
          )}
        </div>
        <Button type="submit" disabled={isBusy}>
          {mode === "unique" ? "Create unique codes" : "Create code"}
        </Button>
        <AdminStatus tone="error" message={error} />
        <AdminStatus tone="success" message={success} />
        {createdCodes && (
          <label className="flex flex-col gap-1">
            <span className={labelText}>The new codes (one per line)</span>
            <textarea readOnly value={createdCodes.join("\n")} rows={Math.min(12, createdCodes.length)} className={`${field} py-2 font-mono`} />
          </label>
        )}
      </form>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">Codes</h2>
        {shared.length === 0 && <p className="text-parchment/70">No codes yet.</p>}
        {shared.map((discount) => (
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
        {[...batches.values()].map((batch) => {
          const first = batch[0];
          const used = batch.filter((discount) => discount.redemptions > 0).length;
          return (
            <article key={first.batchId ?? first.id} className="rounded-sm border border-parchment/15 p-3">
              <p className="font-semibold">{`Batch ${first.code.replace(/-[^-]+$/, "")}-… · ${batch.length} unique codes · ${first.kind === "percent" ? `${first.value} %` : formatEuros(first.value)} off`}</p>
              <p className="text-sm text-parchment/70">{`${used} used · ${first.validUntil ? `until ${first.validUntil.slice(0, 10)}` : "no end date"}`}</p>
            </article>
          );
        })}
        {rewards.length > 0 && (
          <article className="rounded-sm border border-parchment/15 p-3">
            <p className="font-semibold">{`Review rewards · ${rewards.length} personal codes`}</p>
            <p className="text-sm text-parchment/70">{`${rewards.filter((discount) => discount.redemptions > 0).length} used · ${rewards.filter((discount) => !discount.active).length} switched off (order refunded)`}</p>
          </article>
        )}
      </div>
    </div>
  );
}
