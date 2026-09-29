"use client";

import { useT } from "@/i18n/client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { WalkSession } from "@/types/session";
import type { Walk } from "@/types/walk";
import { getSessionStats } from "../logic/session-stats";
import { PlayScreen } from "./PlayScreen";

interface StartScreenProps {
  walk: Walk;
  savedSession: WalkSession | null;
  onNewAdventure: () => void;
  onContinue: () => void;
  onRestart: () => void;
}

export function StartScreen({
  walk,
  savedSession,
  onNewAdventure,
  onContinue,
  onRestart,
}: StartScreenProps) {
  const t = useT();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!savedSession) {
    return (
      <PlayScreen
        eyebrow={walk.title}
        title={walk.narrative?.title ?? walk.title}
        actions={
          <Button onClick={onNewAdventure} fullWidth>
            {t("game.start.newAdventure")}
          </Button>
        }
      >
        <p className="font-display text-xl leading-relaxed">
          {walk.narrative?.premise ?? walk.shortDescription}
        </p>
      </PlayScreen>
    );
  }

  const stats = getSessionStats(walk, savedSession);
  const playerNames = savedSession.team.players.map((player) => player.name).join(", ");

  return (
    <PlayScreen
      eyebrow={walk.title}
      title={t("game.start.welcomeBack")}
      actions={
        <>
          <Button onClick={onContinue} fullWidth>
            {t("game.start.continueWalk")}
          </Button>
          <Button variant="outline" onClick={() => setIsConfirmOpen(true)} fullWidth>
            {t("game.start.restartPlaytest")}
          </Button>
        </>
      }
    >
      <div className="rounded-sm border border-gold/30 bg-ink/40 p-4">
        <p className="text-sm uppercase tracking-wider text-gold">{t("game.start.savedAdventure")}</p>
        <p className="mt-1 font-display text-2xl">
          {savedSession.completedAt
            ? t("game.start.completed")
            : t("game.start.stopOf", { current: stats.currentStopNumber, total: stats.totalStops })}
        </p>
        <p className="mt-1 text-sm text-parchment/75">
          {t("game.start.team", { team: savedSession.team.name ? `${savedSession.team.name} (${playerNames})` : playerNames })}
        </p>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title={t("game.start.restartTitle")}
        message={t("game.start.restartMessage")}
        confirmLabel={t("game.start.restartConfirm")}
        onConfirm={() => {
          setIsConfirmOpen(false);
          onRestart();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </PlayScreen>
  );
}
