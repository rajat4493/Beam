import type { Pool } from "pg";

export async function migrate(pool: Pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const id = "001_payment_events_outbox";
  if (!(await pool.query("SELECT 1 FROM schema_migrations WHERE id=$1", [id])).rowCount) {
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
  const pilotId = "002_pilot_operations";
  if ((await pool.query("SELECT 1 FROM schema_migrations WHERE id=$1", [pilotId])).rowCount) return;
  await pool.query("BEGIN");
  try {
    await pool.query(`CREATE TABLE pilot_creators (
      id text PRIMARY KEY, name text NOT NULL, cohort text NOT NULL CHECK (cohort IN ('monetized','non_monetized')),
      stripe_account_id text, enabled boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now())`);
    await pool.query(`CREATE TABLE pilot_streams (
      id uuid PRIMARY KEY, creator_id text NOT NULL REFERENCES pilot_creators(id), title text NOT NULL,
      status text NOT NULL CHECK (status IN ('draft','ready','live','ended')) DEFAULT 'draft',
      native_superchat_count integer NOT NULL DEFAULT 0, native_superchat_amount_minor integer NOT NULL DEFAULT 0,
      native_superchat_currency char(3), created_at timestamptz NOT NULL DEFAULT now(), ended_at timestamptz)`);
    await pool.query(`CREATE TABLE pilot_events (
      id uuid PRIMARY KEY, creator_id text NOT NULL, stream_id uuid REFERENCES pilot_streams(id), event_type text NOT NULL,
      occurred_at timestamptz NOT NULL DEFAULT now(), device_type text, country text, currency char(3),
      amount_minor integer, payment_method_category text, checkout_duration_ms integer, failure_reason text,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb)`);
    await pool.query(`CREATE TABLE pilot_settings (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`);
    await pool.query("CREATE INDEX pilot_events_stream_idx ON pilot_events (stream_id, occurred_at)");
    await pool.query("INSERT INTO pilot_settings (key,value) VALUES ('safety','{\"paymentsEnabled\":true,\"interactionsEnabled\":true}'::jsonb) ON CONFLICT DO NOTHING");
    await pool.query("INSERT INTO schema_migrations (id) VALUES ($1)", [pilotId]); await pool.query("COMMIT");
  } catch (error) { await pool.query("ROLLBACK"); throw error; }
}
