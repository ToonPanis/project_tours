"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cafeName } from "@/data/walks/hidden-pubs/game/cafes";
import { pubGameDrinks } from "@/data/walks/hidden-pubs/game/drinks";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PubGameHandle } from "../client/usePubGame";
import { BeerWheel } from "./BeerWheel";
import { Beery } from "./Beery";
import { FormError } from "./FormError";
import { currentCafeId } from "../logic/view-helpers";

/** What this player picked: a drink from the list, a wheel number, alcohol-free, or nothing. */
type Choice = { kind: "drink"; name: string } | { kind: "wheel"; number: number } | { kind: "alcohol-free" } | { kind: "skip" };

/**
 * Step 1 at every café: each player chooses their own drink (no vote, D8).
 * The choice stays on this phone: nothing is sent or counted. Alcohol-free
 * and "no drink" are always there. One tap on "We've got our drinks" moves
 * the whole team on to Drunken Bastard.
 */
export function DrinkStep({ game }: { game: PubGameHandle }) {
  const t = useT();
  const { view, act, busy } = game;
  const cafeId = currentCafeId(view);
  const drinks = pubGameDrinks[cafeId] ?? { kind: "menu", drinks: [] };
  const [choice, setChoice] = useState<Choice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const option = (key: string, label: string, selected: boolean, onSelect: () => void) => (
    <button
      key={key}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex min-h-14 items-center rounded-sm border px-4 text-left text-lg transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
        selected ? "border-gold bg-gold text-ink" : "border-gold/40 text-parchment hover:bg-gold/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <PlayScreen
      eyebrow={t("pubgame.drinks.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length, cafe: cafeName(cafeId) })}
      title={t("pubgame.drinks.welcome", { cafe: cafeName(cafeId) })}
      screenId={`pub-game-drinks-${cafeId}`}
      actions={
        <>
          <FormError error={error} />
          <Button onClick={async () => setError(await act({ type: "DRINKS_DONE" }))} disabled={busy} fullWidth>
            {t("pubgame.drinks.ready")}
          </Button>
        </>
      }
    >
      <Beery>
        <p>{drinks.kind === "wheel" ? t("pubgame.wheel.intro") : t("pubgame.drinks.intro")}</p>
      </Beery>

      <h2 className="font-display text-2xl font-semibold text-parchment">
        {drinks.kind === "wheel" ? t("pubgame.wheel.title") : t("pubgame.drinks.title")}
      </h2>

      {drinks.kind === "wheel" ? (
        <BeerWheel numbers={drinks.numbers} onResult={(number) => setChoice({ kind: "wheel", number })} />
      ) : null}

      <div className="flex flex-col gap-2">
        {drinks.kind === "menu" &&
          drinks.drinks.map((name) =>
            option(name, name, choice?.kind === "drink" && choice.name === name, () => setChoice({ kind: "drink", name })),
          )}
        {option("alcohol-free", t("pubgame.drinks.alcoholFree"), choice?.kind === "alcohol-free", () =>
          setChoice({ kind: "alcohol-free" }),
        )}
        {option("skip", t("pubgame.drinks.skip"), choice?.kind === "skip", () => setChoice({ kind: "skip" }))}
      </div>

      {/* Always mounted, so the confirmation is announced. */}
      <p role="status" className={choice && choice.kind !== "wheel" ? "text-gold" : "sr-only"}>
        {choice?.kind === "drink" && t("pubgame.drinks.yourChoice", { drink: choice.name })}
        {choice?.kind === "alcohol-free" && t("pubgame.drinks.yourChoice", { drink: t("pubgame.drinks.alcoholFree") })}
        {choice?.kind === "skip" && t("pubgame.drinks.noDrink")}
      </p>
      <p className="text-sm text-parchment/70">{t("pubgame.drinks.respect")}</p>
    </PlayScreen>
  );
}
