# Hidden Antwerp

A mobile-first web app for interactive, self-guided city walks through Antwerp. It combines a city guide, a treasure hunt and historical storytelling, and it runs in the browser with no app to install.

> **Status:** prototype / playtest phase. Three walks are playable: **Poortjes van Antwerpen** (guide), **Hidden Pubs** (team game) and **Classics of Antwerp** (guide), in 8 languages. Content is still marked as **placeholder** until historical research and on-site checks are done. See `CLAUDE.md` for the full project handover.

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · MapLibre GL · MongoDB Atlas + Vercel Blob (Hidden Pubs only) · Vitest + React Testing Library · Playwright

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run typecheck` | Type-check the project (`next typegen` for the route types, then `tsc --noEmit`) |
| `npm run i18n:check` | Check that every language has every UI text |
| `npm run test:coverage` | All tests once, plus coverage of the logic and the Hidden Pubs server (fails under the thresholds) |
| `npm run test:e2e` | Browser tests against the production build (run `npm run build` first) |
| `npm run db:setup` / `db:check` | Hidden Pubs: create / check the MongoDB collections and indexes (`MONGODB_URI`) |
| `npm run test:db` | Hidden Pubs: the MongoDB store tests against a separate test database (`TEST_MONGODB_URI`) |

Testing on a phone on the same Wi-Fi: put your computer's LAN IP in `.env.local` as `DEV_ALLOWED_ORIGINS=192.168.1.23` (see `.env.example`), restart `npm run dev`, and open `http://<that-ip>:3000` on the phone. (GPS needs https on a phone; see CLAUDE.md.)

Without any environment variables the guide walks work fully, and Hidden Pubs keeps games and photos in memory (development only). Production needs `MONGODB_URI`, `BLOB_READ_WRITE_TOKEN` and `CRON_SECRET`: every variable is explained in `.env.example`.

Node: see `.nvmrc` (CI uses it). CI (`.github/workflows/ci.yml`) runs typecheck, lint, i18n:check, tests with coverage, build and the browser tests on every push to `main` and every pull request.

## Project structure

```
src/
├── app/            Routes (pages, layouts, not-found)
├── components/     Generic UI (layout, buttons, badges)
├── features/       Feature-specific components and logic (walks/, guide/, navigation/, pub-game/…)
├── data/           Mock content (walks and locations)
├── lib/            Infrastructure: repositories (data access)
├── types/          Domain models (Walk, WalkLocation, PubGameState…)
└── __tests__/      Unit tests
```

Pages load walks through `walkRepository` (`src/lib/repositories`). Today it reads the data in `src/data/walks`; a database-backed implementation can replace it later without changing the UI. Hidden Pubs games are stored through `GameStore` (memory in development, MongoDB in production).
