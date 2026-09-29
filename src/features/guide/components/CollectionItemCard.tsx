import Image from "next/image";
import type { Translator } from "@/i18n/translate";
import type { CollectionItem } from "@/types/guide";
import { GuideImageFigure } from "./GuideImageFigure";
import { StatusBadge } from "./StatusBadge";

interface CollectionItemCardProps {
  item: CollectionItem;
  t: Translator;
  /** "featured": large drawing (the gate you stand in front of); "compact": thumbnail + text. */
  variant: "featured" | "compact";
  preload?: boolean;
}

/** "Poort 17 · Plaat 9 · BESTAAT NOG" */
export function CollectionItemLabel({ item, t }: { item: CollectionItem; t: Translator }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
      <span>{item.number !== undefined ? t("guide.gateNumber", { numbers: [item.number].join(" · ") }) : t("guide.extraGate")}</span>
      <span aria-hidden="true">·</span>
      <span>{t("guide.plate", { plate: item.plateNumber })}</span>
      <StatusBadge status={item.status} t={t} />
    </p>
  );
}

/** The book's caption and our notes, folded away. */
function SourceCaption({ item, t }: { item: CollectionItem; t: Translator }) {
  return (
    <details className="text-sm">
      <summary className="min-h-11 cursor-pointer py-2 font-semibold text-sepia">{t("guide.sourceCaption")}</summary>
      <blockquote className="border-l-2 border-gold-deep/50 pl-3 font-display italic leading-snug">
        “{item.sourceCaption}”
      </blockquote>
      {item.note && <p className="mt-2 leading-relaxed text-sepia">{item.note}</p>}
    </details>
  );
}

/** One drawing of the collection with its number, status and the book's caption. */
export function CollectionItemCard({ item, t, variant, preload = false }: CollectionItemCardProps) {
  if (variant === "featured") {
    return (
      <div className="flex flex-col gap-2">
        <CollectionItemLabel item={item} t={t} />
        <GuideImageFigure image={item.image} preload={preload} />
        <SourceCaption item={item} t={t} />
      </div>
    );
  }

  return (
    <article className="flex gap-3">
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        sizes="6rem"
        className="h-auto w-20 shrink-0 self-start rounded-sm border border-ink/10 sm:w-24"
      />
      <div className="min-w-0 flex-1">
        <CollectionItemLabel item={item} t={t} />
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{item.address}</h3>
        <p className="text-sm text-sepia">{item.title}</p>
        <SourceCaption item={item} t={t} />
      </div>
    </article>
  );
}
