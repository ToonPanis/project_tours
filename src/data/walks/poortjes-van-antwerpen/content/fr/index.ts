import type { PoortjesContent } from "../types";
import { collectionFr } from "./collection";
import { deel1 } from "./deel-1";
import { deel2 } from "./deel-2";
import { deel3 } from "./deel-3";
import { deel4 } from "./deel-4";

/**
 * Poortjes van Antwerpen: French text, translated from the English master in ../en/
 * (with the Dutch original in ../nl/ for nuance).
 *
 * Rules (see CLAUDE.md):
 * - Only facts from the sources listed per stop in stops.ts; quotes are translated
 *   and shown in « … ».
 * - Street names, addresses and house names are never translated.
 * - What still needs research is marked visibly between [ ].
 */
export const poortjesContentFr: PoortjesContent = {
  walk: {
    title: "Les portes d'Anvers",
    tagline: "Sur les traces de Paul Smekens (1951)",
    shortDescription:
      "Une longue balade devant cinquante portes anciennes, dessinées en 1951 : d'une porte de couvent sur le Rosier jusqu'au MAS, en passant par la Grote Markt, la cathédrale, la Handelsbeurs et l'Académie.",
    description:
      "En 1951, Paul Smekens publiait un livre réunissant 52 relevés de portes et de portails anciens d'Anvers : élévation, plan et échelle graphique, au centimètre près. Soixante-dix ans plus tard, cette balade suit ses traces.\n\nÀ chaque porte, vous comparez le dessin avec ce qui se dresse là aujourd'hui. Certaines portes n'ont presque pas changé, d'autres ont été déplacées ou ont disparu. En chemin, vous passez devant les grands sites de la ville : la Grote Markt, la cathédrale, la Handelsbeurs, la Sint-Jacobskerk et l'Académie, où Vincent van Gogh a étudié. Deux enquêtes vous invitent à trouver vous-même la bonne porte.\n\nLes portes disparues figurent dans la collection, mais l'itinéraire ne vous y conduit pas. Vous voyez ainsi tous les dessins sans marcher plus que nécessaire.",
    highlights: [
      "50 portes historiques, chacune avec le relevé original de 1951",
      "Un statut clair pour chaque porte : toujours debout, disparue, en rénovation ou facultative",
      "Grandes étapes : Grote Markt, cathédrale, Handelsbeurs, Sint-Jacobskerk, Académie et MAS",
      "Deux enquêtes avec indices : dans la Gildekamersstraat et l'Adriaan Brouwerstraat",
      "Vincent van Gogh à Anvers : ce que l'on sait avec certitude",
      "Faits, interprétations et légendes toujours clairement séparés",
    ],
    howItWorksSteps: [
      "Rejoignez l'étape suivante à l'aide de la carte",
      "Comparez le dessin de 1951 avec ce que vous voyez",
      "Lisez l'histoire et cherchez les détails sur place",
      "Décidez vous-même de faire un détour ou de visiter un musée",
    ],
    practicalInfo: [
      { label: "Distance", value: "Environ 10 km, en cinq parties ; vous pouvez toujours vous arrêter et reprendre plus tard" },
      { label: "Durée", value: "Une journée entière : comptez 5 h à 6 h 30, lecture et pause comprises" },
      { label: "Musées", value: "Facultatifs ; horaires et tarifs sont indiqués à chaque étape, avec la date de vérification" },
      { label: "Accessibilité", value: "Rues plates, en partie pavées ; certaines cours et certains jardins ne sont pas toujours ouverts" },
    ],
    guideIntro: {
      quote:
        "En 1951, Paul Smekens a dessiné 52 portes anciennes d'Anvers, au centimètre près. Soixante-dix ans plus tard, nous allons voir ce qu'il en reste.",
      categoryLabel: "Architecture et histoire",
      footnote: "D'une porte de couvent sur le Rosier jusqu'au toit du MAS.",
    },
    copy: {
      startLabel: "Commencer la balade",
      nextLocationTitle: "Étape suivante",
      completionTitle: "Fin de la balade",
      completionMessage: "Aujourd'hui, vous avez vu cinquante portes. Désormais, regardez bien les portes.",
      locationsTitle: "L'itinéraire",
      locationsDiscoveredLabel: "étapes visitées",
    },
    collection: {
      title: "La collection : tous les dessins",
      intro: "Les 52 dessins du livre, avec leur état actuel. Les portes disparues figurent ici, mais l'itinéraire ne vous y conduit pas.",
      sourceNote:
        "Dessins : Paul Smekens, « Oude poortjes in Antwerpen. 52 tekeningen » (Vieilles portes d'Anvers. 52 dessins ; Anvers : De Sikkel, 1951). Légendes citées du livre dans le néerlandais d'origine.",
    },
  },

  chapters: [
    {
      id: "zuidkant",
      title: "Côté sud et Hoogstraat",
      intro: "Nous commençons dans les rues calmes au sud du centre : couvents, refuges d'abbayes et maisons portant un nom plutôt qu'un numéro.",
      firstLocationId: "poortjes-rosier",
    },
    {
      id: "oude-stad",
      title: "Cathédrale et vieille ville",
      intro: "Place au cœur de la ville : la Grote Markt, la cathédrale et les ruelles qui s'étendent derrière elle, avec des maisons des guildes, une enquête et la première bourse d'Anvers.",
      firstLocationId: "poortjes-grote-markt",
    },
    {
      id: "universiteit-academie",
      title: "Handelsbeurs, université et Académie",
      intro: "Du commerce à l'art : la Handelsbeurs, l'église de Rubens, les maisons de bourgmestres et de peintres, et un jardin rempli de portes sans maison.",
      firstLocationId: "poortjes-handelsbeurs",
    },
    {
      id: "oude-haven",
      title: "Falconplein et ancien quartier du port",
      intro: "La ville devient une ville portuaire. Il y avait ici des couvents, des brasseries et de l'eau : la Nouvelle Ville de Gilbert van Schoonbeke.",
      firstLocationId: "poortjes-falconplein",
    },
    {
      id: "mas",
      title: "MAS",
      intro: "Le dernier tronçon : des plus petites traces dans la ville jusqu'à la grande histoire du port et du monde.",
      firstLocationId: "poortjes-mas",
    },
  ],

  stops: { ...deel1, ...deel2, ...deel3, ...deel4 },

  glossary: {
    archivolt: { term: "Archivolte", definition: "Le bandeau (souvent décoré) qui suit la courbe d'un arc." },
    barleef: { term: "Bas-relief", definition: "Sculpture qui ne se détache que légèrement de son fond, comme sur une pierre de façade." },
    beloop: { term: "Ébrasement", definition: "Le bord qui suit l'ouverture de la porte elle-même, souvent travaillé de moulures." },
    bovenlicht: { term: "Imposte vitrée", definition: "La fenêtre ou l'ouverture au-dessus d'une porte, qui laisse entrer la lumière." },
    cartouche: { term: "Cartouche", definition: "Un écu ou un cadre décoré contenant une inscription, une année ou des armoiries." },
    chronogram: { term: "Chronogramme", definition: "Une inscription dont certaines lettres sont aussi des chiffres romains (I, V, X, L, C, D, M). En les additionnant, on obtient une année." },
    diamantkop: { term: "Pointe de diamant", definition: "Décor en forme de petit bloc taillé en pyramide." },
    diephuis: { term: "Maison profonde et maison large", definition: "Une maison profonde (diephuis) présente son côté étroit à la rue, sur une parcelle profonde ; une maison large (breedhuis), son côté long." },
    fronton: { term: "Fronton", definition: "Un couronnement triangulaire ou cintré au-dessus d'une porte ou d'une fenêtre. Dans un fronton brisé, le sommet reste ouvert." },
    geblokt: { term: "À bossages (harpé)", definition: "Un encadrement de blocs alternativement saillants et en retrait, qui donne à l'arc ou au pilier un aspect « empilé »." },
    godshuis: { term: "Hospice (godshuis)", definition: "Une fondation charitable composée de petits logements pour les personnes âgées ou les pauvres, souvent autour d'une cour et avec sa propre chapelle." },
    hardsteen: { term: "Pierre bleue", definition: "Un calcaire dur, gris-bleu et facile à tailler : le matériau typique des encadrements de portes anversois." },
    ijkdienst: { term: "Bureau des poids et mesures", definition: "Le service qui vérifiait l'exactitude des poids et mesures des marchands." },
    imposten: { term: "Impostes", definition: "Les pierres saillantes sur lesquelles repose un arc, juste au-dessus des montants droits de la porte." },
    kapiteel: { term: "Chapiteau", definition: "Le sommet d'une colonne ou d'un pilastre. On reconnaît un chapiteau ionique à ses deux volutes ; un chapiteau composite associe volutes et feuillages." },
    korfboog: { term: "Arc en anse de panier", definition: "Un arc aplati, plus large que haut, comme l'anse d'un panier." },
    "lodewijk-stijlen": { term: "Louis XIV, Régence, Louis XV, Louis XVI", definition: "Des noms de styles tirés des rois de France. En gros : solennel et symétrique (Louis XIV), un style de transition plus léger (Régence), fantaisiste et asymétrique avec des formes de coquillages (Louis XV ou rococo), puis retour à la rigueur classique (Louis XVI)." },
    makelaar: { term: "Montant central (makelaar)", definition: "Ici : le montant vertical central entre les deux battants d'une porte, parfois richement sculpté." },
    mascaron: { term: "Mascaron", definition: "Un visage ou un masque sculpté, souvent utilisé comme clé de voûte." },
    neuten: { term: "Dés (socles)", definition: "Des bases en forme de bloc au pied des pilastres ou des montants de porte." },
    pilaster: { term: "Pilastre", definition: "Un pilier plat qui fait légèrement saillie sur le mur, avec une base et un chapiteau comme une colonne." },
    refugiehuis: { term: "Refuge", definition: "La maison urbaine d'une abbaye située hors de la ville : pour les affaires en ville, et comme abri en temps d'insécurité." },
    rocaille: { term: "Rocaille", definition: "Décor fantaisiste et asymétrique aux formes de coquillages et de rochers : typique du style Louis XV." },
    rondboog: { term: "Arc en plein cintre", definition: "Un arc en forme de demi-cercle." },
    schouderboog: { term: "Arc à épaulements", definition: "Une ouverture dont les angles supérieurs se resserrent vers l'intérieur comme des « épaules »." },
    sluitsteen: { term: "Clé de voûte", definition: "La pierre centrale, au sommet d'un arc. Elle maintient l'arc en place et est souvent décorée." },
    spiegelboog: { term: "Arc surbaissé à angles arrondis (spiegelboog)", definition: "Un arc plat aux angles arrondis." },
    trapgevel: { term: "Pignon à gradins", definition: "Un pignon pointu qui s'élève par gradins." },
    triglief: { term: "Triglyphe", definition: "Un bloc à cannelures verticales, emprunté à la frise des temples grecs classiques." },
    voluut: { term: "Volute", definition: "Un enroulement en spirale." },
    waaier: { term: "Éventail (imposte)", definition: "L'imposte en demi-cercle au-dessus d'une porte, aux barreaux rayonnant comme un éventail, souvent en fer forgé." },
    waterlijst: { term: "Larmier", definition: "Une moulure saillante au-dessus d'une porte ou d'une fenêtre, qui éloigne l'eau de pluie de la façade." },
  },

  images: {
    "grote-markt-1905": {
      caption: "La Grote Markt en 1905, avec la fontaine de Brabo à gauche et les maisons des guildes derrière.",
      alt: "Ancienne carte postale colorisée de la place avec la fontaine et de hautes maisons des guildes à pignons à gradins",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Maisons des guildes sur la Grote Markt aujourd'hui, avec des figures dorées sur les façades.",
      alt: "Photo récente de hautes maisons des guildes en pierre surmontées de statues dorées, sur fond de ciel bleu",
      approximateYear: "2021",
    },
    "stadhuis-1866": {
      caption: "L'hôtel de ville sur une photographie ancienne du milieu des années 1860, dans un album daté de 1867.",
      alt: "Photographie ancienne de la longue façade Renaissance de l'hôtel de ville",
      approximateYear: "1865–1867",
    },
    "brabo-photochrom": {
      caption: "Brabo jette la main du géant : une impression en couleurs des années 1890.",
      alt: "Impression historique en couleurs de la statue en bronze de Brabo sur une fontaine rocheuse devant des maisons des guildes",
      approximateYear: "années 1890",
    },
    "cathedral-hollar-1649": {
      caption: "La cathédrale sur une eau-forte de Wenceslas Hollar, 1649. La tour sud était déjà inachevée à l'époque.",
      alt: "Eau-forte détaillée de la façade de la cathédrale avec une haute flèche et une tour beaucoup plus basse",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "La flèche de la cathédrale au-dessus des toits, vers 1908.",
      alt: "Ancienne carte postale de la haute tour gothique de la cathédrale au-dessus d'une place",
      approximateYear: "vers 1908",
    },
    "handelsbeurs-1890": {
      caption: "La salle de la bourse de Joseph Schadde vers 1890 : une cour gothique sous une verrière de fer et de verre.",
      alt: "Photographie ancienne d'une cour gothique à galeries sous une grande verrière de fer et de verre",
      approximateYear: "vers 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "La même salle sur un dessin à la plume de Maxime Lalanne, réalisé avant 1886.",
      alt: "Dessin à la plume de la salle de la bourse avec des marchands dans la cour",
      approximateYear: "avant 1886",
    },
  },

  collectionItems: collectionFr,

  drawings: {
    alt: "Relevé de la porte située {address} : élévation avec cotes, échelle graphique et plan",
    caption: "Planche {plate} : {title}, {address}",
    rightsNote: "Droits encore à vérifier",
    unknownArtist: "Inconnu",
    coverAlt: "Relevé de Paul Smekens (1951) : la porte de la brasserie De Gulde Sterre, Adriaan Brouwerstraat 5",
  },
};
