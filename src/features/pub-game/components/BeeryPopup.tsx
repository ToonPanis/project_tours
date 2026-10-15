"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useT } from "@/i18n/client";
import { Beery } from "./Beery";

interface BeeryPopupProps {
  open: boolean;
  /** Beery's line, e.g. "Beery takes you to the next location!" (also the dialog's name). */
  title: string;
  children?: ReactNode;
  onClose: () => void;
}

/** A short Beery moment: his line, a detail, one button. No long animation to sit through. */
export function BeeryPopup({ open, title, children, onClose }: BeeryPopupProps) {
  const t = useT();
  return (
    <Dialog open={open} onClose={onClose} title={title} size="alert">
      <div className="flex flex-col gap-4 p-6">
        <Beery size="large" />
        <h2 className="font-display text-3xl font-semibold leading-tight">{title}</h2>
        {children}
        <Button onClick={onClose} fullWidth>
          {t("pubgame.beery.letsGo")}
        </Button>
      </div>
    </Dialog>
  );
}
