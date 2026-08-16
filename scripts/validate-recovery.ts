import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { PostgresPaymentStore } from "../packages/database/src/payment-store.ts";
import type { Interaction } from "../packages/core/src/interaction.ts";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const eventId = `recovery-check-${randomUUID()}`;
const interaction: Interaction = {
  id: randomUUID(), creatorId: "recovery-check", supporterName: "Recovery check",
  message: "Synthetic durability validation", amountMinor: 1, currency: "USD",
  state: "QUEUED", impact: 20, receivedAt: Date.now(), providerEventId: eventId,
};
const payment = { creatorId: interaction.creatorId, amountMinor: interaction.amountMinor, currency: interaction.currency, supporterName: interaction.supporterName, message: interaction.message, providerEventId: eventId, paidAt: interaction.receivedAt };
const store = PostgresPaymentStore.fromEnvironment();
const inspector = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  await store.migrate();
  // Empty unrelated committed deliveries without publishing them.
  await store.drainOutbox(async () => {});
  const first = await store.recordVerifiedPayment(payment, interaction);
  const duplicate = await store.recordVerifiedPayment(payment, interaction);
  if (!first.created || duplicate.created) throw new Error("Duplicate-event guard failed");

  await store.drainOutbox(async () => { throw new Error("simulated worker interruption"); }).then(
    () => { throw new Error("Interruption did not stop the worker"); },
    () => undefined,
  );
  const pending = await inspector.query("SELECT processed_at FROM outbox_events WHERE payload->>'id'=$1", [interaction.id]);
  if (pending.rowCount !== 1 || pending.rows[0].processed_at !== null) throw new Error("Outbox was not preserved after interruption");

  const delivered: string[] = [];
  await store.drainOutbox(async (item) => { delivered.push(item.id); });
  const complete = await inspector.query("SELECT processed_at FROM outbox_events WHERE payload->>'id'=$1", [interaction.id]);
  if (delivered.filter((id) => id === interaction.id).length !== 1 || !complete.rows[0]?.processed_at) throw new Error("Recovery delivery failed");

  console.log(JSON.stringify({ passed: true, duplicateRejected: true, interruptionRecovered: true, interactionId: interaction.id }));
} finally {
  await store.close();
  await inspector.end();
}
