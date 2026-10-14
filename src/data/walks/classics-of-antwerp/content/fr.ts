import type { ClassicsContent } from "./types";

/**
 * Classics of Antwerp: French content (translated from content/en.ts).
 * Same structure as the English master; only the texts differ.
 */
export const classicsContentFr: ClassicsContent = {
  walk: {
    title: "Les classiques d'Anvers",
    tagline: "Une balade à travers l'histoire d'Anvers",
    shortDescription:
      "Une balade commentée de la majestueuse gare jusqu'aux rives de l'Escaut : dix-neuf étapes, huit siècles et les histoires cachées derrière les lieux les plus célèbres d'Anvers.",
    description:
      "Partez de la majestueuse gare d'Anvers et traversez des siècles de commerce, d'art, de religion et de pouvoir, pour finir là où l'histoire de la ville a commencé : sur les rives de l'Escaut.\n\nÀ chaque étape, votre téléphone devient votre guide : ce que vous avez sous les yeux, pourquoi on l'a construit, ce qui s'est passé ici, et les détails devant lesquels la plupart des visiteurs passent sans les voir. Des photographies anciennes vous montrent la ville telle qu'elle était il y a un siècle et plus. Pas de jeux ni de questions : seulement Anvers, et le temps de la regarder vraiment.",
    highlights: [
      "19 des lieux historiques les plus importants d'Anvers",
      "Écrit comme si un guide marchait à vos côtés",
      "Photographies anciennes, gravures et cartes postales à chaque grande étape",
      "Des anecdotes « Le saviez-vous ? » que vous ne trouverez pas sur les panneaux d'information",
      "Des détails à repérer sur place",
      "Un itinéraire à pied d'une étape à l'autre",
    ],
    howItWorksSteps: [
      "Rejoignez l'étape suivante grâce à la carte",
      "Lisez l'histoire de ce que vous voyez",
      "Cherchez les détails sur place",
      "Continuez à votre rythme",
    ],
    practicalInfo: [
      { label: "Rythme", value: "À votre rythme ; faites une pause et repartez quand vous le souhaitez" },
      { label: "Idéal pour", value: "Les visiteurs qui découvrent Anvers et tous les curieux de son histoire" },
      { label: "Accessibilité", value: "Rues majoritairement plates ; quelques pavés dans la vieille ville" },
    ],
    guideIntro: {
      quote:
        "Partez de la majestueuse gare d'Anvers et traversez des siècles de commerce, d'art, de religion et de pouvoir, pour finir là où l'histoire de la ville a commencé : sur les rives de l'Escaut.",
      categoryLabel: "Histoire et architecture",
      footnote: "De la Belle Époque à l'Anvers médiéval.",
    },
    copy: {
      startLabel: "Commencer la balade",
      nextLocationTitle: "Étape suivante",
      completionTitle: "La fin de la balade",
      completionMessage: "Vous n'avez pas seulement traversé Anvers. Vous avez remonté le cours de son histoire.",
      locationsTitle: "L'itinéraire",
      locationsDiscoveredLabel: "étapes visitées",
    },
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "classics-central-station": {
      name: "Antwerpen-Centraal",
      subtitle: "La cathédrale ferroviaire",
      introduction: [
        "Devant vous se dresse l'une des gares les plus spectaculaires du monde. Prenez un instant pour la regarder comme on voulait qu'elle soit vue : un palais de pierre avec un dôme, des tours et des ornements dorés, construit non seulement pour prendre le train, mais pour impressionner tous ceux qui arrivaient à Anvers.",
        "Les Anversois l'appellent la spoorwegkathedraal, la cathédrale ferroviaire. C'est un point de départ tout trouvé, car c'est le chapitre le plus récent de notre histoire. D'ici, nous allons remonter le temps, jusqu'au fleuve où la ville est née.",
      ],
      sections: [
        {
          heading: "La vitrine d'un roi",
          kind: "history",
          paragraphs: [
            "Vers 1900, Anvers est en plein essor. Son port compte parmi les plus actifs d'Europe, et le roi Léopold II veut une gare à la hauteur de cette ambition. Les travaux se font en deux temps. D'abord, entre 1895 et 1899, l'ingénieur Clément Van Bogaert construit l'immense halle des voies en fer et en verre : 186 mètres de long, 66 mètres de large et 43 mètres de haut. Cette hauteur n'était pas qu'une question de prestige : elle laissait à la fumée des locomotives à vapeur la place de s'élever.",
            "Ensuite, entre 1899 et 1905, l'architecte Louis Delacenserie construit devant elle le bâtiment de pierre de la gare. Il qualifiait lui-même son style d'« éclectisme baroque-médiéval » et s'inspira notamment de l'ancienne gare de Lucerne et du Panthéon de Rome. Le résultat mêle à peu près tout : dômes, pinacles, marbre, or et une bonne dose de théâtre.",
          ],
        },
        {
          heading: "D'un cul-de-sac à une gare de passage",
          kind: "history",
          paragraphs: [
            "Pendant environ un siècle, ce fut une gare terminus : les trains entraient, s'arrêtaient et devaient repartir en marche arrière. Au début du XXIe siècle, tout a changé. De nouveaux quais ont été creusés sur plusieurs niveaux sous l'ancienne halle et un tunnel a été construit sous la ville, si bien que les trains peuvent désormais traverser Anvers de part en part. La halle historique est restée au-dessus, restaurée, comme si de rien n'était.",
          ],
        },
      ],
      didYouKnow: [
        "Lorsque le roi Léopold II vit pour la première fois la gare achevée, il aurait été moins impressionné qu'on ne l'espérait. Selon une anecdote bien connue, il aurait lâché : « C'est une petite belle gare ».",
        "La halle métallique des voies est plus ancienne que le bâtiment de pierre que vous regardez. Les ingénieurs avaient terminé leur travail des années avant que l'architecte n'achève le sien.",
      ],
      lookAt: [
        {
          title: "L'horloge et les armoiries",
          body: "Entrez dans la halle des voies et retournez-vous. Au-dessus de l'entrée du bâtiment de la gare, vous trouverez une grande horloge, le mot ANTWERPEN et les armoiries de la ville : un château surmonté de deux mains. Retenez ces mains ; vous les retrouverez plus loin dans cette balade, sur la Grote Markt.",
        },
      ],
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Trouvez les armoiries d'Anvers",
        task: [
          "Trouvez les armoiries de la ville d'Anvers.",
          "La photo est votre indice : regardez bien autour de vous, dans la gare et à l'extérieur. Trouvé ? Touchez le bouton ci-dessous.",
        ],
      },
      transitionToNext:
        "Quittez la gare par son côté ouest. En quelques minutes, vous entrez dans un petit quartier où l'on négocie depuis des siècles un trésor d'un tout autre genre.",
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "classics-diamond-district": {
      name: "Le quartier diamantaire",
      subtitle: "L'une des grandes places mondiales du diamant, en quelques rues tranquilles",
      introduction: [
        "Regardez autour de vous. Ces quelques rues banales à côté de la gare, avec leurs caméras, leurs bornes et leurs immeubles de bureaux anonymes, forment l'une des places diamantaires les plus importantes au monde. Une grande partie du commerce mondial de diamants bruts est passée par ces quelques pâtés de maisons.",
      ],
      sections: [
        {
          heading: "Cinq siècles de diamants",
          kind: "history",
          paragraphs: [
            "Le lien entre Anvers et le diamant est ancien. La plus ancienne trace connue date de 1447, lorsque la ville édicta des règles contre le commerce de fausses pierres précieuses, diamants compris. Le négoce était alors manifestement assez important pour mériter d'être protégé.",
            "Le quartier où vous vous trouvez s'est développé plus tard, autour de la gare et du chemin de fer, à la fin du XIXe siècle. En 1893 fut fondée la première bourse diamantaire de la ville, le Diamantclub van Antwerpen ; la Beurs voor Diamanthandel suivit en 1904. Les négociants s'y retrouvaient, examinaient les pierres et concluaient des affaires, souvent scellées d'une simple poignée de main et d'une parole de confiance.",
            "Pendant une grande partie du XXe siècle, le négoce fut marqué par la communauté juive d'Anvers, dont de nombreuses familles étaient venues d'Europe centrale et orientale. Plus tard, les négociants venus d'Inde prirent une place croissante. Promenez-vous et vous entendrez encore bien des langues dans ces rues.",
          ],
        },
        {
          heading: "La meule de polissage",
          kind: "legend",
          paragraphs: [
            "La tradition attribue à un artisan lié à Anvers, Lodewijk van Bercken, l'invention au XVe siècle du scaif : une meule de polissage enduite de poussière de diamant et d'huile, qui permettait de tailler toutes les facettes d'un diamant de façon symétrique. L'histoire est souvent répétée, mais les preuves historiques de sa vie et de son invention sont minces : voyez-la comme une fière tradition locale plutôt que comme un fait établi.",
          ],
        },
      ],
      didYouKnow: [
        "Le week-end des 15 et 16 février 2003, des voleurs pénétrèrent dans la salle des coffres de l'Antwerp Diamond Centre, dans ce quartier. Le butin, estimé à plus de 100 millions de dollars en diamants, or et bijoux, en fit l'un des plus grands vols de diamants de l'histoire. Des arrestations suivirent, mais la plupart des diamants ne furent jamais retrouvés.",
      ],
      moreStories: {
        "jewish-community": {
          title: "La communauté juive",
          subtitle: "La Seconde Guerre mondiale et après",
          sections: [
            {
              heading: "La Seconde Guerre mondiale",
              kind: "history",
              paragraphs: [
                "18 août 1941 : la Wehrmacht fait irruption au Diamantkring et saisit des diamants. 164 membres du Diamantkring sont assassinés.",
                "Été 1942 : des rafles, notamment les 15–16 et 28–29 août, dans des rues comme la Van Immerseelstraat, la Lange Kievitstraat et la Provinciestraat. Les dates varient légèrement selon les sources.",
                "Lors de la rafle des 28–29 août, c'est la police anversoise elle-même qui procéda aux arrestations. Ce fut unique dans l'histoire de l'occupation de la Belgique.",
                "Les victimes furent déportées vers Auschwitz-Birkenau via la caserne Dossin, à Malines.",
              ],
            },
            {
              heading: "Combien ?",
              kind: "history",
              paragraphs: [
                "Entre 56 % et 66 % des Juifs d'Anvers furent déportés, selon le mode de calcul : plus de la moitié, et selon certains calculs les deux tiers. Selon Antwerpen Herdenkt, environ 10 000 Juifs de la région ne survécurent pas à la guerre.",
              ],
            },
            {
              heading: "Après la guerre",
              kind: "history",
              paragraphs: [
                "En 1945, il restait encore environ 2 000 Juifs dans la ville. À la fin des années 1940, ils étaient de nouveau environ 10 000, une communauté fortement orthodoxe.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Revenez vers la place de la gare et engagez-vous dans De Keyserlei, la grande avenue qui mène à la vieille ville. Vers 1900, c'est par là que tout visiteur arrivé en train entrait dans Anvers.",
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "classics-keyserlei-meir": {
      name: "De Keyserlei et le Meir",
      subtitle: "Le grand boulevard, et le jour où la guerre frappa le cinéma",
      introduction: [
        "Vous êtes sur De Keyserlei, la large avenue qui relie la gare au cœur de la ville. Devant vous, elle se prolonge par le Meir, la rue commerçante la plus célèbre d'Anvers. Sur les cartes postales des années 1900, on retrouve exactement la même vue : des immeubles élégants, une circulation animée et, tout au bout, la flèche de la cathédrale qui montre le chemin.",
      ],
      sections: [
        {
          heading: "16 décembre 1944",
          kind: "history",
          paragraphs: [
            "Cette rue porte l'un des souvenirs les plus sombres d'Anvers. Après la libération de la ville en septembre 1944, son port devint vital pour ravitailler les armées alliées, et l'Allemagne riposta avec ses nouvelles armes V : des bombes volantes et des fusées V2 qui tombaient sans prévenir.",
            "L'après-midi du 16 décembre 1944, environ 1 100 personnes regardaient un film au Cinema Rex, au numéro 15 de cette avenue. À 15 h 20, une fusée V2 frappa le toit. 567 personnes furent tuées : 271 civils et 296 soldats alliés. Ce fut le bilan le plus lourd causé par une seule fusée de toute la guerre, et il fallut près d'une semaine pour dégager toutes les victimes des décombres.",
          ],
        },
      ],
      didYouKnow: [
        "Le Cinema Rex fut reconstruit après la guerre et rouvrit en 1947. Il ferma définitivement en 1993 et fut démoli deux ans plus tard. Aujourd'hui, presque rien dans la rue ne rappelle aux passants ce qui s'est passé ici.",
      ],
      transitionToNext:
        "Suivez le Meir en direction de la vieille ville. Un peu plus loin sur la gauche, un dôme doré scintille au-dessus d'une entrée imposante : une salle des fêtes qui a brûlé puis a ressuscité.",
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "classics-stadsfeestzaal": {
      name: "Stadsfeestzaal",
      subtitle: "La salle des fêtes de la ville, renée de ses cendres",
      introduction: [
        "Devant vous se trouve l'entrée de la Stadsfeestzaal, la salle des fêtes de la ville. Entrez et levez les yeux : une vaste salle couronnée d'une coupole de verre couverte de feuilles d'or. C'est aujourd'hui un centre commercial, mais elle a été construite pour tout autre chose.",
      ],
      sections: [
        {
          heading: "Une salle pour la ville",
          kind: "history",
          paragraphs: [
            "La Stadsfeestzaal ouvrit ses portes le 8 février 1908. Elle fut conçue par l'architecte de la ville Alexis Van Mechelen, pour le compte de la ville elle-même, dans un style néoclassique grandiose. Anvers était riche et sûre d'elle, et elle voulait un lieu pour les bals, les expositions, les foires et les réceptions : un salon pour toute la ville, au milieu de sa rue principale.",
          ],
        },
        {
          heading: "L'incendie de 2000",
          kind: "history",
          paragraphs: [
            "Le 27 décembre 2000, un court-circuit déclencha un incendie qui ravagea le bâtiment. Une fois les flammes éteintes, seuls l'escalier monumental, la façade historique et la structure métallique du toit tenaient encore debout.",
            "Beaucoup crurent la salle perdue à jamais. En 2004, la ville signa un bail de longue durée avec un promoteur, et les travaux de restauration commencèrent la même année. Sous la surveillance des services du patrimoine, la coupole de verre et ses feuilles d'or, l'escalier, les décors, les sculptures, les mosaïques, les reliefs muraux et même le parquet de chêne furent fidèlement reconstitués. En 2007, la Stadsfeestzaal rouvrit ses portes.",
          ],
        },
      ],
      didYouKnow: [
        "Une grande partie de l'intérieur « historique » que vous voyez est en réalité une reconstitution soignée du XXIe siècle, réalisée après l'incendie de 2000 à partir de photographies, de plans et de fragments conservés.",
      ],
      transitionToNext:
        "Continuez le long du Meir en direction de la vieille ville. Quelques minutes plus loin, Spooky vous attend avec une mission…",
    },

    // ── 4b: Spooky's quest ───────────────────────────────────────────────
    // `name` and `subtitle` show BEFORE the façade is found: they must not give it away.
    "classics-paleis-op-de-meir": {
      name: "Un mystère sur le Meir",
      subtitle: "La façade du dessin de Spooky",
      introduction: [
        "Trouvé ! La longue et élégante façade du XVIIIe siècle devant vous est le Paleis op de Meir.",
      ],
      sections: [
        {
          heading: "Un palais sur le Meir",
          kind: "history",
          paragraphs: [
            "Il fut construit à partir de 1745 pour un riche marchand, Johan Alexander van Susteren, par l'architecte anversois Jan Pieter van Baurscheit le Jeune. Il passa ensuite entre des mains remarquables : Napoléon l'acheta en 1811–1812 sans jamais y habiter, le tsar Alexandre Ier de Russie y séjourna en 1814, et il servit longtemps de palais royal.",
          ],
        },
      ],
      didYouKnow: [
        "Napoléon possédait le palais du Meir, mais lorsqu'il fut prêt à l'accueillir, il était déjà en exil sur l'île d'Elbe.",
      ],
      quest: {
        title: "La mission de Spooky",
        task: [
          "Regardez bien ce vieux dessin d'architecture. Quelque part sur le Meir se dresse le bâtiment qui lui correspond.",
          "Rendez-vous dans la zone de recherche indiquée sur la carte, levez les yeux vers les façades et comparez-les avec le dessin. Saurez-vous découvrir de quel bâtiment il s'agit ? Quand vous serez devant, Hidden Antwerp le remarquera.",
        ],
        zoneHint: "Le bâtiment se trouve quelque part dans cette zone.",
        revealedName: "Paleis op de Meir",
      },
      transitionToNext:
        "À quelques pas, une petite place s'ouvre à côté du Meir : le Wapper, où le plus célèbre peintre d'Anvers bâtit sa demeure.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-rubenshuis": {
      name: "La maison de Rubens",
      subtitle: "Là où le plus grand peintre d'Anvers vécut et travailla",
      introduction: [
        "Vous êtes sur le Wapper, une petite place juste à côté du Meir. Derrière la façade qui vous fait face, Pierre Paul Rubens, le peintre le plus célèbre qu'Anvers ait jamais produit, vécut et travailla jusqu'à sa mort en 1640.",
        "Le portrait en haut de cette page montre Rubens tel qu'il se peignit lui-même en 1623, au sommet de sa gloire : un large chapeau noir, un manteau sombre, un regard calme et assuré. Aujourd'hui, cet autoportrait appartient à la Royal Collection britannique.",
      ],
      sections: [
        {
          heading: "Un palazzo italien sur le Wapper",
          kind: "history",
          paragraphs: [
            "En 1608, Rubens rentra à Anvers après huit années passées en Italie. En 1610, il acheta ici une maison flamande existante et consacra la décennie suivante à la transformer en demeure et en atelier à l'italienne : un atelier de style baroque, un cabinet d'art avec une galerie de sculptures en hémicycle, un portique monumental et un pavillon de jardin. Lui et son épouse Isabella Brant s'y installèrent en 1617.",
            "Après sa mort, la maison fut louée, transformée et divisée. La ville l'acheta en 1937 et, entre 1937 et 1946, l'architecte de la ville Emiel Van Averbeke la reconstruisit, en grande partie d'après des gravures de Harrewijn de 1684 et 1692. Le portique, le pavillon de jardin et le gros œuvre de l'atelier sont en grande partie d'origine ; les pièces d'habitation et leurs intérieurs sont une reconstitution.",
          ],
        },
        {
          heading: "Rubens et Isabella",
          kind: "history",
          paragraphs: [
            "Le 3 octobre 1609, un an après son retour d'Italie, Rubens, âgé de 32 ans, épousa Isabella Brant, qui en avait 18. Vers cette époque, il les peignit tous les deux ensemble : c'est le double portrait de cette page, aujourd'hui conservé à l'Alte Pinakothek de Munich. Isabella vécut avec lui dans cette maison jusqu'à sa mort en 1626.",
          ],
        },
        {
          heading: "Lire le tableau",
          kind: "interpretation",
          paragraphs: [
            "Le couple est assis tout près l'un de l'autre sous une tonnelle de chèvrefeuille. Leurs mains droites reposent l'une sur l'autre : depuis l'époque romaine, les mains droites jointes étaient un signe de mariage. Le chèvrefeuille symbolisait l'amour durable ; l'un de ses noms allemands, Jelängerjelieber, signifie « plus c'est long, plus c'est cher ».",
            "Observez aussi les vêtements et la pose. Rubens porte le beau costume d'un gentilhomme, la main près de la garde d'une épée ; Isabella porte un haut chapeau, un large col de dentelle et un corsage richement brodé. Le grand format et les vêtements coûteux présentent le jeune couple comme des gens de condition. Un peintre qui se montre avec sa jeune épouse en plein air, détendu, en couple amoureux : pour son époque, ce double portrait était novateur.",
          ],
        },
        {
          heading: "Pourquoi il a sa place dans cette balade",
          kind: "interpretation",
          paragraphs: [
            "Le tableau marque le début de la vie que Rubens bâtit en ce lieu : un mariage, un atelier en plein essor et une maison qui montrait au monde qui il était. Un an après le mariage, il acheta cette maison. Dans la suite de la balade, vous le retrouverez : sur la Groenplaats, où la ville érigea sa statue, à la cathédrale, qui abrite des retables qu'il a peints, et à l'église Saint-Charles-Borromée, dont son atelier décora jadis les plafonds.",
          ],
        },
      ],
      didYouKnow: [
        "De 1648 à 1660, après la mort de Rubens, la maison fut louée par William et Margaret Cavendish, des royalistes anglais vivant en exil.",
      ],
      infoBoxes: [
        {
          kind: "visit",
          title: "Visiter la maison de Rubens",
          paragraphs: [
            "La maison elle-même est fermée pour restauration jusqu'en 2030 au plus tôt. Le jardin, la bibliothèque et la Rubens Experience, dans le nouveau bâtiment d'accueil, sont ouverts ; l'entrée des visiteurs se trouve à l'arrière, au Hopland 13.",
            "Vérifiez les horaires d'ouverture et le prix des billets sur le site web de la maison de Rubens avant de vous y rendre.",
          ],
          checkedOn: "2026-09-30",
          sourceUrl: "https://rubenshuis.be/nl/vraag-antwoord",
        },
      ],
      transitionToNext:
        "Quittez un instant le Meir et engagez-vous dans les ruelles qui se trouvent derrière. Caché derrière des façades ordinaires se dresse le bâtiment où Anvers apprit jadis au monde à commercer.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "La Handelsbeurs",
      subtitle: "Là où le monde venait faire des affaires",
      introduction: [
        "Devant vous se trouve la Handelsbeurs, l'ancienne bourse de commerce d'Anvers. Depuis la rue, elle se fait discrète. À l'intérieur se cache l'une des salles les plus extraordinaires de la ville : une cour gothique entourée de galeries, coiffée d'une vertigineuse toiture de fer et de verre.",
        "Imaginez maintenant cette toiture effacée. Pendant plus de trois siècles, le cœur de ce bâtiment fut une cour à ciel ouvert, où les marchands de la moitié de l'Europe se retrouvaient chaque jour.",
      ],
      sections: [
        {
          heading: "Une place à ciel ouvert",
          kind: "history",
          paragraphs: [
            "En 1531, Anvers ouvrit une nouvelle bourse, conçue par Domien de Waghemakere dans le style gothique tardif brabançon. Son cœur était une cour rectangulaire, à ciel ouvert, entourée sur ses quatre côtés de galeries couvertes aux voûtes en étoile reposant sur des colonnes.",
            "Chaque jour, des marchands du Portugal, d'Italie, d'Allemagne, d'Angleterre et d'Espagne se rassemblaient sur cette place ouverte, dans une babel de langues, pour fixer les prix, accorder des crédits et négocier des lettres de change. Quand il pleuvait, ils s'abritaient sous les galeries ; au-dessus des galeries se trouvaient des boutiques et des salles. La gravure en haut de cette page montre la cour remplie de petits groupes de négociants.",
            "Ce fut l'un des tout premiers bâtiments au monde construits spécialement pour le commerce, et l'idée fit son chemin. Lorsque Thomas Gresham, agent de la Couronne anglaise à Anvers, fonda le Royal Exchange de Londres dans les années 1560, il prit pour modèle cette cour et ses galeries ; Amsterdam suivit en 1611.",
          ],
        },
        {
          heading: "Un toit sur la cour",
          kind: "history",
          paragraphs: [
            "Ce n'est qu'en 1852–1854 que la cour fut couverte pour la première fois, par l'ingénieur Charles Marcellis, avec du fer et une coupole de verre. Quatre ans plus tard, le 2 août 1858, un incendie détruisit à la fois l'ancienne bourse et sa nouvelle toiture.",
            "L'architecte Joseph Schadde la reconstruisit ; la nouvelle bourse fut inaugurée le 19 octobre 1872. Il conserva la cour et ses galeries, qui suivent toujours le plan de 1531, mais la couvrit de la spectaculaire toiture de fer et de verre que vous voyez aujourd'hui.",
          ],
        },
      ],
      didYouKnow: [
        "Pendant plus de trois siècles, de 1531 jusqu'au premier toit de 1852–1854, les marchands d'Anvers firent leurs affaires sous le soleil, le vent et la pluie, dans une cour à ciel ouvert.",
      ],
      galleries: {
        "exchange-in-prints": {
          title: "La Bourse en gravures anciennes",
          intro: "Deux gravures du XIXe siècle montrant les galeries, avant et après l'incendie de 1858.",
        },
      },
      transitionToNext:
        "De retour sur le Meir, levez les yeux. Une tour s'élève au-dessus des toits, comme un morceau de New York tombé dans une ville médiévale. Nous faisons un bref saut en avant dans le temps, avant que notre voyage dans le passé ne commence vraiment.",
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "classics-boerentoren": {
      name: "La Boerentoren",
      subtitle: "Le premier gratte-ciel d'Europe",
      introduction: [
        "Devant vous s'élève la Boerentoren, la « tour des Paysans ». Avec sa silhouette sobre en gradins, elle semble appartenir au New York des années 1930 plutôt qu'à une ville d'églises gothiques, et c'est exactement ce que voulaient ses bâtisseurs.",
      ],
      sections: [
        {
          heading: "Un rêve américain sur le Schoenmarkt",
          kind: "history",
          paragraphs: [
            "L'îlot sur lequel elle se dresse avait été dévasté pendant la Première Guerre mondiale. Lorsque la ville organisa un concours pour sa reconstruction, le cahier des charges était explicite : construire un gratte-ciel américain. Les architectes Jan Vanhoenacker, Emiel Van Averbeke et Jos Smolderen dessinèrent une tour de style Art déco, construite de 1929 à 1932, avec en ligne de mire l'Exposition universelle qu'Anvers accueillit en 1930.",
            "Son squelette est une ossature d'acier d'environ 3 500 tonnes, fabriquée par l'entreprise allemande Demag. Avec 25 étages et une hauteur de 87,5 mètres, elle fut le premier gratte-ciel d'Europe et, à l'époque, le plus haut. Une rénovation du sommet en 1975 la porta à 95,75 mètres et 26 étages.",
          ],
        },
      ],
      didYouKnow: [
        "Son surnom vient de ses propriétaires : le bâtiment abrita la caisse d'épargne du Boerenbond, la Ligue des paysans belges. Une tour remplie de l'épargne des paysans, en pleine ville.",
      ],
      transitionToNext:
        "D'ici, la tour vous indique la direction du vieux cœur d'Anvers. Rejoignez la grande place devant vous, où la cathédrale apparaît pour la première fois dans toute sa hauteur, et où le sol sous vos pieds cache un secret.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-groenplaats": {
      name: "Groenplaats",
      subtitle: "Une place qui fut autrefois un cimetière",
      introduction: [
        "Vous êtes sur la Groenplaats, l'une des places les plus animées d'Anvers, avec la cathédrale qui s'élève au-dessus des toits et Pierre Paul Rubens sur son piédestal au centre. On la croirait faite pour les terrasses et les marchés. Pendant des siècles, elle fut tout autre chose.",
      ],
      sections: [
        {
          heading: "Le cimetière de la cathédrale",
          kind: "history",
          paragraphs: [
            "Cette place, avec la Lijnwaadmarkt, la Melkmarkt, le Schoenmarkt et la Handschoenmarkt autour de la cathédrale, formait autrefois le cimetière de la cathédrale. Les Anversois l'appelaient le Groot Kerkhof, le Grand Cimetière, puis le Groen Kerkhof, le Cimetière vert. Certains utilisent encore ce nom aujourd'hui.",
            "En 1754, le cimetière fut entouré d'un mur, mais pas pour longtemps. En 1784, l'empereur Joseph II interdit les inhumations à l'intérieur des villes, pour des raisons de santé publique, et en 1799 le mur fut abattu. Le cimetière devint peu à peu la place que vous voyez aujourd'hui.",
            "Un tableau de 1597, reproduit ci-dessous, donne une idée du cimetière à cette époque : un cortège funèbre de personnes en deuil vêtues de noir le longe, avec la cathédrale qui s'élève à l'arrière-plan.",
          ],
        },
        {
          heading: "Rubens prend sa place",
          kind: "history",
          paragraphs: [
            "En 1840, Anvers commémora les 200 ans de la mort de Rubens. Une statue fut dessinée par Willem Geefs, mais l'argent manquait et le bronze ne fut pas prêt à temps : le 25 août 1840, c'est une version provisoire en plâtre qui fut dévoilée, sur une autre place. Ce n'est que les 9 et 10 août 1843 que le Rubens de bronze prit sa place ici, au milieu de la Groenplaats.",
            "Geefs le représenta en peintre et en diplomate : à ses pieds reposent une palette et une épée, car Rubens servit aussi le roi d'Espagne comme envoyé. Détail bien choisi pour un ancien cimetière, la statue se dresse à l'emplacement d'une ancienne croix de cimetière, au-dessus de la tombe d'un évêque, Antonius d'Espinosa.",
          ],
        },
      ],
      didYouKnow: [
        "Quand vous vous asseyez à une terrasse ici, vous êtes assis sur ce qui fut, pendant des siècles, le lieu de sépulture de la cathédrale.",
      ],
      transitionToNext:
        "Dirigez-vous vers la cathédrale. En chemin, observez la rangée de maisons adossées au chœur de l'église. Elles cachent les fondations d'une cathédrale qui ne fut jamais achevée.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Onze-Lieve-Vrouwekathedraal",
      subtitle: "La cathédrale qu'Anvers voulut rendre plus grande encore",
      introduction: [
        "Devant vous se dresse l'Onze-Lieve-Vrouwekathedraal, la cathédrale Notre-Dame, l'une des plus grandes églises gothiques des anciens Pays-Bas et, pendant des siècles, le premier repère qu'apercevaient les marins sur l'Escaut. Sa tour nord, haute d'environ 123 mètres, domine toujours l'horizon.",
        "Nous voici à la fin du Moyen Âge. La cathédrale fut construite en quelque 170 ans, du milieu du XIVe siècle jusqu'en 1521, par des générations de bâtisseurs qui savaient qu'ils ne la verraient jamais achevée.",
      ],
      sections: [],
      didYouKnow: [],
      cards: {
        cathedral: {
          title: "La cathédrale",
          subtitle: "Deux siècles de chantier, et un projet trop grand",
          sections: [
            {
              heading: "Construite en 170 ans",
              kind: "history",
              paragraphs: [
                "La construction commença en 1352 et dura jusqu'en 1521, avec une longue interruption entre 1356 et 1378. Des générations de maîtres d'œuvre se succédèrent sur le même plan, parmi lesquels Peter Appelmans ainsi qu'Herman et Domien de Waghemakere. L'argent venait de dons, des guildes et de la ville ; quand il venait à manquer, le chantier attendait, tout simplement.",
                "La tour nord, haute d'environ 123 mètres, fut achevée vers 1518–1521 et reste aujourd'hui la plus haute tour d'église du Benelux. La tour sud fut arrêtée en 1475 faute d'argent, à environ 65 mètres, et ne fut jamais terminée.",
              ],
            },
            {
              heading: "Plus grande encore : le Nieuwerck",
              kind: "history",
              paragraphs: [
                "En 1521, au moment même où l'église était achevée, Anvers décida qu'elle n'était pas assez grande. La ville la plus riche d'Europe du Nord voulait une église à sa mesure, et un gigantesque agrandissement du chœur, le Nieuwerck, fut dessiné par Domien de Waghemakere et Rombout Keldermans.",
                "Le 15 juillet 1521, le jeune empereur Charles Quint posa lui-même la première pierre. Mais l'enthousiasme retombait déjà vers 1528 et, dans la nuit du 5 au 6 octobre 1533, un grand incendie endommagea gravement la toiture et les piliers de l'église ; sa cause est inconnue. Tout l'argent passa dans la réparation du bâtiment existant et, en 1537, le Nieuwerck fut abandonné pour de bon.",
              ],
            },
            {
              heading: "Les tempêtes de l'histoire",
              kind: "history",
              paragraphs: [
                "La cathédrale a traversé bien des épreuves. Lors de la furie iconoclaste de 1566, une vague de colère protestante contre les images, une grande partie de son intérieur fut saccagée. Deux siècles plus tard, les troupes de la Révolution française occupèrent la ville, fermèrent l'église et emportèrent ses trésors.",
                "Une grande partie de ce que l'on peut voir à l'intérieur aujourd'hui fut rapportée ou restaurée par la suite, notamment des retables de Rubens qui comptent parmi ses œuvres les plus célèbres.",
              ],
            },
          ],
          didYouKnow: [
            "Le Nieuwerck ne fut jamais construit, mais il n'a pas entièrement disparu. Ses fondations et ses piliers subsistent dans la rangée de maisons autour du chœur, entre la Lijnwaadmarkt et la Groenplaats. Certaines de ces maisons reposent littéralement sur l'amorce d'une cathédrale qui ne fut jamais achevée.",
            "La première pierre de Charles Quint portait une inscription latine rappelant que l'empereur l'avait posée aux ides de juillet 1521.",
          ],
        },
        "quinten-matsijs": {
          title: "Quinten Matsijs",
          subtitle: "De forgeron à peintre ?",
          sections: [
            {
              heading: "Un peintre pour la cathédrale",
              kind: "history",
              paragraphs: [
                "Quinten Matsijs (vers 1466–1530) naquit à Louvain, fils d'un forgeron, et devint l'un des principaux peintres d'Anvers à son âge d'or. En 1491, il devint maître dans la guilde de Saint-Luc, la guilde des peintres.",
                "Son lien avec cette église est bien réel. Entre 1508 et 1511, il peignit un grand retable pour l'autel de la guilde des menuisiers dans la cathédrale : une Lamentation sur le Christ mort, encadrée de scènes de saint Jean-Baptiste et de saint Jean l'Évangéliste. Il est aujourd'hui exposé au KMSKA, le Musée royal des Beaux-Arts d'Anvers.",
              ],
            },
            {
              heading: "Le forgeron qui peignit par amour",
              kind: "legend",
              paragraphs: [
                "Anvers raconte à son sujet une histoire romantique. Quinten, dit-on, était forgeron et tomba amoureux d'une jeune fille qui préférait un peintre à un forgeron. Il posa donc son marteau et prit le pinceau. Karel van Mander, qui mit l'histoire par écrit en 1604, en donne aussi une autre version : une longue maladie l'empêcha de poursuivre le dur travail de la forge, et il se mit à colorier des estampes pour subvenir aux besoins de sa mère.",
                "Selon un autre récit, il peignit sur un tableau du père de sa bien-aimée une mouche si réaliste que celui-ci tenta de la chasser de la main, puis consentit au mariage.",
              ],
            },
            {
              heading: "Ce qu'en disent les historiens",
              kind: "interpretation",
              paragraphs: [
                "Rien ne prouve que Quinten ait lui-même travaillé comme forgeron ; c'était le métier de son père. Les historiens voient dans cette histoire une légende qui s'est étoffée avec le temps. Elle est pourtant ancienne : le vers latin sous son portrait, imprimé à Anvers en 1572 et reproduit en haut de cette carte, lui fait déjà dire que l'amour a fait du forgeron un peintre.",
              ],
            },
          ],
          didYouKnow: [
            "Juste à côté de la cathédrale, sur la Handschoenmarkt, se trouve un puits avec une cage gothique en fer forgé, couronnée d'un petit Brabo. La tradition attribue la ferronnerie à Matsijs, mais ce n'est pas prouvé. À quelques mètres de là, sur la façade ouest de la cathédrale, une pierre commémorative à son effigie porte la ligne latine « Connubialis amor de Mulcibre fecit Apellem » : l'amour conjugal a fait du forgeron un peintre.",
          ],
        },
        "nello-patrasche": {
          title: "Nello et Patrasche",
          subtitle: "Un roman anglais, un classique japonais et une statue de marbre",
          sections: [
            {
              heading: "L'histoire",
              kind: "fiction",
              paragraphs: [
                "Nello est un pauvre orphelin qui vit dans un village « à une lieue d'Anvers ». Avec son chien Patrasche, qui tire la charrette, il apporte chaque jour du lait en ville. Nello rêve de devenir peintre et brûle de voir les deux tableaux de Rubens de la cathédrale, mais ils sont voilés, et seuls ceux qui paient peuvent les voir.",
                "Il participe à un concours de dessin, ne le gagne pas, et perd tout. La veille de Noël, il trouve l'église ouverte et voit enfin L'Érection de la Croix et La Descente de Croix. Le lendemain matin, on retrouve Nello et Patrasche ensemble devant les tableaux, morts de froid.",
              ],
            },
            {
              heading: "Un livre d'Angleterre, un classique au Japon",
              kind: "history",
              paragraphs: [
                "Un chien des Flandres (A Dog of Flanders) fut écrit par l'autrice anglaise Ouida (Marie Louise de la Ramée). Il parut dans un magazine à la fin de 1871, puis en livre en 1872. Les deux tableaux sont bien réels : ils sont toujours accrochés dans cette cathédrale. Dans le roman, ils incarnent l'art auquel Nello aspire, et qui reste caché à ceux qui ne peuvent pas payer.",
                "Longtemps, l'histoire fut à peine connue en Flandre même. À l'étranger, elle devint un classique : elle fut portée plusieurs fois à l'écran aux États-Unis, à partir de 1935, et au Japon, la série animée de 1975 en fit un classique pour enfants. Un documentaire de 2007 s'intitulait, fort à propos, Patrasche, a Dog of Flanders – Made in Japan.",
              ],
            },
            {
              heading: "La statue",
              kind: "history",
              paragraphs: [
                "En 2016, une statue de Batist Vermeulen fut installée sur la Handschoenmarkt, devant la cathédrale. Elle remplaça une pierre commémorative de 2003. Nello et Patrasche dorment dans les bras l'un de l'autre, sous une couverture faite des pavés mêmes de la place. Depuis novembre 2022, elle est éclairée la nuit.",
              ],
            },
          ],
          didYouKnow: [
            "Ouida ne nomme jamais le village de Nello. Le lien avec Hoboken, aujourd'hui un district d'Anvers, a été établi plus tard.",
          ],
        },
      },
      lookAt: [
        {
          title: "Une tour et demie",
          body: "Regardez la façade de la cathédrale. La tour de gauche (nord) s'élève jusqu'à sa flèche élégante ; celle de droite (sud) s'arrête à environ la moitié de cette hauteur. Le projet prévoyait deux grandes tours, mais une seule fut jamais achevée. Regardez l'eau-forte de 1649 sur cette page : la silhouette asymétrique était déjà la même à l'époque.",
        },
      ],
      transitionToNext:
        "Contournez la cathédrale jusqu'à l'Oude Koornmarkt. Cherchez bien une entrée étroite entre les maisons : elle mène à une ruelle cachée que le temps semble avoir oubliée.",
    },

    // ── 10 ───────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Un passage secret vers le vieil Anvers",
      introduction: [
        "Franchissez l'étroite entrée et le bruit de la ville s'évanouit. Vous êtes dans la Vlaeykensgang, une ruelle sinueuse entre de vieux murs de brique, de petites cours et de modestes maisons. L'espace d'un instant, on imagine sans peine l'Anvers d'il y a plusieurs siècles.",
        "On présente souvent la Vlaeykensgang comme l'une des ruelles les plus anciennes et les plus étroites d'Anvers. L'inventaire du patrimoine n'établit pas un tel classement, mais il confirme ce qui rend ce lieu si particulier : un passage pavé en forme de L, bordé de onze petites maisons d'arrière-cour, qui a conservé presque entièrement son aspect d'antan.",
      ],
      sections: [
        {
          heading: "Des arrière-bâtiments devenus une rue",
          kind: "history",
          paragraphs: [
            "Le passage fut aménagé en 1591, même s'il ne portait pas encore ce nom ; le nom est plus récent que la ruelle elle-même. Les petits bâtiments étaient, au XVIe siècle, des arrière-bâtiments et des entrepôts situés derrière les maisons des rues voisines. Avec le temps, l'ensemble devint un passage intérieur et, à partir du XVIIe siècle, les bâtiments servirent de petits logements modestes.",
          ],
        },
        {
          heading: "Sauvée à la dernière minute",
          kind: "history",
          paragraphs: [
            "Dans les années 1960, la ruelle était très délabrée, et l'on projetait de la démolir pour faire place à un parking. En 1969, l'antiquaire et décorateur d'intérieur Axel Vervoordt acheta l'ensemble. Les façades et les toitures furent classées comme monument en 1973, et la restauration commença en 1977.",
          ],
        },
      ],
      didYouKnow: [
        "L'un des recoins les plus pittoresques du vieil Anvers existe aujourd'hui parce qu'on le jugea un jour assez dénué de valeur pour en faire un parking.",
      ],
      transitionToNext:
        "Suivez la ruelle et les rues adjacentes jusqu'à la grande place du marché de la ville. Préparez-vous à lever les yeux : les façades qui l'entourent regorgent d'or.",
    },

    // ── 11 ───────────────────────────────────────────────────────────────
    "classics-grote-markt": {
      name: "Grote Markt et les maisons des guildes",
      subtitle: "La place dorée, plus jeune qu'elle n'en a l'air",
      introduction: [
        "Vous êtes sur la Grote Markt, la grand-place d'Anvers. D'un côté se dresse l'hôtel de ville ; tout autour de la place, de hautes maisons des guildes aux pignons à gradins et à volutes, couronnées de figures dorées qui accrochent le soleil.",
        "Les guildes étaient les associations d'artisans et de marchands qui organisaient une grande partie de la vie urbaine : qui pouvait travailler, ce qui pouvait être vendu, et avec quelle qualité. Leurs maisons, ici, étaient leurs vitrines.",
      ],
      sections: [
        {
          heading: "La Furie espagnole",
          kind: "history",
          paragraphs: [
            "En novembre 1576, des soldats espagnols mutinés pillèrent Anvers ; vous en apprendrez davantage à l'hôtel de ville. L'incendie qu'ils allumèrent balaya cette place et détruisit les maisons qui s'y trouvaient. Ce qui s'éleva ensuite fut une nouvelle génération de bâtiments.",
            "Le plus bel exemple est la maison de l'Oude Voetboog, la guilde de Saint-Georges. Construite en 1515–1516, détruite en 1576, elle fut rebâtie dans le style Renaissance en 1580–1582. Sa façade est considérée comme l'un des joyaux de l'architecture Renaissance anversoise.",
          ],
        },
        {
          heading: "Un rêve du XIXe siècle sur l'âge d'or",
          kind: "history",
          paragraphs: [
            "Une bonne partie de ce que vous voyez est plus récente qu'il n'y paraît. En 1895, un citoyen nommé R. Joostens légua par testament de l'argent pour rendre à la Grote Markt sa splendeur d'antan. De la fin du XIXe siècle au début du XXe siècle, les façades du côté nord de la place, ainsi que le numéro 44 du côté sud, furent librement reconstruites et embellies dans l'esprit du XVIe siècle.",
          ],
        },
      ],
      didYouKnow: [
        "Plusieurs des « anciennes » maisons des guildes de cette place sont en réalité des reconstructions des années 1900. Anvers ne se contentait pas de préserver son âge d'or : elle le réinventait aussi, avec amour.",
      ],
      lookAt: [
        {
          title: "Les figures dorées",
          body: "Levez les yeux vers le sommet des pignons. Trouvez le saint Georges doré à cheval terrassant le dragon, sur la maison de l'Oude Voetboog, la guilde de Saint-Georges. Cherchez ensuite les autres figures et emblèmes : beaucoup font référence à la guilde propriétaire de la maison. Comparez la place avec la photographie de 1905 sur cette page.",
        },
      ],
      transitionToNext:
        "Au milieu de la place, une figure de bronze s'apprête à lancer quelque chose en l'air. Approchez-vous de la fontaine : elle raconte l'histoire la plus célèbre d'Anvers.",
    },

    // ── 12 ───────────────────────────────────────────────────────────────
    "classics-brabo": {
      name: "La fontaine de Brabo",
      subtitle: "Un géant, une main et le nom d'une ville",
      introduction: [
        "Devant vous se dresse la fontaine de Brabo. Au sommet d'un amas de rochers, entouré de créatures marines et de personnages, un jeune homme se penche en arrière et lance quelque chose au loin. Regardez bien ce qu'il tient : c'est une main.",
      ],
      sections: [
        {
          heading: "La légende de Druon Antigoon",
          kind: "legend",
          paragraphs: [
            "Il y a bien longtemps, raconte-t-on, un géant nommé Druon Antigoon vivait au bord de l'Escaut. Il gardait le fleuve et exigeait un péage de chaque navire qui voulait passer. Quiconque refusait ou ne pouvait pas payer avait une main coupée, que le géant jetait dans le fleuve.",
            "Puis vint un jeune soldat romain nommé Silvius Brabo. Il défia le géant, le vainquit, lui trancha la main et la jeta dans l'Escaut. Et c'est ainsi, dit la légende, que la ville reçut son nom : hand werpen, « lancer une main », Antwerpen.",
          ],
        },
        {
          heading: "Ce qu'en pensent les historiens",
          kind: "interpretation",
          paragraphs: [
            "C'est une histoire merveilleuse, mais pas une explication que les historiens prennent au sérieux. L'origine du nom Antwerpen est incertaine. La plupart des explications la rattachent non pas à des mains mais à la terre : à un terrain surélevé le long du fleuve, une parcelle de terre « en avant », formée ou rejetée par les eaux. La légende du géant est une tentative bien plus tardive d'expliquer un nom dont on avait oublié la véritable origine.",
          ],
        },
        {
          heading: "La fontaine",
          kind: "history",
          paragraphs: [
            "La fontaine est l'œuvre du sculpteur anversois Jef Lambeaux, qui avait en grande partie mis au point son projet dès 1883. Elle fut installée sur la Grote Markt en 1887, devant l'hôtel de ville, à une époque où Anvers tenait à célébrer sa propre histoire et son identité.",
          ],
        },
      ],
      didYouKnow: [
        "Les mains de la légende sont partout à Anvers : dans les armoiries de la ville, qui montrent un château surmonté de deux mains, et dans les « mains d'Anvers » en chocolat et en biscuit vendues dans les boutiques autour de vous.",
      ],
      transitionToNext:
        "Tournez-vous vers le long bâtiment clair derrière Brabo. Il a survécu à l'une des nuits les plus terribles de l'histoire de la ville.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
    "classics-stadhuis": {
      name: "L'hôtel de ville",
      subtitle: "Bâti dans la fierté, incendié dans la fureur",
      introduction: [
        "Devant vous se dresse le Stadhuis, l'hôtel de ville d'Anvers. Sa longue façade est calme et horizontale, dominée par une haute partie centrale richement décorée. À sa construction, c'était l'un des bâtiments les plus modernes d'Europe : un palais Renaissance pour une ville au sommet de sa puissance.",
      ],
      sections: [
        {
          heading: "Un palais pour la ville",
          kind: "history",
          paragraphs: [
            "L'hôtel de ville fut construit entre 1561 et 1565, d'après les plans de Cornelis Floris de Vriendt, avec d'autres architectes et artistes. Anvers était alors l'une des villes les plus riches d'Europe, et elle voulait que son gouvernement siège dans un bâtiment qui le montre.",
          ],
        },
      ],
      didYouKnow: [
        "Le bâtiment que vous voyez a été restauré après l'incendie de 1576. Regardez la photographie sur cette page, prise au milieu des années 1860 : depuis la place, l'hôtel de ville ressemblait déjà beaucoup à ce qu'il est aujourd'hui.",
      ],
      lookAt: [
        {
          title: "La partie centrale",
          body: "Comparez les ailes sobres de la façade avec la partie centrale, où s'empilent colonnes, niches et statues, et qui s'élève au-dessus de la ligne des toits. Ce contraste, le calme et l'ordre avec une explosion de décor au centre, est typique de la Renaissance que Floris apporta à Anvers.",
        },
      ],
      // The Spanish Fury, as slides: the approved section, paragraph by paragraph, each with its images.
      cards: {
        "fury-attack": {
          title: "La Furie espagnole, 4 novembre 1576",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "À peine dix ans plus tard, ce bâtiment fut témoin d'une catastrophe. Les Pays-Bas s'étaient révoltés contre le roi d'Espagne, et ses soldats dans la région n'avaient pas été payés depuis longtemps. Le 4 novembre 1576, des troupes espagnoles mutinées sortirent de la citadelle au sud de la ville, rejointes par des mutins venus d'Alost, prirent Anvers d'assaut et commencèrent à la piller.",
              ],
            },
          ],
        },
        "fury-city-hall": {
          title: "L'hôtel de ville en flammes",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Le magistrat de la ville organisa une contre-attaque depuis cet hôtel de ville, ici sur la Grote Markt. Les bourgeois d'Anvers se défendirent sur la place et dans le bâtiment, et tirèrent depuis les fenêtres de l'hôtel de ville sur les cavaliers espagnols qui chargeaient à travers la place. Les cavaliers subirent de lourdes pertes, jusqu'à ce que quelques-uns d'entre eux forcent l'entrée et mettent le feu au bâtiment avec des bottes de paille apportées pour l'occasion.",
              ],
            },
          ],
        },
        "fury-city": {
          title: "La ville dans le chaos",
          sections: [
            {
              kind: "history",
              paragraphs: [
                "Les flammes gagnèrent les maisons voisines : environ six cents furent réduites en cendres, la plupart derrière et à côté de l'hôtel de ville. De l'hôtel de ville lui-même, seuls les murs extérieurs restèrent debout.",
              ],
            },
            {
              kind: "history",
              paragraphs: [
                "On ne sait pas précisément combien de personnes périrent. Les estimations vont de plusieurs centaines à environ 8 000 ; de nombreux historiens pensent que plus de 7 000 personnes y laissèrent la vie. L'événement est resté dans l'histoire sous le nom de Furie espagnole, et il ébranla la confiance de celle qui avait été la grande ville marchande de l'Europe.",
              ],
            },
          ],
        },
      },
      transitionToNext:
        "Quittez la Grote Markt et marchez vers l'est, par des rues tranquilles, jusqu'à une petite place que de nombreux visiteurs considèrent comme la plus belle d'Anvers.",
    },

    // ── 14 ───────────────────────────────────────────────────────────────
    "classics-conscienceplein": {
      name: "Hendrik Conscienceplein",
      subtitle: "L'homme qui apprit à son peuple à lire",
      introduction: [
        "Vous êtes sur le Hendrik Conscienceplein, une place calme et fermée devant une église baroque. Devant l'ancienne bibliothèque se dresse la statue de l'écrivain Hendrik Conscience.",
      ],
      sections: [
        {
          heading: "Un écrivain pour les Flamands",
          kind: "history",
          paragraphs: [
            "Au XIXe siècle, le français dominait la vie publique, l'administration et la littérature en Belgique, y compris en Flandre. Hendrik Conscience écrivait en néerlandais, pour les lecteurs flamands ordinaires. Son roman historique De Leeuw van Vlaenderen (Le Lion de Flandre), publié en 1838, devint un symbole de la fierté et de l'émancipation flamandes.",
            "En 1883, il reçut une statue sur cette place, qui s'appelait jusque-là le Jezuïetenplein, la place des Jésuites, et qui fut rebaptisée en son honneur. C'était du jamais-vu pour un auteur vivant. Conscience posa lui-même pour le sculpteur, Frans Joris, mais sa santé fragile l'empêcha d'assister à l'inauguration en août 1883. Il mourut un mois plus tard.",
          ],
        },
      ],
      didYouKnow: [
        "Les célèbres mots inscrits sur la statue, « Hij leerde zijn volk lezen » (« Il apprit à son peuple à lire »), furent prononcés pour la première fois lors de l'inauguration par le poète Jan Van Beers. Mais ce n'est pas le sculpteur qui les avait trouvés : l'idée venait d'Henriëtte Mertens, l'épouse du poète.",
      ],
      transitionToNext:
        "Retournez-vous maintenant. L'église richement décorée derrière vous est la prochaine étape, et le lieu où nous entrons dans l'époque de Rubens.",
    },

    // ── 15 ───────────────────────────────────────────────────────────────
    "classics-carolus-borromeus": {
      name: "Église Saint-Charles-Borromée",
      subtitle: "Le chef-d'œuvre perdu de Rubens",
      introduction: [
        "Devant vous s'élève la façade de la Sint-Carolus Borromeuskerk : étagée, sculptée, théâtrale, un monde totalement différent de la cathédrale gothique. C'est le baroque, le style de Rubens et de la Contre-Réforme, conçu pour submerger les sens et émouvoir les fidèles.",
      ],
      sections: [
        {
          heading: "La vitrine des jésuites",
          kind: "history",
          paragraphs: [
            "L'église fut construite entre 1615 et 1621 par les jésuites, l'ordre catholique qui était à l'avant-garde de la Contre-Réforme. Elle fut conçue par les architectes jésuites Pieter Huyssens et François d'Aguilon, et dédiée au fondateur de l'ordre, saint Ignace de Loyola.",
            "Pierre Paul Rubens, alors au sommet de sa gloire, y fut étroitement associé. Pour les bas-côtés et les tribunes, son atelier réalisa 39 plafonds peints d'après ses esquisses ; le jeune Antoine van Dyck participa au travail. Pendant un siècle, ce fut l'un des intérieurs d'église les plus somptueux d'Europe.",
          ],
        },
        {
          heading: "La foudre de 1718",
          kind: "history",
          paragraphs: [
            "Le 18 juillet 1718, la foudre frappa l'église et y mit le feu. Les 39 plafonds peints de Rubens furent tous perdus. L'intérieur fut ensuite reconstruit dans un style plus austère, sur des plans de Jan Pieter van Baurscheit l'Ancien.",
            "Plus tard au XVIIIe siècle, l'ordre des jésuites fut supprimé, et l'église fut dédiée à nouveau à saint Charles Borromée, le nom qu'elle porte encore aujourd'hui.",
          ],
        },
      ],
      didYouKnow: [
        "Nous ne savons à quoi ressemblaient les plafonds de Rubens que grâce à une série d'estampes : des gravures de Jan Punt d'après des aquarelles de Jacob de Wit. L'image sur cette page en fait partie : un Rubens perdu, conservé sur papier.",
      ],
      transitionToNext:
        "Du baroque, nous remontons maintenant plus loin, jusqu'à la fin du Moyen Âge. Marchez vers le nord, en direction du fleuve, jusqu'à un bâtiment saisissant rayé de rouge et de blanc.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
    "classics-vleeshuis": {
      name: "Le Vleeshuis",
      subtitle: "Un palais pour les bouchers",
      introduction: [
        "Devant vous se dresse le Vleeshuis, la halle aux viandes. Avec ses hauts pignons, ses tours et ses frappantes bandes de brique rouge et de pierre blanche, on dirait un château ou un hôtel de ville. Il fut pourtant construit pour les bouchers de la ville.",
      ],
      sections: [
        {
          heading: "La guilde des bouchers",
          kind: "history",
          paragraphs: [
            "Le Vleeshuis fut construit entre 1501 et 1504 pour la guilde des bouchers, dans le style gothique tardif. Les plans étaient d'Herman de Waghemakere l'Ancien ; après sa mort en 1502, les travaux furent probablement poursuivis par son fils Domien, ce même Domien qui construisit plus tard la bourse et travailla à la cathédrale et au Steen.",
            "Il en dit long sur l'organisation de l'alimentation dans une ville médiévale. Le rez-de-chaussée était une halle de marché comptant 62 bancs à viande, où les bouchers de la guilde vendaient leur viande, et il abritait aussi la chapelle de la guilde. À l'étage se trouvaient la salle de réunion de la guilde, sa salle des fêtes et ses archives. La guilde décidait de qui pouvait vendre, et où.",
          ],
        },
      ],
      didYouKnow: [
        "Tout ne pouvait pas être vendu à l'intérieur. Les abats et les tripes étaient interdits dans la halle ; on les vendait dans de petites échoppes, les penshuisjes, construites à l'extérieur contre le bâtiment, entre ses contreforts.",
        "Les bandes rouges et blanches des murs s'appellent des speklagen, des « couches de lard ». On serait tenté d'y voir une plaisanterie sur les bouchers, mais elles n'ont rien à voir avec le commerce de la viande : c'était simplement une mode architecturale, restée populaire jusque tard dans le XVIIe siècle.",
      ],
      lookAt: [
        {
          title: "Les couches de lard",
          body: "Regardez les murs : des rangées de brique rouge alternent avec des bandes de grès clair. Maintenant que vous connaissez leur nom, vous repérerez ces speklagen sur de nombreux bâtiments anciens à Anvers et ailleurs en Flandre.",
        },
      ],
      galleries: {
        "vleeshuis-postcards": {
          title: "Le Vleeshuis sur des cartes postales anciennes",
          intro: "Trois cartes postales anciennes du Museum Vleeshuis montrent ses salles, meublées de cheminées, de meubles et d'objets de la collection.",
        },
      },
      // Spooky's task on arrival (a detail to find); the walker says when they found it.
      quest: {
        title: "Trouvez l'ancienne muraille du burcht",
        task: [
          "Trouvez l'ancienne muraille qui protégeait le burcht dès le début du XIIIe siècle.",
          "La photo est votre indice : cherchez autour du Vleeshuis un pan de mur comme celui-ci. Trouvé ? Touchez le bouton ci-dessous.",
        ],
      },
      transitionToNext:
        "Continuez quelques rues vers le nord, dans l'ancien quartier du port. Ici se dresse une église dont l'histoire est liée au fleuve, et au feu.",
    },

    // ── 17 ───────────────────────────────────────────────────────────────
    "classics-sint-paulus": {
      name: "Sint-Pauluskerk",
      subtitle: "Gothique, baroque, et sauvée des flammes",
      introduction: [
        "Devant vous se dresse la Sint-Pauluskerk, l'église Saint-Paul, une église gothique coiffée d'une surprenante tour baroque. Elle se trouve tout près de l'Escaut, dans ce qui fut pendant des siècles le quartier des marins, des dockers et des marchands.",
      ],
      sections: [
        {
          heading: "Un couvent au bord du fleuve",
          kind: "history",
          paragraphs: [
            "C'était l'église des dominicains, un ordre de frères prêcheurs. Une église antérieure fut consacrée ici en 1276 par le célèbre savant Albert le Grand. À partir de 1517, l'église actuelle fut construite pour la remplacer, en ce XVIe siècle où le commerce anversois était florissant.",
            "L'Escaut n'était jamais loin. Le fleuve amenait les navires, les marchandises et les gens qui peuplaient ce quartier, et l'église desservait un quartier dont le rythme était dicté par les marées et le port.",
          ],
        },
        {
          heading: "Deux incendies",
          kind: "history",
          paragraphs: [
            "En 1679, un violent incendie détruisit une partie des voûtes de la nef et le sommet de la façade ouest. Lors des réparations de 1680–1681, l'église reçut son couronnement de tour baroque, celui que vous voyez aujourd'hui.",
            "Près de trois siècles plus tard, en avril 1968, le feu frappa de nouveau. Toute la toiture fut perdue, les voûtes et l'intérieur furent endommagés, le couronnement baroque de la tour brûla entièrement et les trois quarts du couvent attenant furent réduits à l'état de ruine. L'église fut restaurée ; ses trésors, dont des tableaux de Rubens, Van Dyck et Jordaens, sont toujours visibles à l'intérieur.",
          ],
        },
      ],
      didYouKnow: [
        "À côté de l'église, entre 1699 et 1747, les dominicains aménagèrent un jardin du Calvaire : un chemin bordé de dizaines de statues montant vers la croix, conçu comme une sorte de théâtre de pierre. C'est l'un des spectacles les plus surprenants de la ville.",
      ],
      transitionToNext:
        "Marchez jusqu'au fleuve. Au bord de l'eau se dresse le plus ancien bâtiment d'Anvers, dernier vestige du château où la ville est née.",
    },

    // ── 18 ───────────────────────────────────────────────────────────────
    "classics-het-steen": {
      name: "Het Steen",
      subtitle: "Le dernier fragment du château où Anvers est née",
      introduction: [
        "Devant vous se dresse Het Steen, « la Pierre » : un petit château avec tours et créneaux sur la rive de l'Escaut. On dirait une forteresse de conte de fées, mais ce que vous voyez n'est qu'un fragment d'un ensemble bien plus vaste : le burcht, le cœur fortifié à partir duquel Anvers s'est développée.",
      ],
      sections: [
        {
          heading: "Là où la ville est née",
          kind: "history",
          paragraphs: [
            "Vers l'an 850, une forteresse-refuge se dressait ici, protégée des raids vikings par un rempart de terre. À la fin du Xe siècle, le terrain fut surélevé et un fossé fut probablement creusé. Vers 1200–1225, le château de pierre, Het Steen, fut construit, ainsi qu'une muraille autour du burcht.",
            "À partir du début du XIVe siècle, le bâtiment servit de prison, un rôle qu'il conserva pendant plus de cinq siècles, jusqu'en 1823.",
          ],
        },
        {
          heading: "Le bourreau d'Anvers",
          kind: "history",
          paragraphs: [
            "En tant que prison de la ville, Het Steen faisait partie de la justice anversoise. Le schout, l'écoutète de la ville, engageait les poursuites ; les échevins jugeaient ; et le bourreau exécutait la sentence. Les suspects étaient interrogés ici, parfois sous la torture, dans une salle souterraine.",
            "Entre 1405 et 1550, le bourreau d'Anvers procéda à au moins 336 décapitations à l'épée, pour la plupart sur la Grote Markt, devant l'hôtel de ville. D'autres peines étaient exécutées sur le Meir, sur la rive de l'Escaut et au champ des gibets. Entre 1558 et 1562, plus de cinquante condamnés furent noyés, de préférence en secret, à l'intérieur même de Het Steen : les bûchers publics d'hérétiques avaient provoqué trop de troubles.",
            "Les bourreaux eux-mêmes ne s'en tiraient pas toujours bien. En 1508, un nouveau bourreau, ancien compagnon cordonnier, rata sa première décapitation, et des enfants le lapidèrent. Et le 17 janvier 1565, maître Geleyn, bourreau de la ville depuis 1542, fut lui-même décapité sur le Meir, condamné pour meurtre, vol et violences.",
          ],
        },
        {
          heading: "Charles Quint reconstruit",
          kind: "history",
          paragraphs: [
            "Vers 1520, l'empereur Charles Quint fit reconstruire Het Steen sur des plans de Domien de Waghemakere et de Rombout II Keldermans, les mêmes noms que vous avez rencontrés à la cathédrale. Du château plus ancien, seule la base subsista. En 1549, Charles Quint fit don du bâtiment à la ville.",
          ],
        },
        {
          heading: "Le jour où le château disparut",
          kind: "history",
          paragraphs: [
            "Pendant des siècles, Het Steen resta caché parmi les maisons et les rues de l'ancien burcht. Puis, dans les années 1880, les quais de l'Escaut furent rectifiés et reconstruits pour le port moderne. L'ancien quartier du burcht fut démoli ; la muraille du burcht le long du fleuve disparut en 1883. Seul Het Steen fut conservé et, en 1887–1890, il fut restauré et doté d'une nouvelle aile nord néogothique.",
            "En 1952, il devint le Musée national de la Marine. Après une rénovation entamée en 2018, il a rouvert en octobre 2021.",
          ],
        },
      ],
      didYouKnow: [
        "Ce que vous voyez comme « le château » n'est qu'une petite partie du burcht médiéval. L'essentiel fut démoli dans les années 1880 pour faire place aux quais.",
        "Het Steen servit de prison du début du XIVe siècle jusqu'en 1823 : plus de 500 ans.",
        "Peu de véritables instruments de torture ou d'exécution ont survécu : en 1794, les Français en brûlèrent la plupart.",
      ],
      lookAt: [
        {
          title: "Deux sortes de pierre",
          body: "Regardez la partie inférieure des murs. La base est en pierre de Tournai (Doornik), gris foncé : la seule partie qui subsiste du château plus ancien. Au-dessus s'élève le grès plus clair de la reconstruction de Charles Quint, au début du XVIe siècle. Vous avez littéralement deux époques superposées sous les yeux.",
        },
        {
          title: "La petite figure au-dessus de la porte",
          body: "Au-dessus de la porte d'entrée, cherchez une petite figure de pierre usée par le temps. Selon la tradition, elle représenterait Semini, un ancien dieu de la fertilité. D'après l'inventaire du patrimoine, elle fut mutilée vers 1587, semble-t-il par les jésuites, qui la jugeaient indécente. Elle a pourtant survécu, et elle est toujours là.",
        },
      ],
      transitionToNext:
        "Faites les derniers pas jusqu'à l'eau. Notre voyage à rebours dans le temps s'achève là où l'histoire d'Anvers a commencé.",
    },

    // ── 19 ───────────────────────────────────────────────────────────────
    "classics-scheldt": {
      name: "L'Escaut",
      subtitle: "Là où tout a commencé",
      introduction: [
        "Placez-vous au bord de l'eau et regardez le fleuve. L'Escaut est ici large, gris et agité, tiré par les marées de la mer du Nord. On pourrait le prendre pour la fin de la ville. En réalité, c'est la raison même de son existence.",
      ],
      sections: [
        {
          heading: "Tout ce que vous avez vu",
          kind: "interpretation",
          paragraphs: [
            "Repensez à la balade. Le château derrière vous fut construit pour garder ce fleuve. Le Vleeshuis, les maisons des guildes et la bourse furent payés par le commerce qu'il transportait. La tour de la cathédrale était la première chose que voyaient les marins. Les marchands de toute l'Europe venaient à la Handelsbeurs à cause des navires qui accostaient ici. Rubens peignait pour une ville enrichie par le fleuve. Même les diamants et la majestueuse gare appartiennent à une ville que le port a rendue puissante.",
            "Le fleuve apporta la richesse, mais aussi la guerre, les migrants, les idées et l'art. Il fit d'Anvers une ville internationale bien avant que le mot n'existe.",
          ],
        },
        {
          heading: "Un fleuve fermé puis rouvert",
          kind: "history",
          paragraphs: [
            "L'Escaut pouvait aussi être confisqué. Après la chute d'Anvers en 1585, la flotte de la République des Provinces-Unies bloqua le fleuve, et l'accès d'Anvers à la mer fut coupé pendant deux siècles. Ce n'est qu'en 1795 que la navigation fut officiellement rendue libre. Vers 1811, Napoléon fit creuser ici de nouveaux bassins et, en 1863, la Belgique racheta enfin l'ancien péage néerlandais sur l'Escaut.",
            "Dans les années 1880, les quais furent rectifiés pour le port moderne, le moment où Het Steen perdit son château. Et le fleuve impose toujours le respect : après la marée de tempête du 3 janvier 1976, lorsque l'eau monta à Anvers à plus de sept mètres, le plan Sigma fut lancé pour protéger tout le bassin de l'Escaut contre les inondations.",
          ],
        },
      ],
      didYouKnow: [
        "Pendant environ deux cents ans, du blocus après 1585 jusqu'en 1795, Anvers fut un grand port sans libre accès à la mer. C'est l'une des raisons pour lesquelles l'âge d'or de la ville prit fin.",
      ],
      galleries: {
        "siege-of-antwerp": {
          title: "Le siège d'Anvers, 1584–1585",
          intro: "La chute d'Anvers en 1585 survint après un siège de plus d'un an mené par Alexandre Farnèse, duc de Parme. Ces gravures montrent comment il ferma le fleuve, et comment la ville tenta de percer.",
        },
      },
      closing: {
        timeline: [
          "Antwerpen-Centraal : le XXe siècle commence",
          "La Stadsfeestzaal et la Boerentoren : une ville moderne et sûre d'elle",
          "La Handelsbeurs : une halle du XIXe siècle sur une idée du XVIe siècle",
          "Carolus Borromeus : Rubens et le baroque",
          "L'hôtel de ville et le Vleeshuis : la métropole marchande du XVIe siècle",
          "La cathédrale : l'Anvers médiéval",
          "Het Steen : le château où la ville est née",
          "L'Escaut",
        ],
        finalLines: [
          "Vous avez commencé cette balade dans une gare construite pour l'ère moderne. À chaque étape, vous avez remonté un peu plus le temps : du XXe siècle au XIXe, jusqu'à Rubens et au baroque, jusqu'aux marchands du XVIe siècle, jusqu'à la cathédrale médiévale et au vieux château.",
          "Et vous voici maintenant là où tout a commencé : au bord du fleuve.",
          "Vous n'avez pas seulement traversé Anvers. Vous avez remonté le cours de son histoire.",
        ],
      },
    },
  },

  images: {
    "central-station-1906": {
      caption: "Antwerpen-Centraal peu après son achèvement, sur une carte postale des environs de 1906.",
      alt: "Carte postale ancienne montrant la façade de pierre à dôme de la gare centrale d'Anvers, avec des passants sur la place",
      approximateYear: "vers 1906",
    },
    "central-station-hall-1909": {
      caption: "L'intérieur du bâtiment de la gare, sur une carte postale envoyée en 1909.",
      alt: "Carte postale ancienne d'une haute salle ornée, avec balcons et fenêtres cintrées, à l'intérieur de la gare",
      approximateYear: "1909",
    },
    "central-station-today": {
      caption: "La halle des voies aujourd'hui, avec l'horloge, le mot ANTWERPEN et les armoiries de la ville au-dessus de l'entrée.",
      alt: "Photo récente de la halle des voies en fer et en verre, devant la façade de pierre ornée du bâtiment de la gare",
      approximateYear: "2023",
    },
    // Clue of Spooky's task at the station: says where it was taken, not what to find.
    "central-station-hall-clue-today": {
      caption: "L'indice de Spooky : une photo prise dans la gare.",
      alt: "Photo d'un mur richement orné sous une verrière en fer, avec une horloge, des décorations dorées et un nom en lettres d'or",
      approximateYear: "2006",
    },
    "diamond-pelikaanstraat": {
      caption: "La Pelikaanstraat, en bordure de l'actuel quartier diamantaire, vers 1900.",
      alt: "Carte postale ancienne d'une rue pavée avec des boutiques, une charrette à cheval et une tour au loin",
      approximateYear: "vers 1900",
    },
    "keyserlei-1903": {
      caption: "De Keyserlei en 1903. Au bout de l'avenue, la flèche de la cathédrale montre déjà le chemin.",
      alt: "Carte postale ancienne d'une large avenue bordée d'arbres, avec des charrettes et de grands immeubles, et un clocher au loin",
      approximateYear: "1903",
    },
    "meir-1910": {
      caption: "Le Meir sur une carte postale envoyée en 1910, avec un tramway hippomobile.",
      alt: "Carte postale ancienne d'une place avec un tramway tiré par des chevaux et des devantures de magasins",
      approximateYear: "vers 1910",
    },
    "stadsfeestzaal-today": {
      caption: "L'entrée de la Stadsfeestzaal sur le Meir, reconstruite après l'incendie de 2000.",
      alt: "Photo récente d'une entrée de pierre ornée avec une niche dorée et le mot STADSFEESTZAAL",
      approximateYear: "2014",
    },
    "handelsbeurs-1890": {
      caption: "La salle de la bourse de Joseph Schadde vers 1890 : une cour gothique sous une toiture de fer et de verre.",
      alt: "Photographie ancienne d'une cour gothique entourée de galeries sous une grande verrière métallique",
      approximateYear: "vers 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "La même salle dans un dessin à la plume de Maxime Lalanne, réalisé avant 1886.",
      alt: "Dessin à la plume de la salle de la bourse avec des marchands debout dans la cour",
      approximateYear: "avant 1886",
    },
    "boerentoren-1930s": {
      caption: "La Boerentoren dominant ses voisins, sur une carte postale des années 1930.",
      alt: "Carte postale ancienne d'une haute tour Art déco au-dessus d'une place animée avec des tramways",
      approximateYear: "années 1930",
    },
    "groenplaats-1899": {
      caption: "La Groenplaats vers 1899, avec Rubens sur son piédestal et la cathédrale derrière les arbres.",
      alt: "Carte postale ancienne d'une place arborée avec une statue et la tour de la cathédrale à l'arrière-plan",
      approximateYear: "vers 1899",
    },
    "cathedral-hollar-1649": {
      caption: "La cathédrale dans une eau-forte de Wenceslaus Hollar, 1649. La tour sud était déjà inachevée.",
      alt: "Eau-forte détaillée de la façade de la cathédrale avec une haute flèche et une tour beaucoup plus courte",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "La flèche de la cathédrale au-dessus des toits, vers 1908.",
      alt: "Carte postale ancienne de la haute tour gothique de la cathédrale au-dessus d'une place",
      approximateYear: "vers 1908",
    },
    "grote-markt-1905": {
      caption: "La Grote Markt en 1905, avec la fontaine de Brabo à gauche et les maisons des guildes derrière.",
      alt: "Carte postale ancienne colorisée de la place avec la fontaine et les hautes maisons des guildes à pignons",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Des maisons des guildes sur la Grote Markt aujourd'hui, avec leurs figures dorées sur les pignons.",
      alt: "Photo récente de hautes maisons des guildes en pierre surmontées de statues dorées sur fond de ciel bleu",
      approximateYear: "2021",
    },
    "brabo-photochrom": {
      caption: "Brabo lance la main du géant : une impression en couleurs des années 1890.",
      alt: "Impression historique en couleurs de la statue de bronze de Brabo sur une fontaine en rochers, devant des maisons des guildes",
      approximateYear: "années 1890",
    },
    "stadhuis-1866": {
      caption: "L'hôtel de ville sur une photographie ancienne du milieu des années 1860, montée dans un album daté de 1867.",
      alt: "Photographie ancienne de la longue façade Renaissance de l'hôtel de ville",
      approximateYear: "1865–1867",
    },
    "conscienceplein-historical": {
      caption: "Le Hendrik Conscienceplein vers 1900, avec la bibliothèque derrière la statue de Conscience.",
      alt: "Carte postale ancienne d'un bâtiment imposant sur une place, avec une statue devant son entrée",
      approximateYear: "vers 1900",
    },
    "carolus-ceiling-punt-1748": {
      caption: "L'Adoration des mages, l'un des plafonds peints perdus de Rubens pour cette église, connu uniquement par des estampes comme cette gravure du XVIIIe siècle de Jan Punt d'après Jacob de Wit.",
      alt: "Gravure en noir et blanc des trois rois offrant leurs présents à la Vierge et à l'Enfant",
      approximateYear: "XVIIIe siècle",
    },
    "vleeshuis-1901": {
      caption: "« Vieille Boucherie » : le Vleeshuis et ses abords sur une carte postale envoyée vers 1901.",
      alt: "Carte postale ancienne d'un haut bâtiment de brique avec un passage voûté et des enfants dans la rue",
      approximateYear: "vers 1901",
    },
    "vleeshuis-wall-clue": {
      caption: "L'indice de Spooky : une ancienne photo d'un coin près du Vleeshuis.",
      alt: "Photo en noir et blanc d'un mur brut en pierres irrégulières contre un haut bâtiment en briques",
      approximateYear: "date inconnue",
    },
    "vleeshuis-postcard-kitchen": {
      caption: "Une salle aménagée en cuisine ancienne, avec un grand âtre, des chaudrons en cuivre et une pompe à eau ornée avec son bassin (carte postale du Museum Vleeshuis, date inconnue ; collection du MAS).",
      alt: "Carte postale sépia d'une salle avec une grande cheminée, des chaudrons en cuivre devant l'âtre, des murs carrelés, deux chaises et une pompe ornée avec un bassin en pierre",
      approximateYear: "date inconnue",
    },
    "vleeshuis-postcard-panelled-room": {
      caption: "Une pièce avec une cheminée, des armoires sculptées, des panneaux muraux décorés et une statue posée sur un meuble (carte postale du Museum Vleeshuis, date inconnue ; collection du MAS).",
      alt: "Carte postale sépia d'une pièce aux murs couverts de panneaux décorés, avec une cheminée, des armoires sculptées, une table et une statue",
      approximateYear: "date inconnue",
    },
    "vleeshuis-postcard-hall": {
      caption: "Une salle avec une longue table et des chaises, un lustre en verre, une horloge de parquet et une cheminée richement sculptée surmontée d'une figure assise (carte postale du Museum Vleeshuis, date inconnue ; collection du MAS).",
      alt: "Carte postale sépia d'une salle avec une longue table entourée de chaises, un lustre en verre, des vitraux, une horloge de parquet et une grande cheminée sculptée",
      approximateYear: "date inconnue",
    },
    "siege-parma-bridge": {
      caption: "Le pont de bateaux de Parme sur l'Escaut, achevé en février 1585 pour couper la ville de tout secours par l'eau ; Anvers se dessine à l'horizon. Estampe de Lamberecht Causé d'après Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Gravure d'un long pont construit sur des bateaux en travers d'un large fleuve, avec des soldats et des voitures dessus, des navires de guerre autour et la silhouette d'une ville au loin",
      approximateYear: "1670–1699",
    },
    "siege-bridge-attack": {
      caption: "Avril 1585 : Anvers lance des brûlots contre le pont. Selon le titre, Alexandre de Parme faillit lui-même y périr, mais le pont tint bon et l'attaque échoua. Estampe de Lamberecht Causé d'après Romeyn de Hooghe, 1670–1699 (Rijksmuseum).",
      alt: "Gravure d'une énorme explosion sur un pont de bateaux, avec des planches, des barques et des soldats projetés en l'air et de la fumée au-dessus du fleuve",
      approximateYear: "1670–1699",
    },
    "siege-map-luyken": {
      caption: "Tout le siège sur une carte de Jan Luyken (1680–1684) : Anvers en haut à gauche, le pont de bateaux au centre, les terres inondées et, à droite, les combats sur la digue de Kouwenstein en mai 1585, une nouvelle tentative de percée qui échoua (Rijksmuseum).",
      alt: "Carte gravée de l'Escaut en aval d'Anvers avec des forts, un pont en travers du fleuve, des champs inondés, des navires et des troupes combattant le long d'une digue",
      approximateYear: "1680–1684",
    },
    "sint-paulus-1901": {
      caption: "La Sint-Pauluskerk et les cafés qui l'entourent, sur une carte postale datée de 1901.",
      alt: "Carte postale ancienne d'une église gothique à tour baroque au-dessus de petites maisons et de cafés",
      approximateYear: "1901",
    },
    "steen-photochrom": {
      caption: "Het Steen et le port dans les années 1890, quelques années après la rectification des quais.",
      alt: "Impression historique en couleurs du petit château au bord du quai, avec des navires et des passants",
      approximateYear: "années 1890",
    },
    "steen-1920": {
      caption: "Une journée animée au Steen et au port, vers 1920.",
      alt: "Carte postale ancienne de foules, de charrettes et de navires à côté du château sur le quai",
      approximateYear: "vers 1920",
    },
    "steen-today": {
      caption: "Het Steen aujourd'hui.",
      alt: "Photo récente des tours du château sur fond de ciel bleu",
      approximateYear: "2015",
    },
    "scheldt-quays-1900": {
      caption: "Les quais de l'Escaut vers 1900, bordés de navires et de hangars.",
      alt: "Carte postale illustrée ancienne de bateaux à vapeur et de voiliers le long du quai",
      approximateYear: "vers 1900",
    },
    "diamond-bourse-today": {
      caption: "La Beurs voor Diamanthandel dans la Pelikaanstraat, l'une des bourses diamantaires du quartier et un monument classé.",
      alt: "Photo récente d'un haut immeuble de bureaux en pierre avec un bandeau sculpté portant son nom et des drapeaux au-dessus de l'entrée",
      approximateYear: "2010",
    },
    "flatow-expulsion-card-1941": {
      caption: "Fiche de 1941 de Siegfried Flatow, un Allemand né à Berlin en 1921, qui habitait Zurenborgstraat 17 à Anvers. Elle indique que le 1er février 1941 il fut éloigné de force à Beverloo, Leysestraat 25.",
      alt: "Formulaire jauni bilingue allemand-néerlandais rempli à la machine à écrire, avec une empreinte digitale dans la case du bas et un emplacement vide pour une photo",
      approximateYear: "1941",
    },
    "dossin-courtyard-1942": {
      caption: "La cour de la caserne Dossin à Malines, 1942 : des bagages éparpillés au sol, des camions et des groupes de personnes.",
      alt: "Photo en noir et blanc d'une cour de caserne fermée, avec des rangées de valises et de baluchons au sol, deux camions et des groupes de personnes sur les côtés",
      approximateYear: "1942",
    },
    "paleis-op-de-meir-today": {
      caption: "Le Paleis op de Meir aujourd'hui : le palais de marchand du XVIIIe siècle que Napoléon acheta.",
      alt: "Photo récente d'une façade de palais rococo de couleur claire, avec un balcon et un blason orné sur le toit",
      approximateYear: "2023",
    },
    "rex-ruins": {
      caption: "Le Cinema Rex en ruine après l'impact du V2 du 16 décembre 1944.",
      alt: "Photo sépia d'un cinéma bombardé aux murs effondrés et au toit en dôme mis à nu, avec une voiture des années 1940 devant",
      approximateYear: "1944–1947",
    },
    // The clue of Spooky's quest: shown before the place is found, so it must not name it.
    "paleis-op-de-meir-drawing": {
      caption: "L'indice de Spooky : un ancien dessin d'élévation d'une longue façade.",
      alt: "Ancien dessin d'une longue façade symétrique avec de hautes fenêtres, de petits balcons, des vases sur le toit et un grand blason orné au milieu",
      approximateYear: "date inconnue",
    },
    "rubens-self-portrait-1623": {
      caption: "Pierre Paul Rubens, autoportrait, 1623 (Royal Collection, Londres).",
      alt: "Portrait peint d'un homme barbu coiffé d'un large chapeau noir et vêtu d'un manteau sombre",
      approximateYear: "1623",
    },
    "rubenshuis-garden-today": {
      caption: "Le jardin de la maison de Rubens aujourd'hui, avec la maison et, à droite, le portique datant de l'époque de Rubens.",
      alt: "Photo récente d'un jardin avec une fontaine devant une maison Renaissance et un portail de pierre surmonté de statues",
      approximateYear: "2025",
    },
    "rubens-honeysuckle-bower": {
      caption: "Rubens et Isabella Brant sous la tonnelle de chèvrefeuille, vers 1609–1610 (Alte Pinakothek, Munich).",
      alt: "Tableau d'un jeune couple richement vêtu, assis main dans la main sous une tonnelle de chèvrefeuille",
      approximateYear: "vers 1609–1610",
    },
    "handelsbeurs-open-courtyard-1613": {
      caption: "La bourse de 1531 et sa cour à ciel ouvert, remplie de marchands : une gravure publiée en 1613.",
      alt: "Gravure en noir et blanc d'une cour rectangulaire entourée de galeries, avec de petits groupes de personnes et deux tours",
      approximateYear: "1613",
    },
    "groenkerkhof-1597": {
      caption: "Un cortège funèbre au cimetière de la cathédrale, l'actuelle Groenplaats : un tableau anonyme de 1597 (Museum Vleeshuis).",
      alt: "Tableau ancien de personnes en deuil vêtues de noir passant devant un cimetière, avec la haute tour de la cathédrale à l'arrière-plan",
      approximateYear: "1597",
    },
    "groenplaats-rubens-statue-1840s": {
      caption: "La cathédrale vue depuis la Groenplaats, avec la nouvelle statue de Rubens : une lithographie de Jules Alexandre Monthelier, années 1840.",
      alt: "Lithographie d'une statue de bronze sur un haut piédestal parmi les arbres, avec la cathédrale et sa flèche à l'arrière-plan",
      approximateYear: "années 1840",
    },
    "matsijs-portrait-1572": {
      caption: "Quinten Matsijs sur un portrait gravé publié à Anvers en 1572. Le vers latin en dessous raconte comment l'amour fit de lui un peintre.",
      alt: "Portrait gravé de profil d'un homme coiffé d'un bonnet et vêtu d'un manteau, tenant des papiers roulés, avec un vers latin en dessous",
      approximateYear: "1572",
    },
    "matsijs-altarpiece-1511": {
      caption: "Le retable de Quinten Matsijs pour la guilde des menuisiers, peint en 1508–1511 pour cette cathédrale (KMSKA, Anvers).",
      alt: "Triptyque peint avec une Lamentation sur le Christ mort au panneau central et deux volets latéraux",
      approximateYear: "1511",
    },
    "matsijs-well": {
      caption: "Le puits à côté de la cathédrale, photographié vers 1875–1900. Sa cage en fer forgé est traditionnellement attribuée à Matsijs.",
      alt: "Photographie ancienne d'une cage de puits ouvragée en fer forgé sur un socle de pierre, devant un mur gothique",
      approximateYear: "vers 1875–1900",
    },
    "nello-patrasche-today": {
      caption: "Nello et Patrasche de Batist Vermeulen (2016), endormis sous une couverture de pavés devant la cathédrale.",
      alt: "Photo récente d'une statue de marbre blanc représentant un garçon et un chien couchés sous une couverture de pavés, avec la tour de la cathédrale derrière",
      approximateYear: "2023",
    },
    "vlaeykensgang-today": {
      caption: "La Vlaeykensgang aujourd'hui : pavés, murs de brique et passage couvert.",
      alt: "Photo récente d'une ruelle pavée étroite entre des murs de brique, vue à travers un passage couvert bas",
      approximateYear: "2022",
    },
    "stadhuis-spanish-fury-hogenberg": {
      caption: "L'hôtel de ville en flammes pendant la Furie espagnole, avec des combats sur la Grote Markt : une eau-forte de Frans Hogenberg, réalisée avant 1585.",
      alt: "Eau-forte d'un grand hôtel de ville Renaissance d'où s'élèvent flammes et fumée, avec des soldats combattant sur la place devant",
      approximateYear: "avant 1585",
    },
    "handelsbeurs-vandennest": {
      caption: "Les galeries ornées de lustres, de draperies et de petits arbres, sur une estampe de J.B.J. Vandennest réalisée entre 1842 et 1851 : avant même que la cour reçoive son premier toit (Université d'Anvers, Collections spéciales).",
      alt: "Estampe de longues galeries voûtées aux colonnes sculptées, avec des lustres suspendus, des draperies et des rangées de petits arbres, et deux hommes en uniforme au premier plan",
      approximateYear: "1842–1851",
    },
    "handelsbeurs-lebrun-liedel": {
      caption: "La Bourse après sa reconstruction : colonnes sculptées, galeries voûtées et quelques marchands, sur une estampe de Lebrun-Liedel postérieure à 1872 (Université d'Anvers, Collections spéciales).",
      alt: "Estampe en noir et blanc d'une salle aux colonnes richement sculptées et aux voûtes en ogive, avec au premier plan un homme en haut-de-forme qui lit",
      approximateYear: "après 1872",
    },
    "spanish-fury-overview-1577": {
      caption: "La Furie espagnole sur une seule feuille : une estampe anonyme de 1577 avec au centre un plan d'Anvers et de sa citadelle, entouré de scènes de l'attaque, des combats et de l'hôtel de ville en flammes (Rijksmuseum).",
      alt: "Estampe avec au centre un plan à vol d'oiseau d'Anvers et de sa citadelle en étoile, entouré de petites scènes de soldats qui attaquent, combattent et pillent",
      approximateYear: "1577",
    },
    "spanish-fury-de-braekeleer": {
      caption: "La Furie espagnole à Anvers telle que Ferdinand de Braekeleer l'Ancien la peignit en 1836 : une image romantique du XIXe siècle montrant des bourgeois armés et des blessés dans la fumée et le feu, avec la tour de la cathédrale à l'arrière-plan (KMSKA, Anvers).",
      alt: "Tableau d'une foule de bourgeois armés, d'hommes blessés et d'une femme agenouillée près d'un mourant, avec de la fumée, du feu et une tour de cathédrale à l'arrière-plan",
      approximateYear: "1836",
    },
    "spanish-fury-mas": {
      caption: "Une rue pleine de victimes, avec des maisons en feu au loin : un tableau anonyme de la Furie espagnole, réalisé entre 1576 et vers 1585 (MAS, Anvers).",
      alt: "Tableau d'une rue bondée avec des soldats, des cavaliers et de nombreux morts, des maisons en feu et une fumée noire au loin, et un clocher à gauche",
      approximateYear: "1576–1585",
    },
    "spanish-fury-hogenberg-plunder": {
      caption: "Pillage et torture dans les maisons d'Anvers pendant la Furie espagnole, sur une estampe de Frans Hogenberg (XVIe siècle ; Rijksmuseum).",
      alt: "Gravure de soldats torturant des personnes suspendues à des cordes dans des maisons, avec des corps au sol et une rue bordée de maisons à pignons à l'arrière-plan",
      approximateYear: "XVIe siècle",
    },
    "spanish-fury-print-1618": {
      caption: "« Spaensche Furie tot Antwerpen » : une estampe d'environ 1618–1624 qui reprend la scène, avec un poème déplorant le sort de la ville (anonyme ; Rijksmuseum).",
      alt: "Gravure de la même scène de torture et de pillage, avec le titre « Spaensche Furie tot Antwerpen » et, en dessous, deux colonnes de vers en néerlandais",
      approximateYear: "vers 1618–1624",
    },
    "execution-hogenberg-1568": {
      caption: "Une exécution dans les Pays-Bas de l'époque : la décapitation des comtes d'Egmont et de Hornes sur la Grand-Place de Bruxelles en 1568, dans une eau-forte de Frans Hogenberg. Ce n'est pas Anvers, mais la même époque et la même justice.",
      alt: "Eau-forte d'un échafaud entouré de soldats armés de piques, avec un bourreau tenant une épée à côté d'un homme agenouillé",
      approximateYear: "1568–1570",
    },
    "scheldt-photochrom": {
      caption: "Anvers vue depuis le fleuve dans les années 1890 : Het Steen à gauche, la cathédrale dominant la ville.",
      alt: "Impression historique en couleurs de la silhouette d'Anvers vue de l'autre rive, avec des bateaux au premier plan",
      approximateYear: "années 1890",
    },
  },
};
