import type { PubGameDefinition } from "@/types/pub-game";
import routeGroups from "./route-groups.json";

/**
 * Hidden Pubs 2.0: the technical data of the 12 cafés, from
 * HIDDEN_PUBS_CONCEPT.txt. Ids only: every text (questions, options, hints,
 * fun facts) will live per language in content/, and the correct answers in
 * answers.server.ts (server only).
 *
 * Option ids describe the option, so the answer key reads like the concept.
 * Open points are in HIDDEN_PUBS_DATA_AUDIT.md (D20, D22, D23, F1–F8).
 */
export const pubGameDefinition: PubGameDefinition = {
  cafes: [
    {
      id: "pubs-rococo",
      questions: [
        // PROPOSAL (D20): the concept gives only the answer (33); the two other options await approval.
        { id: "pubs-rococo-gates", optionIds: ["25", "33", "41"] },
      ],
      tasks: [],
    },
    {
      id: "pubs-barok",
      questions: [{ id: "pubs-barok-baroque", optionIds: ["facade", "toilets", "ceiling"] }],
      tasks: [
        // 100 points for every player who takes part (D3: any drink counts).
        { id: "pubs-barok-shot", presentedAs: "bonus", evidence: "photo", points: 100, scoring: "per-player" },
      ],
    },
    {
      id: "pubs-quinten-matsijs",
      questions: [
        // PROPOSAL (D20): the concept asks "a painter, a smith or both?" without formatted options.
        { id: "pubs-quinten-matsijs-profession", optionIds: ["painter", "smith", "both"] },
        { id: "pubs-quinten-matsijs-game", optionIds: ["frog-game", "barrel-game", "trou-madame"] },
      ],
      tasks: [],
    },
    {
      id: "pubs-de-kat",
      questions: [
        // PROPOSAL (D20): the concept gives only the answer (3).
        { id: "pubs-de-kat-cats", optionIds: ["2", "3", "5"] },
      ],
      tasks: [{ id: "pubs-de-kat-tap", presentedAs: "bonus", evidence: "photo", points: 200, scoring: "per-team" }],
    },
    {
      id: "pubs-billies",
      questions: [{ id: "pubs-billies-dogs", optionIds: ["179", "210", "230"] }],
      tasks: [],
    },
    {
      id: "pubs-barries",
      questions: [{ id: "pubs-barries-savings-box", optionIds: ["cafe-game", "staff-wages", "customer-savings"] }],
      tasks: [
        // "Find Lucie, take a photo": part of the pubtask, 100 after approval (D22).
        { id: "pubs-barries-lucie", presentedAs: "pubtask", evidence: "photo", points: 100, scoring: "per-team" },
      ],
    },
    {
      id: "pubs-paters-vaetje",
      questions: [{ id: "pubs-paters-vaetje-matsijs", optionIds: ["cathedral-paintings", "nello-patrasche", "well"] }],
      tasks: [
        { id: "pubs-paters-vaetje-staff", presentedAs: "bonus", evidence: "photo", points: 100, scoring: "per-team" },
      ],
    },
    {
      id: "pubs-de-varkenspoot",
      questions: [{ id: "pubs-de-varkenspoot-name", optionIds: ["pig-market", "pigs-trotters", "regular"] }],
      tasks: [],
    },
    {
      id: "pubs-boer-van-tienen",
      questions: [{ id: "pubs-boer-van-tienen-special", optionIds: ["second-oldest", "musicians", "square"] }],
      tasks: [
        // The concept names no evidence; a photo lets the host approve it like the other bonuses.
        { id: "pubs-boer-van-tienen-rps", presentedAs: "bonus", evidence: "photo", points: 100, scoring: "per-team" },
      ],
    },
    {
      id: "pubs-de-muze",
      questions: [
        { id: "pubs-de-muze-animal", optionIds: ["goose", "cow", "horse"] },
        { id: "pubs-de-muze-floors", optionIds: ["1", "2", "3"] },
      ],
      tasks: [],
    },
    {
      id: "pubs-cabron",
      questions: [{ id: "pubs-cabron-cafes", optionIds: ["200", "260", "420"] }],
      tasks: [],
    },
    {
      id: "pubs-den-engel",
      questions: [
        { id: "pubs-den-engel-clock", optionIds: ["10-50", "11-55", "08-20"] },
        { id: "pubs-den-engel-why", optionIds: ["cinderella", "battery", "angels"] },
      ],
      tasks: [
        { id: "pubs-den-engel-clog", presentedAs: "bonus", evidence: "video", points: 300, scoring: "per-team" },
      ],
    },
  ],
  // Rococo → cafés 2–7 shuffled → De Varkenspoot → Boer van Tienen → De Muze/Cabron shuffled
  // → Den Engel. In route-groups.json, shared with the route generator script.
  route: routeGroups.groups,
};
