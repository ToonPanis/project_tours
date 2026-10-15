"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useT } from "@/i18n/client";
import type { PubGameEvent } from "@/types/pub-game";
import type { PubGameHandle } from "../client/usePubGame";
import type { PlayerView } from "../logic/player-view";
import { playerName } from "../logic/view-helpers";

/** Shows the oldest queued popup; closing it shows the next one (usePubGame only queues popup events). */
export function EventPopup({ game }: { game: PubGameHandle }) {
  const t = useT();
  const { view, popups, dismissPopup } = game;
  const popup = popups[0];

  if (!popup) return null;
  const { event } = popup;
  const title = event.type === "buddies-linked" ? t("pubgame.popups.buddiesTitle") : t("pubgame.popups.drinkTitle");

  return (
    // Keyed by the popup: the next one opens fresh, a poll in between doesn't reopen this one.
    <Dialog key={popup.id} open onClose={dismissPopup} title={title} size="alert">
      <div className="flex flex-col gap-4 p-6">
        <h2 className="font-display text-3xl font-semibold">
          <span aria-hidden="true">{event.type === "buddies-linked" ? "🤝 " : "🍻 "}</span>
          {title}
        </h2>
        <PopupBody view={view} event={event} />
        <Button onClick={dismissPopup} fullWidth>
          {t("pubgame.popups.ok")}
        </Button>
      </div>
    </Dialog>
  );
}

function PopupBody({ view, event }: { view: PlayerView; event: PubGameEvent }) {
  const t = useT();
  if (event.type === "buddies-linked") {
    const [first, second] = event.playerIds;
    return (
      <>
        <p className="text-lg">
          {t("pubgame.popups.buddiesText", { first: playerName(view, first), second: playerName(view, second) })}
        </p>
        {event.endedPairs.map(([a, b]) => (
          <p key={`${a}-${b}`} className="text-sm text-parchment/70">
            {t("pubgame.popups.buddiesEnded", { first: playerName(view, a), second: playerName(view, b) })}
          </p>
        ))}
      </>
    );
  }
  if (event.type === "drink") {
    // The first sip is the player who had to drink; a "buddy" sip drinks along with them.
    const drinker = event.sips[0]?.playerId;
    return (
      <ul className="flex flex-col gap-1 text-lg">
        {event.sips.map((sip) => (
          <li key={sip.playerId}>
            {sip.because === "buddy"
              ? t.plural("pubgame.popups.sipAlong", sip.sips, { name: playerName(view, sip.playerId), buddy: playerName(view, drinker) })
              : t.plural("pubgame.popups.sip", sip.sips, { name: playerName(view, sip.playerId) })}
          </li>
        ))}
      </ul>
    );
  }
  return null;
}
