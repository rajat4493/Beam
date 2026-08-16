# Hosting recommendation

For the controlled pilot, use a managed web service plus a separate always-on worker. The included `render.yaml` declares exactly those two services: a public web service with `/health`, and a background worker that drains the durable Neon outbox. Render supports a `worker` service type in Blueprints, and its web health checks can prevent traffic from reaching an unready deployment. [Render Blueprint reference](https://render.com/docs/blueprint-spec), [Render health checks](https://render.com/docs/health-checks).

## Staging deployment

1. In Render, create a Blueprint from this GitHub repository. It will detect `render.yaml` and create the web and worker services.
2. Set the same Neon `DATABASE_URL` on both services.
3. Deploy the web service once, copy its HTTPS URL, then set `APP_ORIGIN` to that URL on both services and redeploy both.
4. Generate distinct long values for `PILOT_ADMIN_TOKEN` and `OUTBOX_WORKER_TOKEN`. Put the latter on both services. Never put either token in browser code or Git.
5. Keep `PAYMENT_PROVIDER=mock` until mobile testing and Stripe production approval are complete. Add Stripe secrets only to the web service when the production gate is approved.
6. Confirm `/health`, open the creator pilot page, send a test alert, restart the worker, and verify an outbox event appears once in OBS.

Keep data, workers, and functions in a region appropriate to the initial market and PSP latency. No Kubernetes or self-managed database is proposed.
