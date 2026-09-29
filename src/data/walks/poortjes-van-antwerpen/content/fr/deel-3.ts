import type { PoortjesStopText } from "../types";

/** Part 3: Handelsbeurs, University & Academy (gates 24–41). French text, translated from ../en/deel-3.ts. */
export const deel3: Record<string, PoortjesStopText> = {
  // ── Handelsbeurs ─────────────────────────────────────────────────────
  "poortjes-handelsbeurs": {
    name: "La Handelsbeurs",
    subtitle: "Là où le monde venait faire des affaires",
    introduction: [
      "De l'extérieur, la Handelsbeurs (l'ancienne bourse de commerce) se remarque à peine. À l'intérieur se cache l'un des espaces les plus remarquables de la ville : une cour gothique entourée de galeries, coiffée d'une vertigineuse toiture de fer et de verre.",
      "Sur l'Oude Beurs, vous avez vu où se trouvait la première bourse. Ici se dresse celle qui lui succéda.",
    ],
    sections: [
      {
        heading: "Pourquoi Anvers avait besoin d'une bourse",
        kind: "history",
        paragraphs: [
          "Vers 1530, Anvers était l'une des villes les plus riches d'Europe. Des navires venus du Portugal apportaient les épices d'Asie ; des marchands d'Italie, d'Allemagne, d'Angleterre et d'Espagne vivaient en ville. Ils devaient connaître les prix, trouver des acheteurs, emprunter de l'argent et assurer leurs cargaisons. Il n'y avait ni téléphone ni journaux tels que nous les connaissons : l'information circulait par lettre et surtout de bouche à oreille.",
          "L'ancienne bourse devint trop petite : vers 1526–1527, les marchands réclamèrent davantage d'espace. En 1531, la ville ouvrit ici une nouvelle bourse, conçue par Domien de Waghemakere dans le style gothique tardif brabançon : une cour à ciel ouvert avec une galerie couverte et de riches voûtes en étoile. Ce fut l'un des tout premiers bâtiments construits spécialement à cet effet.",
        ],
      },
      {
        heading: "Le feu, encore le feu",
        kind: "history",
        paragraphs: [
          "Ce que vous voyez n'est pas simplement le bâtiment de 1531. La bourse fut reconstruite en 1583 et brûla en 1858. L'architecte Joseph Schadde conçut le bâtiment actuel ; la commande lui fut finalement confiée en 1868, et la nouvelle bourse fut solennellement inaugurée le 19 octobre 1872. Il conserva l'idée de la cour gothique mais la couvrit d'une spectaculaire toiture de fer et de verre.",
          "À la fin du XXe siècle, les échanges s'étaient déplacés ailleurs et le bâtiment resta vide pendant une vingtaine d'années. Après une restauration en profondeur, il a rouvert en 2019, désormais comme lieu d'événements.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Jeter un œil à l'intérieur",
        paragraphs: [
          "Selon la Handelsbeurs elle-même, la salle des marchés est ouverte au public les week-ends et pendant les vacances scolaires, de 10 h à 18 h, sauf lors d'événements. Entrées par la Twaalfmaandenstraat (depuis le Meir) et la Borzestraat (depuis la Lange Nieuwstraat).",
          "Le site web ne précise pas si la visite est gratuite. Vérifiez les informations actuelles et la liste des jours de fermeture avant d'y aller.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://handelsbeursantwerpen.be/en/bezoek-de-handelsbeurs/",
      },
    ],
    didYouKnow: [
      "La bourse d'Anvers servit de modèle à l'étranger. Lorsque Thomas Gresham, agent de la Couronne anglaise à Anvers, fonda le Royal Exchange de Londres dans les années 1560, il prit la bourse anversoise pour exemple.",
      "L'Académie des beaux-arts, que nous visiterons plus tard, fut d'abord installée dans « la Bourse sur le Meir », et des fragments de la bourse du XVIe siècle se trouvent dans le jardin de l'Académie.",
    ],
    transitionToNext: "Rendez-vous dans la Lange Nieuwstraat. La maison que vous cherchez porte le nom d'une ville italienne, et sa porte vient d'ailleurs.",
  },

  // ── Gate 25 (+ vanished 24) ──────────────────────────────────────────
  "poortjes-lange-nieuwstraat": {
    name: "Lange Nieuwstraat 45",
    subtitle: "Bolonia la Grassa, et une porte qui a déménagé",
    introduction: [
      "Cherchez la maison de marchand au haut pignon à gradins de quatorze marches. Regardez ensuite la porte : une porte en plein cintre dans un encadrement baroque en pierre bleue, avec un cartouche portant une année.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Depuis la fin du XVIe siècle, cette maison de marchand traditionnelle de la seconde moitié de ce même siècle s'appelle « Bolonia la Grassa », d'après la ville italienne de Bologne. Des nobles espagnols et italiens y séjournèrent. Au XVIIe siècle, le peintre Abraham van Diepenbeeck y vécut ; sa famille posséda la maison jusqu'au XVIIIe siècle. De 1828 à 1849, la veuve Helena Van Celst-Kums y tint une école de filles et un orphelinat.",
        ],
      },
      {
        heading: "Une porte qui a déménagé",
        kind: "history",
        paragraphs: [
          "La porte n'appartenait pas à l'origine à cette maison. Smekens : « Provient d'un bâtiment démoli de la Twaalfmaandenstraat. » L'inventaire le confirme et ajoute des détails : la porte est « datée de 1665 dans un cartouche » et, en 1926, elle remplaça une transformation de la façade datant du XIXe siècle.",
          "La Twaalfmaandenstraat est la rue qui longe la Handelsbeurs, d'où vous venez.",
        ],
      },
    ],
    glossary: ["cartouche", "trapgevel"],
    thenAndNow: [
      "Autrefois : en 1951, la porte n'était là que depuis 25 ans.",
      "Aujourd'hui : cherchez l'année 1665 dans le cartouche. En 2014–2017, la maison a été réunie à la maison voisine Sint-Franciscus et transformée en appartements.",
    ],
    didYouKnow: [
      "Dans la même rue, au numéro 36, Smekens dessina une autre porte, de style Régence, appartenant au grand hôtel particulier « De Keyser ». Elle a disparu.",
    ],
    transitionToNext: "Continuez jusqu'à la Sint-Jacobskerk, l'église où Rubens est enterré.",
  },

  // ── St James ─────────────────────────────────────────────────────────
  "poortjes-sint-jacob": {
    name: "Sint-Jacobskerk (église Saint-Jacques)",
    subtitle: "L'église des pèlerins, et de Rubens",
    introduction: [
      "Devant vous se dressent une massive tour ouest qui ne fut jamais achevée et une longue église sobre de style gothique brabançon. L'extérieur est modeste. L'intérieur compte parmi les plus riches de la ville.",
    ],
    sections: [
      {
        heading: "De l'hospice des pèlerins à l'église paroissiale",
        kind: "history",
        paragraphs: [
          "À cet endroit se trouvait un hospice pour les pèlerins en route vers Saint-Jacques-de-Compostelle (1404–1413). En 1478, sa chapelle devint église paroissiale. L'église actuelle fut construite en trois phases : à partir de 1491 avec la tour, jusqu'à l'arrêt des travaux faute d'argent ; de 1552 à 1566 avec la nef et le transept ; et de 1602 à 1656 avec le chœur et les chapelles qui l'entourent.",
          "Des maîtres d'œuvre renommés travaillèrent à l'église : Herman de Waghemakere, son fils Domien, le frère de Domien, Herman, et à partir de 1525 Rombout Keldermans. Vous avez déjà rencontré Domien de Waghemakere à l'Oude Beurs, à la Handelsbeurs et à la cathédrale.",
        ],
      },
      {
        heading: "Gothique tardif, dehors et dedans",
        kind: "history",
        paragraphs: [
          "L'inventaire présente l'église comme un exemple de gothique brabançon, avec une lourde tour ouest caractéristique, une architecture extérieure sobre et, à l'intérieur, un triforium avec coursive. La tour inachevée compte cinq niveaux et est « soutenue par quatre lourds contreforts d'angle ».",
          "À l'intérieur, le tableau est tout autre : des dizaines de chapelles de familles aisées, des autels baroques, du marbre et des monuments funéraires. En 1705, le pape Clément XI donna à l'église le titre d'« illustre collégiale ».",
        ],
      },
      {
        heading: "Rubens",
        kind: "history",
        paragraphs: [
          "Pierre Paul Rubens mourut en 1640 et fut enterré dans cette église. Sa chapelle funéraire fut aménagée en 1642. Au-dessus de l'autel est accroché un tableau de Rubens lui-même, « La Vierge et des saints », que l'inventaire date de 1634.",
          "En mai 2026, la ville annonça la fin d'une restauration de sept ans. Selon le communiqué de presse, le retable, l'autel, l'épitaphe et les monuments funéraires de la chapelle de Rubens ont eux aussi été restaurés et peuvent de nouveau être visités.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Jeter un œil à l'intérieur",
        paragraphs: [
          "Selon la Ville d'Anvers (communiqué de presse du 13 mai 2026), l'église peut être « visitée gratuitement tous les jours entre 14 h et 17 h ». Certaines sources plus anciennes indiquent encore que la chapelle funéraire est fermée jusqu'en 2028 ; selon le communiqué, elle est de nouveau accessible. L'église peut être fermée pendant les offices et les funérailles. Des restaurations de moindre ampleur se poursuivent jusqu'en 2028.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://pers.antwerpen.be/sint-jacobskerk-opnieuw-volledig-toegankelijk-na-7-jaar-restauratie",
      },
    ],
    didYouKnow: [
      "Lors de la restauration, 426 650 ardoises neuves ont été posées sur le toit et 1 738 m² de vitraux ont été réparés.",
    ],
    lookAt: [
      {
        title: "La tour inachevée",
        body: "Levez les yeux vers la tour ouest. Sa construction commença en 1491 et s'arrêta faute d'argent ; la tour ne reçut jamais la flèche que vous avez vue à la cathédrale.",
      },
    ],
    transitionToNext: "Rendez-vous dans la Keizerstraat, la rue des bourgmestres et des peintres.",
  },

  // ── Gate 26 + Snijders&Rockox House (+ vanished 32) ──────────────────
  "poortjes-keizerstraat": {
    name: "Keizerstraat 10-16",
    subtitle: "Un bourgmestre, un peintre et un portail couvert de rocailles",
    introduction: [
      "Vous êtes dans une rue tranquille bordée de demeures cossues. Au numéro 16, cherchez un petit portail au décor fantaisiste en forme de coquillages. Quelques maisons plus loin, au numéro 10–12, se trouve la Snijders&Rockox Huis.",
    ],
    sections: [
      {
        heading: "Le numéro 16 : le portail",
        kind: "history",
        paragraphs: [
          "Le bâtiment se compose de deux maisons du XVIe siècle réunies. La maison de droite possède un pignon à volutes de style gothique tardif de la première moitié du XVIe siècle, celle de gauche un pignon à gradins de la seconde moitié. Selon l'inventaire, dans l'axe central se trouve un portail du troisième quart du XVIIIe siècle : un « plein cintre à impostes, inscrit dans un champ en arc segmentaire, orné de rocailles », avec une porte en bois, une imposte en fer forgé et un décrottoir en fonte.",
          "Smekens appelle la maison « De zwarte arend » (l'aigle noir) ; l'inventaire l'appelle aujourd'hui « De witte Lelie » (le lys blanc). En 1830, le baron Philippe Antoine Joseph de Pret de ter Veken fit transformer les façades par l'architecte Franciscus De Wolf. C'est un hôtel depuis 1992–1993.",
        ],
      },
    ],
    cards: [
      {
        id: "card-rockox",
        title: "La Snijders&Rockox Huis",
        subtitle: "Étape musée possible : Keizerstraat 10-12",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Nicolaas Rockox (1560–1640) fut bourgmestre d'Anvers et un grand amateur d'art. En 1603, il acheta deux maisons contiguës et les fit reconstruire ; il y vécut avec son épouse Adriana Perez. En tant que bourgmestre, il représentait la ville auprès des autorités supérieures et commandait la milice et les gildes armées.",
              "Son voisin était le peintre Frans Snijders (1579–1657). Lui et son épouse Margriete de Vos habitèrent la maison « de Fortuyne » à partir de 1622. Snijders était connu pour ses natures mortes, ses tableaux d'animaux et ses scènes de chasse.",
              "En 1970, la Kredietbank acheta la maison Rockox, qui devint un musée. Aujourd'hui, les deux maisons forment ensemble la Snijders&Rockox Huis, avec des œuvres de Bruegel, Rubens et Van Dyck, entre autres.",
            ],
          },
        ],
        didYouKnow: [
          "Le musée est gratuit le premier mardi de chaque mois.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visite du musée (facultative)",
        paragraphs: [
          "Ouvert du mardi au dimanche, de 10 h à 17 h ; fermé le lundi (sauf lundi de Pâques et lundi de Pentecôte), le 1er janvier, le 1er mai, le jour de l'Ascension, le 1er novembre et le 25 décembre. Entrée 10 € ; gratuite pour les moins de 18 ans et les titulaires d'un museumPASSmusées ; gratuite pour tous le premier mardi du mois.",
          "La visite du musée est facultative ; la balade continue tout simplement ensuite.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.snijdersrockoxhuis.be/en/visit/plan-your-visit/opening-hours-prices",
      },
    ],
    glossary: ["rocaille", "lodewijk-stijlen"],
    thenAndNow: [
      "Autrefois : Smekens dessina une « porte de style Louis XV ». On reconnaît ce style à ses formes asymétriques de coquillages et de rochers.",
      "Aujourd'hui : cherchez le décrottoir, le petit rebord de fer pour gratter ses chaussures. Figure-t-il aussi sur le dessin ?",
    ],
    didYouKnow: [
      "Dans la Paternosterstraat, tout près de cette rue, Smekens dessina un petit portail de style Renaissance flamande appartenant à la maison « De gulden dolfeyn » (le dauphin d'or), qui selon lui était déjà mentionnée en 1497. Il a disparu.",
    ],
    transitionToNext: "Rendez-vous dans la Markgravestraat, une rue étroite tracée vers 1500.",
  },

  // ── Gate 27 ───────────────────────────────────────────────────────────
  "poortjes-markgravestraat": {
    name: "Markgravestraat 14",
    subtitle: "Une rue à travers le domaine d'un margrave",
    introduction: [
      "Dans cette rue étroite, cherchez le numéro 14 et la porte du livre. Comparez l'encadrement avec le dessin : les proportions de l'arc, les pilastres et le couronnement.",
    ],
    sections: [
      {
        heading: "La rue",
        kind: "history",
        paragraphs: [
          "La Markgravestraat fut tracée vers 1500 et doit son nom au margrave Jan van Immerseel (XVe–XVIe siècle), dont la propriété fut traversée par la rue. C'est une rue étroite aux maisons de styles variés, avec des pignons pointus et à gradins.",
        ],
      },
      {
        heading: "La porte",
        kind: "history",
        paragraphs: [
          "Pour cette porte, Smekens écrit seulement : « Porte Renaissance. Markgravestraat 14. » Nous n'avons trouvé aucune fiche d'inventaire distincte à son sujet. On sait peu de choses avec certitude sur la fonction d'origine de cette porte en particulier. [Recherche historique nécessaire]",
        ],
      },
    ],
    thenAndNow: [
      "Autrefois : une porte sans histoire dans le livre, seulement un dessin.",
      "Aujourd'hui : comparez vous-même. Le dessin correspond-il encore à ce que vous voyez ?",
    ],
    didYouKnow: [
      "Le nom de la rue ne renvoie pas à un titre en général, mais à une personne précise : le margrave Jan van Immerseel, dont le domaine fut traversé par la rue.",
    ],
    transitionToNext: "Rendez-vous dans la Koningstraat. Cherchez-y trois rois.",
  },

  // ── Gate 29 (+ vanished 28 and 31) ───────────────────────────────────
  "poortjes-koningstraat": {
    name: "Koningstraat 17",
    subtitle: "De Drij Koningen (Les Trois Rois)",
    introduction: [
      "Cherchez le pignon à gradins avec un petit portail en pierre bleue dans la travée de droite. Au-dessus de la porte se trouve une petite fenêtre ronde entourée de feuillages.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Smekens écrit que la maison « De Drie Koningen » était « déjà mentionnée en 1549 » ; l'inventaire dit « déjà mentionnée à la fin du XVIe siècle ». En 1881, la façade fut profondément restaurée sous la direction des architectes Léonard et Henri Blomme.",
          "Le portail lui-même est plus récent que la maison. Smekens : « Datant de 1716. »",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "L'inventaire décrit un « petit portail en pierre bleue de style baroque tardif daté de 1716 » : « une porte en arc à épaulements dans un encadrement mouluré, flanquée de pilastres à fûts en retrait et à chapiteaux à volutes ». Au-dessus de la porte se trouve un oculus, une fenêtre ronde, entouré de feuillages décoratifs. Smekens parle d'un « portail Louis XIV ».",
        ],
      },
    ],
    glossary: ["schouderboog", "lodewijk-stijlen"],
    thenAndNow: [
      "Autrefois : Smekens dessina le portail avec sa fenêtre ronde.",
      "Aujourd'hui : cherchez l'année 1716.",
    ],
    didYouKnow: [
      "Dans la même rue, au numéro 14, Smekens dessina un autre portail du XVIIIe siècle, appartenant à la maison « De witte koning » (le roi blanc). Il a disparu.",
      "Le portail de la Gratiekapelstraat toute proche avait déjà disparu quand le livre parut : Smekens écrit qu'il avait été « tout simplement arraché par des vandales il y a quelques années ».",
    ],
    transitionToNext: "Rendez-vous dans la Prinsstraat, au cœur historique de l'université.",
  },

  // ── University ───────────────────────────────────────────────────────
  "poortjes-universiteit": {
    name: "Stadscampus et Hof van Liere",
    subtitle: "Le palais d'un bourgmestre devenu université",
    introduction: [
      "Derrière les façades de la Prinsstraat se trouve le campus urbain (Stadscampus) de l'Université d'Anvers. Son cœur est le Hof van Liere, un palais de style gothique tardif avec une cour, des galeries et un puits.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "« Cette résidence princière fut construite en 1516 pour Aert van Liere, alors bourgmestre d'Anvers », dans le style gothique brabançon, écrit l'université. Après sa mort, la propriété passa à la ville, qui la mit à la disposition d'une famille de banquiers milanais, puis de la Nation anglaise, l'association des marchands anglais.",
          "Les jésuites, qui fondèrent un collège à Anvers en 1575, agrandirent l'ensemble et l'aménagèrent en pensionnat. Après la suppression de leur ordre, il devint une académie militaire et un hôpital.",
          "En 1929, les jésuites revinrent : leur école de commerce Sint-Ignatius s'y installa. En 1988, les Universitaire Faculteiten Sint-Ignatius (UFSIA) achetèrent le Prinsenhof, et en 2003 les universités anversoises fusionnèrent pour former l'Université d'Anvers.",
        ],
      },
      {
        heading: "Aux alentours",
        kind: "history",
        paragraphs: [
          "Le campus comprend aussi le couvent des Sœurs grises dans la Lange Sint-Annastraat, construit en 1887 d'après les plans de Frans Baeckelmans. Selon l'université, les sœurs soignaient les victimes de la peste. Après 1999, il fut rénové, avec une architecture moderne insérée dans le cadre historique.",
          "Selon l'université, le jardin du Hof van Liere reçut un nouveau visage en 1998, œuvre de l'architecte paysagiste Wirtz.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Accès",
        paragraphs: [
          "Le campus est une université en activité, pas un musée. Nous n'avons trouvé aucune information officielle sur le libre accès à la cour et au jardin. Si la grille est ouverte, jetez discrètement un œil et respectez les étudiants et le personnel ; si elle est fermée, la façade sur la Prinsstraat vaut aussi le coup d'œil. [Accès à vérifier]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    didYouKnow: [
      "Les marchands anglais étaient importants dans l'Anvers du XVIe siècle : la Nation anglaise fut un temps installée ici, et selon Smekens la ville fit construire en 1550 une petite bourse « au profit des marchands anglais ».",
    ],
    transitionToNext: "Vous avez maintenant le choix : un court détour par deux portes de la Rodestraat, ou tout droit jusqu'au Stadswaag.",
  },

  // ── Gates 33 and 34: optional ────────────────────────────────────────
  "poortjes-rodestraat": {
    name: "Rodestraat 43 et 44",
    subtitle: "En bonus : deux portes près du Begijnhof",
    introduction: [
      "Bienvenue dans le détour. Dans la Rodestraat, Smekens dessina deux portes qui se font presque face : un petit portail Renaissance du presbytère du Begijnhof (le béguinage, numéro 43) et une porte cochère (numéro 44).",
    ],
    sections: [
      {
        heading: "Ce que dit le livre",
        kind: "history",
        paragraphs: [
          "À propos du numéro 43, Smekens écrit seulement : « Petit portail Renaissance du presbytère du Begijnhof. » À propos du numéro 44 : « Construite vers 1725 dans un pur style Louis XV. »",
          "Nous n'avons pas encore pu étudier nous-mêmes ces deux portes. Il reste à vérifier sur place si elles existent encore aujourd'hui, et dans quel état. [Recherche historique nécessaire]",
        ],
      },
      {
        heading: "Une porte cochère",
        kind: "context",
        paragraphs: [
          "Une porte cochère est plus large qu'une porte ordinaire : elle devait laisser passer un carrosse ou une charrette jusqu'à une cour. On la reconnaît à sa largeur et souvent à des chasse-roues en pierre ou en fer à sa base.",
        ],
      },
    ],
    glossary: ["lodewijk-stijlen"],
    thenAndNow: [
      "Autrefois : deux portes, datées du XVIe–XVIIe siècle (43) et des environs de 1725 (44).",
      "Aujourd'hui : comparez-les toutes deux avec les dessins. Vos observations nous aident à compléter cette étape.",
    ],
    didYouKnow: [
      "L'année 1725 et le style « Louis XV » sont les propres mots de Smekens. Comme vous l'avez vu en chemin, les noms de styles et les dates peuvent différer dans des études plus récentes.",
    ],
    transitionToNext: "Revenez au Stadswaag : la place de l'homme qui fit tracer la moitié de la ville nord.",
  },

  // ── Gate 35 (+ vanished 30) ──────────────────────────────────────────
  "poortjes-stadswaag": {
    name: "Le Stadswaag",
    subtitle: "Là où l'on pesait et taxait le commerce",
    introduction: [
      "Vous vous trouvez sur une place privée du bâtiment qui lui a donné son nom. Le poids public de la ville (stadswaag) se dressait ici. Sur la place, cherchez le numéro 13 avec le portail du livre : un petit portail de la fin de la Renaissance avec une imposte.",
    ],
    sections: [
      {
        heading: "Qu'est-ce qu'un poids public ?",
        kind: "history",
        paragraphs: [
          "Un poids public était une station de pesage officielle. Selon l'inventaire, le poids public d'Anvers était « une sorte de bureau des impôts où les marchandises étaient pesées et taxées en proportion ». Quiconque faisait commerce de marchandises les faisait peser officiellement ici : ainsi l'acheteur savait ce qu'il obtenait, et la ville savait ce qu'elle pouvait taxer.",
          "Le bâtiment comptait aussi « plusieurs salles richement décorées où l'on célébrait des noces ».",
        ],
      },
      {
        heading: "Gilbert van Schoonbeke",
        kind: "history",
        paragraphs: [
          "La place et les rues alentour furent tracées en 1548 par Gilbert van Schoonbeke, un promoteur immobilier avant l'heure. Par un acte du 6 mai 1547, il acheta le terrain à la ville pour 31 000 florins carolus. Il démolit les bâtiments existants et construisit « le nouveau poids public ».",
          "Il traça aussi trois rues : la Noord-, l'Oost- et la Weststraat (rues du Nord, de l'Est et de l'Ouest), rebaptisées plus tard Hoornstraat, Brilstraat et Raapstraat. Le nom « Stadswaag » pour la place date des environs de 1800.",
          "Vous avez déjà croisé Van Schoonbeke : c'est aussi lui qui fit construire les brasseries de la Brouwersstraat, d'où proviennent plusieurs portes du livre.",
        ],
      },
      {
        heading: "La fin du poids public",
        kind: "history",
        paragraphs: [
          "Le 25 août 1873, lors d'un violent orage, la foudre frappa. Le bâtiment prit feu et brûla entièrement en quelques heures. La ville transforma ensuite le terrain en place publique. En septembre 1914, le Stadswaag fit une nouvelle fois parler de lui, lorsqu'une bombe de Zeppelin l'atteignit.",
          "Dans les années 1960, des artistes découvrirent le quartier, qui devint un lieu de vie nocturne. La place fut réaménagée en 1998.",
        ],
      },
    ],
    glossary: ["waaier", "ijkdienst"],
    thenAndNow: [
      "Autrefois : en 1951, le poids public avait disparu depuis près de quatre-vingts ans. Smekens dessina le portail du numéro 13 sans autre explication.",
      "Aujourd'hui : trouvez le numéro 13 et comparez l'imposte avec le dessin. [État actuel de ce portail à vérifier sur place]",
    ],
    didYouKnow: [
      "Dans la Raapstraat (rue du Navet), l'une des rues de Van Schoonbeke, Smekens dessina un petit portail avec « un navet pour motif » dans la coquille au-dessus de la porte. Un navet dans la rue du Navet : hélas, le portail a disparu.",
      "Après l'incendie de 1873, le service officiel des poids et mesures fut provisoirement installé dans la maison De Clocke, dans la Lange Noordstraat. Vous verrez cette maison et sa porte plus loin dans la balade.",
    ],
    transitionToNext: "Rendez-vous dans la Mutsaardstraat. En face de l'Académie se dresse une porte monumentale.",
  },

  // ── Gate 36 ───────────────────────────────────────────────────────────
  "poortjes-mutsaardstraat": {
    name: "Mutsaardstraat 30-32",
    subtitle: "La maison d'un chancelier",
    introduction: [
      "Sur la Mutsaardstraat, cherchez une large façade en grès avec une partie centrale baroque et un fronton brisé. Regardez la porte monumentale. Comparez aussi les numéros 30 et 32.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Au « Mutsaertstraat 30 », Smekens écrit : « Appartenait à la maison de Schockaert, conseiller communal et chancelier de Brabant. » L'inventaire situe aujourd'hui l'hôtel particulier baroque de Jan Daniël Antoon Schockaert, chancelier du duché de Brabant à partir de 1739, au Mutsaardstraat 32. Selon l'inventaire, le numéro 30 est la maison « De Draeck » (le dragon).",
          "L'hôtel fut construit au troisième quart du XVIIe siècle par la famille Van den Kerckhoven. Le 16 décembre 1944, il fut gravement endommagé par une bombe V. En 1956–1957, il fut transformé en commerces, bureaux et appartements ; la façade avant est protégée depuis 1958.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "La façade de huit travées présente un parement de grès et un avant-corps central baroque avec un « fronton brisé surmonté d'un ornement de couronnement ». Selon l'inventaire, la porte possède un « ébrasement mouluré et à bossages sur des pilastres ioniques » et un cartouche décoratif.",
        ],
      },
    ],
    glossary: ["fronton", "beloop"],
    thenAndNow: [
      "Autrefois : Smekens vit la porte quelques années après les dégâts causés par la bombe V en 1944 et avant la transformation de 1956–1957.",
      "Aujourd'hui : à quel numéro appartient aujourd'hui la porte du dessin, 30 ou 32 ? [À vérifier sur place]",
    ],
    didYouKnow: [
      "Anvers fut durement frappée par les bombes V en 1944–1945. Cette maison fait partie des nombreux bâtiments endommagés à l'époque.",
    ],
    transitionToNext: "Traversez vers l'Académie, au numéro 31. Derrière les grilles s'étend un jardin avec cinq portes qui ne se dressent plus nulle part ailleurs.",
  },

  // ── Gates 37–41: Academy garden ──────────────────────────────────────
  "poortjes-academie": {
    name: "L'Académie et son jardin",
    subtitle: "Cinq portes sans maison",
    introduction: [
      "Vous êtes à l'Académie royale des beaux-arts (Koninklijke Academie voor Schone Kunsten), l'une des plus anciennes écoles d'art de Belgique. Derrière le pavillon d'entrée s'étend le jardin de l'Académie, où se dressent des portes et des fragments de façades provenant de bâtiments disparus ailleurs dans la ville.",
      "Smekens en a dessiné cinq. Ci-dessous, vous pouvez les chercher une à une.",
    ],
    searchTask: {
      title: "Retrouvez les cinq portes du jardin",
      intro: "Chacune de ces portes vient d'un autre endroit d'Anvers. Cherchez-les dans le jardin et comparez-les avec le dessin. Ce n'est pas une compétition : si vous n'en trouvez pas une, regardez simplement la solution.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 19,
          question: "Le portail de « Het Klaverblad » (Le Trèfle). D'où vient-il ?",
          hints: ["Regardez la clé de voûte : quelle plante y voyez-vous ?", "Il y a aussi une année sur la clé de voûte."],
          solution: "De l'ancienne Klaverstraat, aujourd'hui la Haverstraat.",
          explanation: [
            "Selon l'inventaire, il s'agit d'un « petit portail en plein cintre en pierre bleue » provenant de « het Klaverblad » dans la Haverstraat, avec l'année 1663 sur la clé de voûte et un motif de trèfle. Coïncidence ou non : 1663 est aussi l'année de fondation de l'Académie.",
          ],
        },
        {
          plate: 21,
          question: "Le portail surmonté d'un buste. Qui est-ce ?",
          hints: ["Le buste représente le fondateur de l'Académie.", "C'était un peintre, et son père portait le même nom."],
          solution: "David Teniers le Jeune, dans un portail provenant de la maison « De Gans » (L'Oie) dans la Zakstraat.",
          explanation: [
            "Smekens : « Dans la niche, un buste de David Teniers le Jeune, le peintre qui fonda l'Académie en 1663. À l'origine, ce buste n'appartenait pas à cette niche. » Le portail et le buste ont donc été réunis : un bel exemple de la façon dont d'anciens éléments ont été recombinés dans le jardin.",
          ],
        },
        {
          plate: 33,
          question: "Le grand encadrement de porte avec des lettres dans un médaillon. À quelle entreprise appartenait-il ?",
          hints: ["Cherchez trois lettres dans le médaillon du sommet.", "Les armoiries à côté appartiennent au métier que vous retrouverez dans l'Adriaan Brouwerstraat."],
          solution: "La brasserie Van Pruyssen, avec les lettres C.V.P. et les armoiries de la guilde des brasseurs.",
          explanation: [
            "Smekens indique comme provenance la Brouwersstraat, l'actuelle Adriaan Brouwerstraat. L'inventaire mentionne dans le jardin une porte en bois en plein cintre provenant de l'« Oosters Huis » (Maison des Osterlins), placée dans l'encadrement en pierre bleue de la brasserie Van Pruyssen, avec les initiales CVP et des emblèmes de brasseurs.",
          ],
        },
        {
          plate: 34,
          question: "La grande porte au montant central sculpté. De quelle maison vient-elle ?",
          hints: ["Le montant central entre les battants s'appelle un « makelaar ».", "La maison portait un nom religieux, et une inscription figure sur la porte."],
          solution: "De la maison « De Heilige Drievuldigheid » (La Sainte Trinité) sur le Kipdorp.",
          explanation: [
            "Smekens : la maison « dut céder la place aux magasins A la Vierge noire (Kipdorp) ». L'inventaire décrit dans le jardin une porte en bois portant l'inscription « In de Heyliche Dryvuldicheidt », de 1636.",
          ],
        },
        {
          plate: 37,
          question: "La grande porte à l'imposte en fer. À quel couvent appartenait-elle ?",
          hints: ["Regardez attentivement le fer forgé de l'imposte : deux lettres y sont travaillées."],
          solution: "Le couvent démoli des Cellebroeders (Alexiens) : les lettres C.B.",
          explanation: [
            "Smekens : « Du couvent démoli des Cellebroeders, avec les lettres C. B. (Cellebroeders) travaillées dans la ferronnerie de l'imposte. »",
            "Nous n'avons pas encore relevé sur place l'emplacement exact de chaque porte dans le jardin. [À vérifier sur place]",
          ],
        },
      ],
    },
    sections: [
      {
        heading: "La plus ancienne école d'art du pays",
        kind: "history",
        paragraphs: [
          "L'Académie fut fondée en 1663 à l'initiative du peintre David Teniers, avec l'autorisation du roi Philippe IV. Elle fut d'abord installée dans la Bourse sur le Meir. En 1811, elle s'installa dans l'ancien couvent des franciscains, ici sur la Mutsaardstraat.",
          "Les franciscains s'étaient établis à Anvers en 1446. Leur couvent fut détruit lors de la furie iconoclaste de 1566 et reconstruit après leur retour en 1585. En 1797, sous le régime français, ils durent partir.",
        ],
      },
      {
        heading: "Bâtiments et jardin",
        kind: "history",
        paragraphs: [
          "L'architecte de la ville Pierre Bruno Bourla conçut les plus anciens bâtiments de l'Académie : entre autres une maison du directeur (1823–1824), des salles d'exposition et, en 1841, le pavillon d'entrée avec ses grilles en fer et un musée à façade de temple classique. Après la guerre, une aile de salles de cours et d'ateliers fut ajoutée d'après les plans de Ferdinand Peeters (1953). En 1963, Renaat Braem peignit une fresque murale dans la cage d'escalier.",
          "Le jardin suit « un plan symétrique à partir du pavillon d'entrée » et fut réaménagé en 1905 d'après les plans de l'architecte Emiel Van Averbeke. Il abrite des statues de David Teniers, Mathias Van Bree, Quinten Matsijs et saint Luc, ainsi que des fragments de la Bourse du XVIe siècle.",
        ],
      },
      {
        heading: "Pourquoi y a-t-il des portes ici ?",
        kind: "interpretation",
        paragraphs: [
          "L'inventaire décrit les portes comme des « éléments de portails récupérés de bâtiments anversois disparus ». Nous n'avons pas pu découvrir qui décida exactement de les placer ici, ni pourquoi. Il paraît évident qu'on voulait sauver des éléments précieux de bâtiments démolis, et qu'une école d'art dotée d'un jardin clos était un endroit logique pour eux, notamment comme matériel pédagogique. Mais c'est une interprétation, pas un fait documenté.",
        ],
      },
      {
        heading: "Les artistes de l'Académie",
        kind: "history",
        paragraphs: [
          "Au fil des siècles, des artistes comme Lawrence Alma-Tadema, Ford Madox Brown et Henry van de Velde étudièrent ici. Le département de mode, fondé en 1963, devint mondialement célèbre dans les années 1980 grâce aux « Six d'Anvers », dont Dries Van Noten, Ann Demeulemeester et Walter Van Beirendonck. Aujourd'hui, l'Académie fait partie de la haute école AP (AP Hogeschool).",
        ],
      },
    ],
    cards: [
      {
        id: "card-van-gogh",
        title: "Vincent van Gogh à Anvers",
        subtitle: "Trois mois, novembre 1885 – février 1886",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Fin novembre 1885, Vincent van Gogh arriva à Anvers depuis Nuenen. Il loua une petite chambre dans la Lange Beeldekensstraat, dans le quartier ouvrier du Stuivenberg.",
              "En janvier 1886, il s'inscrivit à l'Académie, surtout pour apprendre à peindre d'après modèle vivant. Il suivit des cours de dessin d'après des plâtres antiques avec Frans Vinck, puis avec Eugène Siberdt, et fit un essai dans la classe de peinture de Charles Verlat.",
              "Cela ne se passa pas bien. Son style spontané et puissant se heurtait au système académique strict et, après un conflit avec Siberdt, il fut renvoyé dans une classe inférieure. La nouvelle ne lui parvint qu'après son départ : le 28 février 1886, il partit pour Paris rejoindre son frère Theo.",
            ],
          },
          {
            heading: "Ce que nous savons, et ce que nous ignorons",
            kind: "context",
            paragraphs: [
              "Son séjour à Anvers dura environ trois mois, son passage à l'Académie moins de deux. Le musée KMSKA donne le 24 novembre 1885 comme date d'arrivée ; d'autres sources évoquent quelques jours plus tard. C'est pourquoi nous disons « fin novembre ».",
            ],
          },
        ],
        didYouKnow: [
          "L'homme que l'on renvoya dans une classe inférieure à Anvers est aujourd'hui l'élève le plus célèbre que l'Académie ait jamais eu.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Accès au jardin",
        paragraphs: [
          "Le jardin de l'Académie fait partie du campus de l'Académie et n'est pas un parc public. Nous n'avons trouvé aucun horaire d'ouverture officiel. Si la grille est ouverte, entrez discrètement ; si elle est fermée, vous pouvez voir une partie du jardin à travers les grilles. [Accès à vérifier auprès de l'Académie]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    glossary: ["makelaar", "waaier", "sluitsteen"],
    didYouKnow: [
      "Le jardin de l'Académie est protégé comme paysage historico-culturel depuis 1974.",
    ],
    transitionToNext: "Fin de la troisième partie. Marchez vers le nord, en direction du Falconplein : ici, la ville devient une ville portuaire.",
  },
};
