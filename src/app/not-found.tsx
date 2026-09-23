import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <div className="bg-night-map text-parchment">
      <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="font-display text-4xl font-semibold">You&apos;ve wandered off the map</h1>
        <p className="text-parchment/80">This page doesn&apos;t exist. Let&apos;s get you back on the trail.</p>
        <ButtonLink href="/">Back to the start</ButtonLink>
      </div>
    </div>
  );
}
