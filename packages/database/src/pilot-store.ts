import { randomUUID } from "node:crypto";
import { Pool } from "pg";

export type Cohort = "monetized" | "non_monetized";
export type PilotEvent = { creatorId:string; streamId?:string|null; eventType:string; deviceType?:string; country?:string; currency?:string; amountMinor?:number; paymentMethodCategory?:string; checkoutDurationMs?:number; failureReason?:string; metadata?:Record<string,unknown> };
export class PilotStore {
  private pool: Pool;
  constructor(pool: Pool) { this.pool=pool; }
  async ensureCreator(id:string,name:string="Creator Studio",cohort:Cohort="monetized") { await this.pool.query("INSERT INTO pilot_creators (id,name,cohort) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING",[id,name,cohort]); }
  async creator(id:string) { return (await this.pool.query("SELECT * FROM pilot_creators WHERE id=$1",[id])).rows[0] as any; }
  async setStripeAccount(id:string,accountId:string) { await this.pool.query("UPDATE pilot_creators SET stripe_account_id=$2 WHERE id=$1",[id,accountId]); }
  async record(e:PilotEvent) { await this.pool.query("INSERT INTO pilot_events (id,creator_id,stream_id,event_type,device_type,country,currency,amount_minor,payment_method_category,checkout_duration_ms,failure_reason,metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",[randomUUID(),e.creatorId,e.streamId||null,e.eventType,e.deviceType||null,e.country||null,e.currency||null,e.amountMinor||null,e.paymentMethodCategory||null,e.checkoutDurationMs||null,e.failureReason||null,e.metadata||{}]); }
  async safety() { return (await this.pool.query("SELECT value FROM pilot_settings WHERE key='safety'" )).rows[0]?.value || {paymentsEnabled:true,interactionsEnabled:true}; }
  async setSafety(value:{paymentsEnabled:boolean;interactionsEnabled:boolean}) { await this.pool.query("INSERT INTO pilot_settings (key,value,updated_at) VALUES ('safety',$1,now()) ON CONFLICT (key) DO UPDATE SET value=$1,updated_at=now()",[value]); }
  async createStream(creatorId:string,title:string) { const id=randomUUID(); await this.pool.query("INSERT INTO pilot_streams (id,creator_id,title) VALUES ($1,$2,$3)",[id,creatorId,title]); return id; }
  async stream(id:string) { return (await this.pool.query("SELECT * FROM pilot_streams WHERE id=$1",[id])).rows[0] as any; }
  async setStream(id:string,status:string,nativeCount:number,nativeAmountMinor:number,nativeCurrency?:string) { await this.pool.query("UPDATE pilot_streams SET status=$2,native_superchat_count=$3,native_superchat_amount_minor=$4,native_superchat_currency=$5,ended_at=CASE WHEN $2='ended' THEN now() ELSE ended_at END WHERE id=$1",[id,status,nativeCount,nativeAmountMinor,nativeCurrency||null]); }
  async dashboard(streamId:string) { const s=await this.stream(streamId); if(!s) return null; const r=await this.pool.query(`SELECT event_type,count(*)::int count,coalesce(sum(amount_minor),0)::int amount,coalesce(avg(checkout_duration_ms),0)::int avg_ms FROM pilot_events WHERE stream_id=$1 GROUP BY event_type`,[streamId]); const m=Object.fromEntries(r.rows.map(x=>[x.event_type,x])); const successes=m.payment_success?.count||0, starts=m.payment_started?.count||0, displayed=m.interaction_displayed?.count||0, beamAmount=m.payment_success?.amount||0, nativeCount=s.native_superchat_count||0, nativeAmount=s.native_superchat_amount_minor||0; return {stream:s,events:m,beam:{payers:successes,gmv:beamAmount,averagePayment:successes?Math.round(beamAmount/successes):0,paymentConversion:starts?successes/starts:null,displaySuccess:successes?displayed/successes:null},native:{payers:nativeCount,gmv:nativeAmount,currency:s.native_superchat_currency},adoption:{byPayers:(successes+nativeCount)?successes/(successes+nativeCount):null,byGmv:(beamAmount+nativeAmount)?beamAmount/(beamAmount+nativeAmount):null}}; }
}
