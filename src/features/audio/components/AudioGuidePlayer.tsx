"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { Translator } from "@/i18n/translate";
import { SITE_NAME } from "@/lib/site";
import type { AudioTrack } from "@/types/audio";
import { clampTime, formatAudioTime, formatRate, isPlaybackRate, PLAYBACK_RATES, type PlaybackRate } from "../logic/audio-time";

/**
 * The audio guide player for one stop or one slide.
 *
 * - Never starts by itself: only "Play" starts it (browsers block autoplay anyway).
 * - Downloads nothing until Play (`preload="none"`): good for slow mobile data.
 * - One recording at a time: starting one pauses any other on the page.
 * - Leaving the stop (or the slide) stops its audio: the player disappears with it.
 * - Lock screen, headphones and car buttons work through the Media Session API.
 * - A phone call pauses the audio (the browser does that); Play continues.
 * - The chosen speed is remembered on this device for the next stops.
 */

const SKIP_SECONDS = 15;
const RATE_STORAGE_KEY = "hidden-antwerp:audio-rate";

/** The player that is playing right now, so another one can pause it. */
let playingElement: HTMLAudioElement | null = null;

function readSavedRate(): PlaybackRate {
  try {
    const saved = Number(window.localStorage.getItem(RATE_STORAGE_KEY));
    return isPlaybackRate(saved) ? saved : 1;
  } catch {
    return 1;
  }
}

function saveRate(rate: PlaybackRate) {
  try {
    window.localStorage.setItem(RATE_STORAGE_KEY, String(rate));
  } catch {
    // Private mode or blocked storage: the speed just isn't remembered.
  }
}

let volumeSupport: boolean | undefined;

/** iPhones only allow the hardware buttons to change the volume: no slider there. */
function canSetVolume(): boolean {
  if (volumeSupport === undefined) {
    try {
      const probe = document.createElement("audio");
      probe.volume = 0.5;
      volumeSupport = probe.volume === 0.5;
    } catch {
      volumeSupport = false;
    }
  }
  return volumeSupport;
}

// Device settings that never change while the page is open: nothing to subscribe to.
const subscribeToNothing = () => () => {};

interface AudioGuidePlayerProps {
  track: AudioTrack;
  /** The stop's or slide's name: the lock screen shows it. */
  title: string;
  t: Translator;
}

export function AudioGuidePlayer({ track, title, t }: AudioGuidePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.durationSeconds);
  // Browser-only settings: the server renders the defaults (1×, no volume slider), the
  // browser its own values, without a hydration mismatch (like global-error.tsx).
  const savedRate = useSyncExternalStore(subscribeToNothing, readSavedRate, () => 1 as PlaybackRate);
  const showVolume = useSyncExternalStore(subscribeToNothing, canSetVolume, () => false);
  const [chosenRate, setChosenRate] = useState<PlaybackRate | null>(null);
  const rate = chosenRate ?? savedRate;
  const [volume, setVolume] = useState(1);
  const [hasError, setHasError] = useState(false);
  const headingId = useId();

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  // Leaving the stop or slide: stop the sound and free the lock-screen controls.
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      if (playingElement === audio) {
        playingElement = null;
        clearMediaSession();
      }
    };
  }, []);

  function seekTo(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = clampTime(seconds, audio.duration || duration);
    setCurrentTime(audio.currentTime);
  }

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingElement && playingElement !== audio) playingElement.pause();
    playingElement = audio;
    setHasError(false);
    audio.playbackRate = rate;
    try {
      await audio.play();
      setUpMediaSession(audio, title, t, seekTo);
    } catch {
      // Blocked or failed (e.g. offline): the error event or the status shows it.
    }
  }

  function chooseRate(next: PlaybackRate) {
    setChosenRate(next);
    saveRate(next);
  }

  function changeVolume(next: number) {
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  }

  const shownDuration = duration || track.durationSeconds;
  const position = t("audio.positionText", { current: formatAudioTime(currentTime), total: formatAudioTime(shownDuration) });

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-sm border border-gold-deep/40 bg-parchment-dark/60 p-4"
    >
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
          updatePositionState(event.currentTarget);
        }}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => (isPlaying ? audioRef.current?.pause() : void play())}
          aria-label={isPlaying ? t("audio.pause") : t("audio.play")}
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink text-2xl text-parchment transition-colors hover:bg-umber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span aria-hidden="true">{isPlaying ? "❚❚" : "▶"}</span>
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
            <span aria-hidden="true">🎧 </span>
            {t("audio.eyebrow")}
          </p>
          <h2 id={headingId} className="font-display text-xl font-semibold leading-tight">
            {t("audio.listen")}
          </h2>
          <p className="text-sm tabular-nums text-sepia" aria-hidden="true">
            {formatAudioTime(currentTime)} / {formatAudioTime(shownDuration)}
          </p>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(shownDuration, 1)}
        step={1}
        value={Math.min(currentTime, shownDuration)}
        onChange={(event) => seekTo(Number(event.target.value))}
        aria-label={t("audio.progress")}
        aria-valuetext={position}
        className="h-11 w-full cursor-pointer accent-ink"
      />

      <div className="flex flex-wrap items-center gap-2">
        <ControlButton label={t("audio.restart")} onClick={() => seekTo(0)} symbol="⏮" />
        <ControlButton
          label={t("audio.back", { seconds: SKIP_SECONDS })}
          onClick={() => seekTo(currentTime - SKIP_SECONDS)}
          symbol={`↺ ${SKIP_SECONDS}`}
        />
        <ControlButton
          label={t("audio.forward", { seconds: SKIP_SECONDS })}
          onClick={() => seekTo(currentTime + SKIP_SECONDS)}
          symbol={`${SKIP_SECONDS} ↻`}
        />
      </div>

      <div role="group" aria-label={t("audio.speed")} className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-sepia" aria-hidden="true">
          {t("audio.speed")}
        </span>
        {PLAYBACK_RATES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === rate}
            onClick={() => chooseRate(option)}
            className={`min-h-11 min-w-14 rounded-full border px-3 text-sm font-semibold tabular-nums transition-colors ${
              option === rate ? "border-ink bg-ink text-parchment" : "border-gold-deep/40 text-sepia"
            }`}
          >
            {formatRate(option, t.locale)}
          </button>
        ))}
      </div>

      {showVolume && (
        <label className="flex items-center gap-3 text-sm font-semibold text-sepia">
          {t("audio.volume")}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
            className="h-11 flex-1 cursor-pointer accent-ink"
          />
        </label>
      )}

      {/* Always mounted, so screen readers announce a problem when it appears. */}
      <p role="status" className={hasError ? "text-sm font-semibold text-red-800" : "sr-only"}>
        {hasError ? t("audio.loadError") : ""}
      </p>

      <p className="text-xs text-sepia/80">
        {t("audio.aiVoice")} · {track.credit}
      </p>
    </section>
  );
}

function ControlButton({ label, onClick, symbol }: { label: string; onClick: () => void; symbol: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="min-h-11 min-w-11 rounded-sm border border-ink/30 px-3 font-semibold tabular-nums transition-colors hover:bg-parchment"
    >
      <span aria-hidden="true">{symbol}</span>
    </button>
  );
}

/** Lock screen / notification / headphone controls (where the browser supports them). */
function setUpMediaSession(audio: HTMLAudioElement, title: string, t: Translator, seekTo: (seconds: number) => void) {
  if (!("mediaSession" in navigator)) return;
  const session = navigator.mediaSession;
  session.metadata = new MediaMetadata({ title, artist: SITE_NAME, album: t("audio.eyebrow") });
  const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
    ["play", () => void audio.play()],
    ["pause", () => audio.pause()],
    ["seekbackward", (details) => seekTo(audio.currentTime - (details.seekOffset ?? SKIP_SECONDS))],
    ["seekforward", (details) => seekTo(audio.currentTime + (details.seekOffset ?? SKIP_SECONDS))],
    ["seekto", (details) => details.seekTime !== undefined && seekTo(details.seekTime)],
  ];
  for (const [action, handler] of handlers) {
    try {
      session.setActionHandler(action, handler);
    } catch {
      // This browser doesn't know that action.
    }
  }
}

function updatePositionState(audio: HTMLAudioElement) {
  if (!("mediaSession" in navigator) || playingElement !== audio || !Number.isFinite(audio.duration)) return;
  try {
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: Math.min(audio.currentTime, audio.duration),
    });
  } catch {
    // Older browsers: no position on the lock screen.
  }
}

function clearMediaSession() {
  if (!("mediaSession" in navigator)) return;
  navigator.mediaSession.metadata = null;
  for (const action of ["play", "pause", "seekbackward", "seekforward", "seekto"] as MediaSessionAction[]) {
    try {
      navigator.mediaSession.setActionHandler(action, null);
    } catch {
      // Not supported: nothing to clear.
    }
  }
}
