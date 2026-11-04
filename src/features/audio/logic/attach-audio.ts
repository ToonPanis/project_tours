import type { Locale } from "@/i18n/config";
import type { Translator } from "@/i18n/translate";
import type { AudioTrack } from "@/types/audio";
import type { WalkLocation } from "@/types/location";
import { audioGuideCredit, audioGuideVoiceKey, getAudioGuideVoice } from "../audio-guide-voice";
import { cardTrackId, getStopNarrationTracks, moreStoryTrackId, narrationHash } from "./narration";

/**
 * A walk's `audio.json`, written by scripts/generate-audio-guide.mjs: per language,
 * per track, the file and the fingerprint of the text it was made from.
 */
export interface AudioGuideFile {
  locales: Partial<Record<Locale, { tracks: Record<string, { file: string; hash: string; durationSeconds: number }> }>>;
}

/**
 * Gives every stop and slide its recording, but ONLY when the recording was made from
 * today's text with today's voice (same fingerprint). A corrected text without a new
 * recording simply has no player until the script has run: the guide never reads an
 * old version of the story. (A test lists such tracks: audio-guide.test.ts.)
 */
export function attachAudioGuide(locations: WalkLocation[], file: AudioGuideFile, locale: Locale, t: Translator): WalkLocation[] {
  const voice = getAudioGuideVoice(locale);
  const recorded = file.locales[locale]?.tracks;
  if (!voice || !recorded) return locations;
  const voiceKey = audioGuideVoiceKey(voice);
  const credit = audioGuideCredit(voice);

  return locations.map((location) => {
    if (!location.guide) return location;
    const tracks = new Map<string, AudioTrack>();
    for (const track of getStopNarrationTracks(location, t, locale)) {
      const recording = recorded[track.id];
      if (recording && recording.hash === narrationHash(track.paragraphs, voiceKey)) {
        tracks.set(track.id, { src: recording.file, durationSeconds: recording.durationSeconds, credit });
      }
    }
    if (tracks.size === 0) return location;
    const guide = location.guide;
    return {
      ...location,
      guide: {
        ...guide,
        audio: tracks.get(location.id),
        cards: guide.cards?.map((card) => ({ ...card, audio: tracks.get(cardTrackId(location.id, card.id)) })),
        moreStories: guide.moreStories?.map((card) => ({ ...card, audio: tracks.get(moreStoryTrackId(location.id, card.id)) })),
      },
    };
  });
}
