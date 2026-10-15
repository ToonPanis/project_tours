/**
 * What to do about a failed MongoDB connection, in words, for scripts/db-setup.mjs
 * and scripts/db-check.mjs. Based on the error's name and code only (the message
 * could contain parts of the connection string).
 *
 * @param {unknown} error
 * @returns {string}
 */
export function connectionHint(error) {
  const name = error instanceof Error ? error.name : "";
  const code = error instanceof Error && "code" in error ? error.code : undefined;

  if (name === "MissingDatabaseName") {
    return "  MONGODB_URI has no database name: put it after the host, e.g. …mongodb.net/hiddenantwerp?retryWrites=true&w=majority";
  }
  if (name === "MongoParseError" || name === "MongoAPIError") {
    return "  MONGODB_URI is not a valid connection string. A password with @ : / ? # % must be URL-encoded.";
  }
  if (code === 18 || code === 8000 || name === "MongoServerError") {
    return "  Atlas refused the login: check the user name and password (Atlas → Database Access).";
  }
  if (name === "MongoServerSelectionError" || name === "MongoNetworkError" || name === "MongoNetworkTimeoutError") {
    return "  Atlas could not be reached: is your IP address on the list (Atlas → Network Access), and are you online?";
  }
  return "  See the error name above; the connection string is never printed.";
}
