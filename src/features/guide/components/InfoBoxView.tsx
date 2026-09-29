import { formatDate } from "@/features/walks/utils/format-walk";
import type { Translator } from "@/i18n/translate";
import type { InfoBox } from "@/types/guide";

const icons: Record<InfoBox["kind"], string> = {
  pause: "☕",
  visit: "🎟",
  access: "🚪",
};

/** Practical information (a pause, a museum visit, access), with when it was last checked. */
export function InfoBoxView({ box, t }: { box: InfoBox; t: Translator }) {
  return (
    <aside className="rounded-sm border border-ink/15 bg-white/50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
        <span aria-hidden="true">{icons[box.kind]} </span>
        {t(`guide.infoBoxTitles.${box.kind}`)}
      </p>
      <h2 className="mt-1 font-display text-xl font-semibold">{box.title}</h2>
      <div className="mt-2 space-y-3 leading-relaxed">
        {box.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {(box.checkedOn || box.sourceUrl) && (
        <p className="mt-3 text-xs text-sepia/80">
          {box.checkedOn && t("guide.checkedOn", { date: formatDate(box.checkedOn, t.locale) })}
          {box.checkedOn && box.sourceUrl && " · "}
          {box.sourceUrl && (
            <a href={box.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              {t("guide.moreInfo")}
            </a>
          )}
        </p>
      )}
    </aside>
  );
}
