import Link from "next/link";
import { ORDERS_PAGE_SIZE } from "@/features/commerce/config";
import { formatEuros } from "@/features/commerce/admin/admin-api";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { listOrdersPage } from "@/features/commerce/server/order-admin-service";

const STATUSES = ["pending", "paid", "failed", "canceled", "refunded"] as const;
const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Brussels" }).format(new Date(iso));

/** /admin/orders?status=paid&page=2: orders, newest first, paginated on the server. */
export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const query = await searchParams;
  const { orders, total, page, pageCount, status } = await listOrdersPage(getCommerceContext(), Number(query.page ?? "1"), ORDERS_PAGE_SIZE, query.status);
  const link = (changes: { page?: number; status?: string | null }) => {
    const params = new URLSearchParams();
    const nextStatus = changes.status === undefined ? status : changes.status;
    if (nextStatus) params.set("status", nextStatus);
    if (changes.page && changes.page > 1) params.set("page", String(changes.page));
    const text = params.toString();
    return `/admin/orders${text ? `?${text}` : ""}`;
  };

  return (
    <section className="flex flex-col gap-4 text-parchment">
      <h1 className="font-display text-4xl font-semibold">Orders</h1>
      <nav aria-label="Filter by status" className="flex flex-wrap gap-3 text-sm">
        <Link href={link({ status: null })} className={!status ? "font-semibold text-gold" : "underline underline-offset-4"}>
          All
        </Link>
        {STATUSES.map((value) => (
          <Link key={value} href={link({ status: value })} className={status === value ? "font-semibold text-gold" : "underline underline-offset-4"}>
            {value}
          </Link>
        ))}
      </nav>
      <p className="text-parchment/70">{`${total} orders · page ${page} of ${pageCount}`}</p>

      <ul className="flex flex-col gap-2">
        {orders.map((order) => (
          <li key={order.id}>
            <Link href={`/admin/orders/${order.id}`} className="flex flex-wrap items-baseline justify-between gap-2 rounded-sm border border-parchment/15 bg-ink/30 p-3 hover:border-gold">
              <span>
                <strong>{order.lines[0].productName}</strong>
                {` · ${order.lines[0].quantity}× · ${formatEuros(order.totalCents)}`}
                {order.refundedCents > 0 ? ` · refunded ${formatEuros(order.refundedCents)}` : ""}
              </span>
              <span className="text-sm text-parchment/70">{`${order.status} · ${formatTime(order.createdAt)}${order.email ? ` · ${order.email}` : ""}`}</span>
            </Link>
          </li>
        ))}
      </ul>

      <nav aria-label="Pages" className="flex justify-between">
        {page > 1 ? (
          <Link href={link({ page: page - 1 })} className="min-h-11 content-center text-gold underline underline-offset-4">
            Newer
          </Link>
        ) : (
          <span />
        )}
        {page < pageCount && (
          <Link href={link({ page: page + 1 })} className="min-h-11 content-center text-gold underline underline-offset-4">
            Older
          </Link>
        )}
      </nav>
    </section>
  );
}
