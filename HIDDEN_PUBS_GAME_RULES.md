# Hidden Pubs 2.0: game rules

How the app will run your game. Everything here comes from `HIDDEN_PUBS_CONCEPT.txt`.
Where your document left something open, the rule is marked **⟨Dn⟩**: the decision in `HIDDEN_PUBS_DATA_AUDIT.md`, section 1 (all recommendations accepted on 2026-10-14).

---

## 1. Setting up a game

1. The **organiser** opens Hidden Pubs → "Create a game" and chooses:
   - number of teams: **1–10**
   - number of players per team: **1–10**
   - team names (default "Team 1"…, editable)
2. The organiser confirms the players are **18+** ⟨D4⟩.
3. The app creates a game with a 6-character code, a **join link** and a **QR code**.
4. Every player opens the link on their own phone, types their name and picks their team (or the organiser pre-fills names and players just tap their name). One phone = one player.
5. The organiser is also a player, and is the **host**: they start the game and see the host dashboard ⟨D33⟩.
6. A phone that refreshes or loses connection returns to the same player automatically (cookie). If a phone is lost, the host can make a rejoin link for that player.
7. The host starts the game when everyone has joined. Late joins: allowed until the first card is drawn at Rococo ⟨D34⟩.

## 2. Introduction (Beery)

Before café 1, **Beery** explains in a few short screens (skippable, can be reopened any time from the menu):
1. Drunken Bastard: how cards work, the 13 cards.
2. Pubtasks: multiple choice, 100 / 80 / 60 / 0 points.
3. Bonus tasks: extra points, evidence photo/video, approved by the host.
4. The winner tradition, respect for staff and guests, alcohol-free is always fine.

## 3. The route

- All teams **start together at Rococo** and **finish at Den Engel**.
- Cafés **2–7** (Barok, Quinten Matsijs, De Kat, Billie's, Café Barries, Paters Vaetje): random order.
- Cafés **8 and 9** (De Varkenspoot, Boer van Tienen): always one right after the other, with no other café in between. They are two separate places ⟨D6⟩.
- Cafés **10 and 11** (De Muze, Cabron): random order.
- Each café exactly once: `1 → [2–7 shuffled] → 8 → 9 → [10, 11 shuffled] → 12`.
- One random route **per team** ⟨D5⟩. A team only sees its own next café.
- On to the next café: Beery popup **"Beery brengt je naar de volgende locatie!"** with the café's name and "Start navigation".

## 4. At every café

**Arrival → Drink choice → Drunken Bastard → Pubtask → Bonus task (if any) → Fun fact → Next café**

A progress bar shows the step and the café number (e.g. "Café 4 of 12").

### 4.1 Arrival
Arrival detection by GPS (as in the other walks) or the "We're here" button. All phones of the team go to the drink step together.

### 4.2 Drink choice
- Each player sees the café's drinks from your document, plus **"Alcohol-free / soft drink"** and **"Skip"** ⟨D8⟩.
- Each player chooses their own drink. Nothing is voted on and nothing is recorded or counted ⟨D8⟩.
- **Billie's**: each player spins a wheel that lands on a number **1–10**. The player orders beer number X at the bar. Alcohol-free players choose the alcohol-free option instead ⟨D9⟩.
- Then: "Got your drink? Start Drunken Bastard".

### 4.3 Drunken Bastard
- **Deck:** standard cards without jokers, **52** cards. A team with **more than 4 players** plays with **2 decks (104 cards)**: 8 jacks, 8 kings, 8 aces, etc.
- **One deck per team**, for the whole game. A drawn card leaves the deck. When fewer than 10 cards are left, the drawn cards are shuffled back in ⟨D11⟩.
- **Turn:** players draw one at a time, in team order. The first player rotates each café ⟨D17⟩.
- **Drawing:** the player sees **10 random cards from their team's deck, face down**, and taps one ⟨D10⟩. The card flips and shows its effect. The 9 other cards go back into the deck.
- Everyone in the team sees the drawn card and its effect live.
- Every player draws **one card per café**, including at Rococo and Den Engel.

#### The 13 cards (meaning from your document)

"Drink" always means **one sip of your own drink** (alcohol-free counts).

| Card | Name | Effect | What the app does |
|---|---|---|---|
| 2 | 2 for You | The player hands out a sip | Player picks who drinks (list of players) ⟨D15⟩ → popup |
| 3 | 3 for Me | The player takes a sip | Popup "X drinks" |
| 4 | 4 to the Floor | Everyone touches the floor as fast as possible; the last one drinks | Big "TOUCH THE FLOOR!" screen on every phone of the team; optional "who was last?" tap ⟨D15⟩ |
| 5 | 5 for the Wives | Every woman playing drinks | Shows the instruction; no gender is stored ⟨D16⟩ |
| 6 | 6 for the Dicks | Every man playing drinks | Shows the instruction; no gender is stored ⟨D16⟩ |
| 7 | 7 to Heaven | Like 4, but everyone points up | Big "POINT UP!" screen; optional "who was last?" tap |
| 8 | Pick a Mate | The player picks a **drinking buddy** (any registered player, **also from another team**). From now on, whenever one of the two must drink, the other drinks too | List of all players → pick one → **popup on every phone in the game**. Every later drink of either buddy → popup on every phone ⟨D14, D15⟩ |
| 9 | Rhyme | The player says a word; the others take turns rhyming. The first who can't, or repeats a word, drinks | Shows the rules; optional "who lost?" tap |
| 10 | Categories | Same as 9, with a category | Shows the rules; optional "who lost?" tap |
| J | Create a Rule | The player makes up a rule everyone follows for the rest of the game. Next jack: 2 rules, then 3, then at most 4 | Player types the rule (short) → added to **Active rules**. 5th jack: oldest rule drops off ⟨D13⟩ |
| Q | Question Bitch | Until someone else draws a queen, anyone who answers this player's question drinks | Player becomes **Question Bitch** (shown in the effects bar) |
| K | Thumb King | The player may put a thumb on the table at any moment; everyone copies; the last one drinks. Lasts until someone else draws a king | Player becomes **Thumb King** (effects bar) |
| A | Beunaas | The player drinks **double** until someone else draws an ace. If they have a buddy, the buddy also drinks double | Player becomes **Beunaas** (effects bar); popups say "2 sips" |

Queen, King, Ace and Jack rules apply **within the team** ⟨D12⟩. Buddies can cross teams, as your document says.

#### Effects bar (always visible during the game)
- 👑 Thumb King · ❓ Question Bitch · 🅰️ Beunaas (per team)
- 🤝 Drinking buddies (everyone in the game)
- 📜 Active rules (tap to read them all)

#### Buddy rules ⟨D14⟩
- A player has **at most one buddy**. A new "8" by either of them replaces the old link (popup to everyone).
- Buddy drinks **don't chain**: if A and B are buddies and B and C are buddies, C does not drink when A drinks. This prevents loops.
- **Doubling:** a Beunaas drinks 2 sips. The Beunaas's buddy also drinks double (your rule). Never more than 2 sips from one instruction.

### 4.4 Pubtask
- Always multiple choice ⟨D20⟩. A café with **2 questions** scores them separately (up to 200 points) ⟨D21⟩.
- Any player of the team can answer. All team phones see the same question live, and the first answer counts. Each attempt is locked server-side (no double points) ⟨D18⟩.
- **Points per question:** 1st attempt correct **+100**, 2nd **+80**, 3rd **+60**. After that: the answer is shown, **0** points.
  - With **3 options**, the 3rd attempt is always right (wrong options are greyed out). So the "4th attempt → 0 points" case only happens with 4+ options ⟨D19⟩.
- After each wrong attempt, the café's next hint is shown if there is one ⟨D24⟩.
- **Single-team game:** each player answers on their own phone and scores for themselves; the winner is a player ⟨D25⟩.

### 4.5 Bonus task
- Beery popup **"Beery heeft een bonusopdracht voor je!"**
- The team uploads a photo or video (camera or gallery). The submission shows team, player, time and task.
- Points are only added when the **host approves**. The host can reject (with a reason). Rejected submissions can be submitted again ⟨D26⟩.
- Bonus tasks are optional and never block the next café.
- Reminder on every bonus screen: ask staff/people before taking photos, don't disturb the café.

| Café | Bonus (your document) | Points | Evidence |
|---|---|---|---|
| Barok | Order a shot | 100 per participating player | Photo ⟨D3⟩ |
| De Kat | Tap a beer yourself, somewhere in a café | 200 | Photo of the person tapping |
| Paters Vaetje | Photo with your favourite barman / barmaid / waiter | 100 | Photo |
| Boer van Tienen | Rock-paper-scissors, the loser drinks | 100 (team) | ⟨D3⟩ |
| Den Engel | Drink a beer from Cinderella's clog | 300 | Video ⟨D3⟩ |

### 4.6 Fun fact
After the pubtask (and bonus), a short story about the café (30–90 seconds of reading). History, legend and folklore are labelled as such. Then: "On to the next café" (Beery popup).

## 5. Scoring and winner

- **Team score** = pubtask points + approved bonus points.
- Live leaderboard: position, team, total, completed cafés, approved bonus points.
- **Winner:** the team with the most points; in a single-team game, the player with the most points ⟨D25⟩.
- **Tie:** most first-attempt answers wins; still tied → shared win ⟨D27⟩.
- **End:** at Den Engel. The results screen opens when all teams have finished Den Engel, or when the host ends the game ⟨D7⟩.
- Results: winner, ranking, totals, bonus points, fun statistics (e.g. most first-try answers, most buddies, longest reign as Thumb King; **never** drink counts), a shareable results card.
- **Tradition:** the winner gets a drink from every other player or team. It's shown as a playful tradition: a drink of the winner's choice, alcohol-free is fine, nobody has to buy anything ⟨D28⟩.
