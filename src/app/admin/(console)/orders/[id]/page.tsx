import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEuros } from "@/features/commerce/admin/admin-api";
import { OrderActions } from "@/features/commerce/admin/OrderActions";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { getOrderDetail } from "@/features/commerce/server/order-admin-service";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

const formatTime = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat("nl-BE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Brussels" }).format(new Date(iso)) : "–";

/** /admin/orders/[id]: everything about one order, with refund and ticket actions. */
export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const detail = await getOrderDetail(getCommerceContext(), id);
  if (!detail) notFound();
  const { order, grant, documents } = detail;
  const line = order.lines[0];

  const rows: [string, string][] = [
    ["Status", order.status],
    ["Created", formatTime(order.createdAt)],
    ["Paid", formatTime(order.paidAt)],
    ["Product", `${line.productName} · ${line.quantity} × ${formatEuros(line.unitPriceCents)}`],
    ["Subtotal", formatEuros(order.subtotalCents)],
    ["Discount", order.discount ? `${order.discount.code}: −${formatEuros(order.discount.amountCents)}` : "–"],
    ["Total paid", formatEuros(order.totalCents)],
    ["Refunded", order.refundedCents > 0 ? formatEuros(order.refundedCents) : "–"],
    ["Buyer", [order.email, order.customer?.name].filter(Boolean).join(" · ") || "–"],
    ["Business", order.customer?.type === "business" ? [order.customer.businessName, order.customer.vatNumber].filter(Boolean).join(" · ") : "–"],
    ["Country", order.customer?.country ?? "–"],
    ["Language", order.locale],
    [
      "VAT applied",
      order.tax
        ? `${order.tax.rateBasisPoints / 100} %${order.tax.oss ? " (OSS)" : ""}: ${formatEuros(order.tax.vatCents)} (net ${formatEuros(order.tax.netCents)})${order.tax.note ? ` · ${order.tax.note}` : ""}`
        : "– (worked out when paid)",
    ],
    ["Tax settings used", `version ${order.taxBasis.settingsVersion}, ${order.taxBasis.regime}, category ${order.taxBasis.categoryId ?? "–"}`],
    ["Stripe session", order.stripe.checkoutSessionId ?? "–"],
    ["Stripe payment", order.stripe.paymentIntentId ?? "–"],
    ["Ticket", grant ? `${grant.status} · ${grant.devicesUsed} of ${grant.seats} phones · valid until ${formatTime(grant.validUntil)}` : "–"],
  ];

  return (
    <section className="flex flex-col gap-6 text-parchment">
      <Link href="/admin/orders" className="min-h-11 content-center text-sm text-gold underline underline-offset-4">
        All orders
      </Link>
      <PageHeader title={`Order ${order.id.slice(0, 8)}`} description="Payment, ticket and documents of this order." />

      <dl className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[12rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-parchment/70">{label}</dt>
            <dd className="break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">Documents</h2>
        {documents.length === 0 && <p className="text-parchment/70">None (made when the order is paid).</p>}
        <ul className="flex flex-col gap-1">
          {documents.map((document) => (
            <li key={document.id} className={document.status === "awaiting-provider" ? "text-yellow-300" : ""}>
              {`${document.kind} · ${document.number ?? "no number yet"} · ${formatEuros(document.amountCents)} · ${
                document.status === "awaiting-provider" ? "waiting for the invoicing provider (Billit not connected: make it by hand)" : "issued"
              }`}
            </li>
          ))}
        </ul>
      </div>

      <OrderActions
        orderId={order.id}
        canRefund={order.status === "paid" && order.refundedCents < order.totalCents}
        remainingCents={order.totalCents - order.refundedCents}
        hasActiveTicket={grant?.status === "active"}
      />
    </section>
  );
}
