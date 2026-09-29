import type { PoortjesStopText } from "../types";

/** Part 3: Handelsbeurs, University & Academy (gates 24–41). English master text. */
export const deel3: Record<string, PoortjesStopText> = {
  // ── Handelsbeurs ─────────────────────────────────────────────────────
  "poortjes-handelsbeurs": {
    name: "The Handelsbeurs",
    subtitle: "Where the world came to do business",
    introduction: [
      "From the outside, the Handelsbeurs (the old commercial exchange) hardly stands out. Inside lies one of the most remarkable spaces in the city: a Gothic courtyard surrounded by galleries, covered by a soaring roof of iron and glass.",
      "On the Oude Beurs you saw where the first exchange stood. Here stands its successor.",
    ],
    sections: [
      {
        heading: "Why Antwerp needed an exchange",
        kind: "history",
        paragraphs: [
          "Around 1530 Antwerp was one of the richest cities in Europe. Ships from Portugal brought spices from Asia; merchants from Italy, Germany, England and Spain lived in the city. They needed to know prices, find buyers, borrow money and insure cargoes. There were no telephones and no newspapers as we know them: information travelled by letter and above all by word of mouth.",
          "The old exchange became too small: around 1526–1527 the merchants asked for more space. In 1531 the city opened a new exchange here, designed by Domien de Waghemakere in the late-Gothic Brabant style: an open courtyard with a covered gallery and rich star vaults. It was one of the first buildings ever built specifically for this purpose.",
        ],
      },
      {
        heading: "Fire, and fire again",
        kind: "history",
        paragraphs: [
          "What you see is not simply the building of 1531. The exchange was rebuilt in 1583 and burned down in 1858. The architect Joseph Schadde designed the present building; he was finally given the commission in 1868, and the new exchange was solemnly inaugurated on 19 October 1872. He kept the idea of the Gothic courtyard but covered it with a spectacular roof of iron and glass.",
          "By the end of the 20th century trading had moved elsewhere and the building stood empty for some twenty years. After a thorough restoration it reopened in 2019, now as an events venue.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Looking inside",
        paragraphs: [
          "According to the Handelsbeurs itself, the trading floor is open to the public during weekends and school holidays, from 10 a.m. to 6 p.m., except during events. Entrances via the Twaalfmaandenstraat (from the Meir) and the Borzestraat (from the Lange Nieuwstraat).",
          "The website doesn't say whether a visit is free. Check the current information and the list of closing days before you go.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://handelsbeursantwerpen.be/en/bezoek-de-handelsbeurs/",
      },
    ],
    didYouKnow: [
      "The Antwerp exchange became a model abroad. When Thomas Gresham, the English crown's agent in Antwerp, founded the Royal Exchange in London in the 1560s, he took the Antwerp exchange as his example.",
      "The Academy of Fine Arts, which we visit later, was originally housed in “the Exchange on the Meir”, and fragments of the 16th-century exchange stand in the academy garden.",
    ],
    transitionToNext: "Walk to the Lange Nieuwstraat. The house you are looking for is named after an Italian city, and its gate came from somewhere else.",
  },

  // ── Gate 25 (+ vanished 24) ──────────────────────────────────────────
  "poortjes-lange-nieuwstraat": {
    name: "Lange Nieuwstraat 45",
    subtitle: "Bolonia la Grassa, and a gate that moved",
    introduction: [
      "Look for the merchant's house with a tall stepped gable of fourteen steps. Then look at the gate: a round-arched door in a baroque bluestone frame, with a cartouche containing a year.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "Since the late 16th century this traditional merchant's house from the second half of that century has been called “Bolonia la Grassa”, after the Italian city of Bologna. Spanish and Italian noblemen stayed here. In the 17th century the painter Abraham van Diepenbeeck lived here; his family owned the house until the 18th century. From 1828 to 1849 the widow Helena Van Celst-Kums ran a girls' school and an orphanage here.",
        ],
      },
      {
        heading: "A gate that moved",
        kind: "history",
        paragraphs: [
          "The gate did not originally belong to this house. Smekens: “Comes from a demolished building in the Twaalfmaandenstraat.” The inventory confirms this and adds details: the gate is “dated 1665 in a cartouche” and in 1926 it replaced a 19th-century alteration of the façade.",
          "The Twaalfmaandenstraat is the street next to the Handelsbeurs, where you have just come from.",
        ],
      },
    ],
    glossary: ["cartouche", "trapgevel"],
    thenAndNow: [
      "Then: in 1951 the gate had only been here for 25 years.",
      "Now: look for the year 1665 in the cartouche. In 2014–2017 the house was merged with the neighbouring house Sint-Franciscus and renovated into apartments.",
    ],
    didYouKnow: [
      "In the same street, at number 36, Smekens drew another gate, in Régence style, belonging to the large mansion “De Keyser”. It has disappeared.",
    ],
    transitionToNext: "Walk on to the Sint-Jacobskerk, the church where Rubens is buried.",
  },

  // ── St James ─────────────────────────────────────────────────────────
  "poortjes-sint-jacob": {
    name: "Sint-Jacobskerk (St James' Church)",
    subtitle: "The church of the pilgrims, and of Rubens",
    introduction: [
      "In front of you stands a massive west tower that was never finished, and a long, sober church in Brabant Gothic style. The outside is modest. The interior is one of the richest in the city.",
    ],
    sections: [
      {
        heading: "From pilgrims' hostel to parish church",
        kind: "history",
        paragraphs: [
          "On this spot stood a hostel for pilgrims on their way to Santiago de Compostela (1404–1413). In 1478 its chapel became a parish church. The present church was built in three phases: from 1491 with the tower, until work stopped for lack of money; from 1552 to 1566 with the nave and transept; and from 1602 to 1656 with the choir and the chapels around it.",
          "Well-known master builders worked on the church: Herman de Waghemakere, his son Domien, Domien's brother Herman, and from 1525 Rombout Keldermans. You have already met Domien de Waghemakere at the Oude Beurs, the Handelsbeurs and the cathedral.",
        ],
      },
      {
        heading: "Late Gothic, outside and inside",
        kind: "history",
        paragraphs: [
          "The inventory calls the church an example of Brabant Gothic, with a characteristic heavy west tower, sober exterior architecture and, inside, a triforium with a walkway. The unfinished tower has five stages and is “supported by four heavy corner buttresses”.",
          "Inside, the picture is completely different: dozens of chapels of wealthy families, baroque altars, marble and funerary monuments. In 1705 Pope Clement XI gave the church the title of “illustrious collegiate church”.",
        ],
      },
      {
        heading: "Rubens",
        kind: "history",
        paragraphs: [
          "Peter Paul Rubens died in 1640 and was buried in this church. His burial chapel was fitted out in 1642. Above the altar hangs a painting by Rubens himself, “Our Lady with Saints”, which the inventory dates to 1634.",
          "In May 2026 the city announced the end of a seven-year restoration. According to the press release, the altarpiece, the altar, the epitaph and the tomb monuments in the Rubens chapel were also restored and can be visited again.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Looking inside",
        paragraphs: [
          "According to the City of Antwerp (press release of 13 May 2026), the church can be “visited free of charge every day between 2 p.m. and 5 p.m.”. Some older sources still say the burial chapel is closed until 2028; according to the press release it is accessible again. The church may be closed during services and funerals. Smaller restorations continue until 2028.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://pers.antwerpen.be/sint-jacobskerk-opnieuw-volledig-toegankelijk-na-7-jaar-restauratie",
      },
    ],
    didYouKnow: [
      "During the restoration, 426,650 new slates were laid on the roof and 1,738 m² of stained glass was repaired.",
    ],
    lookAt: [
      {
        title: "The unfinished tower",
        body: "Look up at the west tower. Building began in 1491 and stopped for lack of money; the tower never got the spire you saw at the cathedral.",
      },
    ],
    transitionToNext: "Walk to the Keizerstraat, the street of burgomasters and painters.",
  },

  // ── Gate 26 + Snijders&Rockox House (+ vanished 32) ──────────────────
  "poortjes-keizerstraat": {
    name: "Keizerstraat 10-16",
    subtitle: "A burgomaster, a painter and a doorway full of rocailles",
    introduction: [
      "You are in a quiet street of stately houses. At number 16, look for a small doorway with whimsical, shell-like decoration. A few houses along, at number 10–12, is the Snijders&Rockox House.",
    ],
    sections: [
      {
        heading: "Number 16: the doorway",
        kind: "history",
        paragraphs: [
          "The building consists of two linked 16th-century houses. The right-hand house has a late-Gothic scrolled gable from the first half of the 16th century, the left-hand house a stepped gable from the second half. According to the inventory, in the central axis there is a doorway from the third quarter of the 18th century: a “round arch with imposts, set in a segmental-arched field, decorated with rocailles”, with a wooden door, a wrought-iron fanlight and a cast-iron boot scraper.",
          "Smekens calls the house “De zwarte arend” (the black eagle); the inventory calls it “De witte Lelie” (the white lily) today. In 1830 Baron Philippe Antoine Joseph de Pret de ter Veken had the architect Franciscus De Wolf alter the façades. It has been a hotel since 1992–1993.",
        ],
      },
    ],
    cards: [
      {
        id: "card-rockox",
        title: "The Snijders&Rockox House",
        subtitle: "Possible museum stop: Keizerstraat 10-12",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Nicolaas Rockox (1560–1640) was burgomaster of Antwerp and a great art lover. In 1603 he bought two adjoining houses and had them rebuilt; he lived there with his wife Adriana Perez. As burgomaster he represented the city before higher authorities and headed the militia and the civic guards.",
              "His neighbour was the painter Frans Snijders (1579–1657). He and his wife Margriete de Vos lived in the house “de Fortuyne” from 1622. Snijders was known for his still lifes, animal pieces and hunting scenes.",
              "In 1970 the Kredietbank bought the Rockox House and it became a museum. Today the two houses together form the Snijders&Rockox House, with works by Bruegel, Rubens and Van Dyck, among others.",
            ],
          },
        ],
        didYouKnow: [
          "The museum is free to visit on the first Tuesday of every month.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Museum visit (optional)",
        paragraphs: [
          "Open Tuesday to Sunday, 10 a.m. to 5 p.m.; closed on Mondays (except Easter Monday and Whit Monday), on 1 January, 1 May, Ascension Day, 1 November and 25 December. Admission €10; free for young people under 18 and holders of a museumPASSmusées; free for everyone on the first Tuesday of the month.",
          "A museum visit is optional; the walk simply continues afterwards.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.snijdersrockoxhuis.be/en/visit/plan-your-visit/opening-hours-prices",
      },
    ],
    glossary: ["rocaille", "lodewijk-stijlen"],
    thenAndNow: [
      "Then: Smekens drew a “gate in Louis XV style”. You can recognise that style by its asymmetrical shell and rock shapes.",
      "Now: look for the boot scraper, the small iron edge for scraping your shoes clean. Is it in the drawing too?",
    ],
    didYouKnow: [
      "In the Paternosterstraat, close to this street, Smekens drew a small doorway in Flemish Renaissance style belonging to the house “De gulden dolfeyn” (the golden dolphin), which according to him was already mentioned in 1497. It has disappeared.",
    ],
    transitionToNext: "Walk to the Markgravestraat, a narrow street laid out around 1500.",
  },

  // ── Gate 27 ───────────────────────────────────────────────────────────
  "poortjes-markgravestraat": {
    name: "Markgravestraat 14",
    subtitle: "A street through a margrave's estate",
    introduction: [
      "In this narrow street, look for number 14 and the gate from the book. Compare the frame with the drawing: the proportions of the arch, the pilasters and the crowning.",
    ],
    sections: [
      {
        heading: "The street",
        kind: "history",
        paragraphs: [
          "The Markgravestraat was laid out around 1500 and is named after the margrave Jan van Immerseel (15th–16th century), through whose property the street was cut. It is a narrow street with houses in various styles, with pointed and stepped gables.",
        ],
      },
      {
        heading: "The gate",
        kind: "history",
        paragraphs: [
          "For this gate Smekens writes only: “Renaissance gate. Markgravestraat 14.” We found no separate inventory entry for it. Little is known for certain about the original function of this particular gate. [Historical research required]",
        ],
      },
    ],
    thenAndNow: [
      "Then: a gate without a story in the book, only a drawing.",
      "Now: compare for yourself. Does the drawing still match what you see?",
    ],
    didYouKnow: [
      "The street name does not refer to a title in general, but to one person: margrave Jan van Immerseel, through whose estate the street was cut.",
    ],
    transitionToNext: "Walk to the Koningstraat. Look for three kings there.",
  },

  // ── Gate 29 (+ vanished 28 and 31) ───────────────────────────────────
  "poortjes-koningstraat": {
    name: "Koningstraat 17",
    subtitle: "De Drij Koningen (The Three Kings)",
    introduction: [
      "Look for the stepped gable with a small bluestone doorway in the right-hand bay. Above the door is a small round window, surrounded by foliage.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "Smekens writes that the house “De Drie Koningen” was “already mentioned in 1549”; the inventory says “already mentioned at the end of the 16th century”. In 1881 the façade was thoroughly restored under the direction of the architects Léonard and Henri Blomme.",
          "The doorway itself is younger than the house. Smekens: “Dating from 1716.”",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The inventory describes a “small bluestone doorway in late baroque style dated 1716”: “a shoulder-arched door in a moulded frame, flanked by pilasters with recessed shafts and volute capitals”. Above the door is an oculus, a round window, surrounded by decorative foliage. Smekens calls it a “Louis XIV doorway”.",
        ],
      },
    ],
    glossary: ["schouderboog", "lodewijk-stijlen"],
    thenAndNow: [
      "Then: Smekens drew the doorway with its round window.",
      "Now: look for the year 1716.",
    ],
    didYouKnow: [
      "In the same street, at number 14, Smekens drew another 18th-century doorway, belonging to the house “De witte koning” (the white king). It has disappeared.",
      "The doorway in the nearby Gratiekapelstraat was already gone when the book appeared: Smekens writes that it had been “simply torn down by vandals a few years ago”.",
    ],
    transitionToNext: "Walk to the Prinsstraat, into the old heart of the university.",
  },

  // ── University ───────────────────────────────────────────────────────
  "poortjes-universiteit": {
    name: "City Campus and Hof van Liere",
    subtitle: "A burgomaster's palace became a university",
    introduction: [
      "Behind the façades of the Prinsstraat lies the City Campus (Stadscampus) of the University of Antwerp. Its heart is the Hof van Liere, a late-Gothic palace with a courtyard, galleries and a well.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "“This princely residence was built in 1516 for the then Antwerp burgomaster Aert van Liere”, in Brabant Gothic style, the university writes. After his death the property passed to the city, which made it available to a Milanese banking family and later to the English Nation, the association of English merchants.",
          "The Jesuits, who founded a secondary school in Antwerp in 1575, extended the complex and fitted it out as a boarding school. After their order was suppressed, it became a military academy and a hospital.",
          "In 1929 the Jesuits returned: their Sint-Ignatius business school found a new home here. In 1988 the Universitaire Faculteiten Sint-Ignatius (UFSIA) bought the Prinsenhof, and in 2003 Antwerp's universities merged into the University of Antwerp.",
        ],
      },
      {
        heading: "Around it",
        kind: "history",
        paragraphs: [
          "The campus also includes the Convent of the Grey Sisters in the Lange Sint-Annastraat, built in 1887 to a design by Frans Baeckelmans. According to the university, the sisters cared for plague victims. After 1999 it was renovated, with modern architecture inserted into the historic setting.",
          "According to the university, the garden of the Hof van Liere was given a new look in 1998 by the landscape architect Wirtz.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Access",
        paragraphs: [
          "The campus is a working university, not a museum. We found no official information about free access to the courtyard and garden. If the gate is open, have a quiet look around and respect students and staff; if it is closed, the façade on the Prinsstraat is worth seeing too. [Access to be verified]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    didYouKnow: [
      "English merchants were important in 16th-century Antwerp: the English Nation was housed here for a while, and according to Smekens the city had a small exchange built in 1550 “for the benefit of the English merchants”.",
    ],
    transitionToNext: "Next you can choose: a short detour to two gates in the Rodestraat, or straight on to the Stadswaag.",
  },

  // ── Gates 33 and 34: optional ────────────────────────────────────────
  "poortjes-rodestraat": {
    name: "Rodestraat 43 and 44",
    subtitle: "Extra: two gates near the Begijnhof",
    introduction: [
      "Welcome to the detour. In the Rodestraat Smekens drew two gates that stand almost opposite each other: a small Renaissance doorway at the presbytery of the Begijnhof (the beguinage, number 43) and a carriage gate (number 44).",
    ],
    sections: [
      {
        heading: "What the book says",
        kind: "history",
        paragraphs: [
          "About number 43 Smekens writes only: “Small Renaissance doorway at the presbytery of the Begijnhof.” About number 44: “Built around 1725 in pure Louis XV style.”",
          "We have not yet been able to research these two gates ourselves. Whether they still exist today, and in what condition, needs to be checked on site. [Historical research required]",
        ],
      },
      {
        heading: "A carriage gate",
        kind: "context",
        paragraphs: [
          "A carriage gate is wider than an ordinary door: it had to let a coach or cart through to a courtyard. You can recognise one by its width and often by stone or iron guard posts at the bottom.",
        ],
      },
    ],
    glossary: ["lodewijk-stijlen"],
    thenAndNow: [
      "Then: two gates, dated to the 16th–17th century (43) and around 1725 (44).",
      "Now: compare both with the drawings. Your observations help us complete this stop.",
    ],
    didYouKnow: [
      "The year 1725 and the style “Louis XV” are Smekens' own words. As you have seen along the way, style names and dates can come out differently in later studies.",
    ],
    transitionToNext: "Walk back to the Stadswaag: the square of the man who had half of the northern city laid out.",
  },

  // ── Gate 35 (+ vanished 30) ──────────────────────────────────────────
  "poortjes-stadswaag": {
    name: "The Stadswaag",
    subtitle: "Where trade was weighed and taxed",
    introduction: [
      "You are standing on a square without the building it was named after. The city weigh house (stadswaag) stood here. On the square, look for number 13 with the doorway from the book: a small late-Renaissance doorway with a fanlight.",
    ],
    sections: [
      {
        heading: "What is a weigh house?",
        kind: "history",
        paragraphs: [
          "A weigh house was a public weighing station. According to the inventory, Antwerp's weigh house was “a kind of tax office where goods were weighed and taxed in proportion”. Anyone trading goods had them officially weighed here: that way the buyer knew what he was getting, and the city knew what it could tax.",
          "The building also had “several richly decorated halls where wedding feasts were celebrated”.",
        ],
      },
      {
        heading: "Gilbert van Schoonbeke",
        kind: "history",
        paragraphs: [
          "The square and the streets around it were laid out in 1548 by Gilbert van Schoonbeke, a property developer before the term existed. By a deed of 6 May 1547 he bought the land from the city for 31,000 Carolus guilders. He demolished the existing buildings and built “the new weigh house”.",
          "He also laid out three streets: the Noord-, Oost- and Weststraat (North, East and West Street), later renamed Hoornstraat, Brilstraat and Raapstraat. The name “Stadswaag” for the square dates from around 1800.",
          "You have met Van Schoonbeke before: he also had the breweries in the Brouwersstraat built, where several gates from the book come from.",
        ],
      },
      {
        heading: "The end of the weigh house",
        kind: "history",
        paragraphs: [
          "On 25 August 1873, during a violent storm, lightning struck. The building caught fire and burned down completely within a few hours. The city then turned the site into a public square. In September 1914 the Stadswaag was in the news once more, when a Zeppelin bomb hit it.",
          "In the 1960s artists discovered the neighbourhood and it became a nightlife area. The square was redesigned in 1998.",
        ],
      },
    ],
    glossary: ["waaier", "ijkdienst"],
    thenAndNow: [
      "Then: in 1951 the weigh house had been gone for almost eighty years. Smekens drew the doorway at number 13 without further explanation.",
      "Now: find number 13 and compare the fanlight with the drawing. [Current condition of this doorway to be verified on site]",
    ],
    didYouKnow: [
      "In the Raapstraat (Turnip Street), one of Van Schoonbeke's streets, Smekens drew a small doorway with “a turnip as a motif” in the shell above the door. A turnip in Turnip Street: sadly, the doorway has disappeared.",
      "After the fire of 1873, the official weights-and-measures office was temporarily housed in the house De Clocke in the Lange Noordstraat. You will see that house and its gate later on the walk.",
    ],
    transitionToNext: "Walk to the Mutsaardstraat. Opposite the Academy stands a monumental gate.",
  },

  // ── Gate 36 ───────────────────────────────────────────────────────────
  "poortjes-mutsaardstraat": {
    name: "Mutsaardstraat 30-32",
    subtitle: "A chancellor's house",
    introduction: [
      "On the Mutsaardstraat, look for a broad sandstone façade with a baroque central section and a broken pediment. Look at the monumental gate. Compare house numbers 30 and 32 as well.",
    ],
    sections: [
      {
        heading: "The story",
        kind: "history",
        paragraphs: [
          "At “Mutsaertstraat 30” Smekens writes: “Belonged to the house of Schockaert, city councillor and chancellor of Brabant.” The inventory places the baroque mansion of Jan Daniël Antoon Schockaert, chancellor of the Duchy of Brabant from 1739, at Mutsaardstraat 32 today. According to the inventory, number 30 is the house “De Draeck” (the dragon).",
          "The mansion was built in the third quarter of the 17th century by the Van den Kerckhoven family. On 16 December 1944 it was badly damaged by a V-bomb. In 1956–1957 it was converted into shops, offices and apartments; the front façade has been listed since 1958.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "The eight-bay façade has a sandstone facing and a baroque central projection with a “broken pediment with a crowning ornament”. According to the inventory, the gate has a “moulded, rusticated reveal on Ionic pilasters” and a decorative cartouche.",
        ],
      },
    ],
    glossary: ["fronton", "beloop"],
    thenAndNow: [
      "Then: Smekens saw the gate a few years after the V-bomb damage of 1944 and before the conversion of 1956–1957.",
      "Now: which house number does the gate in the drawing belong to today, 30 or 32? [To be verified on site]",
    ],
    didYouKnow: [
      "Antwerp was hit hard by V-bombs in 1944–1945. This house is one of the many buildings damaged at the time.",
    ],
    transitionToNext: "Cross over to the Academy, at number 31. Behind the railings lies a garden with five gates that no longer stand anywhere else.",
  },

  // ── Gates 37–41: Academy garden ──────────────────────────────────────
  "poortjes-academie": {
    name: "The Academy and its garden",
    subtitle: "Five gates without a house",
    introduction: [
      "You are at the Royal Academy of Fine Arts (Koninklijke Academie voor Schone Kunsten), one of the oldest art schools in Belgium. Behind the gatehouse lies the academy garden, and in it stand gates and pieces of façades from buildings that have disappeared elsewhere in the city.",
      "Smekens drew five of them. Below you can look for them one by one.",
    ],
    searchTask: {
      title: "Find the five gates in the garden",
      intro: "Each of these gates came from somewhere else in Antwerp. Look for them in the garden and compare them with the drawing. It's not a competition: if you can't find one, simply look at the solution.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 19,
          question: "The doorway of “Het Klaverblad” (The Cloverleaf). Where did it come from?",
          hints: ["Look at the keystone: which plant can you see in it?", "There is also a year on the keystone."],
          solution: "From the former Klaverstraat, now the Haverstraat.",
          explanation: [
            "According to the inventory this is a “small bluestone round-arched doorway” from “het Klaverblad” in the Haverstraat, with the year 1663 on the keystone and a cloverleaf motif. Coincidence or not: 1663 is also the year the Academy was founded.",
          ],
        },
        {
          plate: 21,
          question: "The doorway with a bust above it. Who is it?",
          hints: ["The bust shows the founder of the Academy.", "He was a painter, and his father had the same name."],
          solution: "David Teniers the Younger, in a doorway from the house “De Gans” (The Goose) in the Zakstraat.",
          explanation: [
            "Smekens: “In the niche a bust of David Teniers the Younger, the painter who founded the Academy in 1663. Originally this bust did not belong in this niche.” So the doorway and the bust were brought together: a fine example of how old pieces were recombined in the garden.",
          ],
        },
        {
          plate: 33,
          question: "The large gate frame with letters in a medallion. Which business did it belong to?",
          hints: ["Look for three letters in the medallion at the top.", "The coat of arms next to them belongs to the trade you will meet again in the Adriaan Brouwerstraat."],
          solution: "The Van Pruyssen brewery, with the letters C.V.P. and the arms of the brewers' guild.",
          explanation: [
            "Smekens gives its origin as the Brouwersstraat, today's Adriaan Brouwerstraat. The inventory mentions a wooden round-arched door from the “Oosters Huis” (Easterlings' House) in the garden, set in the bluestone frame of the Van Pruyssen brewery, with the initials CVP and brewers' emblems.",
          ],
        },
        {
          plate: 34,
          question: "The large gate with a carved central post. Which house did it come from?",
          hints: ["The central post between the door leaves is called a “makelaar”.", "The house had a religious name, and there is an inscription on the door."],
          solution: "From the house “De Heilige Drievuldigheid” (The Holy Trinity) on the Kipdorp.",
          explanation: [
            "Smekens: the house “made way for the A la Vierge noire warehouses (Kipdorp)”. The inventory describes a wooden door in the garden inscribed “In de Heyliche Dryvuldicheidt” from 1636.",
          ],
        },
        {
          plate: 37,
          question: "The large gate with an iron fanlight. Which convent did it belong to?",
          hints: ["Look closely at the wrought iron of the fanlight: two letters are worked into it."],
          solution: "The demolished convent of the Cellebroeders (Alexian Brothers): the letters C.B.",
          explanation: [
            "Smekens: “From the demolished convent of the Cellebroeders, with the letters C. B. (Cellebroeders) worked into the ironwork of the fanlight.”",
            "We have not yet recorded on site exactly where each gate stands in the garden. [To be verified on site]",
          ],
        },
      ],
    },
    sections: [
      {
        heading: "The oldest art school in the country",
        kind: "history",
        paragraphs: [
          "The Academy was founded in 1663 on the initiative of the painter David Teniers, with the permission of King Philip IV. It was first housed in the Exchange on the Meir. In 1811 it moved to the former Franciscan friary here on the Mutsaardstraat.",
          "The Franciscans had settled in Antwerp in 1446. Their friary was destroyed in the Iconoclastic Fury of 1566 and rebuilt after their return in 1585. In 1797, under French rule, they had to leave.",
        ],
      },
      {
        heading: "Buildings and garden",
        kind: "history",
        paragraphs: [
          "The city architect Pierre Bruno Bourla designed the oldest academy buildings: among others a director's house (1823–1824), exhibition halls and, in 1841, the gatehouse with iron railings and a museum with a classical temple front. After the war a wing with classrooms and studios was added to a design by Ferdinand Peeters (1953). In 1963 Renaat Braem painted a mural in the stairwell.",
          "The garden follows “a symmetrical plan starting from the gatehouse” and was redesigned in 1905 to a design by the architect Emiel Van Averbeke. It contains statues of David Teniers, Mathias Van Bree, Quinten Matsijs and St Luke, and fragments of the 16th-century Exchange.",
        ],
      },
      {
        heading: "Why are there gates here?",
        kind: "interpretation",
        paragraphs: [
          "The inventory describes the gates as “recovered portal elements from vanished Antwerp buildings”. We could not find out who exactly decided to place them here, or why. It seems obvious that people wanted to save valuable pieces of demolished buildings, and that an art school with an enclosed garden was a logical place for them, also as teaching material. But that is an interpretation, not a documented fact.",
        ],
      },
      {
        heading: "Artists of the Academy",
        kind: "history",
        paragraphs: [
          "Over the centuries, artists such as Lawrence Alma-Tadema, Ford Madox Brown and Henry van de Velde studied here. The fashion department, founded in 1963, became world-famous in the 1980s thanks to “the Antwerp Six”, including Dries Van Noten, Ann Demeulemeester and Walter Van Beirendonck. Today the Academy is part of AP University of Applied Sciences and Arts.",
        ],
      },
    ],
    cards: [
      {
        id: "card-van-gogh",
        title: "Vincent van Gogh in Antwerp",
        subtitle: "Three months, November 1885 – February 1886",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "In late November 1885 Vincent van Gogh came to Antwerp from Nuenen. He rented a small room in the Lange Beeldekensstraat, in the working-class district of Stuivenberg.",
              "In January 1886 he enrolled at the Academy, mainly to learn to paint from live models. He took drawing lessons from antique plaster casts with Frans Vinck and later with Eugène Siberdt, and tried the painting class of Charles Verlat.",
              "It did not go well. His spontaneous, powerful style clashed with the strict academic system, and after a conflict with Siberdt he was sent back to a lower class. The news only reached him after he had left: on 28 February 1886 he set off for Paris, to join his brother Theo.",
            ],
          },
          {
            heading: "What we know, and what we don't",
            kind: "context",
            paragraphs: [
              "His stay in Antwerp lasted about three months, his time at the Academy less than two. The KMSKA museum gives 24 November 1885 as his date of arrival; other sources mention a few days later. That is why we say “late November”.",
            ],
          },
        ],
        didYouKnow: [
          "The man who was sent down to a lower class in Antwerp is today the most famous student the Academy has ever had.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Access to the garden",
        paragraphs: [
          "The academy garden is part of the Academy's campus and is not a public park. We found no official opening hours. If the gate is open, walk in quietly; if it is closed, you can see part of the garden through the railings. [Access to be verified with the Academy]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    glossary: ["makelaar", "waaier", "sluitsteen"],
    didYouKnow: [
      "The academy garden has been protected as a cultural-historical landscape since 1974.",
    ],
    transitionToNext: "End of the third part. Walk north, towards the Falconplein: here the city becomes a port city.",
  },
};
