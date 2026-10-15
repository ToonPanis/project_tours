# Hidden Antwerp — Privacy notice (DRAFT)

> **Status: draft for review, not published.** Written from the code to describe what the app actually does: the guide walks as of 2026-09-29, **the Hidden Pubs multiplayer game added on 2026-10-15** (it stores data on a server, unlike the guide walks). Before a public launch it needs:
> - legal review (GDPR);
> - the hosting provider's details;
> - a contact address;
> - translations into all 8 languages.
>
> Every statement is backed by the code references in the table at the end. Update this draft whenever those parts change. Audit finding: L-05.

## In short

- **No account and no sign-up.** Hidden Antwerp does not ask who you are.
- **Your location stays on your phone.** It is used while the map is open and then forgotten. It is never saved and never sent to us, also not in Hidden Pubs.
- **Guide walks:** your progress is saved on your own phone only, so you can continue a walk later.
- **Hidden Pubs (the team game):** to play together on several phones, the game is kept on our server: the names you type, the teams, answers, scores and the photos/videos you send for tasks. **Everything is deleted after 7 days.**
- **No analytics, no advertising, no tracking cookies.**

## What is stored on your phone

| What | Where | Why | How long |
|---|---|---|---|
| Your walk progress: stops reached, votes, answers, team name and player names you typed, start and finish time | Your browser's local storage (`hidden-antwerp:playtest:<walk>`) | So you can continue after closing the page or losing signal | Until you start the walk again (the "Start again" button on the walk's start screen), or clear this site's data in your browser |
| Your chosen language | A cookie (`ha-locale`) and local storage (`hidden-antwerp:locale`) | So pages open in your language | The cookie for 1 year; local storage until you clear it |

Your guide-walk progress never leaves your phone. The **language cookie** is sent to the website with each page request, so pages open in your language: that is its only purpose. Hidden Antwerp has no accounts. Only Hidden Pubs stores data on a server (next section).

## Hidden Pubs (the multiplayer game)

A Hidden Pubs game is played by several people at the same time, each on their own phone. To make that work, the game is kept on our server and every phone asks it for news every few seconds.

| What | Where | Why | How long |
|---|---|---|---|
| The game: team names, the names players type (at most 30 characters), who is the organiser (host), the route of each team, the cards drawn and the team rules written on them, answers given, scores, which tasks were done | Our database (MongoDB Atlas, [region to be completed]) | So every phone in the game sees the same game | **7 days** after the game was created, then deleted automatically |
| Each tap in the game (e.g. "we arrived", an answer, a card, "a sip for X"), with the player who tapped and the time | The same database | So a tap sent twice (bad connection) counts once, and other phones get their pop-ups | 7 days |
| Photos and videos sent for a task, who took part, the host's approval or rejection (and the reason the host typed) | Photos/videos: Vercel Blob storage, **private** (only shown through our site, to the player's own team and the host, and to everyone in that game once it has ended). The rest: the database | So the host can approve the task and the points count | 7 days (a daily job deletes older photos and videos) |
| A player cookie (`hp_<game code>`) with a random secret | Your browser (httpOnly: the page's scripts can't read it). Our database keeps only a fingerprint (SHA-256 hash) of it, never the secret itself | So the server knows which player this phone is | 7 days |
| "Rules already seen" for this game | Your browser's local storage (`hidden-antwerp:pub-intro:<game code>`) | So the rules aren't shown again after a reload | Until you clear this site's data |

**Not stored anywhere:** your location, and your drink choice (it stays on your phone's screen and is never sent). **Sips:** the game shows who takes a sip and never counts them (not in scores, results or statistics); a tap like "a sip for X" is only part of the 7-day log of taps above.

- **Photos of people:** only photograph or film people who said yes (the game says so at every photo task).
- **The organiser's copy:** the operator of Hidden Antwerp can download a game's photos and videos (for example to send them to the organiser) during those 7 days, with a separate tool that needs the storage key. [To be completed: who does this, on whose request, and how long such a copy is kept.]
- **18+:** Hidden Pubs is for adults; the organiser confirms this when creating a game.

## Your location (GPS)

- **When:** only while a walking-navigation screen is open, and only after you allow it. You can also walk without GPS.
- **What for:** to show where you are on the map, give walking directions, and notice when you have arrived at a stop.
- **What happens to it:** positions are kept in the phone's memory only, while that screen is open (the app itself holds at most the latest readings; the map shows the current one). They are **never** saved, whether in local storage, a cookie or anywhere else. They are never sent to Hidden Antwerp and never kept as a history.
- **Screen:** the screen is kept on while you navigate (the Screen Wake Lock), so the phone doesn't sleep mid-walk.

## Third parties that receive data from your browser

| Service | When | What they can see | Why |
|---|---|---|---|
| **OpenFreeMap** (map tiles, `tiles.openfreemap.org`) | While a map is shown | Your IP address and which map area your phone loads. Because the map follows you, this reveals your approximate location to OpenFreeMap. No coordinates are sent directly. | To draw the map |
| **Hosting provider** (Vercel, [region to be completed]) | Every page visit | IP address, requested page, browser type and preferred languages (standard server logs), the language cookie and, in Hidden Pubs, the player cookie | To deliver the website and run the game |
| **MongoDB Atlas** (database, processor for us) | Only in Hidden Pubs | The game data listed above (not your IP address: only our server talks to it) | To keep the game in sync between phones |
| **Vercel Blob** (file storage, processor for us) | Only when you send a photo/video in Hidden Pubs | The photo or video, sent straight from your phone (so it sees your IP address) | To store task evidence for the host |
| **Google Maps** | Only if you tap "Open external map" | The stop's name and address (never your position) | Optional directions in another app |
| **Your phone's share menu** | Only if you tap "Share" at the end (where supported) | A short text about the walk you finished (no location), sent to the app you pick | Sharing your result |

Google Fonts are downloaded when the site is built. Your browser does not contact Google for fonts.

## Your choices

- Don't allow location and use "Continue without live GPS". The walk still works.
- Delete your progress: the "Start again" button on the walk's start screen, or clear this site's data in your browser settings.
- Hidden Pubs: you don't have to send photos or videos (every task can be skipped). To have a game's data deleted before the 7 days are over: [to be completed: contact and procedure].
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
| Hidden Pubs data on the server, deleted after 7 days | `src/features/pub-game/server/mongo-store.ts` (`expiresAt` on every document), `db/mongo-schema.mjs` (TTL indexes), `GAME_LIFETIME_DAYS` in `server/identity.ts` |
| Every tap is kept (with player and time) | `commitAction` in `mongo-store.ts` (collection `actions`) |
| Photos/videos private, shown only to own team, host, or everyone after the end | `openMedia` in `server/game-service.ts`, `BlobMediaStore` (`access: "private"`) in `server/media-store.ts` |
| Daily deletion of photos/videos older than 7 days | `vercel.json` (cron) → `src/app/api/cron/media-cleanup/route.ts` → `deleteExpiredMedia` |
| Player cookie httpOnly, only its hash stored | `server/identity.ts` (`playerCookieOptions`, `hashToken`) |
| Drink choice never sent; no drink counts | `DrinkStep.tsx` (local state only); alcohol rules in CLAUDE.md, `pub-game-*` tests |
| Organiser's download tool | `scripts/media-download.mjs` (`npm run media:download`, needs `MEDIA_DOWNLOAD_TOKEN`) |
