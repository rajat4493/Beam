# Data and event model

PostgreSQL is the planned source of truth. Core tables: `users`, `creators`, `creator_channels`, `payment_connections`, `supporters`, `creator_supporter_relationships`, `interactions`, `payment_references`, `external_events`, `processed_webhooks`, `moderation_results`, `overlay_configurations`, `audit_events`, `feature_flags`, and `outbox_events`.

Critical constraints/indexes: `external_events(provider, provider_event_id)` unique; `payment_references(provider, payment_id)` unique; interaction lookup by `(creator_id, state, received_at)`; supporter relationship unique by `(creator_id, supporter_id)`. Monetary amounts are integer minor units with ISO currency. No balances, payout records, cards, UPI credentials, or bank credentials belong in Beam.
