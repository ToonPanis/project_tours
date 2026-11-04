/**
 * One recorded part of the audio guide: the story of a stop, or of one slide.
 * The files are made beforehand (scripts/generate-audio-guide.mjs) and served as
 * plain static files: playing them never calls a text-to-speech service.
 */
export interface AudioTrack {
  /** Path under /public, e.g. "/audio/classics-of-antwerp/nl/classics-meir-3f9a….mp3". */
  src: string;
  durationSeconds: number;
  /** Which AI voice reads it, with the voice's license where it asks for credit. */
  credit: string;
}
