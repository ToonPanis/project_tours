"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { playablePubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import { usePubGameTexts } from "../client/texts-context";
import type { PubGameHandle } from "../client/usePubGame";
import { BeeryPopup } from "./BeeryPopup";
import { FormError } from "./FormError";
import { TaskCard } from "./TaskCard";

/**
 * Beery's bonus task (concept: "Beery heeft een bonusopdracht voor je!").
 * Always optional: "No bonus" moves on. Points only count once the host
 * approves the photo or video (stage 8).
 */
export function BonusStep({ game }: { game: PubGameHandle }) {
  const t = useT();
  const texts = usePubGameTexts();
  const { view, act, busy, uploading } = game;
  const cafeId = view.team.route[view.team.cafeIndex];
  const tasks = (playablePubGameDefinition.cafes.find((cafe) => cafe.id === cafeId)?.tasks ?? []).filter(
    (task) => task.presentedAs === "bonus",
  );
  const [popupClosed, setPopupClosed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <PlayScreen
        eyebrow={t("pubgame.bonus.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length })}
        title={t("pubgame.bonus.title")}
        screenId={`pub-game-bonus-${cafeId}`}
        actions={
          <>
            <FormError error={error} />
            {/* Not while a photo or video is still on its way: moving on would lose it. */}
            <Button variant="outline" disabled={busy || uploading} onClick={async () => setError(await act({ type: "CONTINUE" }))} fullWidth>
              {t("pubgame.bonus.skip")}
            </Button>
          </>
        }
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} game={game} task={task} text={texts.cafes[cafeId]?.tasks[task.id]} />
        ))}
      </PlayScreen>
      <BeeryPopup open={!popupClosed} title={t("pubgame.beery.bonusTask")} onClose={() => setPopupClosed(true)}>
        {tasks[0] && <p className="font-display text-2xl text-gold">{texts.cafes[cafeId]?.tasks[tasks[0].id]?.title}</p>}
      </BeeryPopup>
    </>
  );
}
