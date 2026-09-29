import type { PoortjesStopText } from "../types";

/**
 * Part 1: South side & Hoogstraat (gates 1–9). English master text.
 * Facts: Smekens (1951) and the Inventaris Onroerend Erfgoed, see stops.ts.
 * Quotes from those (Dutch) sources are given in translation.
 */
export const deel1: Record<string, PoortjesStopText> = {
  // ── Gate 1 ────────────────────────────────────────────────────────────
  "poortjes-rosier": {
    name: "Rosier 24",
    subtitle: "A convent door with a saint in a medallion",
    introduction: [
      "You are standing in front of the long, closed façade of a convent. Don't look for the big main gate first, but for a smaller door with an oval medallion above it. Paul Smekens drew exactly such a door here around 1950: a simple door in a curved stone frame, crowned by a bust in an oval surround.",
      "This is the first of fifty gates. In 1951 Smekens published a book with 52 measured drawings of old Antwerp gateways: front view, ground plan and scale bar, down to the centimetre. We follow in his footsteps some seventy years later. Some gates are still here, some have been moved, others have disappeared.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "Carmelite nuns have lived behind this façade for almost four centuries. The order came from Spain: in 1612 Anne of Saint Bartholomew arrived in Antwerp with two fellow sisters. In September 1615 the Archdukes Albert and Isabella laid the first stone of the new convent; the church was built between 1636 and 1639.",
          "In 1783 the convent was dissolved and used as barracks and a hay store. In 1801 the sisters were able to return, and in 1843 they also got their church back. In 1951 Smekens wrote simply: “At the convent of the Spanish Theresians. In the niche a statue of St Joseph.” By “Theresians” he means the Carmelites, the reformed order of Teresa of Ávila.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "According to the Flemish heritage inventory (Inventaris Onroerend Erfgoed), the front façade has an important baroque gateway from 1653: a round-arched gate in a bluestone frame with a keystone, flanked by pilasters. In the side walls there are also doors with a segmental arch and busts of St Joseph (right) and St Teresa (left), both from 1856.",
          "Smekens' drawing shows such a door: a segmental-arched frame with a broad moulded edge, a projecting cornice and, above it, the bust in an oval medallion. At the bottom, the ground plan shows how deep the stone frame sits in the wall.",
        ],
      },
      {
        heading: "Renaissance or baroque?",
        kind: "context",
        paragraphs: [
          "Along the way you will notice that Smekens calls many gates “Renaissance gates”, while today's inventory usually dates them to the 17th century and calls them “baroque”. That is not a contradiction you need to solve: they are two ways of naming things, one from 1951 and one from our time. In this guide we give both, and we always say who says what.",
          "We have not yet found much reliable information about Paul Smekens himself. [Historical research required]",
        ],
      },
    ],
    glossary: ["spiegelboog", "pilaster", "sluitsteen", "hardsteen"],
    thenAndNow: [
      "Then: Smekens drew a door with a bust in an oval medallion and called it a statue of St Joseph.",
      "Now: compare for yourself. Is the bust still there? Can you also see the second door with St Teresa on the other side, as the inventory describes? Which of the two doors is the one in the book?",
    ],
    didYouKnow: [
      "The busts of St Joseph and St Teresa are younger than the convent: the inventory dates them to 1856, more than two centuries after the church.",
    ],
    lookAt: [
      {
        title: "The ground plan under the drawing",
        body: "Look at the narrow strip below the door in the drawing: it is a cross-section of the wall. It shows how deep the stone frame sits in the façade. Smekens drew one for every gate, and you will see these little plans many more times.",
      },
    ],
    transitionToNext: "Walk to the Lange Gasthuisstraat. At number 37 a gate with a balcony is waiting for you, together with a detail that, according to Smekens, does not belong there.",
  },

  // ── Gate 2 ────────────────────────────────────────────────────────────
  "poortjes-lange-gasthuisstraat": {
    name: "Lange Gasthuisstraat 37",
    subtitle: "An abbey's town house",
    introduction: [
      "Look for the wide gate with the small wrought-iron balcony above it. First look at the frame of the gate itself: blocks of stone that alternately stick out, and at the top a keystone shaped like a scroll.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "For centuries this building was the “refuge” of the Norbertine abbey of Tongerlo: its town house in Antwerp, from 1535 to 1581 and from 1585 to 1699. An abbey in the countryside needed such a house to do business in the city, and as a safe shelter in troubled times.",
          "The house had some notable residents: Philip of Marnix, Lord of Saint-Aldegonde, lived here in 1583–1584 as one of the city's burgomasters, and later burgomaster Willem Andreas de Caters (1802–1831). From 1699 to 1724 it belonged to the sculptor Hendrik Frans Verbruggen, who had major alterations made. In 1941 the architect Max Winders designed its restoration and its merger with the house next door into an office building.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes a 17th-century baroque round-arched gateway in bluestone, with a doubly rusticated and moulded reveal, a scrolled keystone, moulded imposts and plinth blocks. Broad volutes lead up to a drip moulding carrying a wrought-iron French balcony. The wooden double door has panels and a carved central post.",
        ],
      },
      {
        heading: "What caught Smekens' eye",
        kind: "interpretation",
        paragraphs: [
          "Smekens calls this a “Renaissance gate with balcony” and makes a sharp remark: “The cartouche with the carved woman's head in Louis XV style seems apocryphal to us in this Renaissance gate.” In other words, he thought the woman's head came from a later period and style than the gate itself. Whether it was added later, we don't know for certain.",
        ],
      },
    ],
    glossary: ["refugiehuis", "geblokt", "voluut", "makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Then: Smekens drew a gate with a balcony and a cartouche with a woman's head.",
      "Now: look for the woman's head. Is it still there? And does it, as Smekens felt, clash with the sterner blocks of the gate?",
    ],
    didYouKnow: [
      "Philip of Marnix of Saint-Aldegonde, who lived here, is often mentioned as the possible author of the Wilhelmus, the Dutch national anthem. That authorship, however, has never been proven with certainty.",
    ],
    lookAt: [
      {
        title: "Two styles, one gate",
        body: "Compare the heavy, straight blocks of the frame with the curling decoration at the top. Can you see the difference in character that Smekens meant?",
      },
    ],
    transitionToNext: "Walk to the Everdijstraat. Two gates stand close together there, and one of them belonged to a man known as “the benefactor of the poor”.",
  },

  // ── Gates 3 and 4 ─────────────────────────────────────────────────────
  "poortjes-everdijstraat": {
    name: "Everdijstraat 45 and 31",
    subtitle: "Two gates, one benefactor",
    introduction: [
      "In this short street, two gates from the book stand a few dozen metres apart. Start at number 45: a house with a stepped gable and a monumental gate on the right. Then walk on to number 31, the mansion “Hagelsteen”.",
    ],
    sections: [
      {
        heading: "Number 45",
        kind: "history",
        paragraphs: [
          "The house at number 45 goes back to the second half of the 16th century; the gate was added in the second half of the 17th century. The inventory describes “a moulded and rusticated bluestone frame with a keystone, resting on carved Ionic pilasters”, topped by a corniced drip moulding on a heavy dentil course, flanked by broad scrolled volutes with garlands and rosettes.",
          "For this gate Smekens writes only “Renaissance gate”. Little is known for certain about the original function of this particular gate.",
        ],
      },
      {
        heading: "Number 31: Hagelsteen",
        kind: "history",
        paragraphs: [
          "The mansion Hagelsteen dates from the late 16th century. In 1621 the Van Eeden family sold it to Cornelis Lantschot (1572–1656), a wealthy merchant. Smekens calls him “the benefactor of the poor”. According to the inventory, the gate is a bluestone baroque gateway from the second half of the 17th century: a rusticated round arch with a broad scrolled keystone on Ionic pilasters with recessed shafts.",
          "The house changed a great deal later on: a third storey was added in 1880, and around 1925 the façade was rendered with cement. Behind the façade lies a courtyard from the first quarter of the 17th century with an arcade on Tuscan columns.",
        ],
      },
    ],
    glossary: ["kapiteel", "waterlijst", "trapgevel"],
    thenAndNow: [
      "Then: at number 31 Smekens drew a “Renaissance gate with surround”. The book doesn't mention any changes.",
      "Now: the façade of number 31 was rendered around 1925. See whether the gate in the drawing still stands as clearly “apart” from the façade as it did then, or whether the newer façade has grown around it.",
    ],
    didYouKnow: [
      "Cornelis Lantschot comes back later on this walk. He founded an almshouse on the Falconrui; Smekens drew a small gate there too, which has since disappeared.",
    ],
    lookAt: [
      {
        title: "Ionic capitals",
        body: "At the top of the pilasters beside the gate, look for the two small scrolls. That is the hallmark of an Ionic capital. Both gates here have them.",
      },
    ],
    transitionToNext: "Around the corner, in the Groendalstraat, stands a house where the bakers were in charge. Look for not one but two small gates.",
  },

  // ── Gate 5 ────────────────────────────────────────────────────────────
  "poortjes-groendalstraat": {
    name: "Groendalstraat 18-20",
    subtitle: "The bakers' house",
    introduction: [
      "Look for the low house with the striking bluestone ground floor. It has two small doorways, each with a fan-shaped fanlight. Smekens drew one of them.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "The core of the house Sint-Christoffel (St Christopher) dates from the period 1562–1592. In 1621 it passed to the bakers' guild, the trade association of the bakers. Smekens writes that it was “the property of the dean of the bakers”, the elected head of the guild.",
          "In 1672 the entrances received their baroque doorways. Smekens gives that year too: “Dates from 1672.”",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes “bluestone baroque doorways with a fan-shaped fanlight in rusticated, arched frames with scrolled keystones”. The whole ground floor is a striking bluestone shopfront. The upper floor is built of brick and sandstone in bands: horizontal strips of pale sandstone in the red brickwork.",
        ],
      },
    ],
    glossary: ["waaier", "bovenlicht"],
    thenAndNow: [
      "Then: Smekens drew one of the two doorways, with its fanlight and scrolled keystone.",
      "Now: there are two. Which one is in the book? Look at the details in the fanlight and around the keystone.",
    ],
    didYouKnow: [
      "St Christopher is the saint who, according to legend, carried the Christ child across a river. Many Antwerp houses had a name like this instead of a house number; house numbers only came much later.",
    ],
    transitionToNext: "Now a longer walk west, towards the Scheldt, to the Kloosterstraat. The house you will see there bears the name of a famous man who never lived in it.",
  },

  // ── Gate 6 ────────────────────────────────────────────────────────────
  "poortjes-kloosterstraat": {
    name: "Kloosterstraat 13",
    subtitle: "The house that got the wrong name",
    introduction: [
      "In front of you is a long, low façade eight windows wide, in soft yellow sandstone. In the middle of the façade is a sturdy bluestone gateway. Behind it lies a courtyard with four wings.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "The complex dates from 1547–1555, as a date stone and beam ends show. In 1619 its owner Peter Paschier de Deckere had major alterations made. In 1698 the merchant Norberto Schut had the architect Hendrik Frans Verbruggen add a fourth, baroque wing. Smekens refers to this: “the courtyard of the mansion De Deckere, dating from 1698”.",
          "Today the house is called the Mercator-Orteliushuis. Smekens already considered that a mistake in 1951: “Wrongly called: the house of Abraham Ortelius.” The inventory confirms it: the famous cartographer (1527–1598) lived at number 43 in this street, a house that was demolished in 1937.",
          "The building fell into decay until the Vereniging van Historische Woonsteden (Society of Historic Dwellings) bought it in 1943. It was listed in 1946, donated to the city in 1950 and restored in 1952–1953.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes the street gate as a “17th-century baroque bluestone door frame: a rusticated round arch set within a moulded segmental arch with plinth blocks, imposts, a carved keystone and a drip moulding”.",
        ],
      },
    ],
    glossary: ["neuten", "imposten", "rondboog"],
    thenAndNow: [
      "Then: Smekens saw the gate while the house was in decay, just before or during the restoration of 1952–1953.",
      "Now: look at the yellow sandstone of the façade and the dark blue of the bluestone. That contrast makes the gate easy to see today.",
    ],
    didYouKnow: [
      "A house named after a celebrity who never lived there is no Antwerp exception. Above all, it shows how much a city likes to give its great names an address.",
    ],
    transitionToNext: "Walk back to the centre, to the Hoogstraat, one of the oldest streets in the city. Three gates from the book are almost next to each other there.",
  },

  // ── Gates 7 and 8 (+ plate 3) ─────────────────────────────────────────
  "poortjes-hoogstraat": {
    name: "Hoogstraat 15-21",
    subtitle: "Old house names and a hidden alley",
    introduction: [
      "You are in the Hoogstraat, among sandstone stepped gables. Within these few metres Smekens drew three gates: number 15B (“De Wolsack”, the wool sack), number 21 and, as an extra, number 15. Look at the ground floors: most are shops now, but between the shop windows old gate frames survive.",
    ],
    sections: [
      {
        heading: "The street",
        kind: "history",
        paragraphs: [
          "The Hoogstraat is mentioned as early as 1232 as “alta platea” and has been called Hoogstraat since 1305. It linked the city centre with the south. In 1443 a fire destroyed almost all of its buildings. In the 16th century linen was traded here.",
        ],
      },
      {
        heading: "Houses with names",
        kind: "history",
        paragraphs: [
          "About De Wolsack, Smekens writes: “This house was already mentioned in 1461.” The inventory describes “Wolsack, Gulden Osch and Schilt van Mechelen” as three traditional deep houses from the second half of the 16th century, together seven bays wide, with an all-sandstone façade and three stepped gables. The gate is a round-arched gateway in a baroque bluestone frame from around 1650.",
          "Note: the inventory places these houses at Hoogstraat 15A, 17 and 17A today. So the house numbers have changed since 1951. The house names shifted too: the right-hand house was called “Lyntworm” in 1561, “Cleynen gulden Schilt” in 1579 and “Schilt van Mechelen” in 1638.",
        ],
      },
      {
        heading: "Number 21 and the Vlaaikensgang",
        kind: "history",
        paragraphs: [
          "Smekens calls the gate at number 21 “strictly classical, with fanciful triglyphs”. According to him it gave access to “one of the very old plots of the Hoogstraat, called De Lintworm (the tapeworm)”, with “also an exit along the Vlaaikensgang of the Koornmarkt”.",
          "We found no separate inventory entry for this gate. Whether it is still at number 21 today needs to be checked on site. [To be verified on site]",
          "According to Smekens, number 15, “De grooten gulden scilt” (the great golden shield), was also connected to the Vlaaikensgang. The inventory confirms a historical link between the Vlaaikensgang and the house at Hoogstraat 15 since 1561. That alley lies behind these houses and has its main entrance on the Oude Koornmarkt.",
        ],
      },
      {
        heading: "The architecture of number 15",
        kind: "history",
        paragraphs: [
          "According to the inventory, the gate of “Grooten gulden Schilt” (Hoogstraat 15) is a basket-arched gateway in a baroque bluestone frame from around 1650, with a rusticated reveal in a strapwork shouldered arch, volutes and a carved cartouche with a blank coat of arms as keystone. The wooden door shows reliefs of the Virgin Mary, John the Evangelist, Elizabeth of Hungary and a beggar.",
        ],
      },
    ],
    glossary: ["triglief", "korfboog", "schouderboog", "cartouche", "diephuis"],
    thenAndNow: [
      "Then: in 1951 these houses had different numbers from today. Smekens' “15B” is not today's 15B.",
      "Now: hold the three drawings up against the façades. Which gate can you find, and under which house number is it today?",
    ],
    didYouKnow: [
      "A “tapeworm” sounds like a strange name for a house, but Antwerp house names could be almost anything: animals, objects, saints, cities. They often hung on a signboard or a gable stone, long before house numbers existed.",
    ],
    lookAt: [
      {
        title: "The door of number 15",
        body: "Look for the wooden door with carved figures. Can you spot a figure begging for alms? According to the inventory, it is a beggar next to St Elizabeth of Hungary.",
      },
    ],
    transitionToNext: "Walk to the Suikerrui, the wide street leading to the Scheldt. Look for a golden ram.",
  },

  // ── Gate 9 ────────────────────────────────────────────────────────────
  "poortjes-suikerrui": {
    name: "Suikerrui 22",
    subtitle: "De Gouden Ram (The Golden Ram)",
    introduction: [
      "On the Suikerrui, look for the gate with a gilded ram as its keystone. Then look at the rest of the frame: rosettes on the pilasters and around the arch.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "De Gouden Ram is a 17th-century mansion. In 1823 the Dutch pharmacist Klaas Jan Cupérus (1769–1851) opened a drugstore and tea business here. The family firm Cupérus became a well-known tea merchant and took part in the world's fairs of 1885, 1894 and 1930. In 1926 the shop moved to the Schoenmarkt.",
          "Inside, the house preserves a Japanese room with lacquer panels from the Edo period, showing dragons, roosters, birds, fish and butterflies. The room is not open to visitors.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes a baroque round-arched gateway of bluestone, probably 17th-century: “The moulded and rusticated reveal with plinth blocks, ears and jointed imposts is accentuated by rosettes and a cartouche with a gilded ram as keystone.” Smekens sums it up: “With a ram on a cartouche and roses on the pilasters and the arches.”",
        ],
      },
    ],
    glossary: ["rondboog", "neuten"],
    thenAndNow: [
      "Then: Smekens drew the ram in black and white, as part of the stone.",
      "Now: the ram is gilded and catches the eye at once. Count the rosettes: are there as many as in the drawing?",
    ],
    didYouKnow: [
      "The name “De Gouden Ram” lives on today in the business in the building; the Cupérus tea firm itself moved to the Schoenmarkt as early as 1926.",
    ],
    transitionToNext: "End of the first part. Walk to the Grote Markt: time for a break in the heart of the city.",
  },
};
