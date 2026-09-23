"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  title: string;
  children: ReactNode;
  /** "sheet" fills the phone screen; "alert" is a small centred box. */
  size?: "sheet" | "alert";
}

/**
 * A modal built on the native HTML <dialog> element, which gives us focus
 * trapping, the Escape key and a backdrop for free, without a library.
 */
export function Dialog({ open, onClose, title, children, size = "sheet" }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Keep the native dialog in sync with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal?.();
    if (!open && dialog.open) dialog.close?.();
  }, [open]);

  const sizeClasses =
    size === "sheet"
      ? "h-dvh max-h-none w-full max-w-lg sm:my-8 sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:rounded-sm"
      : "w-[calc(100%-2rem)] max-w-sm rounded-sm";

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      // `onClose` also fires when the user presses Escape.
      onClose={onClose}
      className={`m-auto bg-umber p-0 text-parchment backdrop:bg-ink/80 ${sizeClasses}`}
    >
      {open && children}
    </dialog>
  );
}
