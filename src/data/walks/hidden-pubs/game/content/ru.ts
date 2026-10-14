import type { PubGameTexts } from "./types";

/** Russian: translated from the English and Dutch texts (AI translation, not yet reviewed by a native speaker). */
export const ru: PubGameTexts = {
  "cafes": {
    "pubs-rococo": {
      "questions": {
        "pubs-rococo-gates": {
          "question": "Сколько ворот спрятано в этом кафе?",
          "options": {
            "25": "25",
            "33": "33",
            "41": "41"
          },
          "hints": [
            "Ворота нарисовал Paul Smekens.",
            "Вы найдёте их на первом этаже.",
            "Они висят на стене."
          ]
        }
      },
      "tasks": {}
    },
    "pubs-barok": {
      "questions": {
        "pubs-barok-baroque": {
          "question": "Название Barok напоминает о стиле барокко. Где в этом кафе ещё сегодня можно увидеть барокко?",
          "options": {
            "facade": "На фасаде",
            "toilets": "В туалетах",
            "ceiling": "На потолке"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-barok-shot": {
          "title": "Бонус: шот на всех",
          "instruction": "Закажите шот: 100 дополнительных очков за каждого участника. Подходит любой напиток, безалкогольный шот приносит столько же. Сфотографируйте всех участников как доказательство."
        }
      }
    },
    "pubs-quinten-matsijs": {
      "questions": {
        "pubs-quinten-matsijs-profession": {
          "question": "Кем был Quinten Matsijs: художником, кузнецом или и тем и другим?",
          "options": {
            "painter": "Художником",
            "smith": "Кузнецом",
            "both": "И тем и другим"
          },
          "hints": []
        },
        "pubs-quinten-matsijs-game": {
          "question": "Какая трактирная игра, которой больше 250 лет, до сих пор стоит в этом кафе?",
          "options": {
            "frog-game": "Игра «лягушка» (kikkerspel)",
            "barrel-game": "Игра «бочка» (tonspel)",
            "trou-madame": "Тру-мадам"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-de-kat": {
      "questions": {
        "pubs-de-kat-cats": {
          "question": "Сколько кошек вы найдёте в этом кафе?",
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
          "title": "Бонус: налить пиво самому",
          "instruction": "200 дополнительных очков, если кому-то из вас разрешат самому налить пиво в каком-нибудь кафе. Всегда сначала спросите персонал и никогда не мешайте ему. Сфотографируйте того, кто наливает, как доказательство."
        }
      }
    },
    "pubs-billies": {
      "questions": {
        "pubs-billies-dogs": {
          "question": "Сколько собак вы здесь насчитаете?",
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
          "question": "Где-то в этом кафе стоит старая копилка (spaarkas). Для чего она раньше служила?",
          "options": {
            "cafe-game": "Старая трактирная игра",
            "staff-wages": "Касса для зарплаты персонала",
            "customer-savings": "Копилка на пиво для посетителей"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-barries-lucie": {
          "title": "Найдите Люси",
          "instruction": "Найдите красивую блондинку по имени Lucie: это девушка с пива Lucie пивоварни Seef, на металлической рекламной табличке в этом кафе. Сфотографируйтесь с ней как доказательство."
        }
      }
    },
    "pubs-paters-vaetje": {
      "questions": {
        "pubs-paters-vaetje-matsijs": {
          "question": "На террасе снова встречается история Quinten Matsijs. Помните его? Что вы видите здесь от него?",
          "options": {
            "cathedral-paintings": "Картины в соборе",
            "nello-patrasche": "Нелло и Патраша",
            "well": "Старый колодец"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-paters-vaetje-staff": {
          "title": "Бонус: фото с персоналом",
          "instruction": "Сфотографируйтесь с любимым барменом, барменшей или официантом: 100 дополнительных очков. Сначала спросите, и только если у них есть минутка."
        }
      }
    },
    "pubs-de-varkenspoot": {
      "questions": {
        "pubs-de-varkenspoot-name": {
          "question": "Почему кафе выбрало такое название?",
          "options": {
            "pig-market": "Раньше здесь на рынке торговали свиньями",
            "pigs-trotters": "Раньше здесь подавали свиные ножки",
            "regular": "У легендарного завсегдатая было прозвище «de varkenspoot»"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-boer-van-tienen": {
      "questions": {
        "pubs-boer-van-tienen-special": {
          "question": "Что особенного в этом кафе?",
          "options": {
            "second-oldest": "Это второе старейшее кафе Антверпена",
            "musicians": "Раньше сюда приходили известные музыканты",
            "square": "Его место на площади особенно для многих жителей Антверпена"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-boer-van-tienen-rps": {
          "title": "Бонус: камень, ножницы, бумага",
          "instruction": "Сыграйте раунд в камень, ножницы, бумагу. Проигравший делает глоток своего напитка (безалкогольный тоже считается), а команда получает 100 очков. Сфотографируйте раунд как доказательство."
        }
      }
    },
    "pubs-de-muze": {
      "questions": {
        "pubs-de-muze-animal": {
          "question": "Какое животное здесь спрятано?",
          "options": {
            "goose": "Гусь",
            "cow": "Корова",
            "horse": "Лошадь"
          },
          "hints": []
        },
        "pubs-de-muze-floors": {
          "question": "Сколько этажей в этом кафе?",
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
          "question": "Как вы думаете, сколько кафе было в Антверпене?",
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
          "question": "Найдите часы, которые остановились навсегда. Какое время они показывают?",
          "options": {
            "10-50": "10:50",
            "11-55": "11:55",
            "08-20": "08:20"
          },
          "hints": []
        },
        "pubs-den-engel-why": {
          "question": "Почему здесь остановилось время?",
          "options": {
            "cinderella": "Сказка о Золушке",
            "battery": "Села батарейка",
            "angels": "Ангелы оживают"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-den-engel-clog": {
          "title": "Бонус: башмачок Золушки",
          "instruction": "Чемпионы выделяются из толпы: это ваш последний шанс получить дополнительные очки! За 300 бонусных очков выпейте из деревянного башмачка Золушки (подходит любой напиток). Не нашли башмачок? Возьмите свой. Снимите видео как доказательство."
        }
      }
    }
  }
};
