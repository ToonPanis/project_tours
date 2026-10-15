import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    // Shared setup: cleanup, empty storage, jsdom polyfills (see the file).
    setupFiles: ['./src/__tests__/setup.ts'],
    // Unit and component tests only; the browser tests in e2e/ run with Playwright.
    include: ['src/**/*.test.{ts,tsx}'],
    // `npm run test:coverage`: which lines of the pure logic the tests never run.
    coverage: {
      provider: 'v8',
      include: [
        'src/**/logic/**',
        'src/lib/**',
        'src/i18n/**',
        'src/features/walk-session/storage/**',
        // Hidden Pubs server: the game service, the memory store, identity and HTTP helpers.
        'src/features/pub-game/server/**',
        // Commercial platform: the services (sign-in, catalogue, email), the memory store and helpers.
        'src/features/commerce/server/**',
      ],
      exclude: [
        'src/i18n/locales/**',
        // Need the real services (MongoDB, Vercel Blob): tested by npm run test:db and on Vercel.
        'src/features/pub-game/server/mongo*.ts',
        'src/features/pub-game/server/media-store.ts',
        // Wiring per environment, and helpers of the server pages (covered by the browser tests).
        'src/features/pub-game/server/context.ts',
        'src/features/pub-game/server/page-data.ts',
        // The same for the commercial platform: MongoDB (npm run test:db), wiring, and the
        // page helper that reads the request's cookies (covered by the API and browser tests).
        'src/features/commerce/server/mongo-store.ts',
        'src/features/commerce/server/context.ts',
        'src/features/commerce/server/admin-access.ts',
      ],
      reporter: ['text-summary', 'html'],
      // A few points under today's values (lines 98.2%, statements 94.4%, branches 88.8%, functions 99.2%):
      // untested new logic fails the run; a small refactor doesn't.
      thresholds: { lines: 95, statements: 90, branches: 85, functions: 95 },
    },
    // Every spy (vi.spyOn) and global stub (vi.stubGlobal/stubEnv) is undone before the
    // next test, so one test's fake GPS or environment can't change another's result.
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
})
