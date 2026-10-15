"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { CurrentCard, PubGamePlayer } from "@/types/pub-game";
import { CARD_NAMES } from "../card-names";
import type { PubGameHandle } from "../client/usePubGame";
import { MAX_RULE_LENGTH } from "../config";
import { parseCard } from "../logic/cards";
import type { PlayerView } from "../logic/player-view";
import { allTeams, currentCafeId, playerName, teammates } from "../logic/view-helpers";
import { CardBack, PlayingCard } from "./PlayingCard";
import { FormError } from "./FormError";
import { TextField } from "./TextField";

/**
 * Drunken Bastard (concept): one player at a time picks one of 10 face-down
 * cards. The card's effect shows on every phone of the team; cards that need
 * a choice (2, 8, J, and "who lost?" for 4, 7, 9, 10) wait for it.
 *
 * The drawing player's own phone gets the buttons. If that phone has died,
 * a teammate can take over ("Draw for Bea"): the server allows any player of
 * the team, and the card is random anyway.
 */
interface CardStepProps {
  game: PubGameHandle;
  /**
   * Everyone has drawn (the team is already at the pubtask): this phone still
   * shows the last card, so a card without a choice (e.g. a 6) isn't skipped
   * unseen. "On to the pubtask" calls this.
   */
  onRoundSeen?: () => void;
}

export function CardStep({ game, onRoundSeen }: CardStepProps) {
  const t = useT();
  const { view, act, busy } = game;
  const { team } = view;
  const [error, setError] = useState<string | null>(null);
  // Which turn this phone took over for (a teammate whose phone died). Keyed by player.
  const [takenOverFor, setTakenOverFor] = useState<string | null>(null);

  const run = async (action: Parameters<PubGameHandle["act"]>[0]) => setError(await act(action));

  const current = team.currentCard;
  const pending = current?.followUp ? current : null;
  // The player who has to act now: the one choosing for their card, or the next to draw.
  const actorId = pending ? pending.playerId : team.drawerId;
  const canAct = actorId !== null && (actorId === view.me.id || takenOverFor === actorId);

  return (
    <PlayScreen
      eyebrow={t("pubgame.cards.eyebrow", { current: team.cafeIndex + 1, total: team.route.length })}
      title={t("pubgame.cards.title")}
      screenId={`pub-game-cards-${currentCafeId(view)}`}
    >
      {/* Always mounted, so the first card is announced too (not only later ones). */}
      <div aria-live="polite">{current && <DrawnCard view={view} card={current} />}</div>

      {pending && canAct && <FollowUp view={view} card={pending} busy={busy} run={run} />}

      {!pending && team.drawerId && canAct && (
        <section className="flex flex-col gap-3">
          <p className="font-display text-2xl text-gold">{t("pubgame.cards.yourTurn")}</p>
          {team.offeredCardCount > 0 ? (
            <>
              <p>{t("pubgame.cards.pick")}</p>
              <ul className="grid grid-cols-5 gap-2">
                {Array.from({ length: team.offeredCardCount }, (_, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run({ type: "PICK_CARD", index })}
                      aria-label={t("pubgame.cards.faceDown", { number: index + 1, total: team.offeredCardCount })}
                      className="block w-full rounded-md transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60"
                    >
                      <CardBack />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Button onClick={() => run({ type: "DRAW_CARDS" })} disabled={busy} fullWidth>
              {t("pubgame.cards.draw")}
            </Button>
          )}
        </section>
      )}

      {actorId && !canAct && (
        <section className="flex flex-col gap-3">
          <p className="text-lg">
            {pending
              ? t("pubgame.cards.waitingForChoice", { name: playerName(view, actorId) })
              : t("pubgame.cards.waitingFor", { name: playerName(view, actorId) })}
          </p>
          <Button variant="outline" onClick={() => setTakenOverFor(actorId)} fullWidth>
            {pending
              ? t("pubgame.cards.chooseFor", { name: playerName(view, actorId) })
              : t("pubgame.cards.drawFor", { name: playerName(view, actorId) })}
          </Button>
        </section>
      )}

      {onRoundSeen && (
        <section className="flex flex-col gap-3">
          <p className="font-display text-2xl text-gold">{t("pubgame.cards.done")}</p>
          <Button onClick={onRoundSeen} fullWidth>
            {t("pubgame.cards.toPubtask")}
          </Button>
        </section>
      )}

      <FormError error={error} />
      <p className="text-sm text-parchment/70">
        {t.plural("pubgame.cards.cardsLeft", team.cardsLeft)} · {t("pubgame.cards.sipNote")}
      </p>
    </PlayScreen>
  );
}

/** The card that was drawn last, with who drew it and what it means. */
function DrawnCard({ view, card }: { view: PlayerView; card: CurrentCard }) {
  const t = useT();
  const { rank } = parseCard(card.cardId);
  return (
    <section className="flex flex-col items-center gap-3 text-center">
      <p className="text-sm uppercase tracking-wider text-gold">{t("pubgame.cards.drew", { name: playerName(view, card.playerId) })}</p>
      {/* Keyed by card: a new card flips in again. */}
      <PlayingCard key={card.cardId} cardId={card.cardId} />
      <h2 className="font-display text-3xl font-semibold text-parchment">{CARD_NAMES[rank]}</h2>
      <p className="text-lg">{t(`pubgame.cards.effects.${rank}`)}</p>
    </section>
  );
}

interface FollowUpProps {
  view: PlayerView;
  card: CurrentCard;
  busy: boolean;
  run: (action: Parameters<PubGameHandle["act"]>[0]) => Promise<void>;
}

/** The choice a card asks for: who gets the sip, the drinking buddy, the new rule, who lost. */
function FollowUp({ view, card, busy, run }: FollowUpProps) {
  const t = useT();
  const [rule, setRule] = useState("");

  const playerButtons = (players: PubGamePlayer[], onPick: (player: PubGamePlayer) => void) => (
    <div className="grid grid-cols-2 gap-2">
      {players.map((player) => (
        <Button key={player.id} variant="outline" disabled={busy} onClick={() => onPick(player)}>
          {player.name}
        </Button>
      ))}
    </div>
  );

  switch (card.followUp) {
    case "choose-target":
      return (
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-2xl text-gold">{t("pubgame.cards.chooseTarget")}</h3>
          {playerButtons(
            teammates(view).filter((player) => player.id !== card.playerId),
            (player) => run({ type: "GIVE_SIP", targetId: player.id }),
          )}
        </section>
      );

    case "choose-buddy":
      // Anyone in the game, grouped by team (also another team: concept, card 8).
      return (
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-2xl text-gold">{t("pubgame.cards.chooseBuddy")}</h3>
          {allTeams(view).map((team) => {
            const players = view.players.filter((player) => player.teamId === team.id && player.id !== card.playerId);
            if (players.length === 0) return null;
            return (
              <div key={team.id} className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-parchment/70">{team.name}</p>
                {playerButtons(players, (player) => run({ type: "CHOOSE_BUDDY", buddyId: player.id }))}
              </div>
            );
          })}
        </section>
      );

    case "write-rule": {
      const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (rule.trim()) void run({ type: "WRITE_RULE", text: rule });
      };
      return (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <TextField
            label={t("pubgame.cards.writeRule")}
            value={rule}
            onChange={setRule}
            placeholder={t("pubgame.cards.rulePlaceholder")}
            maxLength={MAX_RULE_LENGTH}
          />
          <Button type="submit" disabled={busy || rule.trim() === ""} fullWidth>
            {t("pubgame.cards.ruleSubmit")}
          </Button>
        </form>
      );
    }

    case "report-loser":
      return (
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-2xl text-gold">{t("pubgame.cards.reportLoser")}</h3>
          {playerButtons(teammates(view), (player) => run({ type: "REPORT_LOSER", playerId: player.id }))}
          <Button variant="outline" disabled={busy} onClick={() => run({ type: "REPORT_LOSER", playerId: null })} fullWidth>
            {t("pubgame.cards.nobody")}
          </Button>
        </section>
      );

    default:
      return null;
  }
}
