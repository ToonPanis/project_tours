import type { Locale } from "@/i18n/config";
import { availableLocales, cachePerLocale, pickContent } from "@/i18n/content";
import { createTranslator } from "@/i18n/translate";
import type { Walk } from "@/types/walk";
import { getMainRouteDistance, loadRouteLegs } from "../shared";
import { cafeDestination } from "./game/navigation";
import { pubGameDefinition } from "./game/definition";
import routesFile from "./game/routes.json";
import { hiddenPubsWalkTexts } from "./walk-texts";

/**
 * Hidden Pubs 2.0: the multiplayer pub game (HIDDEN_PUBS_CONCEPT.txt).
 *
 *   game/            the game itself: cafés, route rules, drinks, texts, answers (server only),
 *                    reveals (server only), positions and walking routes
 *   walk-texts.ts    what the walk list and detail page say, per language
 *
 * This module only builds the Walk the site's pages need (list, detail page).
 * Playing happens at /games/…: /walks/hidden-pubs/play sends organisers to
 * /games/new (the play page does that for every walk with experience "pub-game").
 */
function buildWalk(locale: Locale): Walk {
  const texts = pickContent(hiddenPubsWalkTexts, locale);
  // The cafés in the concept's order; each team visits them in its own random order.
  const cafeIds = pubGameDefinition.route.flatMap((group) => group.cafeIds);
  const locations = cafeIds.map((cafeId, index) => cafeDestination(cafeId, index + 1));
  const routeLegs = loadRouteLegs(routesFile);

  return {
    id: "walk-hidden-pubs",
    slug: "hidden-pubs",
    // A brand name: the same in every language.
    title: "Hidden Pubs",
    tagline: texts.tagline,
    shortDescription: texts.shortDescription,
    description: texts.description,
    city: createTranslator(locale)("common.cities.antwerp"),
    // ESTIMATE (D32): twelve cafés with a drink, a card round and a pubtask each.
    estimatedDuration: { minMinutes: 300, maxMinutes: 420 },
    // The concept order's walk; a team's random route is about as long.
    distanceInMeters: getMainRouteDistance("Hidden Pubs", locations, routeLegs),
    difficulty: "easy",
    // As before: the price is still to be decided (D32). Display only, no payments yet.
    price: { amountInCents: 1495, currency: "EUR" },
    theme: "tavern",
    experience: "pub-game",
    languages: availableLocales(hiddenPubsWalkTexts),
    routeReveal: "progressive",
    team: { minPlayers: 1, maxPlayers: 10 },
    // Fun facts still need historical research; on-site checks are open.
    contentStatus: "placeholder",
    copy: { startLabel: texts.startLabel },
    highlights: texts.highlights,
    howItWorksSteps: texts.howItWorksSteps,
    practicalInfo: texts.practicalInfo,
    routeLegs,
    locations,
  };
}

/** The walk with its texts in `locale` (English where a translation is missing). */
export const getHiddenPubsWalk = cachePerLocale(buildWalk);

/** English, e.g. for tests. */
export const hiddenPubsWalk: Walk = getHiddenPubsWalk("en");
