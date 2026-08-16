# Founder Dogfood: Beam Sandbox

## You know nothing about how Beam is built. Open this URL.

Open the deployed Beam address in a normal browser: `https://beam-3jcv.onrender.com`.

Everything in this guide is **Stripe sandbox testing**. The yellow/red sandbox notice means no real money moves. Do not use this process for a real creator or a real payment.

## Before the first self-serve run (one-time owner setup)

These are platform-owner settings, not steps a creator performs. They are the only remaining gates before the public creator journey can be tested end-to-end:

1. In Google Cloud, create a Web OAuth client, enable **YouTube Data API v3**, and add this exact redirect URI:
   `https://beam-3jcv.onrender.com/auth/youtube/callback`
2. In Render, securely add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Add `GOOGLE_REDIRECT_URI` with the same URL above.
3. In Stripe sandbox Connect settings, register this redirect URI:
   `https://beam-3jcv.onrender.com/auth/stripe/callback`
4. In Render, securely add `STRIPE_CONNECT_CLIENT_ID`.
5. Redeploy the service once. Never put keys into the Beam website, source code, or a creator’s hands.

## Creator journey

1. Open Beam and select **Start earning**.
2. Sign in to Google and approve the read-only YouTube channel connection.
3. Beam returns to your creator dashboard and shows your channel name.
4. Select **Connect Stripe sandbox**. Complete Stripe’s own hosted Connect flow; Beam never asks for Stripe keys or bank details.
5. Back in Beam, copy your supporter link or scan its QR code on your phone.
6. In OBS, add **Browser Source**, paste the OBS address shown by Beam, set it to **1280 × 720**, and keep it visible.
7. Select **Send test alert**. If it appears in OBS, select **I saw it**. OBS changes to Connected and your dashboard is ready.

## Fan journey (on iPhone)

1. Open your YouTube video or stream, then open the Beam supporter link.
2. Enter any positive amount supported by the displayed sandbox currency.
3. Enter the message: `Great stream 🔥 नमस्ते`.
4. Select **Continue to secure payment** and complete Stripe’s sandbox Checkout.
5. Confirm Beam’s thank-you screen, then select **Return to YouTube**.
6. Look at OBS. The supporter interaction should appear once.
7. Refresh the creator dashboard. It should show the supporter, amount, message, received time, and payment state in plain language.

## Deliberate failure checks

- Enter `0` or a negative amount: Beam should ask for a positive amount.
- Cancel Stripe Checkout: Beam confirms no payment was made and offers Try again.
- Use an overly long message: the form stops at 280 characters.
- Refresh the OBS Browser Source, then Send test alert: the next alert should display.
- Repeat the same Stripe event: Beam records it once; a duplicate must not create a second alert.

## What to record

Write down the time you choose Start earning, the time you see OBS Connected, the number of taps that felt unnecessary, payment start/end time, and payment-to-OBS time. Note any moment you wondered what a label meant or whether the money was real. Repeat the fan test on Android when available.

## Important boundary

This is not complete until a founder can run all steps above without a terminal, API key, webhook setup, database action, or Codex intervention. If the YouTube or Stripe buttons say setup is unavailable, the one-time owner configuration above has not yet been completed.
