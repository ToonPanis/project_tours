import type { Locale } from "@/i18n/config";
import type { Walk } from "@/types/walk";
import { getClassicsWalk } from "./classics-of-antwerp";
import { getHiddenPubsWalk } from "./hidden-pubs";
import { getPoortjesWalk } from "./poortjes-van-antwerpen";

export { getUpcomingWalks, upcomingWalks } from "./upcoming-walks";

/** All playable walks, with their texts in `locale` (English where a translation is missing). */
export function getWalks(locale?: Locale): Walk[] {
  return [getPoortjesWalk(locale), getHiddenPubsWalk(locale), getClassicsWalk(locale)];
}

/** All playable walks in English, e.g. for tests. Add new walk folders to getWalks(). */
export const walks: Walk[] = getWalks("en");
