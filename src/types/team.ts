export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  /** Join code such as "ANT-4821". Unused until online team play exists. */
  code?: string;
  players: Player[];
}

/** One player's vote in a drink round. */
export interface Vote {
  playerId: string;
  drinkOptionId: string;
}
