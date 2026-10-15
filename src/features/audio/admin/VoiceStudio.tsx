"use client";

/**
 * ADMIN TOOL (development only, English on purpose like the playtest tools):
 * compare the candidate voices of the audio guide on the same text.
 *
 * Two providers: the free local voices (Piper, Kokoro: run on this computer) and,
 * optionally, Google Cloud Text-to-Speech (needs an API key).
 *
 * "Listen" first asks the server for the sample (a GET with provider, voice and
 * language, see app/api/admin/voice-studio/route.ts). The server makes it once and
 * keeps it in .cache/tts/, so the audio element's own request (and every later
 * replay) is instant and free.
 */
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { localeNames, locales, type Locale } from "@/i18n/config";
import type { StudioVoice, TtsProviderId } from "../voice-studio/voices";

export interface ProviderInfo {
  id: TtsProviderId;
  name: string;
  /** Free, or paid with a key. */
  summary: string;
  /** Null when it's ready; otherwise what's missing (shown instead of the buttons). */
  setupNeeded: string | null;
}

interface VoiceStudioProps {
  voices: StudioVoice[];
  /** The text all voices read, per language. */
  samples: Record<Locale, string>;
  providers: ProviderInfo[];
}

type CardState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; url: string; voiceName: string; fromCache: boolean }
  | { status: "error"; message: string };

export function sampleUrl(provider: TtsProviderId, voiceId: string, locale: Locale): string {
  return `/api/admin/voice-studio?${new URLSearchParams({ provider, voice: voiceId, locale })}`;
}

export function VoiceStudio({ voices, samples, providers }: VoiceStudioProps) {
  const [locale, setLocale] = useState<Locale>("nl");
  const [providerId, setProviderId] = useState<TtsProviderId>(providers[0].id);
  const provider = providers.find((candidate) => candidate.id === providerId) ?? providers[0];
  const text = samples[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">Admin · development only</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Hidden Antwerp — Voice Studio</h1>
      <p className="mt-3 text-sepia">
        Three candidate voices for the audio guide read the same text: the opening of Antwerpen-Centraal from the walk
        itself.
      </p>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-ink">Provider</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {providers.map((option) => (
            <label
              key={option.id}
              className="flex min-h-11 cursor-pointer gap-3 rounded-sm border border-gold-deep/40 bg-parchment p-3 has-[:checked]:border-ink has-[:checked]:bg-parchment-dark"
            >
              <input
                type="radio"
                name="voice-studio-provider"
                value={option.id}
                checked={option.id === providerId}
                onChange={() => setProviderId(option.id)}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold text-ink">{option.name}</span>
                <span className="block text-sm text-sepia">{option.summary}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {provider.setupNeeded && (
        <div role="alert" className="mt-4 rounded-sm border border-red-800/40 bg-red-50 p-4 text-sm text-red-900">
          {provider.setupNeeded}
        </div>
      )}

      <label className="mt-6 block text-sm font-semibold text-ink" htmlFor="voice-studio-language">
        Language
      </label>
      <select
        id="voice-studio-language"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="mt-1 min-h-11 w-full rounded-sm border border-gold-deep/50 bg-parchment px-3 text-ink sm:w-64"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeNames[code].nativeName}
          </option>
        ))}
      </select>

      <ul className="mt-8 grid gap-4">
        {voices.map((voice) => (
          // A new key per provider and language: switching resets the card and its player.
          <li key={`${voice.id}-${providerId}-${locale}`}>
            <VoiceCard voice={voice} provider={providerId} locale={locale} disabled={provider.setupNeeded !== null} />
          </li>
        ))}
      </ul>

      <details className="mt-8 rounded-sm border border-gold-deep/30 bg-parchment/60 p-4">
        <summary className="cursor-pointer font-semibold text-ink">The text ({text.length} characters)</summary>
        <div lang={locale} className="mt-3 space-y-3 whitespace-pre-line text-sepia">
          {text}
        </div>
      </details>
    </div>
  );
}

interface VoiceCardProps {
  voice: StudioVoice;
  provider: TtsProviderId;
  locale: Locale;
  disabled: boolean;
}

function VoiceCard({ voice, provider, locale, disabled }: VoiceCardProps) {
  const [state, setState] = useState<CardState>({ status: "idle" });
  const audioRef = useRef<HTMLAudioElement>(null);
  const localVoice = voice.local[locale];
  const unavailable = provider === "local" && !localVoice;

  async function listen() {
    if (state.status === "ready") {
      void audioRef.current?.play();
      return;
    }
    setState({ status: "loading" });
    const url = sampleUrl(provider, voice.id, locale);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setState({ status: "error", message: body?.error ?? `The server answered ${response.status}.` });
        return;
      }
      setState({
        status: "ready",
        url,
        voiceName: response.headers.get("X-Voice-Name") ?? "?",
        fromCache: response.headers.get("X-From-Cache") === "true",
      });
    } catch {
      setState({ status: "error", message: "No connection with the dev server." });
    }
  }

  return (
    <article className="rounded-sm border border-gold-deep/40 bg-parchment p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Voice {voice.number}</p>
      <h2 className="font-display text-2xl font-semibold text-ink">{voice.name}</h2>
      <p className="mt-1 text-sepia">{voice.description}</p>
      <p className="mt-2 text-sm text-sepia">
        {provider === "local" ? (
          localVoice ? (
            <>
              Voice: <strong>{localVoice.label}</strong> · license {localVoice.license} · pace {voice.speakingRate}×
            </>
          ) : (
            "No free local voice set up for this language yet."
          )
        ) : (
          <>
            Google voice: <strong>{voice.speakers[0]}</strong> in <code>{voice.languageCodes[locale]}</code> (fallbacks:{" "}
            {voice.speakers.slice(1).join(", ")}) · pace {voice.speakingRate}×
          </>
        )}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="dark" onClick={listen} disabled={disabled || unavailable || state.status === "loading"}>
          {state.status === "loading" ? "Generating…" : "▶ Listen"}
        </Button>
        {state.status === "loading" && <span className="text-sm text-sepia">First time only, about 5–30 seconds.</span>}
      </div>

      {state.status === "ready" && (
        <>
          {/* autoPlay is fine here: you just pressed "Listen". The audio's own request comes from the server cache. */}
          <audio ref={audioRef} controls autoPlay src={state.url} className="mt-4 w-full" preload="auto" />
          <p className="mt-2 text-xs text-sepia">
            Used: <code>{state.voiceName}</code> · {state.fromCache ? "from the cache" : "newly generated"}
          </p>
        </>
      )}
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {state.message}
        </p>
      )}
    </article>
  );
}
