export type Moderation = { approved: boolean; reason?: string; classification: "QUESTION"|"JOKE"|"OPINION"|"CHALLENGE"|"REQUEST"|"SUPPORT"|"OTHER" };
/** Deterministic local fallback; never blocks a verified interaction permanently. */
export function moderate(text: string): Moderation { const unsafe = /\b(kill yourself|doxx|credit card)\b/i.test(text); return { approved: !unsafe, reason: unsafe ? "Unsafe content" : undefined, classification: /\?/.test(text) ? "QUESTION" : "SUPPORT" }; }
