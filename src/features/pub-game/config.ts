/**
 * The numbers of Hidden Pubs 2.0, from the concept (HIDDEN_PUBS_CONCEPT.txt)
 * and the decisions in HIDDEN_PUBS_DATA_AUDIT.md.
 */

/** 1–10 teams, 1–10 players per team. */
export const MAX_TEAMS = 10;
export const MAX_PLAYERS_PER_TEAM = 10;

/** Each player sees 10 face-down cards and picks one. */
export const CARDS_PER_OFFER = 10;

/** "More than 4 players in a team": 2 decks. */
export const TWO_DECKS_FROM_PLAYERS = 5;

/** Jack: at most 4 rules; a 5th rule pushes out the oldest (D13). */
export const MAX_RULES = 4;
export const MAX_RULE_LENGTH = 140;
export const MAX_NAME_LENGTH = 30;

/** Points for a correct answer on attempt 1, 2, 3. After 3 wrong answers: shown, 0 points. */
export const POINTS_PER_ATTEMPT = [100, 80, 60] as const;
