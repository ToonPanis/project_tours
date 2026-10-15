import type { Metadata } from "next";
import { PROTOTYPE_ROBOTS } from "@/lib/shared-metadata";

/** Every Hidden Pubs game page: never a search result (a game is private to its players). */
export const metadata: Metadata = {
  title: "Hidden Pubs",
  robots: PROTOTYPE_ROBOTS,
};

/** The tavern look of Hidden Pubs, in the same narrow column as the other walks' play pages. */
export default function GamesLayout({ children }: LayoutProps<"/games">) {
  return (
    <div data-walk-theme="tavern" className="bg-night-map min-h-full">
      <div className="mx-auto max-w-lg">{children}</div>
    </div>
  );
}
