import Image from "next/image";
import type { ImageAsset } from "@/types/common";

interface WalkCoverProps {
  image?: ImageAsset;
  /** Tells the browser how wide the image is shown, for responsive loading. */
  sizes: string;
  priority?: boolean;
}

/**
 * Shows the walk's cover image, or an ornamental "engraving" placeholder
 * when no real (archive) image is available yet.
 * The parent element must be `relative` and have a size/aspect ratio.
 */
export function WalkCover({ image, sizes, priority = false }: WalkCoverProps) {
  if (image) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover sepia-[.35]"
      />
    );
  }

  // Decorative only (aria-hidden): the walk title is always shown as text elsewhere.
  return (
    <div aria-hidden="true" className="bg-night-map absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-3 border border-gold/40" />
      <div className="absolute inset-5 border border-gold/15" />
      {/* A simple arched doorway emblem. */}
      <svg viewBox="0 0 60 80" className="h-1/2 max-h-32 text-gold/70" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 78V32a22 22 0 0 1 44 0v46" />
        <path d="M16 78V34a14 14 0 0 1 28 0v44" />
        <path d="M2 78h56" />
        <circle cx="30" cy="20" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
