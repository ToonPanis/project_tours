import { PrivacyRequests } from "@/features/commerce/admin/PrivacyRequests";
import { RETENTION } from "@/features/commerce/config";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

/** /admin/privacy: GDPR access, portability and erasure requests (P9), and the retention periods. */
export default async function AdminPrivacyPage() {
  await requireAdmin();
  return (
    <section className="flex flex-col gap-6 text-parchment">
      <PageHeader title="Personal data requests" description="Find, export or erase a person's data (GDPR), and the retention periods." />
      <p className="text-parchment/80">
        Customers have no accounts: find their data by email address. Answer a request within a month. Every export and erasure is in the audit log (by the address&apos;s hash, not the address).
      </p>
      <PrivacyRequests />
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">Retention (applied every night)</h2>
        <ul className="list-inside list-disc text-sm text-parchment/85">
          <li>{`Audit log: ${RETENTION.auditLogDays} days.`}</li>
          <li>{`Rejected reviews: ${RETENTION.rejectedReviewDays} days.`}</li>
          <li>{`Orders that were never paid: ${RETENTION.unpaidOrderDays} days.`}</li>
          <li>{`Paid orders: email and name removed after ${Math.floor(RETENTION.orderPersonalDataDays / 365)} years; amounts kept (accounting).`}</li>
          <li>By MongoDB itself (TTL): sign-in links 15 minutes, sessions 12 hours / 7 days, sent emails 90 days, quote requests 2 years, partner click counters 3 years, Hidden Pubs games and photos 7 days.</li>
          <li>Kept: unsubscribed addresses (hash only, to respect the opt-out), the commission ledger (no personal data).</li>
        </ul>
        <p className="text-xs text-parchment/60">⚖️ The periods are proposals: confirm them with your accountant and lawyer (config.ts, RETENTION).</p>
      </div>
    </section>
  );
}
