# Project Beam (codename)

An open, mock-first live-support interaction layer. The codename is configuration only; domain concepts use neutral names.

## Run locally

1. Install Node 22+.
2. Run `make dev`.
3. Open `http://localhost:3000/support/demo-creator` on a phone-sized browser window.
4. Select an amount, send support, then open `http://localhost:3000/overlay/demo-creator` in another window.

The local provider never moves money. It simulates a signed, verified payment event and exercises validation, deduplication, moderation fallback, priority calculation, queueing, SSE delivery, and the overlay.

See `PROGRESS.md` for what is built and what remains intentionally unverified.
