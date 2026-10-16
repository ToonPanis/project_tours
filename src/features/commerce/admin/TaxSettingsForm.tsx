"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { TaxRegime, TaxSettings } from "@/types/commerce";
import { EU_COUNTRIES } from "../config";
import { percentToBasisPoints } from "../logic/tax";
import { adminErrorMessage, postJson } from "./admin-api";
import { AdminStatus } from "./AdminStatus";

const field = "min-h-11 rounded-sm border border-parchment/30 bg-ink/40 px-3 text-parchment focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";
const labelText = "text-xs font-semibold uppercase tracking-wider text-gold";

interface CategoryRow {
  id: string;
  label: string;
  rate: string;
}
interface OssRow {
  country: string;
  categoryId: string;
  rate: string;
}

const percent = (basisPoints: number) => String(basisPoints / 100).replace(".", ",");

/**
 * /admin/tax (decision B8): no VAT rate is built into the code. The admin
 * chooses the regime, the categories and their rates, optional OSS rates per
 * EU country, and confirms that the accountant approved them. Saving makes a
 * new version; changing anything without ticking the confirmation again
 * closes ticket sales until it's confirmed.
 */
export function TaxSettingsForm({ settings }: { settings: TaxSettings }) {
  const router = useRouter();
  const [regime, setRegime] = useState<TaxRegime>(settings.regime);
  const [homeCountry, setHomeCountry] = useState(settings.homeCountry);
  const [categories, setCategories] = useState<CategoryRow[]>(
    settings.categories.map((category) => ({ id: category.id, label: category.label, rate: percent(category.rateBasisPoints) })),
  );
  const [ossEnabled, setOssEnabled] = useState(settings.ossEnabled);
  const [ossRates, setOssRates] = useState<OssRow[]>(
    settings.ossRates.map((rate) => ({ country: rate.country, categoryId: rate.categoryId, rate: percent(rate.rateBasisPoints) })),
  );
  const [exemptionNote, setExemptionNote] = useState(settings.exemptionNote ?? "");
  // Never pre-ticked: confirming is a deliberate act for every saved version.
  const [confirmed, setConfirmed] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateCategory(index: number, changes: Partial<CategoryRow>) {
    setCategories((rows) => rows.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  }
  function updateOss(index: number, changes: Partial<OssRow>) {
    setOssRates((rows) => rows.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const parsedCategories = categories.map((row) => ({ id: row.id.trim(), label: row.label.trim(), rateBasisPoints: percentToBasisPoints(row.rate) }));
    const parsedOss = ossRates.map((row) => ({ country: row.country, categoryId: row.categoryId, rateBasisPoints: percentToBasisPoints(row.rate) }));
    if ([...parsedCategories, ...parsedOss].some((row) => row.rateBasisPoints === null)) {
      setError("Type each rate as a percentage, e.g. 21 or 5,5.");
      return;
    }
    setIsBusy(true);
    const result = await postJson<TaxSettings>("/api/admin/tax", {
      regime,
      homeCountry,
      categories: parsedCategories,
      ossEnabled,
      ossRates: parsedOss,
      exemptionNote,
      confirmedByAccountant: confirmed,
    });
    setIsBusy(false);
    if (!result.ok) {
      setError(adminErrorMessage(result.error));
      return;
    }
    setConfirmed(false);
    setSuccess(
      result.data.confirmedByAccountant
        ? `Saved as version ${result.data.version}, confirmed by the accountant.`
        : `Saved as version ${result.data.version}. Not confirmed: ticket sales stay closed.`,
    );
    router.refresh();
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-6 text-parchment">
      <fieldset className="flex flex-col gap-2">
        <legend className={labelText}>Tax regime</legend>
        {(
          [
            ["not-configured", "Not configured yet (nothing can be sold)"],
            ["exempt", "Exempt: no VAT charged (e.g. small-business exemption)"],
            ["vat-registered", "VAT-registered: VAT per category"],
          ] as const
        ).map(([value, text]) => (
          <label key={value} className="flex min-h-11 items-center gap-3">
            <input type="radio" name="regime" value={value} checked={regime === value} onChange={() => setRegime(value)} />
            {text}
          </label>
        ))}
      </fieldset>

      <label className="flex max-w-40 flex-col gap-1">
        <span className={labelText}>Home country</span>
        <input value={homeCountry} onChange={(event) => setHomeCountry(event.target.value)} maxLength={2} className={`${field} uppercase`} />
      </label>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelText}>Tax categories (rates at home)</legend>
        {categories.map((row, index) => (
          <div key={index} className="grid grid-cols-1 gap-2 rounded-sm border border-parchment/15 p-3 sm:grid-cols-[8rem_1fr_6rem_auto]">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-parchment/70">Id</span>
              <input value={row.id} onChange={(event) => updateCategory(index, { id: event.target.value })} placeholder="experience" className={field} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-parchment/70">Name</span>
              <input value={row.label} onChange={(event) => updateCategory(index, { label: event.target.value })} className={field} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-parchment/70">Rate %</span>
              <input value={row.rate} onChange={(event) => updateCategory(index, { rate: event.target.value })} inputMode="decimal" className={field} />
            </label>
            <button
              type="button"
              onClick={() => setCategories((rows) => rows.filter((_, i) => i !== index))}
              className="min-h-11 self-end text-sm text-parchment/70 underline underline-offset-4"
            >
              Remove
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setCategories((rows) => [...rows, { id: "", label: "", rate: "" }])}>
          Add a category
        </Button>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelText}>One-Stop Shop (OSS)</legend>
        <label className="flex min-h-11 items-center gap-3">
          <input type="checkbox" checked={ossEnabled} onChange={(event) => setOssEnabled(event.target.checked)} />
          Charge the buyer&apos;s EU country&apos;s rate (only if the accountant says OSS applies)
        </label>
        {ossEnabled && (
          <>
            {ossRates.map((row, index) => (
              <div key={index} className="grid grid-cols-1 gap-2 rounded-sm border border-parchment/15 p-3 sm:grid-cols-[7rem_1fr_6rem_auto]">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-parchment/70">Country</span>
                  <select value={row.country} onChange={(event) => updateOss(index, { country: event.target.value })} className={field}>
                    <option value="">–</option>
                    {EU_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-parchment/70">Category</span>
                  <select value={row.categoryId} onChange={(event) => updateOss(index, { categoryId: event.target.value })} className={field}>
                    <option value="">–</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label || category.id}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-parchment/70">Rate %</span>
                  <input value={row.rate} onChange={(event) => updateOss(index, { rate: event.target.value })} inputMode="decimal" className={field} />
                </label>
                <button
                  type="button"
                  onClick={() => setOssRates((rows) => rows.filter((_, i) => i !== index))}
                  className="min-h-11 self-end text-sm text-parchment/70 underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => setOssRates((rows) => [...rows, { country: "", categoryId: "", rate: "" }])}>
              Add an OSS rate
            </Button>
            <p className="text-sm text-parchment/70">Countries without a rate here are charged the home rate.</p>
          </>
        )}
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className={labelText}>Exemption mention on receipts (exempt regime)</span>
        <textarea value={exemptionNote} onChange={(event) => setExemptionNote(event.target.value)} maxLength={300} rows={2} className={`${field} py-2`} />
      </label>

      <label className="flex min-h-11 items-start gap-3 rounded-sm border border-yellow-300/40 p-3">
        <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1" />
        <span>
          The accountant has approved exactly these settings. (Without this, ticket sales stay closed. It must be ticked again with
          every change.)
        </span>
      </label>

      <Button type="submit" disabled={isBusy}>
        Save as a new version
      </Button>
      <AdminStatus tone="error" message={error} />
      <AdminStatus tone="success" message={success} />
    </form>
  );
}
