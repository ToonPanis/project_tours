import type { Locale } from "@/i18n/config";
import type { Translator } from "@/i18n/translate";
import type { GuideCard, GuideSection, GuideStopContent } from "@/types/guide";
import type { WalkLocation } from "@/types/location";
import { toSpoken } from "./pronunciation";

/**
 * WHAT the audio guide reads: exactly the texts on the stop page, in the visitor's
 * language, never a separate "audio version" of the story.
 *
 * One track per stop (its main story) and one per slide (cards and "more stories"),
 * so a slide's audio never mixes in the other slides. Not read: image captions,
 * glossary, practical info and sources (things to look at, not to listen to).
 *
 * Spooky's quests: the recordings belong to the stop page, which only opens once a
 * quest is solved, so nothing is played before the visitor found it. For a "find the
 * place" quest the stop page shows the revealed name, and so does the narration.
 */

export interface NarrationTrack {
  /** "classics-meir", or "classics-cathedral.card.matsijs" for a slide. */
  id: string;
  stopId: string;
  /** Spoken paragraphs; a short pause follows each one. */
  paragraphs: string[];
}

/** The section's kind is spoken only when it matters: a legend or fiction is never presented as history. */
const SPOKEN_KINDS: GuideSection["kind"][] = ["legend", "fiction", "interpretation"];

function sectionParagraphs(section: GuideSection, t: Translator): string[] {
  const label = SPOKEN_KINDS.includes(section.kind) ? t(`guide.sectionLabels.${section.kind}`) : null;
  // "Legend. The giant Antigoon." / "The giant Antigoon." / "Legend." (like the page: no label twice)
  const parts = [label !== section.heading ? label : null, section.heading].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? [parts.map(withFullStop).join(" "), ...section.paragraphs] : section.paragraphs;
}

/** "A king's showpiece" → "A king's showpiece." (a heading needs a pause after it). */
function withFullStop(text: string): string {
  return /[.!?…:]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;
}

function didYouKnowParagraphs(facts: string[] | undefined, t: Translator): string[] {
  return facts && facts.length > 0 ? [t("guide.didYouKnow"), ...facts] : [];
}

/** The main story of a stop: name, introduction, story, then & now, look at this, did you know, the way on. */
export function stopNarration(name: string, guide: GuideStopContent, t: Translator): string[] {
  return [
    `${withFullStop(name)} ${withFullStop(guide.subtitle)}`,
    ...guide.introduction,
    ...guide.sections.flatMap((section) => sectionParagraphs(section, t)),
    ...(guide.thenAndNow?.length ? [withFullStop(t("guide.thenAndNow")), ...guide.thenAndNow] : []),
    ...(guide.lookAt?.length
      ? [withFullStop(t("guide.lookAtThis")), ...guide.lookAt.map((item) => `${withFullStop(item.title)} ${item.body}`)]
      : []),
    ...didYouKnowParagraphs(guide.didYouKnow, t),
    ...(guide.closing?.finalLines ?? []),
    ...(guide.transitionToNext ? [guide.transitionToNext] : []),
  ];
}

/** One slide: its title, its story and its "did you know". */
export function cardNarration(card: GuideCard, t: Translator): string[] {
  const title = card.subtitle ? `${withFullStop(card.title)} ${withFullStop(card.subtitle)}` : withFullStop(card.title);
  return [title, ...card.sections.flatMap((section) => sectionParagraphs(section, t)), ...didYouKnowParagraphs(card.didYouKnow, t)];
}

/** The name on the stop page: a "find the place" quest shows the revealed name there. */
export function stopPageName(location: WalkLocation): string {
  return location.quest?.type === "location" ? location.quest.revealedName : location.name;
}

export const cardTrackId = (stopId: string, cardId: string) => `${stopId}.card.${cardId}`;
export const moreStoryTrackId = (stopId: string, cardId: string) => `${stopId}.more.${cardId}`;

/** Every track of one stop, as spoken in `locale` (names adapted for the voice, see pronunciation.ts). */
export function getStopNarrationTracks(location: WalkLocation, t: Translator, locale: Locale): NarrationTrack[] {
  const guide = location.guide;
  if (!guide) return [];
  const spoken = (paragraphs: string[]) => paragraphs.map((paragraph) => toSpoken(paragraph, locale));
  return [
    { id: location.id, stopId: location.id, paragraphs: spoken(stopNarration(stopPageName(location), guide, t)) },
    ...(guide.cards ?? []).map((card) => ({
      id: cardTrackId(location.id, card.id),
      stopId: location.id,
      paragraphs: spoken(cardNarration(card, t)),
    })),
    ...(guide.moreStories ?? []).map((card) => ({
      id: moreStoryTrackId(location.id, card.id),
      stopId: location.id,
      paragraphs: spoken(cardNarration(card, t)),
    })),
  ];
}

/**
 * A short fingerprint of what is spoken and by which voice. A changed text or voice
 * gives a new fingerprint, so its old recording is no longer used (cyrb53: a small,
 * fast, non-cryptographic hash that runs the same in Node and the browser).
 */
export function narrationHash(paragraphs: string[], voiceKey: string): string {
  const input = `${voiceKey}\n${paragraphs.join("\n\n")}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let index = 0; index < input.length; index++) {
    const code = input.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, "0");
}
