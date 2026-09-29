import type { PoortjesStopText } from "../types";

/**
 * Deel 1: Zuidkant & Hoogstraat (poorten 1–9).
 * Feiten: Smekens (1951) en de Inventaris Onroerend Erfgoed, zie stops.ts.
 */
export const deel1: Record<string, PoortjesStopText> = {
  // ── Poort 1 ───────────────────────────────────────────────────────────
  "poortjes-rosier": {
    name: "Rosier 24",
    subtitle: "Een kloosterpoort met een heilige in een medaillon",
    introduction: [
      "Je staat voor de lange, gesloten gevel van een klooster. Zoek niet meteen naar de grote toegangspoort, maar naar een kleinere deur met erboven een ovaal medaillon. Precies zo'n deur tekende Paul Smekens hier rond 1950: een eenvoudige deur in een gebogen omlijsting, bekroond door een borstbeeld in een ovale lijst.",
      "Dit is de eerste van vijftig poorten. Smekens publiceerde in 1951 een boek met 52 opmetingstekeningen van oude Antwerpse poortjes: vooraanzicht, grondplan en maatlat, tot op de centimeter. Wij volgen zijn spoor, zeventig jaar later. Sommige poorten staan er nog, sommige zijn verplaatst, andere zijn verdwenen.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Achter deze gevel wonen al bijna vier eeuwen karmelietessen. De orde kwam uit Spanje: in 1612 kwam Anna van Sint-Bartholomeus met twee medezusters naar Antwerpen. In september 1615 legden de aartshertogen Albrecht en Isabella de eerste steen van het nieuwe klooster; de kerk werd gebouwd tussen 1636 en 1639.",
          "In 1783 werd het klooster afgeschaft en diende het als kazerne en hooimagazijn. In 1801 konden de zusters terugkeren, en in 1843 kregen ze ook hun kerk terug. Smekens schrijft in 1951 kortweg: 'Aan het klooster der Spaanse Theresianen. In de nis een beeld van de H. Jozef.' Met 'Theresianen' bedoelt hij de karmelietessen, de hervormde orde van Teresa van Ávila.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "Volgens de Inventaris Onroerend Erfgoed heeft de voorgevel een belangrijke barokpoort uit 1653: een rondboogpoort in een hardstenen omlijsting met een sleutel, geflankeerd door pilasters. Daarnaast staan in de zijmuren deuren met een spiegelboog en bustes van Sint-Jozef (rechts) en Sint-Theresia (links), beide van 1856.",
          "De tekening van Smekens toont zo'n deur: een spiegelboogvormige omlijsting met een brede, geprofileerde rand, een uitspringende kroonlijst en daarboven het borstbeeld in een ovaal medaillon. Onderaan zie je in het grondplan hoe diep de stenen omlijsting in de muur zit.",
        ],
      },
      {
        heading: "Renaissance of barok?",
        kind: "context",
        paragraphs: [
          "Onderweg zul je merken dat Smekens veel poorten 'renaissancepoort' noemt, terwijl de Inventaris ze vandaag meestal in de 17de eeuw dateert en 'barok' noemt. Dat is geen tegenspraak die je moet oplossen: het zijn twee manieren van benoemen, uit 1951 en uit onze tijd. In deze gids geven we telkens beide, en we zeggen erbij wie wat zegt.",
          "Over Paul Smekens zelf vonden we nog weinig betrouwbare informatie. [Historisch onderzoek vereist]",
        ],
      },
    ],
    glossary: ["spiegelboog", "pilaster", "sluitsteen", "hardsteen"],
    thenAndNow: [
      "Toen: Smekens tekende een deur met een borstbeeld in een ovaal medaillon en noemde het een beeld van Sint-Jozef.",
      "Nu: vergelijk zelf. Staat het borstbeeld er nog? Zie je ook de tweede deur met Sint-Theresia aan de andere kant, zoals de Inventaris beschrijft? Welke van de twee deuren staat in het boek?",
    ],
    didYouKnow: [
      "De bustes van Sint-Jozef en Sint-Theresia zijn jonger dan het klooster: de Inventaris dateert ze in 1856, ruim twee eeuwen na de kerk.",
    ],
    lookAt: [
      {
        title: "Het grondplan onder de tekening",
        body: "Kijk op de tekening naar het smalle strookje onder de deur: dat is een doorsnede van de muur. Daaraan zie je hoe diep de stenen omlijsting in de gevel zit. Smekens tekende zo bij elke poort, en je zult het plannetje nog vaak zien.",
      },
    ],
    transitionToNext: "Loop naar de Lange Gasthuisstraat. Op nummer 37 wacht een poort met een balkon erop, en een detail dat er volgens Smekens niet thuishoort.",
  },

  // ── Poort 2 ───────────────────────────────────────────────────────────
  "poortjes-lange-gasthuisstraat": {
    name: "Lange Gasthuisstraat 37",
    subtitle: "Het stadshuis van een abdij",
    introduction: [
      "Zoek de brede poort met het smeedijzeren balkonnetje erboven. Kijk eerst naar de omlijsting van de poort zelf: blokken steen die afwisselend naar voren springen, en bovenaan een sleutelsteen in de vorm van een krul.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Dit pand was eeuwenlang het 'refugium' van de norbertijnenabdij van Tongerlo: haar stadshuis in Antwerpen, van 1535 tot 1581 en van 1585 tot 1699. Een abdij op het platteland had zo'n huis nodig om zaken te doen in de stad, en als veilige toevlucht in onrustige tijden.",
          "Het pand kende opvallende bewoners: buitenburgemeester Filips van Marnix van Sint-Aldegonde woonde hier in 1583-1584, en later burgemeester Willem Andreas de Caters (1802-1831). Van 1699 tot 1724 was beeldhouwer Hendrik Frans Verbruggen eigenaar; hij liet belangrijke verbouwingen uitvoeren. In 1941 ontwierp architect Max Winders de restauratie en samenvoeging met het buurpand tot kantoorgebouw.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft een barokke rondboogpoort uit de 17de eeuw in blauwe hardsteen, met een dubbel geblokt en geprofileerd beloop, een voluutsleutel, lijstimposten en neuten. Brede voluten leiden naar een waterlijst met daarop een Frans balkon in smeedwerk. De houten vleugeldeur heeft spiegels en een gebeeldhouwde makelaar.",
        ],
      },
      {
        heading: "Wat Smekens opviel",
        kind: "interpretation",
        paragraphs: [
          "Smekens noemt dit een 'renaissancepoort met balkon' en maakt een scherpe opmerking: 'De cartouche met het gebeeldhouwd vrouwenhoofd in Louis XV-stijl komt ons apocrief voor in deze Renaissancepoort.' Met andere woorden: hij vond dat dat vrouwenhoofd uit een latere tijd en stijl kwam dan de poort zelf. Of het later is toegevoegd, weten we niet met zekerheid.",
        ],
      },
    ],
    glossary: ["refugiehuis", "geblokt", "voluut", "makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Toen: Smekens tekende een poort met balkon en een cartouche met een vrouwenhoofd.",
      "Nu: zoek het vrouwenhoofd. Is het er nog? En past het, zoals Smekens vond, niet goed bij de strakkere blokken van de poort?",
    ],
    didYouKnow: [
      "Filips van Marnix van Sint-Aldegonde, die hier woonde, wordt vaak genoemd als mogelijke dichter van het Wilhelmus. Dat auteurschap is overigens nooit met zekerheid bewezen.",
    ],
    lookAt: [
      {
        title: "Twee stijlen, één poort",
        body: "Vergelijk de zware, rechte blokken van de omlijsting met de krullende versiering bovenaan. Zie je het verschil in karakter dat Smekens bedoelde?",
      },
    ],
    transitionToNext: "Wandel naar de Everdijstraat. Daar staan twee poorten vlak bij elkaar, en één ervan hoorde bij een man die 'de weldoener der armen' werd genoemd.",
  },

  // ── Poorten 3 en 4 ────────────────────────────────────────────────────
  "poortjes-everdijstraat": {
    name: "Everdijstraat 45 en 31",
    subtitle: "Twee poorten, één weldoener",
    introduction: [
      "In deze korte straat staan twee poorten uit het boek op een paar tientallen meters van elkaar. Begin bij nummer 45: een huis met een trapgevel en rechts een monumentale poort. Loop daarna naar nummer 31, het herenhuis 'Hagelsteen'.",
    ],
    sections: [
      {
        heading: "Nummer 45",
        kind: "history",
        paragraphs: [
          "Het huis op nummer 45 gaat terug tot de tweede helft van de 16de eeuw; de poort kwam er in de tweede helft van de 17de eeuw bij. De Inventaris beschrijft 'een geprofileerde en geblokte omlijsting van hardsteen met sleutel, steunend op bewerkte Ionische pilasters', met daarboven een gekorniste waterlijst op een zware tandlijst, geflankeerd door brede krulvoluten met guirlandes en rozetten.",
          "Smekens schrijft bij deze poort alleen 'Renaissancepoort'. Over de oorspronkelijke functie van deze specifieke poort is weinig met zekerheid bekend.",
        ],
      },
      {
        heading: "Nummer 31: Hagelsteen",
        kind: "history",
        paragraphs: [
          "Het herenhuis Hagelsteen dateert uit de late 16de eeuw. In 1621 verkocht de familie Van Eeden het aan Cornelis Lantschot (1572-1656), een rijke koopman. Smekens noemt hem 'De weldoener der armen'. De poort is volgens de Inventaris een hardstenen barokpoort uit de tweede helft van de 17de eeuw: een geblokte rondboog met een brede voluutsleutel op Ionische pilasters met een ingediepte schacht.",
          "Later veranderde het huis nog flink: in 1880 kwam er een derde bouwlaag bij, rond 1925 werd de gevel gecementeerd. Achter de gevel ligt een binnenplaats uit het eerste kwart van de 17de eeuw met een arcade op Toscaanse zuilen.",
        ],
      },
    ],
    glossary: ["kapiteel", "waterlijst", "trapgevel"],
    thenAndNow: [
      "Toen: Smekens tekende bij nummer 31 een 'renaissancepoort met omlijsting'. Het boek waarschuwt nergens voor veranderingen.",
      "Nu: de gevel van nummer 31 werd rond 1925 gecementeerd. Kijk of de poort in de tekening nog even 'los' van de gevel staat als toen, of dat de nieuwere gevel eromheen gegroeid is.",
    ],
    didYouKnow: [
      "Cornelis Lantschot komt later op deze wandeling terug. Aan de Falconrui stichtte hij een godshuis; Smekens tekende er ook een poortje, dat vandaag verdwenen is.",
    ],
    lookAt: [
      {
        title: "Ionische kapitelen",
        body: "Zoek bovenaan de pilasters naast de poort de twee kleine krullen. Dat is het kenmerk van een Ionisch kapiteel. Beide poorten hier hebben ze.",
      },
    ],
    transitionToNext: "Om de hoek, in de Groendalstraat, staat een huis waar de bakkers de baas waren. Zoek er niet één, maar twee poortjes.",
  },

  // ── Poort 5 ───────────────────────────────────────────────────────────
  "poortjes-groendalstraat": {
    name: "Groendalstraat 18-20",
    subtitle: "Het huis van de bakkers",
    introduction: [
      "Zoek het lage huis met de opvallende hardstenen benedenverdieping. Er zitten twee kleine poortjes in, elk met een waaiervormig bovenlicht. Smekens tekende er één van.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Het huis Sint-Christoffel dateert in de kern uit de periode 1562-1592. In 1621 kwam het in handen van het bakkersambacht, de beroepsvereniging van de bakkers. Smekens schrijft dat het 'eigendom van de deken der bakkers' was, de gekozen leider van het ambacht.",
          "In 1672 kregen de toegangen hun barokke poortjes. Smekens noemt dat jaartal ook: 'Dagtekent van 1672.'",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft 'hardstenen barokpoortjes met waaiervormig bovenlicht in een geblokte, boogvormige omlijsting met voluutsleutel'. De hele benedenverdieping is een opvallende pui van blauwe hardsteen. De bovenverdieping is bak- en zandsteenbouw met speklagen: horizontale banden van lichte zandsteen in het rode baksteenwerk.",
        ],
      },
    ],
    glossary: ["waaier", "bovenlicht"],
    thenAndNow: [
      "Toen: Smekens tekende één van de twee poortjes, met zijn waaier en voluutsleutel.",
      "Nu: er zijn er twee. Welk van beide staat in het boek? Kijk naar de details in de waaier en rond de sleutelsteen.",
    ],
    didYouKnow: [
      "Sint-Christoffel is de heilige die volgens de legende het Christuskind over een rivier droeg. Veel Antwerpse huizen hadden zo'n naam in plaats van een huisnummer; huisnummers kwamen pas veel later.",
    ],
    transitionToNext: "Nu een langere wandeling naar het westen, richting Schelde, naar de Kloosterstraat. Het huis dat je daar ziet, draagt de naam van een beroemde man die er nooit gewoond heeft.",
  },

  // ── Poort 6 ───────────────────────────────────────────────────────────
  "poortjes-kloosterstraat": {
    name: "Kloosterstraat 13",
    subtitle: "Het huis dat de verkeerde naam kreeg",
    introduction: [
      "Voor je staat een lange, lage gevel van acht vensters breed, in zachtgele zandsteen. Midden in de gevel zit een stevige hardstenen poort. Achter die poort ligt een binnenplaats met vier vleugels.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "Het complex dateert van 1547-1555, af te lezen aan een gevelsteen en balksloffen. In 1619 liet eigenaar Peter Paschier de Deckere grote verbouwingen uitvoeren. In 1698 liet koopman Norberto Schut door architect Hendrik Frans Verbruggen een vierde, barokke vleugel toevoegen. Smekens verwijst daarnaar: 'de binnenkoer van het herenhuis De Deckere, dagtekenend van 1698'.",
          "Het huis heet vandaag Mercator-Orteliushuis. Smekens vond dat al in 1951 een vergissing: 'Verkeerdelijk genaamd: het huis van Abraham Ortelius.' De Inventaris bevestigt het: de beroemde cartograaf (1527-1598) woonde op nummer 43 van deze straat, een pand dat in 1937 werd gesloopt.",
          "Het gebouw verviel, tot de Vereniging van Historische Woonsteden het in 1943 kocht. Het werd in 1946 beschermd, in 1950 aan de stad geschonken en in 1952-1953 gerestaureerd.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft de poort aan de straat als een 'hardstenen deuromlijsting in barokstijl uit de 17de eeuw: geblokte rondboog begrepen in een geprofileerde spiegelboog met neuten, imposten, bewerkte sleutel en waterlijst'.",
        ],
      },
    ],
    glossary: ["neuten", "imposten", "rondboog"],
    thenAndNow: [
      "Toen: Smekens zag de poort toen het huis in verval was, net voor of tijdens de restauratie van 1952-1953.",
      "Nu: kijk naar de gele zandsteen van de gevel en het donkere blauw van de hardsteen. Dat contrast maakt de poort vandaag goed zichtbaar.",
    ],
    didYouKnow: [
      "Dat een huis de naam van een beroemdheid krijgt die er nooit woonde, is geen Antwerpse uitzondering. Het toont vooral hoe graag een stad zijn grote namen een adres geeft.",
    ],
    transitionToNext: "Wandel terug naar het centrum, naar de Hoogstraat, een van de oudste straten van de stad. Daar hangen drie poorten van het boek bijna tegen elkaar.",
  },

  // ── Poorten 7 en 8 (+ plaat 3) ────────────────────────────────────────
  "poortjes-hoogstraat": {
    name: "Hoogstraat 15-21",
    subtitle: "Oude huisnamen en een verborgen gang",
    introduction: [
      "Je staat in de Hoogstraat, tussen trapgevels van zandsteen. Op deze paar meter tekende Smekens drie poorten: nummer 15B ('De Wolsack'), nummer 21 en, extra, nummer 15. Kijk naar de benedenverdiepingen: de meeste zijn nu winkels, maar tussen de etalages zitten nog oude poortomlijstingen.",
    ],
    sections: [
      {
        heading: "De straat",
        kind: "history",
        paragraphs: [
          "De Hoogstraat wordt al in 1232 vermeld als 'alta platea' en heet Hoogstraat sinds 1305. Ze verbond het stadscentrum met het zuiden. In 1443 verwoestte een brand bijna alle gebouwen. In de 16de eeuw werd hier linnen verhandeld.",
        ],
      },
      {
        heading: "Huizen met namen",
        kind: "history",
        paragraphs: [
          "Smekens schrijft over De Wolsack: 'Van dit huis werd reeds in 1461 melding gemaakt.' De Inventaris beschrijft 'Wolsack, Gulden Osch en Schilt van Mechelen' als drie traditionele diephuizen uit de tweede helft van de 16de eeuw, samen zeven traveeën breed, met een volledig zandstenen gevel en drie trapgevels. De poort is een rondboogpoort in een barokke omlijsting van blauwe hardsteen van omstreeks 1650.",
          "Let op: de Inventaris plaatst deze huizen vandaag op Hoogstraat 15A, 17 en 17A. De huisnummers zijn sinds 1951 dus veranderd. Ook de huisnamen schuiven: het rechterpand heette in 1561 'Lyntworm', in 1579 'Cleynen gulden Schilt' en in 1638 'Schilt van Mechelen'.",
        ],
      },
      {
        heading: "Nummer 21 en de Vlaaikensgang",
        kind: "history",
        paragraphs: [
          "Smekens noemt de poort op nummer 21 'streng klassiek, met gefantazeerde trigliefen'. Volgens hem gaf ze toegang tot 'een van de zeer oude erven der Hoogstraat, De lintworm genaamd', met 'eveneens een uitgang langs de Vlaaikensgang der Koornmarkt'.",
          "Voor deze poort vonden we geen eigen inventarisfiche. Of ze vandaag nog op nummer 21 zit, moet ter plaatse gecontroleerd worden. [Ter plaatse te verifiëren]",
          "Ook nummer 15, 'De grooten gulden scilt', stond volgens Smekens in verbinding met de Vlaaikensgang. De Inventaris bevestigt een historische verbinding tussen de Vlaaikensgang en het huis op Hoogstraat 15 sinds 1561. Die gang ligt achter deze huizen en heeft zijn hoofdingang aan de Oude Koornmarkt.",
        ],
      },
      {
        heading: "Architectuur van nummer 15",
        kind: "history",
        paragraphs: [
          "De poort van 'Grooten gulden Schilt' (Hoogstraat 15) is volgens de Inventaris een korfboogpoort in een barokke omlijsting van blauwe hardsteen van omstreeks 1650, met een geblokt beloop in een geriemde schouderboog, voluten en een gebeeldhouwde cartouche met een blind wapenschild als sleutel. De houten deur toont reliëfs van Maria, Johannes de Evangelist, Elisabeth van Hongarije en een bedelaar.",
        ],
      },
    ],
    glossary: ["triglief", "korfboog", "schouderboog", "cartouche", "diephuis"],
    thenAndNow: [
      "Toen: in 1951 hadden deze huizen andere nummers dan vandaag. Smekens' '15B' is niet het huidige 15B.",
      "Nu: leg de drie tekeningen naast de gevels. Welke poort vind je terug, en onder welk huisnummer staat ze vandaag?",
    ],
    didYouKnow: [
      "Een 'lintworm' als huisnaam klinkt vreemd, maar Antwerpse huisnamen konden van alles zijn: dieren, voorwerpen, heiligen, steden. Ze hingen vaak op een uithangbord of gevelsteen, lang voordat huisnummers bestonden.",
    ],
    lookAt: [
      {
        title: "De deur van nummer 15",
        body: "Zoek de houten deur met gebeeldhouwde figuren. Herken je een figuur die om een aalmoes vraagt? Volgens de Inventaris is dat een bedelaar naast de heilige Elisabeth van Hongarije.",
      },
    ],
    transitionToNext: "Loop naar de Suikerrui, de brede straat richting Schelde. Zoek er een gouden ram.",
  },

  // ── Poort 9 ───────────────────────────────────────────────────────────
  "poortjes-suikerrui": {
    name: "Suikerrui 22",
    subtitle: "De Gouden Ram",
    introduction: [
      "Zoek op de Suikerrui de poort met een vergulde ram als sluitsteen. Kijk dan naar de rest van de omlijsting: rozetten op de pilasters en rond de boog.",
    ],
    sections: [
      {
        heading: "Het verhaal",
        kind: "history",
        paragraphs: [
          "De Gouden Ram is een herenhuis uit de 17de eeuw. In 1823 vestigde de Nederlandse apotheker Klaas Jan Cupérus (1769-1851) hier een drogisterij en theehandel. Het familiebedrijf Cupérus werd een bekende theehandelaar en nam deel aan de wereldtentoonstellingen van 1885, 1894 en 1930. In 1926 verhuisde de winkel naar de Schoenmarkt.",
          "Binnen bewaart het huis een Japanse zaal met lakwerkpanelen uit de Edo-periode, met draken, hanen, vogels, vissen en vlinders. Die zaal is niet vrij te bezoeken.",
        ],
      },
      {
        heading: "Architectuur",
        kind: "history",
        paragraphs: [
          "De Inventaris beschrijft een barokke rondboogpoort uit blauwe hardsteen, waarschijnlijk 17de eeuw: 'Het geprofileerde en geblokte beloop met neuten, oren en gelede imposten, wordt geaccentueerd door rozetten en een cartouche met een vergulde ram als sluitsteen.' Smekens vat het samen: 'Met ram op cartouche en rozen op de pilasters en de bogen.'",
        ],
      },
    ],
    glossary: ["rondboog", "neuten"],
    thenAndNow: [
      "Toen: Smekens tekende de ram in zwart-wit, als deel van de steen.",
      "Nu: de ram is verguld en springt meteen in het oog. Tel de rozetten: zijn het er evenveel als op de tekening?",
    ],
    didYouKnow: [
      "De naam 'De Gouden Ram' leeft vandaag voort in de zaak die in het pand zit; de theehandel Cupérus zelf vertrok al in 1926 naar de Schoenmarkt.",
    ],
    transitionToNext: "Einde van het eerste deel. Loop naar de Grote Markt: tijd voor een pauze in het hart van de stad.",
  },
};
