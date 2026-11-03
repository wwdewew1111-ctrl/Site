/*
# Create upcoming matches table

Plain-English summary:
Adds a list of upcoming matches to the site. Each match stores the tournament
name, the opponent's team name, and optional logos for the tournament and the
opponent. Visitors can read the list; only the website's server function can
change it, after the admin logs in.

## 1. New tables
- `matches`: id, tournament name, opponent name, tournament logo, opponent logo,
  creation time (used to keep the order stable).

## 2. Security
- Row level security is enabled on `matches`.
- Anonymous visitors can read the table. Nobody can write to it directly.
- Writes go through the `site-admin` server function, which checks the admin
  session first and uses the service role.

## 3. Important notes
1. Logos are stored as text, the same way other site images are stored.
2. Re-running this migration is safe (IF NOT EXISTS and DROP POLICY IF EXISTS).
*/

CREATE TABLE IF NOT EXISTS matches (
  id text PRIMARY KEY,
  tournament text NOT NULL DEFAULT '',
  opponent text NOT NULL DEFAULT '',
  tournament_logo text NOT NULL DEFAULT '',
  opponent_logo text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON matches TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON matches TO service_role;

DROP POLICY IF EXISTS "public_read_matches" ON matches;
CREATE POLICY "public_read_matches" ON matches FOR SELECT TO anon, authenticated USING (true);
