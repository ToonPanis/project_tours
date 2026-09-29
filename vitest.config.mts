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
      include: ['src/**/logic/**', 'src/lib/**', 'src/i18n/**', 'src/features/walk-session/storage/**'],
      exclude: ['src/i18n/locales/**'],
      reporter: ['text-summary', 'html'],
      // A few points under today's values (lines 97.6%, branches 89.4%, functions 99.1%):
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
