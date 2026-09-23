import Link from "next/link";
import type { ComponentProps } from "react";

/** "outline" is for dark backgrounds, "outline-light" for parchment backgrounds. */
export type ButtonVariant = "primary" | "outline" | "outline-light";

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gold text-ink hover:bg-parchment",
  outline: "border border-gold/70 text-gold hover:bg-gold hover:text-ink",
  "outline-light":
    "border border-gold-deep text-gold-deep hover:bg-ink hover:text-parchment",
};

/** Shared button look, so a real <button> can match a ButtonLink. */
export function getButtonClasses(variant: ButtonVariant = "primary"): string {
  return `${baseClasses} ${variantClasses[variant]}`;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

/** A Next.js <Link> styled as a button. */
export function ButtonLink({
  variant = "primary",
  className = "",
  ...linkProps
}: ButtonLinkProps) {
  return (
    <Link
      className={`${getButtonClasses(variant)} ${className}`}
      {...linkProps}
    />
  );
}
