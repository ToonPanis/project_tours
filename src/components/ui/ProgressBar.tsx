interface ProgressBarProps {
  value: number;
  max: number;
  /** Read by screen readers, e.g. "Walk progress". */
  label: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-2 w-full overflow-hidden rounded-full bg-parchment/15"
    >
      <div
        className="h-full rounded-full bg-gold transition-[width] duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
