import type { PoortjesContent } from "../types";
import { collectionEn } from "./collection";
import { deel1 } from "./deel-1";
import { deel2 } from "./deel-2";
import { deel3 } from "./deel-3";
import { deel4 } from "./deel-4";

/**
 * Poortjes van Antwerpen: English text (the master for all other languages).
 * Translated from the Dutch original in ../nl/.
 *
 * Rules (see CLAUDE.md):
 * - Only facts from the sources listed per stop in stops.ts; quotes from
 *   Smekens' book and the inventory are translated and shown in quotation marks.
 * - Street names, addresses and house names are never translated.
 * - Every section says what it is: documented ("history"), interpretation,
 *   background ("context") or legend.
 * - What still needs research is marked visibly between [ ].
 */
export const poortjesContentEn: PoortjesContent = {
  walk: {
    title: "The Gates of Antwerp",
    tagline: "In the footsteps of Paul Smekens (1951)",
    shortDescription:
      "A long walk past fifty old gates, drawn in 1951: from a convent door on the Rosier to the MAS, with the Grote Markt, the cathedral, the Handelsbeurs and the Academy along the way.",
    description:
      "In 1951 Paul Smekens published a book with 52 measured drawings of old Antwerp gates and doorways: front view, floor plan and scale bar, accurate to the centimetre. This walk follows in his footsteps, seventy years later.\n\nAt every gate you compare the drawing with what stands there today. Some gates have hardly changed, others have moved or disappeared. Along the way you pass the great sights of the city: the Grote Markt, the cathedral, the Handelsbeurs, the Sint-Jacobskerk and the Academy, where Vincent van Gogh studied. Two search tasks let you hunt for the right door yourself.\n\nVanished gates are in the collection, but the route doesn't take you to them. That way you see every drawing without walking further than you need to.",
    highlights: [
      "50 historic gates, each with the original measured drawing from 1951",
      "A clear status for every gate: still standing, vanished, under renovation or optional",
      "Major stops: Grote Markt, cathedral, Handelsbeurs, Sint-Jacobskerk, Academy and MAS",
      "Two search tasks with hints: in the Gildekamersstraat and the Adriaan Brouwerstraat",
      "Vincent van Gogh in Antwerp: what we know for sure",
      "Fact, interpretation and legend always clearly separated",
    ],
    howItWorksSteps: [
      "Walk to the next stop with the map",
      "Compare the 1951 drawing with what you see",
      "Read the story and look for the details on site",
      "Decide for yourself whether to take a detour or visit a museum",
    ],
    practicalInfo: [
      { label: "Distance", value: "About 10 km, divided into five parts; you can always stop and continue later" },
      { label: "Duration", value: "A full day: allow 5 to 6.5 hours including reading and a break" },
      { label: "Museums", value: "Optional; opening hours and prices are given at each stop, with the date they were checked" },
      { label: "Accessibility", value: "Flat streets, partly cobbled; some courtyards and gardens are not always open" },
    ],
    guideIntro: {
      quote:
        "In 1951 Paul Smekens drew 52 old Antwerp gates, accurate to the centimetre. Seventy years later, we go and see what is left of them.",
      categoryLabel: "Architecture & history",
      footnote: "From a convent door on the Rosier to the roof of the MAS.",
    },
    copy: {
      startLabel: "Start the walk",
      nextLocationTitle: "Next stop",
      completionTitle: "End of the walk",
      completionMessage: "Today you saw fifty gates. From now on, take a look at the doors.",
      locationsTitle: "The route",
      locationsDiscoveredLabel: "stops visited",
    },
    collection: {
      title: "The collection: all the drawings",
      intro: "All 52 drawings from the book, with their status today. Vanished gates are listed here, but the route doesn't take you to them.",
      sourceNote:
        "Drawings: Paul Smekens, “Oude poortjes in Antwerpen. 52 tekeningen” (Old gates in Antwerp. 52 drawings; Antwerp: De Sikkel, 1951). Captions quoted from the book in the original Dutch.",
    },
  },

  chapters: [
    {
      id: "zuidkant",
      title: "South side & Hoogstraat",
      intro: "We start in the quiet streets south of the centre: convents, abbey town houses and houses with names instead of numbers.",
      firstLocationId: "poortjes-rosier",
    },
    {
      id: "oude-stad",
      title: "Cathedral & Old Town",
      intro: "Now the heart of the city: the Grote Markt, the cathedral and the narrow streets behind it, with guild houses, a search task and Antwerp's first exchange.",
      firstLocationId: "poortjes-grote-markt",
    },
    {
      id: "universiteit-academie",
      title: "Handelsbeurs, University & Academy",
      intro: "From trade to art: the Handelsbeurs, Rubens' church, the houses of burgomasters and painters, and a garden full of gates without a house.",
      firstLocationId: "poortjes-handelsbeurs",
    },
    {
      id: "oude-haven",
      title: "Falconplein & old port district",
      intro: "The city becomes a port city. Here there were convents, breweries and water: the New Town of Gilbert van Schoonbeke.",
      firstLocationId: "poortjes-falconplein",
    },
    {
      id: "mas",
      title: "MAS",
      intro: "The last stretch: from the smallest traces in the city to the big story of the port and the world.",
      firstLocationId: "poortjes-mas",
    },
  ],

  stops: { ...deel1, ...deel2, ...deel3, ...deel4 },

  glossary: {
    archivolt: { term: "Archivolt", definition: "The (often decorated) band that follows the curve of an arch." },
    barleef: { term: "Bas-relief", definition: "Sculpture that projects only slightly from its background, as on a façade stone." },
    beloop: { term: "Reveal", definition: "The edge that follows the door opening itself, often shaped with mouldings." },
    bovenlicht: { term: "Fanlight", definition: "The window or opening above a door that lets light in." },
    cartouche: { term: "Cartouche", definition: "A decorated shield or frame containing an inscription, a year or a coat of arms." },
    chronogram: { term: "Chronogram", definition: "An inscription in which some letters are also Roman numerals (I, V, X, L, C, D, M). Add them up and you get a year." },
    diamantkop: { term: "Diamond point", definition: "Decoration in the shape of a small cut, pyramid-shaped block." },
    diephuis: { term: "Deep house and wide house", definition: "A deep house (diephuis) faces the street with its narrow side, on a deep plot; a wide house (breedhuis) with its long side." },
    fronton: { term: "Pediment", definition: "A triangular or curved crowning above a door or window. In a broken pediment the top is left open." },
    geblokt: { term: "Rusticated (blocked)", definition: "A frame of blocks that alternately project and recede, so that the arch or pier looks “stacked”." },
    godshuis: { term: "Almshouse", definition: "A charitable foundation with small homes for the elderly or poor, often around a courtyard and with its own chapel." },
    hardsteen: { term: "Bluestone", definition: "A hard, grey-blue limestone that is easy to carve: the typical material of Antwerp gate frames." },
    ijkdienst: { term: "Weights-and-measures office", definition: "The office that checked whether traders' weights and measures were correct." },
    imposten: { term: "Imposts", definition: "The projecting stones on which an arch rests, just above the straight sides of the gate." },
    kapiteel: { term: "Capital", definition: "The top of a column or pilaster. You recognise an Ionic capital by its two scrolls; a composite capital combines scrolls with leaves." },
    korfboog: { term: "Basket arch", definition: "A flattened arch, wider than it is high, like the handle of a basket." },
    "lodewijk-stijlen": { term: "Louis XIV, Régence, Louis XV, Louis XVI", definition: "Style names after French kings. Roughly: solemn and symmetrical (Louis XIV), a lighter transitional style (Régence), playful and asymmetrical with shell shapes (Louis XV or rococo), and back to strict and classical (Louis XVI)." },
    makelaar: { term: "Central post (makelaar)", definition: "Here: the central upright between the two leaves of a door, sometimes richly carved." },
    mascaron: { term: "Mascaron", definition: "A carved face or mask, often used as a keystone." },
    neuten: { term: "Plinth blocks", definition: "Block-shaped bases at the bottom of pilasters or door jambs." },
    pilaster: { term: "Pilaster", definition: "A flat pier that projects partly from the wall, with a base and a capital like a column." },
    refugiehuis: { term: "Refuge house", definition: "The town house of an abbey outside the city: for business in town, and as a refuge in unsafe times." },
    rocaille: { term: "Rocaille", definition: "Whimsical, asymmetrical decoration with shell and rock shapes: typical of the Louis XV style." },
    rondboog: { term: "Round arch", definition: "An arch in the shape of a semicircle." },
    schouderboog: { term: "Shoulder arch", definition: "An opening whose upper corners step inwards like “shoulders”." },
    sluitsteen: { term: "Keystone", definition: "The central, topmost stone of an arch. It holds the arch in place and is often decorated." },
    spiegelboog: { term: "Mirror arch", definition: "A flat arch with rounded corners." },
    trapgevel: { term: "Stepped gable", definition: "A pointed gable that rises in steps." },
    triglief: { term: "Triglyph", definition: "A block with vertical grooves, borrowed from the frieze of classical Greek temples." },
    voluut: { term: "Volute", definition: "A spiral scroll." },
    waaier: { term: "Fan (fanlight)", definition: "The semicircular fanlight above a door, with bars radiating like a fan, often in wrought iron." },
    waterlijst: { term: "Drip moulding", definition: "A projecting moulding above a gate or window that carries rainwater away from the façade." },
  },

  images: {
    "grote-markt-1905": {
      caption: "The Grote Markt in 1905, with the Brabo Fountain on the left and the guild houses behind it.",
      alt: "Coloured old postcard of the square with the fountain and tall guild houses with stepped gables",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Guild houses on the Grote Markt today, with gilded figures on the façades.",
      alt: "Recent photo of tall stone guild houses topped with golden statues, against a blue sky",
      approximateYear: "2021",
    },
    "stadhuis-1866": {
      caption: "The town hall in an early photograph from the mid-1860s, in an album dated 1867.",
      alt: "Early photograph of the long Renaissance façade of the town hall",
      approximateYear: "1865–1867",
    },
    "brabo-photochrom": {
      caption: "Brabo throws away the giant's hand: a colour print from the 1890s.",
      alt: "Coloured historical print of the bronze Brabo statue on a rocky fountain in front of guild houses",
      approximateYear: "1890s",
    },
    "cathedral-hollar-1649": {
      caption: "The cathedral in an etching by Wenceslaus Hollar, 1649. The south tower was already unfinished at the time.",
      alt: "Detailed etching of the cathedral's front with one tall spire and a much lower tower",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "The spire of the cathedral above the rooftops, around 1908.",
      alt: "Old postcard of the tall Gothic tower of the cathedral above a square",
      approximateYear: "c. 1908",
    },
    "handelsbeurs-1890": {
      caption: "Joseph Schadde's exchange hall around 1890: a Gothic courtyard under a roof of iron and glass.",
      alt: "Old photograph of a Gothic courtyard with galleries under a large roof of iron and glass",
      approximateYear: "c. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "The same hall in a pen drawing by Maxime Lalanne, made before 1886.",
      alt: "Pen drawing of the exchange hall with merchants in the courtyard",
      approximateYear: "before 1886",
    },
  },

  collectionItems: collectionEn,

  drawings: {
    alt: "Measured drawing of the gate at {address}: front view with dimension lines, scale bar and floor plan",
    caption: "Plate {plate}: {title}, {address}",
    rightsNote: "Rights still to be verified",
    unknownArtist: "Unknown",
    coverAlt: "Measured drawing by Paul Smekens (1951): the gate of the De Gulde Sterre brewery, Adriaan Brouwerstraat 5",
  },
};
