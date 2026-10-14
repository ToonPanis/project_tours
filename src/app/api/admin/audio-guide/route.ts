import { getAudioJobs } from "@/features/audio/logic/audio-jobs";
import { isVoiceStudioEnabled } from "@/features/audio/voice-studio/access";
import { locales } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import { walkRepository } from "@/lib/repositories";

/**
 * GET /api/admin/audio-guide?walk=classics-of-antwerp → every recording the audio
 * guide needs, in every language (text, voice, file name), as JSON.
 *
 * Read by scripts/generate-audio-guide.mjs, which makes the missing files. It lives
 * here because the walk texts are TypeScript, which Next.js already understands.
 * Development only, like the Voice Studio.
 */
export async function GET(request: Request) {
  if (!isVoiceStudioEnabled()) return new Response(null, { status: 404 });

  const slug = new URL(request.url).searchParams.get("walk") ?? "";
  const jobs = [];
  for (const locale of locales) {
    const walk = await walkRepository.getWalkBySlug(slug, locale);
    if (!walk) return Response.json({ error: `Unknown walk "${slug}".` }, { status: 404 });
    jobs.push(...getAudioJobs(walk, locale, createTranslator(locale)));
  }
  return Response.json({ walk: slug, jobs });
}
