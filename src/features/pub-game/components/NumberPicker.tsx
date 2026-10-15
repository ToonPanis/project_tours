"use client";

interface NumberPickerProps {
  /** Visible label, also the group's accessible name. */
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

/**
 * A row of big number buttons (1–10): one tap, no keyboard, no tiny arrows.
 * The chosen number is marked with aria-pressed for screen readers.
 */
export function NumberPicker({ label, value, min, max, onChange }: NumberPickerProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((number) => (
          <button
            key={number}
            type="button"
            aria-pressed={number === value}
            onClick={() => onChange(number)}
            className={`min-h-12 rounded-sm border font-display text-2xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
              number === value ? "border-gold bg-gold text-ink" : "border-gold/40 text-gold hover:bg-gold/15"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
