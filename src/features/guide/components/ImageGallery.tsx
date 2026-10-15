"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Translator } from "@/i18n/translate";
import type { GuideGallery, GuideImage } from "@/types/guide";
import { ImageCredit } from "./GuideImageFigure";
import { ImageLightbox } from "./ImageLightbox";

/** True when the visitor asked for less motion: then the gallery jumps instead of sliding. */
function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

/**
 * A calm, image-first gallery: one large historical image at a time, its caption
 * and credit underneath, "1 / 2" and previous/next below. On a phone the images
 * swipe (native CSS scroll snapping, no library); with a keyboard the arrow keys
 * work; every image can be opened large.
 *
 * Images are never cropped: each sits whole ("contain") in a frame of the same
 * shape, so the page doesn't jump when the next one has another size.
 */
export function ImageGallery({ gallery, t }: { gallery: GuideGallery; t: Translator }) {
  const [index, setIndex] = useState(0);
  const [enlarged, setEnlarged] = useState<GuideImage | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const total = gallery.images.length;
  const current = gallery.images[index];

  function goTo(nextIndex: number) {
    const clamped = Math.max(0, Math.min(total - 1, nextIndex));
    setIndex(clamped);
    const track = trackRef.current;
    track?.scrollTo?.({ left: clamped * track.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  // A swipe scrolls the track: follow it, so the counter and buttons stay right.
  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const shown = Math.round(track.scrollLeft / track.clientWidth);
    if (shown !== index && shown >= 0 && shown < total) setIndex(shown);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") goTo(index + 1);
    else if (event.key === "ArrowLeft") goTo(index - 1);
    else return;
    event.preventDefault();
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-roledescription={t("guide.gallery.roleDescription")}
      // Full width on phones (out of the page padding), like a plate in a book.
      className="-mx-4 flex flex-col gap-5 bg-parchment-dark/60 px-4 py-8 sm:mx-0 sm:rounded-sm sm:px-6"
    >
      <header className="max-w-prose">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
          <span aria-hidden="true">🖼 </span>
          {t("guide.gallery.eyebrow")}
        </p>
        <h2 id={titleId} className="mt-1 font-display text-3xl font-semibold leading-tight">
          {gallery.title}
        </h2>
        {gallery.intro && <p className="mt-2 text-lg leading-relaxed text-sepia">{gallery.intro}</p>}
      </header>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={t("guide.gallery.trackLabel", { title: gallery.title })}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-sm outline-offset-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {gallery.images.map((image, imageIndex) => (
          <figure
            key={image.id}
            role="group"
            aria-roledescription={t("guide.gallery.slide")}
            aria-label={t("guide.gallery.position", { current: imageIndex + 1, total })}
            // Only the image in view can be reached with Tab (the others are off screen).
            inert={imageIndex !== index}
            className="flex w-full shrink-0 snap-center flex-col gap-3"
          >
            <button
              type="button"
              onClick={() => setEnlarged(image)}
              aria-label={`${t("guide.gallery.enlarge")}: ${image.alt}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-ink/[0.06]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 32rem) 32rem, 100vw"
                className={`object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none ${
                  image.isHistorical ? "sepia-[.15]" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-ink/80 text-lg text-parchment shadow"
              >
                ⤢
              </span>
            </button>
            <figcaption className="max-w-prose px-1">
              <p className="font-display text-lg italic leading-snug text-ink">{image.caption}</p>
              <p className="mt-1 text-[0.7rem] text-sepia/75">
                <ImageCredit image={image} />
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label={t("guide.gallery.previous")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/30 text-xl disabled:opacity-30"
          >
            ←
          </button>
          {/* Always mounted, so screen readers hear the new position after each move. */}
          <p role="status" className="font-display text-lg tabular-nums tracking-widest text-sepia">
            <span aria-hidden="true">
              {index + 1} / {total}
            </span>
            <span className="sr-only">
              {t("guide.gallery.position", { current: index + 1, total })}: {current.caption}
            </span>
          </p>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === total - 1}
            aria-label={t("guide.gallery.next")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/30 text-xl disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}

      <ImageLightbox image={enlarged} onClose={() => setEnlarged(null)} t={t} />
    </section>
  );
}
