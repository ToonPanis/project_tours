import Image from "next/image";
import type { GuideImage } from "@/types/guide";

interface GuideImageFigureProps {
  image: GuideImage;
  /** Load immediately (for the first image on the page). */
  preload?: boolean;
}

/** Credit line required by the image's license: year, maker, license and a link to the source. */
export function ImageCredit({ image }: { image: GuideImage }) {
  return (
    <>
      {image.approximateYear} · {image.photographerOrArtist} ·{" "}
      <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        {image.source}
      </a>{" "}
      ·{" "}
      {image.licenseUrl ? (
        <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {image.license}
        </a>
      ) : (
        image.license
      )}
    </>
  );
}

/** A (historical) image with its caption and a small source/license credit. */
export function GuideImageFigure({ image, preload = false }: GuideImageFigureProps) {
  return (
    <figure className="flex flex-col gap-2">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 32rem) 32rem, 100vw"
        preload={preload}
        className={`h-auto w-full rounded-sm ${image.isHistorical ? "sepia-[.15]" : ""}`}
      />
      <figcaption className="px-1">
        <p className="font-display text-base italic leading-snug text-ink">{image.caption}</p>
        <p className="mt-0.5 text-[0.7rem] text-sepia/75">
          <ImageCredit image={image} />
        </p>
      </figcaption>
    </figure>
  );
}
