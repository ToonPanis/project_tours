import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { MockWalkRepository } from "./mock-walk-repository";
import type { WalkRepository } from "./walk-repository";

/**
 * The walk repository the whole app uses.
 * Swap this for a database-backed implementation later. No page needs to change.
 */
export const walkRepository: WalkRepository = new MockWalkRepository();

/**
 * One walk, read at most once per request: a page's generateMetadata and the
 * page itself both need it, and React's cache() shares the result between them
 * (it matters once the data comes from a database).
 */
export const getWalk = cache((slug: string, locale: Locale) => walkRepository.getWalkBySlug(slug, locale));

export type { WalkRepository } from "./walk-repository";
