/** "85" → "01:25"; an hour or more → "1:02:05". Unknown or negative → "00:00". */
export function formatAudioTime(totalSeconds: number): string {
  const seconds = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.floor(totalSeconds) : 0;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const mmss = `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  return hours > 0 ? `${hours}:${mmss}` : mmss;
}

/** The playback speeds the player offers; 1 is the default. */
export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

export function isPlaybackRate(value: unknown): value is PlaybackRate {
  return PLAYBACK_RATES.includes(value as PlaybackRate);
}

/** A new position, kept inside the recording. */
export function clampTime(seconds: number, duration: number): number {
  return Math.min(Math.max(seconds, 0), Number.isFinite(duration) && duration > 0 ? duration : 0);
}

/** "0.75×" / "0,75×": the speed in the visitor's number format. */
export function formatRate(rate: number, locale: string): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(rate)}×`;
}
