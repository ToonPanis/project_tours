import { englishTranslator, type Translator } from "@/i18n/translate";

interface PlaceholderNoticeProps {
  message?: string;
  t?: Translator;
}

/**
 * Shown wherever content has `contentStatus: "placeholder"`, so unverified
 * text is never presented as historical fact.
 */
export function PlaceholderNotice({ message, t = englishTranslator }: PlaceholderNoticeProps) {
  return (
    <aside
      role="note"
      className="rounded-sm border border-dashed border-gold-deep/50 bg-gold/10 px-4 py-3 text-sm text-sepia"
    >
      <strong className="font-semibold text-gold-deep">{t("walks.placeholder.title")}</strong>
      {message ?? t("walks.placeholder.message")}
    </aside>
  );
}
