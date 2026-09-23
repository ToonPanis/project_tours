import type { ContentBlock } from "@/types/content";
import type { VerificationStatus } from "@/types/reveal";

const verificationLabels: Record<VerificationStatus, string> = {
  verified: "History",
  "partially-verified": "History · partially verified",
  "research-required": "History · research required",
};

/** The visible label for each kind of content, so fiction is never mistaken for history. */
function getBlockLabel(block: ContentBlock): string {
  switch (block.kind) {
    case "story":
      return "The Ledger · fiction";
    case "legend":
      return "Local legend";
    case "history":
      return verificationLabels[block.verification];
  }
}

export function getVerificationLabel(status: VerificationStatus): string {
  return verificationLabels[status];
}

interface ContentBlockViewProps {
  block: ContentBlock;
}

export function ContentBlockView({ block }: ContentBlockViewProps) {
  if (block.kind === "story") {
    const isUrgent = block.tone === "urgent";
    return (
      <article className={`border-l-2 pl-4 ${isUrgent ? "border-red-400/70" : "border-gold/60"}`}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/90">
          {getBlockLabel(block)}
        </p>
        {block.chapterTitle && (
          <h2 className="mt-1 font-display text-2xl font-semibold text-parchment">{block.chapterTitle}</h2>
        )}
        {/* pre-line keeps the line breaks of the ledger's poems. */}
        <p
          className={`mt-2 whitespace-pre-line font-display leading-relaxed text-parchment ${
            isUrgent ? "animate-[tremble_2.5s_ease-in-out_infinite] text-xl italic tracking-wide" : "text-xl"
          }`}
        >
          {block.body}
        </p>
      </article>
    );
  }

  const isUnverified = block.kind === "history" && block.verification !== "verified";
  return (
    <article
      className={`rounded-sm border px-4 py-3 ${isUnverified ? "border-dashed border-parchment/25 text-parchment/70" : "border-parchment/20"}`}
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/90">
        {getBlockLabel(block)}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{block.body}</p>
    </article>
  );
}
