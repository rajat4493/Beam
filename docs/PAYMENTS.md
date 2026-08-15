# Payments feasibility gate

**Decision: do not integrate a live PSP in Phase 1.** A mock adapter proves the product path without pretending that credentials, legal eligibility, commercial contracts, or sandbox behavior are complete. Beam must never receive fan funds, hold balances, or make creator payouts.

| Capability | Razorpay | Cashfree | Stripe Connect |
|---|---|---|---|
| Existing merchant authorizes app | Partner OAuth documentation exists; access requires partner eligibility | Platform merchant onboarding is documented; evidence found is platform-managed onboarding, not general merchant OAuth | Standard accounts support OAuth, subject to Connect availability/eligibility |
| Direct creator receipt model | **Needs commercial confirmation**. Route linked accounts/transfer model can put platform in payment flow | **Not recommended for V1**: Easy Split is platform payment then vendor split | Direct charges are documented as charges on connected account, but platform creates them and operational liability still needs review |
| Verified events | Payment/Route webhooks | Payment and platform webhooks | Account and payment webhooks |
| Revocation | Partner OAuth revocation webhook documented | Not verified as a self-service authorization revocation | OAuth deauthorization workflow documented |
| V1 recommendation | Investigate Partner OAuth with Razorpay directly; no implementation until written confirmation that creator-owned direct collection and event access are permitted | Do not select: split-after-payment conflicts with strict no-custody intent | Best documented global technical fit for direct charges, but do not select for India without availability, business, and liability review |

## Verified official facts

- Razorpay says webhooks notify server-to-server about payments; its Partner OAuth material describes consent and an `account.app.authorization_revoked` event. [Razorpay webhooks](https://razorpay.com/docs/webhooks/) and [Partner OAuth revocation](https://razorpay.com/docs/webhooks/partners/oauth/?preferred-country=IN).
- Razorpay Route documentation creates linked accounts and describes transfer events. This is not proof it meets Beam's no-custody policy. [Route linked accounts](https://razorpay.com/docs/api/payments/route/create-linked-account/?preferred-country=IN).
- Cashfree payment webhooks are signed and must be verified using the raw payload. Its Easy Split guide explicitly follows `Add Vendor → Create Order → Accept Payment → Split Payment`, so it is unsuitable without a confirmed structure that never places Beam in the money flow. [Cashfree webhooks](https://www.cashfree.com/docs/payments/webhooks) and [Easy Split](https://www.cashfree.com/docs/payments/split/recipes/split-a-payment).
- Stripe documents direct charges as charges on a connected account whose balance increases; it also notes platform visibility limits. Destination charges instead create a charge on the platform and are excluded by policy. [Stripe direct charges](https://docs.stripe.com/connect/direct-charges?platform=web&ui=embedded-form) and [destination charges](https://docs.stripe.com/connect/destination-charges?platform=android).

## Live-provider gate

Before selecting one adapter, obtain the provider's written confirmation of: account type and country support; existing-account authorization; webhook/event scope; revocation; whether funds ever settle to a platform balance; responsibility for refunds/disputes; partner program terms; and sandbox test credentials. Implement raw-body signature verification, provider event-id uniqueness, status reconciliation, and a revoke test. No live-provider claim is valid until those tests pass.
