import { notFound } from "next/navigation";
import { JoinGameForm } from "@/features/pub-game/components/JoinGameForm";
import { PubGame } from "@/features/pub-game/components/PubGame";
import { joinUrlFor, loadGamePage } from "@/features/pub-game/server/page-data";

/**
 * /games/CODE: the link everyone opens. Server Component: it reads this
 * phone's player cookie. Not in the game yet → the join form; in the game →
 * the live game (a Client Component that keeps itself up to date).
 */
export default async function GamePage({ params }: PageProps<"/games/[code]">) {
  const page = await loadGamePage((await params).code);
  if (!page) notFound();

  if (!page.player) return <JoinGameForm code={page.code} lobby={page.lobby} />;
  return (
    <PubGame
      code={page.code}
      joinUrl={await joinUrlFor(page.code)}
      initialView={page.player.view}
      initialVersion={page.player.version}
    />
  );
}
