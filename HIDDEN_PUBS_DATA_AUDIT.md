# Hidden Pubs 2.0: data audit

What your concept (`HIDDEN_PUBS_CONCEPT.txt`) gives, what is missing, what contradicts itself or the project, and what I need you to decide.
**Nothing here has been changed in your concept.** Facts marked "to research" will be researched during implementation and shown to you before they go in the game. Answers are never changed silently.

Legend: ✅ complete · ⚠️ needs a decision or a check · ❌ missing

---

## 1. Decisions

**2026-10-14: all recommendations accepted by the owner.** The **Rec.** column is now the rule. Still open: the content in section 4 (answers, Lucie, addresses, …).

### A. Architecture and safety

| # | Question | Rec. |
|---|---|---|
| **D1** | Backend for multiplayer: Route Handlers + Postgres (Neon) + polling + private Vercel Blob, packages `postgres`, `@vercel/blob`, `qrcode`, `server-only` (plan §3)? Or Supabase? | Route Handlers + Postgres + polling |
| **D2** | Rewrite the CLAUDE.md alcohol rules + `walk-data.test.ts` for the new game: "drink" = a sip of your own drink (alcohol-free counts), no counting of drinks, no drink stats, alcohol-free option + skip everywhere (plan §4)? | Yes |
| **D3** | Bonus tasks that reward drinking: **Barok** (shot, 100 per drinking player), **Boer van Tienen** (loser drinks), **Den Engel** (beer from the clog, 300, video). Your concept also says drinking must never be required to win. Proposal: same task and points, **any drink counts** (an alcohol-free "shot" or water from the clog earns the same). Barok: 100 per participating player. Your original wording stays visible in this audit. | Any drink counts |
| **D4** | 18+ confirmation when creating and joining a game (shots = spirits = 18+ in Belgium)? | Yes |
| **D29** | Privacy: photos/videos and player names are deleted automatically **7 days** after the game; visible only to players of that game; consent reminder on upload screens. | Yes, 7 days |

### B. Structure of the game

| # | Question | Rec. |
|---|---|---|
| **D5** | Random route **per team** or **once per game** (all teams together)? Per team spreads teams over different cafés, so cafés aren't flooded with 10 teams at once and teams don't copy answers. Once per game keeps everyone together (then all card effects could be game-wide, D12). | Per team |
| **D6** | Café 8 → 9: always De Varkenspoot first, then Boer van Tienen? **And:** your document says they're at the same location, but the current project data has De Varkenspoot at **Graanmarkt 3** and Boer van Tienen at **Mechelseplein 6**, about 400 m apart. Which addresses are right? | Fixed order 8 → 9; you confirm the addresses |
| **D7** | When does the game end: when every team has finished Den Engel, or when the host presses "End game" (whichever comes first)? | Both: all teams finished, or the host ends it |
| **D8** | Drink choice: each player chooses for themselves (no team vote), from your list + "Alcohol-free / soft drink" + "Skip". The app records nothing. | Yes |
| **D9** | Billie's wheel (1–10): does Billie's have a numbered list of 10 beers at the bar, or will you give me the 10 beers? Alcohol-free players: choose the alcohol-free option instead of spinning. | Wheel shows only the number; you confirm the bar has a list |
| **D33** | Is the organiser also a player (in a team) and the host? | Yes, both |
| **D34** | Late joiners: allowed until the first card is drawn at Rococo? After that only via the host. | Yes |
| **D32** | Walk detail page: price (today €14.95), duration (today 150–210 min for 8 cafés; 12 cafés with a drink each is much longer), team size (today 1–6). What should it say? | You give the numbers; until then marked as estimates |

### C. Drunken Bastard

| # | Question | Rec. |
|---|---|---|
| **D10** | The 10 offered cards: **face down** (blind pick) or face up? Face up means everyone picks the mildest card. | Face down |
| **D11** | Deck: one deck per **team** (2 decks if > 4 players), drawn cards stay out for the **whole game**, reshuffle when < 10 left? With 10 players × 12 cafés = 120 draws, a reset rule is needed. Alternative: fresh deck at every café. | Per team, whole game, reshuffle when < 10 left |
| **D12** | Scope of Queen / King / Ace / Jack rules: per **team** or for the **whole game**? If teams are in different cafés (D5), a game-wide Thumb King can't work. Buddies stay cross-team as your document says. | Per team (buddies cross-team) |
| **D13** | Jack: rules max 4 "for the rest of the game". What happens at the 5th jack? | Oldest rule drops off, new rule added |
| **D14** | Buddies: max **one** buddy per player? A new "8" replaces the old link? No chains (A–B and B–C: C doesn't drink when A drinks)? Lasts until replaced or the game ends? | Yes to all |
| **D15** | The app only knows who drinks when a card says so directly (2: the player picks someone; 3: themselves). For 4, 7, 9, 10, Q, K the loser is decided in the café. To show the buddy popups your document asks for, add an optional one-tap "who drank?" after those cards? | Yes, optional tap |
| **D16** | 5 for the Wives / 6 for the Dicks: the app shows the instruction only and stores no gender (players apply it themselves; buddy popups don't fire for these cards). Card names stay **in English in all 8 languages** (like the original game), the explanation is translated. | Yes |
| **D17** | Drawing order: one player at a time in team order, first player rotates each café? | Yes |

### D. Pubtasks and scoring

| # | Question | Rec. |
|---|---|---|
| **D18** | Who answers: any player of the team, first answer counts, everyone sees it live? | Yes |
| **D19** | With 3 options the 3rd attempt is always right, so "4th attempt → answer, 0 points" never happens. Options: **(a)** keep 100/80/60, greyed-out wrong options, 60 is the minimum; **(b)** after 2 wrong answers show the answer, 0 points; **(c)** add a 4th option to every question. | (a), unless you want (c) |
| **D20** | Questions without options in your document: Rococo (answer 33), De Kat (answer 3), Quinten Matsijs Q1 ("painter, smith or both"). Your rule says "always multiple choice". May I propose 2 wrong options for you to approve? | Yes, you approve them |
| **D21** | Cafés with 2 questions (Quinten Matsijs, Café Barries, De Muze, Den Engel): each question scored separately, up to 200 per café? | Yes |
| **D22** | Café Barries "find the beautiful blonde woman called Lucie, take a photo": who or what is Lucie? A person (staff), a picture, or **Lucie the blonde beer** (also on the Paters Vaetje drink list)? And how is it scored, since it isn't multiple choice: 100 after host approval? | You explain Lucie; 100 on approval |
| **D23** | Missing correct answers: **Barok** (façade / toilets / ceiling?), **Quinten Matsijs Q1** (painter / smith / both?) and **Q2** (kikkerspel / tonspel / trou madame?), **Boer van Tienen** (your fun fact suggests A, "second-oldest café"). | You give them |
| **D24** | Only Rococo has hints. For the other cafés: no hints, or may I write hints for your approval (hints only point to things in the café, no invented history)? | I write, you approve |
| **D25** | Single-team game: each player answers on their own phone and earns their own points; bonus points go to the player(s) who did the task; the winner is a player. Multi-team: team scores. | Yes |
| **D26** | Bonus approval: the host approves on the dashboard. The host's own team's submissions also go to the host (or to another team's player?). Rejected → can resubmit. | Host approves all, everyone can see the evidence of the game at the end |
| **D27** | Tie-breaker: most first-attempt answers; still tied → shared win? | Yes |
| **D28** | Winner tradition shown as: "Tradition! Everyone treats the winner to a drink of their choice (alcohol-free counts). Not an obligation." | Yes |

### E. Content and language

| # | Question | Rec. |
|---|---|---|
| **D30** | Beery's lines: your exact Dutch text for Dutch players ("Beery brengt je naar de volgende locatie!", "Beery heeft een bonusopdracht voor je!"), translated for the other 7 languages? Beery is "he"? | Yes |
| **D31** | Factual problems in section 2 (F1–F6): may I correct the *story text* (not the answers) and ask you about the answers where they're affected? | Yes |

---

## 2. Factual flags (to research, then your approval)

| # | Where | Issue |
|---|---|---|
| **F1** | Barok question | "Barokstijl die in de **16de eeuw** vaak gebruikt werd": the Baroque is usually dated **c. 1600–1750 (17th–18th century)**. Proposal: "17de eeuw". |
| **F2** | Quinten Matsijs Q1 + Paters Vaetje | The project's Classics walk (cathedral stop) already says: Quinten's **father** was a smith; there is **no evidence Quinten himself worked as a smith** (legend, told by Karel van Mander in 1604); the ironwork of the well on the Handschoenmarkt is **attributed to him by tradition, not proven**. Your document says both "forged by Quinten Matsijs" (the inscription) and "work of Quinten's father, who was a smith" (the explanation). The answer to Q1 and the Paters Vaetje explanation must be told as legend vs documented. Exact inscription wording to check on site. |
| **F3** | Paters Vaetje fun fact | Your version: he painted "a devil with a fly on its backside". The usual version (also in the Classics walk): he painted a fly **on the father's painting**, so lifelike the father tried to brush it away. Which version? Either way it's labelled a legend. |
| **F4** | Quinten Matsijs + Boer van Tienen | "Oldest café of Antwerp" and "second-oldest café" need sources (both claims are made by several cafés in Antwerp). Quinten Matsijs Q2 "café game older than 250 years": to check which game it is and its age. |
| **F5** | Café Barries spaarkas | Your explanation (customers saved, got "an extra" each month, used to settle the bill) is hard to follow and needs a source. The Flemish café savings box ("spaarkas") tradition is usually described differently (regular deposits, yearly payout). To research; the answer (C) stays. |
| **F6** | Cabron | "How many cafés did Antwerp have?" Answer 420, but **in which year**, and what's the source? Without a year the question is ambiguous. |
| **F7** | De Varkenspoot | "Pied de cochon" served as a café dish: to research (answer B stays unless you decide otherwise). |
| **F8** | Den Engel | The stopped clock at 11:55 and the Cinderella story: presented as the café's own story (folklore), not as history. |

On-site checks (counts can change): Rococo 33 gates, De Kat 3 cats, Billie's 179 dogs, De Muze horse + 3 floors, Paters Vaetje inscription, Den Engel clock 11:55. These go in `FIELD_TEST_CHECKLIST.md` with `researchStatus: "on-site-verification-required"`.

---

## 3. Per café

Drinks: names as in your document; spelling to check against the menu (`menuVerification: "to-verify"`). Every café also gets "Alcohol-free / soft drink" + "Skip" (D8). **Your document lists no alcohol-free drink anywhere.**

### 1. Rococo (fixed start)
- Address: Grote Markt 32 (current data, to verify). Coordinates ✅ (to-verify).
- Drinks ✅ IPA, Flandrien, Charle Quint (⚠️ spelling: "Charles Quint"?).
- Pubtask ⚠️ "How many gates are hidden in this café?" Answer **33**. ❌ No options (D20). ✅ 3 hints (Paul Smekens; ground floor; on a wall).
- Fun fact ❌ none given. Opportunity: link to the **Poortjes walk** (Smekens' book *Oude poortjes in Antwerpen*, 1951, 52 drawings), facts already researched in the project.
- First Drunken Bastard + Beery's intro happen here.

### 2. Barok
- Address ❌, coordinates ❌. Which café exactly?
- Drinks ✅ Super 8, Super 8 Rouge, Tongerloo Blond (⚠️ spelling: "Tongerlo"?).
- Pubtask ⚠️ "Where do you still find the Baroque style in this café?" Façade / toilets / ceiling. ❌ **Correct answer missing** (D23). F1 (century).
- Bonus ⚠️ shot for +100 per drinking player, photo as proof "after the game" (D3).
- Fun fact ❌.

### 3. Quinten Matsijs
- Address: Moriaanstraat 17 (current data). Coordinates ✅.
- Drinks ✅ Maredsous Bruin, Stella Artois, Triple Anvers (⚠️ "Tripel d'Anvers"?).
- Q1 ⚠️ "Was Quinten Matsijs a painter, a smith or both?" ❌ options not formatted (D20) ❌ **answer missing** (D23), F2.
- Q2 ⚠️ "Which café game, more than 250 years old, is still in this café?" Kikkerspel / Tonspel / Trou Madame. ❌ **answer missing** (D23), F4.
- Fun fact ⚠️ "oldest café of Antwerp, tell about it": to research (F4).

### 4. De Kat
- Address: Wolstraat 22 (current data). Coordinates ✅.
- Drinks ✅ Rochefort 8, Geuze Boon, Stella Artois.
- Pubtask ⚠️ "How many cats can you find in this café?" Answer **3**. ❌ No options (D20). On-site check.
- Fun fact ⚠️ "many musicians came here": to research.
- Bonus ✅ tap a beer yourself "somewhere in a café", photo of the person tapping, +200. Needs staff consent (reminder).

### 5. Billie's Bier Kafétaria
- Address ❌, coordinates ❌.
- Drinks ⚠️ wheel 1–10 → beer number X at the bar (D9).
- Pubtask ✅ "How many dogs do you count here?" A 179 ✔ / B 210 / C 230. On-site check.
- Fun fact ❌.

### 6. Café Barries
- Address ❌, coordinates ❌.
- Drinks ✅ Kriek, Seefbier, Duvel.
- Task 1 ⚠️ find Lucie + photo (D22).
- Task 2 ✅ old savings box: old café game / staff wage box / customers' savings box ✔ C. ❌ **Photo of the savings box needed** (you supply it, or "look for it in the café"?). F5.
- Fun fact ✅ (Monopoly money in the box today).

### 7. Paters Vaetje
- Address: Blauwmoezelstraat 1 (current data). Coordinates ✅.
- Drinks ✅ Lucie, Bootjes Bier (⚠️ exact name?), Gulden Carolus Whisky Infused.
- Pubtask ✅ "On the terrace you see the story of Quinten Matsijs. What do you see?" Paintings in the cathedral / Nello & Patrasche / an old well ✔ C. Explanation ⚠️ F2.
- Fun fact ⚠️ the smith who became a painter for love + the fly (F2, F3): legend.
- Bonus ✅ photo with your favourite barman/barmaid/waiter, +100. Needs consent.

### 8. De Varkenspoot (always followed by 9)
- Address ⚠️ Graanmarkt 3 (current data) vs "same location as Boer van Tienen" (D6).
- Drinks ✅ Stella Artois, Bolleke, Triple Anvers.
- Pubtask ✅ why this name? Pig market / pig's trotters served as a dish ✔ B / a regular nicknamed "de varkenspoot". Explanation: "pied de cochon" (F7).
- Fun fact: explanation above.

### 9. Boer van Tienen
- Address ⚠️ Mechelseplein 6 (current data; D6).
- Drinks ✅ Tripel Karmeliet, Stella Artois, La Chouffe.
- Pubtask ⚠️ "What is special about this café?" Second-oldest café / famous musicians / location on the square. ❌ **Answer not marked** (fun fact suggests A, D23). F4. Option B overlaps the De Kat fun fact.
- Bonus ⚠️ rock-paper-scissors, loser drinks, team +100 (D3). Who plays whom: two players of the team?
- Fun fact ⚠️ second-oldest café: to research.

### 10. De Muze (random with 11)
- Address: Melkmarkt 15 (current data). Coordinates ✅.
- Drinks ✅ Chimay Blauw, Westmalle Tripel, Lupulus Tripel.
- Q1 ✅ hidden animal: goose / cow / horse ✔ C. On-site check.
- Q2 ✅ how many floors: 1 / 2 / 3 ✔ C. On-site check.
- Fun fact ⚠️ "I'm sure you'll find something interesting": to research.

### 11. Cabron (random with 10)
- Address ❌, coordinates ❌.
- Drinks ✅ Bolleke, Stella, La Chouffe.
- Pubtask ⚠️ "How many cafés do you think Antwerp had?" 200 / 260 / 420 ✔ C. F6 (which year, source).
- Fun fact ❌.

### 12. Den Engel (fixed finish)
- Address: Grote Markt 3 (current data). Coordinates ✅.
- Drinks ✅ Stella, Triple Anvers, Bolleke.
- Q1 ✅ the stopped clock: 10:50 / 11:55 ✔ B / 08:20. On-site check.
- Q2 ✅ why does time stand still? Cinderella ✔ A / flat battery / the angels come to life.
- Fun fact ✅ Cinderella: the party never stops as long as the clock doesn't strike midnight (F8).
- Bonus ⚠️ beer from Cinderella's clog, +300, video (D3). ⚠️ "If you can't find the clog, use your own clog": a shoe? Please clarify.
- Then: final results.

---

## 4. Summary of what I need from you

- **Decisions:** D1–D34 (or "accept all recommendations except …").
- **Answers:** Barok, Quinten Matsijs Q1 + Q2, Boer van Tienen (D23).
- **Content:** who/what Lucie is (D22), the savings-box photo (Café Barries), Billie's beer list (D9), the "own clog" (Den Engel), the 8/9 location (D6).
- **Cafés:** exact name + address for Barok, Billie's Bier Kafétaria, Café Barries, Cabron.
- **Detail page:** price, duration, team size (D32).
