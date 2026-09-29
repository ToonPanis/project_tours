# Hidden Antwerp

A mobile-first web app for interactive, self-guided city walks through Antwerp. It combines a city guide, a treasure hunt and historical storytelling, and it runs in the browser with no app to install.

> **Status:** prototype / playtest phase. Three walks are playable: **Poortjes van Antwerpen** (guide), **Hidden Pubs** (team game) and **Classics of Antwerp** (guide), in 8 languages. Content is still marked as **placeholder** until historical research and on-site checks are done. See `CLAUDE.md` for the full project handover.

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · MapLibre GL · Vitest + React Testing Library

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
| `npm run typecheck` | Type-check the project (`tsc --noEmit`) |
| `npm run i18n:check` | Check that every language has every UI text |

Testing on a phone on the same Wi-Fi: put your computer's LAN IP in `.env.local` as `DEV_ALLOWED_ORIGINS=192.168.1.23` (see `.env.example`), restart `npm run dev`, and open `http://<that-ip>:3000` on the phone. (GPS needs https on a phone; see CLAUDE.md.)

Node: see `.nvmrc` (CI uses it). CI (`.github/workflows/ci.yml`) runs typecheck, lint, i18n:check, tests and build on every push to `main` and every pull request.

## Project structure

```
src/
├── app/            Routes (pages, layouts, not-found)
├── components/     Generic UI (layout, buttons, badges)
├── features/       Feature-specific components and logic (e.g. walks/)
├── data/           Mock content (walks and locations)
├── lib/            Infrastructure: repositories (data access)
├── types/          Domain models (Walk, WalkLocation, Challenge…)
└── __tests__/      Unit tests
```

Pages load data through `walkRepository` (`src/lib/repositories`). Today it reads mock data. A database-backed implementation can replace it later without changing the UI.
