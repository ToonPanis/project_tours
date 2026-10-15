import { ClaimPlayerLink } from "@/features/pub-game/components/ClaimPlayerLink";

/** /games/CODE/claim#secret: a personal link from the host (late arrival, new phone). */
export default async function ClaimPage({ params }: PageProps<"/games/[code]/claim">) {
  return <ClaimPlayerLink code={(await params).code.toUpperCase()} />;
}
