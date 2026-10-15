/**
 * Google Cloud Text-to-Speech over its REST API, with plain fetch (no package).
 * SERVER ONLY: it reads the API key, which must never reach the browser (no
 * NEXT_PUBLIC_ prefix, and only server files import this module).
 *
 * Docs: https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd
 *       https://docs.cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize
 */

export const TTS_PROVIDER_NAME = "Google Cloud Text-to-Speech";
export const TTS_MODEL = "Chirp 3: HD";

const API = "https://texttospeech.googleapis.com/v1";
/** Google's limit is 5,000 bytes of text per request (Cyrillic letters take 2 bytes). */
export const MAX_TEXT_BYTES = 5000;

function apiKey(): string | undefined {
  return process.env.GOOGLE_TTS_API_KEY?.trim() || undefined;
}

export function isTtsConfigured(): boolean {
  return apiKey() !== undefined;
}

export class TtsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TtsError";
  }
}

async function callGoogle(path: string, init: RequestInit = {}): Promise<unknown> {
  const key = apiKey();
  if (!key) throw new TtsError("GOOGLE_TTS_API_KEY is missing in .env.local.", 503);
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-goog-api-key": key, ...init.headers },
    // Generating ~1 minute of speech takes a few seconds; give up after 60 s.
    signal: AbortSignal.timeout(60_000),
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    // Google's own explanation (e.g. "API not enabled", "billing required"); never contains the key.
    const message = (body as { error?: { message?: string } } | null)?.error?.message;
    throw new TtsError(`Google Text-to-Speech: ${message ?? `HTTP ${response.status}`}`, 502);
  }
  return body;
}

/** The names of all voices Google offers for a language, e.g. "nl-BE-Chirp3-HD-Achird". */
export async function listVoiceNames(languageCode: string): Promise<string[]> {
  const body = (await callGoogle(`/voices?${new URLSearchParams({ languageCode })}`)) as {
    voices?: { name: string }[];
  };
  return (body.voices ?? []).map((voice) => voice.name);
}

export interface SpeechRequest {
  text: string;
  languageCode: string;
  voiceName: string;
  /** 1 = normal; 0.25–2. */
  speakingRate: number;
}

/** One MP3 file of the text spoken by the voice. */
export async function synthesizeSpeech({ text, languageCode, voiceName, speakingRate }: SpeechRequest): Promise<Buffer> {
  if (Buffer.byteLength(text, "utf8") > MAX_TEXT_BYTES) {
    throw new TtsError(`The text is longer than Google's ${MAX_TEXT_BYTES}-byte limit per request.`, 400);
  }
  const body = (await callGoogle("/text:synthesize", {
    method: "POST",
    body: JSON.stringify({
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: "MP3", speakingRate },
    }),
  })) as { audioContent?: string };
  if (!body.audioContent) throw new TtsError("Google Text-to-Speech returned no audio.", 502);
  // The audio arrives as base64 text inside the JSON.
  return Buffer.from(body.audioContent, "base64");
}
