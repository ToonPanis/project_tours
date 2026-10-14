/**
 * Who may use the Voice Studio (page + its API route).
 *
 * Hidden Antwerp has no accounts or admin login yet, so there is no "admin" to
 * check. The safest stand-in: only in development (`npm run dev` on your own
 * computer). A production build (Vercel) never serves it, so nobody can spend
 * the TTS credits through it, whatever environment variables are set there.
 * When accounts exist, replace this with a real admin check.
 */
export function isVoiceStudioEnabled(nodeEnv: string | undefined = process.env.NODE_ENV): boolean {
  return nodeEnv === "development";
}
