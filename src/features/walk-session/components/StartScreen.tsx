"use client";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!savedSession) {
    return (
      <PlayScreen
        eyebrow={walk.title}
        title={walk.narrative?.title ?? walk.title}
        actions={
          <Button onClick={onNewAdventure} fullWidth>
            Start new adventure
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
      title="Welcome back"
      actions={
        <>
          <Button onClick={onContinue} fullWidth>
            Continue walk
          </Button>
          <Button variant="outline" onClick={() => setIsConfirmOpen(true)} fullWidth>
            Restart playtest
          </Button>
        </>
      }
    >
      <div className="rounded-sm border border-gold/30 bg-ink/40 p-4">
        <p className="text-sm uppercase tracking-wider text-gold">Saved adventure</p>
        <p className="mt-1 font-display text-2xl">
          {savedSession.completedAt
            ? "Completed"
            : `Stop ${stats.currentStopNumber} of ${stats.totalStops}`}
        </p>
        <p className="mt-1 text-sm text-parchment/75">
          Team: {savedSession.team.name ? `${savedSession.team.name} (${playerNames})` : playerNames}
        </p>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Restart the playtest?"
        message="This deletes the saved progress on this phone and starts again from the first stop."
        confirmLabel="Yes, restart"
        onConfirm={() => {
          setIsConfirmOpen(false);
          onRestart();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </PlayScreen>
  );
}
