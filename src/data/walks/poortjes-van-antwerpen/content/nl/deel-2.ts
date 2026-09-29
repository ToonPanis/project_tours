import type { PoortjesStopText } from "../types";

/**
 * Deel 2: Kathedraal & Oude Stad (poorten 10–23, historische tussenstops).
 * Grote Markt, Stadhuis, Brabo en kathedraal: feiten zoals nagekeken voor
 * Classics of Antwerp (zie stops.ts voor de bronnen).
 */
export const deel2: Record<string, PoortjesStopText> = {
  // ── Pauze + kaarten ──────────────────────────────────────────────────
  "poortjes-grote-markt": {
    name: "Grote Markt: pauze in Rococo",
    subtitle: "Even zitten in het hart van de stad",
    introduction: [
      "Tijd voor een pauze. Je bent op de Grote Markt, en aan het plein ligt café Rococo. Neem er plaats als je wil, of ga op een bank of trap zitten: je hoeft niets te bestellen om verder te gaan.",
      "Terwijl je uitrust, kun je hieronder drie korte verhalen lezen: over het plein, het stadhuis en de fontein. Kijk tussendoor op: alles waar ze over gaan, staat voor je neus.",
    ],
    sections: [],
    infoBoxes: [
      {
        kind: "pause",
        title: "Pauzemoment",
        paragraphs: [
          "Deze pauze is een suggestie, geen verplichting. De wandeling gaat gewoon verder, of je nu iets bestelt of niet.",
          "Wie iets drinkt, kiest zelf wat: met of zonder alcohol. De openingsuren van Rococo hebben we niet gecontroleerd; is het café dicht of vol, dan is elk terras of elke bank op het plein even goed.",
        ],
      },
    ],
    cards: [
      {
        id: "card-grote-markt",
        title: "De Grote Markt",
        subtitle: "Het plein van de ambachten",
        imageId: "grote-markt-1905",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Rond het plein staan hoge gildehuizen met trap- en krulgevels, bekroond met vergulde figuren. De gilden en ambachten waren de verenigingen van handwerkers en handelaars. Zij regelden veel van het stadsleven: wie mocht werken, wat verkocht mocht worden en tegen welke kwaliteit. Hun huizen hier waren hun visitekaartje.",
              "In november 1576 plunderden muitende Spaanse soldaten de stad. De brand die ze aanstaken verwoestte de huizen aan het plein. Het mooiste voorbeeld van wat daarna herrees, is het huis van de Oude Voetboog, de gilde van Sint-Joris: gebouwd in 1515-1516, verwoest in 1576 en in renaissancestijl herbouwd in 1580-1582.",
            ],
          },
          {
            heading: "Jonger dan het lijkt",
            kind: "history",
            paragraphs: [
              "Veel van wat je ziet, is jonger dan het lijkt. In 1895 liet een burger, R. Joostens, geld na om de vroegere pracht van de Grote Markt te herstellen. Van eind 19de tot begin 20ste eeuw werden de gevels aan de noordkant, en nummer 44 aan de zuidkant, vrij gereconstrueerd en verfraaid in de geest van de 16de eeuw.",
            ],
          },
        ],
        didYouKnow: [
          "Zoek bovenop de gevel van de Oude Voetboog de gouden Sint-Joris te paard, in gevecht met de draak.",
        ],
      },
      {
        id: "card-stadhuis",
        title: "Het Stadhuis",
        subtitle: "In trots gebouwd, in woede verbrand",
        imageId: "stadhuis-1866",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Het stadhuis werd gebouwd tussen 1561 en 1565, naar ontwerp van Cornelis Floris de Vriendt, samen met andere architecten en kunstenaars. Antwerpen was toen een van de rijkste steden van Europa en wilde dat laten zien.",
              "Kijk naar de lange, rustige vleugels en naar het rijk versierde middenstuk dat boven de daklijn uitsteekt, vol zuilen, nissen en beelden. Dat contrast tussen kalm en ordelijk met een uitbarsting van versiering in het midden is typisch voor de renaissance die Floris naar Antwerpen bracht.",
            ],
          },
          {
            heading: "De Spaanse Furie",
            kind: "history",
            paragraphs: [
              "Op 4 november 1576 bestormden muitende Spaanse troepen, die al lang niet meer betaald waren, de stad. Het stadsbestuur organiseerde vanuit dit stadhuis een tegenaanval. De soldaten staken het gebouw in brand; alleen de buitenmuren bleven overeind. Hoeveel mensen stierven, is niet precies bekend. Schattingen lopen van enkele honderden tot rond de 8.000.",
            ],
          },
        ],
      },
      {
        id: "card-brabo",
        title: "De Brabofontein",
        subtitle: "Een reus, een hand en de naam van een stad",
        imageId: "brabo-photochrom",
        sections: [
          {
            heading: "De legende",
            kind: "legend",
            paragraphs: [
              "Lang geleden, zo gaat het verhaal, woonde aan de Schelde een reus, Druon Antigoon. Van elk schip dat voorbij wilde, eiste hij tol. Wie niet betaalde, verloor een hand, en de reus wierp die in de rivier.",
              "Tot de jonge Romeinse soldaat Silvius Brabo hem uitdaagde, versloeg, de hand van de reus afhakte en die in de Schelde gooide. Zo kreeg de stad haar naam, zegt de legende: 'hand werpen', Antwerpen.",
            ],
          },
          {
            heading: "Wat historici denken",
            kind: "interpretation",
            paragraphs: [
              "Een prachtig verhaal, maar geen verklaring die historici ernstig nemen. De herkomst van de naam Antwerpen is onzeker. De meeste verklaringen verbinden hem niet met handen maar met land: met grond langs de rivier, een stuk land 'ervoor', opgeworpen door het water. De legende is een veel latere poging om een naam te verklaren waarvan de echte oorsprong vergeten was.",
            ],
          },
          {
            heading: "Het beeld",
            kind: "history",
            paragraphs: [
              "De fontein is van de Antwerpse beeldhouwer Jef Lambeaux, die zijn ontwerp in 1883 grotendeels klaar had. Ze kwam in 1887 op de Grote Markt, voor het stadhuis, in een tijd dat Antwerpen graag zijn eigen geschiedenis en identiteit vierde. Brabo staat bovenop een rotsachtige sokkel en gooit de hand weg.",
            ],
          },
        ],
        didYouKnow: [
          "De handen uit de legende zie je overal in Antwerpen: in het stadswapen (een burcht met twee handen erboven) en in de chocolade- en koekjeshandjes in de winkels rond het plein.",
        ],
      },
    ],
    didYouKnow: [],
    thenAndNow: [
      "Vergelijk de foto van rond 1905 met het plein van vandaag. De reconstructie van de gevels was toen volop bezig.",
    ],
    transitionToNext: "Uitgerust? Loop naar de kathedraal, een paar straten verder. Haar toren zie je al boven de daken.",
  },

  // ── Kathedraal ────────────────────────────────────────────────────────
  "poortjes-kathedraal": {
    name: "Onze-Lieve-Vrouwekathedraal",
    subtitle: "Anderhalve toren en 170 jaar bouwen",
    introduction: [
      "Voor je staat een van de grootste gotische kerken van de Lage Landen. Eeuwenlang was haar noordertoren, zo'n 123 meter hoog, het eerste wat schippers op de Schelde van Antwerpen zagen.",
      "Kijk eerst naar de voorgevel. De linkertoren loopt door tot een sierlijke spits, de rechtertoren stopt op ongeveer een derde van die hoogte. Er waren twee grote torens gepland; maar één werd voltooid.",
    ],
    sections: [
      {
        heading: "Generaties bouwers",
        kind: "history",
        paragraphs: [
          "De kathedraal werd ongeveer 170 jaar lang gebouwd, van het midden van de 14de eeuw tot 1521, door generaties bouwlieden die wisten dat ze het resultaat nooit af zouden zien.",
          "In 1521, net toen de kerk af was, besliste Antwerpen dat ze niet groot genoeg was. Domien de Waghemakere en Rombout Keldermans ontwierpen een reusachtige uitbreiding van het koor: het Nieuwerck. Op 15 juli 1521 legde de jonge keizer Karel V zelf de eerste steen. Maar in 1533 beschadigde een grote brand de kerk, al het geld ging naar herstel, en in 1537 werd het Nieuwerck definitief opgegeven.",
        ],
      },
      {
        heading: "Stormen van de geschiedenis",
        kind: "history",
        paragraphs: [
          "Tijdens de Beeldenstorm van 1566, een golf van protestantse woede tegen beelden, werd veel van het interieur vernield. Twee eeuwen later bezetten Franse revolutionaire troepen de stad, sloten ze de kerk en voerden ze haar schatten weg.",
          "Veel van wat je vandaag binnen ziet, werd nadien teruggebracht of hersteld, waaronder altaarstukken van Rubens. De bekendste zijn De Kruisoprichting en De Kruisafneming.",
        ],
      },
      {
        heading: "Een gotische kerk lezen",
        kind: "context",
        paragraphs: [
          "Gotiek herken je aan de spitsbogen, de hoge vensters en het streven naar hoogte en licht. De muren worden ontlast door steunberen, zodat er meer ruimte is voor glas. Kijk langs de zijgevels naar die zware pijlers tegen de muur en naar de spitsbogen van de vensters.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Binnen bekijken",
        paragraphs: [
          "Het interieur, met de schilderijen van Rubens, is te bezoeken met een betalend toegangsticket. Openingsuren wisselen door erediensten en feestdagen: controleer ze vooraf.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://visit.antwerpen.be/en/info/cathedral-of-our-lady",
      },
    ],
    didYouKnow: [
      "Het Nieuwerck werd nooit gebouwd, maar verdween ook niet helemaal. Zijn funderingen en pijlers zitten nog in de rij huizen rond het koor, tussen de Lijnwaadmarkt en de Groenplaats.",
    ],
    lookAt: [
      {
        title: "Anderhalve toren",
        body: "Vergelijk de voorgevel met de ets van Wenceslaus Hollar uit 1649 op deze pagina: het scheve silhouet met één afgewerkte toren was toen al hetzelfde.",
      },
    ],
    transitionToNext: "Loop terug over de Grote Markt en ga achter het stadhuis de Gildekamersstraat in. Daar wacht je eerste zoekopdracht.",
  },

  // ── Poorten 11 en 12: zoekopdracht ───────────────────────────────────
  "poortjes-gildekamersstraat": {
    name: "Gildekamersstraat",
    subtitle: "Zoekopdracht: welke deur is het?",
    introduction: [
      "De Gildekamersstraat is een smal straatje achter het stadhuis, vol deuren, poortjes en gevelstenen. Smekens tekende hier twee poorten. De vraag is: vind jij ze terug?",
    ],
    searchTask: {
      title: "Kun jij de poort van de tekening terugvinden?",
      intro: "Hieronder zie je twee tekeningen uit 1951. Loop langzaam door de straat en vergelijk: vorm van de boog, de sluitsteen, jaartallen, de versiering bovenaan. Neem je tijd, en gebruik de hints alleen als je vastzit.",
      hideStoryUntilDone: true,
      items: [
        {
          plate: 10,
          question: "Welke deur is dit?",
          hints: [
            "Kijk goed naar de sluitsteen bovenaan de boog: er staat een getal in.",
            "Het getal is een jaartal uit de 17de eeuw. Kijk bij de lagere huisnummers.",
          ],
          solution: "Gildekamersstraat 7, het huis De Swane.",
          explanation: [
            "Het jaartal 1631 staat volgens de Inventaris als 'A. 1631' op de poort. Het huis De Swane brandde af tijdens de Spaanse Furie van 1576 en werd in 1580-1581 herbouwd. In 1633 werd het gekocht voor het passementwerkersambacht, dat het als gildehuis gebruikte tot de Franse Revolutie. Passementwerkers maakten sierlinten, boorden en koorden.",
            "Smekens zegt dat het passementiersgilde hier 'op 't einde der 16de eeuw' zat; de Inventaris noemt 1633 voor de aankoop. Beide bronnen verbinden het huis dus met hetzelfde ambacht, maar niet met hetzelfde jaartal.",
          ],
        },
        {
          plate: 8,
          question: "En deze, met het raampje en de krullen erboven?",
          hints: [
            "Smekens schreef bij deze tekening 'Gildekamerstraat 9' en het jaartal 1612.",
            "Het huis heette 'Den rooden osch' of 'Den osch'. Kijk naar de huisnummers rond 8 en 9, en naar gevelankers met een jaartal.",
          ],
          solution: "Volgens Smekens: het huis Den (rooden) Osch, in 1951 nummer 9.",
          explanation: [
            "De Inventaris beschrijft vandaag 'Den Os' op nummer 8: een trapgevel die met muurankers op 1612 gedateerd is, met een rondboogdeur, een 'diamantpoortje' met diamantkopsleutel en -imposten.",
            "Eerlijk gezegd: de tekening van Smekens toont een rijkere poort, met een raampje met krullen erboven en versierde pilasters. We konden niet met zekerheid vaststellen of dat dezelfde deur is, of dat de poort sindsdien veranderd of verdwenen is. Wat heb jij gevonden? [Ter plaatse te verifiëren]",
          ],
        },
      ],
      outro: "Deze straat laat zien waarom het boek van Smekens zo waardevol is: huisnummers veranderen, deuren worden vervangen, maar een opmeting tot op de centimeter blijft.",
    },
    sections: [
      {
        heading: "Het verhaal van de straat",
        kind: "history",
        paragraphs: [
          "Den Os werd al in het eerste kwart van de 14de eeuw vermeld. Vanaf 1550 was het een accijnshuis, waar belastingen op goederen werden geïnd. Het brandde af tijdens de Spaanse Furie van 1576 en werd in 1612 door de familie De Groote opnieuw opgetrokken. In 1877 kocht de stad het, voor politiediensten; ook in De Swane vestigde de stad rond 1900 politiediensten.",
          "Smekens schrijft over Den Os dat het 'in die tijd reeds aangekocht door de Stad' was. Het stadhuis ligt letterlijk om de hoek: de stad breidde zich uit in de huizen erachter.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De poort van De Swane is volgens de Inventaris een barokke rondboogpoort in een geblokte omlijsting van blauwe hardsteen met het jaartal 'A. 1631', met een spiegelbogig beloop, neuten, imposten en een gegroefde sluitsteen onder een gekorniste waterlijst op voluten. De voor- en achtergevel werden rond 1953-1954 gereconstrueerd naar ontwerp van architect Gaston Laporte.",
        ],
      },
    ],
    glossary: ["diamantkop", "sluitsteen", "spiegelboog"],
    didYouKnow: [
      "Een accijnshuis zoals Den Os was een belastingkantoor. Belasting op goederen en handel komt op deze wandeling nog terug, bij de Stadswaag.",
    ],
    transitionToNext: "Loop door de poort naar het groene plein achter het stadhuis: het Leonie Glassplein.",
  },

  // ── Leonie Glassplein (+ verdwenen 13 en 14) ─────────────────────────
  "poortjes-leonie-glassplein": {
    name: "Leonie Glassplein",
    subtitle: "Een nieuwe tuin, twee verdwenen poorten",
    introduction: [
      "Je staat in een verrassend groen plein achter het stadhuis. Kijk naar de messing lijnen in de grond en de lagen in de beplanting: het ontwerp verwijst naar een open diamantmijn.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Het gebied achter het stadhuis was lange tijd grotendeels verhard en afgesloten. Het werd heraangelegd tot een publieke tuin, die op 26 november 2020 openging. Het ontwerp van bureau Stramien verwijst naar diamantmijnen: 'De gelaagdheid die de mijnen kenmerkt, is weergegeven met messing lijnen die het bestaande reliëf van het plein accentueren.'",
          "Het plein is genoemd naar Leonie Glass (1876-1961), een notabele uit de Antwerpse diamantgemeenschap. Ze was de echtgenote van diamanthandelaar Isidore Tolkowsky en de moeder van Marcel Tolkowsky, 'de man die de vorm van de moderne ronde briljant geslepen diamant bedacht'. Na de dood van haar man in 1931 emigreerde ze naar New York. Het plein vormt ook de binnentuin van DIVA, het museum voor diamant, juwelen en zilver.",
        ],
      },
      {
        heading: "Zilversmeden en verdwenen poorten",
        kind: "history",
        paragraphs: [
          "Het deel van het plein aan de Zilversmidstraat is altijd open. Aan die straat tekende Smekens twee poorten die vandaag verdwenen zijn: nummer 5, een poortje in Lodewijk XV-stijl, en nummer 17, een renaissancepoortje. Je vindt ze hieronder, bij de verdwenen poorten.",
          "Nummer 17 had zelf al een reis achter de rug. Volgens Smekens stond het oorspronkelijk tegen de gevel van brouwerij De Trouw, een van de brouwerijen die Gilbert van Schoonbeke in de 16de eeuw in de Brouwersstraat liet bouwen, en werd het rond 1880 bij de afbraak naar de Zilversmidstraat overgebracht.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Toegang",
        paragraphs: [
          "Het deel aan de Zilversmidstraat is altijd open. Het deel bij museum DIVA is alleen open tijdens de openingsuren van het museum. Staat de doorgang dicht, loop dan om via de Grote Markt en de Zilversmidstraat.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.agvespa.be/nieuws/iedereen-welkom-op-het-leonie-glassplein",
      },
    ],
    didYouKnow: [
      "De Brouwersstraat van Smekens bestaat nog, onder een andere naam: sinds 1936 heet ze Adriaan Brouwerstraat. Aan het einde van deze wandeling sta je er, met vier poorten die er wél nog staan.",
    ],
    transitionToNext: "Wandel via de Zilversmidstraat naar de Oude Beurs, de straat die haar naam dankt aan de allereerste beurs van Antwerpen.",
  },

  // ── Poort 20 (+ verdwenen 21) ────────────────────────────────────────
  "poortjes-oude-beurs": {
    name: "Oude Beurs 16: Den Spieghel",
    subtitle: "Een moeder, een kind en een spiegel",
    introduction: [
      "Zoek aan de Oude Beurs de rijk versierde barokke poort met een houten deur. Kijk in het halfronde deel boven de deur: daar zit een klein tafereel in hout gesneden.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Den Spieghel wordt al in het begin van de 14de eeuw vermeld. Het complex liep vroeger van de Grote Markt tot hier aan de Oude Beurs. In 1506 kocht koopman Peter Gielis het. Later waren stadstresorier Alexander van den Broeck-Vekemans en zijn zoon Jan-Alexander eigenaar; na 1650 notaris Bartholomeus Van den Berghe. Vanaf 1888 zat er een lagere meisjesschool.",
          "Smekens noemt Steven Butken uit Keulen als oorspronkelijke eigenaar en vertelt dat 'Alex van den Broeck (17de eeuw) het eigendom tot een soort van paleis' wilde verbouwen. Butken vonden we niet terug in de Inventaris. [Te verifiëren]",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft een rondboogpoort uit het derde kwart van de 17de eeuw 'in weelderige barokstijl' van blauwe hardsteen. De houten deur bevat 'een gebeeldhouwd reliëf in de waaier': 'een zittende, zogende vrouw met spiegel in de rechterhand omringd door putti'. Smekens: 'een neergezeten vrouw die in een spiegel kijkt terwijl haar kind zich in moeder spiegelt'.",
          "Het complex heeft ook een achthoekige huistoren van baksteen, waarschijnlijk van rond 1506, een van de oudste bewaarde huistorens van Antwerpen.",
        ],
      },
      {
        heading: "De eerste beurs van Antwerpen",
        kind: "history",
        paragraphs: [
          "De straat dankt haar naam aan de eerste beurs van de stad. Een houten 'oude borze' uit 1485 werd in 1515, onder leiding van Dominicus de Waghemakere, heropgebouwd met een laatgotische arcade van natuursteen, bij het huis 'den grooten Rhijn' aan de Hofstraat, om de hoek.",
          "De handel groeide zo snel dat de kooplieden rond 1526-1527 om meer ruimte vroegen. In 1531-1532 kwam er een nieuwe beurs tussen de Meir en de Lange Nieuwstraat, en in 1533 ging de oude dicht. Die nieuwe beurs, de Handelsbeurs, bezoeken we later op deze wandeling.",
        ],
      },
    ],
    glossary: ["barleef", "waaier"],
    thenAndNow: [
      "Toen: Smekens beschreef het tafereel van moeder en kind met de spiegel in één zin.",
      "Nu: het houtsnijwerk zit in de waaier boven de deur. Hoe goed is het bewaard? Zie je de putti (kleine engeltjes) rond de vrouw?",
    ],
    didYouKnow: [
      "'Den Spieghel' is een sprekende huisnaam: het houtsnijwerk boven de deur beeldt letterlijk een spiegel uit.",
    ],
    transitionToNext: "Wandel naar de Melkmarkt. Zoek er een huis met een gouden schoen.",
  },

  // ── Poort 15 ──────────────────────────────────────────────────────────
  "poortjes-melkmarkt": {
    name: "Melkmarkt 37",
    subtitle: "De Gulde Schoen",
    introduction: [
      "Zoek de poort met twee leeuwenkoppen en een cartouche met de naam van het huis: 'Gulde Schoen'. Het huis is vandaag een hotel; de poort is ouder dan alles eromheen.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Smekens schrijft kort: 'Hoorde toe aan het huis De gulden schoen.' Het huis zelf werd in de 19de eeuw fors aangepast: houthandelaar Willem Westlake liet in 1847 de gevel herleiden tot een regelmatig schema van vier traveeën, en in 1849 werd het puntdak vervangen door een extra verdieping. Sinds 2018 is het een hotel.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De poort is volgens de Inventaris een barokpoort uit het derde kwart van de 17de eeuw, met 'een rijk bewerkte omlijsting uit blauwe hardsteen', Ionische kapitelen, geblokte pilasters, gesneden leeuwenkoppen en een cartouche met het opschrift 'Gulde Schoen', bekroond door een gebroken voluutfronton. De ingangsomlijsting is sinds 1976 beschermd.",
        ],
      },
    ],
    glossary: ["fronton", "cartouche"],
    thenAndNow: [
      "Toen: in 1951 stond de poort in een gevel die al een eeuw eerder 'rechtgetrokken' was.",
      "Nu: de 17de-eeuwse poort is het oudste stuk van de gevel. Zoek op de tekening en in het echt de leeuwenkoppen.",
    ],
    didYouKnow: [
      "Een huisnaam als 'Gulde Schoen' kan naar een ambacht of een uithangbord verwijzen. Of hier ooit schoenmakers woonden, weten we niet.",
    ],
    transitionToNext: "Wandel naar de Wolstraat, waar twee poorten van het boek op amper honderd meter van elkaar staan.",
  },

  // ── Poort 16 ──────────────────────────────────────────────────────────
  "poortjes-wolstraat-7": {
    name: "Wolstraat 7",
    subtitle: "De Tennen Pot",
    introduction: [
      "Zoek de monumentale poort in een verder eenvoudige gepleisterde gevel. Boven de deur zit een ijzeren waaier met spijlen die als zonnestralen uitwaaieren.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "De Tennen Pot is een traditioneel diephuis dat teruggaat tot de tweede helft van de 16de eeuw. De naam verwijst naar een tinnen pot. In 1850 werden de kruiskozijnen verlaagd, in 1895 sloopte eigenaar Vochten de trapgevel en liet hij een mezzanine bouwen naar ontwerp van architect Eugène Dieltiëns. In 1921 tekenden Eugène en zijn zoon Jules Dieltiëns het winkelraam dat er nu nog zit.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft 'een monumentale rondboogpoort gevat in een omlijsting in plastische barok' uit het derde kwart van de 17de eeuw, in blauwe hardsteen, met een geprofileerde en geblokte rondboog, pilasters met een composiet kapiteel en een ijzeren waaier met radiaal patroon. Die waaier dateert pas van 1850.",
        ],
      },
    ],
    glossary: ["waaier", "kapiteel"],
    thenAndNow: [
      "Toen: in 1951 was de trapgevel al meer dan een halve eeuw verdwenen; alleen de poort herinnerde aan het 17de-eeuwse huis.",
      "Nu: zoek het verschil tussen de 17de-eeuwse steen en de 19de-eeuwse waaier.",
    ],
    didYouKnow: [
      "In deze ene gevel zitten drie tijden: een poort uit de 17de eeuw, een waaier uit 1850 en een winkelraam uit 1921.",
    ],
    transitionToNext: "Een eindje verder in dezelfde straat, op nummer 30, wacht een deur vol druiven en dolfijnen.",
  },

  // ── Poort 17 ──────────────────────────────────────────────────────────
  "poortjes-wolstraat-30": {
    name: "Wolstraat 30",
    subtitle: "Het Scilt van Londen",
    introduction: [
      "Deze keer is niet alleen de steen interessant, maar vooral de houten deur. Kijk naar het medaillon in het midden en naar de figuurtjes erboven.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Het Scilt van Londen is een traditioneel diephuis dat Smekens en de Inventaris allebei op 1625 dateren. In 1853 liet kuiper Pierre Van Hove het in neoclassicistische stijl aanpassen. Hoe de gevel er oorspronkelijk uitzag, weten we niet zeker.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft een 'markante rondboogdeur gevat in een barokke omlijsting uit blauwe hardsteen (beschilderd), te dateren in het derde kwart van de 17de eeuw'. Op de houten deur en luifel zitten reliëfs die naar de wijnhandel verwijzen: 'Het centrale medaillon stelt twee jeugdige bustes voor, vermoedelijk de wijngod Bacchus en zijn echtgenote Ariadne', met daarboven 'twee gespiegelde putti met druiventrossen gezeten op dolfijnen'.",
        ],
      },
      {
        heading: "Duquesnoy?",
        kind: "interpretation",
        paragraphs: [
          "Smekens schrijft dat de deur 'aan François Duquesnoy (1594-1642) toegeschreven' wordt; ook de Inventaris vermeldt die toeschrijving, met de levensdata 1597-1643. Een toeschrijving is geen bewijs. Bovendien dateert de Inventaris de omlijsting in het derde kwart van de 17de eeuw, na de dood van Duquesnoy. Het blijft dus een open vraag wie dit gemaakt heeft.",
        ],
      },
    ],
    glossary: ["barleef"],
    thenAndNow: [
      "Toen: Smekens tekende de deur met haar reliëfs; de omlijsting is volgens de Inventaris beschilderd.",
      "Nu: tel de dolfijnen en zoek de druiventrossen.",
    ],
    didYouKnow: [
      "De druiven, Bacchus en Ariadne verwijzen volgens de Inventaris naar de wijnhandel. Waarom het huis 'Het Scilt van Londen' heet, vonden we niet terug.",
    ],
    transitionToNext: "Loop naar de Jeruzalemstraat, een straatje dat Wolstraat en Oude Waag verbindt. Zoek er een klein poortje naast nummer 14.",
  },

  // ── Poort 10 (+ verdwenen 18 en 22) ──────────────────────────────────
  "poortjes-jeruzalemstraat": {
    name: "Jeruzalemstraat",
    subtitle: "Een poortje naar het Heilig Land",
    introduction: [
      "Zoek aan de kant van het hoekhuis met de Oude Waag een smal hardstenen poortje met een bovenlicht. Smekens schrijft: 'naast nr 14'.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Het poortje hoort bij het hoekhuis 'Jeruzalem' (Oude Waag 1-3), in 1564 vermeld als 'een hoekhuis met trapgevel genaamd Jeruzalem'. Het huis werd in 1837-1838 neoclassicistisch aangepast, in 1903 uitgebreid en in 1946 grondig verbouwd door architect Joseph De Paepe. Het poortje bleef gespaard.",
          "Smekens verklaart de naam 'als herinnering aan de eerste reizen van Antwerpen naar het Heilig Land'. De Inventaris geeft voor de naam geen verklaring. Zijn uitleg is dus een mogelijkheid, geen vaststaand feit.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft 'het barokpoortje uit blauwe hardsteen' uit de tweede helft van de 17de eeuw: een 'rondboogdeur met een geprofileerde, geblokte archivolt op bewerkte, geblokte pilasters' en een spiegelbogig bovenlicht met voluten en ranken. De ingangsomlijsting is sinds 1976 beschermd.",
        ],
      },
      {
        heading: "Waarom we hier nu staan",
        kind: "context",
        paragraphs: [
          "In de lijst van deze wandeling is dit poort 10, direct na de Suikerrui. Maar de Jeruzalemstraat ligt hier, tussen de Wolstraat en de Oude Waag, en niet bij de Suikerrui. Daarom bezoeken we ze nu, zonder heen en weer te lopen.",
        ],
      },
    ],
    glossary: ["archivolt"],
    didYouKnow: [
      "Twee andere poorten uit het boek lagen vlakbij en zijn verdwenen: aan de Grote Goddaard (huis De witte engel) en aan de Engelse Beurs, bij een kleine beurs die de stad volgens Smekens in 1550 voor Engelse kooplieden liet bouwen.",
    ],
    transitionToNext: "Wandel naar de Zwartzustersstraat. Het klooster daar is volop in verbouwing, maar het verhaal is er niet minder om.",
  },

  // ── Poort 19: in renovatie ───────────────────────────────────────────
  "poortjes-zwartzusters": {
    name: "Zwartzustersstraat 25",
    subtitle: "Zes eeuwen zorg achter één poort",
    introduction: [
      "Voor je staat de barokke poort van het Zwartzusterklooster. Het klooster wordt sinds eind 2025 gerenoveerd. Het kan dus dat je de poort vandaag achter een werfhek ziet, of dat ze tijdelijk ingepakt is.",
    ],
    sections: [
      {
        heading: "Wie waren de Zwartzusters?",
        kind: "history",
        paragraphs: [
          "De Zwartzusters volgden de regel van Sint-Augustinus. Ze vestigden zich in 1345 in Antwerpen, eerst in een gebouw aan de Koepoort, geschonken door 'Hendrik Suderman, een rijke Duitse koopman'. Smekens noemt hem 'H. Südermann'.",
          "Hun naam komt van hun kleding. Rond 1462 legden ze de kloostergelofte af en ruilden ze hun grijze pij voor een zwarte.",
        ],
      },
      {
        heading: "Zorg voor zieken",
        kind: "history",
        paragraphs: [
          "De zusters waren actief in de ziekenzorg. Onder het calvinistische stadsbestuur (1571-1585) bleven ze die taak uitoefenen, ondanks vervolging. Na 1585 genoten ze bescherming. In 1798 werden ze door de Franse overheid verdreven; in 1823 keerden ze terug. De laatste zusters vertrokken in 2014.",
        ],
      },
      {
        heading: "Het complex",
        kind: "history",
        paragraphs: [
          "Het klooster groeide in fasen: een nieuwe kapel in 1507, een woonvertrek voor de geestelijke bestuurder in 1520, een refter en slaapzaal in 1536. In 1608 werd de noordvleugel als ziekenhuis ingericht. In 1670-1678 werden de refter vergroot en het washuis en de keuken vernieuwd; de keuken werd 'geheel bekleed met Delftse tegels'.",
          "De kapel is een gotisch zaalkerkje uit het eerste kwart van de 16de eeuw met een houten spitsbooggewelf. De oost- en westvleugel werden in 1904 gebouwd naar ontwerp van Paul Van Glabbeek.",
        ],
      },
      {
        heading: "Architectuur van de poort",
        kind: "history",
        paragraphs: [
          "Smekens noemt dit een 'poort in Louis XIV'. De Inventaris beschrijft een barokke rondboogpoort in blauwe hardsteen uit het 'vierde kwart 17de of eerste kwart 18de eeuw'. De gebeeldhouwde makelaar met de Heilige Maagd, Ursula en Augustinus is van Leopold Van Esbroeck (1967), dus jonger dan de tekening.",
        ],
      },
      {
        heading: "Vandaag",
        kind: "history",
        paragraphs: [
          "Het klooster stond ongeveer tien jaar leeg. Eind 2025 startte de renovatie tot een cohousingproject met 41 woningen en gemeenschappelijke ruimtes, met een tuin van de Nederlandse tuinarchitect Piet Oudolf (VRT NWS, 29 oktober 2025). De werken zouden ongeveer twee jaar duren.",
        ],
      },
    ],
    glossary: ["makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Toen: de tekening is van rond 1950. De gebeeldhouwde makelaar met drie heiligen is volgens de Inventaris van 1967 en kan dus niet op de tekening staan.",
      "Nu: als de poort zichtbaar is, vergelijk dan de middenstijl met de tekening. Wat zat er in 1951 op die plek?",
    ],
    didYouKnow: [
      "De keuken van het klooster werd in de jaren 1670 volledig bekleed met Delftse tegels.",
    ],
    transitionToNext: "Wandel naar de Korte Nieuwstraat. Zoek er een kapel met een engel als sluitsteen.",
  },

  // ── Poort 23 ──────────────────────────────────────────────────────────
  "poortjes-korte-nieuwstraat": {
    name: "Korte Nieuwstraat 22",
    subtitle: "Een kapel voor zes oude vrouwen",
    introduction: [
      "Zoek de smalle zandstenen puntgevel met een barok portaal in donkere hardsteen. Kijk naar de sluitsteen: een engelenkopje met vleugels. Kijk dan naar de lege nis erboven.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Dit is de kapel van het Sint-Annagodshuis, gesticht in 1400 door Elisabeth, weduwe van Jan Hays, en Boudewijn de Riddere, als 'verblijf voor zes oude vrouwen'. De kapel ontstond datzelfde jaar en werd aan Sint-Anna gewijd. In 1540 namen de aalmoezeniers van de Armenkamer het beheer over.",
          "Tot 1963 woonden er bewoners. Daarna diende de kapel als werkplaats van beeldhouwer Frans Joris, als boekenmagazijn en als opslagplaats.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De kapel is een gotische zaalkerk met een barok portaal uit de 17de eeuw in blauwe hardsteen, met 'gelede imposten en een gevleugelde engelenkop als sluitsteen', 'geflankeerd door twee geringde zuilen'. In de nis erboven stonden oorspronkelijk beelden van Sint-Anna en Maria, die in de vroege 20ste eeuw verdwenen. Smekens schrijft hetzelfde: de figuren stonden er 'nog in 't begin der 20ste eeuw'. De kapel is beschermd sinds 1938.",
        ],
      },
    ],
    glossary: ["godshuis", "imposten"],
    thenAndNow: [
      "Toen: in 1951 was de nis al leeg. Smekens tekende de poort met haar engelenfiguren.",
      "Nu: de nis is nog steeds leeg. Zoek de gevleugelde engelenkop op de sluitsteen.",
    ],
    didYouKnow: [
      "Godshuizen waren een vroege vorm van sociale huisvesting: rijke burgers of ambachten stichtten ze voor ouderen of armen, vaak met een eigen kapel.",
    ],
    transitionToNext: "Einde van het tweede deel. Wandel naar de Handelsbeurs: van kloosters en gildehuizen naar geld en wereldhandel.",
  },
};
