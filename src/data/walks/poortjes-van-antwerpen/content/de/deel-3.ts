import type { PoortjesStopText } from "../types";

/**
 * Part 3: Handelsbeurs, University & Academy (gates 24–41). German text.
 * Translated from ../en/deel-3.ts; keep the structure identical.
 */
export const deel3: Record<string, PoortjesStopText> = {
  // ── Handelsbeurs ─────────────────────────────────────────────────────
  "poortjes-handelsbeurs": {
    name: "Die Handelsbeurs",
    subtitle: "Wo die Welt Geschäfte machte",
    introduction: [
      "Von außen fällt die Handelsbeurs (die alte Handelsbörse) kaum auf. Drinnen aber liegt einer der bemerkenswertesten Räume der Stadt: ein gotischer Innenhof mit umlaufenden Galerien, überspannt von einem hohen Dach aus Eisen und Glas.",
      "An der Oude Beurs hast du gesehen, wo die erste Börse stand. Hier steht ihre Nachfolgerin.",
    ],
    sections: [
      {
        heading: "Warum Antwerpen eine Börse brauchte",
        kind: "history",
        paragraphs: [
          "Um 1530 war Antwerpen eine der reichsten Städte Europas. Schiffe aus Portugal brachten Gewürze aus Asien; Kaufleute aus Italien, Deutschland, England und Spanien lebten in der Stadt. Sie mussten Preise kennen, Käufer finden, Geld leihen und Ladungen versichern. Telefone gab es nicht und Zeitungen, wie wir sie kennen, auch nicht: Nachrichten reisten per Brief und vor allem von Mund zu Mund.",
          "Die alte Börse wurde zu klein: Um 1526–1527 baten die Kaufleute um mehr Platz. 1531 eröffnete die Stadt hier eine neue Börse, entworfen von Domien de Waghemakere im spätgotischen Brabanter Stil: ein offener Innenhof mit überdachter Galerie und reichen Sterngewölben. Sie war eines der ersten Gebäude überhaupt, die eigens für diesen Zweck errichtet wurden.",
        ],
      },
      {
        heading: "Feuer, und noch einmal Feuer",
        kind: "history",
        paragraphs: [
          "Was du siehst, ist nicht einfach das Gebäude von 1531. Die Börse wurde 1583 neu gebaut und brannte 1858 ab. Der Architekt Joseph Schadde entwarf das heutige Gebäude; den Auftrag erhielt er schließlich 1868, und am 19. Oktober 1872 wurde die neue Börse feierlich eingeweiht. Er behielt die Idee des gotischen Innenhofs bei, überdachte ihn aber mit einer spektakulären Konstruktion aus Eisen und Glas.",
          "Ende des 20. Jahrhunderts war der Handel längst anderswohin gezogen, und das Gebäude stand rund zwanzig Jahre leer. Nach einer gründlichen Restaurierung öffnete es 2019 wieder, heute als Veranstaltungsort.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Ein Blick hinein",
        paragraphs: [
          "Laut der Handelsbeurs selbst ist der Börsensaal an Wochenenden und in den Schulferien von 10 bis 18 Uhr öffentlich zugänglich, außer bei Veranstaltungen. Eingänge über die Twaalfmaandenstraat (von der Meir aus) und die Borzestraat (von der Lange Nieuwstraat aus).",
          "Ob der Besuch kostenlos ist, steht nicht auf der Website. Prüfe vor deinem Besuch die aktuellen Informationen und die Liste der Schließtage.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://handelsbeursantwerpen.be/en/bezoek-de-handelsbeurs/",
      },
    ],
    didYouKnow: [
      "Die Antwerpener Börse wurde im Ausland zum Vorbild. Als Thomas Gresham, der Agent der englischen Krone in Antwerpen, in den 1560er-Jahren die Royal Exchange in London gründete, nahm er sich die Antwerpener Börse zum Beispiel.",
      "Die Kunstakademie, die wir später besuchen, war ursprünglich in „der Börse an der Meir“ untergebracht, und Fragmente der Börse aus dem 16. Jahrhundert stehen im Akademiegarten.",
    ],
    transitionToNext: "Geh zur Lange Nieuwstraat. Das Haus, das du suchst, ist nach einer italienischen Stadt benannt, und sein Tor stammt von anderswo.",
  },

  // ── Gate 25 (+ vanished 24) ──────────────────────────────────────────
  "poortjes-lange-nieuwstraat": {
    name: "Lange Nieuwstraat 45",
    subtitle: "Bolonia la Grassa und ein Tor, das umzog",
    introduction: [
      "Such das Kaufmannshaus mit einem hohen Treppengiebel aus vierzehn Stufen. Dann schau dir das Tor an: eine Rundbogentür in einer barocken Blausteinrahmung, mit einer Kartusche, die eine Jahreszahl trägt.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Seit dem späten 16. Jahrhundert heißt dieses traditionelle Kaufmannshaus aus der zweiten Hälfte jenes Jahrhunderts „Bolonia la Grassa“, nach der italienischen Stadt Bologna. Spanische und italienische Adlige wohnten hier. Im 17. Jahrhundert lebte hier der Maler Abraham van Diepenbeeck; seine Familie besaß das Haus bis ins 18. Jahrhundert. Von 1828 bis 1849 führte die Witwe Helena Van Celst-Kums hier eine Mädchenschule und ein Waisenhaus.",
        ],
      },
      {
        heading: "Ein Tor, das umzog",
        kind: "history",
        paragraphs: [
          "Das Tor gehörte ursprünglich nicht zu diesem Haus. Smekens: „Stammt aus einem abgerissenen Gebäude in der Twaalfmaandenstraat.“ Das Inventar bestätigt das und ergänzt Einzelheiten: Das Tor ist „in einer Kartusche auf 1665 datiert“ und ersetzte 1926 einen Fassadenumbau aus dem 19. Jahrhundert.",
          "Die Twaalfmaandenstraat ist die Straße neben der Handelsbeurs, aus der du gerade kommst.",
        ],
      },
    ],
    glossary: ["cartouche", "trapgevel"],
    thenAndNow: [
      "Damals: 1951 stand das Tor erst seit 25 Jahren hier.",
      "Heute: Such die Jahreszahl 1665 in der Kartusche. 2014–2017 wurde das Haus mit dem Nachbarhaus Sint-Franciscus zusammengelegt und zu Wohnungen umgebaut.",
    ],
    didYouKnow: [
      "In derselben Straße, an Nummer 36, zeichnete Smekens ein weiteres Tor im Régence-Stil, das zum großen Stadtpalais „De Keyser“ gehörte. Es ist verschwunden.",
    ],
    transitionToNext: "Geh weiter zur Sint-Jacobskerk, der Kirche, in der Rubens begraben liegt.",
  },

  // ── St James ─────────────────────────────────────────────────────────
  "poortjes-sint-jacob": {
    name: "Sint-Jacobskerk (Jakobskirche)",
    subtitle: "Die Kirche der Pilger, und von Rubens",
    introduction: [
      "Vor dir steht ein massiger Westturm, der nie vollendet wurde, und eine lange, schlichte Kirche im Stil der Brabanter Gotik. Außen ist sie bescheiden. Ihr Inneres gehört zu den reichsten der Stadt.",
    ],
    sections: [
      {
        heading: "Vom Pilgerhospiz zur Pfarrkirche",
        kind: "history",
        paragraphs: [
          "An dieser Stelle stand ein Hospiz für Pilger auf dem Weg nach Santiago de Compostela (1404–1413). 1478 wurde seine Kapelle zur Pfarrkirche. Die heutige Kirche entstand in drei Phasen: ab 1491 mit dem Turm, bis die Arbeiten aus Geldmangel ruhten; von 1552 bis 1566 mit Langhaus und Querschiff; und von 1602 bis 1656 mit dem Chor und den Kapellen rundherum.",
          "Namhafte Baumeister arbeiteten an der Kirche: Herman de Waghemakere, sein Sohn Domien, Domiens Bruder Herman und ab 1525 Rombout Keldermans. Domien de Waghemakere bist du bereits an der Oude Beurs, der Handelsbeurs und der Kathedrale begegnet.",
        ],
      },
      {
        heading: "Spätgotik, außen und innen",
        kind: "history",
        paragraphs: [
          "Das Inventar nennt die Kirche ein Beispiel der Brabanter Gotik, mit einem charakteristischen schweren Westturm, schlichter Außenarchitektur und innen einem Triforium mit Laufgang. Der unvollendete Turm hat fünf Geschosse und wird „von vier schweren Eckstrebepfeilern gestützt“.",
          "Innen zeigt sich ein ganz anderes Bild: Dutzende Kapellen wohlhabender Familien, barocke Altäre, Marmor und Grabdenkmäler. 1705 verlieh Papst Clemens XI. der Kirche den Titel „erlauchte Stiftskirche“.",
        ],
      },
      {
        heading: "Rubens",
        kind: "history",
        paragraphs: [
          "Peter Paul Rubens starb 1640 und wurde in dieser Kirche beigesetzt. Seine Grabkapelle wurde 1642 eingerichtet. Über dem Altar hängt ein Gemälde von Rubens selbst, „Maria mit Heiligen“, das das Inventar auf 1634 datiert.",
          "Im Mai 2026 verkündete die Stadt das Ende einer siebenjährigen Restaurierung. Laut Pressemitteilung wurden auch das Altarbild, der Altar, das Epitaph und die Grabmonumente in der Rubenskapelle restauriert und sind wieder zu besichtigen.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Ein Blick hinein",
        paragraphs: [
          "Laut der Stadt Antwerpen (Pressemitteilung vom 13. Mai 2026) kann die Kirche „täglich zwischen 14 und 17 Uhr kostenlos besichtigt werden“. Einige ältere Quellen geben noch an, die Grabkapelle sei bis 2028 geschlossen; laut Pressemitteilung ist sie wieder zugänglich. Während Gottesdiensten und Beerdigungen kann die Kirche geschlossen sein. Kleinere Restaurierungen dauern noch bis 2028.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://pers.antwerpen.be/sint-jacobskerk-opnieuw-volledig-toegankelijk-na-7-jaar-restauratie",
      },
    ],
    didYouKnow: [
      "Während der Restaurierung wurden 426.650 neue Schieferplatten auf dem Dach verlegt und 1.738 m² Buntglas instand gesetzt.",
    ],
    lookAt: [
      {
        title: "Der unvollendete Turm",
        body: "Schau am Westturm hinauf. Der Bau begann 1491 und kam aus Geldmangel zum Stillstand; der Turm erhielt nie die Spitze, die du an der Kathedrale gesehen hast.",
      },
    ],
    transitionToNext: "Geh zur Keizerstraat, der Straße der Bürgermeister und Maler.",
  },

  // ── Gate 26 + Snijders&Rockox House (+ vanished 32) ──────────────────
  "poortjes-keizerstraat": {
    name: "Keizerstraat 10-16",
    subtitle: "Ein Bürgermeister, ein Maler und ein Portal voller Rocaillen",
    introduction: [
      "Du bist in einer ruhigen Straße mit stattlichen Häusern. Such an Nummer 16 ein kleines Portal mit verspieltem, muschelartigem Schmuck. Ein paar Häuser weiter, an Nummer 10–12, liegt das Snijders&Rockox Huis.",
    ],
    sections: [
      {
        heading: "Nummer 16: das Portal",
        kind: "history",
        paragraphs: [
          "Das Gebäude besteht aus zwei miteinander verbundenen Häusern aus dem 16. Jahrhundert. Das rechte Haus hat einen spätgotischen Volutengiebel aus der ersten Hälfte des 16. Jahrhunderts, das linke einen Treppengiebel aus der zweiten Hälfte. Laut Inventar liegt in der Mittelachse ein Portal aus dem dritten Viertel des 18. Jahrhunderts: ein „Rundbogen mit Kämpfern in einem segmentbogigen Feld, mit Rocaillen verziert“, mit Holztür, schmiedeeisernem Oberlicht und gusseisernem Schuhabstreifer.",
          "Smekens nennt das Haus „De zwarte arend“ (Der schwarze Adler); das Inventar nennt es heute „De witte Lelie“ (Die weiße Lilie). 1830 ließ Baron Philippe Antoine Joseph de Pret de ter Veken die Fassaden vom Architekten Franciscus De Wolf umgestalten. Seit 1992–1993 ist es ein Hotel.",
        ],
      },
    ],
    cards: [
      {
        id: "card-rockox",
        title: "Das Snijders&Rockox Huis",
        subtitle: "Möglicher Museumsbesuch: Keizerstraat 10-12",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Nicolaas Rockox (1560–1640) war Bürgermeister von Antwerpen und ein großer Kunstliebhaber. 1603 kaufte er zwei nebeneinanderliegende Häuser und ließ sie umbauen; er lebte dort mit seiner Frau Adriana Perez. Als Bürgermeister vertrat er die Stadt gegenüber höheren Instanzen und führte die Bürgerwehr und die Schützengilden an.",
              "Sein Nachbar war der Maler Frans Snijders (1579–1657). Er und seine Frau Margriete de Vos wohnten ab 1622 im Haus „de Fortuyne“. Snijders war bekannt für seine Stillleben, Tierstücke und Jagdszenen.",
              "1970 kaufte die Kredietbank das Rockox-Haus, und es wurde ein Museum. Heute bilden die beiden Häuser zusammen das Snijders&Rockox Huis, mit Werken unter anderem von Bruegel, Rubens und Van Dyck.",
            ],
          },
        ],
        didYouKnow: [
          "Am ersten Dienstag jedes Monats ist der Museumsbesuch kostenlos.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Museumsbesuch (optional)",
        paragraphs: [
          "Geöffnet dienstags bis sonntags von 10 bis 17 Uhr; montags geschlossen (außer Oster- und Pfingstmontag), außerdem am 1. Januar, 1. Mai, an Christi Himmelfahrt, am 1. November und am 25. Dezember. Eintritt 10 €; frei für Jugendliche unter 18 und Inhaber eines museumPASSmusées; am ersten Dienstag des Monats für alle frei.",
          "Der Museumsbesuch ist optional; der Rundgang geht danach einfach weiter.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.snijdersrockoxhuis.be/en/visit/plan-your-visit/opening-hours-prices",
      },
    ],
    glossary: ["rocaille", "lodewijk-stijlen"],
    thenAndNow: [
      "Damals: Smekens zeichnete ein „Tor im Louis-quinze-Stil“. Du erkennst diesen Stil an seinen asymmetrischen Muschel- und Felsformen.",
      "Heute: Such den Schuhabstreifer, die kleine Eisenkante, an der man die Schuhe sauber kratzt. Ist er auch auf der Zeichnung?",
    ],
    didYouKnow: [
      "In der Paternosterstraat, ganz in der Nähe, zeichnete Smekens ein kleines Portal im flämischen Renaissancestil, das zum Haus „De gulden dolfeyn“ (Der goldene Delfin) gehörte und laut ihm schon 1497 erwähnt wurde. Es ist verschwunden.",
    ],
    transitionToNext: "Geh zur Markgravestraat, einer schmalen Straße, die um 1500 angelegt wurde.",
  },

  // ── Gate 27 ───────────────────────────────────────────────────────────
  "poortjes-markgravestraat": {
    name: "Markgravestraat 14",
    subtitle: "Eine Straße durch das Gut eines Markgrafen",
    introduction: [
      "Such in dieser schmalen Straße die Nummer 14 und das Tor aus dem Buch. Vergleiche die Rahmung mit der Zeichnung: die Proportionen des Bogens, die Pilaster und die Bekrönung.",
    ],
    sections: [
      {
        heading: "Die Straße",
        kind: "history",
        paragraphs: [
          "Die Markgravestraat wurde um 1500 angelegt und ist nach dem Markgrafen Jan van Immerseel (15.–16. Jahrhundert) benannt, durch dessen Besitz die Straße gebrochen wurde. Es ist eine schmale Straße mit Häusern in verschiedenen Stilen, mit Spitz- und Treppengiebeln.",
        ],
      },
      {
        heading: "Das Tor",
        kind: "history",
        paragraphs: [
          "Zu diesem Tor schreibt Smekens nur: „Renaissancetor. Markgravestraat 14.“ Einen eigenen Inventareintrag dazu haben wir nicht gefunden. Über die ursprüngliche Funktion gerade dieses Tors ist wenig sicher bekannt. [Historische Recherche erforderlich]",
        ],
      },
    ],
    thenAndNow: [
      "Damals: ein Tor ohne Geschichte im Buch, nur eine Zeichnung.",
      "Heute: Vergleiche selbst. Passt die Zeichnung noch zu dem, was du siehst?",
    ],
    didYouKnow: [
      "Der Straßenname bezieht sich nicht allgemein auf einen Titel, sondern auf eine Person: Markgraf Jan van Immerseel, durch dessen Gut die Straße gebrochen wurde.",
    ],
    transitionToNext: "Geh zur Koningstraat. Such dort drei Könige.",
  },

  // ── Gate 29 (+ vanished 28 and 31) ───────────────────────────────────
  "poortjes-koningstraat": {
    name: "Koningstraat 17",
    subtitle: "De Drij Koningen (Die Heiligen Drei Könige)",
    introduction: [
      "Such den Treppengiebel mit einem kleinen Blausteinportal in der rechten Achse. Über der Tür sitzt ein kleines rundes Fenster, umrahmt von Laubwerk.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Smekens schreibt, das Haus „De Drie Koningen“ sei „bereits 1549 erwähnt“; das Inventar sagt „bereits Ende des 16. Jahrhunderts erwähnt“. 1881 wurde die Fassade unter der Leitung der Architekten Léonard und Henri Blomme gründlich restauriert.",
          "Das Portal selbst ist jünger als das Haus. Smekens: „Aus dem Jahr 1716.“",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Das Inventar beschreibt ein „kleines Blausteinportal im spätbarocken Stil, datiert 1716“: „eine Schulterbogentür in profilierter Rahmung, flankiert von Pilastern mit vertieften Schäften und Volutenkapitellen“. Über der Tür sitzt ein Oculus, ein Rundfenster, umgeben von schmückendem Laubwerk. Smekens nennt es ein „Louis-quatorze-Portal“.",
        ],
      },
    ],
    glossary: ["schouderboog", "lodewijk-stijlen"],
    thenAndNow: [
      "Damals: Smekens zeichnete das Portal mit seinem runden Fenster.",
      "Heute: Such die Jahreszahl 1716.",
    ],
    didYouKnow: [
      "In derselben Straße, an Nummer 14, zeichnete Smekens ein weiteres Portal aus dem 18. Jahrhundert, das zum Haus „De witte koning“ (Der weiße König) gehörte. Es ist verschwunden.",
      "Das Portal in der nahen Gratiekapelstraat war schon verschwunden, als das Buch erschien: Smekens schreibt, es sei „vor einigen Jahren von Vandalen einfach abgerissen worden“.",
    ],
    transitionToNext: "Geh zur Prinsstraat, ins alte Herz der Universität.",
  },

  // ── University ───────────────────────────────────────────────────────
  "poortjes-universiteit": {
    name: "Stadscampus und Hof van Liere",
    subtitle: "Aus dem Palast eines Bürgermeisters wurde eine Universität",
    introduction: [
      "Hinter den Fassaden der Prinsstraat liegt der Stadscampus (Stadtcampus) der Universität Antwerpen. Sein Herz ist der Hof van Liere, ein spätgotischer Palast mit Innenhof, Galerien und Brunnen.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "„Diese fürstliche Residenz wurde 1516 für den damaligen Antwerpener Bürgermeister Aert van Liere erbaut“, im Stil der Brabanter Gotik, schreibt die Universität. Nach seinem Tod ging der Besitz an die Stadt, die ihn einer Mailänder Bankiersfamilie und später der English Nation überließ, der Vereinigung der englischen Kaufleute.",
          "Die Jesuiten, die 1575 in Antwerpen eine höhere Schule gegründet hatten, erweiterten den Komplex und richteten ihn als Internat ein. Nach der Aufhebung ihres Ordens wurde er zur Militärakademie und zum Krankenhaus.",
          "1929 kehrten die Jesuiten zurück: Ihre Handelshochschule Sint-Ignatius fand hier ein neues Zuhause. 1988 kauften die Universitaire Faculteiten Sint-Ignatius (UFSIA) den Prinsenhof, und 2003 schlossen sich die Antwerpener Universitäten zur Universität Antwerpen zusammen.",
        ],
      },
      {
        heading: "Rundherum",
        kind: "history",
        paragraphs: [
          "Zum Campus gehört auch das Kloster der Grauen Schwestern in der Lange Sint-Annastraat, 1887 nach einem Entwurf von Frans Baeckelmans erbaut. Laut der Universität pflegten die Schwestern Pestkranke. Nach 1999 wurde es renoviert, wobei moderne Architektur in das historische Umfeld eingefügt wurde.",
          "Laut der Universität erhielt der Garten des Hof van Liere 1998 durch den Landschaftsarchitekten Wirtz ein neues Gesicht.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Zugang",
        paragraphs: [
          "Der Campus ist eine aktive Universität, kein Museum. Offizielle Informationen über einen freien Zugang zu Innenhof und Garten haben wir nicht gefunden. Ist das Tor offen, schau dich in Ruhe um und nimm Rücksicht auf Studierende und Personal; ist es geschlossen, lohnt auch die Fassade an der Prinsstraat einen Blick. [Zugang zu überprüfen]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    didYouKnow: [
      "Englische Kaufleute spielten im Antwerpen des 16. Jahrhunderts eine wichtige Rolle: Die English Nation war eine Zeit lang hier untergebracht, und laut Smekens ließ die Stadt 1550 eine kleine Börse „zugunsten der englischen Kaufleute“ bauen.",
    ],
    transitionToNext: "Jetzt hast du die Wahl: ein kurzer Abstecher zu zwei Toren in der Rodestraat oder direkt weiter zur Stadswaag.",
  },

  // ── Gates 33 and 34: optional ────────────────────────────────────────
  "poortjes-rodestraat": {
    name: "Rodestraat 43 und 44",
    subtitle: "Extra: zwei Tore beim Begijnhof",
    introduction: [
      "Willkommen auf dem Abstecher. In der Rodestraat zeichnete Smekens zwei Tore, die sich fast gegenüberliegen: ein kleines Renaissanceportal am Pfarrhaus des Begijnhof (des Beginenhofs, Nummer 43) und ein Kutschentor (Nummer 44).",
    ],
    sections: [
      {
        heading: "Was das Buch sagt",
        kind: "history",
        paragraphs: [
          "Über Nummer 43 schreibt Smekens nur: „Kleines Renaissanceportal am Pfarrhaus des Begijnhof.“ Über Nummer 44: „Um 1725 im reinen Louis-quinze-Stil erbaut.“",
          "Diese beiden Tore konnten wir noch nicht selbst erforschen. Ob sie heute noch bestehen und in welchem Zustand, muss vor Ort überprüft werden. [Historische Recherche erforderlich]",
        ],
      },
      {
        heading: "Ein Kutschentor",
        kind: "context",
        paragraphs: [
          "Ein Kutschentor ist breiter als eine gewöhnliche Tür: Es musste eine Kutsche oder einen Karren bis in einen Innenhof durchlassen. Du erkennst es an seiner Breite und oft an steinernen oder eisernen Prellsteinen unten.",
        ],
      },
    ],
    glossary: ["lodewijk-stijlen"],
    thenAndNow: [
      "Damals: zwei Tore, datiert auf das 16.–17. Jahrhundert (43) und um 1725 (44).",
      "Heute: Vergleiche beide mit den Zeichnungen. Deine Beobachtungen helfen uns, diese Station zu vervollständigen.",
    ],
    didYouKnow: [
      "Die Jahreszahl 1725 und die Stilbezeichnung „Louis quinze“ sind Smekens' eigene Worte. Wie du unterwegs gesehen hast, können Stilnamen und Datierungen in späteren Studien anders ausfallen.",
    ],
    transitionToNext: "Geh zurück zur Stadswaag: dem Platz des Mannes, der die halbe nördliche Stadt anlegen ließ.",
  },

  // ── Gate 35 (+ vanished 30) ──────────────────────────────────────────
  "poortjes-stadswaag": {
    name: "Die Stadswaag",
    subtitle: "Wo der Handel gewogen und besteuert wurde",
    introduction: [
      "Du stehst auf einem Platz ohne das Gebäude, nach dem er benannt ist. Hier stand die städtische Waage (stadswaag). Such am Platz die Nummer 13 mit dem Portal aus dem Buch: ein kleines Spätrenaissanceportal mit Oberlicht.",
    ],
    sections: [
      {
        heading: "Was ist eine Stadtwaage?",
        kind: "history",
        paragraphs: [
          "Eine Stadtwaage war eine öffentliche Wiegestation. Laut Inventar war die Antwerpener Waage „eine Art Steueramt, in dem Waren gewogen und entsprechend besteuert wurden“. Wer mit Waren handelte, ließ sie hier amtlich wiegen: So wusste der Käufer, was er bekam, und die Stadt, was sie besteuern konnte.",
          "Das Gebäude hatte außerdem „mehrere reich verzierte Säle, in denen Hochzeitsfeste gefeiert wurden“.",
        ],
      },
      {
        heading: "Gilbert van Schoonbeke",
        kind: "history",
        paragraphs: [
          "Den Platz und die Straßen rundherum legte 1548 Gilbert van Schoonbeke an, ein Projektentwickler, lange bevor es das Wort gab. Mit einer Urkunde vom 6. Mai 1547 kaufte er der Stadt das Gelände für 31.000 Karolusgulden ab. Er ließ die bestehenden Gebäude abreißen und baute „die neue Waage“.",
          "Außerdem legte er drei Straßen an: die Noord-, Oost- und Weststraat (Nord-, Ost- und Weststraße), später umbenannt in Hoornstraat, Brilstraat und Raapstraat. Der Name „Stadswaag“ für den Platz stammt aus der Zeit um 1800.",
          "Van Schoonbeke bist du schon begegnet: Er ließ auch die Brauereien in der Brouwersstraat bauen, aus der mehrere Tore aus dem Buch stammen.",
        ],
      },
      {
        heading: "Das Ende der Waage",
        kind: "history",
        paragraphs: [
          "Am 25. August 1873 schlug bei einem heftigen Gewitter der Blitz ein. Das Gebäude fing Feuer und brannte innerhalb weniger Stunden völlig nieder. Die Stadt machte das Gelände daraufhin zu einem öffentlichen Platz. Im September 1914 war die Stadswaag noch einmal in den Nachrichten, als eine Zeppelinbombe sie traf.",
          "In den 1960er-Jahren entdeckten Künstler das Viertel, und es wurde zum Ausgehviertel. 1998 wurde der Platz neu gestaltet.",
        ],
      },
    ],
    glossary: ["waaier", "ijkdienst"],
    thenAndNow: [
      "Damals: 1951 war die Waage schon fast achtzig Jahre verschwunden. Smekens zeichnete das Portal an Nummer 13 ohne weitere Erklärung.",
      "Heute: Finde Nummer 13 und vergleiche das Oberlicht mit der Zeichnung. [Aktueller Zustand dieses Portals vor Ort zu überprüfen]",
    ],
    didYouKnow: [
      "In der Raapstraat (Rübenstraße), einer von Van Schoonbekes Straßen, zeichnete Smekens ein kleines Portal mit „einer Rübe als Motiv“ in der Muschel über der Tür. Eine Rübe in der Rübenstraße: Leider ist das Portal verschwunden.",
      "Nach dem Brand von 1873 war das amtliche Eichamt vorübergehend im Haus De Clocke in der Lange Noordstraat untergebracht. Dieses Haus und sein Tor siehst du später auf dem Rundgang.",
    ],
    transitionToNext: "Geh zur Mutsaardstraat. Gegenüber der Akademie steht ein monumentales Tor.",
  },

  // ── Gate 36 ───────────────────────────────────────────────────────────
  "poortjes-mutsaardstraat": {
    name: "Mutsaardstraat 30-32",
    subtitle: "Das Haus eines Kanzlers",
    introduction: [
      "Such in der Mutsaardstraat eine breite Sandsteinfassade mit barockem Mittelteil und gesprengtem Giebelfeld. Schau dir das monumentale Tor an. Vergleiche auch die Hausnummern 30 und 32.",
    ],
    sections: [
      {
        heading: "Die Geschichte",
        kind: "history",
        paragraphs: [
          "Zur „Mutsaertstraat 30“ schreibt Smekens: „Gehörte zum Haus von Schockaert, Stadtrat und Kanzler von Brabant.“ Das Inventar verortet das barocke Stadtpalais von Jan Daniël Antoon Schockaert, ab 1739 Kanzler des Herzogtums Brabant, heute an der Mutsaardstraat 32. Laut Inventar ist Nummer 30 das Haus „De Draeck“ (Der Drache).",
          "Das Stadtpalais wurde im dritten Viertel des 17. Jahrhunderts von der Familie Van den Kerckhoven erbaut. Am 16. Dezember 1944 wurde es von einer V-Bombe schwer beschädigt. 1956–1957 wurde es zu Geschäften, Büros und Wohnungen umgebaut; die Vorderfassade steht seit 1958 unter Denkmalschutz.",
        ],
      },
      {
        heading: "Architektur",
        kind: "history",
        paragraphs: [
          "Die achtachsige Fassade hat eine Sandsteinverkleidung und einen barocken Mittelrisalit mit „gesprengtem Giebelfeld mit Bekrönungsornament“. Laut Inventar hat das Tor eine „profilierte, rustizierte Laibung auf ionischen Pilastern“ und eine schmückende Kartusche.",
        ],
      },
    ],
    glossary: ["fronton", "beloop"],
    thenAndNow: [
      "Damals: Smekens sah das Tor wenige Jahre nach den V-Bomben-Schäden von 1944 und vor dem Umbau von 1956–1957.",
      "Heute: Zu welcher Hausnummer gehört das Tor der Zeichnung heute, 30 oder 32? [Vor Ort zu überprüfen]",
    ],
    didYouKnow: [
      "Antwerpen wurde 1944–1945 schwer von V-Bomben getroffen. Dieses Haus ist eines der vielen Gebäude, die damals beschädigt wurden.",
    ],
    transitionToNext: "Geh hinüber zur Akademie an Nummer 31. Hinter dem Gitter liegt ein Garten mit fünf Toren, die sonst nirgends mehr stehen.",
  },

  // ── Gates 37–41: Academy garden ──────────────────────────────────────
  "poortjes-academie": {
    name: "Die Akademie und ihr Garten",
    subtitle: "Fünf Tore ohne Haus",
    introduction: [
      "Du bist an der Königlichen Akademie der Schönen Künste (Koninklijke Academie voor Schone Kunsten), einer der ältesten Kunstschulen Belgiens. Hinter dem Torgebäude liegt der Akademiegarten, und darin stehen Tore und Fassadenteile von Gebäuden, die anderswo in der Stadt verschwunden sind.",
      "Fünf davon hat Smekens gezeichnet. Unten kannst du sie eines nach dem anderen suchen.",
    ],
    searchTask: {
      title: "Finde die fünf Tore im Garten",
      intro: "Jedes dieser Tore stammt von einem anderen Ort in Antwerpen. Such sie im Garten und vergleiche sie mit der Zeichnung. Es ist kein Wettbewerb: Findest du eines nicht, schau einfach in die Lösung.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 19,
          question: "Das Portal von „Het Klaverblad“ (Das Kleeblatt). Woher stammt es?",
          hints: ["Schau dir den Schlussstein an: Welche Pflanze erkennst du darin?", "Auf dem Schlussstein steht auch eine Jahreszahl."],
          solution: "Aus der ehemaligen Klaverstraat, der heutigen Haverstraat.",
          explanation: [
            "Laut Inventar ist dies ein „kleines Rundbogenportal aus Blaustein“ von „het Klaverblad“ in der Haverstraat, mit der Jahreszahl 1663 auf dem Schlussstein und einem Kleeblattmotiv. Zufall oder nicht: 1663 ist auch das Gründungsjahr der Akademie.",
          ],
        },
        {
          plate: 21,
          question: "Das Portal mit einer Büste darüber. Wer ist das?",
          hints: ["Die Büste zeigt den Gründer der Akademie.", "Er war Maler, und sein Vater trug denselben Namen."],
          solution: "David Teniers der Jüngere, in einem Portal des Hauses „De Gans“ (Die Gans) in der Zakstraat.",
          explanation: [
            "Smekens: „In der Nische eine Büste von David Teniers dem Jüngeren, dem Maler, der 1663 die Akademie gründete. Ursprünglich gehörte diese Büste nicht in diese Nische.“ Portal und Büste wurden also zusammengebracht: ein schönes Beispiel dafür, wie alte Stücke im Garten neu kombiniert wurden.",
          ],
        },
        {
          plate: 33,
          question: "Die große Torrahmung mit Buchstaben in einem Medaillon. Zu welchem Betrieb gehörte sie?",
          hints: ["Such drei Buchstaben im Medaillon oben.", "Das Wappen daneben gehört zu dem Gewerbe, dem du in der Adriaan Brouwerstraat wieder begegnest."],
          solution: "Zur Brauerei Van Pruyssen, mit den Buchstaben C.V.P. und dem Wappen der Brauerzunft.",
          explanation: [
            "Smekens nennt als Herkunft die Brouwersstraat, die heutige Adriaan Brouwerstraat. Das Inventar erwähnt im Garten eine hölzerne Rundbogentür aus dem „Oosters Huis“ (Haus der Osterlinge), eingesetzt in die Blausteinrahmung der Brauerei Van Pruyssen, mit den Initialen CVP und Brauersymbolen.",
          ],
        },
        {
          plate: 34,
          question: "Das große Tor mit geschnitztem Mittelpfosten. Aus welchem Haus stammt es?",
          hints: ["Der Mittelpfosten zwischen den Türflügeln heißt „makelaar“.", "Das Haus trug einen religiösen Namen, und auf der Tür steht eine Inschrift."],
          solution: "Aus dem Haus „De Heilige Drievuldigheid“ (Die Heilige Dreifaltigkeit) am Kipdorp.",
          explanation: [
            "Smekens: Das Haus „musste den Warenhäusern A la Vierge noire (Kipdorp) weichen“. Das Inventar beschreibt im Garten eine Holztür mit der Inschrift „In de Heyliche Dryvuldicheidt“ von 1636.",
          ],
        },
        {
          plate: 37,
          question: "Das große Tor mit eisernem Oberlicht. Zu welchem Kloster gehörte es?",
          hints: ["Schau dir das Schmiedeeisen des Oberlichts genau an: Zwei Buchstaben sind darin eingearbeitet."],
          solution: "Zum abgerissenen Kloster der Cellebroeders (Alexianer): die Buchstaben C.B.",
          explanation: [
            "Smekens: „Aus dem abgerissenen Kloster der Cellebroeders, mit den Buchstaben C. B. (Cellebroeders) im Eisenwerk des Oberlichts.“",
            "Wo genau jedes Tor im Garten steht, haben wir vor Ort noch nicht erfasst. [Vor Ort zu überprüfen]",
          ],
        },
      ],
    },
    sections: [
      {
        heading: "Die älteste Kunstschule des Landes",
        kind: "history",
        paragraphs: [
          "Die Akademie wurde 1663 auf Initiative des Malers David Teniers mit Erlaubnis König Philipps IV. gegründet. Zuerst war sie in der Börse an der Meir untergebracht. 1811 zog sie in das ehemalige Franziskanerkloster hier an der Mutsaardstraat.",
          "Die Franziskaner hatten sich 1446 in Antwerpen niedergelassen. Ihr Kloster wurde beim Bildersturm von 1566 zerstört und nach ihrer Rückkehr 1585 wieder aufgebaut. 1797, unter französischer Herrschaft, mussten sie gehen.",
        ],
      },
      {
        heading: "Gebäude und Garten",
        kind: "history",
        paragraphs: [
          "Der Stadtarchitekt Pierre Bruno Bourla entwarf die ältesten Akademiegebäude: unter anderem ein Direktorenhaus (1823–1824), Ausstellungssäle und 1841 das Torgebäude mit eisernem Gitter und ein Museum mit klassischer Tempelfront. Nach dem Krieg kam nach einem Entwurf von Ferdinand Peeters (1953) ein Flügel mit Unterrichtsräumen und Ateliers hinzu. 1963 malte Renaat Braem ein Wandbild im Treppenhaus.",
          "Der Garten folgt „einem symmetrischen Plan, der vom Torgebäude ausgeht“, und wurde 1905 nach einem Entwurf des Architekten Emiel Van Averbeke neu gestaltet. Er enthält Statuen von David Teniers, Mathias Van Bree, Quinten Matsijs und dem heiligen Lukas sowie Fragmente der Börse aus dem 16. Jahrhundert.",
        ],
      },
      {
        heading: "Warum stehen hier Tore?",
        kind: "interpretation",
        paragraphs: [
          "Das Inventar beschreibt die Tore als „geborgene Portalelemente verschwundener Antwerpener Gebäude“. Wer genau beschloss, sie hier aufzustellen, und warum, konnten wir nicht herausfinden. Naheliegend scheint, dass man wertvolle Stücke abgerissener Gebäude retten wollte und dass eine Kunstschule mit umschlossenem Garten ein logischer Ort dafür war, auch als Anschauungsmaterial für den Unterricht. Das ist aber eine Deutung, keine belegte Tatsache.",
        ],
      },
      {
        heading: "Künstler der Akademie",
        kind: "history",
        paragraphs: [
          "Im Lauf der Jahrhunderte studierten hier Künstler wie Lawrence Alma-Tadema, Ford Madox Brown und Henry van de Velde. Die 1963 gegründete Modeabteilung wurde in den 1980er-Jahren durch „die Antwerp Six“ weltberühmt, darunter Dries Van Noten, Ann Demeulemeester und Walter Van Beirendonck. Heute gehört die Akademie zur AP Hogeschool (Hochschule für angewandte Wissenschaften und Künste).",
        ],
      },
    ],
    cards: [
      {
        id: "card-van-gogh",
        title: "Vincent van Gogh in Antwerpen",
        subtitle: "Drei Monate, November 1885 – Februar 1886",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Ende November 1885 kam Vincent van Gogh aus Nuenen nach Antwerpen. Er mietete ein kleines Zimmer in der Lange Beeldekensstraat, im Arbeiterviertel Stuivenberg.",
              "Im Januar 1886 schrieb er sich an der Akademie ein, vor allem, um nach lebenden Modellen malen zu lernen. Er nahm Zeichenunterricht nach antiken Gipsabgüssen bei Frans Vinck und später bei Eugène Siberdt und versuchte sich in der Malklasse von Charles Verlat.",
              "Es lief nicht gut. Sein spontaner, kraftvoller Stil passte nicht zum strengen akademischen System, und nach einem Konflikt mit Siberdt wurde er in eine niedrigere Klasse zurückversetzt. Die Nachricht erreichte ihn erst, als er schon fort war: Am 28. Februar 1886 brach er nach Paris auf, zu seinem Bruder Theo.",
            ],
          },
          {
            heading: "Was wir wissen und was nicht",
            kind: "context",
            paragraphs: [
              "Sein Aufenthalt in Antwerpen dauerte etwa drei Monate, seine Zeit an der Akademie weniger als zwei. Das Museum KMSKA nennt den 24. November 1885 als Ankunftsdatum; andere Quellen sprechen von ein paar Tagen später. Deshalb sagen wir „Ende November“.",
            ],
          },
        ],
        didYouKnow: [
          "Der Mann, der in Antwerpen in eine niedrigere Klasse zurückversetzt wurde, ist heute der berühmteste Student, den die Akademie je hatte.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Zugang zum Garten",
        paragraphs: [
          "Der Akademiegarten gehört zum Campus der Akademie und ist kein öffentlicher Park. Offizielle Öffnungszeiten haben wir nicht gefunden. Ist das Tor offen, geh leise hinein; ist es geschlossen, siehst du einen Teil des Gartens durch das Gitter. [Zugang bei der Akademie zu überprüfen]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    glossary: ["makelaar", "waaier", "sluitsteen"],
    didYouKnow: [
      "Der Akademiegarten steht seit 1974 als kulturhistorische Landschaft unter Schutz.",
    ],
    transitionToNext: "Ende des dritten Teils. Geh nach Norden, Richtung Falconplein: Hier wird die Stadt zur Hafenstadt.",
  },
};
