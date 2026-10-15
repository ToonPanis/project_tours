import type { LocalizedContent } from "@/i18n/content";
import type { PracticalInfoItem } from "@/types/walk";

/**
 * What the walk list and the detail page say about Hidden Pubs 2.0, per
 * language. The game's own texts are in game/content/.
 * "Hidden Pubs", "Beery" and "Drunken Bastard" are names: never translated.
 */
export interface HiddenPubsWalkTexts {
  tagline: string;
  shortDescription: string;
  /** Paragraphs separated by an empty line. */
  description: string;
  startLabel: string;
  highlights: string[];
  howItWorksSteps: string[];
  practicalInfo: PracticalInfoItem[];
}

export const hiddenPubsWalkTexts: LocalizedContent<HiddenPubsWalkTexts> = {
  en: {
    tagline: "A pub game through twelve Antwerp cafés",
    shortDescription:
      "A party game for teams: twelve Antwerp cafés, the Drunken Bastard card game, pubtasks and bonus challenges. Everyone plays on their own phone.",
    description:
      "Beery, your host for the night, takes your teams from Rococo to Den Engel through twelve Antwerp cafés, each team on its own route. At every café you pick a drink, play the Drunken Bastard card game, solve a pubtask about the café itself and read a fun fact. Photo and video bonus tasks earn extra points once the host approves them. Most points wins.\n\nEveryone plays on their own phone. Alcohol is never required: every drink may be alcohol-free, a sip is always a sip of your own drink, and points never depend on drinking alcohol. For players aged 18 and over.",
    startLabel: "Create a game",
    highlights: [
      "Twelve Antwerp cafés, from Rococo to Den Engel",
      "Up to 10 teams of up to 10 players, each on their own phone",
      "The Drunken Bastard card game at every café",
      "Pubtasks about the cafés themselves",
      "Photo and video bonus tasks",
      "A live leaderboard and the winners at Den Engel",
    ],
    howItWorksSteps: [
      "Create a game and invite everyone with a link or QR code",
      "Beery takes each team to its next café",
      "Pick a drink and play Drunken Bastard",
      "Solve the pubtask and read the fun fact",
      "Earn bonus points with photos and videos",
      "Most points at Den Engel wins",
    ],
    practicalInfo: [
      { label: "Teams", value: "1 to 10 teams of 1 to 10 players, everyone on their own phone" },
      { label: "Age", value: "18+" },
      { label: "Alcohol", value: "Never required: every drink may be alcohol-free, and points never depend on alcohol." },
      { label: "Photos and videos", value: "Only visible to the players of your game, and deleted after 7 days." },
    ],
  },
  nl: {
    tagline: "Een caféspel langs twaalf Antwerpse cafés",
    shortDescription:
      "Een partyspel voor teams: twaalf Antwerpse cafés, het kaartspel Drunken Bastard, pubtasks en bonusopdrachten. Iedereen speelt op zijn eigen gsm.",
    description:
      "Beery, jullie gastheer voor de avond, brengt jullie teams van Rococo naar Den Engel langs twaalf Antwerpse cafés, elk team op zijn eigen route. In elk café kies je een drankje, speel je het kaartspel Drunken Bastard, los je een pubtask over het café zelf op en lees je een funfact. Bonusopdrachten met een foto of video leveren extra punten op zodra de host ze goedkeurt. Wie de meeste punten heeft, wint.\n\nIedereen speelt op zijn eigen gsm. Alcohol is nooit verplicht: elk drankje mag alcoholvrij zijn, een slok is altijd een slok van je eigen drankje, en punten hangen nooit af van alcohol drinken. Voor spelers van 18 jaar en ouder.",
    startLabel: "Spel aanmaken",
    highlights: [
      "Twaalf Antwerpse cafés, van Rococo tot Den Engel",
      "Tot 10 teams van tot 10 spelers, elk op zijn eigen gsm",
      "Het kaartspel Drunken Bastard in elk café",
      "Pubtasks over de cafés zelf",
      "Bonusopdrachten met foto en video",
      "Een live scorebord en de winnaars in Den Engel",
    ],
    howItWorksSteps: [
      "Maak een spel aan en nodig iedereen uit met een link of QR-code",
      "Beery brengt elk team naar zijn volgende café",
      "Kies een drankje en speel Drunken Bastard",
      "Los de pubtask op en lees de funfact",
      "Verdien bonuspunten met foto's en video's",
      "Wie in Den Engel de meeste punten heeft, wint",
    ],
    practicalInfo: [
      { label: "Teams", value: "1 tot 10 teams van 1 tot 10 spelers, iedereen op zijn eigen gsm" },
      { label: "Leeftijd", value: "18+" },
      { label: "Alcohol", value: "Nooit verplicht: elk drankje mag alcoholvrij zijn, en punten hangen nooit af van alcohol." },
      { label: "Foto's en video's", value: "Alleen zichtbaar voor de spelers van jullie spel, en na 7 dagen gewist." },
    ],
  },
  fr: {
    tagline: "Un jeu de bistrot à travers douze cafés d'Anvers",
    shortDescription:
      "Un jeu de soirée en équipes : douze cafés d'Anvers, le jeu de cartes Drunken Bastard, des pubtasks et des missions bonus. Chacun joue sur son propre téléphone.",
    description:
      "Beery, votre hôte pour la soirée, emmène vos équipes du Rococo jusqu'à Den Engel à travers douze cafés d'Anvers, chaque équipe sur son propre parcours. Dans chaque café, vous choisissez une boisson, jouez au Drunken Bastard, résolvez une pubtask sur le café lui-même et lisez une anecdote. Les missions bonus en photo ou en vidéo rapportent des points en plus une fois validées par l'hôte. Le plus de points gagne.\n\nChacun joue sur son propre téléphone. L'alcool n'est jamais obligatoire : chaque boisson peut être sans alcool, une gorgée est toujours une gorgée de ta propre boisson, et les points ne dépendent jamais de l'alcool. Pour les joueurs de 18 ans et plus.",
    startLabel: "Créer une partie",
    highlights: [
      "Douze cafés d'Anvers, du Rococo jusqu'à Den Engel",
      "Jusqu'à 10 équipes de 10 joueurs, chacun sur son téléphone",
      "Le jeu de cartes Drunken Bastard dans chaque café",
      "Des pubtasks sur les cafés eux-mêmes",
      "Des missions bonus en photo et en vidéo",
      "Un classement en direct et les gagnants à Den Engel",
    ],
    howItWorksSteps: [
      "Crée une partie et invite tout le monde avec un lien ou un QR code",
      "Beery emmène chaque équipe à son prochain café",
      "Choisis une boisson et joue au Drunken Bastard",
      "Résous la pubtask et lis l'anecdote",
      "Gagne des points bonus avec des photos et des vidéos",
      "Le plus de points à Den Engel gagne",
    ],
    practicalInfo: [
      { label: "Équipes", value: "1 à 10 équipes de 1 à 10 joueurs, chacun sur son propre téléphone" },
      { label: "Âge", value: "18+" },
      { label: "Alcool", value: "Jamais obligatoire : chaque boisson peut être sans alcool, et les points ne dépendent jamais de l'alcool." },
      { label: "Photos et vidéos", value: "Visibles uniquement par les joueurs de votre partie, et effacées après 7 jours." },
    ],
  },
  es: {
    tagline: "Un juego de bares por doce cafés de Amberes",
    shortDescription:
      "Un juego de fiesta por equipos: doce cafés de Amberes, el juego de cartas Drunken Bastard, pubtasks y misiones extra. Cada uno juega en su propio móvil.",
    description:
      "Beery, vuestro anfitrión de la noche, lleva a vuestros equipos desde Rococo hasta Den Engel por doce cafés de Amberes, cada equipo por su propia ruta. En cada café elegís una bebida, jugáis a Drunken Bastard, resolvéis una pubtask sobre el propio café y leéis una curiosidad. Las misiones extra con foto o vídeo dan puntos adicionales cuando el anfitrión las aprueba. Gana quien tenga más puntos.\n\nCada uno juega en su propio móvil. El alcohol nunca es obligatorio: cualquier bebida puede ser sin alcohol, un sorbo es siempre un sorbo de tu propia bebida, y los puntos nunca dependen del alcohol. Para jugadores de 18 años o más.",
    startLabel: "Crear una partida",
    highlights: [
      "Doce cafés de Amberes, de Rococo a Den Engel",
      "Hasta 10 equipos de hasta 10 jugadores, cada uno en su móvil",
      "El juego de cartas Drunken Bastard en cada café",
      "Pubtasks sobre los propios cafés",
      "Misiones extra con fotos y vídeos",
      "Una clasificación en directo y los ganadores en Den Engel",
    ],
    howItWorksSteps: [
      "Crea una partida e invita a todos con un enlace o un código QR",
      "Beery lleva a cada equipo a su siguiente café",
      "Elige una bebida y juega a Drunken Bastard",
      "Resuelve la pubtask y lee la curiosidad",
      "Gana puntos extra con fotos y vídeos",
      "Gana quien tenga más puntos en Den Engel",
    ],
    practicalInfo: [
      { label: "Equipos", value: "De 1 a 10 equipos de 1 a 10 jugadores, cada uno en su propio móvil" },
      { label: "Edad", value: "18+" },
      { label: "Alcohol", value: "Nunca obligatorio: cualquier bebida puede ser sin alcohol, y los puntos nunca dependen del alcohol." },
      { label: "Fotos y vídeos", value: "Solo los ven los jugadores de vuestra partida, y se borran a los 7 días." },
    ],
  },
  it: {
    tagline: "Un gioco tra dodici locali di Anversa",
    shortDescription:
      "Un gioco di gruppo a squadre: dodici locali di Anversa, il gioco di carte Drunken Bastard, pubtask e missioni bonus. Ognuno gioca sul proprio telefono.",
    description:
      "Beery, il vostro host per la serata, porta le vostre squadre dal Rococo fino a Den Engel attraverso dodici locali di Anversa, ogni squadra sul proprio percorso. In ogni locale scegliete una bevanda, giocate a Drunken Bastard, risolvete una pubtask sul locale stesso e leggete una curiosità. Le missioni bonus con foto o video danno punti extra quando l'host le approva. Vince chi fa più punti.\n\nOgnuno gioca sul proprio telefono. L'alcol non è mai obbligatorio: ogni bevanda può essere analcolica, un sorso è sempre un sorso della tua bevanda, e i punti non dipendono mai dall'alcol. Per giocatori dai 18 anni in su.",
    startLabel: "Crea una partita",
    highlights: [
      "Dodici locali di Anversa, dal Rococo a Den Engel",
      "Fino a 10 squadre di massimo 10 giocatori, ognuno sul suo telefono",
      "Il gioco di carte Drunken Bastard in ogni locale",
      "Pubtask sui locali stessi",
      "Missioni bonus con foto e video",
      "Una classifica dal vivo e i vincitori a Den Engel",
    ],
    howItWorksSteps: [
      "Crea una partita e invita tutti con un link o un codice QR",
      "Beery porta ogni squadra al suo prossimo locale",
      "Scegli una bevanda e gioca a Drunken Bastard",
      "Risolvi la pubtask e leggi la curiosità",
      "Guadagna punti bonus con foto e video",
      "Vince chi ha più punti a Den Engel",
    ],
    practicalInfo: [
      { label: "Squadre", value: "Da 1 a 10 squadre da 1 a 10 giocatori, ognuno sul proprio telefono" },
      { label: "Età", value: "18+" },
      { label: "Alcol", value: "Mai obbligatorio: ogni bevanda può essere analcolica, e i punti non dipendono mai dall'alcol." },
      { label: "Foto e video", value: "Visibili solo ai giocatori della vostra partita, e cancellati dopo 7 giorni." },
    ],
  },
  de: {
    tagline: "Ein Kneipenspiel durch zwölf Antwerpener Kneipen",
    shortDescription:
      "Ein Partyspiel für Teams: zwölf Antwerpener Kneipen, das Kartenspiel Drunken Bastard, Pubtasks und Bonusaufgaben. Alle spielen auf ihrem eigenen Handy.",
    description:
      "Beery, euer Gastgeber für den Abend, führt eure Teams vom Rococo bis zum Den Engel durch zwölf Antwerpener Kneipen, jedes Team auf seiner eigenen Route. In jeder Kneipe wählt ihr ein Getränk, spielt Drunken Bastard, löst eine Pubtask über die Kneipe selbst und lest einen Fun Fact. Bonusaufgaben mit Foto oder Video bringen Extrapunkte, sobald der Host sie bestätigt. Die meisten Punkte gewinnen.\n\nAlle spielen auf ihrem eigenen Handy. Alkohol ist nie Pflicht: Jedes Getränk darf alkoholfrei sein, ein Schluck ist immer ein Schluck vom eigenen Getränk, und Punkte hängen nie vom Alkohol ab. Für Spieler ab 18 Jahren.",
    startLabel: "Spiel erstellen",
    highlights: [
      "Zwölf Antwerpener Kneipen, vom Rococo bis zum Den Engel",
      "Bis zu 10 Teams mit bis zu 10 Spielern, alle auf ihrem eigenen Handy",
      "Das Kartenspiel Drunken Bastard in jeder Kneipe",
      "Pubtasks über die Kneipen selbst",
      "Bonusaufgaben mit Fotos und Videos",
      "Eine Live-Rangliste und die Gewinner im Den Engel",
    ],
    howItWorksSteps: [
      "Spiel erstellen und alle per Link oder QR-Code einladen",
      "Beery bringt jedes Team zu seiner nächsten Kneipe",
      "Getränk wählen und Drunken Bastard spielen",
      "Die Pubtask lösen und den Fun Fact lesen",
      "Bonuspunkte mit Fotos und Videos sammeln",
      "Die meisten Punkte im Den Engel gewinnen",
    ],
    practicalInfo: [
      { label: "Teams", value: "1 bis 10 Teams mit 1 bis 10 Spielern, alle auf ihrem eigenen Handy" },
      { label: "Alter", value: "18+" },
      { label: "Alkohol", value: "Nie Pflicht: Jedes Getränk darf alkoholfrei sein, und Punkte hängen nie vom Alkohol ab." },
      { label: "Fotos und Videos", value: "Nur für die Spieler eures Spiels sichtbar und nach 7 Tagen gelöscht." },
    ],
  },
  ru: {
    tagline: "Игра по двенадцати кафе Антверпена",
    shortDescription:
      "Командная игра для вечеринки: двенадцать кафе Антверпена, карточная игра Drunken Bastard, pubtasks и бонусные задания. Каждый играет на своём телефоне.",
    description:
      "Beery, ваш ведущий на этот вечер, ведёт ваши команды от Rococo до Den Engel через двенадцать кафе Антверпена, каждую команду по своему маршруту. В каждом кафе вы выбираете напиток, играете в Drunken Bastard, решаете pubtask о самом кафе и читаете интересный факт. Бонусные задания с фото или видео приносят дополнительные очки, когда ведущий их подтверждает. Побеждает тот, у кого больше очков.\n\nКаждый играет на своём телефоне. Алкоголь никогда не обязателен: любой напиток может быть безалкогольным, глоток — это всегда глоток вашего собственного напитка, и очки никогда не зависят от алкоголя. Для игроков от 18 лет.",
    startLabel: "Создать игру",
    highlights: [
      "Двенадцать кафе Антверпена, от Rococo до Den Engel",
      "До 10 команд по 10 игроков, каждый на своём телефоне",
      "Карточная игра Drunken Bastard в каждом кафе",
      "Pubtasks о самих кафе",
      "Бонусные задания с фото и видео",
      "Живой рейтинг и победители в Den Engel",
    ],
    howItWorksSteps: [
      "Создайте игру и пригласите всех по ссылке или QR-коду",
      "Beery ведёт каждую команду в следующее кафе",
      "Выберите напиток и сыграйте в Drunken Bastard",
      "Решите pubtask и прочитайте интересный факт",
      "Получайте бонусные очки за фото и видео",
      "Побеждает тот, у кого больше всего очков в Den Engel",
    ],
    practicalInfo: [
      { label: "Команды", value: "От 1 до 10 команд по 1–10 игроков, каждый на своём телефоне" },
      { label: "Возраст", value: "18+" },
      { label: "Алкоголь", value: "Никогда не обязателен: любой напиток может быть безалкогольным, и очки никогда не зависят от алкоголя." },
      { label: "Фото и видео", value: "Видны только игрокам вашей игры и удаляются через 7 дней." },
    ],
  },
  uk: {
    tagline: "Гра дванадцятьма кафе Антверпена",
    shortDescription:
      "Командна гра для вечірки: дванадцять кафе Антверпена, карткова гра Drunken Bastard, pubtasks і бонусні завдання. Кожен грає на своєму телефоні.",
    description:
      "Beery, ваш ведучий на цей вечір, веде ваші команди від Rococo до Den Engel дванадцятьма кафе Антверпена, кожну команду своїм маршрутом. У кожному кафе ви обираєте напій, граєте в Drunken Bastard, розв'язуєте pubtask про саме кафе й читаєте цікавий факт. Бонусні завдання з фото чи відео приносять додаткові очки, коли ведучий їх підтверджує. Перемагає той, у кого найбільше очок.\n\nКожен грає на своєму телефоні. Алкоголь ніколи не обов'язковий: будь-який напій може бути безалкогольним, ковток — це завжди ковток вашого власного напою, і очки ніколи не залежать від алкоголю. Для гравців від 18 років.",
    startLabel: "Створити гру",
    highlights: [
      "Дванадцять кафе Антверпена, від Rococo до Den Engel",
      "До 10 команд по 10 гравців, кожен на своєму телефоні",
      "Карткова гра Drunken Bastard у кожному кафе",
      "Pubtasks про самі кафе",
      "Бонусні завдання з фото й відео",
      "Живий рейтинг і переможці в Den Engel",
    ],
    howItWorksSteps: [
      "Створіть гру й запросіть усіх за посиланням або QR-кодом",
      "Beery веде кожну команду до наступного кафе",
      "Оберіть напій і зіграйте в Drunken Bastard",
      "Розв'яжіть pubtask і прочитайте цікавий факт",
      "Заробляйте бонусні очки за фото й відео",
      "Перемагає той, у кого найбільше очок у Den Engel",
    ],
    practicalInfo: [
      { label: "Команди", value: "Від 1 до 10 команд по 1–10 гравців, кожен на своєму телефоні" },
      { label: "Вік", value: "18+" },
      { label: "Алкоголь", value: "Ніколи не обов'язковий: будь-який напій може бути безалкогольним, і очки ніколи не залежать від алкоголю." },
      { label: "Фото й відео", value: "Бачать лише гравці вашої гри, і видаляються через 7 днів." },
    ],
  },
};
