import type { ComponentProps } from "react";
import { getButtonClasses, type ButtonVariant } from "./ButtonLink";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  /** Stretch to the full width (the default for mobile game screens). */
  fullWidth?: boolean;
};

/** A <button> with the same look as ButtonLink. */
export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${getButtonClasses(variant)} ${fullWidth ? "w-full" : ""} disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...buttonProps}
    />
  );
}
