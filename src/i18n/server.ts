import { cookies, headers } from "next/headers";
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
 */
export async function getLocale(): Promise<Locale> {
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
}

export async function getTranslator(): Promise<Translator> {
  return createTranslator(await getLocale());
}
