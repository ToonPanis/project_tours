import Link from "next/link";
import { notFound } from "next/navigation";
import { COMMISSIONS_PAGE_SIZE } from "@/features/commerce/config";
import { formatEuros } from "@/features/commerce/admin/admin-api";
import { CommissionLedger } from "@/features/commerce/admin/CommissionLedger";
import { PartnerForm } from "@/features/commerce/admin/PartnerForm";
import { PartnerUsers } from "@/features/commerce/admin/PartnerUsers";
import { describeRule, partnerLink } from "@/features/commerce/logic/partners";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { listLedgerPage } from "@/features/commerce/server/commission-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { pageBaseUrl } from "@/features/commerce/server/page-base-url";
import { getPartnerAdminDetail } from "@/features/commerce/server/partner-service";

/** /admin/partners/[id]: a partner's details, link and QR code, portal users and commission ledger. */
export default async function AdminPartnerPage({ params, searchParams }: PageProps<"/admin/partners/[id]">) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const ctx = getCommerceContext();
  const detail = await getPartnerAdminDetail(ctx, id);
  if (!detail) notFound();
  const { partner, users, totals } = detail;
  const ledger = await listLedgerPage(ctx, { partnerId: partner.id, status: query.status, page: Number(query.page ?? "1") }, COMMISSIONS_PAGE_SIZE);
  const link = partnerLink(await pageBaseUrl(), partner.code);

  return (
    <section className="flex flex-col gap-6 text-parchment">
      <p>
        <Link href="/admin/partners" className="underline underline-offset-4">
          ← All partners
        </Link>
      </p>
      <h1 className="font-display text-4xl font-semibold">{partner.name}</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-parchment/70">Code</dt>
        <dd>
          <code>{partner.code}</code>
        </dd>
        <dt className="text-parchment/70">Link</dt>
        <dd className="break-all">
          <code>{link}</code>
        </dd>
        <dt className="text-parchment/70">Commission</dt>
        <dd>{describeRule(partner.commission)}</dd>
        <dt className="text-parchment/70">Status</dt>
        <dd>{partner.active ? "Active" : "Inactive"}</dd>
      </dl>
      <p>
        <a href={`/api/admin/partners/${partner.id}/qr`} className="underline underline-offset-4">
          Download QR code (SVG)
        </a>
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            ["Pending", totals.pendingCents],
            ["Approved", totals.approvedCents],
            ["Payable", totals.payableCents],
            ["Paid", totals.paidCents],
          ] as const
        ).map(([label, cents]) => (
          <div key={label} className="flex flex-col gap-1 rounded-sm border border-parchment/15 bg-ink/30 p-3">
            <span className="text-sm text-parchment/70">{label}</span>
            <span className="text-xl font-semibold tabular-nums">{formatEuros(cents)}</span>
          </div>
        ))}
      </div>

      <PartnerForm partner={partner} />
      <PartnerUsers partnerId={partner.id} users={users} />

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">Commission ledger</h2>
        <p className="text-sm text-parchment/70">{`${ledger.total} lines · page ${ledger.page} of ${ledger.pageCount}`}</p>
        <CommissionLedger entries={ledger.entries} partnerId={partner.id} />
        {ledger.pageCount > 1 && (
          <nav aria-label="Pages" className="flex gap-4">
            {ledger.page > 1 && (
              <Link href={`/admin/partners/${partner.id}?page=${ledger.page - 1}`} className="underline underline-offset-4">
                Previous
              </Link>
            )}
            {ledger.page < ledger.pageCount && (
              <Link href={`/admin/partners/${partner.id}?page=${ledger.page + 1}`} className="underline underline-offset-4">
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
