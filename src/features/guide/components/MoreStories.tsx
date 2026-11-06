"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Translator } from "@/i18n/translate";
import type { GuideCard } from "@/types/guide";
import { CardDeck, GuideCardArticle } from "./CardDeck";

/**
 * Optional deeper stories at a stop, closed by default. The walker decides
 * whether to open them; nothing in the walk depends on it.
 */
export function MoreStories({ stories, t }: { stories: GuideCard[]; t: Translator }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <section aria-label={t("guide.moreStories")} className="flex flex-col gap-4 border-t border-dashed border-gold-deep/50 pt-6">
      <p className="text-sm text-sepia">{t("guide.moreStoriesNote")}</p>
      <Button
        variant="outline-light"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        fullWidth
      >
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
        {isOpen ? t("guide.moreStoriesHide") : t("guide.moreStories")}
      </Button>
      <div id={panelId} hidden={!isOpen}>
        {isOpen &&
          (stories.length === 1 ? (
            <GuideCardArticle card={stories[0]} t={t} />
          ) : (
            <CardDeck cards={stories} t={t} />
          ))}
      </div>
    </section>
  );
}
