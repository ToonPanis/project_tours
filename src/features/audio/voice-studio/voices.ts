import { locales, type Locale } from "@/i18n/config";

/**
 * The three candidate voices of the audio guide, each available from two providers:
 * - "local": free voices that run on this computer (Piper, Kokoro; see scripts/local-tts.py),
 * - "google": Google Cloud Text-to-Speech "Chirp 3: HD" (needs an API key with billing).
 * Three really different speakers, not one voice at three speeds: each role has its
 * own voice, and only a small difference in pace.
 *
 * GOOGLE: Google names a voice `<language>-Chirp3-HD-<speaker>`, e.g. "nl-BE-Chirp3-HD-Achird".
 * Not every speaker exists in every language, so each role lists speakers in order
 * of preference; the server takes the first one Google offers for that language
 * (see pickVoiceName) and the Voice Studio shows which one it used.
 */

export type VoiceRoleId = "historian" | "storyteller" | "antwerp-guide";

export type TtsProviderId = "local" | "google";
export const TTS_PROVIDERS: TtsProviderId[] = ["local", "google"];

/** A free local voice: which engine, which model/voice, and under which license. */
export interface LocalVoice {
  engine: "piper" | "kokoro";
  /** Piper: the model file in .tts/piper/ (without .onnx). Kokoro: the voice name. */
  voice: string;
  /** Kokoro only: its language code ("en-us", "en-gb", "fr-fr"…). */
  lang?: string;
  /** Piper only, for a model with several speakers: which one. */
  speaker?: number;
  /** Who speaks (shown in the studio). */
  label: string;
  /** The license of the voice model / its training data (checked on its model card). */
  license: string;
}

export interface VoiceRole {
  id: VoiceRoleId;
  number: number;
  name: string;
  description: string;
  /** Google: speaker names in order of preference (Google's descriptions in the comments). */
  speakers: string[];
  /** 1 = normal pace (both providers). Google allows 0.25–2. */
  speakingRate: number;
  /** Google: which Dutch. The Antwerp guide speaks Flemish (nl-BE), the others Netherlands Dutch. */
  dutch: "nl-BE" | "nl-NL";
  /**
   * Free local voices per language. The Antwerp guide (the audio guide's voice) has
   * all 8 languages; the other two roles only English and Dutch (the Voice Studio).
   */
  local: Partial<Record<Locale, LocalVoice>>;
}

export const VOICE_ROLES: VoiceRole[] = [
  {
    id: "historian",
    number: 1,
    name: "The Historian",
    description: "A warm, mature male voice: calm, professional, trustworthy, slightly mysterious.",
    // Sadaltager "knowledgeable", Charon "informative", Iapetus "clear" (all male).
    speakers: ["Sadaltager", "Charon", "Iapetus"],
    speakingRate: 0.95,
    dutch: "nl-NL",
    local: {
      en: { engine: "kokoro", voice: "am_michael", lang: "en-us", label: "Kokoro · Michael (American man)", license: "Apache-2.0" },
      nl: { engine: "piper", voice: "nl_NL-pim-medium", label: "Piper · Pim (Dutch man)", license: "MIT model, CC0 data" },
    },
  },
  {
    id: "storyteller",
    number: 2,
    name: "The Storyteller",
    description: "A pleasant, expressive female voice: warm, engaging and clear.",
    // Sulafat "warm", Vindemiatrix "gentle", Aoede "breezy" (all female).
    speakers: ["Sulafat", "Vindemiatrix", "Aoede"],
    speakingRate: 1,
    dutch: "nl-NL",
    local: {
      en: { engine: "kokoro", voice: "af_heart", lang: "en-us", label: "Kokoro · Heart (American woman)", license: "Apache-2.0" },
      nl: { engine: "piper", voice: "nl_BE-nathalie-medium", label: "Piper · Nathalie (Flemish woman)", license: "MIT model, CC0 data" },
    },
  },
  {
    id: "antwerp-guide",
    number: 3,
    name: "The Antwerp Guide",
    description: "A friendly, lively local guide: accessible, spontaneous, charming. Flemish when you choose Dutch.",
    // Achird "friendly", Puck "upbeat", Umbriel "easy-going" (all male).
    speakers: ["Achird", "Puck", "Umbriel"],
    speakingRate: 1.05,
    dutch: "nl-BE",
    local: {
      en: { engine: "kokoro", voice: "bm_george", lang: "en-gb", label: "Kokoro · George (British man)", license: "Apache-2.0" },
      nl: { engine: "piper", voice: "nl_BE-rdh-medium", label: "Piper · RDH (Flemish man)", license: "MIT model, CC0 data" },
      // The other languages: the clearest voice with a license that allows commercial use,
      // chosen by a speech-recognition check (see the audio guide report). French has no
      // good free male voice, so the guide is a woman there.
      fr: {
        engine: "kokoro",
        voice: "ff_siwis",
        lang: "fr-fr",
        label: "Kokoro · Siwis (French woman)",
        license: "Apache-2.0; voice data SIWIS, CC BY 4.0",
      },
      es: { engine: "kokoro", voice: "em_alex", lang: "es", label: "Kokoro · Alex (Spanish man)", license: "Apache-2.0" },
      it: { engine: "kokoro", voice: "im_nicola", lang: "it", label: "Kokoro · Nicola (Italian man)", license: "Apache-2.0" },
      de: { engine: "piper", voice: "de_DE-thorsten-high", label: "Piper · Thorsten (German man)", license: "MIT model, CC0 data" },
      ru: { engine: "piper", voice: "ru_RU-denis-medium", label: "Piper · Denis (Russian man)", license: "MIT model, CC0 data" },
      uk: {
        engine: "piper",
        voice: "uk_UA-oleksa-high",
        label: "Piper · Oleksa (Ukrainian man)",
        license: "MIT model, Apache-2.0 data",
      },
    },
  },
];

/** The Google language code for one of our languages. */
export function googleLanguageCode(role: Pick<VoiceRole, "dutch">, locale: Locale): string {
  const codes: Record<Locale, string> = {
    en: "en-GB",
    nl: role.dutch,
    fr: "fr-FR",
    es: "es-ES",
    it: "it-IT",
    de: "de-DE",
    ru: "ru-RU",
    uk: "uk-UA",
  };
  return codes[locale];
}

/**
 * The first preferred speaker Google offers in this language, or null when none of
 * them exists there (then the studio says so instead of silently using another voice).
 */
export function pickVoiceName(role: Pick<VoiceRole, "speakers">, languageCode: string, available: string[]): string | null {
  for (const speaker of role.speakers) {
    const name = `${languageCode}-Chirp3-HD-${speaker}`;
    if (available.includes(name)) return name;
  }
  return null;
}

export function findVoiceRole(id: string | null): VoiceRole | undefined {
  return VOICE_ROLES.find((role) => role.id === id);
}

/** What the Voice Studio page shows per voice (plain data: it goes to the browser). */
export interface StudioVoice {
  id: VoiceRoleId;
  number: number;
  name: string;
  description: string;
  speakers: string[];
  speakingRate: number;
  languageCodes: Record<Locale, string>;
  local: Partial<Record<Locale, LocalVoice>>;
}

export function getStudioVoices(): StudioVoice[] {
  return VOICE_ROLES.map((role) => ({
    id: role.id,
    number: role.number,
    name: role.name,
    description: role.description,
    speakers: role.speakers,
    speakingRate: role.speakingRate,
    local: role.local,
    languageCodes: Object.fromEntries(locales.map((locale) => [locale, googleLanguageCode(role, locale)])) as Record<
      Locale,
      string
    >,
  }));
}
