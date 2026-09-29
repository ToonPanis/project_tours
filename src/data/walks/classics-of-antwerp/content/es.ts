import type { ClassicsContent } from "./types";

/**
 * Classics of Antwerp: Spanish content (translated from content/en.ts).
 * Informal «tú», as in the Spanish UI. Street and building names stay Dutch.
 */
export const classicsContentEs: ClassicsContent = {
  walk: {
    title: "Clásicos de Amberes",
    tagline: "Un paseo por la historia de Amberes",
    shortDescription:
      "Un paseo guiado desde la grandiosa estación de tren hasta las orillas del Escalda: dieciocho paradas, ocho siglos y las historias que se esconden tras los lugares más famosos de Amberes.",
    description:
      "Camina desde la grandiosa estación de tren de Amberes a través de siglos de comercio, arte, religión y poder, hasta llegar al lugar donde empezó la historia de la ciudad: las orillas del Escalda.\n\nEn cada parada, tu móvil se convierte en tu guía: qué estás viendo, por qué se construyó, qué ocurrió aquí y los detalles ante los que la mayoría de los visitantes pasan de largo. Fotografías históricas te muestran cómo era la ciudad hace un siglo o más. No hay juegos ni preguntas; solo Amberes, y el tiempo necesario para contemplarla como se merece.",
    highlights: [
      "18 de los lugares históricos más importantes de Amberes",
      "Escrito como si un guía caminara a tu lado",
      "Fotografías históricas, grabados y postales en cada parada importante",
      "Historias de «¿Sabías que…?» que no encontrarás en los paneles informativos",
      "Detalles que buscar in situ",
      "Navegación a pie de una parada a la siguiente",
    ],
    howItWorksSteps: [
      "Camina hasta la siguiente parada con ayuda del mapa",
      "Lee la historia de lo que tienes delante",
      "Busca los detalles in situ",
      "Continúa a tu propio ritmo",
    ],
    practicalInfo: [
      { label: "Ritmo", value: "A tu propio ritmo; para y continúa cuando quieras" },
      { label: "Ideal para", value: "Quienes visitan Amberes por primera vez y cualquier persona interesada en su historia" },
      { label: "Accesibilidad", value: "Calles mayoritariamente llanas; algunos adoquines en el casco antiguo" },
    ],
    guideIntro: {
      quote:
        "Camina desde la grandiosa estación de tren de Amberes a través de siglos de comercio, arte, religión y poder, hasta llegar al lugar donde empezó la historia de la ciudad: las orillas del Escalda.",
      categoryLabel: "Historia y arquitectura",
      footnote: "De la Belle Époque a la Amberes medieval.",
    },
    copy: {
      startLabel: "Empezar el paseo",
      nextLocationTitle: "Siguiente parada",
      completionTitle: "Fin del paseo",
      completionMessage: "No solo has recorrido Amberes. Has recorrido, hacia atrás, su historia.",
      locationsTitle: "La ruta",
      locationsDiscoveredLabel: "paradas visitadas",
    },
  },

  stops: {
    // ── 1 ────────────────────────────────────────────────────────────────
    "classics-central-station": {
      name: "Antwerpen-Centraal",
      subtitle: "La catedral del ferrocarril",
      introduction: [
        "Ante ti se alza una de las estaciones de tren más espectaculares del mundo. Contémplala un momento tal y como se concibió: un palacio de piedra con cúpula, torres y detalles dorados, construido no solo para coger un tren, sino para impresionar a todo aquel que llegaba a Amberes.",
        "Los antuerpienses la llaman spoorwegkathedraal, la catedral del ferrocarril. Es un buen lugar para empezar, porque aquí se escribe el capítulo más reciente de nuestra historia. Desde aquí caminaremos hacia atrás en el tiempo, hasta el río donde nació la ciudad.",
      ],
      sections: [
        {
          heading: "El escaparate de un rey",
          kind: "history",
          paragraphs: [
            "Hacia 1900, Amberes vivía un auge extraordinario. Su puerto era uno de los más activos de Europa, y el rey Leopoldo II quería una estación a la altura de esa ambición. Las obras se hicieron en dos fases. Primero, entre 1895 y 1899, el ingeniero Clément Van Bogaert construyó la enorme nave de andenes de hierro y cristal: 186 metros de largo, 66 de ancho y 43 de alto. Aquella altura no era solo para lucirse; dejaba espacio para que subiera el humo de las locomotoras de vapor.",
            "Después, entre 1899 y 1905, el arquitecto Louis Delacenserie levantó delante el edificio de piedra de la estación. Él mismo definió su estilo como un «eclecticismo barroco-medieval» y se inspiró, entre otros, en la antigua estación de Lucerna y en el Panteón de Roma. El resultado lo mezcla casi todo: cúpulas, pináculos, mármol, oro y una buena dosis de teatralidad.",
          ],
        },
        {
          heading: "De estación terminal a estación de paso",
          kind: "history",
          paragraphs: [
            "Durante aproximadamente un siglo fue una estación terminal: los trenes entraban, se detenían y tenían que salir marcha atrás. A principios del siglo XXI eso cambió. Se excavaron nuevos andenes en varios niveles bajo la antigua nave y se construyó un túnel bajo la ciudad, de modo que hoy los trenes atraviesan Amberes de lado a lado. La nave histórica se quedó arriba, restaurada, como si nada hubiera pasado.",
          ],
        },
      ],
      didYouKnow: [
        "Se dice que, cuando el rey Leopoldo II vio por primera vez la estación terminada, quedó menos impresionado de lo que todos esperaban. Según una conocida anécdota, comentó: «C'est une petite belle gare», es decir, «es una estación pequeña y bonita».",
        "La nave de hierro es más antigua que el edificio de piedra que tienes delante. Los ingenieros terminaron su trabajo años antes que el arquitecto.",
      ],
      lookAt: [
        {
          title: "El reloj y el escudo",
          body: "Entra en la nave de andenes y date la vuelta. Sobre la entrada del edificio de la estación verás un gran reloj, la palabra ANTWERPEN y el escudo de la ciudad: un castillo con dos manos encima. Recuerda esas manos; volverán a aparecer más adelante en este paseo, en la Grote Markt.",
        },
      ],
      transitionToNext:
        "Sal de la estación por su lado oeste. En pocos minutos entrarás en un pequeño barrio donde, desde hace siglos, se comercia con un tesoro muy distinto.",
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    "classics-diamond-district": {
      name: "El barrio de los diamantes",
      subtitle: "Uno de los grandes mercados de diamantes del mundo, en unas pocas calles tranquilas",
      introduction: [
        "Mira a tu alrededor. Estas pocas calles sin nada especial junto a la estación, con sus cámaras, bolardos y anónimos edificios de oficinas, forman uno de los mercados de diamantes más importantes del mundo. Buena parte del comercio mundial de diamantes en bruto ha pasado por estas pocas manzanas.",
      ],
      sections: [
        {
          heading: "Cinco siglos de diamantes",
          kind: "history",
          paragraphs: [
            "La relación de Amberes con los diamantes es antigua. El registro más antiguo que se conoce data de 1447, cuando la ciudad dictó normas contra el comercio de piedras preciosas falsas, diamantes incluidos. Para entonces, el comercio era ya lo bastante importante como para protegerlo.",
            "El barrio en el que te encuentras surgió más tarde, en torno a la estación y el ferrocarril, a finales del siglo XIX. En 1893 se fundó la primera bolsa de diamantes de la ciudad, el Diamantclub van Antwerpen; en 1904 le siguió la Beurs voor Diamanthandel. Aquí los comerciantes se reunían, examinaban piedras y cerraban tratos, a menudo sellados con poco más que un apretón de manos y una palabra de confianza.",
            "Durante buena parte del siglo XX, el comercio estuvo marcado por la comunidad judía de Amberes, muchas de cuyas familias procedían de Europa Central y del Este. Más tarde, los comerciantes procedentes de la India fueron ganando importancia. Si paseas por aquí, todavía oirás hablar muchos idiomas en estas calles.",
          ],
        },
        {
          heading: "La rueda de pulir",
          kind: "legend",
          paragraphs: [
            "La tradición atribuye a un artesano vinculado a Amberes, Lodewijk van Bercken, la invención en el siglo XV del scaif: una rueda de pulir recubierta de polvo de diamante y aceite que permitía tallar todas las facetas de un diamante de forma simétrica. La historia se repite a menudo, pero las pruebas históricas sobre su vida y su invento son escasas, así que conviene tomarla como una orgullosa tradición local más que como un hecho demostrado.",
          ],
        },
      ],
      didYouKnow: [
        "El fin de semana del 15 y 16 de febrero de 2003, unos ladrones entraron en la cámara acorazada del Antwerp Diamond Centre, en este barrio. El botín, estimado en más de 100 millones de dólares en diamantes, oro y joyas, lo convirtió en uno de los mayores robos de diamantes de la historia. Hubo detenciones, pero la mayoría de los diamantes nunca apareció.",
      ],
      transitionToNext:
        "Vuelve hacia la plaza de la estación y toma De Keyserlei, la gran avenida que conduce a la ciudad antigua. Hacia 1900, este era el camino por el que todo visitante que llegaba en tren entraba en Amberes.",
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    "classics-keyserlei-meir": {
      name: "De Keyserlei y la Meir",
      subtitle: "El gran bulevar, y el día en que la guerra llegó al cine",
      introduction: [
        "Estás en De Keyserlei, la amplia avenida que une la estación con el corazón de la ciudad. Más adelante continúa como la Meir, la calle comercial más famosa de Amberes. En postales antiguas de hacia 1900 se ve exactamente la misma vista: edificios elegantes, tráfico animado y, al fondo, la aguja de la catedral señalando el camino.",
      ],
      sections: [
        {
          heading: "16 de diciembre de 1944",
          kind: "history",
          paragraphs: [
            "Esta calle guarda uno de los recuerdos más oscuros de Amberes. Tras la liberación de la ciudad en septiembre de 1944, su puerto se volvió vital para abastecer a los ejércitos aliados, y Alemania respondió con sus nuevas armas V: bombas volantes y cohetes V-2 que caían sin previo aviso.",
            "La tarde del 16 de diciembre de 1944, unas 1100 personas estaban viendo una película en el Cinema Rex, en el número 15 de esta avenida. A las 15:20, un cohete V-2 impactó en el tejado. Murieron 567 personas: 271 civiles y 296 soldados aliados. Fue el mayor número de víctimas causado por un solo ataque con cohete en toda la guerra, y se tardó casi una semana en sacar a todos de entre los escombros.",
          ],
        },
        {
          heading: "Un palacio en la Meir",
          kind: "history",
          paragraphs: [
            "Sigue por la Meir y busca una fachada larga y elegante del siglo XVIII: el Paleis op de Meir. Fue construido a partir de 1745 para un rico comerciante, Johan Alexander van Susteren, por el arquitecto antuerpiense Jan Pieter van Baurscheit el Joven. Después pasó por manos notables: Napoleón lo compró en 1811–1812 pero nunca vivió allí, el zar ruso Alejandro I se alojó en él en 1814 y durante mucho tiempo sirvió como palacio real.",
            "Muy cerca de la Meir, en el Wapper, se encuentra la casa donde vivió y trabajó Pedro Pablo Rubens. Te encontrarás con Rubens varias veces más a lo largo de este paseo.",
          ],
        },
      ],
      didYouKnow: [
        "El Cinema Rex se reconstruyó después de la guerra y reabrió en 1947. Cerró definitivamente en 1993 y fue demolido dos años después. Hoy apenas hay nada en la calle que recuerde a los transeúntes lo que ocurrió aquí.",
        "Napoleón fue propietario del palacio de la Meir, pero cuando estuvo listo para él ya se encontraba exiliado en la isla de Elba.",
      ],
      transitionToNext:
        "Sigue la Meir hacia la ciudad antigua. Un poco más adelante, a la izquierda, una cúpula dorada brilla sobre una entrada grandiosa: un salón de fiestas que ardió y volvió a renacer.",
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    "classics-stadsfeestzaal": {
      name: "Stadsfeestzaal",
      subtitle: "El salón de fiestas de la ciudad que resurgió de sus cenizas",
      introduction: [
        "Ante ti está la entrada de la Stadsfeestzaal, el salón de fiestas de la ciudad. Entra y mira hacia arriba: una sala enorme coronada por una cúpula de cristal recubierta de pan de oro. Hoy es un centro comercial, pero se construyó para algo muy distinto.",
      ],
      sections: [
        {
          heading: "Una sala para la ciudad",
          kind: "history",
          paragraphs: [
            "La Stadsfeestzaal se inauguró el 8 de febrero de 1908. La diseñó el arquitecto municipal Alexis Van Mechelen, por encargo de la propia ciudad, en un grandioso estilo neoclásico. Amberes era rica y segura de sí misma, y quería un lugar para bailes, exposiciones, ferias y recepciones: un salón para toda la ciudad en plena calle principal.",
          ],
        },
        {
          heading: "El incendio de 2000",
          kind: "history",
          paragraphs: [
            "El 27 de diciembre de 2000, un cortocircuito provocó un incendio que arrasó el interior del edificio. Cuando se apagaron las llamas, solo seguían en pie la escalinata monumental, la fachada histórica y la estructura de acero del tejado.",
            "Muchos temieron que la sala se hubiera perdido para siempre. En 2004 la ciudad firmó un arrendamiento a largo plazo con un promotor, y ese mismo año empezaron las obras de restauración. Bajo la supervisión de las autoridades de patrimonio se reconstruyeron fielmente la cúpula de cristal con su pan de oro, la escalinata, las decoraciones, esculturas, mosaicos, relieves murales e incluso el parqué de roble. En 2007 la Stadsfeestzaal volvió a abrir.",
          ],
        },
      ],
      didYouKnow: [
        "Gran parte del interior «histórico» que ves dentro es en realidad una cuidadosa reconstrucción del siglo XXI, realizada tras el incendio de 2000 a partir de fotografías, planos y fragmentos conservados.",
      ],
      transitionToNext:
        "Deja la Meir un momento y adéntrate en las estrechas calles que hay detrás. Oculto tras fachadas corrientes se encuentra el edificio donde Amberes enseñó un día al mundo a comerciar.",
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    "classics-handelsbeurs": {
      name: "La Handelsbeurs",
      subtitle: "Donde el mundo venía a hacer negocios",
      introduction: [
        "Ante ti está la Handelsbeurs, la antigua bolsa de comercio de Amberes. Desde la calle apenas llama la atención. Dentro se esconde una de las salas más extraordinarias de la ciudad: un patio gótico rodeado de galerías y cubierto por una altísima cubierta de hierro y cristal.",
        "Retrocedemos ahora al siglo XVI, cuando Amberes era una de las ciudades más ricas de Europa.",
      ],
      sections: [
        {
          heading: "Comerciar sin teléfonos",
          kind: "history",
          paragraphs: [
            "Imagina Amberes hacia 1530. Llegan barcos de Portugal con especias de Asia; en la ciudad viven comerciantes de Italia, Alemania, Inglaterra y España. Necesitan conocer los precios, encontrar compradores, pedir dinero prestado, asegurar cargamentos… y no hay teléfonos, ni periódicos tal como los conocemos, ni internet. La información viaja por carta y, sobre todo, de boca en boca.",
            "Así que Amberes construyó un lugar donde todos esos comerciantes pudieran reunirse a diario. En 1531 la ciudad inauguró una bolsa diseñada por Domien de Waghemakere, en estilo gótico brabanzón tardío: un patio abierto rodeado de una galería cubierta con elaboradas bóvedas estrelladas. Fue uno de los primeros edificios del mundo construidos expresamente con este fin. Aquí, en una auténtica babel de idiomas, se fijaban los precios y se cerraban los tratos.",
          ],
        },
        {
          heading: "Fuego, y otra vez fuego",
          kind: "history",
          paragraphs: [
            "El edificio que ves no es simplemente el de 1531. La bolsa se reconstruyó en 1583 y ardió en 1858. El arquitecto Joseph Schadde diseñó entonces el edificio actual; el encargo se le adjudicó finalmente en 1868 y la nueva bolsa se inauguró solemnemente el 19 de octubre de 1872. Conservó la idea del patio gótico, pero lo cubrió con una espectacular cubierta de hierro y cristal, e incorporó al conjunto restos de la antigua bolsa.",
            "A finales del siglo XX, la actividad comercial se había trasladado a otros lugares y el edificio permaneció vacío unos veinte años. Tras una restauración a fondo volvió a abrir en 2019, ahora como espacio para eventos.",
          ],
        },
      ],
      didYouKnow: [
        "La bolsa de Amberes se convirtió en un modelo en el extranjero. Cuando Thomas Gresham, agente de la corona inglesa en Amberes, fundó la Royal Exchange de Londres en la década de 1560, tomó como ejemplo la bolsa de Amberes.",
        "La propia palabra «bolsa» (en neerlandés beurs) no suele relacionarse con Amberes, sino con Brujas, donde los comerciantes se reunían delante de la casa de la familia Van der Beurse.",
      ],
      transitionToNext:
        "De vuelta en la Meir, mira hacia arriba. Una torre se eleva por encima de los tejados como un pedazo de Nueva York caído en una ciudad medieval. Avanzamos un momento en el tiempo, antes de que nuestro viaje al pasado empiece de verdad.",
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    "classics-boerentoren": {
      name: "La Boerentoren",
      subtitle: "El primer rascacielos de Europa",
      introduction: [
        "Ante ti se alza la Boerentoren, la «Torre de los Campesinos». Con su silueta escalonada y sobria, parece más propia del Nueva York de los años treinta que de una ciudad de iglesias góticas, y eso es exactamente lo que pretendían sus constructores.",
      ],
      sections: [
        {
          heading: "Un sueño americano en la Schoenmarkt",
          kind: "history",
          paragraphs: [
            "La manzana sobre la que se levanta había quedado devastada durante la Primera Guerra Mundial. Cuando la ciudad convocó un concurso para su reconstrucción, las bases eran explícitas: construir un rascacielos americano. Los arquitectos Jan Vanhoenacker, Emiel Van Averbeke y Jos Smolderen diseñaron una torre de estilo art déco, y las obras se prolongaron de 1929 a 1932, con la vista puesta en la Exposición Universal que Amberes celebró en 1930.",
            "Su esqueleto es una estructura de acero de unas 3500 toneladas, fabricada por la empresa alemana Demag. Con 25 plantas y 87,5 metros de altura, fue el primer rascacielos de Europa y, en su momento, el más alto. Una renovación de la parte superior en 1975 la elevó a 95,75 metros y 26 plantas.",
          ],
        },
      ],
      didYouKnow: [
        "El apodo viene de sus propietarios: el edificio pasó a albergar la caja de ahorros del Boerenbond, la Liga de Campesinos belga. Una torre llena de los ahorros de los campesinos, en pleno centro de la ciudad.",
      ],
      transitionToNext:
        "Desde aquí, la torre te señala el viejo corazón de Amberes. Camina hasta la gran plaza que tienes delante, donde la catedral aparece por primera vez en toda su altura y donde el suelo que pisas esconde un secreto.",
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    "classics-groenplaats": {
      name: "Groenplaats",
      subtitle: "Una plaza que fue cementerio",
      introduction: [
        "Estás en la Groenplaats, una de las plazas más animadas de Amberes, con la catedral elevándose sobre los tejados y Pedro Pablo Rubens sobre un pedestal en el centro. Parece un lugar hecho para terrazas y mercados. Durante siglos, fue algo muy distinto.",
      ],
      sections: [
        {
          heading: "El cementerio de la catedral",
          kind: "history",
          paragraphs: [
            "Esta plaza, junto con la Lijnwaadmarkt, la Melkmarkt, la Schoenmarkt y la Handschoenmarkt que rodean la catedral, formaba antiguamente el cementerio de la catedral. Los antuerpienses lo llamaban Groot Kerkhof, el Gran Cementerio, y más tarde Groen Kerkhof, el Cementerio Verde. Algunos siguen usando ese nombre hoy en día.",
            "En 1754 el cementerio se cercó con un muro, pero no por mucho tiempo. En 1784 el emperador José II prohibió los enterramientos dentro de las ciudades por motivos de salud pública, y en 1799 el muro fue derribado. El cementerio se fue convirtiendo poco a poco en la plaza que ves ahora.",
          ],
        },
        {
          heading: "Rubens ocupa su lugar",
          kind: "history",
          paragraphs: [
            "En 1840, Amberes conmemoró los 200 años de la muerte de Rubens. Willem Geefs diseñó una estatua, pero faltaba dinero y el bronce no estuvo listo a tiempo, así que el 25 de agosto de 1840 se descubrió una versión provisional de yeso en otra plaza. Solo el 9 y el 10 de agosto de 1843 ocupó el Rubens de bronce su lugar aquí, en el centro de la Groenplaats.",
          ],
        },
      ],
      didYouKnow: [
        "Cuando te sientas en una terraza aquí, estás sentado sobre lo que durante siglos fue el cementerio de la catedral.",
      ],
      transitionToNext:
        "Camina hacia la catedral. Por el camino, fíjate en la hilera de casas adosadas al coro de la iglesia. Esconden los cimientos de una catedral que nunca se terminó.",
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    "classics-cathedral": {
      name: "Catedral de Nuestra Señora",
      subtitle: "La catedral que Amberes casi hizo aún más grande",
      introduction: [
        "Ante ti se alza la Onze-Lieve-Vrouwekathedraal, la catedral de Nuestra Señora, una de las mayores iglesias góticas de los Países Bajos históricos y, durante siglos, el hito que los marineros del Escalda veían primero. Su torre norte, de unos 123 metros de altura, sigue dominando el perfil de la ciudad.",
        "Estamos ahora en la Baja Edad Media. La catedral se construyó a lo largo de unos 170 años, desde mediados del siglo XIV hasta 1521, por generaciones de constructores que sabían que nunca la verían terminada.",
      ],
      sections: [
        {
          heading: "Aún más grande: el Nieuwerck",
          kind: "history",
          paragraphs: [
            "En 1521, justo cuando se terminaba la iglesia, Amberes decidió que no era lo bastante grande. La ciudad más rica del norte de Europa quería un templo a su medida, y Domien de Waghemakere y Rombout Keldermans diseñaron una gigantesca ampliación del coro: el Nieuwerck («obra nueva»).",
            "El 15 de julio de 1521, el joven emperador Carlos V colocó él mismo la primera piedra. Entonces llegó el desastre. Un gran incendio en 1533 dañó gravemente la iglesia, todo el dinero se destinó a reparar el edificio existente, las obras del Nieuwerck se detuvieron y en 1537 el proyecto se abandonó definitivamente.",
          ],
        },
        {
          heading: "Tormentas de la historia",
          kind: "history",
          paragraphs: [
            "La catedral ha sobrevivido a muchas cosas. Durante la furia iconoclasta de 1566, una oleada de ira protestante contra las imágenes, buena parte de su interior fue destrozado. Dos siglos más tarde, las tropas revolucionarias francesas ocuparon la ciudad, cerraron la iglesia y se llevaron sus tesoros.",
            "Mucho de lo que hoy puede verse dentro fue devuelto o restaurado después, incluidos retablos de Rubens que figuran entre sus obras más famosas.",
          ],
        },
      ],
      didYouKnow: [
        "El Nieuwerck nunca se construyó, pero no desapareció del todo. Sus cimientos y pilares se conservan en la hilera de casas que rodea el coro, entre la Lijnwaadmarkt y la Groenplaats. Algunas de esas casas se levantan literalmente sobre el arranque de una catedral que nunca se terminó.",
        "La primera piedra de Carlos V llevaba una inscripción en latín que dejaba constancia de que el emperador la colocó en los idus de julio de 1521.",
      ],
      lookAt: [
        {
          title: "Una torre y media",
          body: "Fíjate en la fachada de la catedral. La torre izquierda (norte) se eleva hasta su elegante aguja; la derecha (sur) se detiene a aproximadamente un tercio de esa altura. El plan preveía dos grandes torres, pero solo se completó una. Observa el aguafuerte de 1649 de esta página: la silueta asimétrica ya era la misma entonces.",
        },
      ],
      transitionToNext:
        "Rodea la catedral hasta la Oude Koornmarkt. Busca con atención una estrecha entrada entre las casas: conduce a un callejón escondido que el tiempo parece haber olvidado.",
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    "classics-vlaeykensgang": {
      name: "Vlaeykensgang",
      subtitle: "Un pasaje secreto hacia la vieja Amberes",
      introduction: [
        "Cruza la estrecha entrada y el ruido de la ciudad desaparece. Estás en el Vlaeykensgang, un callejón sinuoso entre viejos muros de ladrillo, patios diminutos y casitas. Por un momento es fácil imaginar la Amberes de hace siglos.",
      ],
      sections: [
        {
          heading: "Edificios traseros que se convirtieron en calle",
          kind: "history",
          paragraphs: [
            "El pasaje se trazó en 1591, aunque todavía no llevaba este nombre; el nombre es más reciente que el propio callejón. Las pequeñas construcciones nacieron en el siglo XVI como edificios traseros y almacenes detrás de las casas de las calles circundantes. Con el tiempo, el conjunto se convirtió en un pasaje interior y, a partir del siglo XVII, los edificios se utilizaron como viviendas pequeñas y modestas.",
          ],
        },
        {
          heading: "Salvado en el último momento",
          kind: "history",
          paragraphs: [
            "En la década de 1960, el callejón estaba muy deteriorado y había planes para derribarlo y construir un aparcamiento. En 1969, el anticuario y diseñador de interiores Axel Vervoordt compró el conjunto. Las fachadas y los tejados fueron protegidos como monumento en 1973, y la restauración comenzó en 1977.",
          ],
        },
      ],
      didYouKnow: [
        "Uno de los rincones con más encanto de la vieja Amberes existe hoy porque en su día se consideró tan poco valioso que iba a convertirse en un aparcamiento.",
      ],
      transitionToNext:
        "Sigue el callejón y las calles laterales hasta la gran plaza del mercado de la ciudad. Prepárate para mirar hacia arriba: las fachadas que la rodean están llenas de oro.",
    },

    // ── 10 ───────────────────────────────────────────────────────────────
    "classics-grote-markt": {
      name: "Grote Markt y las casas gremiales",
      subtitle: "La plaza dorada que es más joven de lo que parece",
      introduction: [
        "Estás en la Grote Markt, la plaza mayor de Amberes. A un lado se levanta el Ayuntamiento; en el resto de la plaza, altas casas gremiales con hastiales escalonados y de volutas, coronadas por figuras doradas que brillan al sol.",
        "Los gremios eran las asociaciones de artesanos y comerciantes que organizaban buena parte de la vida urbana: quién podía trabajar, qué podía venderse y con qué calidad. Sus casas en esta plaza eran su escaparate.",
      ],
      sections: [
        {
          heading: "La Furia Española",
          kind: "history",
          paragraphs: [
            "En noviembre de 1576, soldados españoles amotinados saquearon Amberes; en el Ayuntamiento sabrás más sobre ello. El fuego que provocaron arrasó esta plaza y destruyó las casas que había en ella. Lo que se levantó después fue una nueva generación de edificios.",
            "El ejemplo más bello es la casa de la Oude Voetboog, el gremio de San Jorge. Se construyó en 1515–1516, fue destruida en 1576 y se reconstruyó en estilo renacentista en 1580–1582. Su fachada está considerada una de las cumbres de la arquitectura renacentista de Amberes.",
          ],
        },
        {
          heading: "Un sueño decimonónico del Siglo de Oro",
          kind: "history",
          paragraphs: [
            "Mucho de lo que ves es más reciente de lo que parece. En 1895, un ciudadano llamado R. Joostens dejó en su testamento dinero para devolver a la Grote Markt su antiguo esplendor. Desde finales del siglo XIX hasta principios del XX, las fachadas del lado norte de la plaza, y el número 44 del lado sur, se reconstruyeron libremente y se embellecieron con el espíritu del siglo XVI.",
          ],
        },
      ],
      didYouKnow: [
        "Varias de las «antiguas» casas gremiales de esta plaza son en realidad reconstrucciones de hacia 1900. Amberes no solo conservaba su Siglo de Oro; también lo reimaginaba con cariño.",
      ],
      lookAt: [
        {
          title: "Las figuras doradas",
          body: "Mira la parte alta de los hastiales. Busca al San Jorge dorado a caballo luchando contra el dragón en la casa de la Oude Voetboog, el gremio de San Jorge. Después busca las demás figuras y emblemas: muchos aluden al gremio propietario de la casa. Compara la plaza con la fotografía de 1905 de esta página.",
        },
      ],
      transitionToNext:
        "En medio de la plaza, una figura de bronce está a punto de lanzar algo al aire. Acércate a la fuente: cuenta la historia más famosa de Amberes.",
    },

    // ── 11 ───────────────────────────────────────────────────────────────
    "classics-brabo": {
      name: "La fuente de Brabo",
      subtitle: "Un gigante, una mano y el nombre de una ciudad",
      introduction: [
        "Ante ti está la fuente de Brabo. Sobre un montón de rocas, rodeado de criaturas marinas y figuras, un joven se inclina hacia atrás y lanza algo a lo lejos. Fíjate bien en lo que sostiene: es una mano.",
      ],
      sections: [
        {
          heading: "La leyenda de Druon Antigoon",
          kind: "legend",
          paragraphs: [
            "Hace mucho tiempo, según cuenta la historia, vivía a orillas del Escalda un gigante llamado Druon Antigoon. Vigilaba el río y exigía un peaje a todo barco que quisiera pasar. A quien se negaba o no podía pagar le cortaba una mano, y el gigante la arrojaba al río.",
            "Entonces llegó un joven soldado romano llamado Silvius Brabo. Desafió al gigante, lo venció, le cortó su propia mano y la arrojó al Escalda. Y así, dice la leyenda, la ciudad recibió su nombre: hand werpen, «lanzar una mano», Antwerpen.",
          ],
        },
        {
          heading: "Lo que piensan los historiadores",
          kind: "interpretation",
          paragraphs: [
            "Es una historia maravillosa, pero no una explicación que los historiadores se tomen en serio. El origen del nombre Antwerpen es incierto. La mayoría de las explicaciones no lo relacionan con manos, sino con la tierra: con un terreno elevado junto al río, un trozo de tierra «delante», formado o acumulado por el agua. La leyenda del gigante es un intento muy posterior de explicar un nombre cuyo verdadero origen se había olvidado.",
          ],
        },
        {
          heading: "La fuente",
          kind: "history",
          paragraphs: [
            "La fuente es obra del escultor antuerpiense Jef Lambeaux, que en 1883 ya había desarrollado en gran parte su diseño. Se colocó en la Grote Markt en 1887, delante del Ayuntamiento, en una época en que Amberes estaba deseosa de celebrar su propia historia e identidad.",
          ],
        },
      ],
      didYouKnow: [
        "Las manos de la leyenda están por todas partes en Amberes: en el escudo de la ciudad, que muestra un castillo con dos manos encima, y en las «manos de Amberes» de chocolate y de galleta que se venden en las tiendas de alrededor.",
      ],
      transitionToNext:
        "Vuélvete hacia el largo edificio claro que hay detrás de Brabo. Sobrevivió a una de las noches más terribles de la historia de la ciudad.",
    },

    // ── 12 ───────────────────────────────────────────────────────────────
    "classics-stadhuis": {
      name: "Ayuntamiento",
      subtitle: "Construido con orgullo, quemado con furia",
      introduction: [
        "Ante ti está el Stadhuis, el Ayuntamiento de Amberes. Su larga fachada es serena y horizontal, con una alta sección central ricamente decorada que se eleva por encima. Cuando se construyó, era uno de los edificios más modernos de Europa: un palacio renacentista para una ciudad en la cumbre de su poder.",
      ],
      sections: [
        {
          heading: "Un palacio para la ciudad",
          kind: "history",
          paragraphs: [
            "El Ayuntamiento se construyó entre 1561 y 1565, según diseños de Cornelis Floris de Vriendt junto con otros arquitectos y artistas. Amberes era entonces una de las ciudades más ricas de Europa y quería que su gobierno tuviera su sede en un edificio que lo demostrara.",
          ],
        },
        {
          heading: "La Furia Española, 4 de noviembre de 1576",
          kind: "history",
          paragraphs: [
            "Apenas diez años después, este edificio fue testigo de una catástrofe. Los Países Bajos se habían sublevado contra el rey de España, y sus soldados en la región llevaban mucho tiempo sin cobrar. El 4 de noviembre de 1576, tropas españolas amotinadas asaltaron Amberes y empezaron a saquearla.",
            "El gobierno de la ciudad organizó un contraataque desde este Ayuntamiento, aquí en la Grote Markt. Los soldados prendieron fuego al edificio. Las llamas se extendieron a las casas de alrededor, cientos de las cuales ardieron. Del Ayuntamiento solo quedaron en pie los muros exteriores.",
            "No se sabe con exactitud cuántas personas murieron. Las estimaciones van desde varios cientos hasta unas 8000; muchos historiadores creen que perdieron la vida más de 7000 personas. El suceso pasó a conocerse como la Furia Española, y sacudió la confianza de la que había sido la gran ciudad comercial de Europa.",
          ],
        },
      ],
      didYouKnow: [
        "El edificio que ves fue restaurado tras el incendio de 1576. Observa la fotografía de esta página, tomada a mediados de la década de 1860: desde la plaza, el Ayuntamiento tenía entonces un aspecto muy parecido al de hoy.",
      ],
      lookAt: [
        {
          title: "La sección central",
          body: "Compara las sobrias alas de la fachada con la parte central, repleta de columnas, hornacinas y estatuas, que se eleva por encima de la línea del tejado. Ese contraste, calma y orden con una explosión decorativa en el centro, es típico del Renacimiento que Floris llevó a Amberes.",
        },
      ],
      transitionToNext:
        "Deja la Grote Markt y camina hacia el este por calles tranquilas hasta una pequeña plaza que muchos visitantes consideran la más bonita de Amberes.",
    },

    // ── 13 ───────────────────────────────────────────────────────────────
    "classics-conscienceplein": {
      name: "Hendrik Conscienceplein",
      subtitle: "El hombre que enseñó a leer a su pueblo",
      introduction: [
        "Estás en la Hendrik Conscienceplein, una plaza tranquila y recogida delante de una iglesia barroca. Frente a la antigua biblioteca se alza la estatua del escritor Hendrik Conscience.",
      ],
      sections: [
        {
          heading: "Un escritor para los flamencos",
          kind: "history",
          paragraphs: [
            "En el siglo XIX, el francés dominaba la vida pública, la administración y la literatura en Bélgica, también en Flandes. Hendrik Conscience escribía en neerlandés, para los lectores flamencos corrientes. Su novela histórica De Leeuw van Vlaenderen (El león de Flandes), publicada en 1838, se convirtió en un símbolo del orgullo y la emancipación flamencos.",
            "En 1883 recibió una estatua en esta plaza, que hasta entonces se llamaba Jezuïetenplein, la plaza de los Jesuitas, y que pasó a llevar su nombre. Algo inaudito para un autor vivo. El propio Conscience posó para el escultor, Frans Joris, pero por su mala salud no pudo asistir a la inauguración en agosto de 1883. Murió un mes después.",
          ],
        },
      ],
      didYouKnow: [
        "Las famosas palabras de la estatua, «Hij leerde zijn volk lezen» («Enseñó a leer a su pueblo»), las pronunció por primera vez en la inauguración el poeta Jan Van Beers. Pero no fue el escultor quien las ideó: la idea fue de Henriëtte Mertens, la esposa del poeta.",
      ],
      transitionToNext:
        "Ahora date la vuelta. La iglesia ricamente decorada que tienes detrás es la siguiente parada, y el lugar donde entramos en la época de Rubens.",
    },

    // ── 14 ───────────────────────────────────────────────────────────────
    "classics-carolus-borromeus": {
      name: "Iglesia de San Carlos Borromeo",
      subtitle: "La obra maestra perdida de Rubens",
      introduction: [
        "Ante ti se alza la fachada de la Sint-Carolus Borromeuskerk: estratificada, esculpida, teatral, un mundo completamente distinto de la catedral gótica. Esto es el Barroco, el estilo de Rubens y de la Contrarreforma, pensado para desbordar los sentidos y conmover a los fieles.",
      ],
      sections: [
        {
          heading: "El escaparate de los jesuitas",
          kind: "history",
          paragraphs: [
            "La iglesia fue construida entre 1615 y 1621 por los jesuitas, la orden católica que estaba a la vanguardia de la Contrarreforma. La diseñaron los arquitectos jesuitas Pieter Huyssens y François d'Aguilon, y se dedicó al fundador de la orden, san Ignacio de Loyola.",
            "Pedro Pablo Rubens, entonces en la cumbre de su fama, participó de cerca. Para las naves laterales y las tribunas, su taller realizó 39 pinturas de techo a partir de sus bocetos; el joven Anton van Dyck colaboró en el trabajo. Durante un siglo, fue uno de los interiores eclesiásticos más espléndidos de Europa.",
          ],
        },
        {
          heading: "El rayo de 1718",
          kind: "history",
          paragraphs: [
            "El 18 de julio de 1718, un rayo alcanzó la iglesia y la incendió. Se perdieron las 39 pinturas de techo de Rubens. El interior se reconstruyó después en un estilo más austero, diseñado por Jan Pieter van Baurscheit el Viejo.",
            "Más avanzado el siglo XVIII, la orden jesuita fue suprimida y la iglesia se dedicó de nuevo a san Carlos Borromeo, el nombre que todavía lleva hoy.",
          ],
        },
      ],
      didYouKnow: [
        "Solo sabemos cómo eran los techos de Rubens gracias a una serie de estampas: grabados de Jan Punt a partir de acuarelas de Jacob de Wit. La imagen de esta página es uno de ellos: un Rubens perdido, conservado en papel.",
      ],
      transitionToNext:
        "Del Barroco retrocedemos ahora aún más, hasta la Baja Edad Media. Camina hacia el norte, hacia el río, hasta un llamativo edificio a rayas rojas y blancas.",
    },

    // ── 15 ───────────────────────────────────────────────────────────────
    "classics-vleeshuis": {
      name: "El Vleeshuis",
      subtitle: "Un palacio para carniceros",
      introduction: [
        "Ante ti está el Vleeshuis, la Casa de la Carne. Con sus altos hastiales, sus torres y sus llamativas franjas de ladrillo rojo y piedra blanca, parece un castillo o un ayuntamiento. Se construyó para los carniceros de la ciudad.",
      ],
      sections: [
        {
          heading: "El gremio de carniceros",
          kind: "history",
          paragraphs: [
            "El Vleeshuis se construyó entre 1501 y 1504 para el gremio de carniceros, en estilo gótico tardío. El diseño fue de Herman de Waghemakere el Viejo; tras su muerte en 1502, probablemente continuó la obra su hijo Domien, el mismo Domien que más tarde construyó la bolsa y trabajó en la catedral y en Het Steen.",
            "El edificio dice mucho de cómo se organizaba la alimentación en una ciudad medieval. La planta baja era un mercado cubierto con 62 bancos de carne, donde los carniceros del gremio vendían su género, y también albergaba la capilla del gremio. Arriba estaban la sala de reuniones del gremio, su salón de fiestas y su archivo. El gremio controlaba quién podía vender, y dónde.",
          ],
        },
      ],
      didYouKnow: [
        "No todo podía venderse dentro. Los despojos y las tripas no se admitían en la sala; se vendían en pequeñas tiendas, los penshuisjes, construidas por fuera contra el edificio, entre sus contrafuertes.",
        "Las franjas rojas y blancas de los muros se llaman speklagen, «capas de tocino». Es tentador pensar que eran una broma sobre los carniceros, pero no tienen nada que ver con el comercio de la carne: eran simplemente una moda constructiva que siguió siendo popular hasta bien entrado el siglo XVII.",
      ],
      lookAt: [
        {
          title: "Las capas de tocino",
          body: "Fíjate en los muros: hileras de ladrillo rojo alternan con franjas de arenisca clara. Ahora que conoces su nombre, descubrirás estas speklagen en muchos edificios antiguos de Amberes y de otros lugares de Flandes.",
        },
      ],
      transitionToNext:
        "Sigue unas cuantas calles hacia el norte, hasta el antiguo barrio portuario. Aquí se alza una iglesia cuya historia está ligada al río, y al fuego.",
    },

    // ── 16 ───────────────────────────────────────────────────────────────
    "classics-sint-paulus": {
      name: "Iglesia de San Pablo",
      subtitle: "Gótica, barroca y salvada de las llamas",
      introduction: [
        "Ante ti está la Sint-Pauluskerk, una iglesia gótica rematada por una sorprendente torre barroca. Se encuentra cerca del Escalda, en lo que durante siglos fue el barrio de marineros, estibadores y comerciantes.",
      ],
      sections: [
        {
          heading: "Un monasterio junto al río",
          kind: "history",
          paragraphs: [
            "Esta era la iglesia de los dominicos, una orden de frailes predicadores. Una iglesia anterior en este lugar fue consagrada en 1276 por el célebre sabio Alberto Magno. A partir de 1517 se construyó la iglesia actual para sustituirla, en el siglo XVI, cuando el comercio de Amberes florecía.",
            "El Escalda nunca estaba lejos. El río traía los barcos, las mercancías y las personas que llenaban este barrio, y la iglesia servía a un vecindario cuyo ritmo marcaban las mareas y el puerto.",
          ],
        },
        {
          heading: "Dos incendios",
          kind: "history",
          paragraphs: [
            "En 1679, un violento incendio destruyó parte de las bóvedas de la nave y la parte superior de la fachada oeste. Durante las reparaciones de 1680–1681, la iglesia recibió su remate barroco de la torre, el que ves hoy.",
            "Casi tres siglos después, en abril de 1968, el fuego volvió a golpear. Se perdió todo el tejado, las bóvedas y el interior sufrieron daños, el remate barroco de la torre ardió por completo y tres cuartas partes del monasterio contiguo quedaron en ruinas. La iglesia fue restaurada; sus tesoros, entre ellos pinturas de Rubens, Van Dyck y Jordaens, todavía pueden verse en su interior.",
          ],
        },
      ],
      didYouKnow: [
        "Junto a la iglesia, entre 1699 y 1747, los dominicos crearon un jardín del Calvario: un camino flanqueado por decenas de estatuas que asciende hasta la cruz, concebido como una especie de teatro en piedra. Es uno de los rincones más sorprendentes de la ciudad.",
      ],
      transitionToNext:
        "Camina hasta el río. A la orilla del agua se alza el edificio más antiguo de Amberes, el último resto del castillo donde empezó la ciudad.",
    },

    // ── 17 ───────────────────────────────────────────────────────────────
    "classics-het-steen": {
      name: "Het Steen",
      subtitle: "El último fragmento del castillo donde empezó Amberes",
      introduction: [
        "Ante ti está Het Steen, «la Piedra»: un pequeño castillo con torres y almenas a orillas del Escalda. Parece una fortaleza de cuento, pero lo que ves es solo un fragmento de algo mucho mayor: el burcht, el corazón fortificado a partir del cual creció Amberes.",
      ],
      sections: [
        {
          heading: "Donde nació la ciudad",
          kind: "history",
          paragraphs: [
            "Hacia el año 850 se levantaba aquí una fortaleza refugio, protegida por un terraplén de tierra contra las incursiones vikingas. A finales del siglo X se elevó el terreno y probablemente se excavó un foso. Hacia 1200–1225 se construyó el castillo de piedra, Het Steen, junto con una muralla alrededor del burcht.",
            "Desde principios del siglo XIV, el edificio sirvió de prisión, función que conservaría durante más de cinco siglos, hasta 1823.",
          ],
        },
        {
          heading: "Carlos V lo reconstruye",
          kind: "history",
          paragraphs: [
            "Hacia 1520, el emperador Carlos V mandó reconstruir Het Steen, según un diseño de Domien de Waghemakere y Rombout II Keldermans, los mismos nombres que encontraste en la catedral. Del castillo anterior solo se conservó la base. En 1549, Carlos V cedió el edificio a la ciudad.",
          ],
        },
        {
          heading: "El día en que desapareció el castillo",
          kind: "history",
          paragraphs: [
            "Durante siglos, Het Steen estuvo oculto entre las casas y calles del antiguo burcht. Luego, en la década de 1880, los muelles del Escalda se rectificaron y reconstruyeron para el puerto moderno. El viejo barrio del burcht fue demolido; la muralla del burcht a lo largo del río desapareció en 1883. Solo se conservó Het Steen, que en 1887–1890 fue restaurado y recibió una nueva ala norte neogótica.",
            "En 1952 se convirtió en el Museo Marítimo Nacional. Tras una renovación iniciada en 2018, reabrió en octubre de 2021.",
          ],
        },
      ],
      didYouKnow: [
        "Lo que ves como «el castillo» es solo una pequeña parte del burcht medieval. La mayor parte fue demolida en la década de 1880 para dejar paso a los muelles.",
        "Het Steen sirvió de prisión desde principios del siglo XIV hasta 1823: más de 500 años.",
      ],
      lookAt: [
        {
          title: "Dos tipos de piedra",
          body: "Fíjate en la parte baja de los muros. La base es de piedra de Doornik (Tournai), de color gris oscuro: la única parte que se conservó del castillo anterior. Encima se eleva la arenisca más clara de la reconstrucción de Carlos V, de principios del siglo XVI. Estás viendo, literalmente, dos épocas superpuestas.",
        },
        {
          title: "La figurita sobre la puerta",
          body: "Sobre la puerta de entrada, busca una pequeña figura de piedra desgastada. Según la tradición, representa a Semini, un antiguo dios de la fertilidad. Según el inventario del patrimonio, fue mutilada hacia 1587, al parecer por los jesuitas, que la consideraban indecente. Aun así sobrevivió, y sigue ahí hoy.",
        },
      ],
      transitionToNext:
        "Recorre los últimos pasos hasta el agua. Nuestro viaje hacia atrás en el tiempo termina donde empezó la historia de Amberes.",
    },

    // ── 18 ───────────────────────────────────────────────────────────────
    "classics-scheldt": {
      name: "El Escalda",
      subtitle: "Donde todo empezó",
      introduction: [
        "Colócate al borde del agua y contempla el río. Aquí el Escalda es ancho, gris e inquieto, arrastrado por las mareas del mar del Norte. Puede parecer el final de la ciudad. En realidad, es la razón de que la ciudad exista.",
      ],
      sections: [
        {
          heading: "Todo lo que has visto",
          kind: "interpretation",
          paragraphs: [
            "Repasa mentalmente el paseo. El castillo que tienes detrás se construyó para vigilar este río. El Vleeshuis, las casas gremiales y la bolsa se pagaron con el comercio que traía. La torre de la catedral era lo primero que veían los marineros. Comerciantes de toda Europa acudían a la Handelsbeurs por los barcos que amarraban aquí. Rubens pintaba para una ciudad enriquecida por el río. Incluso los diamantes y la grandiosa estación pertenecen a una ciudad a la que el puerto hizo poderosa.",
            "El río trajo riqueza, pero también guerra, migrantes, ideas y arte. Hizo de Amberes una ciudad internacional mucho antes de que existiera esa palabra.",
          ],
        },
        {
          heading: "Un río cerrado y reabierto",
          kind: "history",
          paragraphs: [
            "El Escalda también podía ser arrebatado. Tras la caída de Amberes en 1585, la flota de la República de las Provincias Unidas bloqueó el río, y el acceso de Amberes al mar quedó cortado durante dos siglos. Solo en 1795 se liberó oficialmente de nuevo la navegación. Hacia 1811, Napoleón mandó excavar aquí nuevas dársenas, y en 1863 Bélgica rescató por fin el antiguo peaje neerlandés sobre el Escalda.",
            "En la década de 1880 se rectificaron los muelles para el puerto moderno, el momento en que Het Steen perdió su castillo. Y el río sigue exigiendo respeto: tras el temporal y la marea ciclónica del 3 de enero de 1976, cuando el agua subió en Amberes a más de siete metros, se puso en marcha el Plan Sigma para proteger toda la cuenca del Escalda contra las inundaciones.",
          ],
        },
      ],
      didYouKnow: [
        "Durante unos doscientos años, desde el bloqueo posterior a 1585 hasta 1795, Amberes fue un gran puerto sin libre acceso al mar. Es una de las razones por las que terminó el Siglo de Oro de la ciudad.",
      ],
      closing: {
        timeline: [
          "Antwerpen-Centraal: empieza el siglo XX",
          "La Stadsfeestzaal y la Boerentoren: una ciudad moderna y segura de sí misma",
          "La Handelsbeurs: una sala del siglo XIX sobre una idea del siglo XVI",
          "Carolus Borromeus: Rubens y el Barroco",
          "El Ayuntamiento y el Vleeshuis: la metrópoli comercial del siglo XVI",
          "La catedral: la Amberes medieval",
          "Het Steen: el castillo donde empezó la ciudad",
          "El Escalda",
        ],
        finalLines: [
          "Empezaste este paseo en una estación de tren construida para la era moderna. Con cada parada fuiste retrocediendo: del siglo XX al XIX, a Rubens y el Barroco, a los comerciantes del siglo XVI, a la catedral medieval y al viejo castillo.",
          "Y ahora estás donde todo empezó: junto al río.",
          "No solo has recorrido Amberes. Has recorrido, hacia atrás, su historia.",
        ],
      },
    },
  },

  images: {
    "central-station-1906": {
      caption: "Antwerpen-Centraal poco después de su finalización, en una postal de hacia 1906.",
      alt: "Postal antigua de la fachada de piedra con cúpula de la estación central de Amberes, con gente en la plaza de delante",
      approximateYear: "h. 1906",
    },
    "central-station-hall-1909": {
      caption: "El interior del edificio de la estación, en una postal enviada en 1909.",
      alt: "Postal antigua de una sala alta y ornamentada con balcones y ventanales en arco dentro de la estación",
      approximateYear: "1909",
    },
    "central-station-today": {
      caption: "La nave de andenes hoy, con el reloj, la palabra ANTWERPEN y el escudo de la ciudad sobre la entrada.",
      alt: "Foto actual de la nave de hierro y cristal con la ornamentada fachada de piedra del edificio de la estación",
      approximateYear: "2023",
    },
    "diamond-pelikaanstraat": {
      caption: "La Pelikaanstraat, en el límite del actual barrio de los diamantes, hacia 1900.",
      alt: "Postal antigua de una calle adoquinada con tiendas, un carro tirado por caballos y una torre al fondo",
      approximateYear: "h. 1900",
    },
    "keyserlei-1903": {
      caption: "De Keyserlei en 1903. Al fondo de la avenida, la aguja de la catedral ya señala el camino.",
      alt: "Postal antigua de una amplia avenida con árboles, carros y edificios señoriales, con la aguja de una iglesia al fondo",
      approximateYear: "1903",
    },
    "meir-1910": {
      caption: "La Meir en una postal enviada en 1910, con un tranvía de tracción animal.",
      alt: "Postal antigua de una plaza con un tranvía tirado por caballos y escaparates",
      approximateYear: "h. 1910",
    },
    "stadsfeestzaal-today": {
      caption: "La entrada de la Stadsfeestzaal en la Meir, reconstruida tras el incendio de 2000.",
      alt: "Foto actual de una entrada de piedra ornamentada con una hornacina dorada y la palabra STADSFEESTZAAL",
      approximateYear: "2014",
    },
    "handelsbeurs-1890": {
      caption: "La sala de la bolsa de Joseph Schadde hacia 1890: un patio gótico bajo una cubierta de hierro y cristal.",
      alt: "Fotografía antigua de un patio gótico con galerías bajo una gran cubierta de hierro y cristal",
      approximateYear: "h. 1890",
    },
    "handelsbeurs-lalanne": {
      caption: "La misma sala en un dibujo a pluma de Maxime Lalanne, realizado antes de 1886.",
      alt: "Dibujo a pluma de la sala de la bolsa con comerciantes de pie en el patio",
      approximateYear: "antes de 1886",
    },
    "boerentoren-1930s": {
      caption: "La Boerentoren dominando a sus vecinos, en una postal de los años treinta.",
      alt: "Postal antigua de una alta torre art déco sobre una plaza animada con tranvías",
      approximateYear: "años treinta",
    },
    "groenplaats-1899": {
      caption: "La Groenplaats hacia 1899, con Rubens en su pedestal y la catedral tras los árboles.",
      alt: "Postal antigua de una plaza arbolada con una estatua y la torre de la catedral detrás",
      approximateYear: "h. 1899",
    },
    "cathedral-hollar-1649": {
      caption: "La catedral en un aguafuerte de Wenceslaus Hollar, 1649. La torre sur ya estaba inacabada.",
      alt: "Aguafuerte detallado de la fachada de la catedral con una aguja alta y una torre mucho más baja",
      approximateYear: "1649",
    },
    "cathedral-1908": {
      caption: "La aguja de la catedral sobre los tejados, hacia 1908.",
      alt: "Postal antigua de la alta torre gótica de la catedral sobre una plaza",
      approximateYear: "h. 1908",
    },
    "grote-markt-1905": {
      caption: "La Grote Markt en 1905, con la fuente de Brabo a la izquierda y las casas gremiales detrás.",
      alt: "Postal antigua coloreada de la plaza con la fuente y altas casas gremiales con hastiales",
      approximateYear: "1905",
    },
    "grote-markt-today": {
      caption: "Casas gremiales de la Grote Markt hoy, con sus figuras doradas sobre los hastiales.",
      alt: "Foto actual de altas casas gremiales de piedra con estatuas doradas en lo alto contra un cielo azul",
      approximateYear: "2021",
    },
    "brabo-photochrom": {
      caption: "Brabo lanza la mano del gigante: una estampa en color de la década de 1890.",
      alt: "Estampa histórica coloreada de la estatua de bronce de Brabo sobre una fuente rocosa delante de casas gremiales",
      approximateYear: "década de 1890",
    },
    "stadhuis-1866": {
      caption: "El Ayuntamiento en una fotografía temprana de mediados de la década de 1860, montada en un álbum fechado en 1867.",
      alt: "Fotografía temprana de la larga fachada renacentista del Ayuntamiento",
      approximateYear: "1865–1867",
    },
    "conscienceplein-historical": {
      caption: "La Hendrik Conscienceplein hacia 1900, con la biblioteca detrás de la estatua de Conscience.",
      alt: "Postal antigua de un edificio señorial en una plaza con una estatua delante de su entrada",
      approximateYear: "h. 1900",
    },
    "carolus-ceiling-punt-1748": {
      caption: "La Adoración de los Magos, una de las pinturas de techo perdidas de Rubens para esta iglesia, conocida solo gracias a estampas como este grabado del siglo XVIII de Jan Punt a partir de Jacob de Wit.",
      alt: "Grabado en blanco y negro de los tres Reyes Magos ofreciendo regalos a la Virgen y el Niño",
      approximateYear: "siglo XVIII",
    },
    "vleeshuis-1901": {
      caption: "«Vieille Boucherie»: el Vleeshuis y sus alrededores en una postal enviada hacia 1901.",
      alt: "Postal antigua de un alto edificio de ladrillo con un arco y niños en la calle",
      approximateYear: "h. 1901",
    },
    "sint-paulus-1901": {
      caption: "La iglesia de San Pablo y los cafés de su alrededor, en una postal fechada en 1901.",
      alt: "Postal antigua de una iglesia gótica con torre barroca sobre casitas y cafés",
      approximateYear: "1901",
    },
    "steen-photochrom": {
      caption: "Het Steen y el puerto en la década de 1890, pocos años después de la rectificación de los muelles.",
      alt: "Estampa histórica coloreada del pequeño castillo junto al muelle con barcos y gente",
      approximateYear: "década de 1890",
    },
    "steen-1920": {
      caption: "Un día de mucho ajetreo en Het Steen y el puerto, hacia 1920.",
      alt: "Postal antigua de multitudes, carros y barcos junto al castillo en el muelle",
      approximateYear: "h. 1920",
    },
    "steen-today": {
      caption: "Het Steen hoy.",
      alt: "Foto actual de las torres del castillo contra un cielo azul",
      approximateYear: "2015",
    },
    "scheldt-quays-1900": {
      caption: "Los muelles del Escalda hacia 1900, bordeados de barcos y cobertizos.",
      alt: "Postal antigua ilustrada de vapores y veleros a lo largo del muelle",
      approximateYear: "h. 1900",
    },
    "scheldt-photochrom": {
      caption: "Amberes vista desde el río en la década de 1890: Het Steen a la izquierda y la catedral elevándose sobre la ciudad.",
      alt: "Estampa histórica coloreada del perfil de Amberes visto desde el otro lado del río, con barcos en primer plano",
      approximateYear: "década de 1890",
    },
  },
};
