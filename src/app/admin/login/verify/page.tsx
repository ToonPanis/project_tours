import { VerifyLogin } from "@/features/commerce/admin/VerifyLogin";

/** /admin/login/verify#<secret>: the page the sign-in email links to. */
export default function AdminVerifyPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-display text-4xl font-semibold text-parchment">Sign in</h1>
      <p className="text-parchment/80">Press the button to sign in to the Hidden Antwerp admin area.</p>
      <VerifyLogin />
    </section>
  );
}
