import Image from "next/image";
import type { Translator } from "@/i18n/translate";
import { SPOOKY_IMAGE } from "../spooky";

interface SpookyProps {
  t: Translator;
  /** Shown width in pixels (the height follows the picture). */
  size?: number;
  className?: string;
}

/** Spooky's picture. Which file is used is set in spooky.ts, nowhere else. */
export function Spooky({ t, size = 120, className = "" }: SpookyProps) {
  return (
    <Image
      src={SPOOKY_IMAGE.src}
      alt={t("quest.spookyAlt")}
      width={SPOOKY_IMAGE.width}
      height={SPOOKY_IMAGE.height}
      style={{ width: size, height: "auto" }}
      className={`animate-[fade-in_400ms_ease-out] ${className}`}
      // Small and shown right away in a popup: no lazy loading.
      loading="eager"
    />
  );
}
