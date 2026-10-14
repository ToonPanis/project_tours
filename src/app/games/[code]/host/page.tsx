import { notFound, redirect } from "next/navigation";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { HostDashboard } from "@/features/pub-game/components/HostDashboard";
import { loadGamePage } from "@/features/pub-game/server/page-data";
import { getPubGameTexts } from "@/data/walks/hidden-pubs/game/content";
import { getLocale, getTranslator } from "@/i18n/server";

/** /games/CODE/host: the host dashboard. Other players get a short message. */
export default async function HostPage({ params }: PageProps<"/games/[code]/host">) {
  const page = await loadGamePage((await params).code);
  if (!page) notFound();
  // Not in this game on this phone: the join form first.
  if (!page.player) redirect(`/games/${page.code}`);

  if (!page.player.view.me.isHost) {
    const t = await getTranslator();
    return <PlayScreen title={t("pubgame.host.title")} screenId="pub-game-host">{t("pubgame.host.notHost")}</PlayScreen>;
  }
  return (
    <HostDashboard
      code={page.code}
      initialView={page.player.view}
      initialVersion={page.player.version}
      texts={getPubGameTexts(await getLocale())}
    />
  );
}
