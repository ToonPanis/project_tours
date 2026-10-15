import Link from "next/link";
import { ORDERS_PAGE_SIZE } from "@/features/commerce/config";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { listGroupsPage } from "@/features/commerce/server/report-service";

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Brussels" }).format(new Date(iso));

/**
 * /admin/groups: Hidden Pubs games created with a ticket (P3), newest first.
 * The game itself is played (and deleted after 7 days) in Hidden Pubs; ticket
 * actions (revoke, free seats, refund) are on the order's page.
 */
export default async function AdminGroupsPage({ searchParams }: PageProps<"/admin/groups">) {
  await requireAdmin();
  const query = await searchParams;
  const { grants, total, page, pageCount } = await listGroupsPage(getCommerceContext(), Number(query.page ?? "1"), ORDERS_PAGE_SIZE);

  return (
    <section className="flex flex-col gap-4 text-parchment">
      <h1 className="font-display text-4xl font-semibold">Hidden Pubs groups</h1>
      <p className="text-sm text-parchment/70">Games created with a ticket. Places = persons on the ticket, the organiser included.</p>
      <p className="text-parchment/70">{`${total} groups · page ${page} of ${pageCount}`}</p>
      <ul className="flex flex-col gap-2">
        {grants.map((grant) => (
          <li key={grant.id}>
            <Link href={`/admin/orders/${grant.orderId}`} className="flex flex-wrap items-baseline justify-between gap-2 rounded-sm border border-parchment/15 bg-ink/30 p-3 hover:border-gold">
              <span>
                <strong className="font-mono tracking-widest">{grant.gameCode}</strong>
                {` · ${grant.seats} places · ticket ${grant.status}`}
              </span>
              <span className="text-sm text-parchment/70">{`bought ${formatTime(grant.createdAt)}`}</span>
            </Link>
          </li>
        ))}
      </ul>
      <nav aria-label="Pages" className="flex justify-between">
        {page > 1 ? (
          <Link href={`/admin/groups?page=${page - 1}`} className="min-h-11 content-center text-gold underline underline-offset-4">
            Newer
          </Link>
        ) : (
          <span />
        )}
        {page < pageCount && (
          <Link href={`/admin/groups?page=${page + 1}`} className="min-h-11 content-center text-gold underline underline-offset-4">
            Older
          </Link>
        )}
      </nav>
    </section>
  );
}
