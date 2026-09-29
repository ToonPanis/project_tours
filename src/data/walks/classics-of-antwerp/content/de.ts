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
      "Ein erzählter Rundgang vom prächtigen Bahnhof bis ans Ufer der Schelde: achtzehn Stationen, acht Jahrhunderte und die Geschichten hinter Antwerpens berühmtesten Orten.",
    description:
      "Vom prächtigen Bahnhof Antwerpens geht es durch Jahrhunderte voller Handel, Kunst, Glauben und Macht bis dorthin, wo die Geschichte der Stadt begann: ans Ufer der Schelde.\n\nAn jeder Station wird dein Handy zu deinem Guide: was du vor dir siehst, warum es gebaut wurde, was hier geschah und welche Details die meisten Besucher einfach übersehen. Historische Fotos zeigen dir, wie die Stadt vor hundert Jahren und früher aussah. Es gibt keine Spiele und keine Fragen, nur Antwerpen und die Zeit, es dir in Ruhe anzusehen.",
    highlights: [
      "18 der wichtigsten historischen Orte Antwerpens",
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
        {
          heading: "Ein Palast an der Meir",
          kind: "history",
          paragraphs: [
            "Geh weiter auf die Meir und achte auf eine lange, elegante Fassade aus dem 18. Jahrhundert: den Paleis op de Meir. Der Antwerpener Architekt Jan Pieter van Baurscheit der Jüngere errichtete ihn ab 1745 für einen wohlhabenden Kaufmann, Johan Alexander van Susteren. Später ging er durch bemerkenswerte Hände: Napoleon kaufte ihn 1811–1812, wohnte aber nie darin, der russische Zar Alexander I. logierte hier 1814, und lange Zeit diente er als königlicher Palast.",
            "Gleich neben der Meir, am Wapper, steht das Haus, in dem Peter Paul Rubens lebte und arbeitete. Rubens wird dir auf diesem Rundgang noch mehrmals begegnen.",
          ],
        },
      ],
      didYouKnow: [
        "Das Kino Rex wurde nach dem Krieg wieder aufgebaut und 1947 neu eröffnet. 1993 schloss es endgültig und wurde zwei Jahre später abgerissen. Heute erinnert in der Straße kaum etwas die Passanten an das, was hier geschah.",
        "Napoleon gehörte der Palast an der Meir, doch als er für ihn bereitstand, war er schon im Exil auf der Insel Elba.",
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
        "Verlass die Meir für einen Moment und bieg in die schmalen Straßen dahinter ein. Hinter gewöhnlichen Fassaden verbirgt sich das Gebäude, in dem Antwerpen einst der Welt beibrachte, wie man Handel treibt.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "Die Handelsbeurs",
      subtitle: "Wo die Welt ihre Geschäfte machte",
      introduction: [
        "Vor dir liegt die Handelsbeurs, Antwerpens alte Handelsbörse. Von der Straße aus macht sie kaum auf sich aufmerksam. Drinnen aber verbirgt sich einer der außergewöhnlichsten Räume der Stadt: ein gotischer Innenhof, umgeben von Galerien und überspannt von einem hoch aufragenden Dach aus Eisen und Glas.",
        "Wir gehen nun zurück ins 16. Jahrhundert, als Antwerpen zu den reichsten Städten Europas gehörte.",
      ],
      sections: [
        {
          heading: "Handel ohne Telefon",
          kind: "history",
          paragraphs: [
            "Stell dir Antwerpen um 1530 vor. Schiffe aus Portugal bringen Gewürze aus Asien; Kaufleute aus Italien, Deutschland, England und Spanien leben in der Stadt. Sie müssen Preise kennen, Käufer finden, Geld leihen, Ladungen versichern, und es gibt keine Telefone, keine Zeitungen, wie wir sie kennen, kein Internet. Nachrichten reisen per Brief und vor allem von Mund zu Mund.",
            "Also baute Antwerpen einen Ort, an dem sich all diese Kaufleute täglich treffen konnten. 1531 eröffnete die Stadt eine Börse nach Entwurf von Domien de Waghemakere, im Stil der Brabanter Spätgotik: ein offener Innenhof, umgeben von einem überdachten Umgang mit kunstvollen Sterngewölben. Es war eines der ersten Gebäude überhaupt, das eigens für diesen Zweck errichtet wurde. Hier, in einem babylonischen Sprachgewirr, wurden Preise festgelegt und Geschäfte abgeschlossen.",
          ],
        },
        {
          heading: "Feuer, und noch einmal Feuer",
          kind: "history",
          paragraphs: [
            "Das Gebäude, das du siehst, ist nicht einfach das von 1531. Die Börse wurde 1583 neu gebaut und brannte 1858 nieder. Daraufhin entwarf der Architekt Joseph Schadde das heutige Gebäude; den Auftrag erhielt er schließlich 1868, und am 19. Oktober 1872 wurde die neue Börse feierlich eingeweiht. Er behielt die Idee des gotischen Innenhofs bei, überdachte ihn aber mit einer spektakulären Konstruktion aus Eisen und Glas, und Reste der alten Börse wurden in den Komplex einbezogen.",
            "Ende des 20. Jahrhunderts war der Handel längst anderswohin gezogen, und das Gebäude stand rund zwanzig Jahre leer. Nach einer gründlichen Restaurierung öffnete es 2019 wieder, nun als Veranstaltungsort.",
          ],
        },
      ],
      didYouKnow: [
        "Antwerpens Börse wurde im Ausland zum Vorbild. Als Thomas Gresham, der Agent der englischen Krone in Antwerpen, in den 1560er-Jahren die Royal Exchange in London gründete, nahm er sich die Antwerpener Börse zum Muster.",
        "Das Wort „Börse“ selbst wird meist nicht auf Antwerpen zurückgeführt, sondern auf Brügge, wo sich Kaufleute vor dem Haus der Familie Van der Beurse trafen.",
      ],
      transitionToNext:
        "Zurück auf der Meir: Schau nach oben. Über den Dächern ragt ein Turm auf, wie ein Stück New York, das in eine mittelalterliche Stadt gefallen ist. Wir machen kurz einen Sprung nach vorn in der Zeit, bevor unsere Reise in die Vergangenheit richtig beginnt.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
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

    // ── 7 ────────────────────────────────────────────────────────────────
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
          ],
        },
        {
          heading: "Rubens nimmt seinen Platz ein",
          kind: "history",
          paragraphs: [
            "1840 beging Antwerpen den 200. Todestag von Rubens. Willem Geefs entwarf eine Statue, doch das Geld war knapp und die Bronze nicht rechtzeitig fertig. Deshalb wurde am 25. August 1840 auf einem anderen Platz eine vorläufige Gipsversion enthüllt. Erst am 9. und 10. August 1843 bezog der bronzene Rubens hier seinen Platz, mitten auf der Groenplaats.",
          ],
        },
      ],
      didYouKnow: [
        "Wenn du hier auf einer Terrasse sitzt, sitzt du auf dem, was jahrhundertelang der Begräbnisplatz der Kathedrale war.",
      ],
      transitionToNext:
        "Geh auf die Kathedrale zu. Achte dabei auf die Häuserreihe, die an den Chor der Kirche gebaut ist. Sie verbirgt die Fundamente einer Kathedrale, die nie vollendet wurde.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Onze-Lieve-Vrouwekathedraal",
      subtitle: "Die Liebfrauenkathedrale, die fast noch größer geworden wäre",
      introduction: [
        "Vor dir steht die Onze-Lieve-Vrouwekathedraal, die Liebfrauenkathedrale: eine der größten gotischen Kirchen der Niederen Lande und jahrhundertelang das Wahrzeichen, das Seeleute auf der Schelde als Erstes sahen. Ihr Nordturm, rund 123 Meter hoch, beherrscht noch immer die Silhouette der Stadt.",
        "Wir sind jetzt im Spätmittelalter. Die Kathedrale wurde über etwa 170 Jahre hinweg gebaut, von der Mitte des 14. Jahrhunderts bis 1521, von Generationen von Baumeistern, die wussten, dass sie ihre Vollendung nie erleben würden.",
      ],
      sections: [
        {
          heading: "Noch größer: das Nieuwerck",
          kind: "history",
          paragraphs: [
            "1521, gerade als die Kirche fertig war, beschloss Antwerpen, dass sie nicht groß genug sei. Die reichste Stadt Nordeuropas wollte eine Kirche, die dazu passte, und Domien de Waghemakere und Rombout Keldermans entwarfen eine gigantische Erweiterung des Chors, das Nieuwerck.",
            "Am 15. Juli 1521 legte der junge Kaiser Karl V. persönlich den Grundstein. Dann kam das Unglück. Ein Großbrand im Jahr 1533 beschädigte die Kirche schwer, alles Geld floss in die Reparatur des bestehenden Baus, die Arbeiten am Nieuwerck wurden eingestellt, und 1537 gab man das Vorhaben endgültig auf.",
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
      lookAt: [
        {
          title: "Anderthalb Türme",
          body: "Schau dir die Vorderseite der Kathedrale an. Der linke (nördliche) Turm steigt bis zu seiner eleganten Spitze auf; der rechte (südliche) Turm endet auf etwa einem Drittel dieser Höhe. Geplant waren zwei große Türme, doch nur einer wurde je vollendet. Sieh dir die Radierung von 1649 auf dieser Seite an: Schon damals war die Silhouette genauso schief.",
        },
      ],
      transitionToNext:
        "Geh um die Kathedrale herum zur Oude Koornmarkt. Halte gut Ausschau nach einem schmalen Eingang zwischen den Häusern: Er führt in eine versteckte Gasse, die die Zeit vergessen zu haben scheint.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Ein geheimer Durchgang ins alte Antwerpen",
      introduction: [
        "Tritt durch den schmalen Eingang, und der Lärm der Stadt verschwindet. Du bist im Vlaeykensgang, einer gewundenen Gasse zwischen alten Backsteinmauern, kleinen Innenhöfen und niedrigen Häuschen. Für einen Moment kannst du dir leicht vorstellen, wie Antwerpen vor Jahrhunderten war.",
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

    // ── 10 ───────────────────────────────────────────────────────────────
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

    // ── 11 ───────────────────────────────────────────────────────────────
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

    // ── 12 ───────────────────────────────────────────────────────────────
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
        {
          heading: "Die Spanische Furie, 4. November 1576",
          kind: "history",
          paragraphs: [
            "Kaum zehn Jahre später wurde dieses Gebäude Zeuge einer Katastrophe. Die Niederlande hatten sich gegen den spanischen König erhoben, und seine Soldaten in der Region waren lange nicht bezahlt worden. Am 4. November 1576 stürmten meuternde spanische Truppen Antwerpen und begannen, die Stadt zu plündern.",
            "Die Stadtregierung organisierte von diesem Rathaus aus, hier am Grote Markt, einen Gegenangriff. Die Soldaten steckten das Gebäude in Brand. Die Flammen griffen auf die umliegenden Häuser über, Hunderte davon brannten nieder. Vom Rathaus blieben nur die Außenmauern stehen.",
            "Wie viele Menschen starben, ist nicht genau bekannt. Die Schätzungen reichen von mehreren Hundert bis zu etwa 8.000; viele Historiker gehen davon aus, dass mehr als 7.000 Menschen ihr Leben verloren. Das Ereignis ging als Spanische Furie in die Geschichte ein und erschütterte das Selbstvertrauen der Stadt, die Europas große Handelsmetropole gewesen war.",
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
      transitionToNext:
        "Verlass den Grote Markt und geh durch ruhige Straßen nach Osten, zu einem kleinen Platz, den viele Besucher den schönsten Antwerpens nennen.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
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

    // ── 14 ───────────────────────────────────────────────────────────────
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

    // ── 15 ───────────────────────────────────────────────────────────────
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
      transitionToNext:
        "Geh ein paar Straßen weiter nach Norden, ins alte Hafenviertel. Hier steht eine Kirche, deren Geschichte mit dem Fluss verbunden ist, und mit dem Feuer.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
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

    // ── 17 ───────────────────────────────────────────────────────────────
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

    // ── 18 ───────────────────────────────────────────────────────────────
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
    "scheldt-photochrom": {
      caption: "Antwerpen vom Fluss aus gesehen in den 1890er-Jahren: links Het Steen, über der Stadt die Kathedrale.",
      alt: "Kolorierter historischer Druck der Antwerpener Skyline über den Fluss hinweg, mit Booten im Vordergrund",
      approximateYear: "1890er-Jahre",
    },
  },
};
