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
      "A narrated walk from the grand railway station to the banks of the Scheldt: eighteen stops, eight centuries, and the stories behind Antwerp's most famous places.",
    description:
      "Walk from Antwerp's grand railway station through centuries of trade, art, religion and power, ending where the story of the city began: on the banks of the Scheldt.\n\nAt every stop your phone becomes your guide: what you are looking at, why it was built, what happened here, and the details most visitors walk straight past. Historical photographs show you how the city looked a century ago and more. There are no games or questions; just Antwerp, and the time to look at it properly.",
    highlights: [
      "18 of Antwerp's most important historical places",
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
      nextLocationTitle: "Next stop",
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
        {
          heading: "A palace on the Meir",
          kind: "history",
          paragraphs: [
            "Continue onto the Meir and look out for a long, elegant 18th-century façade: the Paleis op de Meir. It was built from 1745 for a wealthy merchant, Johan Alexander van Susteren, by the Antwerp architect Jan Pieter van Baurscheit the Younger. Later it passed through remarkable hands: Napoleon bought it in 1811–1812 but never lived there, the Russian Tsar Alexander I stayed there in 1814, and for a long time it served as a royal palace.",
            "Just off the Meir, on the Wapper, stands the house where Peter Paul Rubens lived and worked. You will meet Rubens again several times on this walk.",
          ],
        },
      ],
      didYouKnow: [
        "Cinema Rex was rebuilt after the war and reopened in 1947. It finally closed in 1993 and was demolished two years later. Today little in the street reminds passers-by of what happened here.",
        "Napoleon owned the palace on the Meir, but by the time it was ready for him he was already in exile on the island of Elba.",
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
        "Leave the Meir for a moment and turn into the narrow streets behind it. Hidden behind ordinary façades is the building where Antwerp once taught the world how to trade.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "The Handelsbeurs",
      subtitle: "Where the world came to do business",
      introduction: [
        "Before you is the Handelsbeurs, Antwerp's old commercial exchange. From the street it hardly announces itself. Inside is one of the most extraordinary rooms in the city: a Gothic courtyard surrounded by galleries, covered by a soaring roof of iron and glass.",
        "We now step back into the 16th century, when Antwerp was one of the richest cities in Europe.",
      ],
      sections: [
        {
          heading: "Trading without telephones",
          kind: "history",
          paragraphs: [
            "Imagine Antwerp around 1530. Ships from Portugal arrive with spices from Asia; merchants from Italy, Germany, England and Spain live in the city. They need to know prices, find buyers, borrow money, insure cargoes, and there are no telephones, no newspapers as we know them, no internet. Information travels by letter and, above all, by word of mouth.",
            "So Antwerp built a place where all those merchants could meet every day. In 1531 the city opened an exchange designed by Domien de Waghemakere, in the late Gothic Brabant style: an open courtyard surrounded by a covered gallery with elaborate star vaults. It was one of the first buildings anywhere built specifically for this purpose. Here, in a babel of languages, prices were set and deals were closed.",
          ],
        },
        {
          heading: "Fire, and fire again",
          kind: "history",
          paragraphs: [
            "The building you see is not simply the one from 1531. The exchange was rebuilt in 1583 and burned down in 1858. Architect Joseph Schadde then designed the present building; the commission was finally given to him in 1868, and the new exchange was solemnly inaugurated on 19 October 1872. He kept the idea of the Gothic courtyard but covered it with a spectacular roof of iron and glass, and remains of the old exchange were incorporated into the complex.",
            "By the end of the 20th century trading had moved elsewhere, and the building stood empty for some twenty years. After a thorough restoration it opened again in 2019, now as a venue for events.",
          ],
        },
      ],
      didYouKnow: [
        "Antwerp's exchange became a model abroad. When Thomas Gresham, the English crown's agent in Antwerp, founded the Royal Exchange in London in the 1560s, he took the Antwerp bourse as his example.",
        "The word “bourse” itself is usually traced back not to Antwerp but to Bruges, where merchants met in front of the house of the Van der Beurse family.",
      ],
      transitionToNext:
        "Back on the Meir, look up. A tower rises above the rooftops like a piece of New York dropped into a medieval city. We step forward in time for a moment, before our journey into the past really begins.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
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

    // ── 7 ────────────────────────────────────────────────────────────────
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
          ],
        },
        {
          heading: "Rubens takes his place",
          kind: "history",
          paragraphs: [
            "In 1840 Antwerp marked 200 years since the death of Rubens. A statue was designed by Willem Geefs, but money was short and the bronze was not ready in time, so on 25 August 1840 a temporary plaster version was unveiled on another square. Only on 9 and 10 August 1843 did the bronze Rubens take his place here, in the middle of the Groenplaats.",
          ],
        },
      ],
      didYouKnow: [
        "When you sit on a terrace here, you are sitting on what was, for centuries, the burial ground of the cathedral.",
      ],
      transitionToNext:
        "Walk towards the cathedral. As you go, look at the row of houses built against the choir of the church. They hide the foundations of a cathedral that was never finished.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Cathedral of Our Lady",
      subtitle: "The cathedral Antwerp almost made even bigger",
      introduction: [
        "Before you stands the Cathedral of Our Lady, one of the largest Gothic churches in the Low Countries and for centuries the landmark that sailors on the Scheldt saw first. Its north tower, some 123 metres high, still dominates the skyline.",
        "We are now in the late Middle Ages. The cathedral was built over roughly 170 years, from the middle of the 14th century until 1521, by generations of builders who knew they would never see it finished.",
      ],
      sections: [
        {
          heading: "Even bigger: the Nieuwerck",
          kind: "history",
          paragraphs: [
            "In 1521, just as the church was completed, Antwerp decided it was not big enough. The richest city in northern Europe wanted a church to match, and a gigantic extension of the choir, the Nieuwerck, was designed by Domien de Waghemakere and Rombout Keldermans.",
            "On 15 July 1521 the young emperor Charles V laid the first stone himself. Then disaster struck. A great fire in 1533 badly damaged the church, all money went into repairing the existing building, work on the Nieuwerck stopped, and in 1537 the project was abandoned for good.",
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
      lookAt: [
        {
          title: "One tower and a half",
          body: "Look at the front of the cathedral. The left (north) tower rises all the way to its elegant spire; the right (south) tower stops at roughly a third of that height. The plan was for two great towers, but only one was ever completed. Look at the etching from 1649 on this page: the lopsided silhouette was already the same then.",
        },
      ],
      transitionToNext:
        "Walk around the cathedral to the Oude Koornmarkt. Look carefully for a narrow entrance between the houses: it leads to a hidden alley that time seems to have forgotten.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "A secret passage into old Antwerp",
      introduction: [
        "Step through the narrow entrance and the noise of the city disappears. You are in the Vlaeykensgang, a winding alley between old brick walls, little courtyards and small houses. For a moment it is easy to imagine Antwerp centuries ago.",
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

    // ── 10 ───────────────────────────────────────────────────────────────
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

    // ── 11 ───────────────────────────────────────────────────────────────
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

    // ── 12 ───────────────────────────────────────────────────────────────
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
        {
          heading: "The Spanish Fury, 4 November 1576",
          kind: "history",
          paragraphs: [
            "Barely ten years later, this building witnessed catastrophe. The Low Countries were in revolt against the Spanish king, and his soldiers in the region had not been paid for a long time. On 4 November 1576 mutinous Spanish troops stormed Antwerp and began to plunder it.",
            "The city government organised a counter-attack from this City Hall, here on the Grote Markt. The soldiers set the building on fire. The flames spread to the surrounding houses, hundreds of which burned down. Of the City Hall, only the outer walls remained standing.",
            "How many people died is not known precisely. Estimates range from several hundred to around 8,000; many historians think that more than 7,000 people lost their lives. The event became known as the Spanish Fury, and it shook the confidence of what had been Europe's great trading city.",
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
      transitionToNext:
        "Leave the Grote Markt and walk east, through quiet streets, to a small square that many visitors call the most beautiful in Antwerp.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
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

    // ── 14 ───────────────────────────────────────────────────────────────
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

    // ── 15 ───────────────────────────────────────────────────────────────
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
      transitionToNext:
        "Continue a few streets north, into the old harbour quarter. Here stands a church whose story is bound up with the river, and with fire.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
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

    // ── 17 ───────────────────────────────────────────────────────────────
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

    // ── 18 ───────────────────────────────────────────────────────────────
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
    "scheldt-photochrom": {
      caption: "Antwerp seen from the river in the 1890s: Het Steen on the left, the cathedral rising above the city.",
      alt: "Coloured historical print of the Antwerp skyline seen across the river, with boats in front",
      approximateYear: "1890s",
    },
  },
};
