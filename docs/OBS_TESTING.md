# OBS Browser Source test protocol

## Status

**Blocked locally:** OBS is not installed in this environment, so no actual OBS Browser Source screenshot can honestly be supplied. The overlay endpoint is browser-tested only. Install OBS, then follow this exact test before beta.

## Reproduction

1. Run `make dev`.
2. In OBS, add Browser Source, 1280×720, URL `http://localhost:3000/overlay/demo-creator`, and enable transparent background.
3. In a separate browser, open `http://localhost:3000/support/demo-creator`.
4. Send ₹49, ₹499, ₹2,000, and ₹10,000; verify prominence is tasteful and readable.
5. Send a long message, emoji, Hindi (`भारत जीतेगा?`), Hinglish (`Aaj ka stream mast tha!`), then ten rapid messages.
6. Disable/re-enable the Browser Source, refresh it, and repeat a message. Verify reconnect does not duplicate an interaction.
7. Save screenshots as `docs/screenshots/obs/<case>.png` with timestamp and OBS version.

Expected: transparent canvas, centered premium card, no clipping, automatic SSE reconnect, one display per interaction. Actual OBS compatibility and screenshots remain unverified until this procedure is executed.
