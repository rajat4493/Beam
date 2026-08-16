# Owner guide

## What happens when a fan pays?

```text
Fan → creator's payment account → signed payment event → Beam records it once → queue → stream overlay
```

Beam is software above the payment provider. It does not hold a creator wallet, a creator balance, or fan payment credentials.

## Where does the money go?

In the intended Stripe direct-charge configuration, money lands in the creator's connected Stripe balance. Beam does not receive the payment. The creator is merchant of record and manages their Stripe Dashboard, refunds, and disputes.

## Why does Beam know it succeeded?

The provider sends a signed server-to-server event. Beam verifies the signature against the unmodified payload and stores the provider event ID once. A duplicate event cannot create another interaction.

## If Beam goes offline

The local demo queue is temporary. Production will first store verified events in PostgreSQL, so worker or realtime outages can recover from durable records. A fan may pay successfully even if the overlay is temporarily unavailable; the event must be reconciled after recovery.

## If AI goes offline

AI is optional. The deterministic safety fallback remains available and payment confirmation/queueing continue.

## If Stripe goes offline

New checkout creation or webhooks can be delayed. Beam must not claim payment success without a verified event or provider status reconciliation. Existing displayed interactions continue independently.
