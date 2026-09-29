"use client"; // Error boundaries must be Client Components.

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { localWalkSessionStore } from "@/features/walk-session/storage/session-storage";
import { useT } from "@/i18n/client";
import { logError } from "@/lib/log-error";
import { reloadPage } from "@/lib/reload-page";

/**
 * Shown instead of the walk when something in the player crashes, e.g. the map
 * code couldn't be downloaded on a weak connection, or a saved game is damaged.
 * Without this file Next.js shows its generic English "Application error" page
 * with no way back.
 *
 * - "Try again" reloads the page. (Next's `retry()` alone wouldn't help after a
 *   failed download: the failed map import stays cached until a reload.)
 *   Progress lives in localStorage, so nothing is lost.
 * - "Start this walk again" (after confirming) deletes only this walk's saved
 *   progress: the way out when the saved game itself causes the crash.
 *
 * It uses the default theme colours: the walk's own theme is set by the page,
 * which this screen replaces.
 */
export default function PlayError({ error }: { error: Error & { digest?: string } }) {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    logError(error);
    // Tell keyboard and screen-reader users that the screen changed.
    headingRef.current?.focus();
  }, [error]);

  return (
    <div className="bg-night-map min-h-full">
      <section className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl font-semibold text-parchment outline-none">
          {t("errors.playError.title")}
        </h1>
        <p className="text-parchment/85">{t("errors.playError.text")}</p>
        <div className="mt-4 flex flex-col gap-3">
          <Button onClick={() => reloadPage()} fullWidth>
            {t("errors.playError.tryAgain")}
          </Button>
          <ButtonLink href="/walks" variant="outline">
            {t("errors.playError.allWalks")}
          </ButtonLink>
          {/* Destructive, so last and quiet (it still asks for confirmation). */}
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="min-h-11 self-center text-sm text-parchment/70 underline underline-offset-4"
          >
            {t("errors.playError.startOver")}
          </button>
        </div>
      </section>
      <ConfirmDialog
        open={isConfirmOpen}
        title={t("errors.playError.startOverTitle")}
        message={t("errors.playError.startOverMessage")}
        confirmLabel={t("errors.playError.startOverConfirm")}
        onConfirm={() => {
          localWalkSessionStore.clear(slug);
          reloadPage();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
