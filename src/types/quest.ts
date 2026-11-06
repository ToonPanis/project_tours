import type { GeoCoordinates } from "./common";
import type { GuideImage } from "./guide";

/**
 * An area to search in, drawn on the map instead of an exact pin.
 * The centre is deliberately NOT the place itself (otherwise the middle of the
 * circle would give the answer away); validateWalk checks that the place, with
 * its whole arrival radius, lies inside the zone.
 */
export interface SearchZone {
  center: GeoCoordinates;
  radiusMeters: number;
}

/** What every task from Spooky (the walk's guide character) has. */
interface QuestBase {
  /** Heading of the task screen, e.g. "Spooky's task" or "Find the city's coat of arms". */
  title: string;
  /** The task, shown with the clue image. */
  task: string[];
  /** The main hint, e.g. an old drawing of a façade or a photo of a detail. */
  clueImage: GuideImage;
}

/**
 * "Find the place": a search on the way TO a stop. Navigation shows a search zone
 * instead of a pin, and GPS notices when the walker reaches the place. Until then the
 * app never shows its exact position, house number or real name: `location.name` and
 * `location.address` stay neutral, and the real ones below appear only on the stop page.
 */
export interface LocationSearchQuest extends QuestBase {
  type: "location";
  /** Shown with the circle on the map, e.g. "The building is somewhere inside this zone." */
  zoneHint: string;
  searchZone: SearchZone;
  /** How close (in meters, measured from the stop's coordinates) counts as found. */
  arrivalRadiusMeters: number;
  /** The stop's real name and address, revealed once it is found. */
  revealedName: string;
  revealedAddress: string;
}

/**
 * "Find a detail": a task AT a stop, after arriving, e.g. a coat of arms or an old wall.
 * GPS can't tell whether someone is looking at the right thing, so the walker says
 * "I've found it" themselves; then the stop's story opens.
 */
export interface DiscoveryQuest extends QuestBase {
  type: "discovery";
}

/** A task set by Spooky. Any stop of any walk can have one: add `quest` to its data. */
export type LocationQuest = LocationSearchQuest | DiscoveryQuest;

/** What the navigation screen needs to search a zone instead of walking to a pin. */
export interface ZoneSearch {
  zone: SearchZone;
  arrivalRadiusMeters: number;
  hint: string;
}
