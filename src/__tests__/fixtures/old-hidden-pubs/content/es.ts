import type { HiddenPubsContent } from "./types";

/**
 * Hidden Pubs: Spanish text, translated from the English master (en.ts).
 * The ledger `translation` fields translate the Dutch ledger text in the
 * stop files.
 *
 * Rules (see CLAUDE.md):
 * - `story` is FICTION (the Lost Tavern Ledger); `historicalReveal` is real
 *   history only. Never invent facts, drinks or answers.
 * - Café names, street names and brand names are never translated.
 * - Progress never depends on drinking; no shots, no drinking challenges.
 */
export const hiddenPubsContentEs: HiddenPubsContent = {
  walk: {
    tagline: "La historia oculta de los bares de Amberes",
    shortDescription:
      "Una aventura en equipo por ocho cafés de Amberes. Votad las bebidas, resolved retos sobre el terreno y recuperad las páginas de un libro de cuentas perdido de una taberna.",
    description:
      "Ha reaparecido un viejo libro de cuentas de una taberna, y le faltan ocho fragmentos. Vuestro equipo recorre el corazón de Amberes de café en café. En cada parada votáis la bebida del equipo, leéis una página del libro y resolvéis un reto que solo se puede descifrar en el lugar. Solo entonces descubrís la historia que se esconde tras lo que habéis encontrado, y el libro revela el siguiente café.\n\nEl alcohol nunca es obligatorio. Cada votación incluye una opción sin alcohol, cada uno puede elegir siempre su propia bebida y podéis saltaros cualquier ronda.",
    copy: {
      voteResultTitle: "La taberna ha hablado",
      tieTitle: "¡Empate!",
      tieSubtitle: "El libro de cuentas debe decidir…",
      afterVoteMessage: "Pedid vuestra bebida, tomaos vuestro tiempo y mirad a vuestro alrededor.",
      wrongAnswer: "El libro de cuentas guarda silencio.",
      correctAnswer: "La tinta empieza a moverse…",
      nextLocationTitle: "El libro de cuentas revela otro nombre…",
      completionTitle: "Caso cerrado",
      completionMessage: "Amberes ha revelado uno de sus secretos.",
      clueCollectedTitle: "El libro de cuentas ha cambiado",
      locationsTitle: "Tabernas",
      locationsDiscoveredLabel: "tabernas descubiertas",
      routeButtonLabel: "Libro de cuentas",
    },
    narrative: {
      title: "El libro de cuentas perdido de la taberna",
      premise:
        "Ha reaparecido un viejo libro de cuentas de una taberna. La mayoría de los nombres se han borrado y faltan ocho fragmentos. Seguid la pista de café en café, recuperad lo que se perdió y descubrid a quién pertenecía el libro.",
    },
    highlights: [
      "Ocho cafés de Amberes",
      "Un misterio para resolver en equipo",
      "Retos que solo se resuelven sobre el terreno",
      "La historia real de lo que descubrís",
      "Votaciones de bebidas en equipo, siempre con una opción sin alcohol",
      "Un enigma final que pone a prueba lo que recordáis",
    ],
    howItWorksSteps: [
      "Llegad al café",
      "Votad la bebida del equipo",
      "Leed una página del libro de cuentas",
      "Resolved el reto sobre el terreno",
      "Descubrid la historia y conseguid la pista",
      "Resolved el misterio final",
    ],
    practicalInfo: [
      { label: "Equipo", value: "De 1 a 6 jugadores, con un solo móvil" },
      { label: "Edad recomendada", value: "18+ (por la temática de bares)" },
      {
        label: "Alcohol",
        value: "Nunca es obligatorio. Cada votación incluye una opción sin alcohol y cada uno puede elegir su propia bebida.",
      },
      {
        label: "Votaciones de bebidas",
        value: "La votación del equipo es una sugerencia. Podéis saltaros cualquier ronda; el progreso nunca depende de lo que pidáis.",
      },
    ],
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "pubs-rococo": {
      description: "Capítulo I: La primera página.",
      drinks: ["Cóctel Lazy Red Cheeks", "Super 8 IPA", "Tongerlo Blond", "Tónica"],
      story: [
        {
          chapterTitle: "La primera página",
          body: "Os han entregado un viejo libro de cuentas de una taberna, muy deteriorado. Casi toda la primera página ha desaparecido. Solo queda una frase:",
        },
        { translation: "«Quien quiera entender Amberes debe mirar hacia arriba.\nNo todo lo que parece antiguo es lo que parece»." },
        { translation: "«Buscad al Ángel al otro lado de la plaza»." },
      ],
      challenge: {
        title: "Mirad hacia arriba",
        instruction: "Salid y mirad el edificio que hay encima de Rococo.",
        question: "¿Qué forma tiene la parte superior de la fachada?",
        options: ["Escalonada", "Redondeada", "Plana", "Triangular"],
        hints: ["Alejaos lo suficiente para ver el edificio entero.", "Seguid el contorno de la fachada contra el cielo."],
        explanation: "Escalonada, como una escalera que sube hacia el cielo.",
      },
      historicalReveal: {
        paragraphs: [
          "La historia de este edificio todavía está por investigar. De momento, recordad la forma que acabáis de encontrar.",
        ],
        sources: [],
      },
      clue: { title: "I · La primera página", value: "LA ESCALERA" },
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "pubs-den-engel": {
      description: "Capítulo II: Las doce menos cinco.",
      drinks: ["Bolleke", "Stella", "Coca-Cola", "Cerveza sin alcohol"],
      story: [
        {
          chapterTitle: "Las doce menos cinco",
          translation:
            "«El Ángel conocía mi nombre.\n\nPero ni siquiera el Ángel pudo detener el tiempo.\n\nCuando el reloj avance cinco minutos,\ntodo estará perdido».",
        },
        { translation: "«Quedan cinco minutos.\n\nBuscad a los padres bajo la torre»." },
      ],
      challenge: {
        title: "La hora congelada",
        instruction: "Buscad el gran reloj tan peculiar que hay dentro del Café Den Engel.",
        question: "¿A qué hora se ha parado el reloj?",
        hints: ["No miréis la hora en el móvil.", "Buscad el gran reloj dentro del café."],
        explanation: "Las doce menos cinco, y así seguirá.",
      },
      historicalReveal: {
        paragraphs: [
          "El nombre Den Engel («El Ángel») se remonta al siglo XIV.",
          "A lo largo de los siglos, el edificio tuvo varios usos. En 1740 albergaba un negocio vinculado a un droguero o boticario, y en la fachada todavía queda una referencia a ello.",
          "El café actual data de principios del siglo XX.",
          "Su gran reloj está parado para siempre a las doce menos cinco. Según el propio Café Den Engel, el reloj parado inspiró un vínculo con Cenicienta: a medianoche se acaba la magia, así que, a las doce menos cinco, la fiesta nunca llega a la medianoche.",
        ],
        sources: ["Café Den Engel (historia propia)"],
      },
      clue: { title: "II · Las doce menos cinco", value: "11:55" },
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "pubs-paters-vaetje": {
      description: "Capítulo III: Bajo la catedral.",
      drinks: ["Fanta", "Lucy Beer", "Gulden Carolus Whisky Infused", "Seef Beer"],
      story: [
        {
          chapterTitle: "Bajo la catedral",
          translation:
            "«La página siguiente estaba dañada.\n\nEl autor huyó a la sombra de la catedral.\n\nEscribió:\n\nAquí hasta la piedra intenta alcanzar el cielo».",
        },
        {
          translation: "«Una torre.\n\nUna dirección.\n\nPero ningún sonido.\n\nBuscad ahora el lugar donde Amberes recuperó su voz».",
        },
      ],
      challenge: {
        title: "El gigante",
        instruction: "Salid. Colocaos cerca de Paters Vaetje y observad con atención la catedral de Nuestra Señora (Onze-Lieve-Vrouwekathedraal).",
        question: "¿Cuántas grandes torres completamente terminadas tiene la catedral?",
        options: ["1", "2", "3", "4"],
        hints: [
          "Comparad el lado izquierdo y el derecho de la fachada de la catedral.",
          "Contad solo las torres que alcanzan su altura completa.",
        ],
        explanation: "Una. El gigante está solo.",
      },
      historicalReveal: {
        paragraphs: [
          "La catedral de Nuestra Señora de Amberes es famosa por su imponente torre norte.",
          "El diseño original preveía dos grandes torres en la fachada occidental, pero la torre sur nunca llegó a completarse hasta la misma altura.",
        ],
        sources: [],
      },
      clue: { title: "III · Bajo la catedral", value: "UNA TORRE" },
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "pubs-de-muze": {
      description: "Capítulo IV: La Musa.",
      drinks: ["Cristal", "Lupulus", "Sprite", "La Chouffe"],
      story: [
        {
          chapterTitle: "La Musa",
          translation:
            "«Oí música.\n\nNo de un órgano de iglesia.\n\nNo de la calle.\n\nUna Musa me llamó a entrar.\n\nSobre los bebedores vi un animal\nque nunca se movía».",
        },
        { translation: "«El caballo me vio marchar.\n\nPero otro animal seguía cada uno de mis pasos»." },
      ],
      challenge: {
        title: "El guardián",
        instruction: "Mirad con atención encima de la barra.",
        question: "¿Qué animal vigila De Muze?",
        hints: ["La respuesta es un animal.", "Mirad encima de la barra."],
        explanation: "Un caballo, y lleva mucho tiempo vigilando a los bebedores.",
      },
      historicalReveal: {
        paragraphs: [
          "De Muze abrió a finales de octubre de 1964, fundado por Walter Masselis y Tone Pauwels. Pronto pasó a formar parte de la escena artística de Amberes.",
          "Ferre Grignard actuaba aquí con regularidad, y el 15 de noviembre de 1965 presentó su primer disco en De Muze. Más tarde también tocaron aquí artistas internacionales como John Lee Hooker y Dexter Gordon.",
          "En 1967, un incendio dañó la primera y la segunda planta. Más adelante se instaló sobre la barra la obra conocida como «het Muzepaard» (el caballo de la Musa), de Luc Maeyens: el caballo que acabáis de encontrar.",
        ],
        sources: [],
      },
      clue: { title: "IV · La Musa", value: "EL CABALLO" },
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "pubs-de-kat": {
      description: "Capítulo V: Nueve vidas.",
      drinks: ["Bolleke", "Stella", "Cerveza sin alcohol", "Agua"],
      story: [
        {
          chapterTitle: "Nueve vidas",
          translation:
            "«Creía que nadie me había seguido.\n\nEntonces vi dos ojos en la oscuridad.\n\nUn gato no olvida nada.\n\nPero un gato solo cuenta su secreto\na quien mira con atención».",
        },
        {
          translation:
            "«El gato me llevó a una casa\nmás antigua que mi historia.\n\nAllí unos hombres jugaban a un juego\nque vosotros casi habéis olvidado».",
        },
      ],
      challenge: {
        title: "Nueve vidas",
        instruction:
          "Buscad en el café representaciones de gatos. Cuadros, estatuas, fotografías y cualquier otra imagen clara de un gato cuentan.",
        question: "¿Cuántos gatos encontráis?",
        hints: ["Revisad las paredes, las estanterías y la barra.", "Cuadros, estatuas y fotos: todo cuenta."],
        explanation: "Nueve, uno por cada vida.",
      },
      historicalReveal: {
        paragraphs: [
          "De Kat es un café marrón (bruin café) tradicional de Amberes, conocido como café de artistas.",
          "El propio edificio tiene una historia constructiva más antigua y documentada. Esa es una historia distinta de la del café: cuánto tiempo lleva existiendo el café actual está aún por investigar.",
        ],
        sources: [],
      },
      clue: { title: "V · Nueve vidas", value: "NUEVE VIDAS" },
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "pubs-quinten-matsijs": {
      description: "Capítulo VI: El juego olvidado.",
      drinks: ["Maredsous Tripel 10", "Trappist Orval", "Chimay Blue", "Batido de chocolate"],
      story: [
        {
          chapterTitle: "El juego olvidado",
          translation:
            "«Los hombres de la mesa conocían mi secreto.\n\nNo tenían cartas delante.\n\nNi dados.\n\nSolo un juego al que ya se jugaba\nantes de que nacieran sus abuelos».",
        },
        { translation: "«Bajo el signo del barril encontré un nombre.\n\nPero no un nombre humano…»" },
      ],
      challenge: {
        title: "El juego olvidado",
        instruction: "Buscad en el café un antiguo juego tradicional.",
        question: "¿Qué tipo de juego histórico encontráis aquí?",
        hints: ["Buscáis un juego antiguo.", "Buscad algo que tenga que ver con un barril."],
        explanation: "El tonspel (el juego del barril): un juego más antiguo que cualquiera de los que están a la mesa.",
      },
      bonusChallenge: {
        title: "Bonus: el antiguo nombre",
        question: "¿Qué nombre histórico se asocia con esta taberna?",
        hints: [],
      },
      historicalReveal: {
        paragraphs: [
          "Este café histórico ocupa un edificio con una larga historia, y su interior está lleno de objetos antiguos.",
          "Se dice que el tonspel que acabáis de encontrar tiene unos 250 años.",
          "La taberna se asocia con el nombre histórico 't Gulick.",
        ],
        sources: [],
      },
      clue: { title: "VI · El juego olvidado", value: "EL BARRIL" },
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "pubs-de-varkenspoot": {
      description: "Capítulo VII: La marca perdida.",
      drinks: ["Omer", "Hoegaarden Wit", "Kasteel Rouge", "Agua con gas"],
      story: [
        {
          chapterTitle: "La marca perdida",
          translation:
            "«Sabía que estaban cerca.\n\nArranqué la última página del libro de cuentas.\n\nNo debían encontrar mi nombre.\n\nSolo dejé mi marca».",
        },
        { body: "Las últimas líneas se escribieron a toda prisa." },
        {
          translation:
            "«Si estás leyendo esto,\nhas encontrado siete marcas.\n\nLlévalas al Granjero.\n\nAllí te espera la última página».",
        },
      ],
      challenge: {
        title: "La marca del cerdo",
        instruction: "Buscad dentro o alrededor de De Varkenspoot la referencia visual más clara a un cerdo.",
        question: "¿Qué forma tiene la referencia al cerdo?",
        options: ["Cuadro", "Estatua", "Letrero", "Vidrio"],
        hints: ["Mirad dentro y alrededor de la entrada.", "No es plana."],
        explanation: "El cerdo ha dejado su marca.",
      },
      historicalReveal: {
        paragraphs: [
          "Este es uno de los lugares en los que la investigación histórica y sobre el terreno sigue en curso. Su historia se añadirá después de la prueba.",
        ],
        sources: [],
      },
      clue: { title: "VII · La marca perdida", value: "EL CERDO" },
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "pubs-boer-van-tienen": {
      description: "Capítulo VIII: La última página.",
      drinks: ["Stella", "Tripel d'Anvers", "Bolleke", "Cola Zero"],
      story: [
        {
          chapterTitle: "La última página",
          translation:
            "«Habéis seguido mi ruta.\n\nHabéis bebido donde bebían los de Amberes.\n\nMirado donde miraban los artistas.\n\nY buscado donde otros pasaban de largo.\n\nPero ¿habéis recordado lo que encontrasteis?»",
        },
      ],
      challenge: {
        title: "Siete escalones",
        instruction: "Salid y observad con atención la histórica fachada escalonada.",
        question: "¿Cuántos escalones tiene el histórico hastial escalonado?",
        hints: ["Salid y mirad la parte superior de la fachada.", "Contad cada escalón del contorno del hastial."],
        explanation: "Siete escalones, tal como describe el inventario del patrimonio.",
      },
      historicalReveal: {
        paragraphs: [
          "In Den Boer van Tienen es una antigua taberna de Amberes.",
          "El edificio data aproximadamente de la segunda mitad del siglo XVI o de la primera mitad del siglo XVII, y está protegido como monumento.",
          "El inventario del patrimonio describe su fachada como un hastial escalonado de siete escalones.",
        ],
        sources: ["Inventaris Onroerend Erfgoed (inventario del patrimonio flamenco)"],
      },
      clue: { title: "VIII · La última página", value: "SIETE ESCALONES" },
    },
  },

  finale: {
    title: "La página final",
    intro: "La página final solo se abrirá para quienes recuerden el viaje.",
    questions: [
      { title: "La hora congelada", question: "¿Cuándo se detuvo el tiempo?", hints: [] },
      { title: "El guardián", question: "¿Qué animal vigilaba De Muze?", hints: [] },
      { title: "El juego olvidado", question: "¿Qué juego centenario descubristeis?", hints: [] },
    ],
    closingStory: [
      {
        chapterTitle: "La última página",
        translation:
          "«El libro de cuentas no pertenecía a un pintor famoso,\na un mercader ni a un burgomaestre.\n\nPertenecía a un tabernero corriente de Amberes.\n\nSu nombre desapareció de la historia.\n\nSus cafés, no.\n\nDurante siglos, los de Amberes siguieron recorriendo\nlas mismas calles, contando historias y sentándose juntos\nen las mismas barras.\n\nQuizá era eso lo que quería conservar.\n\nNo su nombre.\n\nSino la ciudad».",
      },
    ],
  },
};
