"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cafeName } from "@/data/walks/hidden-pubs/game/cafes";
import type { FunFact } from "@/data/walks/hidden-pubs/game/content/types";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { useCafeReveal } from "../client/useCafeReveal";
import type { PubGameHandle } from "../client/usePubGame";
import { Beery } from "./Beery";
import { FormError } from "./FormError";

/** History is labelled with its research status, legends as legends, a café's own story as such (CLAUDE.md). */
function labelOf(funFact: FunFact): MessageKey {
  if (funFact.kind === "legend") return "game.content.legend";
  if (funFact.kind === "cafe-story") return "pubgame.funFact.cafeStory";
  if (funFact.status === "verified") return "game.content.history";
  return funFact.status === "partially-verified" ? "game.content.historyPartial" : "game.content.historyResearch";
}

/**
 * The café's fun fact, read while finishing the drinks. It comes from the
 * server (it can give an answer away) once the team reached this step.
 * Then: on to the next café (Beery's popup), or the finish after Den Engel.
 */
export function FunFactStep({ game }: { game: PubGameHandle }) {
  const t = useT();
  const { view, act, busy } = game;
  const cafeId = view.team.route[view.team.cafeIndex];
  const funFact = useCafeReveal(game.code, cafeId, "fun-fact")?.funFact;
  const isLast = view.team.cafeIndex === view.team.route.length - 1;
  const [error, setError] = useState<string | null>(null);

  return (
    <PlayScreen
      eyebrow={t("pubgame.funFact.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length })}
      title={funFact?.title ?? cafeName(cafeId)}
      screenId={`pub-game-fun-fact-${cafeId}`}
      actions={
        <>
          <FormError error={error} />
          <Button disabled={busy} onClick={async () => setError(await act({ type: "CONTINUE" }))} fullWidth>
            {isLast ? t("pubgame.funFact.finish") : t("pubgame.funFact.next")}
          </Button>
        </>
      }
    >
      {funFact ? (
        <article className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">{t(labelOf(funFact))}</p>
          {funFact.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>
      ) : (
        <Beery>
          <p role="status">{t("pubgame.funFact.loading")}</p>
        </Beery>
      )}
    </PlayScreen>
  );
}
