"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/i18n/client";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  /**
   * For actions that can't be undone (e.g. deleting a saved walk): the confirm button
   * is red and Cancel gets the focus, so a quick Enter or tap on the focused button is safe.
   */
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = useT();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Runs after the Dialog's own effect (children's effects run first), which opens
  // the native dialog and focuses its first button: move the focus on to Cancel.
  useEffect(() => {
    if (open && isDestructive) cancelRef.current?.focus();
  }, [open, isDestructive]);

  return (
    <Dialog open={open} onClose={onCancel} title={title} size="alert">
      <div className="flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="text-parchment/85">{message}</p>
        <div className="flex flex-col gap-2">
          <Button variant={isDestructive ? "danger" : "primary"} onClick={onConfirm} fullWidth>
            {confirmLabel}
          </Button>
          <Button ref={cancelRef} variant="outline" onClick={onCancel} fullWidth>
            {t("common.cancel")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
