# Progress

## Phase 0 — complete

- Empty workspace initialized as a modular TypeScript monorepo.
- Payment feasibility research recorded with official-source links.
- Architecture, data/event model, hosting recommendation, ADRs, test strategy and security baseline documented.

## Phase 1 — working local vertical slice

- Mobile support page, centralized branding, mock payment provider, verified-event simulation, idempotency store, deterministic moderation fallback, continuous impact engine, queue scoring, SSE overlay, and health endpoint.
- `npm test` verifies impact behavior, duplicate-event protection, starvation prevention, and state-machine validity.

## Phase 2 — core payment chain validated

- Neon Postgres migrations, transactional external-event deduplication, interaction writes, and an at-least-once outbox are live in the test environment.
- `npm test` passes 6/6. `npm run validate:recovery` ran against Neon on 2026-08-16: it rejected a duplicate, preserved an alert through a simulated worker interruption, then delivered it exactly once on recovery.
- Stripe Connect is configured for direct charges, with Stripe collecting seller processing fees and losses. A fresh connected-account PLN 100 test payment was created without an application fee or transfer.
- The same direct payment produced a signed `payment_intent.succeeded` event, was verified by Beam, durably recorded in Neon, drained from the outbox, and visibly displayed in real OBS Studio after a Browser Source reconnect.
- The local Stripe listener must be started with the Beam sandbox API key; a listener authenticated to another Stripe context will not receive the connected-account events.

## Intentionally not claimed as done

No live-money payment, YouTube OAuth, Redis, deployment, production authentication, external-provider certification, or real-device mobile return flow has been validated. This is a Stripe sandbox-only proof; secrets stay in ignored local environment files.

## Next phase

## Pilot experiment preparation — implemented, not yet live

- Pilot mode provides a creator supporter URL, QR code, OBS URL, pre-stream checklist, test interaction, and live health indication.
- Neon now stores pilot creators, streams, safety settings, and privacy-minimized funnel events. The internal dashboard calculates Beam payer/GMV totals, payment conversion, display success, manually-entered native Super Chat totals, and adoption shares by payer and GMV.
- Two cohorts are explicit: `monetized` and `non_monetized`; conclusions must remain separate.
- The emergency switch stops new payments and/or interaction generation while retaining verified payment events.
- The one-page owner process and provisional decision thresholds are in `docs/PILOT_OPERATING_GUIDE.md`.

## Pilot ready — no, pending operational validation

- Production payment-provider approval and a real creator-connected production account.
- A deployed HTTPS URL with protected internal pilot credentials; local URLs are not shareable with real viewers.
- A real iPhone and Android payment-and-return run, including return-to-YouTube measurement.
- A supervised independent outbox worker rather than the local drain endpoint.
- One creator’s completed pre-stream safety checklist and a controlled first stream.

## Free staging self-test — passed in part

- HTTPS staging is live at the owner-provided Render URL, with public supporter and OBS URLs generated correctly.
- Owner confirmed the hosted web and iPhone access tests worked on 2026-08-16.
- Hosted Stripe sandbox checkout was validated on iPhone: fan link → Stripe Checkout → signed connected-account webhook → Neon durable event/outbox → automatic drain → OBS alert. The Beam thank-you page and Return to YouTube control also worked.
- The first staged payment occurred before the free service's automatic drain was confirmed after redeploy. A subsequent payment, with the OBS source connected, appeared immediately. The outbox and OBS connection are therefore both validated for the current staging process.
- Android and any real-money/production-provider flow remain unverified.
# Founder Dogfood Mode (in progress)

- Public `/` landing page and creator dashboard added.
- Creator journey now has intended Google/YouTube OAuth and Stripe-hosted Connect handoff routes; credentials and redirect registration remain a one-time owner configuration gate.
- Dashboard supplies supporter URL, QR code, OBS source URL, test alert, OBS confirmation, and human-readable recent support.
- Fan page clearly labels sandbox mode and accepts any positive provider-valid amount.
- Not yet dogfood-complete: founder must personally run the full self-serve journey on deployed staging after Google OAuth and Stripe Connect OAuth are configured.
