import { englishTranslator, type Translator } from "@/i18n/translate";
import type { LanguageCode } from "@/types/common";
import type { PracticalInfoItem } from "@/types/walk";
import { formatLanguages } from "../utils/format-walk";

interface WalkPracticalInfoProps {
  items: PracticalInfoItem[];
  languages: LanguageCode[];
  t?: Translator;
}

/** Practical facts such as age advice, alcohol policy and languages. */
export function WalkPracticalInfo({ items, languages, t = englishTranslator }: WalkPracticalInfoProps) {
  const allItems = [...items, { label: t("walks.practical.languages"), value: formatLanguages(languages, t) }];

  return (
    <dl className="divide-y divide-gold-deep/20 border-y border-gold-deep/20">
      {allItems.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-6">
          <dt className="shrink-0 text-xs font-semibold uppercase tracking-wider text-gold-deep sm:w-40 sm:pt-0.5">
            {item.label}
          </dt>
          <dd className="text-sepia">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
