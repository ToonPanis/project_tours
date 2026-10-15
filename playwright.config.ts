import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests in a real browser (Chromium, a 390 px phone), against a
 * PRODUCTION build: what visitors get, without the playtest tools.
 *
 *   npm run build        (once, or after code changes)
 *   npm run test:e2e     (starts `next start` on port 3300 by itself)
 *
 * iOS Safari can't be tested here (WebKit on Windows differs from iPhones):
 * that stays in FIELD_TEST_CHECKLIST.md.
 */
const PORT = 3300;

export default defineConfig({
  testDir: "./e2e",
  // Walks are long user flows: one at a time is more predictable than speed.
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "phone",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 390, height: 844 },
        locale: "en-GB",
        timezoneId: "Europe/Brussels",
      },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Hidden Pubs games and photos in memory: the tests need no database or Blob store
    // (see memoryStoresAllowed in src/features/pub-game/server/context.ts). Tests only.
    // The empty values matter: `next start` also reads .env.local, and without them the
    // tests would play their games in the REAL database from there. (Next.js never
    // overwrites a variable that is already set, even when it's empty.)
    // The same for the commercial platform (admin sign-in, catalogue): data in memory,
    // no admin addresses and NO real email (Brevo keys emptied), links to this test server.
    env: {
      PUB_GAME_MEMORY_STORES: "true",
      MONGODB_URI: "",
      BLOB_READ_WRITE_TOKEN: "",
      COMMERCE_MEMORY_STORES: "true",
      ADMIN_EMAILS: "",
      BREVO_API_KEY: "",
      EMAIL_FROM: "",
      APP_BASE_URL: `http://localhost:${PORT}`,
      // P2: sales closed and NO Stripe keys, so the tests can never reach Stripe (test or live).
      COMMERCE_SALES_ENABLED: "",
      STRIPE_SECRET_KEY: "",
      STRIPE_WEBHOOK_SECRET: "",
    },
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // NEXT_PUBLIC_* values are fixed at BUILD time, so they can't be switched off here. A build
    // made with NEXT_PUBLIC_PLAYTEST_TOOLS=true (e.g. from .env.local) fails the test
    // "the playtest tools are not in the production build" in e2e/pages.spec.ts on purpose.
  },
});
