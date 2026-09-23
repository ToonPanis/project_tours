"use client";

import { Button } from "./Button";
import { Dialog } from "./Dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} title={title} size="alert">
      <div className="flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="text-parchment/85">{message}</p>
        <div className="flex flex-col gap-2">
          <Button onClick={onConfirm} fullWidth>
            {confirmLabel}
          </Button>
          <Button variant="outline" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
