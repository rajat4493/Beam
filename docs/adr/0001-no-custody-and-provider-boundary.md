# ADR 0001: No custody and provider boundary

**Status:** Accepted. Beam never holds fan funds, creator balances, payout instructions, cards, or UPI credentials. PSP-specific code stays behind `PaymentProvider`. Any provider model that charges a Beam/platform account first is rejected unless formal review proves it does not create custody or settlement responsibility.
