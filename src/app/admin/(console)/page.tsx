import Link from "next/link";
import { requireAdmin } from "@/features/commerce/server/admin-access";
import { configurationStatus } from "@/features/commerce/server/context";

/** /admin: who is signed in, and which services this server is connected to (never their secrets). */
export default async function AdminHomePage() {
  const admin = await requireAdmin();
  const status = configurationStatus();

  const rows: [string, string, boolean][] = [
    ["Database", status.database === "mongodb" ? "MongoDB Atlas" : "Memory (development only: lost on restart)", status.database === "mongodb"],
    ["Email", status.email === "brevo" ? "Brevo" : "Memory (development: emails appear in the terminal)", status.email === "brevo"],
    ["Admin addresses (ADMIN_EMAILS)", String(status.adminCount), status.adminCount > 0],
    ["Site address for links (APP_BASE_URL)", status.baseUrlSet ? "Set" : "Not set (required in production)", status.baseUrlSet],
  ];

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-parchment">Admin</h1>
        <p className="text-parchment/80">Signed in as {admin.email}.</p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold text-parchment">This server</h2>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
          {rows.map(([label, value, good]) => (
            <div key={label} className="contents">
              <dt className="text-parchment/70">{label}</dt>
              <dd className={good ? "text-parchment" : "text-yellow-300"}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="flex flex-col gap-2 text-parchment">
        <li>
          <Link href="/admin/products" className="text-gold underline underline-offset-4">
            Products and prices
          </Link>{" "}
          : what is for sale, at what price per person, with which VAT rate.
        </li>
        <li>
          <Link href="/admin/audit" className="text-gold underline underline-offset-4">
            Audit log
          </Link>{" "}
          : every sign-in and every change, with who made it.
        </li>
      </ul>
    </section>
  );
}
