import type { PoortjesStopText } from "../types";

/**
 * Part 1: South side & Hoogstraat (gates 1–9). Spanish translation of ../en/deel-1.ts.
 * Quotes from the (Dutch) sources are given in translation.
 */
export const deel1: Record<string, PoortjesStopText> = {
  // ── Gate 1 ────────────────────────────────────────────────────────────
  "poortjes-rosier": {
    name: "Rosier 24",
    subtitle: "La puerta de un convento con una santa en un medallón",
    introduction: [
      "Estás ante la larga fachada cerrada de un convento. No busques primero el gran portón principal, sino una puerta más pequeña con un medallón ovalado encima. Paul Smekens dibujó aquí, hacia 1950, precisamente una puerta así: una puerta sencilla en un marco de piedra curvo, coronada por un busto en un marco ovalado.",
      "Esta es la primera de cincuenta puertas. En 1951, Smekens publicó un libro con 52 dibujos acotados de antiguas puertas de Amberes: alzado, planta y escala gráfica, con precisión de centímetros. Seguimos sus pasos unos setenta años después. Algunas puertas siguen aquí, otras se han trasladado y otras han desaparecido.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Tras esta fachada viven monjas carmelitas desde hace casi cuatro siglos. La orden vino de España: en 1612, Ana de San Bartolomé llegó a Amberes con dos hermanas de la orden. En septiembre de 1615, los archiduques Alberto e Isabel colocaron la primera piedra del nuevo convento; la iglesia se construyó entre 1636 y 1639.",
          "En 1783 el convento fue suprimido y se utilizó como cuartel y almacén de heno. En 1801 las hermanas pudieron regresar y en 1843 recuperaron también su iglesia. En 1951 Smekens escribió simplemente: «En el convento de las teresianas españolas. En la hornacina, una imagen de san José». Con «teresianas» se refiere a las carmelitas, la orden reformada por Teresa de Ávila.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "Según el inventario del patrimonio flamenco (Inventaris Onroerend Erfgoed), la fachada principal tiene una importante puerta barroca de 1653: un portal de medio punto en un marco de piedra azul con clave, flanqueado por pilastras. En los muros laterales hay además puertas con arco rebajado y bustos de san José (a la derecha) y santa Teresa (a la izquierda), ambos de 1856.",
          "El dibujo de Smekens muestra una puerta así: un marco con arco rebajado y un ancho borde moldurado, una cornisa saliente y, encima, el busto en un medallón ovalado. Abajo, la planta muestra la profundidad a la que el marco de piedra se asienta en el muro.",
        ],
      },
      {
        heading: "¿Renacimiento o Barroco?",
        kind: "context",
        paragraphs: [
          "Por el camino notarás que Smekens llama a muchas puertas «puertas renacentistas», mientras que el inventario actual suele fecharlas en el siglo XVII y calificarlas de «barrocas». No es una contradicción que tengas que resolver: son dos maneras de nombrar las cosas, una de 1951 y otra de nuestro tiempo. En esta guía damos ambas y siempre decimos quién dice qué.",
          "Todavía no hemos encontrado mucha información fiable sobre el propio Paul Smekens. [Investigación histórica pendiente]",
        ],
      },
    ],
    glossary: ["spiegelboog", "pilaster", "sluitsteen", "hardsteen"],
    thenAndNow: [
      "Antes: Smekens dibujó una puerta con un busto en un medallón ovalado y lo llamó imagen de san José.",
      "Ahora: compáralo tú mismo. ¿Sigue ahí el busto? ¿Ves también, al otro lado, la segunda puerta con santa Teresa, como describe el inventario? ¿Cuál de las dos puertas es la del libro?",
    ],
    didYouKnow: [
      "Los bustos de san José y santa Teresa son más recientes que el convento: el inventario los fecha en 1856, más de dos siglos después de la iglesia.",
    ],
    lookAt: [
      {
        title: "La planta bajo el dibujo",
        body: "Fíjate en la estrecha franja que hay bajo la puerta en el dibujo: es una sección del muro. Muestra la profundidad a la que el marco de piedra se asienta en la fachada. Smekens dibujó una para cada puerta, y verás estas pequeñas plantas muchas veces más.",
      },
    ],
    transitionToNext: "Camina hasta la Lange Gasthuisstraat. En el número 37 te espera una puerta con balcón, junto con un detalle que, según Smekens, no pertenece a ella.",
  },

  // ── Gate 2 ────────────────────────────────────────────────────────────
  "poortjes-lange-gasthuisstraat": {
    name: "Lange Gasthuisstraat 37",
    subtitle: "La casa urbana de una abadía",
    introduction: [
      "Busca la ancha puerta con el pequeño balcón de hierro forjado encima. Fíjate primero en el marco de la propia puerta: bloques de piedra que sobresalen alternativamente y, arriba, una clave en forma de voluta.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Durante siglos este edificio fue el «refugio» de la abadía norbertina de Tongerlo: su casa urbana en Amberes, de 1535 a 1581 y de 1585 a 1699. Una abadía situada en el campo necesitaba una casa así para hacer negocios en la ciudad y como refugio seguro en tiempos revueltos.",
          "La casa tuvo algunos residentes notables: Felipe de Marnix, señor de Saint-Aldegonde, vivió aquí en 1583–1584 como uno de los burgomaestres de la ciudad, y más tarde el burgomaestre Willem Andreas de Caters (1802–1831). De 1699 a 1724 perteneció al escultor Hendrik Frans Verbruggen, que mandó hacer importantes reformas. En 1941, el arquitecto Max Winders proyectó su restauración y su unión con la casa vecina para convertirlas en un edificio de oficinas.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe una puerta barroca de medio punto del siglo XVII en piedra azul, con un derrame doblemente almohadillado y moldurado, una clave en voluta, impostas molduradas y plintos. Anchas volutas conducen a un vierteaguas que sostiene un balcón francés de hierro forjado. La puerta de madera de dos hojas tiene cuarterones y un mainel central tallado.",
        ],
      },
      {
        heading: "Lo que llamó la atención de Smekens",
        kind: "interpretation",
        paragraphs: [
          "Smekens la llama «puerta renacentista con balcón» y hace una observación aguda: «La cartela con la cabeza de mujer tallada en estilo Luis XV nos parece apócrifa en esta puerta renacentista». Dicho de otro modo, pensaba que la cabeza de mujer procedía de una época y un estilo posteriores a los de la puerta. No sabemos con certeza si se añadió más tarde.",
        ],
      },
    ],
    glossary: ["refugiehuis", "geblokt", "voluut", "makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Antes: Smekens dibujó una puerta con balcón y una cartela con una cabeza de mujer.",
      "Ahora: busca la cabeza de mujer. ¿Sigue ahí? ¿Y desentona, como le parecía a Smekens, con los bloques más severos de la puerta?",
    ],
    didYouKnow: [
      "Felipe de Marnix de Saint-Aldegonde, que vivió aquí, suele mencionarse como posible autor del Wilhelmus, el himno nacional neerlandés. Sin embargo, esa autoría nunca se ha demostrado con certeza.",
    ],
    lookAt: [
      {
        title: "Dos estilos, una puerta",
        body: "Compara los bloques pesados y rectos del marco con la decoración ondulante de la parte superior. ¿Ves la diferencia de carácter a la que se refería Smekens?",
      },
    ],
    transitionToNext: "Camina hasta la Everdijstraat. Allí hay dos puertas muy cerca la una de la otra, y una de ellas perteneció a un hombre conocido como «el benefactor de los pobres».",
  },

  // ── Gates 3 and 4 ─────────────────────────────────────────────────────
  "poortjes-everdijstraat": {
    name: "Everdijstraat 45 y 31",
    subtitle: "Dos puertas, un benefactor",
    introduction: [
      "En esta calle corta, dos puertas del libro se encuentran a unas decenas de metros la una de la otra. Empieza por el número 45: una casa con hastial escalonado y una puerta monumental a la derecha. Después sigue hasta el número 31, la mansión «Hagelsteen».",
    ],
    sections: [
      {
        heading: "Número 45",
        kind: "history",
        paragraphs: [
          "La casa del número 45 se remonta a la segunda mitad del siglo XVI; la puerta se añadió en la segunda mitad del siglo XVII. El inventario describe «un marco de piedra azul moldurado y almohadillado con clave, apoyado en pilastras jónicas talladas», rematado por un vierteaguas con cornisa sobre una pesada hilera de dentículos y flanqueado por anchas volutas con guirnaldas y rosetas.",
          "De esta puerta Smekens solo escribe «puerta renacentista». Poco se sabe con certeza sobre la función original de esta puerta en concreto.",
        ],
      },
      {
        heading: "Número 31: Hagelsteen",
        kind: "history",
        paragraphs: [
          "La mansión Hagelsteen data de finales del siglo XVI. En 1621, la familia Van Eeden la vendió a Cornelis Lantschot (1572–1656), un rico comerciante. Smekens lo llama «el benefactor de los pobres». Según el inventario, la puerta es una portada barroca de piedra azul de la segunda mitad del siglo XVII: un arco de medio punto almohadillado con una ancha clave en voluta sobre pilastras jónicas de fustes rehundidos.",
          "La casa cambió mucho después: en 1880 se le añadió un tercer piso y hacia 1925 la fachada se revocó con cemento. Tras la fachada se encuentra un patio del primer cuarto del siglo XVII con una arcada sobre columnas toscanas.",
        ],
      },
    ],
    glossary: ["kapiteel", "waterlijst", "trapgevel"],
    thenAndNow: [
      "Antes: en el número 31, Smekens dibujó una «puerta renacentista con marco». El libro no menciona ningún cambio.",
      "Ahora: la fachada del número 31 se revocó hacia 1925. Observa si la puerta del dibujo sigue destacando tan claramente de la fachada como entonces, o si la fachada más reciente ha crecido a su alrededor.",
    ],
    didYouKnow: [
      "Cornelis Lantschot volverá a aparecer más adelante en este paseo. Fundó una casa de beneficencia en el Falconrui; Smekens dibujó allí también una pequeña puerta, que desde entonces ha desaparecido.",
    ],
    lookAt: [
      {
        title: "Capiteles jónicos",
        body: "En lo alto de las pilastras que flanquean la puerta, busca las dos pequeñas volutas. Es el sello del capitel jónico. Las dos puertas de aquí los tienen.",
      },
    ],
    transitionToNext: "A la vuelta de la esquina, en la Groendalstraat, hay una casa donde mandaban los panaderos. Busca no una, sino dos pequeñas puertas.",
  },

  // ── Gate 5 ────────────────────────────────────────────────────────────
  "poortjes-groendalstraat": {
    name: "Groendalstraat 18-20",
    subtitle: "La casa de los panaderos",
    introduction: [
      "Busca la casa baja con la llamativa planta baja de piedra azul. Tiene dos pequeñas puertas, cada una con un montante en forma de abanico. Smekens dibujó una de ellas.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "El núcleo de la casa Sint-Christoffel (San Cristóbal) data del periodo 1562–1592. En 1621 pasó al gremio de panaderos, la asociación profesional del oficio. Smekens escribe que era «propiedad del decano de los panaderos», el jefe electo del gremio.",
          "En 1672, las entradas recibieron sus portadas barrocas. Smekens también da ese año: «Data de 1672».",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe «portadas barrocas de piedra azul con montante en abanico, en marcos arqueados almohadillados con claves en voluta». Toda la planta baja es un llamativo frente comercial de piedra azul. El piso superior es de ladrillo y arenisca en franjas: bandas horizontales de arenisca clara en la fábrica de ladrillo rojo.",
        ],
      },
    ],
    glossary: ["waaier", "bovenlicht"],
    thenAndNow: [
      "Antes: Smekens dibujó una de las dos puertas, con su montante y su clave en voluta.",
      "Ahora: hay dos. ¿Cuál es la del libro? Fíjate en los detalles del montante y alrededor de la clave.",
    ],
    didYouKnow: [
      "San Cristóbal es el santo que, según la leyenda, llevó al Niño Jesús a hombros para cruzar un río. Muchas casas de Amberes tenían un nombre así en lugar de un número; los números de las casas llegaron mucho más tarde.",
    ],
    transitionToNext: "Ahora toca un paseo más largo hacia el oeste, en dirección al Escalda, hasta la Kloosterstraat. La casa que verás allí lleva el nombre de un hombre famoso que nunca vivió en ella.",
  },

  // ── Gate 6 ────────────────────────────────────────────────────────────
  "poortjes-kloosterstraat": {
    name: "Kloosterstraat 13",
    subtitle: "La casa que recibió el nombre equivocado",
    introduction: [
      "Ante ti hay una fachada larga y baja de ocho ventanas de ancho, de suave arenisca amarilla. En el centro de la fachada hay una robusta puerta de piedra azul. Detrás se abre un patio con cuatro alas.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "El conjunto data de 1547–1555, como indican una piedra fechada y las cabezas de las vigas. En 1619, su propietario Peter Paschier de Deckere mandó hacer importantes reformas. En 1698, el comerciante Norberto Schut encargó al arquitecto Hendrik Frans Verbruggen una cuarta ala, barroca. Smekens se refiere a ello: «el patio de la mansión De Deckere, que data de 1698».",
          "Hoy la casa se llama Mercator-Orteliushuis. Smekens ya lo consideraba un error en 1951: «Llamada erróneamente la casa de Abraham Ortelius». El inventario lo confirma: el famoso cartógrafo (1527–1598) vivió en el número 43 de esta calle, una casa derribada en 1937.",
          "El edificio fue deteriorándose hasta que la Vereniging van Historische Woonsteden (Asociación de Residencias Históricas) lo compró en 1943. Fue declarado monumento protegido en 1946, donado a la ciudad en 1950 y restaurado en 1952–1953.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe la puerta a la calle como un «marco de puerta barroco del siglo XVII en piedra azul: un arco de medio punto almohadillado inscrito en un arco rebajado moldurado, con plintos, impostas, clave tallada y vierteaguas».",
        ],
      },
    ],
    glossary: ["neuten", "imposten", "rondboog"],
    thenAndNow: [
      "Antes: Smekens vio la puerta cuando la casa estaba deteriorada, justo antes o durante la restauración de 1952–1953.",
      "Ahora: fíjate en la arenisca amarilla de la fachada y en el azul oscuro de la piedra azul. Ese contraste hace que hoy la puerta se distinga fácilmente.",
    ],
    didYouKnow: [
      "Una casa bautizada con el nombre de una celebridad que nunca vivió en ella no es una excepción antuerpiense. Muestra, sobre todo, lo mucho que le gusta a una ciudad dar una dirección a sus grandes nombres.",
    ],
    transitionToNext: "Vuelve al centro, a la Hoogstraat, una de las calles más antiguas de la ciudad. Allí hay tres puertas del libro casi una al lado de otra.",
  },

  // ── Gates 7 and 8 (+ plate 3) ─────────────────────────────────────────
  "poortjes-hoogstraat": {
    name: "Hoogstraat 15-21",
    subtitle: "Viejos nombres de casas y un callejón escondido",
    introduction: [
      "Estás en la Hoogstraat, entre hastiales escalonados de arenisca. En estos pocos metros, Smekens dibujó tres puertas: el número 15B («De Wolsack», el saco de lana), el número 21 y, como extra, el número 15. Fíjate en las plantas bajas: la mayoría son hoy tiendas, pero entre los escaparates sobreviven viejos marcos de puerta.",
    ],
    sections: [
      {
        heading: "La calle",
        kind: "history",
        paragraphs: [
          "La Hoogstraat se menciona ya en 1232 como «alta platea» y se llama Hoogstraat desde 1305. Unía el centro de la ciudad con el sur. En 1443, un incendio destruyó casi todos sus edificios. En el siglo XVI se comerciaba aquí con lino.",
        ],
      },
      {
        heading: "Casas con nombre",
        kind: "history",
        paragraphs: [
          "Sobre De Wolsack, Smekens escribe: «Esta casa ya se mencionaba en 1461». El inventario describe «Wolsack, Gulden Osch y Schilt van Mechelen» como tres casas tradicionales en profundidad de la segunda mitad del siglo XVI, con siete vanos de ancho en total, fachada íntegramente de arenisca y tres hastiales escalonados. La puerta es un portal de medio punto en un marco barroco de piedra azul de hacia 1650.",
          "Atención: el inventario sitúa hoy estas casas en Hoogstraat 15A, 17 y 17A. Es decir, los números han cambiado desde 1951. También se desplazaron los nombres de las casas: la de la derecha se llamaba «Lyntworm» en 1561, «Cleynen gulden Schilt» en 1579 y «Schilt van Mechelen» en 1638.",
        ],
      },
      {
        heading: "El número 21 y el Vlaaikensgang",
        kind: "history",
        paragraphs: [
          "Smekens califica la puerta del número 21 de «estrictamente clásica, con triglifos fantasiosos». Según él, daba acceso a «una de las parcelas más antiguas de la Hoogstraat, llamada De Lintworm (la tenia)», con «también una salida por el Vlaaikensgang de la Koornmarkt».",
          "No hemos encontrado una ficha propia de esta puerta en el inventario. Hay que comprobar in situ si sigue hoy en el número 21. [Por verificar in situ]",
          "Según Smekens, el número 15, «De grooten gulden scilt» (el gran escudo de oro), también estaba conectado con el Vlaaikensgang. El inventario confirma un vínculo histórico entre el Vlaaikensgang y la casa de Hoogstraat 15 desde 1561. Ese callejón se encuentra detrás de estas casas y tiene su entrada principal en la Oude Koornmarkt.",
        ],
      },
      {
        heading: "La arquitectura del número 15",
        kind: "history",
        paragraphs: [
          "Según el inventario, la puerta de «Grooten gulden Schilt» (Hoogstraat 15) es un portal de arco carpanel en un marco barroco de piedra azul de hacia 1650, con derrame almohadillado en un arco de hombros con decoración de cueros recortados, volutas y una cartela tallada con un escudo liso como clave. La puerta de madera muestra relieves de la Virgen María, san Juan Evangelista, santa Isabel de Hungría y un mendigo.",
        ],
      },
    ],
    glossary: ["triglief", "korfboog", "schouderboog", "cartouche", "diephuis"],
    thenAndNow: [
      "Antes: en 1951 estas casas tenían números distintos de los actuales. El «15B» de Smekens no es el 15B de hoy.",
      "Ahora: compara los tres dibujos con las fachadas. ¿Qué puerta logras encontrar y con qué número de casa figura hoy?",
    ],
    didYouKnow: [
      "«La tenia» parece un nombre extraño para una casa, pero los nombres de las casas de Amberes podían ser casi cualquier cosa: animales, objetos, santos, ciudades. A menudo figuraban en un letrero o en una piedra de fachada, mucho antes de que existieran los números.",
    ],
    lookAt: [
      {
        title: "La puerta del número 15",
        body: "Busca la puerta de madera con figuras talladas. ¿Distingues una figura que pide limosna? Según el inventario, es un mendigo junto a santa Isabel de Hungría.",
      },
    ],
    transitionToNext: "Camina hasta la Suikerrui, la amplia calle que lleva al Escalda. Busca un carnero dorado.",
  },

  // ── Gate 9 ────────────────────────────────────────────────────────────
  "poortjes-suikerrui": {
    name: "Suikerrui 22",
    subtitle: "De Gouden Ram (El Carnero de Oro)",
    introduction: [
      "En la Suikerrui, busca la puerta que tiene un carnero dorado como clave. Después fíjate en el resto del marco: rosetas en las pilastras y alrededor del arco.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "De Gouden Ram es una mansión del siglo XVII. En 1823, el farmacéutico neerlandés Klaas Jan Cupérus (1769–1851) abrió aquí una droguería y un negocio de té. La empresa familiar Cupérus se convirtió en un conocido comercio de té y participó en las exposiciones universales de 1885, 1894 y 1930. En 1926 la tienda se trasladó a la Schoenmarkt.",
          "En su interior, la casa conserva una sala japonesa con paneles lacados del periodo Edo, con dragones, gallos, pájaros, peces y mariposas. La sala no está abierta al público.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe una puerta barroca de medio punto en piedra azul, probablemente del siglo XVII: «El derrame moldurado y almohadillado, con plintos, orejetas e impostas despiezadas, está realzado con rosetas y una cartela con un carnero dorado como clave». Smekens lo resume así: «Con un carnero sobre una cartela y rosas en las pilastras y los arcos».",
        ],
      },
    ],
    glossary: ["rondboog", "neuten"],
    thenAndNow: [
      "Antes: Smekens dibujó el carnero en blanco y negro, como parte de la piedra.",
      "Ahora: el carnero está dorado y llama la atención de inmediato. Cuenta las rosetas: ¿hay tantas como en el dibujo?",
    ],
    didYouKnow: [
      "El nombre «De Gouden Ram» sigue vivo hoy en el negocio instalado en el edificio; la propia empresa de té Cupérus se trasladó a la Schoenmarkt ya en 1926.",
    ],
    transitionToNext: "Fin de la primera parte. Camina hasta la Grote Markt: es hora de hacer una pausa en el corazón de la ciudad.",
  },
};
