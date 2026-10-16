import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AboutPage from "../app/about/page";
import ContactPage from "../app/contact/page";
import ReviewsPage from "../app/reviews/page";
import { ContactForm, contactErrors, contactMailto } from "@/features/contact/ContactForm";
import { DEMO_REVIEWS, showDemoReviews } from "@/features/reviews/demo-reviews";
import { parseSort, summarize, toPublic } from "@/features/reviews/public-reviews";
import { englishTranslator as t } from "@/i18n/translate";
import { LocaleProvider } from "@/i18n/client";
import en from "@/i18n/locales/en";
import type { Review } from "@/types/commerce";
import { getWalks } from "@/data/walks";

/** Frontend redesign: /about, /contact and /reviews. */

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const asLocale = (node: React.ReactNode) => (
  <LocaleProvider locale="en" messages={en}>
    {node}
  </LocaleProvider>
);

function review(overrides: Partial<Review>): Review {
  return {
    id: Math.random().toString(36).slice(2),
    grantId: "g",
    orderId: "o",
    walkSlug: "classics-of-antwerp",
    productId: "classics-of-antwerp",
    rating: 4,
    text: "Nice",
    displayName: null,
    mayPublish: true,
    locale: "en",
    status: "approved",
    incentivised: true,
    rewardDiscountId: null,
    createdAt: "2026-10-01T10:00:00.000Z",
    moderatedAt: null,
    moderatedBy: null,
    ...overrides,
  };
}

describe("/about", () => {
  test("hero with the call to the walks, the real walks with their links, why-us, future plans labelled as plans, closing CTAs", async () => {
    render(await AboutPage());
    expect(screen.getByRole("heading", { level: 1, name: t("pages.about.title") })).toBeDefined();
    expect(screen.getByRole("link", { name: t("pages.about.cta") }).getAttribute("href")).toBe("/walks");
    for (const walk of getWalks("en")) expect(screen.getByRole("link", { name: walk.title }).getAttribute("href")).toBe(`/walks/${walk.slug}`);
    expect(screen.getByRole("heading", { level: 3, name: t("pages.about.why.languages.title") })).toBeDefined();
    expect(screen.getByText(t("pages.about.vision.note"))).toBeDefined();
    expect(screen.getByRole("link", { name: t("pages.about.closing.contact") }).getAttribute("href")).toBe("/contact");
    // No walk that doesn't exist in the project.
    expect(screen.queryByText(/Hidden Streets/)).toBeNull();
  });
});

describe("/contact", () => {
  const valid = { name: "Anna", email: "anna@example.com", subject: "Group", type: "group" as const, message: "We are 12 people next Saturday.", privacy: true };

  test("every field is checked", () => {
    expect(contactErrors(valid)).toEqual({});
    expect(Object.keys(contactErrors({ ...valid, name: "", email: "x@", subject: "", message: "short", privacy: false })).sort()).toEqual(
      ["email", "message", "name", "privacy", "subject"],
    );
  });

  test("the mailto link carries the type, subject, message and the visitor's own address", () => {
    const link = contactMailto("hello@example.com", valid, "Group booking");
    expect(link.startsWith("mailto:hello@example.com?subject=")).toBe(true);
    expect(decodeURIComponent(link)).toContain("[Group booking] Group");
    expect(decodeURIComponent(link)).toContain("We are 12 people next Saturday.");
    expect(decodeURIComponent(link)).toContain("Anna <anna@example.com>");
  });

  test("without a configured address the form is switched off and says so (it never pretends to send)", () => {
    render(asLocale(<ContactForm contactEmail={null} />));
    expect(screen.getByText(t("pages.contact.form.notConfigured"))).toBeDefined();
    expect((screen.getByRole("button", { name: t("pages.contact.form.submit") }) as HTMLButtonElement).closest("fieldset")?.disabled).toBe(true);
  });

  test("with an address: wrong fields are named and nothing opens", () => {
    render(asLocale(<ContactForm contactEmail="hello@example.com" />));
    fireEvent.click(screen.getByRole("button", { name: t("pages.contact.form.submit") }));
    expect(screen.getByText(t("pages.contact.form.errors.name"))).toBeDefined();
    expect(screen.getByText(t("pages.contact.form.errors.privacy"))).toBeDefined();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  test("the page shows only real contact details and sends groups to the quote form", async () => {
    vi.stubEnv("CONTACT_EMAIL", "");
    render(asLocale(await ContactPage()));
    expect(screen.getByRole("heading", { level: 1, name: t("pages.contact.title") })).toBeDefined();
    expect(screen.getByRole("link", { name: t("pages.contact.more.groupsLink") }).getAttribute("href")).toBe("/corporate#quote");
    expect(screen.getByText(t("pages.contact.more.postAddress"))).toBeDefined();
  });
});

describe("/reviews", () => {
  test("only approved reviews whose writer allowed publication are public; nothing private leaves", () => {
    const shown = toPublic(
      [review({ id: "a" }), review({ id: "b", status: "pending" }), review({ id: "c", mayPublish: false }), review({ id: "d", status: "rejected" })],
      "newest",
    );
    expect(shown.map((item) => item.id)).toEqual(["a"]);
    expect(Object.keys(shown[0]).sort()).toEqual(["createdAt", "displayName", "id", "incentivised", "locale", "rating", "text", "walkSlug"]);
  });

  test("sorting and the summary use real reviews only", () => {
    const list = toPublic([review({ id: "a", rating: 2, createdAt: "2026-10-03T00:00:00Z" }), review({ id: "b", rating: 5, createdAt: "2026-10-01T00:00:00Z" })], "highest");
    expect(list.map((item) => item.id)).toEqual(["b", "a"]);
    expect(toPublic(list.map((item) => review(item)), "newest").map((item) => item.id)).toEqual(["a", "b"]);
    expect(summarize(list)).toEqual({ average: 3.5, count: 2 });
    expect(summarize([])).toEqual({ average: null, count: 0 });
    expect(parseSort("lowest")).toBe("lowest");
    expect(parseSort("anything")).toBe("newest");
  });

  test("example reviews: never in production unless switched on on purpose; shown in development and previews", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SHOW_DEMO_REVIEWS", "");
    expect(showDemoReviews()).toBe(false);
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(showDemoReviews()).toBe(true);
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SHOW_DEMO_REVIEWS", "true");
    expect(showDemoReviews()).toBe(true);
  });

  test("the page: empty state with real data, example reviews labelled and not counted (no average from them)", async () => {
    vi.stubEnv("NODE_ENV", "development");
    globalThis.commerceStore = undefined;
    render(await ReviewsPage({ searchParams: Promise.resolve({}) } as never));
    expect(screen.getByText(t("pages.reviews.empty"))).toBeDefined();
    expect(screen.getAllByText(t("pages.reviews.demo.badge"))).toHaveLength(DEMO_REVIEWS.length);
    expect(screen.queryByText(t("pages.reviews.average", { rating: "5" }))).toBeNull();
    expect(screen.getByRole("link", { name: t("pages.reviews.leave.walks") }).getAttribute("href")).toBe("/walks");
  });
});

declare global {
  var commerceStore: import("@/features/commerce/server/commerce-store").CommerceStore | undefined;
}
