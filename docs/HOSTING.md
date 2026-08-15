# Hosting recommendation

Start managed and simple: Vercel for web/API/edge delivery, a managed regional Postgres provider (for example Neon via Vercel Marketplace), and a durable queue with an explicit production readiness review. Vercel Functions scale managed HTTP workloads, while Vercel Queues provide at-least-once delivery and require idempotent consumers; the latter is currently documented as beta, so use it only after a production readiness evaluation or substitute a mature managed queue. [Functions](https://vercel.com/docs/functions), [Postgres integrations](https://vercel.com/docs/postgres), [Queues](https://vercel.com/docs/queues).

Keep data, workers, and functions in a region appropriate to the initial market and PSP latency. GitHub push should run lint/type/test, deploy preview, then staging; production promotion follows smoke tests. No Kubernetes or self-managed database is proposed.
