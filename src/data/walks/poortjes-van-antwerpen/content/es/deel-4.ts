import type { PoortjesStopText } from "../types";

/** Part 4: Falconplein & old port district (gates 42–50) and Part 5: MAS. Spanish translation of ../en/deel-4.ts. */
export const deel4: Record<string, PoortjesStopText> = {
  // ── Gate 42 (+ vanished 43) ──────────────────────────────────────────
  "poortjes-falconplein": {
    name: "Falconplein 39: la Falconpoort",
    subtitle: "El último fragmento de un convento",
    introduction: [
      "En la Falconplein, busca una gran puerta de piedra azul integrada en un bloque de viviendas moderno. Fíjate en la cartela de la parte superior: contiene un texto en latín con unas cuantas letras llamativamente grandes.",
    ],
    sections: [
      {
        heading: "El convento de las falcontinas",
        kind: "history",
        paragraphs: [
          "La Falconpoort es el único resto del convento de las hermanas falcontinas. Lo fundó en el siglo XIV Falco de Lampage, maestro de la ceca del duque Juan III de Brabante; Smekens lo llama «el rico italiano Falco de Lampagne». En el siglo XV el convento creció considerablemente y, a principios del XVI, ocupaba toda una manzana entre la Oudeleeuwenrui, la Generaal Belliardstraat, la Falconrui y la Falconplein.",
          "En 1784 el emperador José II suprimió el convento. En 1792 se convirtió en hospital militar y un año después ardió. Bajo el dominio francés, el solar se vendió a la ciudad en 1810; por orden de Napoleón se construyó allí el cuartel Falcon, que se mantuvo hasta su derribo en 1941. Smekens escribe en 1951: «ahora también derribado».",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "La puerta data de 1671: un arco de medio punto en piedra azul, enmarcado por pilastras anilladas con capiteles decorados. Encima había originalmente una estatua de san Agustín, patrón del convento. La cartela lleva la inscripción «VerVs RegVLarIVM DoCtor», «el verdadero maestro del clero regular», una alusión a Agustín.",
          "La puerta está protegida como monumento desde el 22 de diciembre de 1943.",
        ],
      },
      {
        heading: "El antiguo barrio portuario",
        kind: "context",
        paragraphs: [
          "A partir de aquí, la ciudad cambia. En el siglo XVI, Gilbert van Schoonbeke trazó la «Nieuwstad» (Ciudad Nueva) al norte de la ciudad antigua, con casas y tres dársenas interiores: el Brouwersvliet, el Timmervliet y el Middelvliet. Donde hoy hay calles, entonces había agua, y el comercio llegaba hasta la puerta de las casas.",
        ],
      },
    ],
    glossary: ["chronogram", "kapiteel"],
    thenAndNow: [
      "Antes: Smekens dibujó la puerta exenta, con la inscripción en la cartela. Escribe en pasado que en lo alto «se alzaba orgullosa» una estatua de Agustín.",
      "Ahora: la puerta está en un bloque de viviendas reconstruido. Según el inventario, una imagen de Nuestra Señora del siglo XIX con restos de hierro forjado recuerda las casas obreras que había detrás de la puerta.",
    ],
    didYouKnow: [
      "La inscripción es un cronograma. Suma las letras grandes que también son números romanos: V (5) + V (5) + V (5) + L (50) + I (1) + V (5) + M (1000) + D (500) + C (100). En total: 1671, el año en que se construyó la puerta.",
    ],
    lookAt: [
      {
        title: "Calcúlalo tú",
        body: "En la cartela, busca las letras escritas más grandes que las demás. Súmalas como números romanos. ¿Te sale 1671?",
      },
    ],
    transitionToNext: "Camina hasta la Oudeleeuwenrui. Busca allí una mano en la piedra.",
  },

  // ── Gate 45 (+ vanished 44) ──────────────────────────────────────────
  "poortjes-oudeleeuwenrui": {
    name: "Oudeleeuwenrui 58",
    subtitle: "De Gulden Handt (La Mano de Oro)",
    introduction: [
      "Busca una puerta barroca coronada por un frontón partido y una cartela. Mira bien la cartela: contiene una mano y un año.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Smekens: «Data de 1669, con la representación de una mano. Resto de la cervecería De gulden handt». Según el inventario, la puerta procede efectivamente de la cervecería De Gulden Handt y data de 1669.",
          "Por qué la puerta está aquí es otra historia. La destilería «Het Anker» (El Ancla), al parecer activa desde 1753, fue adquirida hacia 1815 por Jean Meeùs. Su nieto Jules Meeûs trasladó el negocio a la Oudeleeuwenrui en 1897, y allí la vieja puerta de la cervecería se integró en una nueva fachada.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "La puerta es de piedra azul: un arco de medio punto con clave de voluta sobre «pilastras almohadilladas con capiteles», en «un campo de arco de espejo con volutas y gotas», coronado por un frontón partido con una cartela que muestra la mano y el año.",
        ],
      },
    ],
    glossary: ["fronton", "voluut"],
    thenAndNow: [
      "Antes: en 1951 la puerta llevaba ya más de cincuenta años aquí, en la fachada de la destilería.",
      "Ahora: el edificio está bien conservado, pero en los años cincuenta el entresuelo original y los tejados a dos aguas dejaron paso a un segundo piso completo. Compara la mano de la cartela con el dibujo.",
    ],
    didYouKnow: [
      "En la cercana Hessenplein, Smekens dibujó una puerta de la cervecería «De Bel» (La Campana), «como atestigua el cascabel redondo de la clave en forma de cartela». No da número de casa; la puerta ha desaparecido.",
    ],
    transitionToNext: "Camina hasta la Lange Noordstraat. Busca allí una campana en la fachada.",
  },

  // ── Gate 46 ───────────────────────────────────────────────────────────
  "poortjes-lange-noordstraat": {
    name: "Lange Noordstraat 19",
    subtitle: "De Clocke: donde se comprobaban pesas y medidas",
    introduction: [
      "Busca una casa ancha y baja con una sencilla puerta de medio punto. Sobre la puerta hay una piedra de fachada con una campana en bajorrelieve.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "De Clocke (La Campana) era una antigua posada de postas, donde los viajeros podían dejar su caballo y su carro. La mención más antigua data de 1560. En el siglo XIX fue taberna y salón de baile; Smekens la llama «una concurrida taberna y salón de baile».",
          "Tras el incendio de la báscula pública en 1873, la oficina oficial de pesas y medidas se instaló aquí provisionalmente; comprobaba si las pesas y medidas de los comerciantes eran correctas. Smekens lo dice más brevemente: «Allí estaba el servicio oficial de control de pesas y medidas».",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "Esta casa tradicional a lo ancho data de la segunda mitad del siglo XVI, con cuatro vanos y dos plantas bajo un tejado a dos aguas. La puerta es «una puerta de medio punto en un sencillo marco almohadillado de piedra azul», con impostas de punta de diamante. La piedra de fachada muestra «una campana» en bajorrelieve. Smekens la llama «puerta renacentista con un bajorrelieve que representa una campana».",
        ],
      },
    ],
    glossary: ["barleef", "diamantkop", "ijkdienst"],
    thenAndNow: [
      "Antes: Smekens dibujó la puerta con la campana como piedra de fachada.",
      "Ahora: la casa se ha conservado. Busca la campana, y busca las puntas de diamante de las impostas.",
    ],
    didYouKnow: [
      "La campana de la piedra de fachada hace visible el nombre de la casa a todo el que pasa, sin una sola palabra ni un solo número.",
    ],
    transitionToNext: "Camina hasta la Adriaan Brouwerstraat, antes Brouwersstraat (calle de los Cerveceros). Allí te espera la última misión de búsqueda.",
  },

  // ── Gates 47–50: search task ─────────────────────────────────────────
  "poortjes-adriaan-brouwerstraat": {
    name: "Adriaan Brouwerstraat",
    subtitle: "Misión de búsqueda: la calle de los cerveceros",
    introduction: [
      "Esta calle se llamaba antes Brouwersstraat (calle de los Cerveceros). Smekens dibujó aquí cuatro puertas, y las cuatro siguen en pie. Recorre la calle despacio y observa las fachadas: ¿cuáles reconoces?",
    ],
    searchTask: {
      title: "¿Qué puertas sigues reconociendo?",
      intro: "Cuatro dibujos, cuatro puertas. No es un concurso: mira, compara y pulsa «¡Encontrada!» cuando reconozcas una. Si te atascas, mira una pista o la solución.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 7,
          question: "Una puerta con estrellas. ¿Dónde está?",
          hints: ["Busca una inscripción en la clave.", "Son números de casa bajos."],
          solution: "Adriaan Brouwerstraat 5, de la cervecería De Gulde Sterre (La Estrella de Oro).",
          explanation: [
            "En la clave se lee «GVLDE STER». Smekens: «El motivo de la estrella aparece en las piezas laterales. Pertenecía a la cervecería De gulden sterre. Este motivo evoca la estrella dorada, emblema de los cerveceros». El inventario fecha la casa en la primera mitad del siglo XVII.",
          ],
        },
        {
          plate: 29,
          question: "Una puerta severa con columnas y un ventanuco encima.",
          hints: ["Fíjate en las columnas: son un poco más gruesas en el centro.", "La casa hace esquina con otra calle."],
          solution: "Adriaan Brouwerstraat 17, en la esquina con la Korte Zeevaartstraat.",
          explanation: [
            "Smekens: «Un diseño de un clasicismo muy estricto, esta vez sin roleos ni volutas». El inventario describe una «puerta de piedra azul del primer Barroco, de la primera mitad del siglo XVII», con clave de mascarón, «columnas de tres cuartos con fustes abombados» y un frontón curvo partido con montante rectangular. Los edificios se restauraron en 2014–2015.",
          ],
        },
        {
          plate: 20,
          question: "Una puerta con el emblema de los cerveceros y un año.",
          hints: ["Busca el edificio más antiguo de la calle.", "El año está alrededor de la clave: 16..."],
          solution: "Adriaan Brouwerstraat 20, la Brouwershuis (Casa de los Cerveceros, o Casa del Agua), con «ANNO 1655».",
          explanation: [
            "Esta puerta no pertenecía a la Casa del Agua. Smekens cuenta que procedía de una antigua cervecería y pertenecía al señor W. Pouillon, de Kalmthout, hasta que el consejo municipal decidió en su sesión del 30 de marzo de 1922 comprarla por 1000 francos y colocarla en la entrada de la Casa del Agua. El inventario lo confirma: «trasladada aquí en 1922».",
          ],
        },
        {
          plate: 39,
          question: "Una puerta con un abanico, una rosa y una inscripción.",
          hints: ["Lee la cinta de la parte superior del dibujo.", "Es el número de casa más alto de los cuatro."],
          solution: "Adriaan Brouwerstraat 29, «In de Roose» (En la Rosa).",
          explanation: [
            "Smekens: «Con motivo de abanico y rosa y la inscripción In de roose. Pertenecía a la cervecería De roode roos (La Rosa Roja)». Según el inventario, el cervecero De Bridt mandó construir la casa según un diseño del arquitecto Jan Pieter van Baurscheit el Joven: las cuentas fechan su proyecto en 1738 y su terminación en 1743. Smekens califica el estilo de Luis XIV; el inventario, de Regencia.",
          ],
        },
      ],
      outro: "Las cuatro siguen en su sitio, o casi: una de ellas es a su vez una puerta que se mudó. ¿Cuál? Exacto, la de la Brouwershuis.",
    },
    sections: [
      {
        heading: "La calle de Van Schoonbeke",
        kind: "history",
        paragraphs: [
          "La calle la trazó hacia 1550 Gilbert van Schoonbeke, cuando urbanizó la Nieuwstad al norte del Brouwersvliet. Hacia 1553 construyó aquí unas dieciséis cervecerías. La calle se llamó sucesivamente «Groote Middelstrate», «Breestrate» y, desde 1694, «Brouwersstraat». En 1936 recibió su nombre actual, por el pintor Adriaen Brouwer (h. 1606–1638).",
        ],
      },
      {
        heading: "La Brouwershuis",
        kind: "history",
        paragraphs: [
          "En el número 20 se alza la Brouwershuis o Waterhuis (Casa del Agua), construida en 1553–1554 por Van Schoonbeke para el abastecimiento de agua. Una noria movida por caballos bombeaba el agua del canal de Herentals y la distribuía a las cervecerías, hasta aproximadamente 1930. La casa perteneció a la ciudad desde 1561 y en 1582 se convirtió en la casa gremial del gremio de cerveceros. Abrió como museo en 1933 y se restauró en 1956–1961.",
        ],
      },
    ],
    glossary: ["mascaron", "sluitsteen", "waaier"],
    didYouKnow: [
      "De esta calle procedían tres puertas del libro que están o estuvieron en otros puntos de la ciudad: la desaparecida puerta de la Zilversmidstraat (cervecería De Trouw), el marco de la cervecería Van Pruyssen en el jardín de la Academia y, según Smekens, probablemente la propia puerta de la Brouwershuis.",
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visitar la Brouwershuis",
        paragraphs: [
          "La Brouwershuis volvió a abrir al público en mayo de 2024, tras treinta años (VRT NWS). No hemos comprobado el horario actual. [Por verificar]",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.vrt.be/vrtnws/nl/2024/05/07/brouwershuis-in-antwerpen-na-30-jaar-weer-open-voor-publiek/",
      },
    ],
    transitionToNext: "Solo quedan unos cientos de metros. Ante ti se alza una alta torre: el MAS, el final del paseo.",
  },

  // ── End: MAS ─────────────────────────────────────────────────────────
  "poortjes-mas": {
    name: "MAS",
    subtitle: "De una puerta al mundo entero",
    introduction: [
      "Estás al pie del MAS, el Museum aan de Stroom (Museo junto al Río): una torre de sesenta metros entre las antiguas dársenas. Mira hacia arriba. Dentro de un momento, si el edificio está abierto, podrás subir hasta la azotea.",
      "Este paseo empezó en una pequeña puerta en la fachada de un convento. Termina en un museo que cuenta la gran historia: la de Amberes, el puerto y el mundo.",
    ],
    sections: [
      {
        heading: "El MAS",
        kind: "history",
        paragraphs: [
          "MAS significa Museum aan de Stroom. Lo diseñó el estudio Neutelings Riedijk Architects, que ganó el concurso internacional en 1999, y se inauguró el 14 de mayo de 2011. La torre mide 60 metros de altura. El museo gestiona unos 600 000 objetos sobre los vínculos entre Amberes y el mundo.",
          "El edificio se levanta en el solar de la Hanzehuis u Oosterlingenhuis (Casa de los Orientales), un almacén del siglo XVI de los comerciantes hanseáticos, diseñado por Cornelis Floris de Vriendt. Es el mismo arquitecto que diseñó el Ayuntamiento de la Grote Markt.",
        ],
      },
      {
        heading: "El Eilandje",
        kind: "history",
        paragraphs: [
          "Este barrio formaba parte de la Nieuwstad que Gilbert van Schoonbeke trazó en el siglo XVI, con dársenas interiores como el Brouwersvliet. El nombre «Eilandje» (la Islita) apareció en 1869, cuando la excavación del Verbindingsdok dejó la zona residencial completamente rodeada de agua.",
          "Cuando el puerto se desplazó hacia el norte, la zona entró en decadencia. A partir de los años ochenta, las dársenas y los almacenes se fueron transformando en un barrio residencial y de museos.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Subir",
        paragraphs: [
          "El bulevar peatonal con escaleras mecánicas y el panorama de la azotea son gratuitos durante el horario del edificio: de martes a domingo de 9:30 a 22:00, y del 1 de abril al 31 de octubre hasta medianoche (último acceso a las 23:30). Cerrado los lunes (salvo el lunes de Pascua y el lunes de Pentecostés) y el 1 de enero, el 1 de mayo y el 25 de diciembre; el 24 y el 31 de diciembre, hasta las 15:00. Con mal tiempo, el panorama puede cerrarse temporalmente.",
          "Para las salas del museo necesitas entrada. Abren de martes a domingo, de 10:00 a 17:00 (último acceso a las 16:00).",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://mas.be/en/page/how-when-get-here",
      },
    ],
    didYouKnow: [
      "En la plaza frente al MAS hay un mosaico de 1600 m² del artista Luc Tuymans, titulado «Dead Skull».",
    ],
    lookAt: [
      {
        title: "Desde arriba",
        body: "Desde la azotea, busca la aguja de la catedral. En algún lugar entre ambos, en las calles estrechas, están las puertas que has visto hoy.",
      },
    ],
    closing: {
      timeline: [
        "Rosier: la puerta de un convento con una santa",
        "Hoogstraat: nombres de casas de antes de los números",
        "Grote Markt: gremios y un gigante",
        "Gildekamersstraat: años tallados en piedra",
        "Handelsbeurs: dinero y comercio mundial",
        "Academia: puertas sin casa",
        "Brouwersstraat: cerveceros y agua",
        "MAS: el puerto y el mundo",
      ],
      finalLines: [
        "Hoy has pasado junto a cincuenta puertas. Algunas seguían en pie, otras se habían mudado y a algunas solo las conoces por un dibujo de 1951.",
        "Paul Smekens las midió al centímetro, porque sabía que una ciudad cambia.",
        "A partir de ahora, fíjate en las puertas.",
      ],
    },
  },

  // ── Optional: Red Star Line ──────────────────────────────────────────
  "poortjes-red-star-line": {
    name: "Red Star Line Museum",
    subtitle: "Extra: el viaje a América",
    introduction: [
      "¿Todavía no te has cansado de caminar? Aquí, en los antiguos edificios de la naviera Red Star Line, millones de europeos emprendieron el viaje hacia una nueva vida.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "La Red Star Line operó en el Eilandje durante más de medio siglo. Según el museo, entre 1873 y 1934 más de dos millones de emigrantes partieron de Europa hacia Norteamérica en sus barcos, en busca de un nuevo comienzo.",
          "El museo se encuentra «en el emplazamiento auténtico de la histórica naviera» y cuenta «una historia universal de esperanza, sueños y búsqueda de la felicidad, a partir de relatos personales de emigrantes del siglo XX». Abrió en 2013.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visita",
        paragraphs: [
          "Montevideostraat 3. Abierto de martes a domingo, de 10:00 a 17:00; cerrado los lunes, salvo el lunes de Pascua y el lunes de Pentecostés. Para el museo necesitas entrada: consulta los precios actuales en la web del museo.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://redstarline.be/en/content/museum",
      },
    ],
    didYouKnow: [
      "También esta historia empieza y termina en una puerta: la del hogar europeo que dejaban atrás los emigrantes y la de su nuevo país.",
    ],
  },
};
