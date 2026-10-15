import { redirect } from "next/navigation";
import { LoginForm } from "@/features/commerce/admin/LoginForm";
import { getCurrentAdmin } from "@/features/commerce/server/admin-access";

/** /admin/login: ask for a sign-in link. Already signed in → straight to the admin area. */
export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-display text-4xl font-semibold text-parchment">Admin sign-in</h1>
      <p className="text-parchment/80">
        Type your admin email address. You&apos;ll get a link that signs you in; no password needed.
      </p>
      <LoginForm />
    </section>
  );
}
