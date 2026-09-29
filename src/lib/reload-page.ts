/**
 * Full page reload. A separate function so tests can replace it
 * (the browser's window.location.reload can't be mocked in jsdom).
 */
export function reloadPage(): void {
  window.location.reload();
}
