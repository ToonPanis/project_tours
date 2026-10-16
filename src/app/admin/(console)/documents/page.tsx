import Link from "next/link";
import { formatEuros } from "@/features/commerce/admin/admin-api";
import { ORDERS_PAGE_SIZE } from "@/features/commerce/config";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { listDocumentsPage } from "@/features/commerce/server/report-service";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Brussels" }).format(new Date(iso));

/** /admin/documents?status=awaiting-provider: receipts, invoices and credit notes (brief 4.3 "invoices"). */
export default async function AdminDocumentsPage({ searchParams }: PageProps<"/admin/documents">) {
  await requireAdmin();
  const query = await searchParams;
  const { documents, total, page, pageCount, status } = await listDocumentsPage(getCommerceContext(), Number(query.page ?? "1"), ORDERS_PAGE_SIZE, query.status);
  const link = (changes: { page?: number; status?: string | null }) => {
    const params = new URLSearchParams();
    const nextStatus = changes.status === undefined ? status : changes.status;
    if (nextStatus) params.set("status", nextStatus);
    if (changes.page && changes.page > 1) params.set("page", String(changes.page));
    const text = params.toString();
    return `/admin/documents${text ? `?${text}` : ""}`;
  };

  return (
    <section className="flex flex-col gap-4 text-parchment">
      <PageHeader title="Receipts and invoices" description="Receipts, credit notes and business invoices (business invoices wait for Billit)." />
      <p className="text-sm text-parchment/70">
        Receipts and credit notes for consumers are made here. Business invoices are made by the invoicing provider (Billit, not
        connected yet): those waiting are marked and must be made by hand for now.
      </p>
      <nav aria-label="Filter" className="flex flex-wrap gap-3 text-sm">
        {(
          [
            [null, "All"],
            ["awaiting-provider", "Waiting for the provider"],
            ["issued", "Issued"],
          ] as const
        ).map(([value, label]) => (
          <Link key={label} href={link({ status: value })} className={status === value ? "font-semibold text-gold" : "underline underline-offset-4"}>
            {label}
          </Link>
        ))}
      </nav>
      <p className="text-parchment/70">{`${total} documents · page ${page} of ${pageCount}`}</p>
      <ul className="flex flex-col gap-2">
        {documents.map((document) => (
          <li key={document.id}>
            <Link
              href={`/admin/orders/${document.orderId}`}
              className={`flex flex-wrap items-baseline justify-between gap-2 rounded-sm border bg-ink/30 p-3 hover:border-gold ${document.status === "awaiting-provider" ? "border-yellow-300/50" : "border-parchment/15"}`}
            >
              <span>
                <strong>{document.kind}</strong>
                {` · ${document.number ?? "no number yet"} · ${formatEuros(document.amountCents)}`}
              </span>
              <span className="text-sm text-parchment/70">{`${document.status === "awaiting-provider" ? "waiting for the provider" : "issued"} · ${formatTime(document.createdAt)}`}</span>
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
