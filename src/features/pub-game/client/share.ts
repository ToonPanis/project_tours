/**
 * Shares through the phone's own share sheet (WhatsApp, Messages…) when there
 * is one; otherwise, or when the player cancels it, copies `copyText` to the
 * clipboard. Tells what happened, so the screen can say "copied".
 */
export async function shareOrCopy(data: ShareData, copyText: string): Promise<"shared" | "copied" | "failed"> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return "shared";
    } catch {
      // Cancelled by the player, or not allowed: fall back to copying.
    }
  }
  try {
    await navigator.clipboard.writeText(copyText);
    return "copied";
  } catch {
    return "failed";
  }
}
