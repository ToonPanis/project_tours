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
