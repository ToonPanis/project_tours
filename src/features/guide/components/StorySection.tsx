import type { Translator } from "@/i18n/translate";
import type { GuideSection } from "@/types/guide";

/**
 * One part of a stop's story. A small label says what kind of text it is
 * (documented, interpretation, background, legend), so history and legend
 * never get mixed up.
 */
export function StorySection({ section, t }: { section: GuideSection; t: Translator }) {
  const kindLabel = t(`guide.sectionLabels.${section.kind}`);
  // Don't repeat the label when the heading already says the same thing.
  const label = kindLabel && kindLabel !== section.heading ? kindLabel : null;
  const isLegend = section.kind === "legend";

  return (
    <section className={isLegend ? "rounded-sm border border-dashed border-gold-deep/60 p-5" : ""}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">{label}</p>
      )}
      {section.heading && (
        <h2 className="font-display text-2xl font-semibold leading-tight">{section.heading}</h2>
      )}
      <div className={`mt-3 space-y-4 leading-relaxed ${isLegend ? "font-display text-lg italic" : "text-lg"}`}>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
