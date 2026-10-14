"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useT } from "@/i18n/client";
import type { PlayerView } from "../logic/player-view";
import { Leaderboard } from "./Leaderboard";

/** "Scores" in the game menu: the live ranking, any time during the game. */
export function ScoresButton({ view }: { view: PlayerView }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="min-h-11 text-gold underline-offset-4 hover:underline">
        {t("pubgame.menu.scores")}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t("pubgame.leaderboard.title")}>
        <div className="flex flex-col gap-4 p-6">
          <h2 className="font-display text-3xl font-semibold">{t("pubgame.leaderboard.title")}</h2>
          {/* The dialog re-renders with the live view, so the ranking updates while open. */}
          <Leaderboard view={view} />
          <Button variant="outline" onClick={() => setOpen(false)} fullWidth>
            {t("pubgame.leaderboard.close")}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
