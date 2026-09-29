import type { PoortjesStopText } from "../types";

/**
 * Part 1: South side & Hoogstraat (gates 1–9). French text, translated from ../en/deel-1.ts.
 * Quotes from the (Dutch) sources are given in translation.
 */
export const deel1: Record<string, PoortjesStopText> = {
  // ── Gate 1 ────────────────────────────────────────────────────────────
  "poortjes-rosier": {
    name: "Rosier 24",
    subtitle: "Une porte de couvent avec un saint dans un médaillon",
    introduction: [
      "Vous vous trouvez devant la longue façade fermée d'un couvent. Ne cherchez pas d'abord le grand portail principal, mais une porte plus petite surmontée d'un médaillon ovale. C'est précisément une telle porte que Paul Smekens a dessinée ici vers 1950 : une porte simple dans un encadrement de pierre cintré, couronnée d'un buste dans un entourage ovale.",
      "C'est la première de cinquante portes. En 1951, Smekens publia un livre réunissant 52 relevés de vieilles portes anversoises : élévation, plan et échelle graphique, au centimètre près. Nous suivons ses traces quelque soixante-dix ans plus tard. Certaines portes sont toujours là, d'autres ont été déplacées, d'autres encore ont disparu.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Des carmélites vivent derrière cette façade depuis près de quatre siècles. L'ordre venait d'Espagne : en 1612, Anne de Saint-Barthélemy arriva à Anvers avec deux consœurs. En septembre 1615, les archiducs Albert et Isabelle posèrent la première pierre du nouveau couvent ; l'église fut construite entre 1636 et 1639.",
          "En 1783, le couvent fut supprimé et servit de caserne et de magasin à foin. En 1801, les sœurs purent revenir, et en 1843 elles récupérèrent aussi leur église. En 1951, Smekens écrivait simplement : « Au couvent des Thérésiennes espagnoles. Dans la niche, une statue de saint Joseph. » Par « Thérésiennes », il entend les carmélites, l'ordre réformé de Thérèse d'Avila.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "Selon l'inventaire flamand du patrimoine (Inventaris Onroerend Erfgoed), la façade avant possède un important portail baroque de 1653 : une porte en plein cintre dans un encadrement de pierre bleue avec clé de voûte, flanquée de pilastres. Dans les murs latéraux se trouvent en outre des portes en arc segmentaire ornées de bustes de saint Joseph (à droite) et de sainte Thérèse (à gauche), toutes deux de 1856.",
          "Le dessin de Smekens montre une telle porte : un encadrement en arc segmentaire à large bord mouluré, une corniche saillante et, au-dessus, le buste dans un médaillon ovale. En bas, le plan montre à quelle profondeur l'encadrement de pierre est pris dans le mur.",
        ],
      },
      {
        heading: "Renaissance ou baroque ?",
        kind: "context",
        paragraphs: [
          "En chemin, vous remarquerez que Smekens qualifie de nombreuses portes de « portes Renaissance », alors que l'inventaire actuel les date généralement du XVIIe siècle et les dit « baroques ». Ce n'est pas une contradiction à résoudre : ce sont deux manières de nommer les choses, l'une de 1951, l'autre de notre temps. Dans ce guide, nous donnons les deux, en précisant toujours qui dit quoi.",
          "Nous n'avons pas encore trouvé beaucoup d'informations fiables sur Paul Smekens lui-même. [Recherche historique nécessaire]",
        ],
      },
    ],
    glossary: ["spiegelboog", "pilaster", "sluitsteen", "hardsteen"],
    thenAndNow: [
      "Autrefois : Smekens dessina une porte avec un buste dans un médaillon ovale et parla d'une statue de saint Joseph.",
      "Aujourd'hui : comparez vous-même. Le buste est-il toujours là ? Voyez-vous aussi, de l'autre côté, la seconde porte avec sainte Thérèse que décrit l'inventaire ? Laquelle des deux portes est celle du livre ?",
    ],
    didYouKnow: [
      "Les bustes de saint Joseph et de sainte Thérèse sont plus récents que le couvent : l'inventaire les date de 1856, plus de deux siècles après l'église.",
    ],
    lookAt: [
      {
        title: "Le plan sous le dessin",
        body: "Regardez l'étroite bande sous la porte, sur le dessin : c'est une coupe du mur. Elle montre à quelle profondeur l'encadrement de pierre est pris dans la façade. Smekens en a dessiné une pour chaque porte, et vous reverrez ces petits plans bien des fois.",
      },
    ],
    transitionToNext: "Rendez-vous dans la Lange Gasthuisstraat. Au numéro 37, une porte à balcon vous attend, avec un détail qui, selon Smekens, n'a rien à y faire.",
  },

  // ── Gate 2 ────────────────────────────────────────────────────────────
  "poortjes-lange-gasthuisstraat": {
    name: "Lange Gasthuisstraat 37",
    subtitle: "La maison de ville d'une abbaye",
    introduction: [
      "Cherchez la large porte surmontée d'un petit balcon en fer forgé. Regardez d'abord l'encadrement de la porte elle-même : des blocs de pierre alternativement saillants et, en haut, une clé de voûte en forme de volute.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Pendant des siècles, ce bâtiment fut le « refuge » de l'abbaye norbertine de Tongerlo : sa maison de ville à Anvers, de 1535 à 1581 et de 1585 à 1699. Une abbaye de la campagne avait besoin d'une telle maison pour traiter ses affaires en ville, et comme abri sûr en période troublée.",
          "La maison eut quelques habitants notables : Philippe de Marnix, seigneur de Sainte-Aldegonde, y vécut en 1583–1584 en tant que l'un des bourgmestres de la ville, et plus tard le bourgmestre Willem Andreas de Caters (1802–1831). De 1699 à 1724, elle appartint au sculpteur Hendrik Frans Verbruggen, qui y fit faire d'importantes transformations. En 1941, l'architecte Max Winders conçut sa restauration et sa fusion avec la maison voisine pour en faire un immeuble de bureaux.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit une porte baroque en plein cintre du XVIIe siècle en pierre bleue, avec un ébrasement mouluré à double bossage, une clé de voûte à volute, des impostes moulurées et des socles. De larges volutes montent vers un larmier portant un balcon à la française en fer forgé. La porte en bois à deux battants présente des panneaux et un montant central sculpté.",
        ],
      },
      {
        heading: "Ce qui frappa Smekens",
        kind: "interpretation",
        paragraphs: [
          "Smekens parle d'une « porte Renaissance avec balcon » et fait une remarque acérée : « Le cartouche à la tête de femme sculptée de style Louis XV nous paraît apocryphe dans cette porte Renaissance. » Autrement dit, il pensait que la tête de femme relevait d'une époque et d'un style postérieurs à la porte elle-même. A-t-elle été ajoutée plus tard ? Nous ne le savons pas avec certitude.",
        ],
      },
    ],
    glossary: ["refugiehuis", "geblokt", "voluut", "makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Autrefois : Smekens dessina une porte avec un balcon et un cartouche à tête de femme.",
      "Aujourd'hui : cherchez la tête de femme. Est-elle toujours là ? Et jure-t-elle, comme le pensait Smekens, avec les blocs plus austères de la porte ?",
    ],
    didYouKnow: [
      "Philippe de Marnix de Sainte-Aldegonde, qui vécut ici, est souvent cité comme l'auteur possible du Wilhelmus, l'hymne national néerlandais. Cette paternité n'a cependant jamais été prouvée avec certitude.",
    ],
    lookAt: [
      {
        title: "Deux styles, une porte",
        body: "Comparez les blocs lourds et droits de l'encadrement avec le décor tout en courbes du sommet. Percevez-vous la différence de caractère dont parlait Smekens ?",
      },
    ],
    transitionToNext: "Rendez-vous dans l'Everdijstraat. Deux portes s'y trouvent tout près l'une de l'autre, et l'une d'elles appartenait à un homme surnommé « le bienfaiteur des pauvres ».",
  },

  // ── Gates 3 and 4 ─────────────────────────────────────────────────────
  "poortjes-everdijstraat": {
    name: "Everdijstraat 45 et 31",
    subtitle: "Deux portes, un bienfaiteur",
    introduction: [
      "Dans cette courte rue, deux portes du livre se trouvent à quelques dizaines de mètres l'une de l'autre. Commencez au numéro 45 : une maison à pignon à gradins avec une porte monumentale sur la droite. Continuez ensuite jusqu'au numéro 31, l'hôtel particulier « Hagelsteen ».",
    ],
    sections: [
      {
        heading: "Le numéro 45",
        kind: "history",
        paragraphs: [
          "La maison du numéro 45 remonte à la seconde moitié du XVIe siècle ; la porte fut ajoutée dans la seconde moitié du XVIIe siècle. L'inventaire décrit « un encadrement en pierre bleue mouluré et à bossages, avec clé de voûte, reposant sur des pilastres ioniques sculptés », surmonté d'un larmier à corniche sur un lourd rang de denticules et flanqué de larges volutes à enroulements ornées de guirlandes et de rosettes.",
          "Pour cette porte, Smekens écrit seulement « porte Renaissance ». On sait peu de choses avec certitude sur la fonction d'origine de cette porte en particulier.",
        ],
      },
      {
        heading: "Le numéro 31 : Hagelsteen",
        kind: "history",
        paragraphs: [
          "L'hôtel particulier Hagelsteen date de la fin du XVIe siècle. En 1621, la famille Van Eeden le vendit à Cornelis Lantschot (1572–1656), un riche marchand. Smekens l'appelle « le bienfaiteur des pauvres ». Selon l'inventaire, la porte est un portail baroque en pierre bleue de la seconde moitié du XVIIe siècle : un plein cintre à bossages avec une large clé de voûte à volute, sur des pilastres ioniques à fûts en retrait.",
          "La maison a beaucoup changé par la suite : un troisième étage fut ajouté en 1880, et vers 1925 la façade fut enduite de ciment. Derrière la façade se cache une cour du premier quart du XVIIe siècle avec une galerie à arcades sur colonnes toscanes.",
        ],
      },
    ],
    glossary: ["kapiteel", "waterlijst", "trapgevel"],
    thenAndNow: [
      "Autrefois : au numéro 31, Smekens dessina une « porte Renaissance avec encadrement ». Le livre ne mentionne aucune modification.",
      "Aujourd'hui : la façade du numéro 31 a été enduite vers 1925. Voyez si la porte du dessin se détache toujours aussi nettement de la façade qu'à l'époque, ou si la façade plus récente l'a comme absorbée.",
    ],
    didYouKnow: [
      "Vous retrouverez Cornelis Lantschot plus loin dans cette balade. Il fonda un hospice sur la Falconrui ; Smekens y dessina aussi un petit portail, disparu depuis.",
    ],
    lookAt: [
      {
        title: "Les chapiteaux ioniques",
        body: "Au sommet des pilastres qui encadrent la porte, cherchez les deux petites volutes. C'est la marque d'un chapiteau ionique. Les deux portes d'ici en ont.",
      },
    ],
    transitionToNext: "Au coin de la rue, dans la Groendalstraat, se dresse une maison où les boulangers faisaient la loi. Cherchez non pas un, mais deux petits portails.",
  },

  // ── Gate 5 ────────────────────────────────────────────────────────────
  "poortjes-groendalstraat": {
    name: "Groendalstraat 18-20",
    subtitle: "La maison des boulangers",
    introduction: [
      "Cherchez la maison basse au rez-de-chaussée frappant en pierre bleue. Elle possède deux petits portails, chacun surmonté d'une imposte en éventail. Smekens a dessiné l'un d'eux.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Le noyau de la maison Sint-Christoffel (Saint-Christophe) date de la période 1562–1592. En 1621, elle passa à la guilde des boulangers, la corporation du métier. Smekens écrit qu'elle était « la propriété du doyen des boulangers », le chef élu de la guilde.",
          "En 1672, les entrées reçurent leurs portails baroques. Smekens donne aussi cette année : « Date de 1672. »",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit « des portails baroques en pierre bleue avec imposte en éventail, dans des encadrements cintrés à bossages avec clés de voûte à volute ». Tout le rez-de-chaussée forme une devanture frappante en pierre bleue. L'étage est construit en brique et en grès par assises alternées : des bandes horizontales de grès clair dans la maçonnerie de brique rouge.",
        ],
      },
    ],
    glossary: ["waaier", "bovenlicht"],
    thenAndNow: [
      "Autrefois : Smekens dessina l'un des deux portails, avec son imposte et sa clé de voûte à volute.",
      "Aujourd'hui : il y en a deux. Lequel figure dans le livre ? Observez les détails de l'imposte et autour de la clé de voûte.",
    ],
    didYouKnow: [
      "Saint Christophe est le saint qui, selon la légende, porta l'Enfant Jésus pour lui faire traverser une rivière. De nombreuses maisons anversoises portaient un nom de ce genre au lieu d'un numéro ; les numéros ne sont apparus que bien plus tard.",
    ],
    transitionToNext: "Place maintenant à une marche plus longue vers l'ouest, en direction de l'Escaut, jusqu'à la Kloosterstraat. La maison que vous y verrez porte le nom d'un homme célèbre qui n'y a jamais habité.",
  },

  // ── Gate 6 ────────────────────────────────────────────────────────────
  "poortjes-kloosterstraat": {
    name: "Kloosterstraat 13",
    subtitle: "La maison qui reçut le mauvais nom",
    introduction: [
      "Devant vous s'étend une longue façade basse de huit fenêtres de large, en grès d'un jaune doux. Au milieu de la façade se trouve un robuste portail en pierre bleue. Derrière lui s'ouvre une cour entourée de quatre ailes.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "L'ensemble date de 1547–1555, comme en témoignent une pierre datée et des abouts de poutres. En 1619, son propriétaire Peter Paschier de Deckere y fit faire d'importantes transformations. En 1698, le marchand Norberto Schut fit ajouter par l'architecte Hendrik Frans Verbruggen une quatrième aile, baroque. Smekens y fait allusion : « la cour de l'hôtel De Deckere, datant de 1698 ».",
          "Aujourd'hui, la maison s'appelle Mercator-Orteliushuis. Smekens y voyait déjà une erreur en 1951 : « Appelée à tort : la maison d'Abraham Ortelius. » L'inventaire le confirme : le célèbre cartographe (1527–1598) habitait au numéro 43 de cette rue, une maison démolie en 1937.",
          "Le bâtiment tomba en ruine jusqu'à ce que la Vereniging van Historische Woonsteden (Société des demeures historiques) l'achète en 1943. Il fut classé en 1946, offert à la ville en 1950 et restauré en 1952–1953.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit la porte sur rue comme un « encadrement de porte baroque en pierre bleue du XVIIe siècle : un plein cintre à bossages inscrit dans un arc segmentaire mouluré, avec socles, impostes, clé de voûte sculptée et larmier ».",
        ],
      },
    ],
    glossary: ["neuten", "imposten", "rondboog"],
    thenAndNow: [
      "Autrefois : Smekens vit la porte alors que la maison était à l'abandon, juste avant ou pendant la restauration de 1952–1953.",
      "Aujourd'hui : regardez le grès jaune de la façade et le bleu sombre de la pierre bleue. Ce contraste rend aujourd'hui la porte facile à repérer.",
    ],
    didYouKnow: [
      "Une maison portant le nom d'une célébrité qui n'y a jamais vécu n'a rien d'une exception anversoise. Cela montre surtout combien une ville aime donner une adresse à ses grands noms.",
    ],
    transitionToNext: "Revenez vers le centre, jusqu'à la Hoogstraat, l'une des plus anciennes rues de la ville. Trois portes du livre s'y trouvent presque côte à côte.",
  },

  // ── Gates 7 and 8 (+ plate 3) ─────────────────────────────────────────
  "poortjes-hoogstraat": {
    name: "Hoogstraat 15-21",
    subtitle: "De vieux noms de maisons et une ruelle cachée",
    introduction: [
      "Vous êtes dans la Hoogstraat, parmi des pignons à gradins en grès. Sur ces quelques mètres, Smekens a dessiné trois portes : le numéro 15B (« De Wolsack », le sac de laine), le numéro 21 et, en bonus, le numéro 15. Regardez les rez-de-chaussée : la plupart sont aujourd'hui des boutiques, mais entre les vitrines subsistent d'anciens encadrements de portes.",
    ],
    sections: [
      {
        heading: "La rue",
        kind: "history",
        paragraphs: [
          "La Hoogstraat est mentionnée dès 1232 sous le nom d'« alta platea » et s'appelle Hoogstraat depuis 1305. Elle reliait le centre-ville au sud. En 1443, un incendie détruisit presque tous ses bâtiments. Au XVIe siècle, on y faisait le commerce du lin.",
        ],
      },
      {
        heading: "Des maisons qui portent un nom",
        kind: "history",
        paragraphs: [
          "À propos de De Wolsack, Smekens écrit : « Cette maison était déjà mentionnée en 1461. » L'inventaire décrit « Wolsack, Gulden Osch et Schilt van Mechelen » comme trois maisons profondes traditionnelles de la seconde moitié du XVIe siècle, larges ensemble de sept travées, avec une façade entièrement en grès et trois pignons à gradins. La porte est un portail en plein cintre dans un encadrement baroque en pierre bleue des environs de 1650.",
          "Attention : l'inventaire situe aujourd'hui ces maisons aux Hoogstraat 15A, 17 et 17A. Les numéros ont donc changé depuis 1951. Les noms des maisons se sont eux aussi déplacés : la maison de droite s'appelait « Lyntworm » en 1561, « Cleynen gulden Schilt » en 1579 et « Schilt van Mechelen » en 1638.",
        ],
      },
      {
        heading: "Le numéro 21 et la Vlaaikensgang",
        kind: "history",
        paragraphs: [
          "Smekens qualifie la porte du numéro 21 de « strictement classique, aux triglyphes fantaisistes ». Selon lui, elle donnait accès à « l'une des très anciennes parcelles de la Hoogstraat, appelée De Lintworm (le ténia) », avec « également une sortie le long de la Vlaaikensgang du Koornmarkt ».",
          "Nous n'avons trouvé aucune fiche d'inventaire distincte pour cette porte. Il reste à vérifier sur place si elle se trouve toujours au numéro 21 aujourd'hui. [À vérifier sur place]",
          "Selon Smekens, le numéro 15, « De grooten gulden scilt » (le grand écu d'or), était lui aussi relié à la Vlaaikensgang. L'inventaire confirme un lien historique entre la Vlaaikensgang et la maison du Hoogstraat 15 depuis 1561. Cette ruelle se trouve derrière ces maisons et a son entrée principale sur l'Oude Koornmarkt.",
        ],
      },
      {
        heading: "L'architecture du numéro 15",
        kind: "history",
        paragraphs: [
          "Selon l'inventaire, la porte du « Grooten gulden Schilt » (Hoogstraat 15) est un portail en anse de panier dans un encadrement baroque en pierre bleue des environs de 1650, avec un ébrasement à bossages dans un arc à épaulements orné de cuirs découpés, des volutes et, en guise de clé de voûte, un cartouche sculpté portant des armoiries vierges. La porte en bois montre des reliefs de la Vierge Marie, de saint Jean l'Évangéliste, de sainte Élisabeth de Hongrie et d'un mendiant.",
        ],
      },
    ],
    glossary: ["triglief", "korfboog", "schouderboog", "cartouche", "diephuis"],
    thenAndNow: [
      "Autrefois : en 1951, ces maisons portaient d'autres numéros qu'aujourd'hui. Le « 15B » de Smekens n'est pas le 15B actuel.",
      "Aujourd'hui : comparez les trois dessins avec les façades. Quelle porte retrouvez-vous, et sous quel numéro se trouve-t-elle aujourd'hui ?",
    ],
    didYouKnow: [
      "« Le ténia » semble un drôle de nom pour une maison, mais les noms de maisons anversois pouvaient être à peu près n'importe quoi : des animaux, des objets, des saints, des villes. Ils figuraient souvent sur une enseigne ou une pierre de façade, bien avant l'apparition des numéros.",
    ],
    lookAt: [
      {
        title: "La porte du numéro 15",
        body: "Cherchez la porte en bois aux figures sculptées. Repérez-vous un personnage qui demande l'aumône ? Selon l'inventaire, c'est un mendiant à côté de sainte Élisabeth de Hongrie.",
      },
    ],
    transitionToNext: "Rendez-vous sur la Suikerrui, la large rue qui mène à l'Escaut. Cherchez un bélier doré.",
  },

  // ── Gate 9 ────────────────────────────────────────────────────────────
  "poortjes-suikerrui": {
    name: "Suikerrui 22",
    subtitle: "De Gouden Ram (Le Bélier d'or)",
    introduction: [
      "Sur la Suikerrui, cherchez la porte dont la clé de voûte est un bélier doré. Regardez ensuite le reste de l'encadrement : des rosettes sur les pilastres et autour de l'arc.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "De Gouden Ram est un hôtel particulier du XVIIe siècle. En 1823, le pharmacien néerlandais Klaas Jan Cupérus (1769–1851) y ouvrit une droguerie et un commerce de thé. L'entreprise familiale Cupérus devint un négociant en thé réputé et participa aux expositions universelles de 1885, 1894 et 1930. En 1926, la boutique déménagea au Schoenmarkt.",
          "À l'intérieur, la maison conserve une salle japonaise aux panneaux de laque de l'époque d'Edo, ornés de dragons, de coqs, d'oiseaux, de poissons et de papillons. La salle n'est pas ouverte aux visiteurs.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit un portail baroque en plein cintre en pierre bleue, probablement du XVIIe siècle : « L'ébrasement mouluré et à bossages, avec socles, crossettes et impostes appareillées, est rehaussé de rosettes et d'un cartouche portant un bélier doré en guise de clé de voûte. » Smekens le résume ainsi : « Avec un bélier sur un cartouche et des roses sur les pilastres et les arcs. »",
        ],
      },
    ],
    glossary: ["rondboog", "neuten"],
    thenAndNow: [
      "Autrefois : Smekens dessina le bélier en noir et blanc, comme partie intégrante de la pierre.",
      "Aujourd'hui : le bélier est doré et attire immédiatement le regard. Comptez les rosettes : y en a-t-il autant que sur le dessin ?",
    ],
    didYouKnow: [
      "Le nom « De Gouden Ram » survit aujourd'hui dans le commerce installé dans le bâtiment ; la maison de thé Cupérus elle-même a déménagé au Schoenmarkt dès 1926.",
    ],
    transitionToNext: "Fin de la première partie. Rejoignez la Grote Markt : c'est l'heure d'une pause au cœur de la ville.",
  },
};
