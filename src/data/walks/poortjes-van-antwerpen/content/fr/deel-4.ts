import type { PoortjesStopText } from "../types";

/** Part 4: Falconplein & old port district (gates 42–50) and Part 5: MAS. French text, translated from ../en/deel-4.ts. */
export const deel4: Record<string, PoortjesStopText> = {
  // ── Gate 42 (+ vanished 43) ──────────────────────────────────────────
  "poortjes-falconplein": {
    name: "Falconplein 39 : la Falconpoort",
    subtitle: "Le dernier vestige d'un couvent",
    introduction: [
      "Sur le Falconplein, cherchez une grande porte en pierre bleue intégrée dans un immeuble de logements moderne. Regardez le cartouche au sommet : il porte un texte latin avec quelques lettres étonnamment grandes.",
    ],
    sections: [
      {
        heading: "Le couvent des Falcontines",
        kind: "history",
        paragraphs: [
          "La Falconpoort est le seul vestige du couvent des sœurs falcontines. Il fut fondé au XIVe siècle par Falco de Lampage, maître de la monnaie du duc Jean III de Brabant ; Smekens l'appelle « le riche Italien Falco de Lampagne ». Au XVe siècle, le couvent s'agrandit considérablement et, au début du XVIe siècle, il occupait tout un îlot entre l'Oudeleeuwenrui, la Generaal Belliardstraat, la Falconrui et le Falconplein.",
          "En 1784, le couvent fut supprimé par l'empereur Joseph II. Il devint un hôpital militaire en 1792 et brûla un an plus tard. Sous le régime français, le terrain fut vendu à la ville en 1810 ; sur ordre de Napoléon, on y construisit la caserne Falcon, qui subsista jusqu'à sa démolition en 1941. Smekens écrit en 1951 : « aujourd'hui également démolie ».",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "La porte date de 1671 : un plein cintre en pierre bleue, encadré de pilastres bagués aux chapiteaux décorés. Au sommet se dressait à l'origine une statue de saint Augustin, patron du couvent. Le cartouche porte l'inscription « VerVs RegVLarIVM DoCtor », « le véritable maître des réguliers », une allusion à Augustin.",
          "La porte est protégée comme monument depuis le 22 décembre 1943.",
        ],
      },
      {
        heading: "L'ancien quartier du port",
        kind: "context",
        paragraphs: [
          "À partir d'ici, la ville change de visage. Au XVIe siècle, Gilbert van Schoonbeke aménagea la « Nieuwstad » (Ville neuve) au nord de la vieille ville, avec des maisons et trois bassins intérieurs : le Brouwersvliet, le Timmervliet et le Middelvliet. Là où passent aujourd'hui des rues, il y avait alors de l'eau, et le commerce arrivait jusqu'au pied des maisons.",
        ],
      },
    ],
    glossary: ["chronogram", "kapiteel"],
    thenAndNow: [
      "Autrefois : Smekens dessina la porte isolée, avec l'inscription dans le cartouche. Il écrit au passé qu'une statue d'Augustin « se dressait fièrement » au sommet.",
      "Aujourd'hui : la porte se trouve dans un immeuble de logements reconstruit. Selon l'inventaire, une statue de Notre-Dame du XIXe siècle, avec des restes de fer forgé, rappelle les maisons ouvrières qui se trouvaient autrefois derrière la porte.",
    ],
    didYouKnow: [
      "L'inscription est un chronogramme. Additionnez les grandes lettres qui sont aussi des chiffres romains : V (5) + V (5) + V (5) + L (50) + I (1) + V (5) + M (1000) + D (500) + C (100). Total : 1671, l'année de construction de la porte.",
    ],
    lookAt: [
      {
        title: "Faites le calcul vous-même",
        body: "Dans le cartouche, cherchez les lettres écrites plus grandes que les autres. Additionnez-les comme des chiffres romains. Obtenez-vous 1671 ?",
      },
    ],
    transitionToNext: "Rendez-vous sur l'Oudeleeuwenrui. Cherchez-y une main dans la pierre.",
  },

  // ── Gate 45 (+ vanished 44) ──────────────────────────────────────────
  "poortjes-oudeleeuwenrui": {
    name: "Oudeleeuwenrui 58",
    subtitle: "De Gulden Handt (La Main d'or)",
    introduction: [
      "Cherchez une porte baroque couronnée d'un fronton brisé et d'un cartouche. Regardez bien le cartouche : il contient une main, et une année.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "Smekens : « Datant de 1669, avec la représentation d'une main. Vestige de la brasserie De gulden handt. » Selon l'inventaire, la porte provient effectivement de la brasserie De Gulden Handt et date de 1669.",
          "La raison de sa présence ici est une deuxième histoire. La distillerie « Het Anker » (L'Ancre), active semble-t-il depuis 1753, fut reprise vers 1815 par Jean Meeùs. Son petit-fils Jules Meeûs installa l'entreprise sur l'Oudeleeuwenrui en 1897, et c'est là que la vieille porte de brasserie fut intégrée dans une nouvelle façade.",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "La porte est en pierre bleue : un plein cintre à clé de voûte en volute sur des « pilastres à bossages avec chapiteaux », dans « un champ en arc à miroir orné de volutes et de gouttes », couronné d'un fronton brisé avec un cartouche montrant la main et l'année.",
        ],
      },
    ],
    glossary: ["fronton", "voluut"],
    thenAndNow: [
      "Autrefois : en 1951, la porte se trouvait déjà ici depuis plus de cinquante ans, dans la façade de la distillerie.",
      "Aujourd'hui : le bâtiment est bien conservé, mais dans les années 1950 l'entresol d'origine et les toits en bâtière ont cédé la place à un deuxième étage complet. Comparez la main du cartouche avec le dessin.",
    ],
    didYouKnow: [
      "Sur le Hessenplein tout proche, Smekens dessina une porte de la brasserie « De Bel » (La Clochette), « comme en témoigne le grelot rond dans le cartouche de la clé de voûte ». Il ne donne pas de numéro ; la porte a disparu.",
    ],
    transitionToNext: "Rendez-vous dans la Lange Noordstraat. Cherchez-y une cloche sur la façade.",
  },

  // ── Gate 46 ───────────────────────────────────────────────────────────
  "poortjes-lange-noordstraat": {
    name: "Lange Noordstraat 19",
    subtitle: "De Clocke : là où l'on contrôlait les poids et mesures",
    introduction: [
      "Cherchez une maison large et basse avec une simple porte en plein cintre. Au-dessus de la porte se trouve une pierre de façade avec une cloche en bas-relief.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "De Clocke (La Cloche) était un ancien relais de poste, où les voyageurs pouvaient remiser leur cheval et leur voiture. La plus ancienne mention date de 1560. Au XIXe siècle, c'était une taverne et une salle de bal ; Smekens parle d'« une taverne et salle de bal très fréquentée ».",
          "Après l'incendie du poids public en 1873, le service officiel des poids et mesures fut provisoirement installé ici ; il vérifiait que les poids et mesures des commerçants étaient justes. Smekens le dit plus brièvement : « Le service officiel de contrôle des poids et mesures y était installé. »",
        ],
      },
      {
        heading: "Architecture",
        kind: "history",
        paragraphs: [
          "Cette maison large traditionnelle date de la seconde moitié du XVIe siècle, avec quatre travées et deux niveaux sous un toit en bâtière. La porte est « une porte en plein cintre dans un simple encadrement de pierre bleue à bossages », avec des impostes à pointes de diamant. La pierre de façade montre « une cloche » en bas-relief. Smekens parle d'une « porte Renaissance avec un bas-relief représentant une cloche ».",
        ],
      },
    ],
    glossary: ["barleef", "diamantkop", "ijkdienst"],
    thenAndNow: [
      "Autrefois : Smekens dessina la porte avec la cloche en guise de pierre de façade.",
      "Aujourd'hui : la maison a été conservée. Cherchez la cloche, et cherchez les pointes de diamant sur les impostes.",
    ],
    didYouKnow: [
      "La cloche sur la pierre de façade rend le nom de la maison visible pour tous les passants, sans un seul mot ni numéro.",
    ],
    transitionToNext: "Rendez-vous dans l'Adriaan Brouwerstraat, l'ancienne Brouwersstraat (rue des Brasseurs). La dernière enquête vous y attend.",
  },

  // ── Gates 47–50: search task ─────────────────────────────────────────
  "poortjes-adriaan-brouwerstraat": {
    name: "Adriaan Brouwerstraat",
    subtitle: "Enquête : la rue des brasseurs",
    introduction: [
      "Cette rue s'appelait autrefois la Brouwersstraat (rue des Brasseurs). Smekens y dessina quatre portes, et toutes les quatre sont toujours debout. Descendez lentement la rue et observez les façades : lesquelles reconnaissez-vous ?",
    ],
    searchTask: {
      title: "Quelles portes reconnaissez-vous encore ?",
      intro: "Quatre dessins, quatre portes. Ce n'est pas un quiz : regardez, comparez, et touchez « Trouvé ! » quand vous en reconnaissez une. Si vous êtes bloqué, consultez un indice ou la solution.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 7,
          question: "Une porte ornée d'étoiles. Où est-elle ?",
          hints: ["Cherchez une inscription sur la clé de voûte.", "Il s'agit de petits numéros."],
          solution: "Adriaan Brouwerstraat 5, de la brasserie De Gulde Sterre (L'Étoile d'or).",
          explanation: [
            "La clé de voûte porte l'inscription « GVLDE STER ». Smekens : « Le motif de l'étoile figure sur les montants. Appartenait à la brasserie De gulden sterre. Ce motif évoque l'étoile d'or, emblème des brasseurs. » L'inventaire date la maison de la première moitié du XVIIe siècle.",
          ],
        },
        {
          plate: 29,
          question: "Une porte austère avec des colonnes et une petite fenêtre au-dessus.",
          hints: ["Regardez les colonnes : elles sont légèrement plus épaisses au milieu.", "La maison fait l'angle avec une autre rue."],
          solution: "Adriaan Brouwerstraat 17, à l'angle de la Korte Zeevaartstraat.",
          explanation: [
            "Smekens : « Une composition très strictement classique, cette fois sans enroulements ni volutes. » L'inventaire décrit un « portail en pierre bleue du premier baroque, de la première moitié du XVIIe siècle », avec une clé de voûte à mascaron, des « colonnes engagées aux trois quarts à fûts renflés » et un fronton courbe brisé avec une imposte rectangulaire. Les bâtiments ont été restaurés en 2014–2015.",
          ],
        },
        {
          plate: 20,
          question: "Une porte avec l'emblème des brasseurs et une année.",
          hints: ["Cherchez le plus ancien bâtiment de la rue.", "L'année se trouve autour de la clé de voûte : 16..."],
          solution: "Adriaan Brouwerstraat 20, le Brouwershuis (Maison des brasseurs, ou Maison hydraulique), avec « ANNO 1655 ».",
          explanation: [
            "Ce portail n'appartenait pas à la Maison hydraulique. Smekens nous apprend qu'il provenait d'une ancienne brasserie et appartenait à M. W. Pouillon, de Kalmthout, jusqu'à ce que le conseil communal décide, lors de sa séance du 30 mars 1922, de l'acheter pour 1 000 francs et de le placer à l'entrée de la Maison hydraulique. L'inventaire confirme : « déplacé ici en 1922 ».",
          ],
        },
        {
          plate: 39,
          question: "Une porte avec un éventail, une rose et une inscription.",
          hints: ["Lisez le ruban en haut du dessin.", "C'est le numéro le plus élevé des quatre."],
          solution: "Adriaan Brouwerstraat 29, « In de Roose » (À la Rose).",
          explanation: [
            "Smekens : « Avec un motif d'éventail et de rose et l'inscription In de roose. Appartenait à la brasserie De roode roos (La Rose rouge). » Selon l'inventaire, le brasseur De Bridt fit construire la maison d'après les plans de l'architecte Jan Pieter van Baurscheit le Jeune : des comptes datent son projet de 1738 et son achèvement de 1743. Smekens qualifie le style de Louis XIV, l'inventaire de Régence.",
          ],
        },
      ],
      outro: "Toutes les quatre toujours à leur place, ou presque : l'une des quatre est elle-même une porte qui a déménagé. Laquelle ? Exactement, celle du Brouwershuis.",
    },
    sections: [
      {
        heading: "La rue de Van Schoonbeke",
        kind: "history",
        paragraphs: [
          "La rue fut tracée vers 1550 par Gilbert van Schoonbeke, lorsqu'il aménagea la Nieuwstad au nord du Brouwersvliet. Vers 1553, il y construisit quelque seize brasseries. La rue s'appela successivement « Groote Middelstrate », « Breestrate » et, à partir de 1694, « Brouwersstraat ». En 1936, elle reçut son nom actuel, d'après le peintre Adriaen Brouwer (vers 1606–1638).",
        ],
      },
      {
        heading: "Le Brouwershuis",
        kind: "history",
        paragraphs: [
          "Au numéro 20 se dresse le Brouwershuis ou Waterhuis (Maison hydraulique), construit en 1553–1554 par Van Schoonbeke pour l'approvisionnement en eau. Une roue hydraulique actionnée par des chevaux pompait l'eau du canal de Herentals et la distribuait aux brasseries, jusque vers 1930. La maison appartint à la ville à partir de 1561 et devint la maison de la guilde des brasseurs en 1582. Elle ouvrit comme musée en 1933 et fut restaurée en 1956–1961.",
        ],
      },
    ],
    glossary: ["mascaron", "sluitsteen", "waaier"],
    didYouKnow: [
      "Trois portes du livre qui se trouvent ou se trouvaient ailleurs en ville venaient de cette rue : le portail disparu de la Zilversmidstraat (brasserie De Trouw), l'encadrement de la brasserie Van Pruyssen dans le jardin de l'Académie et, selon Smekens, probablement le portail du Brouwershuis lui-même.",
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visiter le Brouwershuis",
        paragraphs: [
          "Le Brouwershuis a rouvert au public en mai 2024, après trente ans (VRT NWS). Nous n'avons pas vérifié les horaires d'ouverture actuels. [À vérifier]",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.vrt.be/vrtnws/nl/2024/05/07/brouwershuis-in-antwerpen-na-30-jaar-weer-open-voor-publiek/",
      },
    ],
    transitionToNext: "Plus que quelques centaines de mètres. Devant vous s'élève une haute tour : le MAS, la fin de la balade.",
  },

  // ── End: MAS ─────────────────────────────────────────────────────────
  "poortjes-mas": {
    name: "MAS",
    subtitle: "D'une porte au monde entier",
    introduction: [
      "Vous êtes au pied du MAS, le Museum aan de Stroom (Musée au bord du fleuve) : une tour de soixante mètres entre les anciens bassins. Levez les yeux. Dans un instant, si le bâtiment est ouvert, vous pourrez monter jusqu'au toit.",
      "Cette balade a commencé devant une petite porte dans la façade d'un couvent. Elle s'achève dans un musée qui raconte la grande histoire : celle d'Anvers, du port et du monde.",
    ],
    sections: [
      {
        heading: "Le MAS",
        kind: "history",
        paragraphs: [
          "MAS signifie Museum aan de Stroom. Il fut conçu par Neutelings Riedijk Architects, lauréats du concours international en 1999, et ouvrit le 14 mai 2011. La tour mesure 60 mètres de haut. Le musée gère quelque 600 000 objets sur les liens entre Anvers et le monde.",
          "Le bâtiment se dresse à l'emplacement du Hanzehuis ou Oosterlingenhuis (Maison des Osterlins), un entrepôt du XVIe siècle des marchands de la Hanse, conçu par Cornelis Floris de Vriendt. C'est le même architecte que celui de l'hôtel de ville sur la Grote Markt.",
        ],
      },
      {
        heading: "L'Eilandje",
        kind: "history",
        paragraphs: [
          "Ce quartier faisait partie de la Nieuwstad que Gilbert van Schoonbeke aménagea au XVIe siècle, avec des bassins intérieurs comme le Brouwersvliet. Le nom « Eilandje » (la Petite Île) apparut en 1869, lorsque le creusement du Verbindingsdok laissa le quartier d'habitation entièrement entouré d'eau.",
          "Quand le port se déplaça vers le nord, le quartier déclina. À partir des années 1980, les bassins et les entrepôts furent peu à peu transformés en quartier résidentiel et muséal.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Monter",
        paragraphs: [
          "Le boulevard piéton avec ses escalators et le panorama sur le toit sont gratuits pendant les heures d'ouverture du bâtiment : du mardi au dimanche de 9 h 30 à 22 h, et du 1er avril au 31 octobre jusqu'à minuit (dernière entrée à 23 h 30). Fermé le lundi (sauf lundi de Pâques et lundi de Pentecôte), ainsi que le 1er janvier, le 1er mai et le 25 décembre ; les 24 et 31 décembre jusqu'à 15 h. Par mauvais temps, le panorama peut être temporairement fermé.",
          "Les salles du musée nécessitent un billet. Elles sont ouvertes du mardi au dimanche, de 10 h à 17 h (dernière entrée à 16 h).",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://mas.be/en/page/how-when-get-here",
      },
    ],
    didYouKnow: [
      "Sur la place devant le MAS s'étend une mosaïque de 1 600 m² de l'artiste Luc Tuymans, intitulée « Dead Skull ».",
    ],
    lookAt: [
      {
        title: "Vu d'en haut",
        body: "Depuis le toit, cherchez la flèche de la cathédrale. Quelque part entre les deux, dans les ruelles, se trouvent les portes que vous avez vues aujourd'hui.",
      },
    ],
    closing: {
      timeline: [
        "Rosier : une porte de couvent avec un saint",
        "Hoogstraat : des noms de maisons d'avant les numéros",
        "Grote Markt : des guildes et un géant",
        "Gildekamersstraat : des années gravées dans la pierre",
        "Handelsbeurs : l'argent et le commerce mondial",
        "Académie : des portes sans maison",
        "Brouwersstraat : des brasseurs et de l'eau",
        "MAS : le port et le monde",
      ],
      finalLines: [
        "Aujourd'hui, vous êtes passé devant cinquante portes. Certaines étaient toujours debout, d'autres avaient déménagé, et certaines, vous ne les connaissez que par un dessin de 1951.",
        "Paul Smekens les a mesurées au centimètre près, parce qu'il savait qu'une ville change.",
        "Désormais, prêtez attention aux portes.",
      ],
    },
  },

  // ── Optional: Red Star Line ──────────────────────────────────────────
  "poortjes-red-star-line": {
    name: "Red Star Line Museum",
    subtitle: "En bonus : le voyage vers l'Amérique",
    introduction: [
      "Pas encore fatigué de marcher ? Ici, dans les anciens bâtiments de la compagnie maritime Red Star Line, des millions d'Européens ont commencé leur voyage vers une nouvelle vie.",
    ],
    sections: [
      {
        heading: "L'histoire",
        kind: "history",
        paragraphs: [
          "La Red Star Line fut active sur l'Eilandje pendant plus d'un demi-siècle. Selon le musée, entre 1873 et 1934, plus de deux millions d'émigrants quittèrent l'Europe pour l'Amérique du Nord à bord de ses navires, en quête d'un nouveau départ.",
          "Le musée se trouve « sur le site authentique de la compagnie maritime historique » et raconte « une histoire universelle d'espoir, de rêves et de quête du bonheur, à partir de récits personnels d'émigrants du XXe siècle ». Il a ouvert en 2013.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visite",
        paragraphs: [
          "Montevideostraat 3. Ouvert du mardi au dimanche, de 10 h à 17 h ; fermé le lundi, sauf lundi de Pâques et lundi de Pentecôte. Le musée nécessite un billet : consultez les prix actuels sur le site web du musée.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://redstarline.be/en/content/museum",
      },
    ],
    didYouKnow: [
      "Cette histoire-là aussi commence et finit devant une porte : celle de la maison européenne que les émigrants laissaient derrière eux, et celle de leur nouveau pays.",
    ],
  },
};
