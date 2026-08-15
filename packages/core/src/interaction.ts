export const interactionStates = ["RECEIVED", "VERIFIED", "MODERATING", "APPROVED", "QUEUED", "DISPLAYING", "DISPLAYED", "REJECTED", "FAILED"] as const;
export type InteractionState = typeof interactionStates[number];
export type Interaction = { id: string; creatorId: string; supporterName: string; message: string; amountMinor: number; currency: string; state: InteractionState; receivedAt: number; providerEventId: string; impact: number };

const allowed: Record<InteractionState, InteractionState[]> = {
  RECEIVED: ["VERIFIED", "FAILED"], VERIFIED: ["MODERATING", "APPROVED", "FAILED"], MODERATING: ["APPROVED", "REJECTED", "FAILED"], APPROVED: ["QUEUED", "FAILED"], QUEUED: ["DISPLAYING", "FAILED"], DISPLAYING: ["DISPLAYED", "FAILED"], DISPLAYED: [], REJECTED: [], FAILED: []
};
export function transition(item: Interaction, next: InteractionState): Interaction { if (!allowed[item.state].includes(next)) throw new Error(`Invalid transition ${item.state} → ${next}`); return { ...item, state: next }; }
