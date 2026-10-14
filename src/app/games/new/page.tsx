import { notFound } from "next/navigation";
import { CreateGameForm } from "@/features/pub-game/components/CreateGameForm";
import { getWalk } from "@/lib/repositories";
import { getLocale } from "@/i18n/server";

/** /games/new?walk=<slug>: the organiser sets up a game of a pub-game walk (Hidden Pubs by default). */
export default async function NewGamePage({ searchParams }: PageProps<"/games/new">) {
  const requested = (await searchParams).walk;
  const slug = typeof requested === "string" ? requested : "hidden-pubs";
  const walk = await getWalk(slug, await getLocale());
  if (!walk || walk.experience !== "pub-game") notFound();
  return <CreateGameForm walkSlug={walk.slug} />;
}
