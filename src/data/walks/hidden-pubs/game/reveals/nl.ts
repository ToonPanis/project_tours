import type { PubGameReveals } from "../content/types";

/** Dutch reveal texts. SERVER ONLY: imported only by reveals/index.server.ts. Follows the concept's wording. */
export const revealsNl: PubGameReveals = {
  cafes: {
    "pubs-rococo": {
      explanations: {
        "pubs-rococo-gates": "33 poorten, getekend door Paul Smekens. [Het aantal moet nog ter plaatse gecontroleerd worden.]",
      },
      funFact: {
        title: "De oude poortjes van Smekens",
        kind: "history",
        status: "partially-verified",
        paragraphs: [
          "De Antwerpse kunstenaar Paul Smekens tekende de oude poorten en poortjes van de stad voor zijn boek Oude poortjes in Antwerpen. 52 tekeningen (De Sikkel, 1951). Sommige van die poorten staan er nog, andere zijn verdwenen.",
          "Wil je de echte zien? Volg de wandeling \"Poortjes van Antwerpen\" in deze app.",
        ],
      },
    },
    "pubs-barok": {
      explanations: { "pubs-barok-baroque": "Het plafond." },
      funFact: {
        title: "Barok",
        kind: "history",
        status: "research-required",
        paragraphs: ["[Historisch onderzoek vereist] Het verhaal van dit café volgt hier."],
      },
    },
    "pubs-quinten-matsijs": {
      explanations: {
        "pubs-quinten-matsijs-profession":
          "Een schilder: Quinten Matsijs (rond 1466–1530) werd een van de toonaangevende schilders van Antwerpen. Dat hij eerst zelf smid was, is een legende; zijn vader was smid.",
        "pubs-quinten-matsijs-game": "Het tonspel. [De ouderdom moet nog gecontroleerd worden.]",
      },
      funFact: {
        title: "Het oudste café van Antwerpen?",
        kind: "history",
        status: "research-required",
        paragraphs: [
          "Café Quinten Matsijs staat bekend als het oudste café van Antwerpen. [Historisch onderzoek vereist: datum en bronnen moeten nog gecontroleerd worden.]",
        ],
      },
    },
    "pubs-de-kat": {
      explanations: { "pubs-de-kat-cats": "3 katten. [Nog ter plaatse te controleren.]" },
      funFact: {
        title: "Een café voor muzikanten",
        kind: "history",
        status: "research-required",
        paragraphs: ["In De Kat kwamen vroeger veel muzikanten. [Historisch onderzoek vereist: wie, en wanneer?]"],
      },
    },
    "pubs-billies": {
      explanations: { "pubs-billies-dogs": "179 honden. [Nog ter plaatse te controleren.]" },
      funFact: {
        title: "Billie's Bier Kafétaria",
        kind: "history",
        status: "research-required",
        paragraphs: ["[Historisch onderzoek vereist] Het verhaal van dit café volgt hier."],
      },
    },
    "pubs-barries": {
      explanations: { "pubs-barries-savings-box": "Een spaarkas voor het bier van de klanten." },
      funFact: {
        title: "De spaarkas",
        kind: "cafe-story",
        status: "partially-verified",
        paragraphs: [
          "Vaste klanten spaarden vroeger in de spaarkas; het gespaarde geld diende meestal om op het einde van de maand hun rekening af te rekenen.",
          "Vandaag zit er alleen nog monopolygeld in: dieven die in het café inbreken, breken de spaarkas als eerste open en vinden er enkel monopolygeld.",
        ],
      },
    },
    "pubs-paters-vaetje": {
      explanations: {
        "pubs-paters-vaetje-matsijs":
          "De oude waterput met het smeedijzeren werk, naast de kathedraal. Volgens de overlevering is het smeedwerk van Quinten Matsijs, maar dat is nooit bewezen. In de steen zou staan: \"Dese putkevie werd gesmeed door Quinten Matsijs. De liefde maeckte van den smidt eenen schilder.\" [Exacte tekst nog ter plaatse te controleren.]",
      },
      funFact: {
        title: "De smid die schilder werd",
        kind: "legend",
        status: "partially-verified",
        paragraphs: [
          "Antwerpen vertelt een romantisch verhaal: Quinten, de zoon van een smid, werd verliefd op een meisje van wie de vader alleen een schilder wilde, geen smid. Dus legde Quinten zijn hamer neer en nam hij het penseel op.",
          "Een ander verhaal zegt dat hij op een schilderij van de vader van zijn geliefde een vlieg schilderde, zo levensecht dat de man haar probeerde weg te vegen en daarna met het huwelijk instemde.",
          "Historici zien deze verhalen als legendes: er is geen bewijs dat Quinten zelf ooit smid was. Zijn vader wel.",
        ],
      },
    },
    "pubs-de-varkenspoot": {
      explanations: {
        "pubs-de-varkenspoot-name":
          "Hier werd vroeger een bekend bruin-cafégerecht geserveerd: pied de cochon, of \"de varkenspoot\" in de Antwerpse volksmond. [Nog te controleren.]",
      },
      funFact: {
        title: "Pied de cochon",
        kind: "cafe-story",
        status: "partially-verified",
        paragraphs: [
          "Het café dankt zijn naam aan een klassiek gerecht: pied de cochon, voor Antwerpenaren gewoon \"de varkenspoot\". [Historisch onderzoek vereist: sinds wanneer, en staat het nog op de kaart?]",
        ],
      },
    },
    "pubs-boer-van-tienen": {
      explanations: { "pubs-boer-van-tienen-special": "Het staat bekend als het op een na oudste café van Antwerpen. [Nog te controleren.]" },
      funFact: {
        title: "Het op een na oudste café",
        kind: "history",
        status: "research-required",
        paragraphs: [
          "In den Boer van Tienen staat bekend als het op een na oudste café van Antwerpen. [Historisch onderzoek vereist: datum en bronnen moeten nog gecontroleerd worden.]",
        ],
      },
    },
    "pubs-de-muze": {
      explanations: {
        "pubs-de-muze-animal": "Een paard. [Nog ter plaatse te controleren.]",
        "pubs-de-muze-floors": "Drie verdiepingen. [Nog ter plaatse te controleren.]",
      },
      funFact: {
        title: "De Muze",
        kind: "history",
        status: "research-required",
        paragraphs: ["[Historisch onderzoek vereist] Het verhaal van dit café volgt hier."],
      },
    },
    "pubs-cabron": {
      explanations: { "pubs-cabron-cafes": "420. [Welk jaar en welke bron moet nog gecontroleerd worden.]" },
      funFact: {
        title: "Een stad vol cafés",
        kind: "history",
        status: "research-required",
        paragraphs: ["Antwerpen zou ooit zo'n 420 cafés geteld hebben. [Historisch onderzoek vereist: in welk jaar, en volgens welke bron?]"],
      },
    },
    "pubs-den-engel": {
      explanations: {
        "pubs-den-engel-clock": "11:55: vijf voor twaalf.",
        "pubs-den-engel-why": "Het sprookje van Assepoester.",
      },
      funFact: {
        title: "De klok die nooit middernacht slaat",
        kind: "cafe-story",
        status: "partially-verified",
        paragraphs: [
          "De klok van Den Engel staat stil op vijf voor twaalf. Het verhaal van het café leent van Assepoester: zolang de klok geen middernacht slaat, hoeft het feest nooit te stoppen.",
        ],
      },
    },
  },
};
