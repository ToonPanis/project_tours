import type { PoortjesStopText } from "../types";

/**
 * Part 4: Falconplein & old port district (gates 42–50) and Part 5: MAS. German text.
 * Translated from ../en/deel-4.ts; keep the structure identical.
 */
export const deel4: Record<string, PoortjesStopText> = {
  // ── Gate 42 (+ vanished 43) ──────────────────────────────────────────
  "poortjes-falconplein": {
    name: "Falconplein 39: die Falconpoort",
    subtitle: "Das letzte Stück eines Klosters",
    introduction: [
      "Such am Falconplein ein großes Blausteintor, das in einen modernen Wohnblock eingebaut ist. Sieh dir die Kartusche oben an: Sie enthält einen lateinischen Text mit ein paar auffällig großen Buchstaben.",
    ],
    sections: [
      {
        heading: "Das Kloster der Falconschwestern",
        kind: "history",
        paragraphs: [
          "Die Falconpoort ist der einzige Überrest des Klosters der Falconschwestern. Gegründet wurde es im 14. Jahrhundert von Falco de Lampage, Münzmeister Herzog Johanns III. von Brabant; Smekens nennt ihn „den reichen Italiener Falco de Lampagne“. Im 15. Jahrhundert wuchs das Kloster beträchtlich, und Anfang des 16. Jahrhunderts nahm es einen ganzen Block zwischen der Oudeleeuwenrui, der Generaal Belliardstraat, der Falconrui und dem Falconplein ein.",
          "1784 wurde das Kloster von Kaiser Joseph II. aufgehoben. 1792 wurde es zum Militärlazarett und brannte ein Jahr später ab. Unter französischer Herrschaft wurde das Gelände 1810 an die Stadt verkauft; auf Befehl Napoleons entstand dort die Falconkaserne, die bis zu ihrem Abriss 1941 bestand. Smekens schreibt 1951: „nun ebenfalls abgerissen“.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Tor stammt von 1671: ein Rundbogen aus Blaustein, gerahmt von Pilastern mit Ringen und verzierten Kapitellen. Oben stand ursprünglich eine Statue des heiligen Augustinus, des Schutzpatrons des Klosters. Die Kartusche trägt die Inschrift „VerVs RegVLarIVM DoCtor“, „der wahre Lehrer der Regularkleriker“, ein Verweis auf Augustinus.",
          "Das Tor steht seit dem 22. Dezember 1943 unter Denkmalschutz.",
        ],
      },
      {
        heading: "Das alte Hafenviertel",
        kind: "context",
        paragraphs: [
          "Von hier an verändert sich die Stadt. Im 16. Jahrhundert legte Gilbert van Schoonbeke nördlich der Altstadt die „Nieuwstad“ (Neustadt) an, mit Häusern und drei inneren Hafenbecken: dem Brouwersvliet, dem Timmervliet und dem Middelvliet. Wo heute Straßen sind, war damals Wasser, und der Handel kam bis an die Häuser heran.",
        ],
      },
    ],
    glossary: ["chronogram", "kapiteel"],
    thenAndNow: [
      "Damals: Smekens zeichnete das Tor freistehend, mit der Inschrift in der Kartusche. Er schreibt in der Vergangenheit, oben habe eine Statue des Augustinus „stolz gestanden“.",
      "Heute: Das Tor steht in einem wiederaufgebauten Wohnblock. Laut Inventar erinnert eine Marienstatue aus dem 19. Jahrhundert mit Resten von Schmiedeeisen an die Arbeiterhäuser, die früher hinter dem Tor lagen.",
    ],
    didYouKnow: [
      "Die Inschrift ist ein Chronogramm. Zähl die großen Buchstaben zusammen, die zugleich römische Zahlzeichen sind: V (5) + V (5) + V (5) + L (50) + I (1) + V (5) + M (1000) + D (500) + C (100). Zusammen: 1671, das Baujahr des Tors.",
    ],
    lookAt: [
      {
        title: "Rechne selbst nach",
        body: "Such in der Kartusche die Buchstaben, die größer geschrieben sind als der Rest. Zähl sie als römische Zahlen zusammen. Kommst du auf 1671?",
      },
    ],
    transitionToNext: "Geh zur Oudeleeuwenrui. Such dort eine Hand im Stein.",
  },

  // ── Gate 45 (+ vanished 44) ──────────────────────────────────────────
  "poortjes-oudeleeuwenrui": {
    name: "Oudeleeuwenrui 58",
    subtitle: "De Gulden Handt (Die Goldene Hand)",
    introduction: [
      "Such ein barockes Tor, bekrönt von einem gesprengten Giebel und einer Kartusche. Sieh dir die Kartusche genau an: Sie enthält eine Hand und eine Jahreszahl.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Smekens: „Aus dem Jahr 1669, mit der Darstellung einer Hand. Überrest der Brauerei De gulden handt.“ Laut Inventar stammt das Tor tatsächlich aus der Brauerei De Gulden Handt und datiert von 1669.",
          "Warum das Tor hier steht, ist eine zweite Geschichte. Die Brennerei „Het Anker“ (Der Anker), angeblich seit 1753 in Betrieb, wurde um 1815 von Jean Meeùs übernommen. Sein Enkel Jules Meeûs verlegte das Unternehmen 1897 an die Oudeleeuwenrui, und dort wurde das alte Brauereitor in eine neue Fassade eingebaut.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Tor ist aus Blaustein gebaut: ein Rundbogen mit Volutenschlussstein auf „bossierten Pilastern mit Kapitellen“, in „einem Feld mit Spiegelbogen, Voluten und Tropfen“, bekrönt von einem gesprengten Giebel mit einer Kartusche, die die Hand und die Jahreszahl zeigt.",
        ],
      },
    ],
    glossary: ["fronton", "voluut"],
    thenAndNow: [
      "Damals: 1951 stand das Tor schon mehr als fünfzig Jahre hier, in der Fassade der Brennerei.",
      "Heute: Das Gebäude ist gut erhalten, doch in den 1950er-Jahren wichen das ursprüngliche Zwischengeschoss und die Satteldächer einem vollen zweiten Stockwerk. Vergleiche die Hand in der Kartusche mit der Zeichnung.",
    ],
    didYouKnow: [
      "Am nahen Hessenplein zeichnete Smekens ein Tor der Brauerei „De Bel“ (Die Schelle), „wie die runde Schelle im Kartuschenschlussstein bezeugt“. Eine Hausnummer nennt er nicht; das Tor ist verschwunden.",
    ],
    transitionToNext: "Geh zur Lange Noordstraat. Such dort eine Glocke in der Fassade.",
  },

  // ── Gate 46 ───────────────────────────────────────────────────────────
  "poortjes-lange-noordstraat": {
    name: "Lange Noordstraat 19",
    subtitle: "De Clocke: wo Maß und Gewicht geprüft wurden",
    introduction: [
      "Such ein breites, niedriges Haus mit einem schlichten Rundbogentor. Über dem Tor sitzt ein Fassadenstein mit einer Glocke im Flachrelief.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "De Clocke (Die Glocke) war eine ehemalige Ausspanne, in der Reisende Pferd und Wagen unterstellen konnten. Die älteste Erwähnung stammt von 1560. Im 19. Jahrhundert war es eine Schänke mit Tanzsaal; Smekens nennt es „eine belebte Schänke und einen Tanzsaal“.",
          "Nach dem Brand der Stadtwaage 1873 war hier vorübergehend das amtliche Eichamt untergebracht; es prüfte, ob die Gewichte und Maße der Händler stimmten. Smekens fasst sich kürzer: „Dort befand sich die amtliche Stelle zur Prüfung von Maßen und Gewichten.“",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Dieses traditionelle Breithaus stammt aus der zweiten Hälfte des 16. Jahrhunderts, mit vier Achsen und zwei Geschossen unter einem Satteldach. Das Tor ist „ein Rundbogentor in einer schlichten, bossierten Blausteinrahmung“ mit Kämpfern in Diamantquaderform. Der Fassadenstein zeigt „eine Glocke“ im Flachrelief. Smekens nennt es ein „Renaissancetor mit Flachrelief einer Glocke“.",
        ],
      },
    ],
    glossary: ["barleef", "diamantkop", "ijkdienst"],
    thenAndNow: [
      "Damals: Smekens zeichnete das Tor mit der Glocke als Fassadenstein.",
      "Heute: Das Haus ist erhalten. Such die Glocke, und such die Diamantquader an den Kämpfern.",
    ],
    didYouKnow: [
      "Die Glocke auf dem Fassadenstein macht den Namen des Hauses für jeden Vorübergehenden sichtbar, ganz ohne ein einziges Wort oder eine Zahl.",
    ],
    transitionToNext: "Geh zur Adriaan Brouwerstraat, der früheren Brouwersstraat (Brauerstraße). Dort wartet die letzte Suchaufgabe.",
  },

  // ── Gates 47–50: search task ─────────────────────────────────────────
  "poortjes-adriaan-brouwerstraat": {
    name: "Adriaan Brouwerstraat",
    subtitle: "Suchaufgabe: die Straße der Brauer",
    introduction: [
      "Diese Straße hieß früher Brouwersstraat (Brauerstraße). Smekens zeichnete hier vier Tore, und alle vier stehen noch. Geh langsam die Straße entlang und sieh dir die Fassaden an: Welche erkennst du wieder?",
    ],
    searchTask: {
      title: "Welche Tore erkennst du noch?",
      intro: "Vier Zeichnungen, vier Tore. Es ist kein Quiz: Schau, vergleiche und tippe auf „Gefunden“, wenn du eines erkennst. Kommst du nicht weiter, sieh dir einen Tipp oder die Lösung an.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 7,
          question: "Ein Tor mit Sternen. Wo ist es?",
          hints: ["Such eine Inschrift auf dem Schlussstein.", "Es sind niedrige Hausnummern."],
          solution: "Adriaan Brouwerstraat 5, von der Brauerei De Gulde Sterre (Der Goldene Stern).",
          explanation: [
            "Auf dem Schlussstein steht „GVLDE STER“. Smekens: „Das Sternmotiv erscheint auf den Seitenteilen. Gehörte zur Brauerei De gulden sterre. Dieses Motiv ruft den goldenen Stern wach, das Emblem der Brauer.“ Das Inventar datiert das Haus in die erste Hälfte des 17. Jahrhunderts.",
          ],
        },
        {
          plate: 29,
          question: "Ein strenges Tor mit Säulen und einem kleinen Fenster darüber.",
          hints: ["Sieh dir die Säulen an: In der Mitte sind sie etwas dicker.", "Das Haus steht an der Ecke zu einer anderen Straße."],
          solution: "Adriaan Brouwerstraat 17, an der Ecke zur Korte Zeevaartstraat.",
          explanation: [
            "Smekens: „Ein sehr streng klassischer Entwurf, diesmal ohne Schnörkel oder Voluten.“ Das Inventar beschreibt ein „frühbarockes Blausteinportal aus der ersten Hälfte des 17. Jahrhunderts“, mit einem Maskaron als Schlussstein, „Dreiviertelsäulen mit geschwellten Schäften“ und einem gesprengten Segmentgiebel mit rechteckigem Oberlicht. Die Gebäude wurden 2014–2015 restauriert.",
          ],
        },
        {
          plate: 20,
          question: "Ein Tor mit dem Emblem der Brauer und einer Jahreszahl.",
          hints: ["Such das älteste Gebäude der Straße.", "Die Jahreszahl steht rund um den Schlussstein: 16..."],
          solution: "Adriaan Brouwerstraat 20, das Brouwershuis (Brauerhaus oder Wasserhaus), mit „ANNO 1655“.",
          explanation: [
            "Dieses Portal gehörte nicht zum Wasserhaus. Smekens berichtet, es stamme aus einer alten Brauerei und habe Herrn W. Pouillon aus Kalmthout gehört, bis der Stadtrat in seiner Sitzung vom 30. März 1922 beschloss, es für 1.000 Franken zu kaufen und am Eingang des Wasserhauses anzubringen. Das Inventar bestätigt: „1922 hierher versetzt“.",
          ],
        },
        {
          plate: 39,
          question: "Ein Tor mit Fächer, Rose und Inschrift.",
          hints: ["Lies das Band oben auf der Zeichnung.", "Es ist die höchste Hausnummer der vier."],
          solution: "Adriaan Brouwerstraat 29, „In de Roose“ (In der Rose).",
          explanation: [
            "Smekens: „Mit Fächer- und Rosenmotiv und der Inschrift In de roose. Gehörte zur Brauerei De roode roos (Die Rote Rose).“ Laut Inventar ließ der Brauer De Bridt das Haus nach einem Entwurf des Architekten Jan Pieter van Baurscheit des Jüngeren bauen: Rechnungen datieren seinen Entwurf auf 1738 und die Fertigstellung auf 1743. Smekens nennt den Stil Louis XIV, das Inventar Régence.",
          ],
        },
      ],
      outro: "Alle vier noch an ihrem Platz, oder fast: Eines der vier ist selbst ein Tor, das umgezogen ist. Welches? Genau, das am Brouwershuis.",
    },
    sections: [
      {
        heading: "Van Schoonbekes Straße",
        kind: "history",
        paragraphs: [
          "Die Straße wurde um 1550 von Gilbert van Schoonbeke angelegt, als er die Nieuwstad nördlich des Brouwersvliet erschloss. Um 1553 baute er hier rund sechzehn Brauereien. Die Straße hieß nacheinander „Groote Middelstrate“, „Breestrate“ und ab 1694 „Brouwersstraat“. 1936 erhielt sie ihren heutigen Namen, nach dem Maler Adriaen Brouwer (um 1606–1638).",
        ],
      },
      {
        heading: "Das Brouwershuis",
        kind: "history",
        paragraphs: [
          "An Nummer 20 steht das Brouwershuis oder Waterhuis (Wasserhaus), 1553–1554 von Van Schoonbeke für die Wasserversorgung gebaut. Ein von Pferden angetriebenes Wasserrad pumpte Wasser aus dem Herentalser Kanal und verteilte es an die Brauereien, bis etwa 1930. Das Haus gehörte ab 1561 der Stadt und wurde 1582 zum Zunfthaus der Brauerzunft. 1933 öffnete es als Museum und wurde 1956–1961 restauriert.",
        ],
      },
    ],
    glossary: ["mascaron", "sluitsteen", "waaier"],
    didYouKnow: [
      "Drei Tore aus dem Buch, die anderswo in der Stadt stehen oder standen, kamen aus dieser Straße: das verschwundene Portal in der Zilversmidstraat (Brauerei De Trouw), die Rahmung der Brauerei Van Pruyssen im Akademiegarten und, laut Smekens, wahrscheinlich das Portal des Brouwershuis selbst.",
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Besuch des Brouwershuis",
        paragraphs: [
          "Das Brouwershuis ist seit Mai 2024 nach dreißig Jahren wieder für das Publikum geöffnet (VRT NWS). Die aktuellen Öffnungszeiten haben wir nicht geprüft. [Zu überprüfen]",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.vrt.be/vrtnws/nl/2024/05/07/brouwershuis-in-antwerpen-na-30-jaar-weer-open-voor-publiek/",
      },
    ],
    transitionToNext: "Nur noch ein paar hundert Meter. Vor dir ragt ein hoher Turm auf: das MAS, das Ende des Rundgangs.",
  },

  // ── End: MAS ─────────────────────────────────────────────────────────
  "poortjes-mas": {
    name: "MAS",
    subtitle: "Von einem Tor zur ganzen Welt",
    introduction: [
      "Du stehst am Fuß des MAS, des Museum aan de Stroom (Museum am Strom): ein sechzig Meter hoher Turm zwischen den alten Hafenbecken. Schau nach oben. Gleich kannst du, wenn das Gebäude geöffnet ist, bis ganz aufs Dach hinauf.",
      "Dieser Rundgang begann an einer kleinen Tür in der Fassade eines Klosters. Er endet an einem Museum, das die große Geschichte erzählt: von Antwerpen, dem Hafen und der Welt.",
    ],
    sections: [
      {
        heading: "Das MAS",
        kind: "history",
        paragraphs: [
          "MAS steht für Museum aan de Stroom. Entworfen wurde es von Neutelings Riedijk Architects, die 1999 den internationalen Wettbewerb gewannen, und eröffnet am 14. Mai 2011. Der Turm ist 60 Meter hoch. Das Museum verwaltet rund 600.000 Objekte über die Verbindungen zwischen Antwerpen und der Welt.",
          "Das Gebäude steht an der Stelle des Hanzehuis oder Oosterlingenhuis (Haus der Osterlinge), eines Lagerhauses der Hansekaufleute aus dem 16. Jahrhundert, entworfen von Cornelis Floris de Vriendt. Er ist derselbe Architekt, der das Rathaus am Grote Markt entwarf.",
        ],
      },
      {
        heading: "Das Eilandje",
        kind: "history",
        paragraphs: [
          "Dieses Viertel gehörte zur Nieuwstad, die Gilbert van Schoonbeke im 16. Jahrhundert anlegte, mit inneren Hafenbecken wie dem Brouwersvliet. Der Name „Eilandje“ (Inselchen) kam 1869 auf, als durch den Aushub des Verbindingsdok das Wohngebiet vollständig von Wasser umgeben war.",
          "Als der Hafen nach Norden zog, verfiel das Gebiet. Ab den 1980er-Jahren wurden die Hafenbecken und Lagerhäuser nach und nach zu einem Wohn- und Museumsviertel umgestaltet.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Nach oben",
        paragraphs: [
          "Der Wandelboulevard mit Rolltreppen und das Panorama auf dem Dach sind während der Öffnungszeiten des Gebäudes kostenlos: Dienstag bis Sonntag von 9.30 bis 22 Uhr, vom 1. April bis 31. Oktober bis Mitternacht (letzter Einlass 23.30 Uhr). Geschlossen montags (außer Ostermontag und Pfingstmontag) sowie am 1. Januar, 1. Mai und 25. Dezember; am 24. und 31. Dezember bis 15 Uhr. Bei schlechtem Wetter kann das Panorama vorübergehend geschlossen sein.",
          "Für die Museumssäle brauchst du ein Ticket. Sie sind Dienstag bis Sonntag von 10 bis 17 Uhr geöffnet (letzter Einlass 16 Uhr).",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://mas.be/en/page/how-when-get-here",
      },
    ],
    didYouKnow: [
      "Auf dem Platz vor dem MAS liegt ein 1.600 m² großes Mosaik des Künstlers Luc Tuymans mit dem Titel „Dead Skull“.",
    ],
    lookAt: [
      {
        title: "Von oben",
        body: "Such vom Dach aus die Turmspitze der Kathedrale. Irgendwo dazwischen, in den engen Straßen, liegen die Tore, die du heute gesehen hast.",
      },
    ],
    closing: {
      timeline: [
        "Rosier: eine Klosterpforte mit einem Heiligen",
        "Hoogstraat: Hausnamen aus der Zeit vor den Hausnummern",
        "Grote Markt: Zünfte und ein Riese",
        "Gildekamersstraat: in Stein gemeißelte Jahreszahlen",
        "Handelsbeurs: Geld und Welthandel",
        "Akademie: Tore ohne Haus",
        "Brouwersstraat: Brauer und Wasser",
        "MAS: der Hafen und die Welt",
      ],
      finalLines: [
        "Heute bist du an fünfzig Toren vorbeigegangen. Manche standen noch, manche waren umgezogen, und manche kennst du nur von einer Zeichnung aus dem Jahr 1951.",
        "Paul Smekens hat sie auf den Zentimeter genau vermessen, weil er wusste, dass sich eine Stadt verändert.",
        "Ab jetzt achte auf die Türen.",
      ],
    },
  },

  // ── Optional: Red Star Line ──────────────────────────────────────────
  "poortjes-red-star-line": {
    name: "Red Star Line Museum",
    subtitle: "Extra: die Reise nach Amerika",
    introduction: [
      "Noch nicht müde vom Laufen? Hier, in den alten Gebäuden der Reederei Red Star Line, begannen Millionen Europäer ihre Reise in ein neues Leben.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Die Red Star Line war mehr als ein halbes Jahrhundert lang am Eilandje tätig. Laut dem Museum verließen zwischen 1873 und 1934 mehr als zwei Millionen Auswanderer auf ihren Schiffen Europa in Richtung Nordamerika, auf der Suche nach einem Neuanfang.",
          "Das Museum steht „am authentischen Ort der historischen Reederei“ und erzählt „eine universelle Geschichte von Hoffnung, Träumen und der Suche nach dem Glück, anhand persönlicher Geschichten von Auswanderern des 20. Jahrhunderts“. Es öffnete 2013.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Besuch",
        paragraphs: [
          "Montevideostraat 3. Geöffnet Dienstag bis Sonntag, 10 bis 17 Uhr; montags geschlossen, außer Ostermontag und Pfingstmontag. Für das Museum brauchst du ein Ticket: Die aktuellen Preise findest du auf der Website des Museums.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://redstarline.be/en/content/museum",
      },
    ],
    didYouKnow: [
      "Auch diese Geschichte beginnt und endet an einer Tür: der des europäischen Zuhauses, das die Auswanderer zurückließen, und der ihres neuen Landes.",
    ],
  },
};
