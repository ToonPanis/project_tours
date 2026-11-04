"use client";

import Image from "next/image";
import { Dialog } from "@/components/ui/Dialog";
import type { Translator } from "@/i18n/translate";
import type { GuideImage } from "@/types/guide";
import { ImageCredit } from "./GuideImageFigure";

/**
 * An image shown large (full screen on a phone, where it can be pinch-zoomed), with
 * its caption and credit. Used by image galleries and by Spooky's clues.
 * `image` null = closed.
 */
export function ImageLightbox({ image, onClose, t }: { image: GuideImage | null; onClose: () => void; t: Translator }) {
  return (
    <Dialog open={image !== null} title={image?.caption ?? ""} onClose={onClose}>
      {image && (
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 32rem) 32rem, 100vw"
            className="h-auto w-full rounded-sm bg-parchment"
          />
          <div>
            <p className="font-display text-lg italic leading-snug">{image.caption}</p>
            <p className="mt-1 text-xs text-parchment/70">
              <ImageCredit image={image} />
            </p>
          </div>
          <button type="button" onClick={onClose} className="mt-auto min-h-11 rounded-sm border border-parchment/40 font-semibold">
            {t("common.close")}
          </button>
        </div>
      )}
    </Dialog>
  );
}
