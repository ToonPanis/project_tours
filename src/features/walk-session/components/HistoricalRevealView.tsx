import type { HistoricalReveal } from "@/types/reveal";
import { getVerificationLabel } from "./ContentBlockView";

interface HistoricalRevealViewProps {
  reveal: HistoricalReveal;
}

/** Real history, clearly labelled with how well it has been verified. */
export function HistoricalRevealView({ reveal }: HistoricalRevealViewProps) {
  const isVerified = reveal.status === "verified";

  return (
    <article
      className={`animate-[reveal_700ms_ease-out] rounded-sm border bg-parchment/5 p-5 ${
        isVerified ? "border-parchment/25" : "border-dashed border-parchment/30"
      }`}
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/90">
        {getVerificationLabel(reveal.status)}
      </p>
      <div className="mt-3 space-y-3 leading-relaxed text-parchment/90">
        {reveal.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {reveal.sources.length > 0 && (
        <p className="mt-4 text-xs text-parchment/60">
          Source:{" "}
          {reveal.sources.map((source, index) => (
            <span key={source.title}>
              {index > 0 && ", "}
              {source.url ? (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {source.title}
                </a>
              ) : (
                source.title
              )}
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
