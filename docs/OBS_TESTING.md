# OBS Browser Source test protocol

## Status

**Validated in the local test environment on 2026-08-16:** OBS Studio 32.2.1 displayed an alert from a Stripe Connect direct charge after the Browser Source had reconnected. The source used `http://localhost:3000/overlay/demo-creator` at 1280×720. This is sandbox-only evidence, not production certification.

## Reproduction

1. Run `npm run dev`.
2. In OBS, add Browser Source, 1280×720, URL `http://localhost:3000/overlay/demo-creator`, and enable transparent background.
3. In a separate browser, open `http://localhost:3000/support/demo-creator`.
4. Send ₹49, ₹499, ₹2,000, and ₹10,000; verify prominence is tasteful and readable.
5. Send a long message, emoji, Hindi (`भारत जीतेगा?`), Hinglish (`Aaj ka stream mast tha!`), then ten rapid messages.
6. Disable/re-enable the Browser Source, refresh it, and repeat a message. Verify reconnect does not duplicate an interaction.
7. Save screenshots as `docs/screenshots/obs/<case>.png` with timestamp and OBS version.

Expected: transparent canvas, centered premium card, no clipping, automatic SSE reconnect, one display per interaction. Re-run and retain the complete matrix before beta; the single direct-charge/reconnect case above is the evidence currently recorded.
