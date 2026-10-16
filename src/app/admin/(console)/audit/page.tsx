import Link from "next/link";
import { AUDIT_PAGE_SIZE } from "@/features/commerce/config";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { listAuditPage } from "@/features/commerce/server/catalog-service";
import { getCommerceContext } from "@/features/commerce/server/context";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", { dateStyle: "short", timeStyle: "medium", timeZone: "Europe/Brussels" }).format(new Date(iso));

/** /admin/audit?page=N: every sign-in and change, newest first, paginated on the server. */
export default async function AdminAuditPage({ searchParams }: PageProps<"/admin/audit">) {
  await requireAdmin();
  const requested = Number((await searchParams).page ?? "1");
  const { entries, page, pageCount, total } = await listAuditPage(getCommerceContext(), requested, AUDIT_PAGE_SIZE);

  return (
    <section className="flex flex-col gap-4">
      <PageHeader title="Audit log" description="Who changed what, and when. Never secrets or customers' data." />
      <p className="text-parchment/80">{`${total} entries · page ${page} of ${pageCount}`}</p>

      <ol className="flex flex-col gap-2">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-sm border border-parchment/15 bg-ink/30 p-3 text-parchment">
            <p className="text-sm text-parchment/70">
              <time dateTime={entry.at}>{formatTime(entry.at)}</time>
              {` · ${entry.actorEmail ?? "system"}`}
            </p>
            <p>
              <strong>{entry.action}</strong>
              {` · ${entry.target}`}
            </p>
            {Object.keys(entry.details).length > 0 && (
              <ul className="mt-1 text-sm text-parchment/80">
                {Object.entries(entry.details).map(([field, value]) => (
                  <li key={field}>{`${field}: ${String(value)}`}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <nav aria-label="Pages" className="flex justify-between">
        {page > 1 ? (
          <Link href={`/admin/audit?page=${page - 1}`} className="min-h-11 content-center text-gold underline underline-offset-4">
            Newer
          </Link>
        ) : (
          <span />
        )}
        {page < pageCount && (
          <Link href={`/admin/audit?page=${page + 1}`} className="min-h-11 content-center text-gold underline underline-offset-4">
            Older
          </Link>
        )}
      </nav>
    </section>
  );
}
