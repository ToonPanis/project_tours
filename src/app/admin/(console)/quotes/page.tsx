import Link from "next/link";
import { CorporatePricingEditor } from "@/features/commerce/admin/CorporatePricingEditor";
import { QUOTES_PAGE_SIZE } from "@/features/commerce/config";
import { QUOTE_STATUSES } from "@/features/commerce/logic/quotes";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { getCorporatePricing, listQuotesPage } from "@/features/commerce/server/quote-service";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Brussels" }).format(new Date(iso));

/** /admin/quotes?status=NEW&page=2: corporate quote requests (newest first) and the price guide. */
export default async function AdminQuotesPage({ searchParams }: PageProps<"/admin/quotes">) {
  await requireAdmin();
  const query = await searchParams;
  const ctx = getCommerceContext();
  const [{ quotes, total, page, pageCount, status }, pricing] = await Promise.all([
    listQuotesPage(ctx, Number(query.page ?? "1"), QUOTES_PAGE_SIZE, query.status),
    getCorporatePricing(ctx),
  ]);
  const link = (changes: { page?: number; status?: string | null }) => {
    const params = new URLSearchParams();
    const nextStatus = changes.status === undefined ? status : changes.status;
    if (nextStatus) params.set("status", nextStatus);
    if (changes.page && changes.page > 1) params.set("page", String(changes.page));
    const text = params.toString();
    return `/admin/quotes${text ? `?${text}` : ""}`;
  };

  return (
    <section className="flex flex-col gap-6 text-parchment">
      <PageHeader title="Quote requests" description="Company and group requests from the corporate page, with the indicative price table." />
      <nav aria-label="Filter by status" className="flex flex-wrap gap-3 text-sm">
        <Link href={link({ status: null })} className={!status ? "font-semibold text-gold" : "underline underline-offset-4"}>
          All
        </Link>
        {QUOTE_STATUSES.map((value) => (
          <Link key={value} href={link({ status: value })} className={status === value ? "font-semibold text-gold" : "underline underline-offset-4"}>
            {value}
          </Link>
        ))}
      </nav>
      <p className="text-parchment/70">{`${total} requests · page ${page} of ${pageCount}`}</p>
      <ul className="flex flex-col gap-2">
        {quotes.map((quote) => (
          <li key={quote.id}>
            <Link href={`/admin/quotes/${quote.id}`} className="flex flex-wrap items-baseline justify-between gap-2 rounded-sm border border-parchment/15 bg-ink/30 p-3 hover:border-gold">
              <span>
                <strong>{quote.company}</strong>
                {` · ${quote.participants} persons · ${quote.activity}`}
              </span>
              <span className="text-sm text-parchment/70">{`${quote.status} · ${formatTime(quote.createdAt)}`}</span>
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
      <CorporatePricingEditor pricing={pricing} />
    </section>
  );
}
