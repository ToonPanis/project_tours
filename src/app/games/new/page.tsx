import { CreateGameForm } from "@/features/pub-game/components/CreateGameForm";

/** /games/new: the organiser sets up a Hidden Pubs game. */
export default function NewGamePage() {
  return <CreateGameForm walkSlug="hidden-pubs" />;
}
