import type { Locale } from "@/i18n/config";
import type { Challenge } from "@/types/challenge";
import type { Clue, ClueIcon } from "@/types/clue";
import type { StoryBlock } from "@/types/content";
import type { DrinkCategory, DrinkOption } from "@/types/drink";
import type { LocationType, UnlockCondition, WalkLocation } from "@/types/location";
import type { VerificationStatus } from "@/types/reveal";
import coordinatesFile from "./coordinates.json";
import type { ChallengeText, HiddenPubsStopText, StoryText } from "./content/types";

/** The tavern ledger is written in Dutch, like a real old Antwerp ledger. */
const LEDGER_LANGUAGE: Locale = "nl";

/** Texts of a challenge; they come from content/<lang>.ts. */
type ChallengeTextKey = "title" | "instruction" | "question" | "hints" | "explanation" | "options";
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** A challenge without its texts: type, answers, research status. */
export type ChallengeData = DistributiveOmit<Challenge, ChallengeTextKey>;

interface DrinkData {
  category: DrinkCategory;
  alcoholic: boolean;
  /** Defaults to "verified" (supplied by the project owner). */
  menuVerification?: DrinkOption["menuVerification"];
}

/**
 * A block of the Lost Tavern Ledger (FICTION). `ledger` is the original
 * Dutch text of the ledger; a block without it is narration, written per
 * language in content/.
 */
export interface StoryData {
  ledger?: string;
  revealAt?: StoryBlock["revealAt"];
  tone?: StoryBlock["tone"];
}

/** Everything about a stop that is the same in every language. */
export interface HiddenPubsStop {
  id: string;
  order: number;
  /** The café's own name: never translated. */
  name: string;
  type: LocationType;
  address: string;
  drinks: DrinkData[];
  story: StoryData[];
  challenge: ChallengeData;
  bonusChallenge?: ChallengeData;
  historicalReveal: {
    status: VerificationStatus;
    sources: { url?: string }[];
  };
  unlockCondition: UnlockCondition;
  clue: { id: string; icon: ClueIcon };
}

/**
 * A café's position, from coordinates.json (the single source for both the
 * app and the route generator script).
 */
function cafePosition(locationId: string): Pick<WalkLocation, "coordinates" | "coordinatesStatus"> {
  const entry = coordinatesFile.locations.find((location) => location.id === locationId);
  if (!entry) return { coordinates: null };
  return {
    coordinates: { latitude: entry.latitude, longitude: entry.longitude },
    coordinatesStatus: entry.status === "verified" ? "verified" : "to-verify",
  };
}

/** Drink options with stable ids: "<location>-drink-a", "-b", … */
function buildDrinkOptions(stop: HiddenPubsStop, names: string[]): DrinkOption[] {
  return stop.drinks.map((drink, index) => ({
    id: `${stop.id}-drink-${String.fromCharCode(97 + index)}`,
    name: names[index] ?? "",
    category: drink.category,
    alcoholic: drink.alcoholic,
    menuVerification: drink.menuVerification ?? "verified",
  }));
}

/** Combines a challenge's answers with its texts in one language. */
export function buildChallenge(data: ChallengeData, text: ChallengeText): Challenge {
  const texts = {
    title: text.title,
    instruction: text.instruction,
    question: text.question,
    hints: text.hints,
    explanation: text.explanation,
  };
  switch (data.type) {
    case "multiple-choice":
      return { ...data, ...texts, options: text.options ?? [] };
    case "observation":
      return { ...data, ...texts, instruction: text.instruction ?? "" };
    default:
      return { ...data, ...texts };
  }
}

/** The ledger in its original Dutch, with a translation for everyone else. */
export function buildStory(data: StoryData[], texts: StoryText[], locale: Locale): StoryBlock[] {
  return data.map((block, index) => {
    const text = texts[index] ?? {};
    const isLedger = block.ledger !== undefined;
    return {
      kind: "story",
      chapterTitle: text.chapterTitle,
      revealAt: block.revealAt,
      tone: block.tone,
      body: block.ledger ?? text.body ?? "",
      originalLanguage: isLedger ? LEDGER_LANGUAGE : undefined,
      translation: isLedger && locale !== LEDGER_LANGUAGE ? text.translation : undefined,
    };
  });
}

export function buildLocation(stop: HiddenPubsStop, text: HiddenPubsStopText, locale: Locale): WalkLocation {
  return {
    id: stop.id,
    order: stop.order,
    name: stop.name,
    type: stop.type,
    address: stop.address,
    ...cafePosition(stop.id),
    description: text.description,
    drinkRound: { options: buildDrinkOptions(stop, text.drinks) },
    content: buildStory(stop.story, text.story, locale),
    challenge: buildChallenge(stop.challenge, text.challenge),
    bonusChallenge:
      stop.bonusChallenge && text.bonusChallenge ? buildChallenge(stop.bonusChallenge, text.bonusChallenge) : undefined,
    historicalReveal: {
      status: stop.historicalReveal.status,
      paragraphs: text.historicalReveal.paragraphs,
      sources: stop.historicalReveal.sources.map((source, index) => ({
        title: text.historicalReveal.sources[index] ?? "",
        ...source,
      })),
    },
    unlockCondition: stop.unlockCondition,
    nearbyPlaces: [],
  };
}

export function buildClue(stop: HiddenPubsStop, text: HiddenPubsStopText): Clue {
  return {
    id: stop.clue.id,
    title: text.clue.title,
    value: text.clue.value,
    icon: stop.clue.icon,
    sourceLocationId: stop.id,
  };
}
