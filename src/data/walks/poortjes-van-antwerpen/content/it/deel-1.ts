import type { PoortjesStopText } from "../types";

/**
 * Part 1: South side & Hoogstraat (gates 1–9). Italian text, translated from ../en/.
 * Quotes from the (Dutch) sources are given in translation.
 */
export const deel1: Record<string, PoortjesStopText> = {
  // ── Gate 1 ────────────────────────────────────────────────────────────
  "poortjes-rosier": {
    name: "Rosier 24",
    subtitle: "La porta di un convento con un santo in un medaglione",
    introduction: [
      "Siete davanti alla lunga facciata chiusa di un convento. Non cercate subito il grande portale principale, ma una porta più piccola con sopra un medaglione ovale. Paul Smekens disegnò proprio una porta così, qui, intorno al 1950: una porta semplice in una cornice di pietra ricurva, coronata da un busto in una cornice ovale.",
      "È il primo di cinquanta portali. Nel 1951 Smekens pubblicò un libro con 52 rilievi misurati di antichi portali di Anversa: prospetto, pianta e scala grafica, al centimetro. Settant'anni dopo seguiamo le sue orme. Alcuni portali sono ancora qui, alcuni sono stati spostati, altri sono scomparsi.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Da quasi quattro secoli dietro questa facciata vivono monache carmelitane. L'ordine veniva dalla Spagna: nel 1612 Anna di San Bartolomeo arrivò ad Anversa con due consorelle. Nel settembre 1615 gli arciduchi Alberto e Isabella posero la prima pietra del nuovo convento; la chiesa fu costruita tra il 1636 e il 1639.",
          "Nel 1783 il convento fu soppresso e utilizzato come caserma e deposito di fieno. Nel 1801 le suore poterono tornare, e nel 1843 riebbero anche la loro chiesa. Nel 1951 Smekens scriveva semplicemente: «Presso il convento delle Teresiane spagnole. Nella nicchia una statua di san Giuseppe.» Con «Teresiane» intende le Carmelitane, l'ordine riformato di Teresa d'Ávila.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "Secondo l'inventario fiammingo del patrimonio (Inventaris Onroerend Erfgoed), la facciata principale ha un importante portale barocco del 1653: un portale a tutto sesto in una cornice di pietra blu con chiave di volta, affiancato da lesene. Nei muri laterali si trovano inoltre porte ad arco ribassato con i busti di san Giuseppe (a destra) e santa Teresa (a sinistra), entrambi del 1856.",
          "Il disegno di Smekens mostra una porta di questo tipo: una cornice ad arco ribassato con un ampio bordo modanato, un cornicione aggettante e, al di sopra, il busto in un medaglione ovale. In basso, la pianta mostra quanto in profondità la cornice di pietra sia inserita nel muro.",
        ],
      },
      {
        heading: "Rinascimento o Barocco?",
        kind: "context",
        paragraphs: [
          "Lungo il percorso noterete che Smekens definisce molti portali «portali rinascimentali», mentre l'inventario attuale li data per lo più al XVII secolo e li chiama «barocchi». Non è una contraddizione da risolvere: sono due modi di dare un nome alle cose, uno del 1951 e uno del nostro tempo. In questa guida li riportiamo entrambi, e diciamo sempre chi afferma che cosa.",
          "Su Paul Smekens stesso non abbiamo ancora trovato molte informazioni affidabili. [Ricerca storica necessaria]",
        ],
      },
    ],
    glossary: ["spiegelboog", "pilaster", "sluitsteen", "hardsteen"],
    thenAndNow: [
      "Allora: Smekens disegnò una porta con un busto in un medaglione ovale e lo definì una statua di san Giuseppe.",
      "Oggi: confrontate voi stessi. Il busto c'è ancora? Riuscite a vedere anche la seconda porta con santa Teresa sull'altro lato, come descrive l'inventario? Quale delle due porte è quella del libro?",
    ],
    didYouKnow: [
      "I busti di san Giuseppe e santa Teresa sono più recenti del convento: l'inventario li data al 1856, più di due secoli dopo la chiesa.",
    ],
    lookAt: [
      {
        title: "La pianta sotto il disegno",
        body: "Osservate la striscia sottile sotto la porta nel disegno: è una sezione del muro. Mostra quanto in profondità la cornice di pietra sia inserita nella facciata. Smekens ne disegnò una per ogni portale, e rivedrete queste piccole piante molte altre volte.",
      },
    ],
    transitionToNext: "Raggiungete la Lange Gasthuisstraat. Al numero 37 vi aspetta un portale con un balcone, insieme a un dettaglio che, secondo Smekens, lì non c'entra.",
  },

  // ── Gate 2 ────────────────────────────────────────────────────────────
  "poortjes-lange-gasthuisstraat": {
    name: "Lange Gasthuisstraat 37",
    subtitle: "La casa di città di un'abbazia",
    introduction: [
      "Cercate l'ampio portale con sopra il piccolo balcone in ferro battuto. Guardate prima la cornice del portale stesso: blocchi di pietra alternativamente sporgenti e, in alto, una chiave di volta a forma di voluta.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Per secoli questo edificio fu il «rifugio» dell'abbazia norbertina di Tongerlo: la sua casa di città ad Anversa, dal 1535 al 1581 e dal 1585 al 1699. Un'abbazia di campagna aveva bisogno di una casa simile per sbrigare i propri affari in città, e come riparo sicuro in tempi turbolenti.",
          "La casa ebbe alcuni residenti di spicco: Filippo di Marnix, signore di Saint-Aldegonde, vi abitò nel 1583–1584 come uno dei borgomastri della città, e più tardi il borgomastro Willem Andreas de Caters (1802–1831). Dal 1699 al 1724 appartenne allo scultore Hendrik Frans Verbruggen, che vi fece eseguire importanti trasformazioni. Nel 1941 l'architetto Max Winders progettò il restauro e l'unione con la casa accanto in un edificio per uffici.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive un portale barocco a tutto sesto del XVII secolo in pietra blu, con imbotte doppiamente bugnata e modanata, chiave di volta a voluta, imposte modanate e dadi di base. Ampie volute salgono fino a un gocciolatoio che sostiene un balconcino alla francese in ferro battuto. La porta a due battenti in legno ha pannelli e un montante centrale scolpito.",
        ],
      },
      {
        heading: "Che cosa colpì Smekens",
        kind: "interpretation",
        paragraphs: [
          "Smekens lo chiama «portale rinascimentale con balcone» e fa un'osservazione pungente: «Il cartiglio con la testa di donna scolpita in stile Luigi XV ci sembra apocrifo in questo portale rinascimentale.» In altre parole, riteneva che la testa di donna appartenesse a un'epoca e a uno stile più tardi rispetto al portale. Se sia stata aggiunta in seguito, non lo sappiamo con certezza.",
        ],
      },
    ],
    glossary: ["refugiehuis", "geblokt", "voluut", "makelaar", "lodewijk-stijlen"],
    thenAndNow: [
      "Allora: Smekens disegnò un portale con un balcone e un cartiglio con una testa di donna.",
      "Oggi: cercate la testa di donna. C'è ancora? E stona davvero, come riteneva Smekens, con i blocchi più austeri del portale?",
    ],
    didYouKnow: [
      "Filippo di Marnix di Saint-Aldegonde, che abitò qui, viene spesso indicato come il possibile autore del Wilhelmus, l'inno nazionale olandese. Quella paternità, però, non è mai stata dimostrata con certezza.",
    ],
    lookAt: [
      {
        title: "Due stili, un portale",
        body: "Confrontate i blocchi pesanti e diritti della cornice con la decorazione arricciata in alto. Riuscite a vedere la differenza di carattere di cui parlava Smekens?",
      },
    ],
    transitionToNext: "Raggiungete la Everdijstraat. Lì due portali si trovano a pochi passi l'uno dall'altro, e uno apparteneva a un uomo noto come «il benefattore dei poveri».",
  },

  // ── Gates 3 and 4 ─────────────────────────────────────────────────────
  "poortjes-everdijstraat": {
    name: "Everdijstraat 45 e 31",
    subtitle: "Due portali, un benefattore",
    introduction: [
      "In questa breve via, due portali del libro si trovano a poche decine di metri di distanza. Cominciate dal numero 45: una casa con frontone a gradoni e un portale monumentale sulla destra. Poi proseguite fino al numero 31, la dimora «Hagelsteen».",
    ],
    sections: [
      {
        heading: "Il numero 45",
        kind: "history",
        paragraphs: [
          "La casa al numero 45 risale alla seconda metà del XVI secolo; il portale fu aggiunto nella seconda metà del XVII secolo. L'inventario descrive «una cornice in pietra blu modanata e bugnata con chiave di volta, poggiante su lesene ioniche scolpite», sormontata da un gocciolatoio a cornicione su una pesante fila di dentelli, affiancata da ampie volute con ghirlande e rosette.",
          "Per questo portale Smekens scrive soltanto «portale rinascimentale». Della funzione originaria di questo portale in particolare si sa poco con certezza.",
        ],
      },
      {
        heading: "Il numero 31: Hagelsteen",
        kind: "history",
        paragraphs: [
          "La dimora Hagelsteen risale alla fine del XVI secolo. Nel 1621 la famiglia Van Eeden la vendette a Cornelis Lantschot (1572–1656), un ricco mercante. Smekens lo chiama «il benefattore dei poveri». Secondo l'inventario, il portale è un portale barocco in pietra blu della seconda metà del XVII secolo: un arco a tutto sesto bugnato con un'ampia chiave di volta a voluta su lesene ioniche con fusti incassati.",
          "In seguito la casa cambiò molto: nel 1880 fu aggiunto un terzo piano, e intorno al 1925 la facciata fu intonacata con cemento. Dietro la facciata si trova un cortile del primo quarto del XVII secolo con un porticato su colonne tuscaniche.",
        ],
      },
    ],
    glossary: ["kapiteel", "waterlijst", "trapgevel"],
    thenAndNow: [
      "Allora: al numero 31 Smekens disegnò un «portale rinascimentale con cornice». Il libro non menziona alcuna modifica.",
      "Oggi: la facciata del numero 31 fu intonacata intorno al 1925. Osservate se il portale del disegno si distingue ancora così nettamente dalla facciata come allora, o se la facciata più recente gli è cresciuta intorno.",
    ],
    didYouKnow: [
      "Cornelis Lantschot ricomparirà più avanti in questa passeggiata. Fondò un ospizio sulla Falconrui; anche lì Smekens disegnò un piccolo portale, oggi scomparso.",
    ],
    lookAt: [
      {
        title: "Capitelli ionici",
        body: "In cima alle lesene accanto al portale, cercate le due piccole volute. È il segno distintivo del capitello ionico. Li hanno entrambi i portali qui.",
      },
    ],
    transitionToNext: "Dietro l'angolo, nella Groendalstraat, c'è una casa in cui comandavano i fornai. Cercate non una, ma due piccole porte.",
  },

  // ── Gate 5 ────────────────────────────────────────────────────────────
  "poortjes-groendalstraat": {
    name: "Groendalstraat 18-20",
    subtitle: "La casa dei fornai",
    introduction: [
      "Cercate la casa bassa con il vistoso pianterreno in pietra blu. Ha due piccole porte, ciascuna con una sopraluce a ventaglio. Smekens ne disegnò una.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Il nucleo della casa Sint-Christoffel (San Cristoforo) risale al periodo 1562–1592. Nel 1621 passò alla corporazione dei fornai, l'associazione di mestiere dei panettieri. Smekens scrive che era «proprietà del decano dei fornai», il capo eletto della corporazione.",
          "Nel 1672 gli ingressi ricevettero le loro porte barocche. Anche Smekens riporta quell'anno: «Risale al 1672.»",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive «porte barocche in pietra blu con sopraluce a ventaglio, in cornici arcuate bugnate con chiavi di volta a voluta». L'intero pianterreno è una vistosa vetrina in pietra blu. Il piano superiore è in mattoni e arenaria a fasce: strisce orizzontali di arenaria chiara nella muratura di mattoni rossi.",
        ],
      },
    ],
    glossary: ["waaier", "bovenlicht"],
    thenAndNow: [
      "Allora: Smekens disegnò una delle due porte, con la sua sopraluce e la chiave di volta a voluta.",
      "Oggi: le porte sono due. Quale è quella del libro? Osservate i dettagli della sopraluce e intorno alla chiave di volta.",
    ],
    didYouKnow: [
      "San Cristoforo è il santo che, secondo la leggenda, portò il Bambino Gesù oltre un fiume. Molte case di Anversa avevano un nome come questo al posto del numero civico; i numeri civici arrivarono solo molto più tardi.",
    ],
    transitionToNext: "Ora una camminata più lunga verso ovest, in direzione della Schelda, fino alla Kloosterstraat. La casa che vedrete lì porta il nome di un uomo famoso che non vi abitò mai.",
  },

  // ── Gate 6 ────────────────────────────────────────────────────────────
  "poortjes-kloosterstraat": {
    name: "Kloosterstraat 13",
    subtitle: "La casa che ricevette il nome sbagliato",
    introduction: [
      "Davanti a voi c'è una facciata lunga e bassa, larga otto finestre, in morbida arenaria gialla. Al centro della facciata si trova un robusto portale in pietra blu. Dietro si apre un cortile con quattro ali.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Il complesso risale al 1547–1555, come dimostrano una pietra datata e le teste delle travi. Nel 1619 il proprietario Peter Paschier de Deckere vi fece eseguire importanti trasformazioni. Nel 1698 il mercante Norberto Schut fece aggiungere dall'architetto Hendrik Frans Verbruggen una quarta ala, barocca. Smekens vi fa riferimento: «il cortile della dimora De Deckere, risalente al 1698».",
          "Oggi la casa si chiama Mercator-Orteliushuis. Smekens lo considerava già un errore nel 1951: «Chiamata erroneamente: la casa di Abraham Ortelius.» L'inventario lo conferma: il celebre cartografo (1527–1598) abitava al numero 43 di questa via, una casa demolita nel 1937.",
          "L'edificio andò in rovina finché la Vereniging van Historische Woonsteden (Società delle dimore storiche) lo acquistò nel 1943. Fu tutelato nel 1946, donato alla città nel 1950 e restaurato nel 1952–1953.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive il portale sulla strada come una «cornice di porta barocca in pietra blu del XVII secolo: un arco a tutto sesto bugnato inserito in un arco ribassato modanato con dadi di base, imposte, chiave di volta scolpita e gocciolatoio».",
        ],
      },
    ],
    glossary: ["neuten", "imposten", "rondboog"],
    thenAndNow: [
      "Allora: Smekens vide il portale quando la casa era in rovina, poco prima o durante il restauro del 1952–1953.",
      "Oggi: osservate l'arenaria gialla della facciata e il blu scuro della pietra blu. Quel contrasto rende oggi il portale ben visibile.",
    ],
    didYouKnow: [
      "Una casa intitolata a una celebrità che non vi abitò mai non è un'eccezione anversana. Dimostra soprattutto quanto a una città piaccia dare un indirizzo ai suoi grandi nomi.",
    ],
    transitionToNext: "Tornate verso il centro, nella Hoogstraat, una delle vie più antiche della città. Lì tre portali del libro si trovano quasi uno accanto all'altro.",
  },

  // ── Gates 7 and 8 (+ plate 3) ─────────────────────────────────────────
  "poortjes-hoogstraat": {
    name: "Hoogstraat 15-21",
    subtitle: "Antichi nomi di case e un vicolo nascosto",
    introduction: [
      "Siete nella Hoogstraat, tra frontoni a gradoni in arenaria. In questi pochi metri Smekens disegnò tre portali: il numero 15B («De Wolsack», il sacco di lana), il numero 21 e, come extra, il numero 15. Guardate i pianterreni: oggi sono per lo più negozi, ma tra le vetrine sopravvivono antiche cornici di portali.",
    ],
    sections: [
      {
        heading: "La via",
        kind: "history",
        paragraphs: [
          "La Hoogstraat è menzionata già nel 1232 come «alta platea» e dal 1305 si chiama Hoogstraat. Collegava il centro della città con il sud. Nel 1443 un incendio distrusse quasi tutti i suoi edifici. Nel XVI secolo qui si commerciava il lino.",
        ],
      },
      {
        heading: "Case con un nome",
        kind: "history",
        paragraphs: [
          "Su De Wolsack Smekens scrive: «Questa casa era già menzionata nel 1461.» L'inventario descrive «Wolsack, Gulden Osch e Schilt van Mechelen» come tre tradizionali case profonde della seconda metà del XVI secolo, larghe in tutto sette campate, con una facciata interamente in arenaria e tre frontoni a gradoni. Il portale è un portale a tutto sesto in una cornice barocca di pietra blu del 1650 circa.",
          "Attenzione: l'inventario colloca oggi queste case ai numeri Hoogstraat 15A, 17 e 17A. I numeri civici sono quindi cambiati dal 1951. Anche i nomi delle case si sono spostati: la casa di destra si chiamava «Lyntworm» nel 1561, «Cleynen gulden Schilt» nel 1579 e «Schilt van Mechelen» nel 1638.",
        ],
      },
      {
        heading: "Il numero 21 e il Vlaaikensgang",
        kind: "history",
        paragraphs: [
          "Smekens definisce il portale al numero 21 «rigorosamente classico, con triglifi fantasiosi». Secondo lui dava accesso a «uno dei lotti antichissimi della Hoogstraat, chiamato De Lintworm (la tenia)», con «anche un'uscita lungo il Vlaaikensgang della Koornmarkt».",
          "Non abbiamo trovato una scheda d'inventario specifica per questo portale. Se si trovi ancora oggi al numero 21 va verificato sul posto. [Da verificare sul posto]",
          "Secondo Smekens, anche il numero 15, «De grooten gulden scilt» (il grande scudo d'oro), era collegato al Vlaaikensgang. L'inventario conferma un legame storico tra il Vlaaikensgang e la casa di Hoogstraat 15 dal 1561. Quel vicolo si trova dietro queste case e ha il suo ingresso principale sulla Oude Koornmarkt.",
        ],
      },
      {
        heading: "L'architettura del numero 15",
        kind: "history",
        paragraphs: [
          "Secondo l'inventario, il portale di «Grooten gulden Schilt» (Hoogstraat 15) è un portale ad arco a manico di cesto in una cornice barocca di pietra blu del 1650 circa, con imbotte bugnata in un arco a spalle a motivi di cuoio arrotolato, volute e un cartiglio scolpito con uno stemma vuoto come chiave di volta. La porta di legno mostra rilievi della Vergine Maria, di Giovanni Evangelista, di Elisabetta d'Ungheria e di un mendicante.",
        ],
      },
    ],
    glossary: ["triglief", "korfboog", "schouderboog", "cartouche", "diephuis"],
    thenAndNow: [
      "Allora: nel 1951 queste case avevano numeri diversi da quelli di oggi. Il «15B» di Smekens non è l'attuale 15B.",
      "Oggi: confrontate i tre disegni con le facciate. Quale portale riuscite a trovare, e con quale numero civico si presenta oggi?",
    ],
    didYouKnow: [
      "Una «tenia» sembra un nome strano per una casa, ma i nomi delle case di Anversa potevano essere quasi qualsiasi cosa: animali, oggetti, santi, città. Spesso comparivano su un'insegna o su una pietra murata nella facciata, molto prima che esistessero i numeri civici.",
    ],
    lookAt: [
      {
        title: "La porta del numero 15",
        body: "Cercate la porta di legno con figure scolpite. Riuscite a individuare una figura che chiede l'elemosina? Secondo l'inventario è un mendicante accanto a santa Elisabetta d'Ungheria.",
      },
    ],
    transitionToNext: "Raggiungete la Suikerrui, l'ampia via che porta alla Schelda. Cercate un ariete d'oro.",
  },

  // ── Gate 9 ────────────────────────────────────────────────────────────
  "poortjes-suikerrui": {
    name: "Suikerrui 22",
    subtitle: "De Gouden Ram (L'ariete d'oro)",
    introduction: [
      "Sulla Suikerrui, cercate il portale con un ariete dorato come chiave di volta. Poi osservate il resto della cornice: rosette sulle lesene e intorno all'arco.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "De Gouden Ram è una dimora del XVII secolo. Nel 1823 il farmacista olandese Klaas Jan Cupérus (1769–1851) vi aprì una drogheria e un commercio di tè. L'azienda di famiglia Cupérus divenne un noto commerciante di tè e partecipò alle esposizioni universali del 1885, del 1894 e del 1930. Nel 1926 il negozio si trasferì sulla Schoenmarkt.",
          "All'interno la casa conserva una sala giapponese con pannelli laccati del periodo Edo, raffiguranti draghi, galli, uccelli, pesci e farfalle. La sala non è aperta al pubblico.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "L'inventario descrive un portale barocco a tutto sesto in pietra blu, probabilmente del XVII secolo: «L'imbotte modanata e bugnata, con dadi di base, orecchie e imposte a giunti, è accentuata da rosette e da un cartiglio con un ariete dorato come chiave di volta.» Smekens lo riassume così: «Con un ariete su un cartiglio e rose sulle lesene e sugli archi.»",
        ],
      },
    ],
    glossary: ["rondboog", "neuten"],
    thenAndNow: [
      "Allora: Smekens disegnò l'ariete in bianco e nero, come parte della pietra.",
      "Oggi: l'ariete è dorato e salta subito all'occhio. Contate le rosette: sono tante quante nel disegno?",
    ],
    didYouKnow: [
      "Il nome «De Gouden Ram» sopravvive ancora oggi nell'attività ospitata nell'edificio; la ditta di tè Cupérus si era invece trasferita sulla Schoenmarkt già nel 1926.",
    ],
    transitionToNext: "Fine della prima parte. Raggiungete la Grote Markt: è ora di una pausa nel cuore della città.",
  },
};
