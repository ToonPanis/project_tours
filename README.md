# Hidden Antwerp

A mobile-first web app for interactive, self-guided city walks through Antwerp. It combines a city guide, a treasure hunt and historical storytelling, and it runs in the browser with no app to install.

> **Status:** early development. The first walk, *The 17 Gates*, uses **placeholder content** until historical research is added.

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Vitest + React Testing Library

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
| `npm test` | Run the tests in watch mode (`npx vitest run` runs them once) |
| `npx tsc --noEmit` | Type-check the project |

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
