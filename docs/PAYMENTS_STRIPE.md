# Stripe Connect direct-charge feasibility

Research date: 2026-08-16. Sources are current official Stripe documentation only.

| Requirement | Result | Evidence / decision |
|---|---|---|
| Existing creator connects a Stripe account | PARTIALLY SUPPORTED | Standard-account OAuth permits a Stripe user to connect, but Stripe recommends Connect Onboarding for new Standard integrations; read-write OAuth cannot connect Standard accounts controlled by another platform. |
| Creator retains Stripe Dashboard | SUPPORTED | Standard accounts have Stripe Dashboard access; choose Standard for creator control. |
| Stripe-hosted onboarding/KYC | SUPPORTED | Stripe-hosted Connect onboarding is recommended. KYC responsibility depends on configuration; Stripe collects it in normal Stripe-responsible configurations. |
| Payment is on creator account / creator merchant of record | SUPPORTED | Direct charges are created on the connected account; Stripe states the connected account must be merchant of record. |
| Creator receives balance / funds do not enter Beam | SUPPORTED | Direct-charge funds appear in the connected account balance, not platform balance. |
| Creator pays Stripe fees | SUPPORTED | Standard accounts use fee payer `account`; Stripe collects payment fees from the connected account. |
| Creator handles refunds/chargebacks | SUPPORTED for Standard direct charges | Standard/direct-charge accounts handle disputes; disputed funds and fees come from creator balance. |
| Beam creates a hosted payment session | SUPPORTED | A platform may create Checkout/direct charges authenticated with `Stripe-Account` for the connected account. |
| Beam observes/query direct charges | SUPPORTED WITH LIMITATION | Objects belong to the connected account; API reads must use `Stripe-Account`. Platform reporting is limited. |
| Verified payment webhooks | SUPPORTED | Use signed Stripe events, raw request body, and webhook secret; persist unique event IDs. |
| Metadata correlation | SUPPORTED | Metadata on Checkout/PaymentIntent carries neutral creator/message correlation, subject to Stripe metadata policy. |
| Revoke/disconnect | SUPPORTED | OAuth deauthorization endpoint exists; creator can disconnect. |
| No transaction fee | SUPPORTED | Omit `application_fee_amount`; monetize via SaaS subscription. |
| Optional application fee | SUPPORTED, NOT IMPLEMENTED | Direct charges may collect an application fee to platform balance. This changes commercial/tax analysis and is deliberately excluded from V1. |
| India creator + UPI | UNKNOWN / REQUIRES STRIPE CONFIRMATION | Connect country/cross-border availability is platform-country dependent, and payment-method availability has extra constraints. Do not infer Indian creator onboarding or UPI support from generic Connect documentation. |

## Configuration choice

For a technical sandbox validation, use **Stripe Connect Standard + direct charges + Stripe fee payer + no application fee**. This best preserves creator ownership, dashboard access, KYC collection, balance, refunds, and disputes. It is not a production approval.

## Adapter status

`StripePaymentProvider` is test-mode-only source code. It creates direct Checkout Sessions with the connected-account header, attaches neutral metadata, verifies Stripe-style HMAC webhook payloads, and provides connect/disconnect seams. It has not made a network request because test keys, a Connect platform client ID, and an endpoint are not available. Stripe's official SDK/signature helper should replace the compact verification implementation before production.

## India and alternative PSPs

- **Cashfree:** official Partner Platform OAuth explicitly lets a software partner obtain a merchant-authorized token, create orders/process payments on behalf of the business, check linking status, and unlink. The merchant account is distinct, but the public documentation does not unambiguously establish merchant-of-record/fund-settlement semantics for Beam's creator-support use case. **COMMERCIAL/API PARTNER CONFIRMATION REQUIRED.**
- **Razorpay:** Partner OAuth and webhooks are documented, but current public material reviewed does not establish that an independent existing creator account can authorize Beam to create/observe the desired direct payment while retaining all merchant ownership without a Route/marketplace settlement construct. **COMMERCIAL/API PARTNER CONFIRMATION REQUIRED.**

Official sources: [Stripe direct charges](https://docs.stripe.com/connect/direct-charges?platform=web&ui=embedded-form), [Stripe charge behavior](https://docs.stripe.com/connect/charges?locale=en-GB), [Standard OAuth](https://docs.stripe.com/connect/oauth-standard-accounts), [Stripe account configuration](https://docs.stripe.com/connect/accounts-v2/connected-account-configuration), [Cashfree OAuth](https://www.cashfree.com/docs/partners/embedded/oauth-flow), [Cashfree platform authentication](https://www.cashfree.com/docs/api-reference/authentication), [Razorpay Partner OAuth](https://razorpay.com/docs/webhooks/partners/oauth/?preferred-country=IN).
