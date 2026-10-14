"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { Beery } from "./Beery";

/** Beery's short explanation: one idea per screen, readable in a few seconds each. */
const SLIDES: { title: MessageKey; text: MessageKey }[] = [
  { title: "pubgame.beery.intro.welcomeTitle", text: "pubgame.beery.intro.welcomeText" },
  { title: "pubgame.beery.intro.cardsTitle", text: "pubgame.beery.intro.cardsText" },
  { title: "pubgame.beery.intro.pubtasksTitle", text: "pubgame.beery.intro.pubtasksText" },
  { title: "pubgame.beery.intro.bonusTitle", text: "pubgame.beery.intro.bonusText" },
  { title: "pubgame.beery.intro.respectTitle", text: "pubgame.beery.intro.respectText" },
];

/** The rules, before the first café (and again from the menu). Skippable at any moment. */
export function BeeryIntro({ onDone }: { onDone: () => void }) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <PlayScreen
      eyebrow={`${t("pubgame.beery.intro.eyebrow")} · ${t("pubgame.beery.intro.progress", { current: index + 1, total: SLIDES.length })}`}
      title={t(slide.title)}
      screenId={`pub-game-intro-${index}`}
      actions={
        <>
          <Button onClick={() => (isLast ? onDone() : setIndex(index + 1))} fullWidth>
            {isLast ? t("pubgame.beery.intro.done") : t("pubgame.beery.intro.next")}
          </Button>
          {!isLast && (
            <Button variant="outline" onClick={onDone} fullWidth>
              {t("pubgame.beery.intro.skip")}
            </Button>
          )}
        </>
      }
    >
      <Beery size="large">
        <p className="leading-relaxed">{t(slide.text)}</p>
      </Beery>
    </PlayScreen>
  );
}
