"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import type { TeamRoles } from "@/types/pub-game";
import type { PubGameHandle } from "../client/usePubGame";
import { buddyOf } from "../logic/sips";
import { playerName, teammates } from "../logic/view-helpers";
import { FormError } from "./FormError";

const ROLES: { role: keyof TeamRoles; label: MessageKey; icon: string }[] = [
  { role: "thumbKing", label: "pubgame.effects.thumbKing", icon: "👍" },
  { role: "questionBitch", label: "pubgame.effects.questionBitch", icon: "❓" },
  { role: "beunaas", label: "pubgame.effects.beunaas", icon: "🅰️" },
];

/**
 * Always on screen during the game (concept: "visible to all players"): the
 * team's Thumb King, Question Bitch and Beunaas, the player's drinking buddy
 * and the number of rules. "Powers & rules" opens everything, including all
 * drinking buddies of the game and a way to report a sip (Question Bitch,
 * Thumb King or a rule caught someone), so buddies drink along.
 */
export function EffectsBar({ game }: { game: PubGameHandle }) {
  const t = useT();
  const { view, act, busy } = game;
  const [open, setOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const myBuddy = buddyOf(view.buddies, view.me.id);

  async function report(playerId: string) {
    const failure = await act({ type: "REPORT_DRINK", playerId });
    setError(failure);
    setReported(!failure);
  }

  return (
    <section aria-label={t("pubgame.effects.label")} className="mx-4 mt-3 rounded-sm border border-gold/30 bg-ink/50 p-3 text-sm sm:mx-6">
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {ROLES.map(({ role, label, icon }) => (
          <li key={role}>
            <span aria-hidden="true">{icon} </span>
            <span className="text-parchment/70">{t(label)}: </span>
            <span className="font-semibold text-parchment">
              {view.team.roles[role] ? playerName(view, view.team.roles[role]) : t("pubgame.effects.nobody")}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <span>
          <span aria-hidden="true">🤝 </span>
          <span className={myBuddy ? "text-parchment" : "text-parchment/70"}>
            {myBuddy ? t("pubgame.effects.yourBuddy", { name: playerName(view, myBuddy) }) : t("pubgame.effects.noBuddy")}
          </span>
          <span aria-hidden="true"> · 📜 </span>
          <span className="text-parchment/70">{t.plural("pubgame.effects.rulesCount", view.team.rules.length)}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setReported(false);
            setOpen(true);
          }}
          className="min-h-11 font-semibold text-gold underline underline-offset-4"
        >
          {t("pubgame.effects.open")}
        </button>
      </p>

      <Dialog open={open} onClose={() => setOpen(false)} title={t("pubgame.effects.title")}>
        <div className="flex flex-col gap-5 p-6">
          <h2 className="font-display text-3xl font-semibold">{t("pubgame.effects.title")}</h2>

          <ul className="flex flex-col gap-1">
            {ROLES.map(({ role, label, icon }) => (
              <li key={role}>
                <span aria-hidden="true">{icon} </span>
                {t(label)}:{" "}
                <strong>{view.team.roles[role] ? playerName(view, view.team.roles[role]) : t("pubgame.effects.nobody")}</strong>
              </li>
            ))}
          </ul>

          <section>
            <h3 className="font-display text-2xl text-gold">{t("pubgame.effects.rules")}</h3>
            {view.team.rules.length === 0 ? (
              <p className="text-parchment/70">{t("pubgame.effects.noRules")}</p>
            ) : (
              <ol className="mt-2 flex list-decimal flex-col gap-2 pl-6">
                {view.team.rules.map((rule) => (
                  <li key={rule.id}>
                    {rule.text} <span className="text-sm text-parchment/60">({t("pubgame.effects.ruleBy", { name: playerName(view, rule.playerId) })})</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <h3 className="font-display text-2xl text-gold">{t("pubgame.effects.buddies")}</h3>
            {view.buddies.length === 0 ? (
              <p className="text-parchment/70">{t("pubgame.effects.noBuddies")}</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1">
                {view.buddies.map(([first, second]) => (
                  <li key={`${first}-${second}`}>
                    🤝 {playerName(view, first)} & {playerName(view, second)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {view.phase === "playing" && (
            <section className="flex flex-col gap-2">
              <h3 className="font-display text-2xl text-gold">{t("pubgame.effects.reportDrink")}</h3>
              <p className="text-sm text-parchment/75">{t("pubgame.effects.reportDrinkHelp")}</p>
              <div className="grid grid-cols-2 gap-2">
                {teammates(view).map((player) => (
                  <Button key={player.id} variant="outline" disabled={busy} onClick={() => report(player.id)}>
                    {player.name}
                  </Button>
                ))}
              </div>
              <FormError error={error} />
              <p role="status" className={reported ? "text-sm text-gold" : "sr-only"}>
                {reported ? t("pubgame.effects.reported") : ""}
              </p>
            </section>
          )}

          <Button variant="outline" onClick={() => setOpen(false)} fullWidth>
            {t("pubgame.effects.close")}
          </Button>
        </div>
      </Dialog>
    </section>
  );
}
