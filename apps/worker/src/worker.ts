import { PostgresPaymentStore } from "../../../packages/database/src/payment-store.ts";

const intervalMs=Math.max(250,Number(process.env.OUTBOX_POLL_MS||1000));
const origin=process.env.APP_ORIGIN;
const token=process.env.OUTBOX_WORKER_TOKEN;
if(!process.env.DATABASE_URL||!origin||!token) throw new Error("DATABASE_URL, APP_ORIGIN, and OUTBOX_WORKER_TOKEN are required");
const store=PostgresPaymentStore.fromEnvironment();
await store.migrate();
let stopping=false, running=false;
async function tick(){if(running||stopping)return;running=true;try{await store.drainOutbox(async interaction=>{const res=await fetch(`${origin}/api/internal/deliver`,{method:"POST",headers:{"content-type":"application/json","x-outbox-worker-token":token!},body:JSON.stringify(interaction)});if(!res.ok)throw new Error(`Web delivery returned ${res.status}`);});}catch(error){console.error("outbox_delivery_failed",error instanceof Error?error.message:"unknown");}finally{running=false;}}
const timer=setInterval(tick,intervalMs);await tick();
async function stop(){stopping=true;clearInterval(timer);await store.close();process.exit(0);}
process.on("SIGINT",stop);process.on("SIGTERM",stop);
