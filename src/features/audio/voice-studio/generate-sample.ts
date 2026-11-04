import type { Locale } from "@/i18n/config";
import { readCachedSpeech, speechCacheKey, writeCachedSpeech, type AudioFormat } from "../tts/audio-cache";
import { listVoiceNames, synthesizeSpeech, TTS_MODEL, TTS_PROVIDER_NAME, TtsError } from "../tts/google-tts";
import { synthesizeLocally } from "../tts/local-tts";
import { getVoiceStudioSampleText } from "./sample-text";
import { googleLanguageCode, pickVoiceName, type TtsProviderId, type VoiceRole } from "./voices";

/** Google's voice list per language, asked once per server start (the list call is free). */
const voiceListCache = new Map<string, Promise<string[]>>();

function availableVoices(languageCode: string): Promise<string[]> {
  let list = voiceListCache.get(languageCode);
  if (!list) {
    list = listVoiceNames(languageCode);
    // A failed call (e.g. key not yet valid) is not remembered: the next click tries again.
    list.catch(() => voiceListCache.delete(languageCode));
    voiceListCache.set(languageCode, list);
  }
  return list;
}

export interface GeneratedSample {
  audio: Buffer;
  format: AudioFormat;
  /** Which voice really spoke (shown in the studio). */
  voiceName: string;
  /** True when it came from the cache (no work, no cost). */
  fromCache: boolean;
}

/** The sample text read by one voice in one language: from the cache, or generated once. */
export async function getVoiceSample(role: VoiceRole, locale: Locale, provider: TtsProviderId): Promise<GeneratedSample> {
  const text = getVoiceStudioSampleText(locale);
  return provider === "local" ? getLocalSample(role, locale, text) : getGoogleSample(role, locale, text);
}

async function getLocalSample(role: VoiceRole, locale: Locale, text: string): Promise<GeneratedSample> {
  const voice = role.local[locale];
  if (!voice) throw new TtsError(`No free local voice is set up for this language yet (${locale}).`, 404);

  const key = speechCacheKey({ provider: "local", ...voice, speakingRate: role.speakingRate, text });
  const voiceName = `${voice.engine}: ${voice.voice}`;
  const cached = await readCachedSpeech(key, "wav");
  if (cached) return { audio: cached, format: "wav", voiceName, fromCache: true };

  await synthesizeLocally({ voice, paragraphs: text.split("\n\n"), speakingRate: role.speakingRate, key });
  const audio = await readCachedSpeech(key, "wav");
  if (!audio) throw new TtsError("The local voice wrote no audio file.", 500);
  return { audio, format: "wav", voiceName, fromCache: false };
}

async function getGoogleSample(role: VoiceRole, locale: Locale, text: string): Promise<GeneratedSample> {
  const languageCode = googleLanguageCode(role, locale);
  const voiceName = pickVoiceName(role, languageCode, await availableVoices(languageCode));
  if (!voiceName) {
    throw new TtsError(`Google has none of ${role.speakers.join(", ")} for ${languageCode} (Chirp 3: HD).`, 404);
  }

  const key = speechCacheKey({
    provider: TTS_PROVIDER_NAME,
    model: TTS_MODEL,
    voiceName,
    languageCode,
    speakingRate: role.speakingRate,
    text,
  });
  const cached = await readCachedSpeech(key, "mp3");
  if (cached) return { audio: cached, format: "mp3", voiceName, fromCache: true };

  const audio = await synthesizeSpeech({ text, languageCode, voiceName, speakingRate: role.speakingRate });
  await writeCachedSpeech(key, "mp3", audio);
  return { audio, format: "mp3", voiceName, fromCache: false };
}
