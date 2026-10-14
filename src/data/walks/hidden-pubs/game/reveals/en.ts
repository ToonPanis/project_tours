import type { PubGameReveals } from "../content/types";

/**
 * English reveal texts. SERVER ONLY (they give answers away): imported only by
 * reveals/index.server.ts. Sources: the owner's concept (marked as the café's or
 * the owner's account where unverified), and the project's own researched
 * Classics texts for Quinten Matsijs. Unresearched history carries the
 * visible [Historical research required] marker (CLAUDE.md content rules).
 */
export const revealsEn: PubGameReveals = {
  cafes: {
    "pubs-rococo": {
      explanations: {
        "pubs-rococo-gates": "33 gates, drawn by Paul Smekens. [The number is still to be checked on site.]",
      },
      funFact: {
        title: "Smekens' old gates",
        kind: "history",
        status: "partially-verified",
        paragraphs: [
          "The Antwerp artist Paul Smekens drew the city's old gates and gateways for his book Oude poortjes in Antwerpen. 52 tekeningen (De Sikkel, 1951). Some of those gates still stand; others have vanished.",
          "Want to see the real ones? Follow \"The Gates of Antwerp\" walk in this app.",
        ],
      },
    },
    "pubs-barok": {
      explanations: {
        "pubs-barok-baroque": "The ceiling.",
      },
      funFact: {
        title: "Barok",
        kind: "history",
        status: "research-required",
        paragraphs: ["[Historical research required] The story of this café will follow here."],
      },
    },
    "pubs-quinten-matsijs": {
      explanations: {
        "pubs-quinten-matsijs-profession":
          "A painter: Quinten Matsijs (around 1466–1530) became one of the leading painters of Antwerp. That he was first a smith himself is a legend; his father was a smith.",
        "pubs-quinten-matsijs-game": "The barrel game (tonspel). [Its age is still to be checked.]",
      },
      funFact: {
        title: "The oldest café of Antwerp?",
        kind: "history",
        status: "research-required",
        paragraphs: [
          "Café Quinten Matsijs is known as the oldest café of Antwerp. [Historical research required: date and sources still to be checked.]",
        ],
      },
    },
    "pubs-de-kat": {
      explanations: {
        "pubs-de-kat-cats": "3 cats. [Still to be checked on site.]",
      },
      funFact: {
        title: "A café for musicians",
        kind: "history",
        status: "research-required",
        paragraphs: ["Many musicians used to come to De Kat. [Historical research required: who, and when?]"],
      },
    },
    "pubs-billies": {
      explanations: {
        "pubs-billies-dogs": "179 dogs. [Still to be checked on site.]",
      },
      funFact: {
        title: "Billie's Bier Kafétaria",
        kind: "history",
        status: "research-required",
        paragraphs: ["[Historical research required] The story of this café will follow here."],
      },
    },
    "pubs-barries": {
      explanations: {
        "pubs-barries-savings-box": "A savings box for the customers' beer.",
      },
      funFact: {
        title: "The savings box",
        kind: "cafe-story",
        status: "partially-verified",
        paragraphs: [
          "Regulars used to save in the savings box (spaarkas); the savings were mostly used to settle their bill at the end of the month.",
          "Today there's only Monopoly money in it: burglars who break into the café open the savings box first, and find nothing but Monopoly money.",
        ],
      },
    },
    "pubs-paters-vaetje": {
      explanations: {
        "pubs-paters-vaetje-matsijs":
          "The old well with its wrought-iron canopy, next to the cathedral. By tradition the ironwork is the work of Quinten Matsijs, but that has never been proven. The stone is said to read: \"Dese putkevie werd gesmeed door Quinten Matsijs. De liefde maeckte van den smidt eenen schilder.\" [Exact wording to be checked on site.]",
      },
      funFact: {
        title: "The smith who became a painter",
        kind: "legend",
        status: "partially-verified",
        paragraphs: [
          "Antwerp tells a romantic story: Quinten, a smith's son, fell in love with a girl whose father would only accept a painter, not a smith. So Quinten put down his hammer and picked up the brush.",
          "Another story says he painted a fly on a painting by his sweetheart's father, so lifelike that the man tried to brush it away, and then agreed to the marriage.",
          "Historians see these stories as legends: there is no evidence that Quinten himself ever worked as a smith. His father did.",
        ],
      },
    },
    "pubs-de-varkenspoot": {
      explanations: {
        "pubs-de-varkenspoot-name":
          "A well-known brown-café dish used to be served here: pied de cochon, or \"varkenspoot\" (pig's trotter) in Antwerp speech. [To be checked.]",
      },
      funFact: {
        title: "Pied de cochon",
        kind: "cafe-story",
        status: "partially-verified",
        paragraphs: [
          "The café owes its name to a classic dish: pied de cochon, pig's trotters, \"varkenspoot\" for Antwerpers. [Historical research required: since when, and is it still on the menu?]",
        ],
      },
    },
    "pubs-boer-van-tienen": {
      explanations: {
        "pubs-boer-van-tienen-special": "It's known as the second-oldest café of Antwerp. [To be checked.]",
      },
      funFact: {
        title: "The second-oldest café",
        kind: "history",
        status: "research-required",
        paragraphs: ["In den Boer van Tienen is known as the second-oldest café of Antwerp. [Historical research required: date and sources still to be checked.]"],
      },
    },
    "pubs-de-muze": {
      explanations: {
        "pubs-de-muze-animal": "A horse. [Still to be checked on site.]",
        "pubs-de-muze-floors": "Three floors. [Still to be checked on site.]",
      },
      funFact: {
        title: "De Muze",
        kind: "history",
        status: "research-required",
        paragraphs: ["[Historical research required] The story of this café will follow here."],
      },
    },
    "pubs-cabron": {
      explanations: {
        "pubs-cabron-cafes": "420. [Which year, and the source, are still to be checked.]",
      },
      funFact: {
        title: "A city of cafés",
        kind: "history",
        status: "research-required",
        paragraphs: ["Antwerp is said to have counted some 420 cafés. [Historical research required: in which year, and according to which source?]"],
      },
    },
    "pubs-den-engel": {
      explanations: {
        "pubs-den-engel-clock": "11:55: five to twelve.",
        "pubs-den-engel-why": "The fairy tale of Cinderella.",
      },
      funFact: {
        title: "The clock that never strikes midnight",
        kind: "cafe-story",
        status: "partially-verified",
        paragraphs: [
          "Den Engel's clock stands still at five to twelve. The café's story borrows from Cinderella: as long as the clock doesn't strike midnight, the party never has to end.",
        ],
      },
    },
  },
};
