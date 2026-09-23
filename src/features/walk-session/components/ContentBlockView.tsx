import type { ContentBlock } from "@/types/content";

/** The visible label for each kind of content, so fiction is never mistaken for history. */
function getBlockLabel(block: ContentBlock): string {
  switch (block.kind) {
    case "story":
      return "The Ledger · fiction";
    case "legend":
      return "Local legend";
    case "history":
      return block.verification === "verified" ? "History" : "History · research required";
  }
}

interface ContentBlockViewProps {
  block: ContentBlock;
}

export function ContentBlockView({ block }: ContentBlockViewProps) {
  const isUnverified = block.kind === "history" && block.verification === "research-needed";

  return (
    <article
      className={
        block.kind === "story"
          ? "border-l-2 border-gold/60 pl-4"
          : `rounded-sm border px-4 py-3 ${isUnverified ? "border-dashed border-parchment/25 text-parchment/60" : "border-parchment/20"}`
      }
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/90">
        {getBlockLabel(block)}
      </p>
      {block.kind === "story" && block.chapterTitle && (
        <h2 className="mt-1 font-display text-2xl font-semibold text-parchment">{block.chapterTitle}</h2>
      )}
      <p
        className={
          block.kind === "story"
            ? "mt-2 font-display text-xl leading-relaxed text-parchment"
            : "mt-1 text-sm leading-relaxed"
        }
      >
        {block.body}
      </p>
    </article>
  );
}
