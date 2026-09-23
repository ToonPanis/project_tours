import type { Walk } from "@/types/walk";

/**
 * MOCK DATA: "The 17 Gates"
 *
 * All historical content below is PLACEHOLDER text and must be replaced with
 * researched, sourced content. Addresses and coordinates are approximate
 * points in the Antwerp city centre, not the real gate locations.
 */
export const the17GatesWalk: Walk = {
  id: "walk-17-gates",
  slug: "the-17-gates",
  title: "The 17 Gates",
  tagline: "Follow the doorways of old Antwerp",
  shortDescription:
    "A historical route along surviving gates and doorways in Antwerp, passing historic cafés and churches along the way.",
  description:
    "Hidden in plain sight, Antwerp's historic gates and doorways tell stories that most passers-by never notice. This walk follows a trail of surviving gates associated with the work of Paul Smekens, with stops at historic cafés and churches in between.\n\nAt every gate you'll uncover a story, solve a challenge and unlock the next stop on the route.",
  city: "Antwerp",
  // Placeholder estimates until the route is finalised.
  estimatedDuration: { minMinutes: 120, maxMinutes: 180 },
  distanceInMeters: 4500,
  difficulty: "easy",
  price: { amountInCents: 1295, currency: "EUR" },
  theme: "classic",
  languages: ["en"],
  routeReveal: "all",
  team: { minPlayers: 1, maxPlayers: 8 },
  contentStatus: "placeholder",
  locations: [
    {
      id: "gates-loc-1",
      order: 1,
      name: "Gate 1 (location to be researched)",
      type: "gateway",
      address: "Address to be confirmed, Antwerp city centre",
      coordinates: { latitude: 51.2213, longitude: 4.3997 },
      description: "The first doorway on the route. Your adventure starts here.",
      content: [
        {
          kind: "history",
          verification: "research-required",
          body: "[Historical research required] This text will describe the history of the first gate once research is complete. Until then, no historical claims are made here.",
        },
      ],
      challenge: {
        id: "gates-challenge-1",
        title: "Where are we?",
        type: "multiple-choice",
        question: "[Placeholder challenge] In which city does this walk take place?",
        options: ["Antwerp", "Ghent", "Bruges"],
        correctOptionIndex: 0,
        explanation: "Correct, you're in Antwerp. Real challenges will be added later.",
        hints: ["Look at the title of the website."],
      },
      unlockCondition: { type: "none" },
      nearbyPlaces: [
        {
          id: "gates-nearby-1",
          name: "Historic café (to be selected)",
          category: "cafe",
          description: "[Placeholder] A traditional Antwerp café near the first gate.",
        },
      ],
    },
    {
      id: "gates-loc-2",
      order: 2,
      name: "Gate 2 (location to be researched)",
      type: "gateway",
      address: "Address to be confirmed, Antwerp city centre",
      coordinates: { latitude: 51.2192, longitude: 4.401 },
      description: "A second doorway, hidden between the houses.",
      content: [
        {
          kind: "history",
          verification: "research-required",
          body: "[Historical research required] This text will describe the history of the second gate once research is complete.",
        },
      ],
      challenge: {
        id: "gates-challenge-2",
        title: "The city's own name",
        type: "text-answer",
        question: "[Placeholder challenge] Type the name of this walk's city in Dutch.",
        acceptedAnswers: ["antwerpen"],
        explanation: "Antwerp is 'Antwerpen' in Dutch.",
        hints: ["It starts with 'Antw…'."],
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [
        {
          id: "gates-nearby-2",
          name: "Church (to be selected)",
          category: "church",
          description: "[Placeholder] A historic church along the route.",
        },
      ],
    },
    {
      id: "gates-loc-3",
      order: 3,
      name: "Gate 3 (location to be researched)",
      type: "gateway",
      address: "Address to be confirmed, Antwerp city centre",
      coordinates: { latitude: 51.2215, longitude: 4.4062 },
      description: "The last gate of this preview route.",
      content: [
        {
          kind: "history",
          verification: "research-required",
          body: "[Historical research required] This text will describe the history of the third gate once research is complete.",
        },
      ],
      challenge: {
        id: "gates-challenge-3",
        title: "Counting gates",
        type: "multiple-choice",
        question: "[Placeholder challenge] How many gates does the full walk contain?",
        options: ["7", "12", "17"],
        correctOptionIndex: 2,
        explanation: "The full walk will visit 17 gates.",
        hints: [],
      },
      unlockCondition: { type: "proximity", radiusInMeters: 50 },
      nearbyPlaces: [],
    },
  ],
};
