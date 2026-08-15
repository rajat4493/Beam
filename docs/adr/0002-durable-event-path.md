# ADR 0002: Durable event path

**Status:** Accepted. Provider webhooks do minimum synchronous work: verify signature, persist idempotently, enqueue durably, acknowledge. Workers are at-least-once and use database uniqueness/state transitions to ensure exactly one paid interaction per successful provider event.
