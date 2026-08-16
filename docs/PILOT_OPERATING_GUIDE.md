# Beam pilot operating guide

## Purpose

This pilot tests whether real livestream viewers choose Beam when YouTube Super Chat remains available. It does not validate the business until viewers make that choice.

## Before each stream

1. Open `/pilot/<creator-id>`.
2. Copy the supporter URL, share it in the YouTube description/pinned chat, and show its QR code where appropriate.
3. Add the listed `/overlay/<creator-id>` URL as an OBS Browser Source.
4. Complete the five-item checklist: YouTube, payments, OBS, support page, and a test alert.
5. Start a stream record in the internal pilot API/dashboard. Use cohort `monetized` only when native Super Chat is also available; otherwise use `non_monetized`.
6. If there is a serious fault, set both safety switches off. Successful verified payments remain recorded; no new checkout or interaction is silently discarded.

## Fan journey

YouTube → pinned/description Beam link → amount/message → provider checkout → success → return to YouTube. No fan account is required. The optional post-payment question must appear only after success.

## Neutral creator wording

“You can support through Super Chat or use the Beam link pinned in chat. Beam sends the support directly through my connected payment setup and puts your message on stream.”

## What Beam records

Per creator and stream: support page opens, amount selected, payment started/success/failed, interaction queued/displayed, device category, currency, amount, payment method category, checkout duration, and safe failure reason. It stores no card details or unnecessary payment data.

Enter native Super Chat payer count and gross amount after the stream. Keep the two cohorts separate.

## Decision thresholds for monetized creators

- Strong: Beam adoption ≥25% of paid supporters, payment success ≥90%, median mobile completion under about 20 seconds, creator wants to reuse it, and no serious reliability incident.
- Very strong: adoption ≥40%, repeat supporters appear, and creator naturally promotes Beam.
- Weak: adoption <10%, high abandonment, repeated explanation, or materially worse mobile flow.

Beam adoption is `Beam payers / (Beam payers + native Super Chat payers)`. Also calculate the same share by GMV. Treat manually entered YouTube data as lower-confidence than provider data.

## After each stream

1. Enter native Super Chat count/value and end the stream record.
2. Review payment conversion, display success, mobile breakdown, adoption by payer and GMV, plus failed payments.
3. Record the creator interview separately: setup ease, workflow impact, alert quality, fan comprehension, reuse/recommend intent, stopping conditions, pricing preference, and comfort directing fans outside YouTube.
