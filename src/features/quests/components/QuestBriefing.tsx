"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { GuideImageFigure } from "@/features/guide/components/GuideImageFigure";
import { ImageLightbox } from "@/features/guide/components/ImageLightbox";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import type { Translator } from "@/i18n/translate";
import type { LocationQuest } from "@/types/quest";
import { Spooky } from "./Spooky";

interface QuestBriefingProps {
  /** Identifies the stop, so the screen focuses its title when it opens. */
  stopId: string;
  quest: LocationQuest;
  t: Translator;
  /** The task screen's main button: "Start searching" (find the place) or "I've found it" (find a detail). */
  actionLabel: string;
  onAction: () => void;
}

/**
 * The start of every Spooky task: Spooky announces it in a popup, then the task
 * screen shows the clue (which can be opened large) and what to do. The same for
 * every kind of task; only the main button differs.
 */
export function QuestBriefing({ stopId, quest, t, actionLabel, onAction }: QuestBriefingProps) {
  const [isAnnouncing, setIsAnnouncing] = useState(true);
  const [isClueEnlarged, setIsClueEnlarged] = useState(false);

  if (isAnnouncing) {
    return (
      <>
        {/* Behind the popup: just Spooky, waiting. */}
        <div aria-hidden="true" className="flex min-h-[calc(100dvh-10rem)] items-center justify-center opacity-40">
          <Spooky t={t} size={160} />
        </div>
        {/* Closing the popup (also with Escape) simply opens the task. */}
        <Dialog open title={t("quest.taskForYou")} size="alert" onClose={() => setIsAnnouncing(false)}>
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <Spooky t={t} size={130} />
            <p className="font-display text-3xl font-semibold leading-tight">{t("quest.taskForYou")}</p>
            <Button onClick={() => setIsAnnouncing(false)} fullWidth>
              {t("quest.viewTask")}
            </Button>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <PlayScreen
      eyebrow={t("quest.eyebrow")}
      title={quest.title}
      screenId={`quest-${stopId}`}
      actions={
        <Button onClick={onAction} fullWidth>
          {actionLabel}
        </Button>
      }
    >
      {/* The clue comes first: it is what the walker will be looking for. */}
      <div className="flex flex-col gap-2 rounded-sm bg-parchment p-3 text-ink">
        <GuideImageFigure image={quest.clueImage} preload />
        <button
          type="button"
          onClick={() => setIsClueEnlarged(true)}
          className="flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-ink/30 px-4 text-sm font-semibold"
        >
          <span aria-hidden="true">⤢</span>
          {t("guide.gallery.enlarge")}
        </button>
      </div>
      <div className="flex items-start gap-4">
        <Spooky t={t} size={64} className="shrink-0" />
        <div className="space-y-3 text-lg leading-relaxed">
          {quest.task.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <ImageLightbox image={isClueEnlarged ? quest.clueImage : null} onClose={() => setIsClueEnlarged(false)} t={t} />
    </PlayScreen>
  );
}
