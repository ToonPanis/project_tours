"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { Translator } from "@/i18n/translate";
import { Spooky } from "./Spooky";

interface QuestFoundScreenProps {
  t: Translator;
  /** E.g. "You found the location!" or "Well found!". */
  title: string;
  body?: string;
  /** Opens the stop's story (closing the popup with Escape does the same). */
  onDiscover: () => void;
}

/**
 * Shown once, right after a task was done: Spooky congratulates the walker.
 * Behind the popup there is nothing to spoil; the story opens with the button.
 */
export function QuestFoundScreen({ t, title, body, onDiscover }: QuestFoundScreenProps) {
  return (
    <>
      <div aria-hidden="true" className="flex min-h-[calc(100dvh-10rem)] items-center justify-center opacity-40">
        <Spooky t={t} size={160} />
      </div>
      <Dialog open title={title} size="alert" onClose={onDiscover}>
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <Spooky t={t} size={130} />
          <p className="font-display text-3xl font-semibold leading-tight">{title}</p>
          {body && <p className="text-parchment/85">{body}</p>}
          <Button onClick={onDiscover} fullWidth className="mt-2">
            {t("quest.discoverStory")}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
