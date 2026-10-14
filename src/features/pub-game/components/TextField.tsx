"use client";

import { MAX_NAME_LENGTH } from "../config";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

/** A labelled one-line text field in the game style (big, readable in a dark café). */
export function TextField({ label, value, onChange, placeholder, maxLength = MAX_NAME_LENGTH, autoFocus }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-gold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        autoFocus={autoFocus}
        className="min-h-12 rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment placeholder:text-parchment/35 focus:border-gold focus:outline-none"
      />
    </label>
  );
}
