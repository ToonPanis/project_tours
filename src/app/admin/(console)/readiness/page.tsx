import { readinessSummary, type CheckStatus, type ReadinessCheck } from "@/features/commerce/logic/readiness";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { getCommerceContext } from "@/features/commerce/server/context";
import { launchReadiness } from "@/features/commerce/server/readiness-service";

const BADGE: Record<CheckStatus, { text: string; look: string }> = {
  ok: { text: "OK", look: "border-emerald-400/60 text-emerald-300" },
  missing: { text: "Missing", look: "border-red-400/60 text-red-300" },
  warning: { text: "Check", look: "border-yellow-300/60 text-yellow-200" },
  manual: { text: "To do", look: "border-parchment/40 text-parchment/80" },
};

function CheckList({ checks }: { checks: ReadinessCheck[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {checks.map((check) => (
        <li key={check.id} className="flex items-start gap-3 rounded-sm border border-parchment/15 p-3">
          <span className={`mt-0.5 shrink-0 rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase ${BADGE[check.status].look}`}>{BADGE[check.status].text}</span>
          <span>
            <span className="font-semibold">{check.label}</span>
            <span className="block text-sm text-parchment/75">{check.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * /admin/readiness (P10, brief phase 10): is this server ready for testing
 * payments, and what is still needed before real sales? Shows only "set / not
 * set" and safe facts, never a secret's value.
 */
export default async function AdminReadinessPage() {
  await requireAdmin();
  const checks = await launchReadiness(getCommerceContext());
  const summary = readinessSummary(checks);
  return (
    <section className="flex flex-col gap-6 text-parchment">
      <h1 className="font-display text-4xl font-semibold">Launch readiness</h1>
      <p className="text-parchment/80">
        {summary.live
          ? "Everything is in place for real sales."
          : summary.test
            ? "Ready for testing in Stripe test mode. Real sales still need the items under “Before real sales”."
            : "Some settings for testing are still missing (red below)."}{" "}
        The full checklist with how each item was verified is in docs/commercial/LAUNCH_CHECKLIST.md.
      </p>
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">Running and testing</h2>
        <CheckList checks={checks.filter((check) => check.stage === "test")} />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">Before real sales</h2>
        <CheckList checks={checks.filter((check) => check.stage === "live")} />
      </div>
    </section>
  );
}
