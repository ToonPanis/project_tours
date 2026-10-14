import type { PubGameTexts } from "./types";

/** Spanish: translated from the English and Dutch texts (AI translation, not yet reviewed by a native speaker). */
export const es: PubGameTexts = {
  "cafes": {
    "pubs-rococo": {
      "questions": {
        "pubs-rococo-gates": {
          "question": "¿Cuántas puertas hay escondidas en este café?",
          "options": {
            "25": "25",
            "33": "33",
            "41": "41"
          },
          "hints": [
            "Las puertas las dibujó Paul Smekens.",
            "Las encontrarás en la planta baja.",
            "Están colgadas en una pared."
          ]
        }
      },
      "tasks": {}
    },
    "pubs-barok": {
      "questions": {
        "pubs-barok-baroque": {
          "question": "El nombre Barok recuerda el estilo barroco. ¿Dónde se puede ver aún hoy el estilo barroco en este café?",
          "options": {
            "facade": "La fachada",
            "toilets": "Los aseos",
            "ceiling": "El techo"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-barok-shot": {
          "title": "Extra: una ronda de chupitos",
          "instruction": "Pide un chupito: 100 puntos extra por cada jugador que participe. Cualquier bebida cuenta: un chupito sin alcohol vale exactamente lo mismo. Haz una foto de todos los participantes como prueba."
        }
      }
    },
    "pubs-quinten-matsijs": {
      "questions": {
        "pubs-quinten-matsijs-profession": {
          "question": "¿Quinten Matsijs era pintor, herrero o ambas cosas?",
          "options": {
            "painter": "Pintor",
            "smith": "Herrero",
            "both": "Ambas cosas"
          },
          "hints": []
        },
        "pubs-quinten-matsijs-game": {
          "question": "¿Qué juego de bar, de más de 250 años, sigue estando en este café?",
          "options": {
            "frog-game": "El juego de la rana (kikkerspel)",
            "barrel-game": "El juego del tonel (tonspel)",
            "trou-madame": "El trou-madame"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-de-kat": {
      "questions": {
        "pubs-de-kat-cats": {
          "question": "¿Cuántos gatos encuentras en este café?",
          "options": {
            "2": "2",
            "3": "3",
            "5": "5"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-de-kat-tap": {
          "title": "Extra: tirar una cerveza",
          "instruction": "200 puntos extra si uno de vosotros puede tirar una cerveza en algún café. Pregunta siempre antes al personal y no le estorbes nunca. Haz una foto de quien tira la cerveza como prueba."
        }
      }
    },
    "pubs-billies": {
      "questions": {
        "pubs-billies-dogs": {
          "question": "¿Cuántos perros cuentas aquí?",
          "options": {
            "179": "179",
            "210": "210",
            "230": "230"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-barries": {
      "questions": {
        "pubs-barries-savings-box": {
          "question": "En algún lugar de este café hay una vieja hucha (spaarkas). ¿Para qué servía antiguamente?",
          "options": {
            "cafe-game": "Un antiguo juego de bar",
            "staff-wages": "Una caja para el sueldo del personal",
            "customer-savings": "Una hucha para la cerveza de los clientes"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-barries-lucie": {
          "title": "Encuentra a Lucie",
          "instruction": "Encuentra a la guapa mujer rubia que se llama Lucie: es la chica de la cerveza Lucie de la cervecería Seef, en un cartel publicitario de metal de este café. Hazte una foto con ella como prueba."
        }
      }
    },
    "pubs-paters-vaetje": {
      "questions": {
        "pubs-paters-vaetje-matsijs": {
          "question": "En la terraza vuelve la historia de Quinten Matsijs. ¿Te acuerdas de él? ¿Qué ves de él aquí?",
          "options": {
            "cathedral-paintings": "Cuadros en la catedral",
            "nello-patrasche": "Nello y Patrasche",
            "well": "Un viejo pozo"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-paters-vaetje-staff": {
          "title": "Extra: una foto con el personal",
          "instruction": "Hazte una foto con tu camarero o camarera favorito: 100 puntos extra. Pregunta antes, y solo si tienen un momento."
        }
      }
    },
    "pubs-de-varkenspoot": {
      "questions": {
        "pubs-de-varkenspoot-name": {
          "question": "¿Por qué eligió este café su nombre?",
          "options": {
            "pig-market": "Antes aquí se vendían cerdos en el mercado",
            "pigs-trotters": "Antes aquí se servían manitas de cerdo",
            "regular": "Un cliente legendario tenía el apodo de «de varkenspoot»"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-boer-van-tienen": {
      "questions": {
        "pubs-boer-van-tienen-special": {
          "question": "¿Qué tiene de especial este café?",
          "options": {
            "second-oldest": "Es el segundo café más antiguo de Amberes",
            "musicians": "Antes venían aquí músicos famosos",
            "square": "Su lugar en la plaza es especial para muchos amberinos"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-boer-van-tienen-rps": {
          "title": "Extra: piedra, papel o tijera",
          "instruction": "Jugad una ronda de piedra, papel o tijera. Quien pierda bebe un sorbo de su propia bebida (sin alcohol también cuenta) y el equipo gana 100 puntos. Haced una foto de la ronda como prueba."
        }
      }
    },
    "pubs-de-muze": {
      "questions": {
        "pubs-de-muze-animal": {
          "question": "¿Qué animal está escondido aquí?",
          "options": {
            "goose": "Una oca",
            "cow": "Una vaca",
            "horse": "Un caballo"
          },
          "hints": []
        },
        "pubs-de-muze-floors": {
          "question": "¿Cuántas plantas tiene este café?",
          "options": {
            "1": "1",
            "2": "2",
            "3": "3"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-cabron": {
      "questions": {
        "pubs-cabron-cafes": {
          "question": "¿Cuántos cafés crees que tenía Amberes?",
          "options": {
            "200": "200",
            "260": "260",
            "420": "420"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-den-engel": {
      "questions": {
        "pubs-den-engel-clock": {
          "question": "Busca el reloj que está parado para siempre. ¿Qué hora marca?",
          "options": {
            "10-50": "10:50",
            "11-55": "11:55",
            "08-20": "08:20"
          },
          "hints": []
        },
        "pubs-den-engel-why": {
          "question": "¿Por qué se ha parado el tiempo aquí?",
          "options": {
            "cinderella": "El cuento de Cenicienta",
            "battery": "Se ha agotado la pila",
            "angels": "Los ángeles cobran vida"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-den-engel-clog": {
          "title": "Extra: el zueco de Cenicienta",
          "instruction": "Los campeones se distinguen del resto: ¡es tu última oportunidad de ganar puntos extra! Por 300 puntos extra, bebe del zueco de Cenicienta (cualquier bebida cuenta). ¿No encuentras el zueco? Usa el tuyo. Graba un vídeo como prueba."
        }
      }
    }
  }
};
