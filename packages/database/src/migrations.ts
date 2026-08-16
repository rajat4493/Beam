import type { Pool } from "pg";

export async function migrate(pool: Pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const id = "001_payment_events_outbox";
  if ((await pool.query("SELECT 1 FROM schema_migrations WHERE id=$1", [id])).rowCount) return;
  await pool.query("BEGIN");
  try {
    await pool.query(`CREATE TABLE external_events (
      id uuid PRIMARY KEY, provider text NOT NULL, provider_event_id text NOT NULL,
      payload jsonb NOT NULL, received_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(provider, provider_event_id))`);
    await pool.query(`CREATE TABLE interactions (
      id uuid PRIMARY KEY, creator_id text NOT NULL, provider text NOT NULL, provider_event_id text NOT NULL,
      amount_minor integer NOT NULL, currency char(3) NOT NULL, supporter_name text NOT NULL, message text NOT NULL,
      state text NOT NULL, impact numeric NOT NULL, received_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(provider, provider_event_id))`);
    await pool.query(`CREATE TABLE outbox_events (
      id uuid PRIMARY KEY, topic text NOT NULL, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
      processed_at timestamptz, attempts integer NOT NULL DEFAULT 0)`);
    await pool.query("CREATE INDEX outbox_unprocessed_idx ON outbox_events (created_at) WHERE processed_at IS NULL");
    await pool.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]); await pool.query("COMMIT");
  } catch (error) { await pool.query("ROLLBACK"); throw error; }
}
