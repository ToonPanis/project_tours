/**
 * Logs a caught error to the browser console (on the device only; nothing is sent anywhere).
 * In production only the error's name and digest are logged: a message could contain
 * data such as a map position, and GPS positions must never end up in logs.
 */
export function logError(error: Error & { digest?: string }): void {
  if (process.env.NODE_ENV === "production") {
    console.error(`[Hidden Antwerp] ${error.name}${error.digest ? ` (digest ${error.digest})` : ""}`);
  } else {
    console.error(error);
  }
}
