import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    // Shared setup: cleanup, empty storage, jsdom polyfills (see the file).
    setupFiles: ['./src/__tests__/setup.ts'],
    // Every spy (vi.spyOn) and global stub (vi.stubGlobal/stubEnv) is undone before the
    // next test, so one test's fake GPS or environment can't change another's result.
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
})
