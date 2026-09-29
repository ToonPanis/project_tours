import type { PoortjesStopText } from "../types";

/** Part 3: Handelsbeurs, University & Academy (gates 24–41). Spanish translation of ../en/deel-3.ts. */
export const deel3: Record<string, PoortjesStopText> = {
  // ── Handelsbeurs ─────────────────────────────────────────────────────
  "poortjes-handelsbeurs": {
    name: "La Handelsbeurs",
    subtitle: "Donde el mundo venía a hacer negocios",
    introduction: [
      "Desde fuera, la Handelsbeurs (la antigua bolsa de comercio) apenas llama la atención. Dentro se esconde uno de los espacios más notables de la ciudad: un patio gótico rodeado de galerías y cubierto por una altísima cubierta de hierro y cristal.",
      "En la Oude Beurs viste dónde estuvo la primera bolsa. Aquí se alza su sucesora.",
    ],
    sections: [
      {
        heading: "Por qué Amberes necesitaba una bolsa",
        kind: "history",
        paragraphs: [
          "Hacia 1530, Amberes era una de las ciudades más ricas de Europa. Barcos de Portugal traían especias de Asia; en la ciudad vivían comerciantes de Italia, Alemania, Inglaterra y España. Necesitaban conocer los precios, encontrar compradores, pedir dinero prestado y asegurar cargamentos. No había teléfonos ni periódicos tal como los conocemos: la información viajaba por carta y, sobre todo, de boca en boca.",
          "La antigua bolsa se quedó pequeña: hacia 1526–1527 los comerciantes pidieron más espacio. En 1531 la ciudad inauguró aquí una nueva bolsa, diseñada por Domien de Waghemakere en estilo gótico brabanzón tardío: un patio abierto con una galería cubierta y ricas bóvedas estrelladas. Fue uno de los primeros edificios construidos expresamente con este fin.",
        ],
      },
      {
        heading: "Fuego, y otra vez fuego",
        kind: "history",
        paragraphs: [
          "Lo que ves no es simplemente el edificio de 1531. La bolsa se reconstruyó en 1583 y ardió en 1858. El arquitecto Joseph Schadde diseñó el edificio actual; el encargo se le adjudicó finalmente en 1868 y la nueva bolsa se inauguró solemnemente el 19 de octubre de 1872. Conservó la idea del patio gótico, pero lo cubrió con una espectacular cubierta de hierro y cristal.",
          "A finales del siglo XX, la actividad comercial se había trasladado a otros lugares y el edificio permaneció vacío unos veinte años. Tras una restauración a fondo volvió a abrir en 2019, ahora como espacio para eventos.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Echar un vistazo dentro",
        paragraphs: [
          "Según la propia Handelsbeurs, la sala de contratación está abierta al público los fines de semana y durante las vacaciones escolares, de 10:00 a 18:00, salvo cuando hay eventos. Entradas por la Twaalfmaandenstraat (desde la Meir) y la Borzestraat (desde la Lange Nieuwstraat).",
          "La web no indica si la visita es gratuita. Consulta la información actualizada y la lista de días de cierre antes de ir.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://handelsbeursantwerpen.be/en/bezoek-de-handelsbeurs/",
      },
    ],
    didYouKnow: [
      "La bolsa de Amberes se convirtió en un modelo en el extranjero. Cuando Thomas Gresham, agente de la corona inglesa en Amberes, fundó la Royal Exchange de Londres en la década de 1560, tomó como ejemplo la bolsa de Amberes.",
      "La Academia de Bellas Artes, que visitaremos más tarde, tuvo su primera sede en «la Bolsa de la Meir», y en el jardín de la Academia se conservan fragmentos de la bolsa del siglo XVI.",
    ],
    transitionToNext: "Camina hasta la Lange Nieuwstraat. La casa que buscas lleva el nombre de una ciudad italiana, y su puerta vino de otro lugar.",
  },

  // ── Gate 25 (+ vanished 24) ──────────────────────────────────────────
  "poortjes-lange-nieuwstraat": {
    name: "Lange Nieuwstraat 45",
    subtitle: "Bolonia la Grassa, y una puerta que se mudó",
    introduction: [
      "Busca la casa de comerciante con un alto hastial escalonado de catorce peldaños. Después fíjate en la puerta: una puerta de medio punto en un marco barroco de piedra azul, con una cartela que contiene un año.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Desde finales del siglo XVI, esta casa tradicional de comerciante de la segunda mitad de ese siglo se llama «Bolonia la Grassa», por la ciudad italiana de Bolonia. En ella se alojaron nobles españoles e italianos. En el siglo XVII vivió aquí el pintor Abraham van Diepenbeeck; su familia fue propietaria de la casa hasta el siglo XVIII. De 1828 a 1849, la viuda Helena Van Celst-Kums dirigió aquí una escuela de niñas y un orfanato.",
        ],
      },
      {
        heading: "Una puerta que se mudó",
        kind: "history",
        paragraphs: [
          "La puerta no pertenecía originalmente a esta casa. Smekens: «Procede de un edificio derribado de la Twaalfmaandenstraat». El inventario lo confirma y añade detalles: la puerta está «fechada en 1665 en una cartela» y en 1926 sustituyó a una reforma de la fachada del siglo XIX.",
          "La Twaalfmaandenstraat es la calle contigua a la Handelsbeurs, de donde acabas de venir.",
        ],
      },
    ],
    glossary: ["cartouche", "trapgevel"],
    thenAndNow: [
      "Antes: en 1951 la puerta solo llevaba 25 años aquí.",
      "Ahora: busca el año 1665 en la cartela. En 2014–2017 la casa se unió a la casa vecina Sint-Franciscus y se reformó en apartamentos.",
    ],
    didYouKnow: [
      "En la misma calle, en el número 36, Smekens dibujó otra puerta, de estilo Regencia, perteneciente a la gran mansión «De Keyser». Ha desaparecido.",
    ],
    transitionToNext: "Sigue hasta la Sint-Jacobskerk, la iglesia donde está enterrado Rubens.",
  },

  // ── St James ─────────────────────────────────────────────────────────
  "poortjes-sint-jacob": {
    name: "Sint-Jacobskerk (iglesia de Santiago)",
    subtitle: "La iglesia de los peregrinos, y de Rubens",
    introduction: [
      "Ante ti se alza una maciza torre oeste que nunca se terminó y una iglesia larga y sobria de estilo gótico brabanzón. El exterior es modesto. El interior es uno de los más ricos de la ciudad.",
    ],
    sections: [
      {
        heading: "De albergue de peregrinos a iglesia parroquial",
        kind: "history",
        paragraphs: [
          "En este lugar hubo un albergue para peregrinos que se dirigían a Santiago de Compostela (1404–1413). En 1478 su capilla se convirtió en iglesia parroquial. La iglesia actual se construyó en tres fases: a partir de 1491 con la torre, hasta que las obras se detuvieron por falta de dinero; de 1552 a 1566 con la nave y el crucero; y de 1602 a 1656 con el coro y las capillas que lo rodean.",
          "En la iglesia trabajaron maestros de obras conocidos: Herman de Waghemakere, su hijo Domien, el hermano de Domien, Herman, y a partir de 1525 Rombout Keldermans. A Domien de Waghemakere ya te lo has encontrado en la Oude Beurs, la Handelsbeurs y la catedral.",
        ],
      },
      {
        heading: "Gótico tardío, por fuera y por dentro",
        kind: "history",
        paragraphs: [
          "El inventario califica la iglesia de ejemplo del gótico brabanzón, con una característica y pesada torre oeste, una arquitectura exterior sobria y, en el interior, un triforio con pasarela. La torre inacabada tiene cinco cuerpos y está «sostenida por cuatro pesados contrafuertes angulares».",
          "Dentro, la imagen es completamente distinta: decenas de capillas de familias acaudaladas, altares barrocos, mármol y monumentos funerarios. En 1705, el papa Clemente XI concedió a la iglesia el título de «insigne colegiata».",
        ],
      },
      {
        heading: "Rubens",
        kind: "history",
        paragraphs: [
          "Pedro Pablo Rubens murió en 1640 y fue enterrado en esta iglesia. Su capilla funeraria se acondicionó en 1642. Sobre el altar cuelga una pintura del propio Rubens, «Nuestra Señora con santos», que el inventario fecha en 1634.",
          "En mayo de 2026, la ciudad anunció el final de una restauración de siete años. Según el comunicado de prensa, también se restauraron el retablo, el altar, el epitafio y los monumentos funerarios de la capilla de Rubens, que pueden visitarse de nuevo.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Echar un vistazo dentro",
        paragraphs: [
          "Según la ciudad de Amberes (comunicado de prensa del 13 de mayo de 2026), la iglesia puede «visitarse gratuitamente todos los días entre las 14:00 y las 17:00». Algunas fuentes más antiguas aún dicen que la capilla funeraria está cerrada hasta 2028; según el comunicado, vuelve a ser accesible. La iglesia puede estar cerrada durante los oficios y funerales. Las restauraciones menores continúan hasta 2028.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://pers.antwerpen.be/sint-jacobskerk-opnieuw-volledig-toegankelijk-na-7-jaar-restauratie",
      },
    ],
    didYouKnow: [
      "Durante la restauración se colocaron 426 650 pizarras nuevas en el tejado y se repararon 1738 m² de vidrieras.",
    ],
    lookAt: [
      {
        title: "La torre inacabada",
        body: "Mira hacia arriba, a la torre oeste. Su construcción empezó en 1491 y se detuvo por falta de dinero; la torre nunca recibió la aguja que viste en la catedral.",
      },
    ],
    transitionToNext: "Camina hasta la Keizerstraat, la calle de burgomaestres y pintores.",
  },

  // ── Gate 26 + Snijders&Rockox House (+ vanished 32) ──────────────────
  "poortjes-keizerstraat": {
    name: "Keizerstraat 10-16",
    subtitle: "Un burgomaestre, un pintor y una puerta llena de rocallas",
    introduction: [
      "Estás en una calle tranquila de casas señoriales. En el número 16, busca una pequeña puerta con una decoración caprichosa, en forma de conchas. Unas casas más allá, en el número 10–12, está la Snijders&Rockox Huis.",
    ],
    sections: [
      {
        heading: "Número 16: la puerta",
        kind: "history",
        paragraphs: [
          "El edificio consta de dos casas del siglo XVI unidas. La casa de la derecha tiene un hastial de volutas del gótico tardío de la primera mitad del siglo XVI; la de la izquierda, un hastial escalonado de la segunda mitad. Según el inventario, en el eje central hay una puerta del tercer cuarto del siglo XVIII: un «arco de medio punto con impostas, inscrito en un campo de arco rebajado, decorado con rocallas», con hoja de madera, montante de hierro forjado y un limpiabarros de hierro fundido.",
          "Smekens llama a la casa «De zwarte arend» (el águila negra); el inventario la llama hoy «De witte Lelie» (el lirio blanco). En 1830, el barón Philippe Antoine Joseph de Pret de ter Veken encargó al arquitecto Franciscus De Wolf la reforma de las fachadas. Es un hotel desde 1992–1993.",
        ],
      },
    ],
    cards: [
      {
        id: "card-rockox",
        title: "La Snijders&Rockox Huis",
        subtitle: "Posible parada museística: Keizerstraat 10-12",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "Nicolaas Rockox (1560–1640) fue burgomaestre de Amberes y un gran amante del arte. En 1603 compró dos casas contiguas y las hizo reconstruir; vivió en ellas con su esposa Adriana Perez. Como burgomaestre representaba a la ciudad ante las autoridades superiores y dirigía la milicia y las guardias cívicas.",
              "Su vecino era el pintor Frans Snijders (1579–1657). Él y su esposa Margriete de Vos vivieron en la casa «de Fortuyne» desde 1622. Snijders era conocido por sus bodegones, sus cuadros de animales y sus escenas de caza.",
              "En 1970, la Kredietbank compró la casa Rockox, que se convirtió en museo. Hoy las dos casas forman juntas la Snijders&Rockox Huis, con obras de Bruegel, Rubens y Van Dyck, entre otros.",
            ],
          },
        ],
        didYouKnow: [
          "El museo puede visitarse gratis el primer martes de cada mes.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visita al museo (opcional)",
        paragraphs: [
          "Abierto de martes a domingo, de 10:00 a 17:00; cerrado los lunes (salvo el lunes de Pascua y el lunes de Pentecostés), el 1 de enero, el 1 de mayo, el día de la Ascensión, el 1 de noviembre y el 25 de diciembre. Entrada: 10 €; gratuita para menores de 18 años y titulares del museumPASSmusées; gratuita para todos el primer martes de mes.",
          "La visita al museo es opcional; el paseo continúa después sin más.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.snijdersrockoxhuis.be/en/visit/plan-your-visit/opening-hours-prices",
      },
    ],
    glossary: ["rocaille", "lodewijk-stijlen"],
    thenAndNow: [
      "Antes: Smekens dibujó una «puerta en estilo Luis XV». Ese estilo se reconoce por sus formas asimétricas de conchas y rocas.",
      "Ahora: busca el limpiabarros, el pequeño borde de hierro para limpiarse los zapatos. ¿Aparece también en el dibujo?",
    ],
    didYouKnow: [
      "En la Paternosterstraat, cerca de esta calle, Smekens dibujó una pequeña puerta en estilo renacentista flamenco perteneciente a la casa «De gulden dolfeyn» (el delfín de oro), que según él ya se mencionaba en 1497. Ha desaparecido.",
    ],
    transitionToNext: "Camina hasta la Markgravestraat, una calle estrecha trazada hacia 1500.",
  },

  // ── Gate 27 ───────────────────────────────────────────────────────────
  "poortjes-markgravestraat": {
    name: "Markgravestraat 14",
    subtitle: "Una calle a través de la finca de un margrave",
    introduction: [
      "En esta calle estrecha, busca el número 14 y la puerta del libro. Compara el marco con el dibujo: las proporciones del arco, las pilastras y el remate.",
    ],
    sections: [
      {
        heading: "La calle",
        kind: "history",
        paragraphs: [
          "La Markgravestraat se trazó hacia 1500 y lleva el nombre del margrave Jan van Immerseel (siglos XV–XVI), a través de cuya propiedad se abrió la calle. Es una calle estrecha con casas de diversos estilos, con hastiales apuntados y escalonados.",
        ],
      },
      {
        heading: "La puerta",
        kind: "history",
        paragraphs: [
          "De esta puerta Smekens solo escribe: «Puerta renacentista. Markgravestraat 14». No hemos encontrado una ficha propia en el inventario. Poco se sabe con certeza sobre la función original de esta puerta en concreto. [Investigación histórica pendiente]",
        ],
      },
    ],
    thenAndNow: [
      "Antes: una puerta sin historia en el libro, solo un dibujo.",
      "Ahora: compáralo tú mismo. ¿Sigue coincidiendo el dibujo con lo que ves?",
    ],
    didYouKnow: [
      "El nombre de la calle no alude a un título en general, sino a una persona: el margrave Jan van Immerseel, a través de cuya finca se abrió la calle.",
    ],
    transitionToNext: "Camina hasta la Koningstraat. Busca allí a tres reyes.",
  },

  // ── Gate 29 (+ vanished 28 and 31) ───────────────────────────────────
  "poortjes-koningstraat": {
    name: "Koningstraat 17",
    subtitle: "De Drij Koningen (Los Tres Reyes)",
    introduction: [
      "Busca el hastial escalonado con una pequeña puerta de piedra azul en el vano de la derecha. Sobre la puerta hay un pequeño ventanuco redondo, rodeado de follaje.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "Smekens escribe que la casa «De Drie Koningen» «ya se mencionaba en 1549»; el inventario dice «ya mencionada a finales del siglo XVI». En 1881 la fachada se restauró a fondo bajo la dirección de los arquitectos Léonard y Henri Blomme.",
          "La puerta es más reciente que la casa. Smekens: «Data de 1716».",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "El inventario describe una «pequeña portada de piedra azul en estilo barroco tardío fechada en 1716»: «una puerta con arco de hombros en un marco moldurado, flanqueada por pilastras de fustes rehundidos y capiteles de volutas». Sobre la puerta hay un óculo, una ventana redonda, rodeado de follaje decorativo. Smekens la llama «puerta Luis XIV».",
        ],
      },
    ],
    glossary: ["schouderboog", "lodewijk-stijlen"],
    thenAndNow: [
      "Antes: Smekens dibujó la puerta con su ventana redonda.",
      "Ahora: busca el año 1716.",
    ],
    didYouKnow: [
      "En la misma calle, en el número 14, Smekens dibujó otra puerta del siglo XVIII, perteneciente a la casa «De witte koning» (el rey blanco). Ha desaparecido.",
      "La puerta de la cercana Gratiekapelstraat ya había desaparecido cuando se publicó el libro: Smekens escribe que había sido «simplemente arrancada por vándalos hace unos años».",
    ],
    transitionToNext: "Camina hasta la Prinsstraat, al viejo corazón de la universidad.",
  },

  // ── University ───────────────────────────────────────────────────────
  "poortjes-universiteit": {
    name: "Stadscampus y Hof van Liere",
    subtitle: "El palacio de un burgomaestre convertido en universidad",
    introduction: [
      "Tras las fachadas de la Prinsstraat se encuentra el campus urbano (Stadscampus) de la Universidad de Amberes. Su corazón es el Hof van Liere, un palacio del gótico tardío con patio, galerías y un pozo.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "«Esta residencia principesca se construyó en 1516 para el entonces burgomaestre de Amberes Aert van Liere», en estilo gótico brabanzón, escribe la universidad. Tras su muerte, la propiedad pasó a la ciudad, que la cedió a una familia de banqueros milaneses y más tarde a la Nación Inglesa, la asociación de comerciantes ingleses.",
          "Los jesuitas, que fundaron un colegio de secundaria en Amberes en 1575, ampliaron el conjunto y lo acondicionaron como internado. Tras la supresión de su orden, se convirtió en academia militar y en hospital.",
          "En 1929 volvieron los jesuitas: su escuela de comercio Sint-Ignatius encontró aquí una nueva sede. En 1988, las Universitaire Faculteiten Sint-Ignatius (UFSIA) compraron el Prinsenhof, y en 2003 las universidades de Amberes se fusionaron en la Universidad de Amberes.",
        ],
      },
      {
        heading: "Alrededor",
        kind: "history",
        paragraphs: [
          "El campus incluye también el convento de las Hermanas Grises en la Lange Sint-Annastraat, construido en 1887 según un diseño de Frans Baeckelmans. Según la universidad, las hermanas cuidaban a los enfermos de peste. Después de 1999 se reformó, con arquitectura moderna insertada en el entorno histórico.",
          "Según la universidad, el jardín del Hof van Liere recibió un nuevo aspecto en 1998 de la mano del paisajista Wirtz.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Acceso",
        paragraphs: [
          "El campus es una universidad en funcionamiento, no un museo. No hemos encontrado información oficial sobre el libre acceso al patio y al jardín. Si la puerta está abierta, echa un vistazo tranquilamente y respeta a estudiantes y personal; si está cerrada, la fachada de la Prinsstraat también merece la pena. [Acceso por verificar]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    didYouKnow: [
      "Los comerciantes ingleses tuvieron gran importancia en la Amberes del siglo XVI: la Nación Inglesa tuvo aquí su sede durante un tiempo y, según Smekens, la ciudad hizo construir en 1550 una pequeña bolsa «en beneficio de los comerciantes ingleses».",
    ],
    transitionToNext: "Ahora puedes elegir: un breve desvío hasta dos puertas de la Rodestraat, o seguir directamente hasta la Stadswaag.",
  },

  // ── Gates 33 and 34: optional ────────────────────────────────────────
  "poortjes-rodestraat": {
    name: "Rodestraat 43 y 44",
    subtitle: "Extra: dos puertas cerca del Begijnhof",
    introduction: [
      "Bienvenido al desvío. En la Rodestraat, Smekens dibujó dos puertas situadas casi una frente a otra: una pequeña puerta renacentista en la casa parroquial del Begijnhof (el beaterio, número 43) y un portón de carruajes (número 44).",
    ],
    sections: [
      {
        heading: "Lo que dice el libro",
        kind: "history",
        paragraphs: [
          "Sobre el número 43, Smekens solo escribe: «Pequeña puerta renacentista en la casa parroquial del Begijnhof». Sobre el número 44: «Construida hacia 1725 en puro estilo Luis XV».",
          "Todavía no hemos podido investigar nosotros mismos estas dos puertas. Hay que comprobar in situ si siguen existiendo hoy y en qué estado. [Investigación histórica pendiente]",
        ],
      },
      {
        heading: "Un portón de carruajes",
        kind: "context",
        paragraphs: [
          "Un portón de carruajes es más ancho que una puerta corriente: tenía que dejar pasar un coche de caballos o un carro hasta un patio. Se reconoce por su anchura y, a menudo, por guardacantones de piedra o de hierro en la parte inferior.",
        ],
      },
    ],
    glossary: ["lodewijk-stijlen"],
    thenAndNow: [
      "Antes: dos puertas, fechadas en los siglos XVI–XVII (43) y hacia 1725 (44).",
      "Ahora: compara ambas con los dibujos. Tus observaciones nos ayudan a completar esta parada.",
    ],
    didYouKnow: [
      "El año 1725 y el estilo «Luis XV» son palabras del propio Smekens. Como has visto por el camino, los nombres de estilos y las fechas pueden resultar distintos en estudios posteriores.",
    ],
    transitionToNext: "Vuelve a la Stadswaag: la plaza del hombre que mandó trazar media ciudad norte.",
  },

  // ── Gate 35 (+ vanished 30) ──────────────────────────────────────────
  "poortjes-stadswaag": {
    name: "La Stadswaag",
    subtitle: "Donde se pesaba y gravaba el comercio",
    introduction: [
      "Estás en una plaza sin el edificio que le dio nombre. Aquí se alzaba la báscula pública de la ciudad (stadswaag). En la plaza, busca el número 13 con la puerta del libro: una pequeña puerta del Renacimiento tardío con montante.",
    ],
    sections: [
      {
        heading: "¿Qué es una báscula pública?",
        kind: "history",
        paragraphs: [
          "Una báscula pública (waag) era un puesto oficial de pesaje. Según el inventario, la de Amberes era «una especie de oficina de impuestos donde las mercancías se pesaban y se gravaban en proporción». Quien comerciaba con mercancías las hacía pesar aquí oficialmente: así el comprador sabía lo que recibía y la ciudad sabía lo que podía gravar.",
          "El edificio tenía también «varias salas ricamente decoradas donde se celebraban banquetes de boda».",
        ],
      },
      {
        heading: "Gilbert van Schoonbeke",
        kind: "history",
        paragraphs: [
          "La plaza y las calles que la rodean fueron trazadas en 1548 por Gilbert van Schoonbeke, un promotor inmobiliario antes de que existiera la palabra. Por una escritura del 6 de mayo de 1547 compró el terreno a la ciudad por 31 000 florines carolinos. Derribó los edificios existentes y construyó «la nueva báscula».",
          "También trazó tres calles: la Noord-, Oost- y Weststraat (calle Norte, Este y Oeste), más tarde rebautizadas como Hoornstraat, Brilstraat y Raapstraat. El nombre «Stadswaag» para la plaza data de hacia 1800.",
          "Ya te has encontrado con Van Schoonbeke: también mandó construir las cervecerías de la Brouwersstraat, de donde proceden varias puertas del libro.",
        ],
      },
      {
        heading: "El fin de la báscula",
        kind: "history",
        paragraphs: [
          "El 25 de agosto de 1873, durante una violenta tormenta, cayó un rayo. El edificio se incendió y ardió por completo en pocas horas. La ciudad convirtió entonces el solar en una plaza pública. En septiembre de 1914, la Stadswaag volvió a ser noticia cuando la alcanzó una bomba lanzada desde un zepelín.",
          "En la década de 1960, los artistas descubrieron el barrio y se convirtió en una zona de ocio nocturno. La plaza se rediseñó en 1998.",
        ],
      },
    ],
    glossary: ["waaier", "ijkdienst"],
    thenAndNow: [
      "Antes: en 1951 la báscula llevaba casi ochenta años desaparecida. Smekens dibujó la puerta del número 13 sin más explicación.",
      "Ahora: encuentra el número 13 y compara el montante con el dibujo. [Estado actual de esta puerta por verificar in situ]",
    ],
    didYouKnow: [
      "En la Raapstraat (calle del Nabo), una de las calles de Van Schoonbeke, Smekens dibujó una pequeña puerta con «un nabo como motivo» en la venera sobre la puerta. Un nabo en la calle del Nabo: por desgracia, la puerta ha desaparecido.",
      "Tras el incendio de 1873, la oficina oficial de pesas y medidas se instaló provisionalmente en la casa De Clocke de la Lange Noordstraat. Verás esa casa y su puerta más adelante en el paseo.",
    ],
    transitionToNext: "Camina hasta la Mutsaardstraat. Frente a la Academia se alza una puerta monumental.",
  },

  // ── Gate 36 ───────────────────────────────────────────────────────────
  "poortjes-mutsaardstraat": {
    name: "Mutsaardstraat 30-32",
    subtitle: "La casa de un canciller",
    introduction: [
      "En la Mutsaardstraat, busca una ancha fachada de arenisca con un cuerpo central barroco y un frontón partido. Fíjate en la puerta monumental. Compara también los números 30 y 32.",
    ],
    sections: [
      {
        heading: "La historia",
        kind: "history",
        paragraphs: [
          "En «Mutsaertstraat 30», Smekens escribe: «Perteneció a la casa de Schockaert, concejal de la ciudad y canciller de Brabante». El inventario sitúa hoy la mansión barroca de Jan Daniël Antoon Schockaert, canciller del ducado de Brabante desde 1739, en Mutsaardstraat 32. Según el inventario, el número 30 es la casa «De Draeck» (el dragón).",
          "La mansión fue construida en el tercer cuarto del siglo XVII por la familia Van den Kerckhoven. El 16 de diciembre de 1944 resultó gravemente dañada por una bomba V. En 1956–1957 se transformó en tiendas, oficinas y apartamentos; la fachada principal está protegida desde 1958.",
        ],
      },
      {
        heading: "Arquitectura",
        kind: "history",
        paragraphs: [
          "La fachada de ocho vanos tiene un paramento de arenisca y un cuerpo central saliente barroco con un «frontón partido con remate ornamental». Según el inventario, la puerta tiene un «derrame moldurado y almohadillado sobre pilastras jónicas» y una cartela decorativa.",
        ],
      },
    ],
    glossary: ["fronton", "beloop"],
    thenAndNow: [
      "Antes: Smekens vio la puerta pocos años después de los daños de la bomba V de 1944 y antes de la transformación de 1956–1957.",
      "Ahora: ¿a qué número pertenece hoy la puerta del dibujo, al 30 o al 32? [Por verificar in situ]",
    ],
    didYouKnow: [
      "Amberes sufrió duramente las bombas V en 1944–1945. Esta casa es uno de los muchos edificios dañados en aquella época.",
    ],
    transitionToNext: "Cruza hasta la Academia, en el número 31. Tras la verja se encuentra un jardín con cinco puertas que ya no están en ningún otro lugar.",
  },

  // ── Gates 37–41: Academy garden ──────────────────────────────────────
  "poortjes-academie": {
    name: "La Academia y su jardín",
    subtitle: "Cinco puertas sin casa",
    introduction: [
      "Estás en la Real Academia de Bellas Artes (Koninklijke Academie voor Schone Kunsten), una de las escuelas de arte más antiguas de Bélgica. Tras el pabellón de entrada se encuentra el jardín de la Academia, y en él hay puertas y fragmentos de fachadas de edificios que han desaparecido en otros puntos de la ciudad.",
      "Smekens dibujó cinco de ellas. Más abajo puedes buscarlas una a una.",
    ],
    searchTask: {
      title: "Encuentra las cinco puertas del jardín",
      intro: "Cada una de estas puertas procede de otro lugar de Amberes. Búscalas en el jardín y compáralas con el dibujo. No es una competición: si no encuentras alguna, simplemente mira la solución.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 19,
          question: "La puerta de «Het Klaverblad» (El Trébol). ¿De dónde procede?",
          hints: ["Fíjate en la clave: ¿qué planta ves en ella?", "En la clave también hay un año."],
          solution: "De la antigua Klaverstraat, hoy Haverstraat.",
          explanation: [
            "Según el inventario, se trata de una «pequeña puerta de medio punto de piedra azul» de «het Klaverblad» en la Haverstraat, con el año 1663 en la clave y un motivo de trébol. Casualidad o no: 1663 es también el año de fundación de la Academia.",
          ],
        },
        {
          plate: 21,
          question: "La puerta con un busto encima. ¿Quién es?",
          hints: ["El busto representa al fundador de la Academia.", "Era pintor, y su padre se llamaba igual."],
          solution: "David Teniers el Joven, en una puerta de la casa «De Gans» (La Oca) de la Zakstraat.",
          explanation: [
            "Smekens: «En la hornacina, un busto de David Teniers el Joven, el pintor que fundó la Academia en 1663. Originalmente este busto no pertenecía a esta hornacina». Así pues, la puerta y el busto se unieron: un buen ejemplo de cómo se recombinaron piezas antiguas en el jardín.",
          ],
        },
        {
          plate: 33,
          question: "El gran marco de puerta con letras en un medallón. ¿A qué negocio perteneció?",
          hints: ["Busca tres letras en el medallón de la parte superior.", "El escudo que las acompaña pertenece al oficio que volverás a encontrar en la Adriaan Brouwerstraat."],
          solution: "La cervecería Van Pruyssen, con las letras C.V.P. y el escudo del gremio de cerveceros.",
          explanation: [
            "Smekens indica como procedencia la Brouwersstraat, la actual Adriaan Brouwerstraat. El inventario menciona en el jardín una hoja de madera de medio punto procedente del «Oosters Huis» (Casa de los Orientales), colocada en el marco de piedra azul de la cervecería Van Pruyssen, con las iniciales CVP y emblemas de cerveceros.",
          ],
        },
        {
          plate: 34,
          question: "La gran puerta con mainel central tallado. ¿De qué casa procede?",
          hints: ["El mainel central entre las hojas de la puerta se llama «makelaar».", "La casa tenía un nombre religioso, y hay una inscripción en la puerta."],
          solution: "De la casa «De Heilige Drievuldigheid» (La Santísima Trinidad) del Kipdorp.",
          explanation: [
            "Smekens: la casa «dejó paso a los almacenes A la Vierge noire (Kipdorp)». El inventario describe en el jardín una hoja de madera con la inscripción «In de Heyliche Dryvuldicheidt», de 1636.",
          ],
        },
        {
          plate: 37,
          question: "La gran puerta con montante de hierro. ¿A qué convento perteneció?",
          hints: ["Fíjate bien en el hierro forjado del montante: lleva dos letras trabajadas."],
          solution: "El desaparecido convento de los Cellebroeders (hermanos alexianos): las letras C.B.",
          explanation: [
            "Smekens: «Del derribado convento de los Cellebroeders, con las letras C. B. (Cellebroeders) trabajadas en la herrería del montante».",
            "Todavía no hemos registrado in situ dónde está exactamente cada puerta en el jardín. [Por verificar in situ]",
          ],
        },
      ],
    },
    sections: [
      {
        heading: "La escuela de arte más antigua del país",
        kind: "history",
        paragraphs: [
          "La Academia se fundó en 1663 por iniciativa del pintor David Teniers, con el permiso del rey Felipe IV. Su primera sede fue la Bolsa de la Meir. En 1811 se trasladó al antiguo convento franciscano de aquí, en la Mutsaardstraat.",
          "Los franciscanos se habían establecido en Amberes en 1446. Su convento fue destruido en la furia iconoclasta de 1566 y reconstruido tras su regreso en 1585. En 1797, bajo el dominio francés, tuvieron que marcharse.",
        ],
      },
      {
        heading: "Edificios y jardín",
        kind: "history",
        paragraphs: [
          "El arquitecto municipal Pierre Bruno Bourla diseñó los edificios más antiguos de la Academia: entre otros, una casa para el director (1823–1824), salas de exposición y, en 1841, el pabellón de entrada con verja de hierro y un museo con un frente de templo clásico. Después de la guerra se añadió un ala con aulas y talleres según un diseño de Ferdinand Peeters (1953). En 1963, Renaat Braem pintó un mural en la caja de escalera.",
          "El jardín sigue «un plano simétrico que parte del pabellón de entrada» y se rediseñó en 1905 según un proyecto del arquitecto Emiel Van Averbeke. Alberga estatuas de David Teniers, Mathias Van Bree, Quinten Matsijs y san Lucas, y fragmentos de la bolsa del siglo XVI.",
        ],
      },
      {
        heading: "¿Por qué hay puertas aquí?",
        kind: "interpretation",
        paragraphs: [
          "El inventario describe las puertas como «elementos de portada recuperados de edificios antuerpienses desaparecidos». No hemos podido averiguar quién decidió exactamente colocarlas aquí, ni por qué. Parece lógico que se quisieran salvar piezas valiosas de edificios derribados, y que una escuela de arte con un jardín cerrado fuera un lugar adecuado para ellas, también como material didáctico. Pero eso es una interpretación, no un hecho documentado.",
        ],
      },
      {
        heading: "Artistas de la Academia",
        kind: "history",
        paragraphs: [
          "A lo largo de los siglos estudiaron aquí artistas como Lawrence Alma-Tadema, Ford Madox Brown y Henry van de Velde. El departamento de moda, fundado en 1963, alcanzó fama mundial en los años ochenta gracias a «los Seis de Amberes», entre ellos Dries Van Noten, Ann Demeulemeester y Walter Van Beirendonck. Hoy la Academia forma parte de la AP Hogeschool (escuela superior de ciencias aplicadas y artes).",
        ],
      },
    ],
    cards: [
      {
        id: "card-van-gogh",
        title: "Vincent van Gogh en Amberes",
        subtitle: "Tres meses, de noviembre de 1885 a febrero de 1886",
        sections: [
          {
            kind: "history",
            paragraphs: [
              "A finales de noviembre de 1885, Vincent van Gogh llegó a Amberes procedente de Nuenen. Alquiló una pequeña habitación en la Lange Beeldekensstraat, en el barrio obrero de Stuivenberg.",
              "En enero de 1886 se matriculó en la Academia, sobre todo para aprender a pintar con modelos del natural. Tomó clases de dibujo a partir de vaciados de yeso de estatuas antiguas con Frans Vinck y más tarde con Eugène Siberdt, y probó la clase de pintura de Charles Verlat.",
              "No le fue bien. Su estilo espontáneo y enérgico chocaba con el estricto sistema académico y, tras un conflicto con Siberdt, lo devolvieron a una clase inferior. La noticia no le llegó hasta después de su partida: el 28 de febrero de 1886 se marchó a París para reunirse con su hermano Theo.",
            ],
          },
          {
            heading: "Lo que sabemos, y lo que no",
            kind: "context",
            paragraphs: [
              "Su estancia en Amberes duró unos tres meses; su paso por la Academia, menos de dos. El museo KMSKA da el 24 de noviembre de 1885 como fecha de llegada; otras fuentes hablan de unos días más tarde. Por eso decimos «a finales de noviembre».",
            ],
          },
        ],
        didYouKnow: [
          "El hombre al que en Amberes relegaron a una clase inferior es hoy el alumno más famoso que ha tenido nunca la Academia.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "access",
        title: "Acceso al jardín",
        paragraphs: [
          "El jardín de la Academia forma parte del campus de la Academia y no es un parque público. No hemos encontrado un horario oficial. Si la verja está abierta, entra sin hacer ruido; si está cerrada, puedes ver parte del jardín a través de ella. [Acceso por verificar con la Academia]",
        ],
        checkedOn: "2026-09-26",
      },
    ],
    glossary: ["makelaar", "waaier", "sluitsteen"],
    didYouKnow: [
      "El jardín de la Academia está protegido como paisaje histórico-cultural desde 1974.",
    ],
    transitionToNext: "Fin de la tercera parte. Camina hacia el norte, hacia la Falconplein: aquí la ciudad se convierte en ciudad portuaria.",
  },
};
