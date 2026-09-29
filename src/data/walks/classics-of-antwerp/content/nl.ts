import type { ClassicsContent } from "./types";

/**
 * Classics of Antwerp: Nederlandse tekst (vertaling van content/en.ts).
 * Zelfde structuur en feiten als het Engelse origineel; zie de regels daar.
 */
export const classicsContentNl: ClassicsContent = {
  walk: {
    title: "Klassiekers van Antwerpen",
    tagline: "Een wandeling door de geschiedenis van Antwerpen",
    shortDescription:
      "Een wandeling met verhaal, van het grootse spoorwegstation tot aan de oevers van de Schelde: achttien haltes, acht eeuwen en de verhalen achter de bekendste plekken van Antwerpen.",
    description:
      "Wandel van het grootse station van Antwerpen door eeuwen van handel, kunst, geloof en macht, tot waar het verhaal van de stad begon: aan de oevers van de Schelde.\n\nBij elke halte wordt je smartphone je gids: waar je naar kijkt, waarom het gebouwd werd, wat er gebeurd is en welke details de meeste bezoekers gewoon voorbijlopen. Historische foto's laten zien hoe de stad er een eeuw geleden en langer uitzag. Er zijn geen spelletjes of vragen; alleen Antwerpen, en de tijd om er echt naar te kijken.",
    highlights: [
      "18 van de belangrijkste historische plekken van Antwerpen",
      "Geschreven alsof er een gids naast je loopt",
      "Historische foto's, gravures en postkaarten bij elke belangrijke halte",
      "“Wist je dat?”-verhalen die je niet op de infoborden vindt",
      "Details om ter plaatse naar te zoeken",
      "Wandelnavigatie van halte naar halte",
    ],
    howItWorksSteps: [
      "Wandel met de kaart naar de volgende halte",
      "Lees het verhaal van wat je ziet",
      "Zoek ter plaatse naar de details",
      "Ga verder in je eigen tempo",
    ],
    practicalInfo: [
      { label: "Tempo", value: "In je eigen tempo; stop en ga verder wanneer je wilt" },
      { label: "Ideaal voor", value: "Wie Antwerpen voor het eerst bezoekt en iedereen die nieuwsgierig is naar de geschiedenis van de stad" },
      { label: "Toegankelijkheid", value: "Vooral vlakke straten; hier en daar kasseien in de oude binnenstad" },
    ],
    guideIntro: {
      quote:
        "Wandel van het grootse station van Antwerpen door eeuwen van handel, kunst, geloof en macht, tot waar het verhaal van de stad begon: aan de oevers van de Schelde.",
      categoryLabel: "Geschiedenis & architectuur",
      footnote: "Van de belle époque tot het middeleeuwse Antwerpen.",
    },
    copy: {
      startLabel: "Start de wandeling",
      nextLocationTitle: "Volgende halte",
      completionTitle: "Het einde van de wandeling",
      completionMessage: "Je bent niet zomaar door Antwerpen gewandeld. Je bent terug door zijn geschiedenis gewandeld.",
      locationsTitle: "De route",
      locationsDiscoveredLabel: "haltes bezocht",
    },
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "classics-central-station": {
      name: "Antwerpen-Centraal",
      subtitle: "De spoorwegkathedraal",
      introduction: [
        "Voor je staat een van de spectaculairste treinstations ter wereld. Bekijk het even zoals het bedoeld was: een stenen paleis met een koepel, torens en vergulde details, niet alleen gebouwd om een trein te halen, maar om indruk te maken op iedereen die in Antwerpen aankwam.",
        "De Antwerpenaren noemen het de spoorwegkathedraal. Het is een passende plek om te beginnen, want dit is het jongste hoofdstuk van ons verhaal. Van hieruit wandelen we terug in de tijd, helemaal tot aan de rivier waar de stad geboren werd.",
      ],
      sections: [
        {
          heading: "Het pronkstuk van een koning",
          kind: "history",
          paragraphs: [
            "Rond 1900 was Antwerpen in volle bloei. De haven was een van de drukste van Europa, en koning Leopold II wilde een station dat die ambitie waardig was. Het werk gebeurde in twee delen. Eerst bouwde ingenieur Clément Van Bogaert tussen 1895 en 1899 de enorme treinhal van ijzer en glas: 186 meter lang, 66 meter breed en 43 meter hoog. Die hoogte was niet alleen voor de show; ze gaf de rook van de stoomlocomotieven ruimte om op te stijgen.",
            "Daarna, tussen 1899 en 1905, bouwde architect Louis Delacenserie het stenen stationsgebouw ervoor. Hij noemde zijn eigen stijl een “barok-middeleeuws eclecticisme” en liet zich onder meer inspireren door het oude station van Luzern en het Pantheon in Rome. Het resultaat mengt zowat alles: koepels, pinakels, marmer, goud en meer dan een beetje theater.",
          ],
        },
        {
          heading: "Van kopstation naar doorgangsstation",
          kind: "history",
          paragraphs: [
            "Ongeveer een eeuw lang was dit een kopstation: treinen reden binnen, stopten en moesten achteruit weer vertrekken. Begin 21ste eeuw veranderde dat. Onder de oude treinhal werden nieuwe perrons op verschillende niveaus uitgegraven en onder de stad werd een tunnel aangelegd, zodat treinen nu dwars door Antwerpen kunnen rijden. De historische hal bleef er gerestaureerd bovenop staan, alsof er niets gebeurd was.",
          ],
        },
      ],
      didYouKnow: [
        "Toen koning Leopold II het afgewerkte station voor het eerst zag, zou hij minder onder de indruk geweest zijn dan iedereen verwachtte. Volgens een bekende anekdote merkte hij op: “C'est une petite belle gare”: “het is een mooi stationnetje”.",
        "De ijzeren treinhal is ouder dan het stenen gebouw waar je naar kijkt. De ingenieurs waren jaren eerder klaar met hun werk dan de architect met het zijne.",
      ],
      lookAt: [
        {
          title: "De klok en het stadswapen",
          body: "Loop de treinhal in en draai je om. Boven de ingang van het stationsgebouw vind je een grote klok, het woord ANTWERPEN en het stadswapen: een burcht met twee handen erboven. Onthoud die handen; ze komen later op deze wandeling terug, op de Grote Markt.",
        },
      ],
      transitionToNext:
        "Verlaat het station langs de westkant. Binnen enkele minuten kom je in een kleine wijk waar al eeuwenlang een heel ander soort schat verhandeld wordt.",
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "classics-diamond-district": {
      name: "De Diamantwijk",
      subtitle: "Een van de grootste diamantmarkten ter wereld, in een paar rustige straten",
      introduction: [
        "Kijk om je heen. Deze paar onopvallende straten naast het station, met hun camera's, paaltjes en anonieme kantoorgebouwen, vormen een van de belangrijkste diamantmarkten ter wereld. Een groot deel van de wereldhandel in ruwe diamant is door deze paar huizenblokken gepasseerd.",
      ],
      sections: [
        {
          heading: "Vijf eeuwen diamant",
          kind: "history",
          paragraphs: [
            "De band tussen Antwerpen en diamant is oud. De oudst bekende vermelding dateert van 1447, toen de stad regels uitvaardigde tegen de handel in valse edelstenen, diamanten inbegrepen. De handel was toen blijkbaar al belangrijk genoeg om te beschermen.",
            "De wijk waar je nu staat, groeide pas later, rond het station en de spoorweg, op het einde van de 19de eeuw. In 1893 werd de eerste diamantbeurs van de stad opgericht, de Diamantclub van Antwerpen; in 1904 volgde de Beurs voor Diamanthandel. Hier ontmoetten handelaars elkaar, bekeken ze stenen en sloten ze deals, vaak met niet veel meer dan een handdruk en een woord van vertrouwen.",
            "Een groot deel van de 20ste eeuw werd de handel getekend door de Antwerpse joodse gemeenschap, van wie veel families uit Centraal- en Oost-Europa kwamen. Later werden handelaars uit India steeds belangrijker. Wandel wat rond en je hoort in deze straten nog altijd veel talen.",
          ],
        },
        {
          heading: "Het slijpwiel",
          kind: "legend",
          paragraphs: [
            "Volgens de overlevering vond een ambachtsman met banden met Antwerpen, Lodewijk van Bercken, in de 15de eeuw de schijf uit: een slijpwiel bedekt met diamantstof en olie, waarmee alle facetten van een diamant symmetrisch geslepen konden worden. Het verhaal wordt vaak herhaald, maar het historische bewijs voor zijn leven en zijn uitvinding is mager. Zie het dus eerder als een trotse lokale traditie dan als vaststaand feit.",
          ],
        },
      ],
      didYouKnow: [
        "In het weekend van 15 en 16 februari 2003 braken dieven in deze wijk in de kluis van het Antwerp Diamond Centre in. De buit, geschat op meer dan 100 miljoen dollar aan diamanten, goud en juwelen, maakte het tot een van de grootste diamantroven uit de geschiedenis. Er volgden arrestaties, maar het grootste deel van de diamanten werd nooit teruggevonden.",
      ],
      transitionToNext:
        "Wandel terug naar het stationsplein en sla De Keyserlei in, de statige laan die naar de oude stad leidt. Rond 1900 kwam elke bezoeker die met de trein aankwam langs hier Antwerpen binnen.",
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "classics-keyserlei-meir": {
      name: "De Keyserlei & de Meir",
      subtitle: "De grote boulevard, en de dag waarop de oorlog de bioscoop binnenkwam",
      introduction: [
        "Je staat op De Keyserlei, de brede laan die het station met het hart van de stad verbindt. Voor je loopt ze verder als de Meir, de bekendste winkelstraat van Antwerpen. Op oude postkaarten van rond 1900 zie je precies hetzelfde beeld: elegante gebouwen, druk verkeer en helemaal achteraan de torenspits van de kathedraal die de weg wijst.",
      ],
      sections: [
        {
          heading: "16 december 1944",
          kind: "history",
          paragraphs: [
            "Deze straat draagt een van de donkerste herinneringen van Antwerpen. Nadat de stad in september 1944 bevrijd was, werd haar haven van levensbelang voor de bevoorrading van de geallieerde legers, en Duitsland antwoordde met zijn nieuwe V-wapens: vliegende bommen en V2-raketten die zonder waarschuwing insloegen.",
            "Op de namiddag van 16 december 1944 zaten ongeveer 1.100 mensen naar een film te kijken in Cinema Rex, op nummer 15 van deze laan. Om 15.20 uur trof een V2-raket het dak. Er vielen 567 doden: 271 burgers en 296 geallieerde soldaten. Het was het hoogste dodental door één enkele raketaanval in de hele oorlog, en het duurde bijna een week om iedereen onder het puin vandaan te halen.",
          ],
        },
        {
          heading: "Een paleis op de Meir",
          kind: "history",
          paragraphs: [
            "Wandel verder de Meir op en let op een lange, elegante 18de-eeuwse gevel: het Paleis op de Meir. Het werd vanaf 1745 gebouwd voor een rijke koopman, Johan Alexander van Susteren, door de Antwerpse architect Jan Pieter van Baurscheit de Jonge. Later kwam het in opmerkelijke handen: Napoleon kocht het in 1811-1812 maar woonde er nooit, de Russische tsaar Alexander I verbleef er in 1814, en lange tijd deed het dienst als koninklijk paleis.",
            "Vlak bij de Meir, aan de Wapper, staat het huis waar Peter Paul Rubens woonde en werkte. Je komt Rubens op deze wandeling nog een paar keer tegen.",
          ],
        },
      ],
      didYouKnow: [
        "Cinema Rex werd na de oorlog heropgebouwd en ging in 1947 opnieuw open. In 1993 sloot de zaal definitief de deuren, en twee jaar later werd ze afgebroken. Vandaag herinnert weinig in de straat voorbijgangers aan wat hier gebeurd is.",
        "Napoleon was eigenaar van het paleis op de Meir, maar tegen de tijd dat het klaar was voor hem, zat hij al in ballingschap op het eiland Elba.",
      ],
      transitionToNext:
        "Volg de Meir richting oude stad. Iets verderop aan de linkerkant glinstert een gouden koepel boven een statige ingang: een feestzaal die afbrandde en weer herrees.",
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "classics-stadsfeestzaal": {
      name: "Stadsfeestzaal",
      subtitle: "De feestzaal van de stad die uit haar as herrees",
      introduction: [
        "Voor je ligt de ingang van de Stadsfeestzaal. Stap binnen en kijk omhoog: een enorme zaal onder een glazen koepel bedekt met bladgoud. Vandaag is het een winkelcentrum, maar het werd voor iets heel anders gebouwd.",
      ],
      sections: [
        {
          heading: "Een zaal voor de stad",
          kind: "history",
          paragraphs: [
            "De Stadsfeestzaal opende op 8 februari 1908. Ze werd ontworpen door stadsarchitect Alexis Van Mechelen, in opdracht van de stad zelf, in een grootse neoclassicistische stijl. Antwerpen was rijk en zelfverzekerd, en wilde een plek voor bals, tentoonstellingen, beurzen en recepties: een salon voor de hele stad, midden in haar hoofdstraat.",
          ],
        },
        {
          heading: "De brand van 2000",
          kind: "history",
          paragraphs: [
            "Op 27 december 2000 veroorzaakte een kortsluiting een brand die het gebouw volledig uitbrandde. Toen de vlammen gedoofd waren, stonden alleen de monumentale trap, de historische gevel en de stalen dakconstructie nog overeind.",
            "Velen vreesden dat de zaal voorgoed verloren was. In 2004 sloot de stad een langlopende erfpacht met een projectontwikkelaar, en nog datzelfde jaar begon de restauratie. Onder toezicht van de erfgoedinstanties werden de glazen koepel met zijn bladgoud, de trap, de decoraties, beelden, mozaïeken, wandreliëfs en zelfs de eikenhouten parketvloer getrouw heropgebouwd. In 2007 ging de Stadsfeestzaal opnieuw open.",
          ],
        },
      ],
      didYouKnow: [
        "Een groot deel van het “historische” interieur dat je binnen ziet, is in werkelijkheid een zorgvuldige reconstructie uit de 21ste eeuw, gemaakt na de brand van 2000 op basis van foto's, plannen en bewaarde fragmenten.",
      ],
      transitionToNext:
        "Verlaat de Meir even en sla de smalle straatjes erachter in. Verborgen achter gewone gevels staat het gebouw waar Antwerpen de wereld ooit leerde handeldrijven.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "De Handelsbeurs",
      subtitle: "Waar de wereld zaken kwam doen",
      introduction: [
        "Voor je ligt de Handelsbeurs, de oude koopmansbeurs van Antwerpen. Vanaf de straat valt ze nauwelijks op. Binnen ligt een van de meest uitzonderlijke ruimtes van de stad: een gotische binnenplaats omringd door galerijen, overkoepeld door een torenhoog dak van ijzer en glas.",
        "We stappen nu terug naar de 16de eeuw, toen Antwerpen een van de rijkste steden van Europa was.",
      ],
      sections: [
        {
          heading: "Handeldrijven zonder telefoon",
          kind: "history",
          paragraphs: [
            "Stel je Antwerpen voor rond 1530. Schepen uit Portugal komen aan met specerijen uit Azië; kooplui uit Italië, Duitsland, Engeland en Spanje wonen in de stad. Ze moeten prijzen kennen, kopers vinden, geld lenen, ladingen verzekeren, en er zijn geen telefoons, geen kranten zoals wij ze kennen, geen internet. Informatie reist per brief en vooral van mond tot mond.",
            "Daarom bouwde Antwerpen een plek waar al die kooplui elkaar elke dag konden ontmoeten. In 1531 opende de stad een beurs, ontworpen door Domien de Waghemakere in laatgotische Brabantse stijl: een open binnenplaats omringd door een overdekte galerij met rijk versierde stergewelven. Het was een van de eerste gebouwen ter wereld die speciaal voor dat doel gebouwd werden. Hier werden, in een babylonische spraakverwarring, prijzen bepaald en deals gesloten.",
          ],
        },
        {
          heading: "Brand, en nog eens brand",
          kind: "history",
          paragraphs: [
            "Het gebouw dat je ziet, is niet zomaar dat van 1531. De beurs werd in 1583 heropgebouwd en brandde in 1858 af. Architect Joseph Schadde ontwierp daarna het huidige gebouw; de opdracht werd hem uiteindelijk in 1868 toegekend, en de nieuwe beurs werd op 19 oktober 1872 plechtig ingehuldigd. Hij behield het idee van de gotische binnenplaats, maar overdekte die met een spectaculair dak van ijzer en glas, en resten van de oude beurs werden in het complex opgenomen.",
            "Tegen het einde van de 20ste eeuw was de handel naar elders verhuisd, en het gebouw stond zo'n twintig jaar leeg. Na een grondige restauratie ging het in 2019 opnieuw open, nu als evenementenlocatie.",
          ],
        },
      ],
      didYouKnow: [
        "De Antwerpse beurs werd in het buitenland een voorbeeld. Toen Thomas Gresham, de agent van de Engelse kroon in Antwerpen, in de jaren 1560 de Royal Exchange in Londen oprichtte, nam hij de Antwerpse beurs als model.",
        "Het woord “beurs” zelf wordt meestal niet naar Antwerpen teruggevoerd, maar naar Brugge, waar kooplui samenkwamen voor het huis van de familie Van der Beurse.",
      ],
      transitionToNext:
        "Terug op de Meir kijk je omhoog. Boven de daken rijst een toren op, als een stukje New York dat in een middeleeuwse stad is neergezet. We stappen even vooruit in de tijd, voor onze reis naar het verleden echt begint.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "classics-boerentoren": {
      name: "De Boerentoren",
      subtitle: "De eerste wolkenkrabber van Europa",
      introduction: [
        "Voor je rijst de Boerentoren op. Met zijn getrapte, sobere silhouet lijkt hij eerder thuis te horen in het New York van de jaren 1930 dan in een stad vol gotische kerken, en dat is precies wat de bouwers wilden.",
      ],
      sections: [
        {
          heading: "Een Amerikaanse droom op de Schoenmarkt",
          kind: "history",
          paragraphs: [
            "Het huizenblok waarop hij staat, was tijdens de Eerste Wereldoorlog verwoest. Toen de stad een wedstrijd uitschreef voor de heropbouw, was de opdracht duidelijk: bouw een Amerikaanse wolkenkrabber. De architecten Jan Vanhoenacker, Emiel Van Averbeke en Jos Smolderen ontwierpen een toren in art-decostijl, en de bouw liep van 1929 tot 1932, met het oog op de wereldtentoonstelling die Antwerpen in 1930 hield.",
            "Het skelet is een stalen geraamte van zo'n 3.500 ton, gemaakt door het Duitse bedrijf Demag. Met 25 verdiepingen en een hoogte van 87,5 meter was het de eerste wolkenkrabber van Europa en toen ook de hoogste. Bij een renovatie van de top in 1975 werd hij 95,75 meter hoog, met 26 verdiepingen.",
          ],
        },
      ],
      didYouKnow: [
        "De bijnaam komt van de eigenaars: in het gebouw kwam de spaarkas van de Boerenbond, de Belgische boerenorganisatie. Een toren vol spaargeld van boeren, midden in de stad.",
      ],
      transitionToNext:
        "Van hieruit wijst de toren je de weg naar het oude hart van Antwerpen. Wandel naar het grote plein voor je, waar de kathedraal voor het eerst in haar volle hoogte verschijnt, en waar de grond onder je voeten een geheim verbergt.",
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "classics-groenplaats": {
      name: "Groenplaats",
      subtitle: "Een plein dat vroeger een kerkhof was",
      introduction: [
        "Je staat op de Groenplaats, een van de levendigste pleinen van Antwerpen, met de kathedraal die boven de daken uitsteekt en Peter Paul Rubens op een sokkel in het midden. Het voelt als een plek gemaakt voor terrasjes en markten. Eeuwenlang was het iets heel anders.",
      ],
      sections: [
        {
          heading: "Het kerkhof van de kathedraal",
          kind: "history",
          paragraphs: [
            "Dit plein vormde samen met de Lijnwaadmarkt, de Melkmarkt, de Schoenmarkt en de Handschoenmarkt rond de kathedraal ooit het kerkhof van de kathedraal. De Antwerpenaren noemden het het Groot Kerkhof, en later het Groen Kerkhof. Sommigen gebruiken die naam vandaag nog.",
            "In 1754 werd het kerkhof ommuurd, maar niet voor lang. In 1784 verbood keizer Jozef II om redenen van volksgezondheid begrafenissen binnen de steden, en in 1799 ging de muur neer. Het kerkhof werd langzaam het plein dat je nu ziet.",
          ],
        },
        {
          heading: "Rubens neemt zijn plaats in",
          kind: "history",
          paragraphs: [
            "In 1840 herdacht Antwerpen dat Rubens 200 jaar eerder gestorven was. Willem Geefs ontwierp een standbeeld, maar er was te weinig geld en het brons was niet op tijd klaar. Daarom werd op 25 augustus 1840 op een ander plein een voorlopige gipsen versie onthuld. Pas op 9 en 10 augustus 1843 kreeg de bronzen Rubens zijn plaats hier, midden op de Groenplaats.",
          ],
        },
      ],
      didYouKnow: [
        "Wie hier op een terras zit, zit op wat eeuwenlang de begraafplaats van de kathedraal was.",
      ],
      transitionToNext:
        "Wandel naar de kathedraal. Kijk onderweg naar de rij huizen die tegen het koor van de kerk gebouwd is. Ze verbergen de funderingen van een kathedraal die nooit afgewerkt werd.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Onze-Lieve-Vrouwekathedraal",
      subtitle: "De kathedraal die Antwerpen bijna nog groter maakte",
      introduction: [
        "Voor je staat de Onze-Lieve-Vrouwekathedraal, een van de grootste gotische kerken van de Nederlanden en eeuwenlang het baken dat zeelui op de Schelde als eerste zagen. De noordtoren, zo'n 123 meter hoog, beheerst nog altijd de skyline.",
        "We zijn nu in de late middeleeuwen. De kathedraal werd gebouwd over een periode van ongeveer 170 jaar, van het midden van de 14de eeuw tot 1521, door generaties bouwers die wisten dat ze haar nooit af zouden zien.",
      ],
      sections: [
        {
          heading: "Nog groter: het Nieuwerck",
          kind: "history",
          paragraphs: [
            "In 1521, net toen de kerk voltooid was, besliste Antwerpen dat ze niet groot genoeg was. De rijkste stad van Noord-Europa wilde een kerk die daarbij paste, en Domien de Waghemakere en Rombout Keldermans ontwierpen een gigantische uitbreiding van het koor: het Nieuwerck.",
            "Op 15 juli 1521 legde de jonge keizer Karel V zelf de eerste steen. Toen sloeg het noodlot toe. Een grote brand in 1533 beschadigde de kerk zwaar, al het geld ging naar het herstel van het bestaande gebouw, de werken aan het Nieuwerck werden stilgelegd en in 1537 werd het project definitief opgegeven.",
          ],
        },
        {
          heading: "Stormen van de geschiedenis",
          kind: "history",
          paragraphs: [
            "De kathedraal heeft heel wat doorstaan. Tijdens de Beeldenstorm van 1566, een golf van protestantse woede tegen beelden, werd een groot deel van het interieur kort en klein geslagen. Twee eeuwen later bezetten Franse revolutionaire troepen de stad, sloten ze de kerk en voerden ze haar schatten weg.",
            "Veel van wat je vandaag binnen kunt zien, werd achteraf teruggebracht of gerestaureerd, waaronder altaarstukken van Rubens die tot zijn beroemdste werken behoren.",
          ],
        },
      ],
      didYouKnow: [
        "Het Nieuwerck werd nooit gebouwd, maar het verdween ook niet helemaal. De funderingen en pijlers ervan zitten nog in de rij huizen rond het koor, tussen de Lijnwaadmarkt en de Groenplaats. Sommige van die huizen staan letterlijk op het begin van een kathedraal die nooit afgewerkt werd.",
        "De eerste steen van Karel V droeg een Latijns opschrift dat vermeldde dat de keizer hem op de iden van juli 1521 legde.",
      ],
      lookAt: [
        {
          title: "Anderhalve toren",
          body: "Kijk naar de voorgevel van de kathedraal. De linkertoren (de noordtoren) rijst helemaal op tot zijn sierlijke spits; de rechtertoren (de zuidtoren) houdt op ongeveer een derde van die hoogte op. Het plan voorzag twee grote torens, maar er werd er maar één voltooid. Bekijk de ets uit 1649 op deze pagina: het scheve silhouet was toen al hetzelfde.",
        },
      ],
      transitionToNext:
        "Wandel rond de kathedraal naar de Oude Koornmarkt. Zoek goed naar een smalle ingang tussen de huizen: die leidt naar een verborgen steegje dat de tijd lijkt te zijn vergeten.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Een geheime doorgang naar het oude Antwerpen",
      introduction: [
        "Stap door de smalle ingang en het lawaai van de stad verdwijnt. Je bent in de Vlaeykensgang, een kronkelend steegje tussen oude bakstenen muren, binnenplaatsjes en kleine huisjes. Even kun je je makkelijk het Antwerpen van eeuwen geleden voorstellen.",
      ],
      sections: [
        {
          heading: "Achterbouwen die een straat werden",
          kind: "history",
          paragraphs: [
            "De gang werd in 1591 aangelegd, al droeg ze toen nog niet deze naam; de naam is jonger dan het steegje zelf. De kleine gebouwen begonnen in de 16de eeuw als achterbouwen en pakhuizen achter de huizen in de omliggende straten. Na verloop van tijd groeide het complex uit tot een binnengang, en vanaf de 17de eeuw werden de gebouwen als kleine, bescheiden woningen gebruikt.",
          ],
        },
        {
          heading: "Op het nippertje gered",
          kind: "history",
          paragraphs: [
            "In de jaren 1960 was het steegje sterk verkommerd, en er waren plannen om het af te breken voor een parking. In 1969 kocht antiquair en interieurontwerper Axel Vervoordt het complex. De gevels en daken werden in 1973 als monument beschermd, en in 1977 begon de restauratie.",
          ],
        },
      ],
      didYouKnow: [
        "Een van de sfeervolste hoekjes van het oude Antwerpen bestaat vandaag omdat het ooit zo waardeloos werd gevonden dat er een parking van gemaakt kon worden.",
      ],
      transitionToNext:
        "Volg het steegje en de zijstraten naar het grote marktplein van de stad. Maak je klaar om omhoog te kijken: de gevels eromheen zitten vol goud.",
    },

    // ── 10 ───────────────────────────────────────────────────────────────
    "classics-grote-markt": {
      name: "Grote Markt & de gildehuizen",
      subtitle: "Het gouden plein dat jonger is dan het lijkt",
      introduction: [
        "Je staat op de Grote Markt, het centrale plein van Antwerpen. Aan de ene kant staat het stadhuis; rond de rest van het plein staan hoge gildehuizen met trap- en krulgevels, bekroond met vergulde figuren die het zonlicht vangen.",
        "De gilden waren de verenigingen van ambachtslieden en handelaars die een groot deel van het stadsleven regelden: wie mocht werken, wat er verkocht mocht worden en van welke kwaliteit. Hun huizen hier waren hun visitekaartje.",
      ],
      sections: [
        {
          heading: "De Spaanse Furie",
          kind: "history",
          paragraphs: [
            "In november 1576 plunderden muitende Spaanse soldaten Antwerpen; bij het stadhuis hoor je daar meer over. Het vuur dat ze aanstaken, raasde over dit plein en verwoestte de huizen die hier stonden. Wat daarna verrees, was een nieuwe generatie gebouwen.",
            "Het mooiste voorbeeld is het huis van de Oude Voetboog, de Sint-Jorisgilde. Het werd gebouwd in 1515-1516, in 1576 verwoest en in 1580-1582 in renaissancestijl heropgebouwd. De gevel geldt als een van de hoogtepunten van de Antwerpse renaissancearchitectuur.",
          ],
        },
        {
          heading: "Een 19de-eeuwse droom van de gouden eeuw",
          kind: "history",
          paragraphs: [
            "Veel van wat je ziet, is jonger dan het lijkt. In 1895 liet een burger, R. Joostens, bij testament geld na om de vroegere pracht van de Grote Markt te herstellen. Van het einde van de 19de eeuw tot het begin van de 20ste eeuw werden de gevels aan de noordkant van het plein, en nummer 44 aan de zuidkant, vrij gereconstrueerd en verfraaid in de geest van de 16de eeuw.",
          ],
        },
      ],
      didYouKnow: [
        "Verschillende van de “oude” gildehuizen op dit plein zijn in werkelijkheid reconstructies van rond 1900. Antwerpen bewaarde zijn gouden eeuw niet alleen; het verbeeldde die ook liefdevol opnieuw.",
      ],
      lookAt: [
        {
          title: "De vergulde figuren",
          body: "Kijk omhoog naar de toppen van de gevels. Zoek de gouden Sint-Joris te paard die de draak bevecht, op het huis van de Oude Voetboog, de Sint-Jorisgilde. Zoek daarna de andere figuren en emblemen: veel ervan verwijzen naar de gilde die eigenaar was van het huis. Vergelijk het plein met de foto uit 1905 op deze pagina.",
        },
      ],
      transitionToNext:
        "Midden op het plein staat een bronzen figuur op het punt iets de lucht in te gooien. Wandel naar de fontein: die vertelt het beroemdste verhaal dat Antwerpen heeft.",
    },

    // ── 11 ───────────────────────────────────────────────────────────────
    "classics-brabo": {
      name: "De Brabofontein",
      subtitle: "Een reus, een hand en de naam van een stad",
      introduction: [
        "Voor je staat de Brabofontein. Boven op een stapel rotsen, omringd door zeedieren en figuren, leunt een jonge man achterover en gooit iets ver weg. Kijk goed wat hij vasthoudt: het is een hand.",
      ],
      sections: [
        {
          heading: "De legende van Druon Antigoon",
          kind: "legend",
          paragraphs: [
            "Lang geleden, zo gaat het verhaal, woonde aan de Schelde een reus die Druon Antigoon heette. Hij bewaakte de rivier en eiste tol van elk schip dat voorbij wilde. Wie weigerde of niet kon betalen, werd een hand afgehakt, en die gooide de reus in de rivier.",
            "Toen kwam er een jonge Romeinse soldaat, Silvius Brabo. Hij daagde de reus uit, versloeg hem, hakte de hand van de reus zelf af en gooide die in de Schelde. En zo, zegt de legende, kreeg de stad haar naam: hand werpen, Antwerpen.",
          ],
        },
        {
          heading: "Wat historici denken",
          kind: "interpretation",
          paragraphs: [
            "Het is een prachtig verhaal, maar geen verklaring die historici ernstig nemen. De herkomst van de naam Antwerpen is onzeker. De meeste verklaringen brengen hem niet in verband met handen, maar met land: met grond die langs de rivier was opgehoogd, een stuk land “ervoor”, gevormd of opgeworpen door het water. De legende van de reus is een veel latere poging om een naam te verklaren waarvan de echte oorsprong vergeten was.",
          ],
        },
        {
          heading: "De fontein",
          kind: "history",
          paragraphs: [
            "De fontein is gemaakt door de Antwerpse beeldhouwer Jef Lambeaux, die zijn ontwerp in 1883 grotendeels had uitgewerkt. Ze werd in 1887 op de Grote Markt geplaatst, voor het stadhuis, in een tijd dat Antwerpen zijn eigen geschiedenis en identiteit graag in de verf zette.",
          ],
        },
      ],
      didYouKnow: [
        "De handen uit de legende zie je overal in Antwerpen: in het stadswapen, met een burcht en twee handen erboven, en in de chocolade en koekjes in de vorm van “Antwerpse handjes” die in de winkels rondom verkocht worden.",
      ],
      transitionToNext:
        "Draai je naar het lange, lichte gebouw achter Brabo. Het overleefde een van de verschrikkelijkste nachten uit de geschiedenis van de stad.",
    },

    // ── 12 ───────────────────────────────────────────────────────────────
    "classics-stadhuis": {
      name: "Stadhuis",
      subtitle: "Gebouwd met trots, verbrand in furie",
      introduction: [
        "Voor je staat het stadhuis van Antwerpen. De lange gevel is rustig en horizontaal, met een hoog, rijk versierd middenstuk dat erboven uitsteekt. Toen het gebouwd werd, was het een van de modernste gebouwen van Europa: een renaissancepaleis voor een stad op het toppunt van haar macht.",
      ],
      sections: [
        {
          heading: "Een paleis voor de stad",
          kind: "history",
          paragraphs: [
            "Het stadhuis werd gebouwd tussen 1561 en 1565, naar ontwerpen van Cornelis Floris de Vriendt samen met andere architecten en kunstenaars. Antwerpen was toen een van de rijkste steden van Europa, en het wilde zijn bestuur onderbrengen in een gebouw dat dat ook liet zien.",
          ],
        },
        {
          heading: "De Spaanse Furie, 4 november 1576",
          kind: "history",
          paragraphs: [
            "Amper tien jaar later was dit gebouw getuige van een ramp. De Nederlanden waren in opstand tegen de Spaanse koning, en zijn soldaten in de streek waren al lange tijd niet betaald. Op 4 november 1576 bestormden muitende Spaanse troepen Antwerpen en begonnen de stad te plunderen.",
            "Het stadsbestuur organiseerde een tegenaanval vanuit dit stadhuis, hier op de Grote Markt. De soldaten staken het gebouw in brand. De vlammen sloegen over naar de omliggende huizen, waarvan er honderden afbrandden. Van het stadhuis bleven alleen de buitenmuren overeind.",
            "Hoeveel mensen er stierven, is niet precies bekend. De schattingen lopen uiteen van enkele honderden tot ongeveer 8.000; veel historici denken dat meer dan 7.000 mensen het leven lieten. De gebeurtenis werd bekend als de Spaanse Furie, en ze deed het vertrouwen wankelen van wat de grote handelsstad van Europa was geweest.",
          ],
        },
      ],
      didYouKnow: [
        "Het gebouw dat je ziet, werd na de brand van 1576 hersteld. Bekijk de foto op deze pagina, genomen halverwege de jaren 1860: vanaf het plein zag het stadhuis er toen grotendeels uit zoals vandaag.",
      ],
      lookAt: [
        {
          title: "Het middenstuk",
          body: "Vergelijk de sobere vleugels van de gevel met het middendeel, dat vol zuilen, nissen en beelden zit en boven de daklijn uitsteekt. Dat contrast, rustig en ordelijk met een uitbarsting van versiering in het midden, is typisch voor de renaissance die Floris naar Antwerpen bracht.",
        },
      ],
      transitionToNext:
        "Verlaat de Grote Markt en wandel oostwaarts door rustige straten naar een klein plein dat veel bezoekers het mooiste van Antwerpen noemen.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
    "classics-conscienceplein": {
      name: "Hendrik Conscienceplein",
      subtitle: "De man die zijn volk leerde lezen",
      introduction: [
        "Je staat op het Hendrik Conscienceplein, een rustig, besloten plein voor een barokkerk. Voor de oude bibliotheek staat het standbeeld van schrijver Hendrik Conscience.",
      ],
      sections: [
        {
          heading: "Een schrijver voor de Vlamingen",
          kind: "history",
          paragraphs: [
            "In de 19de eeuw beheerste het Frans het openbare leven, het bestuur en de literatuur in België, ook in Vlaanderen. Hendrik Conscience schreef in het Nederlands, voor gewone Vlaamse lezers. Zijn historische roman De Leeuw van Vlaenderen, verschenen in 1838, werd een symbool van Vlaamse trots en ontvoogding.",
            "In 1883 kreeg hij een standbeeld op dit plein, dat tot dan het Jezuïetenplein heette en naar hem werd hernoemd. Voor een levende auteur was dat ongehoord. Conscience poseerde zelf voor de beeldhouwer, Frans Joris, maar door zijn zwakke gezondheid kon hij de onthulling in augustus 1883 niet bijwonen. Een maand later overleed hij.",
          ],
        },
      ],
      didYouKnow: [
        "De bekende woorden op het standbeeld, “Hij leerde zijn volk lezen”, werden voor het eerst uitgesproken bij de onthulling, door dichter Jan Van Beers. Maar het was niet de beeldhouwer die ze bedacht: het idee kwam van Henriëtte Mertens, de vrouw van de dichter.",
      ],
      transitionToNext:
        "Draai je nu om. De rijk versierde kerk achter je is de volgende halte, en de plek waar we de tijd van Rubens binnenstappen.",
    },

    // ── 14 ───────────────────────────────────────────────────────────────
    "classics-carolus-borromeus": {
      name: "Sint-Carolus Borromeuskerk",
      subtitle: "Het verloren meesterwerk van Rubens",
      introduction: [
        "Voor je rijst de gevel van de Sint-Carolus Borromeuskerk op: gelaagd, gebeeldhouwd, theatraal, een totaal andere wereld dan de gotische kathedraal. Dit is de barok, de stijl van Rubens en van de Contrareformatie, bedoeld om de zintuigen te overweldigen en de gelovigen te ontroeren.",
      ],
      sections: [
        {
          heading: "Het pronkstuk van de jezuïeten",
          kind: "history",
          paragraphs: [
            "De kerk werd tussen 1615 en 1621 gebouwd door de jezuïeten, de katholieke orde die in de voorste linies van de Contrareformatie stond. Ze werd ontworpen door de jezuïetenarchitecten Pieter Huyssens en François d'Aguilon, en toegewijd aan de stichter van de orde, de heilige Ignatius van Loyola.",
            "Peter Paul Rubens, toen op het toppunt van zijn roem, was er nauw bij betrokken. Voor de zijbeuken en galerijen maakte zijn atelier 39 plafondschilderijen op basis van zijn schetsen; de jonge Antoon van Dyck hielp mee aan het werk. Een eeuw lang was dit een van de prachtigste kerkinterieurs van Europa.",
          ],
        },
        {
          heading: "De bliksem van 1718",
          kind: "history",
          paragraphs: [
            "Op 18 juli 1718 sloeg de bliksem in de kerk in en zette haar in brand. Alle 39 plafondschilderijen van Rubens gingen verloren. Het interieur werd daarna in een soberdere stijl heropgebouwd, naar een ontwerp van Jan Pieter van Baurscheit de Oude.",
            "Later in de 18de eeuw werd de jezuïetenorde opgeheven, en de kerk werd opnieuw toegewijd aan de heilige Carolus Borromeus, de naam die ze vandaag nog draagt.",
          ],
        },
      ],
      didYouKnow: [
        "Hoe de plafonds van Rubens eruitzagen, weten we alleen dankzij een reeks prenten: gravures van Jan Punt naar aquarellen van Jacob de Wit. De afbeelding op deze pagina is er een van: een verloren Rubens, bewaard op papier.",
      ],
      transitionToNext:
        "Van de barok gaan we nu verder terug, naar de late middeleeuwen. Wandel noordwaarts richting rivier, naar een opvallend gebouw met rode en witte strepen.",
    },

    // ── 15 ───────────────────────────────────────────────────────────────
    "classics-vleeshuis": {
      name: "Het Vleeshuis",
      subtitle: "Een paleis voor slagers",
      introduction: [
        "Voor je staat het Vleeshuis. Met zijn hoge gevels, torens en opvallende banden van rode baksteen en witte natuursteen lijkt het wel een kasteel of een stadhuis. Het werd gebouwd voor de slagers van de stad.",
      ],
      sections: [
        {
          heading: "Het beenhouwersambacht",
          kind: "history",
          paragraphs: [
            "Het Vleeshuis werd tussen 1501 en 1504 in laatgotische stijl gebouwd voor de gilde van de beenhouwers. Het ontwerp was van Herman de Waghemakere de Oude; na zijn dood in 1502 werd het werk waarschijnlijk voortgezet door zijn zoon Domien, dezelfde Domien die later de beurs bouwde en aan de kathedraal en Het Steen werkte.",
            "Het vertelt je veel over hoe voedsel in een middeleeuwse stad georganiseerd was. De benedenverdieping was een markthal met 62 vleesbanken, waar de beenhouwers van de gilde hun vlees verkochten, en er was ook de kapel van de gilde. Boven lagen de vergaderzaal, de feestzaal en het archief van de gilde. De gilde bepaalde wie mocht verkopen, en waar.",
          ],
        },
      ],
      didYouKnow: [
        "Niet alles mocht binnen verkocht worden. Orgaanvlees en ingewanden waren niet toegelaten in de hal; die werden verkocht in kleine winkeltjes, de penshuisjes, die buiten tegen het gebouw tussen de steunberen gebouwd waren.",
        "De rood-witte banden in de muren heten speklagen. Het is verleidelijk om te denken dat ze een grapje over de beenhouwers waren, maar ze hebben niets met de vleeshandel te maken: het was gewoon een bouwmode die tot ver in de 17de eeuw populair bleef.",
      ],
      lookAt: [
        {
          title: "De speklagen",
          body: "Kijk naar de muren: rijen rode baksteen wisselen af met banden van lichte zandsteen. Nu je hun naam kent, zul je deze speklagen op veel oude gebouwen in Antwerpen en elders in Vlaanderen herkennen.",
        },
      ],
      transitionToNext:
        "Wandel een paar straten verder naar het noorden, de oude havenbuurt in. Hier staat een kerk waarvan het verhaal verbonden is met de rivier, en met vuur.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
    "classics-sint-paulus": {
      name: "Sint-Pauluskerk",
      subtitle: "Gotisch, barok en gered uit de vlammen",
      introduction: [
        "Voor je staat de Sint-Pauluskerk, een gotische kerk met een verrassende barokke torenbekroning. Ze staat vlak bij de Schelde, in wat eeuwenlang de buurt van zeelui, havenarbeiders en kooplui was.",
      ],
      sections: [
        {
          heading: "Een klooster aan de rivier",
          kind: "history",
          paragraphs: [
            "Dit was de kerk van de dominicanen, een orde van predikbroeders. Een vroegere kerk op deze plek werd in 1276 ingewijd door de beroemde geleerde Albertus Magnus. Vanaf 1517 werd ter vervanging de huidige kerk gebouwd, in de 16de eeuw, toen de Antwerpse handel bloeide.",
            "De Schelde was nooit ver weg. De rivier bracht de schepen, de goederen en de mensen die deze buurt vulden, en de kerk diende een wijk waarvan het ritme bepaald werd door de getijden en de haven.",
          ],
        },
        {
          heading: "Twee branden",
          kind: "history",
          paragraphs: [
            "In 1679 verwoestte een felle brand een deel van de gewelven van het schip en de top van de westgevel. Bij de herstellingen van 1680-1681 kreeg de kerk haar barokke torenbekroning, die je vandaag ziet.",
            "Bijna drie eeuwen later, in april 1968, sloeg het vuur opnieuw toe. Het hele dak ging verloren, de gewelven en het interieur raakten beschadigd, de barokke torenbekroning brandde volledig uit en driekwart van het aanpalende klooster werd een ruïne. De kerk werd gerestaureerd; haar schatten, waaronder schilderijen van Rubens, Van Dyck en Jordaens, zijn binnen nog altijd te zien.",
          ],
        },
      ],
      didYouKnow: [
        "Naast de kerk legden de dominicanen tussen 1699 en 1747 een Calvarietuin aan: een pad met tientallen beelden dat naar het kruis klimt, opgevat als een soort theater in steen. Het is een van de verrassendste bezienswaardigheden van de stad.",
      ],
      transitionToNext:
        "Wandel naar de rivier. Aan de waterkant staat het oudste gebouw van Antwerpen, het laatste overblijfsel van de burcht waar de stad begon.",
    },

    // ── 17 ───────────────────────────────────────────────────────────────
    "classics-het-steen": {
      name: "Het Steen",
      subtitle: "Het laatste stuk van de burcht waar Antwerpen begon",
      introduction: [
        "Voor je staat Het Steen: een kleine burcht met torens en kantelen aan de oever van de Schelde. Het lijkt een sprookjesburcht, maar wat je ziet is maar een fragment van iets veel groters: de burcht, het versterkte hart van waaruit Antwerpen gegroeid is.",
      ],
      sections: [
        {
          heading: "Waar de stad geboren werd",
          kind: "history",
          paragraphs: [
            "Rond het jaar 850 stond hier een vluchtburcht, met een aarden wal beschermd tegen invallen van de Vikingen. Eind 10de eeuw werd de grond opgehoogd en werd er waarschijnlijk een gracht gegraven. Rond 1200-1225 werd de stenen burcht, Het Steen, gebouwd, samen met een muur rond de burcht.",
            "Vanaf het begin van de 14de eeuw diende het gebouw als gevangenis, een rol die het meer dan vijf eeuwen zou houden, tot 1823.",
          ],
        },
        {
          heading: "Karel V bouwt opnieuw",
          kind: "history",
          paragraphs: [
            "Rond 1520 liet keizer Karel V Het Steen herbouwen, naar een ontwerp van Domien de Waghemakere en Rombout II Keldermans, dezelfde namen die je bij de kathedraal tegenkwam. Van de oudere burcht bleef alleen de onderbouw bewaard. In 1549 schonk Karel V het gebouw aan de stad.",
          ],
        },
        {
          heading: "De dag dat de burcht verdween",
          kind: "history",
          paragraphs: [
            "Eeuwenlang zat Het Steen verscholen tussen de huizen en straten van de oude burcht. Toen, in de jaren 1880, werden de Scheldekaaien rechtgetrokken en heraangelegd voor de moderne haven. De oude burchtwijk werd afgebroken; de burchtmuur langs de rivier verdween in 1883. Alleen Het Steen bleef bewaard, en in 1887-1890 werd het gerestaureerd en kreeg het een nieuwe neogotische noordvleugel.",
            "In 1952 werd het het Nationaal Scheepvaartmuseum. Na een renovatie vanaf 2018 ging het in oktober 2021 opnieuw open.",
          ],
        },
      ],
      didYouKnow: [
        "Wat jij als “de burcht” ziet, is maar een klein deel van de middeleeuwse burcht. Het grootste deel werd in de jaren 1880 afgebroken om plaats te maken voor de kaaien.",
        "Het Steen diende als gevangenis van het begin van de 14de eeuw tot 1823: meer dan 500 jaar.",
      ],
      lookAt: [
        {
          title: "Twee soorten steen",
          body: "Kijk naar het onderste deel van de muren. De onderbouw is van donkergrijze Doornikse steen: het enige deel dat van de oudere burcht overbleef. Daarboven rijst de lichtere zandsteen van de herbouwing door Karel V uit het begin van de 16de eeuw. Je kijkt letterlijk naar twee tijdperken die op elkaar gestapeld zijn.",
        },
        {
          title: "Het figuurtje boven de poort",
          body: "Zoek boven de toegangspoort naar een klein, verweerd stenen figuurtje. Volgens de overlevering stelt het Semini voor, een oude vruchtbaarheidsgod. Volgens de erfgoedinventaris werd het rond 1587 verminkt, naar verluidt door de jezuïeten, die het onzedig vonden. Toch overleefde het, en het zit er vandaag nog altijd.",
        },
      ],
      transitionToNext:
        "Wandel de laatste paar stappen naar het water. Onze reis terug in de tijd eindigt waar het verhaal van Antwerpen begon.",
    },

    // ── 18 ───────────────────────────────────────────────────────────────
    "classics-scheldt": {
      name: "De Schelde",
      subtitle: "Waar het allemaal begon",
      introduction: [
        "Ga aan de waterkant staan en kijk naar de rivier. De Schelde is hier breed, grijs en onrustig, voortgestuwd door de getijden van de Noordzee. Het lijkt misschien het einde van de stad. In werkelijkheid is ze de reden waarom de stad bestaat.",
      ],
      sections: [
        {
          heading: "Alles wat je gezien hebt",
          kind: "interpretation",
          paragraphs: [
            "Denk even terug aan de wandeling. De burcht achter je werd gebouwd om deze rivier te bewaken. Het Vleeshuis, de gildehuizen en de beurs werden betaald met de handel die ze aanvoerde. De toren van de kathedraal was het eerste wat zeelui zagen. Kooplui uit heel Europa kwamen naar de Handelsbeurs vanwege de schepen die hier aanmeerden. Rubens schilderde voor een stad die door de rivier rijk geworden was. Zelfs de diamanten en het grootse station horen bij een stad die door de haven machtig werd.",
            "De rivier bracht rijkdom, maar ook oorlog, migranten, ideeën en kunst. Ze maakte Antwerpen internationaal lang voor dat woord bestond.",
          ],
        },
        {
          heading: "Een rivier gesloten en heropend",
          kind: "history",
          paragraphs: [
            "De Schelde kon ook afgenomen worden. Na de val van Antwerpen in 1585 blokkeerde de vloot van de Republiek der Verenigde Nederlanden de rivier, en de toegang van Antwerpen tot de zee was twee eeuwen lang afgesloten. Pas in 1795 werd de scheepvaart officieel weer vrijgemaakt. Rond 1811 liet Napoleon hier nieuwe dokken graven, en in 1863 kocht België eindelijk de oude Nederlandse Scheldetol af.",
            "In de jaren 1880 werden de kaaien rechtgetrokken voor de moderne haven, het moment waarop Het Steen zijn burcht verloor. En de rivier vraagt nog altijd respect: na de stormvloed van 3 januari 1976, toen het water in Antwerpen tot meer dan zeven meter steeg, werd het Sigmaplan gelanceerd om het hele Scheldebekken tegen overstromingen te beschermen.",
          ],
        },
      ],
      didYouKnow: [
        "Ongeveer tweehonderd jaar lang, van de blokkade na 1585 tot 1795, was Antwerpen een grote haven zonder vrije toegang tot de zee. Het is een van de redenen waarom de gouden eeuw van de stad ten einde kwam.",
      ],
      closing: {
        timeline: [
          "Antwerpen-Centraal: de 20ste eeuw begint",
          "De Stadsfeestzaal en de Boerentoren: een zelfbewuste moderne stad",
          "De Handelsbeurs: een 19de-eeuwse hal op een 16de-eeuws idee",
          "Carolus Borromeus: Rubens en de barok",
          "Het stadhuis en het Vleeshuis: de 16de-eeuwse handelsmetropool",
          "De kathedraal: het middeleeuwse Antwerpen",
          "Het Steen: de burcht waar de stad begon",
          "De Schelde",
        ],
        finalLines: [
          "Je begon deze wandeling bij een station dat gebouwd werd voor de moderne tijd. Met elke halte ging je verder terug: van de 20ste eeuw naar de 19de, naar Rubens en de barok, naar de kooplui van de 16de eeuw, naar de middeleeuwse kathedraal en de oude burcht.",
          "En nu sta je waar het allemaal begon: aan de rivier.",
          "Je bent niet zomaar door Antwerpen gewandeld. Je bent terug door zijn geschiedenis gewandeld.",
        ],
      },
    },
  },

  images: {
    "central-station-1906": {
      caption: "Antwerpen-Centraal kort na de voltooiing, op een postkaart van rond 1906.",
      alt: "Oude postkaart van de stenen gevel met koepel van het Centraal Station van Antwerpen, met mensen op het plein ervoor",
      approximateYear: "ca. 1906",
    },
    "central-station-hall-1909": {
      caption: "Binnen in het stationsgebouw, op een postkaart verstuurd in 1909.",
      alt: "Oude postkaart van een hoge, rijk versierde hal met balkons en boogramen in het station",
      approximateYear: "1909",
    },
    "central-station-today": {
      caption: "De treinhal vandaag, met de klok, het woord ANTWERPEN en het stadswapen boven de ingang.",
      alt: "Moderne foto van de treinhal van ijzer en glas met de rijk versierde stenen voorkant van het stationsgebouw",
      approximateYear: "2023",
    },
    "diamond-pelikaanstraat": {
      caption: "De Pelikaanstraat, aan de rand van de huidige diamantwijk, rond 1900.",
      alt: "Oude postkaart van een straat met kasseien en winkels, een paard-en-kar en een toren in de verte",
      approximateYear: "ca. 1900",
    },
    "keyserlei-1903": {
      caption: "De Keyserlei in 1903. Helemaal aan het einde van de laan wijst de torenspits van de kathedraal al de weg.",
      alt: "Oude postkaart van een brede laan met bomen, karren en statige gebouwen, met een kerktoren in de verte",
      approximateYear: "1903",
    },
    "meir-1910": {
      caption: "De Meir op een postkaart verstuurd in 1910, met een paardentram.",
      alt: "Oude postkaart van een plein met een paardentram en winkelpuien",
      approximateYear: "ca. 1910",
    },
    "stadsfeestzaal-today": {
      caption: "De ingang van de Stadsfeestzaal op de Meir, heropgebouwd na de brand van 2000.",
      alt: "Moderne foto van een rijk versierde stenen ingang met een vergulde nis en het woord STADSFEESTZAAL",
      approximateYear: "2014",
    },
    "handelsbeurs-1890": {
      caption: "De beurszaal van Joseph Schadde rond 1890: een gotische binnenplaats onder een dak van ijzer en glas.",
      alt: "Oude foto van een gotische binnenplaats met galerijen onder een groot dak van ijzer en glas",
      approximateYear: "ca. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "Dezelfde zaal in een pentekening van Maxime Lalanne, gemaakt vóór 1886.",
      alt: "Pentekening van de beurszaal met kooplui die op de binnenplaats staan",
      approximateYear: "vóór 1886",
    },
    "boerentoren-1930s": {
      caption: "De Boerentoren torent boven zijn buren uit, op een postkaart uit de jaren 1930.",
      alt: "Oude postkaart van een hoge art-decotoren boven een druk plein met trams",
      approximateYear: "jaren 1930",
    },
    "groenplaats-1899": {
      caption: "De Groenplaats rond 1899, met Rubens op zijn sokkel en de kathedraal achter de bomen.",
      alt: "Oude postkaart van een plein met bomen, een standbeeld en de kathedraaltoren erachter",
      approximateYear: "ca. 1899",
    },
    "cathedral-hollar-1649": {
      caption: "De kathedraal op een ets van Wenceslaus Hollar, 1649. De zuidtoren was toen al onafgewerkt.",
      alt: "Gedetailleerde ets van de voorgevel van de kathedraal met één hoge spits en één veel kortere toren",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "De torenspits van de kathedraal boven de daken, rond 1908.",
      alt: "Oude postkaart van de hoge gotische toren van de kathedraal boven een plein",
      approximateYear: "ca. 1908",
    },
    "grote-markt-1905": {
      caption: "De Grote Markt in 1905, met de Brabofontein links en de gildehuizen erachter.",
      alt: "Ingekleurde oude postkaart van het plein met de fontein en hoge gildehuizen met trapgevels",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Gildehuizen op de Grote Markt vandaag, met hun vergulde figuren op de gevels.",
      alt: "Moderne foto van hoge stenen gildehuizen met gouden beelden erbovenop tegen een blauwe lucht",
      approximateYear: "2021",
    },
    "brabo-photochrom": {
      caption: "Brabo gooit de hand van de reus weg: een kleurendruk uit de jaren 1890.",
      alt: "Ingekleurde historische druk van het bronzen Brabobeeld op een rotsachtige fontein voor de gildehuizen",
      approximateYear: "jaren 1890",
    },
    "stadhuis-1866": {
      caption: "Het stadhuis op een vroege foto van halverwege de jaren 1860, opgekleefd in een album gedateerd 1867.",
      alt: "Vroege foto van de lange renaissancegevel van het stadhuis",
      approximateYear: "1865-1867",
    },
    "conscienceplein-historical": {
      caption: "Het Hendrik Conscienceplein rond 1900, met de bibliotheek achter het standbeeld van Conscience.",
      alt: "Oude postkaart van een statig gebouw aan een plein met een standbeeld voor de ingang",
      approximateYear: "ca. 1900",
    },
    "carolus-ceiling-punt-1748": {
      caption: "De Aanbidding der Wijzen, een van de verloren plafondschilderijen van Rubens voor deze kerk, alleen bekend via prenten zoals deze 18de-eeuwse gravure van Jan Punt naar Jacob de Wit.",
      alt: "Zwart-witgravure van de drie koningen die geschenken aanbieden aan Maria met het Kind",
      approximateYear: "18de eeuw",
    },
    "vleeshuis-1901": {
      caption: "“Vieille Boucherie”: het Vleeshuis en omgeving op een postkaart verstuurd rond 1901.",
      alt: "Oude postkaart van een hoog bakstenen gebouw met een poortboog en kinderen op straat",
      approximateYear: "ca. 1901",
    },
    "sint-paulus-1901": {
      caption: "De Sint-Pauluskerk en de cafés eromheen, op een postkaart gedateerd 1901.",
      alt: "Oude postkaart van een gotische kerk met een barokke toren boven kleine huizen en cafés",
      approximateYear: "1901",
    },
    "steen-photochrom": {
      caption: "Het Steen en de haven in de jaren 1890, een paar jaar nadat de kaaien waren rechtgetrokken.",
      alt: "Ingekleurde historische druk van de kleine burcht naast de kaai met schepen en mensen",
      approximateYear: "jaren 1890",
    },
    "steen-1920": {
      caption: "Een drukke dag bij Het Steen en de haven, rond 1920.",
      alt: "Oude postkaart van een menigte, karren en schepen naast de burcht op de kaai",
      approximateYear: "ca. 1920",
    },
    "steen-today": {
      caption: "Het Steen vandaag.",
      alt: "Moderne foto van de torens van de burcht tegen een blauwe lucht",
      approximateYear: "2015",
    },
    "scheldt-quays-1900": {
      caption: "De Scheldekaaien rond 1900, vol schepen en loodsen.",
      alt: "Geïllustreerde oude postkaart van stoomschepen en zeilboten langs de kaai",
      approximateYear: "ca. 1900",
    },
    "scheldt-photochrom": {
      caption: "Antwerpen gezien vanaf de rivier in de jaren 1890: Het Steen links, de kathedraal die boven de stad uitrijst.",
      alt: "Ingekleurde historische druk van de skyline van Antwerpen gezien over de rivier, met boten op de voorgrond",
      approximateYear: "jaren 1890",
    },
  },
};
