import { isVoiceStudioEnabled } from "@/features/audio/voice-studio/access";
import { getVoiceSample } from "@/features/audio/voice-studio/generate-sample";
import { findVoiceRole, TTS_PROVIDERS, type TtsProviderId } from "@/features/audio/voice-studio/voices";
import { TtsError } from "@/features/audio/tts/google-tts";
import { isLocale } from "@/i18n/config";

/**
 * GET /api/admin/voice-studio?provider=local&voice=historian&locale=nl → the sample
 * (WAV from the free local voices, MP3 from Google).
 *
 * A Route Handler: server code with a URL, like an Express route. It runs only on
 * the server, so the API key it uses never reaches the browser. It accepts only
 * the known providers, the three voices and our eight languages (no free text), so
 * it can never be used to generate anything else.
 */
export async function GET(request: Request) {
  // Development only (see access.ts): a production build answers 404, like a missing page.
  if (!isVoiceStudioEnabled()) return new Response(null, { status: 404 });

  const params = new URL(request.url).searchParams;
  const role = findVoiceRole(params.get("voice"));
  const locale = params.get("locale");
  const provider = params.get("provider") ?? "local";
  if (!role || !isLocale(locale) || !TTS_PROVIDERS.includes(provider as TtsProviderId)) {
    return Response.json({ error: "Unknown provider, voice or language." }, { status: 400 });
  }

  try {
    const sample = await getVoiceSample(role, locale, provider as TtsProviderId);
    return new Response(new Uint8Array(sample.audio), {
      headers: {
        "Content-Type": sample.format === "mp3" ? "audio/mpeg" : "audio/wav",
        "Content-Length": String(sample.audio.byteLength),
        // Shown in the studio: which voice was used, and whether it was made just now.
        "X-Voice-Name": sample.voiceName,
        "X-From-Cache": String(sample.fromCache),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const status = error instanceof TtsError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Could not generate the sample.";
    return Response.json({ error: message }, { status });
  }
}
