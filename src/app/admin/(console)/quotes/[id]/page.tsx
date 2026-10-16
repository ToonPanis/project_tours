import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteStatusForm } from "@/features/commerce/admin/QuoteStatusForm";
import { nextStatuses } from "@/features/commerce/logic/quotes";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { getQuote } from "@/features/commerce/server/quote-service";
import { PageHeader } from "@/features/commerce/admin/PageHeader";

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("nl-BE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Brussels" }).format(new Date(iso));

/** /admin/quotes/[id]: one request, its history, and the next status. */
export default async function AdminQuotePage({ params }: PageProps<"/admin/quotes/[id]">) {
  await requireAdmin();
  const quote = await getQuote(getCommerceContext(), (await params).id);
  if (!quote) notFound();

  const rows: [string, string][] = [
    ["Status", quote.status],
    ["Received", formatTime(quote.createdAt)],
    ["Company", quote.company],
    ["Contact", quote.contactName],
    ["Email", quote.email],
    ["Phone", quote.phone ?? "–"],
    ["Preferred date", quote.preferredDate ?? "flexible"],
    ["Participants", String(quote.participants)],
    ["Activity", quote.activity],
    ["Formula", quote.formula],
    ["Language", quote.language],
    ["Wishes", quote.wishes ?? "–"],
  ];

  return (
    <section className="flex flex-col gap-6 text-parchment">
      <Link href="/admin/quotes" className="min-h-11 content-center text-sm text-gold underline underline-offset-4">
        All quote requests
      </Link>
      <PageHeader title={quote.company} description="The request, its status history and internal notes." />
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[10rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-parchment/70">{label}</dt>
            <dd className="whitespace-pre-line break-words">{value}</dd>
          </div>
        ))}
      </dl>
      <p>
        <a href={`mailto:${quote.email}`} className="text-gold underline underline-offset-4">
          Email the contact
        </a>
      </p>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold">History</h2>
        <ol className="flex flex-col gap-1">
          {quote.history.map((entry, index) => (
            <li key={index} className="text-sm">
              {`${formatTime(entry.at)} · ${entry.status} · ${entry.by ?? "website"}`}
              {entry.note && <span className="block text-parchment/80">{entry.note}</span>}
            </li>
          ))}
        </ol>
      </div>

      <QuoteStatusForm quoteId={quote.id} next={nextStatuses(quote.status)} />
    </section>
  );
}
