import Link from "next/link";
import { ProductEditor } from "@/features/commerce/admin/ProductEditor";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { listCatalog } from "@/features/commerce/server/catalog-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { getTaxSettings } from "@/features/commerce/server/tax-service";

/** /admin/products: the catalogue. Prices and tax categories change here, without a code change. */
export default async function AdminProductsPage() {
  await requireAdmin();
  const ctx = getCommerceContext();
  const [catalog, tax] = await Promise.all([listCatalog(ctx), getTaxSettings(ctx)]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold text-parchment">Products</h1>
        <p className="text-parchment/80">
          Every product is sold per person; prices include VAT. A new price applies from the moment you save it, and the old one
          stays in the history. A product can only go on sale with a tax category and a price.
        </p>
        {tax.categories.length === 0 && (
          <p className="text-sm text-yellow-300">
            No tax categories yet: create them in{" "}
            <Link href="/admin/tax" className="underline underline-offset-4">
              Tax settings
            </Link>
            .
          </p>
        )}
        <p className="text-sm text-yellow-300">
          Visitors can only buy when sales are opened on the server (COMMERCE_SALES_ENABLED) and the tax settings are confirmed by the
          accountant. Hidden Pubs tickets don&apos;t unlock the game yet (that&apos;s phase P3): keep Hidden Pubs off sale until then.
        </p>
      </div>
      {catalog.map((entry) => (
        <ProductEditor key={entry.product.id} entry={entry} categories={tax.categories} />
      ))}
    </section>
  );
}
