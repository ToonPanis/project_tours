"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useT } from "@/i18n/client";
import type { PubGameEvent } from "@/types/pub-game";
import type { PubGameHandle } from "../client/usePubGame";
import type { PlayerView } from "../logic/player-view";
import { playerName } from "../logic/view-helpers";

/**
 * Events that interrupt with a popup (concept, card 8): new drinking buddies,
 * and every sip a buddy has to drink along, on every phone, "so they can
 * check each other". A 2-sip Beunaas instruction gets one too. Everything
 * else is already visible on the screen and only clears from the queue.
 */
export function isPopupEvent(event: PubGameEvent): boolean {
  if (event.type === "buddies-linked") return true;
  if (event.type === "drink") return event.sips.some((sip) => sip.because === "buddy" || sip.sips === 2);
  return false;
}

/** Shows the oldest popup event; closing it removes it (and anything before it) from the queue. */
export function EventPopup({ game }: { game: PubGameHandle }) {
  const t = useT();
  const { view, events, dismissEvents } = game;
  const index = events.findIndex(isPopupEvent);
  const event = index === -1 ? null : events[index];
  const close = () => dismissEvents(index + 1);

  if (!event) return null;
  const title = event.type === "buddies-linked" ? t("pubgame.popups.buddiesTitle") : t("pubgame.popups.drinkTitle");

  return (
    // Keyed by position + type, so the next popup opens fresh.
    <Dialog key={`${index}-${events.length}`} open onClose={close} title={title} size="alert">
      <div className="flex flex-col gap-4 p-6">
        <h2 className="font-display text-3xl font-semibold">
          <span aria-hidden="true">{event.type === "buddies-linked" ? "🤝 " : "🍻 "}</span>
          {title}
        </h2>
        <PopupBody view={view} event={event} />
        <Button onClick={close} fullWidth>
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
