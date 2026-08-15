import test from "node:test"; import assert from "node:assert/strict";
import { calculateImpact } from "../packages/core/src/impact.ts";
import { nextInteraction } from "../packages/core/src/queue.ts";
import { transition, type Interaction } from "../packages/core/src/interaction.ts";
import { EventStore } from "../packages/events/src/store.ts";

test("impact scales continuously with diminishing returns",()=>{ const a=calculateImpact(4900), b=calculateImpact(490000); assert.ok(b.score>a.score); assert.ok(b.score<100); assert.ok(b.score/a.score<5); });
test("duplicate payment event produces exactly one record",()=>{const s=new EventStore();assert.equal(s.recordEvent("evt_1"),true);assert.equal(s.recordEvent("evt_1"),false);});
test("aging lets an older low-value item win",()=>{const old={id:"a",creatorId:"c",supporterName:"a",message:"x",amountMinor:4900,currency:"INR",state:"QUEUED" as const,receivedAt:0,providerEventId:"a",impact:20};const newItem={...old,id:"b",providerEventId:"b",receivedAt:100*60_000,impact:90};assert.equal(nextInteraction([old,newItem],100*60_000)?.id,"a");});
test("invalid state transition is rejected",()=>{const i={} as Interaction;Object.assign(i,{state:"RECEIVED"});assert.throws(()=>transition(i,"DISPLAYED"));});
