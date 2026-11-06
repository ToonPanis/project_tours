import type { WalkLocation } from "@/types/location";
import { zoneHidesPlace } from "./search-zone";

/** The centre of a search zone must be at least this far from the place (else the middle is the answer). */
export const MIN_ZONE_OFFSET_METERS = 20;
/** Smaller than this, normal GPS noise on a phone would make the place hard to "find". */
export const MIN_QUEST_ARRIVAL_RADIUS_METERS = 20;

/**
 * Problems with a stop's quest (empty = fine). Part of validateWalk, so every
 * quest in every walk and language is checked: the place must really lie in its
 * zone, and nothing shown before it is found may name it.
 */
export function validateQuest(stop: WalkLocation, previousStop: WalkLocation | undefined): string[] {
  const quest = stop.quest;
  // A discovery task happens after arriving: the stop may be named and pinned as usual.
  if (!quest || quest.type !== "location") return [];
  const problems: string[] = [];

  if (!stop.coordinates) {
    problems.push(`${stop.id}: a quest needs the place's coordinates (it is found there)`);
  } else if (!zoneHidesPlace(quest.searchZone, stop.coordinates, quest.arrivalRadiusMeters, MIN_ZONE_OFFSET_METERS)) {
    problems.push(
      `${stop.id}: the search zone must contain the place with its whole arrival radius, and its centre must be at least ${MIN_ZONE_OFFSET_METERS} m from it`,
    );
  }
  if (quest.arrivalRadiusMeters < MIN_QUEST_ARRIVAL_RADIUS_METERS) {
    problems.push(`${stop.id}: an arrival radius under ${MIN_QUEST_ARRIVAL_RADIUS_METERS} m is too tight for phone GPS`);
  }

  // Everything a walker can see before finding the place.
  const shownBefore = [
    stop.name,
    stop.address,
    stop.description,
    quest.title,
    ...quest.task,
    quest.zoneHint,
    quest.clueImage.caption,
    quest.clueImage.alt,
    quest.clueImage.src,
    previousStop?.guide?.transitionToNext ?? "",
  ];
  const answer = quest.revealedName.toLowerCase();
  if (shownBefore.some((text) => text.toLowerCase().includes(answer))) {
    problems.push(`${stop.id}: a text shown before the quest is solved names the answer ("${quest.revealedName}")`);
  }
  if (stop.address === quest.revealedAddress) {
    problems.push(`${stop.id}: the address shown before the quest is solved is the exact one`);
  }
  return problems;
}
