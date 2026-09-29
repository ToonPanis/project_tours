import type { PoortjesStopText } from "../types";

/** Deel 3: Handelsbeurs, Universiteit & Academie (poorten 24–41). */
export const deel3: Record<string, PoortjesStopText> = {
  // ── Handelsbeurs ─────────────────────────────────────────────────────
  "poortjes-handelsbeurs": {
    name: "De Handelsbeurs",
    subtitle: "Waar de wereld kwam handelen",
    introduction: [
      "Van buiten valt de Handelsbeurs nauwelijks op. Binnen ligt een van de bijzonderste ruimtes van de stad: een gotische binnenplaats met galerijen rondom, overdekt met een hoog dak van ijzer en glas.",
      "Aan de Oude Beurs zag je waar de eerste beurs stond. Hier staat haar opvolger.",
    ],
    sections: [
      {
        heading: "Waarom Antwerpen een beurs nodig had",
        kind: "history",
        paragraphs: [
          "Rond 1530 was Antwerpen een van de rijkste steden van Europa. Schepen uit Portugal brachten specerijen uit Azië, kooplieden uit Italië, Duitsland, Engeland en Spanje woonden in de stad. Ze moesten prijzen kennen, kopers vinden, geld lenen en ladingen verzekeren. Er waren geen telefoons of kranten zoals wij ze kennen: informatie reisde per brief en vooral van mond tot mond.",
          "De oude beurs werd te klein: rond 1526-1527 vroegen de kooplieden om meer ruimte. In 1531 opende de stad hier een nieuwe beurs, ontworpen door Domien de Waghemakere in laatgotische Brabantse stijl: een open binnenplaats met een overdekte galerij met rijke stergewelven. Het was een van de eerste gebouwen die speciaal voor dit doel werden gebouwd.",
        ],
      },
      {
        heading: "Brand, en nog eens brand",
        kind: "history",
        paragraphs: [
          "Wat je ziet, is niet zomaar het gebouw van 1531. De beurs werd in 1583 heropgebouwd en brandde in 1858 af. Architect Joseph Schadde ontwierp het huidige gebouw; hij kreeg de opdracht definitief in 1868 en de nieuwe beurs werd op 19 oktober 1872 plechtig ingehuldigd. Hij hield het idee van de gotische binnenplaats aan, maar overdekte die met een spectaculair dak van ijzer en glas.",
          "Eind 20ste eeuw verhuisde de handel elders en stond het gebouw zo'n twintig jaar leeg. Na een grondige restauratie ging het in 2019 opnieuw open, nu als evenementenlocatie.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Binnen kijken",
        paragraphs: [
          "Volgens de Handelsbeurs zelf is het beursplein publiek toegankelijk tijdens weekends en schoolvakanties, van 10 tot 18 uur, behalve tijdens evenementen. Ingangen via de Twaalfmaandenstraat (vanaf de Meir) en de Borzestraat (vanaf de Lange Nieuwstraat).",
          "Of een bezoek gratis is, vermeldt de website niet. Controleer vooraf de actuele info en de lijst met sluitingsdagen.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://handelsbeursantwerpen.be/en/bezoek-de-handelsbeurs/",
      },
    ],
    didYouKnow: [
      "De Antwerpse beurs werd een voorbeeld in het buitenland. Toen Thomas Gresham, de agent van de Engelse kroon in Antwerpen, in de jaren 1560 de Royal Exchange in Londen stichtte, nam hij de Antwerpse beurs als model.",
      "De Academie voor Schone Kunsten, die we verderop bezoeken, was oorspronkelijk in 'de Beurs aan de Meir' gehuisvest, en in de academietuin staan fragmenten van de 16de-eeuwse beurs.",
    ],
    transitionToNext: "Wandel naar de Lange Nieuwstraat. Het huis dat je zoekt, is vernoemd naar een Italiaanse stad, en zijn poort komt van elders.",
  },

  // ── Poort 25 (+ verdwenen 24) ────────────────────────────────────────
  "poortjes-lange-nieuwstraat": {
    name: "Lange Nieuwstraat 45",
    subtitle: "Bolonia la Grassa, en een poort die verhuisde",
    introduction: [
      "Zoek het koopmanshuis met een hoge trapgevel van veertien treden. Kijk dan naar de poort: een rondboogdeur in een barokke hardstenen omlijsting, met een cartouche waarin een jaartal staat.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Dit traditionele koopmanshuis uit de tweede helft van de 16de eeuw draagt sinds de late 16de eeuw de naam 'Bolonia la Grassa', naar de Italiaanse stad Bologna. Er logeerden Spaanse en Italiaanse edellieden. In de 17de eeuw woonde hier de schilder Abraham van Diepenbeeck; zijn familie bezat het huis tot in de 18de eeuw. Van 1828 tot 1849 hield weduwe Helena Van Celst-Kums er een meisjesschool en weeshuis.",
        ],
      },
      {
        heading: "Een poort die verhuisde",
        kind: "history",
        paragraphs: [
          "De poort hoorde oorspronkelijk niet bij dit huis. Smekens: 'Herkomstig van een gesloopt gebouw uit de Twaalfmaandenstraat.' De Inventaris bevestigt dat en geeft details: de poort is 'in een cartouche gedateerd 1665' en verving in 1926 een 19de-eeuwse aanpassing van de gevel.",
          "De Twaalfmaandenstraat is de straat naast de Handelsbeurs, waar je net vandaan komt.",
        ],
      },
    ],
    glossary: ["cartouche", "trapgevel"],
    thenAndNow: [
      "Toen: in 1951 stond de poort hier nog maar 25 jaar.",
      "Nu: zoek het jaartal 1665 in de cartouche. Het huis werd in 2014-2017 samengevoegd met het buurpand Sint-Franciscus en gerenoveerd tot wooncomplex.",
    ],
    didYouKnow: [
      "Aan dezelfde straat, op nummer 36, tekende Smekens nog een poort in Régencestijl van het grote herenhuis 'De Keyser'. Die is verdwenen.",
    ],
    transitionToNext: "Loop verder naar de Sint-Jacobskerk, de kerk waar Rubens begraven ligt.",
  },

  // ── Sint-Jacob ───────────────────────────────────────────────────────
  "poortjes-sint-jacob": {
    name: "Sint-Jacobskerk",
    subtitle: "De kerk van de pelgrims en van Rubens",
    introduction: [
      "Voor je staat een zware westtoren die nooit werd afgewerkt, en een lange, sobere kerk in Brabantse gotiek. De buitenkant is bescheiden. Het interieur is een van de rijkste van de stad.",
    ],
    sections: [
      {
        heading: "Van pelgrimsgasthuis tot parochiekerk",
        kind: "history",
        paragraphs: [
          "Op deze plek stond een gasthuis voor pelgrims op weg naar Santiago de Compostella (1404-1413). In 1478 werd de kapel een parochiekerk. De bouw van de huidige kerk verliep in drie fasen: vanaf 1491 met de toren, tot de werken wegens geldgebrek stilvielen; van 1552 tot 1566 met het schip en het dwarsschip; en van 1602 tot 1656 met het koor en de kapellen eromheen.",
          "Aan de kerk werkten bekende bouwmeesters: Herman de Waghemakere, zijn zoon Domien, diens broer Herman en vanaf 1525 Rombout Keldermans. Domien de Waghemakere kwam je al tegen bij de Oude Beurs, de Handelsbeurs en de kathedraal.",
        ],
      },
      {
        heading: "Laatgotiek, van buiten en van binnen",
        kind: "history",
        paragraphs: [
          "De Inventaris noemt de kerk een voorbeeld van Brabantse gotiek, met een karakteristieke zware westtoren, sobere buitenarchitectuur en binnen een triforium met loopgang. De onvoltooide toren telt vijf geledingen en wordt 'geschraagd door vier zware hoeksteunberen'.",
          "Binnen is het beeld helemaal anders: tientallen kapellen van rijke families, barokke altaren, marmer en grafmonumenten. In 1705 kreeg de kerk van paus Clemens XI de titel 'vermaarde collegiale kerk'.",
        ],
      },
      {
        heading: "Rubens",
        kind: "history",
        paragraphs: [
          "Pieter Paul Rubens overleed in 1640 en werd in deze kerk begraven. Zijn grafkapel werd in 1642 ingericht. Boven het altaar hangt een schilderij van Rubens zelf, 'Onze-Lieve-Vrouw met heiligen', dat de Inventaris in 1634 dateert.",
          "In mei 2026 maakte de stad het einde bekend van een restauratie van zeven jaar. Volgens het persbericht werden ook het altaarstuk, het altaar, het grafschrift en de grafmonumenten in de Rubenskapel gerestaureerd, en zijn ze weer te bezoeken.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Binnen kijken",
        paragraphs: [
          "Volgens de Stad Antwerpen (persbericht van 13 mei 2026) is de kerk 'elke dag vrij te bezoeken tussen 14 en 17 uur'. Sommige oudere bronnen melden nog dat de grafkapel tot 2028 dicht is; volgens het persbericht is ze weer toegankelijk. Tijdens erediensten en uitvaarten kan de kerk gesloten zijn. Kleinere restauraties lopen nog door tot 2028.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://pers.antwerpen.be/sint-jacobskerk-opnieuw-volledig-toegankelijk-na-7-jaar-restauratie",
      },
    ],
    didYouKnow: [
      "Bij de restauratie werden 426.650 nieuwe leien op het dak gelegd en 1.738 m² glas-in-lood hersteld.",
    ],
    lookAt: [
      {
        title: "De onafgewerkte toren",
        body: "Kijk omhoog naar de westtoren. De bouw begon in 1491 en viel stil door geldgebrek; de toren kreeg nooit de spits die je bij de kathedraal zag.",
      },
    ],
    transitionToNext: "Wandel naar de Keizerstraat, de straat van burgemeesters en schilders.",
  },

  // ── Poort 26 + Snijders&Rockoxhuis (+ verdwenen 32) ──────────────────
  "poortjes-keizerstraat": {
    name: "Keizerstraat 10-16",
    subtitle: "Een burgemeester, een schilder en een poort vol rocailles",
    introduction: [
      "Je staat in een rustige straat met statige huizen. Zoek op nummer 16 een klein poortje met grillige, schelpachtige versieringen. Een paar huizen verder, op nummer 10-12, ligt het Snijders&Rockoxhuis.",
    ],
    sections: [
      {
        heading: "Nummer 16: het poortje",
        kind: "history",
        paragraphs: [
          "Het pand bestaat uit twee gekoppelde 16de-eeuwse huizen. Het rechterpand heeft een laatgotische krulgevel uit de eerste helft van de 16de eeuw, het linkerpand een trapgevel uit de tweede helft. In de middenas zit volgens de Inventaris een poortje uit het derde kwart van de 18de eeuw: een 'rondboog met imposten, gevat in een spiegelboogveld, versierd met rocailles', met een houten deur, een smeedijzeren waaier en een gietijzeren voetschraper.",
          "Smekens noemt het huis 'De zwarte arend'; de Inventaris noemt het vandaag 'De witte Lelie'. In 1830 liet baron Philippe Antoine Joseph de Pret de ter Veken de gevels aanpassen door architect Franciscus De Wolf. Sinds 1992-1993 is het een hotel.",
        ],
      },
    ],
    cards: [
      {
        id: "card-rockox",
        title: "Het Snijders&Rockoxhuis",
        subtitle: "Mogelijke museumstop: Keizerstraat 10-12",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Nicolaas Rockox (1560-1640) was burgemeester van Antwerpen en een groot kunstliefhebber. In 1603 kocht hij twee aanpalende huizen en liet ze herbouwen; hij woonde er met zijn vrouw Adriana Perez. Als burgemeester vertegenwoordigde hij de stad bij hogere overheden en was hij hoofd van de militie en de schuttersgilden.",
              "Zijn buurman was de schilder Frans Snijders (1579-1657). Hij en zijn echtgenote Margriete de Vos woonden sinds 1622 in het huis 'de Fortuyne'. Snijders was bekend om zijn stillevens, dierstukken en jachttaferelen.",
              "In 1970 kocht de Kredietbank het Rockoxhuis en werd het een museum. Vandaag zijn de twee huizen samen het Snijders&Rockoxhuis, met werk van onder meer Bruegel, Rubens en Van Dyck.",
            ],
          },
        ],
        didYouKnow: [
          "Het museum is elke eerste dinsdag van de maand gratis te bezoeken.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Museumbezoek (optioneel)",
        paragraphs: [
          "Open van dinsdag tot zondag, 10 tot 17 uur; gesloten op maandag (behalve paas- en pinkstermaandag), op 1 januari, 1 mei, Hemelvaartsdag, 1 november en 25 december. Toegang € 10; jongeren tot 18 jaar en houders van een museumPASSmusées gratis; elke eerste dinsdag van de maand gratis voor iedereen.",
          "Een museumbezoek is optioneel; de wandeling gaat daarna gewoon verder.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.snijdersrockoxhuis.be/en/visit/plan-your-visit/opening-hours-prices",
      },
    ],
    glossary: ["rocaille", "lodewijk-stijlen"],
    thenAndNow: [
      "Toen: Smekens tekende een 'poort in Louis XV-stijl'. Die stijl herken je aan de asymmetrische schelp- en rotsvormen.",
      "Nu: zoek de voetschraper, het ijzeren randje om je schoenen aan schoon te schrapen. Staat die ook op de tekening?",
    ],
    didYouKnow: [
      "In de Paternosterstraat, vlak bij deze straat, tekende Smekens een poortje in Vlaamse renaissance van het huis 'De gulden dolfeyn', dat volgens hem al in 1497 werd vermeld. Het is verdwenen.",
    ],
    transitionToNext: "Loop naar de Markgravestraat, een smal straatje dat rond 1500 werd aangelegd.",
  },

  // ── Poort 27 ──────────────────────────────────────────────────────────
  "poortjes-markgravestraat": {
    name: "Markgravestraat 14",
    subtitle: "Een straat door een markgrafelijk erf",
    introduction: [
      "Zoek in dit smalle straatje nummer 14 en de poort uit het boek. Vergelijk de omlijsting met de tekening: de verhoudingen van boog, pilasters en bekroning.",
    ],
    sections: [
      {
        heading: "De straat",
        kind: "history",
        paragraphs: [
          "De Markgravestraat werd rond 1500 aangelegd en is genoemd naar markgraaf Jan van Immerseel (15de-16de eeuw), door wiens eigendom de straat werd getrokken. Het is een smalle straat met huizen in uiteenlopende stijlen, met punt- en trapgevels.",
        ],
      },
      {
        heading: "De poort",
        kind: "history",
        paragraphs: [
          "Smekens schrijft bij deze poort alleen: 'Renaissancepoort. Markgravestraat 14.' Een eigen inventarisfiche voor deze poort vonden we niet. Over de oorspronkelijke functie van deze specifieke poort is weinig met zekerheid bekend. [Historisch onderzoek vereist]",
        ],
      },
    ],
    thenAndNow: [
      "Toen: een poort zonder verhaal in het boek, alleen een tekening.",
      "Nu: vergelijk zelf. Klopt de tekening nog met wat je ziet?",
    ],
    didYouKnow: [
      "De straatnaam verwijst niet naar een titel in het algemeen, maar naar één persoon: markgraaf Jan van Immerseel, door wiens erf de straat werd getrokken.",
    ],
    transitionToNext: "Wandel naar de Koningstraat. Zoek er drie koningen.",
  },

  // ── Poort 29 (+ verdwenen 28 en 31) ──────────────────────────────────
  "poortjes-koningstraat": {
    name: "Koningstraat 17",
    subtitle: "De Drij Koningen",
    introduction: [
      "Zoek de trapgevel met een klein hardstenen poortje in de rechtse travee. Boven de deur zit een rond venstertje, omringd door loofwerk.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Smekens schrijft dat het huis 'De Drie Koningen' 'reeds vermeld in 1549' werd; de Inventaris zegt 'reeds vermeld op het einde van de 16de eeuw'. In 1881 onderging de gevel een grondige restauratie onder leiding van de architecten Léonard en Henri Blomme.",
          "Het poortje zelf is jonger dan het huis. Smekens: 'Dagtekenend van 1716.'",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft een 'poortje uit blauwe hardsteen in laat-barokstijl gedateerd 1716': 'een schouderboogvormige deur in geprofileerde omlijsting, geflankeerd door pilasters met verdiepte schacht en voluutkapiteel'. Boven de deur zit een oculus, een rond venster, omringd door decoratief loofwerk. Smekens noemt het een 'Louis XIV-poortje'.",
        ],
      },
    ],
    glossary: ["schouderboog", "lodewijk-stijlen"],
    thenAndNow: [
      "Toen: Smekens tekende het poortje met zijn rond venster.",
      "Nu: zoek het jaartal 1716.",
    ],
    didYouKnow: [
      "In dezelfde straat, op nummer 14, tekende Smekens nog een 18de-eeuws poortje van het huis 'De witte koning'. Het is verdwenen.",
      "Het poortje in de nabijgelegen Gratiekapelstraat was al weg toen het boek verscheen: Smekens schrijft dat het 'enkele jaren geleden zonder meer door vandalenhanden gesloopt' werd.",
    ],
    transitionToNext: "Loop naar de Prinsstraat, naar de oude binnenstad van de universiteit.",
  },

  // ── Universiteit ─────────────────────────────────────────────────────
  "poortjes-universiteit": {
    name: "Stadscampus en Hof van Liere",
    subtitle: "Een burgemeesterspaleis werd een universiteit",
    introduction: [
      "Achter de gevels van de Prinsstraat ligt de Stadscampus van de Universiteit Antwerpen. Het hart ervan is het Hof van Liere, een laatgotisch paleis met een binnenplaats met galerijen en een waterput.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "'Deze vorstelijke woning werd in 1516 gebouwd in opdracht van de toenmalige Antwerpse burgemeester Aert van Liere', in Brabants-gotische stijl, schrijft de universiteit. Na zijn dood kwam het hof in handen van de stad, die het ter beschikking stelde aan een Milanese bankiersfamilie en later aan de Engelse Natie, de vereniging van Engelse kooplieden.",
          "De jezuïeten, die in 1575 een middelbare school in Antwerpen oprichtten, breidden het complex uit en richtten het in als kostschool. Na de opheffing van hun orde werd het een militaire academie en een hospitaal.",
          "In 1929 kwamen de jezuïeten terug: hun Sint-Ignatius-handelshogeschool vond hier een nieuw onderkomen. In 1988 kochten de Universitaire Faculteiten Sint-Ignatius (UFSIA) het Prinsenhof, en in 2003 fuseerden de Antwerpse universiteiten tot de Universiteit Antwerpen.",
        ],
      },
      {
        heading: "Rondom",
        kind: "history",
        paragraphs: [
          "Tot de campus hoort ook het Klooster van de Grauwzusters in de Lange Sint-Annastraat, gebouwd in 1887 naar ontwerp van Frans Baeckelmans. Volgens de universiteit verzorgden de zusters pestslachtoffers. Na 1999 werd het gerenoveerd, met moderne architectuur in het historische kader.",
          "Volgens de universiteit kreeg de tuin van het Hof van Liere in 1998 een nieuw uitzicht door landschapsarchitect Wirtz.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Toegang",
        paragraphs: [
          "De campus is een werkende universiteit, geen museum. We vonden geen officiële info over vrije toegang tot de binnenplaats en de tuin. Staat de poort open, kijk dan rustig rond en respecteer studenten en personeel; staat ze dicht, dan is de gevel aan de Prinsstraat ook de moeite. [Toegang te verifiëren]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    didYouKnow: [
      "Engelse kooplieden waren belangrijk in het 16de-eeuwse Antwerpen: de Engelse Natie had hier een tijd onderdak, en volgens Smekens liet de stad in 1550 een kleine beurs 'ten behoeve van de Engelse kooplieden' bouwen.",
    ],
    transitionToNext: "Hierna kun je kiezen: een korte omweg naar twee poorten in de Rodestraat, of meteen door naar de Stadswaag.",
  },

  // ── Poorten 33 en 34: optioneel ──────────────────────────────────────
  "poortjes-rodestraat": {
    name: "Rodestraat 43 en 44",
    subtitle: "Extra: twee poorten bij het Begijnhof",
    introduction: [
      "Welkom op de omweg. In de Rodestraat tekende Smekens twee poorten die bijna tegenover elkaar liggen: een renaissancepoortje aan de pastorie van het Begijnhof (nummer 43) en een inrijpoort (nummer 44).",
    ],
    sections: [
      {
        heading: "Wat het boek zegt",
        kind: "history",
        paragraphs: [
          "Over nummer 43 schrijft Smekens alleen: 'Renaissancepoortje aan de pastorie van het Begijnhof.' Over nummer 44: 'Opgericht omstreeks 1725 in zuivere Louis XV-stijl.'",
          "Voor deze twee poorten hebben we nog geen eigen onderzoek kunnen doen. Of ze vandaag nog bestaan en in welke staat, moet ter plaatse gecontroleerd worden. [Historisch onderzoek vereist]",
        ],
      },
      {
        heading: "Een inrijpoort",
        kind: "context",
        paragraphs: [
          "Een inrijpoort is breder dan een gewone deur: ze moest een koets of kar doorlaten naar een binnenplaats. Je herkent ze aan hun breedte en vaak aan stenen of ijzeren stootpalen onderaan.",
        ],
      },
    ],
    glossary: ["lodewijk-stijlen"],
    thenAndNow: [
      "Toen: twee poorten, gedateerd in de 16de-17de eeuw (43) en omstreeks 1725 (44).",
      "Nu: vergelijk ze allebei met de tekeningen. Jouw waarneming helpt ons deze stop te vervolledigen.",
    ],
    didYouKnow: [
      "Het jaartal 1725 en de stijl 'Louis XV' zijn Smekens' eigen woorden. Stijlnamen en jaartallen kunnen in latere studies anders uitvallen, zoals je onderweg al zag.",
    ],
    transitionToNext: "Wandel terug naar de Stadswaag: het plein van de man die de halve noordelijke stad liet aanleggen.",
  },

  // ── Poort 35 (+ verdwenen 30) ────────────────────────────────────────
  "poortjes-stadswaag": {
    name: "De Stadswaag",
    subtitle: "Waar handel gewogen en belast werd",
    introduction: [
      "Je staat op een plein zonder het gebouw waaraan het zijn naam dankt. Hier stond de stadswaag. Zoek aan het plein nummer 13 met het poortje uit het boek: een laat-renaissancepoortje met een waaier.",
    ],
    sections: [
      {
        heading: "Wat is een stadswaag?",
        kind: "history",
        paragraphs: [
          "Een waag was een openbaar weeghuis. Volgens de Inventaris was de Antwerpse stadswaag 'een soort van belastingskantoor waar koopwaren werden gewogen en verhoudingsgewijs werden belast'. Wie goederen verhandelde, liet ze hier officieel wegen: zo wist de koper wat hij kreeg, en de stad wat ze kon belasten.",
          "Het gebouw had ook 'verscheidene rijkversierde zalen, waar bruiloftsfeesten werden gevierd'.",
        ],
      },
      {
        heading: "Gilbert van Schoonbeke",
        kind: "history",
        paragraphs: [
          "Het plein en de straten eromheen werden in 1548 aangelegd door Gilbert van Schoonbeke, een projectontwikkelaar avant la lettre. Bij akte van 6 mei 1547 kocht hij de grond van de stad, voor 31.000 Carolusguldens. Hij sloopte de bestaande gebouwen en bouwde 'de nieuwe waag'.",
          "Hij legde ook drie straten aan: de Noord-, Oost- en Weststraat, later hernoemd tot Hoornstraat, Brilstraat en Raapstraat. De naam 'Stadswaag' voor het plein dateert van omstreeks 1800.",
          "Van Schoonbeke ken je al: hij liet ook de brouwerijen in de Brouwersstraat bouwen, waar enkele poorten uit het boek vandaan komen.",
        ],
      },
      {
        heading: "Het einde van de waag",
        kind: "history",
        paragraphs: [
          "Op 25 augustus 1873 sloeg tijdens een hevige storm de bliksem in. Het gebouw vatte vuur en brandde in enkele uren volledig af. De stad maakte er daarna een openbaar plein van. In september 1914 kwam de Stadswaag nog eens in het nieuws, toen er een zeppelinbom insloeg.",
          "In de jaren 1960 ontdekten kunstenaars de buurt en werd ze een uitgaanscentrum. In 1998 werd het plein heraangelegd.",
        ],
      },
    ],
    glossary: ["waaier", "ijkdienst"],
    thenAndNow: [
      "Toen: in 1951 was de waag al bijna tachtig jaar verdwenen. Smekens tekende het poortje op nummer 13 zonder verdere uitleg.",
      "Nu: zoek nummer 13 en vergelijk de waaier met de tekening. [Huidige toestand van dit poortje ter plaatse te verifiëren]",
    ],
    didYouKnow: [
      "In de Raapstraat, een van Van Schoonbekes straten, tekende Smekens een poortje met 'een raap als motief' in de schelp boven de deur. Een raap in de Raapstraat: het poortje is helaas verdwenen.",
      "Na de brand van 1873 zat de officiële ijkdienst tijdelijk in het huis De Clocke in de Lange Noordstraat. Dat huis en zijn poort zie je later op de wandeling.",
    ],
    transitionToNext: "Loop naar de Mutsaardstraat. Tegenover de Academie staat een monumentale poort.",
  },

  // ── Poort 36 ──────────────────────────────────────────────────────────
  "poortjes-mutsaardstraat": {
    name: "Mutsaardstraat 30-32",
    subtitle: "Het huis van een kanselier",
    introduction: [
      "Zoek aan de Mutsaardstraat een brede zandstenen gevel met een barok middenstuk en een gebroken fronton. Kijk naar de monumentale poort. Vergelijk ook de huisnummers 30 en 32.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Smekens schrijft bij 'Mutsaertstraat 30': 'Behoorde aan het huis Schockaert, stadsraadsheer en kanselier van Brabant.' De Inventaris beschrijft het barokke herenhuis van Jan Daniël Antoon Schockaert, kanselier van het hertogdom Brabant vanaf 1739, vandaag als Mutsaardstraat 32. Nummer 30 is volgens de Inventaris het huis 'De Draeck'.",
          "Het herenhuis werd in het derde kwart van de 17de eeuw gebouwd door de familie Van den Kerckhoven. Op 16 december 1944 raakte het zwaar beschadigd door een V-bom. In 1956-1957 werd het verbouwd tot winkels, kantoren en appartementen; de voorgevel is sinds 1958 beschermd.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De gevel van acht traveeën heeft een parement uit zandsteen en een barok middenrisaliet met een 'gebroken fronton met topornament'. De poort heeft volgens de Inventaris een 'geprofileerd, geblokt beloop op Ionische pilasters' en een decoratieve cartouche.",
        ],
      },
    ],
    glossary: ["fronton", "beloop"],
    thenAndNow: [
      "Toen: Smekens zag de poort een paar jaar na de V-bomschade van 1944 en vóór de verbouwing van 1956-1957.",
      "Nu: bij welk huisnummer hoort de getekende poort vandaag, 30 of 32? [Ter plaatse te verifiëren]",
    ],
    didYouKnow: [
      "Antwerpen werd in 1944-1945 zwaar getroffen door V-bommen. Dit huis is een van de vele gebouwen die toen beschadigd raakten.",
    ],
    transitionToNext: "Steek over naar de Academie, op nummer 31. Achter het hek ligt een tuin met vijf poorten die nergens anders meer staan.",
  },

  // ── Poorten 37–41: Academietuin ──────────────────────────────────────
  "poortjes-academie": {
    name: "De Academie en haar tuin",
    subtitle: "Vijf poorten zonder huis",
    introduction: [
      "Je staat bij de Koninklijke Academie voor Schone Kunsten, een van de oudste kunstscholen van België. Achter het poortgebouw ligt de academietuin, en daarin staan poorten en gevelstukken van gebouwen die elders in de stad zijn verdwenen.",
      "Vijf ervan tekende Smekens. Hieronder kun je ze één voor één zoeken.",
    ],
    searchTask: {
      title: "Zoek de vijf poorten in de tuin",
      intro: "Elk van deze poorten kwam van ergens anders in Antwerpen. Zoek ze in de tuin en vergelijk ze met de tekening. Het is geen wedstrijd: vind je er een niet, bekijk dan gewoon de oplossing.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 19,
          question: "Het poortje van 'Het Klaverblad'. Waar kwam het vandaan?",
          hints: ["Kijk naar de sluitsteen: welke plant zie je erin?", "Op de sluitsteen staat ook een jaartal."],
          solution: "Uit de vroegere Klaverstraat, nu Haverstraat.",
          explanation: [
            "Volgens de Inventaris is dit een 'hardstenen rondboogpoortje' uit 'het Klaverblad' in de Haverstraat, met het jaartal 1663 op de sluitsteen en een klaverbladmotief. Toevallig of niet: 1663 is ook het stichtingsjaar van de Academie.",
          ],
        },
        {
          plate: 21,
          question: "Het poortje met een borstbeeld erboven. Wie is dat?",
          hints: ["Het borstbeeld stelt de stichter van de Academie voor.", "Hij was een schilder, en zijn vader had dezelfde naam."],
          solution: "David Teniers de Jonge, in een poortje van het huis 'De Gans' uit de Zakstraat.",
          explanation: [
            "Smekens: 'In de nis een borstbeeld van David Teniers de Jonge, de schilder die in 1663 de Academie stichtte. Oorspronkelijk hoorde dit beeld niet in deze nis.' Het poortje en het beeld zijn dus samengebracht: een mooi voorbeeld van hoe men in de tuin oude stukken opnieuw combineerde.",
          ],
        },
        {
          plate: 33,
          question: "De grote poortomlijsting met letters in een medaillon. Van welk bedrijf was ze?",
          hints: ["Zoek drie letters in het medaillon bovenaan.", "Het wapen ernaast hoort bij het ambacht dat je in de Adriaan Brouwerstraat nog tegenkomt."],
          solution: "Brouwerij Van Pruyssen, met de letters C.V.P. en het wapen van de brouwersgilde.",
          explanation: [
            "Smekens noemt als herkomst de Brouwersstraat, de huidige Adriaan Brouwerstraat. De Inventaris vermeldt in de tuin een houten rondboogdeur van het 'Oosters Huis', geplaatst in de hardstenen omlijsting van brouwerij Van Pruyssen, met de initialen CVP en brouwersemblemen.",
          ],
        },
        {
          plate: 34,
          question: "De grote poort met een gebeeldhouwde middenstijl. Uit welk huis kwam ze?",
          hints: ["De middenstijl tussen de deurvleugels heet een 'makelaar'.", "Het huis had een religieuze naam, en er staat een opschrift op de deur."],
          solution: "Uit het huis 'De Heilige Drievuldigheid' aan de Kipdorp.",
          explanation: [
            "Smekens: het huis 'heeft plaats gemaakt voor de magazijnen A la Vierge noire (Kipdorp)'. De Inventaris beschrijft in de tuin een houten deur met het opschrift 'In de Heyliche Dryvuldicheidt' uit 1636.",
          ],
        },
        {
          plate: 37,
          question: "De grote poort met een ijzeren waaier. Van welk klooster was ze?",
          hints: ["Kijk goed in het smeedijzer van de waaier: er zijn twee letters in verwerkt."],
          solution: "Van het afgebroken klooster van de Cellebroeders: de letters C.B.",
          explanation: [
            "Smekens: 'Afkomstig van het afgebroken klooster der Cellebroeders, met de letters C. B. (Cellebroeders) dooreengewerkt in het ijzerwerk van de waaier.'",
            "Waar in de tuin elke poort precies staat, hebben we nog niet ter plaatse vastgelegd. [Ter plaatse te verifiëren]",
          ],
        },
      ],
    },
    sections: [
      {
        heading: "De oudste kunstschool van het land",
        kind: "history",
        paragraphs: [
          "De Academie werd in 1663 opgericht op initiatief van de schilder David Teniers, met toestemming van koning Filips IV. Ze was eerst gehuisvest in de Beurs aan de Meir. In 1811 verhuisde ze naar het voormalige minderbroedersklooster hier aan de Mutsaardstraat.",
          "De minderbroeders hadden zich in 1446 in Antwerpen gevestigd. Hun klooster werd bij de Beeldenstorm van 1566 verwoest en na hun terugkeer in 1585 herbouwd. In 1797, onder het Franse bewind, moesten ze vertrekken.",
        ],
      },
      {
        heading: "Gebouwen en tuin",
        kind: "history",
        paragraphs: [
          "Stadsbouwmeester Pierre Bruno Bourla ontwierp de oudste academiegebouwen: onder meer een directeurswoning (1823-1824), tentoonstellingszalen, en in 1841 het poortgebouw met ijzeren hek en een museum met een klassiek tempelfront. Na de oorlog kwam er een klassen- en ateliervleugel naar ontwerp van Ferdinand Peeters (1953). In 1963 schilderde Renaat Braem een muurschildering in de traphal.",
          "De tuin volgt 'een symmetrisch plan vertrekkende van het poortgebouw' en werd in 1905 heraangelegd naar ontwerp van architect Emiel Van Averbeke. Er staan beelden van David Teniers, Mathias Van Bree, Quinten Matsijs en Sint-Lucas, en fragmenten van de 16de-eeuwse Beurs.",
        ],
      },
      {
        heading: "Waarom staan hier poorten?",
        kind: "interpretation",
        paragraphs: [
          "De Inventaris beschrijft de poorten als 'gerecupereerde portaalelementen van verdwenen Antwerpse gebouwen'. Wie precies besliste om ze hier te plaatsen, en waarom, vonden we niet terug. Het ligt voor de hand dat men waardevolle stukken van gesloopte panden wilde redden, en dat een kunstschool met een afgesloten tuin daar een logische plek voor was, ook als lesmateriaal. Maar dat is een interpretatie, geen gedocumenteerd feit.",
        ],
      },
      {
        heading: "Kunstenaars van de Academie",
        kind: "history",
        paragraphs: [
          "Door de eeuwen studeerden hier kunstenaars als Lawrence Alma-Tadema, Ford Madox Brown en Henry van de Velde. De modeopleiding van 1963 werd in de jaren 1980 wereldberoemd door 'de Antwerpse Zes', onder wie Dries Van Noten, Ann Demeulemeester en Walter Van Beirendonck. Vandaag hoort de Academie bij de AP Hogeschool.",
        ],
      },
    ],
    cards: [
      {
        id: "card-van-gogh",
        title: "Vincent van Gogh in Antwerpen",
        subtitle: "Drie maanden, november 1885 – februari 1886",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Eind november 1885 kwam Vincent van Gogh vanuit Nuenen naar Antwerpen. Hij huurde een kleine kamer in de Lange Beeldekensstraat, in de arbeiderswijk Stuivenberg.",
              "In januari 1886 schreef hij zich in aan de Academie, vooral om naar levend model te leren schilderen. Hij volgde tekenles naar antieke gipsbeelden bij Frans Vinck en later bij Eugène Siberdt, en probeerde de schilderles van Charles Verlat.",
              "Het ging niet goed. Zijn spontane, krachtige stijl botste met het strenge academische systeem, en na een conflict met Siberdt werd hij teruggezet naar een lagere klas. Dat nieuws bereikte hem pas toen hij al weg was: op 28 februari 1886 vertrok hij naar Parijs, naar zijn broer Theo.",
            ],
          },
          {
            heading: "Wat we weten, en wat niet",
            kind: "context",
            paragraphs: [
              "Zijn verblijf in Antwerpen duurde ongeveer drie maanden, zijn tijd aan de Academie nog geen twee. Het museum KMSKA geeft als aankomstdatum 24 november 1885; andere bronnen noemen enkele dagen later. We houden het daarom op 'eind november'.",
            ],
          },
        ],
        didYouKnow: [
          "De man die in Antwerpen naar een lagere klas werd verwezen, is vandaag de bekendste student die de Academie ooit had.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Toegang tot de tuin",
        paragraphs: [
          "De academietuin hoort bij de campus van de Academie en is geen openbaar park. We vonden geen officiële openingsuren. Staat het hek open, loop dan rustig binnen; staat het dicht, dan zie je een deel van de tuin door het hek. [Toegang te verifiëren bij de Academie]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    glossary: ["makelaar", "waaier", "sluitsteen"],
    didYouKnow: [
      "De academietuin is sinds 1974 beschermd als cultuurhistorisch landschap.",
    ],
    transitionToNext: "Einde van het derde deel. Loop naar het noorden, richting Falconplein: de stad wordt hier havenstad.",
  },
};
