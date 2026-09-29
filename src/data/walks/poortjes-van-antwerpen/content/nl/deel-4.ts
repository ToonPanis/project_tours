import type { PoortjesStopText } from "../types";

/** Deel 4: Falconplein & oude havenbuurt (poorten 42–50) en Deel 5: MAS. */
export const deel4: Record<string, PoortjesStopText> = {
  // ── Poort 42 (+ verdwenen 43) ────────────────────────────────────────
  "poortjes-falconplein": {
    name: "Falconplein 39: de Falconpoort",
    subtitle: "Het laatste stuk van een klooster",
    introduction: [
      "Zoek aan het Falconplein een grote hardstenen poort die in een modern woonblok is opgenomen. Kijk naar de cartouche bovenaan: er staat een Latijnse tekst in, met een paar opvallend grote letters.",
    ],
    sections: [
      {
        heading: "Het klooster van de Falcontinnen",
        kind: "history",
        paragraphs: [
          "De Falconpoort is het enige overblijfsel van het klooster van de Falcontinnen. Het werd in de 14de eeuw gesticht door Falco de Lampage, muntmeester van hertog Jan III van Brabant; Smekens noemt hem 'de rijke Italiaan Falco de Lampagne'. In de 15de eeuw groeide het klooster sterk, en begin 16de eeuw besloeg het een heel bouwblok tussen de Oudeleeuwenrui, de Generaal Belliardstraat, de Falconrui en het Falconplein.",
          "In 1784 werd het klooster door keizer Jozef II afgeschaft. Het werd in 1792 een militair hospitaal en brandde een jaar later af. Onder het Franse bewind werd het terrein in 1810 aan de stad verkocht; op bevel van Napoleon kwam er de Falconkazerne, die bleef tot ze in 1941 werd gesloopt. Smekens schrijft in 1951: 'thans eveneens gesloopt'.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De poort dateert van 1671: een rondboog in blauwe hardsteen, omlijst door geringde pilasters met versierde kapitelen. Bovenop stond oorspronkelijk een beeld van Sint-Augustinus, de beschermheilige van het klooster. De cartouche draagt het opschrift 'VerVs RegVLarIVM DoCtor', 'de ware leraar der regulieren', een verwijzing naar Augustinus.",
          "De poort is sinds 22 december 1943 beschermd als monument.",
        ],
      },
      {
        heading: "De oude havenbuurt",
        kind: "context",
        paragraphs: [
          "Vanaf hier verandert de stad. In de 16de eeuw legde Gilbert van Schoonbeke ten noorden van de oude stad de 'Nieuwstad' aan, met woningen en drie binnenhavens: de Brouwersvliet, de Timmervliet en de Middelvliet. Waar nu straten liggen, lag toen water, en de handel kwam tot vlak bij de huizen.",
        ],
      },
    ],
    glossary: ["chronogram", "kapiteel"],
    thenAndNow: [
      "Toen: Smekens tekende de poort vrijstaand, met het opschrift in de cartouche. Smekens schrijft in de verleden tijd dat er een beeld van Augustinus bovenop 'prijkte'.",
      "Nu: de poort staat in een gereconstrueerd woonblok. Volgens de Inventaris herinnert een 19de-eeuws Mariabeeld met resten smeedwerk aan de arbeiderswoningen die vroeger achter de poort lagen.",
    ],
    didYouKnow: [
      "Het opschrift is een chronogram. Tel de grote letters die ook Romeinse cijfers zijn: V (5) + V (5) + V (5) + L (50) + I (1) + V (5) + M (1000) + D (500) + C (100). Samen: 1671, het bouwjaar van de poort.",
    ],
    lookAt: [
      {
        title: "Reken het zelf uit",
        body: "Zoek in de cartouche de letters die groter geschreven zijn dan de rest. Tel ze op als Romeinse cijfers. Kom je op 1671?",
      },
    ],
    transitionToNext: "Loop naar de Oudeleeuwenrui. Zoek er een hand in de steen.",
  },

  // ── Poort 45 (+ verdwenen 44) ────────────────────────────────────────
  "poortjes-oudeleeuwenrui": {
    name: "Oudeleeuwenrui 58",
    subtitle: "De Gulden Handt",
    introduction: [
      "Zoek een barokpoort met bovenaan een gebroken fronton en een cartouche. Kijk goed in de cartouche: er staat een hand in, en een jaartal.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Smekens: 'Dagtekenend van 1669, met afbeelding van een hand. Overblijfsel van de brouwerij De gulden handt.' Volgens de Inventaris komt de poort inderdaad van brouwerij De Gulden Handt en dateert ze van 1669.",
          "Dat de poort hier staat, heeft een tweede verhaal. Stokerij 'Het Anker', naar verluidt al sinds 1753 actief, werd omstreeks 1815 overgenomen door Jean Meeùs. Zijn kleinzoon Jules Meeûs verhuisde het bedrijf in 1897 naar de Oudeleeuwenrui, en daar werd de oude brouwerijpoort in een nieuwe gevel opgenomen.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De poort is gebouwd uit blauwe hardsteen: een rondboog met een voluutsleutel op 'geblokte pilasters met kapitelen', in 'een spiegelboogveld met voluten en guttae', bekroond door een gebroken fronton met een cartouche met de hand en het jaartal.",
        ],
      },
    ],
    glossary: ["fronton", "voluut"],
    thenAndNow: [
      "Toen: in 1951 stond de poort hier al ruim vijftig jaar, in de gevel van de stokerij.",
      "Nu: het gebouw is goed bewaard, maar de oorspronkelijke mezzanine en zadeldaken verdwenen in de jaren 1950 voor een volledige tweede verdieping. Vergelijk de hand in de cartouche met de tekening.",
    ],
    didYouKnow: [
      "Aan het nabije Hessenplein tekende Smekens een poort van brouwerij 'De Bel', 'getuige de bolronde rinkelbel in de cartouche-sluitsteen'. Hij vermeldt geen huisnummer; de poort is verdwenen.",
    ],
    transitionToNext: "Wandel naar de Lange Noordstraat. Zoek er een klok in de gevel.",
  },

  // ── Poort 46 ──────────────────────────────────────────────────────────
  "poortjes-lange-noordstraat": {
    name: "Lange Noordstraat 19",
    subtitle: "De Clocke: waar maten en gewichten werden geijkt",
    introduction: [
      "Zoek een breed, laag huis met een eenvoudige rondboogpoort. Boven de poort zit een gevelsteen met een klok in half verheven beeldhouwwerk.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "De Clocke was een voormalige afspanning, een herberg waar reizigers hun paard en kar konden stallen. De oudste vermelding dateert uit 1560. In de 19de eeuw was het een herberg en danszaal; Smekens noemt het 'een druk bezochte herberg en danszaal'.",
          "Na de brand van de stadswaag in 1873 zat hier tijdelijk de officiële ijkdienst, die controleerde of de maten en gewichten van handelaars juist waren. Smekens schrijft het korter: 'De officiële dienst voor het ijken van maten en gewichten was daar gevestigd.'",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "Het traditionele breedhuis stamt uit de tweede helft van de 16de eeuw, met vier traveeën en twee verdiepingen onder een zadeldak. De poort is 'een rondboogpoort in een eenvoudige, geblokte, hardstenen omlijsting' met diamantkopimposten. De gevelsteen toont 'een klok' in half verheven beeldhouwwerk. Smekens noemt het een 'renaissancepoort met barleef: een klok voorstellend'.",
        ],
      },
    ],
    glossary: ["barleef", "diamantkop", "ijkdienst"],
    thenAndNow: [
      "Toen: Smekens tekende de poort met de klok als gevelsteen.",
      "Nu: het huis is bewaard. Zoek de klok, en zoek de diamantkoppen op de imposten.",
    ],
    didYouKnow: [
      "De klok in de gevelsteen maakt de huisnaam zichtbaar voor iedereen die voorbijkomt, zonder dat er een woord of nummer op staat.",
    ],
    transitionToNext: "Wandel naar de Adriaan Brouwerstraat, vroeger de Brouwersstraat. Daar wacht de laatste zoekopdracht.",
  },

  // ── Poorten 47–50: zoekopdracht ──────────────────────────────────────
  "poortjes-adriaan-brouwerstraat": {
    name: "Adriaan Brouwerstraat",
    subtitle: "Zoekopdracht: de straat van de brouwers",
    introduction: [
      "Deze straat heette vroeger de Brouwersstraat. Smekens tekende hier vier poorten, en ze staan er alle vier nog. Loop rustig door de straat en kijk naar de gevels: welke herken je?",
    ],
    searchTask: {
      title: "Welke poorten herken je nog?",
      intro: "Vier tekeningen, vier poorten. Het is geen quiz: kijk, vergelijk, en tik op 'Gevonden!' wanneer je er een herkent. Loop je vast, bekijk dan een hint of de oplossing.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 7,
          question: "Een poort met sterren. Waar staat ze?",
          hints: ["Zoek een opschrift op de sluitsteen.", "Het zijn lage huisnummers."],
          solution: "Adriaan Brouwerstraat 5, van brouwerij De Gulde Sterre.",
          explanation: [
            "Op de sluitsteen staat 'GVLDE STER'. Smekens: 'Op de zijstukken komt het stermotief voor. Hoorde bij de brouwerij De gulden sterre. Dit motief evokeert de gulden ster, zinnebeeld der brouwers.' De Inventaris dateert het huis in de eerste helft van de 17de eeuw.",
          ],
        },
        {
          plate: 29,
          question: "Een strenge poort met zuilen en een raampje erboven.",
          hints: ["Kijk naar de zuilen: ze zijn in het midden iets dikker.", "Het huis staat op de hoek met een andere straat."],
          solution: "Adriaan Brouwerstraat 17, op de hoek met de Korte Zeevaartstraat.",
          explanation: [
            "Smekens: 'Zeer streng klassiek opzet, ditmaal zonder krullen of voluten.' De Inventaris beschrijft een 'poortje in vroeg-barokstijl uit blauwe hardsteen uit de eerste helft van de 17de eeuw', met een mascaronsleutel, 'driekwartzuilen met zwellende schacht' en een gebroken gebogen fronton met een rechthoekig bovenlicht. De panden zijn in 2014-2015 gerestaureerd.",
          ],
        },
        {
          plate: 20,
          question: "Een poort met het teken van de brouwers en een jaartal.",
          hints: ["Zoek het oudste gebouw van de straat.", "Het jaartal staat rond de sluitsteen: 16..."],
          solution: "Adriaan Brouwerstraat 20, het Brouwershuis (Waterhuis), met 'ANNO 1655'.",
          explanation: [
            "Dit poortje hoorde niet bij het Waterhuis. Smekens vertelt dat het van een oude brouwerij kwam en in het bezit was van de heer W. Pouillon uit Kalmthout, tot het stadsbestuur in de collegezitting van 30 maart 1922 besliste het te kopen, voor 1000 frank, en het tegen de ingang van het Waterhuis te plaatsen. De Inventaris bevestigt: 'overgebracht in 1922'.",
          ],
        },
        {
          plate: 39,
          question: "Een poort met een waaier, een roos en een opschrift.",
          hints: ["Lees het lint bovenaan de tekening.", "Het is het hoogste huisnummer van de vier."],
          solution: "Adriaan Brouwerstraat 29, 'In de Roose'.",
          explanation: [
            "Smekens: 'Met waaier en roosmotief en het opschrift In de roose. Behoorde bij de brouwerij De roode roos.' Volgens de Inventaris liet brouwer De Bridt het huis bouwen naar ontwerp van architect Jan Pieter van Baurscheit de Jonge: rekeningen dateren zijn ontwerp in 1738 en de voltooiing in 1743. Smekens noemt de stijl Louis XIV, de Inventaris Régence.",
          ],
        },
      ],
      outro: "Alle vier nog op hun plek, of toch bijna: één van de vier is zelf een verhuisde poort. Welke? Juist, die van het Brouwershuis.",
    },
    sections: [
      {
        heading: "De straat van Van Schoonbeke",
        kind: "history",
        paragraphs: [
          "De straat werd rond 1550 aangelegd door Gilbert van Schoonbeke, toen hij de Nieuwstad ten noorden van de Brouwersvliet ontwikkelde. Rond 1553 bouwde hij hier ongeveer zestien brouwerijen. De straat heette achtereenvolgens 'Groote Middelstrate', 'Breestrate' en vanaf 1694 'Brouwersstraat'. In 1936 kreeg ze haar huidige naam, naar de schilder Adriaan Brouwer (ca. 1606-1638).",
        ],
      },
      {
        heading: "Het Brouwershuis",
        kind: "history",
        paragraphs: [
          "Op nummer 20 staat het Brouwershuis of Waterhuis, in 1553-1554 door Van Schoonbeke gebouwd voor de watervoorziening. Een paardgedreven waterrad pompte water uit de Herentalse vaart en verdeelde het naar de brouwerijen, tot omstreeks 1930. Het huis was sinds 1561 van de stad en werd in 1582 het gildehuis van het brouwersambacht. In 1933 opende het als museum; in 1956-1961 werd het gerestaureerd.",
        ],
      },
    ],
    glossary: ["mascaron", "sluitsteen", "waaier"],
    didYouKnow: [
      "Drie poorten uit het boek die elders in de stad staan of stonden, kwamen uit deze straat: het verdwenen poortje van de Zilversmidstraat (brouwerij De Trouw), de omlijsting van brouwerij Van Pruyssen in de academietuin, en volgens Smekens vermoedelijk ook het poortje van het Brouwershuis zelf.",
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Het Brouwershuis bezoeken",
        paragraphs: [
          "Het Brouwershuis ging in mei 2024 na dertig jaar opnieuw open voor publiek (VRT NWS). De actuele openingsuren hebben we niet gecontroleerd. [Te verifiëren]",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.vrt.be/vrtnws/nl/2024/05/07/brouwershuis-in-antwerpen-na-30-jaar-weer-open-voor-publiek/",
      },
    ],
    transitionToNext: "Nog een paar honderd meter. Voor je rijst een hoge toren op: het MAS, het einde van de wandeling.",
  },

  // ── Einde: MAS ───────────────────────────────────────────────────────
  "poortjes-mas": {
    name: "MAS",
    subtitle: "Van één poort naar de hele wereld",
    introduction: [
      "Je staat aan de voet van het MAS, het Museum aan de Stroom: een toren van zestig meter tussen de oude dokken. Kijk naar boven. Straks kun je, als het gebouw open is, helemaal naar het dak.",
      "Deze wandeling begon bij een klein deurtje in de gevel van een klooster. Ze eindigt bij een museum dat het grote verhaal vertelt: van Antwerpen, de haven en de wereld.",
    ],
    sections: [
      {
        heading: "Het MAS",
        kind: "history",
        paragraphs: [
          "MAS staat voor Museum aan de Stroom. Het werd ontworpen door Neutelings Riedijk Architecten, die in 1999 de internationale wedstrijd wonnen, en opende op 14 mei 2011. De toren is 60 meter hoog. Het museum beheert ongeveer 600.000 objecten over de band tussen Antwerpen en de wereld.",
          "Het gebouw staat op de plek van het Hanzehuis of Oosterlingenhuis, een 16de-eeuws pakhuis van de Hanzekooplieden, ontworpen door Cornelis Floris de Vriendt. Dat is dezelfde architect als het stadhuis op de Grote Markt.",
        ],
      },
      {
        heading: "Het Eilandje",
        kind: "history",
        paragraphs: [
          "Deze buurt maakte deel uit van de Nieuwstad die Gilbert van Schoonbeke in de 16de eeuw aanlegde, met binnenhavens als de Brouwersvliet. De naam 'Eilandje' ontstond in 1869, toen door het graven van het Verbindingsdok de woonwijk volledig door water omringd raakte.",
          "Toen de haven naar het noorden trok, raakte het gebied in verval. Vanaf de jaren 1980 werden de dokken en pakhuizen stap voor stap omgevormd tot een woon- en museumbuurt.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Naar boven",
        paragraphs: [
          "De wandelboulevard met roltrappen en het panorama op het dak zijn gratis toegankelijk tijdens de openingsuren van het gebouw: van dinsdag tot zondag van 9.30 tot 22 uur, en van 1 april tot 31 oktober tot middernacht (laatste toegang 23.30 uur). Op maandag gesloten (behalve paas- en pinkstermaandag), en op 1 januari, 1 mei en 25 december; op 24 en 31 december tot 15 uur. Bij slecht weer kan het panorama tijdelijk dicht zijn.",
          "Voor de museumzalen heb je een ticket nodig. Ze zijn open van dinsdag tot zondag, van 10 tot 17 uur (laatste toegang 16 uur).",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://mas.be/en/page/how-when-get-here",
      },
    ],
    didYouKnow: [
      "Op het plein voor het MAS ligt een mozaïek van 1.600 m² van kunstenaar Luc Tuymans, met als titel 'Dead Skull'.",
    ],
    lookAt: [
      {
        title: "Van boven",
        body: "Zoek op het dak de torenspits van de kathedraal. Ergens daartussen, in de smalle straten, liggen de poorten die je vandaag zag.",
      },
    ],
    closing: {
      timeline: [
        "Rosier: een kloosterdeur met een heilige",
        "Hoogstraat: huisnamen van vóór de huisnummers",
        "Grote Markt: gilden en een reus",
        "Gildekamersstraat: jaartallen in de steen",
        "Handelsbeurs: geld en wereldhandel",
        "Academie: poorten zonder huis",
        "Brouwersstraat: brouwers en water",
        "MAS: de haven en de wereld",
      ],
      finalLines: [
        "Je bent vandaag langs vijftig poorten gewandeld. Sommige stonden er nog, sommige waren verhuisd, en sommige ken je alleen nog van een tekening uit 1951.",
        "Paul Smekens mat ze op tot op de centimeter, omdat hij wist dat een stad verandert.",
        "Kijk voortaan eens naar de deuren.",
      ],
    },
  },

  // ── Optioneel: Red Star Line ─────────────────────────────────────────
  "poortjes-red-star-line": {
    name: "Red Star Line Museum",
    subtitle: "Extra: de reis naar Amerika",
    introduction: [
      "Nog niet uitgewandeld? Hier, in de oude gebouwen van de rederij Red Star Line, begon voor miljoenen Europeanen de reis naar een nieuw leven.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "De Red Star Line was meer dan een halve eeuw actief op het Eilandje. Volgens het museum vertrokken tussen 1873 en 1934 meer dan twee miljoen emigranten met haar schepen uit Europa naar Noord-Amerika, op zoek naar een nieuw begin.",
          "Het museum staat 'op de authentieke plek van de historische rederij' en vertelt 'een universeel verhaal van hoop, dromen en de zoektocht naar geluk, gebaseerd op persoonlijke verhalen van 20ste-eeuwse emigranten'. Het opende in 2013.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Bezoek",
        paragraphs: [
          "Montevideostraat 3. Open van dinsdag tot zondag, 10 tot 17 uur; gesloten op maandag, behalve paas- en pinkstermaandag. Voor het museum heb je een ticket nodig: controleer de actuele prijzen op de website van het museum.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://redstarline.be/en/content/museum",
      },
    ],
    didYouKnow: [
      "Ook dit verhaal begint en eindigt bij een deur: die van de Europese thuis die de emigranten achterlieten, en die van hun nieuwe land.",
    ],
  },
};
