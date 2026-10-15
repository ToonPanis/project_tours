import type { PubGameEvent } from "@/types/pub-game";

/**
 * Events that interrupt with a popup (concept, card 8): new drinking buddies,
 * and every sip a buddy has to drink along, on every phone, "so they can
 * check each other". A 2-sip Beunaas instruction gets one too. Everything
 * else is already visible on the screen, so the phone doesn't queue it.
 */
export function isPopupEvent(event: PubGameEvent): boolean {
  if (event.type === "buddies-linked") return true;
  if (event.type === "drink") return event.sips.some((sip) => sip.because === "buddy" || sip.sips === 2);
  return false;
}
