import type { PoortjesStopText } from "../types";

/**
 * Part 2: Cathedral & Old Town (gates 10–23, historical stops). German text.
 * Translated from ../en/deel-2.ts; keep the structure identical.
 */
export const deel2: Record<string, PoortjesStopText> = {
  // ── Pause + cards ───────────────────────────────────────────────────
  "poortjes-grote-markt": {
    name: "Grote Markt: Pause im Rococo",
    subtitle: "Eine Rast im Herzen der Stadt",
    introduction: [
      "Zeit für eine Pause. Du bist auf dem Grote Markt, dem Hauptplatz Antwerpens, und das Café Rococo liegt am Platz. Setz dich hinein, wenn du magst, oder auf eine Bank oder eine Stufe: Du musst nichts bestellen, um weiterzumachen.",
      "Während du dich ausruhst, kannst du unten drei kurze Geschichten lesen: über den Platz, das Rathaus und den Brunnen. Schau ab und zu auf: Alles, was sie beschreiben, liegt direkt vor dir.",
    ],
    sections: [],
    infoBoxes: [
      {
        kind: "pause",
        title: "Zeit für eine Pause",
        paragraphs: [
          "Diese Pause ist ein Vorschlag, keine Pflicht. Der Rundgang geht einfach weiter, ob du etwas bestellst oder nicht.",
          "Wer etwas trinkt, wählt selbst: mit oder ohne Alkohol. Die Öffnungszeiten des Rococo haben wir nicht geprüft; ist das Café geschlossen oder voll, tut es jede Terrasse oder Bank am Platz genauso.",
        ],
      },
    ],
    cards: [
      {
        id: "card-grote-markt",
        title: "Der Grote Markt",
        subtitle: "Der Platz der Zünfte",
        imageId: "grote-markt-1905",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Rund um den Platz stehen hohe Zunfthäuser mit Treppen- und Volutengiebeln, gekrönt von vergoldeten Figuren. Die Zünfte waren die Vereinigungen der Handwerker und Händler. Sie regelten einen Großteil des städtischen Lebens: wer arbeiten durfte, was verkauft werden durfte und in welcher Qualität. Ihre Häuser hier waren ihre Visitenkarten.",
              "Im November 1576 plünderten meuternde spanische Soldaten die Stadt. Das Feuer, das sie legten, zerstörte die Häuser am Platz. Das schönste Beispiel für das, was danach neu entstand, ist das Haus des Oude Voetboog (Alte Armbrust), der Sankt-Georgs-Gilde: 1515–1516 gebaut, 1576 zerstört und 1580–1582 im Renaissancestil wiederaufgebaut.",
            ],
          },
          {
            heading: "Jünger, als es aussieht",
            kind: "history",
            paragraphs: [
              "Vieles von dem, was du siehst, ist jünger, als es aussieht. 1895 hinterließ ein Bürger, R. Joostens, Geld, um dem Grote Markt seinen einstigen Glanz zurückzugeben. Vom späten 19. bis ins frühe 20. Jahrhundert wurden die Fassaden auf der Nordseite sowie die Nummer 44 auf der Südseite frei im Geist des 16. Jahrhunderts rekonstruiert und verschönert.",
            ],
          },
        ],
        didYouKnow: [
          "Such oben auf der Fassade des Oude Voetboog den goldenen heiligen Georg, der hoch zu Ross gegen den Drachen kämpft.",
        ],
      },
      {
        id: "card-stadhuis",
        title: "Das Rathaus",
        subtitle: "Mit Stolz erbaut, in blinder Wut verbrannt",
        imageId: "stadhuis-1866",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Das Rathaus (Stadhuis) wurde zwischen 1561 und 1565 gebaut, entworfen von Cornelis Floris de Vriendt gemeinsam mit anderen Architekten und Künstlern. Antwerpen war damals eine der reichsten Städte Europas und wollte das zeigen.",
              "Sieh dir die langen, ruhigen Flügel an und den reich verzierten Mittelteil, der über die Dachlinie hinausragt, voller Säulen, Nischen und Statuen. Dieser Kontrast zwischen ruhiger Ordnung und einem Ausbruch an Schmuck in der Mitte ist typisch für die Renaissance, die Floris nach Antwerpen brachte.",
            ],
          },
          {
            heading: "Die Spanische Furie",
            kind: "history",
            paragraphs: [
              "Am 4. November 1576 stürmten meuternde spanische Truppen, die lange keinen Sold erhalten hatten, die Stadt. Die Stadtregierung organisierte von diesem Rathaus aus einen Gegenangriff. Die Soldaten steckten das Gebäude in Brand; nur die Außenmauern blieben stehen. Wie viele Menschen starben, ist nicht genau bekannt. Die Schätzungen reichen von mehreren Hundert bis zu etwa 8.000.",
            ],
          },
        ],
      },
      {
        id: "card-brabo",
        title: "Der Brabobrunnen",
        subtitle: "Ein Riese, eine Hand und der Name einer Stadt",
        imageId: "brabo-photochrom",
        sections: [
          {
            heading: "Die Sage",
            kind: "legend",
            paragraphs: [
              "Vor langer Zeit, so heißt es, lebte an der Schelde ein Riese namens Druon Antigoon. Er verlangte von jedem Schiff, das passieren wollte, einen Zoll. Wer nicht zahlte, verlor eine Hand, und der Riese warf sie in den Fluss.",
              "Bis der junge römische Soldat Silvius Brabo ihn herausforderte, besiegte, dem Riesen die Hand abschlug und sie in die Schelde warf. So, sagt die Sage, bekam die Stadt ihren Namen: „hand werpen“, eine Hand werfen: Antwerpen.",
            ],
          },
          {
            heading: "Was Historiker denken",
            kind: "interpretation",
            paragraphs: [
              "Eine wunderbare Geschichte, aber keine Erklärung, die Historiker ernst nehmen. Die Herkunft des Namens Antwerpen ist ungewiss. Die meisten Erklärungen bringen ihn nicht mit Händen in Verbindung, sondern mit Land: mit Boden am Fluss, einem Stück Land „davor“, vom Wasser angeschwemmt. Die Sage ist ein viel späterer Versuch, einen Namen zu erklären, dessen wahre Herkunft in Vergessenheit geraten war.",
            ],
          },
          {
            heading: "Die Statue",
            kind: "history",
            paragraphs: [
              "Der Brunnen stammt vom Antwerpener Bildhauer Jef Lambeaux, der seinen Entwurf 1883 weitgehend fertig hatte. 1887 wurde er auf dem Grote Markt vor dem Rathaus aufgestellt, zu einer Zeit, in der Antwerpen gern seine eigene Geschichte und Identität feierte. Brabo steht auf einem Felsensockel und wirft die Hand fort.",
            ],
          },
        ],
        didYouKnow: [
          "Die Hände aus der Sage siehst du überall in Antwerpen: im Stadtwappen (eine Burg mit zwei Händen darüber) und in den „Antwerpener Händen“ aus Schokolade und Gebäck in den Geschäften rund um den Platz.",
        ],
      },
    ],
    didYouKnow: [],
    thenAndNow: [
      "Vergleiche das Foto von um 1905 mit dem Platz heute. Die Rekonstruktion der Fassaden war damals in vollem Gang.",
    ],
    transitionToNext: "Ausgeruht? Geh zur Kathedrale, ein paar Straßen weiter. Ihren Turm siehst du schon über den Dächern.",
  },

  // ── Cathedral ────────────────────────────────────────────────────────
  "poortjes-kathedraal": {
    name: "Onze-Lieve-Vrouwekathedraal (Liebfrauenkathedrale)",
    subtitle: "Anderthalb Türme und 170 Jahre Bauzeit",
    introduction: [
      "Vor dir steht eine der größten gotischen Kirchen der Niederen Lande. Jahrhundertelang war ihr Nordturm, rund 123 Meter hoch, das Erste, was Seeleute auf der Schelde von Antwerpen sahen.",
      "Schau dir zuerst die Vorderseite an. Der linke Turm steigt bis zu einer eleganten Spitze auf; der rechte endet auf etwa einem Drittel dieser Höhe. Geplant waren zwei große Türme; nur einer wurde je vollendet.",
    ],
    sections: [
      {
        heading: "Generationen von Baumeistern",
        kind: "history",
        paragraphs: [
          "Die Kathedrale wurde über etwa 170 Jahre hinweg gebaut, von der Mitte des 14. Jahrhunderts bis 1521, von Generationen von Baumeistern, die wussten, dass sie ihre Vollendung nie erleben würden.",
          "1521, gerade als die Kirche fertig war, beschloss Antwerpen, dass sie nicht groß genug sei. Domien de Waghemakere und Rombout Keldermans entwarfen eine gigantische Erweiterung des Chors: das Nieuwerck. Am 15. Juli 1521 legte der junge Kaiser Karl V. persönlich den Grundstein. Doch 1533 beschädigte ein Großbrand die Kirche, alles Geld floss in die Reparaturen, und 1537 wurde das Nieuwerck endgültig aufgegeben.",
        ],
      },
      {
        heading: "Stürme der Geschichte",
        kind: "history",
        paragraphs: [
          "Beim Bildersturm von 1566, einer Welle protestantischer Wut gegen religiöse Bilder, wurde ein Großteil der Ausstattung zerstört. Zwei Jahrhunderte später besetzten französische Revolutionstruppen die Stadt, schlossen die Kirche und schafften ihre Schätze fort.",
          "Vieles von dem, was du heute drinnen siehst, wurde später zurückgebracht oder restauriert, darunter Altarbilder von Rubens. Die bekanntesten sind Die Kreuzaufrichtung und Die Kreuzabnahme.",
        ],
      },
      {
        heading: "Wie man eine gotische Kirche liest",
        kind: "context",
        paragraphs: [
          "Gotische Architektur erkennst du an Spitzbögen, hohen Fenstern und dem Streben nach Höhe und Licht. Die Mauern werden von Strebepfeilern gestützt, wodurch mehr Raum für Glas bleibt. Achte an den Seitenwänden auf diese schweren Pfeiler an der Mauer und auf die Spitzbögen der Fenster.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Besuch des Innenraums",
        paragraphs: [
          "Der Innenraum mit den Gemälden von Rubens kann mit einem kostenpflichtigen Eintrittsticket besichtigt werden. Die Öffnungszeiten wechseln wegen Gottesdiensten und Feiertagen: Informiere dich vor dem Besuch.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://visit.antwerpen.be/en/info/cathedral-of-our-lady",
      },
    ],
    didYouKnow: [
      "Das Nieuwerck wurde nie gebaut, verschwand aber auch nicht ganz. Seine Fundamente und Pfeiler haben in der Häuserreihe rund um den Chor überdauert, zwischen dem Lijnwaadmarkt und der Groenplaats.",
    ],
    lookAt: [
      {
        title: "Anderthalb Türme",
        body: "Vergleiche die Vorderseite mit der Radierung von Wenceslaus Hollar von 1649 auf dieser Seite: Die schiefe Silhouette mit einem einzigen vollendeten Turm war schon damals dieselbe.",
      },
    ],
    transitionToNext: "Geh zurück über den Grote Markt und bieg hinter dem Rathaus in die Gildekamersstraat ein. Dort wartet deine erste Suchaufgabe.",
  },

  // ── Gates 11 and 12: search task ─────────────────────────────────────
  "poortjes-gildekamersstraat": {
    name: "Gildekamersstraat",
    subtitle: "Suchaufgabe: Welche Tür ist es?",
    introduction: [
      "Die Gildekamersstraat (Zunftstubenstraße) ist eine schmale Straße hinter dem Rathaus, voller Türen, Portale und Giebelsteine. Smekens zeichnete hier zwei Tore. Die Frage ist: Findest du sie?",
    ],
    searchTask: {
      title: "Findest du das Tor aus der Zeichnung?",
      intro: "Unten siehst du zwei Zeichnungen von 1951. Geh langsam die Straße entlang und vergleiche: die Form des Bogens, den Schlussstein, Jahreszahlen, den Schmuck oben. Lass dir Zeit, und nutze die Tipps nur, wenn du nicht weiterkommst.",
      hideStoryUntilDone: true,
      items: [
        {
          plate: 10,
          question: "Welche Tür ist das?",
          hints: [
            "Sieh dir den Schlussstein oben im Bogen genau an: Darauf steht eine Zahl.",
            "Die Zahl ist eine Jahreszahl aus dem 17. Jahrhundert. Achte auf die niedrigeren Hausnummern.",
          ],
          solution: "Gildekamersstraat 7, das Haus De Swane (Der Schwan).",
          explanation: [
            "Laut Inventar steht auf dem Tor die Jahreszahl 1631 als „A. 1631“. Das Haus De Swane brannte während der Spanischen Furie von 1576 ab und wurde 1580–1581 wiederaufgebaut. 1633 wurde es für die Zunft der Posamentierer gekauft, die es bis zur Französischen Revolution als Zunfthaus nutzte. Posamentierer stellten Zierbänder, Borten und Kordeln her.",
            "Smekens sagt, die Posamentiererzunft sei „am Ende des 16. Jahrhunderts“ hier gewesen; das Inventar nennt 1633 für den Kauf. Beide Quellen verbinden das Haus also mit demselben Handwerk, aber nicht mit demselben Jahr.",
          ],
        },
        {
          plate: 8,
          question: "Und diese hier, mit dem Fensterchen und den Voluten darüber?",
          hints: [
            "Neben diese Zeichnung schrieb Smekens „Gildekamerstraat 9“ und die Jahreszahl 1612.",
            "Das Haus hieß „Den rooden osch“ oder „Den osch“ (der rote Ochse, der Ochse). Achte auf die Hausnummern um 8 und 9 und auf Maueranker, die eine Jahreszahl bilden.",
          ],
          solution: "Laut Smekens: das Haus Den (rooden) Osch, 1951 Nummer 9.",
          explanation: [
            "Heute beschreibt das Inventar „Den Os“ unter Nummer 8: ein Treppengiebel, durch seine Maueranker auf 1612 datiert, mit einer Rundbogentür, einem „Diamantportal“ mit Diamantquader als Schlussstein und Kämpfern.",
            "Ehrlich gesagt: Smekens' Zeichnung zeigt ein reicheres Portal, mit einem Fensterchen mit Voluten darüber und verzierten Pilastern. Ob es dieselbe Tür ist oder ob das Tor seither verändert wurde oder verschwunden ist, konnten wir nicht mit Sicherheit feststellen. Was hast du gefunden? [Vor Ort zu überprüfen]",
          ],
        },
      ],
      outro: "Diese Straße zeigt, warum Smekens' Buch so wertvoll ist: Hausnummern ändern sich, Türen werden ersetzt, doch eine Bauaufnahme auf den Zentimeter genau bleibt.",
    },
    sections: [
      {
        heading: "Die Geschichte der Straße",
        kind: "history",
        paragraphs: [
          "Den Os wurde schon im ersten Viertel des 14. Jahrhunderts erwähnt. Ab 1550 war es ein Akzisehaus, in dem Steuern auf Waren erhoben wurden. Während der Spanischen Furie von 1576 brannte es ab und wurde 1612 von der Familie De Groote wiederaufgebaut. 1877 kaufte die Stadt es für die Polizei; um 1900 brachte die Stadt auch in De Swane Polizeidienststellen unter.",
          "Über Den Os schreibt Smekens, es sei „damals bereits von der Stadt gekauft worden“. Das Rathaus liegt buchstäblich um die Ecke: Die Stadt dehnte sich in die Häuser dahinter aus.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Laut Inventar ist das Tor von De Swane ein barockes Rundbogentor in einer bossierten Blausteinrahmung mit der Jahreszahl „A. 1631“, mit einer Laibung im Segmentbogen, Sockelsteinen, Kämpfern und einem gerillten Schlussstein unter einem Wasserschlag mit Gesims auf Voluten. Vorder- und Rückfassade wurden um 1953–1954 nach einem Entwurf des Architekten Gaston Laporte rekonstruiert.",
        ],
      },
    ],
    glossary: ["diamantkop", "sluitsteen", "spiegelboog"],
    didYouKnow: [
      "Ein Akzisehaus wie Den Os war ein Steueramt. Steuern auf Waren und Handel begegnen dir später auf diesem Rundgang wieder, an der Stadswaag.",
    ],
    transitionToNext: "Geh durch das Tor zum grünen Platz hinter dem Rathaus: dem Leonie Glassplein.",
  },

  // ── Leonie Glassplein (+ vanished 13 and 14) ─────────────────────────
  "poortjes-leonie-glassplein": {
    name: "Leonie Glassplein",
    subtitle: "Ein neuer Garten, zwei verschwundene Tore",
    introduction: [
      "Du stehst auf einem überraschend grünen Platz hinter dem Rathaus. Achte auf die Messinglinien im Boden und die Schichten in der Bepflanzung: Die Gestaltung spielt auf eine offene Diamantenmine an.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Lange Zeit war das Gelände hinter dem Rathaus überwiegend gepflastert und abgeschlossen. Es wurde zu einem öffentlichen Garten umgestaltet, der am 26. November 2020 eröffnet wurde. Der Entwurf des Büros Stramien spielt auf Diamantenminen an: „Die Schichtung, die die Minen kennzeichnet, wird mit Messinglinien dargestellt, die das vorhandene Relief des Platzes betonen.“",
          "Der Platz ist nach Leonie Glass (1876–1961) benannt, einer bemerkenswerten Persönlichkeit der Antwerpener Diamantengemeinschaft. Sie war die Frau des Diamantenhändlers Isidore Tolkowsky und die Mutter von Marcel Tolkowsky, „dem Mann, der die Form des modernen runden Brillantschliffs erdachte“. Nach dem Tod ihres Mannes 1931 wanderte sie nach New York aus. Der Platz ist zugleich der Innengarten des DIVA, des Museums für Diamanten, Schmuck und Silber.",
        ],
      },
      {
        heading: "Silberschmiede und verschwundene Tore",
        kind: "history",
        paragraphs: [
          "Der Teil des Platzes an der Zilversmidstraat (Silberschmiedstraße) ist immer offen. In dieser Straße zeichnete Smekens zwei Tore, die inzwischen verschwunden sind: Nummer 5, ein kleines Portal im Louis-XV-Stil, und Nummer 17, ein kleines Renaissanceportal. Du findest sie unten bei den verschwundenen Toren.",
          "Nummer 17 war schon einmal umgezogen. Laut Smekens stand es ursprünglich an der Fassade der Brauerei De Trouw, einer der Brauereien, die Gilbert van Schoonbeke im 16. Jahrhundert in der Brouwersstraat baute, und wurde in die Zilversmidstraat versetzt, als dieses Gebäude um 1880 abgerissen wurde.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Zugang",
        paragraphs: [
          "Der Teil an der Zilversmidstraat ist immer offen. Der Teil beim DIVA-Museum ist nur während der Öffnungszeiten des Museums zugänglich. Ist der Durchgang geschlossen, geh außen herum über den Grote Markt und die Zilversmidstraat.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.agvespa.be/nieuws/iedereen-welkom-op-het-leonie-glassplein",
      },
    ],
    didYouKnow: [
      "Smekens' Brouwersstraat (Brauerstraße) gibt es noch, unter einem anderen Namen: Seit 1936 heißt sie Adriaan Brouwerstraat. Am Ende dieses Rundgangs stehst du dort vor vier Toren, die noch an ihrem Platz sind.",
    ],
    transitionToNext: "Geh über die Zilversmidstraat zur Oude Beurs, der Straße, die nach Antwerpens allererster Börse benannt ist.",
  },

  // ── Gate 20 (+ vanished 21) ──────────────────────────────────────────
  "poortjes-oude-beurs": {
    name: "Oude Beurs 16: Den Spieghel",
    subtitle: "Eine Mutter, ein Kind und ein Spiegel",
    introduction: [
      "Such an der Oude Beurs das reich verzierte barocke Tor mit einer Holztür. Schau in den halbrunden Teil über der Tür: Dort ist eine kleine Szene in Holz geschnitzt.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Den Spieghel (Der Spiegel) wird schon zu Beginn des 14. Jahrhunderts erwähnt. Der Komplex reichte einst vom Grote Markt bis hierher an die Oude Beurs. 1506 kaufte ihn der Kaufmann Peter Gielis. Spätere Eigentümer waren der Stadtschatzmeister Alexander van den Broeck-Vekemans und sein Sohn Jan-Alexander, nach 1650 der Notar Bartholomeus Van den Berghe. Ab 1888 war hier eine Grundschule für Mädchen untergebracht.",
          "Smekens nennt Steven Butken aus Köln als ursprünglichen Eigentümer und sagt, „Alex van den Broeck (17. Jahrhundert)“ habe das Anwesen in „eine Art Palast“ verwandeln wollen. Butken haben wir im Inventar nicht gefunden. [Zu überprüfen]",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt ein Rundbogentor aus dem dritten Viertel des 17. Jahrhunderts „in üppigem Barockstil“, aus Blaustein. Die Holztür enthält „ein geschnitztes Relief im Oberlicht“: „eine sitzende, stillende Frau mit einem Spiegel in der rechten Hand, umgeben von Putten“. Smekens: „eine sitzende Frau, die in einen Spiegel blickt, während sich ihr Kind in seiner Mutter spiegelt“.",
          "Zum Komplex gehört auch ein achteckiger Hausturm aus Backstein, wahrscheinlich von um 1506, einer der ältesten erhaltenen Haustürme Antwerpens.",
        ],
      },
      {
        heading: "Antwerpens erste Börse",
        kind: "history",
        paragraphs: [
          "Die Straße verdankt ihren Namen der ersten Börse (beurs) der Stadt. Eine hölzerne „alte Börse“ von 1485 wurde 1515 unter der Leitung von Dominicus de Waghemakere mit einem spätgotischen Steinumgang neu gebaut, beim Haus „den grooten Rhijn“ in der Hofstraat, um die Ecke.",
          "Der Handel wuchs so schnell, dass die Kaufleute um 1526–1527 um mehr Platz baten. 1531–1532 wurde zwischen der Meir und der Lange Nieuwstraat eine neue Börse gebaut, und 1533 schloss die alte. Diese neue Börse, die Handelsbeurs, besuchen wir später auf diesem Rundgang.",
        ],
      },
    ],
    glossary: ["barleef", "waaier"],
    thenAndNow: [
      "Damals: Smekens beschrieb die Szene von Mutter und Kind mit dem Spiegel in einem einzigen Satz.",
      "Heute: Die Schnitzerei sitzt im Oberlicht über der Tür. Wie gut ist sie erhalten? Siehst du die Putten (kleinen Engel) rund um die Frau?",
    ],
    didYouKnow: [
      "„Den Spieghel“ ist ein sprechender Hausname: Die Schnitzerei über der Tür zeigt buchstäblich einen Spiegel.",
    ],
    transitionToNext: "Geh zum Melkmarkt. Halte Ausschau nach einem Haus mit einem goldenen Schuh.",
  },

  // ── Gate 15 ───────────────────────────────────────────────────────────
  "poortjes-melkmarkt": {
    name: "Melkmarkt 37",
    subtitle: "De Gulde Schoen (Der Goldene Schuh)",
    introduction: [
      "Such das Tor mit zwei Löwenköpfen und einer Kartusche mit dem Namen des Hauses: „Gulde Schoen“. Das Haus ist heute ein Hotel; das Tor ist älter als alles ringsum.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Smekens schreibt knapp: „Gehörte zum Haus De gulden schoen.“ Das Haus selbst wurde im 19. Jahrhundert stark verändert: 1847 ließ der Holzhändler Willem Westlake die Fassade auf ein regelmäßiges Muster von vier Achsen zurückführen, und 1849 wurde das Satteldach durch ein zusätzliches Stockwerk ersetzt. Seit 2018 ist es ein Hotel.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Laut Inventar ist das Tor ein barockes Tor aus dem dritten Viertel des 17. Jahrhunderts, mit „einer reich gemeißelten Blausteinrahmung“, ionischen Kapitellen, bossierten Pilastern, gemeißelten Löwenköpfen und einer Kartusche mit der Inschrift „Gulde Schoen“, bekrönt von einem gesprengten Volutengiebel. Die Eingangsrahmung steht seit 1976 unter Denkmalschutz.",
        ],
      },
    ],
    glossary: ["fronton", "cartouche"],
    thenAndNow: [
      "Damals: 1951 stand das Tor in einer Fassade, die schon ein Jahrhundert zuvor „begradigt“ worden war.",
      "Heute: Das Tor aus dem 17. Jahrhundert ist der älteste Teil der Fassade. Such die Löwenköpfe auf der Zeichnung und in Wirklichkeit.",
    ],
    didYouKnow: [
      "Ein Hausname wie „Gulde Schoen“ kann auf ein Handwerk oder ein Ladenschild verweisen. Ob hier je Schuhmacher wohnten, wissen wir nicht.",
    ],
    transitionToNext: "Geh zur Wolstraat, wo zwei Tore aus dem Buch kaum hundert Meter voneinander entfernt stehen.",
  },

  // ── Gate 16 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-7": {
    name: "Wolstraat 7",
    subtitle: "De Tennen Pot (Der Zinntopf)",
    introduction: [
      "Such das monumentale Tor in einer sonst schlichten, verputzten Fassade. Über der Tür sitzt ein eisernes Oberlicht mit Stäben, die sich wie Sonnenstrahlen ausbreiten.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "De Tennen Pot ist ein traditionelles Tiefhaus, das auf die zweite Hälfte des 16. Jahrhunderts zurückgeht. Der Name bezieht sich auf einen Zinntopf. 1850 wurden die Kreuzstockfenster tiefer gesetzt; 1895 riss der Eigentümer Vochten den Treppengiebel ab und ließ nach einem Entwurf des Architekten Eugène Dieltiëns ein Zwischengeschoss bauen. 1921 entwarfen Eugène und sein Sohn Jules Dieltiëns das Schaufenster, das noch heute da ist.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt „ein monumentales Rundbogentor in einer Rahmung aus plastischem Barock“ aus dem dritten Viertel des 17. Jahrhunderts, aus Blaustein, mit profiliertem und bossiertem Rundbogen, Pilastern mit Kompositkapitellen und einem eisernen Oberlicht mit strahlenförmigem Muster. Dieses Oberlicht stammt erst von 1850.",
        ],
      },
    ],
    glossary: ["waaier", "kapiteel"],
    thenAndNow: [
      "Damals: 1951 war der Treppengiebel schon seit mehr als einem halben Jahrhundert verschwunden; nur das Tor erinnerte an das Haus des 17. Jahrhunderts.",
      "Heute: Such den Unterschied zwischen dem Stein aus dem 17. Jahrhundert und dem Oberlicht aus dem 19. Jahrhundert.",
    ],
    didYouKnow: [
      "Diese eine Fassade vereint drei Epochen: ein Tor aus dem 17. Jahrhundert, ein Oberlicht von 1850 und ein Schaufenster von 1921.",
    ],
    transitionToNext: "Etwas weiter in derselben Straße, an Nummer 30, wartet eine Tür voller Trauben und Delfine.",
  },

  // ── Gate 17 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-30": {
    name: "Wolstraat 30",
    subtitle: "Het Scilt van Londen (Der Schild von London)",
    introduction: [
      "Diesmal ist nicht nur der Stein interessant, sondern vor allem die Holztür. Sieh dir das Medaillon in der Mitte an und die kleinen Figuren darüber.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Het Scilt van Londen ist ein traditionelles Tiefhaus, das sowohl Smekens als auch das Inventar auf 1625 datieren. 1853 ließ der Küfer Pierre Van Hove es im neoklassizistischen Stil umbauen. Wie die Fassade ursprünglich aussah, wissen wir nicht sicher.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt eine „auffällige Rundbogentür in einer barocken Rahmung aus (gestrichenem) Blaustein, in das dritte Viertel des 17. Jahrhunderts zu datieren“. Holztür und Vordach tragen Reliefs, die auf den Weinhandel verweisen: „Das mittlere Medaillon zeigt zwei jugendliche Büsten, wahrscheinlich den Weingott Bacchus und seine Gemahlin Ariadne“, darüber „zwei spiegelbildliche Putten mit Weintrauben, auf Delfinen sitzend“.",
        ],
      },
      {
        heading: "Duquesnoy?",
        kind: "interpretation",
        paragraphs: [
          "Smekens schreibt, die Tür „wird François Duquesnoy (1594–1642) zugeschrieben“; auch das Inventar erwähnt diese Zuschreibung, mit den Lebensdaten 1597–1643. Eine Zuschreibung ist kein Beweis. Zudem datiert das Inventar die Rahmung in das dritte Viertel des 17. Jahrhunderts, also nach Duquesnoys Tod. Wer sie geschaffen hat, bleibt deshalb eine offene Frage.",
        ],
      },
    ],
    glossary: ["barleef"],
    thenAndNow: [
      "Damals: Smekens zeichnete die Tür mit ihren Reliefs; laut Inventar ist die Rahmung gestrichen.",
      "Heute: Zähl die Delfine und such die Weintrauben.",
    ],
    didYouKnow: [
      "Laut Inventar verweisen die Trauben, Bacchus und Ariadne auf den Weinhandel. Warum das Haus „Het Scilt van Londen“ heißt, konnten wir nicht herausfinden.",
    ],
    transitionToNext: "Geh zur Jeruzalemstraat, einer kleinen Straße zwischen der Wolstraat und der Oude Waag. Such ein schmales Portal neben Nummer 14.",
  },

  // ── Gate 10 (+ vanished 18 and 22) ───────────────────────────────────
  "poortjes-jeruzalemstraat": {
    name: "Jeruzalemstraat",
    subtitle: "Ein Portal ins Heilige Land",
    introduction: [
      "Such an der Seite des Eckhauses zur Oude Waag ein schmales Blausteinportal mit Oberlicht. Smekens schreibt: „neben Nr. 14“.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Das Portal gehört zum Eckhaus „Jeruzalem“ (Oude Waag 1–3), 1564 erwähnt als „ein Eckhaus mit Treppengiebel namens Jeruzalem“. Das Haus wurde 1837–1838 im neoklassizistischen Stil umgebaut, 1903 erweitert und 1946 vom Architekten Joseph De Paepe gründlich umgestaltet. Das Portal blieb verschont.",
          "Smekens erklärt den Namen „als Erinnerung an die ersten Reisen von Antwerpen ins Heilige Land“. Das Inventar liefert keine Erklärung für den Namen. Seine Deutung ist also eine Möglichkeit, keine gesicherte Tatsache.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt „das kleine barocke Blausteinportal“ aus der zweiten Hälfte des 17. Jahrhunderts: eine „Rundbogentür mit profilierter, bossierter Archivolte auf gemeißelten, bossierten Pilastern“ und ein Oberlicht im Segmentbogen mit Voluten und Ranken. Die Eingangsrahmung steht seit 1976 unter Denkmalschutz.",
        ],
      },
      {
        heading: "Warum wir jetzt hier sind",
        kind: "context",
        paragraphs: [
          "In der Liste dieses Rundgangs ist dies Tor 10, direkt nach der Suikerrui. Die Jeruzalemstraat liegt aber hier, zwischen der Wolstraat und der Oude Waag, nicht bei der Suikerrui. Deshalb besuchen wir sie jetzt, ohne hin und her zu laufen.",
        ],
      },
    ],
    glossary: ["archivolt"],
    didYouKnow: [
      "Zwei weitere Tore aus dem Buch lagen ganz in der Nähe und sind verschwunden: an der Grote Goddaard (das Haus De witte engel, Der Weiße Engel) und an der Engelse Beurs, bei einer kleinen Börse, die die Stadt laut Smekens 1550 für englische Kaufleute gebaut hatte.",
    ],
    transitionToNext: "Geh zur Zwartzustersstraat. Das Kloster dort wird gerade renoviert, doch seiner Geschichte tut das keinen Abbruch.",
  },

  // ── Gate 19: in renovation ───────────────────────────────────────────
  "poortjes-zwartzusters": {
    name: "Zwartzustersstraat 25",
    subtitle: "Sechs Jahrhunderte Pflege hinter einem Tor",
    introduction: [
      "Vor dir liegt das barocke Tor des Zwartzusterklooster, des Klosters der Schwarzen Schwestern. Seit Ende 2025 wird das Kloster renoviert. Es kann also sein, dass du das Tor heute hinter einem Bauzaun oder vorübergehend verhüllt siehst.",
    ],
    sections: [
      {
        heading: "Wer waren die Schwarzen Schwestern?",
        kind: "history",
        paragraphs: [
          "Die Schwarzen Schwestern (Zwartzusters) lebten nach der Regel des heiligen Augustinus. Sie ließen sich 1345 in Antwerpen nieder, zunächst in einem Gebäude an der Koepoort, geschenkt von „Hendrik Suderman, einem wohlhabenden deutschen Kaufmann“. Smekens nennt ihn „H. Südermann“.",
          "Ihr Name kommt von ihrer Kleidung. Um 1462 legten sie die Ordensgelübde ab und tauschten ihr graues Gewand gegen ein schwarzes.",
        ],
      },
      {
        heading: "Pflege der Kranken",
        kind: "history",
        paragraphs: [
          "Die Schwestern arbeiteten in der Krankenpflege. Unter der calvinistischen Stadtregierung (1571–1585) setzten sie diese Arbeit trotz Verfolgung fort. Nach 1585 genossen sie Schutz. 1798 wurden sie von den französischen Behörden vertrieben; 1823 kehrten sie zurück. Die letzten Schwestern gingen 2014.",
        ],
      },
      {
        heading: "Der Komplex",
        kind: "history",
        paragraphs: [
          "Das Kloster wuchs in Etappen: 1507 eine neue Kapelle, 1520 Wohnräume für den geistlichen Leiter, 1536 ein Refektorium und ein Schlafsaal. 1608 wurde der Nordflügel als Krankenhaus eingerichtet. 1670–1678 wurde das Refektorium vergrößert, und Waschhaus und Küche wurden erneuert; die Küche wurde „vollständig mit Delfter Fliesen verkleidet“.",
          "Die Kapelle ist eine kleine gotische Hallenkirche aus dem ersten Viertel des 16. Jahrhunderts mit einem hölzernen Spitztonnengewölbe. Ost- und Westflügel wurden 1904 nach einem Entwurf von Paul Van Glabbeek gebaut.",
        ],
      },
      {
        heading: "Die Architektur des Tors",
        kind: "history",
        paragraphs: [
          "Smekens nennt dies ein „Tor im Louis-XIV-Stil“. Das Inventar beschreibt ein barockes Rundbogentor aus Blaustein aus dem „vierten Viertel des 17. oder ersten Viertel des 18. Jahrhunderts“. Der geschnitzte Mittelpfosten mit der Jungfrau Maria, Ursula und Augustinus stammt von Leopold Van Esbroeck (1967) und ist damit jünger als die Zeichnung.",
        ],
      },
      {
        heading: "Heute",
        kind: "history",
        paragraphs: [
          "Das Kloster stand rund zehn Jahre leer. Ende 2025 begann der Umbau zu einem Cohousing-Projekt mit 41 Wohnungen und Gemeinschaftsräumen, mit einem Garten des niederländischen Gartengestalters Piet Oudolf (VRT NWS, 29. Oktober 2025). Die Arbeiten sollten etwa zwei Jahre dauern.",
        ],
      },
    ],
    glossary: ["makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Damals: Die Zeichnung stammt von um 1950. Laut Inventar stammt der geschnitzte Mittelpfosten mit drei Heiligen von 1967, er kann also nicht auf der Zeichnung sein.",
      "Heute: Wenn das Tor sichtbar ist, vergleiche seinen Mittelpfosten mit der Zeichnung. Was war 1951 an dieser Stelle?",
    ],
    didYouKnow: [
      "In den 1670er-Jahren wurde die Küche des Klosters vollständig mit Delfter Fliesen verkleidet.",
    ],
    transitionToNext: "Geh zur Korte Nieuwstraat. Halte Ausschau nach einer Kapelle mit einem Engel als Schlussstein.",
  },

  // ── Gate 23 ───────────────────────────────────────────────────────────
  "poortjes-korte-nieuwstraat": {
    name: "Korte Nieuwstraat 22",
    subtitle: "Eine Kapelle für sechs alte Frauen",
    introduction: [
      "Such den schmalen Sandsteingiebel mit einem barocken Portal aus dunklem Blaustein. Sieh dir den Schlussstein an: ein kleiner geflügelter Engelskopf. Schau dann auf die leere Nische darüber.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Dies ist die Kapelle des Sint-Annagodshuis (Sankt-Anna-Armenhaus), 1400 von Elisabeth, der Witwe von Jan Hays, und Boudewijn de Riddere als „Heim für sechs alte Frauen“ gegründet. Die Kapelle wurde im selben Jahr gebaut und der heiligen Anna geweiht. 1540 übernahmen die Almosenpfleger der Armenkamer (der städtischen Armenfürsorge) die Verwaltung.",
          "Bis 1963 wohnten hier Bewohnerinnen. Danach diente die Kapelle als Werkstatt des Bildhauers Frans Joris, als Buchlager und als Abstellraum.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Die Kapelle ist eine gotische Hallenkirche mit einem barocken Portal aus Blaustein aus dem 17. Jahrhundert, mit „gefugten Kämpfern und einem geflügelten Engelskopf als Schlussstein“, „flankiert von zwei Ringsäulen“. Die Nische darüber enthielt ursprünglich Statuen der heiligen Anna und Marias, die im frühen 20. Jahrhundert verschwanden. Smekens sagt dasselbe: Die Figuren waren „zu Beginn des 20. Jahrhunderts“ noch da. Die Kapelle steht seit 1938 unter Denkmalschutz.",
        ],
      },
    ],
    glossary: ["godshuis", "imposten"],
    thenAndNow: [
      "Damals: 1951 war die Nische schon leer. Smekens zeichnete das Portal mit seinen Engelsfiguren.",
      "Heute: Die Nische ist noch immer leer. Such den geflügelten Engelskopf auf dem Schlussstein.",
    ],
    didYouKnow: [
      "Armenhäuser waren eine frühe Form des sozialen Wohnungsbaus: Wohlhabende Bürger oder Zünfte stifteten sie für Alte oder Arme, oft mit eigener Kapelle.",
    ],
    transitionToNext: "Ende des zweiten Teils. Geh zur Handelsbeurs: von Klöstern und Zunfthäusern zu Geld und Welthandel.",
  },
};
