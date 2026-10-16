import Link from "next/link";
import { COMMISSIONS_PAGE_SIZE, PARTNER_ATTRIBUTION_DAYS } from "@/features/commerce/config";
import { formatEuros } from "@/features/commerce/admin/admin-api";
import { CommissionLedger } from "@/features/commerce/admin/CommissionLedger";
import { PartnerForm } from "@/features/commerce/admin/PartnerForm";
import { describeRule } from "@/features/commerce/logic/partners";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { listLedgerPage } from "@/features/commerce/server/commission-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { listPartnersWithTotals } from "@/features/commerce/server/partner-service";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

const TYPE_LABEL = { HOTEL_PARTNER: "Hotel", HORECA_PARTNER: "Café / restaurant", TOURISM_PARTNER: "Tourism", CORPORATE_PARTNER: "Company" } as const;
const STATUS_FILTERS = [null, "pending", "approved", "payable", "paid", "reversed"] as const;

/** /admin/partners: every partner with its commissions, a new-partner form, and the ledger of all partners. */
export default async function AdminPartnersPage({ searchParams }: PageProps<"/admin/partners">) {
  await requireAdmin();
  const query = await searchParams;
  const ctx = getCommerceContext();
  const [rows, ledger] = await Promise.all([
    listPartnersWithTotals(ctx),
    listLedgerPage(ctx, { status: query.status, page: Number(query.page ?? "1") }, COMMISSIONS_PAGE_SIZE),
  ]);
  const names = Object.fromEntries(rows.map(({ partner }) => [partner.id, `${partner.name} (${partner.code})`]));
  const pageLink = (page: number) => {
    const params = new URLSearchParams();
    if (ledger.status) params.set("status", ledger.status);
    if (page > 1) params.set("page", String(page));
    const text = params.toString();
    return `/admin/partners${text ? `?${text}` : ""}`;
  };

  return (
    <section className="flex flex-col gap-6 text-parchment">
      <PageHeader title="Partners" description="Partner links, portal access and the commission ledger." />
      <p className="text-parchment/80">
        {`A partner link is the site's address with ?ref=CODE. It is remembered ${PARTNER_ATTRIBUTION_DAYS} days on the visitor's device; a later partner link replaces it (last click wins). Commission is only booked for paid orders and goes down with refunds. No money is sent automatically: you pay partners yourself and record the transfer here.`}
      </p>

      <div className="flex flex-col gap-2">
        {rows.length === 0 && <p className="text-parchment/70">No partners yet.</p>}
        {rows.map(({ partner, totals }) => (
          <article key={partner.id} className="flex flex-col gap-1 rounded-sm border border-parchment/15 p-3">
            <p className="font-semibold">
              <Link href={`/admin/partners/${partner.id}`} className="underline underline-offset-4">
                {partner.name}
              </Link>
              {` · ${partner.code} · ${TYPE_LABEL[partner.type]}${partner.active ? "" : " · inactive"}`}
            </p>
            <p className="text-sm text-parchment/70">
              {`${describeRule(partner.commission)} · outstanding ${formatEuros(totals.outstandingCents)} · paid ${formatEuros(totals.paidCents)}`}
            </p>
          </article>
        ))}
      </div>

      <PartnerForm />

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">Commission ledger (all partners)</h2>
        <nav aria-label="Filter by status" className="flex flex-wrap gap-3 text-sm">
          {STATUS_FILTERS.map((value) => (
            <Link
              key={value ?? "all"}
              href={value ? `/admin/partners?status=${value}` : "/admin/partners"}
              className={ledger.status === value ? "font-semibold text-gold" : "underline underline-offset-4"}
            >
              {value ?? "all"}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-parchment/70">{`${ledger.total} lines · page ${ledger.page} of ${ledger.pageCount}`}</p>
        <CommissionLedger entries={ledger.entries} showPartner partnerNames={names} />
        {ledger.pageCount > 1 && (
          <nav aria-label="Pages" className="flex gap-4">
            {ledger.page > 1 && (
              <Link href={pageLink(ledger.page - 1)} className="underline underline-offset-4">
                Previous
              </Link>
            )}
            {ledger.page < ledger.pageCount && (
              <Link href={pageLink(ledger.page + 1)} className="underline underline-offset-4">
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
