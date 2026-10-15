import type { Metadata } from "next";
import { baseOpenGraph, PROTOTYPE_ROBOTS } from "@/lib/shared-metadata";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { TicketRequired } from "@/features/commerce/components/TicketRequired";
import { getCommerceContext } from "@/features/commerce/server/context";
import { playAccess, ticketCookieName } from "@/features/commerce/server/ticket-service";
import { WalkPlayer } from "@/features/walk-session/components/WalkPlayer";
import { getTranslator } from "@/i18n/server";
import { getWalk } from "@/lib/repositories";

// No generateStaticParams: these pages read the language cookie, so Next.js renders
// them per request (in the visitor's language) instead of at build time.

export async function generateMetadata({
  params,
}: PageProps<"/walks/[slug]/play">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslator();
  const walk = await getWalk(slug, t.locale);
  const title = walk ? t("meta.playTitle", { title: walk.title }) : t("meta.walkNotFound");
  return {
    title,
    openGraph: { ...baseOpenGraph(t.locale), title },
    // Game screens are not useful search results. Setting `robots` here replaces the
    // layout's whole `robots`, so the shared rule keeps "nofollow" too.
    // AT LAUNCH: keep `{ index: false }` here when the site-wide rule goes.
    robots: PROTOTYPE_ROBOTS,
  };
}

/**
 * Server Component: loads the walk, then hands it to the interactive
 * <WalkPlayer> (a Client Component) that runs the game in the browser.
 */
export default async function PlayWalkPage({ params }: PageProps<"/walks/[slug]/play">) {
  const { slug } = await params;
  const t = await getTranslator();
  // The walk arrives with its texts in the visitor's language. Switching the
  // language re-renders this page; the saved progress (by stop id) stays.
  const walk = await getWalk(slug, t.locale);
  if (!walk) notFound();
  // A multiplayer pub game isn't played on this page: the organiser creates a game first.
  if (walk.experience === "pub-game") redirect(`/games/new?walk=${walk.slug}`);

  // Tickets (P2): only when sales are open (COMMERCE_SALES_ENABLED) and this walk is on sale.
  // Otherwise "open" comes back without touching the database, and the walk works as before.
  const access = await playAccess(getCommerceContext(), walk.slug, (await cookies()).get(ticketCookieName(walk.slug))?.value);
  if (access === "ticket-required") {
    return (
      <div data-walk-theme={walk.theme} className="bg-night-map min-h-full">
        <TicketRequired walkSlug={walk.slug} t={t} />
      </div>
    );
  }

  return (
    <div data-walk-theme={walk.theme} className="bg-night-map min-h-full">
      <div className="mx-auto max-w-lg">
        {/* Only with a ticket ("granted") is there anyone to send a follow-up email to. */}
        <WalkPlayer walk={walk} reportCompletion={access === "granted"} />
      </div>
    </div>
  );
}
