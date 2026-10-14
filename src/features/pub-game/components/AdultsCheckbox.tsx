"use client";

import { useT } from "@/i18n/client";

interface AdultsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** The 18+ confirmation (D4), with the reminder that no one has to drink alcohol. */
export function AdultsCheckbox({ checked, onChange }: AdultsCheckboxProps) {
  const t = useT();
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-sm border border-gold/40 bg-ink/30 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby="adults-note"
        className="mt-1 h-5 w-5 shrink-0 accent-gold"
      />
      <span className="flex flex-col gap-1">
        <span className="font-semibold text-parchment">{t("pubgame.adults.confirm")}</span>
        <span id="adults-note" className="text-sm text-parchment/75">
          {t("pubgame.adults.note")}
        </span>
      </span>
    </label>
  );
}
