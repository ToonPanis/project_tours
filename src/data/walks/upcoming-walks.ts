import type { UpcomingWalk } from "@/types/walk";

/** Walks announced as "coming soon". They have no route or detail page yet. */
export const upcomingWalks: UpcomingWalk[] = [
  {
    id: "walk-hidden-pubs",
    slug: "hidden-pubs",
    title: "Hidden Pubs",
    shortDescription:
      "A walk through old and unusual Antwerp cafés, combined with stories about the city.",
    city: "Antwerp",
  },
  {
    id: "walk-dark-antwerp",
    slug: "dark-antwerp",
    title: "Dark Antwerp",
    shortDescription:
      "Legends, crimes and mysteries from the darker side of Antwerp's history.",
    city: "Antwerp",
  },
  {
    id: "walk-rubens-code",
    slug: "the-rubens-code",
    title: "The Rubens Code",
    shortDescription:
      "A mystery walk around Peter Paul Rubens, historic Antwerp, its churches and works of art.",
    city: "Antwerp",
  },
];
