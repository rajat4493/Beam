# Hosting recommendation

For a free self-test, the included `render.yaml` deploys only one free web service using mock payments. It uses a clearly labelled in-process auto-drain so the owner can test the hosted support page and OBS connection without paying for a worker. This is intentionally **not pilot-safe**: free instances can sleep and the outbox worker is not independent.

For the controlled real-viewer pilot, deploy a separate always-on worker using `npm run worker:start`. The worker code and token-protected internal delivery route are already included. Render supports a `worker` service type in Blueprints, and its web health checks can prevent traffic from reaching an unready deployment. [Render Blueprint reference](https://render.com/docs/blueprint-spec), [Render health checks](https://render.com/docs/health-checks).

## Staging deployment

1. In Render, create a Blueprint from this GitHub repository. It will detect `render.yaml` and create one free web service.
2. Set the Neon `DATABASE_URL` and a long `PILOT_ADMIN_TOKEN`.
3. Deploy once, copy its HTTPS URL, set `APP_ORIGIN` to that URL, then redeploy.
4. Confirm `/health`, open the creator pilot page, send a test alert, and verify the hosted alert in OBS.
5. Keep `PAYMENT_PROVIDER=mock`. Do not add production Stripe credentials at this stage.

Before real viewer testing, change the web to an always-on plan, add the separately deployed worker with the shared `OUTBOX_WORKER_TOKEN`, and repeat the recovery proof.

Keep data, workers, and functions in a region appropriate to the initial market and PSP latency. No Kubernetes or self-managed database is proposed.
