# Architecture

The system is a modular monorepo with runtime boundaries: web/API, worker, and overlay; shared packages contain domain-only logic. A provider adapter owns all PSP differences. The payment path is: provider webhook → raw-body signature verification → transactional `external_events` insert (unique provider/event id) → outbox → worker → moderation (non-critical) → queue → realtime overlay.

The local demo preserves this shape in memory. Production replaces the store with PostgreSQL and an outbox publisher; Redis/queue loss must not erase payment records.

Correlation ID travels from external event through interaction and overlay delivery. Optional AI, analytics, email, and YouTube integrations consume events independently and cannot block payment acknowledgement.
