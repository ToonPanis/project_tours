import { getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import type { Locale } from "@/i18n/config";
import { getOrderedLocations } from "@/lib/walk-locations";

/**
 * The text every voice reads in the Voice Studio: the opening of Classics of
 * Antwerp's first stop (Antwerpen-Centraal), taken from the walk's own content in
 * the chosen language, so all voices read exactly the same approved text.
 *
 * Name + subtitle, the introduction and the first "did you know" (an anecdote
 * with a quote: good to hear how a voice handles a livelier moment). About 800–950
 * characters, roughly 50–65 seconds of speech.
 */
export function getVoiceStudioSampleText(locale: Locale): string {
  const [firstStop] = getOrderedLocations(getClassicsWalk(locale));
  const guide = firstStop.guide;
  if (!guide) throw new Error("The first Classics stop should have guide content");
  // Blank lines between parts: the voices pause there, like between paragraphs.
  return [`${firstStop.name}. ${guide.subtitle}.`, ...guide.introduction, guide.didYouKnow[0]].join("\n\n");
}
