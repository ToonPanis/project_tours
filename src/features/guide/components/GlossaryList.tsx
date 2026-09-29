import type { Translator } from "@/i18n/translate";
import type { GlossaryTerm } from "@/types/guide";

/** Difficult architectural terms, folded away until the reader wants them. */
export function GlossaryList({ terms, t }: { terms: GlossaryTerm[]; t: Translator }) {
  return (
    <details className="rounded-sm border border-ink/15 p-4">
      <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
        <span aria-hidden="true">📐 </span>
        {t("guide.glossary")} ({terms.length})
      </summary>
      <dl className="mt-2 space-y-3">
        {terms.map((term) => (
          <div key={term.term}>
            <dt className="font-display text-lg font-semibold">{term.term}</dt>
            <dd className="leading-relaxed">{term.definition}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
