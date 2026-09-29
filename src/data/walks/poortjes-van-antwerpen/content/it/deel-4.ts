import type { PoortjesStopText } from "../types";

/** Part 4: Falconplein & old port district (gates 42–50) and Part 5: MAS. Italian text, translated from ../en/. */
export const deel4: Record<string, PoortjesStopText> = {
  // ── Gate 42 (+ vanished 43) ──────────────────────────────────────────
  "poortjes-falconplein": {
    name: "Falconplein 39: la Falconpoort",
    subtitle: "L'ultimo frammento di un convento",
    introduction: [
      "Sulla Falconplein cercate un grande portale in pietra blu inglobato in un moderno complesso residenziale. Osservate il cartiglio in alto: contiene un testo latino con alcune lettere vistosamente più grandi.",
    ],
    sections: [
      {
        heading: "Il convento delle Falcontine",
        kind: "history",
        paragraphs: [
          "La Falconpoort è l'unico resto del convento delle suore Falcontine. Fu fondato nel XIV secolo da Falco de Lampage, maestro di zecca del duca Giovanni III di Brabante; Smekens lo chiama «il ricco italiano Falco de Lampagne». Nel XV secolo il convento si ingrandì notevolmente, e all'inizio del XVI secolo occupava un intero isolato tra la Oudeleeuwenrui, la Generaal Belliardstraat, la Falconrui e la Falconplein.",
          "Nel 1784 il convento fu soppresso dall'imperatore Giuseppe II. Nel 1792 divenne un ospedale militare e un anno dopo bruciò. Sotto il dominio francese, nel 1810 il terreno fu venduto alla città; per ordine di Napoleone vi sorse la caserma Falcon, rimasta in piedi fino alla demolizione nel 1941. Smekens scrive nel 1951: «ora anch'essa demolita».",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "Il portale risale al 1671: un arco a tutto sesto in pietra blu, incorniciato da lesene ad anelli con capitelli decorati. In cima si trovava in origine una statua di sant'Agostino, patrono del convento. Il cartiglio reca l'iscrizione «VerVs RegVLarIVM DoCtor», «il vero maestro del clero regolare», un riferimento ad Agostino.",
          "Il portale è tutelato come monumento dal 22 dicembre 1943.",
        ],
      },
      {
        heading: "L'antico quartiere portuale",
        kind: "context",
        paragraphs: [
          "Da qui la città cambia volto. Nel XVI secolo Gilbert van Schoonbeke tracciò a nord della città vecchia la «Nieuwstad» (Città Nuova), con case e tre darsene interne: il Brouwersvliet, il Timmervliet e il Middelvliet. Dove oggi ci sono strade, allora c'era l'acqua, e i commerci arrivavano fin sotto le case.",
        ],
      },
    ],
    glossary: ["chronogram", "kapiteel"],
    thenAndNow: [
      "Allora: Smekens disegnò il portale isolato, con l'iscrizione nel cartiglio. Scrive al passato che in cima «si ergeva fiera» una statua di Agostino.",
      "Oggi: il portale si trova in un complesso residenziale ricostruito. Secondo l'inventario, una statua ottocentesca della Madonna con resti di ferro battuto ricorda le case operaie che un tempo si trovavano dietro il portale.",
    ],
    didYouKnow: [
      "L'iscrizione è un cronogramma. Sommate le lettere grandi che sono anche numeri romani: V (5) + V (5) + V (5) + L (50) + I (1) + V (5) + M (1000) + D (500) + C (100). In totale: 1671, l'anno di costruzione del portale.",
    ],
    lookAt: [
      {
        title: "Fate il calcolo voi stessi",
        body: "Nel cartiglio cercate le lettere scritte più grandi delle altre. Sommatele come numeri romani. Vi viene 1671?",
      },
    ],
    transitionToNext: "Raggiungete la Oudeleeuwenrui. Lì cercate una mano nella pietra.",
  },

  // ── Gate 45 (+ vanished 44) ──────────────────────────────────────────
  "poortjes-oudeleeuwenrui": {
    name: "Oudeleeuwenrui 58",
    subtitle: "De Gulden Handt (La Mano d'Oro)",
    introduction: [
      "Cercate un portale barocco coronato da un frontone spezzato e da un cartiglio. Guardate bene il cartiglio: contiene una mano e un anno.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "Smekens: «Del 1669, con la raffigurazione di una mano. Resto del birrificio De gulden handt.» Secondo l'inventario, il portale proviene davvero dal birrificio De Gulden Handt e risale al 1669.",
          "Perché il portale si trovi qui è un'altra storia. La distilleria «Het Anker» (L'Ancora), attiva a quanto pare dal 1753, fu rilevata intorno al 1815 da Jean Meeùs. Suo nipote Jules Meeûs trasferì l'attività sulla Oudeleeuwenrui nel 1897, e lì il vecchio portale del birrificio fu inserito in una nuova facciata.",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "Il portale è in pietra blu: un arco a tutto sesto con chiave di volta a voluta su «lesene bugnate con capitelli», in «un campo ad arco a specchio con volute e gocce», coronato da un frontone spezzato con un cartiglio che mostra la mano e l'anno.",
        ],
      },
    ],
    glossary: ["fronton", "voluut"],
    thenAndNow: [
      "Allora: nel 1951 il portale si trovava qui già da più di cinquant'anni, nella facciata della distilleria.",
      "Oggi: l'edificio è ben conservato, ma negli anni Cinquanta il mezzanino originale e i tetti a due falde hanno lasciato il posto a un secondo piano completo. Confrontate la mano nel cartiglio con il disegno.",
    ],
    didYouKnow: [
      "Sulla vicina Hessenplein Smekens disegnò un portale del birrificio «De Bel» (La Campana), «come testimonia il sonaglio rotondo nella chiave di volta del cartiglio». Non indica alcun numero civico; il portale è scomparso.",
    ],
    transitionToNext: "Raggiungete la Lange Noordstraat. Lì cercate una campana nella facciata.",
  },

  // ── Gate 46 ───────────────────────────────────────────────────────────
  "poortjes-lange-noordstraat": {
    name: "Lange Noordstraat 19",
    subtitle: "De Clocke: dove si controllavano pesi e misure",
    introduction: [
      "Cercate una casa larga e bassa con un semplice portale ad arco a tutto sesto. Sopra il portale c'è una pietra di facciata con una campana in bassorilievo.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "De Clocke (La Campana) era un'antica locanda di posta, dove i viaggiatori potevano ricoverare cavallo e carro. La menzione più antica risale al 1560. Nel XIX secolo era un'osteria con sala da ballo; Smekens la definisce «un'osteria e sala da ballo molto frequentata».",
          "Dopo l'incendio della pesa pubblica nel 1873, vi fu ospitato temporaneamente l'ufficio metrico ufficiale, che controllava che pesi e misure dei commercianti fossero corretti. Smekens lo dice più in breve: «Vi aveva sede il servizio ufficiale di verifica dei pesi e delle misure.»",
        ],
      },
      {
        heading: "Architettura",
        kind: "history",
        paragraphs: [
          "Questa tradizionale casa larga risale alla seconda metà del XVI secolo, con quattro campate e due piani sotto un tetto a due falde. Il portale è «un portale ad arco a tutto sesto in una semplice cornice bugnata di pietra blu», con imposte a punta di diamante. La pietra di facciata mostra «una campana» in bassorilievo. Smekens lo chiama un «portale rinascimentale con un bassorilievo raffigurante una campana».",
        ],
      },
    ],
    glossary: ["barleef", "diamantkop", "ijkdienst"],
    thenAndNow: [
      "Allora: Smekens disegnò il portale con la campana come pietra di facciata.",
      "Oggi: la casa è stata conservata. Cercate la campana, e cercate le punte di diamante sulle imposte.",
    ],
    didYouKnow: [
      "La campana sulla pietra di facciata rende visibile a chiunque passi il nome della casa, senza una sola parola o cifra.",
    ],
    transitionToNext: "Raggiungete la Adriaan Brouwerstraat, un tempo Brouwersstraat (Via dei Birrai). Lì vi aspetta l'ultima ricerca.",
  },

  // ── Gates 47–50: search task ─────────────────────────────────────────
  "poortjes-adriaan-brouwerstraat": {
    name: "Adriaan Brouwerstraat",
    subtitle: "Ricerca: la via dei birrai",
    introduction: [
      "Un tempo questa via si chiamava Brouwersstraat (Via dei Birrai). Smekens vi disegnò quattro portali, e sono ancora tutti e quattro al loro posto. Percorrete lentamente la via e osservate le facciate: quali riconoscete?",
    ],
    searchTask: {
      title: "Quali portali riuscite ancora a riconoscere?",
      intro: "Quattro disegni, quattro portali. Non è un quiz: osservate, confrontate e toccate «Trovato!» quando ne riconoscete uno. Se vi bloccate, guardate un indizio o la soluzione.",
      hideStoryUntilDone: false,
      items: [
        {
          plate: 7,
          question: "Un portale con le stelle. Dov'è?",
          hints: ["Cercate un'iscrizione sulla chiave di volta.", "Sono numeri civici bassi."],
          solution: "Adriaan Brouwerstraat 5, dal birrificio De Gulde Sterre (La Stella d'Oro).",
          explanation: [
            "Sulla chiave di volta si legge «GVLDE STER». Smekens: «Il motivo della stella compare sugli elementi laterali. Apparteneva al birrificio De gulden sterre. Questo motivo evoca la stella d'oro, emblema dei birrai.» L'inventario data la casa alla prima metà del XVII secolo.",
          ],
        },
        {
          plate: 29,
          question: "Un portale severo con colonne e una finestrella sopra.",
          hints: ["Guardate le colonne: al centro sono leggermente più spesse.", "La casa si trova all'angolo con un'altra via."],
          solution: "Adriaan Brouwerstraat 17, all'angolo con la Korte Zeevaartstraat.",
          explanation: [
            "Smekens: «Un disegno rigorosamente classico, questa volta senza volute né riccioli.» L'inventario descrive un «portale protobarocco in pietra blu della prima metà del XVII secolo», con chiave di volta a mascherone, «colonne a tre quarti con fusti rigonfi» e un frontone curvo spezzato con un sopraluce rettangolare. Gli edifici sono stati restaurati nel 2014–2015.",
          ],
        },
        {
          plate: 20,
          question: "Un portale con l'emblema dei birrai e un anno.",
          hints: ["Cercate l'edificio più antico della via.", "L'anno è intorno alla chiave di volta: 16..."],
          solution: "Adriaan Brouwerstraat 20, il Brouwershuis (Casa dei Birrai, o Casa dell'Acqua), con «ANNO 1655».",
          explanation: [
            "Questo portale non apparteneva alla Casa dell'Acqua. Smekens racconta che proveniva da un vecchio birrificio e apparteneva al signor W. Pouillon di Kalmthout, finché il consiglio comunale, nella seduta del 30 marzo 1922, decise di acquistarlo per 1.000 franchi e di collocarlo all'ingresso della Casa dell'Acqua. L'inventario lo conferma: «trasferito qui nel 1922».",
          ],
        },
        {
          plate: 39,
          question: "Un portale con un ventaglio, una rosa e un'iscrizione.",
          hints: ["Leggete il nastro nella parte alta del disegno.", "È il numero civico più alto dei quattro."],
          solution: "Adriaan Brouwerstraat 29, «In de Roose» (Alla Rosa).",
          explanation: [
            "Smekens: «Con motivo a ventaglio e a rosa e l'iscrizione In de roose. Apparteneva al birrificio De roode roos (La Rosa Rossa).» Secondo l'inventario, il birraio De Bridt fece costruire la casa su progetto dell'architetto Jan Pieter van Baurscheit il Giovane: i conti datano il suo progetto al 1738 e il completamento al 1743. Smekens definisce lo stile Luigi XIV, l'inventario Régence.",
          ],
        },
      ],
      outro: "Tutti e quattro ancora al loro posto, o quasi: uno dei quattro è a sua volta un portale che ha traslocato. Quale? Esatto, quello del Brouwershuis.",
    },
    sections: [
      {
        heading: "La via di Van Schoonbeke",
        kind: "history",
        paragraphs: [
          "La via fu tracciata intorno al 1550 da Gilbert van Schoonbeke, quando urbanizzò la Nieuwstad a nord del Brouwersvliet. Intorno al 1553 vi costruì circa sedici birrifici. Nel corso del tempo la via prese i nomi di «Groote Middelstrate», «Breestrate» e dal 1694 «Brouwersstraat». Nel 1936 ricevette il nome attuale, in onore del pittore Adriaen Brouwer (ca. 1606–1638).",
        ],
      },
      {
        heading: "Il Brouwershuis",
        kind: "history",
        paragraphs: [
          "Al numero 20 sorge il Brouwershuis o Waterhuis (Casa dell'Acqua), costruito nel 1553–1554 da Van Schoonbeke per l'approvvigionamento idrico. Una ruota idraulica azionata da cavalli pompava l'acqua dal canale di Herentals e la distribuiva ai birrifici, fino al 1930 circa. La casa appartenne alla città dal 1561 e nel 1582 divenne la sede della corporazione dei birrai. Aprì come museo nel 1933 e fu restaurata nel 1956–1961.",
        ],
      },
    ],
    glossary: ["mascaron", "sluitsteen", "waaier"],
    didYouKnow: [
      "Tre portali del libro che si trovano o si trovavano altrove in città provenivano da questa via: il portale scomparso della Zilversmidstraat (birrificio De Trouw), la cornice del birrificio Van Pruyssen nel giardino dell'Accademia e, secondo Smekens, probabilmente il portale dello stesso Brouwershuis.",
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visitare il Brouwershuis",
        paragraphs: [
          "Il Brouwershuis ha riaperto al pubblico nel maggio 2024 dopo trent'anni (VRT NWS). Non abbiamo verificato gli orari di apertura attuali. [Da verificare]",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://www.vrt.be/vrtnws/nl/2024/05/07/brouwershuis-in-antwerpen-na-30-jaar-weer-open-voor-publiek/",
      },
    ],
    transitionToNext: "Mancano solo poche centinaia di metri. Davanti a voi si alza un'alta torre: il MAS, la fine della passeggiata.",
  },

  // ── End: MAS ─────────────────────────────────────────────────────────
  "poortjes-mas": {
    name: "MAS",
    subtitle: "Da un portale al mondo intero",
    introduction: [
      "Siete ai piedi del MAS, il Museum aan de Stroom (Museo sul Fiume): una torre di sessanta metri tra le vecchie darsene. Alzate lo sguardo. Tra poco, se l'edificio è aperto, potrete salire fino al tetto.",
      "Questa passeggiata è cominciata davanti a una piccola porta nella facciata di un convento. Finisce davanti a un museo che racconta la grande storia: quella di Anversa, del porto e del mondo.",
    ],
    sections: [
      {
        heading: "Il MAS",
        kind: "history",
        paragraphs: [
          "MAS sta per Museum aan de Stroom. È stato progettato da Neutelings Riedijk Architects, vincitori del concorso internazionale nel 1999, ed è stato inaugurato il 14 maggio 2011. La torre è alta 60 metri. Il museo custodisce circa 600.000 oggetti sui legami tra Anversa e il mondo.",
          "L'edificio sorge sul luogo dell'Hanzehuis o Oosterlingenhuis (Casa degli Orientali), un magazzino cinquecentesco dei mercanti della Lega anseatica, progettato da Cornelis Floris de Vriendt. È lo stesso architetto che progettò il municipio sulla Grote Markt.",
        ],
      },
      {
        heading: "L'Eilandje",
        kind: "history",
        paragraphs: [
          "Questo quartiere faceva parte della Nieuwstad che Gilbert van Schoonbeke tracciò nel XVI secolo, con darsene interne come il Brouwersvliet. Il nome «Eilandje» (Isoletta) comparve nel 1869, quando lo scavo del Verbindingsdok lasciò la zona residenziale completamente circondata dall'acqua.",
          "Quando il porto si spostò verso nord, la zona decadde. Dagli anni Ottanta in poi darsene e magazzini sono stati trasformati poco a poco in un quartiere residenziale e museale.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Salire in cima",
        paragraphs: [
          "Il percorso pedonale con le scale mobili e il panorama sul tetto sono gratuiti negli orari di apertura dell'edificio: da martedì a domenica dalle 9.30 alle 22, e dal 1° aprile al 31 ottobre fino a mezzanotte (ultimo ingresso alle 23.30). Chiuso il lunedì (tranne il lunedì di Pasqua e il lunedì di Pentecoste), il 1° gennaio, il 1° maggio e il 25 dicembre; il 24 e il 31 dicembre fino alle 15. In caso di maltempo il panorama può essere chiuso temporaneamente.",
          "Per le sale del museo serve un biglietto. Sono aperte da martedì a domenica, dalle 10 alle 17 (ultimo ingresso alle 16).",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://mas.be/en/page/how-when-get-here",
      },
    ],
    didYouKnow: [
      "Sulla piazza davanti al MAS si trova un mosaico di 1.600 m² dell'artista Luc Tuymans, intitolato «Dead Skull».",
    ],
    lookAt: [
      {
        title: "Dall'alto",
        body: "Dal tetto cercate la guglia della cattedrale. Da qualche parte lì in mezzo, nelle viuzze, ci sono i portali che avete visto oggi.",
      },
    ],
    closing: {
      timeline: [
        "Rosier: la porta di un convento con un santo",
        "Hoogstraat: nomi di case di prima dei numeri civici",
        "Grote Markt: corporazioni e un gigante",
        "Gildekamersstraat: anni scolpiti nella pietra",
        "Handelsbeurs: denaro e commercio mondiale",
        "Accademia: portali senza casa",
        "Brouwersstraat: birrai e acqua",
        "MAS: il porto e il mondo",
      ],
      finalLines: [
        "Oggi siete passati davanti a cinquanta portali. Alcuni erano ancora in piedi, alcuni avevano traslocato, e alcuni li conoscete solo da un disegno del 1951.",
        "Paul Smekens li misurò al centimetro, perché sapeva che una città cambia.",
        "D'ora in poi, fate caso alle porte.",
      ],
    },
  },

  // ── Optional: Red Star Line ──────────────────────────────────────────
  "poortjes-red-star-line": {
    name: "Red Star Line Museum",
    subtitle: "Extra: il viaggio verso l'America",
    introduction: [
      "Non siete ancora stanchi di camminare? Qui, nei vecchi edifici della compagnia di navigazione Red Star Line, milioni di europei iniziarono il loro viaggio verso una nuova vita.",
    ],
    sections: [
      {
        heading: "La storia",
        kind: "history",
        paragraphs: [
          "La Red Star Line operò sull'Eilandje per più di mezzo secolo. Secondo il museo, tra il 1873 e il 1934 più di due milioni di emigranti lasciarono l'Europa per il Nord America sulle sue navi, in cerca di un nuovo inizio.",
          "Il museo sorge «nel luogo autentico della storica compagnia di navigazione» e racconta «una storia universale di speranza, di sogni e di ricerca della felicità, basata sulle storie personali di emigranti del XX secolo». È stato inaugurato nel 2013.",
        ],
      },
    ],
    infoBoxes: [
      {
        kind: "visit",
        title: "Visita",
        paragraphs: [
          "Montevideostraat 3. Aperto da martedì a domenica, dalle 10 alle 17; chiuso il lunedì, tranne il lunedì di Pasqua e il lunedì di Pentecoste. Per il museo serve un biglietto: controllate i prezzi attuali sul sito del museo.",
        ],
        checkedOn: "2026-09-26",
        sourceUrl: "https://redstarline.be/en/content/museum",
      },
    ],
    didYouKnow: [
      "Anche questa storia comincia e finisce davanti a una porta: quella della casa europea che gli emigranti si lasciavano alle spalle, e quella del loro nuovo paese.",
    ],
  },
};
