@AGENTS.md

# Project Tours: working instructions

## About the developer

I'm a programming student. I'm comfortable with TypeScript, JavaScript, React, Node.js/Express, HTML/CSS, Bootstrap, C#/.NET, SQL, MongoDB and Git/GitHub.
**I'm currently learning Next.js**, so keep code understandable and educational. I want to understand my own project.

## Stack

- Next.js 16 (App Router, `src/app/`), React 19, TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- ESLint 9 (`eslint-config-next`)
- Vitest + React Testing Library (jsdom) for unit tests, in `src/__tests__/`
- Path alias: `@/*` → `./src/*`

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm test` (watch) / `npx vitest run` (once), `npx tsc --noEmit` (type-check).

## Code guidelines

1. Use TypeScript everywhere possible. Don't use `any` unless it's truly necessary; prefer proper types, `unknown` plus narrowing, or generics.
2. Prefer simple, readable solutions over clever abstractions.
3. Follow modern Next.js best practices and use the **App Router**. Check `node_modules/next/dist/docs/` before using a Next.js API, because this version may differ from older knowledge.
4. Default to Server Components. Add `"use client"` only when a component needs state, effects, event handlers or browser APIs.
5. Build reusable React components and keep each one reasonably small.
6. Separate concerns:
   - UI components go in `src/components/`
   - Data access (DB/API calls) goes in `src/lib/` or `src/data/`
   - Shared types go in `src/types/`
   - Business logic goes in plain TypeScript functions, not inside components
7. Use clear, descriptive variable and function names.
8. Keep dependencies to a minimum.
9. **Never hardcode secrets or API keys.** Use environment variables (`.env.local`, which is git-ignored). Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
10. Build responsive, mobile-first layouts: start with the base styles, then add `sm:`/`md:`/`lg:` breakpoints.
11. Keep accessibility in mind: semantic HTML, alt text, labels on form fields, keyboard access and enough color contrast.

## Project: Hidden Antwerp

A mobile-first platform for interactive self-guided city walks. Every walk (The 17 Gates, Hidden Pubs, …) is data in `src/data/walks/` using the shared models in `src/types/`. Pages read it through `walkRepository` (`src/lib/repositories/`).

- **Never add walk-specific conditions** like `if (walk.slug === "hidden-pubs")`. Drive differences through data (optional fields, `theme`, `clues`, …) so any walk can use the same components.
- Walk visual themes are CSS token overrides under `[data-walk-theme="…"]` in `globals.css`.

## Content rules

- **Never invent historical facts.** Real history has a verification status: `"verified"` (needs sources), `"partially-verified"` or `"research-required"`. Unresearched placeholder text carries a visible `[Historical research required]` marker.
- **Always separate history from fiction.** Content blocks are `history`, `legend` or `story` (fictional game narrative); a location's `historicalReveal` holds real history only. The UI labels each by kind and verification status.
- **History comes after the challenge.** Players discover something, answer, and only then learn why it matters: put real history in `historicalReveal`, not in the story shown before the challenge.
- **Never invent** drink menus, prices, opening hours, coordinates, sources or physical objects for riddles. Use visible placeholders (`(verify menu)`, `[RESEARCH REQUIRED]`, `coordinates: null`). Unverified drinks use `menuVerification: "to-verify"`; on-site answers still to be checked use `researchStatus: "on-site-verification-required"`.
- **Alcohol and cafés** (e.g. Hidden Pubs):
  - Progress never depends on ordering, buying or drinking anything. A team drink vote is only a suggestion, and every vote can be skipped.
  - Every drink round has at least one alcohol-free option, and every player can always choose their own drink.
  - **No shots as drink options**, and no drinking challenges, speed, quantities, penalties or proof of drinking. Never show or celebrate the number of drinks. (Both checked by the walk data tests.)
  - Alcohol-free players get exactly the same experience.
- **Challenges** should depend on the physical location (observation, inscriptions, symbols, counting), not on trivia you can google.
  - **Open to-do (after the Hidden Pubs playtest):** challenges that need a café's interior (Den Engel, De Muze, De Kat, Quinten Matsijs) need an outdoor fallback for when a café is closed, full or doesn't welcome groups. Until then, the playtest tools are the fallback.

## How to work with me

- **Before installing any npm package**, explain why it's needed and whether a built-in alternative exists. Wait for my OK.
- **Before any major architectural change**, explain what you plan to change and why. Wait for my OK.
- Don't rewrite large parts of working code without a good reason. Preserve existing functionality when adding features.
- If an error occurs, investigate the root cause. Don't apply random fixes.
- **After implementing something**, run `npx tsc --noEmit` and `npm run lint` (and the tests if relevant), then report the results.
- Always list the files you created or modified.

## Explaining your work

When you implement an important feature, briefly explain:
- **What** changed
- **Where** the code is located
- **How** the important parts work, especially Next.js-specific concepts
- **How I can test it**, both manually and with automated tests

Don't over-explain basic syntax unless I ask.
