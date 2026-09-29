import type { PoortjesStopText } from "../types";

/** Part 4: Falconplein & old port district (gates 42–50) and Part 5: MAS. English master text. */
export const deel4: Record<string, PoortjesStopText> = {
  // ── Gate 42 (+ vanished 43) ──────────────────────────────────────────
  "poortjes-falconplein": {
    name: "Falconplein 39: the Falconpoort",
    subtitle: "The last piece of a convent",
    introduction: [
      "On the Falconplein, look for a large bluestone gate that has been built into a modern housing block. Look at the cartouche at the top: it contains a Latin text with a few strikingly large letters.",
    ],
    sections: [
      {
        heading: "The convent of the Falcontines",
        kind: "history",
        paragraphs: [
          "The Falconpoort is the only remnant of the convent of the Falcontine sisters. It was founded in the 14th century by Falco de Lampage, master of the mint of Duke John III of Brabant; Smekens calls him “the rich Italian Falco de Lampagne”. In the 15th century the convent grew considerably, and by the early 16th century it covered a whole block between the Oudeleeuwenrui, the Generaal Belliardstraat, the Falconrui and the Falconplein.",
          "In 1784 the convent was abolished by Emperor Joseph II. It became a military hospital in 1792 and burned down a year later. Under French rule the site was sold to the city in 1810; on Napoleon's orders the Falcon barracks were built there, which remained until they were demolished in 1941. Smekens writes in 1951: “now also demolished”.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The gate dates from 1671: a round arch in bluestone, framed by ringed pilasters with decorated capitals. On top there originally stood a statue of St Augustine, the patron saint of the convent. The cartouche bears the inscription “VerVs RegVLarIVM DoCtor”, “the true teacher of the regular clergy”, a reference to Augustine.",
          "The gate has been protected as a monument since 22 December 1943.",
        ],
      },
      {
        heading: "The old port district",
        kind: "context",
        paragraphs: [
          "From here the city changes. In the 16th century Gilbert van Schoonbeke laid out the “Nieuwstad” (New Town) north of the old city, with houses and three inner harbours: the Brouwersvliet, the Timmervliet and the Middelvliet. Where there are streets today, there was water then, and trade came right up to the houses.",
        ],
      },
    ],
    glossary: ["chronogram", "kapiteel"],
    thenAndNow: [
      "Then: Smekens drew the gate standing on its own, with the inscription in the cartouche. He writes in the past tense that a statue of Augustine “proudly stood” on top.",
      "Now: the gate stands in a reconstructed housing block. According to the inventory, a 19th-century statue of Our Lady with remains of wrought iron recalls the workers' houses that used to lie behind the gate.",
    ],
    didYouKnow: [
      "The inscription is a chronogram. Add up the large letters that are also Roman numerals: V (5) + V (5) + V (5) + L (50) + I (1) + V (5) + M (1000) + D (500) + C (100). Together: 1671, the year the gate was built.",
    ],
    lookAt: [
      {
        title: "Work it out yourself",
        body: "In the cartouche, look for the letters written larger than the rest. Add them up as Roman numerals. Do you get 1671?",
      },
    ],
    transitionToNext: "Walk to the Oudeleeuwenrui. Look for a hand in the stone there.",
  },

  // ── Gate 45 (+ vanished 44) ──────────────────────────────────────────
  "poortjes-oudeleeuwenrui": {
    name: "Oudeleeuwenrui 58",
    subtitle: "De Gulden Handt (The Golden Hand)",
    introduction: [
      "Look for a baroque gate crowned by a broken pediment and a cartouche. Look closely at the cartouche: it contains a hand, and a year.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "Smekens: “Dating from 1669, with a depiction of a hand. Remnant of the brewery De gulden handt.” According to the inventory, the gate does indeed come from the De Gulden Handt brewery and dates from 1669.",
          "Why the gate stands here is a second story. The distillery “Het Anker” (The Anchor), reportedly active since 1753, was taken over around 1815 by Jean Meeùs. His grandson Jules Meeûs moved the business to the Oudeleeuwenrui in 1897, and there the old brewery gate was built into a new façade.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The gate is built of bluestone: a round arch with a volute keystone on “rusticated pilasters with capitals”, in “a mirror-arched field with volutes and guttae”, crowned by a broken pediment with a cartouche showing the hand and the year.",
        ],
      },
    ],
    glossary: ["fronton", "voluut"],
    thenAndNow: [
      "Then: in 1951 the gate had already stood here for more than fifty years, in the façade of the distillery.",
      "Now: the building is well preserved, but in the 1950s the original mezzanine and saddle roofs gave way to a full second floor. Compare the hand in the cartouche with the drawing.",
    ],
    didYouKnow: [
      "On the nearby Hessenplein Smekens drew a gate of the brewery “De Bel” (The Bell), “as witnessed by the round jingle bell in the cartouche keystone”. He gives no house number; the gate has disappeared.",
    ],
    transitionToNext: "Walk to the Lange Noordstraat. Look for a bell in the façade there.",
  },

  // ── Gate 46 ───────────────────────────────────────────────────────────
  "poortjes-lange-noordstraat": {
    name: "Lange Noordstraat 19",
    subtitle: "De Clocke: where weights and measures were checked",
    introduction: [
      "Look for a wide, low house with a simple round-arched gate. Above the gate is a façade stone with a bell in low relief.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "De Clocke (The Bell) was a former coaching inn, where travellers could stable their horse and cart. The oldest mention dates from 1560. In the 19th century it was a tavern and dance hall; Smekens calls it “a busy tavern and dance hall”.",
          "After the fire at the weigh house in 1873, the official weights-and-measures office was temporarily housed here; it checked whether traders' weights and measures were correct. Smekens puts it more briefly: “The official service for checking weights and measures was located there.”",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "This traditional wide house dates from the second half of the 16th century, with four bays and two storeys under a saddle roof. The gate is “a round-arched gate in a simple, rusticated bluestone frame” with diamond-point imposts. The façade stone shows “a bell” in low relief. Smekens calls it a “Renaissance gate with a bas-relief depicting a bell”.",
        ],
      },
    ],
    glossary: ["barleef", "diamantkop", "ijkdienst"],
    thenAndNow: [
      "Then: Smekens drew the gate with the bell as its façade stone.",
      "Now: the house has been preserved. Look for the bell, and look for the diamond points on the imposts.",
    ],
    didYouKnow: [
      "The bell on the façade stone makes the name of the house visible to everyone passing by, without a single word or number.",
    ],
    transitionToNext: "Walk to the Adriaan Brouwerstraat, formerly the Brouwersstraat (Brewers' Street). The last search task is waiting there.",
  },

  // ── Gates 47–50: search task ─────────────────────────────────────────
  "poortjes-adriaan-brouwerstraat": {
    name: "Adriaan Brouwerstraat",
    subtitle: "Search task: the street of the brewers",
    introduction: [
      "This street used to be called the Brouwersstraat (Brewers' Street). Smekens drew four gates here, and all four are still standing. Walk slowly down the street and look at the façades: which ones do you recognise?",
    ],
    searchTask: {
      title: "Which gates can you still recognise?",
      intro: "Four drawings, four gates. It's not a quiz: look, compare, and tap “Found it” when you recognise one. If you get stuck, look at a hint or the solution.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 7,
          question: "A gate with stars. Where is it?",
          hints: ["Look for an inscription on the keystone.", "These are low house numbers."],
          solution: "Adriaan Brouwerstraat 5, from the brewery De Gulde Sterre (The Golden Star).",
          explanation: [
            "The keystone reads “GVLDE STER”. Smekens: “The star motif appears on the side pieces. Belonged to the brewery De gulden sterre. This motif evokes the golden star, emblem of the brewers.” The inventory dates the house to the first half of the 17th century.",
          ],
        },
        {
          plate: 29,
          question: "A severe gate with columns and a small window above it.",
          hints: ["Look at the columns: they are slightly thicker in the middle.", "The house stands on the corner with another street."],
          solution: "Adriaan Brouwerstraat 17, on the corner with the Korte Zeevaartstraat.",
          explanation: [
            "Smekens: “A very strictly classical design, this time without scrolls or volutes.” The inventory describes an “early-baroque bluestone doorway from the first half of the 17th century”, with a mascaron keystone, “three-quarter columns with swelling shafts” and a broken curved pediment with a rectangular fanlight. The buildings were restored in 2014–2015.",
          ],
        },
        {
          plate: 20,
          question: "A gate with the brewers' emblem and a year.",
          hints: ["Look for the oldest building in the street.", "The year is around the keystone: 16..."],
          solution: "Adriaan Brouwerstraat 20, the Brouwershuis (Brewers' House, or Water House), with “ANNO 1655”.",
          explanation: [
            "This doorway did not belong to the Water House. Smekens tells us it came from an old brewery and belonged to Mr W. Pouillon of Kalmthout, until the city council decided at its meeting of 30 March 1922 to buy it, for 1,000 francs, and place it at the entrance of the Water House. The inventory confirms: “moved here in 1922”.",
          ],
        },
        {
          plate: 39,
          question: "A gate with a fan, a rose and an inscription.",
          hints: ["Read the ribbon at the top of the drawing.", "It is the highest house number of the four."],
          solution: "Adriaan Brouwerstraat 29, “In de Roose” (In the Rose).",
          explanation: [
            "Smekens: “With fan and rose motif and the inscription In de roose. Belonged to the brewery De roode roos (The Red Rose).” According to the inventory, the brewer De Bridt had the house built to a design by the architect Jan Pieter van Baurscheit the Younger: accounts date his design to 1738 and its completion to 1743. Smekens calls the style Louis XIV, the inventory Régence.",
          ],
        },
      ],
      outro: "All four still in their place, or almost: one of the four is itself a gate that moved. Which one? Exactly, the one at the Brouwershuis.",
    },
    sections: [
      {
        heading: "Van Schoonbeke's street",
        kind: "history",
        paragraphs: [
          "The street was laid out around 1550 by Gilbert van Schoonbeke, when he developed the Nieuwstad north of the Brouwersvliet. Around 1553 he built some sixteen breweries here. The street was successively called “Groote Middelstrate”, “Breestrate” and from 1694 “Brouwersstraat”. In 1936 it got its present name, after the painter Adriaen Brouwer (c. 1606–1638).",
        ],
      },
      {
        heading: "The Brouwershuis",
        kind: "history",
        paragraphs: [
          "At number 20 stands the Brouwershuis or Waterhuis (Water House), built in 1553–1554 by Van Schoonbeke for the water supply. A horse-driven water wheel pumped water from the Herentals canal and distributed it to the breweries, until around 1930. The house belonged to the city from 1561 and became the guild house of the brewers' guild in 1582. It opened as a museum in 1933 and was restored in 1956–1961.",
        ],
      },
    ],
    glossary: ["mascaron", "sluitsteen", "waaier"],
    didYouKnow: [
      "Three gates from the book that stand or stood elsewhere in the city came from this street: the vanished doorway of the Zilversmidstraat (brewery De Trouw), the frame of the Van Pruyssen brewery in the academy garden, and, according to Smekens, probably the doorway of the Brouwershuis itself.",
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visiting the Brouwershuis",
        paragraphs: [
          "The Brouwershuis reopened to the public in May 2024 after thirty years (VRT NWS). We have not checked the current opening hours. [To be verified]",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.vrt.be/vrtnws/nl/2024/05/07/brouwershuis-in-antwerpen-na-30-jaar-weer-open-voor-publiek/",
      },
    ],
    transitionToNext: "Just a few hundred metres to go. In front of you rises a tall tower: the MAS, the end of the walk.",
  },

  // ── End: MAS ─────────────────────────────────────────────────────────
  "poortjes-mas": {
    name: "MAS",
    subtitle: "From one gate to the whole world",
    introduction: [
      "You are standing at the foot of the MAS, the Museum aan de Stroom (Museum by the River): a sixty-metre tower between the old docks. Look up. In a moment, if the building is open, you can go all the way up to the roof.",
      "This walk began at a small door in the façade of a convent. It ends at a museum that tells the big story: of Antwerp, the port and the world.",
    ],
    sections: [
      {
        heading: "The MAS",
        kind: "history",
        paragraphs: [
          "MAS stands for Museum aan de Stroom. It was designed by Neutelings Riedijk Architects, who won the international competition in 1999, and opened on 14 May 2011. The tower is 60 metres high. The museum manages around 600,000 objects about the ties between Antwerp and the world.",
          "The building stands on the site of the Hanzehuis or Oosterlingenhuis (House of the Easterlings), a 16th-century warehouse of the Hanseatic merchants, designed by Cornelis Floris de Vriendt. He is the same architect who designed the town hall on the Grote Markt.",
        ],
      },
      {
        heading: "The Eilandje",
        kind: "history",
        paragraphs: [
          "This neighbourhood was part of the Nieuwstad that Gilbert van Schoonbeke laid out in the 16th century, with inner harbours such as the Brouwersvliet. The name “Eilandje” (Little Island) appeared in 1869, when the digging of the Verbindingsdok left the residential area completely surrounded by water.",
          "When the port moved north, the area fell into decline. From the 1980s onwards the docks and warehouses were gradually transformed into a residential and museum district.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Going up",
        paragraphs: [
          "The walking boulevard with escalators and the panorama on the roof are free during the building's opening hours: Tuesday to Sunday from 9.30 a.m. to 10 p.m., and from 1 April to 31 October until midnight (last entry 11.30 p.m.). Closed on Mondays (except Easter Monday and Whit Monday), and on 1 January, 1 May and 25 December; on 24 and 31 December until 3 p.m. In bad weather the panorama may be temporarily closed.",
          "You need a ticket for the museum galleries. They are open Tuesday to Sunday, 10 a.m. to 5 p.m. (last entry 4 p.m.).",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://mas.be/en/page/how-when-get-here",
      },
    ],
    didYouKnow: [
      "On the square in front of the MAS lies a 1,600 m² mosaic by the artist Luc Tuymans, entitled “Dead Skull”.",
    ],
    lookAt: [
      {
        title: "From above",
        body: "From the roof, look for the spire of the cathedral. Somewhere in between, in the narrow streets, are the gates you saw today.",
      },
    ],
    closing: {
      timeline: [
        "Rosier: a convent door with a saint",
        "Hoogstraat: house names from before house numbers",
        "Grote Markt: guilds and a giant",
        "Gildekamersstraat: years carved in stone",
        "Handelsbeurs: money and world trade",
        "Academy: gates without a house",
        "Brouwersstraat: brewers and water",
        "MAS: the port and the world",
      ],
      finalLines: [
        "Today you walked past fifty gates. Some were still standing, some had moved, and some you only know from a drawing made in 1951.",
        "Paul Smekens measured them down to the centimetre, because he knew that a city changes.",
        "From now on, take a look at the doors.",
      ],
    },
  },

  // ── Optional: Red Star Line ──────────────────────────────────────────
  "poortjes-red-star-line": {
    name: "Red Star Line Museum",
    subtitle: "Extra: the journey to America",
    introduction: [
      "Still not tired of walking? Here, in the old buildings of the Red Star Line shipping company, millions of Europeans began their journey to a new life.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "The Red Star Line operated on the Eilandje for more than half a century. According to the museum, between 1873 and 1934 more than two million emigrants left Europe for North America on its ships, in search of a new beginning.",
          "The museum stands “on the authentic site of the historic shipping line” and tells “a universal story of hope, dreams and the search for happiness, based on personal stories of 20th-century emigrants”. It opened in 2013.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visit",
        paragraphs: [
          "Montevideostraat 3. Open Tuesday to Sunday, 10 a.m. to 5 p.m.; closed on Mondays, except Easter Monday and Whit Monday. You need a ticket for the museum: check the current prices on the museum's website.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://redstarline.be/en/content/museum",
      },
    ],
    didYouKnow: [
      "This story, too, begins and ends at a door: that of the European home the emigrants left behind, and that of their new country.",
    ],
  },
};
