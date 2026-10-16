import type { Metadata } from "next";
import { PARTNER_ATTRIBUTION_DAYS } from "@/features/commerce/config";
import { GAME_LIFETIME_DAYS } from "@/features/pub-game/server/identity";
import { getTranslator } from "@/i18n/server";
import { baseOpenGraph } from "@/lib/shared-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("privacy.meta.title"),
    description: t("privacy.meta.description"),
    openGraph: { ...baseOpenGraph(t.locale), title: t("privacy.meta.title"), description: t("privacy.meta.description") },
  };
}

/**
 * /privacy (P9, brief 8 "cookies and tracking consent"): a factual list of the
 * cookies, the phone storage and the data on our servers, taken from the code
 * itself (the names below are the real ones). Not the legal privacy notice:
 * that one is still to be written and checked by a lawyer (shown on the page).
 */
export default async function PrivacyPage() {
  const t = await getTranslator();
  const days = (count: number) => t("privacy.cookies.durations.days", { count });
  const cookies: [string, string, string][] = [
    ["ha-locale", t("privacy.cookies.rows.locale"), t("privacy.cookies.durations.year")],
    ["hp_<CODE>", t("privacy.cookies.rows.player"), days(GAME_LIFETIME_DAYS)],
    ["ha_order", t("privacy.cookies.rows.order"), t("privacy.cookies.durations.hours", { count: 24 })],
    ["ha_ticket_<walk>", t("privacy.cookies.rows.ticket"), t("privacy.cookies.durations.ticketValidity")],
    ["ha_ref", t("privacy.cookies.rows.referral"), days(PARTNER_ATTRIBUTION_DAYS)],
    ["ha_admin, ha_partner", t("privacy.cookies.rows.staff"), t("privacy.cookies.durations.session")],
  ];
  const storage: [string, string][] = [
    ["hidden-antwerp:locale", t("privacy.storage.language")],
    ["hidden-antwerp:playtest:<walk>", t("privacy.storage.progress")],
    ["hidden-antwerp:pub-intro:<CODE>", t("privacy.storage.intro")],
  ];
  const section = "flex flex-col gap-3";
  const heading = "font-display text-2xl font-semibold";

  return (
    <div className="bg-night-map min-h-full text-parchment">
      <article className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-semibold [overflow-wrap:anywhere]">{t("privacy.title")}</h1>
          <p className="text-parchment/85">{t("privacy.intro")}</p>
          <p className="rounded-sm border border-yellow-300/50 bg-yellow-950/30 p-3 text-sm">{t("privacy.draftNotice")}</p>
        </header>

        <section className={section} aria-labelledby="cookies-heading">
          <h2 id="cookies-heading" className={heading}>
            {t("privacy.cookies.title")}
          </h2>
          <p className="text-parchment/85">{t("privacy.cookies.intro")}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-parchment/20 text-left text-parchment/70">
                  <th scope="col" className="py-2 pr-3 font-normal">{t("privacy.cookies.name")}</th>
                  <th scope="col" className="py-2 pr-3 font-normal">{t("privacy.cookies.purpose")}</th>
                  <th scope="col" className="py-2 font-normal">{t("privacy.cookies.duration")}</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map(([name, purpose, duration]) => (
                  <tr key={name} className="border-b border-parchment/10 align-top">
                    <td className="py-2 pr-3">
                      <code>{name}</code>
                    </td>
                    <td className="py-2 pr-3">{purpose}</td>
                    <td className="py-2">{duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-parchment/70">{t("privacy.cookies.referralNote")}</p>
        </section>

        <section className={section} aria-labelledby="storage-heading">
          <h2 id="storage-heading" className={heading}>
            {t("privacy.storage.title")}
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {storage.map(([name, purpose]) => (
              <li key={name}>
                <code className="break-all">{name}</code>
                <span className="block text-parchment/85">{purpose}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={section} aria-labelledby="location-heading">
          <h2 id="location-heading" className={heading}>
            {t("privacy.location.title")}
          </h2>
          <p className="text-parchment/85">{t("privacy.location.body")}</p>
        </section>

        <section className={section} aria-labelledby="server-heading">
          <h2 id="server-heading" className={heading}>
            {t("privacy.server.title")}
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-parchment/85">
            {(["orders", "games", "quotes", "reviews", "followUp", "partners"] as const).map((item) => (
              <li key={item}>{t(`privacy.server.${item}`)}</li>
            ))}
          </ul>
        </section>

        <section className={section} aria-labelledby="providers-heading">
          <h2 id="providers-heading" className={heading}>
            {t("privacy.providers.title")}
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-parchment/85">
            {(["hosting", "database", "payments", "email", "maps"] as const).map((item) => (
              <li key={item}>{t(`privacy.providers.${item}`)}</li>
            ))}
          </ul>
        </section>

        <section className={section} aria-labelledby="rights-heading">
          <h2 id="rights-heading" className={heading}>
            {t("privacy.rights.title")}
          </h2>
          <p className="text-parchment/85">{t("privacy.rights.body")}</p>
          <p className="text-parchment/85">{t("privacy.rights.contact")}</p>
        </section>
      </article>
    </div>
  );
}
