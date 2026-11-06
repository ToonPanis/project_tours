"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { GuideImageFigure } from "@/features/guide/components/GuideImageFigure";
import type { Translator } from "@/i18n/translate";
import type { LocationQuest } from "@/types/quest";

/** "Show the clue" during the search: the drawing and the task again, in a popup. */
export function QuestClueButton({ quest, t }: { quest: LocationQuest; t: Translator }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} fullWidth>
        <span aria-hidden="true">🔍 </span>
        {t("quest.showClue")}
      </Button>
      <Dialog open={isOpen} title={quest.title} onClose={() => setIsOpen(false)}>
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
          <h2 className="font-display text-3xl font-semibold">{quest.title}</h2>
          <div className="rounded-sm bg-parchment p-3 text-ink">
            <GuideImageFigure image={quest.clueImage} />
          </div>
          <div className="space-y-3 text-parchment/90">
            {quest.task.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Button onClick={() => setIsOpen(false)} fullWidth className="mt-auto">
            {t("common.close")}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
