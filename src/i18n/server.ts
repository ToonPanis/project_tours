import { cookies, headers } from "next/headers";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { defaultLocale, isLocale, LOCALE_COOKIE, matchLocale, type Locale } from "./config";
import { createTranslator, type Translator } from "./translate";

/**
 * The visitor's language, for Server Components and metadata:
 *   1. the language they chose (cookie), otherwise
 *   2. their browser's preferred language (Accept-Language), otherwise
 *   3. English.
 *
 * Reading cookies makes the page render per request (dynamic), which is what
 * lets every page arrive in the right language without a flash of English.
 *
 * Wrapped in React's cache(): metadata, layout, page, header and footer all ask,
 * but it is worked out once per request.
 */
export const getLocale = cache(async function getLocale(): Promise<Locale> {
  try {
    const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
    if (isLocale(chosen)) return chosen;
    return matchLocale((await headers()).get("accept-language"));
  } catch (error) {
    // Next.js signals "this page is dynamic" by throwing: let that through.
    unstable_rethrow(error);
    // Outside a request (e.g. unit tests): English.
    return defaultLocale;
  }
});

/** The translator for this request's language (one per request, see getLocale). */
export const getTranslator = cache(async function getTranslator(): Promise<Translator> {
  return createTranslator(await getLocale());
});
