import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import type { VerifiedPayment } from "../../payments/src/provider.ts";
import type { Interaction } from "../../core/src/interaction.ts";
import { migrate } from "./migrations.ts";

export class PostgresPaymentStore {
  private pool: Pool;
  constructor(pool: Pool) { this.pool = pool; }
  static fromEnvironment() { return new PostgresPaymentStore(new Pool({ connectionString: process.env.DATABASE_URL })); }
  async migrate() { await migrate(this.pool); }
  async recordVerifiedPayment(payment: VerifiedPayment, interaction: Interaction) {
    const client=await this.pool.connect(); await client.query("BEGIN");
    try {
      const event=await client.query("INSERT INTO external_events (id,provider,provider_event_id,payload) VALUES ($1,$2,$3,$4) ON CONFLICT (provider,provider_event_id) DO NOTHING RETURNING id",[randomUUID(),"stripe",payment.providerEventId,payment]);
      if (!event.rowCount) { await client.query("COMMIT"); return { created:false }; }
      await client.query("INSERT INTO interactions (id,creator_id,provider,provider_event_id,amount_minor,currency,supporter_name,message,state,impact,received_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,to_timestamp($11/1000.0))",[interaction.id,interaction.creatorId,"stripe",payment.providerEventId,interaction.amountMinor,interaction.currency,interaction.supporterName,interaction.message,interaction.state,interaction.impact,interaction.receivedAt]);
      await client.query("INSERT INTO outbox_events (id,topic,payload) VALUES ($1,$2,$3)",[randomUUID(),"interaction.queued",interaction]); await client.query("COMMIT"); return { created:true };
    } catch(error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  }
  /** At-least-once delivery: a crash before commit leaves rows pending; consumers deduplicate by interaction ID. */
  async drainOutbox(publish:(interaction:Interaction)=>Promise<void>) { const client=await this.pool.connect(); await client.query("BEGIN"); try { const rows=await client.query("SELECT id,payload FROM outbox_events WHERE processed_at IS NULL ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 50"); for(const row of rows.rows) { await publish(row.payload); await client.query("UPDATE outbox_events SET processed_at=now(),attempts=attempts+1 WHERE id=$1",[row.id]); } await client.query("COMMIT"); return rows.rowCount||0; } catch(error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); } }
  async close(){await this.pool.end();}
}
