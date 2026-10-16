/**
 * EXAMPLE REVIEWS — NOT FROM CUSTOMERS (owner's brief 5.3).
 *
 * Four invented reviews to show and test the layout of /reviews. They are:
 * - labelled "Example review" wherever they appear;
 * - never counted in an average or a number of reviews, never in structured data;
 * - shown only outside production (development, Vercel previews), unless
 *   SHOW_DEMO_REVIEWS=true is set on purpose: invented reviews on a live
 *   commercial site would be "fake reviews" under EU consumer law, even labelled.
 *
 * To remove them for good once real reviews exist: delete this file and the
 * `demoReviews` part of src/app/reviews/page.tsx.
 */

export interface DemoReview {
  id: string;
  name: string;
  rating: number;
  /** The walk it's about: a walk slug, or a plain label when there is no such walk in the project. */
  walk: { slug: string } | { label: string };
  /** English, as written in the brief (marked lang="en" on the page). */
  text: string;
}

export const DEMO_REVIEWS: DemoReview[] = [
  {
    id: "demo-1",
    name: "Demo Guest 1",
    rating: 5,
    walk: { slug: "hidden-pubs" },
    text: "We had such a fun evening discovering Antwerp's traditional pubs! The challenges made everyone laugh, and we discovered places we would never have found ourselves.",
  },
  {
    id: "demo-2",
    name: "Demo Guest 2",
    rating: 5,
    walk: { slug: "poortjes-van-antwerpen" },
    text: "A brilliant way to explore the hidden history of Antwerp. The little gates and historical stories were fascinating. Perfect for discovering a different side of the city.",
  },
  {
    id: "demo-3",
    name: "Demo Guest 3",
    rating: 5,
    walk: { slug: "classics-of-antwerp" },
    text: "We loved exploring Antwerp at our own pace. The historical explanations were interesting and easy to follow. A great alternative to a traditional guided tour.",
  },
  {
    id: "demo-4",
    name: "Demo Guest 4",
    rating: 5,
    // "Hidden Streets" is not a walk in the project: shown as a label only, never linked.
    walk: { label: "Hidden Streets" },
    text: "Such a unique experience! Beautiful hidden streets, unexpected discoveries and great local stories. We really enjoyed getting away from the usual tourist attractions.",
  },
];

/** Whether the example reviews may be shown on this server (see the top of this file). */
export function showDemoReviews(): boolean {
  if (process.env.SHOW_DEMO_REVIEWS === "true") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  return process.env.NODE_ENV !== "production";
}
