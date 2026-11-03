/*
# Create ESEA statistics storage

1. New Tables
- `esea_state`: key/value store for public ESEA data. Rows: `seasons` (array of season objects) and `config` (non-secret sync settings such as team ID, auto-sync flag, last sync time, active season).
- `esea_secrets`: holds the FACEIT API key. Never readable from the browser.

2. Security
- Enable RLS on both tables.
- `esea_state`: anonymous and signed-in visitors may read (statistics are public). No write grants; writes happen only through the site-admin function with the service role.
- `esea_secrets`: no grants and no policies, so only the service role can access it.
*/

CREATE TABLE IF NOT EXISTS esea_state (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS esea_secrets (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

ALTER TABLE esea_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE esea_secrets ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON esea_state TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_esea_state" ON esea_state;
CREATE POLICY "anon_select_esea_state" ON esea_state FOR SELECT
  TO anon, authenticated USING (true);
