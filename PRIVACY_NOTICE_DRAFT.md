# Hidden Antwerp — Privacy notice (DRAFT)

> **Status: draft for review, not published.** Written from the code as of Phase 3 (2026-09-29) to describe what the app actually does. Before a public launch it needs:
> - legal review (GDPR);
> - the hosting provider's details;
> - a contact address;
> - translations into all 8 languages.
>
> Every statement is backed by the code references in the table at the end. Update this draft whenever those parts change. Audit finding: L-05.

## In short

- **No account and no sign-up.** Hidden Antwerp does not ask who you are.
- **Your location stays on your phone.** It is used while the map is open and then forgotten. It is never saved and never sent to us.
- **Your progress is saved on your own phone only**, so you can continue a walk later.
- **No analytics, no advertising, no tracking cookies.**

## What is stored on your phone

| What | Where | Why | How long |
|---|---|---|---|
| Your walk progress: stops reached, votes, answers, team name and player names you typed, start and finish time | Your browser's local storage (`hidden-antwerp:playtest:<walk>`) | So you can continue after closing the page or losing signal | Until you start the walk again (the "Start again" button on the walk's start screen), or clear this site's data in your browser |
| Your chosen language | A cookie (`ha-locale`) and local storage (`hidden-antwerp:locale`) | So pages open in your language | The cookie for 1 year; local storage until you clear it |

Your walk progress never leaves your phone. The **language cookie** is sent to the website with each page request, so pages open in your language: that is its only purpose. Hidden Antwerp has no server-side database and no accounts.

## Your location (GPS)

- **When:** only while a walking-navigation screen is open, and only after you allow it. You can also walk without GPS.
- **What for:** to show where you are on the map, give walking directions, and notice when you have arrived at a stop.
- **What happens to it:** positions are kept in the phone's memory only, while that screen is open (the app itself holds at most the latest readings; the map shows the current one). They are **never** saved, whether in local storage, a cookie or anywhere else. They are never sent to Hidden Antwerp and never kept as a history.
- **Screen:** the screen is kept on while you navigate (the Screen Wake Lock), so the phone doesn't sleep mid-walk.

## Third parties that receive data from your browser

| Service | When | What they can see | Why |
|---|---|---|---|
| **OpenFreeMap** (map tiles, `tiles.openfreemap.org`) | While a map is shown | Your IP address and which map area your phone loads. Because the map follows you, this reveals your approximate location to OpenFreeMap. No coordinates are sent directly. | To draw the map |
| **Hosting provider** (to be completed: e.g. Vercel) | Every page visit | IP address, requested page, browser type and preferred languages (standard server logs), and the language cookie | To deliver the website |
| **Google Maps** | Only if you tap "Open external map" | The stop's name and address (never your position) | Optional directions in another app |
| **Your phone's share menu** | Only if you tap "Share" at the end (where supported) | A short text about the walk you finished (no location), sent to the app you pick | Sharing your result |

Google Fonts are downloaded when the site is built. Your browser does not contact Google for fonts.

## Your choices

- Don't allow location and use "Continue without live GPS". The walk still works.
- Delete your progress: the "Start again" button on the walk's start screen, or clear this site's data in your browser settings.
- Change the language at any time.

## Contact

[To be completed: name / organisation, e-mail address, and the supervisory authority (Belgium: Gegevensbeschermingsautoriteit).]

---

### Code references (for maintainers; not part of the published notice)

| Statement | Where in the code |
|---|---|
| Progress in localStorage, nothing else | `src/features/walk-session/storage/session-storage.ts` (`localWalkSessionStore`) |
| Language cookie + localStorage | `src/i18n/client.tsx` (`saveLocale`), `src/i18n/config.ts` |
| GPS in memory only, at most 2 readings | `src/features/navigation/logic/tracking.ts`, `NavigationScreen.tsx`; test "no GPS position is ever written to localStorage" |
| No calls to third parties except the map tiles | No `fetch` in `src/` (Next.js itself only talks to this site); map tiles via MapLibre (`MAP_STYLE_URL` in `src/features/navigation/config.ts`) |
| "Open external map" contains no position | `NavigationScreen.tsx` (`externalMapUrl`: name + address) |
| No analytics | No analytics package in `package.json` |
| Fonts at build time | `next/font/google` in `src/app/layout.tsx` |
