"use client";

import { useState } from "react";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { pubGameCafeNames } from "@/data/walks/hidden-pubs/game/cafes";
import { useT } from "@/i18n/client";
import type { PlayerView } from "../logic/player-view";
import { Beery } from "./Beery";
import { BeeryPopup } from "./BeeryPopup";

/**
 * The team's next café. Beery announces it once per café with the line from
 * the concept ("Beery brengt je naar de volgende locatie!" in Dutch).
 * Stage 5 adds the map, walking directions and arrival here.
 */
export function NextCafeScreen({ view }: { view: PlayerView }) {
  const t = useT();
  const cafeId = view.team.route[view.team.cafeIndex];
  const cafeName = pubGameCafeNames[cafeId] ?? cafeId;
  // Keyed by café: a new café shows the popup again; a re-render (poll) doesn't.
  const [dismissedCafe, setDismissedCafe] = useState<string | null>(null);

  return (
    <>
      <PlayScreen
        eyebrow={t("pubgame.nextCafe.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length })}
        title={cafeName}
        screenId={`pub-game-next-${cafeId}`}
      >
        <Beery>
          <p>{t("pubgame.nextCafe.text")}</p>
        </Beery>
      </PlayScreen>

      <BeeryPopup
        open={dismissedCafe !== cafeId}
        title={t("pubgame.beery.nextLocation")}
        onClose={() => setDismissedCafe(cafeId)}
      >
        <p className="font-display text-2xl text-gold">{cafeName}</p>
      </BeeryPopup>
    </>
  );
}
