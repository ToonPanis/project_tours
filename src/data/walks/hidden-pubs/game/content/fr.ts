import type { PubGameTexts } from "./types";

/** French: translated from the English and Dutch texts (AI translation, not yet reviewed by a native speaker). */
export const fr: PubGameTexts = {
  "cafes": {
    "pubs-rococo": {
      "questions": {
        "pubs-rococo-gates": {
          "question": "Combien de portes sont cachées dans ce café ?",
          "options": {
            "25": "25",
            "33": "33",
            "41": "41"
          },
          "hints": [
            "Les portes ont été dessinées par Paul Smekens.",
            "Tu les trouveras au rez-de-chaussée.",
            "Elles sont accrochées à un mur."
          ]
        }
      },
      "tasks": {}
    },
    "pubs-barok": {
      "questions": {
        "pubs-barok-baroque": {
          "question": "Le nom Barok rappelle le style baroque. Où retrouve-t-on encore ce style baroque dans ce café ?",
          "options": {
            "facade": "La façade",
            "toilets": "Les toilettes",
            "ceiling": "Le plafond"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-barok-shot": {
          "title": "Bonus : une tournée de shots",
          "instruction": "Commande un shot : 100 points en plus pour chaque joueur qui participe. Toute boisson compte, un shot sans alcool rapporte exactement autant. Prends une photo de tous les participants comme preuve."
        }
      }
    },
    "pubs-quinten-matsijs": {
      "questions": {
        "pubs-quinten-matsijs-profession": {
          "question": "Quinten Matsijs était-il peintre, forgeron, ou les deux ?",
          "options": {
            "painter": "Peintre",
            "smith": "Forgeron",
            "both": "Les deux"
          },
          "hints": []
        },
        "pubs-quinten-matsijs-game": {
          "question": "Quel jeu de café, vieux de plus de 250 ans, se trouve encore dans ce café ?",
          "options": {
            "frog-game": "Le jeu de la grenouille (kikkerspel)",
            "barrel-game": "Le jeu du tonneau (tonspel)",
            "trou-madame": "Le trou-madame"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-de-kat": {
      "questions": {
        "pubs-de-kat-cats": {
          "question": "Combien de chats trouves-tu dans ce café ?",
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
          "title": "Bonus : tirer une bière soi-même",
          "instruction": "200 points en plus si l'un de vous peut tirer une bière, dans un café. Demande toujours d'abord au personnel et ne le gêne jamais. Prends une photo de la personne qui tire la bière comme preuve."
        }
      }
    },
    "pubs-billies": {
      "questions": {
        "pubs-billies-dogs": {
          "question": "Combien de chiens comptes-tu ici ?",
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
          "question": "Quelque part dans ce café se trouve une vieille caisse d'épargne (spaarkas). À quoi servait-elle autrefois ?",
          "options": {
            "cafe-game": "Un vieux jeu de café",
            "staff-wages": "Une caisse pour le salaire du personnel",
            "customer-savings": "Une caisse d'épargne pour la bière des clients"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-barries-lucie": {
          "title": "Trouve Lucie",
          "instruction": "Trouve la belle femme blonde qui s'appelle Lucie : c'est la jeune fille de la bière Lucie de la brasserie Seef, sur une plaque publicitaire en métal dans ce café. Prends une photo avec elle comme preuve."
        }
      }
    },
    "pubs-paters-vaetje": {
      "questions": {
        "pubs-paters-vaetje-matsijs": {
          "question": "Sur la terrasse, l'histoire de Quinten Matsijs revient. Tu te souviens de lui ? Que vois-tu de lui ici ?",
          "options": {
            "cathedral-paintings": "Des tableaux dans la cathédrale",
            "nello-patrasche": "Nello et Patrasche",
            "well": "Un vieux puits"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-paters-vaetje-staff": {
          "title": "Bonus : une photo avec le personnel",
          "instruction": "Prends une photo avec ton barman, ta barmaid ou ton serveur préféré : 100 points en plus. Demande d'abord, et seulement s'ils ont un moment."
        }
      }
    },
    "pubs-de-varkenspoot": {
      "questions": {
        "pubs-de-varkenspoot-name": {
          "question": "Pourquoi ce café a-t-il choisi ce nom ?",
          "options": {
            "pig-market": "On vendait autrefois des cochons au marché ici",
            "pigs-trotters": "On servait autrefois des pieds de cochon ici",
            "regular": "Un habitué légendaire était surnommé « de varkenspoot »"
          },
          "hints": []
        }
      },
      "tasks": {}
    },
    "pubs-boer-van-tienen": {
      "questions": {
        "pubs-boer-van-tienen-special": {
          "question": "Qu'a de spécial ce café ?",
          "options": {
            "second-oldest": "C'est le deuxième plus vieux café d'Anvers",
            "musicians": "Des musiciens célèbres venaient ici",
            "square": "Sa place sur la place est spéciale pour beaucoup d'Anversois"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-boer-van-tienen-rps": {
          "title": "Bonus : pierre-feuille-ciseaux",
          "instruction": "Jouez une manche de pierre-feuille-ciseaux. Le perdant boit une gorgée de sa propre boisson (sans alcool, ça compte aussi) et l'équipe gagne 100 points. Prenez une photo de la manche comme preuve."
        }
      }
    },
    "pubs-de-muze": {
      "questions": {
        "pubs-de-muze-animal": {
          "question": "Quel animal se cache ici ?",
          "options": {
            "goose": "Une oie",
            "cow": "Une vache",
            "horse": "Un cheval"
          },
          "hints": []
        },
        "pubs-de-muze-floors": {
          "question": "Combien d'étages compte ce café ?",
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
          "question": "Combien de cafés Anvers comptait-elle, à ton avis ?",
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
          "question": "Trouve l'horloge arrêtée pour toujours. Quelle heure indique-t-elle ?",
          "options": {
            "10-50": "10:50",
            "11-55": "11:55",
            "08-20": "08:20"
          },
          "hints": []
        },
        "pubs-den-engel-why": {
          "question": "Pourquoi le temps s'est-il arrêté ici ?",
          "options": {
            "cinderella": "Le conte de Cendrillon",
            "battery": "La pile est vide",
            "angels": "Les anges prennent vie"
          },
          "hints": []
        }
      },
      "tasks": {
        "pubs-den-engel-clog": {
          "title": "Bonus : le sabot de Cendrillon",
          "instruction": "Les champions se distinguent du commun des mortels : c'est ta dernière chance de gagner des points ! Pour 300 points bonus, bois dans le sabot de Cendrillon (toute boisson compte). Tu ne trouves pas le sabot ? Utilise le tien. Fais une vidéo comme preuve."
        }
      }
    }
  }
};
