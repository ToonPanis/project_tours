import type { PoortjesStopText } from "../types";

/**
 * Part 2: Cathedral & Old Town (gates 10–23, historical stops). English master text.
 * Grote Markt, City Hall, Brabo and the cathedral: facts as checked for
 * Classics of Antwerp (see stops.ts for the sources).
 */
export const deel2: Record<string, PoortjesStopText> = {
  // ── Pause + cards ───────────────────────────────────────────────────
  "poortjes-grote-markt": {
    name: "Grote Markt: a break at Rococo",
    subtitle: "Sit down for a while in the heart of the city",
    introduction: [
      "Time for a break. You are on the Grote Markt, Antwerp's main square, and café Rococo is on the square. Take a seat if you like, or sit on a bench or a step: you don't have to order anything to carry on.",
      "While you rest, you can read three short stories below: about the square, the City Hall and the fountain. Look up now and then: everything they describe is right in front of you.",
    ],
    sections: [],
    infoBoxes: [
      {
        kind: "pause",
        title: "Time for a break",
        paragraphs: [
          "This break is a suggestion, not an obligation. The walk simply continues whether you order something or not.",
          "Anyone who has a drink chooses it themselves: with or without alcohol. We have not checked Rococo's opening hours; if the café is closed or full, any terrace or bench on the square will do just as well.",
        ],
      },
    ],
    cards: [
      {
        id: "card-grote-markt",
        title: "The Grote Markt",
        subtitle: "The square of the guilds",
        imageId: "grote-markt-1905",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Around the square stand tall guild houses with stepped and scrolled gables, crowned with gilded figures. The guilds were the associations of craftsmen and traders. They regulated much of city life: who was allowed to work, what could be sold and at what quality. Their houses here were their calling cards.",
              "In November 1576 mutinous Spanish soldiers plundered the city. The fire they started destroyed the houses on the square. The finest example of what rose again afterwards is the house of the Oude Voetboog (Old Crossbow), the guild of St George: built in 1515–1516, destroyed in 1576 and rebuilt in Renaissance style in 1580–1582.",
            ],
          },
          {
            heading: "Younger than it looks",
            kind: "history",
            paragraphs: [
              "Much of what you see is younger than it looks. In 1895 a citizen, R. Joostens, left money to restore the former splendour of the Grote Markt. From the late 19th to the early 20th century, the façades on the north side, and number 44 on the south side, were freely reconstructed and embellished in the spirit of the 16th century.",
            ],
          },
        ],
        didYouKnow: [
          "On top of the façade of the Oude Voetboog, look for the golden St George on horseback, fighting the dragon.",
        ],
      },
      {
        id: "card-stadhuis",
        title: "The City Hall",
        subtitle: "Built in pride, burned in fury",
        imageId: "stadhuis-1866",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "The City Hall (Stadhuis) was built between 1561 and 1565, designed by Cornelis Floris de Vriendt together with other architects and artists. Antwerp was then one of the richest cities in Europe and wanted to show it.",
              "Look at the long, calm wings and at the richly decorated central section that rises above the roofline, full of columns, niches and statues. That contrast between calm order and a burst of decoration in the middle is typical of the Renaissance that Floris brought to Antwerp.",
            ],
          },
          {
            heading: "The Spanish Fury",
            kind: "history",
            paragraphs: [
              "On 4 November 1576 mutinous Spanish troops, who had not been paid for a long time, stormed the city. The city government organised a counter-attack from this City Hall. The soldiers set the building on fire; only the outer walls remained standing. How many people died is not known precisely. Estimates range from several hundred to around 8,000.",
            ],
          },
        ],
      },
      {
        id: "card-brabo",
        title: "The Brabo Fountain",
        subtitle: "A giant, a hand and the name of a city",
        imageId: "brabo-photochrom",
        sections: [
          {
            heading: "The legend",
            kind: "legend",
            paragraphs: [
              "Long ago, so the story goes, a giant called Druon Antigoon lived beside the Scheldt. He demanded a toll from every ship that wanted to pass. Anyone who did not pay lost a hand, and the giant threw it into the river.",
              "Until the young Roman soldier Silvius Brabo challenged him, defeated him, cut off the giant's hand and threw it into the Scheldt. That, the legend says, is how the city got its name: “hand werpen”, to throw a hand: Antwerpen.",
            ],
          },
          {
            heading: "What historians think",
            kind: "interpretation",
            paragraphs: [
              "A wonderful story, but not an explanation historians take seriously. The origin of the name Antwerpen is uncertain. Most explanations connect it not with hands but with land: with ground along the river, a piece of land “in front”, thrown up by the water. The legend is a much later attempt to explain a name whose real origin had been forgotten.",
            ],
          },
          {
            heading: "The statue",
            kind: "history",
            paragraphs: [
              "The fountain is by the Antwerp sculptor Jef Lambeaux, who had largely finished his design by 1883. It was placed on the Grote Markt, in front of the City Hall, in 1887, at a time when Antwerp liked to celebrate its own history and identity. Brabo stands on a rocky base and throws the hand away.",
            ],
          },
        ],
        didYouKnow: [
          "You see the hands of the legend all over Antwerp: in the city's coat of arms (a castle with two hands above it) and in the chocolate and biscuit “Antwerp hands” in the shops around the square.",
        ],
      },
    ],
    didYouKnow: [],
    thenAndNow: [
      "Compare the photo from around 1905 with the square today. The reconstruction of the façades was in full swing at the time.",
    ],
    transitionToNext: "Rested? Walk to the cathedral, a few streets away. You can already see its tower above the rooftops.",
  },

  // ── Cathedral ────────────────────────────────────────────────────────
  "poortjes-kathedraal": {
    name: "Onze-Lieve-Vrouwekathedraal (Cathedral of Our Lady)",
    subtitle: "One and a half towers and 170 years of building",
    introduction: [
      "In front of you stands one of the largest Gothic churches in the Low Countries. For centuries its north tower, about 123 metres high, was the first thing sailors on the Scheldt saw of Antwerp.",
      "First look at the front. The left tower rises all the way to an elegant spire; the right tower stops at about a third of that height. Two great towers were planned; only one was ever completed.",
    ],
    sections: [
      {
        heading: "Generations of builders",
        kind: "history",
        paragraphs: [
          "The cathedral was built over roughly 170 years, from the middle of the 14th century until 1521, by generations of builders who knew they would never see it finished.",
          "In 1521, just as the church was complete, Antwerp decided it was not big enough. Domien de Waghemakere and Rombout Keldermans designed a gigantic extension of the choir: the Nieuwerck. On 15 July 1521 the young Emperor Charles V laid the first stone himself. But in 1533 a great fire damaged the church, all the money went into repairs, and in 1537 the Nieuwerck was abandoned for good.",
        ],
      },
      {
        heading: "Storms of history",
        kind: "history",
        paragraphs: [
          "During the Iconoclastic Fury of 1566, a wave of Protestant anger against images, much of the interior was destroyed. Two centuries later, French revolutionary troops occupied the city, closed the church and carried off its treasures.",
          "Much of what you see inside today was brought back or restored afterwards, including altarpieces by Rubens. The best known are The Elevation of the Cross and The Descent from the Cross.",
        ],
      },
      {
        heading: "How to read a Gothic church",
        kind: "context",
        paragraphs: [
          "You can recognise Gothic architecture by its pointed arches, tall windows and striving for height and light. The walls are supported by buttresses, leaving more room for glass. Along the side walls, look for those heavy piers against the wall and the pointed arches of the windows.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visiting the interior",
        paragraphs: [
          "The interior, with the paintings by Rubens, can be visited with a paid entrance ticket. Opening hours vary because of services and holidays: check them before you go.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://visit.antwerpen.be/en/info/cathedral-of-our-lady",
      },
    ],
    didYouKnow: [
      "The Nieuwerck was never built, but it didn't disappear completely either. Its foundations and piers survive in the row of houses around the choir, between the Lijnwaadmarkt and the Groenplaats.",
    ],
    lookAt: [
      {
        title: "One and a half towers",
        body: "Compare the front with Wenceslaus Hollar's etching of 1649 on this page: the lopsided silhouette with one finished tower was already the same then.",
      },
    ],
    transitionToNext: "Walk back across the Grote Markt and, behind the City Hall, turn into the Gildekamersstraat. Your first search task is waiting there.",
  },

  // ── Gates 11 and 12: search task ─────────────────────────────────────
  "poortjes-gildekamersstraat": {
    name: "Gildekamersstraat",
    subtitle: "Search task: which door is it?",
    introduction: [
      "The Gildekamersstraat (Guild Chambers Street) is a narrow street behind the City Hall, full of doors, doorways and gable stones. Smekens drew two gates here. The question is: can you find them?",
    ],
    searchTask: {
      title: "Can you find the gate from the drawing?",
      intro: "Below are two drawings from 1951. Walk slowly down the street and compare: the shape of the arch, the keystone, dates, the decoration at the top. Take your time, and only use the hints if you get stuck.",
      hideStoryUntilDone: true,
      items: [
        {
          plate: 10,
          question: "Which door is this?",
          hints: [
            "Look closely at the keystone at the top of the arch: there is a number on it.",
            "The number is a year from the 17th century. Look at the lower house numbers.",
          ],
          solution: "Gildekamersstraat 7, the house De Swane (The Swan).",
          explanation: [
            "According to the inventory, the year 1631 appears on the gate as “A. 1631”. The house De Swane burned down during the Spanish Fury of 1576 and was rebuilt in 1580–1581. In 1633 it was bought for the passementiers' guild, which used it as its guild house until the French Revolution. Passementiers made decorative ribbons, braids and cords.",
            "Smekens says that the passementiers' guild was here “at the end of the 16th century”; the inventory gives 1633 for the purchase. So both sources link the house to the same trade, but not to the same year.",
          ],
        },
        {
          plate: 8,
          question: "And this one, with the little window and the scrolls above it?",
          hints: [
            "Next to this drawing Smekens wrote “Gildekamerstraat 9” and the year 1612.",
            "The house was called “Den rooden osch” or “Den osch” (the red ox, the ox). Look at the house numbers around 8 and 9, and at wall anchors forming a date.",
          ],
          solution: "According to Smekens: the house Den (rooden) Osch, number 9 in 1951.",
          explanation: [
            "Today the inventory describes “Den Os” at number 8: a stepped gable dated 1612 by its wall anchors, with a round-arched door, a “diamond doorway” with a diamond-point keystone and imposts.",
            "To be honest: Smekens' drawing shows a richer gateway, with a little window with scrolls above it and decorated pilasters. We could not establish with certainty whether it is the same door, or whether the gate has since been changed or has disappeared. What did you find? [To be verified on site]",
          ],
        },
      ],
      outro: "This street shows why Smekens' book is so valuable: house numbers change, doors are replaced, but a measurement to the centimetre remains.",
    },
    sections: [
      {
        heading: "The story of the street",
        kind: "history",
        paragraphs: [
          "Den Os was already mentioned in the first quarter of the 14th century. From 1550 it was an excise house, where taxes on goods were collected. It burned down during the Spanish Fury of 1576 and was rebuilt in 1612 by the De Groote family. In 1877 the city bought it for police services; around 1900 the city also housed police services in De Swane.",
          "About Den Os, Smekens writes that it “had already been bought by the City at that time”. The City Hall is literally around the corner: the city expanded into the houses behind it.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "According to the inventory, the gate of De Swane is a baroque round-arched gateway in a rusticated bluestone frame with the date “A. 1631”, with a segmental-arched reveal, plinth blocks, imposts and a grooved keystone below a corniced drip moulding on volutes. The front and rear façades were reconstructed around 1953–1954 to a design by the architect Gaston Laporte.",
        ],
      },
    ],
    glossary: ["diamantkop", "sluitsteen", "spiegelboog"],
    didYouKnow: [
      "An excise house like Den Os was a tax office. Taxes on goods and trade come back later on this walk, at the Stadswaag.",
    ],
    transitionToNext: "Walk through the gate to the green square behind the City Hall: the Leonie Glassplein.",
  },

  // ── Leonie Glassplein (+ vanished 13 and 14) ─────────────────────────
  "poortjes-leonie-glassplein": {
    name: "Leonie Glassplein",
    subtitle: "A new garden, two vanished gates",
    introduction: [
      "You are standing in a surprisingly green square behind the City Hall. Look at the brass lines in the ground and the layers in the planting: the design refers to an open diamond mine.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "For a long time the area behind the City Hall was mostly paved and closed off. It was redesigned as a public garden, which opened on 26 November 2020. The design by the firm Stramien refers to diamond mines: “The layering that characterises the mines is shown with brass lines that accentuate the existing relief of the square.”",
          "The square is named after Leonie Glass (1876–1961), a notable figure in Antwerp's diamond community. She was the wife of the diamond merchant Isidore Tolkowsky and the mother of Marcel Tolkowsky, “the man who devised the shape of the modern round brilliant-cut diamond”. After her husband's death in 1931 she emigrated to New York. The square is also the inner garden of DIVA, the museum of diamonds, jewellery and silver.",
        ],
      },
      {
        heading: "Silversmiths and vanished gates",
        kind: "history",
        paragraphs: [
          "The part of the square on the Zilversmidstraat (Silversmith Street) is always open. In that street Smekens drew two gates that have since disappeared: number 5, a small gate in Louis XV style, and number 17, a small Renaissance gate. You will find them below, among the vanished gates.",
          "Number 17 had already travelled before. According to Smekens it originally stood against the façade of the De Trouw brewery, one of the breweries Gilbert van Schoonbeke built in the Brouwersstraat in the 16th century, and it was moved to the Zilversmidstraat when that building was demolished around 1880.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Access",
        paragraphs: [
          "The part on the Zilversmidstraat is always open. The part by the DIVA museum is only open during the museum's opening hours. If the passage is closed, go round via the Grote Markt and the Zilversmidstraat.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.agvespa.be/nieuws/iedereen-welkom-op-het-leonie-glassplein",
      },
    ],
    didYouKnow: [
      "Smekens' Brouwersstraat (Brewers' Street) still exists under another name: since 1936 it has been called Adriaan Brouwerstraat. At the end of this walk you will stand there, in front of four gates that are still in place.",
    ],
    transitionToNext: "Walk via the Zilversmidstraat to the Oude Beurs, the street named after Antwerp's very first exchange.",
  },

  // ── Gate 20 (+ vanished 21) ──────────────────────────────────────────
  "poortjes-oude-beurs": {
    name: "Oude Beurs 16: Den Spieghel",
    subtitle: "A mother, a child and a mirror",
    introduction: [
      "On the Oude Beurs, look for the richly decorated baroque gateway with a wooden door. Look into the semicircular part above the door: a small scene is carved there in wood.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "Den Spieghel (The Mirror) is mentioned as early as the beginning of the 14th century. The complex once ran from the Grote Markt all the way to the Oude Beurs here. In 1506 it was bought by the merchant Peter Gielis. Later owners were the city treasurer Alexander van den Broeck-Vekemans and his son Jan-Alexander; after 1650 the notary Bartholomeus Van den Berghe. From 1888 it housed a primary school for girls.",
          "Smekens names Steven Butken from Cologne as the original owner and says that “Alex van den Broeck (17th century)” wanted to turn the property into “a kind of palace”. We did not find Butken in the inventory. [To be verified]",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes a round-arched gateway from the third quarter of the 17th century “in lavish baroque style”, of bluestone. The wooden door contains “a carved relief in the fanlight”: “a seated woman breastfeeding, with a mirror in her right hand, surrounded by putti”. Smekens: “a seated woman looking into a mirror while her child mirrors itself in its mother”.",
          "The complex also has an octagonal brick house tower, probably from around 1506, one of the oldest surviving house towers in Antwerp.",
        ],
      },
      {
        heading: "Antwerp's first exchange",
        kind: "history",
        paragraphs: [
          "The street owes its name to the city's first exchange (beurs). A wooden “old borze” from 1485 was rebuilt in 1515, under the direction of Dominicus de Waghemakere, with a late-Gothic stone arcade, at the house “den grooten Rhijn” on the Hofstraat, around the corner.",
          "Trade grew so fast that around 1526–1527 the merchants asked for more space. In 1531–1532 a new exchange was built between the Meir and the Lange Nieuwstraat, and in 1533 the old one closed. We will visit that new exchange, the Handelsbeurs, later on this walk.",
        ],
      },
    ],
    glossary: ["barleef", "waaier"],
    thenAndNow: [
      "Then: Smekens described the scene of mother and child with the mirror in a single sentence.",
      "Now: the carving is in the fanlight above the door. How well has it survived? Can you see the putti (little angels) around the woman?",
    ],
    didYouKnow: [
      "“Den Spieghel” is a telling house name: the carving above the door literally shows a mirror.",
    ],
    transitionToNext: "Walk to the Melkmarkt. Look for a house with a golden shoe.",
  },

  // ── Gate 15 ───────────────────────────────────────────────────────────
  "poortjes-melkmarkt": {
    name: "Melkmarkt 37",
    subtitle: "De Gulde Schoen (The Golden Shoe)",
    introduction: [
      "Look for the gateway with two lion heads and a cartouche with the name of the house: “Gulde Schoen”. The house is a hotel today; the gate is older than everything around it.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "Smekens writes briefly: “Belonged to the house De gulden schoen.” The house itself was heavily altered in the 19th century: in 1847 the timber merchant Willem Westlake had the façade reduced to a regular pattern of four bays, and in 1849 the gable roof was replaced by an extra storey. It has been a hotel since 2018.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "According to the inventory, the gate is a baroque gateway from the third quarter of the 17th century, with “a richly carved bluestone frame”, Ionic capitals, rusticated pilasters, carved lion heads and a cartouche inscribed “Gulde Schoen”, crowned by a broken volute pediment. The entrance frame has been listed since 1976.",
        ],
      },
    ],
    glossary: ["fronton", "cartouche"],
    thenAndNow: [
      "Then: in 1951 the gate stood in a façade that had already been “straightened out” a century earlier.",
      "Now: the 17th-century gate is the oldest part of the façade. Look for the lion heads in the drawing and in real life.",
    ],
    didYouKnow: [
      "A house name like “Gulde Schoen” can refer to a trade or to a shop sign. Whether shoemakers ever lived here, we don't know.",
    ],
    transitionToNext: "Walk to the Wolstraat, where two gates from the book stand barely a hundred metres apart.",
  },

  // ── Gate 16 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-7": {
    name: "Wolstraat 7",
    subtitle: "De Tennen Pot (The Tin Pot)",
    introduction: [
      "Look for the monumental gateway in an otherwise plain rendered façade. Above the door is an iron fanlight with bars spreading out like sunbeams.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "De Tennen Pot is a traditional deep house going back to the second half of the 16th century. The name refers to a tin pot. In 1850 the cross windows were lowered; in 1895 the owner, Vochten, demolished the stepped gable and had a mezzanine built to a design by the architect Eugène Dieltiëns. In 1921 Eugène and his son Jules Dieltiëns designed the shop window that is still there.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes “a monumental round-arched gateway set in a frame of sculptural baroque” from the third quarter of the 17th century, in bluestone, with a moulded and rusticated round arch, pilasters with composite capitals and an iron fanlight with a radiating pattern. That fanlight only dates from 1850.",
        ],
      },
    ],
    glossary: ["waaier", "kapiteel"],
    thenAndNow: [
      "Then: in 1951 the stepped gable had already been gone for more than half a century; only the gate recalled the 17th-century house.",
      "Now: look for the difference between the 17th-century stone and the 19th-century fanlight.",
    ],
    didYouKnow: [
      "This one façade holds three periods: a gate from the 17th century, a fanlight from 1850 and a shop window from 1921.",
    ],
    transitionToNext: "A little further along the same street, at number 30, a door full of grapes and dolphins is waiting.",
  },

  // ── Gate 17 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-30": {
    name: "Wolstraat 30",
    subtitle: "Het Scilt van Londen (The Shield of London)",
    introduction: [
      "This time it's not only the stone that is interesting, but above all the wooden door. Look at the medallion in the middle and at the small figures above it.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "Het Scilt van Londen is a traditional deep house that both Smekens and the inventory date to 1625. In 1853 the cooper Pierre Van Hove had it altered in neoclassical style. We don't know for sure what the façade originally looked like.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes a “striking round-arched door set in a baroque frame of (painted) bluestone, to be dated to the third quarter of the 17th century”. The wooden door and canopy carry reliefs referring to the wine trade: “The central medallion shows two youthful busts, probably the wine god Bacchus and his wife Ariadne”, with above them “two mirrored putti with bunches of grapes seated on dolphins”.",
        ],
      },
      {
        heading: "Duquesnoy?",
        kind: "interpretation",
        paragraphs: [
          "Smekens writes that the door “is attributed to François Duquesnoy (1594–1642)”; the inventory mentions that attribution too, with the dates 1597–1643. An attribution is not proof. Moreover, the inventory dates the frame to the third quarter of the 17th century, after Duquesnoy's death. So who made it remains an open question.",
        ],
      },
    ],
    glossary: ["barleef"],
    thenAndNow: [
      "Then: Smekens drew the door with its reliefs; according to the inventory the frame is painted.",
      "Now: count the dolphins and look for the bunches of grapes.",
    ],
    didYouKnow: [
      "According to the inventory, the grapes, Bacchus and Ariadne refer to the wine trade. We could not find out why the house is called “Het Scilt van Londen”.",
    ],
    transitionToNext: "Walk to the Jeruzalemstraat, a small street linking the Wolstraat and the Oude Waag. Look for a narrow doorway next to number 14.",
  },

  // ── Gate 10 (+ vanished 18 and 22) ───────────────────────────────────
  "poortjes-jeruzalemstraat": {
    name: "Jeruzalemstraat",
    subtitle: "A doorway to the Holy Land",
    introduction: [
      "On the side of the corner house with the Oude Waag, look for a narrow bluestone doorway with a fanlight. Smekens writes: “next to no. 14”.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "The doorway belongs to the corner house “Jeruzalem” (Oude Waag 1–3), mentioned in 1564 as “a corner house with a stepped gable called Jeruzalem”. The house was altered in neoclassical style in 1837–1838, extended in 1903 and thoroughly rebuilt in 1946 by the architect Joseph De Paepe. The doorway was spared.",
          "Smekens explains the name “as a reminder of the first journeys from Antwerp to the Holy Land”. The inventory gives no explanation for the name. So his explanation is a possibility, not an established fact.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes “the small baroque bluestone doorway” from the second half of the 17th century: a “round-arched door with a moulded, rusticated archivolt on carved, rusticated pilasters” and a segmental fanlight with volutes and tendrils. The entrance frame has been listed since 1976.",
        ],
      },
      {
        heading: "Why we are here now",
        kind: "context",
        paragraphs: [
          "In this walk's list this is gate 10, right after the Suikerrui. But the Jeruzalemstraat lies here, between the Wolstraat and the Oude Waag, not near the Suikerrui. That is why we visit it now, without walking back and forth.",
        ],
      },
    ],
    glossary: ["archivolt"],
    didYouKnow: [
      "Two other gates from the book were close by and have disappeared: on the Grote Goddaard (the house De witte engel, The White Angel) and on the Engelse Beurs, at a small exchange that, according to Smekens, the city had built for English merchants in 1550.",
    ],
    transitionToNext: "Walk to the Zwartzustersstraat. The convent there is being renovated, but its story is none the worse for it.",
  },

  // ── Gate 19: in renovation ───────────────────────────────────────────
  "poortjes-zwartzusters": {
    name: "Zwartzustersstraat 25",
    subtitle: "Six centuries of care behind one gate",
    introduction: [
      "In front of you is the baroque gateway of the Zwartzusterklooster, the convent of the Black Sisters. The convent has been under renovation since late 2025. So you may see the gate behind construction fencing today, or temporarily wrapped up.",
    ],
    sections: [
      {
        heading: "Who were the Black Sisters?",
        kind: "history",
        paragraphs: [
          "The Black Sisters (Zwartzusters) followed the Rule of St Augustine. They settled in Antwerp in 1345, first in a building by the Koepoort, donated by “Hendrik Suderman, a wealthy German merchant”. Smekens calls him “H. Südermann”.",
          "Their name comes from their clothing. Around 1462 they took their monastic vows and exchanged their grey habit for a black one.",
        ],
      },
      {
        heading: "Caring for the sick",
        kind: "history",
        paragraphs: [
          "The sisters worked in caring for the sick. Under the Calvinist city government (1571–1585) they continued that work despite persecution. After 1585 they enjoyed protection. In 1798 they were expelled by the French authorities; in 1823 they returned. The last sisters left in 2014.",
        ],
      },
      {
        heading: "The complex",
        kind: "history",
        paragraphs: [
          "The convent grew in stages: a new chapel in 1507, living quarters for the spiritual director in 1520, a refectory and dormitory in 1536. In 1608 the north wing was fitted out as a hospital. In 1670–1678 the refectory was enlarged and the wash house and kitchen were renewed; the kitchen was “completely lined with Delft tiles”.",
          "The chapel is a small Gothic hall church from the first quarter of the 16th century with a wooden pointed barrel vault. The east and west wings were built in 1904 to a design by Paul Van Glabbeek.",
        ],
      },
      {
        heading: "The architecture of the gate",
        kind: "history",
        paragraphs: [
          "Smekens calls this a “gate in Louis XIV”. The inventory describes a baroque round-arched gateway in bluestone from the “fourth quarter of the 17th or first quarter of the 18th century”. The carved central post with the Virgin Mary, Ursula and Augustine is by Leopold Van Esbroeck (1967), so it is younger than the drawing.",
        ],
      },
      {
        heading: "Today",
        kind: "history",
        paragraphs: [
          "The convent stood empty for about ten years. In late 2025 its renovation into a cohousing project with 41 homes and shared spaces began, with a garden by the Dutch garden designer Piet Oudolf (VRT NWS, 29 October 2025). The work was expected to take about two years.",
        ],
      },
    ],
    glossary: ["makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Then: the drawing dates from around 1950. According to the inventory, the carved central post with three saints dates from 1967, so it cannot be in the drawing.",
      "Now: if the gate is visible, compare its central post with the drawing. What was in that place in 1951?",
    ],
    didYouKnow: [
      "In the 1670s the convent's kitchen was completely lined with Delft tiles.",
    ],
    transitionToNext: "Walk to the Korte Nieuwstraat. Look for a chapel with an angel as its keystone.",
  },

  // ── Gate 23 ───────────────────────────────────────────────────────────
  "poortjes-korte-nieuwstraat": {
    name: "Korte Nieuwstraat 22",
    subtitle: "A chapel for six old women",
    introduction: [
      "Look for the narrow sandstone gable with a baroque portal in dark bluestone. Look at the keystone: a small winged angel's head. Then look at the empty niche above it.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "This is the chapel of the Sint-Annagodshuis (St Anne's almshouse), founded in 1400 by Elisabeth, widow of Jan Hays, and Boudewijn de Riddere, as a “home for six old women”. The chapel was built the same year and dedicated to St Anne. In 1540 the almoners of the Armenkamer (the city's poor-relief office) took over its management.",
          "Residents lived here until 1963. After that the chapel served as the workshop of the sculptor Frans Joris, as a book store and as a storeroom.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The chapel is a Gothic hall church with a 17th-century baroque portal in bluestone, with “jointed imposts and a winged angel's head as keystone”, “flanked by two ringed columns”. The niche above originally held statues of St Anne and Mary, which disappeared in the early 20th century. Smekens says the same: the figures were still there “at the beginning of the 20th century”. The chapel has been listed since 1938.",
        ],
      },
    ],
    glossary: ["godshuis", "imposten"],
    thenAndNow: [
      "Then: in 1951 the niche was already empty. Smekens drew the gateway with its angel figures.",
      "Now: the niche is still empty. Look for the winged angel's head on the keystone.",
    ],
    didYouKnow: [
      "Almshouses were an early form of social housing: wealthy citizens or guilds founded them for the elderly or the poor, often with their own chapel.",
    ],
    transitionToNext: "End of the second part. Walk to the Handelsbeurs: from convents and guild houses to money and world trade.",
  },
};
