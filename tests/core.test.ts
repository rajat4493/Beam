import test from "node:test"; import assert from "node:assert/strict";
import { calculateImpact } from "../packages/core/src/impact.ts";
import { nextInteraction } from "../packages/core/src/queue.ts";
import { transition, type Interaction } from "../packages/core/src/interaction.ts";
import { EventStore } from "../packages/events/src/store.ts";
import { StripePaymentProvider } from "../packages/payments/src/stripe.ts";
import { createHmac } from "node:crypto";

test("impact scales continuously with diminishing returns",()=>{ const a=calculateImpact(4900), b=calculateImpact(490000); assert.ok(b.score>a.score); assert.ok(b.score<=100); assert.ok(b.score/a.score<5); });
test("duplicate payment event produces exactly one record",()=>{const s=new EventStore();assert.equal(s.recordEvent("evt_1"),true);assert.equal(s.recordEvent("evt_1"),false);});
test("aging lets an older low-value item win",()=>{const old={id:"a",creatorId:"c",supporterName:"a",message:"x",amountMinor:4900,currency:"INR",state:"QUEUED" as const,receivedAt:0,providerEventId:"a",impact:20};const newItem={...old,id:"b",providerEventId:"b",receivedAt:100*60_000,impact:90};assert.equal(nextInteraction([old,newItem],100*60_000)?.id,"a");});
test("invalid state transition is rejected",()=>{const i={} as Interaction;Object.assign(i,{state:"RECEIVED"});assert.throws(()=>transition(i,"DISPLAYED"));});
test("a Stripe signed completion event is accepted once and tampering is rejected",async()=>{const p=new StripePaymentProvider({secretKey:"sk_test_x",publishableKey:"pk_test_x",clientId:"ca_x",webhookSecret:"whsec_test",origin:"http://localhost:3000"});const raw=JSON.stringify({id:"evt_stripe_1",type:"checkout.session.completed",data:{object:{payment_status:"paid",amount_total:49900,currency:"inr",metadata:{creator_id:"c",supporter_name:"Niv",message:"Hello"}}}});const t="1700000000",signature=createHmac("sha256","whsec_test").update(`${t}.${raw}`).digest("hex");assert.equal((await p.handleWebhook(raw,{"stripe-signature":`t=${t},v1=${signature}`}))?.providerEventId,"evt_stripe_1");assert.equal(await p.handleWebhook(raw+"x",{"stripe-signature":`t=${t},v1=${signature}`}),null);});
test("1,000-event burst has no duplicate or lost event identifiers",()=>{const s=new EventStore();for(let n=0;n<1000;n++)assert.equal(s.recordEvent(`evt_${n}`),true);for(let n=0;n<1000;n++)assert.equal(s.recordEvent(`evt_${n}`),false);});
