import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VoiceStudio, type ProviderInfo } from "@/features/audio/admin/VoiceStudio";
import { isTtsConfigured, TTS_MODEL, TTS_PROVIDER_NAME } from "@/features/audio/tts/google-tts";
import { isLocalTtsInstalled, LOCAL_TTS_NAME } from "@/features/audio/tts/local-tts";
import { isVoiceStudioEnabled } from "@/features/audio/voice-studio/access";
import { getVoiceStudioSampleText } from "@/features/audio/voice-studio/sample-text";
import { getStudioVoices } from "@/features/audio/voice-studio/voices";
import { locales, type Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Voice Studio", robots: { index: false, follow: false } };

/**
 * /admin/audio-test: compare the candidate voices (development only).
 * The app has no accounts yet, so "admins only" = only on your own computer
 * (`npm run dev`); in a production build this page doesn't exist (404).
 */
export default function VoiceStudioPage() {
  if (!isVoiceStudioEnabled()) notFound();

  const samples = Object.fromEntries(locales.map((locale) => [locale, getVoiceStudioSampleText(locale)])) as Record<
    Locale,
    string
  >;
  // Only "is it set up?" reaches the browser, never a key.
  const providers: ProviderInfo[] = [
    {
      id: "local",
      name: LOCAL_TTS_NAME,
      summary: "Free, open source, runs on this computer. English and Dutch (Flemish) for now.",
      setupNeeded: isLocalTtsInstalled()
        ? null
        : "The local voices are not installed yet. Run scripts/setup-local-tts.ps1 (PowerShell), then reload.",
    },
    {
      id: "google",
      name: `${TTS_PROVIDER_NAME} (optional)`,
      summary: `${TTS_MODEL}: paid after 1M characters per month, needs an API key with billing.`,
      setupNeeded: isTtsConfigured()
        ? null
        : "No GOOGLE_TTS_API_KEY in .env.local (see .env.example). Restart npm run dev after adding it.",
    },
  ];

  return <VoiceStudio voices={getStudioVoices()} samples={samples} providers={providers} />;
}
