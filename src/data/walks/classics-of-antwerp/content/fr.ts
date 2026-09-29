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
      "Une balade commentée de la majestueuse gare jusqu'aux rives de l'Escaut : dix-huit étapes, huit siècles et les histoires cachées derrière les lieux les plus célèbres d'Anvers.",
    description:
      "Partez de la majestueuse gare d'Anvers et traversez des siècles de commerce, d'art, de religion et de pouvoir, pour finir là où l'histoire de la ville a commencé : sur les rives de l'Escaut.\n\nÀ chaque étape, votre téléphone devient votre guide : ce que vous avez sous les yeux, pourquoi on l'a construit, ce qui s'est passé ici, et les détails devant lesquels la plupart des visiteurs passent sans les voir. Des photographies anciennes vous montrent la ville telle qu'elle était il y a un siècle et plus. Pas de jeux ni de questions : seulement Anvers, et le temps de la regarder vraiment.",
    highlights: [
      "18 des lieux historiques les plus importants d'Anvers",
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
        {
          heading: "Un palais sur le Meir",
          kind: "history",
          paragraphs: [
            "Continuez sur le Meir et repérez une longue et élégante façade du XVIIIe siècle : le Paleis op de Meir. Il fut construit à partir de 1745 pour un riche marchand, Johan Alexander van Susteren, par l'architecte anversois Jan Pieter van Baurscheit le Jeune. Il passa ensuite entre des mains remarquables : Napoléon l'acheta en 1811–1812 sans jamais y habiter, le tsar Alexandre Ier de Russie y séjourna en 1814, et il servit longtemps de palais royal.",
            "Juste à côté du Meir, sur le Wapper, se trouve la maison où Pierre Paul Rubens vécut et travailla. Vous croiserez Rubens plusieurs fois encore au cours de cette balade.",
          ],
        },
      ],
      didYouKnow: [
        "Le Cinema Rex fut reconstruit après la guerre et rouvrit en 1947. Il ferma définitivement en 1993 et fut démoli deux ans plus tard. Aujourd'hui, presque rien dans la rue ne rappelle aux passants ce qui s'est passé ici.",
        "Napoléon possédait le palais du Meir, mais lorsqu'il fut prêt à l'accueillir, il était déjà en exil sur l'île d'Elbe.",
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
        "Quittez un instant le Meir et engagez-vous dans les ruelles qui se trouvent derrière. Caché derrière des façades ordinaires se dresse le bâtiment où Anvers apprit jadis au monde à commercer.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "La Handelsbeurs",
      subtitle: "Là où le monde venait faire des affaires",
      introduction: [
        "Devant vous se trouve la Handelsbeurs, l'ancienne bourse de commerce d'Anvers. Depuis la rue, elle se fait discrète. À l'intérieur se cache l'une des salles les plus extraordinaires de la ville : une cour gothique entourée de galeries, coiffée d'une vertigineuse toiture de fer et de verre.",
        "Nous voici revenus au XVIe siècle, lorsqu'Anvers comptait parmi les villes les plus riches d'Europe.",
      ],
      sections: [
        {
          heading: "Commercer sans téléphone",
          kind: "history",
          paragraphs: [
            "Imaginez Anvers vers 1530. Des navires venus du Portugal arrivent chargés d'épices d'Asie ; des marchands d'Italie, d'Allemagne, d'Angleterre et d'Espagne vivent en ville. Ils doivent connaître les prix, trouver des acheteurs, emprunter de l'argent, assurer leurs cargaisons, et il n'y a ni téléphone, ni journaux tels que nous les connaissons, ni internet. L'information circule par lettre et, surtout, de bouche à oreille.",
            "Anvers construisit donc un lieu où tous ces marchands pouvaient se retrouver chaque jour. En 1531, la ville ouvrit une bourse conçue par Domien de Waghemakere, dans le style gothique tardif brabançon : une cour à ciel ouvert entourée d'une galerie couverte aux voûtes en étoile richement travaillées. Ce fut l'un des tout premiers bâtiments au monde construits spécialement à cet effet. Ici, dans une babel de langues, on fixait les prix et on concluait les marchés.",
          ],
        },
        {
          heading: "Le feu, encore le feu",
          kind: "history",
          paragraphs: [
            "Le bâtiment que vous voyez n'est pas simplement celui de 1531. La bourse fut reconstruite en 1583 et brûla en 1858. L'architecte Joseph Schadde conçut alors le bâtiment actuel ; la commande lui fut finalement confiée en 1868, et la nouvelle bourse fut solennellement inaugurée le 19 octobre 1872. Il conserva l'idée de la cour gothique mais la couvrit d'une spectaculaire toiture de fer et de verre, et des vestiges de l'ancienne bourse furent intégrés à l'ensemble.",
            "À la fin du XXe siècle, les échanges s'étaient déplacés ailleurs, et le bâtiment resta vide pendant une vingtaine d'années. Après une restauration en profondeur, il a rouvert en 2019, désormais comme lieu d'événements.",
          ],
        },
      ],
      didYouKnow: [
        "La bourse d'Anvers servit de modèle à l'étranger. Lorsque Thomas Gresham, agent de la Couronne anglaise à Anvers, fonda le Royal Exchange de Londres dans les années 1560, il prit la bourse anversoise pour exemple.",
        "Le mot « bourse » lui-même ne viendrait pas d'Anvers mais de Bruges, où les marchands se réunissaient devant la maison de la famille Van der Beurse.",
      ],
      transitionToNext:
        "De retour sur le Meir, levez les yeux. Une tour s'élève au-dessus des toits, comme un morceau de New York tombé dans une ville médiévale. Nous faisons un bref saut en avant dans le temps, avant que notre voyage dans le passé ne commence vraiment.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
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

    // ── 7 ────────────────────────────────────────────────────────────────
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
          ],
        },
        {
          heading: "Rubens prend sa place",
          kind: "history",
          paragraphs: [
            "En 1840, Anvers commémora les 200 ans de la mort de Rubens. Une statue fut dessinée par Willem Geefs, mais l'argent manquait et le bronze ne fut pas prêt à temps : le 25 août 1840, c'est une version provisoire en plâtre qui fut dévoilée, sur une autre place. Ce n'est que les 9 et 10 août 1843 que le Rubens de bronze prit sa place ici, au milieu de la Groenplaats.",
          ],
        },
      ],
      didYouKnow: [
        "Quand vous vous asseyez à une terrasse ici, vous êtes assis sur ce qui fut, pendant des siècles, le lieu de sépulture de la cathédrale.",
      ],
      transitionToNext:
        "Dirigez-vous vers la cathédrale. En chemin, observez la rangée de maisons adossées au chœur de l'église. Elles cachent les fondations d'une cathédrale qui ne fut jamais achevée.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Onze-Lieve-Vrouwekathedraal",
      subtitle: "La cathédrale qu'Anvers voulut rendre plus grande encore",
      introduction: [
        "Devant vous se dresse l'Onze-Lieve-Vrouwekathedraal, la cathédrale Notre-Dame, l'une des plus grandes églises gothiques des anciens Pays-Bas et, pendant des siècles, le premier repère qu'apercevaient les marins sur l'Escaut. Sa tour nord, haute d'environ 123 mètres, domine toujours l'horizon.",
        "Nous voici à la fin du Moyen Âge. La cathédrale fut construite en quelque 170 ans, du milieu du XIVe siècle jusqu'en 1521, par des générations de bâtisseurs qui savaient qu'ils ne la verraient jamais achevée.",
      ],
      sections: [
        {
          heading: "Plus grande encore : le Nieuwerck",
          kind: "history",
          paragraphs: [
            "En 1521, au moment même où l'église était achevée, Anvers décida qu'elle n'était pas assez grande. La ville la plus riche d'Europe du Nord voulait une église à sa mesure, et un gigantesque agrandissement du chœur, le Nieuwerck, fut dessiné par Domien de Waghemakere et Rombout Keldermans.",
            "Le 15 juillet 1521, le jeune empereur Charles Quint posa lui-même la première pierre. Puis la catastrophe survint. Un grand incendie en 1533 endommagea gravement l'église, tout l'argent passa dans la réparation du bâtiment existant, les travaux du Nieuwerck s'arrêtèrent et, en 1537, le projet fut abandonné pour de bon.",
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
      lookAt: [
        {
          title: "Une tour et demie",
          body: "Regardez la façade de la cathédrale. La tour de gauche (nord) s'élève jusqu'à sa flèche élégante ; celle de droite (sud) s'arrête à environ un tiers de cette hauteur. Le projet prévoyait deux grandes tours, mais une seule fut jamais achevée. Regardez l'eau-forte de 1649 sur cette page : la silhouette asymétrique était déjà la même à l'époque.",
        },
      ],
      transitionToNext:
        "Contournez la cathédrale jusqu'à l'Oude Koornmarkt. Cherchez bien une entrée étroite entre les maisons : elle mène à une ruelle cachée que le temps semble avoir oubliée.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Un passage secret vers le vieil Anvers",
      introduction: [
        "Franchissez l'étroite entrée et le bruit de la ville s'évanouit. Vous êtes dans la Vlaeykensgang, une ruelle sinueuse entre de vieux murs de brique, de petites cours et de modestes maisons. L'espace d'un instant, on imagine sans peine l'Anvers d'il y a plusieurs siècles.",
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

    // ── 10 ───────────────────────────────────────────────────────────────
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

    // ── 11 ───────────────────────────────────────────────────────────────
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

    // ── 12 ───────────────────────────────────────────────────────────────
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
        {
          heading: "La Furie espagnole, 4 novembre 1576",
          kind: "history",
          paragraphs: [
            "À peine dix ans plus tard, ce bâtiment fut témoin d'une catastrophe. Les Pays-Bas s'étaient révoltés contre le roi d'Espagne, et ses soldats dans la région n'avaient pas été payés depuis longtemps. Le 4 novembre 1576, des troupes espagnoles mutinées prirent Anvers d'assaut et commencèrent à la piller.",
            "Le magistrat de la ville organisa une contre-attaque depuis cet hôtel de ville, ici sur la Grote Markt. Les soldats mirent le feu au bâtiment. Les flammes gagnèrent les maisons voisines, dont des centaines furent réduites en cendres. De l'hôtel de ville, seuls les murs extérieurs restèrent debout.",
            "On ne sait pas précisément combien de personnes périrent. Les estimations vont de plusieurs centaines à environ 8 000 ; de nombreux historiens pensent que plus de 7 000 personnes y laissèrent la vie. L'événement est resté dans l'histoire sous le nom de Furie espagnole, et il ébranla la confiance de celle qui avait été la grande ville marchande de l'Europe.",
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
      transitionToNext:
        "Quittez la Grote Markt et marchez vers l'est, par des rues tranquilles, jusqu'à une petite place que de nombreux visiteurs considèrent comme la plus belle d'Anvers.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
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

    // ── 14 ───────────────────────────────────────────────────────────────
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

    // ── 15 ───────────────────────────────────────────────────────────────
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
      transitionToNext:
        "Continuez quelques rues vers le nord, dans l'ancien quartier du port. Ici se dresse une église dont l'histoire est liée au fleuve, et au feu.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
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

    // ── 17 ───────────────────────────────────────────────────────────────
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

    // ── 18 ───────────────────────────────────────────────────────────────
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
    "scheldt-photochrom": {
      caption: "Anvers vue depuis le fleuve dans les années 1890 : Het Steen à gauche, la cathédrale dominant la ville.",
      alt: "Impression historique en couleurs de la silhouette d'Anvers vue de l'autre rive, avec des bateaux au premier plan",
      approximateYear: "années 1890",
    },
  },
};
