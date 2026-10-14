import { notFound } from "next/navigation";
import { JoinGameForm } from "@/features/pub-game/components/JoinGameForm";
import { PubGame } from "@/features/pub-game/components/PubGame";
import { getPubGameTexts } from "@/data/walks/hidden-pubs/game/content";
import { inviteFor, loadGamePage } from "@/features/pub-game/server/page-data";
import { getLocale } from "@/i18n/server";

/**
 * /games/CODE: the link everyone opens. Server Component: it reads this
 * phone's player cookie. Not in the game yet → the join form; in the game →
 * the live game (a Client Component that keeps itself up to date).
 */
export default async function GamePage({ params }: PageProps<"/games/[code]">) {
  const page = await loadGamePage((await params).code);
  if (!page) notFound();

  if (!page.player) return <JoinGameForm code={page.code} lobby={page.lobby} />;
  // Only needed in the lobby: no QR work once the game runs.
  const invite = page.player.view.phase === "lobby" ? await inviteFor(page.code) : null;
  return (
    <PubGame
      code={page.code}
      invite={invite}
      initialView={page.player.view}
      initialVersion={page.player.version}
      // The texts in the visitor's language; a language switch re-renders the page with new ones.
      texts={getPubGameTexts(await getLocale())}
    />
  );
}
