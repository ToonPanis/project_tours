# Hidden Antwerp — Field Test Checklist

Items that **cannot be resolved from code**. Someone has to go to Antwerp. None of these may be marked resolved without real evidence: a photo, a GPS reading, or a note with date and name.

Status values: `OPEN` · `IN PROGRESS` · `DONE (evidence: …)` · `CHANGED (see finding)`

Finding IDs refer to `AUDIT.md`.

---

## A. GPS pins and arrival points

All 61 stop coordinates currently have `coordinatesStatus: "to-verify"`. They were geocoded, not checked on site.

| # | Location (stop id) | What must be checked | Current assumption | Evidence to collect | Blocks | Status |
|---|---|---|---|---|---|---|
| A1 | Sint-Jacobskerk (`poortjes-sint-jacob`) | Can a walker on public ground get within 40 m of the pin? Where should the arrival point be (entrance or viewing spot)? | The pin is a building centroid. The route ends 49 m from it. | GPS reading and accuracy at the entrance and at the route end; photo of the spot; suggested coordinate | M-01, H-01 severity | OPEN |
| A2 | Onze-Lieve-Vrouwekathedraal (`poortjes-kathedraal`) | Same as A1 | The route ends 42 m from the pin | Same as A1 | M-01 | OPEN |
| A3 | Onze-Lieve-Vrouwekathedraal (`classics-cathedral`) | Same as A1. Ideally the same arrival point as A2. | The route ends 42 m from the pin | Same as A1 | M-01 | OPEN |
| A4 | Rosier (`poortjes-rosier`) | The route **start** is 42 m from the pin. Check the entrance and the viewing spot. | Building centroid | Same as A1 | M-01 | OPEN |
| A5 | Borderline stops (27–35 m from route end): `poortjes-zwartzusters`, `poortjes-universiteit`, `poortjes-lange-gasthuisstraat`, `poortjes-red-star-line`, `poortjes-lange-nieuwstraat`, `poortjes-oudeleeuwenrui`, `poortjes-mas`, `classics-stadsfeestzaal`, `classics-boerentoren`, `classics-carolus-borromeus` | Does automatic arrival fire reliably when walking the route? | Borderline; GPS noise decides | For each: did arrival fire? At what distance from the pin? Phone model | M-01 | OPEN |
| A6 | De Kat (`pubs-de-kat`, Wolstraat 22) ↔ Quinten Matsijs (`pubs-quinten-matsijs`, Moriaanstraat 17) | Are the two cafés really ~10.7 m apart, or did the geocoder put both on one building? | The pins are 10.7 m apart | Entrance coordinates of both cafés; photo | L-08 | OPEN |
| A7 | Other very short legs: `poortjes-gildekamersstraat` → `poortjes-leonie-glassplein` (32 m), `poortjes-mutsaardstraat` → `poortjes-academie` (59 m), `classics-brabo` → `classics-stadhuis` (38 m), `classics-conscienceplein` → `classics-carolus-borromeus` (43–50 m) | Do these legs feel right, or does arrival fire instantly and confuse the walker? | The positions are correct | Walker's experience note; entrance coordinates if the pins are wrong | L-08 | OPEN |
| A8 | Every other stop (all three walks) | Pin at a sensible public spot; route leads there | Geocoded | A note per stop: OK / move to (lat, lng) | M-01 (general) | OPEN |

## B. Challenge answers (Hidden Pubs)

| # | Location | What must be checked | Current assumption (placeholder) | Evidence to collect | Blocks | Status |
|---|---|---|---|---|---|---|
| B1 | De Kat (`05-de-kat.ts`) | The real count the challenge asks for (cats) | `correctNumber: 9`, marked TEMPORARY | Photo(s) showing what is counted, the count, the date | H-02 | OPEN |
| B2 | Rococo (`01-rococo.ts`) | Gable shape answer | "Stepped" (`on-site-verification-required`) | Photo of the gable | H-02 | OPEN |
| B3 | De Varkenspoot (`07-de-varkenspoot.ts`) | The pig's form | "Statue" (`on-site-verification-required`) | Photo | H-02 | OPEN |
| B4 | Quinten Matsijs bonus (`06-quinten-matsijs.ts`) | 't Gulick answer | Research required | Photo or source | H-02 (bonus, skippable) | OPEN |

## C. Outdoor fallbacks for café-interior challenges

When a café is closed or full, the challenge must still be solvable. These challenges currently depend on the café interior:

| # | Café | What must be checked | Current assumption | Evidence to collect | Blocks | Status |
|---|---|---|---|---|---|---|
| C1 | Den Engel (`02-den-engel.ts`) | Is there an observable **outdoor** feature that could support a fallback challenge? | The challenge uses "the large clock inside the café" | Photos of the façade and surroundings; a proposed observation (not invented) | H-02 | OPEN |
| C2 | De Muze (`04-de-muze.ts`) | Same | The challenge uses something "above the bar" | Same | H-02 | OPEN |
| C3 | De Kat (`05-de-kat.ts`) | Same | Interior count | Same | H-02 | OPEN |
| C4 | Quinten Matsijs (`06-quinten-matsijs.ts`) | Same | Interior | Same | H-02 | OPEN |
| C5 | All 8 cafés | Opening days and hours (with `checkedOn` date and source), and whether the drinks listed as `to-verify` are on the menu | Not verified | Menu photo, opening-hours source, date | Content rules (not an audit finding) | OPEN |

## D. Poortjes on-site items

| # | Location | What must be checked | Current assumption | Evidence to collect | Blocks | Status |
|---|---|---|---|---|---|---|
| D1 | Academie garden (`poortjes-academie` search task) | Is the garden accessible, and when? (The info box has no official hours and no source.) | Accessible | Opening information with source and date | L-44 (content) | OPEN |
| D2 | Universiteit (`poortjes-universiteit`) access box | Access conditions (no `sourceUrl` today) | Accessible | Source and date | Content rules | OPEN |
| D3 | Every `[To be verified on site]` marker in Poortjes content | The marked fact | As written | Photo or note per marker | Content status | OPEN |

## E. Device and field behaviour (real phones)

Run on **iOS Safari and Android Chrome over HTTPS**. Record the phone model, OS version and date.

| # | Scenario | What to record | Blocks | Status |
|---|---|---|---|---|
| E1 | Start the walk indoors (hotel, station) | Time to first fix; does a bad first fix move the camera far away? | M-07, H-01 | OPEN |
| E2 | Stand at the A1–A4 pins | Does arrival ever fire? Is there any way forward? | H-01, M-01 | OPEN |
| E3 | Narrow streets (Vlaeykensgang, Wolstraat, gate passages) | Reported vs. real accuracy; false off-route alerts | H-01, M-07 | OPEN |
| E4 | Permission: deny, then allow in settings, then "Try again". On iOS also with Location Services for Safari Websites off. Dismiss the prompt. Leave the prompt unanswered. | What the user sees; any way forward | H-01, L-11 | OPEN |
| E5 | Reload mid-leg; lock and unlock the screen; switch apps | Does the walk resume on the same stop? Does the wake lock return? | M-03, L-13 | OPEN |
| E6 | Leave the route by 50 m and by 200 m; walk backwards | Instructions shown | M-07, M-20, L-09 | OPEN |
| E7 | Poortjes optional stops: take the Rodestraat detour; skip it; Red Star Line at the end | Correct route and next stop | L-06 | OPEN |
| E8 | Airplane mode or a dead zone mid-leg | Map, direction panel, crash or recovery | M-02, M-08 | OPEN |
| E9 | Battery use over 2 h of navigation with the map visible | % per hour; phone model | M-06 | OPEN |
| E10 | Pinch-zoom and the +/− buttons while following | Does the zoom hold? | M-06 | OPEN |
| E11 | Private browsing, then switch language mid-walk | Is progress kept? | M-03 | OPEN |
| E12 | Small phone (iPhone SE size) in German and Russian | Is the "I'm here" button visible without scrolling? | M-12, H-01 | OPEN |
| E13 | Sunlight readability of the dark game screens; one-handed use | Notes or photos | O-12 | OPEN |
| E14 | Stand still for 1–2 min with GPS on (iOS and Android) | Does the browser report a TIMEOUT while stationary ("Still looking…" message)? | Phase 2 (L-11) | OPEN |
| E15 | Indoors and at doorways (hotel, café, station hall) | Does the dot jump between a network position and GPS? Does it settle on the right spot within about 2 readings? | Phase 2 (M-07) | OPEN |
| E16 | Narrow streets (Vlaeykensgang, Wolstraat) | Multipath jumps that two agreeing readings let through, and precise-looking outliers replacing a weak (36–40 m) fix: note the jump size and how long it lasts | Phase 2 (M-07) | OPEN |
| E17 | Walk to the first stop from the station or a hotel | Is "Head to X · Direction: north-east" plus the arrow clear? With the phone's heading while walking, does the arrow point the right way? | Phase 2 (M-20) | OPEN |
| E18 | Older Android phones | Timestamps that repeat or step back (the dot should keep moving) | Phase 2 (L-10) | OPEN |
