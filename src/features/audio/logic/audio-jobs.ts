import type { Locale } from "@/i18n/config";
import type { Translator } from "@/i18n/translate";
import { getOrderedLocations } from "@/lib/walk-locations";
import type { Walk } from "@/types/walk";
import { AUDIO_GUIDE_SPEAKING_RATE, audioGuideVoiceKey, getAudioGuideVoice } from "../audio-guide-voice";
import type { LocalVoice } from "../voice-studio/voices";
import { getStopNarrationTracks, narrationHash } from "./narration";

/** One recording to make: what to say, with which voice, and where the file goes. */
export interface AudioJob {
  locale: Locale;
  trackId: string;
  hash: string;
  /** Public path, e.g. "/audio/classics-of-antwerp/nl/classics-meir-1a2b3c4d5e6f70.mp3". */
  file: string;
  voice: LocalVoice;
  speed: number;
  paragraphs: string[];
}

/**
 * Every recording of a walk in one language. The fingerprint is in the file name, so a
 * new text gets a new file (browsers may cache files forever: an old file never changes).
 */
export function getAudioJobs(walk: Walk, locale: Locale, t: Translator): AudioJob[] {
  const voice = getAudioGuideVoice(locale);
  if (!voice) return [];
  const voiceKey = audioGuideVoiceKey(voice);
  return getOrderedLocations(walk).flatMap((location) =>
    getStopNarrationTracks(location, t, locale).map((track) => {
      const hash = narrationHash(track.paragraphs, voiceKey);
      return {
        locale,
        trackId: track.id,
        hash,
        file: `/audio/${walk.slug}/${locale}/${track.id}-${hash}.mp3`,
        voice,
        speed: AUDIO_GUIDE_SPEAKING_RATE,
        paragraphs: track.paragraphs,
      };
    }),
  );
}
