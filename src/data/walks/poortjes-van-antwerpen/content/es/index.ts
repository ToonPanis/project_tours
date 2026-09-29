import type { PoortjesContent } from "../types";
import { collectionEs } from "./collection";
import { deel1 } from "./deel-1";
import { deel2 } from "./deel-2";
import { deel3 } from "./deel-3";
import { deel4 } from "./deel-4";

/**
 * Poortjes van Antwerpen: Spanish text, translated from the English master in ../en/.
 * Informal «tú», terms aligned with src/i18n/locales/es/guide.json.
 * Street names, addresses and house names are never translated.
 */
export const poortjesContentEs: PoortjesContent = {
  walk: {
    title: "Las puertas de Amberes",
    tagline: "Tras los pasos de Paul Smekens (1951)",
    shortDescription:
      "Un largo paseo junto a cincuenta puertas antiguas dibujadas en 1951: desde la puerta de un convento en el Rosier hasta el MAS, pasando por la Grote Markt, la catedral, la Handelsbeurs y la Academia.",
    description:
      "En 1951, Paul Smekens publicó un libro con 52 dibujos acotados de antiguas puertas y portadas de Amberes: alzado, planta y escala gráfica, con precisión de centímetros. Este paseo sigue sus pasos, setenta años después.\n\nEn cada puerta comparas el dibujo con lo que hay hoy. Algunas puertas apenas han cambiado; otras se han trasladado o han desaparecido. Por el camino pasas por los grandes lugares de la ciudad: la Grote Markt, la catedral, la Handelsbeurs, la Sint-Jacobskerk y la Academia, donde estudió Vincent van Gogh. Dos misiones de búsqueda te permiten buscar tú mismo la puerta correcta.\n\nLas puertas desaparecidas están en la colección, pero la ruta no te lleva hasta ellas. Así ves todos los dibujos sin caminar más de lo necesario.",
    highlights: [
      "50 puertas históricas, cada una con el dibujo acotado original de 1951",
      "Un estado claro para cada puerta: aún existe, desaparecida, en restauración u opcional",
      "Grandes paradas: Grote Markt, catedral, Handelsbeurs, Sint-Jacobskerk, Academia y MAS",
      "Dos misiones de búsqueda con pistas: en la Gildekamersstraat y en la Adriaan Brouwerstraat",
      "Vincent van Gogh en Amberes: lo que sabemos con certeza",
      "Hechos, interpretación y leyenda, siempre claramente separados",
    ],
    howItWorksSteps: [
      "Camina hasta la siguiente parada con ayuda del mapa",
      "Compara el dibujo de 1951 con lo que ves",
      "Lee la historia y busca los detalles in situ",
      "Decide tú si das un rodeo o visitas un museo",
    ],
    practicalInfo: [
      { label: "Distancia", value: "Unos 10 km, divididos en cinco partes; siempre puedes parar y continuar más tarde" },
      { label: "Duración", value: "Un día entero: calcula de 5 a 6,5 horas, incluidas la lectura y una pausa" },
      { label: "Museos", value: "Opcionales; en cada parada se indican horarios y precios, con la fecha en que se comprobaron" },
      { label: "Accesibilidad", value: "Calles llanas, en parte adoquinadas; algunos patios y jardines no siempre están abiertos" },
    ],
    guideIntro: {
      quote:
        "En 1951, Paul Smekens dibujó 52 antiguas puertas de Amberes, con precisión de centímetros. Setenta años después, vamos a ver qué queda de ellas.",
      categoryLabel: "Arquitectura e historia",
      footnote: "De la puerta de un convento en el Rosier a la azotea del MAS.",
    },
    copy: {
      startLabel: "Empezar el paseo",
      nextLocationTitle: "Siguiente parada",
      completionTitle: "Fin del paseo",
      completionMessage: "Hoy has visto cincuenta puertas. A partir de ahora, fíjate en las puertas.",
      locationsTitle: "La ruta",
      locationsDiscoveredLabel: "paradas visitadas",
    },
    collection: {
      title: "La colección: todos los dibujos",
      intro: "Los 52 dibujos del libro, con su estado actual. Las puertas desaparecidas figuran aquí, pero la ruta no te lleva hasta ellas.",
      sourceNote:
        "Dibujos: Paul Smekens, «Oude poortjes in Antwerpen. 52 tekeningen» (Antiguas puertas de Amberes. 52 dibujos; Amberes: De Sikkel, 1951). Pies de lámina citados del libro en el neerlandés original.",
    },
  },

  chapters: [
    {
      id: "zuidkant",
      title: "Lado sur y Hoogstraat",
      intro: "Empezamos en las tranquilas calles al sur del centro: conventos, casas urbanas de abadías y casas con nombre en lugar de número.",
      firstLocationId: "poortjes-rosier",
    },
    {
      id: "oude-stad",
      title: "Catedral y casco antiguo",
      intro: "Ahora, el corazón de la ciudad: la Grote Markt, la catedral y las calles estrechas de detrás, con casas gremiales, una misión de búsqueda y la primera bolsa de Amberes.",
      firstLocationId: "poortjes-grote-markt",
    },
    {
      id: "universiteit-academie",
      title: "Handelsbeurs, universidad y Academia",
      intro: "Del comercio al arte: la Handelsbeurs, la iglesia de Rubens, las casas de burgomaestres y pintores, y un jardín lleno de puertas sin casa.",
      firstLocationId: "poortjes-handelsbeurs",
    },
    {
      id: "oude-haven",
      title: "Falconplein y antiguo barrio portuario",
      intro: "La ciudad se convierte en ciudad portuaria. Aquí había conventos, cervecerías y agua: la Ciudad Nueva de Gilbert van Schoonbeke.",
      firstLocationId: "poortjes-falconplein",
    },
    {
      id: "mas",
      title: "MAS",
      intro: "El último tramo: de las huellas más pequeñas de la ciudad a la gran historia del puerto y el mundo.",
      firstLocationId: "poortjes-mas",
    },
  ],

  stops: { ...deel1, ...deel2, ...deel3, ...deel4 },

  glossary: {
    archivolt: { term: "Archivolta", definition: "La moldura (a menudo decorada) que sigue la curva de un arco." },
    barleef: { term: "Bajorrelieve", definition: "Escultura que sobresale solo ligeramente del fondo, como en una piedra de fachada." },
    beloop: { term: "Derrame", definition: "El borde que sigue el propio vano de la puerta, a menudo trabajado con molduras." },
    bovenlicht: { term: "Montante", definition: "La ventana o abertura sobre una puerta que deja pasar la luz." },
    cartouche: { term: "Cartela", definition: "Un escudo o marco decorado que contiene una inscripción, un año o un blasón." },
    chronogram: { term: "Cronograma", definition: "Una inscripción en la que algunas letras son también números romanos (I, V, X, L, C, D, M). Si las sumas, obtienes un año." },
    diamantkop: { term: "Punta de diamante", definition: "Decoración en forma de pequeño bloque tallado en pirámide." },
    diephuis: { term: "Casa en profundidad y casa a lo ancho", definition: "Una casa en profundidad (diephuis) da a la calle por su lado estrecho, sobre una parcela profunda; una casa a lo ancho (breedhuis), por su lado largo." },
    fronton: { term: "Frontón", definition: "Un remate triangular o curvo sobre una puerta o ventana. En un frontón partido, la parte superior queda abierta." },
    geblokt: { term: "Almohadillado (a bloques)", definition: "Un marco de bloques que alternativamente sobresalen y se retranquean, de modo que el arco o el pilar parece «apilado»." },
    godshuis: { term: "Casa de beneficencia (godshuis)", definition: "Una fundación benéfica con pequeñas viviendas para ancianos o pobres, a menudo en torno a un patio y con capilla propia." },
    hardsteen: { term: "Piedra azul", definition: "Una caliza dura de color gris azulado, fácil de tallar: el material típico de los marcos de las puertas de Amberes." },
    ijkdienst: { term: "Oficina de pesas y medidas", definition: "La oficina que comprobaba si las pesas y medidas de los comerciantes eran correctas." },
    imposten: { term: "Impostas", definition: "Las piedras salientes sobre las que descansa un arco, justo encima de los lados rectos de la puerta." },
    kapiteel: { term: "Capitel", definition: "La parte superior de una columna o pilastra. Un capitel jónico se reconoce por sus dos volutas; un capitel compuesto combina volutas con hojas." },
    korfboog: { term: "Arco carpanel", definition: "Un arco rebajado, más ancho que alto, como el asa de una cesta." },
    "lodewijk-stijlen": { term: "Luis XIV, Regencia, Luis XV, Luis XVI", definition: "Nombres de estilos tomados de reyes franceses. A grandes rasgos: solemne y simétrico (Luis XIV), un estilo de transición más ligero (Regencia), juguetón y asimétrico con formas de concha (Luis XV o rococó) y de vuelta a lo estricto y clásico (Luis XVI)." },
    makelaar: { term: "Mainel central (makelaar)", definition: "Aquí: el montante vertical central entre las dos hojas de una puerta, a veces ricamente tallado." },
    mascaron: { term: "Mascarón", definition: "Un rostro o máscara tallado, a menudo usado como clave." },
    neuten: { term: "Plintos", definition: "Bases en forma de bloque en la parte inferior de pilastras o jambas." },
    pilaster: { term: "Pilastra", definition: "Un pilar plano que sobresale parcialmente del muro, con basa y capitel como una columna." },
    refugiehuis: { term: "Casa refugio", definition: "La casa urbana de una abadía situada fuera de la ciudad: para los negocios en la ciudad y como refugio en tiempos inseguros." },
    rocaille: { term: "Rocalla", definition: "Decoración caprichosa y asimétrica con formas de conchas y rocas: típica del estilo Luis XV." },
    rondboog: { term: "Arco de medio punto", definition: "Un arco en forma de semicírculo." },
    schouderboog: { term: "Arco de hombros", definition: "Un vano cuyas esquinas superiores se escalonan hacia dentro como «hombros»." },
    sluitsteen: { term: "Clave", definition: "La piedra central y más alta de un arco. Mantiene el arco en su sitio y a menudo está decorada." },
    spiegelboog: { term: "Arco de espejo", definition: "Un arco plano con las esquinas redondeadas." },
    trapgevel: { term: "Hastial escalonado", definition: "Un hastial apuntado que se eleva en escalones." },
    triglief: { term: "Triglifo", definition: "Un bloque con acanaladuras verticales, tomado del friso de los templos griegos clásicos." },
    voluut: { term: "Voluta", definition: "Un adorno en espiral." },
    waaier: { term: "Abanico (montante)", definition: "El montante semicircular sobre una puerta, con barrotes que irradian como un abanico, a menudo de hierro forjado." },
    waterlijst: { term: "Vierteaguas", definition: "Una moldura saliente sobre una puerta o ventana que aleja el agua de lluvia de la fachada." },
  },

  images: {
    "grote-markt-1905": {
      caption: "La Grote Markt en 1905, con la fuente de Brabo a la izquierda y las casas gremiales detrás.",
      alt: "Postal antigua coloreada de la plaza con la fuente y altas casas gremiales con hastiales escalonados",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Casas gremiales de la Grote Markt hoy, con figuras doradas en las fachadas.",
      alt: "Foto reciente de altas casas gremiales de piedra rematadas con estatuas doradas, contra un cielo azul",
      approximateYear: "2021",
    },
    "stadhuis-1866": {
      caption: "El Ayuntamiento en una fotografía temprana de mediados de la década de 1860, en un álbum fechado en 1867.",
      alt: "Fotografía temprana de la larga fachada renacentista del Ayuntamiento",
      approximateYear: "1865–1867",
    },
    "brabo-photochrom": {
      caption: "Brabo lanza lejos la mano del gigante: una estampa en color de la década de 1890.",
      alt: "Estampa histórica coloreada de la estatua de bronce de Brabo sobre una fuente rocosa delante de casas gremiales",
      approximateYear: "década de 1890",
    },
    "cathedral-hollar-1649": {
      caption: "La catedral en un aguafuerte de Wenceslaus Hollar, 1649. La torre sur ya estaba entonces inacabada.",
      alt: "Aguafuerte detallado de la fachada de la catedral con una aguja alta y una torre mucho más baja",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "La aguja de la catedral sobre los tejados, hacia 1908.",
      alt: "Postal antigua de la alta torre gótica de la catedral sobre una plaza",
      approximateYear: "h. 1908",
    },
    "handelsbeurs-1890": {
      caption: "La sala de la bolsa de Joseph Schadde hacia 1890: un patio gótico bajo una cubierta de hierro y cristal.",
      alt: "Fotografía antigua de un patio gótico con galerías bajo una gran cubierta de hierro y cristal",
      approximateYear: "h. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "La misma sala en un dibujo a pluma de Maxime Lalanne, realizado antes de 1886.",
      alt: "Dibujo a pluma de la sala de la bolsa con comerciantes en el patio",
      approximateYear: "antes de 1886",
    },
  },

  collectionItems: collectionEs,

  drawings: {
    alt: "Dibujo acotado de la puerta de {address}: alzado con líneas de cota, escala gráfica y planta",
    caption: "Lámina {plate}: {title}, {address}",
    rightsNote: "Derechos pendientes de verificación",
    unknownArtist: "Desconocido",
    coverAlt: "Dibujo acotado de Paul Smekens (1951): la puerta de la cervecería De Gulde Sterre, Adriaan Brouwerstraat 5",
  },
};
