import type { Metadata } from "next";
import { OpenTicket } from "@/features/commerce/components/OpenTicket";
import { getTranslator } from "@/i18n/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** /tickets/open#<ticket>: the link from the confirmation email, opened on each phone of the group. */
export default async function OpenTicketPage() {
  const t = await getTranslator();
  return (
    <div className="bg-night-map min-h-full text-parchment">
      <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10">
        <h1 className="font-display text-4xl font-semibold">{t("commerce.ticket.title")}</h1>
        <OpenTicket />
      </section>
    </div>
  );
}
