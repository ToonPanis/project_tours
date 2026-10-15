"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cafeName } from "@/data/walks/hidden-pubs/game/cafes";
import { PlayScreen } from "@/features/walk-session/components/PlayScreen";
import { useT } from "@/i18n/client";
import type { PubGameHandle } from "../client/usePubGame";
import { Beery } from "./Beery";
import { BeeryPopup } from "./BeeryPopup";
import { FormError } from "./FormError";
import { currentCafeId } from "../logic/view-helpers";

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
  const cafeId = currentCafeId(view);
  // Keyed by café: a new café shows the popup again; a re-render (poll) doesn't.
  const [dismissedCafe, setDismissedCafe] = useState<string | null>(null);
  const [arriveError, setArriveError] = useState<string | null>(null);

  async function arrive() {
    const error = await act({ type: "ARRIVE" });
    // "wrong-step": a teammate was quicker, and the next poll shows the café anyway.
    setArriveError(error === "wrong-step" ? null : error);
  }

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
    <>
      {/* Always mounted. When arriving failed (no network), "I'm here" tries again. */}
      <div className={arriveError ? "px-4 pt-3 sm:px-6" : undefined}>
        <FormError error={arriveError} />
      </div>
      <CafeNavigation view={view} gpsEnabled={gpsEnabled} onGpsEnabled={onGpsEnabled} onArrive={() => void arrive()} />
    </>
  );
}
