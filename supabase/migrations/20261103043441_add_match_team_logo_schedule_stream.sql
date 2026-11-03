/*
# Add team logo, match date and stream link to matches

Plain-English summary:
Each upcoming match can now store a logo for our own team, the date and time
it starts, and a link to its stream. Existing matches keep their data and get
empty defaults for the new fields.

## 1. Modified tables
- `matches`:
  - `team_logo` (text, default empty) - logo of Ka6aHbl.
  - `starts_at` (timestamptz, nullable) - date and time of the match.
  - `stream_url` (text, default empty) - link to the broadcast.

## 2. Security
- No change to row level security or grants; the new columns follow the
  existing table policies.

## 3. Important notes
1. Re-running this migration is safe (IF NOT EXISTS checks).
2. No existing columns or rows are changed or removed.
*/

ALTER TABLE matches ADD COLUMN IF NOT EXISTS team_logo text NOT NULL DEFAULT '';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS starts_at timestamptz;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS stream_url text NOT NULL DEFAULT '';
