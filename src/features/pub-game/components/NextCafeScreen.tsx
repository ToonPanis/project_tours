"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cafeName } from "@/data/walks/hidden-pubs/game/cafes";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PubGameHandle } from "../client/usePubGame";
import { Beery } from "./Beery";
import { BeeryPopup } from "./BeeryPopup";

// The map, GPS and the walking routes are big: load them only when a team is on its way.
const CafeNavigation = dynamic(() => import("./CafeNavigation"), {
  ssr: false,
  loading: () => <NavigationLoading />,
});

function NavigationLoading() {
  const t = useT();
  return <p className="px-4 py-8 text-center text-parchment/70 sm:px-6">{t("gps.mapLoading")}</p>;
}

interface NextCafeScreenProps {
  game: PubGameHandle;
  /** Location was allowed earlier in this game: no explainer at the next café. */
  gpsEnabled: boolean;
  onGpsEnabled: () => void;
}

/**
 * On the way to the team's next café. Beery announces it once per café with
 * the line from the concept ("Beery brengt je naar de volgende locatie!" in
 * Dutch); then the live navigation. Arriving (GPS or "I'm here") moves the
 * whole team on, on every phone.
 */
export function NextCafeScreen({ game, gpsEnabled, onGpsEnabled }: NextCafeScreenProps) {
  const t = useT();
  const { view, act } = game;
  const cafeId = view.team.route[view.team.cafeIndex];
  // Keyed by café: a new café shows the popup again; a re-render (poll) doesn't.
  const [dismissedCafe, setDismissedCafe] = useState<string | null>(null);

  if (dismissedCafe !== cafeId) {
    return (
      <>
        <PlayScreen
          eyebrow={t("pubgame.nextCafe.eyebrow", { current: view.team.cafeIndex + 1, total: view.team.route.length })}
          title={cafeName(cafeId)}
          screenId={`pub-game-next-${cafeId}`}
        >
          <Beery>
            <p>{t("pubgame.nextCafe.text")}</p>
          </Beery>
        </PlayScreen>
        <BeeryPopup open title={t("pubgame.beery.nextLocation")} onClose={() => setDismissedCafe(cafeId)}>
          <p className="font-display text-2xl text-gold">{cafeName(cafeId)}</p>
        </BeeryPopup>
      </>
    );
  }

  return (
    <CafeNavigation
      view={view}
      gpsEnabled={gpsEnabled}
      onGpsEnabled={onGpsEnabled}
      // A teammate may have tapped "I'm here" first: the next poll shows the café anyway.
      onArrive={() => void act({ type: "ARRIVE" })}
    />
  );
}
