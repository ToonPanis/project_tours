import type { PoortjesStopText } from "../types";

/**
 * Part 1: South side & Hoogstraat (gates 1–9). German text.
 * Translated from ../en/deel-1.ts; keep the structure identical.
 */
export const deel1: Record<string, PoortjesStopText> = {
  // ── Gate 1 ────────────────────────────────────────────────────────────
  "poortjes-rosier": {
    name: "Rosier 24",
    subtitle: "Eine Klosterpforte mit einem Heiligen im Medaillon",
    introduction: [
      "Du stehst vor der langen, geschlossenen Fassade eines Klosters. Such nicht zuerst das große Haupttor, sondern eine kleinere Tür mit einem ovalen Medaillon darüber. Genau so eine Tür zeichnete Paul Smekens hier um 1950: eine schlichte Tür in einer gebogenen Steinrahmung, bekrönt von einer Büste in einer ovalen Einfassung.",
      "Dies ist das erste von fünfzig Toren. 1951 veröffentlichte Smekens ein Buch mit 52 Bauaufnahmen alter Antwerpener Tore: Ansicht, Grundriss und Maßstab, auf den Zentimeter genau. Wir folgen seinen Spuren rund siebzig Jahre später. Manche Tore sind noch da, manche wurden versetzt, andere sind verschwunden.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Seit fast vier Jahrhunderten leben hinter dieser Fassade Karmelitinnen. Der Orden kam aus Spanien: 1612 traf Anna vom heiligen Bartholomäus mit zwei Mitschwestern in Antwerpen ein. Im September 1615 legten die Erzherzöge Albrecht und Isabella den Grundstein des neuen Klosters; die Kirche wurde zwischen 1636 und 1639 gebaut.",
          "1783 wurde das Kloster aufgehoben und als Kaserne und Heulager genutzt. 1801 konnten die Schwestern zurückkehren, und 1843 erhielten sie auch ihre Kirche zurück. 1951 schrieb Smekens schlicht: „Am Kloster der spanischen Theresianerinnen. In der Nische eine Statue des heiligen Josef.“ Mit „Theresianerinnen“ meint er die Karmelitinnen, den reformierten Orden Teresas von Ávila.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Laut dem flämischen Denkmalinventar (Inventaris Onroerend Erfgoed) besitzt die Vorderfassade ein bedeutendes barockes Tor von 1653: ein Rundbogentor in einer Blausteinrahmung mit Schlussstein, flankiert von Pilastern. In den Seitenmauern gibt es zudem Türen mit Segmentbogen und Büsten des heiligen Josef (rechts) und der heiligen Teresa (links), beide von 1856.",
          "Smekens' Zeichnung zeigt eine solche Tür: eine Rahmung mit Segmentbogen und breitem profiliertem Rand, ein vorspringendes Gesims und darüber die Büste in einem ovalen Medaillon. Unten zeigt der Grundriss, wie tief die Steinrahmung in der Mauer sitzt.",
        ],
      },
      {
        heading: "Renaissance oder Barock?",
        kind: "context",
        paragraphs: [
          "Unterwegs wird dir auffallen, dass Smekens viele Tore „Renaissancetore“ nennt, während das heutige Inventar sie meist ins 17. Jahrhundert datiert und „barock“ nennt. Das ist kein Widerspruch, den du lösen musst: Es sind zwei Arten, die Dinge zu benennen, eine von 1951 und eine aus unserer Zeit. In diesem Guide nennen wir beide und sagen immer, wer was sagt.",
          "Über Paul Smekens selbst haben wir bisher kaum verlässliche Informationen gefunden. [Historische Recherche erforderlich]",
        ],
      },
    ],
    glossary: ["spiegelboog", "pilaster", "sluitsteen", "hardsteen"],
    thenAndNow: [
      "Damals: Smekens zeichnete eine Tür mit einer Büste in einem ovalen Medaillon und nannte sie eine Statue des heiligen Josef.",
      "Heute: Vergleiche selbst. Ist die Büste noch da? Siehst du auf der anderen Seite auch die zweite Tür mit der heiligen Teresa, wie das Inventar sie beschreibt? Welche der beiden Türen ist die aus dem Buch?",
    ],
    didYouKnow: [
      "Die Büsten des heiligen Josef und der heiligen Teresa sind jünger als das Kloster: Das Inventar datiert sie auf 1856, mehr als zwei Jahrhunderte nach der Kirche.",
    ],
    lookAt: [
      {
        title: "Der Grundriss unter der Zeichnung",
        body: "Sieh dir den schmalen Streifen unter der Tür in der Zeichnung an: Es ist ein Schnitt durch die Mauer. Er zeigt, wie tief die Steinrahmung in der Fassade sitzt. Smekens zeichnete ihn für jedes Tor, und diese kleinen Pläne werden dir noch oft begegnen.",
      },
    ],
    transitionToNext: "Geh zur Lange Gasthuisstraat. In Nummer 37 wartet ein Tor mit Balkon auf dich, samt einem Detail, das laut Smekens nicht dorthin gehört.",
  },

  // ── Gate 2 ────────────────────────────────────────────────────────────
  "poortjes-lange-gasthuisstraat": {
    name: "Lange Gasthuisstraat 37",
    subtitle: "Das Stadthaus einer Abtei",
    introduction: [
      "Such das breite Tor mit dem kleinen schmiedeeisernen Balkon darüber. Schau dir zuerst die Rahmung des Tors selbst an: Steinblöcke, die abwechselnd vorspringen, und oben ein Schlussstein in Form einer Volute.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Jahrhundertelang war dieses Gebäude das „Refugium“ der Prämonstratenserabtei Tongerlo: ihr Stadthaus in Antwerpen, von 1535 bis 1581 und von 1585 bis 1699. Eine Abtei auf dem Land brauchte ein solches Haus, um in der Stadt Geschäfte zu erledigen, und als sichere Zuflucht in unruhigen Zeiten.",
          "Das Haus hatte einige bemerkenswerte Bewohner: Philipp von Marnix, Herr von Sint-Aldegonde, lebte hier 1583–1584 als einer der Bürgermeister der Stadt, später Bürgermeister Willem Andreas de Caters (1802–1831). Von 1699 bis 1724 gehörte es dem Bildhauer Hendrik Frans Verbruggen, der große Umbauten vornehmen ließ. 1941 entwarf der Architekt Max Winders die Restaurierung und die Zusammenlegung mit dem Nachbarhaus zu einem Bürogebäude.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt ein barockes Rundbogentor aus Blaustein aus dem 17. Jahrhundert, mit doppelt bossierter und profilierter Laibung, einem Volutenschlussstein, profilierten Kämpfern und Sockelsteinen. Breite Voluten leiten zu einem Wasserschlag über, der einen schmiedeeisernen französischen Balkon trägt. Die hölzerne Doppeltür hat Füllungen und einen geschnitzten Mittelpfosten.",
        ],
      },
      {
        heading: "Was Smekens auffiel",
        kind: "interpretation",
        paragraphs: [
          "Smekens nennt dies ein „Renaissancetor mit Balkon“ und macht eine scharfe Bemerkung: „Die Kartusche mit dem gemeißelten Frauenkopf im Louis-XV-Stil erscheint uns in diesem Renaissancetor apokryph.“ Mit anderen Worten: Er hielt den Frauenkopf für ein Werk aus einer späteren Zeit und einem anderen Stil als das Tor selbst. Ob er später hinzugefügt wurde, wissen wir nicht mit Sicherheit.",
        ],
      },
    ],
    glossary: ["refugiehuis", "geblokt", "voluut", "makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Damals: Smekens zeichnete ein Tor mit Balkon und einer Kartusche mit Frauenkopf.",
      "Heute: Such den Frauenkopf. Ist er noch da? Und passt er, wie Smekens fand, nicht zu den strengeren Blöcken des Tors?",
    ],
    didYouKnow: [
      "Philipp von Marnix von Sint-Aldegonde, der hier wohnte, wird oft als möglicher Verfasser des Wilhelmus genannt, der niederländischen Nationalhymne. Diese Urheberschaft ist allerdings nie mit Sicherheit bewiesen worden.",
    ],
    lookAt: [
      {
        title: "Zwei Stile, ein Tor",
        body: "Vergleiche die schweren, geraden Blöcke der Rahmung mit dem geschwungenen Schmuck oben. Erkennst du den Unterschied im Charakter, den Smekens meinte?",
      },
    ],
    transitionToNext: "Geh zur Everdijstraat. Dort stehen zwei Tore dicht beieinander, und eines davon gehörte einem Mann, der als „Wohltäter der Armen“ bekannt war.",
  },

  // ── Gates 3 and 4 ─────────────────────────────────────────────────────
  "poortjes-everdijstraat": {
    name: "Everdijstraat 45 und 31",
    subtitle: "Zwei Tore, ein Wohltäter",
    introduction: [
      "In dieser kurzen Straße stehen zwei Tore aus dem Buch nur ein paar Dutzend Meter voneinander entfernt. Beginne bei Nummer 45: ein Haus mit Treppengiebel und rechts einem monumentalen Tor. Geh dann weiter zu Nummer 31, dem Herrenhaus „Hagelsteen“.",
    ],
    sections: [
      {
        heading: "Nummer 45",
        kind: "history",
        paragraphs: [
          "Das Haus Nummer 45 geht auf die zweite Hälfte des 16. Jahrhunderts zurück; das Tor kam in der zweiten Hälfte des 17. Jahrhunderts hinzu. Das Inventar beschreibt „eine profilierte und bossierte Blausteinrahmung mit Schlussstein, auf gemeißelten ionischen Pilastern ruhend“, bekrönt von einem Wasserschlag mit Gesims auf einem schweren Zahnschnitt, flankiert von breiten Voluten mit Girlanden und Rosetten.",
          "Zu diesem Tor schreibt Smekens nur „Renaissancetor“. Über die ursprüngliche Funktion gerade dieses Tors ist wenig Sicheres bekannt.",
        ],
      },
      {
        heading: "Nummer 31: Hagelsteen",
        kind: "history",
        paragraphs: [
          "Das Herrenhaus Hagelsteen stammt aus dem späten 16. Jahrhundert. 1621 verkaufte die Familie Van Eeden es an Cornelis Lantschot (1572–1656), einen wohlhabenden Kaufmann. Smekens nennt ihn „den Wohltäter der Armen“. Laut Inventar ist das Tor ein barockes Blausteintor aus der zweiten Hälfte des 17. Jahrhunderts: ein bossierter Rundbogen mit breitem Volutenschlussstein auf ionischen Pilastern mit vertieften Schäften.",
          "Später veränderte sich das Haus stark: 1880 kam ein drittes Stockwerk hinzu, und um 1925 wurde die Fassade mit Zement verputzt. Hinter der Fassade liegt ein Innenhof aus dem ersten Viertel des 17. Jahrhunderts mit einer Arkade auf toskanischen Säulen.",
        ],
      },
    ],
    glossary: ["kapiteel", "waterlijst", "trapgevel"],
    thenAndNow: [
      "Damals: An Nummer 31 zeichnete Smekens ein „Renaissancetor mit Rahmung“. Veränderungen erwähnt das Buch nicht.",
      "Heute: Die Fassade von Nummer 31 wurde um 1925 verputzt. Schau, ob sich das Tor aus der Zeichnung noch so deutlich von der Fassade „abhebt“ wie damals, oder ob die neuere Fassade um es herumgewachsen ist.",
    ],
    didYouKnow: [
      "Cornelis Lantschot begegnet dir später auf diesem Rundgang wieder. Er gründete ein Armenhaus an der Falconrui; auch dort zeichnete Smekens ein kleines Portal, das inzwischen verschwunden ist.",
    ],
    lookAt: [
      {
        title: "Ionische Kapitelle",
        body: "Such oben an den Pilastern neben dem Tor nach den zwei kleinen Schnecken. Sie sind das Kennzeichen eines ionischen Kapitells. Beide Tore hier haben sie.",
      },
    ],
    transitionToNext: "Um die Ecke, in der Groendalstraat, steht ein Haus, in dem die Bäcker das Sagen hatten. Halte Ausschau nach nicht einem, sondern zwei kleinen Portalen.",
  },

  // ── Gate 5 ────────────────────────────────────────────────────────────
  "poortjes-groendalstraat": {
    name: "Groendalstraat 18-20",
    subtitle: "Das Haus der Bäcker",
    introduction: [
      "Such das niedrige Haus mit dem auffälligen Erdgeschoss aus Blaustein. Es hat zwei kleine Portale, jedes mit einem fächerförmigen Oberlicht. Smekens zeichnete eines davon.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Der Kern des Hauses Sint-Christoffel (Sankt Christophorus) stammt aus der Zeit 1562–1592. 1621 ging es an die Bäckerzunft, die Berufsvereinigung der Bäcker. Smekens schreibt, es sei „Eigentum des Dekans der Bäcker“ gewesen, des gewählten Vorstehers der Zunft.",
          "1672 erhielten die Eingänge ihre barocken Portale. Auch diese Jahreszahl nennt Smekens: „Stammt aus dem Jahr 1672.“",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt „barocke Blausteinportale mit fächerförmigem Oberlicht in bossierten Bogenrahmungen mit Volutenschlusssteinen“. Das ganze Erdgeschoss ist eine auffällige Ladenfront aus Blaustein. Das Obergeschoss ist aus Backstein und Sandstein in Bändern gebaut: waagerechte Streifen hellen Sandsteins im roten Mauerwerk.",
        ],
      },
    ],
    glossary: ["waaier", "bovenlicht"],
    thenAndNow: [
      "Damals: Smekens zeichnete eines der beiden Portale, mit seinem Oberlicht und dem Volutenschlussstein.",
      "Heute: Es gibt zwei. Welches ist das aus dem Buch? Achte auf die Details im Oberlicht und rund um den Schlussstein.",
    ],
    didYouKnow: [
      "Der heilige Christophorus ist der Heilige, der der Legende nach das Christuskind über einen Fluss trug. Viele Antwerpener Häuser trugen einen solchen Namen statt einer Hausnummer; Hausnummern kamen erst viel später.",
    ],
    transitionToNext: "Jetzt folgt ein längerer Weg nach Westen, Richtung Schelde, zur Kloosterstraat. Das Haus, das du dort siehst, trägt den Namen eines berühmten Mannes, der nie darin gewohnt hat.",
  },

  // ── Gate 6 ────────────────────────────────────────────────────────────
  "poortjes-kloosterstraat": {
    name: "Kloosterstraat 13",
    subtitle: "Das Haus mit dem falschen Namen",
    introduction: [
      "Vor dir liegt eine lange, niedrige Fassade, acht Fenster breit, aus weichem gelbem Sandstein. In der Mitte der Fassade sitzt ein kräftiges Blausteintor. Dahinter liegt ein Innenhof mit vier Flügeln.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Der Komplex stammt aus den Jahren 1547–1555, wie ein Datumsstein und Balkenköpfe zeigen. 1619 ließ sein Eigentümer Peter Paschier de Deckere große Umbauten vornehmen. 1698 ließ der Kaufmann Norberto Schut vom Architekten Hendrik Frans Verbruggen einen vierten, barocken Flügel anfügen. Darauf bezieht sich Smekens: „der Innenhof des Herrenhauses De Deckere, aus dem Jahr 1698“.",
          "Heute heißt das Haus Mercator-Orteliushuis. Schon 1951 hielt Smekens das für einen Irrtum: „Fälschlich genannt: das Haus des Abraham Ortelius.“ Das Inventar bestätigt es: Der berühmte Kartograf (1527–1598) wohnte in Nummer 43 dieser Straße, einem Haus, das 1937 abgerissen wurde.",
          "Das Gebäude verfiel, bis die Vereniging van Historische Woonsteden (Verein für historische Wohnstätten) es 1943 kaufte. 1946 wurde es unter Denkmalschutz gestellt, 1950 der Stadt geschenkt und 1952–1953 restauriert.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt das Straßentor als „barocke Türrahmung aus Blaustein aus dem 17. Jahrhundert: ein bossierter Rundbogen in einem profilierten Segmentbogen mit Sockelsteinen, Kämpfern, gemeißeltem Schlussstein und Wasserschlag“.",
        ],
      },
    ],
    glossary: ["neuten", "imposten", "rondboog"],
    thenAndNow: [
      "Damals: Smekens sah das Tor, als das Haus im Verfall begriffen war, kurz vor oder während der Restaurierung von 1952–1953.",
      "Heute: Achte auf den gelben Sandstein der Fassade und das dunkle Blau des Blausteins. Dieser Kontrast macht das Tor heute gut sichtbar.",
    ],
    didYouKnow: [
      "Ein Haus, das nach einer Berühmtheit benannt ist, die nie dort gewohnt hat, ist keine Antwerpener Ausnahme. Es zeigt vor allem, wie gern eine Stadt ihren großen Namen eine Adresse gibt.",
    ],
    transitionToNext: "Geh zurück ins Zentrum, zur Hoogstraat, einer der ältesten Straßen der Stadt. Dort liegen drei Tore aus dem Buch fast nebeneinander.",
  },

  // ── Gates 7 and 8 (+ plate 3) ─────────────────────────────────────────
  "poortjes-hoogstraat": {
    name: "Hoogstraat 15-21",
    subtitle: "Alte Hausnamen und eine versteckte Gasse",
    introduction: [
      "Du bist in der Hoogstraat, zwischen Treppengiebeln aus Sandstein. Auf diesen wenigen Metern zeichnete Smekens drei Tore: Nummer 15B („De Wolsack“, der Wollsack), Nummer 21 und, als Extra, Nummer 15. Schau dir die Erdgeschosse an: Die meisten sind heute Läden, doch zwischen den Schaufenstern haben sich alte Torrahmungen erhalten.",
    ],
    sections: [
      {
        heading: "Die Straße",
        kind: "history",
        paragraphs: [
          "Die Hoogstraat wird schon 1232 als „alta platea“ erwähnt und heißt seit 1305 Hoogstraat. Sie verband das Stadtzentrum mit dem Süden. 1443 zerstörte ein Brand fast alle ihre Gebäude. Im 16. Jahrhundert wurde hier mit Leinen gehandelt.",
        ],
      },
      {
        heading: "Häuser mit Namen",
        kind: "history",
        paragraphs: [
          "Über De Wolsack schreibt Smekens: „Dieses Haus wurde bereits 1461 erwähnt.“ Das Inventar beschreibt „Wolsack, Gulden Osch und Schilt van Mechelen“ als drei traditionelle Tiefhäuser aus der zweiten Hälfte des 16. Jahrhunderts, zusammen sieben Achsen breit, mit einer Fassade ganz aus Sandstein und drei Treppengiebeln. Das Tor ist ein Rundbogentor in einer barocken Blausteinrahmung von um 1650.",
          "Achtung: Das Inventar verortet diese Häuser heute in der Hoogstraat 15A, 17 und 17A. Die Hausnummern haben sich seit 1951 also geändert. Auch die Hausnamen wanderten: Das rechte Haus hieß 1561 „Lyntworm“, 1579 „Cleynen gulden Schilt“ und 1638 „Schilt van Mechelen“.",
        ],
      },
      {
        heading: "Nummer 21 und der Vlaaikensgang",
        kind: "history",
        paragraphs: [
          "Smekens nennt das Tor an Nummer 21 „streng klassisch, mit fantasievollen Triglyphen“. Ihm zufolge führte es zu „einem der sehr alten Grundstücke der Hoogstraat, De Lintworm (der Bandwurm) genannt“, mit „auch einem Ausgang am Vlaaikensgang des Koornmarkt“.",
          "Einen eigenen Inventareintrag für dieses Tor haben wir nicht gefunden. Ob es heute noch an Nummer 21 steht, muss vor Ort geprüft werden. [Vor Ort zu überprüfen]",
          "Laut Smekens war auch Nummer 15, „De grooten gulden scilt“ (der große goldene Schild), mit dem Vlaaikensgang verbunden. Das Inventar bestätigt eine historische Verbindung zwischen dem Vlaaikensgang und dem Haus Hoogstraat 15 seit 1561. Diese Gasse liegt hinter den Häusern und hat ihren Haupteingang an der Oude Koornmarkt.",
        ],
      },
      {
        heading: "Die Architektur von Nummer 15",
        kind: "history",
        paragraphs: [
          "Laut Inventar ist das Tor des „Grooten gulden Schilt“ (Hoogstraat 15) ein Korbbogentor in einer barocken Blausteinrahmung von um 1650, mit bossierter Laibung in einem Schulterbogen mit Beschlagwerk, Voluten und einer gemeißelten Kartusche mit leerem Wappenschild als Schlussstein. Die Holztür zeigt Reliefs der Jungfrau Maria, des Evangelisten Johannes, Elisabeths von Thüringen und eines Bettlers.",
        ],
      },
    ],
    glossary: ["triglief", "korfboog", "schouderboog", "cartouche", "diephuis"],
    thenAndNow: [
      "Damals: 1951 hatten diese Häuser andere Nummern als heute. Smekens' „15B“ ist nicht die heutige 15B.",
      "Heute: Halte die drei Zeichnungen neben die Fassaden. Welches Tor findest du, und unter welcher Hausnummer steht es heute?",
    ],
    didYouKnow: [
      "„Bandwurm“ klingt nach einem seltsamen Hausnamen, doch Antwerpener Hausnamen konnten fast alles sein: Tiere, Gegenstände, Heilige, Städte. Oft hingen sie auf einem Schild oder standen auf einem Giebelstein, lange bevor es Hausnummern gab.",
    ],
    lookAt: [
      {
        title: "Die Tür von Nummer 15",
        body: "Such die Holztür mit den geschnitzten Figuren. Entdeckst du eine Figur, die um Almosen bittet? Laut Inventar ist es ein Bettler neben der heiligen Elisabeth von Thüringen.",
      },
    ],
    transitionToNext: "Geh zur Suikerrui, der breiten Straße, die zur Schelde führt. Halte Ausschau nach einem goldenen Widder.",
  },

  // ── Gate 9 ────────────────────────────────────────────────────────────
  "poortjes-suikerrui": {
    name: "Suikerrui 22",
    subtitle: "De Gouden Ram (Der Goldene Widder)",
    introduction: [
      "Such an der Suikerrui das Tor mit einem vergoldeten Widder als Schlussstein. Schau dir dann den Rest der Rahmung an: Rosetten an den Pilastern und rund um den Bogen.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "De Gouden Ram ist ein Herrenhaus aus dem 17. Jahrhundert. 1823 eröffnete der niederländische Apotheker Klaas Jan Cupérus (1769–1851) hier eine Drogerie und einen Teehandel. Das Familienunternehmen Cupérus wurde ein bekannter Teehändler und nahm an den Weltausstellungen von 1885, 1894 und 1930 teil. 1926 zog das Geschäft an den Schoenmarkt.",
          "Im Inneren bewahrt das Haus ein japanisches Zimmer mit Lackpaneelen aus der Edo-Zeit, auf denen Drachen, Hähne, Vögel, Fische und Schmetterlinge zu sehen sind. Das Zimmer ist nicht öffentlich zugänglich.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt ein barockes Rundbogentor aus Blaustein, wahrscheinlich aus dem 17. Jahrhundert: „Die profilierte und bossierte Laibung mit Sockelsteinen, Ohren und gefugten Kämpfern wird durch Rosetten und eine Kartusche mit vergoldetem Widder als Schlussstein betont.“ Smekens fasst es zusammen: „Mit einem Widder auf einer Kartusche und Rosen an den Pilastern und den Bögen.“",
        ],
      },
    ],
    glossary: ["rondboog", "neuten"],
    thenAndNow: [
      "Damals: Smekens zeichnete den Widder in Schwarz-Weiß, als Teil des Steins.",
      "Heute: Der Widder ist vergoldet und fällt sofort ins Auge. Zähl die Rosetten: Sind es so viele wie auf der Zeichnung?",
    ],
    didYouKnow: [
      "Der Name „De Gouden Ram“ lebt heute im Geschäft im Gebäude weiter; die Teefirma Cupérus selbst zog schon 1926 an den Schoenmarkt.",
    ],
    transitionToNext: "Ende des ersten Teils. Geh zum Grote Markt: Zeit für eine Pause im Herzen der Stadt.",
  },
};
