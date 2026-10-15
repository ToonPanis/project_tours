import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TicketRequired } from "@/features/commerce/components/TicketRequired";
import { getCommerceContext } from "@/features/commerce/server/context";
import { newGameAccess, ticketCookieName } from "@/features/commerce/server/ticket-service";
import { CreateGameForm } from "@/features/pub-game/components/CreateGameForm";
import { getWalk } from "@/lib/repositories";
import { getLocale, getTranslator } from "@/i18n/server";

/**
 * /games/new?walk=<slug>: the organiser sets up a game of a pub-game walk (Hidden Pubs by default).
 * With ticket sales open (P3), this phone needs an unused ticket for the game; its number
 * of persons becomes the game's places. With sales closed, the form shows as before.
 */
export default async function NewGamePage({ searchParams }: PageProps<"/games/new">) {
  const requested = (await searchParams).walk;
  const slug = typeof requested === "string" ? requested : "hidden-pubs";
  const walk = await getWalk(slug, await getLocale());
  if (!walk || walk.experience !== "pub-game") notFound();

  const access = await newGameAccess(getCommerceContext(), walk.slug, (await cookies()).get(ticketCookieName(walk.slug))?.value);
  if (access.status === "ticket-required") {
    return (
      <div className="bg-night-map min-h-full">
        <TicketRequired walkSlug={walk.slug} t={await getTranslator()} />
      </div>
    );
  }
  if (access.status === "used") {
    const t = await getTranslator();
    return (
      <div className="bg-night-map min-h-full text-parchment">
        <section className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-10">
          <h1 className="font-display text-4xl font-semibold">{t("commerce.groups.title")}</h1>
          <p className="text-lg">{t("commerce.groups.usedBody")}</p>
          {access.gameCode && <ButtonLink href={`/games/${access.gameCode}`}>{t("commerce.groups.backToGame")}</ButtonLink>}
        </section>
      </div>
    );
  }
  return <CreateGameForm walkSlug={walk.slug} ticketSeats={access.status === "ready" ? access.seats : null} />;
}
