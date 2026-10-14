"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { TaskText } from "@/data/walks/hidden-pubs/game/content/types";
import { useT } from "@/i18n/client";
import type { EvidenceTask } from "@/types/pub-game";
import type { PubGameHandle } from "../client/usePubGame";
import { FormError } from "./FormError";

/**
 * A photo/video task (pubtask or bonus): what to do and what it's worth.
 * Stage 8 adds sending the photo or video; until then it can be skipped.
 */
export function TaskCard({ game, task, text }: { game: PubGameHandle; task: EvidenceTask; text: TaskText | undefined }) {
  const t = useT();
  const { view, act, busy } = game;
  const [error, setError] = useState<string | null>(null);
  const done = view.team.doneTaskIds.includes(task.id);

  return (
    <section className="flex flex-col gap-3 rounded-sm border border-gold/50 bg-umber/70 p-4">
      <h2 className="font-display text-2xl font-semibold text-parchment">{text?.title ?? task.id}</h2>
      <p className="text-sm font-semibold text-gold">
        {task.scoring === "per-player"
          ? t("pubgame.tasks.perPlayer", { points: task.points })
          : t.plural("pubgame.tasks.points", task.points)}
      </p>
      {text && <p>{text.instruction}</p>}
      <p className="text-sm text-parchment/70">{t("pubgame.tasks.respect")}</p>
      {done ? (
        <p className="text-gold">{t("pubgame.tasks.done")}</p>
      ) : (
        <>
          <p className="text-sm italic text-parchment/70">{t("pubgame.tasks.uploadSoon")}</p>
          <Button
            variant="outline"
            disabled={busy}
            onClick={async () => setError(await act({ type: "SKIP_TASK", taskId: task.id }))}
            fullWidth
          >
            {t("pubgame.tasks.skip")}
          </Button>
        </>
      )}
      <FormError error={error} />
    </section>
  );
}
