import common from "./common.json";
import errors from "./errors.json";
import game from "./game.json";
import gps from "./gps.json";
import guide from "./guide.json";
import home from "./home.json";
import meta from "./meta.json";
import navigation from "./navigation.json";
import walks from "./walks.json";

/** English: the master language. Every other language is checked against these keys. */
const en = { common, navigation, meta, home, errors, walks, game, guide, gps };

export default en;
