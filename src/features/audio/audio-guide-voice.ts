import type { Locale } from "@/i18n/config";
import { findVoiceRole, type LocalVoice } from "./voice-studio/voices";

/**
 * The voice of the audio guide: "The Antwerp Guide" (voice 3), chosen in the Voice
 * Studio. Flemish (Piper "RDH") in Dutch; in the other languages the voice of that
 * role for the language (see VOICE_ROLES in voice-studio/voices.ts).
 * To change the voice later: change the role here (or its voices), then run
 * scripts/generate-audio-guide.mjs; the new voice changes every fingerprint, so
 * nothing old is played by mistake.
 */
const AUDIO_GUIDE_ROLE = findVoiceRole("antwerp-guide")!;

export const AUDIO_GUIDE_SPEAKING_RATE = AUDIO_GUIDE_ROLE.speakingRate;

export function getAudioGuideVoice(locale: Locale): LocalVoice | undefined {
  return AUDIO_GUIDE_ROLE.local[locale];
}

/** Everything about the voice that changes the sound: part of each recording's fingerprint. */
export function audioGuideVoiceKey(voice: LocalVoice): string {
  return [voice.engine, voice.voice, voice.lang ?? "", voice.speaker ?? "", AUDIO_GUIDE_SPEAKING_RATE].join(":");
}

/** "Piper · RDH (Flemish man) · MIT model, CC0 data": shown under the player. */
export function audioGuideCredit(voice: LocalVoice): string {
  return `${voice.label} · ${voice.license}`;
}
