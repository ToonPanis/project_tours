import type { ClassicsContent } from "./types";

/**
 * Classics of Antwerp: German content (translated from content/en.ts).
 * Keep the structure identical to the English master.
 */
export const classicsContentDe: ClassicsContent = {
  walk: {
    title: "Klassiker von Antwerpen",
    tagline: "Ein Spaziergang durch die Geschichte Antwerpens",
    shortDescription:
      "Ein erzählter Rundgang vom prächtigen Bahnhof bis ans Ufer der Schelde: neunzehn Stationen, acht Jahrhunderte und die Geschichten hinter Antwerpens berühmtesten Orten.",
    description:
      "Vom prächtigen Bahnhof Antwerpens geht es durch Jahrhunderte voller Handel, Kunst, Glauben und Macht bis dorthin, wo die Geschichte der Stadt begann: ans Ufer der Schelde.\n\nAn jeder Station wird dein Handy zu deinem Guide: was du vor dir siehst, warum es gebaut wurde, was hier geschah und welche Details die meisten Besucher einfach übersehen. Historische Fotos zeigen dir, wie die Stadt vor hundert Jahren und früher aussah. Es gibt keine Spiele und keine Fragen, nur Antwerpen und die Zeit, es dir in Ruhe anzusehen.",
    highlights: [
      "19 der wichtigsten historischen Orte Antwerpens",
      "Erzählt wie von einem Guide, der neben dir hergeht",
      "Historische Fotos, Stiche und Postkarten an jeder wichtigen Station",
      "„Wusstest du schon?“-Geschichten, die auf keiner Infotafel stehen",
      "Details, nach denen du vor Ort Ausschau halten kannst",
      "Fußgängernavigation von Station zu Station",
    ],
    howItWorksSteps: [
      "Geh mit der Karte zur nächsten Station",
      "Lies die Geschichte zu dem, was du siehst",
      "Such vor Ort nach den Details",
      "Geh in deinem eigenen Tempo weiter",
    ],
    practicalInfo: [
      { label: "Tempo", value: "In deinem eigenen Tempo; unterbrich und mach weiter, wann du willst" },
      { label: "Ideal für", value: "Erstbesucher und alle, die neugierig auf Antwerpens Geschichte sind" },
      { label: "Barrierefreiheit", value: "Überwiegend ebene Straßen; in der Altstadt teils Kopfsteinpflaster" },
    ],
    guideIntro: {
      quote:
        "Vom prächtigen Bahnhof Antwerpens geht es durch Jahrhunderte voller Handel, Kunst, Glauben und Macht bis dorthin, wo die Geschichte der Stadt begann: ans Ufer der Schelde.",
      categoryLabel: "Geschichte & Architektur",
      footnote: "Von der Belle Époque bis ins mittelalterliche Antwerpen.",
    },
    copy: {
      startLabel: "Rundgang starten",
      nextLocationTitle: "Nächste Station",
      completionTitle: "Das Ende des Rundgangs",
      completionMessage: "Du bist nicht nur durch Antwerpen gegangen. Du bist durch seine Geschichte zurückgegangen.",
      locationsTitle: "Die Route",
      locationsDiscoveredLabel: "Stationen besucht",
    },
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "classics-central-station": {
      name: "Antwerpen-Centraal",
      subtitle: "Die Eisenbahnkathedrale",
      introduction: [
        "Vor dir steht einer der spektakulärsten Bahnhöfe der Welt. Betrachte ihn einen Moment so, wie er gesehen werden sollte: ein steinerner Palast mit Kuppel, Türmen und vergoldeten Details, gebaut nicht nur, um einen Zug zu erreichen, sondern um jeden zu beeindrucken, der in Antwerpen ankam.",
        "Die Antwerpener nennen ihn die spoorwegkathedraal, die Eisenbahnkathedrale. Ein passender Ausgangspunkt, denn hier beginnt das jüngste Kapitel unserer Geschichte. Von hier aus gehen wir rückwärts durch die Zeit, bis an den Fluss, an dem die Stadt geboren wurde.",
      ],
      sections: [
        {
          heading: "Das Prestigeprojekt eines Königs",
          kind: "history",
          paragraphs: [
            "Um 1900 boomte Antwerpen. Sein Hafen gehörte zu den geschäftigsten Europas, und König Leopold II. wollte einen Bahnhof, der diesem Anspruch gerecht wurde. Gebaut wurde in zwei Etappen. Zuerst errichtete der Ingenieur Clément Van Bogaert zwischen 1895 und 1899 die riesige Bahnhofshalle aus Eisen und Glas: 186 Meter lang, 66 Meter breit und 43 Meter hoch. Diese Höhe diente nicht nur dem Eindruck; sie gab dem Rauch der Dampflokomotiven Raum zum Aufsteigen.",
            "Dann baute der Architekt Louis Delacenserie zwischen 1899 und 1905 das steinerne Empfangsgebäude davor. Seinen eigenen Stil nannte er einen „barock-mittelalterlichen Eklektizismus“; Anregungen holte er sich unter anderem beim alten Bahnhof von Luzern und beim Pantheon in Rom. Das Ergebnis mischt nahezu alles: Kuppeln, Fialen, Marmor, Gold und eine gehörige Portion Theater.",
          ],
        },
        {
          heading: "Vom Kopf- zum Durchgangsbahnhof",
          kind: "history",
          paragraphs: [
            "Rund ein Jahrhundert lang war dies ein Kopfbahnhof: Die Züge fuhren ein, hielten und mussten wieder hinausrangieren. Zu Beginn des 21. Jahrhunderts änderte sich das. Unter der alten Bahnhofshalle wurden neue Bahnsteige auf mehreren Ebenen ausgehoben und ein Tunnel unter der Stadt gebaut, sodass die Züge heute direkt durch Antwerpen fahren können. Die historische Halle blieb obendrauf erhalten, restauriert, als wäre nichts geschehen.",
          ],
        },
      ],
      didYouKnow: [
        "Als König Leopold II. den fertigen Bahnhof zum ersten Mal sah, soll er weniger beeindruckt gewesen sein als alle erwartet hatten. Einer bekannten Anekdote zufolge bemerkte er: „C'est une petite belle gare“: „Das ist ein hübscher kleiner Bahnhof“.",
        "Die eiserne Bahnhofshalle ist älter als das Steingebäude, das du vor dir siehst. Die Ingenieure waren Jahre früher fertig als der Architekt.",
      ],
      lookAt: [
        {
          title: "Die Uhr und das Wappen",
          body: "Geh in die Bahnhofshalle und dreh dich um. Über dem Eingang des Empfangsgebäudes findest du eine große Uhr, das Wort ANTWERPEN und das Stadtwappen: eine Burg mit zwei Händen darüber. Merk dir diese Hände; sie begegnen dir später auf diesem Rundgang wieder, auf dem Grote Markt.",
        },
      ],
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Finde das Stadtwappen von Antwerpen",
        task: [
          "Finde das Stadtwappen von Antwerpen.",
          "Das Foto ist dein Hinweis: Schau dich gut um, im Bahnhof und draußen. Gefunden? Dann tippe unten auf die Schaltfläche.",
        ],
      },
      transitionToNext:
        "Verlass den Bahnhof an seiner Westseite. Nach wenigen Minuten betrittst du ein kleines Viertel, in dem seit Jahrhunderten mit einem ganz anderen Schatz gehandelt wird.",
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "classics-diamond-district": {
      name: "Das Diamantenviertel",
      subtitle: "Einer der großen Diamantenmärkte der Welt, in ein paar stillen Straßen",
      introduction: [
        "Schau dich um. Diese paar unscheinbaren Straßen neben dem Bahnhof, mit ihren Kameras, Pollern und anonymen Bürogebäuden, bilden einen der wichtigsten Diamantenmärkte der Welt. Ein großer Teil des weltweiten Handels mit Rohdiamanten ist durch diese wenigen Häuserblocks gegangen.",
      ],
      sections: [
        {
          heading: "Fünf Jahrhunderte Diamanten",
          kind: "history",
          paragraphs: [
            "Antwerpens Beziehung zu Diamanten ist alt. Der früheste bekannte Beleg stammt aus dem Jahr 1447, als die Stadt Vorschriften gegen den Handel mit gefälschten Edelsteinen erließ, Diamanten eingeschlossen. Schon damals war der Handel offensichtlich wichtig genug, um ihn zu schützen.",
            "Das Viertel, in dem du stehst, entstand erst später, Ende des 19. Jahrhunderts, rund um den Bahnhof und die Eisenbahn. 1893 wurde die erste Diamantenbörse der Stadt gegründet, der Diamantclub van Antwerpen; 1904 folgte die Beurs voor Diamanthandel. Hier trafen sich die Händler, prüften Steine und schlossen Geschäfte ab, oft besiegelt mit kaum mehr als einem Handschlag und einem Wort des Vertrauens.",
            "Einen Großteil des 20. Jahrhunderts prägte die jüdische Gemeinde Antwerpens den Handel; viele ihrer Familien stammten aus Mittel- und Osteuropa. Später gewannen Händler aus Indien zunehmend an Bedeutung. Wenn du hier umhergehst, hörst du noch immer viele Sprachen auf diesen Straßen.",
          ],
        },
        {
          heading: "Die Polierscheibe",
          kind: "legend",
          paragraphs: [
            "Der Überlieferung nach erfand ein mit Antwerpen verbundener Handwerker, Lodewijk van Bercken, im 15. Jahrhundert die scaif: eine mit Diamantstaub und Öl bestrichene Polierscheibe, mit der sich alle Facetten eines Diamanten symmetrisch schleifen ließen. Die Geschichte wird oft wiederholt, doch die historischen Belege für sein Leben und seine Erfindung sind dünn. Sieh sie also eher als stolze lokale Tradition denn als gesicherte Tatsache.",
          ],
        },
      ],
      didYouKnow: [
        "Am Wochenende des 15. und 16. Februar 2003 brachen Diebe in den Tresorraum des Antwerp Diamond Centre in diesem Viertel ein. Die Beute, geschätzt auf mehr als 100 Millionen Dollar in Diamanten, Gold und Schmuck, machte den Einbruch zu einem der größten Diamantenraube der Geschichte. Es gab Festnahmen, doch die meisten Diamanten wurden nie gefunden.",
      ],
      moreStories: {
        "jewish-community": {
          title: "Die jüdische Gemeinde",
          subtitle: "Der Zweite Weltkrieg und danach",
          sections: [
            {
              heading: "Der Zweite Weltkrieg",
              kind: "history",
              paragraphs: [
                "18. August 1941: Die Wehrmacht dringt in den Diamantkring ein und beschlagnahmt Diamanten. 164 Mitglieder des Diamantkring werden ermordet.",
                "Sommer 1942: Razzien, unter anderem am 15./16. und 28./29. August, in Straßen wie der Van Immerseelstraat, der Lange Kievitstraat und der Provinciestraat. Die Daten weichen je nach Quelle leicht voneinander ab.",
                "Bei der Razzia vom 28./29. August nahm die Antwerpener Polizei die Verhaftungen selbst vor. Das war einmalig in der Geschichte der Besatzung Belgiens.",
                "Die Opfer wurden über die Kazerne Dossin in Mechelen nach Auschwitz-Birkenau deportiert.",
              ],
            },
            {
              heading: "Wie viele?",
              kind: "history",
              paragraphs: [
                "Zwischen 56 % und 66 % der Antwerpener Juden wurden deportiert, je nach Berechnung: mehr als die Hälfte, nach manchen Berechnungen zwei Drittel. Laut Antwerpen Herdenkt überlebten etwa 10.000 Juden aus der Region den Krieg nicht.",
              ],
            },
            {
              heading: "Nach dem Krieg",
              kind: "history",
              paragraphs: [
                "1945 lebten noch etwa 2.000 Juden in der Stadt. Ende der 1940er-Jahre waren es wieder etwa 10.000, eine stark orthodox geprägte Gemeinde.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Geh zurück Richtung Bahnhofsvorplatz und bieg in De Keyserlei ein, den Prachtboulevard, der in die Altstadt führt. Um 1900 betrat jeder, der mit dem Zug ankam, auf diesem Weg Antwerpen.",
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "classics-keyserlei-meir": {
      name: "De Keyserlei & die Meir",
      subtitle: "Der Prachtboulevard und der Tag, an dem der Krieg ins Kino kam",
      introduction: [
        "Du stehst auf De Keyserlei, dem breiten Boulevard, der den Bahnhof mit dem Herzen der Stadt verbindet. Vor dir geht er in die Meir über, Antwerpens berühmteste Einkaufsstraße. Auf alten Postkarten von um 1900 siehst du genau denselben Blick: elegante Gebäude, lebhafter Verkehr und ganz am Ende die Turmspitze der Kathedrale, die den Weg weist.",
      ],
      sections: [
        {
          heading: "16. Dezember 1944",
          kind: "history",
          paragraphs: [
            "Mit dieser Straße ist eine der dunkelsten Erinnerungen Antwerpens verbunden. Nach der Befreiung der Stadt im September 1944 wurde ihr Hafen für die Versorgung der alliierten Armeen unverzichtbar, und Deutschland antwortete mit seinen neuen V-Waffen: Flugbomben und V2-Raketen, die ohne Vorwarnung einschlugen.",
            "Am Nachmittag des 16. Dezember 1944 sahen sich rund 1.100 Menschen im Kino Rex, Hausnummer 15 an diesem Boulevard, einen Film an. Um 15.20 Uhr traf eine V2-Rakete das Dach. 567 Menschen kamen ums Leben: 271 Zivilisten und 296 alliierte Soldaten. Es war die höchste Zahl an Todesopfern durch einen einzelnen Raketenangriff im gesamten Krieg, und es dauerte fast eine Woche, bis alle aus den Trümmern geborgen waren.",
          ],
        },
      ],
      didYouKnow: [
        "Das Kino Rex wurde nach dem Krieg wieder aufgebaut und 1947 neu eröffnet. 1993 schloss es endgültig und wurde zwei Jahre später abgerissen. Heute erinnert in der Straße kaum etwas die Passanten an das, was hier geschah.",
      ],
      transitionToNext:
        "Folge der Meir Richtung Altstadt. Etwas weiter links glänzt eine goldene Kuppel über einem prachtvollen Eingang: ein Festsaal, der abbrannte und wiederauferstand.",
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "classics-stadsfeestzaal": {
      name: "Stadsfeestzaal",
      subtitle: "Der Festsaal der Stadt, der aus der Asche auferstand",
      introduction: [
        "Vor dir liegt der Eingang der Stadsfeestzaal, des städtischen Festsaals. Tritt ein und schau nach oben: ein weiter Saal, gekrönt von einer Glaskuppel mit Blattgold. Heute ist er ein Einkaufszentrum, gebaut wurde er aber für etwas ganz anderes.",
      ],
      sections: [
        {
          heading: "Ein Saal für die Stadt",
          kind: "history",
          paragraphs: [
            "Die Stadsfeestzaal wurde am 8. Februar 1908 eröffnet. Entworfen hatte sie der Stadtarchitekt Alexis Van Mechelen, im Auftrag der Stadt selbst und in prachtvollem neoklassizistischem Stil. Antwerpen war reich und selbstbewusst und wollte einen Ort für Bälle, Ausstellungen, Messen und Empfänge: einen Salon für die ganze Stadt, mitten in ihrer Hauptstraße.",
          ],
        },
        {
          heading: "Der Brand von 2000",
          kind: "history",
          paragraphs: [
            "Am 27. Dezember 2000 löste ein Kurzschluss einen Brand aus, der das Gebäude völlig zerstörte. Als die Flammen gelöscht waren, standen nur noch die monumentale Treppe, die historische Fassade und die Stahlkonstruktion des Dachs.",
            "Viele fürchteten, der Saal sei für immer verloren. 2004 schloss die Stadt einen langfristigen Pachtvertrag mit einem Projektentwickler, und noch im selben Jahr begannen die Restaurierungsarbeiten. Unter Aufsicht der Denkmalbehörde wurden die Glaskuppel mit ihrem Blattgold, die Treppe, der Zierrat, die Skulpturen, Mosaiken, Wandreliefs und sogar das Eichenparkett originalgetreu wiederhergestellt. 2007 öffnete die Stadsfeestzaal erneut.",
          ],
        },
      ],
      didYouKnow: [
        "Vieles von dem „historischen“ Interieur, das du drinnen siehst, ist in Wirklichkeit eine sorgfältige Rekonstruktion aus dem 21. Jahrhundert, angefertigt nach dem Brand von 2000 anhand von Fotos, Plänen und erhaltenen Fragmenten.",
      ],
      transitionToNext:
        "Geh weiter auf der Meir Richtung Altstadt. Ein paar Minuten weiter wartet Spooky mit einer Aufgabe auf dich …",
    },

    // ── 4b: Spooky's quest ───────────────────────────────────────────────
    // `name` and `subtitle` show BEFORE the façade is found: they must not give it away.
    "classics-paleis-op-de-meir": {
      name: "Ein Rätsel an der Meir",
      subtitle: "Die Fassade aus Spookys Zeichnung",
      introduction: [
        "Gefunden! Die lange, elegante Fassade aus dem 18. Jahrhundert vor dir ist der Paleis op de Meir.",
      ],
      sections: [
        {
          heading: "Ein Palast an der Meir",
          kind: "history",
          paragraphs: [
            "Der Antwerpener Architekt Jan Pieter van Baurscheit der Jüngere errichtete ihn ab 1745 für einen wohlhabenden Kaufmann, Johan Alexander van Susteren. Später ging er durch bemerkenswerte Hände: Napoleon kaufte ihn 1811–1812, wohnte aber nie darin, der russische Zar Alexander I. logierte hier 1814, und lange Zeit diente er als königlicher Palast.",
          ],
        },
      ],
      didYouKnow: [
        "Napoleon gehörte der Palast an der Meir, doch als er für ihn bereitstand, war er schon im Exil auf der Insel Elba.",
      ],
      quest: {
        title: "Spookys Aufgabe",
        task: [
          "Sieh dir diese alte Bauzeichnung genau an. Irgendwo an der Meir steht das Gebäude, zu dem sie gehört.",
          "Geh zum Suchgebiet auf der Karte, schau an den Fassaden hinauf und vergleiche sie mit der Zeichnung. Findest du heraus, welches Gebäude es ist? Wenn du davorstehst, merkt Hidden Antwerp es von selbst.",
        ],
        zoneHint: "Das Gebäude befindet sich irgendwo in diesem Gebiet.",
        revealedName: "Paleis op de Meir",
      },
      transitionToNext:
        "Nur ein paar Schritte weiter öffnet sich neben der Meir ein kleiner Platz: der Wapper, wo Antwerpens berühmtester Maler sein Zuhause baute.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-rubenshuis": {
      name: "Das Rubenshuis",
      subtitle: "Wo Antwerpens größter Maler lebte und arbeitete",
      introduction: [
        "Du stehst am Wapper, einem kleinen Platz gleich neben der Meir. Hinter der Fassade vor dir lebte und arbeitete Peter Paul Rubens, der berühmteste Maler, den Antwerpen je hervorgebracht hat, bis zu seinem Tod 1640.",
        "Das Porträt oben auf dieser Seite zeigt Rubens, wie er sich 1623 selbst malte, auf dem Höhepunkt seines Ruhms: ein breiter schwarzer Hut, ein dunkler Umhang, ein ruhiger, selbstsicherer Blick. Heute gehört dieses Selbstporträt der britischen Royal Collection.",
      ],
      sections: [
        {
          heading: "Ein italienischer Palazzo am Wapper",
          kind: "history",
          paragraphs: [
            "1608 kehrte Rubens nach acht Jahren in Italien nach Antwerpen zurück. 1610 kaufte er hier ein bestehendes flämisches Haus und verbrachte das folgende Jahrzehnt damit, es nach italienischem Vorbild zu Wohnhaus und Werkstatt umzubauen: ein Atelier im Barockstil, eine Kunstkammer mit halbrunder Skulpturengalerie, ein monumentaler Portikus und ein Gartenpavillon. 1617 zogen er und seine Frau Isabella Brant ein.",
            "Nach seinem Tod wurde das Haus vermietet, umgebaut und aufgeteilt. Die Stadt kaufte es 1937, und zwischen 1937 und 1946 rekonstruierte es der Stadtarchitekt Emiel Van Averbeke, weitgehend anhand von Stichen von Harrewijn aus den Jahren 1684 und 1692. Portikus, Gartenpavillon und der Rohbau des Ateliers sind größtenteils original; die Wohnräume und ihre Einrichtung sind eine Rekonstruktion.",
          ],
        },
        {
          heading: "Rubens und Isabella",
          kind: "history",
          paragraphs: [
            "Am 3. Oktober 1609, ein Jahr nach seiner Rückkehr aus Italien, heiratete der 32-jährige Rubens die 18-jährige Isabella Brant. Um diese Zeit malte er die beiden zusammen: das Doppelbildnis auf dieser Seite, heute in der Alten Pinakothek in München. Isabella lebte bis zu ihrem Tod 1626 mit ihm in diesem Haus.",
          ],
        },
        {
          heading: "Das Gemälde lesen",
          kind: "interpretation",
          paragraphs: [
            "Das Paar sitzt dicht beieinander in einer Laube aus Geißblatt. Ihre rechten Hände ruhen ineinander: Seit der Römerzeit waren verbundene rechte Hände ein Zeichen der Ehe. Das Geißblatt stand für dauerhafte Liebe; einer seiner deutschen Namen, Jelängerjelieber, sagt es schon: „je länger, je lieber“.",
            "Achte auch auf Kleidung und Haltung. Rubens trägt die feine Tracht eines Edelmanns, seine Hand nahe am Griff eines Degens; Isabella trägt einen hohen Hut, einen breiten Spitzenkragen und ein reich besticktes Mieder. Das große Format und die kostbare Kleidung zeigen das junge Paar als Menschen von Rang. Ein Maler, der sich mit seiner Braut im Freien zeigt, entspannt, als verliebtes Paar: Für seine Zeit betrat das Doppelbildnis Neuland.",
          ],
        },
        {
          heading: "Warum es zu diesem Rundgang gehört",
          kind: "interpretation",
          paragraphs: [
            "Das Gemälde markiert den Beginn des Lebens, das Rubens an diesem Ort aufbaute: eine Ehe, eine wachsende Werkstatt und ein Haus, das der Welt zeigte, wer er war. Ein Jahr nach der Hochzeit kaufte er dieses Haus. Auf dem weiteren Rundgang begegnest du ihm wieder: auf der Groenplaats, wo die Stadt seine Statue aufstellte, in der Kathedrale, die von ihm gemalte Altarbilder besitzt, und in der Sint-Carolus Borromeuskerk, deren Decken einst seine Werkstatt ausmalte.",
          ],
        },
      ],
      didYouKnow: [
        "Von 1648 bis 1660, nach Rubens' Tod, mieteten William und Margaret Cavendish das Haus, englische Royalisten im Exil.",
      ],
      infoBoxes: [
        {
          kind: "visit",
          title: "Das Rubenshuis besuchen",
          paragraphs: [
            "Das Haus selbst ist wegen Restaurierung frühestens bis 2030 geschlossen. Der Garten, die Bibliothek und die Rubens Experience im neuen Besuchergebäude sind geöffnet; der Besuchereingang liegt auf der Rückseite, am Hopland 13.",
            "Prüfe vor deinem Besuch die Öffnungszeiten und Eintrittspreise auf der Website des Rubenshuis.",
          ],
          checkedOn: "2026-09-30",
          sourceUrl: "https://rubenshuis.be/nl/vraag-antwoord",
        },
      ],
      transitionToNext:
        "Verlass die Meir für einen Moment und bieg in die schmalen Straßen dahinter ein. Hinter gewöhnlichen Fassaden verbirgt sich das Gebäude, in dem Antwerpen einst der Welt beibrachte, wie man Handel treibt.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "Die Handelsbeurs",
      subtitle: "Wo die Welt ihre Geschäfte machte",
      introduction: [
        "Vor dir liegt die Handelsbeurs, Antwerpens alte Handelsbörse. Von der Straße aus macht sie kaum auf sich aufmerksam. Drinnen aber verbirgt sich einer der außergewöhnlichsten Räume der Stadt: ein gotischer Innenhof, umgeben von Galerien und überspannt von einem hoch aufragenden Dach aus Eisen und Glas.",
        "Und jetzt denk dir dieses Dach weg. Mehr als drei Jahrhunderte lang war das Herz dieses Gebäudes ein offener Innenhof unter freiem Himmel, wo sich die Kaufleute halb Europas jeden Tag trafen.",
      ],
      sections: [
        {
          heading: "Ein Platz unter freiem Himmel",
          kind: "history",
          paragraphs: [
            "1531 eröffnete Antwerpen eine neue Börse nach Entwurf von Domien de Waghemakere, im Stil der Brabanter Spätgotik. Ihr Herz war ein rechteckiger Innenhof, zum Himmel offen und an allen vier Seiten von überdachten Galerien mit Sterngewölben auf Säulen umgeben.",
            "Jeden Tag versammelten sich Kaufleute aus Portugal, Italien, Deutschland, England und Spanien auf diesem offenen Platz, in einem babylonischen Sprachgewirr, um Preise festzulegen, Kredit zu geben und mit Wechseln zu handeln. Wenn es regnete, suchten sie unter den Galerien Schutz; über den Galerien lagen Läden und Räume. Der Stich oben auf dieser Seite zeigt den Innenhof voller kleiner Gruppen von Händlern.",
            "Es war eines der ersten Gebäude überhaupt, das eigens für den Handel errichtet wurde, und die Idee machte Schule. Als Thomas Gresham, der Agent der englischen Krone in Antwerpen, in den 1560er-Jahren die Royal Exchange in London gründete, nahm er sich diesen Innenhof mit seinen Galerien zum Vorbild; Amsterdam folgte 1611.",
          ],
        },
        {
          heading: "Ein Dach über dem Innenhof",
          kind: "history",
          paragraphs: [
            "Erst 1852–1854 wurde der Innenhof zum ersten Mal überdacht, vom Ingenieur Charles Marcellis, mit Eisen und einer Glaskuppel. Vier Jahre später, am 2. August 1858, zerstörte ein Brand sowohl die alte Börse als auch ihr neues Dach.",
            "Der Architekt Joseph Schadde baute sie wieder auf; am 19. Oktober 1872 wurde die neue Börse eingeweiht. Er behielt den Innenhof mit seinen Galerien bei, die noch immer dem Grundriss von 1531 folgen, überdachte ihn aber mit der spektakulären Konstruktion aus Eisen und Glas, die du heute siehst.",
          ],
        },
      ],
      didYouKnow: [
        "Mehr als drei Jahrhunderte lang, von 1531 bis zum ersten Dach von 1852–1854, machten Antwerpens Kaufleute ihre Geschäfte bei Sonne, Wind und Regen, in einem Innenhof unter freiem Himmel.",
      ],
      galleries: {
        "exchange-in-prints": {
          title: "Die Börse in alten Drucken",
          intro: "Zwei Drucke aus dem 19. Jahrhundert zeigen die Galerien vor und nach dem Brand von 1858.",
        },
      },
      transitionToNext:
        "Zurück auf der Meir: Schau nach oben. Über den Dächern ragt ein Turm auf, wie ein Stück New York, das in eine mittelalterliche Stadt gefallen ist. Wir machen kurz einen Sprung nach vorn in der Zeit, bevor unsere Reise in die Vergangenheit richtig beginnt.",
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "classics-boerentoren": {
      name: "Der Boerentoren",
      subtitle: "Europas erster Wolkenkratzer",
      introduction: [
        "Vor dir erhebt sich der Boerentoren, der „Bauernturm“. Mit seiner gestuften, nüchternen Silhouette wirkt er, als gehöre er eher ins New York der 1930er-Jahre als in eine Stadt gotischer Kirchen, und genau das war die Absicht seiner Erbauer.",
      ],
      sections: [
        {
          heading: "Ein amerikanischer Traum am Schoenmarkt",
          kind: "history",
          paragraphs: [
            "Der Häuserblock, auf dem er steht, war im Ersten Weltkrieg verwüstet worden. Als die Stadt einen Wettbewerb für den Wiederaufbau ausschrieb, war die Vorgabe eindeutig: Baut einen amerikanischen Wolkenkratzer. Die Architekten Jan Vanhoenacker, Emiel Van Averbeke und Jos Smolderen entwarfen einen Turm im Art-déco-Stil; gebaut wurde von 1929 bis 1932, mit Blick auf die Weltausstellung, die Antwerpen 1930 ausrichtete.",
            "Sein Skelett ist ein Stahlgerüst von rund 3.500 Tonnen, hergestellt von der deutschen Firma Demag. Mit 25 Stockwerken und einer Höhe von 87,5 Metern war er der erste Wolkenkratzer Europas und damals auch der höchste. Bei einer Renovierung der Spitze 1975 wuchs er auf 95,75 Meter und 26 Stockwerke.",
          ],
        },
      ],
      didYouKnow: [
        "Der Spitzname kommt von den Eigentümern: In das Gebäude zog die Sparkasse des Boerenbond, des belgischen Bauernverbands. Ein Turm voller Bauernersparnisse, mitten in der Stadt.",
      ],
      transitionToNext:
        "Von hier aus weist dir der Turm den Weg ins alte Herz Antwerpens. Geh zum großen Platz vor dir, wo die Kathedrale zum ersten Mal in ihrer ganzen Höhe auftaucht und wo der Boden unter deinen Füßen ein Geheimnis birgt.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-groenplaats": {
      name: "Groenplaats",
      subtitle: "Ein Platz, der einst ein Friedhof war",
      introduction: [
        "Du stehst auf der Groenplaats, einem der lebhaftesten Plätze Antwerpens, mit der Kathedrale, die über die Dächer ragt, und Peter Paul Rubens auf einem Sockel in der Mitte. Der Platz wirkt wie gemacht für Terrassen und Märkte. Jahrhundertelang war er etwas ganz anderes.",
      ],
      sections: [
        {
          heading: "Der Kirchhof der Kathedrale",
          kind: "history",
          paragraphs: [
            "Dieser Platz bildete zusammen mit dem Lijnwaadmarkt, dem Melkmarkt, dem Schoenmarkt und dem Handschoenmarkt rund um die Kathedrale einst deren Friedhof. Die Antwerpener nannten ihn den Groot Kerkhof, den Großen Kirchhof, und später den Groen Kerkhof, den Grünen Kirchhof. Manche verwenden diesen Namen noch heute.",
            "1754 wurde der Friedhof ummauert, doch nicht für lange. 1784 verbot Kaiser Joseph II. aus Gründen der öffentlichen Gesundheit Bestattungen innerhalb der Städte, und 1799 fiel die Mauer. Allmählich wurde der Friedhof zu dem Platz, den du heute siehst.",
            "Ein Gemälde von 1597, unten abgebildet, vermittelt einen Eindruck vom Kirchhof jener Zeit: Ein Leichenzug schwarz gekleideter Trauernder zieht an ihm vorbei, dahinter erhebt sich die Kathedrale.",
          ],
        },
        {
          heading: "Rubens nimmt seinen Platz ein",
          kind: "history",
          paragraphs: [
            "1840 beging Antwerpen den 200. Todestag von Rubens. Willem Geefs entwarf eine Statue, doch das Geld war knapp und die Bronze nicht rechtzeitig fertig. Deshalb wurde am 25. August 1840 auf einem anderen Platz eine vorläufige Gipsversion enthüllt. Erst am 9. und 10. August 1843 bezog der bronzene Rubens hier seinen Platz, mitten auf der Groenplaats.",
            "Geefs stellte ihn als Maler und Diplomaten dar: Zu seinen Füßen liegen eine Palette und ein Degen, denn Rubens diente dem spanischen König auch als Gesandter. Passend zu einem ehemaligen Kirchhof steht die Statue an der Stelle eines alten Friedhofskreuzes über dem Grab eines Bischofs, Antonius d'Espinosa.",
          ],
        },
      ],
      didYouKnow: [
        "Wenn du hier auf einer Terrasse sitzt, sitzt du auf dem, was jahrhundertelang der Begräbnisplatz der Kathedrale war.",
      ],
      transitionToNext:
        "Geh auf die Kathedrale zu. Achte dabei auf die Häuserreihe, die an den Chor der Kirche gebaut ist. Sie verbirgt die Fundamente einer Kathedrale, die nie vollendet wurde.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Onze-Lieve-Vrouwekathedraal",
      subtitle: "Die Liebfrauenkathedrale, die fast noch größer geworden wäre",
      introduction: [
        "Vor dir steht die Onze-Lieve-Vrouwekathedraal, die Liebfrauenkathedrale: eine der größten gotischen Kirchen der Niederen Lande und jahrhundertelang das Wahrzeichen, das Seeleute auf der Schelde als Erstes sahen. Ihr Nordturm, rund 123 Meter hoch, beherrscht noch immer die Silhouette der Stadt.",
        "Wir sind jetzt im Spätmittelalter. Die Kathedrale wurde über etwa 170 Jahre hinweg gebaut, von der Mitte des 14. Jahrhunderts bis 1521, von Generationen von Baumeistern, die wussten, dass sie ihre Vollendung nie erleben würden.",
      ],
      sections: [],
      didYouKnow: [],
      cards: {
        cathedral: {
          title: "Die Kathedrale",
          subtitle: "Zwei Jahrhunderte Bauzeit und ein Plan, der zu groß war",
          sections: [
            {
              heading: "In 170 Jahren erbaut",
              kind: "history",
              paragraphs: [
                "Der Bau begann 1352 und dauerte bis 1521, mit einer langen Pause zwischen 1356 und 1378. Generationen von Baumeistern folgten einander nach demselben Plan, unter ihnen Peter Appelmans sowie Herman und Domien de Waghemakere. Das Geld kam aus Spenden, von den Zünften und von der Stadt; ging es aus, ruhte die Arbeit einfach.",
                "Der Nordturm, rund 123 Meter hoch, wurde um 1518–1521 vollendet und ist bis heute der höchste Kirchturm der Benelux-Länder. Der Bau des Südturms wurde 1475 aus Geldmangel bei etwa 65 Metern eingestellt und nie vollendet.",
              ],
            },
            {
              heading: "Noch größer: das Nieuwerck",
              kind: "history",
              paragraphs: [
                "1521, gerade als die Kirche fertig war, beschloss Antwerpen, dass sie nicht groß genug sei. Die reichste Stadt Nordeuropas wollte eine Kirche, die dazu passte, und Domien de Waghemakere und Rombout Keldermans entwarfen eine gigantische Erweiterung des Chors, das Nieuwerck.",
                "Am 15. Juli 1521 legte der junge Kaiser Karl V. persönlich den Grundstein. Doch schon um 1528 ließ die Begeisterung nach, und in der Nacht vom 5. auf den 6. Oktober 1533 beschädigte ein Großbrand Dach und Pfeiler der Kirche schwer; seine Ursache ist unbekannt. Alles Geld floss in die Reparatur des bestehenden Baus, und 1537 gab man das Nieuwerck endgültig auf.",
              ],
            },
            {
              heading: "Stürme der Geschichte",
              kind: "history",
              paragraphs: [
                "Die Kathedrale hat vieles überstanden. Beim Bildersturm von 1566, einer Welle protestantischer Wut gegen religiöse Bilder, wurde ein Großteil ihrer Ausstattung zerschlagen. Zwei Jahrhunderte später besetzten französische Revolutionstruppen die Stadt, schlossen die Kirche und schafften ihre Schätze fort.",
                "Vieles von dem, was du heute drinnen sehen kannst, wurde später zurückgebracht oder restauriert, darunter Altarbilder von Rubens, die zu seinen berühmtesten Werken zählen.",
              ],
            },
          ],
          didYouKnow: [
            "Das Nieuwerck wurde nie gebaut, verschwand aber nicht ganz. Seine Fundamente und Pfeiler haben in der Häuserreihe rund um den Chor überdauert, zwischen dem Lijnwaadmarkt und der Groenplaats. Einige dieser Häuser stehen buchstäblich auf dem Anfang einer Kathedrale, die nie vollendet wurde.",
            "Der Grundstein Karls V. trug eine lateinische Inschrift, die festhielt, dass der Kaiser ihn an den Iden des Juli 1521 gelegt hatte.",
          ],
        },
        "quinten-matsijs": {
          title: "Quinten Matsijs",
          subtitle: "Vom Schmied zum Maler?",
          sections: [
            {
              heading: "Ein Maler für die Kathedrale",
              kind: "history",
              paragraphs: [
                "Quinten Matsijs (um 1466–1530) wurde in Löwen als Sohn eines Schmieds geboren und wurde einer der führenden Maler Antwerpens in dessen Goldenem Zeitalter. 1491 wurde er Meister in der Lukasgilde, der Zunft der Maler.",
                "Seine Verbindung zu dieser Kirche ist echt. Zwischen 1508 und 1511 malte er für den Altar der Schreinerzunft in der Kathedrale ein großes Altarbild: eine Beweinung Christi zwischen Szenen von Johannes dem Täufer und Johannes dem Evangelisten. Heute hängt es im KMSKA, dem Königlichen Museum der Schönen Künste Antwerpens.",
              ],
            },
            {
              heading: "Der Schmied, der aus Liebe malte",
              kind: "legend",
              paragraphs: [
                "Antwerpen erzählt über ihn eine romantische Geschichte. Quinten, heißt es, war ein Schmied, der sich in ein Mädchen verliebte, das einen Maler einem Schmied vorzog. Also legte er den Hammer weg und griff zum Pinsel. Karel van Mander, der die Geschichte 1604 aufschrieb, nennt auch eine andere Version: Eine lange Krankheit habe ihm die schwere Schmiedearbeit unmöglich gemacht, und er habe begonnen, Drucke zu kolorieren, um seine Mutter zu unterstützen.",
                "Einer anderen Erzählung nach malte er auf ein Gemälde des Vaters seiner Liebsten eine so lebensechte Fliege, dass der Mann sie wegzuwischen versuchte und daraufhin der Heirat zustimmte.",
              ],
            },
            {
              heading: "Was Historiker sagen",
              kind: "interpretation",
              paragraphs: [
                "Es gibt keinen Beleg dafür, dass Quinten selbst je als Schmied gearbeitet hat; sein Vater tat es. Historiker sehen die Geschichte als Legende, die mit der Zeit gewachsen ist. Alt ist sie allerdings: Schon der lateinische Vers unter seinem Porträt, 1572 in Antwerpen gedruckt und oben auf dieser Karte abgebildet, lässt ihn sagen, dass die Liebe den Schmied zum Maler machte.",
              ],
            },
          ],
          didYouKnow: [
            "Direkt neben der Kathedrale, am Handschoenmarkt, steht ein Brunnen mit einem gotischen schmiedeeisernen Gehäuse, gekrönt von einem kleinen Brabo. Die Überlieferung schreibt die Schmiedearbeit Matsijs zu, bewiesen ist das aber nicht. Ein paar Meter weiter, an der Westfassade der Kathedrale, trägt ein Gedenkstein mit seinem Porträt die lateinische Zeile „Connubialis amor de Mulcibre fecit Apellem“: Die eheliche Liebe machte den Schmied zum Maler.",
          ],
        },
        "nello-patrasche": {
          title: "Nello & Patrasche",
          subtitle: "Ein englischer Roman, ein japanischer Klassiker und eine Marmorstatue",
          sections: [
            {
              heading: "Die Geschichte",
              kind: "fiction",
              paragraphs: [
                "Nello ist ein armer Waisenjunge, der in einem Dorf „eine Meile von Antwerpen“ lebt. Mit seinem Hund Patrasche, der den Karren zieht, bringt er jeden Tag Milch in die Stadt. Nello träumt davon, Maler zu werden, und sehnt sich danach, die beiden Gemälde von Rubens in der Kathedrale zu sehen, doch sie sind verhüllt, und nur wer bezahlt, darf sie sehen.",
                "Er nimmt an einem Zeichenwettbewerb teil, gewinnt nicht und verliert alles. An Heiligabend findet er die Kirche offen und sieht endlich „Die Kreuzaufrichtung“ und „Die Kreuzabnahme“. Am nächsten Morgen findet man Nello und Patrasche zusammen vor den Gemälden, erfroren.",
              ],
            },
            {
              heading: "Ein Buch aus England, ein Klassiker in Japan",
              kind: "history",
              paragraphs: [
                "„Ein Hund aus Flandern“ (A Dog of Flanders) schrieb die englische Autorin Ouida (Marie Louise de la Ramée). Die Geschichte erschien Ende 1871 in einer Zeitschrift und 1872 als Buch. Die beiden Gemälde sind echt: Sie hängen noch immer in dieser Kathedrale. Im Roman stehen sie für die Kunst, nach der Nello sich sehnt und die Menschen verborgen bleibt, die nicht bezahlen können.",
                "In Flandern selbst war die Geschichte lange kaum bekannt. Im Ausland wurde sie zum Klassiker: In den Vereinigten Staaten wurde sie ab 1935 mehrfach verfilmt, und in Japan machte die Anime-Serie von 1975 sie zu einem Kinderklassiker. Ein Dokumentarfilm von 2007 hieß passenderweise „Patrasche, a Dog of Flanders – Made in Japan“.",
              ],
            },
            {
              heading: "Die Statue",
              kind: "history",
              paragraphs: [
                "2016 wurde auf dem Handschoenmarkt vor der Kathedrale eine Statue von Batist Vermeulen aufgestellt. Sie ersetzte einen Gedenkstein von 2003. Nello und Patrasche liegen einander in den Armen und schlafen, unter einer Decke aus den Pflastersteinen des Platzes selbst. Seit November 2022 wird sie nachts beleuchtet.",
              ],
            },
          ],
          didYouKnow: [
            "Ouida nennt Nellos Dorf nie beim Namen. Die Verbindung zu Hoboken, heute ein Stadtteil von Antwerpen, wurde erst später hergestellt.",
          ],
        },
      },
      lookAt: [
        {
          title: "Anderthalb Türme",
          body: "Schau dir die Vorderseite der Kathedrale an. Der linke (nördliche) Turm steigt bis zu seiner eleganten Spitze auf; der rechte (südliche) Turm endet auf etwa halber Höhe. Geplant waren zwei große Türme, doch nur einer wurde je vollendet. Sieh dir die Radierung von 1649 auf dieser Seite an: Schon damals war die Silhouette genauso schief.",
        },
      ],
      transitionToNext:
        "Geh um die Kathedrale herum zur Oude Koornmarkt. Halte gut Ausschau nach einem schmalen Eingang zwischen den Häusern: Er führt in eine versteckte Gasse, die die Zeit vergessen zu haben scheint.",
    },

    // ── 10 ───────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Ein geheimer Durchgang ins alte Antwerpen",
      introduction: [
        "Tritt durch den schmalen Eingang, und der Lärm der Stadt verschwindet. Du bist im Vlaeykensgang, einer gewundenen Gasse zwischen alten Backsteinmauern, kleinen Innenhöfen und niedrigen Häuschen. Für einen Moment kannst du dir leicht vorstellen, wie Antwerpen vor Jahrhunderten war.",
        "Der Vlaeykensgang wird oft als eine der ältesten und schmalsten Gassen Antwerpens bezeichnet. Das Denkmalinventar stellt keine solche Rangliste auf, bestätigt aber, was den Ort besonders macht: ein L-förmiger, gepflasterter Durchgang, gesäumt von elf kleinen Hinterhäusern, der sein altes Erscheinungsbild fast vollständig bewahrt hat.",
      ],
      sections: [
        {
          heading: "Hinterhäuser, die zur Gasse wurden",
          kind: "history",
          paragraphs: [
            "Der Durchgang wurde 1591 angelegt, trug damals aber noch nicht diesen Namen; der Name ist jünger als die Gasse selbst. Die kleinen Gebäude entstanden im 16. Jahrhundert als Hinterhäuser und Lagerräume hinter den Häusern der umliegenden Straßen. Mit der Zeit wuchs der Komplex zu einem inneren Durchgang zusammen, und ab dem 17. Jahrhundert dienten die Gebäude als kleine, bescheidene Wohnungen.",
          ],
        },
        {
          heading: "In letzter Minute gerettet",
          kind: "history",
          paragraphs: [
            "In den 1960er-Jahren war die Gasse stark heruntergekommen, und es gab Pläne, sie für einen Parkplatz abzureißen. 1969 kaufte der Antiquitätenhändler und Innenarchitekt Axel Vervoordt den Komplex. Fassaden und Dächer wurden 1973 unter Denkmalschutz gestellt, und 1977 begann die Restaurierung.",
          ],
        },
      ],
      didYouKnow: [
        "Einer der stimmungsvollsten Winkel des alten Antwerpen existiert heute, weil er einst als so wertlos galt, dass man ihn in einen Parkplatz verwandeln wollte.",
      ],
      transitionToNext:
        "Folge der Gasse und den Seitenstraßen bis zum großen Marktplatz der Stadt. Mach dich darauf gefasst, nach oben zu schauen: Die Fassaden ringsum sind voller Gold.",
    },

    // ── 11 ───────────────────────────────────────────────────────────────
    "classics-grote-markt": {
      name: "Grote Markt & die Zunfthäuser",
      subtitle: "Der goldene Platz, der jünger ist, als er aussieht",
      introduction: [
        "Du bist auf dem Grote Markt, dem Hauptplatz Antwerpens. Auf der einen Seite steht das Rathaus; rund um den restlichen Platz reihen sich hohe Zunfthäuser mit Treppen- und Volutengiebeln, gekrönt von vergoldeten Figuren, die in der Sonne glänzen.",
        "Die Zünfte waren die Vereinigungen von Handwerkern und Händlern, die einen Großteil des städtischen Lebens regelten: wer arbeiten durfte, was verkauft werden durfte und in welcher Qualität. Ihre Häuser hier waren ihre Aushängeschilder.",
      ],
      sections: [
        {
          heading: "Die Spanische Furie",
          kind: "history",
          paragraphs: [
            "Im November 1576 plünderten meuternde spanische Soldaten Antwerpen; mehr darüber erfährst du am Rathaus. Das Feuer, das sie legten, fegte über diesen Platz und zerstörte die Häuser, die hier standen. Was danach entstand, war eine neue Generation von Gebäuden.",
            "Das schönste Beispiel ist das Haus des Oude Voetboog, der Sankt-Georgs-Gilde. Es wurde 1515–1516 gebaut, 1576 zerstört und 1580–1582 im Renaissancestil wiederaufgebaut. Seine Fassade gilt als einer der Höhepunkte der Antwerpener Renaissancearchitektur.",
          ],
        },
        {
          heading: "Ein Traum des 19. Jahrhunderts vom Goldenen Zeitalter",
          kind: "history",
          paragraphs: [
            "Vieles von dem, was du siehst, ist jünger, als es aussieht. 1895 hinterließ ein Bürger namens R. Joostens in seinem Testament Geld, um dem Grote Markt seinen einstigen Glanz zurückzugeben. Vom späten 19. bis ins frühe 20. Jahrhundert wurden die Fassaden auf der Nordseite des Platzes sowie die Nummer 44 auf der Südseite frei im Geist des 16. Jahrhunderts rekonstruiert und verschönert.",
          ],
        },
      ],
      didYouKnow: [
        "Mehrere der „alten“ Zunfthäuser an diesem Platz sind in Wirklichkeit Rekonstruktionen aus der Zeit um 1900. Antwerpen bewahrte sein Goldenes Zeitalter nicht nur, es erfand es auch liebevoll neu.",
      ],
      lookAt: [
        {
          title: "Die vergoldeten Figuren",
          body: "Schau hinauf zu den Giebelspitzen. Finde den goldenen heiligen Georg, der auf dem Haus des Oude Voetboog, der Sankt-Georgs-Gilde, hoch zu Ross gegen den Drachen kämpft. Such dann nach den anderen Figuren und Emblemen: Viele verweisen auf die Zunft, der das Haus gehörte. Vergleiche den Platz mit dem Foto von 1905 auf dieser Seite.",
        },
      ],
      transitionToNext:
        "In der Mitte des Platzes ist eine Bronzefigur gerade dabei, etwas in die Luft zu werfen. Geh hinüber zum Brunnen: Er erzählt die berühmteste Geschichte, die Antwerpen hat.",
    },

    // ── 12 ───────────────────────────────────────────────────────────────
    "classics-brabo": {
      name: "Der Brabobrunnen",
      subtitle: "Ein Riese, eine Hand und der Name einer Stadt",
      introduction: [
        "Vor dir steht der Brabobrunnen. Oben auf einem Felsenhaufen, umgeben von Meereswesen und Figuren, lehnt sich ein junger Mann zurück und wirft etwas weit von sich. Sieh genau hin, was er hält: Es ist eine Hand.",
      ],
      sections: [
        {
          heading: "Die Sage von Druon Antigoon",
          kind: "legend",
          paragraphs: [
            "Vor langer Zeit, so heißt es, lebte an der Schelde ein Riese namens Druon Antigoon. Er bewachte den Fluss und verlangte von jedem Schiff, das passieren wollte, einen Zoll. Wer sich weigerte oder nicht zahlen konnte, dem wurde eine Hand abgehackt, und der Riese warf sie in den Fluss.",
            "Dann kam ein junger römischer Soldat namens Silvius Brabo. Er forderte den Riesen heraus, besiegte ihn, schlug ihm seinerseits die Hand ab und warf sie in die Schelde. Und so, sagt die Sage, bekam die Stadt ihren Namen: hand werpen, „eine Hand werfen“, Antwerpen.",
          ],
        },
        {
          heading: "Was Historiker denken",
          kind: "interpretation",
          paragraphs: [
            "Eine wunderbare Geschichte, aber keine Erklärung, die Historiker ernst nehmen. Die Herkunft des Namens Antwerpen ist ungewiss. Die meisten Erklärungen bringen ihn nicht mit Händen in Verbindung, sondern mit Land: mit aufgeschüttetem Boden am Fluss, einem Stück Land „davor“, vom Wasser gebildet oder angeschwemmt. Die Sage vom Riesen ist ein viel späterer Versuch, einen Namen zu erklären, dessen wahre Herkunft in Vergessenheit geraten war.",
          ],
        },
        {
          heading: "Der Brunnen",
          kind: "history",
          paragraphs: [
            "Den Brunnen schuf der Antwerpener Bildhauer Jef Lambeaux, der seinen Entwurf bereits 1883 weitgehend ausgearbeitet hatte. 1887 wurde er auf dem Grote Markt vor dem Rathaus aufgestellt, zu einer Zeit, als Antwerpen seine eigene Geschichte und Identität mit Begeisterung feierte.",
          ],
        },
      ],
      didYouKnow: [
        "Die Hände aus der Sage begegnen dir in Antwerpen überall: im Stadtwappen, das eine Burg mit zwei Händen darüber zeigt, und in den „Antwerpener Händen“ aus Schokolade und Gebäck, die in den Geschäften ringsum verkauft werden.",
      ],
      transitionToNext:
        "Dreh dich zu dem langen, hellen Gebäude hinter Brabo. Es überstand eine der schrecklichsten Nächte in der Geschichte der Stadt.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
    "classics-stadhuis": {
      name: "Das Rathaus",
      subtitle: "Mit Stolz erbaut, in blinder Wut verbrannt",
      introduction: [
        "Vor dir steht das Stadhuis, das Antwerpener Rathaus. Seine lange Fassade ist ruhig und waagerecht gegliedert, darüber erhebt sich ein hoher, reich verzierter Mittelteil. Zur Zeit seines Baus war es eines der modernsten Gebäude Europas: ein Renaissancepalast für eine Stadt auf dem Höhepunkt ihrer Macht.",
      ],
      sections: [
        {
          heading: "Ein Palast für die Stadt",
          kind: "history",
          paragraphs: [
            "Das Rathaus wurde zwischen 1561 und 1565 nach Entwürfen von Cornelis Floris de Vriendt gemeinsam mit anderen Architekten und Künstlern gebaut. Antwerpen war damals eine der reichsten Städte Europas und wollte seine Regierung in einem Gebäude unterbringen, das dies zeigte.",
          ],
        },
      ],
      didYouKnow: [
        "Das Gebäude, das du siehst, wurde nach dem Brand von 1576 wiederhergestellt. Sieh dir das Foto auf dieser Seite an, aufgenommen Mitte der 1860er-Jahre: Vom Platz aus sah das Rathaus damals ganz ähnlich aus wie heute.",
      ],
      lookAt: [
        {
          title: "Der Mittelteil",
          body: "Vergleiche die schlichten Flügel der Fassade mit dem Mittelteil, der mit Säulen, Nischen und Statuen übereinander aufgebaut ist und über die Dachlinie hinausragt. Dieser Kontrast, ruhig und geordnet mit einem Ausbruch an Schmuck in der Mitte, ist typisch für die Renaissance, die Floris nach Antwerpen brachte.",
        },
      ],
      // The Spanish Fury, as slides: the approved section, paragraph by paragraph, each with its images.
      cards: {
        "fury-attack": {
          title: "Die Spanische Furie, 4. November 1576",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Kaum zehn Jahre später wurde dieses Gebäude Zeuge einer Katastrophe. Die Niederlande hatten sich gegen den spanischen König erhoben, und seine Soldaten in der Region waren lange nicht bezahlt worden. Am 4. November 1576 brachen meuternde spanische Truppen aus der Zitadelle südlich der Stadt aus, verstärkt durch Meuterer aus Aalst, stürmten Antwerpen und begannen, die Stadt zu plündern.",
              ],
            },
          ],
        },
        "fury-city-hall": {
          title: "Das Rathaus in Flammen",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Die Stadtregierung organisierte von diesem Rathaus aus, hier am Grote Markt, einen Gegenangriff. Antwerpens Bürger verteidigten sich auf dem Platz und im Gebäude und schossen aus den Fenstern des Rathauses auf die spanischen Reiter, die über den Platz stürmten. Die Reiter erlitten schwere Verluste, bis einige von ihnen eindrangen und das Gebäude mit mitgebrachten Strohbündeln in Brand steckten.",
              ],
            },
          ],
        },
        "fury-city": {
          title: "Die Stadt im Chaos",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Die Flammen griffen auf die umliegenden Häuser über: Etwa sechshundert brannten nieder, die meisten hinter und neben dem Rathaus. Vom Rathaus selbst blieben nur die Außenmauern stehen.",
              ],
            },
            {
              kind: "history",
              paragraphs: [
                "Wie viele Menschen starben, ist nicht genau bekannt. Die Schätzungen reichen von mehreren Hundert bis zu etwa 8.000; viele Historiker gehen davon aus, dass mehr als 7.000 Menschen ihr Leben verloren. Das Ereignis ging als Spanische Furie in die Geschichte ein und erschütterte das Selbstvertrauen der Stadt, die Europas große Handelsmetropole gewesen war.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Verlass den Grote Markt und geh durch ruhige Straßen nach Osten, zu einem kleinen Platz, den viele Besucher den schönsten Antwerpens nennen.",
    },

    // ── 14 ───────────────────────────────────────────────────────────────
    "classics-conscienceplein": {
      name: "Hendrik Conscienceplein",
      subtitle: "Der Mann, der sein Volk lesen lehrte",
      introduction: [
        "Du stehst auf dem Hendrik Conscienceplein, einem ruhigen, geschlossenen Platz vor einer Barockkirche. Vor der alten Bibliothek steht die Statue des Schriftstellers Hendrik Conscience.",
      ],
      sections: [
        {
          heading: "Ein Schriftsteller für die Flamen",
          kind: "history",
          paragraphs: [
            "Im 19. Jahrhundert beherrschte das Französische in Belgien das öffentliche Leben, die Verwaltung und die Literatur, auch in Flandern. Hendrik Conscience schrieb auf Niederländisch, für ganz gewöhnliche flämische Leser. Sein historischer Roman De Leeuw van Vlaenderen (Der Löwe von Flandern), erschienen 1838, wurde zum Symbol flämischen Stolzes und flämischer Emanzipation.",
            "1883 erhielt er eine Statue auf diesem Platz, der bis dahin Jezuïetenplein hieß, Jesuitenplatz, und nach ihm umbenannt wurde. Für einen lebenden Autor war das unerhört. Conscience saß dem Bildhauer Frans Joris selbst Modell, konnte aber wegen seiner schlechten Gesundheit nicht an der Enthüllung im August 1883 teilnehmen. Einen Monat später starb er.",
          ],
        },
      ],
      didYouKnow: [
        "Die berühmten Worte auf der Statue, „Hij leerde zijn volk lezen“ („Er lehrte sein Volk lesen“), sprach bei der Enthüllung zuerst der Dichter Jan Van Beers. Erdacht hatte sie aber nicht der Bildhauer: Die Idee stammte von Henriëtte Mertens, der Frau des Dichters.",
      ],
      transitionToNext:
        "Dreh dich jetzt um. Die reich verzierte Kirche hinter dir ist die nächste Station, und hier betreten wir das Zeitalter von Rubens.",
    },

    // ── 15 ───────────────────────────────────────────────────────────────
    "classics-carolus-borromeus": {
      name: "Sint-Carolus Borromeuskerk",
      subtitle: "Das verlorene Meisterwerk von Rubens",
      introduction: [
        "Vor dir erhebt sich die Fassade der Sint-Carolus Borromeuskerk, der Kirche des heiligen Karl Borromäus: vielschichtig, skulptural, theatralisch, eine völlig andere Welt als die gotische Kathedrale. Das ist der Barock, der Stil von Rubens und der Gegenreformation, der die Sinne überwältigen und die Gläubigen bewegen sollte.",
      ],
      sections: [
        {
          heading: "Das Prunkstück der Jesuiten",
          kind: "history",
          paragraphs: [
            "Die Kirche wurde zwischen 1615 und 1621 von den Jesuiten gebaut, dem katholischen Orden, der an vorderster Front der Gegenreformation stand. Entworfen wurde sie von den Jesuitenarchitekten Pieter Huyssens und François d'Aguilon und geweiht dem Gründer des Ordens, dem heiligen Ignatius von Loyola.",
            "Peter Paul Rubens, damals auf dem Höhepunkt seines Ruhms, war eng beteiligt. Für die Seitenschiffe und Emporen fertigte seine Werkstatt nach seinen Skizzen 39 Deckengemälde an; der junge Anthonis van Dyck half bei der Arbeit. Ein Jahrhundert lang war dies einer der prächtigsten Kirchenräume Europas.",
          ],
        },
        {
          heading: "Der Blitz von 1718",
          kind: "history",
          paragraphs: [
            "Am 18. Juli 1718 schlug der Blitz in die Kirche ein und setzte sie in Brand. Alle 39 Deckengemälde von Rubens gingen verloren. Das Innere wurde danach in einem strengeren Stil wiederaufgebaut, nach Entwürfen von Jan Pieter van Baurscheit dem Älteren.",
            "Später im 18. Jahrhundert wurde der Jesuitenorden aufgehoben, und die Kirche erhielt einen neuen Patron: den heiligen Karl Borromäus, dessen Namen sie bis heute trägt.",
          ],
        },
      ],
      didYouKnow: [
        "Wie Rubens' Decken aussahen, wissen wir nur dank einer Serie von Drucken: Kupferstiche von Jan Punt nach Aquarellen von Jacob de Wit. Das Bild auf dieser Seite ist einer davon: ein verlorener Rubens, auf Papier bewahrt.",
      ],
      transitionToNext:
        "Vom Barock gehen wir nun noch weiter zurück, ins Spätmittelalter. Geh nach Norden Richtung Fluss, zu einem auffälligen Gebäude mit rot-weißen Streifen.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
    "classics-vleeshuis": {
      name: "Das Vleeshuis",
      subtitle: "Ein Palast für Metzger",
      introduction: [
        "Vor dir steht das Vleeshuis, das Fleischhaus. Mit seinen hohen Giebeln, Türmen und den auffälligen Bändern aus rotem Backstein und weißem Stein sieht es aus wie eine Burg oder ein Rathaus. Gebaut wurde es für die Metzger der Stadt.",
      ],
      sections: [
        {
          heading: "Die Zunft der Metzger",
          kind: "history",
          paragraphs: [
            "Das Vleeshuis wurde zwischen 1501 und 1504 im spätgotischen Stil für die Metzgerzunft gebaut. Der Entwurf stammte von Herman de Waghemakere dem Älteren; nach seinem Tod 1502 führte wahrscheinlich sein Sohn Domien die Arbeiten fort, derselbe Domien, der später die Börse baute und an der Kathedrale und am Steen mitwirkte.",
            "Das Gebäude verrät viel darüber, wie die Lebensmittelversorgung in einer mittelalterlichen Stadt organisiert war. Das Erdgeschoss war eine Markthalle mit 62 Fleischbänken, an denen die Metzger der Zunft ihr Fleisch verkauften; hier lag auch die Kapelle der Zunft. Oben befanden sich der Versammlungsraum der Zunft, ihr Festsaal und ihr Archiv. Die Zunft bestimmte, wer verkaufen durfte, und wo.",
          ],
        },
      ],
      didYouKnow: [
        "Nicht alles durfte drinnen verkauft werden. Innereien und Gedärme waren in der Halle verboten; sie wurden in kleinen Läden verkauft, den penshuisjes, die draußen zwischen den Strebepfeilern an das Gebäude angebaut waren.",
        "Die rot-weißen Bänder im Mauerwerk heißen speklagen, „Speckschichten“. Man könnte meinen, sie seien ein Scherz über die Metzger, doch mit dem Fleischhandel haben sie nichts zu tun: Sie waren einfach eine Baumode, die bis weit ins 17. Jahrhundert beliebt blieb.",
      ],
      lookAt: [
        {
          title: "Die Speckschichten",
          body: "Schau dir die Mauern an: Reihen aus rotem Backstein wechseln sich mit Bändern aus hellem Sandstein ab. Jetzt, wo du ihren Namen kennst, wirst du diese speklagen an vielen alten Gebäuden in Antwerpen und anderswo in Flandern entdecken.",
        },
      ],
      galleries: {
        "vleeshuis-postcards": {
          title: "Das Vleeshuis auf alten Postkarten",
          intro: "Drei alte Postkarten des Museum Vleeshuis zeigen seine Räume, eingerichtet mit Kaminen, Möbeln und Objekten aus der Sammlung.",
        },
      },
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Finde die alte Mauer der burcht",
        task: [
          "Finde die alte Mauer, die seit dem frühen 13. Jahrhundert die burcht schützte.",
          "Das Foto ist dein Hinweis: Such rund um das Vleeshuis ein Stück Mauer wie dieses. Gefunden? Dann tippe unten auf die Schaltfläche.",
        ],
      },
      transitionToNext:
        "Geh ein paar Straßen weiter nach Norden, ins alte Hafenviertel. Hier steht eine Kirche, deren Geschichte mit dem Fluss verbunden ist, und mit dem Feuer.",
    },

    // ── 17 ───────────────────────────────────────────────────────────────
    "classics-sint-paulus": {
      name: "Sint-Pauluskerk",
      subtitle: "Gotisch, barock und aus den Flammen gerettet",
      introduction: [
        "Vor dir steht die Sint-Pauluskerk, die Pauluskirche: eine gotische Kirche mit einem überraschenden barocken Turm obendrauf. Sie steht nahe der Schelde, in dem Viertel, das jahrhundertelang den Seeleuten, Hafenarbeitern und Kaufleuten gehörte.",
      ],
      sections: [
        {
          heading: "Ein Kloster am Fluss",
          kind: "history",
          paragraphs: [
            "Dies war die Kirche der Dominikaner, eines Ordens von Predigermönchen. Eine frühere Kirche an dieser Stelle weihte 1276 der berühmte Gelehrte Albertus Magnus. Ab 1517 wurde als Ersatz die heutige Kirche gebaut, im 16. Jahrhundert, als Antwerpens Handel blühte.",
            "Die Schelde war nie weit. Der Fluss brachte die Schiffe, die Waren und die Menschen, die dieses Viertel füllten, und die Kirche diente einem Quartier, dessen Rhythmus von den Gezeiten und dem Hafen bestimmt wurde.",
          ],
        },
        {
          heading: "Zwei Brände",
          kind: "history",
          paragraphs: [
            "1679 zerstörte ein heftiger Brand einen Teil der Gewölbe des Mittelschiffs und die Spitze der Westfassade. Bei den Reparaturen 1680–1681 erhielt die Kirche ihren barocken Turmhelm, den du heute siehst.",
            "Fast drei Jahrhunderte später, im April 1968, schlug das Feuer erneut zu. Das gesamte Dach ging verloren, Gewölbe und Innenraum wurden beschädigt, der barocke Turmhelm brannte völlig aus, und drei Viertel des angrenzenden Klosters wurden zur Ruine. Die Kirche wurde restauriert; ihre Schätze, darunter Gemälde von Rubens, Van Dyck und Jordaens, sind drinnen noch immer zu sehen.",
          ],
        },
      ],
      didYouKnow: [
        "Neben der Kirche legten die Dominikaner zwischen 1699 und 1747 einen Kalvarienberg an: einen Weg, gesäumt von Dutzenden Statuen, der zum Kreuz hinaufführt, gedacht als eine Art Theater aus Stein. Er gehört zu den überraschendsten Anblicken der Stadt.",
      ],
      transitionToNext:
        "Geh zum Fluss. Am Ufer steht das älteste Gebäude Antwerpens, der letzte Rest der Burg, mit der die Stadt begann.",
    },

    // ── 18 ───────────────────────────────────────────────────────────────
    "classics-het-steen": {
      name: "Het Steen",
      subtitle: "Das letzte Stück der Burg, mit der Antwerpen begann",
      introduction: [
        "Vor dir steht Het Steen, „der Stein“: eine kleine Burg mit Türmen und Zinnen am Ufer der Schelde. Sie sieht aus wie eine Märchenfestung, doch was du siehst, ist nur ein Bruchstück von etwas viel Größerem: der burcht, dem befestigten Kern, aus dem Antwerpen hervorging.",
      ],
      sections: [
        {
          heading: "Wo die Stadt geboren wurde",
          kind: "history",
          paragraphs: [
            "Um das Jahr 850 stand hier eine Fluchtburg, durch einen Erdwall gegen Überfälle der Wikinger geschützt. Im späten 10. Jahrhundert wurde das Gelände aufgeschüttet und wahrscheinlich ein Graben ausgehoben. Um 1200–1225 entstand die steinerne Burg, Het Steen, zusammen mit einer Mauer rund um die burcht.",
            "Ab dem frühen 14. Jahrhundert diente das Gebäude als Gefängnis, eine Rolle, die es mehr als fünf Jahrhunderte lang behielt, bis 1823.",
          ],
        },
        {
          heading: "Der Henker von Antwerpen",
          kind: "history",
          paragraphs: [
            "Als städtisches Gefängnis war Het Steen Teil der Antwerpener Justiz. Der schout, der Amtmann der Stadt, erhob die Anklage; die Schöffen urteilten; und der Henker vollstreckte das Urteil. Verdächtige wurden hier verhört, manchmal unter Folter, in einer unterirdischen Kammer.",
            "Zwischen 1405 und 1550 vollzog der Antwerpener Henker mindestens 336 Enthauptungen mit dem Schwert, die meisten auf dem Grote Markt vor dem Rathaus. Andere Urteile wurden auf der Meir, am Ufer der Schelde und auf dem Galgenfeld vollstreckt. Zwischen 1558 und 1562 wurden mehr als fünfzig Verurteilte ertränkt, vorzugsweise heimlich im Inneren von Het Steen: Öffentliche Ketzerverbrennungen hatten zu viel Unruhe ausgelöst.",
            "Den Henkern selbst erging es nicht immer gut. 1508 verpfuschte ein neuer Henker, ein ehemaliger Schustergeselle, seine erste Enthauptung, und Kinder bewarfen ihn mit Steinen. Und am 17. Januar 1565 wurde Meister Geleyn, seit 1542 Henker der Stadt, selbst auf der Meir enthauptet, verurteilt wegen Mordes, Diebstahls und Gewalttaten.",
          ],
        },
        {
          heading: "Karl V. baut neu",
          kind: "history",
          paragraphs: [
            "Um 1520 ließ Kaiser Karl V. Het Steen nach einem Entwurf von Domien de Waghemakere und Rombout II. Keldermans neu bauen, dieselben Namen, die dir schon an der Kathedrale begegnet sind. Von der älteren Burg blieb nur der Sockel erhalten. 1549 schenkte Karl V. das Gebäude der Stadt.",
          ],
        },
        {
          heading: "Der Tag, an dem die Burg verschwand",
          kind: "history",
          paragraphs: [
            "Jahrhundertelang war Het Steen zwischen den Häusern und Straßen der alten burcht versteckt. Dann, in den 1880er-Jahren, wurden die Scheldekais für den modernen Hafen begradigt und neu gebaut. Das alte Burgviertel wurde abgerissen; die Burgmauer am Fluss verschwand 1883. Nur Het Steen blieb erhalten, wurde 1887–1890 restauriert und erhielt einen neuen neugotischen Nordflügel.",
            "1952 wurde es zum Nationalen Schifffahrtsmuseum. Nach einer Renovierung ab 2018 öffnete es im Oktober 2021 wieder.",
          ],
        },
      ],
      didYouKnow: [
        "Was du als „die Burg“ siehst, ist nur ein kleiner Teil der mittelalterlichen burcht. Das meiste wurde in den 1880er-Jahren abgerissen, um Platz für die Kais zu schaffen.",
        "Het Steen diente vom frühen 14. Jahrhundert bis 1823 als Gefängnis: mehr als 500 Jahre lang.",
        "Nur wenige echte Folter- oder Hinrichtungswerkzeuge sind erhalten: 1794 verbrannten die Franzosen die meisten davon.",
      ],
      lookAt: [
        {
          title: "Zwei Arten von Stein",
          body: "Schau dir den unteren Teil der Mauern an. Der Sockel besteht aus dunkelgrauem Doorniker Stein (aus Tournai): der einzige Teil, der von der älteren Burg erhalten ist. Darüber erhebt sich der hellere Sandstein des Neubaus Karls V. aus dem frühen 16. Jahrhundert. Du blickst hier buchstäblich auf zwei Epochen, die übereinander gestapelt sind.",
        },
        {
          title: "Die kleine Figur über dem Tor",
          body: "Such über dem Eingangstor nach einer kleinen, verwitterten Steinfigur. Der Überlieferung nach stellt sie Semini dar, einen alten Fruchtbarkeitsgott. Laut dem Denkmalinventar wurde sie um 1587 verstümmelt, angeblich von den Jesuiten, die sie unanständig fanden. Und doch hat sie überlebt; sie ist bis heute da.",
        },
      ],
      transitionToNext:
        "Geh die letzten Schritte zum Wasser. Unsere Reise zurück durch die Zeit endet dort, wo die Geschichte Antwerpens begann.",
    },

    // ── 19 ───────────────────────────────────────────────────────────────
    "classics-scheldt": {
      name: "Die Schelde",
      subtitle: "Wo alles begann",
      introduction: [
        "Stell dich ans Ufer und schau auf den Fluss. Die Schelde ist hier breit, grau und unruhig, von den Gezeiten der Nordsee hin- und hergezogen. Sie mag wie das Ende der Stadt aussehen. In Wahrheit ist sie der Grund, warum es die Stadt gibt.",
      ],
      sections: [
        {
          heading: "Alles, was du gesehen hast",
          kind: "interpretation",
          paragraphs: [
            "Denk an den Rundgang zurück. Die Burg hinter dir wurde gebaut, um diesen Fluss zu bewachen. Das Vleeshuis, die Zunfthäuser und die Börse wurden mit dem Handel bezahlt, den er trug. Der Turm der Kathedrale war das Erste, was Seeleute sahen. Kaufleute aus ganz Europa kamen wegen der Schiffe, die hier anlegten, zur Handelsbeurs. Rubens malte für eine Stadt, die der Fluss reich gemacht hatte. Selbst die Diamanten und der prächtige Bahnhof gehören zu einer Stadt, die der Hafen mächtig gemacht hat.",
            "Der Fluss brachte Reichtum, aber auch Krieg, Zuwanderer, Ideen und Kunst. Er machte Antwerpen international, lange bevor es dieses Wort gab.",
          ],
        },
        {
          heading: "Ein Fluss, geschlossen und wieder geöffnet",
          kind: "history",
          paragraphs: [
            "Die Schelde konnte der Stadt auch genommen werden. Nach dem Fall Antwerpens 1585 blockierte die Flotte der Republik der Vereinigten Niederlande den Fluss, und Antwerpens Zugang zum Meer war zwei Jahrhunderte lang abgeschnitten. Erst 1795 wurde die Schifffahrt offiziell wieder freigegeben. Um 1811 ließ Napoleon hier neue Hafenbecken ausheben, und 1863 kaufte Belgien schließlich den alten niederländischen Scheldezoll ab.",
            "In den 1880er-Jahren wurden die Kais für den modernen Hafen begradigt, der Moment, in dem Het Steen seine Burg verlor. Und der Fluss verlangt noch immer Respekt: Nach der Sturmflut vom 3. Januar 1976, als das Wasser bei Antwerpen auf mehr als sieben Meter stieg, wurde der Sigmaplan ins Leben gerufen, um das gesamte Einzugsgebiet der Schelde vor Überschwemmungen zu schützen.",
          ],
        },
      ],
      didYouKnow: [
        "Rund zweihundert Jahre lang, von der Blockade nach 1585 bis 1795, war Antwerpen ein großer Hafen ohne freien Zugang zum Meer. Das ist einer der Gründe, warum das Goldene Zeitalter der Stadt zu Ende ging.",
      ],
      galleries: {
        "siege-of-antwerp": {
          title: "Die Belagerung Antwerpens, 1584–1585",
          intro: "Der Fall Antwerpens 1585 kam nach einer Belagerung von mehr als einem Jahr durch Alexander Farnese, Herzog von Parma. Diese Drucke zeigen, wie er den Fluss sperrte und wie die Stadt den Durchbruch versuchte.",
        },
      },
      closing: {
        timeline: [
          "Antwerpen-Centraal: Das 20. Jahrhundert beginnt",
          "Die Stadsfeestzaal und der Boerentoren: eine selbstbewusste moderne Stadt",
          "Die Handelsbeurs: ein Saal des 19. Jahrhunderts nach einer Idee des 16.",
          "Carolus Borromeus: Rubens und der Barock",
          "Das Rathaus und das Vleeshuis: die Handelsmetropole des 16. Jahrhunderts",
          "Die Kathedrale: das mittelalterliche Antwerpen",
          "Het Steen: die Burg, mit der die Stadt begann",
          "Die Schelde",
        ],
        finalLines: [
          "Du hast diesen Rundgang an einem Bahnhof begonnen, der für die Moderne gebaut wurde. Mit jeder Station bist du weiter zurückgegangen: vom 20. ins 19. Jahrhundert, zu Rubens und dem Barock, zu den Kaufleuten des 16. Jahrhunderts, zur mittelalterlichen Kathedrale und zur alten Burg.",
          "Und jetzt stehst du dort, wo alles begann: am Fluss.",
          "Du bist nicht nur durch Antwerpen gegangen. Du bist durch seine Geschichte zurückgegangen.",
        ],
      },
    },
  },

  images: {
    "central-station-1906": {
      caption: "Antwerpen-Centraal kurz nach der Fertigstellung, auf einer Postkarte von um 1906.",
      alt: "Alte Postkarte der steinernen Kuppelfassade des Antwerpener Hauptbahnhofs, mit Menschen auf dem Platz davor",
      approximateYear: "um 1906",
    },
    "central-station-hall-1909": {
      caption: "Im Inneren des Empfangsgebäudes, auf einer 1909 verschickten Postkarte.",
      alt: "Alte Postkarte einer hohen, prunkvollen Halle mit Balkonen und Rundbogenfenstern im Bahnhof",
      approximateYear: "1909",
    },
    "central-station-today": {
      caption: "Die Bahnhofshalle heute, mit der Uhr, dem Wort ANTWERPEN und dem Stadtwappen über dem Eingang.",
      alt: "Modernes Foto der Bahnhofshalle aus Eisen und Glas mit der verzierten Steinfront des Empfangsgebäudes",
      approximateYear: "2023",
    },
    // Clue of Spooky's task at the station: says where it was taken, not what to find.
    "central-station-hall-clue-today": {
      caption: "Spookys Hinweis: ein Foto, aufgenommen im Bahnhof.",
      alt: "Foto einer reich verzierten Wand unter einem Dach aus Glas und Eisen, mit einer Uhr, vergoldeten Verzierungen und einem Namen in goldenen Buchstaben",
      approximateYear: "2006",
    },
    "diamond-pelikaanstraat": {
      caption: "Die Pelikaanstraat am Rand des heutigen Diamantenviertels, um 1900.",
      alt: "Alte Postkarte einer gepflasterten Straße mit Läden, einem Pferdewagen und einem Turm in der Ferne",
      approximateYear: "um 1900",
    },
    "keyserlei-1903": {
      caption: "De Keyserlei im Jahr 1903. Am Ende des Boulevards weist schon die Turmspitze der Kathedrale den Weg.",
      alt: "Alte Postkarte eines breiten Boulevards mit Bäumen, Wagen und prächtigen Gebäuden, in der Ferne ein Kirchturm",
      approximateYear: "1903",
    },
    "meir-1910": {
      caption: "Die Meir auf einer 1910 verschickten Postkarte, mit einer Pferdestraßenbahn.",
      alt: "Alte Postkarte eines Platzes mit einer Pferdestraßenbahn und Ladenfronten",
      approximateYear: "um 1910",
    },
    "stadsfeestzaal-today": {
      caption: "Der Eingang der Stadsfeestzaal an der Meir, wiederaufgebaut nach dem Brand von 2000.",
      alt: "Modernes Foto eines verzierten Steineingangs mit vergoldeter Nische und dem Wort STADSFEESTZAAL",
      approximateYear: "2014",
    },
    "handelsbeurs-1890": {
      caption: "Joseph Schaddes Börsensaal um 1890: ein gotischer Innenhof unter einem Dach aus Eisen und Glas.",
      alt: "Altes Foto eines gotischen Innenhofs mit Galerien unter einem großen Dach aus Eisen und Glas",
      approximateYear: "um 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "Derselbe Saal in einer Federzeichnung von Maxime Lalanne, entstanden vor 1886.",
      alt: "Federzeichnung des Börsensaals mit Kaufleuten, die im Innenhof stehen",
      approximateYear: "vor 1886",
    },
    "boerentoren-1930s": {
      caption: "Der Boerentoren überragt seine Nachbarn, auf einer Postkarte aus den 1930er-Jahren.",
      alt: "Alte Postkarte eines hohen Art-déco-Turms über einem belebten Platz mit Straßenbahnen",
      approximateYear: "1930er-Jahre",
    },
    "groenplaats-1899": {
      caption: "Die Groenplaats um 1899, mit Rubens auf seinem Sockel und der Kathedrale hinter den Bäumen.",
      alt: "Alte Postkarte eines baumbestandenen Platzes mit einer Statue und dem Kathedralturm dahinter",
      approximateYear: "um 1899",
    },
    "cathedral-hollar-1649": {
      caption: "Die Kathedrale auf einer Radierung von Wenceslaus Hollar, 1649. Schon damals war der Südturm unvollendet.",
      alt: "Detaillierte Radierung der Kathedralfassade mit einer hohen Turmspitze und einem viel niedrigeren Turm",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "Die Turmspitze der Kathedrale über den Dächern, um 1908.",
      alt: "Alte Postkarte des hohen gotischen Kathedralturms über einem Platz",
      approximateYear: "um 1908",
    },
    "grote-markt-1905": {
      caption: "Der Grote Markt im Jahr 1905, links der Brabobrunnen, dahinter die Zunfthäuser.",
      alt: "Kolorierte alte Postkarte des Platzes mit dem Brunnen und hohen Zunfthäusern mit Giebeln",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Zunfthäuser am Grote Markt heute, mit ihren vergoldeten Figuren auf den Giebeln.",
      alt: "Modernes Foto hoher steinerner Zunfthäuser mit goldenen Statuen obenauf vor blauem Himmel",
      approximateYear: "2021",
    },
    "brabo-photochrom": {
      caption: "Brabo wirft die Hand des Riesen: ein Farbdruck aus den 1890er-Jahren.",
      alt: "Kolorierter historischer Druck der Bronzestatue des Brabo auf einem Felsenbrunnen vor Zunfthäusern",
      approximateYear: "1890er-Jahre",
    },
    "stadhuis-1866": {
      caption: "Das Rathaus auf einem frühen Foto aus der Mitte der 1860er-Jahre, eingeklebt in ein auf 1867 datiertes Album.",
      alt: "Frühes Foto der langen Renaissancefassade des Rathauses",
      approximateYear: "1865–1867",
    },
    "conscienceplein-historical": {
      caption: "Der Hendrik Conscienceplein um 1900, mit der Bibliothek hinter der Statue von Conscience.",
      alt: "Alte Postkarte eines stattlichen Gebäudes an einem Platz mit einer Statue vor dem Eingang",
      approximateYear: "um 1900",
    },
    "carolus-ceiling-punt-1748": {
      caption: "Die Anbetung der Könige, eines der verlorenen Deckengemälde von Rubens für diese Kirche, nur noch durch Drucke wie diesen Kupferstich von Jan Punt nach Jacob de Wit aus dem 18. Jahrhundert bekannt.",
      alt: "Schwarz-Weiß-Kupferstich der Heiligen Drei Könige, die der Jungfrau mit dem Kind Geschenke überreichen",
      approximateYear: "18. Jahrhundert",
    },
    "vleeshuis-1901": {
      caption: "„Vieille Boucherie“: das Vleeshuis und seine Umgebung auf einer um 1901 verschickten Postkarte.",
      alt: "Alte Postkarte eines hohen Backsteingebäudes mit Torbogen und Kindern auf der Straße",
      approximateYear: "um 1901",
    },
    "vleeshuis-wall-clue": {
      caption: "Spookys Hinweis: ein altes Foto einer Ecke beim Vleeshuis.",
      alt: "Schwarz-Weiß-Foto einer groben Mauer aus unregelmäßigen Steinen an einem hohen Backsteingebäude",
      approximateYear: "Datum unbekannt",
    },
    "vleeshuis-postcard-kitchen": {
      caption: "Ein Raum, eingerichtet als alte Küche, mit einer großen Herdstelle, Kupferkesseln und einer verzierten Wasserpumpe mit Becken (Postkarte des Museum Vleeshuis, Datum unbekannt; Sammlung des MAS).",
      alt: "Sepia-Postkarte eines Raums mit großem Kamin, Kupferkesseln an der Herdstelle, gefliesten Wänden, zwei Stühlen und einer verzierten Pumpe mit Steinbecken",
      approximateYear: "Datum unbekannt",
    },
    "vleeshuis-postcard-panelled-room": {
      caption: "Ein Zimmer mit Kamin, geschnitzten Schränken, verzierten Wandpaneelen und einer Statue auf einem Möbelstück (Postkarte des Museum Vleeshuis, Datum unbekannt; Sammlung des MAS).",
      alt: "Sepia-Postkarte eines Zimmers, dessen Wände mit verzierten Paneelen bedeckt sind, mit Kamin, geschnitzten Schränken, einem Tisch und einer Statue",
      approximateYear: "Datum unbekannt",
    },
    "vleeshuis-postcard-hall": {
      caption: "Ein Saal mit langem Tisch und Stühlen, einem Glaskronleuchter, einer Standuhr und einem reich geschnitzten Kamin mit einer sitzenden Figur darüber (Postkarte des Museum Vleeshuis, Datum unbekannt; Sammlung des MAS).",
      alt: "Sepia-Postkarte eines Saals mit einem langen Tisch voller Stühle, einem Glaskronleuchter, Buntglasfenstern, einer Standuhr und einem großen geschnitzten Kamin",
      approximateYear: "Datum unbekannt",
    },
    "siege-parma-bridge": {
      caption: "Die Schiffsbrücke Parmas über die Schelde, im Februar 1585 vollendet, um die Stadt von Hilfe über das Wasser abzuschneiden; Antwerpen liegt am Horizont. Druck von Lamberecht Causé nach Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Kupferstich einer langen, auf Booten gebauten Brücke über einen breiten Fluss, darauf Soldaten und Kutschen, ringsum Kriegsschiffe und in der Ferne die Silhouette einer Stadt",
      approximateYear: "1670–1699",
    },
    "siege-bridge-attack": {
      caption: "April 1585: Antwerpen schickt Brander gegen die Brücke. Laut Titel kam Alexander von Parma selbst beinahe ums Leben, doch die Brücke hielt und der Angriff scheiterte. Druck von Lamberecht Causé nach Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Kupferstich einer gewaltigen Explosion auf einer Schiffsbrücke, mit Planken, Booten und Soldaten, die durch die Luft fliegen, und Rauch über dem Fluss",
      approximateYear: "1670–1699",
    },
    "siege-map-luyken": {
      caption: "Die ganze Belagerung auf einer Karte von Jan Luyken (1680–1684): Antwerpen oben links, die Schiffsbrücke in der Mitte, das überflutete Land und rechts die Kämpfe auf dem Kouwenstein-Deich im Mai 1585, ein weiterer gescheiterter Durchbruchsversuch (Rijksmuseum).",
      alt: "Gestochene Karte der Schelde unterhalb Antwerpens mit Festungen, einer Brücke über den Fluss, überfluteten Feldern, Schiffen und Truppen, die entlang eines Deichs kämpfen",
      approximateYear: "1680–1684",
    },
    "sint-paulus-1901": {
      caption: "Die Sint-Pauluskerk und die Cafés ringsum, auf einer auf 1901 datierten Postkarte.",
      alt: "Alte Postkarte einer gotischen Kirche mit Barockturm über kleinen Häusern und Cafés",
      approximateYear: "1901",
    },
    "steen-photochrom": {
      caption: "Het Steen und der Hafen in den 1890er-Jahren, wenige Jahre nach der Begradigung der Kais.",
      alt: "Kolorierter historischer Druck der kleinen Burg am Kai mit Schiffen und Menschen",
      approximateYear: "1890er-Jahre",
    },
    "steen-1920": {
      caption: "Ein geschäftiger Tag am Steen und im Hafen, um 1920.",
      alt: "Alte Postkarte mit Menschenmengen, Wagen und Schiffen neben der Burg am Kai",
      approximateYear: "um 1920",
    },
    "steen-today": {
      caption: "Het Steen heute.",
      alt: "Modernes Foto der Burgtürme vor blauem Himmel",
      approximateYear: "2015",
    },
    "scheldt-quays-1900": {
      caption: "Die Scheldekais um 1900, gesäumt von Schiffen und Lagerschuppen.",
      alt: "Illustrierte alte Postkarte von Dampfschiffen und Segelbooten am Kai",
      approximateYear: "um 1900",
    },
    "diamond-bourse-today": {
      caption: "Die Beurs voor Diamanthandel in der Pelikaanstraat, eine der Diamantenbörsen des Viertels und ein geschütztes Denkmal.",
      alt: "Modernes Foto eines hohen steinernen Bürogebäudes mit gemeißeltem Namensband und Fahnen über dem Eingang",
      approximateYear: "2010",
    },
    "flatow-expulsion-card-1941": {
      caption: "Karteikarte von 1941 über Siegfried Flatow, einen 1921 in Berlin geborenen Deutschen, der in Antwerpen in der Zurenborgstraat 17 wohnte. Sie hält fest, dass er am 1. Februar 1941 nach Beverloo, Leysestraat 25, ausgewiesen wurde.",
      alt: "Vergilbtes zweisprachiges deutsch-niederländisches Formular, mit der Schreibmaschine ausgefüllt, mit einem Fingerabdruck im unteren Feld und einem leeren Platz für ein Foto",
      approximateYear: "1941",
    },
    "dossin-courtyard-1942": {
      caption: "Der Innenhof der Kazerne Dossin in Mechelen, 1942: Gepäck auf dem Boden verteilt, Lastwagen und Gruppen von Menschen.",
      alt: "Schwarz-Weiß-Foto eines geschlossenen Kasernenhofs mit Reihen von Koffern und Bündeln auf dem Boden, zwei Lastwagen und Menschengruppen an den Rändern",
      approximateYear: "1942",
    },
    "paleis-op-de-meir-today": {
      caption: "Der Paleis op de Meir heute: der Kaufmannspalast aus dem 18. Jahrhundert, den Napoleon kaufte.",
      alt: "Modernes Foto einer hellen Rokoko-Palastfassade mit Balkon und verziertem Wappen auf dem Dach",
      approximateYear: "2023",
    },
    "rex-ruins": {
      caption: "Das Kino Rex in Trümmern nach dem V2-Einschlag vom 16. Dezember 1944.",
      alt: "Sepiafoto eines zerbombten Kinogebäudes mit eingestürzten Mauern und freiliegendem Kuppeldach, davor ein Auto aus den 1940er-Jahren",
      approximateYear: "1944–1947",
    },
    // The clue of Spooky's quest: shown before the place is found, so it must not name it.
    "paleis-op-de-meir-drawing": {
      caption: "Spookys Hinweis: eine alte Aufrisszeichnung einer langen Fassade.",
      alt: "Alte Zeichnung einer langen, symmetrischen Fassade mit hohen Fenstern, kleinen Balkonen, Vasen auf dem Dach und einem großen verzierten Wappen in der Mitte",
      approximateYear: "Datum unbekannt",
    },
    "rubens-self-portrait-1623": {
      caption: "Peter Paul Rubens, Selbstporträt, 1623 (Royal Collection, London).",
      alt: "Gemaltes Porträt eines bärtigen Mannes mit breitem schwarzem Hut und dunklem Umhang",
      approximateYear: "1623",
    },
    "rubenshuis-garden-today": {
      caption: "Der Garten des Rubenshuis heute, mit dem Haus und rechts dem Portikus aus Rubens' eigener Zeit.",
      alt: "Modernes Foto eines Gartens mit Brunnen vor einem Renaissancehaus und einem steinernen Tor mit Statuen obenauf",
      approximateYear: "2025",
    },
    "rubens-honeysuckle-bower": {
      caption: "Rubens und Isabella Brant in der Geißblattlaube, um 1609–1610 (Alte Pinakothek, München).",
      alt: "Gemälde eines reich gekleideten jungen Paares, das Hand in Hand unter einer Geißblattlaube sitzt",
      approximateYear: "um 1609–1610",
    },
    "handelsbeurs-open-courtyard-1613": {
      caption: "Die Börse von 1531 mit ihrem offenen Innenhof voller Kaufleute: ein 1613 veröffentlichter Stich.",
      alt: "Schwarz-Weiß-Stich eines rechteckigen Innenhofs, umgeben von Galerien, mit kleinen Gruppen von Menschen und zwei Türmen",
      approximateYear: "1613",
    },
    "groenkerkhof-1597": {
      caption: "Ein Leichenzug am Kirchhof der Kathedrale, der heutigen Groenplaats: ein anonymes Gemälde von 1597 (Museum Vleeshuis).",
      alt: "Altes Gemälde schwarz gekleideter Trauernder, die an einem Kirchhof vorbeigehen, dahinter der hohe Kathedralturm",
      approximateYear: "1597",
    },
    "groenplaats-rubens-statue-1840s": {
      caption: "Die Kathedrale von der Groenplaats aus gesehen, mit der neuen Statue von Rubens: eine Lithografie von Jules Alexandre Monthelier, 1840er-Jahre.",
      alt: "Lithografie einer Bronzestatue auf hohem Sockel zwischen Bäumen, dahinter die Kathedrale mit ihrer Turmspitze",
      approximateYear: "1840er-Jahre",
    },
    "matsijs-portrait-1572": {
      caption: "Quinten Matsijs auf einem 1572 in Antwerpen veröffentlichten Porträtstich. Der lateinische Vers darunter erzählt, wie die Liebe ihn zum Maler machte.",
      alt: "Gestochenes Profilporträt eines Mannes mit Kappe und Umhang, der gerollte Papiere hält, darunter ein lateinischer Vers",
      approximateYear: "1572",
    },
    "matsijs-altarpiece-1511": {
      caption: "Das Altarbild von Quinten Matsijs für die Schreinerzunft, 1508–1511 für diese Kathedrale gemalt (KMSKA, Antwerpen).",
      alt: "Gemaltes Triptychon mit einer Beweinung Christi auf der Mitteltafel und zwei Seitentafeln",
      approximateYear: "1511",
    },
    "matsijs-well": {
      caption: "Der Brunnen neben der Kathedrale, fotografiert um 1875–1900. Sein schmiedeeisernes Gehäuse wird traditionell Matsijs zugeschrieben.",
      alt: "Altes Foto eines verzierten schmiedeeisernen Brunnengehäuses auf einem Steinsockel vor einer gotischen Mauer",
      approximateYear: "um 1875–1900",
    },
    "nello-patrasche-today": {
      caption: "Nello und Patrasche von Batist Vermeulen (2016), schlafend unter einer Decke aus Pflastersteinen vor der Kathedrale.",
      alt: "Modernes Foto einer weißen Marmorstatue eines Jungen und eines Hundes unter einer Pflastersteindecke, dahinter der Kathedralturm",
      approximateYear: "2023",
    },
    "vlaeykensgang-today": {
      caption: "Der Vlaeykensgang heute: Kopfsteinpflaster, Backsteinmauern und ein überdachter Durchgang.",
      alt: "Modernes Foto einer schmalen gepflasterten Gasse zwischen Backsteinmauern, gesehen durch einen niedrigen überdachten Durchgang",
      approximateYear: "2022",
    },
    "stadhuis-spanish-fury-hogenberg": {
      caption: "Das Rathaus in Flammen während der Spanischen Furie, mit Kämpfen auf dem Grote Markt: eine Radierung von Frans Hogenberg, entstanden vor 1585.",
      alt: "Radierung eines großen Renaissancerathauses, aus dem Flammen und Rauch aufsteigen, davor kämpfende Soldaten auf dem Platz",
      approximateYear: "vor 1585",
    },
    "handelsbeurs-vandennest": {
      caption: "Die Galerien, geschmückt mit Kronleuchtern, Draperien und Bäumchen, auf einem Druck von J.B.J. Vandennest aus den Jahren 1842–1851: noch bevor der Innenhof sein erstes Dach bekam (Universität Antwerpen, Sondersammlungen).",
      alt: "Druck langer gewölbter Galerien mit verzierten Säulen, hängenden Kronleuchtern, Draperien und Reihen von Bäumchen, im Vordergrund zwei Männer in Uniform",
      approximateYear: "1842–1851",
    },
    "handelsbeurs-lebrun-liedel": {
      caption: "Die Börse nach dem Wiederaufbau: verzierte Säulen, gewölbte Galerien und einige Kaufleute, auf einem Druck von Lebrun-Liedel aus der Zeit nach 1872 (Universität Antwerpen, Sondersammlungen).",
      alt: "Schwarz-Weiß-Druck einer Halle mit reich verzierten Säulen und Spitzgewölben, im Vordergrund ein lesender Mann mit Zylinder",
      approximateYear: "nach 1872",
    },
    "spanish-fury-overview-1577": {
      caption: "Die Spanische Furie auf einem Blatt: ein anonymer Druck von 1577 mit einem Plan von Antwerpen und seiner Zitadelle in der Mitte, umgeben von Szenen des Angriffs, der Kämpfe und des brennenden Rathauses (Rijksmuseum).",
      alt: "Druck mit einer Vogelschaukarte von Antwerpen und seiner sternförmigen Zitadelle in der Mitte, umgeben von kleinen Szenen angreifender, kämpfender und plündernder Soldaten",
      approximateYear: "1577",
    },
    "spanish-fury-de-braekeleer": {
      caption: "Die Spanische Furie in Antwerpen, wie Ferdinand de Braekeleer der Ältere sie 1836 malte: ein romantisches Bild des 19. Jahrhunderts mit bewaffneten Bürgern und Verwundeten zwischen Rauch und Feuer, im Hintergrund der Turm der Kathedrale (KMSKA, Antwerpen).",
      alt: "Gemälde einer Menge bewaffneter Bürger, verwundeter Männer und einer Frau, die neben einem Sterbenden kniet, mit Rauch, Feuer und einem Kathedralturm im Hintergrund",
      approximateYear: "1836",
    },
    "spanish-fury-mas": {
      caption: "Eine Straße voller Opfer, in der Ferne brennende Häuser: ein anonymes Gemälde der Spanischen Furie, entstanden zwischen 1576 und um 1585 (MAS, Antwerpen).",
      alt: "Gemälde einer belebten Straße mit Soldaten, Reitern und vielen Toten, brennenden Häusern und schwarzem Rauch in der Ferne und links einem Kirchturm",
      approximateYear: "1576–1585",
    },
    "spanish-fury-hogenberg-plunder": {
      caption: "Plünderung und Folter in den Antwerpener Häusern während der Spanischen Furie, auf einem Druck von Frans Hogenberg (16. Jahrhundert; Rijksmuseum).",
      alt: "Kupferstich von Soldaten, die an Seilen in Häusern aufgehängte Menschen foltern, mit Leichen am Boden und einer Straße mit Giebelhäusern im Hintergrund",
      approximateYear: "16. Jahrhundert",
    },
    "spanish-fury-print-1618": {
      caption: "„Spaensche Furie tot Antwerpen“: ein Druck von etwa 1618–1624, der die Szene wiederholt, mit einem Gedicht, das das Schicksal der Stadt beklagt (anonym; Rijksmuseum).",
      alt: "Kupferstich derselben Folter- und Plünderungsszene mit dem Titel „Spaensche Furie tot Antwerpen“ und darunter zwei Spalten niederländischer Verse",
      approximateYear: "um 1618–1624",
    },
    "execution-hogenberg-1568": {
      caption: "Eine Hinrichtung in den Niederlanden jener Zeit: die Enthauptung der Grafen Egmont und Hoorn auf dem Grote Markt von Brüssel 1568, auf einer Radierung von Frans Hogenberg. Nicht Antwerpen, aber dieselbe Epoche und dieselbe Art von Justiz.",
      alt: "Radierung eines von Soldaten mit Piken umringten Schafotts, ein Henker mit Schwert neben einem knienden Mann",
      approximateYear: "1568–1570",
    },
    "scheldt-photochrom": {
      caption: "Antwerpen vom Fluss aus gesehen in den 1890er-Jahren: links Het Steen, über der Stadt die Kathedrale.",
      alt: "Kolorierter historischer Druck der Antwerpener Skyline über den Fluss hinweg, mit Booten im Vordergrund",
      approximateYear: "1890er-Jahre",
    },
  },
};
