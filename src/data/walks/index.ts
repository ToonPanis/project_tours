import type { Walk } from "@/types/walk";
import { hiddenPubsWalk } from "./hidden-pubs";
import { the17GatesWalk } from "./the-17-gates";

export { upcomingWalks } from "./upcoming-walks";

/** All playable walks. Add new walk files here. */
export const walks: Walk[] = [the17GatesWalk, hiddenPubsWalk];
