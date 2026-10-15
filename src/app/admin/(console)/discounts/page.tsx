import { DiscountManager } from "@/features/commerce/admin/DiscountManager";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { listDiscounts } from "@/features/commerce/server/discount-service";

/** /admin/discounts: discount codes, checked on the server at checkout only. */
export default async function AdminDiscountsPage() {
  await requireAdmin();
  const ctx = getCommerceContext();
  const [discounts, products] = await Promise.all([listDiscounts(ctx), ctx.store.listProducts()]);
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-4xl font-semibold text-parchment">Discount codes</h1>
      <DiscountManager discounts={discounts} products={products} />
    </section>
  );
}
