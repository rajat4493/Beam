# Test strategy

Current automated tests cover continuous impact scaling, duplicate-event idempotency, queue starvation prevention, and lifecycle transition rejection. Run `make test`.

Before beta: add Postgres transaction/outbox integration tests, raw-webhook signature fixtures, duplicate/late/out-of-order provider events, worker-restart recovery, Redis outage behavior, SSE reconnect/deduplication, full browser journeys on mobile and desktop, and OBS visual screenshots for amounts, long Unicode/Hindi text, bursts, and reduced motion. Record measured P50/P95/P99 instead of asserting a latency target.
