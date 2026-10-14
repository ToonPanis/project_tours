-- Hidden Pubs 2.0: multiplayer games.
-- Applied by scripts/db-migrate.mjs (npm run db:migrate). Never edit a migration that
-- has been applied: add a new numbered file instead.

-- One row per game. The whole game state is one JSON document (see
-- src/types/pub-game.ts, PubGameState); `version` goes up with every action.
CREATE TABLE pub_games (
  code        text        PRIMARY KEY,
  walk_slug   text        NOT NULL,
  state       jsonb       NOT NULL,
  version     integer     NOT NULL,
  created_at  timestamptz NOT NULL,
  -- Games are deleted 7 days after creation (privacy, D29).
  expires_at  timestamptz NOT NULL
);
CREATE INDEX pub_games_expires_at ON pub_games (expires_at);

-- Every accepted action. The primary key makes the same action id impossible
-- twice: a double tap or a retry is recognised and applied only once.
CREATE TABLE pub_game_actions (
  game_code   text        NOT NULL REFERENCES pub_games (code) ON DELETE CASCADE,
  action_id   text        NOT NULL,
  player_id   text        NOT NULL,
  action      jsonb       NOT NULL,
  -- The game version this action produced.
  version     integer     NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (game_code, action_id)
);

-- What happened, for the popups on every phone ("events since version X").
CREATE TABLE pub_game_events (
  game_code   text        NOT NULL REFERENCES pub_games (code) ON DELETE CASCADE,
  version     integer     NOT NULL,
  position    integer     NOT NULL,
  event       jsonb       NOT NULL,
  PRIMARY KEY (game_code, version, position)
);

-- Which phone is which player: only a SHA-256 hash of the cookie secret.
CREATE TABLE pub_game_players (
  game_code   text        NOT NULL REFERENCES pub_games (code) ON DELETE CASCADE,
  token_hash  text        NOT NULL,
  player_id   text        NOT NULL,
  PRIMARY KEY (game_code, token_hash)
);
