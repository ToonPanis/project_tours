"use client";

import { useT } from "@/i18n/client";
import type { Translator } from "@/i18n/translate";
import type { ContentBlock } from "@/types/content";
import type { VerificationStatus } from "@/types/reveal";

export function getVerificationLabel(status: VerificationStatus, t: Translator): string {
  switch (status) {
    case "verified":
      return t("game.content.history");
    case "partially-verified":
      return t("game.content.historyPartial");
    case "research-required":
      return t("game.content.historyResearch");
  }
}

/** The visible label for each kind of content, so fiction is never mistaken for history. */
function getBlockLabel(block: ContentBlock, t: Translator): string {
  switch (block.kind) {
    case "story":
      return t("game.content.story");
    case "legend":
      return t("game.content.legend");
    case "history":
      return getVerificationLabel(block.verification, t);
  }
}

interface ContentBlockViewProps {
  block: ContentBlock;
}

export function ContentBlockView({ block }: ContentBlockViewProps) {
  const t = useT();

  if (block.kind === "story") {
    const isUrgent = block.tone === "urgent";
    return (
      <article className={`border-l-2 pl-4 ${isUrgent ? "border-red-400/70" : "border-gold/60"}`}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/90">
          {getBlockLabel(block, t)}
        </p>
        {block.chapterTitle && (
          <h2 className="mt-1 font-display text-2xl font-semibold text-parchment">{block.chapterTitle}</h2>
        )}
        {/* pre-line keeps the line breaks of the ledger's poems. The ledger is
            written in Dutch (it is an old Antwerp document); `lang` lets screen
            readers pronounce it correctly. */}
        <p
          lang={block.originalLanguage}
          className={`mt-2 whitespace-pre-line font-display leading-relaxed text-parchment ${
            isUrgent ? "animate-[tremble_2.5s_ease-in-out_infinite] text-xl italic tracking-wide" : "text-xl"
          }`}
        >
          {block.body}
        </p>
        {/* A translation of that original text, in the visitor's language. */}
        {block.translation && (
          <div className="mt-3 border-t border-parchment/15 pt-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-parchment/55">
              {t("game.story.translation")}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm italic leading-relaxed text-parchment/75">{block.translation}</p>
          </div>
        )}
      </article>
    );
  }

  const isUnverified = block.kind === "history" && block.verification !== "verified";
  return (
    <article
      className={`rounded-sm border px-4 py-3 ${isUnverified ? "border-dashed border-parchment/25 text-parchment/70" : "border-parchment/20"}`}
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/90">
        {getBlockLabel(block, t)}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{block.body}</p>
    </article>
  );
}
