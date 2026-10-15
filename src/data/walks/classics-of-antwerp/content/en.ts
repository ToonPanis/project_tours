import type { ClassicsContent } from "./types";

/**
 * Classics of Antwerp: English content.
 *
 * Rules for this file (see CLAUDE.md):
 * - Only facts checked against the sources listed per stop in stops.ts.
 * - Legends are "legend" sections; uncertain explanations are worded as such.
 * - The walk runs backwards in time: 20th century → the river where it began.
 */
export const classicsContentEn: ClassicsContent = {
  walk: {
    title: "Classics of Antwerp",
    tagline: "A Walk Through the History of Antwerp",
    shortDescription:
      "A narrated walk from the grand railway station to the banks of the Scheldt: nineteen stops, eight centuries, and the stories behind Antwerp's most famous places.",
    description:
      "Walk from Antwerp's grand railway station through centuries of trade, art, religion and power, ending where the story of the city began: on the banks of the Scheldt.\n\nAt every stop your phone becomes your guide: what you are looking at, why it was built, what happened here, and the details most visitors walk straight past. Historical photographs show you how the city looked a century ago and more. There are no games or questions; just Antwerp, and the time to look at it properly.",
    highlights: [
      "19 of Antwerp's most important historical places",
      "Written like a guide walking beside you",
      "Historical photographs, engravings and postcards at every major stop",
      "“Did you know?” stories you won't find on the information panels",
      "Details to look for on the spot",
      "Walking navigation from stop to stop",
    ],
    howItWorksSteps: [
      "Walk to the next stop with the map",
      "Read the story of what you see",
      "Look for the details on the spot",
      "Continue at your own pace",
    ],
    practicalInfo: [
      { label: "Pace", value: "At your own pace; stop and continue whenever you like" },
      { label: "Best for", value: "First-time visitors and anyone curious about Antwerp's history" },
      { label: "Accessibility", value: "Mostly flat streets; some cobblestones in the old town" },
    ],
    guideIntro: {
      quote:
        "Walk from Antwerp's grand railway station through centuries of trade, art, religion and power, ending where the story of the city began: on the banks of the Scheldt.",
      categoryLabel: "History & Architecture",
      footnote: "From the Belle Époque to medieval Antwerp.",
    },
    copy: {
      startLabel: "Start the walk",
      completionTitle: "The end of the walk",
      completionMessage: "You haven't just walked through Antwerp. You've walked back through its history.",
      locationsTitle: "The route",
      locationsDiscoveredLabel: "stops visited",
    },
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "classics-central-station": {
      name: "Antwerpen-Centraal",
      subtitle: "The railway cathedral",
      introduction: [
        "Before you stands one of the most spectacular railway stations in the world. Look at it for a moment the way it was meant to be seen: a stone palace with a dome, towers and gilded details, built not just to catch a train but to impress everyone who arrived in Antwerp.",
        "Antwerpians call it the spoorwegkathedraal, the railway cathedral. It is a fitting place to begin, because this is the newest chapter of our story. From here we will walk backwards through time, all the way to the river where the city was born.",
      ],
      sections: [
        {
          heading: "A king's showpiece",
          kind: "history",
          paragraphs: [
            "Around 1900 Antwerp was booming. Its port was one of the busiest in Europe, and King Leopold II wanted a station worthy of that ambition. The work came in two parts. First, between 1895 and 1899, engineer Clément Van Bogaert built the enormous iron and glass train hall: 186 metres long, 66 metres wide and 43 metres high. That height was not only for show; it gave the smoke of the steam locomotives room to rise.",
            "Then, between 1899 and 1905, architect Louis Delacenserie built the stone station building in front of it. He called his own style a “baroque-medieval eclecticism” and took inspiration from, among other places, the old station of Lucerne and the Pantheon in Rome. The result mixes almost everything: domes, pinnacles, marble, gold and more than a little theatre.",
          ],
        },
        {
          heading: "From dead end to through station",
          kind: "history",
          paragraphs: [
            "For about a century this was a terminus: trains came in, stopped and had to reverse out. At the beginning of the 21st century that changed. New platforms were dug on several levels beneath the old train hall and a tunnel was built under the city, so that trains can now run straight through Antwerp. The historic hall stayed on top, restored, as if nothing had happened.",
          ],
        },
      ],
      didYouKnow: [
        "When King Leopold II first saw the finished station, he is said to have been less impressed than everyone expected. According to a well-known anecdote he remarked: “C'est une petite belle gare”: “it is a nice little station”.",
        "The iron train hall is older than the stone building you are looking at. The engineers finished their work years before the architect finished his.",
      ],
      lookAt: [
        {
          title: "The clock and the coat of arms",
          body: "Walk into the train hall and turn around. Above the entrance of the station building you'll find a large clock, the word ANTWERPEN and the city's coat of arms: a castle with two hands above it. Remember those hands; they will come back later on this walk, on the Grote Markt.",
        },
      ],
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Find Antwerp's coat of arms",
        task: [
          "Find the coat of arms of Antwerp.",
          "The photo is your clue: look carefully around you, inside and outside the station. Found it? Tap the button below.",
        ],
      },
      transitionToNext:
        "Leave the station along its west side. Within a few minutes you enter a small district where a very different kind of treasure has been traded for centuries.",
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "classics-diamond-district": {
      name: "The Diamond District",
      subtitle: "One of the world's great diamond marketplaces, in a few quiet streets",
      introduction: [
        "Look around you. These few unremarkable streets next to the station, with their cameras, bollards and anonymous office buildings, form one of the most important diamond marketplaces in the world. Much of the world's rough diamond trade has passed through these few blocks.",
      ],
      sections: [
        {
          heading: "Five centuries of diamonds",
          kind: "history",
          paragraphs: [
            "Antwerp's relationship with diamonds is old. The earliest known record dates from 1447, when the city issued rules against trading in fake precious stones, diamonds included. By then the trade was clearly important enough to protect.",
            "The district you are standing in grew up later, around the station and the railway, at the end of the 19th century. In 1893 the city's first diamond bourse, the Diamantclub van Antwerpen, was founded; the Beurs voor Diamanthandel followed in 1904. Here traders met, examined stones and closed deals, often sealed with little more than a handshake and a word of trust.",
            "For much of the 20th century the trade was shaped by Antwerp's Jewish community, many of whose families had come from Central and Eastern Europe. Later, traders from India became increasingly important. Walk around and you'll still hear many languages spoken in these streets.",
          ],
        },
        {
          heading: "The polishing wheel",
          kind: "legend",
          paragraphs: [
            "Tradition credits an Antwerp-connected craftsman, Lodewijk van Bercken, with inventing the scaif in the 15th century: a polishing wheel coated with diamond dust and oil, which made it possible to cut all the facets of a diamond symmetrically. The story is often repeated, but the historical evidence for his life and invention is thin, so treat it as a proud local tradition rather than established fact.",
          ],
        },
      ],
      didYouKnow: [
        "Over the weekend of 15 and 16 February 2003, thieves broke into the vault of the Antwerp Diamond Centre in this district. The loot, estimated at more than 100 million dollars in diamonds, gold and jewellery, made it one of the largest diamond heists in history. Arrests followed, but most of the diamonds were never found.",
      ],
      moreStories: {
        "jewish-community": {
          title: "The Jewish community",
          subtitle: "The Second World War and after",
          sections: [
            {
              heading: "The Second World War",
              kind: "history",
              paragraphs: [
                "18 August 1941: the Wehrmacht raided the Diamantkring and seized diamonds. 164 members of the Diamantkring were murdered.",
                "Summer 1942: raids, among others on 15–16 and 28–29 August, in streets such as the Van Immerseelstraat, the Lange Kievitstraat and the Provinciestraat. The dates differ slightly from source to source.",
                "During the raid of 28–29 August the Antwerp police itself carried out the arrests. That was unique in the history of the occupation of Belgium.",
                "The victims were deported via Kazerne Dossin in Mechelen to Auschwitz-Birkenau.",
              ],
            },
            {
              heading: "How many?",
              kind: "history",
              paragraphs: [
                "Between 56% and 66% of Antwerp's Jews were deported, depending on how it is calculated: more than half, and by some calculations two thirds. According to Antwerpen Herdenkt, about 10,000 Jews from the region did not survive the war.",
              ],
            },
            {
              heading: "After the war",
              kind: "history",
              paragraphs: [
                "In 1945 about 2,000 Jews were still living in the city. By the end of the 1940s there were again about 10,000, a strongly orthodox community.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Walk back towards the station square and turn onto De Keyserlei, the grand avenue that leads into the old city. Around 1900 this was the way every visitor arriving by train entered Antwerp.",
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "classics-keyserlei-meir": {
      name: "De Keyserlei & the Meir",
      subtitle: "The grand boulevard, and the day the war came to the cinema",
      introduction: [
        "You are standing on De Keyserlei, the broad avenue that connects the station with the heart of the city. Ahead of you it continues as the Meir, Antwerp's most famous shopping street. On old postcards from around 1900 you can see exactly the same view: elegant buildings, busy traffic, and at the far end the spire of the cathedral pointing the way.",
      ],
      sections: [
        {
          heading: "16 December 1944",
          kind: "history",
          paragraphs: [
            "This street carries one of the darkest memories of Antwerp. After the city was liberated in September 1944, its port became vital for supplying the Allied armies, and Germany answered with its new V-weapons: flying bombs and V-2 rockets that fell without warning.",
            "On the afternoon of 16 December 1944 around 1,100 people were watching a film in Cinema Rex, at number 15 on this avenue. At 15:20 a V-2 rocket hit the roof. 567 people were killed: 271 civilians and 296 Allied soldiers. It was the highest death toll from a single rocket attack of the entire war, and it took nearly a week to recover everyone from the rubble.",
          ],
        },
      ],
      didYouKnow: [
        "Cinema Rex was rebuilt after the war and reopened in 1947. It finally closed in 1993 and was demolished two years later. Today little in the street reminds passers-by of what happened here.",
      ],
      transitionToNext:
        "Follow the Meir towards the old city. A little further on the left, a golden dome glints above a grand entrance: a party hall that burned down and rose again.",
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "classics-stadsfeestzaal": {
      name: "Stadsfeestzaal",
      subtitle: "The city's party hall that rose from the ashes",
      introduction: [
        "Before you is the entrance of the Stadsfeestzaal, the city festival hall. Step inside and look up: a vast hall crowned by a glass dome covered with gold leaf. Today it is a shopping centre, but it was built for something else entirely.",
      ],
      sections: [
        {
          heading: "A hall for the city",
          kind: "history",
          paragraphs: [
            "The Stadsfeestzaal opened on 8 February 1908. It was designed by the city architect Alexis Van Mechelen, on behalf of the city itself, in a grand neoclassical style. Antwerp was rich and confident, and it wanted a place for balls, exhibitions, fairs and receptions, a salon for the whole city in the middle of its main street.",
          ],
        },
        {
          heading: "The fire of 2000",
          kind: "history",
          paragraphs: [
            "On 27 December 2000 a short circuit started a fire that gutted the building. When the flames were out, only the monumental staircase, the historic façade and the steel roof structure were still standing.",
            "Many feared the hall was lost for good. In 2004 the city signed a long-term lease with a developer, and restoration work began that same year. Under the supervision of the heritage authorities the glass dome with its gold leaf, the staircase, the decorations, sculptures, mosaics, wall reliefs and even the oak parquet floor were faithfully rebuilt. In 2007 the Stadsfeestzaal opened again.",
          ],
        },
      ],
      didYouKnow: [
        "Much of the “historic” interior you see inside is in fact a careful 21st-century reconstruction, made after the fire of 2000 from photographs, plans and surviving fragments.",
      ],
      transitionToNext:
        "Continue along the Meir towards the old city. A few minutes further on, Spooky is waiting for you with a task…",
    },

    // ── 4b: Spooky's quest ───────────────────────────────────────────────
    // `name` and `subtitle` show BEFORE the façade is found: they must not give it away.
    "classics-paleis-op-de-meir": {
      name: "A mystery on the Meir",
      subtitle: "The façade from Spooky's drawing",
      introduction: [
        "You found it: the long, elegant 18th-century façade in front of you is the Paleis op de Meir.",
      ],
      sections: [
        {
          heading: "A palace on the Meir",
          kind: "history",
          paragraphs: [
            "It was built from 1745 for a wealthy merchant, Johan Alexander van Susteren, by the Antwerp architect Jan Pieter van Baurscheit the Younger. Later it passed through remarkable hands: Napoleon bought it in 1811–1812 but never lived there, the Russian Tsar Alexander I stayed there in 1814, and for a long time it served as a royal palace.",
          ],
        },
      ],
      didYouKnow: [
        "Napoleon owned the palace on the Meir, but by the time it was ready for him he was already in exile on the island of Elba.",
      ],
      quest: {
        title: "Spooky's task",
        task: [
          "Take a good look at this old building drawing. Somewhere on the Meir stands the building it belongs to.",
          "Walk to the search zone on the map, look up at the façades and compare them with the drawing. Can you discover which building it is? When you're standing in front of it, Hidden Antwerp will notice.",
        ],
        zoneHint: "The building is somewhere inside this zone.",
        revealedName: "Paleis op de Meir",
      },
      transitionToNext:
        "A few steps away, a small square opens up beside the Meir: the Wapper, where Antwerp's most famous painter built his home.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-rubenshuis": {
      name: "The Rubens House",
      subtitle: "Where Antwerp's greatest painter lived and worked",
      introduction: [
        "You are standing on the Wapper, a small square just off the Meir. Behind the façade in front of you, Peter Paul Rubens, the most famous painter Antwerp has ever produced, lived and worked until his death in 1640.",
        "The portrait at the top of this page is Rubens as he painted himself in 1623, at the height of his fame: a broad black hat, a dark cloak, a calm and confident look. Today that self-portrait belongs to the British Royal Collection.",
      ],
      sections: [
        {
          heading: "An Italian palazzo on the Wapper",
          kind: "history",
          paragraphs: [
            "In 1608 Rubens came home to Antwerp after eight years in Italy. In 1610 he bought an existing Flemish house here and spent the following decade turning it into a home and workshop in the Italian manner: a studio in Baroque style, an art room with a semicircular sculpture gallery, a monumental portico and a garden pavilion. He and his wife Isabella Brant moved in in 1617.",
            "After his death the house was rented out, rebuilt and divided up. The city bought it in 1937, and between 1937 and 1946 city architect Emiel Van Averbeke reconstructed it, largely on the basis of engravings by Harrewijn from 1684 and 1692. The portico, the garden pavilion and the shell of the studio are largely original; the living quarters and their interiors are a reconstruction.",
          ],
        },
        {
          heading: "Rubens and Isabella",
          kind: "history",
          paragraphs: [
            "On 3 October 1609, a year after his return from Italy, the 32-year-old Rubens married the 18-year-old Isabella Brant. Around that time he painted the two of them together: the double portrait on this page, now in the Alte Pinakothek in Munich. Isabella lived with him in this house until her death in 1626.",
          ],
        },
        {
          heading: "Reading the painting",
          kind: "interpretation",
          paragraphs: [
            "The couple sit close together in a bower of honeysuckle. Their right hands rest one on the other: since Roman times, joined right hands were a sign of marriage. Honeysuckle stood for lasting love; one of its German names, Jelängerjelieber, means “the longer, the dearer”.",
            "Look at the clothes and the pose as well. Rubens wears the fine costume of a gentleman, his hand close to the hilt of a sword; Isabella wears a tall hat, a wide lace collar and a richly embroidered bodice. The large format and the costly clothes present the young couple as people of standing. A painter showing himself with his bride outdoors, relaxed, as a couple in love: for its time the double portrait broke new ground.",
          ],
        },
        {
          heading: "Why it belongs on this walk",
          kind: "interpretation",
          paragraphs: [
            "The painting marks the beginning of the life Rubens built on this spot: a marriage, a growing workshop, and a house that showed the world who he was. A year after the wedding he bought this house. On the rest of the walk you will meet him again: at the Groenplaats, where the city put up his statue, at the cathedral, which holds altarpieces he painted, and at the St Charles Borromeo Church, whose ceilings his studio once decorated.",
          ],
        },
      ],
      didYouKnow: [
        "From 1648 to 1660, after Rubens' death, the house was rented by William and Margaret Cavendish, English royalists living in exile.",
      ],
      infoBoxes: [
        {
          kind: "visit",
          title: "Visiting the Rubens House",
          paragraphs: [
            "The house itself is closed for restoration until 2030 at the earliest. The garden, the library and the Rubens Experience in the new visitor building are open; the visitor entrance is at the back, at Hopland 13.",
            "Check the opening hours and ticket prices on the Rubens House website before you go.",
          ],
          checkedOn: "2026-09-30",
          sourceUrl: "https://rubenshuis.be/nl/vraag-antwoord",
        },
      ],
      transitionToNext:
        "Leave the Meir for a moment and turn into the narrow streets behind it. Hidden behind ordinary façades is the building where Antwerp once taught the world how to trade.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "The Handelsbeurs",
      subtitle: "Where the world came to do business",
      introduction: [
        "Before you is the Handelsbeurs, Antwerp's old commercial exchange. From the street it hardly announces itself. Inside is one of the most extraordinary rooms in the city: a Gothic courtyard surrounded by galleries, covered by a soaring roof of iron and glass.",
        "Now imagine that roof away. For more than three centuries the heart of this building was an open courtyard under the sky, where the merchants of half of Europe met every day.",
      ],
      sections: [
        {
          heading: "A square under the open sky",
          kind: "history",
          paragraphs: [
            "In 1531 Antwerp opened a new exchange, designed by Domien de Waghemakere in the late Gothic Brabant style. Its heart was a rectangular courtyard, open to the sky and surrounded on all four sides by covered galleries with star vaults on columns.",
            "Every day merchants from Portugal, Italy, Germany, England and Spain gathered in that open square, in a babel of languages, to set prices, give credit and trade bills of exchange. When it rained they sheltered under the galleries; above the galleries were shops and rooms. The engraving at the top of this page shows the courtyard full of small groups of traders.",
            "It was one of the first buildings anywhere built specifically for trading, and the idea travelled. When Thomas Gresham, the English crown's agent in Antwerp, founded the Royal Exchange in London in the 1560s, he took this courtyard with its galleries as his model; Amsterdam followed in 1611.",
          ],
        },
        {
          heading: "A roof over the courtyard",
          kind: "history",
          paragraphs: [
            "Only in 1852–1854 was the courtyard covered for the first time, by the engineer Charles Marcellis, with iron and a glass dome. Four years later, on 2 August 1858, fire destroyed both the old exchange and its new roof.",
            "Architect Joseph Schadde rebuilt it; the new exchange was inaugurated on 19 October 1872. He kept the courtyard with its galleries, which still follow the plan of 1531, but covered it with the spectacular roof of iron and glass you see today.",
          ],
        },
      ],
      didYouKnow: [
        "For more than three centuries, from 1531 until the first roof of 1852–1854, Antwerp's merchants did their business in sun, wind and rain, in a courtyard open to the sky.",
      ],
      galleries: {
        "exchange-in-prints": {
          title: "The exchange in old prints",
          intro: "Two 19th-century prints of the galleries, from before and after the fire of 1858.",
        },
      },
      transitionToNext:
        "Back on the Meir, look up. A tower rises above the rooftops like a piece of New York dropped into a medieval city. We step forward in time for a moment, before our journey into the past really begins.",
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "classics-boerentoren": {
      name: "The Boerentoren",
      subtitle: "Europe's first skyscraper",
      introduction: [
        "Before you rises the Boerentoren, the “Farmers' Tower”. With its stepped, sober silhouette it looks as if it belongs in 1930s New York rather than in a city of Gothic churches, and that is exactly what its builders intended.",
      ],
      sections: [
        {
          heading: "An American dream on the Schoenmarkt",
          kind: "history",
          paragraphs: [
            "The block on which it stands had been devastated during the First World War. When the city organised a competition for its reconstruction, the brief was explicit: build an American skyscraper. The architects Jan Vanhoenacker, Emiel Van Averbeke and Jos Smolderen designed a tower in Art Deco style, and construction ran from 1929 to 1932, with an eye on the World Exhibition that Antwerp held in 1930.",
            "Its skeleton is a steel frame of some 3,500 tonnes, made by the German company Demag. With 25 storeys and a height of 87.5 metres, it was the first skyscraper in Europe and, at the time, the tallest. A renovation of the top in 1975 raised it to 95.75 metres and 26 storeys.",
          ],
        },
      ],
      didYouKnow: [
        "The nickname comes from its owners: the building became home to the savings bank of the Boerenbond, the Belgian Farmers' Union. A tower full of farmers' savings, in the middle of the city.",
      ],
      transitionToNext:
        "From here the tower points you towards the old heart of Antwerp. Walk to the large square ahead of you, where the cathedral appears for the first time in all its height, and where the ground beneath your feet hides a secret.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-groenplaats": {
      name: "Groenplaats",
      subtitle: "A square that used to be a graveyard",
      introduction: [
        "You are standing on the Groenplaats, one of Antwerp's liveliest squares, with the cathedral rising above the rooftops and Peter Paul Rubens on a pedestal in the middle. It feels like a place built for terraces and markets. For centuries, it was something very different.",
      ],
      sections: [
        {
          heading: "The cathedral's churchyard",
          kind: "history",
          paragraphs: [
            "This square, together with the Lijnwaadmarkt, Melkmarkt, Schoenmarkt and Handschoenmarkt around the cathedral, once formed the cathedral's cemetery. Antwerpians called it the Groot Kerkhof, the Great Churchyard, and later the Groen Kerkhof, the Green Churchyard. Some still use that name today.",
            "In 1754 the cemetery was walled in, but not for long. In 1784 Emperor Joseph II banned burials inside cities, for reasons of public health, and in 1799 the wall came down. The graveyard slowly became the square you see now.",
            "A painting from 1597, shown below, gives an idea of the churchyard in its time: a funeral procession of mourners in black passes along it, with the cathedral rising behind.",
          ],
        },
        {
          heading: "Rubens takes his place",
          kind: "history",
          paragraphs: [
            "In 1840 Antwerp marked 200 years since the death of Rubens. A statue was designed by Willem Geefs, but money was short and the bronze was not ready in time, so on 25 August 1840 a temporary plaster version was unveiled on another square. Only on 9 and 10 August 1843 did the bronze Rubens take his place here, in the middle of the Groenplaats.",
            "Geefs showed him as painter and diplomat: at his feet lie a palette and a sword, because Rubens also served the Spanish king as an envoy. Fittingly for a former churchyard, the statue stands on the spot of an old churchyard cross above the grave of a bishop, Antonius d'Espinosa.",
          ],
        },
      ],
      didYouKnow: [
        "When you sit on a terrace here, you are sitting on what was, for centuries, the burial ground of the cathedral.",
      ],
      transitionToNext:
        "Walk towards the cathedral. As you go, look at the row of houses built against the choir of the church. They hide the foundations of a cathedral that was never finished.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Cathedral of Our Lady",
      subtitle: "The cathedral Antwerp almost made even bigger",
      introduction: [
        "Before you stands the Cathedral of Our Lady, one of the largest Gothic churches in the Low Countries and for centuries the landmark that sailors on the Scheldt saw first. Its north tower, some 123 metres high, still dominates the skyline.",
        "We are now in the late Middle Ages. The cathedral was built over roughly 170 years, from the middle of the 14th century until 1521, by generations of builders who knew they would never see it finished.",
      ],
      sections: [],
      didYouKnow: [],
      cards: {
        cathedral: {
          title: "The cathedral",
          subtitle: "Two centuries of building, and a plan that was too big",
          sections: [
            {
              heading: "Built over 170 years",
              kind: "history",
              paragraphs: [
                "Building began in 1352 and lasted until 1521, with a long pause between 1356 and 1378. Generations of master builders followed one another on the same plan, among them Peter Appelmans and Herman and Domien de Waghemakere. The money came from gifts, the guilds and the city; when it ran out, the work simply waited.",
                "The north tower, some 123 metres high, was finished around 1518–1521 and is still the tallest church tower in the Benelux. The south tower was halted in 1475 for lack of money, at about 65 metres, and was never completed.",
              ],
            },
            {
              heading: "Even bigger: the Nieuwerck",
              kind: "history",
              paragraphs: [
                "In 1521, just as the church was completed, Antwerp decided it was not big enough. The richest city in northern Europe wanted a church to match, and a gigantic extension of the choir, the Nieuwerck, was designed by Domien de Waghemakere and Rombout Keldermans.",
                "On 15 July 1521 the young emperor Charles V laid the first stone himself. But the enthusiasm was already fading by around 1528, and in the night of 5 to 6 October 1533 a great fire badly damaged the roof and pillars of the church; its cause is unknown. All money went into repairing the existing building, and in 1537 the Nieuwerck was abandoned for good.",
              ],
            },
            {
              heading: "Storms of history",
              kind: "history",
              paragraphs: [
                "The cathedral has survived a great deal. During the iconoclastic fury of 1566, a wave of Protestant anger against images, much of its interior was smashed. Two centuries later, French revolutionary troops occupied the city, closed the church and carried off its treasures.",
                "Much of what you can see inside today was brought back or restored afterwards, including altarpieces by Rubens that are among his most famous works.",
              ],
            },
          ],
          didYouKnow: [
            "The Nieuwerck was never built, but it did not vanish completely. Its foundations and pillars survive in the row of houses around the choir, between the Lijnwaadmarkt and the Groenplaats. Some of those houses literally stand on the start of a cathedral that was never finished.",
            "Charles V's foundation stone carried a Latin inscription recording that the emperor laid it on the Ides of July, 1521.",
          ],
        },
        "quinten-matsijs": {
          title: "Quinten Matsijs",
          subtitle: "From blacksmith to painter?",
          sections: [
            {
              heading: "A painter for the cathedral",
              kind: "history",
              paragraphs: [
                "Quinten Matsijs (around 1466–1530) was born in Leuven, the son of a blacksmith, and became one of the leading painters of Antwerp in its golden age. In 1491 he became a master in the Guild of St Luke, the painters' guild.",
                "His link with this church is real. Between 1508 and 1511 he painted a great altarpiece for the altar of the joiners' guild in the cathedral: a Lamentation of Christ between scenes of St John the Baptist and St John the Evangelist. Today it hangs in the KMSKA, Antwerp's Royal Museum of Fine Arts.",
              ],
            },
            {
              heading: "The smith who painted for love",
              kind: "legend",
              paragraphs: [
                "Antwerp tells a romantic story about him. Quinten, it says, was a blacksmith who fell in love with a girl who preferred a painter to a smith. So he put down his hammer and picked up the brush. Karel van Mander, who wrote it down in 1604, also gives another version: a long illness made heavy smithing impossible, and he began colouring prints to support his mother.",
                "Another tale says he painted a fly so lifelike on a painting by his sweetheart's father that the man tried to brush it away, and then agreed to the marriage.",
              ],
            },
            {
              heading: "What historians say",
              kind: "interpretation",
              paragraphs: [
                "There is no evidence that Quinten himself ever worked as a smith; his father did. Historians see the story as a legend that grew over time. It is an old one, though: the Latin verse under his portrait, printed in Antwerp in 1572 and shown at the top of this card, already has him say that love turned the smith into a painter.",
              ],
            },
          ],
          didYouKnow: [
            "Right next to the cathedral, on the Handschoenmarkt, stands a well with a Gothic wrought-iron cage crowned by a small Brabo. Tradition attributes the ironwork to Matsijs, but that is not proven. A few metres away, on the west front of the cathedral, a memorial stone with his portrait bears the Latin line “Connubialis amor de Mulcibre fecit Apellem”: married love turned the smith into a painter.",
          ],
        },
        "nello-patrasche": {
          title: "Nello & Patrasche",
          subtitle: "An English novel, a Japanese classic and a marble statue",
          sections: [
            {
              heading: "The story",
              kind: "fiction",
              paragraphs: [
                "Nello is a poor orphan boy who lives in a village “a league from Antwerp”. With his dog Patrasche, who pulls the cart, he brings milk to the city every day. Nello dreams of becoming a painter and longs to see the two paintings by Rubens in the cathedral, but they are covered, and only those who pay may see them.",
                "He enters a drawing competition, does not win, and loses everything. On Christmas Eve he finds the church open and at last sees The Elevation of the Cross and The Descent from the Cross. The next morning Nello and Patrasche are found together in front of the paintings, frozen to death.",
              ],
            },
            {
              heading: "A book from England, a classic in Japan",
              kind: "history",
              paragraphs: [
                "A Dog of Flanders was written by the English author Ouida (Marie Louise de la Ramée). It appeared in a magazine at the end of 1871 and as a book in 1872. The two paintings are real: they still hang in this cathedral. In the novel they stand for the art Nello longs for, which stays hidden from people who cannot pay.",
                "For a long time the story was hardly known in Flanders itself. Abroad it became a classic: it was filmed several times in the United States, from 1935 onwards, and in Japan the anime series of 1975 made it a children's classic. A documentary of 2007 was called, fittingly, Patrasche, a Dog of Flanders – Made in Japan.",
              ],
            },
            {
              heading: "The statue",
              kind: "history",
              paragraphs: [
                "In 2016 a statue by Batist Vermeulen was placed on the Handschoenmarkt, in front of the cathedral. It replaced a memorial stone from 2003. Nello and Patrasche lie asleep in each other's arms, under a blanket made of the square's own cobblestones. Since November 2022 it has been lit at night.",
              ],
            },
          ],
          didYouKnow: [
            "Ouida never names Nello's village. The link with Hoboken, now a district of Antwerp, was made later.",
          ],
        },
      },
      lookAt: [
        {
          title: "One tower and a half",
          body: "Look at the front of the cathedral. The left (north) tower rises all the way to its elegant spire; the right (south) tower stops at about half that height. The plan was for two great towers, but only one was ever completed. Look at the etching from 1649 on this page: the lopsided silhouette was already the same then.",
        },
      ],
      transitionToNext:
        "Walk around the cathedral to the Oude Koornmarkt. Look carefully for a narrow entrance between the houses: it leads to a hidden alley that time seems to have forgotten.",
    },

    // ── 10 ───────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "A secret passage into old Antwerp",
      introduction: [
        "Step through the narrow entrance and the noise of the city disappears. You are in the Vlaeykensgang, a winding alley between old brick walls, little courtyards and small houses. For a moment it is easy to imagine Antwerp centuries ago.",
        "The Vlaeykensgang is often called one of the oldest and narrowest alleys in Antwerp. The heritage inventory makes no such ranking, but it does confirm what makes the place special: an L-shaped, cobbled passage lined with eleven small back houses, which has kept almost all of its old appearance.",
      ],
      sections: [
        {
          heading: "Back buildings that became a street",
          kind: "history",
          paragraphs: [
            "The passage was laid out in 1591, although it did not yet carry this name; the name is younger than the alley itself. The small buildings started out in the 16th century as back buildings and warehouses behind the houses on the surrounding streets. Over time the complex grew into an inner passage, and from the 17th century the buildings were used as small, modest dwellings.",
          ],
        },
        {
          heading: "Saved at the last minute",
          kind: "history",
          paragraphs: [
            "By the 1960s the alley was badly run-down, and there were plans to demolish it to make room for a car park. In 1969 the antique dealer and interior designer Axel Vervoordt bought the complex. The façades and roofs were protected as a monument in 1973, and the restoration began in 1977.",
          ],
        },
      ],
      didYouKnow: [
        "One of the most atmospheric corners of old Antwerp exists today because it was once considered worthless enough to be turned into a car park.",
      ],
      transitionToNext:
        "Follow the alley and the side streets to the city's great market square. Prepare to look up: the façades around it are full of gold.",
    },

    // ── 11 ───────────────────────────────────────────────────────────────
    "classics-grote-markt": {
      name: "Grote Markt & the guild houses",
      subtitle: "The golden square that is younger than it looks",
      introduction: [
        "You are on the Grote Markt, the main square of Antwerp. On one side stands the City Hall; around the rest of the square, tall guild houses with stepped and scrolled gables, crowned with gilded figures that catch the sun.",
        "The guilds were the associations of craftsmen and traders who organised much of city life: who could work, what could be sold, at what quality. Their houses here were their showpieces.",
      ],
      sections: [
        {
          heading: "The Spanish Fury",
          kind: "history",
          paragraphs: [
            "In November 1576 mutinous Spanish soldiers plundered Antwerp; you will hear more about that at the City Hall. The fire they started swept across this square and destroyed the houses that stood here. What rose afterwards was a new generation of buildings.",
            "The finest example is the house of the Oude Voetboog, the guild of St George. It was built in 1515–1516, destroyed in 1576 and rebuilt in Renaissance style in 1580–1582. Its façade is considered one of the highlights of Antwerp Renaissance architecture.",
          ],
        },
        {
          heading: "A 19th-century dream of the golden age",
          kind: "history",
          paragraphs: [
            "Much of what you see is younger than it looks. In 1895 a citizen named R. Joostens left money in his will to restore the former splendour of the Grote Markt. From the late 19th century into the early 20th century, the façades on the northern side of the square, and number 44 on the southern side, were freely reconstructed and embellished in the spirit of the 16th century.",
          ],
        },
      ],
      didYouKnow: [
        "Several of the “old” guild houses on this square are in fact reconstructions from around 1900. Antwerp was not just preserving its golden age; it was also, lovingly, re-imagining it.",
      ],
      lookAt: [
        {
          title: "The gilded figures",
          body: "Look up at the tops of the gables. Find the golden St George on horseback fighting the dragon on the house of the Oude Voetboog, the guild of St George. Then look for the other figures and emblems: many of them refer to the guild that owned the house. Compare the square with the photograph from 1905 on this page.",
        },
      ],
      transitionToNext:
        "In the middle of the square a bronze figure is about to throw something into the air. Walk over to the fountain: it tells the most famous story Antwerp has.",
    },

    // ── 12 ───────────────────────────────────────────────────────────────
    "classics-brabo": {
      name: "The Brabo Fountain",
      subtitle: "A giant, a hand, and the name of a city",
      introduction: [
        "Before you stands the Brabo Fountain. On top of a pile of rocks, surrounded by sea creatures and figures, a young man leans back and throws something far away. Look closely at what he holds: it is a hand.",
      ],
      sections: [
        {
          heading: "The legend of Druon Antigoon",
          kind: "legend",
          paragraphs: [
            "Long ago, the story goes, a giant called Druon Antigoon lived beside the Scheldt. He guarded the river and demanded a toll from every ship that wanted to pass. Whoever refused or could not pay had a hand cut off, and the giant threw it into the river.",
            "Then came a young Roman soldier named Silvius Brabo. He challenged the giant, defeated him, cut off the giant's own hand and threw it into the Scheldt. And so, the legend says, the city got its name: hand werpen, “to throw a hand”, Antwerpen.",
          ],
        },
        {
          heading: "What historians think",
          kind: "interpretation",
          paragraphs: [
            "It is a wonderful story, but not an explanation that historians take seriously. The origin of the name Antwerpen is uncertain. Most explanations connect it not to hands but to land: to ground raised along the river, a piece of land “in front”, formed or thrown up by the water. The legend of the giant is a much later attempt to explain a name whose real origin had been forgotten.",
          ],
        },
        {
          heading: "The fountain",
          kind: "history",
          paragraphs: [
            "The fountain was made by the Antwerp sculptor Jef Lambeaux, who had largely developed his design by 1883. It was placed on the Grote Markt in 1887, in front of the City Hall, at a time when Antwerp was eager to celebrate its own history and identity.",
          ],
        },
      ],
      didYouKnow: [
        "The hands of the legend are everywhere in Antwerp: in the city's coat of arms, which shows a castle with two hands above it, and in the chocolate and biscuit “Antwerp hands” sold in the shops around you.",
      ],
      transitionToNext:
        "Turn towards the long, pale building behind Brabo. It survived one of the most terrible nights in the city's history.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
    "classics-stadhuis": {
      name: "City Hall",
      subtitle: "Built in pride, burned in fury",
      introduction: [
        "Before you stands the Stadhuis, Antwerp's City Hall. Its long façade is calm and horizontal, with a tall, richly decorated central section rising above it. When it was built, it was one of the most modern buildings in Europe: a Renaissance palace for a city at the height of its power.",
      ],
      sections: [
        {
          heading: "A palace for the city",
          kind: "history",
          paragraphs: [
            "The City Hall was built between 1561 and 1565, after designs by Cornelis Floris de Vriendt together with other architects and artists. Antwerp was then one of the richest cities in Europe, and it wanted its government to be housed in a building that showed it.",
          ],
        },
      ],
      didYouKnow: [
        "The building you see was restored after the fire of 1576. Look at the photograph on this page, taken in the mid-1860s: from the square, the City Hall looked then much as it does today.",
      ],
      lookAt: [
        {
          title: "The central section",
          body: "Compare the sober wings of the façade with the central part, which is stacked with columns, niches and statues and rises above the roofline. That contrast, calm and orderly with a burst of decoration in the middle, is typical of the Renaissance that Floris brought to Antwerp.",
        },
      ],
      // The Spanish Fury, as slides: the approved section, paragraph by paragraph, each with its images.
      cards: {
        "fury-attack": {
          title: "The Spanish Fury, 4 November 1576",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Barely ten years later, this building witnessed catastrophe. The Low Countries were in revolt against the Spanish king, and his soldiers in the region had not been paid for a long time. On 4 November 1576 mutinous Spanish troops broke out of the citadel south of the city, joined by mutineers from Aalst, stormed Antwerp and began to plunder it.",
              ],
            },
          ],
        },
        "fury-city-hall": {
          title: "The City Hall in flames",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "The city government organised a counter-attack from this City Hall, here on the Grote Markt. Antwerp's citizens defended themselves on the square and inside the building, and fired from the windows of the City Hall at the Spanish horsemen charging across the square. The riders suffered heavy losses, until a few of them forced their way in and set the building on fire with bundles of straw they had brought along.",
              ],
            },
          ],
        },
        "fury-city": {
          title: "The city in chaos",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "The flames spread to the surrounding houses: about six hundred burned down, most of them behind and beside the City Hall. Of the City Hall itself, only the outer walls remained standing.",
              ],
            },
            {
              kind: "history",
              paragraphs: [
                "How many people died is not known precisely. Estimates range from several hundred to around 8,000; many historians think that more than 7,000 people lost their lives. The event became known as the Spanish Fury, and it shook the confidence of what had been Europe's great trading city.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Leave the Grote Markt and walk east, through quiet streets, to a small square that many visitors call the most beautiful in Antwerp.",
    },

    // ── 14 ───────────────────────────────────────────────────────────────
    "classics-conscienceplein": {
      name: "Hendrik Conscienceplein",
      subtitle: "The man who taught his people to read",
      introduction: [
        "You are on the Hendrik Conscienceplein, a calm, enclosed square in front of a Baroque church. In front of the old library stands the statue of the writer Hendrik Conscience.",
      ],
      sections: [
        {
          heading: "A writer for the Flemish",
          kind: "history",
          paragraphs: [
            "In the 19th century, French dominated public life, government and literature in Belgium, including in Flanders. Hendrik Conscience wrote in Dutch, for ordinary Flemish readers. His historical novel De Leeuw van Vlaenderen (The Lion of Flanders), published in 1838, became a symbol of Flemish pride and emancipation.",
            "In 1883 he received a statue on this square, which had until then been called the Jezuïetenplein, the Jesuits' square, and was renamed after him. That was unheard of for a living author. Conscience himself posed for the sculptor, Frans Joris, but because of poor health he could not attend the unveiling in August 1883. He died a month later.",
          ],
        },
      ],
      didYouKnow: [
        "The famous words on the statue, “Hij leerde zijn volk lezen” (“He taught his people to read”), were first spoken at the unveiling by the poet Jan Van Beers. But it was not the sculptor who came up with them: the idea came from Henriëtte Mertens, the poet's wife.",
      ],
      transitionToNext:
        "Now turn around. The richly decorated church behind you is the next stop, and the place where we enter the age of Rubens.",
    },

    // ── 15 ───────────────────────────────────────────────────────────────
    "classics-carolus-borromeus": {
      name: "St Charles Borromeo Church",
      subtitle: "Rubens' lost masterpiece",
      introduction: [
        "Before you rises the façade of the Sint-Carolus Borromeuskerk: layered, sculpted, theatrical, a completely different world from the Gothic cathedral. This is the Baroque, the style of Rubens and of the Counter-Reformation, meant to overwhelm the senses and move the faithful.",
      ],
      sections: [
        {
          heading: "The Jesuits' showpiece",
          kind: "history",
          paragraphs: [
            "The church was built between 1615 and 1621 by the Jesuits, the Catholic order that stood at the forefront of the Counter-Reformation. It was designed by the Jesuit architects Pieter Huyssens and François d'Aguilon, and it was dedicated to the order's founder, Saint Ignatius of Loyola.",
            "Peter Paul Rubens, then at the height of his fame, was closely involved. For the aisles and galleries his studio produced 39 ceiling paintings based on his sketches; the young Anthony van Dyck helped with the work. For a century, this was one of the most splendid church interiors in Europe.",
          ],
        },
        {
          heading: "The lightning of 1718",
          kind: "history",
          paragraphs: [
            "On 18 July 1718 lightning struck the church and set it on fire. All 39 of Rubens' ceiling paintings were lost. The interior was afterwards rebuilt in a more austere style, designed by Jan Pieter van Baurscheit the Elder.",
            "Later in the 18th century the Jesuit order was suppressed, and the church was rededicated to Saint Charles Borromeo, the name it still carries today.",
          ],
        },
      ],
      didYouKnow: [
        "We only know what Rubens' ceilings looked like thanks to a series of prints: engravings by Jan Punt after watercolours by Jacob de Wit. The image on this page is one of them: a lost Rubens, preserved on paper.",
      ],
      transitionToNext:
        "From the Baroque we now go back further, into the late Middle Ages. Walk north towards the river, to a striking building in red and white stripes.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
    "classics-vleeshuis": {
      name: "The Vleeshuis",
      subtitle: "A palace for butchers",
      introduction: [
        "Before you stands the Vleeshuis, the Meat Hall. With its tall gables, towers and striking bands of red brick and white stone, it looks like a castle or a town hall. It was built for the city's butchers.",
      ],
      sections: [
        {
          heading: "The guild of butchers",
          kind: "history",
          paragraphs: [
            "The Vleeshuis was built between 1501 and 1504 for the butchers' guild, in late Gothic style. The design was by Herman de Waghemakere the Elder; after his death in 1502 the work was probably continued by his son Domien, the same Domien who later built the exchange and worked on the cathedral and Het Steen.",
            "It tells you a lot about how food was organised in a medieval city. The ground floor was a market hall with 62 meat benches, where the guild's butchers sold their meat, and it also housed the guild's chapel. Upstairs were the guild's meeting room, its feast hall and its archive. The guild controlled who could sell, and where.",
          ],
        },
      ],
      didYouKnow: [
        "Not everything could be sold inside. Offal and entrails were not allowed in the hall; they were sold in small shops, the penshuisjes, built outside against the building between its buttresses.",
        "The red-and-white bands in the walls are called speklagen, “bacon layers”. It is tempting to think they were a joke about the butchers, but they have nothing to do with the meat trade: they were simply a building fashion that stayed popular until well into the 17th century.",
      ],
      lookAt: [
        {
          title: "The bacon layers",
          body: "Look at the walls: rows of red brick alternate with bands of pale sandstone. Now that you know their name, you will spot these speklagen on many old buildings in Antwerp and elsewhere in Flanders.",
        },
      ],
      galleries: {
        "vleeshuis-postcards": {
          title: "The Vleeshuis on old postcards",
          intro: "Three old postcards of Museum Vleeshuis show its rooms, furnished with fireplaces, furniture and objects from the collection.",
        },
      },
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Find the old burcht wall",
        task: [
          "Find the old wall that protected the burcht from the early 13th century.",
          "The photo is your clue: look around the Vleeshuis for a piece of wall like this one. Found it? Tap the button below.",
        ],
      },
      transitionToNext:
        "Continue a few streets north, into the old harbour quarter. Here stands a church whose story is bound up with the river, and with fire.",
    },

    // ── 17 ───────────────────────────────────────────────────────────────
    "classics-sint-paulus": {
      name: "St Paul's Church",
      subtitle: "Gothic, Baroque, and saved from the flames",
      introduction: [
        "Before you stands the Sint-Pauluskerk, a Gothic church with a surprising Baroque tower on top. It stands close to the Scheldt, in what was for centuries the neighbourhood of sailors, dockworkers and merchants.",
      ],
      sections: [
        {
          heading: "A monastery by the river",
          kind: "history",
          paragraphs: [
            "This was the church of the Dominicans, an order of preaching friars. An earlier church here was consecrated in 1276 by the famous scholar Albertus Magnus. From 1517 onwards the present church was built to replace it, in the 16th century when Antwerp's trade was flourishing.",
            "The Scheldt was never far away. The river brought the ships, the goods and the people that filled this neighbourhood, and the church served a quarter whose rhythm was set by the tides and the harbour.",
          ],
        },
        {
          heading: "Two fires",
          kind: "history",
          paragraphs: [
            "In 1679 a fierce fire destroyed part of the vaults of the nave and the top of the west front. During the repairs of 1680–1681 the church received its Baroque tower crown, the one you see today.",
            "Almost three centuries later, in April 1968, fire struck again. The entire roof was lost, the vaults and interior were damaged, the Baroque tower crown burned out completely, and three quarters of the adjoining monastery became a ruin. The church was restored; its treasures, including paintings by Rubens, Van Dyck and Jordaens, can still be seen inside.",
          ],
        },
      ],
      didYouKnow: [
        "Next to the church, between 1699 and 1747, the Dominicans created a Calvary garden: a path lined with dozens of statues climbing to the cross, conceived as a kind of theatre in stone. It is one of the most surprising sights in the city.",
      ],
      transitionToNext:
        "Walk to the river. At the water's edge stands the oldest building in Antwerp, the last remnant of the castle where the city began.",
    },

    // ── 18 ───────────────────────────────────────────────────────────────
    "classics-het-steen": {
      name: "Het Steen",
      subtitle: "The last piece of the castle where Antwerp began",
      introduction: [
        "Before you stands Het Steen, “the Stone”: a small castle with towers and battlements on the bank of the Scheldt. It looks like a fairy-tale fortress, but what you see is only a fragment of something much larger: the burcht, the fortified heart from which Antwerp grew.",
      ],
      sections: [
        {
          heading: "Where the city was born",
          kind: "history",
          paragraphs: [
            "Around the year 850 a refuge fortress stood here, protected by an earthen rampart against Viking raids. In the late 10th century the ground was raised and a moat was probably dug. Around 1200–1225 the stone castle, Het Steen, was built, together with a wall around the burcht.",
            "From the early 14th century onwards the building served as a prison, a role it would keep for more than five centuries, until 1823.",
          ],
        },
        {
          heading: "The executioner of Antwerp",
          kind: "history",
          paragraphs: [
            "As the city prison, Het Steen was part of Antwerp's justice. The schout, the city's sheriff, prosecuted; the aldermen judged; and the executioner carried out the sentence. Suspects were interrogated here, sometimes under torture, in an underground chamber.",
            "Between 1405 and 1550 the Antwerp executioner carried out at least 336 beheadings with the sword, most of them on the Grote Markt in front of the City Hall. Other sentences were carried out on the Meir, on the bank of the Scheldt and at the gallows field. Between 1558 and 1562 more than fifty condemned people were drowned, preferably in secret inside Het Steen: public burnings of heretics had caused too much unrest.",
            "The executioners themselves did not always fare well. In 1508 a new executioner, a former shoemaker's journeyman, botched his first beheading, and children pelted him with stones. And on 17 January 1565 master Geleyn, the city's executioner since 1542, was himself beheaded on the Meir, convicted of murder, theft and violence.",
          ],
        },
        {
          heading: "Charles V rebuilds",
          kind: "history",
          paragraphs: [
            "Around 1520 the emperor Charles V had Het Steen rebuilt, to a design by Domien de Waghemakere and Rombout II Keldermans, the same names you met at the cathedral. Of the older castle only the base survived. In 1549 Charles V gave the building to the city.",
          ],
        },
        {
          heading: "The day the castle disappeared",
          kind: "history",
          paragraphs: [
            "For centuries Het Steen was hidden among the houses and streets of the old burcht. Then, in the 1880s, the Scheldt quays were straightened and rebuilt for the modern port. The old burcht quarter was demolished; the burcht wall along the river disappeared in 1883. Only Het Steen was kept, and in 1887–1890 it was restored and given a new neo-Gothic north wing.",
            "In 1952 it became the National Maritime Museum. After a renovation from 2018, it reopened in October 2021.",
          ],
        },
      ],
      didYouKnow: [
        "What you see as “the castle” is only a small part of the medieval burcht. Most of it was demolished in the 1880s to make way for the quays.",
        "Het Steen served as a prison from the early 14th century until 1823: more than 500 years.",
        "Few real instruments of torture or execution survive: in 1794 the French burned most of them.",
      ],
      lookAt: [
        {
          title: "Two kinds of stone",
          body: "Look at the lower part of the walls. The base is made of dark grey Doornik (Tournai) stone: the only part that survived from the older castle. Above it rises the paler sandstone of Charles V's rebuilding from the early 16th century. You are literally looking at two eras stacked on top of each other.",
        },
        {
          title: "The little figure above the gate",
          body: "Above the entrance gate, look for a small, weathered stone figure. By tradition it is said to represent Semini, an old fertility god. According to the heritage inventory it was mutilated around 1587, reportedly by the Jesuits, who found it indecent. Yet it survived, and it is still there today.",
        },
      ],
      transitionToNext:
        "Walk the last few steps to the water. Our journey back through time ends where Antwerp's story began.",
    },

    // ── 19 ───────────────────────────────────────────────────────────────
    "classics-scheldt": {
      name: "The Scheldt",
      subtitle: "Where it all began",
      introduction: [
        "Stand at the water's edge and look at the river. The Scheldt is wide, grey and restless here, pulled by tides from the North Sea. It may look like the end of the city. In fact, it is the reason the city exists.",
      ],
      sections: [
        {
          heading: "Everything you have seen",
          kind: "interpretation",
          paragraphs: [
            "Think back over the walk. The castle behind you was built to guard this river. The Vleeshuis, the guild houses and the exchange were paid for by the trade it carried. The cathedral's tower was the first thing sailors saw. Merchants from all over Europe came to the Handelsbeurs because of the ships that moored here. Rubens painted for a city made rich by the river. Even the diamonds and the grand railway station belong to a city that the port made powerful.",
            "The river brought wealth, but also war, migrants, ideas and art. It made Antwerp international long before that word existed.",
          ],
        },
        {
          heading: "A river closed and reopened",
          kind: "history",
          paragraphs: [
            "The Scheldt could also be taken away. After the fall of Antwerp in 1585, the fleet of the Dutch Republic blockaded the river, and Antwerp's access to the sea was cut off for two centuries. Only in 1795 was navigation officially freed again. Around 1811 Napoleon had new docks dug here, and in 1863 Belgium finally bought off the old Dutch toll on the Scheldt.",
            "In the 1880s the quays were straightened for the modern port, the moment Het Steen lost its castle. And the river still demands respect: after the storm surge of 3 January 1976, when the water at Antwerp rose to more than seven metres, the Sigma Plan was launched to protect the whole Scheldt basin against flooding.",
          ],
        },
      ],
      didYouKnow: [
        "For about two hundred years, from the blockade after 1585 until 1795, Antwerp was a great port without free access to the sea. It is one of the reasons the city's golden age came to an end.",
      ],
      galleries: {
        "siege-of-antwerp": {
          title: "The siege of Antwerp, 1584–1585",
          intro: "The fall of Antwerp in 1585 came after a siege of more than a year by Alexander Farnese, Duke of Parma. These prints show how he closed the river, and how the city tried to break through.",
        },
      },
      closing: {
        timeline: [
          "Antwerpen-Centraal: the 20th century begins",
          "The Stadsfeestzaal and the Boerentoren: a confident modern city",
          "The Handelsbeurs: a 19th-century hall on a 16th-century idea",
          "Carolus Borromeus: Rubens and the Baroque",
          "The City Hall and the Vleeshuis: the 16th-century trading metropolis",
          "The cathedral: medieval Antwerp",
          "Het Steen: the castle where the city began",
          "The Scheldt",
        ],
        finalLines: [
          "You started this walk at a railway station built for the modern age. With every stop you went further back: from the 20th century to the 19th, to Rubens and the Baroque, to the merchants of the 16th century, to the medieval cathedral and the old castle.",
          "And now you are standing where it all began: by the river.",
          "You haven't just walked through Antwerp. You've walked back through its history.",
        ],
      },
    },
  },

  images: {
    "central-station-1906": {
      caption: "Antwerpen-Centraal shortly after its completion, on a postcard from around 1906.",
      alt: "Old postcard of the domed stone façade of Antwerp Central Station, with people on the square in front",
      approximateYear: "ca. 1906",
    },
    "central-station-hall-1909": {
      caption: "Inside the station building, on a postcard sent in 1909.",
      alt: "Old postcard of a tall, ornate hall with balconies and arched windows inside the station",
      approximateYear: "1909",
    },
    "central-station-today": {
      caption: "The train hall today, with the clock, the word ANTWERPEN and the city's coat of arms above the entrance.",
      alt: "Modern photo of the iron and glass train hall with the ornate stone front of the station building",
      approximateYear: "2023",
    },
    // Clue of Spooky's task at the station: says where it was taken, not what to find.
    "central-station-hall-clue-today": {
      caption: "Spooky's clue: a photo taken in the station.",
      alt: "Photo of an ornate wall under a glass and iron roof, with a clock, gilded decorations and a name in gold letters",
      approximateYear: "2006",
    },
    "diamond-pelikaanstraat": {
      caption: "Pelikaanstraat, on the edge of today's diamond district, around 1900.",
      alt: "Old postcard of a cobbled street with shops, a horse-drawn cart and a tower in the distance",
      approximateYear: "ca. 1900",
    },
    "keyserlei-1903": {
      caption: "De Keyserlei in 1903. At the far end of the avenue, the cathedral spire already points the way.",
      alt: "Old postcard of a wide avenue with trees, carts and grand buildings, a church spire in the distance",
      approximateYear: "1903",
    },
    "meir-1910": {
      caption: "The Meir on a postcard sent in 1910, with a horse-drawn tram.",
      alt: "Old postcard of a square with a horse-drawn tram and shop fronts",
      approximateYear: "ca. 1910",
    },
    "stadsfeestzaal-today": {
      caption: "The entrance of the Stadsfeestzaal on the Meir, rebuilt after the fire of 2000.",
      alt: "Modern photo of an ornate stone entrance with a gilded niche and the word STADSFEESTZAAL",
      approximateYear: "2014",
    },
    "handelsbeurs-1890": {
      caption: "Joseph Schadde's exchange hall around 1890: a Gothic courtyard under a roof of iron and glass.",
      alt: "Old photograph of a Gothic courtyard with galleries under a large iron and glass roof",
      approximateYear: "ca. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "The same hall in a pen drawing by Maxime Lalanne, made before 1886.",
      alt: "Pen drawing of the exchange hall with merchants standing in the courtyard",
      approximateYear: "before 1886",
    },
    "boerentoren-1930s": {
      caption: "The Boerentoren towering over its neighbours, on a postcard from the 1930s.",
      alt: "Old postcard of a tall Art Deco tower above a busy square with trams",
      approximateYear: "1930s",
    },
    "groenplaats-1899": {
      caption: "The Groenplaats around 1899, with Rubens on his pedestal and the cathedral behind the trees.",
      alt: "Old postcard of a tree-lined square with a statue and the cathedral tower behind it",
      approximateYear: "ca. 1899",
    },
    "cathedral-hollar-1649": {
      caption: "The cathedral in an etching by Wenceslaus Hollar, 1649. The south tower was already unfinished.",
      alt: "Detailed etching of the cathedral front with one tall spire and one much shorter tower",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "The cathedral spire above the rooftops, around 1908.",
      alt: "Old postcard of the cathedral's tall Gothic tower above a square",
      approximateYear: "ca. 1908",
    },
    "grote-markt-1905": {
      caption: "The Grote Markt in 1905, with the Brabo Fountain on the left and the guild houses behind it.",
      alt: "Coloured old postcard of the square with the fountain and tall gabled guild houses",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Guild houses on the Grote Markt today, with their gilded figures on the gables.",
      alt: "Modern photo of tall stone guild houses with golden statues on top against a blue sky",
      approximateYear: "2021",
    },
    "brabo-photochrom": {
      caption: "Brabo throws the giant's hand: a colour print from the 1890s.",
      alt: "Coloured historical print of the bronze Brabo statue on a rocky fountain in front of guild houses",
      approximateYear: "1890s",
    },
    "stadhuis-1866": {
      caption: "The City Hall in an early photograph from the mid-1860s, mounted in an album dated 1867.",
      alt: "Early photograph of the long Renaissance façade of the City Hall",
      approximateYear: "1865–1867",
    },
    "conscienceplein-historical": {
      caption: "Hendrik Conscienceplein around 1900, with the library behind Conscience's statue.",
      alt: "Old postcard of a stately building on a square with a statue in front of its entrance",
      approximateYear: "ca. 1900",
    },
    "carolus-ceiling-punt-1748": {
      caption: "The Adoration of the Magi, one of Rubens' lost ceiling paintings for this church, known only through prints like this 18th-century engraving by Jan Punt after Jacob de Wit.",
      alt: "Black-and-white engraving of the three kings presenting gifts to the Virgin and Child",
      approximateYear: "18th century",
    },
    "vleeshuis-1901": {
      caption: "“Vieille Boucherie”: the Vleeshuis and its surroundings on a postcard sent around 1901.",
      alt: "Old postcard of a tall brick building with an archway and children in the street",
      approximateYear: "ca. 1901",
    },
    "vleeshuis-wall-clue": {
      caption: "Spooky's clue: an old photo of a corner near the Vleeshuis.",
      alt: "Black-and-white photo of a rough wall of uneven stones against a tall brick building",
      approximateYear: "date unknown",
    },
    "vleeshuis-postcard-kitchen": {
      caption: "A room furnished as an old kitchen, with a large hearth, copper kettles and a decorated water pump with a basin (postcard of Museum Vleeshuis, date unknown; MAS collection).",
      alt: "Sepia postcard of a room with a large fireplace, copper kettles on the hearth, tiled walls, two chairs and an ornate pump with a stone basin",
      approximateYear: "date unknown",
    },
    "vleeshuis-postcard-panelled-room": {
      caption: "A room with a fireplace, carved cabinets, decorated wall panels and a statue on a cabinet (postcard of Museum Vleeshuis, date unknown; MAS collection).",
      alt: "Sepia postcard of a room whose walls are covered with decorated panels, with a fireplace, carved cabinets, a table and a statue",
      approximateYear: "date unknown",
    },
    "vleeshuis-postcard-hall": {
      caption: "A hall with a long table and chairs, a glass chandelier, a tall clock and a richly carved fireplace with a seated figure above it (postcard of Museum Vleeshuis, date unknown; MAS collection).",
      alt: "Sepia postcard of a hall with a long table surrounded by chairs, a glass chandelier, stained-glass windows, a tall clock and a large carved fireplace",
      approximateYear: "date unknown",
    },
    "siege-parma-bridge": {
      caption: "Parma's bridge of boats across the Scheldt, finished in February 1585 to cut the city off from help by water; Antwerp is on the horizon. Print by Lamberecht Causé after Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Engraving of a long bridge built on boats across a wide river, with soldiers and carriages on it, warships around it and a city skyline in the distance",
      approximateYear: "1670–1699",
    },
    "siege-bridge-attack": {
      caption: "April 1585: Antwerp sends fire ships against the bridge. The title says that Alexander of Parma himself nearly died, but the bridge held and the attack failed. Print by Lamberecht Causé after Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Engraving of a huge explosion on a bridge of boats, with planks, boats and soldiers flung through the air and smoke over the river",
      approximateYear: "1670–1699",
    },
    "siege-map-luyken": {
      caption: "The whole siege on one map by Jan Luyken (1680–1684): Antwerp at top left, the bridge of boats in the middle, the flooded land, and on the right the fighting on the Kouwenstein dike in May 1585, another failed attempt to break through (Rijksmuseum).",
      alt: "Engraved map of the Scheldt below Antwerp with forts, a bridge across the river, flooded fields, ships and troops fighting along a dike",
      approximateYear: "1680–1684",
    },
    "sint-paulus-1901": {
      caption: "St Paul's Church and the cafés around it, on a postcard dated 1901.",
      alt: "Old postcard of a Gothic church with a Baroque tower above small houses and cafés",
      approximateYear: "1901",
    },
    "steen-photochrom": {
      caption: "Het Steen and the harbour in the 1890s, a few years after the quays were straightened.",
      alt: "Coloured historical print of the small castle beside the quay with ships and people",
      approximateYear: "1890s",
    },
    "steen-1920": {
      caption: "A busy day at Het Steen and the harbour, around 1920.",
      alt: "Old postcard of crowds, carts and ships beside the castle on the quay",
      approximateYear: "ca. 1920",
    },
    "steen-today": {
      caption: "Het Steen today.",
      alt: "Modern photo of the castle's towers against a blue sky",
      approximateYear: "2015",
    },
    "scheldt-quays-1900": {
      caption: "The Scheldt quays around 1900, lined with ships and sheds.",
      alt: "Illustrated old postcard of steamships and sailing boats along the quay",
      approximateYear: "ca. 1900",
    },
    "diamond-bourse-today": {
      caption: "The Beurs voor Diamanthandel in the Pelikaanstraat, one of the diamond bourses of the district and a protected monument.",
      alt: "Modern photo of a tall stone office building with a carved name band and flags above the entrance",
      approximateYear: "2010",
    },
    "flatow-expulsion-card-1941": {
      caption: "Card from 1941 for Siegfried Flatow, a German born in Berlin in 1921, who lived at Zurenborgstraat 17 in Antwerp. It records that on 1 February 1941 he was forcibly removed to Beverloo, Leysestraat 25.",
      alt: "Yellowed bilingual German and Dutch form filled in on a typewriter, with a fingerprint in the bottom box and an empty space for a photo",
      approximateYear: "1941",
    },
    "dossin-courtyard-1942": {
      caption: "The courtyard of Kazerne Dossin in Mechelen, 1942: luggage spread over the ground, lorries and groups of people.",
      alt: "Black-and-white photo of an enclosed barracks courtyard with rows of suitcases and bundles on the ground, two lorries and groups of people along the edges",
      approximateYear: "1942",
    },
    "paleis-op-de-meir-today": {
      caption: "The Paleis op de Meir today: the 18th-century merchant's palace that Napoleon bought.",
      alt: "Modern photo of a pale Rococo palace façade with a balcony and an ornate crest on the roof",
      approximateYear: "2023",
    },
    "rex-ruins": {
      caption: "Cinema Rex in ruins after the V-2 strike of 16 December 1944.",
      alt: "Sepia photo of a bombed cinema building with collapsed walls and an exposed domed roof, with a 1940s car parked in front",
      approximateYear: "1944–1947",
    },
    // The clue of Spooky's quest: shown before the place is found, so it must not name it.
    "paleis-op-de-meir-drawing": {
      caption: "Spooky's clue: an old elevation drawing of a long façade.",
      alt: "Old drawing of a long, symmetrical façade with tall windows, small balconies, vases on the roof and a large ornate crest in the middle",
      approximateYear: "date unknown",
    },
    "rubens-self-portrait-1623": {
      caption: "Peter Paul Rubens, self-portrait, 1623 (Royal Collection, London).",
      alt: "Painted portrait of a bearded man in a broad black hat and dark cloak",
      approximateYear: "1623",
    },
    "rubenshuis-garden-today": {
      caption: "The garden of the Rubens House today, with the house and, on the right, the portico from Rubens' own time.",
      alt: "Modern photo of a garden with a fountain in front of a Renaissance house and a stone gateway topped with statues",
      approximateYear: "2025",
    },
    "rubens-honeysuckle-bower": {
      caption: "Rubens and Isabella Brant in the Honeysuckle Bower, around 1609–1610 (Alte Pinakothek, Munich).",
      alt: "Painting of a richly dressed young couple sitting hand in hand under a bower of honeysuckle",
      approximateYear: "ca. 1609–1610",
    },
    "handelsbeurs-open-courtyard-1613": {
      caption: "The exchange of 1531 with its open courtyard, full of merchants: an engraving published in 1613.",
      alt: "Black-and-white engraving of a rectangular courtyard surrounded by galleries, with small groups of people and two towers",
      approximateYear: "1613",
    },
    "groenkerkhof-1597": {
      caption: "A funeral procession at the churchyard of the cathedral, today's Groenplaats: an anonymous painting from 1597 (Museum Vleeshuis).",
      alt: "Old painting of mourners in black walking past a churchyard, with the tall cathedral tower behind",
      approximateYear: "1597",
    },
    "groenplaats-rubens-statue-1840s": {
      caption: "The cathedral seen from the Groenplaats, with the new statue of Rubens: a lithograph by Jules Alexandre Monthelier, 1840s.",
      alt: "Lithograph of a bronze statue on a high pedestal among trees, with the cathedral and its spire behind",
      approximateYear: "1840s",
    },
    "matsijs-portrait-1572": {
      caption: "Quinten Matsijs in a portrait print published in Antwerp in 1572. The Latin verse below tells how love made him a painter.",
      alt: "Engraved profile portrait of a man in a cap and cloak holding rolled papers, with Latin verse below",
      approximateYear: "1572",
    },
    "matsijs-altarpiece-1511": {
      caption: "Quinten Matsijs' altarpiece for the joiners' guild, painted in 1508–1511 for this cathedral (KMSKA, Antwerp).",
      alt: "Painted triptych with a Lamentation of Christ in the middle panel and two side panels",
      approximateYear: "1511",
    },
    "matsijs-well": {
      caption: "The well beside the cathedral, photographed around 1875–1900. Its wrought-iron cage is traditionally attributed to Matsijs.",
      alt: "Old photograph of an ornate wrought-iron well cage on a stone base in front of a Gothic wall",
      approximateYear: "ca. 1875–1900",
    },
    "nello-patrasche-today": {
      caption: "Nello and Patrasche by Batist Vermeulen (2016), sleeping under a blanket of cobblestones in front of the cathedral.",
      alt: "Modern photo of a white marble statue of a boy and a dog lying under a cobblestone blanket, the cathedral tower behind",
      approximateYear: "2023",
    },
    "vlaeykensgang-today": {
      caption: "The Vlaeykensgang today: cobblestones, brick walls and a covered passage.",
      alt: "Modern photo of a narrow cobbled alley between brick walls, seen through a low covered passage",
      approximateYear: "2022",
    },
    "stadhuis-spanish-fury-hogenberg": {
      caption: "The City Hall in flames during the Spanish Fury, with fighting on the Grote Markt: an etching by Frans Hogenberg, made before 1585.",
      alt: "Etching of a large Renaissance city hall with flames and smoke rising, soldiers fighting on the square in front",
      approximateYear: "before 1585",
    },
    "handelsbeurs-vandennest": {
      caption: "The galleries decorated with chandeliers, drapery and small trees, in a print by J.B.J. Vandennest made between 1842 and 1851: still before the courtyard got its first roof (University of Antwerp, Special Collections).",
      alt: "Print of long vaulted galleries with carved columns, hanging chandeliers, drapery and rows of small trees, with two men in uniform in the foreground",
      approximateYear: "1842–1851",
    },
    "handelsbeurs-lebrun-liedel": {
      caption: "The exchange after its rebuilding: carved columns, vaulted galleries and a few merchants, in a print by Lebrun-Liedel from after 1872 (University of Antwerp, Special Collections).",
      alt: "Black-and-white print of a hall with richly carved columns and pointed vaults, with a man in a top hat reading in the foreground",
      approximateYear: "after 1872",
    },
    "spanish-fury-overview-1577": {
      caption: "The Spanish Fury on one sheet: an anonymous print from 1577 with a map of Antwerp and its citadel in the middle, surrounded by scenes of the attack, the fighting and the burning City Hall (Rijksmuseum).",
      alt: "Print with a bird's-eye map of Antwerp and its star-shaped citadel in the centre, framed by small scenes of soldiers attacking, fighting and plundering",
      approximateYear: "1577",
    },
    "spanish-fury-de-braekeleer": {
      caption: "The Spanish Fury in Antwerp as Ferdinand de Braekeleer the Elder painted it in 1836: a romantic 19th-century picture of armed citizens and wounded among smoke and fire, with the cathedral tower behind (KMSKA, Antwerp).",
      alt: "Painting of a crowd of armed townspeople, wounded men and a woman kneeling beside a dying man, with smoke, fire and a cathedral tower in the background",
      approximateYear: "1836",
    },
    "spanish-fury-mas": {
      caption: "A street full of victims, with houses burning at the far end: an anonymous painting of the Spanish Fury, made between 1576 and about 1585 (MAS, Antwerp).",
      alt: "Painting of a crowded street with soldiers, horsemen and many dead bodies, burning houses and black smoke in the distance and a church tower on the left",
      approximateYear: "1576–1585",
    },
    "spanish-fury-hogenberg-plunder": {
      caption: "Plunder and torture in Antwerp's houses during the Spanish Fury, in a print by Frans Hogenberg (16th century; Rijksmuseum).",
      alt: "Engraving of soldiers torturing people hung from ropes inside houses, with bodies on the ground and a street with gabled houses behind",
      approximateYear: "16th century",
    },
    "spanish-fury-print-1618": {
      caption: "‘Spaensche Furie tot Antwerpen’: a print from about 1618–1624 that repeats the scene, with a verse lamenting the fate of the city (anonymous; Rijksmuseum).",
      alt: "Engraving of the same torture and plunder scene, with the title ‘Spaensche Furie tot Antwerpen’ and two columns of Dutch verse below",
      approximateYear: "c. 1618–1624",
    },
    "execution-hogenberg-1568": {
      caption: "An execution in the Low Countries of the time: the beheading of the Counts of Egmont and Horne on the Grote Markt of Brussels in 1568, in an etching by Frans Hogenberg. Not Antwerp, but the same era and the same kind of justice.",
      alt: "Etching of a scaffold surrounded by soldiers with pikes, an executioner with a sword beside a kneeling man",
      approximateYear: "1568–1570",
    },
    "scheldt-photochrom": {
      caption: "Antwerp seen from the river in the 1890s: Het Steen on the left, the cathedral rising above the city.",
      alt: "Coloured historical print of the Antwerp skyline seen across the river, with boats in front",
      approximateYear: "1890s",
    },
  },
};
