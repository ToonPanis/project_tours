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
      "Een wandeling met verhaal, van het grootse spoorwegstation tot aan de oevers van de Schelde: negentien haltes, acht eeuwen en de verhalen achter de bekendste plekken van Antwerpen.",
    description:
      "Wandel van het grootse station van Antwerpen door eeuwen van handel, kunst, geloof en macht, tot waar het verhaal van de stad begon: aan de oevers van de Schelde.\n\nBij elke halte wordt je smartphone je gids: waar je naar kijkt, waarom het gebouwd werd, wat er gebeurd is en welke details de meeste bezoekers gewoon voorbijlopen. Historische foto's laten zien hoe de stad er een eeuw geleden en langer uitzag. Er zijn geen spelletjes of vragen; alleen Antwerpen, en de tijd om er echt naar te kijken.",
    highlights: [
      "19 van de belangrijkste historische plekken van Antwerpen",
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
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Zoek het stadswapen van Antwerpen",
        task: [
          "Zoek het stadswapen van Antwerpen.",
          "De foto is je aanwijzing: kijk goed rond, binnen en buiten het station. Gevonden? Tik dan op de knop hieronder.",
        ],
      },
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
      moreStories: {
        "jewish-community": {
          title: "De Joodse gemeenschap",
          subtitle: "De Tweede Wereldoorlog en daarna",
          sections: [
            {
              heading: "De Tweede Wereldoorlog",
              kind: "history",
              paragraphs: [
                "18 augustus 1941: de Wehrmacht valt de Diamantkring binnen en neemt diamanten in beslag. 164 leden van de Diamantkring worden vermoord.",
                "Zomer 1942: razzia's, onder meer op 15–16 en 28–29 augustus, in straten als de Van Immerseelstraat, de Lange Kievitstraat en de Provinciestraat. De data verschillen iets per bron.",
                "Bij de razzia van 28–29 augustus voerde de Antwerpse politie zelf de arrestaties uit. Dat was uniek in de Belgische bezettingsgeschiedenis.",
                "De slachtoffers werden via Kazerne Dossin in Mechelen naar Auschwitz-Birkenau gedeporteerd.",
              ],
            },
            {
              heading: "Hoeveel?",
              kind: "history",
              paragraphs: [
                "Tussen 56% en 66% van de Antwerpse Joden werd gedeporteerd, afhankelijk van de berekening: meer dan de helft, volgens sommige berekeningen twee derde. Volgens Antwerpen Herdenkt overleefden ongeveer 10.000 Joden uit de regio de oorlog niet.",
              ],
            },
            {
              heading: "Na de oorlog",
              kind: "history",
              paragraphs: [
                "In 1945 woonden er nog ongeveer 2.000 Joden in de stad. Eind jaren 1940 waren het er weer ongeveer 10.000, een sterk orthodoxe gemeenschap.",
              ],
            },
          ],
        },
      },
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
      ],
      didYouKnow: [
        "Cinema Rex werd na de oorlog heropgebouwd en ging in 1947 opnieuw open. In 1993 sloot de zaal definitief de deuren, en twee jaar later werd ze afgebroken. Vandaag herinnert weinig in de straat voorbijgangers aan wat hier gebeurd is.",
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
        "Volg de Meir verder richting oude stad. Een paar minuten verderop wacht Spooky op je, met een opdracht…",
    },

    // ── 4b: Spooky's quest ───────────────────────────────────────────────
    // `name` and `subtitle` show BEFORE the façade is found: they must not give it away.
    "classics-paleis-op-de-meir": {
      name: "Een mysterie op de Meir",
      subtitle: "De gevel van Spooky's tekening",
      introduction: [
        "Gevonden! De lange, elegante 18de-eeuwse gevel voor je is het Paleis op de Meir.",
      ],
      sections: [
        {
          heading: "Een paleis op de Meir",
          kind: "history",
          paragraphs: [
            "Het werd vanaf 1745 gebouwd voor een rijke koopman, Johan Alexander van Susteren, door de Antwerpse architect Jan Pieter van Baurscheit de Jonge. Later kwam het in opmerkelijke handen: Napoleon kocht het in 1811-1812 maar woonde er nooit, de Russische tsaar Alexander I verbleef er in 1814, en lange tijd deed het dienst als koninklijk paleis.",
          ],
        },
      ],
      didYouKnow: [
        "Napoleon was eigenaar van het paleis op de Meir, maar tegen de tijd dat het klaar was voor hem, zat hij al in ballingschap op het eiland Elba.",
      ],
      quest: {
        title: "Spooky's opdracht",
        task: [
          "Bekijk deze oude bouwtekening goed. Ergens op de Meir staat het gebouw dat erbij hoort.",
          "Wandel naar de zoekzone op de kaart, kijk omhoog naar de gevels en vergelijk ze met de tekening. Kun jij ontdekken welk gebouw het is? Sta je ervoor, dan merkt Hidden Antwerp het vanzelf.",
        ],
        zoneHint: "Het gebouw bevindt zich ergens binnen deze zone.",
        revealedName: "Paleis op de Meir",
      },
      transitionToNext:
        "Een paar stappen verder gaat naast de Meir een pleintje open: de Wapper, waar de beroemdste schilder van Antwerpen zijn huis bouwde.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-rubenshuis": {
      name: "Het Rubenshuis",
      subtitle: "Waar de grootste schilder van Antwerpen woonde en werkte",
      introduction: [
        "Je staat op de Wapper, een pleintje vlak bij de Meir. Achter de gevel voor je woonde en werkte Peter Paul Rubens, de beroemdste schilder die Antwerpen ooit voortbracht, tot aan zijn dood in 1640.",
        "Het portret bovenaan deze pagina is Rubens zoals hij zichzelf in 1623 schilderde, op het hoogtepunt van zijn roem: een brede zwarte hoed, een donkere mantel, een rustige en zelfverzekerde blik. Vandaag hoort dat zelfportret bij de Britse Royal Collection.",
      ],
      sections: [
        {
          heading: "Een Italiaans palazzo aan de Wapper",
          kind: "history",
          paragraphs: [
            "In 1608 kwam Rubens na acht jaar in Italië terug naar Antwerpen. In 1610 kocht hij hier een bestaand Vlaams huis, en het decennium daarna bouwde hij het om tot een woning en atelier op Italiaanse wijze: een atelier in barokstijl, een kunstkamer met een halfronde beeldengalerij, een monumentaal portiek en een tuinpaviljoen. In 1617 trokken hij en zijn vrouw Isabella Brant erin.",
            "Na zijn dood werd het huis verhuurd, verbouwd en opgedeeld. De stad kocht het in 1937, en tussen 1937 en 1946 reconstrueerde stadsarchitect Emiel Van Averbeke het, grotendeels op basis van gravures van Harrewijn uit 1684 en 1692. Het portiek, het tuinpaviljoen en de buitenmuren van het atelier zijn grotendeels origineel; het woonhuis en zijn interieurs zijn een reconstructie.",
          ],
        },
        {
          heading: "Rubens en Isabella",
          kind: "history",
          paragraphs: [
            "Op 3 oktober 1609, een jaar na zijn terugkeer uit Italië, trouwde de 32-jarige Rubens met de 18-jarige Isabella Brant. Rond die tijd schilderde hij hen samen: het dubbelportret op deze pagina, dat vandaag in de Alte Pinakothek in München hangt. Isabella woonde met hem in dit huis tot aan haar dood in 1626.",
          ],
        },
        {
          heading: "Het schilderij lezen",
          kind: "interpretation",
          paragraphs: [
            "Het paar zit dicht tegen elkaar in een prieel van kamperfoelie. Hun rechterhanden rusten op elkaar: sinds de Romeinse tijd waren ineengelegde rechterhanden een teken van het huwelijk. Kamperfoelie stond voor blijvende liefde; een van de Duitse namen ervan, Jelängerjelieber, betekent “hoe langer, hoe liever”.",
            "Kijk ook naar de kleren en de houding. Rubens draagt het verfijnde kostuum van een edelman, zijn hand dicht bij het gevest van een degen; Isabella draagt een hoge hoed, een brede kanten kraag en een rijk geborduurd keurslijf. Het grote formaat en de kostbare kleren tonen het jonge paar als mensen van aanzien. Een schilder die zichzelf met zijn bruid buiten laat zien, ontspannen, als verliefd stel: voor zijn tijd was het dubbelportret baanbrekend.",
          ],
        },
        {
          heading: "Waarom het bij deze wandeling hoort",
          kind: "interpretation",
          paragraphs: [
            "Het schilderij markeert het begin van het leven dat Rubens op deze plek opbouwde: een huwelijk, een groeiend atelier en een huis dat de wereld liet zien wie hij was. Een jaar na het huwelijk kocht hij dit huis. Verder op de wandeling kom je hem opnieuw tegen: op de Groenplaats, waar de stad zijn standbeeld neerzette, in de kathedraal, waar altaarstukken van zijn hand hangen, en in de Sint-Carolus Borromeuskerk, waarvan zijn atelier ooit de plafonds versierde.",
          ],
        },
      ],
      didYouKnow: [
        "Van 1648 tot 1660, na de dood van Rubens, werd het huis gehuurd door William en Margaret Cavendish, Engelse royalisten die in ballingschap leefden.",
      ],
      infoBoxes: [
        {
          kind: "visit",
          title: "Het Rubenshuis bezoeken",
          paragraphs: [
            "Het huis zelf is gesloten voor restauratie tot minstens 2030. De tuin, de bibliotheek en de Rubens Experience in het nieuwe bezoekersgebouw zijn open; de bezoekersingang ligt aan de achterkant, aan Hopland 13.",
            "Bekijk de openingsuren en ticketprijzen op de website van het Rubenshuis voor je gaat.",
          ],
          checkedOn: "2026-09-30",
          sourceUrl: "https://rubenshuis.be/nl/vraag-antwoord",
        },
      ],
      transitionToNext:
        "Verlaat de Meir even en sla de smalle straatjes erachter in. Verborgen achter gewone gevels staat het gebouw waar Antwerpen de wereld ooit leerde handeldrijven.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "De Handelsbeurs",
      subtitle: "Waar de wereld zaken kwam doen",
      introduction: [
        "Voor je ligt de Handelsbeurs, de oude koopmansbeurs van Antwerpen. Vanaf de straat valt ze nauwelijks op. Binnen ligt een van de meest uitzonderlijke ruimtes van de stad: een gotische binnenplaats omringd door galerijen, overkoepeld door een torenhoog dak van ijzer en glas.",
        "Denk dat dak nu eens weg. Meer dan drie eeuwen lang was het hart van dit gebouw een open binnenplaats onder de blote hemel, waar de kooplui van half Europa elkaar elke dag ontmoetten.",
      ],
      sections: [
        {
          heading: "Een plein onder de open hemel",
          kind: "history",
          paragraphs: [
            "In 1531 opende Antwerpen een nieuwe beurs, ontworpen door Domien de Waghemakere in laatgotische Brabantse stijl. Het hart ervan was een rechthoekige binnenplaats, open naar de hemel en aan alle vier de kanten omringd door overdekte galerijen met stergewelven op zuilen.",
            "Elke dag kwamen kooplui uit Portugal, Italië, Duitsland, Engeland en Spanje op dat open plein samen om, in een babylonische spraakverwarring, prijzen te bepalen, krediet te geven en wisselbrieven te verhandelen. Als het regende, schuilden ze onder de galerijen; boven de galerijen lagen winkels en kamers. De gravure bovenaan deze pagina toont de binnenplaats vol groepjes handelaars.",
            "Het was een van de eerste gebouwen ter wereld die speciaal voor de handel gebouwd werden, en het idee vond navolging. Toen Thomas Gresham, de agent van de Engelse kroon in Antwerpen, in de jaren 1560 de Royal Exchange in Londen oprichtte, nam hij deze binnenplaats met haar galerijen als model; Amsterdam volgde in 1611.",
          ],
        },
        {
          heading: "Een dak over de binnenplaats",
          kind: "history",
          paragraphs: [
            "Pas in 1852-1854 werd de binnenplaats voor het eerst overdekt, door ingenieur Charles Marcellis, met ijzer en een glazen koepel. Vier jaar later, op 2 augustus 1858, verwoestte een brand zowel de oude beurs als haar nieuwe dak.",
            "Architect Joseph Schadde bouwde ze opnieuw op; de nieuwe beurs werd op 19 oktober 1872 ingehuldigd. Hij behield de binnenplaats met haar galerijen, die nog altijd het grondplan van 1531 volgen, maar overdekte die met het spectaculaire dak van ijzer en glas dat je vandaag ziet.",
          ],
        },
      ],
      didYouKnow: [
        "Meer dan drie eeuwen lang, van 1531 tot het eerste dak van 1852-1854, deden de Antwerpse kooplui hun zaken in zon, wind en regen, op een binnenplaats onder de open hemel.",
      ],
      galleries: {
        "exchange-in-prints": {
          title: "De beurs in oude prenten",
          intro: "Twee 19de-eeuwse prenten van de galerijen, van vóór en na de brand van 1858.",
        },
      },
      transitionToNext:
        "Terug op de Meir kijk je omhoog. Boven de daken rijst een toren op, als een stukje New York dat in een middeleeuwse stad is neergezet. We stappen even vooruit in de tijd, voor onze reis naar het verleden echt begint.",
    },

    // ── 7 ────────────────────────────────────────────────────────────────
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

    // ── 8 ────────────────────────────────────────────────────────────────
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
            "Een schilderij uit 1597, hieronder afgebeeld, geeft een idee van het kerkhof in die tijd: een begrafenisstoet van rouwenden in het zwart trekt erlangs, met de kathedraal die erachter oprijst.",
          ],
        },
        {
          heading: "Rubens neemt zijn plaats in",
          kind: "history",
          paragraphs: [
            "In 1840 herdacht Antwerpen dat Rubens 200 jaar eerder gestorven was. Willem Geefs ontwierp een standbeeld, maar er was te weinig geld en het brons was niet op tijd klaar. Daarom werd op 25 augustus 1840 op een ander plein een voorlopige gipsen versie onthuld. Pas op 9 en 10 augustus 1843 kreeg de bronzen Rubens zijn plaats hier, midden op de Groenplaats.",
            "Geefs beeldde hem uit als schilder en diplomaat: aan zijn voeten liggen een palet en een degen, want Rubens diende de Spaanse koning ook als gezant. Passend voor een vroeger kerkhof staat het beeld op de plek van een oud kerkhofkruis, boven het graf van een bisschop, Antonius d'Espinosa.",
          ],
        },
      ],
      didYouKnow: [
        "Wie hier op een terras zit, zit op wat eeuwenlang de begraafplaats van de kathedraal was.",
      ],
      transitionToNext:
        "Wandel naar de kathedraal. Kijk onderweg naar de rij huizen die tegen het koor van de kerk gebouwd is. Ze verbergen de funderingen van een kathedraal die nooit afgewerkt werd.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Onze-Lieve-Vrouwekathedraal",
      subtitle: "De kathedraal die Antwerpen bijna nog groter maakte",
      introduction: [
        "Voor je staat de Onze-Lieve-Vrouwekathedraal, een van de grootste gotische kerken van de Nederlanden en eeuwenlang het baken dat zeelui op de Schelde als eerste zagen. De noordtoren, zo'n 123 meter hoog, beheerst nog altijd de skyline.",
        "We zijn nu in de late middeleeuwen. De kathedraal werd gebouwd over een periode van ongeveer 170 jaar, van het midden van de 14de eeuw tot 1521, door generaties bouwers die wisten dat ze haar nooit af zouden zien.",
      ],
      sections: [],
      didYouKnow: [],
      cards: {
        cathedral: {
          title: "De kathedraal",
          subtitle: "Twee eeuwen bouwen, en een plan dat te groot was",
          sections: [
            {
              heading: "Gebouwd over 170 jaar",
              kind: "history",
              paragraphs: [
                "De bouw begon in 1352 en duurde tot 1521, met een lange onderbreking tussen 1356 en 1378. Generaties bouwmeesters volgden elkaar op volgens hetzelfde plan, onder wie Peter Appelmans en Herman en Domien de Waghemakere. Het geld kwam van schenkingen, de gilden en de stad; als het op was, lag het werk gewoon stil.",
                "De noordtoren, zo'n 123 meter hoog, werd rond 1518-1521 voltooid en is nog altijd de hoogste kerktoren van de Benelux. De zuidtoren werd in 1475 bij gebrek aan geld stilgelegd, op ongeveer 65 meter, en werd nooit afgewerkt.",
              ],
            },
            {
              heading: "Nog groter: het Nieuwerck",
              kind: "history",
              paragraphs: [
                "In 1521, net toen de kerk voltooid was, besliste Antwerpen dat ze niet groot genoeg was. De rijkste stad van Noord-Europa wilde een kerk die daarbij paste, en Domien de Waghemakere en Rombout Keldermans ontwierpen een gigantische uitbreiding van het koor: het Nieuwerck.",
                "Op 15 juli 1521 legde de jonge keizer Karel V zelf de eerste steen. Maar rond 1528 bekoelde het enthousiasme al, en in de nacht van 5 op 6 oktober 1533 beschadigde een grote brand het dak en de pijlers van de kerk zwaar; de oorzaak is onbekend. Al het geld ging naar het herstel van het bestaande gebouw, en in 1537 werd het Nieuwerck definitief opgegeven.",
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
        },
        "quinten-matsijs": {
          title: "Quinten Matsijs",
          subtitle: "Van smid tot schilder?",
          sections: [
            {
              heading: "Een schilder voor de kathedraal",
              kind: "history",
              paragraphs: [
                "Quinten Matsijs (rond 1466-1530) werd in Leuven geboren als zoon van een smid en werd een van de toonaangevende schilders van Antwerpen in zijn gouden eeuw. In 1491 werd hij meester in de Sint-Lucasgilde, de gilde van de schilders.",
                "Zijn band met deze kerk is echt. Tussen 1508 en 1511 schilderde hij een groot altaarstuk voor het altaar van de schrijnwerkersgilde in de kathedraal: een Bewening van Christus tussen taferelen uit het leven van Johannes de Doper en Johannes de Evangelist. Vandaag hangt het in het KMSKA, het Koninklijk Museum voor Schone Kunsten Antwerpen.",
              ],
            },
            {
              heading: "De smid die schilderde uit liefde",
              kind: "legend",
              paragraphs: [
                "Antwerpen vertelt een romantisch verhaal over hem. Quinten, zo gaat het, was een smid die verliefd werd op een meisje dat een schilder verkoos boven een smid. Dus legde hij zijn hamer neer en nam hij het penseel op. Karel van Mander, die het verhaal in 1604 optekende, geeft ook een andere versie: door een lange ziekte kon hij het zware smidswerk niet meer aan, en hij begon prenten in te kleuren om zijn moeder te onderhouden.",
                "Een ander verhaal zegt dat hij op een schilderij van de vader van zijn geliefde een vlieg schilderde die zo levensecht was dat de man haar probeerde weg te vegen, en daarna met het huwelijk instemde.",
              ],
            },
            {
              heading: "Wat historici zeggen",
              kind: "interpretation",
              paragraphs: [
                "Er is geen bewijs dat Quinten zelf ooit als smid gewerkt heeft; zijn vader wel. Historici zien het verhaal als een legende die met de tijd gegroeid is. Het is wel een oude legende: het Latijnse vers onder zijn portret, in 1572 in Antwerpen gedrukt en bovenaan deze kaart afgebeeld, laat hem al zeggen dat de liefde de smid tot schilder maakte.",
              ],
            },
          ],
          didYouKnow: [
            "Vlak naast de kathedraal, op de Handschoenmarkt, staat een waterput met een gotische smeedijzeren overkapping, bekroond met een kleine Brabo. Volgens de overlevering is het smeedwerk van Matsijs, maar dat is niet bewezen. Een paar meter verderop, op de westgevel van de kathedraal, draagt een gedenksteen met zijn portret de Latijnse regel “Connubialis amor de Mulcibre fecit Apellem”: de huwelijksliefde maakte van de smid een schilder.",
          ],
        },
        "nello-patrasche": {
          title: "Nello & Patrasche",
          subtitle: "Een Engelse roman, een Japanse klassieker en een marmeren beeld",
          sections: [
            {
              heading: "Het verhaal",
              kind: "fiction",
              paragraphs: [
                "Nello is een arme weesjongen die in een dorp “een uur gaans van Antwerpen” woont. Met zijn hond Patrasche, die de kar trekt, brengt hij elke dag melk naar de stad. Nello droomt ervan schilder te worden en wil dolgraag de twee schilderijen van Rubens in de kathedraal zien, maar die zijn afgedekt, en alleen wie betaalt, mag ze zien.",
                "Hij doet mee aan een tekenwedstrijd, wint niet en verliest alles. Op kerstavond vindt hij de kerk open en ziet hij eindelijk De Kruisoprichting en De Kruisafneming. De volgende ochtend worden Nello en Patrasche samen voor de schilderijen gevonden, doodgevroren.",
              ],
            },
            {
              heading: "Een boek uit Engeland, een klassieker in Japan",
              kind: "history",
              paragraphs: [
                "A Dog of Flanders (in het Nederlands Een hond van Vlaanderen) werd geschreven door de Engelse schrijfster Ouida (Marie Louise de la Ramée). Het verscheen eind 1871 in een tijdschrift en in 1872 als boek. De twee schilderijen zijn echt: ze hangen nog altijd in deze kathedraal. In de roman staan ze voor de kunst waar Nello naar verlangt, en die verborgen blijft voor wie niet kan betalen.",
                "Lange tijd was het verhaal in Vlaanderen zelf nauwelijks bekend. In het buitenland werd het een klassieker: het werd vanaf 1935 verschillende keren verfilmd in de Verenigde Staten, en in Japan maakte de animereeks van 1975 er een kinderklassieker van. Een documentaire uit 2007 heette dan ook Patrasche, a Dog of Flanders – Made in Japan.",
              ],
            },
            {
              heading: "Het beeld",
              kind: "history",
              paragraphs: [
                "In 2016 werd op de Handschoenmarkt, voor de kathedraal, een beeld van Batist Vermeulen geplaatst. Het verving een gedenksteen uit 2003. Nello en Patrasche liggen in elkaars armen te slapen, onder een deken gemaakt van de kasseien van het plein zelf. Sinds november 2022 wordt het 's nachts verlicht.",
              ],
            },
          ],
          didYouKnow: [
            "Ouida noemt het dorp van Nello nergens bij naam. De link met Hoboken, vandaag een district van Antwerpen, werd pas later gelegd.",
          ],
        },
      },
      lookAt: [
        {
          title: "Anderhalve toren",
          body: "Kijk naar de voorgevel van de kathedraal. De linkertoren (de noordtoren) rijst helemaal op tot zijn sierlijke spits; de rechtertoren (de zuidtoren) houdt op ongeveer de helft van die hoogte op. Het plan voorzag twee grote torens, maar er werd er maar één voltooid. Bekijk de ets uit 1649 op deze pagina: het scheve silhouet was toen al hetzelfde.",
        },
      ],
      transitionToNext:
        "Wandel rond de kathedraal naar de Oude Koornmarkt. Zoek goed naar een smalle ingang tussen de huizen: die leidt naar een verborgen steegje dat de tijd lijkt te zijn vergeten.",
    },

    // ── 10 ───────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Een geheime doorgang naar het oude Antwerpen",
      introduction: [
        "Stap door de smalle ingang en het lawaai van de stad verdwijnt. Je bent in de Vlaeykensgang, een kronkelend steegje tussen oude bakstenen muren, binnenplaatsjes en kleine huisjes. Even kun je je makkelijk het Antwerpen van eeuwen geleden voorstellen.",
        "De Vlaeykensgang wordt vaak een van de oudste en smalste steegjes van Antwerpen genoemd. De erfgoedinventaris maakt zo'n rangschikking niet, maar bevestigt wel wat de plek bijzonder maakt: een L-vormige, gekasseide gang met elf kleine achterhuizen, die bijna helemaal zijn oude uitzicht bewaard heeft.",
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

    // ── 11 ───────────────────────────────────────────────────────────────
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

    // ── 12 ───────────────────────────────────────────────────────────────
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

    // ── 13 ───────────────────────────────────────────────────────────────
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
      // The Spanish Fury, as slides: the approved section, paragraph by paragraph, each with its images.
      cards: {
        "fury-attack": {
          title: "De Spaanse Furie, 4 november 1576",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Amper tien jaar later was dit gebouw getuige van een ramp. De Nederlanden waren in opstand tegen de Spaanse koning, en zijn soldaten in de streek waren al lange tijd niet betaald. Op 4 november 1576 braken muitende Spaanse troepen uit de citadel ten zuiden van de stad, kregen versterking van muiters uit Aalst, bestormden Antwerpen en begonnen de stad te plunderen.",
              ],
            },
          ],
        },
        "fury-city-hall": {
          title: "Het stadhuis in vlammen",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Het stadsbestuur organiseerde een tegenaanval vanuit dit stadhuis, hier op de Grote Markt. De Antwerpse burgers verdedigden zich op het plein en in het gebouw, en schoten vanuit de ramen van het stadhuis op de Spaanse ruiters die over het plein aanstormden. De ruiters leden zware verliezen, tot enkelen van hen zich een weg naar binnen baanden en het gebouw in brand staken met bundels stro die ze hadden meegebracht.",
              ],
            },
          ],
        },
        "fury-city": {
          title: "De stad in chaos",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "De vlammen sloegen over naar de omliggende huizen: ongeveer zeshonderd brandden af, de meeste achter en naast het stadhuis. Van het stadhuis zelf bleven alleen de buitenmuren overeind.",
              ],
            },
            {
              kind: "history",
              paragraphs: [
                "Hoeveel mensen er stierven, is niet precies bekend. De schattingen lopen uiteen van enkele honderden tot ongeveer 8.000; veel historici denken dat meer dan 7.000 mensen het leven lieten. De gebeurtenis werd bekend als de Spaanse Furie, en ze deed het vertrouwen wankelen van wat de grote handelsstad van Europa was geweest.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Verlaat de Grote Markt en wandel oostwaarts door rustige straten naar een klein plein dat veel bezoekers het mooiste van Antwerpen noemen.",
    },

    // ── 14 ───────────────────────────────────────────────────────────────
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

    // ── 15 ───────────────────────────────────────────────────────────────
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

    // ── 16 ───────────────────────────────────────────────────────────────
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
      galleries: {
        "vleeshuis-postcards": {
          title: "Het Vleeshuis op oude postkaarten",
          intro: "Drie oude postkaarten van Museum Vleeshuis tonen de zalen, ingericht met schouwen, meubels en voorwerpen uit de collectie.",
        },
      },
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Zoek de oude burchtmuur",
        task: [
          "Zoek de oude muur die vanaf het begin van de 13de eeuw de burcht beschermde.",
          "De foto is je aanwijzing: zoek rond het Vleeshuis een stuk muur zoals dit. Gevonden? Tik dan op de knop hieronder.",
        ],
      },
      transitionToNext:
        "Wandel een paar straten verder naar het noorden, de oude havenbuurt in. Hier staat een kerk waarvan het verhaal verbonden is met de rivier, en met vuur.",
    },

    // ── 17 ───────────────────────────────────────────────────────────────
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

    // ── 18 ───────────────────────────────────────────────────────────────
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
          heading: "De beul van Antwerpen",
          kind: "history",
          paragraphs: [
            "Als stadsgevangenis maakte Het Steen deel uit van het Antwerpse gerecht. De schout, de gerechtsofficier van de stad, vervolgde; de schepenen oordeelden; en de beul voerde het vonnis uit. Verdachten werden hier verhoord, soms onder foltering, in een ondergrondse kamer.",
            "Tussen 1405 en 1550 voltrok de Antwerpse beul minstens 336 onthoofdingen met het zwaard, de meeste op de Grote Markt voor het stadhuis. Andere vonnissen werden uitgevoerd op de Meir, aan de oever van de Schelde en op het galgenveld. Tussen 1558 en 1562 werden meer dan vijftig veroordeelden verdronken, bij voorkeur in het geheim binnen in Het Steen: openbare ketterverbrandingen hadden te veel onrust veroorzaakt.",
            "Het verging de beulen zelf niet altijd goed. In 1508 verknoeide een nieuwe beul, een voormalige schoenmakersgezel, zijn eerste onthoofding, en kinderen bekogelden hem met stenen. En op 17 januari 1565 werd meester Geleyn, sinds 1542 de beul van de stad, zelf op de Meir onthoofd, veroordeeld voor moord, diefstal en geweld.",
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
        "Er zijn maar weinig echte folter- of executiewerktuigen bewaard: in 1794 verbrandden de Fransen de meeste ervan.",
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

    // ── 19 ───────────────────────────────────────────────────────────────
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
      galleries: {
        "siege-of-antwerp": {
          title: "Het beleg van Antwerpen, 1584–1585",
          intro: "De val van Antwerpen in 1585 kwam na een beleg van meer dan een jaar door Alexander Farnese, hertog van Parma. Deze prenten tonen hoe hij de rivier afsloot, en hoe de stad probeerde door te breken.",
        },
      },
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
    // Clue of Spooky's task at the station: says where it was taken, not what to find.
    "central-station-hall-clue-today": {
      caption: "Spooky's aanwijzing: een foto genomen in het station.",
      alt: "Foto van een rijk versierde muur onder een dak van glas en ijzer, met een klok, vergulde versieringen en een naam in gouden letters",
      approximateYear: "2006",
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
    "vleeshuis-wall-clue": {
      caption: "Spooky's aanwijzing: een oude foto van een hoekje bij het Vleeshuis.",
      alt: "Zwart-witfoto van een ruwe muur van onregelmatige stenen tegen een hoog bakstenen gebouw",
      approximateYear: "datum onbekend",
    },
    "vleeshuis-postcard-kitchen": {
      caption: "Een zaal ingericht als oude keuken, met een grote haard, koperen ketels en een versierde waterpomp met een bak (postkaart van Museum Vleeshuis, datum onbekend; collectie MAS).",
      alt: "Sepia postkaart van een zaal met een grote schouw, koperen ketels bij de haard, betegelde muren, twee stoelen en een sierlijke pomp met een stenen bak",
      approximateYear: "datum onbekend",
    },
    "vleeshuis-postcard-panelled-room": {
      caption: "Een kamer met een schouw, gesneden kasten, versierde wandpanelen en een beeld op een kast (postkaart van Museum Vleeshuis, datum onbekend; collectie MAS).",
      alt: "Sepia postkaart van een kamer waarvan de muren bekleed zijn met versierde panelen, met een schouw, gesneden kasten, een tafel en een beeld",
      approximateYear: "datum onbekend",
    },
    "vleeshuis-postcard-hall": {
      caption: "Een zaal met een lange tafel en stoelen, een glazen kroonluchter, een staande klok en een rijk gesneden schouw met daarboven een zittende figuur (postkaart van Museum Vleeshuis, datum onbekend; collectie MAS).",
      alt: "Sepia postkaart van een zaal met een lange tafel omringd door stoelen, een glazen kroonluchter, glas-in-loodramen, een staande klok en een grote gesneden schouw",
      approximateYear: "datum onbekend",
    },
    "siege-parma-bridge": {
      caption: "De schipbrug van Parma over de Schelde, voltooid in februari 1585 om de stad af te snijden van hulp over het water; Antwerpen ligt aan de horizon. Prent van Lamberecht Causé naar Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Gravure van een lange brug op boten over een brede rivier, met soldaten en rijtuigen erop, oorlogsschepen eromheen en in de verte de skyline van een stad",
      approximateYear: "1670–1699",
    },
    "siege-bridge-attack": {
      caption: "April 1585: Antwerpen stuurt branders op de brug af. Volgens de titel ontsnapte Alexander van Parma zelf maar nipt aan de dood, maar de brug hield stand en de aanslag mislukte. Prent van Lamberecht Causé naar Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Gravure van een enorme ontploffing op een schipbrug, met planken, boten en soldaten die door de lucht vliegen en rook boven de rivier",
      approximateYear: "1670–1699",
    },
    "siege-map-luyken": {
      caption: "Het hele beleg op één kaart van Jan Luyken (1680–1684): Antwerpen linksboven, de schipbrug in het midden, het ondergelopen land en rechts de gevechten op de Kouwensteinsedijk in mei 1585, opnieuw een mislukte poging om door te breken (Rijksmuseum).",
      alt: "Gegraveerde kaart van de Schelde stroomafwaarts van Antwerpen met forten, een brug over de rivier, ondergelopen velden, schepen en troepen die langs een dijk vechten",
      approximateYear: "1680–1684",
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
    "diamond-bourse-today": {
      caption: "De Beurs voor Diamanthandel in de Pelikaanstraat, een van de diamantbeurzen van de wijk en een beschermd monument.",
      alt: "Moderne foto van een hoog stenen kantoorgebouw met een gebeeldhouwde naamband en vlaggen boven de ingang",
      approximateYear: "2010",
    },
    "flatow-expulsion-card-1941": {
      caption: "Kaart uit 1941 van Siegfried Flatow, een Duitser geboren in Berlijn in 1921, die in Antwerpen in de Zurenborgstraat 17 woonde. Ze vermeldt dat hij op 1 februari 1941 verplicht werd weggevoerd naar Beverloo, Leysestraat 25.",
      alt: "Vergeeld tweetalig Duits-Nederlands formulier, ingevuld met de schrijfmachine, met een vingerafdruk in het onderste vak en een lege plek voor een foto",
      approximateYear: "1941",
    },
    "dossin-courtyard-1942": {
      caption: "De binnenplaats van Kazerne Dossin in Mechelen, 1942: bagage verspreid over de grond, vrachtwagens en groepjes mensen.",
      alt: "Zwart-witfoto van een omsloten kazernebinnenplaats met rijen koffers en bundels op de grond, twee vrachtwagens en groepjes mensen aan de randen",
      approximateYear: "1942",
    },
    "paleis-op-de-meir-today": {
      caption: "Het Paleis op de Meir vandaag: het 18de-eeuwse koopmanspaleis dat Napoleon kocht.",
      alt: "Moderne foto van een lichte rococogevel met een balkon en een sierlijk wapen op het dak",
      approximateYear: "2023",
    },
    "rex-ruins": {
      caption: "Cinema Rex in puin na de inslag van de V2 op 16 december 1944.",
      alt: "Sepiafoto van een gebombardeerd bioscoopgebouw met ingestorte muren en een blootliggend koepeldak, met een auto uit de jaren 1940 ervoor",
      approximateYear: "1944–1947",
    },
    // The clue of Spooky's quest: shown before the place is found, so it must not name it.
    "paleis-op-de-meir-drawing": {
      caption: "Spooky's aanwijzing: een oude bouwtekening van een lange gevel.",
      alt: "Oude tekening van een lange, symmetrische gevel met hoge ramen, kleine balkons, vazen op het dak en een groot sierlijk wapenschild in het midden",
      approximateYear: "datum onbekend",
    },
    "rubens-self-portrait-1623": {
      caption: "Peter Paul Rubens, zelfportret, 1623 (Royal Collection, Londen).",
      alt: "Geschilderd portret van een man met baard, een brede zwarte hoed en een donkere mantel",
      approximateYear: "1623",
    },
    "rubenshuis-garden-today": {
      caption: "De tuin van het Rubenshuis vandaag, met het huis en rechts het portiek uit de tijd van Rubens zelf.",
      alt: "Moderne foto van een tuin met een fontein voor een renaissancehuis en een stenen poort met beelden erop",
      approximateYear: "2025",
    },
    "rubens-honeysuckle-bower": {
      caption: "Rubens en Isabella Brant in het kamperfoelieprieel, rond 1609-1610 (Alte Pinakothek, München).",
      alt: "Schilderij van een rijk gekleed jong paar dat hand in hand onder een prieel van kamperfoelie zit",
      approximateYear: "ca. 1609-1610",
    },
    "handelsbeurs-open-courtyard-1613": {
      caption: "De beurs van 1531 met haar open binnenplaats vol kooplui: een gravure uitgegeven in 1613.",
      alt: "Zwart-witgravure van een rechthoekige binnenplaats omringd door galerijen, met groepjes mensen en twee torens",
      approximateYear: "1613",
    },
    "groenkerkhof-1597": {
      caption: "Een begrafenisstoet bij het kerkhof van de kathedraal, de huidige Groenplaats: een anoniem schilderij uit 1597 (Museum Vleeshuis).",
      alt: "Oud schilderij van rouwenden in het zwart die langs een kerkhof lopen, met de hoge kathedraaltoren erachter",
      approximateYear: "1597",
    },
    "groenplaats-rubens-statue-1840s": {
      caption: "De kathedraal gezien vanaf de Groenplaats, met het nieuwe standbeeld van Rubens: een litho van Jules Alexandre Monthelier, jaren 1840.",
      alt: "Litho van een bronzen standbeeld op een hoge sokkel tussen bomen, met de kathedraal en haar spits erachter",
      approximateYear: "jaren 1840",
    },
    "matsijs-portrait-1572": {
      caption: "Quinten Matsijs op een portretprent die in 1572 in Antwerpen verscheen. Het Latijnse vers eronder vertelt hoe de liefde hem tot schilder maakte.",
      alt: "Gegraveerd profielportret van een man met muts en mantel die opgerolde papieren vasthoudt, met een Latijns vers eronder",
      approximateYear: "1572",
    },
    "matsijs-altarpiece-1511": {
      caption: "Het altaarstuk van Quinten Matsijs voor de schrijnwerkersgilde, in 1508-1511 geschilderd voor deze kathedraal (KMSKA, Antwerpen).",
      alt: "Geschilderd drieluik met een Bewening van Christus op het middenpaneel en twee zijpanelen",
      approximateYear: "1511",
    },
    "matsijs-well": {
      caption: "De waterput naast de kathedraal, gefotografeerd rond 1875-1900. De smeedijzeren overkapping wordt traditioneel aan Matsijs toegeschreven.",
      alt: "Oude foto van een sierlijke smeedijzeren putoverkapping op een stenen voet voor een gotische muur",
      approximateYear: "ca. 1875-1900",
    },
    "nello-patrasche-today": {
      caption: "Nello en Patrasche van Batist Vermeulen (2016), slapend onder een deken van kasseien voor de kathedraal.",
      alt: "Moderne foto van een wit marmeren beeld van een jongen en een hond die onder een deken van kasseien liggen, met de kathedraaltoren erachter",
      approximateYear: "2023",
    },
    "vlaeykensgang-today": {
      caption: "De Vlaeykensgang vandaag: kasseien, bakstenen muren en een overdekte doorgang.",
      alt: "Moderne foto van een smal gekasseid steegje tussen bakstenen muren, gezien door een lage overdekte doorgang",
      approximateYear: "2022",
    },
    "stadhuis-spanish-fury-hogenberg": {
      caption: "Het stadhuis in vlammen tijdens de Spaanse Furie, met gevechten op de Grote Markt: een ets van Frans Hogenberg, gemaakt vóór 1585.",
      alt: "Ets van een groot renaissancestadhuis waaruit vlammen en rook opstijgen, met vechtende soldaten op het plein ervoor",
      approximateYear: "vóór 1585",
    },
    "handelsbeurs-vandennest": {
      caption: "De galerijen versierd met kroonluchters, draperieën en boompjes, op een prent van J.B.J. Vandennest uit de jaren 1842–1851: nog vóór de binnenplaats haar eerste dak kreeg (Universiteit Antwerpen, Bijzondere Collecties).",
      alt: "Prent van lange overwelfde galerijen met bewerkte zuilen, hangende kroonluchters, draperieën en rijen boompjes, met twee mannen in uniform op de voorgrond",
      approximateYear: "1842–1851",
    },
    "handelsbeurs-lebrun-liedel": {
      caption: "De beurs na de heropbouw: bewerkte zuilen, overwelfde galerijen en enkele handelaars, op een prent van Lebrun-Liedel van na 1872 (Universiteit Antwerpen, Bijzondere Collecties).",
      alt: "Zwart-witte prent van een hal met rijk bewerkte zuilen en spitse gewelven, met op de voorgrond een lezende man met hoge hoed",
      approximateYear: "na 1872",
    },
    "spanish-fury-overview-1577": {
      caption: "De Spaanse Furie op één blad: een anonieme prent uit 1577 met in het midden een kaart van Antwerpen en de citadel, omringd door taferelen van de aanval, de gevechten en het brandende stadhuis (Rijksmuseum).",
      alt: "Prent met in het midden een vogelvluchtkaart van Antwerpen en de stervormige citadel, omringd door kleine taferelen van aanvallende, vechtende en plunderende soldaten",
      approximateYear: "1577",
    },
    "spanish-fury-de-braekeleer": {
      caption: "De Spaanse Furie in Antwerpen zoals Ferdinand de Braekeleer de Oude ze in 1836 schilderde: een romantisch 19de-eeuws beeld van gewapende burgers en gewonden tussen rook en vuur, met de kathedraaltoren op de achtergrond (KMSKA, Antwerpen).",
      alt: "Schilderij van een menigte gewapende burgers, gewonde mannen en een vrouw die knielt bij een stervende man, met rook, vuur en een kathedraaltoren op de achtergrond",
      approximateYear: "1836",
    },
    "spanish-fury-mas": {
      caption: "Een straat vol slachtoffers, met brandende huizen in de verte: een anoniem schilderij van de Spaanse Furie, gemaakt tussen 1576 en omstreeks 1585 (MAS, Antwerpen).",
      alt: "Schilderij van een drukke straat met soldaten, ruiters en veel doden, brandende huizen en zwarte rook in de verte en links een kerktoren",
      approximateYear: "1576–1585",
    },
    "spanish-fury-hogenberg-plunder": {
      caption: "Plundering en marteling in de Antwerpse huizen tijdens de Spaanse Furie, op een prent van Frans Hogenberg (16de eeuw; Rijksmuseum).",
      alt: "Gravure van soldaten die mensen martelen die aan touwen in huizen hangen, met lichamen op de grond en een straat met trapgevels op de achtergrond",
      approximateYear: "16de eeuw",
    },
    "spanish-fury-print-1618": {
      caption: "‘Spaensche Furie tot Antwerpen’: een prent van omstreeks 1618–1624 die het tafereel herhaalt, met een vers dat het lot van de stad beklaagt (anoniem; Rijksmuseum).",
      alt: "Gravure van hetzelfde tafereel van marteling en plundering, met de titel ‘Spaensche Furie tot Antwerpen’ en daaronder twee kolommen Nederlandse verzen",
      approximateYear: "ca. 1618–1624",
    },
    "execution-hogenberg-1568": {
      caption: "Een terechtstelling in de Nederlanden van die tijd: de onthoofding van de graven van Egmont en Horne op de Grote Markt van Brussel in 1568, op een ets van Frans Hogenberg. Niet Antwerpen, maar hetzelfde tijdperk en hetzelfde soort gerecht.",
      alt: "Ets van een schavot omringd door soldaten met pieken, een beul met een zwaard naast een knielende man",
      approximateYear: "1568-1570",
    },
    "scheldt-photochrom": {
      caption: "Antwerpen gezien vanaf de rivier in de jaren 1890: Het Steen links, de kathedraal die boven de stad uitrijst.",
      alt: "Ingekleurde historische druk van de skyline van Antwerpen gezien over de rivier, met boten op de voorgrond",
      approximateYear: "jaren 1890",
    },
  },
};
