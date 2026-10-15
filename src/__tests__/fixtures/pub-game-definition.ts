import type { AnswerKey, PubGameDefinition } from "@/types/pub-game";

/**
 * A made-up game with the same SHAPE as Hidden Pubs 2.0 (12 cafés, same route
 * groups), used to test the game logic before the real café data exists.
 * Ids only, no texts: the logic never needs texts.
 *
 * - café-1: 1 question with 3 options (+ the route start)
 * - café-2: 1 question with 4 options (the only way to reach "shown after 3 wrong")
 * - café-3: 2 questions
 * - café-4: a question + a per-player bonus (like Barok's)
 * - café-5: a question + a pubtask photo task (like Lucie) + a per-team bonus
 * - café-6: no question and no task at all
 */
export const testDefinition: PubGameDefinition = {
  cafes: [
    { id: "cafe-1", questions: [{ id: "q1", optionIds: ["a", "b", "c"] }], tasks: [] },
    { id: "cafe-2", questions: [{ id: "q2", optionIds: ["a", "b", "c", "d"] }], tasks: [] },
    {
      id: "cafe-3",
      questions: [
        { id: "q3a", optionIds: ["a", "b", "c"] },
        { id: "q3b", optionIds: ["a", "b", "c"] },
      ],
      tasks: [],
    },
    {
      id: "cafe-4",
      questions: [{ id: "q4", optionIds: ["a", "b", "c"] }],
      tasks: [{ id: "bonus-4", presentedAs: "bonus", evidence: "photo", points: 100, scoring: "per-player" }],
    },
    {
      id: "cafe-5",
      questions: [{ id: "q5", optionIds: ["a", "b", "c"] }],
      tasks: [
        { id: "photo-5", presentedAs: "pubtask", evidence: "photo", points: 100, scoring: "per-team" },
        { id: "bonus-5", presentedAs: "bonus", evidence: "video", points: 300, scoring: "per-team" },
      ],
    },
    { id: "cafe-6", questions: [], tasks: [] },
    { id: "cafe-7", questions: [{ id: "q7", optionIds: ["a", "b", "c"] }], tasks: [] },
    { id: "cafe-8", questions: [{ id: "q8", optionIds: ["a", "b", "c"] }], tasks: [] },
    { id: "cafe-9", questions: [{ id: "q9", optionIds: ["a", "b", "c"] }], tasks: [] },
    { id: "cafe-10", questions: [{ id: "q10", optionIds: ["a", "b", "c"] }], tasks: [] },
    { id: "cafe-11", questions: [{ id: "q11", optionIds: ["a", "b", "c"] }], tasks: [] },
    { id: "cafe-12", questions: [{ id: "q12", optionIds: ["a", "b", "c"] }], tasks: [] },
  ],
  route: [
    { cafeIds: ["cafe-1"], shuffle: false },
    { cafeIds: ["cafe-2", "cafe-3", "cafe-4", "cafe-5", "cafe-6", "cafe-7"], shuffle: true },
    { cafeIds: ["cafe-8", "cafe-9"], shuffle: false },
    { cafeIds: ["cafe-10", "cafe-11"], shuffle: true },
    { cafeIds: ["cafe-12"], shuffle: false },
  ],
};

export const testAnswerKey: AnswerKey = {
  q1: "b",
  q2: "d",
  q3a: "a",
  q3b: "c",
  q4: "a",
  q5: "a",
  q7: "a",
  q8: "a",
  q9: "a",
  q10: "a",
  q11: "a",
  q12: "a",
};

/** The route in definition order (no shuffling): handy for walking through every café. */
export const straightRoute = testDefinition.route.flatMap((group) => group.cafeIds);
