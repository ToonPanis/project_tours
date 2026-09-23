import { ButtonLink } from "@/components/ui/ButtonLink";

export default function WalkNotFound() {
  return (
    <div className="bg-parchment-texture">
      <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-20 sm:px-6">
        <h1 className="font-display text-4xl font-semibold text-ink">This walk doesn&apos;t exist</h1>
        <p className="text-sepia">
          The route you&apos;re looking for may have moved, or it isn&apos;t available yet.
        </p>
        <ButtonLink href="/walks" variant="outline-light">
          See all walks
        </ButtonLink>
      </div>
    </div>
  );
}
