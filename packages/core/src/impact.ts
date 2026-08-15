export type Impact = { score: number; durationSeconds: number; priority: number; ttsEligible: boolean };

/** Continuous logarithmic scale: high support matters without making low support invisible. */
export function calculateImpact(amountMinor: number, minimumMinor = 4900): Impact {
  if (!Number.isInteger(amountMinor) || amountMinor < minimumMinor) throw new Error("Amount is below the configured minimum");
  const score = Math.min(100, 20 + 20 * Math.log10(amountMinor / minimumMinor + 1));
  return { score, durationSeconds: Math.round(5 + score / 12), priority: score, ttsEligible: score >= 50 };
}
