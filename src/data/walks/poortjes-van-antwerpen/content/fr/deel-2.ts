import type { PoortjesStopText } from "../types";

/**
 * Part 2: Cathedral & Old Town (gates 10–23, historical stops). French text,
 * translated from ../en/deel-2.ts.
 */
export const deel2: Record<string, PoortjesStopText> = {
  // ── Pause + cards ───────────────────────────────────────────────────
  "poortjes-grote-markt": {
    name: "Grote Markt : une pause au Rococo",
    subtitle: "Asseyez-vous un moment au cœur de la ville",
    introduction: [
      "C'est l'heure de la pause. Vous êtes sur la Grote Markt, la grand-place d'Anvers, et le café Rococo donne sur la place. Installez-vous si vous le souhaitez, ou asseyez-vous sur un banc ou une marche : vous n'avez rien à commander pour continuer.",
      "Pendant que vous vous reposez, vous pouvez lire ci-dessous trois courtes histoires : sur la place, l'hôtel de ville et la fontaine. Levez les yeux de temps en temps : tout ce qu'elles décrivent se trouve juste devant vous.",
    ],
    sections: [],
    infoBoxes: [
      {
        kind: "pause",
        title: "L'heure de la pause",
        paragraphs: [
          "Cette pause est une suggestion, pas une obligation. La balade continue tout simplement, que vous commandiez quelque chose ou non.",
          "Chacun choisit lui-même ce qu'il boit : avec ou sans alcool. Nous n'avons pas vérifié les heures d'ouverture du Rococo ; si le café est fermé ou complet, n'importe quelle terrasse ou n'importe quel banc de la place fera tout aussi bien l'affaire.",
        ],
      },
    ],
    cards: [
      {
        id: "card-grote-markt",
        title: "La Grote Markt",
        subtitle: "La place des guildes",
        imageId: "grote-markt-1905",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Autour de la place se dressent de hautes maisons des guildes aux pignons à gradins et à volutes, couronnées de figures dorées. Les guildes étaient les associations d'artisans et de marchands. Elles réglementaient une grande partie de la vie urbaine : qui avait le droit de travailler, ce qui pouvait être vendu et avec quelle qualité. Leurs maisons, ici, étaient leurs cartes de visite.",
              "En novembre 1576, des soldats espagnols mutinés pillèrent la ville. L'incendie qu'ils allumèrent détruisit les maisons de la place. Le plus bel exemple de ce qui fut reconstruit ensuite est la maison de l'Oude Voetboog (la Vieille Arbalète), la guilde de Saint-Georges : construite en 1515–1516, détruite en 1576 et rebâtie dans le style Renaissance en 1580–1582.",
            ],
          },
          {
            heading: "Plus jeune qu'il n'y paraît",
            kind: "history",
            paragraphs: [
              "Une bonne partie de ce que vous voyez est plus récente qu'il n'y paraît. En 1895, un citoyen, R. Joostens, légua de l'argent pour rendre à la Grote Markt sa splendeur d'antan. De la fin du XIXe au début du XXe siècle, les façades du côté nord, ainsi que le numéro 44 du côté sud, furent librement reconstruites et embellies dans l'esprit du XVIe siècle.",
            ],
          },
        ],
        didYouKnow: [
          "Au sommet de la façade de l'Oude Voetboog, cherchez le saint Georges doré à cheval, terrassant le dragon.",
        ],
      },
      {
        id: "card-stadhuis",
        title: "L'hôtel de ville",
        subtitle: "Bâti dans la fierté, incendié dans la fureur",
        imageId: "stadhuis-1866",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "L'hôtel de ville (Stadhuis) fut construit entre 1561 et 1565 d'après les plans de Cornelis Floris de Vriendt, avec d'autres architectes et artistes. Anvers était alors l'une des villes les plus riches d'Europe et voulait le montrer.",
              "Regardez les longues ailes calmes et la partie centrale richement décorée qui s'élève au-dessus de la ligne des toits, pleine de colonnes, de niches et de statues. Ce contraste entre l'ordre paisible et l'explosion de décor au centre est typique de la Renaissance que Floris apporta à Anvers.",
            ],
          },
          {
            heading: "La Furie espagnole",
            kind: "history",
            paragraphs: [
              "Le 4 novembre 1576, des troupes espagnoles mutinées, qui n'avaient pas été payées depuis longtemps, prirent la ville d'assaut. Le magistrat de la ville organisa une contre-attaque depuis cet hôtel de ville. Les soldats mirent le feu au bâtiment ; seuls les murs extérieurs restèrent debout. On ne sait pas précisément combien de personnes périrent. Les estimations vont de plusieurs centaines à environ 8 000.",
            ],
          },
        ],
      },
      {
        id: "card-brabo",
        title: "La fontaine de Brabo",
        subtitle: "Un géant, une main et le nom d'une ville",
        imageId: "brabo-photochrom",
        sections: [
          {
            heading: "La légende",
            kind: "legend",
            paragraphs: [
              "Il y a bien longtemps, raconte-t-on, un géant nommé Druon Antigoon vivait au bord de l'Escaut. Il exigeait un péage de chaque navire qui voulait passer. Quiconque ne payait pas perdait une main, que le géant jetait dans le fleuve.",
              "Jusqu'au jour où le jeune soldat romain Silvius Brabo le défia, le vainquit, lui trancha la main et la jeta dans l'Escaut. C'est ainsi, dit la légende, que la ville reçut son nom : « hand werpen », lancer une main : Antwerpen.",
            ],
          },
          {
            heading: "Ce qu'en pensent les historiens",
            kind: "interpretation",
            paragraphs: [
              "Une histoire merveilleuse, mais pas une explication que les historiens prennent au sérieux. L'origine du nom Antwerpen est incertaine. La plupart des explications la rattachent non pas à des mains mais à la terre : à un terrain le long du fleuve, une parcelle de terre « en avant », rejetée par les eaux. La légende est une tentative bien plus tardive d'expliquer un nom dont on avait oublié la véritable origine.",
            ],
          },
          {
            heading: "La statue",
            kind: "history",
            paragraphs: [
              "La fontaine est l'œuvre du sculpteur anversois Jef Lambeaux, qui avait en grande partie achevé son projet dès 1883. Elle fut installée sur la Grote Markt, devant l'hôtel de ville, en 1887, à une époque où Anvers aimait célébrer sa propre histoire et son identité. Brabo se tient sur un socle rocheux et lance la main au loin.",
            ],
          },
        ],
        didYouKnow: [
          "Les mains de la légende sont partout à Anvers : dans les armoiries de la ville (un château surmonté de deux mains) et dans les « mains d'Anvers » en chocolat et en biscuit des boutiques autour de la place.",
        ],
      },
    ],
    didYouKnow: [],
    thenAndNow: [
      "Comparez la photo des environs de 1905 avec la place d'aujourd'hui. La reconstruction des façades battait alors son plein.",
    ],
    transitionToNext: "Reposé ? Marchez jusqu'à la cathédrale, à quelques rues d'ici. Vous voyez déjà sa tour au-dessus des toits.",
  },

  // ── Cathedral ────────────────────────────────────────────────────────
  "poortjes-kathedraal": {
    name: "Onze-Lieve-Vrouwekathedraal (cathédrale Notre-Dame)",
    subtitle: "Une tour et demie et 170 ans de chantier",
    introduction: [
      "Devant vous se dresse l'une des plus grandes églises gothiques des anciens Pays-Bas. Pendant des siècles, sa tour nord, haute d'environ 123 mètres, fut la première chose que les marins de l'Escaut apercevaient d'Anvers.",
      "Regardez d'abord la façade. La tour de gauche s'élève jusqu'à une flèche élégante ; celle de droite s'arrête à environ un tiers de cette hauteur. Deux grandes tours étaient prévues ; une seule fut jamais achevée.",
    ],
    sections: [
      {
        heading: "Des générations de bâtisseurs",
        kind: "history",
        paragraphs: [
          "La cathédrale fut construite en quelque 170 ans, du milieu du XIVe siècle jusqu'en 1521, par des générations de bâtisseurs qui savaient qu'ils ne la verraient jamais achevée.",
          "En 1521, au moment même où l'église était terminée, Anvers décida qu'elle n'était pas assez grande. Domien de Waghemakere et Rombout Keldermans dessinèrent un gigantesque agrandissement du chœur : le Nieuwerck. Le 15 juillet 1521, le jeune empereur Charles Quint posa lui-même la première pierre. Mais en 1533, un grand incendie endommagea l'église, tout l'argent passa dans les réparations et, en 1537, le Nieuwerck fut abandonné pour de bon.",
        ],
      },
      {
        heading: "Les tempêtes de l'histoire",
        kind: "history",
        paragraphs: [
          "Lors de la furie iconoclaste de 1566, une vague de colère protestante contre les images, une grande partie de l'intérieur fut détruite. Deux siècles plus tard, les troupes de la Révolution française occupèrent la ville, fermèrent l'église et emportèrent ses trésors.",
          "Une grande partie de ce que vous voyez à l'intérieur aujourd'hui fut rapportée ou restaurée par la suite, notamment des retables de Rubens. Les plus connus sont L'Érection de la Croix et La Descente de Croix.",
        ],
      },
      {
        heading: "Comment lire une église gothique",
        kind: "context",
        paragraphs: [
          "On reconnaît l'architecture gothique à ses arcs brisés, à ses hautes fenêtres et à sa quête de hauteur et de lumière. Les murs sont soutenus par des contreforts, ce qui laisse davantage de place au verre. Le long des murs latéraux, repérez ces lourds piliers adossés au mur et les arcs brisés des fenêtres.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visiter l'intérieur",
        paragraphs: [
          "L'intérieur, avec les tableaux de Rubens, se visite avec un billet d'entrée payant. Les horaires varient en raison des offices et des jours fériés : vérifiez-les avant d'y aller.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://visit.antwerpen.be/en/info/cathedral-of-our-lady",
      },
    ],
    didYouKnow: [
      "Le Nieuwerck ne fut jamais construit, mais il n'a pas entièrement disparu pour autant. Ses fondations et ses piliers subsistent dans la rangée de maisons autour du chœur, entre la Lijnwaadmarkt et la Groenplaats.",
    ],
    lookAt: [
      {
        title: "Une tour et demie",
        body: "Comparez la façade avec l'eau-forte de Wenceslaus Hollar de 1649 sur cette page : la silhouette asymétrique, avec une seule tour achevée, était déjà la même à l'époque.",
      },
    ],
    transitionToNext: "Retraversez la Grote Markt et, derrière l'hôtel de ville, engagez-vous dans la Gildekamersstraat. Votre première enquête vous y attend.",
  },

  // ── Gates 11 and 12: search task ─────────────────────────────────────
  "poortjes-gildekamersstraat": {
    name: "Gildekamersstraat",
    subtitle: "Enquête : quelle est cette porte ?",
    introduction: [
      "La Gildekamersstraat (rue des Chambres de guildes) est une rue étroite derrière l'hôtel de ville, pleine de portes, de portails et de pierres de façade. Smekens y a dessiné deux portes. La question est : saurez-vous les retrouver ?",
    ],
    searchTask: {
      title: "Retrouverez-vous la porte du dessin ?",
      intro: "Voici deux dessins de 1951. Descendez lentement la rue et comparez : la forme de l'arc, la clé de voûte, les dates, le décor du sommet. Prenez votre temps, et n'utilisez les indices que si vous êtes bloqué.",
      hideStoryUntilDone: true,
      items: [
        {
          plate: 10,
          question: "Quelle est cette porte ?",
          hints: [
            "Regardez attentivement la clé de voûte au sommet de l'arc : un nombre y est inscrit.",
            "Ce nombre est une année du XVIIe siècle. Regardez du côté des petits numéros.",
          ],
          solution: "Gildekamersstraat 7, la maison De Swane (Le Cygne).",
          explanation: [
            "Selon l'inventaire, l'année 1631 figure sur la porte sous la forme « A. 1631 ». La maison De Swane brûla pendant la Furie espagnole de 1576 et fut reconstruite en 1580–1581. En 1633, elle fut achetée pour la guilde des passementiers, qui en fit sa maison de guilde jusqu'à la Révolution française. Les passementiers fabriquaient des rubans, galons et cordons décoratifs.",
            "Smekens indique que la guilde des passementiers se trouvait ici « à la fin du XVIe siècle » ; l'inventaire donne 1633 pour l'achat. Les deux sources relient donc la maison au même métier, mais pas à la même année.",
          ],
        },
        {
          plate: 8,
          question: "Et celle-ci, avec la petite fenêtre et les volutes au-dessus ?",
          hints: [
            "À côté de ce dessin, Smekens a écrit « Gildekamerstraat 9 » et l'année 1612.",
            "La maison s'appelait « Den rooden osch » ou « Den osch » (le bœuf rouge, le bœuf). Regardez les numéros autour de 8 et 9, et cherchez des ancres murales formant une date.",
          ],
          solution: "Selon Smekens : la maison Den (rooden) Osch, numéro 9 en 1951.",
          explanation: [
            "Aujourd'hui, l'inventaire décrit « Den Os » au numéro 8 : un pignon à gradins daté de 1612 par ses ancres murales, avec une porte en plein cintre, une « porte à pointes de diamant » avec clé de voûte en pointe de diamant et impostes.",
            "Soyons honnêtes : le dessin de Smekens montre un portail plus riche, avec une petite fenêtre surmontée de volutes et des pilastres décorés. Nous n'avons pas pu établir avec certitude s'il s'agit de la même porte, ou si la porte a depuis été modifiée ou a disparu. Qu'avez-vous trouvé ? [À vérifier sur place]",
          ],
        },
      ],
      outro: "Cette rue montre pourquoi le livre de Smekens est si précieux : les numéros changent, les portes sont remplacées, mais un relevé au centimètre près demeure.",
    },
    sections: [
      {
        heading: "L'histoire de la rue",
        kind: "history",
        paragraphs: [
          "Den Os est déjà mentionnée dans le premier quart du XIVe siècle. À partir de 1550, ce fut une maison d'accises, où l'on percevait les taxes sur les marchandises. Elle brûla pendant la Furie espagnole de 1576 et fut reconstruite en 1612 par la famille De Groote. En 1877, la ville l'acheta pour ses services de police ; vers 1900, la ville installa aussi des services de police dans De Swane.",
          "À propos de Den Os, Smekens écrit qu'elle « avait déjà été achetée par la Ville à cette époque ». L'hôtel de ville est littéralement au coin de la rue : la ville s'est étendue dans les maisons situées derrière lui.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "Selon l'inventaire, la porte de De Swane est un portail baroque en plein cintre dans un encadrement de pierre bleue à bossages portant la date « A. 1631 », avec un ébrasement en arc segmentaire, des socles, des impostes et une clé de voûte cannelée sous un larmier à corniche porté par des volutes. Les façades avant et arrière furent reconstruites vers 1953–1954 d'après les plans de l'architecte Gaston Laporte.",
        ],
      },
    ],
    glossary: ["diamantkop", "sluitsteen", "spiegelboog"],
    didYouKnow: [
      "Une maison d'accises comme Den Os était un bureau des impôts. Les taxes sur les marchandises et le commerce reviendront plus loin dans cette balade, au Stadswaag.",
    ],
    transitionToNext: "Passez la porte pour rejoindre la place verdoyante derrière l'hôtel de ville : le Leonie Glassplein.",
  },

  // ── Leonie Glassplein (+ vanished 13 and 14) ─────────────────────────
  "poortjes-leonie-glassplein": {
    name: "Leonie Glassplein",
    subtitle: "Un nouveau jardin, deux portes disparues",
    introduction: [
      "Vous vous trouvez sur une place étonnamment verte derrière l'hôtel de ville. Regardez les lignes de laiton au sol et les étagements de la végétation : l'aménagement évoque une mine de diamants à ciel ouvert.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Pendant longtemps, l'espace derrière l'hôtel de ville était surtout pavé et fermé. Il a été réaménagé en jardin public, inauguré le 26 novembre 2020. Le projet du bureau Stramien évoque les mines de diamants : « La stratification qui caractérise les mines est rendue par des lignes de laiton qui accentuent le relief existant de la place. »",
          "La place porte le nom de Leonie Glass (1876–1961), une figure marquante de la communauté diamantaire anversoise. Elle était l'épouse du diamantaire Isidore Tolkowsky et la mère de Marcel Tolkowsky, « l'homme qui conçut la forme du diamant rond moderne taillé en brillant ». Après la mort de son mari en 1931, elle émigra à New York. La place est aussi le jardin intérieur de DIVA, le musée du diamant, de la joaillerie et de l'argenterie.",
        ],
      },
      {
        heading: "Orfèvres et portes disparues",
        kind: "history",
        paragraphs: [
          "La partie de la place donnant sur la Zilversmidstraat (rue des Orfèvres) est toujours ouverte. Dans cette rue, Smekens dessina deux portes disparues depuis : le numéro 5, un petit portail de style Louis XV, et le numéro 17, un petit portail Renaissance. Vous les trouverez ci-dessous, parmi les portes disparues.",
          "Le numéro 17 avait déjà voyagé auparavant. Selon Smekens, il se trouvait à l'origine contre la façade de la brasserie De Trouw, l'une des brasseries que Gilbert van Schoonbeke construisit dans la Brouwersstraat au XVIe siècle, et il fut déplacé dans la Zilversmidstraat lorsque ce bâtiment fut démoli vers 1880.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Accès",
        paragraphs: [
          "La partie donnant sur la Zilversmidstraat est toujours ouverte. La partie près du musée DIVA n'est ouverte que pendant les heures d'ouverture du musée. Si le passage est fermé, faites le tour par la Grote Markt et la Zilversmidstraat.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.agvespa.be/nieuws/iedereen-welkom-op-het-leonie-glassplein",
      },
    ],
    didYouKnow: [
      "La Brouwersstraat (rue des Brasseurs) de Smekens existe toujours sous un autre nom : depuis 1936, elle s'appelle Adriaan Brouwerstraat. À la fin de cette balade, vous vous y retrouverez, devant quatre portes toujours en place.",
    ],
    transitionToNext: "Passez par la Zilversmidstraat pour rejoindre l'Oude Beurs, la rue qui doit son nom à la toute première bourse d'Anvers.",
  },

  // ── Gate 20 (+ vanished 21) ──────────────────────────────────────────
  "poortjes-oude-beurs": {
    name: "Oude Beurs 16 : Den Spieghel",
    subtitle: "Une mère, un enfant et un miroir",
    introduction: [
      "Sur l'Oude Beurs, cherchez le portail baroque richement décoré à la porte en bois. Regardez la partie en demi-cercle au-dessus de la porte : une petite scène y est sculptée dans le bois.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Den Spieghel (Le Miroir) est mentionné dès le début du XIVe siècle. L'ensemble s'étendait autrefois de la Grote Markt jusqu'ici, à l'Oude Beurs. En 1506, il fut acheté par le marchand Peter Gielis. Parmi les propriétaires suivants figurent le trésorier de la ville Alexander van den Broeck-Vekemans et son fils Jan-Alexander ; après 1650, le notaire Bartholomeus Van den Berghe. À partir de 1888, il abrita une école primaire de filles.",
          "Smekens cite Steven Butken, de Cologne, comme premier propriétaire et indique qu'« Alex van den Broeck (XVIIe siècle) » voulait faire de la propriété « une sorte de palais ». Nous n'avons pas trouvé Butken dans l'inventaire. [À vérifier]",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit un portail en plein cintre du troisième quart du XVIIe siècle « dans un style baroque exubérant », en pierre bleue. La porte en bois comporte « un relief sculpté dans l'imposte » : « une femme assise allaitant, un miroir dans la main droite, entourée de putti ». Smekens : « une femme assise se regardant dans un miroir, tandis que son enfant se mire en sa mère ».",
          "L'ensemble possède aussi une tour d'habitation octogonale en brique, probablement des environs de 1506, l'une des plus anciennes tours d'habitation conservées à Anvers.",
        ],
      },
      {
        heading: "La première bourse d'Anvers",
        kind: "history",
        paragraphs: [
          "La rue doit son nom à la première bourse (beurs) de la ville. Une « old borze » en bois de 1485 fut reconstruite en 1515, sous la direction de Dominicus de Waghemakere, avec une galerie de pierre de style gothique tardif, près de la maison « den grooten Rhijn » dans la Hofstraat, au coin de la rue.",
          "Le commerce se développa si vite que, vers 1526–1527, les marchands réclamèrent davantage d'espace. En 1531–1532, une nouvelle bourse fut construite entre le Meir et la Lange Nieuwstraat, et en 1533 l'ancienne ferma. Nous visiterons cette nouvelle bourse, la Handelsbeurs, plus loin dans cette balade.",
        ],
      },
    ],
    glossary: ["barleef", "waaier"],
    thenAndNow: [
      "Autrefois : Smekens décrivit en une seule phrase la scène de la mère et de l'enfant au miroir.",
      "Aujourd'hui : la sculpture se trouve dans l'imposte au-dessus de la porte. S'est-elle bien conservée ? Distinguez-vous les putti (petits anges) autour de la femme ?",
    ],
    didYouKnow: [
      "« Den Spieghel » est un nom de maison parlant : la sculpture au-dessus de la porte montre littéralement un miroir.",
    ],
    transitionToNext: "Rendez-vous à la Melkmarkt. Cherchez une maison au soulier doré.",
  },

  // ── Gate 15 ───────────────────────────────────────────────────────────
  "poortjes-melkmarkt": {
    name: "Melkmarkt 37",
    subtitle: "De Gulde Schoen (Le Soulier d'or)",
    introduction: [
      "Cherchez le portail orné de deux têtes de lion et d'un cartouche portant le nom de la maison : « Gulde Schoen ». La maison est aujourd'hui un hôtel ; la porte est plus ancienne que tout ce qui l'entoure.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Smekens écrit brièvement : « Appartenait à la maison De gulden schoen. » La maison elle-même fut fortement transformée au XIXe siècle : en 1847, le marchand de bois Willem Westlake fit ramener la façade à un rythme régulier de quatre travées, et en 1849 le toit à pignon fut remplacé par un étage supplémentaire. C'est un hôtel depuis 2018.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "Selon l'inventaire, la porte est un portail baroque du troisième quart du XVIIe siècle, avec « un encadrement de pierre bleue richement sculpté », des chapiteaux ioniques, des pilastres à bossages, des têtes de lion sculptées et un cartouche portant l'inscription « Gulde Schoen », couronné d'un fronton brisé à volutes. L'encadrement d'entrée est protégé depuis 1976.",
        ],
      },
    ],
    glossary: ["fronton", "cartouche"],
    thenAndNow: [
      "Autrefois : en 1951, la porte se trouvait dans une façade déjà « régularisée » un siècle plus tôt.",
      "Aujourd'hui : la porte du XVIIe siècle est la partie la plus ancienne de la façade. Cherchez les têtes de lion sur le dessin et dans la réalité.",
    ],
    didYouKnow: [
      "Un nom de maison comme « Gulde Schoen » peut renvoyer à un métier ou à une enseigne. Des cordonniers ont-ils jamais vécu ici ? Nous ne le savons pas.",
    ],
    transitionToNext: "Rendez-vous dans la Wolstraat, où deux portes du livre se trouvent à peine à cent mètres l'une de l'autre.",
  },

  // ── Gate 16 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-7": {
    name: "Wolstraat 7",
    subtitle: "De Tennen Pot (Le Pot d'étain)",
    introduction: [
      "Cherchez le portail monumental dans une façade enduite par ailleurs très sobre. Au-dessus de la porte se trouve une imposte en fer dont les barreaux rayonnent comme des rayons de soleil.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "De Tennen Pot est une maison profonde traditionnelle qui remonte à la seconde moitié du XVIe siècle. Le nom renvoie à un pot d'étain. En 1850, les fenêtres à croisée furent abaissées ; en 1895, le propriétaire, Vochten, démolit le pignon à gradins et fit construire une mezzanine d'après les plans de l'architecte Eugène Dieltiëns. En 1921, Eugène et son fils Jules Dieltiëns dessinèrent la vitrine qui est toujours là.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit « un portail monumental en plein cintre inscrit dans un encadrement de baroque sculptural » du troisième quart du XVIIe siècle, en pierre bleue, avec un plein cintre mouluré et à bossages, des pilastres à chapiteaux composites et une imposte en fer à motif rayonnant. Cette imposte ne date que de 1850.",
        ],
      },
    ],
    glossary: ["waaier", "kapiteel"],
    thenAndNow: [
      "Autrefois : en 1951, le pignon à gradins avait déjà disparu depuis plus d'un demi-siècle ; seule la porte rappelait la maison du XVIIe siècle.",
      "Aujourd'hui : cherchez la différence entre la pierre du XVIIe siècle et l'imposte du XIXe siècle.",
    ],
    didYouKnow: [
      "Cette seule façade réunit trois époques : une porte du XVIIe siècle, une imposte de 1850 et une vitrine de 1921.",
    ],
    transitionToNext: "Un peu plus loin dans la même rue, au numéro 30, une porte couverte de raisins et de dauphins vous attend.",
  },

  // ── Gate 17 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-30": {
    name: "Wolstraat 30",
    subtitle: "Het Scilt van Londen (L'Écu de Londres)",
    introduction: [
      "Cette fois, ce n'est pas seulement la pierre qui est intéressante, mais surtout la porte en bois. Regardez le médaillon au centre et les petites figures au-dessus.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Het Scilt van Londen est une maison profonde traditionnelle que Smekens et l'inventaire datent tous deux de 1625. En 1853, le tonnelier Pierre Van Hove la fit transformer dans le style néoclassique. Nous ne savons pas avec certitude à quoi ressemblait la façade d'origine.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit une « remarquable porte en plein cintre inscrite dans un encadrement baroque de pierre bleue (peinte), à dater du troisième quart du XVIIe siècle ». La porte en bois et son auvent portent des reliefs évoquant le commerce du vin : « Le médaillon central montre deux bustes juvéniles, probablement le dieu du vin Bacchus et son épouse Ariane », avec au-dessus « deux putti en miroir tenant des grappes de raisin, assis sur des dauphins ».",
        ],
      },
      {
        heading: "Duquesnoy ?",
        kind: "interpretation",
        paragraphs: [
          "Smekens écrit que la porte « est attribuée à François Duquesnoy (1594–1642) » ; l'inventaire mentionne aussi cette attribution, avec les dates 1597–1643. Une attribution n'est pas une preuve. De plus, l'inventaire date l'encadrement du troisième quart du XVIIe siècle, après la mort de Duquesnoy. L'identité de son auteur reste donc une question ouverte.",
        ],
      },
    ],
    glossary: ["barleef"],
    thenAndNow: [
      "Autrefois : Smekens dessina la porte avec ses reliefs ; selon l'inventaire, l'encadrement est peint.",
      "Aujourd'hui : comptez les dauphins et cherchez les grappes de raisin.",
    ],
    didYouKnow: [
      "Selon l'inventaire, les raisins, Bacchus et Ariane évoquent le commerce du vin. Nous n'avons pas pu découvrir pourquoi la maison s'appelle « Het Scilt van Londen ».",
    ],
    transitionToNext: "Rendez-vous dans la Jeruzalemstraat, une petite rue qui relie la Wolstraat et l'Oude Waag. Cherchez un portail étroit à côté du numéro 14.",
  },

  // ── Gate 10 (+ vanished 18 and 22) ───────────────────────────────────
  "poortjes-jeruzalemstraat": {
    name: "Jeruzalemstraat",
    subtitle: "Une porte vers la Terre sainte",
    introduction: [
      "Sur le flanc de la maison d'angle avec l'Oude Waag, cherchez un étroit portail en pierre bleue avec une imposte. Smekens écrit : « à côté du n° 14 ».",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Le portail appartient à la maison d'angle « Jeruzalem » (Oude Waag 1–3), mentionnée en 1564 comme « une maison d'angle à pignon à gradins appelée Jeruzalem ». La maison fut transformée dans le style néoclassique en 1837–1838, agrandie en 1903 et profondément reconstruite en 1946 par l'architecte Joseph De Paepe. Le portail fut épargné.",
          "Smekens explique le nom « en souvenir des premiers voyages d'Anvers vers la Terre sainte ». L'inventaire ne donne aucune explication du nom. Son explication est donc une possibilité, pas un fait établi.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit « le petit portail baroque en pierre bleue » de la seconde moitié du XVIIe siècle : une « porte en plein cintre avec archivolte moulurée et à bossages sur des pilastres sculptés et à bossages » et une imposte segmentaire ornée de volutes et de rinceaux. L'encadrement d'entrée est protégé depuis 1976.",
        ],
      },
      {
        heading: "Pourquoi nous sommes ici maintenant",
        kind: "context",
        paragraphs: [
          "Dans la liste de cette balade, c'est la porte 10, juste après la Suikerrui. Mais la Jeruzalemstraat se trouve ici, entre la Wolstraat et l'Oude Waag, et non près de la Suikerrui. C'est pourquoi nous la visitons maintenant, sans faire d'allers-retours.",
        ],
      },
    ],
    glossary: ["archivolt"],
    didYouKnow: [
      "Deux autres portes du livre se trouvaient tout près et ont disparu : sur le Grote Goddaard (la maison De witte engel, L'Ange blanc) et sur l'Engelse Beurs, près d'une petite bourse que, selon Smekens, la ville avait fait construire pour les marchands anglais en 1550.",
    ],
    transitionToNext: "Rendez-vous dans la Zwartzustersstraat. Le couvent y est en rénovation, mais son histoire n'en est pas moins belle.",
  },

  // ── Gate 19: in renovation ───────────────────────────────────────────
  "poortjes-zwartzusters": {
    name: "Zwartzustersstraat 25",
    subtitle: "Six siècles de soins derrière une porte",
    introduction: [
      "Devant vous se trouve le portail baroque du Zwartzusterklooster, le couvent des Sœurs noires. Le couvent est en rénovation depuis fin 2025. Il se peut donc que vous voyiez aujourd'hui la porte derrière des palissades de chantier, ou temporairement bâchée.",
    ],
    sections: [
      {
        heading: "Qui étaient les Sœurs noires ?",
        kind: "history",
        paragraphs: [
          "Les Sœurs noires (Zwartzusters) suivaient la règle de saint Augustin. Elles s'établirent à Anvers en 1345, d'abord dans un bâtiment près de la Koepoort, offert par « Hendrik Suderman, un riche marchand allemand ». Smekens l'appelle « H. Südermann ».",
          "Leur nom vient de leur habit. Vers 1462, elles prononcèrent leurs vœux monastiques et échangèrent leur habit gris contre un habit noir.",
        ],
      },
      {
        heading: "Soigner les malades",
        kind: "history",
        paragraphs: [
          "Les sœurs se consacraient aux soins des malades. Sous le gouvernement calviniste de la ville (1571–1585), elles poursuivirent ce travail malgré les persécutions. Après 1585, elles bénéficièrent d'une protection. En 1798, elles furent expulsées par les autorités françaises ; en 1823, elles revinrent. Les dernières sœurs partirent en 2014.",
        ],
      },
      {
        heading: "L'ensemble",
        kind: "history",
        paragraphs: [
          "Le couvent s'agrandit par étapes : une nouvelle chapelle en 1507, un logement pour le directeur spirituel en 1520, un réfectoire et un dortoir en 1536. En 1608, l'aile nord fut aménagée en hôpital. En 1670–1678, le réfectoire fut agrandi et la buanderie et la cuisine furent renouvelées ; la cuisine fut « entièrement revêtue de carreaux de Delft ».",
          "La chapelle est une petite église-halle gothique du premier quart du XVIe siècle, couverte d'une voûte en berceau brisé en bois. Les ailes est et ouest furent construites en 1904 d'après les plans de Paul Van Glabbeek.",
        ],
      },
      {
        heading: "L'architecture de la porte",
        kind: "history",
        paragraphs: [
          "Smekens parle d'une « porte Louis XIV ». L'inventaire décrit un portail baroque en plein cintre en pierre bleue du « quatrième quart du XVIIe ou premier quart du XVIIIe siècle ». Le montant central sculpté représentant la Vierge Marie, Ursule et Augustin est l'œuvre de Leopold Van Esbroeck (1967) : il est donc plus récent que le dessin.",
        ],
      },
      {
        heading: "Aujourd'hui",
        kind: "history",
        paragraphs: [
          "Le couvent est resté vide une dizaine d'années. Fin 2025 a commencé sa rénovation en un projet d'habitat groupé de 41 logements avec des espaces partagés, et un jardin du paysagiste néerlandais Piet Oudolf (VRT NWS, 29 octobre 2025). Les travaux devaient durer environ deux ans.",
        ],
      },
    ],
    glossary: ["makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Autrefois : le dessin date des environs de 1950. Selon l'inventaire, le montant central sculpté aux trois saints date de 1967 : il ne peut donc pas figurer sur le dessin.",
      "Aujourd'hui : si la porte est visible, comparez son montant central avec le dessin. Qu'y avait-il à cet endroit en 1951 ?",
    ],
    didYouKnow: [
      "Dans les années 1670, la cuisine du couvent fut entièrement revêtue de carreaux de Delft.",
    ],
    transitionToNext: "Rendez-vous dans la Korte Nieuwstraat. Cherchez une chapelle dont la clé de voûte est un ange.",
  },

  // ── Gate 23 ───────────────────────────────────────────────────────────
  "poortjes-korte-nieuwstraat": {
    name: "Korte Nieuwstraat 22",
    subtitle: "Une chapelle pour six vieilles femmes",
    introduction: [
      "Cherchez l'étroit pignon en grès avec un portail baroque en pierre bleue sombre. Regardez la clé de voûte : une petite tête d'ange ailée. Regardez ensuite la niche vide au-dessus.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "C'est la chapelle du Sint-Annagodshuis (hospice Sainte-Anne), fondé en 1400 par Elisabeth, veuve de Jan Hays, et Boudewijn de Riddere, comme « maison pour six vieilles femmes ». La chapelle fut construite la même année et dédiée à sainte Anne. En 1540, les aumôniers de l'Armenkamer (le bureau d'assistance aux pauvres de la ville) en reprirent la gestion.",
          "Des résidentes y vécurent jusqu'en 1963. La chapelle servit ensuite d'atelier au sculpteur Frans Joris, de dépôt de livres et de débarras.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "La chapelle est une église-halle gothique dotée d'un portail baroque du XVIIe siècle en pierre bleue, avec « des impostes appareillées et une tête d'ange ailée en guise de clé de voûte », « flanqué de deux colonnes baguées ». La niche au-dessus abritait à l'origine des statues de sainte Anne et de Marie, disparues au début du XXe siècle. Smekens dit la même chose : les figures étaient encore là « au début du XXe siècle ». La chapelle est protégée depuis 1938.",
        ],
      },
    ],
    glossary: ["godshuis", "imposten"],
    thenAndNow: [
      "Autrefois : en 1951, la niche était déjà vide. Smekens dessina le portail avec ses figures d'anges.",
      "Aujourd'hui : la niche est toujours vide. Cherchez la tête d'ange ailée sur la clé de voûte.",
    ],
    didYouKnow: [
      "Les hospices (godshuizen) étaient une forme précoce de logement social : des bourgeois aisés ou des guildes les fondaient pour les personnes âgées ou les pauvres, souvent avec leur propre chapelle.",
    ],
    transitionToNext: "Fin de la deuxième partie. Rendez-vous à la Handelsbeurs : des couvents et des maisons des guildes à l'argent et au commerce mondial.",
  },
};
