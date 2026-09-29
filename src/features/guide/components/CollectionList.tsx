import type { Translator } from "@/i18n/translate";
import type { WalkChapter, WalkCollection } from "@/types/guide";
import { CollectionItemCard } from "./CollectionItemCard";

interface CollectionListProps {
  collection: WalkCollection;
  chapters: WalkChapter[];
  t: Translator;
  /** Heading level of the chapter titles, so the list fits in any page outline. */
  headingLevel?: "h3" | "h4";
}

/**
 * The whole collection (e.g. all 52 drawings) grouped per chapter, including
 * vanished items. It has no state, so it works as a Server Component on the
 * detail page as well as inside the (client) route panel.
 */
export function CollectionList({ collection, chapters, t, headingLevel = "h3" }: CollectionListProps) {
  const Heading = headingLevel;
  const groups = [
    ...chapters.map((chapter) => ({
      key: chapter.id,
      title: `${t("guide.chapter", { number: chapter.number })}: ${chapter.title}`,
      items: collection.items.filter((item) => item.chapterId === chapter.id),
    })),
    { key: "elsewhere", title: t("guide.notOnRoute"), items: collection.items.filter((item) => item.chapterId === null) },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-8 text-ink">
      <p className="leading-relaxed text-sepia">{collection.intro}</p>
      {groups.map((group) => (
        <section key={group.key} aria-label={group.title}>
          <Heading className="font-display text-xl font-semibold">{group.title}</Heading>
          <ul className="mt-3 flex flex-col gap-5">
            {group.items.map((item) => (
              <li key={item.id}>
                <CollectionItemCard item={item} t={t} variant="compact" />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-xs text-sepia/80">{collection.sourceNote}</p>
    </div>
  );
}
