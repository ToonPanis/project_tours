import { TaxSettingsForm } from "@/features/commerce/admin/TaxSettingsForm";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { getTaxSettings } from "@/features/commerce/server/tax-service";
import { taxAllowsSales } from "@/features/commerce/logic/tax";

/** /admin/tax: the configurable VAT (decision B8). Every save is a new version; orders keep a copy of what applied. */
export default async function AdminTaxPage() {
  await requireAdmin();
  const settings = await getTaxSettings(getCommerceContext());
  const open = taxAllowsSales(settings);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold text-parchment">Tax settings</h1>
        <p className="text-parchment/80">
          {settings.version === 0
            ? "Nothing saved yet."
            : `Version ${settings.version}, saved ${new Date(settings.updatedAt).toLocaleString("nl-BE", { timeZone: "Europe/Brussels" })} by ${settings.updatedBy ?? "unknown"}.`}
        </p>
        <p className={open ? "text-emerald-300" : "text-yellow-300"}>
          {open
            ? "Confirmed by the accountant: the tax settings allow ticket sales."
            : "Not confirmed by the accountant (or not configured): ticket sales stay closed."}
        </p>
        <p className="text-sm text-parchment/70">
          Prices in the catalogue include VAT. The VAT in each order is worked out when it&apos;s paid, with these settings and the
          buyer&apos;s country, and kept with the order. How B2B invoices show VAT (e.g. reverse charge) is decided by the invoicing
          provider and the accountant.
        </p>
      </div>
      <TaxSettingsForm settings={settings} />
    </section>
  );
}
