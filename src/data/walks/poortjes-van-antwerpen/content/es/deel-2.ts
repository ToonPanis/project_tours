import type { PoortjesStopText } from "../types";

/**
 * Part 2: Cathedral & Old Town (gates 10–23, historical stops).
 * Spanish translation of ../en/deel-2.ts.
 */
export const deel2: Record<string, PoortjesStopText> = {
  // ── Pause + cards ───────────────────────────────────────────────────
  "poortjes-grote-markt": {
    name: "Grote Markt: una pausa en Rococo",
    subtitle: "Siéntate un rato en el corazón de la ciudad",
    introduction: [
      "Es hora de hacer una pausa. Estás en la Grote Markt, la plaza mayor de Amberes, y el café Rococo está en la plaza. Toma asiento si te apetece, o siéntate en un banco o en un escalón: no hace falta pedir nada para continuar.",
      "Mientras descansas, puedes leer más abajo tres breves historias: sobre la plaza, el Ayuntamiento y la fuente. Levanta la vista de vez en cuando: todo lo que describen está justo delante de ti.",
    ],
    sections: [],
    infoBoxes: [
      {
        kind: "pause",
        title: "Hora de hacer una pausa",
        paragraphs: [
          "Esta pausa es una sugerencia, no una obligación. El paseo continúa igual, pidas algo o no.",
          "Quien tome algo lo elige libremente: con o sin alcohol. No hemos comprobado el horario de Rococo; si el café está cerrado o lleno, cualquier terraza o banco de la plaza sirve igual de bien.",
        ],
      },
    ],
    cards: [
      {
        id: "card-grote-markt",
        title: "La Grote Markt",
        subtitle: "La plaza de los gremios",
        imageId: "grote-markt-1905",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Alrededor de la plaza se alzan altas casas gremiales con hastiales escalonados y de volutas, coronadas por figuras doradas. Los gremios eran las asociaciones de artesanos y comerciantes. Regulaban buena parte de la vida urbana: quién podía trabajar, qué podía venderse y con qué calidad. Sus casas en esta plaza eran su tarjeta de visita.",
              "En noviembre de 1576, soldados españoles amotinados saquearon la ciudad. El fuego que provocaron destruyó las casas de la plaza. El ejemplo más bello de lo que se levantó después es la casa de la Oude Voetboog (la Vieja Ballesta), el gremio de San Jorge: construida en 1515–1516, destruida en 1576 y reconstruida en estilo renacentista en 1580–1582.",
            ],
          },
          {
            heading: "Más joven de lo que parece",
            kind: "history",
            paragraphs: [
              "Mucho de lo que ves es más reciente de lo que parece. En 1895, un ciudadano, R. Joostens, dejó dinero para devolver a la Grote Markt su antiguo esplendor. Desde finales del siglo XIX hasta principios del XX, las fachadas del lado norte, y el número 44 del lado sur, se reconstruyeron libremente y se embellecieron con el espíritu del siglo XVI.",
            ],
          },
        ],
        didYouKnow: [
          "En lo alto de la fachada de la Oude Voetboog, busca al San Jorge dorado a caballo luchando contra el dragón.",
        ],
      },
      {
        id: "card-stadhuis",
        title: "El Ayuntamiento",
        subtitle: "Construido con orgullo, quemado con furia",
        imageId: "stadhuis-1866",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "El Ayuntamiento (Stadhuis) se construyó entre 1561 y 1565, según el diseño de Cornelis Floris de Vriendt junto con otros arquitectos y artistas. Amberes era entonces una de las ciudades más ricas de Europa y quería demostrarlo.",
              "Fíjate en las alas largas y serenas y en la sección central ricamente decorada que se eleva por encima de la línea del tejado, llena de columnas, hornacinas y estatuas. Ese contraste entre orden sereno y explosión decorativa en el centro es típico del Renacimiento que Floris llevó a Amberes.",
            ],
          },
          {
            heading: "La Furia Española",
            kind: "history",
            paragraphs: [
              "El 4 de noviembre de 1576, tropas españolas amotinadas, que llevaban mucho tiempo sin cobrar, asaltaron la ciudad. El gobierno municipal organizó un contraataque desde este Ayuntamiento. Los soldados prendieron fuego al edificio; solo quedaron en pie los muros exteriores. No se sabe con exactitud cuántas personas murieron. Las estimaciones van desde varios cientos hasta unas 8000.",
            ],
          },
        ],
      },
      {
        id: "card-brabo",
        title: "La fuente de Brabo",
        subtitle: "Un gigante, una mano y el nombre de una ciudad",
        imageId: "brabo-photochrom",
        sections: [
          {
            heading: "La leyenda",
            kind: "legend",
            paragraphs: [
              "Hace mucho tiempo, según cuenta la historia, vivía a orillas del Escalda un gigante llamado Druon Antigoon. Exigía un peaje a todo barco que quisiera pasar. Quien no pagaba perdía una mano, y el gigante la arrojaba al río.",
              "Hasta que el joven soldado romano Silvius Brabo lo desafió, lo venció, le cortó la mano al gigante y la arrojó al Escalda. Así, dice la leyenda, recibió la ciudad su nombre: «hand werpen», lanzar una mano: Antwerpen.",
            ],
          },
          {
            heading: "Lo que piensan los historiadores",
            kind: "interpretation",
            paragraphs: [
              "Una historia maravillosa, pero no una explicación que los historiadores se tomen en serio. El origen del nombre Antwerpen es incierto. La mayoría de las explicaciones no lo relacionan con manos, sino con la tierra: con un terreno a lo largo del río, un trozo de tierra «delante», acumulado por el agua. La leyenda es un intento muy posterior de explicar un nombre cuyo verdadero origen se había olvidado.",
            ],
          },
          {
            heading: "La estatua",
            kind: "history",
            paragraphs: [
              "La fuente es obra del escultor antuerpiense Jef Lambeaux, que en 1883 ya tenía su diseño prácticamente terminado. Se colocó en la Grote Markt, delante del Ayuntamiento, en 1887, en una época en que a Amberes le gustaba celebrar su propia historia e identidad. Brabo está de pie sobre una base rocosa y lanza la mano lejos.",
            ],
          },
        ],
        didYouKnow: [
          "Las manos de la leyenda se ven por todo Amberes: en el escudo de la ciudad (un castillo con dos manos encima) y en las «manos de Amberes» de chocolate y de galleta de las tiendas que rodean la plaza.",
        ],
      },
    ],
    didYouKnow: [],
    thenAndNow: [
      "Compara la foto de hacia 1905 con la plaza de hoy. La reconstrucción de las fachadas estaba entonces en pleno apogeo.",
    ],
    transitionToNext: "¿Ya has descansado? Camina hasta la catedral, a pocas calles de aquí. Ya se ve su torre por encima de los tejados.",
  },

  // ── Cathedral ────────────────────────────────────────────────────────
  "poortjes-kathedraal": {
    name: "Onze-Lieve-Vrouwekathedraal (catedral de Nuestra Señora)",
    subtitle: "Una torre y media y 170 años de obras",
    introduction: [
      "Ante ti se alza una de las mayores iglesias góticas de los Países Bajos históricos. Durante siglos, su torre norte, de unos 123 metros de altura, fue lo primero que los marineros del Escalda veían de Amberes.",
      "Fíjate primero en la fachada. La torre izquierda se eleva hasta una elegante aguja; la derecha se detiene a aproximadamente un tercio de esa altura. Se proyectaron dos grandes torres; solo se completó una.",
    ],
    sections: [
      {
        heading: "Generaciones de constructores",
        kind: "history",
        paragraphs: [
          "La catedral se construyó a lo largo de unos 170 años, desde mediados del siglo XIV hasta 1521, por generaciones de constructores que sabían que nunca la verían terminada.",
          "En 1521, justo cuando se terminaba la iglesia, Amberes decidió que no era lo bastante grande. Domien de Waghemakere y Rombout Keldermans diseñaron una gigantesca ampliación del coro: el Nieuwerck. El 15 de julio de 1521, el joven emperador Carlos V colocó él mismo la primera piedra. Pero en 1533 un gran incendio dañó la iglesia, todo el dinero se destinó a reparaciones y en 1537 el Nieuwerck se abandonó definitivamente.",
        ],
      },
      {
        heading: "Tormentas de la historia",
        kind: "history",
        paragraphs: [
          "Durante la furia iconoclasta de 1566, una oleada de ira protestante contra las imágenes, buena parte del interior fue destruido. Dos siglos después, las tropas revolucionarias francesas ocuparon la ciudad, cerraron la iglesia y se llevaron sus tesoros.",
          "Mucho de lo que hoy se ve dentro fue devuelto o restaurado después, incluidos retablos de Rubens. Los más conocidos son La elevación de la cruz y El descendimiento de la cruz.",
        ],
      },
      {
        heading: "Cómo leer una iglesia gótica",
        kind: "context",
        paragraphs: [
          "La arquitectura gótica se reconoce por sus arcos apuntados, sus altos ventanales y su búsqueda de altura y luz. Los muros se apoyan en contrafuertes, lo que deja más espacio para el vidrio. A lo largo de los muros laterales, busca esos pesados pilares adosados al muro y los arcos apuntados de las ventanas.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visitar el interior",
        paragraphs: [
          "El interior, con las pinturas de Rubens, puede visitarse con entrada de pago. El horario varía por los oficios religiosos y los días festivos: consúltalo antes de ir.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://visit.antwerpen.be/en/info/cathedral-of-our-lady",
      },
    ],
    didYouKnow: [
      "El Nieuwerck nunca se construyó, pero tampoco desapareció del todo. Sus cimientos y pilares se conservan en la hilera de casas que rodea el coro, entre la Lijnwaadmarkt y la Groenplaats.",
    ],
    lookAt: [
      {
        title: "Una torre y media",
        body: "Compara la fachada con el aguafuerte de Wenceslaus Hollar de 1649 de esta página: la silueta asimétrica, con una sola torre terminada, ya era la misma entonces.",
      },
    ],
    transitionToNext: "Vuelve a cruzar la Grote Markt y, detrás del Ayuntamiento, entra en la Gildekamersstraat. Allí te espera tu primera misión de búsqueda.",
  },

  // ── Gates 11 and 12: search task ─────────────────────────────────────
  "poortjes-gildekamersstraat": {
    name: "Gildekamersstraat",
    subtitle: "Misión de búsqueda: ¿qué puerta es?",
    introduction: [
      "La Gildekamersstraat (calle de las Salas Gremiales) es una calle estrecha detrás del Ayuntamiento, llena de puertas, portales y piedras de fachada. Smekens dibujó aquí dos puertas. La pregunta es: ¿sabrás encontrarlas?",
    ],
    searchTask: {
      title: "¿Encuentras la puerta del dibujo?",
      intro: "Abajo tienes dos dibujos de 1951. Recorre la calle despacio y compara: la forma del arco, la clave, las fechas, la decoración de la parte superior. Tómate tu tiempo y usa las pistas solo si te atascas.",
      hideStoryUntilDone: true,
      items: [
        {
          plate: 10,
          question: "¿Qué puerta es esta?",
          hints: [
            "Fíjate bien en la clave de lo alto del arco: tiene un número.",
            "El número es un año del siglo XVII. Mira los números de casa más bajos.",
          ],
          solution: "Gildekamersstraat 7, la casa De Swane (El Cisne).",
          explanation: [
            "Según el inventario, el año 1631 aparece en la puerta como «A. 1631». La casa De Swane ardió durante la Furia Española de 1576 y se reconstruyó en 1580–1581. En 1633 se compró para el gremio de los pasamaneros, que la usó como casa gremial hasta la Revolución francesa. Los pasamaneros fabricaban cintas, galones y cordones decorativos.",
            "Smekens dice que el gremio de los pasamaneros estaba aquí «a finales del siglo XVI»; el inventario da 1633 como año de la compra. Así pues, ambas fuentes vinculan la casa al mismo oficio, pero no al mismo año.",
          ],
        },
        {
          plate: 8,
          question: "¿Y esta, con el ventanuco y las volutas encima?",
          hints: [
            "Junto a este dibujo, Smekens escribió «Gildekamerstraat 9» y el año 1612.",
            "La casa se llamaba «Den rooden osch» o «Den osch» (el buey rojo, el buey). Mira los números de casa en torno al 8 y al 9, y busca anclajes murales que formen una fecha.",
          ],
          solution: "Según Smekens: la casa Den (rooden) Osch, número 9 en 1951.",
          explanation: [
            "Hoy el inventario describe «Den Os» en el número 8: un hastial escalonado fechado en 1612 por sus anclajes murales, con una puerta de medio punto, una «puerta de puntas de diamante» con clave de punta de diamante e impostas.",
            "Para ser sinceros: el dibujo de Smekens muestra una puerta más rica, con un ventanuco con volutas encima y pilastras decoradas. No hemos podido establecer con certeza si es la misma puerta, o si ha sido modificada o ha desaparecido desde entonces. ¿Qué has encontrado tú? [Por verificar in situ]",
          ],
        },
      ],
      outro: "Esta calle muestra por qué el libro de Smekens es tan valioso: los números de las casas cambian, las puertas se sustituyen, pero una medición al centímetro permanece.",
    },
    sections: [
      {
        heading: "La historia de la calle",
        kind: "history",
        paragraphs: [
          "Den Os ya se mencionaba en el primer cuarto del siglo XIV. Desde 1550 fue una casa de sisas, donde se recaudaban impuestos sobre las mercancías. Ardió durante la Furia Española de 1576 y la familia De Groote la reconstruyó en 1612. En 1877 la ciudad la compró para los servicios de policía; hacia 1900, la ciudad instaló también servicios de policía en De Swane.",
          "Sobre Den Os, Smekens escribe que «ya había sido comprada por la Ciudad en aquel momento». El Ayuntamiento está literalmente a la vuelta de la esquina: la ciudad se fue extendiendo por las casas que tenía detrás.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "Según el inventario, la puerta de De Swane es un portal barroco de medio punto en un marco almohadillado de piedra azul con la fecha «A. 1631», con derrame de arco rebajado, plintos, impostas y una clave acanalada bajo un vierteaguas con cornisa sobre volutas. Las fachadas delantera y trasera se reconstruyeron hacia 1953–1954 según un diseño del arquitecto Gaston Laporte.",
        ],
      },
    ],
    glossary: ["diamantkop", "sluitsteen", "spiegelboog"],
    didYouKnow: [
      "Una casa de sisas como Den Os era una oficina de impuestos. Los impuestos sobre las mercancías y el comercio vuelven a aparecer más adelante en este paseo, en la Stadswaag.",
    ],
    transitionToNext: "Cruza el portal hasta la plaza verde que hay detrás del Ayuntamiento: la Leonie Glassplein.",
  },

  // ── Leonie Glassplein (+ vanished 13 and 14) ─────────────────────────
  "poortjes-leonie-glassplein": {
    name: "Leonie Glassplein",
    subtitle: "Un jardín nuevo, dos puertas desaparecidas",
    introduction: [
      "Estás en una plaza sorprendentemente verde detrás del Ayuntamiento. Fíjate en las líneas de latón del suelo y en los niveles de la vegetación: el diseño evoca una mina de diamantes a cielo abierto.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Durante mucho tiempo, la zona situada detrás del Ayuntamiento estuvo casi toda pavimentada y cerrada. Se rediseñó como jardín público, que se inauguró el 26 de noviembre de 2020. El diseño del estudio Stramien evoca las minas de diamantes: «Los estratos que caracterizan las minas se representan con líneas de latón que acentúan el relieve existente de la plaza».",
          "La plaza lleva el nombre de Leonie Glass (1876–1961), una figura destacada de la comunidad diamantera de Amberes. Fue la esposa del comerciante de diamantes Isidore Tolkowsky y la madre de Marcel Tolkowsky, «el hombre que ideó la forma del diamante moderno de talla brillante redonda». Tras la muerte de su marido en 1931 emigró a Nueva York. La plaza es también el jardín interior de DIVA, el museo de los diamantes, la joyería y la platería.",
        ],
      },
      {
        heading: "Plateros y puertas desaparecidas",
        kind: "history",
        paragraphs: [
          "La parte de la plaza que da a la Zilversmidstraat (calle de los Plateros) está siempre abierta. En esa calle, Smekens dibujó dos puertas que desde entonces han desaparecido: el número 5, una pequeña puerta en estilo Luis XV, y el número 17, una pequeña puerta renacentista. Las encontrarás más abajo, entre las puertas desaparecidas.",
          "El número 17 ya había viajado antes. Según Smekens, estaba originalmente adosada a la fachada de la cervecería De Trouw, una de las cervecerías que Gilbert van Schoonbeke construyó en la Brouwersstraat en el siglo XVI, y se trasladó a la Zilversmidstraat cuando ese edificio se derribó hacia 1880.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Acceso",
        paragraphs: [
          "La parte de la Zilversmidstraat está siempre abierta. La parte junto al museo DIVA solo abre en el horario del museo. Si el paso está cerrado, rodea por la Grote Markt y la Zilversmidstraat.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.agvespa.be/nieuws/iedereen-welkom-op-het-leonie-glassplein",
      },
    ],
    didYouKnow: [
      "La Brouwersstraat (calle de los Cerveceros) de Smekens sigue existiendo con otro nombre: desde 1936 se llama Adriaan Brouwerstraat. Al final de este paseo estarás allí, delante de cuatro puertas que siguen en su sitio.",
    ],
    transitionToNext: "Camina por la Zilversmidstraat hasta la Oude Beurs, la calle que debe su nombre a la primerísima bolsa de Amberes.",
  },

  // ── Gate 20 (+ vanished 21) ──────────────────────────────────────────
  "poortjes-oude-beurs": {
    name: "Oude Beurs 16: Den Spieghel",
    subtitle: "Una madre, un niño y un espejo",
    introduction: [
      "En la Oude Beurs, busca la puerta barroca ricamente decorada con una hoja de madera. Mira en la parte semicircular de encima de la puerta: allí hay una pequeña escena tallada en madera.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Den Spieghel (El Espejo) se menciona ya a principios del siglo XIV. El conjunto se extendía antiguamente desde la Grote Markt hasta aquí, la Oude Beurs. En 1506 lo compró el comerciante Peter Gielis. Propietarios posteriores fueron el tesorero municipal Alexander van den Broeck-Vekemans y su hijo Jan-Alexander; después de 1650, el notario Bartholomeus Van den Berghe. A partir de 1888 albergó una escuela primaria de niñas.",
          "Smekens cita a Steven Butken, de Colonia, como propietario original y dice que «Alex van den Broeck (siglo XVII)» quiso convertir la finca en «una especie de palacio». No hemos encontrado a Butken en el inventario. [Por verificar]",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe un portal de medio punto del tercer cuarto del siglo XVII «en exuberante estilo barroco», de piedra azul. La puerta de madera contiene «un relieve tallado en el montante»: «una mujer sentada amamantando, con un espejo en la mano derecha, rodeada de putti». Smekens: «una mujer sentada que se mira en un espejo mientras su hijo se refleja en su madre».",
          "El conjunto tiene también una torre doméstica octogonal de ladrillo, probablemente de hacia 1506, una de las torres domésticas más antiguas que se conservan en Amberes.",
        ],
      },
      {
        heading: "La primera bolsa de Amberes",
        kind: "history",
        paragraphs: [
          "La calle debe su nombre a la primera bolsa (beurs) de la ciudad. Una «old borze» de madera de 1485 se reconstruyó en 1515, bajo la dirección de Dominicus de Waghemakere, con una arcada de piedra del gótico tardío, junto a la casa «den grooten Rhijn» de la Hofstraat, a la vuelta de la esquina.",
          "El comercio creció tan deprisa que hacia 1526–1527 los comerciantes pidieron más espacio. En 1531–1532 se construyó una nueva bolsa entre la Meir y la Lange Nieuwstraat, y en 1533 cerró la antigua. Visitaremos esa nueva bolsa, la Handelsbeurs, más adelante en este paseo.",
        ],
      },
    ],
    glossary: ["barleef", "waaier"],
    thenAndNow: [
      "Antes: Smekens describió la escena de la madre y el niño con el espejo en una sola frase.",
      "Ahora: la talla está en el montante sobre la puerta. ¿Se ha conservado bien? ¿Ves los putti (angelitos) alrededor de la mujer?",
    ],
    didYouKnow: [
      "«Den Spieghel» es un nombre de casa muy elocuente: la talla sobre la puerta muestra literalmente un espejo.",
    ],
    transitionToNext: "Camina hasta la Melkmarkt. Busca una casa con un zapato dorado.",
  },

  // ── Gate 15 ───────────────────────────────────────────────────────────
  "poortjes-melkmarkt": {
    name: "Melkmarkt 37",
    subtitle: "De Gulde Schoen (El Zapato de Oro)",
    introduction: [
      "Busca la puerta con dos cabezas de león y una cartela con el nombre de la casa: «Gulde Schoen». Hoy la casa es un hotel; la puerta es más antigua que todo lo que la rodea.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Smekens escribe brevemente: «Pertenecía a la casa De gulden schoen». La propia casa sufrió grandes reformas en el siglo XIX: en 1847, el comerciante de maderas Willem Westlake hizo reducir la fachada a un esquema regular de cuatro vanos, y en 1849 el tejado a dos aguas se sustituyó por un piso más. Es un hotel desde 2018.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "Según el inventario, la puerta es un portal barroco del tercer cuarto del siglo XVII, con «un marco de piedra azul ricamente tallado», capiteles jónicos, pilastras almohadilladas, cabezas de león talladas y una cartela con la inscripción «Gulde Schoen», coronada por un frontón partido de volutas. El marco de la entrada está protegido desde 1976.",
        ],
      },
    ],
    glossary: ["fronton", "cartouche"],
    thenAndNow: [
      "Antes: en 1951 la puerta estaba en una fachada que ya se había «regularizado» un siglo antes.",
      "Ahora: la puerta del siglo XVII es la parte más antigua de la fachada. Busca las cabezas de león en el dibujo y en la realidad.",
    ],
    didYouKnow: [
      "Un nombre de casa como «Gulde Schoen» puede aludir a un oficio o a un letrero comercial. No sabemos si alguna vez vivieron aquí zapateros.",
    ],
    transitionToNext: "Camina hasta la Wolstraat, donde dos puertas del libro se encuentran a apenas cien metros la una de la otra.",
  },

  // ── Gate 16 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-7": {
    name: "Wolstraat 7",
    subtitle: "De Tennen Pot (El Pote de Estaño)",
    introduction: [
      "Busca la monumental puerta en una fachada revocada por lo demás sencilla. Sobre la puerta hay un montante de hierro con barrotes que se abren como rayos de sol.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "De Tennen Pot es una casa tradicional en profundidad que se remonta a la segunda mitad del siglo XVI. El nombre alude a un pote de estaño. En 1850 se rebajaron las ventanas de cruz; en 1895, el propietario, Vochten, derribó el hastial escalonado y mandó construir un entresuelo según un diseño del arquitecto Eugène Dieltiëns. En 1921, Eugène y su hijo Jules Dieltiëns diseñaron el escaparate que sigue ahí.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe «un monumental portal de medio punto enmarcado en un barroco escultórico» del tercer cuarto del siglo XVII, en piedra azul, con un arco de medio punto moldurado y almohadillado, pilastras con capiteles compuestos y un montante de hierro con motivo radial. Ese montante data solo de 1850.",
        ],
      },
    ],
    glossary: ["waaier", "kapiteel"],
    thenAndNow: [
      "Antes: en 1951 el hastial escalonado llevaba más de medio siglo desaparecido; solo la puerta recordaba la casa del siglo XVII.",
      "Ahora: busca la diferencia entre la piedra del siglo XVII y el montante del siglo XIX.",
    ],
    didYouKnow: [
      "Esta sola fachada reúne tres épocas: una puerta del siglo XVII, un montante de 1850 y un escaparate de 1921.",
    ],
    transitionToNext: "Un poco más adelante en la misma calle, en el número 30, te espera una puerta llena de uvas y delfines.",
  },

  // ── Gate 17 ───────────────────────────────────────────────────────────
  "poortjes-wolstraat-30": {
    name: "Wolstraat 30",
    subtitle: "Het Scilt van Londen (El Escudo de Londres)",
    introduction: [
      "Esta vez no solo interesa la piedra, sino sobre todo la hoja de madera. Fíjate en el medallón del centro y en las figuritas que hay encima.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Het Scilt van Londen es una casa tradicional en profundidad que tanto Smekens como el inventario fechan en 1625. En 1853, el tonelero Pierre Van Hove la hizo reformar en estilo neoclásico. No sabemos con certeza cómo era originalmente la fachada.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe una «llamativa puerta de medio punto en un marco barroco de piedra azul (pintada), que debe fecharse en el tercer cuarto del siglo XVII». La puerta de madera y el tejadillo llevan relieves que aluden al comercio del vino: «El medallón central muestra dos bustos juveniles, probablemente el dios del vino Baco y su esposa Ariadna», y encima «dos putti simétricos con racimos de uvas sentados sobre delfines».",
        ],
      },
      {
        heading: "¿Duquesnoy?",
        kind: "interpretation",
        paragraphs: [
          "Smekens escribe que la puerta «se atribuye a François Duquesnoy (1594–1642)»; el inventario también menciona esa atribución, con las fechas 1597–1643. Una atribución no es una prueba. Además, el inventario fecha el marco en el tercer cuarto del siglo XVII, después de la muerte de Duquesnoy. Así que quién la hizo sigue siendo una pregunta abierta.",
        ],
      },
    ],
    glossary: ["barleef"],
    thenAndNow: [
      "Antes: Smekens dibujó la puerta con sus relieves; según el inventario, el marco está pintado.",
      "Ahora: cuenta los delfines y busca los racimos de uvas.",
    ],
    didYouKnow: [
      "Según el inventario, las uvas, Baco y Ariadna aluden al comercio del vino. No hemos podido averiguar por qué la casa se llama «Het Scilt van Londen».",
    ],
    transitionToNext: "Camina hasta la Jeruzalemstraat, una callecita que une la Wolstraat y la Oude Waag. Busca una estrecha puerta junto al número 14.",
  },

  // ── Gate 10 (+ vanished 18 and 22) ───────────────────────────────────
  "poortjes-jeruzalemstraat": {
    name: "Jeruzalemstraat",
    subtitle: "Una puerta hacia Tierra Santa",
    introduction: [
      "En el costado de la casa que hace esquina con la Oude Waag, busca una estrecha puerta de piedra azul con montante. Smekens escribe: «junto al n.º 14».",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "La puerta pertenece a la casa de esquina «Jeruzalem» (Oude Waag 1–3), mencionada en 1564 como «una casa de esquina con hastial escalonado llamada Jeruzalem». La casa se reformó en estilo neoclásico en 1837–1838, se amplió en 1903 y el arquitecto Joseph De Paepe la reconstruyó a fondo en 1946. La puerta se salvó.",
          "Smekens explica el nombre «como recuerdo de los primeros viajes de Amberes a Tierra Santa». El inventario no da ninguna explicación del nombre. Así que su explicación es una posibilidad, no un hecho demostrado.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe «la pequeña portada barroca de piedra azul» de la segunda mitad del siglo XVII: una «puerta de medio punto con archivolta moldurada y almohadillada sobre pilastras talladas y almohadilladas» y un montante de arco rebajado con volutas y zarcillos. El marco de la entrada está protegido desde 1976.",
        ],
      },
      {
        heading: "Por qué estamos aquí ahora",
        kind: "context",
        paragraphs: [
          "En la lista de este paseo, esta es la puerta 10, justo después de la Suikerrui. Pero la Jeruzalemstraat está aquí, entre la Wolstraat y la Oude Waag, no cerca de la Suikerrui. Por eso la visitamos ahora, sin tener que ir y volver.",
        ],
      },
    ],
    glossary: ["archivolt"],
    didYouKnow: [
      "Otras dos puertas del libro estaban muy cerca y han desaparecido: en la Grote Goddaard (la casa De witte engel, El Ángel Blanco) y en la Engelse Beurs, junto a una pequeña bolsa que, según Smekens, la ciudad había construido para los comerciantes ingleses en 1550.",
    ],
    transitionToNext: "Camina hasta la Zwartzustersstraat. El convento de allí está en obras, pero su historia no pierde nada por ello.",
  },

  // ── Gate 19: in renovation ───────────────────────────────────────────
  "poortjes-zwartzusters": {
    name: "Zwartzustersstraat 25",
    subtitle: "Seis siglos de cuidados tras una puerta",
    introduction: [
      "Ante ti está la puerta barroca del Zwartzusterklooster, el convento de las Hermanas Negras. El convento está en obras desde finales de 2025. Así que es posible que hoy veas la puerta tras vallas de obra, o temporalmente cubierta.",
    ],
    sections: [
      {
        heading: "¿Quiénes eran las Hermanas Negras?",
        kind: "history",
        paragraphs: [
          "Las Hermanas Negras (Zwartzusters) seguían la regla de san Agustín. Se establecieron en Amberes en 1345, primero en un edificio junto a la Koepoort, donado por «Hendrik Suderman, un rico comerciante alemán». Smekens lo llama «H. Südermann».",
          "Su nombre procede de su vestimenta. Hacia 1462 hicieron sus votos monásticos y cambiaron su hábito gris por uno negro.",
        ],
      },
      {
        heading: "El cuidado de los enfermos",
        kind: "history",
        paragraphs: [
          "Las hermanas se dedicaban al cuidado de los enfermos. Bajo el gobierno municipal calvinista (1571–1585) continuaron esa labor pese a la persecución. Después de 1585 gozaron de protección. En 1798 las expulsaron las autoridades francesas; en 1823 regresaron. Las últimas hermanas se marcharon en 2014.",
        ],
      },
      {
        heading: "El conjunto",
        kind: "history",
        paragraphs: [
          "El convento creció por etapas: una nueva capilla en 1507, dependencias para el director espiritual en 1520, un refectorio y un dormitorio en 1536. En 1608 el ala norte se acondicionó como hospital. En 1670–1678 se amplió el refectorio y se renovaron el lavadero y la cocina; la cocina estaba «completamente revestida de azulejos de Delft».",
          "La capilla es una pequeña iglesia de salón gótica del primer cuarto del siglo XVI con una bóveda de cañón apuntada de madera. Las alas este y oeste se construyeron en 1904 según un diseño de Paul Van Glabbeek.",
        ],
      },
      {
        heading: "La arquitectura de la puerta",
        kind: "history",
        paragraphs: [
          "Smekens la llama «puerta en Luis XIV». El inventario describe un portal barroco de medio punto en piedra azul del «cuarto cuarto del siglo XVII o primer cuarto del siglo XVIII». El mainel central tallado con la Virgen María, santa Úrsula y san Agustín es obra de Leopold Van Esbroeck (1967), así que es más reciente que el dibujo.",
        ],
      },
      {
        heading: "Hoy",
        kind: "history",
        paragraphs: [
          "El convento estuvo vacío unos diez años. A finales de 2025 comenzó su transformación en un proyecto de cohousing con 41 viviendas y espacios compartidos, con un jardín del paisajista neerlandés Piet Oudolf (VRT NWS, 29 de octubre de 2025). Se preveía que las obras duraran unos dos años.",
        ],
      },
    ],
    glossary: ["makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Antes: el dibujo data de hacia 1950. Según el inventario, el mainel central tallado con tres santos es de 1967, así que no puede aparecer en el dibujo.",
      "Ahora: si la puerta está visible, compara su mainel central con el dibujo. ¿Qué había en ese lugar en 1951?",
    ],
    didYouKnow: [
      "En la década de 1670, la cocina del convento se revistió por completo de azulejos de Delft.",
    ],
    transitionToNext: "Camina hasta la Korte Nieuwstraat. Busca una capilla con un ángel como clave.",
  },

  // ── Gate 23 ───────────────────────────────────────────────────────────
  "poortjes-korte-nieuwstraat": {
    name: "Korte Nieuwstraat 22",
    subtitle: "Una capilla para seis ancianas",
    introduction: [
      "Busca el estrecho hastial de arenisca con un pórtico barroco de piedra azul oscura. Fíjate en la clave: una pequeña cabeza de ángel alada. Después mira la hornacina vacía que hay encima.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Esta es la capilla del Sint-Annagodshuis (casa de beneficencia de Santa Ana), fundado en 1400 por Elisabeth, viuda de Jan Hays, y Boudewijn de Riddere, como «hogar para seis ancianas». La capilla se construyó ese mismo año y se dedicó a santa Ana. En 1540, los limosneros de la Armenkamer (la oficina municipal de asistencia a los pobres) asumieron su gestión.",
          "Hubo residentes aquí hasta 1963. Después, la capilla sirvió de taller al escultor Frans Joris, de depósito de libros y de almacén.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "La capilla es una iglesia de salón gótica con un pórtico barroco del siglo XVII en piedra azul, con «impostas despiezadas y una cabeza de ángel alada como clave», «flanqueado por dos columnas anilladas». La hornacina de encima albergaba originalmente imágenes de santa Ana y de María, que desaparecieron a principios del siglo XX. Smekens dice lo mismo: las figuras aún estaban allí «a principios del siglo XX». La capilla está protegida desde 1938.",
        ],
      },
    ],
    glossary: ["godshuis", "imposten"],
    thenAndNow: [
      "Antes: en 1951 la hornacina ya estaba vacía. Smekens dibujó la puerta con sus figuras de ángeles.",
      "Ahora: la hornacina sigue vacía. Busca la cabeza de ángel alada en la clave.",
    ],
    didYouKnow: [
      "Las casas de beneficencia (godshuizen) eran una forma temprana de vivienda social: ciudadanos acaudalados o gremios las fundaban para ancianos o pobres, a menudo con capilla propia.",
    ],
    transitionToNext: "Fin de la segunda parte. Camina hasta la Handelsbeurs: de conventos y casas gremiales al dinero y el comercio mundial.",
  },
};
