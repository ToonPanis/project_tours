import type { GuideStopContent } from "@/types/guide";

/** A relaxed reading pace, for reading outdoors on a phone while standing. */
export const WORDS_PER_MINUTE = 180;

export function countWords(texts: string[]): number {
  return texts.reduce((total, text) => total + (text.trim().match(/\S+/g)?.length ?? 0), 0);
}

/** Estimated reading time of a stop page, in whole minutes (at least 1). */
export function getReadingMinutes(guide: GuideStopContent): number {
  const texts = [
    ...guide.introduction,
    ...guide.sections.flatMap((section) => section.paragraphs),
    ...guide.didYouKnow,
    ...(guide.lookAt ?? []).map((item) => item.body),
    ...(guide.closing?.finalLines ?? []),
    ...(guide.thenAndNow ?? []),
    ...(guide.cards ?? []).flatMap((card) => card.sections.flatMap((section) => section.paragraphs)),
    ...(guide.searchTask?.items ?? []).flatMap((item) => [item.question, ...item.explanation]),
    ...(guide.infoBoxes ?? []).flatMap((box) => box.paragraphs),
  ];
  return Math.max(1, Math.round(countWords(texts) / WORDS_PER_MINUTE));
}
