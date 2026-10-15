import { ProductEditor } from "@/features/commerce/admin/ProductEditor";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { listCatalog } from "@/features/commerce/server/catalog-service";
import { getCommerceContext } from "@/features/commerce/server/context";

/** /admin/products: the catalogue. Prices and VAT rates change here, without a code change. */
export default async function AdminProductsPage() {
  await requireAdmin();
  const catalog = await listCatalog(getCommerceContext());

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold text-parchment">Products</h1>
        <p className="text-parchment/80">
          Every product is sold per person; prices include VAT. A new price applies from the moment you save it, and the old one
          stays in the history. A product can only go on sale with a VAT rate and a price.
        </p>
        <p className="text-sm text-yellow-300">
          Payments don&apos;t exist yet (phase P2): &quot;on sale&quot; has no effect for visitors until then.
        </p>
      </div>
      {catalog.map((entry) => (
        <ProductEditor key={entry.product.id} entry={entry} />
      ))}
    </section>
  );
}
