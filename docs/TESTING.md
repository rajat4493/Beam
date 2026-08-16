# Test strategy

Current automated tests cover continuous impact scaling, duplicate-event idempotency, queue starvation prevention, lifecycle transition rejection, Stripe-signature acceptance/rejection, and a 1,000-event burst. Run `npm test`.

`npm run validate:recovery` is an integration check against the configured Postgres database. Run it with the normal outbox worker stopped: it records a synthetic verified payment, proves a duplicate does not create a second record, simulates an outbox-worker interruption, and proves the pending alert is delivered exactly once on recovery. It does not use a payment provider or display an alert in OBS.

Before beta: add automated duplicate/late/out-of-order provider-event cases, an independently supervised worker, Redis outage behavior, full browser journeys on mobile and desktop, and OBS visual checks for amounts, long Unicode/Hindi text, bursts, and reduced motion. Record measured P50/P95/P99 instead of asserting a latency target.
