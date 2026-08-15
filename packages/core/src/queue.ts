import type { Interaction } from "./interaction.ts";

/** Aging adds one priority point/minute, preventing valid low-value interactions from starving. */
export function queueScore(item: Interaction, now = Date.now()) { return item.impact + Math.floor((now - item.receivedAt) / 60_000); }
export function nextInteraction(items: Interaction[], now = Date.now()) { return [...items].filter(i => i.state === "QUEUED").sort((a,b) => queueScore(b, now) - queueScore(a, now) || a.receivedAt - b.receivedAt)[0]; }
